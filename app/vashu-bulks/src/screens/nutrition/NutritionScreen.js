import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../components/common/Card';
import { theme } from '../../styles/theme';
import { nutritionAPI } from '../../utils/api';

const NutritionScreen = ({ navigation }) => {
    const [nutritionData, setNutritionData] = useState({
        today: null,
        week: null,
        month: null,
    });
    const [selectedPeriod, setSelectedPeriod] = useState('today');
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadNutritionData();
    }, []);

    const loadNutritionData = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

            const [todayData, weekData, monthData] = await Promise.all([
                nutritionAPI.getNutritionSummary(today, today),
                nutritionAPI.getNutritionSummary(weekAgo, today),
                nutritionAPI.getNutritionSummary(monthAgo, today),
            ]);

            setNutritionData({
                today: todayData,
                week: weekData,
                month: monthData,
            });
        } catch (error) {
            console.error('Error loading nutrition data:', error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadNutritionData();
        setRefreshing(false);
    };

    const getCurrentData = () => {
        return nutritionData[selectedPeriod];
    };

    const getPeriodLabel = () => {
        switch (selectedPeriod) {
            case 'today': return 'Today';
            case 'week': return 'This Week';
            case 'month': return 'This Month';
            default: return 'Today';
        }
    };

    const renderNutritionSummary = () => {
        const data = getCurrentData();
        if (!data) return null;

        return (
            <Card title={`${getPeriodLabel()}'s Summary`} style={styles.card}>
                <View style={styles.summaryGrid}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryValue}>{data.calories || 0}</Text>
                        <Text style={styles.summaryLabel}>Calories</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryValue}>{data.protein || 0}g</Text>
                        <Text style={styles.summaryLabel}>Protein</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryValue}>{data.carbs || 0}g</Text>
                        <Text style={styles.summaryLabel}>Carbs</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryValue}>{data.fat || 0}g</Text>
                        <Text style={styles.summaryLabel}>Fat</Text>
                    </View>
                </View>

                {/* Macros visualization */}
                {(data.protein || data.carbs || data.fat) && (
                    <View style={styles.macrosSection}>
                        <Text style={styles.macrosTitle}>Macronutrients Distribution</Text>
                        <View style={styles.macrosBar}>
                            {data.protein > 0 && (
                                <View
                                    style={[
                                        styles.macroSegment,
                                        styles.proteinSegment,
                                        { flex: data.protein }
                                    ]}
                                />
                            )}
                            {data.carbs > 0 && (
                                <View
                                    style={[
                                        styles.macroSegment,
                                        styles.carbsSegment,
                                        { flex: data.carbs }
                                    ]}
                                />
                            )}
                            {data.fat > 0 && (
                                <View
                                    style={[
                                        styles.macroSegment,
                                        styles.fatSegment,
                                        { flex: data.fat }
                                    ]}
                                />
                            )}
                        </View>
                        <View style={styles.macrosLegend}>
                            {data.protein > 0 && (
                                <View style={styles.legendItem}>
                                    <View style={[styles.legendColor, styles.proteinSegment]} />
                                    <Text style={styles.legendText}>Protein ({data.protein}g)</Text>
                                </View>
                            )}
                            {data.carbs > 0 && (
                                <View style={styles.legendItem}>
                                    <View style={[styles.legendColor, styles.carbsSegment]} />
                                    <Text style={styles.legendText}>Carbs ({data.carbs}g)</Text>
                                </View>
                            )}
                            {data.fat > 0 && (
                                <View style={styles.legendItem}>
                                    <View style={[styles.legendColor, styles.fatSegment]} />
                                    <Text style={styles.legendText}>Fat ({data.fat}g)</Text>
                                </View>
                            )}
                        </View>
                    </View>
                )}
            </Card>
        );
    };

    const renderGoals = () => {
        const data = getCurrentData();
        if (!data) return null;

        // Example goals - these would come from user preferences
        const goals = {
            calories: 2000,
            protein: 150,
            carbs: 250,
            fat: 67,
        };

        return (
            <Card title="Goals Progress" style={styles.card}>
                <View style={styles.goalsContainer}>
                    {Object.entries(goals).map(([key, goal]) => {
                        const current = data[key] || 0;
                        const percentage = Math.min((current / goal) * 100, 100);

                        return (
                            <View key={key} style={styles.goalItem}>
                                <View style={styles.goalHeader}>
                                    <Text style={styles.goalLabel}>
                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                    </Text>
                                    <Text style={styles.goalProgress}>
                                        {current} / {goal}{key === 'calories' ? '' : 'g'}
                                    </Text>
                                </View>
                                <View style={styles.progressBar}>
                                    <View
                                        style={[
                                            styles.progressFill,
                                            { width: `${percentage}%` },
                                            percentage >= 100 && styles.progressComplete
                                        ]}
                                    />
                                </View>
                                <Text style={styles.goalPercentage}>{Math.round(percentage)}%</Text>
                            </View>
                        );
                    })}
                </View>
            </Card>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Nutrition</Text>
            </View>

            {/* Period Selector */}
            <View style={styles.periodSelector}>
                {['today', 'week', 'month'].map((period) => (
                    <TouchableOpacity
                        key={period}
                        style={[
                            styles.periodButton,
                            selectedPeriod === period && styles.periodButtonActive
                        ]}
                        onPress={() => setSelectedPeriod(period)}
                    >
                        <Text style={[
                            styles.periodButtonText,
                            selectedPeriod === period && styles.periodButtonTextActive
                        ]}>
                            {period === 'today' ? 'Today' :
                                period === 'week' ? 'Week' : 'Month'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {renderNutritionSummary()}
                {renderGoals()}

                {/* Quick Actions */}
                <Card title="Quick Actions" style={styles.card}>
                    <View style={styles.quickActions}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => navigation.navigate('Meals', { screen: 'AddMeal' })}
                        >
                            <Ionicons name="restaurant" size={32} color={theme.colors.primary} />
                            <Text style={styles.actionText}>Add Meal</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => navigation.navigate('AI', { screen: 'AIAnalysis' })}
                        >
                            <Ionicons name="camera" size={32} color={theme.colors.primary} />
                            <Text style={styles.actionText}>AI Analysis</Text>
                        </TouchableOpacity>
                    </View>
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.surface,
    },
    header: {
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        backgroundColor: theme.colors.background,
    },
    title: {
        ...theme.typography.h2,
        color: theme.colors.text,
    },
    periodSelector: {
        flexDirection: 'row',
        backgroundColor: theme.colors.background,
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.md,
    },
    periodButton: {
        flex: 1,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        marginHorizontal: theme.spacing.xs,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.surface,
        alignItems: 'center',
    },
    periodButtonActive: {
        backgroundColor: theme.colors.primary,
    },
    periodButtonText: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
        fontWeight: '600',
    },
    periodButtonTextActive: {
        color: '#FFFFFF',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: theme.spacing.lg,
    },
    card: {
        marginBottom: theme.spacing.lg,
    },
    summaryGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: theme.spacing.lg,
    },
    summaryItem: {
        alignItems: 'center',
    },
    summaryValue: {
        ...theme.typography.h2,
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
    summaryLabel: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.xs,
    },
    macrosSection: {
        marginTop: theme.spacing.md,
    },
    macrosTitle: {
        ...theme.typography.body1,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    macrosBar: {
        flexDirection: 'row',
        height: 12,
        borderRadius: 6,
        overflow: 'hidden',
        marginBottom: theme.spacing.md,
    },
    macroSegment: {
        height: '100%',
    },
    proteinSegment: {
        backgroundColor: '#FF6B6B',
    },
    carbsSegment: {
        backgroundColor: '#4ECDC4',
    },
    fatSegment: {
        backgroundColor: '#45B7D1',
    },
    macrosLegend: {
        gap: theme.spacing.sm,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: theme.spacing.sm,
    },
    legendText: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
    },
    goalsContainer: {
        gap: theme.spacing.md,
    },
    goalItem: {
        marginBottom: theme.spacing.sm,
    },
    goalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.xs,
    },
    goalLabel: {
        ...theme.typography.body2,
        fontWeight: '600',
        color: theme.colors.text,
    },
    goalProgress: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
    },
    progressBar: {
        height: 8,
        backgroundColor: theme.colors.surface,
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: theme.spacing.xs,
    },
    progressFill: {
        height: '100%',
        backgroundColor: theme.colors.primary,
    },
    progressComplete: {
        backgroundColor: theme.colors.success,
    },
    goalPercentage: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        textAlign: 'right',
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    actionButton: {
        alignItems: 'center',
        padding: theme.spacing.md,
    },
    actionText: {
        ...theme.typography.body2,
        color: theme.colors.text,
        marginTop: theme.spacing.xs,
    },
});

export default NutritionScreen;