'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '../../../components/auth/AuthLayout';
import Input from '../../../components/auth/Input';
import Button from '../../../components/auth/Button';
import Alert from '../../../components/auth/Alert';
import { authAPI, validateEmail, validatePassword, validateName } from '../../../utils/auth';

export default function SignupPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const router = useRouter();

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
        const newErrors = {};

        // Validate name
        const nameError = validateName(formData.name);
        if (nameError) newErrors.name = nameError;

        // Validate email
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Validate password
        const passwordError = validatePassword(formData.password);
        if (passwordError) newErrors.password = passwordError;

        // Validate confirm password
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setAlert(null);

        try {
            const { name, email, password } = formData;
            const result = await authAPI.signup({ name, email, password });

            setAlert({
                type: 'success',
                message: result.message
            });

            // Optionally redirect to login page after successful signup
            setTimeout(() => {
                router.push('/auth/login');
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
        <AuthLayout
            title="Create your account"
            subtitle="Start tracking your meals and nutrition today"
            footer={
                <p>
                    Already have an account?{' '}
                    <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                        Sign in here
                    </Link>
                </p>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {alert && (
                    <Alert
                        type={alert.type}
                        message={alert.message}
                        onClose={() => setAlert(null)}
                    />
                )}

                <Input
                    label="Full Name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    required
                    placeholder="Enter your full name"
                />

                <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                    placeholder="Enter your email address"
                />

                <Input
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    required
                    placeholder="Enter your password"
                />

                <Input
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    required
                    placeholder="Confirm your password"
                />

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={loading}
                    className="w-full"
                >
                    {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
            </form>
        </AuthLayout>
    );
}