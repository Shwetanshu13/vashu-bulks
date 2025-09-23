import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingScreen from '../LoadingScreen';
import { theme } from '../../styles/theme';
import { mealsAPI } from '../../utils/api';

const MealDetailScreen = ({ navigation, route }) => {
    const { mealId } = route.params;
    const [meal, setMeal] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMealDetails();
    }, [mealId]);

    const loadMealDetails = async () => {
        try {
            const mealData = await mealsAPI.getMeal(mealId);
            setMeal(mealData);
        } catch (error) {
            Alert.alert('Error', 'Failed to load meal details');
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        navigation.navigate('AddMeal', { mealId });
    };

    const handleDelete = () => {
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
                            navigation.goBack();
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete meal');
                        }
                    },
                },
            ]
        );
    };

    if (loading) {
        return <LoadingScreen />;
    }

    if (!meal) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Meal not found</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Meal Details</Text>
                <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
                    <Ionicons name="create-outline" size={24} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Meal Image */}
                {meal.imageUrl && (
                    <Card style={styles.imageCard}>
                        <Image source={{ uri: meal.imageUrl }} style={styles.mealImage} />
                    </Card>
                )}

                {/* Basic Information */}
                <Card style={styles.section}>
                    <Text style={styles.mealName}>{meal.name}</Text>
                    {meal.description && (
                        <Text style={styles.mealDescription}>{meal.description}</Text>
                    )}
                    <View style={styles.metaInfo}>
                        <View style={styles.metaItem}>
                            <Ionicons name="calendar" size={16} color={theme.colors.textSecondary} />
                            <Text style={styles.metaText}>
                                {new Date(meal.createdAt).toLocaleDateString()}
                            </Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Ionicons name="time" size={16} color={theme.colors.textSecondary} />
                            <Text style={styles.metaText}>
                                {new Date(meal.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* Nutrition Information */}
                <Card title="Nutrition Information" style={styles.section}>
                    <View style={styles.nutritionGrid}>
                        <View style={styles.nutritionItem}>
                            <Text style={styles.nutritionValue}>
                                {meal.calories || 0}
                            </Text>
                            <Text style={styles.nutritionLabel}>Calories</Text>
                        </View>
                        <View style={styles.nutritionItem}>
                            <Text style={styles.nutritionValue}>
                                {meal.protein || 0}g
                            </Text>
                            <Text style={styles.nutritionLabel}>Protein</Text>
                        </View>
                        <View style={styles.nutritionItem}>
                            <Text style={styles.nutritionValue}>
                                {meal.carbs || 0}g
                            </Text>
                            <Text style={styles.nutritionLabel}>Carbs</Text>
                        </View>
                        <View style={styles.nutritionItem}>
                            <Text style={styles.nutritionValue}>
                                {meal.fat || 0}g
                            </Text>
                            <Text style={styles.nutritionLabel}>Fat</Text>
                        </View>
                    </View>

                    {/* Macros Breakdown */}
                    {(meal.protein || meal.carbs || meal.fat) && (
                        <View style={styles.macrosBreakdown}>
                            <Text style={styles.macrosTitle}>Macronutrients</Text>
                            <View style={styles.macrosBar}>
                                {meal.protein > 0 && (
                                    <View
                                        style={[
                                            styles.macroSegment,
                                            styles.proteinSegment,
                                            { flex: meal.protein }
                                        ]}
                                    />
                                )}
                                {meal.carbs > 0 && (
                                    <View
                                        style={[
                                            styles.macroSegment,
                                            styles.carbsSegment,
                                            { flex: meal.carbs }
                                        ]}
                                    />
                                )}
                                {meal.fat > 0 && (
                                    <View
                                        style={[
                                            styles.macroSegment,
                                            styles.fatSegment,
                                            { flex: meal.fat }
                                        ]}
                                    />
                                )}
                            </View>
                            <View style={styles.macrosLegend}>
                                {meal.protein > 0 && (
                                    <View style={styles.legendItem}>
                                        <View style={[styles.legendColor, styles.proteinSegment]} />
                                        <Text style={styles.legendText}>Protein</Text>
                                    </View>
                                )}
                                {meal.carbs > 0 && (
                                    <View style={styles.legendItem}>
                                        <View style={[styles.legendColor, styles.carbsSegment]} />
                                        <Text style={styles.legendText}>Carbs</Text>
                                    </View>
                                )}
                                {meal.fat > 0 && (
                                    <View style={styles.legendItem}>
                                        <View style={[styles.legendColor, styles.fatSegment]} />
                                        <Text style={styles.legendText}>Fat</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    )}
                </Card>

                {/* Actions */}
                <View style={styles.actions}>
                    <Button
                        title="Edit Meal"
                        onPress={handleEdit}
                        style={styles.editMealButton}
                    />
                    <Button
                        title="Delete Meal"
                        variant="outline"
                        onPress={handleDelete}
                        style={styles.deleteButton}
                    />
                </View>
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
    backButton: {
        padding: theme.spacing.sm,
    },
    title: {
        ...theme.typography.h2,
        color: theme.colors.text,
    },
    editButton: {
        padding: theme.spacing.sm,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: theme.spacing.lg,
    },
    imageCard: {
        padding: 0,
        marginBottom: theme.spacing.lg,
    },
    mealImage: {
        width: '100%',
        height: 200,
        borderRadius: theme.borderRadius.lg,
    },
    section: {
        marginBottom: theme.spacing.lg,
    },
    mealName: {
        ...theme.typography.h2,
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    mealDescription: {
        ...theme.typography.body1,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.md,
        lineHeight: 24,
    },
    metaInfo: {
        flexDirection: 'row',
        gap: theme.spacing.lg,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
        marginLeft: theme.spacing.xs,
    },
    nutritionGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: theme.spacing.lg,
    },
    nutritionItem: {
        alignItems: 'center',
    },
    nutritionValue: {
        ...theme.typography.h2,
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
    nutritionLabel: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.xs,
    },
    macrosBreakdown: {
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
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: theme.spacing.sm,
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
        flexDirection: 'row',
        justifyContent: 'center',
        gap: theme.spacing.md,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: theme.spacing.xs,
    },
    legendText: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
    },
    actions: {
        gap: theme.spacing.md,
        marginTop: theme.spacing.lg,
    },
    editMealButton: {
        marginBottom: theme.spacing.sm,
    },
    deleteButton: {
        borderColor: theme.colors.error,
    },
});

export default MealDetailScreen;