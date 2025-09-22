import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
    createMeal,
    getMeals,
    getMealById,
    updateMeal,
    deleteMeal
} from '../controllers/mealController.js';

const router = express.Router();

// All meal routes require authentication
router.use(authenticateToken);

// POST /api/meals - Create a new meal
router.post('/', createMeal);

// GET /api/meals - Get all meals for authenticated user
router.get('/', getMeals);

// GET /api/meals/:id - Get specific meal by ID
router.get('/:id', getMealById);

// PUT /api/meals/:id - Update specific meal
router.put('/:id', updateMeal);

// DELETE /api/meals/:id - Delete specific meal
router.delete('/:id', deleteMeal);

export default router;