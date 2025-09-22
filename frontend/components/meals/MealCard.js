'use client';

import Link from 'next/link';
import { formatMealTimeForDisplay } from '../../utils/meals';
import Button from '../auth/Button';

const MealCard = ({ meal, onDelete, showActions = true }) => {
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this meal?')) {
            try {
                await onDelete(meal.id);
            } catch (error) {
                alert('Failed to delete meal: ' + error.message);
            }
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {meal.mealName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatMealTimeForDisplay(meal.mealTime)}
                    </p>
                </div>
                {showActions && (
                    <div className="flex space-x-2">
                        <Link href={`/meals/${meal.id}`}>
                            <Button variant="outline" size="sm">
                                View
                            </Button>
                        </Link>
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </div>
                )}
            </div>

            {meal.nutrition && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Nutrition Information
                    </h4>
                    <div className="flex flex-col gap-1">
                        <div>
                            <span className="text-gray-600 dark:text-gray-400">Calories:</span>
                            <span className="ml-1 font-medium text-gray-900 dark:text-white">
                                {meal.nutrition.calories || 0}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">

                            <div>
                                <span className="text-gray-600 dark:text-gray-400">Protein:</span>
                                <span className="ml-1 font-medium text-gray-900 dark:text-white">
                                    {meal.nutrition.protein || 0}g
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-600 dark:text-gray-400">Carbs:</span>
                                <span className="ml-1 font-medium text-gray-900 dark:text-white">
                                    {meal.nutrition.carbohydrates || 0}g
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-600 dark:text-gray-400">Fats:</span>
                                <span className="ml-1 font-medium text-gray-900 dark:text-white">
                                    {meal.nutrition.fats || 0}g
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MealCard;