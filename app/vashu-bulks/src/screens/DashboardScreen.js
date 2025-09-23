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
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { theme } from '../styles/theme';
import { mealsAPI, nutritionAPI } from '../utils/api';

const DashboardScreen = ({ navigation }) => {
    const { user, logout } = useAuth();
    const [refreshing, setRefreshing] = useState(false);
    const [dashboardData, setDashboardData] = useState({
        recentMeals: [],
        todayNutrition: null,
        weeklyStats: null,
    });

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            // Load recent meals, today's nutrition, and weekly stats
            const [mealsResponse, nutritionResponse] = await Promise.all([
                mealsAPI.getMeals(),
                nutritionAPI.getNutritionSummary(
                    new Date().toISOString().split('T')[0],
                    new Date().toISOString().split('T')[0]
                ),
            ]);

            setDashboardData({
                recentMeals: mealsResponse.slice(0, 3),
                todayNutrition: nutritionResponse,
                weeklyStats: null, // This would be calculated from the API
            });
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadDashboardData();
        setRefreshing(false);
    };

    const handleLogout = async () => {
        await logout();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Good morning,</Text>
                    <Text style={styles.userName}>{user?.firstName || 'Chef'}!</Text>
                </View>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Ionicons name="log-out-outline" size={24} color={theme.colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Quick Actions */}
                <Card title="Quick Actions" style={styles.card}>
                    <View style={styles.quickActions}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => navigation.navigate('Meals', { screen: 'AddMeal' })}
                        >
                            <Ionicons name="add-circle" size={32} color={theme.colors.primary} />
                            <Text style={styles.actionText}>Add Meal</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => navigation.navigate('AI', { screen: 'AIAnalysis' })}
                        >
                            <Ionicons name="camera" size={32} color={theme.colors.primary} />
                            <Text style={styles.actionText}>AI Analysis</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => navigation.navigate('Nutrition')}
                        >
                            <Ionicons name="nutrition" size={32} color={theme.colors.primary} />
                            <Text style={styles.actionText}>Nutrition</Text>
                        </TouchableOpacity>
                    </View>
                </Card>

                {/* Today's Summary */}
                <Card title="Today's Summary" style={styles.card}>
                    <View style={styles.summaryRow}>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryValue}>
                                {dashboardData.todayNutrition?.calories || '0'}
                            </Text>
                            <Text style={styles.summaryLabel}>Calories</Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryValue}>
                                {dashboardData.recentMeals?.length || '0'}
                            </Text>
                            <Text style={styles.summaryLabel}>Meals Today</Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryValue}>
                                {dashboardData.todayNutrition?.protein || '0'}g
                            </Text>
                            <Text style={styles.summaryLabel}>Protein</Text>
                        </View>
                    </View>
                </Card>

                {/* Recent Meals */}
                <Card title="Recent Meals" style={styles.card}>
                    {dashboardData.recentMeals.length > 0 ? (
                        <>
                            {dashboardData.recentMeals.map((meal, index) => (
                                <TouchableOpacity
                                    key={meal.id || index}
                                    style={styles.mealItem}
                                    onPress={() => navigation.navigate('Meals', {
                                        screen: 'MealDetail',
                                        params: { mealId: meal.id }
                                    })}
                                >
                                    <View style={styles.mealInfo}>
                                        <Text style={styles.mealName}>{meal.name}</Text>
                                        <Text style={styles.mealTime}>
                                            {new Date(meal.createdAt).toLocaleDateString()}
                                        </Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
                                </TouchableOpacity>
                            ))}
                            <Button
                                title="View All Meals"
                                variant="outline"
                                onPress={() => navigation.navigate('Meals')}
                                style={styles.viewAllButton}
                            />
                        </>
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No meals recorded yet</Text>
                            <Button
                                title="Add Your First Meal"
                                onPress={() => navigation.navigate('Meals', { screen: 'AddMeal' })}
                                style={styles.emptyButton}
                            />
                        </View>
                    )}
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        backgroundColor: theme.colors.background,
    },
    greeting: {
        ...theme.typography.body1,
        color: theme.colors.textSecondary,
    },
    userName: {
        ...theme.typography.h2,
        color: theme.colors.text,
    },
    logoutButton: {
        padding: theme.spacing.sm,
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
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    summaryItem: {
        alignItems: 'center',
    },
    summaryValue: {
        ...theme.typography.h2,
        color: theme.colors.primary,
    },
    summaryLabel: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.xs,
    },
    mealItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    mealInfo: {
        flex: 1,
    },
    mealName: {
        ...theme.typography.body1,
        color: theme.colors.text,
        fontWeight: '600',
    },
    mealTime: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.xs,
    },
    viewAllButton: {
        marginTop: theme.spacing.md,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: theme.spacing.lg,
    },
    emptyText: {
        ...theme.typography.body1,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.md,
    },
    emptyButton: {
        width: '100%',
    },
});

export default DashboardScreen;