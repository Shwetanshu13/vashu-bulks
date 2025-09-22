'use client';

import { useState } from 'react';
import Input from '../auth/Input';
import Button from '../auth/Button';
import Alert from '../auth/Alert';
import { validateNutritionData } from '../../utils/nutrition';

const NutritionForm = ({
    initialData = {},
    onSubmit,
    loading = false,
    submitText = 'Save Nutrition'
}) => {
    const [formData, setFormData] = useState({
        calories: initialData.calories || '',
        protein: initialData.protein || '',
        carbohydrates: initialData.carbohydrates || '',
        fats: initialData.fats || '',
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
        const validation = validateNutritionData(formData);
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
                calories: parseInt(formData.calories),
                protein: parseInt(formData.protein),
                carbohydrates: parseInt(formData.carbohydrates),
                fats: parseInt(formData.fats),
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Calories"
                    name="calories"
                    type="number"
                    min="0"
                    value={formData.calories}
                    onChange={handleChange}
                    error={errors.calories}
                    required
                    placeholder="0"
                />

                <Input
                    label="Protein (g)"
                    name="protein"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.protein}
                    onChange={handleChange}
                    error={errors.protein}
                    required
                    placeholder="0"
                />

                <Input
                    label="Carbohydrates (g)"
                    name="carbohydrates"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.carbohydrates}
                    onChange={handleChange}
                    error={errors.carbohydrates}
                    required
                    placeholder="0"
                />

                <Input
                    label="Fats (g)"
                    name="fats"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.fats}
                    onChange={handleChange}
                    error={errors.fats}
                    required
                    placeholder="0"
                />
            </div>

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

export default NutritionForm;