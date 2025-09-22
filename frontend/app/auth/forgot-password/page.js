'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthLayout from '../../../components/auth/AuthLayout';
import Input from '../../../components/auth/Input';
import Button from '../../../components/auth/Button';
import Alert from '../../../components/auth/Alert';
import { authAPI, validateEmail } from '../../../utils/auth';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const handleChange = (e) => {
        setEmail(e.target.value);

        // Clear error when user starts typing
        if (error) {
            setError('');
        }
    };

    const validateForm = () => {
        if (!email) {
            setError('Email is required');
            return false;
        } else if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setAlert(null);

        try {
            // Note: This endpoint doesn't exist in the backend yet
            // This is a placeholder for future implementation
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

            setAlert({
                type: 'success',
                message: 'If an account with that email exists, we\'ve sent you a password reset link.'
            });

        } catch (error) {
            setAlert({
                type: 'error',
                message: error.message || 'Failed to send reset email'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Reset your password"
            subtitle="Enter your email address and we'll send you a link to reset your password"
            footer={
                <p>
                    Remember your password?{' '}
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
                    label="Email Address"
                    name="email"
                    type="email"
                    value={email}
                    onChange={handleChange}
                    error={error}
                    required
                    placeholder="Enter your email address"
                />

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={loading}
                    className="w-full"
                >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
            </form>
        </AuthLayout>
    );
}