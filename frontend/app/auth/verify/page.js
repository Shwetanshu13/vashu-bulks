'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '../../../components/auth/AuthLayout';
import Button from '../../../components/auth/Button';
import Alert from '../../../components/auth/Alert';
import { authAPI } from '../../../utils/auth';

function VerifyEmailContent() {
    const [verificationState, setVerificationState] = useState('verifying'); // 'verifying', 'success', 'error'
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        if (token) {
            verifyEmailToken(token);
        } else {
            setVerificationState('error');
            setAlert({
                type: 'error',
                message: 'No verification token provided'
            });
        }
    }, [token]);

    const verifyEmailToken = async (verificationToken) => {
        try {
            const result = await authAPI.verifyEmail(verificationToken);
            setVerificationState('success');
            setAlert({
                type: 'success',
                message: result.message
            });
        } catch (error) {
            setVerificationState('error');
            setAlert({
                type: 'error',
                message: error.message
            });
        }
    };

    const handleGoToLogin = () => {
        router.push('/auth/login');
    };

    const handleResendVerification = async () => {
        const email = prompt('Please enter your email address:');
        if (!email) return;

        setLoading(true);
        try {
            const result = await authAPI.resendVerification(email);
            setAlert({
                type: 'success',
                message: result.message
            });
        } catch (error) {
            setAlert({
                type: 'error',
                message: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        switch (verificationState) {
            case 'verifying':
                return (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">
                            Verifying your email address...
                        </p>
                    </div>
                );

            case 'success':
                return (
                    <div className="text-center space-y-4">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            Email Verified Successfully!
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Your email has been verified. You can now sign in to your account.
                        </p>
                        <Button
                            onClick={handleGoToLogin}
                            variant="primary"
                            size="lg"
                            className="w-full mt-4"
                        >
                            Continue to Sign In
                        </Button>
                    </div>
                );

            case 'error':
                return (
                    <div className="text-center space-y-4">
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            Verification Failed
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            We couldn&apos;t verify your email. The link may have expired or is invalid.
                        </p>
                        <div className="space-y-2">
                            <Button
                                onClick={handleResendVerification}
                                variant="primary"
                                size="lg"
                                loading={loading}
                                className="w-full"
                            >
                                Resend Verification Email
                            </Button>
                            <Button
                                onClick={handleGoToLogin}
                                variant="outline"
                                size="lg"
                                className="w-full"
                            >
                                Back to Sign In
                            </Button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <AuthLayout
            title="Email Verification"
            subtitle="Confirming your email address"
            footer={
                <p>
                    Need help?{' '}
                    <Link href="/contact" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                        Contact support
                    </Link>
                </p>
            }
        >
            <div className="space-y-6">
                {alert && (
                    <Alert
                        type={alert.type}
                        message={alert.message}
                        onClose={() => setAlert(null)}
                    />
                )}

                {renderContent()}
            </div>
        </AuthLayout>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <AuthLayout
                title="Email Verification"
                subtitle="Confirming your email address"
            >
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Loading verification...
                    </p>
                </div>
            </AuthLayout>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}