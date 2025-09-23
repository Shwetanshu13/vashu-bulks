'use client';

import Link from 'next/link';

const AuthLayout = ({ children, title, subtitle, footer }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        VashuBulks
                    </Link>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            {subtitle}
                        </p>
                    )}
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-lg px-8 py-6">
                    {children}
                </div>

                {footer && (
                    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthLayout;