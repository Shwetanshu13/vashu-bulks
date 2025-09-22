'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

const PublicRoute = ({ children, redirectTo = '/dashboard' }) => {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.push(redirectTo);
        }
    }, [isAuthenticated, loading, router, redirectTo]);

    // Show loading spinner while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Render children only if not authenticated
    if (!isAuthenticated) {
        return children;
    }

    // Return null while redirecting
    return null;
};

export default PublicRoute;