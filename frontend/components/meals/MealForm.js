'use client';

import { useState } from 'react';
import Input from '../auth/Input';
import Button from '../auth/Button';
import Alert from '../auth/Alert';
import { validateMealData, validateNutritionData, formatDateForInput } from '../../utils/meals';

const MealForm = ({
    initialData = {},
    onSubmit,
    loading = false,
    submitText = 'Save Meal',
    includeNutrition = true
}) => {
    const [formData, setFormData] = useState({
        mealName: initialData.mealName || '',
        mealTime: initialData.mealTime ? formatDateForInput(initialData.mealTime) : '',
        nutritionData: {
            calories: initialData.nutrition?.calories || '',
            protein: initialData.nutrition?.protein || '',
            carbohydrates: initialData.nutrition?.carbohydrates || '',
            fats: initialData.nutrition?.fats || '',
        },
    });
    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('nutrition.')) {
            const nutritionField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                nutritionData: {
                    ...prev.nutritionData,
                    [nutritionField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const validateForm = () => {
        const mealValidation = validateMealData({
            mealName: formData.mealName,
            mealTime: formData.mealTime
        });

        let nutritionValidation = { isValid: true, errors: {} };

        if (includeNutrition && Object.values(formData.nutritionData).some(value => value !== '')) {
            nutritionValidation = validateNutritionData(formData.nutritionData);
        }

        const allErrors = {
            ...mealValidation.errors,
            ...Object.keys(nutritionValidation.errors).reduce((acc, key) => {
                acc[`nutrition.${key}`] = nutritionValidation.errors[key];
                return acc;
            }, {})
        };

        setErrors(allErrors);
        return Object.keys(allErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const submitData = {
                mealName: formData.mealName,
                mealTime: formData.mealTime,
            };

            // Only include nutrition data if any nutrition fields are filled
            const hasNutritionData = Object.values(formData.nutritionData).some(value => value !== '');
            if (includeNutrition && hasNutritionData) {
                submitData.nutritionData = {
                    calories: parseInt(formData.nutritionData.calories) || 0,
                    protein: parseInt(formData.nutritionData.protein) || 0,
                    carbohydrates: parseInt(formData.nutritionData.carbohydrates) || 0,
                    fats: parseInt(formData.nutritionData.fats) || 0,
                };
            }

            await onSubmit(submitData);

        } catch (error) {
            setAlert({
                type: 'error',
                message: error.message
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {alert && (
                <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert(null)}
                />
            )}

            <Input
                label="Meal Name"
                name="mealName"
                type="text"
                value={formData.mealName}
                onChange={handleChange}
                error={errors.mealName}
                required
                placeholder="e.g., Breakfast, Lunch, Dinner"
            />

            <Input
                label="Meal Time"
                name="mealTime"
                type="datetime-local"
                value={formData.mealTime}
                onChange={handleChange}
                error={errors.mealTime}
                required
            />

            {includeNutrition && (
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Nutrition Information (Optional)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Calories"
                            name="nutrition.calories"
                            type="number"
                            min="0"
                            value={formData.nutritionData.calories}
                            onChange={handleChange}
                            error={errors['nutrition.calories']}
                            placeholder="0"
                        />

                        <Input
                            label="Protein (g)"
                            name="nutrition.protein"
                            type="number"
                            min="0"
                            step="0.1"
                            value={formData.nutritionData.protein}
                            onChange={handleChange}
                            error={errors['nutrition.protein']}
                            placeholder="0"
                        />

                        <Input
                            label="Carbohydrates (g)"
                            name="nutrition.carbohydrates"
                            type="number"
                            min="0"
                            step="0.1"
                            value={formData.nutritionData.carbohydrates}
                            onChange={handleChange}
                            error={errors['nutrition.carbohydrates']}
                            placeholder="0"
                        />

                        <Input
                            label="Fats (g)"
                            name="nutrition.fats"
                            type="number"
                            min="0"
                            step="0.1"
                            value={formData.nutritionData.fats}
                            onChange={handleChange}
                            error={errors['nutrition.fats']}
                            placeholder="0"
                        />
                    </div>
                </div>
            )}

            <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full"
            >
                {loading ? 'Saving...' : submitText}
            </Button>
        </form>
    );
};

export default MealForm;