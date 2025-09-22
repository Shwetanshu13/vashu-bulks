import { eq, and, desc } from 'drizzle-orm';
import db from '../db/index.js';
import { meals, nutrients } from '../db/schema.js';

export const createMeal = async (req, res) => {
    try {
        const { mealName, mealTime, nutritionData } = req.body;
        const userId = req.user.id;

        // Validate input
        if (!mealName || !mealTime) {
            return res.status(400).json({
                success: false,
                message: 'Meal name and meal time are required'
            });
        }

        // Validate nutrition data if provided
        if (nutritionData) {
            const { calories, protein, carbohydrates, fats } = nutritionData;
            if (calories < 0 || protein < 0 || carbohydrates < 0 || fats < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Nutrition values cannot be negative'
                });
            }
        }

        // Create meal
        const newMeal = await db.insert(meals).values({
            userId,
            mealName,
            mealTime: new Date(mealTime)
        }).returning();

        // If nutrition data is provided, create nutrient record
        let nutrientRecord = null;
        if (nutritionData) {
            const { calories, protein, carbohydrates, fats } = nutritionData;
            nutrientRecord = await db.insert(nutrients).values({
                mealId: newMeal[0].id,
                calories: calories || 0,
                protein: protein || 0,
                carbohydrates: carbohydrates || 0,
                fats: fats || 0
            }).returning();
        }

        res.status(201).json({
            success: true,
            message: 'Meal created successfully',
            meal: {
                ...newMeal[0],
                nutrition: nutrientRecord ? nutrientRecord[0] : null
            }
        });

    } catch (error) {
        console.error('Create meal error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const getMeals = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10, startDate, endDate } = req.query;

        // Build query conditions
        let whereCondition = eq(meals.userId, userId);

        if (startDate && endDate) {
            whereCondition = and(
                whereCondition,
                and(
                    eq(meals.mealTime, new Date(startDate)),
                    eq(meals.mealTime, new Date(endDate))
                )
            );
        }

        // Get meals with nutrition data
        const userMeals = await db
            .select({
                id: meals.id,
                mealName: meals.mealName,
                mealTime: meals.mealTime,
                createdAt: meals.createdAt,
                nutrition: {
                    id: nutrients.id,
                    calories: nutrients.calories,
                    protein: nutrients.protein,
                    carbohydrates: nutrients.carbohydrates,
                    fats: nutrients.fats
                }
            })
            .from(meals)
            .leftJoin(nutrients, eq(meals.id, nutrients.mealId))
            .where(whereCondition)
            .orderBy(desc(meals.mealTime))
            .limit(parseInt(limit))
            .offset((parseInt(page) - 1) * parseInt(limit));

        res.json({
            success: true,
            meals: userMeals,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit)
            }
        });

    } catch (error) {
        console.error('Get meals error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const getMealById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const meal = await db
            .select({
                id: meals.id,
                mealName: meals.mealName,
                mealTime: meals.mealTime,
                createdAt: meals.createdAt,
                nutrition: {
                    id: nutrients.id,
                    calories: nutrients.calories,
                    protein: nutrients.protein,
                    carbohydrates: nutrients.carbohydrates,
                    fats: nutrients.fats
                }
            })
            .from(meals)
            .leftJoin(nutrients, eq(meals.id, nutrients.mealId))
            .where(and(eq(meals.id, parseInt(id)), eq(meals.userId, userId)))
            .limit(1);

        if (meal.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Meal not found'
            });
        }

        res.json({
            success: true,
            meal: meal[0]
        });

    } catch (error) {
        console.error('Get meal by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const updateMeal = async (req, res) => {
    try {
        const { id } = req.params;
        const { mealName, mealTime } = req.body;
        const userId = req.user.id;

        // Check if meal exists and belongs to user
        const existingMeal = await db
            .select()
            .from(meals)
            .where(and(eq(meals.id, parseInt(id)), eq(meals.userId, userId)))
            .limit(1);

        if (existingMeal.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Meal not found'
            });
        }

        // Update meal
        const updatedMeal = await db
            .update(meals)
            .set({
                ...(mealName && { mealName }),
                ...(mealTime && { mealTime: new Date(mealTime) })
            })
            .where(eq(meals.id, parseInt(id)))
            .returning();

        res.json({
            success: true,
            message: 'Meal updated successfully',
            meal: updatedMeal[0]
        });

    } catch (error) {
        console.error('Update meal error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const deleteMeal = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Check if meal exists and belongs to user
        const existingMeal = await db
            .select()
            .from(meals)
            .where(and(eq(meals.id, parseInt(id)), eq(meals.userId, userId)))
            .limit(1);

        if (existingMeal.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Meal not found'
            });
        }

        // Delete associated nutrients first
        await db
            .delete(nutrients)
            .where(eq(nutrients.mealId, parseInt(id)));

        // Delete meal
        await db
            .delete(meals)
            .where(eq(meals.id, parseInt(id)));

        res.json({
            success: true,
            message: 'Meal deleted successfully'
        });

    } catch (error) {
        console.error('Delete meal error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};