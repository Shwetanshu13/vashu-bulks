'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '../../../components/ProtectedRoute';
import Header from '../../../components/Header';
import Button from '../../../components/auth/Button';
import Alert from '../../../components/auth/Alert';
import MealForm from '../../../components/meals/MealForm';
import { mealAPI } from '../../../utils/meals';

export default function AddMealPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const handleSubmit = async (mealData) => {
        try {
            setLoading(true);
            const result = await mealAPI.createMeal(mealData);

            setAlert({
                type: 'success',
                message: result.message
            });

            // Redirect to meal detail page after successful creation
            setTimeout(() => {
                router.push(`/meals/${result.meal.id}`);
            }, 2000);

        } catch (error) {
            setAlert({
                type: 'error',
                message: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Header />

                <main className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Add New Meal
                            </h1>
                            <Link href="/meals">
                                <Button variant="outline">
                                    Cancel
                                </Button>
                            </Link>
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

                        {/* Meal Form */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <MealForm
                                onSubmit={handleSubmit}
                                loading={loading}
                                submitText="Create Meal"
                                includeNutrition={true}
                            />
                        </div>

                        {/* Help Text */}
                        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
                            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                                Tips for adding meals:
                            </h3>
                            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                                <li>• Use descriptive meal names like "Grilled Chicken Salad" or "Morning Oatmeal"</li>
                                <li>• Set the meal time to when you actually ate or plan to eat</li>
                                <li>• Nutrition information is optional but helps track your daily intake</li>
                                <li>• You can always add or edit nutrition data later from the meal details page</li>
                            </ul>
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}