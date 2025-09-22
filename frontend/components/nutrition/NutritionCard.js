'use client';

import { formatNutritionValue } from '../../utils/nutrition';

const NutritionCard = ({ nutrition, title = "Nutrition Information" }) => {
    if (!nutrition) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                    No nutrition data available
                </p>
            </div>
        );
    }

    const totalCalories = nutrition.totalCalories || 0;
    const protein = nutrition.totalProtein || 0;
    const carbs = nutrition.totalCarbohydrates || 0;
    const fats = nutrition.totalFats || 0;

    // Calculate percentages for macronutrients
    const proteinCalories = protein * 4;
    const carbsCalories = carbs * 4;
    const fatsCalories = fats * 9;
    const totalMacroCalories = proteinCalories + carbsCalories + fatsCalories;

    const proteinPercentage = totalMacroCalories > 0 ? (proteinCalories / totalMacroCalories) * 100 : 0;
    const carbsPercentage = totalMacroCalories > 0 ? (carbsCalories / totalMacroCalories) * 100 : 0;
    const fatsPercentage = totalMacroCalories > 0 ? (fatsCalories / totalMacroCalories) * 100 : 0;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {title}
            </h3>

            {/* Total Calories */}
            <div className="mb-6">
                <div className="text-center">
                    <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {totalCalories}
                    </span>
                    <span className="text-lg text-gray-600 dark:text-gray-400 ml-1">
                        calories
                    </span>
                </div>
            </div>

            {/* Macronutrients */}
            <div className="space-y-4">
                {/* Protein */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                            Protein
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatNutritionValue(protein)}g
                        </span>
                        <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">
                            ({formatNutritionValue(proteinPercentage)}%)
                        </span>
                    </div>
                </div>

                {/* Carbohydrates */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                            Carbohydrates
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatNutritionValue(carbs)}g
                        </span>
                        <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">
                            ({formatNutritionValue(carbsPercentage)}%)
                        </span>
                    </div>
                </div>

                {/* Fats */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-yellow-500 rounded mr-3"></div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                            Fats
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatNutritionValue(fats)}g
                        </span>
                        <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">
                            ({formatNutritionValue(fatsPercentage)}%)
                        </span>
                    </div>
                </div>
            </div>

            {/* Visual representation */}
            {totalMacroCalories > 0 && (
                <div className="mt-4">
                    <div className="flex h-2 bg-gray-200 dark:bg-gray-700 rounded">
                        <div
                            className="bg-red-500 rounded-l"
                            style={{ width: `${proteinPercentage}%` }}
                        ></div>
                        <div
                            className="bg-green-500"
                            style={{ width: `${carbsPercentage}%` }}
                        ></div>
                        <div
                            className="bg-yellow-500 rounded-r"
                            style={{ width: `${fatsPercentage}%` }}
                        ></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NutritionCard;