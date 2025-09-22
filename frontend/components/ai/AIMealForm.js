'use client';

import { useState } from 'react';
import Input from '../auth/Input';
import Button from '../auth/Button';
import Alert from '../auth/Alert';
import { validateAIMealData, formatDateForAPI } from '../../utils/ai';

const AIMealForm = ({
    initialData = {},
    onSubmit,
    loading = false,
    submitText = 'Analyze Meal with AI'
}) => {
    const [formData, setFormData] = useState({
        description: initialData.description || '',
        mealName: initialData.mealName || '',
        mealTime: initialData.mealTime ? formatDateForAPI(initialData.mealTime) : '',
    });
    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const validateForm = () => {
        const validation = validateAIMealData(formData);
        setErrors(validation.errors);
        return validation.isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const submitData = {
                description: formData.description.trim(),
                mealName: formData.mealName.trim() || undefined,
                mealTime: formData.mealTime,
            };

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

            <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                        🤖 AI-Powered Meal Analysis
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        Describe your meal and our AI will automatically analyze its nutritional content,
                        including calories, macronutrients, and provide insights about your meal.
                    </p>
                </div>

                <Input
                    label="Meal Description"
                    name="description"
                    type="textarea"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    error={errors.description}
                    required
                    placeholder="Describe your meal in detail. For example: 'Grilled chicken breast with quinoa and steamed broccoli, olive oil dressing, and a small apple for dessert'"
                    className="resize-none"
                />

                <Input
                    label="Meal Name (Optional)"
                    name="mealName"
                    type="text"
                    value={formData.mealName}
                    onChange={handleChange}
                    error={errors.mealName}
                    placeholder="e.g., Healthy Lunch, Post-Workout Meal"
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
            </div>

            <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full"
            >
                {loading ? 'Analyzing with AI...' : submitText}
            </Button>

            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Tips for better AI analysis:
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Include specific food items and quantities when possible</li>
                    <li>• Mention cooking methods (grilled, fried, steamed, etc.)</li>
                    <li>• Include sauces, dressings, and seasonings</li>
                    <li>• Specify portion sizes (e.g., "large apple", "1 cup of rice")</li>
                    <li>• The more detailed your description, the more accurate the analysis</li>
                </ul>
            </div>
        </form>
    );
};

export default AIMealForm;