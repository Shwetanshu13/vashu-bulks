'use client';

import { forwardRef } from 'react';

const Input = forwardRef(({
    label,
    type = 'text',
    error,
    required = false,
    className = '',
    rows,
    ...props
}, ref) => {
    const isTextarea = type === 'textarea';
    const Component = isTextarea ? 'textarea' : 'input';

    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <Component
                ref={ref}
                type={isTextarea ? undefined : type}
                rows={isTextarea ? rows : undefined}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${error
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                    } ${className}`}
                {...props}
            />
            {error && (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;