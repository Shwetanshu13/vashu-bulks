'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import Input from '@/components/auth/Input';
import Button from '@/components/auth/Button';
import Alert from '@/components/auth/Alert';
import { aiAPI } from '@/utils/ai';

export default function SuggestionsPage() {
    const [formData, setFormData] = useState({
        calorieGoal: '',
        proteinGoal: '',
        carbGoal: '',
        fatGoal: '',
        dietaryRestrictions: '',
        mealType: 'any',
        cuisinePreference: ''
    });
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(true);
    const router = useRouter();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Filter out empty values
            const requestData = Object.fromEntries(
                Object.entries(formData).filter(([_, value]) => value.trim() !== '')
            );

            const result = await aiAPI.getMealSuggestions(requestData);
            setSuggestions(result.suggestions || []);
            setShowForm(false);
        } catch (error) {
            console.error('Failed to get suggestions:', error);
            setError(error.message || 'Failed to get meal suggestions. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setSuggestions([]);
        setShowForm(true);
        setError('');
    };

    const mealTypes = [
        { value: 'any', label: 'Any Meal' },
        { value: 'breakfast', label: 'Breakfast' },
        { value: 'lunch', label: 'Lunch' },
        { value: 'dinner', label: 'Dinner' },
        { value: 'snack', label: 'Snack' }
    ];

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Header />

                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <div className="max-w-4xl mx-auto space-y-8">
                            {/* Header */}
                            <div className="text-center">
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    AI Meal Suggestions
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                    Get personalized meal recommendations based on your nutritional goals
                                    and dietary preferences. Our AI will suggest meals that fit your targets.
                                </p>
                            </div>

                            {error && <Alert type="error" message={error} />}

                            {showForm ? (
                                /* Suggestions Form */
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Nutritional Goals */}
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                                Nutritional Goals (Optional)
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                <Input
                                                    label="Calorie Goal"
                                                    name="calorieGoal"
                                                    type="number"
                                                    value={formData.calorieGoal}
                                                    onChange={handleInputChange}
                                                    placeholder="e.g., 2000"
                                                />
                                                <Input
                                                    label="Protein Goal (g)"
                                                    name="proteinGoal"
                                                    type="number"
                                                    value={formData.proteinGoal}
                                                    onChange={handleInputChange}
                                                    placeholder="e.g., 150"
                                                />
                                                <Input
                                                    label="Carb Goal (g)"
                                                    name="carbGoal"
                                                    type="number"
                                                    value={formData.carbGoal}
                                                    onChange={handleInputChange}
                                                    placeholder="e.g., 200"
                                                />
                                                <Input
                                                    label="Fat Goal (g)"
                                                    name="fatGoal"
                                                    type="number"
                                                    value={formData.fatGoal}
                                                    onChange={handleInputChange}
                                                    placeholder="e.g., 80"
                                                />
                                            </div>
                                        </div>

                                        {/* Preferences */}
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                                Preferences
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Meal Type
                                                    </label>
                                                    <select
                                                        name="mealType"
                                                        value={formData.mealType}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    >
                                                        {mealTypes.map(type => (
                                                            <option key={type.value} value={type.value}>
                                                                {type.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <Input
                                                    label="Cuisine Preference"
                                                    name="cuisinePreference"
                                                    value={formData.cuisinePreference}
                                                    onChange={handleInputChange}
                                                    placeholder="e.g., Italian, Asian, Mediterranean"
                                                />
                                            </div>
                                        </div>

                                        {/* Dietary Restrictions */}
                                        <Input
                                            label="Dietary Restrictions"
                                            name="dietaryRestrictions"
                                            type="textarea"
                                            rows={3}
                                            value={formData.dietaryRestrictions}
                                            onChange={handleInputChange}
                                            placeholder="e.g., vegetarian, gluten-free, nut allergies, dairy-free..."
                                        />

                                        <Button type="submit" loading={loading} className="w-full">
                                            Get AI Meal Suggestions
                                        </Button>
                                    </form>
                                </div>
                            ) : (
                                /* Suggestions Results */
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Meal Suggestions ({suggestions.length})
                                        </h2>
                                        <Button onClick={resetForm} variant="secondary">
                                            New Search
                                        </Button>
                                    </div>

                                    {suggestions.length === 0 ? (
                                        <div className="text-center py-12">
                                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                                                No suggestions found. Try adjusting your criteria.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {suggestions.map((suggestion, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4"
                                                >
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                            {suggestion.name}
                                                        </h3>
                                                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                                                            {suggestion.description}
                                                        </p>
                                                    </div>

                                                    {suggestion.nutrition && (
                                                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                                                Estimated Nutrition
                                                            </h4>
                                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                                {suggestion.nutrition.calories && (
                                                                    <div className="text-gray-600 dark:text-gray-400">
                                                                        <span className="font-medium">Calories:</span> {suggestion.nutrition.calories}
                                                                    </div>
                                                                )}
                                                                {suggestion.nutrition.protein && (
                                                                    <div className="text-gray-600 dark:text-gray-400">
                                                                        <span className="font-medium">Protein:</span> {suggestion.nutrition.protein}g
                                                                    </div>
                                                                )}
                                                                {suggestion.nutrition.carbs && (
                                                                    <div className="text-gray-600 dark:text-gray-400">
                                                                        <span className="font-medium">Carbs:</span> {suggestion.nutrition.carbs}g
                                                                    </div>
                                                                )}
                                                                {suggestion.nutrition.fat && (
                                                                    <div className="text-gray-600 dark:text-gray-400">
                                                                        <span className="font-medium">Fat:</span> {suggestion.nutrition.fat}g
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {suggestion.ingredients && suggestion.ingredients.length > 0 && (
                                                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                                                Key Ingredients
                                                            </h4>
                                                            <div className="flex flex-wrap gap-1">
                                                                {suggestion.ingredients.slice(0, 5).map((ingredient, idx) => (
                                                                    <span
                                                                        key={idx}
                                                                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                                                                    >
                                                                        {ingredient}
                                                                    </span>
                                                                ))}
                                                                {suggestion.ingredients.length > 5 && (
                                                                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                                                                        +{suggestion.ingredients.length - 5} more
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {suggestion.tags && suggestion.tags.length > 0 && (
                                                        <div className="flex flex-wrap gap-1 pt-2">
                                                            {suggestion.tags.map((tag, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded-full"
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Quick Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => router.push('/ai/analyze')}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                                >
                                    Analyze a Meal
                                </button>
                                <button
                                    onClick={() => router.push('/meals')}
                                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                                >
                                    View My Meals
                                </button>
                                <button
                                    onClick={() => router.push('/dashboard')}
                                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                                >
                                    Go to Dashboard
                                </button>
                            </div>

                            {/* Information Section */}
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
                                <h3 className="text-lg font-medium text-green-900 dark:text-green-100 mb-3">
                                    🍽️ How Meal Suggestions Work
                                </h3>
                                <ul className="space-y-2 text-green-800 dark:text-green-200">
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>AI analyzes your nutritional goals and dietary preferences</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Suggestions are tailored to fit your calorie and macro targets</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>All dietary restrictions and allergens are carefully considered</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Each suggestion includes estimated nutrition information</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}