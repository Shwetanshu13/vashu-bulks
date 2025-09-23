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
import Button from '../../components/common/Button';
import { theme } from '../../styles/theme';
import { aiAPI } from '../../utils/api';

const AISuggestionsScreen = ({ navigation, route }) => {
    const currentMeal = route?.params?.currentMeal;
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [preferences, setPreferences] = useState({
        dietaryRestrictions: [],
        cuisineTypes: [],
        mealType: 'all',
    });

    useEffect(() => {
        loadSuggestions();
    }, []);

    const loadSuggestions = async () => {
        setLoading(true);
        try {
            const response = await aiAPI.getMealSuggestions({
                ...preferences,
                currentMeal,
            });
            setSuggestions(response.suggestions || []);
        } catch (error) {
            console.error('Error loading suggestions:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadSuggestions();
        setRefreshing(false);
    };

    const handleCreateMeal = (suggestion) => {
        navigation.navigate('Meals', {
            screen: 'AddMeal',
            params: {
                aiSuggestion: {
                    name: suggestion.name,
                    description: suggestion.description,
                    calories: suggestion.nutrition?.calories,
                    protein: suggestion.nutrition?.protein,
                    carbs: suggestion.nutrition?.carbs,
                    fat: suggestion.nutrition?.fat,
                }
            }
        });
    };

    const renderSuggestionCard = (suggestion, index) => (
        <Card key={index} style={styles.suggestionCard}>
            <View style={styles.suggestionHeader}>
                <Text style={styles.suggestionName}>{suggestion.name}</Text>
                {suggestion.difficulty && (
                    <View style={styles.difficultyContainer}>
                        <Text style={styles.difficultyText}>{suggestion.difficulty}</Text>
                    </View>
                )}
            </View>

            {suggestion.description && (
                <Text style={styles.suggestionDescription}>
                    {suggestion.description}
                </Text>
            )}

            {/* Nutrition Info */}
            {suggestion.nutrition && (
                <View style={styles.nutritionPreview}>
                    <View style={styles.nutritionItem}>
                        <Ionicons name="flame" size={16} color={theme.colors.primary} />
                        <Text style={styles.nutritionText}>
                            {suggestion.nutrition.calories} cal
                        </Text>
                    </View>
                    <View style={styles.nutritionItem}>
                        <Ionicons name="fitness" size={16} color={theme.colors.success} />
                        <Text style={styles.nutritionText}>
                            {suggestion.nutrition.protein}g protein
                        </Text>
                    </View>
                </View>
            )}

            {/* Tags */}
            {suggestion.tags && suggestion.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                    {suggestion.tags.slice(0, 3).map((tag, tagIndex) => (
                        <View key={tagIndex} style={styles.tag}>
                            <Text style={styles.tagText}>{tag}</Text>
                        </View>
                    ))}
                    {suggestion.tags.length > 3 && (
                        <Text style={styles.moreTagsText}>
                            +{suggestion.tags.length - 3} more
                        </Text>
                    )}
                </View>
            )}

            {/* Cooking Time */}
            {suggestion.cookingTime && (
                <View style={styles.timeContainer}>
                    <Ionicons name="time" size={16} color={theme.colors.textSecondary} />
                    <Text style={styles.timeText}>{suggestion.cookingTime} minutes</Text>
                </View>
            )}

            {/* Actions */}
            <View style={styles.suggestionActions}>
                <Button
                    title="Create Meal"
                    onPress={() => handleCreateMeal(suggestion)}
                    style={styles.createButton}
                />
                {suggestion.recipe && (
                    <TouchableOpacity style={styles.viewRecipeButton}>
                        <Ionicons name="book-outline" size={20} color={theme.colors.primary} />
                        <Text style={styles.viewRecipeText}>Recipe</Text>
                    </TouchableOpacity>
                )}
            </View>
        </Card>
    );

    const renderPreferences = () => (
        <Card title="Preferences" style={styles.card}>
            <View style={styles.preferencesContainer}>
                <View style={styles.preferenceSection}>
                    <Text style={styles.preferenceLabel}>Meal Type</Text>
                    <View style={styles.preferenceOptions}>
                        {['all', 'breakfast', 'lunch', 'dinner', 'snack'].map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={[
                                    styles.preferenceOption,
                                    preferences.mealType === type && styles.preferenceOptionActive
                                ]}
                                onPress={() => setPreferences(prev => ({ ...prev, mealType: type }))}
                            >
                                <Text style={[
                                    styles.preferenceOptionText,
                                    preferences.mealType === type && styles.preferenceOptionTextActive
                                ]}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <Button
                    title="Update Suggestions"
                    onPress={loadSuggestions}
                    loading={loading}
                    style={styles.updateButton}
                />
            </View>
        </Card>
    );

    const renderEmptyState = () => (
        <Card style={styles.emptyCard}>
            <View style={styles.emptyContainer}>
                <Ionicons name="restaurant-outline" size={64} color={theme.colors.textSecondary} />
                <Text style={styles.emptyTitle}>No suggestions yet</Text>
                <Text style={styles.emptySubtitle}>
                    {currentMeal
                        ? `Get personalized meal suggestions based on "${currentMeal}"`
                        : 'Get personalized meal suggestions based on your preferences'
                    }
                </Text>
                <Button
                    title="Get Suggestions"
                    onPress={loadSuggestions}
                    loading={loading}
                    style={styles.getSuggestionsButton}
                />
            </View>
        </Card>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>AI Suggestions</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {currentMeal && (
                    <Card style={styles.contextCard}>
                        <Text style={styles.contextText}>
                            Suggestions based on: <Text style={styles.contextMeal}>{currentMeal}</Text>
                        </Text>
                    </Card>
                )}

                {renderPreferences()}

                {suggestions.length > 0 ? (
                    <>
                        <Text style={styles.suggestionsTitle}>
                            Recommended for you ({suggestions.length})
                        </Text>
                        {suggestions.map((suggestion, index) =>
                            renderSuggestionCard(suggestion, index)
                        )}
                    </>
                ) : !loading ? (
                    renderEmptyState()
                ) : null}
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
    placeholder: {
        width: 40,
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
    contextCard: {
        backgroundColor: theme.colors.primary + '10',
        borderColor: theme.colors.primary,
        borderWidth: 1,
        marginBottom: theme.spacing.lg,
    },
    contextText: {
        ...theme.typography.body1,
        color: theme.colors.text,
    },
    contextMeal: {
        fontWeight: '600',
        color: theme.colors.primary,
    },
    preferencesContainer: {
        gap: theme.spacing.md,
    },
    preferenceSection: {
        marginBottom: theme.spacing.md,
    },
    preferenceLabel: {
        ...theme.typography.body1,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    preferenceOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
    },
    preferenceOption: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    preferenceOptionActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    preferenceOptionText: {
        ...theme.typography.body2,
        color: theme.colors.text,
    },
    preferenceOptionTextActive: {
        color: '#FFFFFF',
    },
    updateButton: {
        marginTop: theme.spacing.sm,
    },
    suggestionsTitle: {
        ...theme.typography.h3,
        color: theme.colors.text,
        marginBottom: theme.spacing.lg,
    },
    suggestionCard: {
        marginBottom: theme.spacing.lg,
    },
    suggestionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.sm,
    },
    suggestionName: {
        ...theme.typography.h3,
        color: theme.colors.text,
        flex: 1,
        marginRight: theme.spacing.sm,
    },
    difficultyContainer: {
        backgroundColor: theme.colors.secondary,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.sm,
    },
    difficultyText: {
        ...theme.typography.caption,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    suggestionDescription: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.md,
        lineHeight: 20,
    },
    nutritionPreview: {
        flexDirection: 'row',
        gap: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    nutritionItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nutritionText: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
        marginLeft: theme.spacing.xs,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.md,
    },
    tag: {
        backgroundColor: theme.colors.surface,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.sm,
    },
    tagText: {
        ...theme.typography.caption,
        color: theme.colors.text,
    },
    moreTagsText: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        alignSelf: 'center',
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    timeText: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
        marginLeft: theme.spacing.xs,
    },
    suggestionActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: theme.spacing.md,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    createButton: {
        flex: 1,
        marginRight: theme.spacing.md,
    },
    viewRecipeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.sm,
    },
    viewRecipeText: {
        ...theme.typography.body2,
        color: theme.colors.primary,
        marginLeft: theme.spacing.xs,
    },
    emptyCard: {
        padding: theme.spacing.xl,
    },
    emptyContainer: {
        alignItems: 'center',
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
    getSuggestionsButton: {
        width: '100%',
        maxWidth: 200,
    },
});

export default AISuggestionsScreen;