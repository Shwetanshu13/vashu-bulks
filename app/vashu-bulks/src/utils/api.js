import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import config from './config';

// Base API configuration
const API_BASE_URL = config.API_BASE_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        if (error.response?.status === 401) {
            await SecureStore.deleteItemAsync('authToken');
            // You might want to navigate to login screen here
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (email, password) =>
        api.post('/auth/login', { email, password }),

    signup: (userData) =>
        api.post('/auth/signup', userData),

    forgotPassword: (email) =>
        api.post('/auth/forgot-password', { email }),

    verifyEmail: (token) =>
        api.post('/auth/verify', { token }),

    verifyToken: (token) =>
        api.get('/auth/verify-token', {
            headers: { Authorization: `Bearer ${token}` }
        }),
};

// Meals API
export const mealsAPI = {
    getMeals: () =>
        api.get('/meals'),

    getMeal: (id) =>
        api.get(`/meals/${id}`),

    createMeal: (mealData) =>
        api.post('/meals', mealData),

    updateMeal: (id, mealData) =>
        api.put(`/meals/${id}`, mealData),

    deleteMeal: (id) =>
        api.delete(`/meals/${id}`),

    uploadMealImage: (imageData) => {
        const formData = new FormData();
        formData.append('image', {
            uri: imageData.uri,
            type: imageData.type || 'image/jpeg',
            name: imageData.fileName || 'meal.jpg',
        });
        return api.post('/meals/upload-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
};

// Nutrition API
export const nutritionAPI = {
    getNutritionData: () =>
        api.get('/nutrition'),

    addNutritionEntry: (nutritionData) =>
        api.post('/nutrition', nutritionData),

    updateNutritionEntry: (id, nutritionData) =>
        api.put(`/nutrition/${id}`, nutritionData),

    deleteNutritionEntry: (id) =>
        api.delete(`/nutrition/${id}`),

    getNutritionSummary: (startDate, endDate) =>
        api.get('/nutrition/summary', {
            params: { startDate, endDate }
        }),
};

// AI API
export const aiAPI = {
    analyzeMeal: (imageData) => {
        const formData = new FormData();
        formData.append('image', {
            uri: imageData.uri,
            type: imageData.type || 'image/jpeg',
            name: imageData.fileName || 'meal.jpg',
        });
        return api.post('/ai/analyze', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    getMealSuggestions: (preferences) =>
        api.post('/ai/suggestions', preferences),

    getAnalysisHistory: () =>
        api.get('/ai/analysis-history'),
};

export default api;