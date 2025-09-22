'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';
import Header from '../../components/Header';
import Button from '../../components/auth/Button';
import Input from '../../components/auth/Input';
import Alert from '../../components/auth/Alert';
import MealCard from '../../components/meals/MealCard';
import { mealAPI } from '../../utils/meals';

export default function MealsPage() {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 10 });
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
    });

    useEffect(() => {
        fetchMeals();
    }, [pagination.page, filters]);

    const fetchMeals = async () => {
        try {
            setLoading(true);
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                ...(filters.startDate && { startDate: filters.startDate }),
                ...(filters.endDate && { endDate: filters.endDate }),
            };

            const result = await mealAPI.getMeals(params);
            setMeals(result.meals);
            setPagination(prev => ({ ...prev, ...result.pagination }));
        } catch (error) {
            setAlert({
                type: 'error',
                message: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMeal = async (mealId) => {
        try {
            await mealAPI.deleteMeal(mealId);
            setAlert({
                type: 'success',
                message: 'Meal deleted successfully'
            });

            // Remove meal from local state
            setMeals(prev => prev.filter(meal => meal.id !== mealId));
        } catch (error) {
            setAlert({
                type: 'error',
                message: error.message
            });
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
        setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
    };

    const clearFilters = () => {
        setFilters({
            startDate: '',
            endDate: '',
        });
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Header />

                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                My Meals
                            </h1>
                            <Link href="/meals/add">
                                <Button variant="primary">
                                    Add New Meal
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

                        {/* Filters */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                Filter Meals
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Input
                                    label="Start Date"
                                    name="startDate"
                                    type="date"
                                    value={filters.startDate}
                                    onChange={handleFilterChange}
                                />
                                <Input
                                    label="End Date"
                                    name="endDate"
                                    type="date"
                                    value={filters.endDate}
                                    onChange={handleFilterChange}
                                />
                                <div className="flex items-end">
                                    <Button
                                        onClick={clearFilters}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        Clear Filters
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Meals List */}
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600 dark:text-gray-400">Loading meals...</p>
                            </div>
                        ) : meals.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    No meals found
                                </p>
                                <Link href="/meals/add">
                                    <Button variant="primary">
                                        Add Your First Meal
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                    {meals.map((meal) => (
                                        <MealCard
                                            key={meal.id}
                                            meal={meal}
                                            onDelete={handleDeleteMeal}
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                <div className="flex justify-center items-center space-x-4">
                                    <Button
                                        onClick={() => handlePageChange(pagination.page - 1)}
                                        disabled={pagination.page <= 1}
                                        variant="outline"
                                    >
                                        Previous
                                    </Button>
                                    <span className="text-gray-600 dark:text-gray-400">
                                        Page {pagination.page}
                                    </span>
                                    <Button
                                        onClick={() => handlePageChange(pagination.page + 1)}
                                        disabled={meals.length < pagination.limit}
                                        variant="outline"
                                    >
                                        Next
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}