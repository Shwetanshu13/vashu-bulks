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

export const nutritionAPI = {
    async addNutrition(mealId, nutritionData) {
        const response = await fetch(`${API_BASE_URL}/api/nutrition/meals/${mealId}`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(nutritionData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to add nutrition data');
        }

        return data;
    },

    async getNutrition(mealId) {
        const response = await fetch(`${API_BASE_URL}/api/nutrition/meals/${mealId}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch nutrition data');
        }

        return data;
    },

    async updateNutrition(nutritionId, nutritionData) {
        const response = await fetch(`${API_BASE_URL}/api/nutrition/${nutritionId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(nutritionData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to update nutrition data');
        }

        return data;
    },

    async deleteNutrition(nutritionId) {
        const response = await fetch(`${API_BASE_URL}/api/nutrition/${nutritionId}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to delete nutrition data');
        }

        return data;
    },

    async getDailyNutritionSummary(date) {
        const response = await fetch(`${API_BASE_URL}/api/nutrition/summary?date=${date}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch daily nutrition summary');
        }

        return data;
    },
};

// Validation utilities for nutrition data
export const validateNutritionData = (nutritionData) => {
    const errors = {};

    if (nutritionData.calories === undefined || nutritionData.calories === '') {
        errors.calories = 'Calories is required';
    } else if (nutritionData.calories < 0) {
        errors.calories = 'Calories cannot be negative';
    }

    if (nutritionData.protein === undefined || nutritionData.protein === '') {
        errors.protein = 'Protein is required';
    } else if (nutritionData.protein < 0) {
        errors.protein = 'Protein cannot be negative';
    }

    if (nutritionData.carbohydrates === undefined || nutritionData.carbohydrates === '') {
        errors.carbohydrates = 'Carbohydrates is required';
    } else if (nutritionData.carbohydrates < 0) {
        errors.carbohydrates = 'Carbohydrates cannot be negative';
    }

    if (nutritionData.fats === undefined || nutritionData.fats === '') {
        errors.fats = 'Fats is required';
    } else if (nutritionData.fats < 0) {
        errors.fats = 'Fats cannot be negative';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

// Utility functions for nutrition calculations
export const calculateTotalCalories = (protein, carbohydrates, fats) => {
    // 1g protein = 4 calories, 1g carbs = 4 calories, 1g fat = 9 calories
    return (protein * 4) + (carbohydrates * 4) + (fats * 9);
};

export const formatNutritionValue = (value) => {
    return Math.round(value * 100) / 100; // Round to 2 decimal places
};

export const formatDateForAPI = (date) => {
    return new Date(date).toISOString().split('T')[0]; // YYYY-MM-DD format
};