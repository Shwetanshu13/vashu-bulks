import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { theme } from '../../styles/theme';
import { mealsAPI } from '../../utils/api';

const MealsScreen = ({ navigation }) => {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadMeals();
    }, []);

    const loadMeals = async () => {
        try {
            const response = await mealsAPI.getMeals();
            setMeals(response);
        } catch (error) {
            console.error('Error loading meals:', error);
            Alert.alert('Error', 'Failed to load meals');
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadMeals();
        setRefreshing(false);
    };

    const handleDeleteMeal = (mealId) => {
        Alert.alert(
            'Delete Meal',
            'Are you sure you want to delete this meal?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await mealsAPI.deleteMeal(mealId);
                            setMeals(meals.filter(meal => meal.id !== mealId));
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete meal');
                        }
                    },
                },
            ]
        );
    };

    const renderMealCard = ({ item: meal }) => (
        <Card style={styles.mealCard}>
            <TouchableOpacity
                onPress={() => navigation.navigate('MealDetail', { mealId: meal.id })}
                style={styles.mealContent}
            >
                <View style={styles.mealHeader}>
                    <Text style={styles.mealName}>{meal.name}</Text>
                    <Text style={styles.mealDate}>
                        {new Date(meal.createdAt).toLocaleDateString()}
                    </Text>
                </View>

                {meal.description && (
                    <Text style={styles.mealDescription} numberOfLines={2}>
                        {meal.description}
                    </Text>
                )}

                <View style={styles.mealStats}>
                    <View style={styles.statItem}>
                        <Ionicons name="flame" size={16} color={theme.colors.primary} />
                        <Text style={styles.statText}>
                            {meal.calories || 0} cal
                        </Text>
                    </View>
                    <View style={styles.statItem}>
                        <Ionicons name="time" size={16} color={theme.colors.textSecondary} />
                        <Text style={styles.statText}>
                            {new Date(meal.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>

            <View style={styles.mealActions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('AddMeal', { mealId: meal.id })}
                >
                    <Ionicons name="create-outline" size={20} color={theme.colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDeleteMeal(meal.id)}
                >
                    <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
                </TouchableOpacity>
            </View>
        </Card>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="restaurant-outline" size={64} color={theme.colors.textSecondary} />
            <Text style={styles.emptyTitle}>No meals yet</Text>
            <Text style={styles.emptySubtitle}>
                Start tracking your meals to monitor your nutrition
            </Text>
            <Button
                title="Add Your First Meal"
                onPress={() => navigation.navigate('AddMeal')}
                style={styles.emptyButton}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>My Meals</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('AddMeal')}
                >
                    <Ionicons name="add" size={24} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={meals}
                renderItem={renderMealCard}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={!loading ? renderEmptyState : null}
                showsVerticalScrollIndicator={false}
            />
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
    title: {
        ...theme.typography.h2,
        color: theme.colors.text,
    },
    addButton: {
        padding: theme.spacing.sm,
    },
    listContainer: {
        padding: theme.spacing.lg,
        flexGrow: 1,
    },
    mealCard: {
        marginBottom: theme.spacing.md,
    },
    mealContent: {
        flex: 1,
    },
    mealHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.sm,
    },
    mealName: {
        ...theme.typography.h3,
        color: theme.colors.text,
        flex: 1,
        marginRight: theme.spacing.sm,
    },
    mealDate: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
    },
    mealDescription: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.sm,
    },
    mealStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.sm,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statText: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
        marginLeft: theme.spacing.xs,
    },
    mealActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingTop: theme.spacing.sm,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    actionButton: {
        padding: theme.spacing.sm,
        marginLeft: theme.spacing.sm,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.xl,
    },
    emptyTitle: {
        ...theme.typography.h2,
        color: theme.colors.text,
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.sm,
    },
    emptySubtitle: {
        ...theme.typography.body1,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
    },
    emptyButton: {
        width: '100%',
        maxWidth: 200,
    },
});

export default MealsScreen;