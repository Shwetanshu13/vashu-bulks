'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '../../../components/ProtectedRoute';
import Header from '../../../components/Header';
import Button from '../../../components/auth/Button';
import Alert from '../../../components/auth/Alert';
import NutritionCard from '../../../components/nutrition/NutritionCard';
import NutritionForm from '../../../components/nutrition/NutritionForm';
import { mealAPI } from '../../../utils/meals';
import { nutritionAPI } from '../../../utils/nutrition';
import { formatMealTimeForDisplay } from '../../../utils/meals';

export default function MealDetailPage() {
    const params = useParams();
    const router = useRouter();
    const mealId = params.id;

    const [meal, setMeal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [showNutritionForm, setShowNutritionForm] = useState(false);
    const [nutritionLoading, setNutritionLoading] = useState(false);

    const fetchMeal = useCallback(async () => {
        try {
            setLoading(true);
            const result = await mealAPI.getMealById(mealId);
            setMeal(result.meal);
        } catch (error) {
            setAlert({
                type: 'error',
                message: error.message
            });
        } finally {
            setLoading(false);
        }
    }, [mealId]);

    useEffect(() => {
        if (mealId) {
            fetchMeal();
        }
    }, [mealId, fetchMeal]);

    const handleDeleteMeal = async () => {
        if (window.confirm('Are you sure you want to delete this meal?')) {
            try {
                await mealAPI.deleteMeal(mealId);
                setAlert({
                    type: 'success',
                    message: 'Meal deleted successfully'
                });

                // Redirect to meals list after a delay
                setTimeout(() => {
                    router.push('/meals');
                }, 2000);
            } catch (error) {
                setAlert({
                    type: 'error',
                    message: error.message
                });
            }
        }
    };

    const handleNutritionSubmit = async (nutritionData) => {
        try {
            setNutritionLoading(true);

            if (meal.nutrition && meal.nutrition.id) {
                // Update existing nutrition
                await nutritionAPI.updateNutrition(meal.nutrition.id, nutritionData);
                setAlert({
                    type: 'success',
                    message: 'Nutrition data updated successfully'
                });
            } else {
                // Add new nutrition
                await nutritionAPI.addNutrition(mealId, nutritionData);
                setAlert({
                    type: 'success',
                    message: 'Nutrition data added successfully'
                });
            }

            // Refresh meal data
            await fetchMeal();
            setShowNutritionForm(false);
        } catch (error) {
            setAlert({
                type: 'error',
                message: error.message
            });
        } finally {
            setNutritionLoading(false);
        }
    };

    const handleDeleteNutrition = async () => {
        if (meal.nutrition && meal.nutrition.id) {
            if (window.confirm('Are you sure you want to delete the nutrition data?')) {
                try {
                    await nutritionAPI.deleteNutrition(meal.nutrition.id);
                    setAlert({
                        type: 'success',
                        message: 'Nutrition data deleted successfully'
                    });

                    // Refresh meal data
                    await fetchMeal();
                } catch (error) {
                    setAlert({
                        type: 'error',
                        message: error.message
                    });
                }
            }
        }
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                    <Header />
                    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600 dark:text-gray-400">Loading meal...</p>
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    if (!meal) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                    <Header />
                    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
                        <div className="text-center py-12">
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Meal not found
                            </p>
                            <Link href="/meals">
                                <Button variant="primary">
                                    Back to Meals
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Header />

                <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <Link href="/meals">
                                <Button variant="outline">
                                    ← Back to Meals
                                </Button>
                            </Link>
                            <div className="flex space-x-2">
                                <Button
                                    variant="danger"
                                    onClick={handleDeleteMeal}
                                >
                                    Delete Meal
                                </Button>
                            </div>
                        </div>

                        {alert && (
                            <div className="mb-6">
                                <Alert
                                    type={alert.type}
                                    message={alert.message}
                                    onClose={() => setAlert(null)}
                                />
                            </div>
                        )}

                        {/* Meal Information */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                {meal.mealName}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                {formatMealTimeForDisplay(meal.mealTime)}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-500">
                                Created: {new Date(meal.createdAt).toLocaleString()}
                            </p>
                        </div>

                        {/* Nutrition Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <NutritionCard
                                    nutrition={meal.nutrition}
                                    title="Nutrition Information"
                                />

                                <div className="mt-4 flex space-x-2">
                                    <Button
                                        onClick={() => setShowNutritionForm(!showNutritionForm)}
                                        variant="primary"
                                    >
                                        {meal.nutrition ? 'Edit Nutrition' : 'Add Nutrition'}
                                    </Button>

                                    {meal.nutrition && (
                                        <Button
                                            onClick={handleDeleteNutrition}
                                            variant="danger"
                                        >
                                            Delete Nutrition
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Nutrition Form */}
                            {showNutritionForm && (
                                <div>
                                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                            {meal.nutrition ? 'Edit Nutrition Data' : 'Add Nutrition Data'}
                                        </h3>

                                        <NutritionForm
                                            initialData={meal.nutrition}
                                            onSubmit={handleNutritionSubmit}
                                            loading={nutritionLoading}
                                            submitText={meal.nutrition ? 'Update Nutrition' : 'Add Nutrition'}
                                        />

                                        <div className="mt-4">
                                            <Button
                                                onClick={() => setShowNutritionForm(false)}
                                                variant="outline"
                                                className="w-full"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}