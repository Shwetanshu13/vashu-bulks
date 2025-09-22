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

export const mealAPI = {
    async createMeal(mealData) {
        const response = await fetch(`${API_BASE_URL}/api/meals`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(mealData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to create meal');
        }

        return data;
    },

    async getMeals(params = {}) {
        const queryParams = new URLSearchParams(params).toString();
        const url = `${API_BASE_URL}/api/meals${queryParams ? `?${queryParams}` : ''}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch meals');
        }

        return data;
    },

    async getMealById(id) {
        const response = await fetch(`${API_BASE_URL}/api/meals/${id}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch meal');
        }

        return data;
    },

    async updateMeal(id, mealData) {
        const response = await fetch(`${API_BASE_URL}/api/meals/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(mealData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to update meal');
        }

        return data;
    },

    async deleteMeal(id) {
        const response = await fetch(`${API_BASE_URL}/api/meals/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to delete meal');
        }

        return data;
    },
};

// Validation utilities for meal data
export const validateMealData = (mealData) => {
    const errors = {};

    if (!mealData.mealName || mealData.mealName.trim().length === 0) {
        errors.mealName = 'Meal name is required';
    }

    if (!mealData.mealTime) {
        errors.mealTime = 'Meal time is required';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

export const validateNutritionData = (nutritionData) => {
    const errors = {};

    if (nutritionData.calories !== undefined && nutritionData.calories < 0) {
        errors.calories = 'Calories cannot be negative';
    }

    if (nutritionData.protein !== undefined && nutritionData.protein < 0) {
        errors.protein = 'Protein cannot be negative';
    }

    if (nutritionData.carbohydrates !== undefined && nutritionData.carbohydrates < 0) {
        errors.carbohydrates = 'Carbohydrates cannot be negative';
    }

    if (nutritionData.fats !== undefined && nutritionData.fats < 0) {
        errors.fats = 'Fats cannot be negative';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

// Utility functions for meal data formatting
export const formatMealTime = (mealTime) => {
    return new Date(mealTime).toISOString();
};

export const formatMealTimeForDisplay = (mealTime) => {
    return new Date(mealTime).toLocaleString();
};

export const formatDateForInput = (date) => {
    return new Date(date).toISOString().slice(0, 16);
};