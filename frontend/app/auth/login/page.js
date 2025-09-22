'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '../../../components/auth/AuthLayout';
import Input from '../../../components/auth/Input';
import Button from '../../../components/auth/Button';
import Alert from '../../../components/auth/Alert';
import { authAPI, authUtils, validateEmail } from '../../../utils/auth';

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [showResendVerification, setShowResendVerification] = useState(false);
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

        // Validate email
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Validate password
        if (!formData.password) {
            newErrors.password = 'Password is required';
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
        setShowResendVerification(false);

        try {
            const result = await authAPI.login(formData);

            // Store token and user data
            authUtils.login(result.token, result.user);

            setAlert({
                type: 'success',
                message: result.message
            });

            // Redirect to dashboard or home page
            setTimeout(() => {
                router.push('/dashboard');
            }, 1000);

        } catch (error) {
            setAlert({
                type: 'error',
                message: error.message
            });

            // Show resend verification option if email is not verified
            if (error.message.includes('verify your email')) {
                setShowResendVerification(true);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendVerification = async () => {
        if (!formData.email || !validateEmail(formData.email)) {
            setAlert({
                type: 'error',
                message: 'Please enter a valid email address'
            });
            return;
        }

        setLoading(true);
        try {
            const result = await authAPI.resendVerification(formData.email);
            setAlert({
                type: 'success',
                message: result.message
            });
            setShowResendVerification(false);
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
            title="Welcome back"
            subtitle="Sign in to your YesChef account"
            footer={
                <p>
                    Don't have an account?{' '}
                    <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                        Create one here
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

                <div className="flex items-center justify-between">
                    <div className="text-sm">
                        <Link href="/auth/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                            Forgot your password?
                        </Link>
                    </div>
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={loading}
                    className="w-full"
                >
                    {loading ? 'Signing In...' : 'Sign In'}
                </Button>

                {showResendVerification && (
                    <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
                            Need to verify your email?
                        </p>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleResendVerification}
                            loading={loading}
                            className="w-full"
                        >
                            Resend Verification Email
                        </Button>
                    </div>
                )}
            </form>
        </AuthLayout>
    );
}