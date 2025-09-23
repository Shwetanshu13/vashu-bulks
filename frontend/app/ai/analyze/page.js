'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import AIMealForm from '@/components/ai/AIMealForm';
import AnalysisStatusCard from '@/components/ai/AnalysisStatusCard';
import { analyzeMeal } from '@/utils/ai';

export default function AnalyzePage() {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleAnalyze = async (description) => {
        setLoading(true);
        setError('');
        setAnalysis(null);

        try {
            const result = await analyzeMeal(description);
            setAnalysis(result);
        } catch (error) {
            console.error('Analysis failed:', error);
            setError(error.message || 'Failed to analyze meal. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAnalysisUpdate = (updatedAnalysis) => {
        setAnalysis(updatedAnalysis);
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Header />

                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <div className="max-w-4xl mx-auto space-y-8">
                            {/* Header */}
                            <div className="text-center">
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    AI Meal Analysis
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                    Describe your meal and get instant nutritional analysis powered by AI.
                                    Our system will break down the calories, macronutrients, and provide
                                    insights about your food choices.
                                </p>
                            </div>

                            {/* Analysis Form */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <AIMealForm
                                    onSubmit={handleAnalyze}
                                    loading={loading}
                                    error={error}
                                />
                            </div>

                            {/* Analysis Results */}
                            {analysis && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Analysis Results
                                    </h2>
                                    <AnalysisStatusCard
                                        analysis={analysis}
                                        onUpdate={handleAnalysisUpdate}
                                    />
                                </div>
                            )}

                            {/* Quick Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => router.push('/ai/suggestions')}
                                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                                >
                                    Get Meal Suggestions
                                </button>
                                <button
                                    onClick={() => router.push('/meals')}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                                >
                                    View My Meals
                                </button>
                                <button
                                    onClick={() => router.push('/dashboard')}
                                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                                >
                                    Go to Dashboard
                                </button>
                            </div>

                            {/* Tips Section */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                                <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-3">
                                    💡 Pro Tips for Better Analysis
                                </h3>
                                <ul className="space-y-2 text-blue-800 dark:text-blue-200">
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Include cooking methods (grilled, fried, steamed) for more accurate calorie estimates</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Mention portion sizes or quantities when possible (e.g., &quot;1 cup of rice&quot;)</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>List ingredients and condiments for comprehensive nutritional breakdown</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>The more detailed your description, the better the AI analysis will be</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}