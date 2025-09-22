import { eq, and } from 'drizzle-orm';
import db from '../db/index.js';
import { meals } from '../db/schema.js';
import { aiQueue } from '../lib/queue.js';
import { generateMealSuggestions } from '../lib/aiService.js';

export const createMealWithAI = async (req, res) => {
    try {
        const { description, mealTime, mealName } = req.body;
        const userId = req.user.id;

        // Validate input
        if (!description || !description.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Meal description is required'
            });
        }

        if (!mealTime) {
            return res.status(400).json({
                success: false,
                message: 'Meal time is required'
            });
        }

        // Create meal with initial data
        const newMeal = await db.insert(meals).values({
            userId,
            mealName: mealName || 'AI Analyzed Meal',
            mealTime: new Date(mealTime),
            description: description.trim(),
            aiAnalysisStatus: 'pending'
        }).returning();

        // Queue AI analysis job
        await aiQueue.add('meal-analysis', {
            type: 'meal-analysis',
            data: {
                mealId: newMeal[0].id,
                description: description.trim(),
                mealName: mealName || '',
                mealTime: mealTime
            }
        }, {
            priority: 10, // High priority for user-initiated analysis
            delay: 1000   // Small delay to ensure meal is committed to DB
        });

        res.status(201).json({
            success: true,
            message: 'Meal created successfully. AI analysis is in progress.',
            meal: {
                ...newMeal[0],
                aiAnalysisStatus: 'pending'
            }
        });

    } catch (error) {
        console.error('Create meal with AI error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const getMealAnalysisStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const meal = await db
            .select({
                id: meals.id,
                mealName: meals.mealName,
                description: meals.description,
                aiAnalysisStatus: meals.aiAnalysisStatus,
                aiAnalysisResult: meals.aiAnalysisResult,
                mealTime: meals.mealTime,
                createdAt: meals.createdAt
            })
            .from(meals)
            .where(and(eq(meals.id, parseInt(id)), eq(meals.userId, userId)))
            .limit(1);

        if (meal.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Meal not found'
            });
        }

        const mealData = meal[0];
        let analysisResult = null;

        // Parse AI analysis result if available
        if (mealData.aiAnalysisResult) {
            try {
                analysisResult = JSON.parse(mealData.aiAnalysisResult);
            } catch (error) {
                console.error('Failed to parse AI analysis result:', error);
            }
        }

        res.json({
            success: true,
            meal: {
                ...mealData,
                aiAnalysisResult: analysisResult
            }
        });

    } catch (error) {
        console.error('Get meal analysis status error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const retryMealAnalysis = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Check if meal exists and belongs to user
        const meal = await db
            .select()
            .from(meals)
            .where(and(eq(meals.id, parseInt(id)), eq(meals.userId, userId)))
            .limit(1);

        if (meal.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Meal not found'
            });
        }

        const mealData = meal[0];

        // Check if meal has a description for analysis
        if (!mealData.description) {
            return res.status(400).json({
                success: false,
                message: 'Cannot retry analysis: meal has no description'
            });
        }

        // Reset analysis status
        await db.update(meals)
            .set({
                aiAnalysisStatus: 'pending',
                aiAnalysisResult: null
            })
            .where(eq(meals.id, parseInt(id)));

        // Queue new AI analysis job
        await aiQueue.add('meal-analysis', {
            type: 'meal-analysis',
            data: {
                mealId: parseInt(id),
                description: mealData.description,
                mealName: mealData.mealName,
                mealTime: mealData.mealTime.toISOString()
            }
        }, {
            priority: 15, // Higher priority for retry
            delay: 500
        });

        res.json({
            success: true,
            message: 'Meal analysis has been queued for retry'
        });

    } catch (error) {
        console.error('Retry meal analysis error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const getMealSuggestions = async (req, res) => {
    try {
        const {
            targetCalories = 2000,
            targetProtein = 150,
            targetCarbs = 250,
            targetFats = 65,
            date
        } = req.query;
        const userId = req.user.id;

        // Get user's meals for the specified date (or today)
        const targetDate = date ? new Date(date) : new Date();
        const nextDay = new Date(targetDate);
        nextDay.setDate(nextDay.getDate() + 1);

        const todaysMeals = await db
            .select({
                mealName: meals.mealName,
                description: meals.description,
                aiAnalysisResult: meals.aiAnalysisResult
            })
            .from(meals)
            .where(and(
                eq(meals.userId, userId),
                eq(meals.mealTime, targetDate)
            ));

        // Parse nutrition data from today's meals
        const previousMeals = todaysMeals.map(meal => {
            let nutrition = null;
            if (meal.aiAnalysisResult) {
                try {
                    const analysis = JSON.parse(meal.aiAnalysisResult);
                    nutrition = analysis.nutrition;
                } catch (error) {
                    console.error('Failed to parse meal analysis:', error);
                }
            }
            return {
                mealName: meal.mealName,
                description: meal.description,
                nutrition
            };
        }).filter(meal => meal.nutrition); // Only include meals with nutrition data

        // Define nutrition goals
        const nutritionGoals = {
            calories: parseInt(targetCalories),
            protein: parseInt(targetProtein),
            carbohydrates: parseInt(targetCarbs),
            fats: parseInt(targetFats)
        };

        // Generate AI meal suggestions
        const suggestions = await generateMealSuggestions(nutritionGoals, previousMeals);

        if (suggestions.success) {
            res.json({
                success: true,
                suggestions: suggestions.data.suggestions,
                remainingGoals: suggestions.data.remainingGoals,
                currentIntake: previousMeals.reduce((total, meal) => {
                    if (meal.nutrition) {
                        total.calories += meal.nutrition.calories || 0;
                        total.protein += meal.nutrition.protein || 0;
                        total.carbohydrates += meal.nutrition.carbohydrates || 0;
                        total.fats += meal.nutrition.fats || 0;
                    }
                    return total;
                }, { calories: 0, protein: 0, carbohydrates: 0, fats: 0 })
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to generate meal suggestions',
                error: suggestions.error
            });
        }

    } catch (error) {
        console.error('Get meal suggestions error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};