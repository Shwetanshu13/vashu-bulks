import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
    addNutrition,
    getNutrition,
    updateNutrition,
    deleteNutrition,
    getDailyNutritionSummary
} from '../controllers/nutritionController.js';

const router = express.Router();

// All nutrition routes require authentication
router.use(authenticateToken);

// GET /api/nutrition/summary - Get daily nutrition summary
router.get('/summary', getDailyNutritionSummary);

// POST /api/nutrition/meals/:mealId - Add/update nutrition data for a meal
router.post('/meals/:mealId', addNutrition);

// GET /api/nutrition/meals/:mealId - Get nutrition data for a meal
router.get('/meals/:mealId', getNutrition);

// PUT /api/nutrition/:id - Update specific nutrition record
router.put('/:id', updateNutrition);

// DELETE /api/nutrition/:id - Delete specific nutrition record
router.delete('/:id', deleteNutrition);

export default router;