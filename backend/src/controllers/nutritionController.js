import { eq, and, desc, sum, sql } from 'drizzle-orm';
import db from '../db/index.js';
import { meals, nutrients } from '../db/schema.js';

export const addNutrition = async (req, res) => {
    try {
        const { mealId } = req.params;
        const { calories, protein, carbohydrates, fats } = req.body;
        const userId = req.user.id;

        // Validate input
        if (calories === undefined || protein === undefined || carbohydrates === undefined || fats === undefined) {
            return res.status(400).json({
                success: false,
                message: 'All nutrition values (calories, protein, carbohydrates, fats) are required'
            });
        }

        if (calories < 0 || protein < 0 || carbohydrates < 0 || fats < 0) {
            return res.status(400).json({
                success: false,
                message: 'Nutrition values cannot be negative'
            });
        }

        // Check if meal exists and belongs to user
        const meal = await db
            .select()
            .from(meals)
            .where(and(eq(meals.id, parseInt(mealId)), eq(meals.userId, userId)))
            .limit(1);

        if (meal.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Meal not found'
            });
        }

        // Check if nutrition data already exists for this meal
        const existingNutrition = await db
            .select()
            .from(nutrients)
            .where(eq(nutrients.mealId, parseInt(mealId)))
            .limit(1);

        let nutritionRecord;

        if (existingNutrition.length > 0) {
            // Update existing nutrition data
            nutritionRecord = await db
                .update(nutrients)
                .set({
                    calories: parseInt(calories),
                    protein: parseInt(protein),
                    carbohydrates: parseInt(carbohydrates),
                    fats: parseInt(fats)
                })
                .where(eq(nutrients.mealId, parseInt(mealId)))
                .returning();
        } else {
            // Create new nutrition record
            nutritionRecord = await db
                .insert(nutrients)
                .values({
                    mealId: parseInt(mealId),
                    calories: parseInt(calories),
                    protein: parseInt(protein),
                    carbohydrates: parseInt(carbohydrates),
                    fats: parseInt(fats)
                })
                .returning();
        }

        res.status(201).json({
            success: true,
            message: 'Nutrition data saved successfully',
            nutrition: nutritionRecord[0]
        });

    } catch (error) {
        console.error('Add nutrition error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const getNutrition = async (req, res) => {
    try {
        const { mealId } = req.params;
        const userId = req.user.id;

        // Check if meal exists and belongs to user
        const meal = await db
            .select()
            .from(meals)
            .where(and(eq(meals.id, parseInt(mealId)), eq(meals.userId, userId)))
            .limit(1);

        if (meal.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Meal not found'
            });
        }

        // Get nutrition data
        const nutrition = await db
            .select()
            .from(nutrients)
            .where(eq(nutrients.mealId, parseInt(mealId)))
            .limit(1);

        if (nutrition.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No nutrition data found for this meal'
            });
        }

        res.json({
            success: true,
            nutrition: nutrition[0]
        });

    } catch (error) {
        console.error('Get nutrition error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const updateNutrition = async (req, res) => {
    try {
        const { id } = req.params;
        const { calories, protein, carbohydrates, fats } = req.body;
        const userId = req.user.id;

        // Validate nutrition values if provided
        if (calories !== undefined && calories < 0) {
            return res.status(400).json({
                success: false,
                message: 'Calories cannot be negative'
            });
        }
        if (protein !== undefined && protein < 0) {
            return res.status(400).json({
                success: false,
                message: 'Protein cannot be negative'
            });
        }
        if (carbohydrates !== undefined && carbohydrates < 0) {
            return res.status(400).json({
                success: false,
                message: 'Carbohydrates cannot be negative'
            });
        }
        if (fats !== undefined && fats < 0) {
            return res.status(400).json({
                success: false,
                message: 'Fats cannot be negative'
            });
        }

        // Check if nutrition record exists and belongs to user's meal
        const nutritionWithMeal = await db
            .select({
                nutrition: nutrients,
                meal: meals
            })
            .from(nutrients)
            .innerJoin(meals, eq(nutrients.mealId, meals.id))
            .where(and(eq(nutrients.id, parseInt(id)), eq(meals.userId, userId)))
            .limit(1);

        if (nutritionWithMeal.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Nutrition record not found'
            });
        }

        // Update nutrition data
        const updatedNutrition = await db
            .update(nutrients)
            .set({
                ...(calories !== undefined && { calories: parseInt(calories) }),
                ...(protein !== undefined && { protein: parseInt(protein) }),
                ...(carbohydrates !== undefined && { carbohydrates: parseInt(carbohydrates) }),
                ...(fats !== undefined && { fats: parseInt(fats) })
            })
            .where(eq(nutrients.id, parseInt(id)))
            .returning();

        res.json({
            success: true,
            message: 'Nutrition data updated successfully',
            nutrition: updatedNutrition[0]
        });

    } catch (error) {
        console.error('Update nutrition error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const deleteNutrition = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Check if nutrition record exists and belongs to user's meal
        const nutritionWithMeal = await db
            .select({
                nutrition: nutrients,
                meal: meals
            })
            .from(nutrients)
            .innerJoin(meals, eq(nutrients.mealId, meals.id))
            .where(and(eq(nutrients.id, parseInt(id)), eq(meals.userId, userId)))
            .limit(1);

        if (nutritionWithMeal.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Nutrition record not found'
            });
        }

        // Delete nutrition record
        await db
            .delete(nutrients)
            .where(eq(nutrients.id, parseInt(id)));

        res.json({
            success: true,
            message: 'Nutrition data deleted successfully'
        });

    } catch (error) {
        console.error('Delete nutrition error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const getDailyNutritionSummary = async (req, res) => {
    try {
        const { date } = req.query;
        const userId = req.user.id;

        if (!date) {
            return res.status(400).json({
                success: false,
                message: 'Date parameter is required (YYYY-MM-DD format)'
            });
        }
        const targetDate = new Date(date);
        const nextDay = new Date(targetDate);
        nextDay.setDate(nextDay.getDate() + 1);
        console.log(targetDate, nextDay);

        // Get daily nutrition summary
        const summary = await db
            .select({
                totalCalories: sum(nutrients.calories),
                totalProtein: sum(nutrients.protein),
                totalCarbohydrates: sum(nutrients.carbohydrates),
                totalFats: sum(nutrients.fats),
                mealCount: sql`count(distinct ${meals.id})`
            })
            .from(meals)
            .innerJoin(nutrients, eq(meals.id, nutrients.mealId))
            .where(
                and(
                    eq(meals.userId, userId),
                    sql`${meals.mealTime} >= ${targetDate}`,
                    sql`${meals.mealTime} < ${nextDay}`
                )
            );
        console.log(summary);

        res.json({
            success: true,
            date,
            summary: {
                totalCalories: summary[0].totalCalories || 0,
                totalProtein: summary[0].totalProtein || 0,
                totalCarbohydrates: summary[0].totalCarbohydrates || 0,
                totalFats: summary[0].totalFats || 0,
                mealCount: summary[0].mealCount || 0
            }
        });

    } catch (error) {
        console.error('Get daily nutrition summary error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};