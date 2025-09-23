'use client';

import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import Header from '../../components/Header';
import Button from '../../components/auth/Button';

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Header />

                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        {/* Welcome Section */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Welcome back, {user?.name}!
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Here&apos;s your nutrition tracking overview
                            </p>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <Link href="/meals/add" className="block">
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-blue-500">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                Add Meal
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                Log a new meal
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            <Link href="/meals" className="block">
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-green-500">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                View Meals
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                Browse your meals
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            <Link href="/nutrition" className="block">
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-purple-500">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                                            <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                Nutrition Summary
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                Track your intake
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            <Link href="/ai/analyze" className="block">
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-orange-500">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                                            <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                AI Analysis
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                Analyze your meals
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* AI Features Section */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 mb-8 border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center mb-4">
                                <div className="p-2 bg-blue-600 rounded-lg mr-3">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    AI-Powered Features
                                </h3>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 mb-6">
                                Leverage the power of AI to enhance your nutrition tracking experience with smart analysis and personalized suggestions.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center mb-3">
                                        <span className="text-2xl mr-2">🔍</span>
                                        <h4 className="font-medium text-gray-900 dark:text-white">
                                            Meal Analysis
                                        </h4>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                        Describe any meal in natural language and get instant nutritional analysis with calorie estimates and macro breakdowns.
                                    </p>
                                    <Link href="/ai/analyze">
                                        <Button variant="primary" size="sm">
                                            Try AI Analysis
                                        </Button>
                                    </Link>
                                </div>

                                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center mb-3">
                                        <span className="text-2xl mr-2">🍽️</span>
                                        <h4 className="font-medium text-gray-900 dark:text-white">
                                            Smart Suggestions
                                        </h4>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                        Get personalized meal recommendations based on your nutritional goals, dietary restrictions, and preferences.
                                    </p>
                                    <Link href="/ai/suggestions">
                                        <Button variant="outline" size="sm">
                                            Get Suggestions
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Getting Started */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Getting Started with YesChef
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                        1. Log Your First Meal
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                        Start by adding a meal you&apos;ve eaten today. Include the meal name, time, and nutrition information if available.
                                    </p>
                                    <Link href="/meals/add">
                                        <Button variant="primary" size="sm">
                                            Add Meal Now
                                        </Button>
                                    </Link>
                                </div>

                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                        2. Track Your Nutrition
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                        Monitor your daily calorie and macronutrient intake to stay on track with your health goals.
                                    </p>
                                    <Link href="/nutrition">
                                        <Button variant="outline" size="sm">
                                            View Summary
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}