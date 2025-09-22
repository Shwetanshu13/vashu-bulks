'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import Header from '../../components/Header';
import Button from '../../components/auth/Button';
import Input from '../../components/auth/Input';
import Alert from '../../components/auth/Alert';
import NutritionCard from '../../components/nutrition/NutritionCard';
import { nutritionAPI } from '../../utils/nutrition';

export default function NutritionPage() {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split('T')[0] // Today's date in YYYY-MM-DD format
    );

    useEffect(() => {
        fetchDailySummary();
    }, [selectedDate]);

    const fetchDailySummary = async () => {
        try {
            setLoading(true);
            const result = await nutritionAPI.getDailyNutritionSummary(selectedDate);
            console.log(result);
            setSummary(result.summary);
        } catch (error) {
            setAlert({
                type: 'error',
                message: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const goToToday = () => {
        setSelectedDate(new Date().toISOString().split('T')[0]);
    };

    const navigateDate = (direction) => {
        const currentDate = new Date(selectedDate);
        currentDate.setDate(currentDate.getDate() + direction);
        setSelectedDate(currentDate.toISOString().split('T')[0]);
    };

    const formatDisplayDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Header />

                <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        {/* Header */}
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Nutrition Summary
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Track your daily nutrition intake and monitor your progress
                            </p>
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

                        {/* Date Navigation */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                                <div className="flex items-center space-x-4">
                                    <Button
                                        onClick={() => navigateDate(-1)}
                                        variant="outline"
                                        size="sm"
                                    >
                                        ← Previous Day
                                    </Button>

                                    <div className="text-center">
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {formatDisplayDate(selectedDate)}
                                        </h2>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {new Date(selectedDate).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <Button
                                        onClick={() => navigateDate(1)}
                                        variant="outline"
                                        size="sm"
                                    >
                                        Next Day →
                                    </Button>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <Input
                                        label=""
                                        name="date"
                                        type="date"
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        className="w-auto"
                                    />
                                    <Button
                                        onClick={goToToday}
                                        variant="primary"
                                        size="sm"
                                    >
                                        Today
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Summary Content */}
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600 dark:text-gray-400">Loading nutrition summary...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Nutrition Summary Card */}
                                <div>
                                    <NutritionCard
                                        nutrition={summary}
                                        title="Daily Nutrition Summary"
                                    />
                                </div>

                                {/* Additional Stats */}
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Daily Stats
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 dark:text-gray-400">
                                                Total Meals
                                            </span>
                                            <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {summary?.mealCount || 0}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 dark:text-gray-400">
                                                Average Calories per Meal
                                            </span>
                                            <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {summary?.mealCount > 0
                                                    ? Math.round((summary?.totalCalories || 0) / summary.mealCount)
                                                    : 0
                                                }
                                            </span>
                                        </div>

                                        <hr className="border-gray-200 dark:border-gray-700" />

                                        <div className="text-center">
                                            {summary?.mealCount === 0 ? (
                                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                                    No meals recorded for this date
                                                </p>
                                            ) : (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                                    You've logged {summary?.mealCount} meal{summary?.mealCount !== 1 ? 's' : ''} today
                                                </p>
                                            )}

                                            <Button
                                                onClick={() => window.location.href = '/meals/add'}
                                                variant="primary"
                                                className="w-full"
                                            >
                                                Add New Meal
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Quick Tips */}
                        <div className="mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
                            <h3 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                                Nutrition Tips:
                            </h3>
                            <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                                <li>• Aim for a balanced intake of protein, carbohydrates, and healthy fats</li>
                                <li>• Track your meals consistently to identify eating patterns</li>
                                <li>• Use the meal details page to add or edit nutrition information</li>
                                <li>• Monitor your daily totals to stay within your nutritional goals</li>
                            </ul>
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}