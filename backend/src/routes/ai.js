import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
    createMealWithAI,
    getMealAnalysisStatus,
    retryMealAnalysis,
    getMealSuggestions
} from '../controllers/aiController.js';

const router = express.Router();

// All AI routes require authentication
router.use(authenticateToken);

// POST /api/ai/analyze-meal - Create meal with AI analysis
router.post('/analyze-meal', createMealWithAI);

// GET /api/ai/meals/:id/status - Get AI analysis status for a meal
router.get('/meals/:id/status', getMealAnalysisStatus);

// POST /api/ai/meals/:id/retry - Retry AI analysis for a meal
router.post('/meals/:id/retry', retryMealAnalysis);

// GET /api/ai/suggestions - Get AI-powered meal suggestions
router.get('/suggestions', getMealSuggestions);

export default router;