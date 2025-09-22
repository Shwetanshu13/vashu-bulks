import { tokenUtils } from './auth.js';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = tokenUtils.getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };
};

export const aiAPI = {
    async createMealWithAI(mealData) {
        const response = await fetch(`${API_BASE_URL}/api/ai/analyze-meal`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(mealData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to create meal with AI analysis');
        }

        return data;
    },

    async getMealAnalysisStatus(mealId) {
        const response = await fetch(`${API_BASE_URL}/api/ai/meals/${mealId}/status`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch meal analysis status');
        }

        return data;
    },

    async retryMealAnalysis(mealId) {
        const response = await fetch(`${API_BASE_URL}/api/ai/meals/${mealId}/retry`, {
            method: 'POST',
            headers: getAuthHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to retry meal analysis');
        }

        return data;
    },

    async getMealSuggestions(params = {}) {
        const queryParams = new URLSearchParams(params).toString();
        const url = `${API_BASE_URL}/api/ai/suggestions${queryParams ? `?${queryParams}` : ''}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch meal suggestions');
        }

        return data;
    },
};

// Validation utilities for AI meal data
export const validateAIMealData = (mealData) => {
    const errors = {};

    if (!mealData.description || mealData.description.trim().length === 0) {
        errors.description = 'Meal description is required';
    } else if (mealData.description.trim().length < 10) {
        errors.description = 'Please provide a more detailed description (at least 10 characters)';
    }

    if (!mealData.mealTime) {
        errors.mealTime = 'Meal time is required';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

export const validateSuggestionParams = (params) => {
    const errors = {};

    if (params.targetCalories && (params.targetCalories < 1000 || params.targetCalories > 5000)) {
        errors.targetCalories = 'Target calories should be between 1000 and 5000';
    }

    if (params.targetProtein && (params.targetProtein < 50 || params.targetProtein > 300)) {
        errors.targetProtein = 'Target protein should be between 50 and 300 grams';
    }

    if (params.targetCarbs && (params.targetCarbs < 100 || params.targetCarbs > 500)) {
        errors.targetCarbs = 'Target carbohydrates should be between 100 and 500 grams';
    }

    if (params.targetFats && (params.targetFats < 30 || params.targetFats > 150)) {
        errors.targetFats = 'Target fats should be between 30 and 150 grams';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

// Utility functions for AI analysis
export const getAnalysisStatusText = (status) => {
    switch (status) {
        case 'pending':
            return 'AI analysis in progress...';
        case 'completed':
            return 'Analysis completed';
        case 'failed':
            return 'Analysis failed';
        default:
            return 'Unknown status';
    }
};

export const getAnalysisStatusColor = (status) => {
    switch (status) {
        case 'pending':
            return 'blue';
        case 'completed':
            return 'green';
        case 'failed':
            return 'red';
        default:
            return 'gray';
    }
};

export const formatDateForAPI = (date) => {
    return new Date(date).toISOString().split('T')[0]; // YYYY-MM-DD format
};

// Default nutrition goals
export const DEFAULT_NUTRITION_GOALS = {
    targetCalories: 2000,
    targetProtein: 150,
    targetCarbs: 250,
    targetFats: 65,
};

// Legacy wrapper for backward compatibility
export const analyzeMeal = async (input) => {
    let mealData;

    // Handle both string input (legacy) and object input (new)
    if (typeof input === 'string') {
        // Legacy usage: analyzeMeal("description string")
        if (!input || input.trim().length === 0) {
            throw new Error('Meal description is required');
        }

        mealData = {
            description: input.trim(),
            mealTime: 'other',
            date: new Date().toISOString().split('T')[0],
        };
    } else if (typeof input === 'object' && input !== null) {
        // New usage: analyzeMeal({ description, mealName, mealTime })
        if (!input.description || typeof input.description !== 'string' || input.description.trim().length === 0) {
            throw new Error('Meal description is required');
        }

        mealData = {
            description: input.description.trim(),
            mealName: input.mealName?.trim() || undefined,
            mealTime: input.mealTime || 'other',
            date: input.date || new Date().toISOString().split('T')[0],
        };
    } else {
        throw new Error('Invalid input: expected string or object with description');
    }

    return await aiAPI.createMealWithAI(mealData);
};