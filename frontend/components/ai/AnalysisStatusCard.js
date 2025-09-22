'use client';

import { useState, useEffect } from 'react';
import Button from '../auth/Button';
import Alert from '../auth/Alert';
import NutritionCard from '../nutrition/NutritionCard';
import { getAnalysisStatusText, getAnalysisStatusColor } from '../../utils/ai';

const AnalysisStatusCard = ({
    analysis,
    meal,
    onRetry,
    onRefresh,
    onUpdate,
    refreshing = false,
    retrying = false
}) => {
    const [alert, setAlert] = useState(null);

    // Use analysis prop if provided, otherwise fall back to meal prop for backward compatibility
    const data = analysis || meal;

    if (!data) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400">No analysis data available.</p>
            </div>
        );
    }

    const handleRetry = async () => {
        try {
            await onRetry();
            setAlert({
                type: 'success',
                message: 'Analysis retry initiated'
            });
        } catch (error) {
            setAlert({
                type: 'error',
                message: error.message
            });
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                );
            case 'completed':
                return (
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                );
            case 'failed':
                return (
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                );
            default:
                return (
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                );
        }
    };

    const getStatusBgColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
            case 'completed':
                return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
            case 'failed':
                return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
            default:
                return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
        }
    };

    return (
        <div className="space-y-4">
            {alert && (
                <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert(null)}
                />
            )}

            {/* Status Card */}
            <div className={`border rounded-lg p-4 ${getStatusBgColor(data.aiAnalysisStatus || data.status || 'pending')}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {getStatusIcon(data.aiAnalysisStatus || data.status || 'pending')}
                        <div>
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                AI Analysis Status
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {getAnalysisStatusText(data.aiAnalysisStatus || data.status || 'pending')}
                            </p>
                        </div>
                    </div>

                    <div className="flex space-x-2">
                        {onRefresh && (
                            <Button
                                onClick={onRefresh}
                                variant="outline"
                                size="sm"
                                loading={refreshing}
                            >
                                Refresh
                            </Button>
                        )}

                        {(data.aiAnalysisStatus === 'failed' || data.status === 'failed') && onRetry && (
                            <Button
                                onClick={handleRetry}
                                variant="primary"
                                size="sm"
                                loading={retrying}
                            >
                                Retry Analysis
                            </Button>
                        )}
                    </div>
                </div>

                {data.description && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                            Meal Description:
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {data.description}
                        </p>
                    </div>
                )}
            </div>

            {/* Analysis Results */}
            {(data.aiAnalysisStatus === 'completed' || data.status === 'completed') && (data.aiAnalysisResult || data.result) && (
                <div className="space-y-4">
                    {/* Nutrition Information */}
                    {(data.aiAnalysisResult?.nutrition || data.result?.nutrition || data.nutrition) && (
                        <NutritionCard
                            nutrition={data.aiAnalysisResult?.nutrition || data.result?.nutrition || data.nutrition}
                            title="AI-Analyzed Nutrition"
                        />
                    )}

                    {/* AI Insights */}
                    {(data.aiAnalysisResult?.insights || data.result?.insights || data.insights) && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                🧠 AI Insights
                            </h3>

                            {(data.aiAnalysisResult?.insights?.summary || data.result?.insights?.summary || data.insights?.summary) && (
                                <div className="mb-4">
                                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                        Summary:
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {data.aiAnalysisResult?.insights?.summary || data.result?.insights?.summary || data.insights?.summary}
                                    </p>
                                </div>
                            )}

                            {(data.aiAnalysisResult?.insights?.healthScore || data.result?.insights?.healthScore || data.insights?.healthScore) && (
                                <div className="mb-4">
                                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                        Health Score: {data.aiAnalysisResult?.insights?.healthScore || data.result?.insights?.healthScore || data.insights?.healthScore}/10
                                    </h4>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-green-600 h-2 rounded-full"
                                            style={{ width: `${(data.aiAnalysisResult?.insights?.healthScore || data.result?.insights?.healthScore || data.insights?.healthScore) * 10}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            {(data.aiAnalysisResult?.insights?.recommendations || data.result?.insights?.recommendations || data.insights?.recommendations) && (
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                        Recommendations:
                                    </h4>
                                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                        {(data.aiAnalysisResult?.insights?.recommendations || data.result?.insights?.recommendations || data.insights?.recommendations).map((rec, index) => (
                                            <li key={index} className="flex items-start">
                                                <span className="text-blue-500 mr-2">•</span>
                                                {rec}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Detected Ingredients */}
                    {(data.aiAnalysisResult?.ingredients || data.result?.ingredients || data.ingredients) && (data.aiAnalysisResult?.ingredients || data.result?.ingredients || data.ingredients).length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                🥗 Detected Ingredients
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {(data.aiAnalysisResult?.ingredients || data.result?.ingredients || data.ingredients).map((ingredient, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                                    >
                                        {ingredient}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Pending State */}
            {(data.aiAnalysisStatus === 'pending' || data.status === 'pending' || (!data.aiAnalysisStatus && !data.status)) && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
                    <div className="animate-pulse">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            AI is analyzing your meal...
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            This usually takes 10-30 seconds. We'll automatically update when complete.
                        </p>
                    </div>
                </div>
            )}

            {/* Failed State */}
            {(data.aiAnalysisStatus === 'failed' || data.status === 'failed') && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L2.732 14c-.77.833.192 2.5 1.732 2.5z"></path>
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Analysis Failed
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        We couldn't analyze your meal. This might be due to an unclear description or a temporary issue.
                    </p>
                    {onRetry && (
                        <Button
                            onClick={handleRetry}
                            variant="primary"
                            loading={retrying}
                        >
                            Try Again
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

export default AnalysisStatusCard;