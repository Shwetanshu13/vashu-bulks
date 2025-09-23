import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingScreen from '../LoadingScreen';
import { theme } from '../../styles/theme';
import { aiAPI } from '../../utils/api';

const AIAnalysisScreen = ({ navigation }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please grant camera roll permissions to select photos');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0]);
            setAnalysisResult(null);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please grant camera permissions to take photos');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0]);
            setAnalysisResult(null);
        }
    };

    const showImagePicker = () => {
        Alert.alert(
            'Select Photo',
            'Choose how you want to add a photo for analysis',
            [
                { text: 'Camera', onPress: takePhoto },
                { text: 'Photo Library', onPress: pickImage },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    };

    const analyzeImage = async () => {
        if (!selectedImage) {
            Alert.alert('No Image', 'Please select an image first');
            return;
        }

        setLoading(true);
        try {
            const result = await aiAPI.analyzeMeal(selectedImage);
            setAnalysisResult(result);
        } catch (error) {
            Alert.alert('Analysis Failed', 'Failed to analyze the image. Please try again.');
            console.error('AI Analysis error:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveAsNewMeal = () => {
        if (!analysisResult) return;

        navigation.navigate('Meals', {
            screen: 'AddMeal',
            params: {
                aiAnalysis: {
                    name: analysisResult.foodName,
                    calories: analysisResult.nutrition?.calories,
                    protein: analysisResult.nutrition?.protein,
                    carbs: analysisResult.nutrition?.carbs,
                    fat: analysisResult.nutrition?.fat,
                    image: selectedImage,
                }
            }
        });
    };

    if (loading) {
        return <LoadingScreen message="Analyzing your meal..." />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>AI Meal Analysis</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('AISuggestions')}
                    style={styles.suggestionsButton}
                >
                    <Ionicons name="bulb-outline" size={24} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Image Selection */}
                <Card title="Upload Meal Photo" style={styles.card}>
                    <TouchableOpacity style={styles.imageContainer} onPress={showImagePicker}>
                        {selectedImage ? (
                            <Image source={{ uri: selectedImage.uri }} style={styles.selectedImage} />
                        ) : (
                            <View style={styles.imagePlaceholder}>
                                <Ionicons name="camera" size={48} color={theme.colors.textSecondary} />
                                <Text style={styles.imagePlaceholderText}>
                                    Tap to select or take a photo
                                </Text>
                                <Text style={styles.imagePlaceholderSubtext}>
                                    AI will analyze your meal's nutrition
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {selectedImage && (
                        <View style={styles.imageActions}>
                            <Button
                                title="Change Photo"
                                variant="outline"
                                onPress={showImagePicker}
                                style={styles.changeButton}
                            />
                            <Button
                                title="Analyze Meal"
                                onPress={analyzeImage}
                                style={styles.analyzeButton}
                            />
                        </View>
                    )}
                </Card>

                {/* Analysis Results */}
                {analysisResult && (
                    <>
                        <Card title="Analysis Results" style={styles.card}>
                            <View style={styles.resultHeader}>
                                <Text style={styles.foodName}>{analysisResult.foodName}</Text>
                                <View style={styles.confidenceContainer}>
                                    <Text style={styles.confidenceLabel}>Confidence:</Text>
                                    <Text style={styles.confidenceValue}>
                                        {Math.round(analysisResult.confidence * 100)}%
                                    </Text>
                                </View>
                            </View>

                            {analysisResult.description && (
                                <Text style={styles.foodDescription}>
                                    {analysisResult.description}
                                </Text>
                            )}

                            {/* Nutrition Information */}
                            {analysisResult.nutrition && (
                                <View style={styles.nutritionSection}>
                                    <Text style={styles.nutritionTitle}>Estimated Nutrition</Text>
                                    <View style={styles.nutritionGrid}>
                                        <View style={styles.nutritionItem}>
                                            <Text style={styles.nutritionValue}>
                                                {analysisResult.nutrition.calories || 0}
                                            </Text>
                                            <Text style={styles.nutritionLabel}>Calories</Text>
                                        </View>
                                        <View style={styles.nutritionItem}>
                                            <Text style={styles.nutritionValue}>
                                                {analysisResult.nutrition.protein || 0}g
                                            </Text>
                                            <Text style={styles.nutritionLabel}>Protein</Text>
                                        </View>
                                        <View style={styles.nutritionItem}>
                                            <Text style={styles.nutritionValue}>
                                                {analysisResult.nutrition.carbs || 0}g
                                            </Text>
                                            <Text style={styles.nutritionLabel}>Carbs</Text>
                                        </View>
                                        <View style={styles.nutritionItem}>
                                            <Text style={styles.nutritionValue}>
                                                {analysisResult.nutrition.fat || 0}g
                                            </Text>
                                            <Text style={styles.nutritionLabel}>Fat</Text>
                                        </View>
                                    </View>
                                </View>
                            )}

                            {/* Ingredients */}
                            {analysisResult.ingredients && analysisResult.ingredients.length > 0 && (
                                <View style={styles.ingredientsSection}>
                                    <Text style={styles.ingredientsTitle}>Detected Ingredients</Text>
                                    <View style={styles.ingredientsList}>
                                        {analysisResult.ingredients.map((ingredient, index) => (
                                            <View key={index} style={styles.ingredientTag}>
                                                <Text style={styles.ingredientText}>{ingredient}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}
                        </Card>

                        {/* Actions */}
                        <View style={styles.actions}>
                            <Button
                                title="Save as New Meal"
                                onPress={saveAsNewMeal}
                                style={styles.saveButton}
                            />
                            <Button
                                title="Get Meal Suggestions"
                                variant="outline"
                                onPress={() => navigation.navigate('AISuggestions', {
                                    currentMeal: analysisResult.foodName
                                })}
                                style={styles.suggestionsActionButton}
                            />
                        </View>
                    </>
                )}

                {/* Tips */}
                <Card title="Tips for Better Analysis" style={styles.card}>
                    <View style={styles.tipsList}>
                        <View style={styles.tipItem}>
                            <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
                            <Text style={styles.tipText}>
                                Ensure good lighting when taking photos
                            </Text>
                        </View>
                        <View style={styles.tipItem}>
                            <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
                            <Text style={styles.tipText}>
                                Include the entire meal in the frame
                            </Text>
                        </View>
                        <View style={styles.tipItem}>
                            <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
                            <Text style={styles.tipText}>
                                Avoid blurry or angled shots
                            </Text>
                        </View>
                        <View style={styles.tipItem}>
                            <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
                            <Text style={styles.tipText}>
                                Show portion sizes clearly
                            </Text>
                        </View>
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
    suggestionsButton: {
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
    imageContainer: {
        marginBottom: theme.spacing.md,
    },
    selectedImage: {
        width: '100%',
        height: 200,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.surface,
    },
    imagePlaceholder: {
        width: '100%',
        height: 200,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.surface,
        borderWidth: 2,
        borderColor: theme.colors.border,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePlaceholderText: {
        ...theme.typography.body1,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.sm,
        textAlign: 'center',
    },
    imagePlaceholderSubtext: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.xs,
        textAlign: 'center',
    },
    imageActions: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    changeButton: {
        flex: 1,
    },
    analyzeButton: {
        flex: 1,
    },
    resultHeader: {
        marginBottom: theme.spacing.md,
    },
    foodName: {
        ...theme.typography.h2,
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    confidenceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    confidenceLabel: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
        marginRight: theme.spacing.xs,
    },
    confidenceValue: {
        ...theme.typography.body2,
        color: theme.colors.primary,
        fontWeight: '600',
    },
    foodDescription: {
        ...theme.typography.body1,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.md,
        lineHeight: 24,
    },
    nutritionSection: {
        marginTop: theme.spacing.md,
    },
    nutritionTitle: {
        ...theme.typography.body1,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    nutritionGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    nutritionItem: {
        alignItems: 'center',
    },
    nutritionValue: {
        ...theme.typography.h3,
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
    nutritionLabel: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.xs,
    },
    ingredientsSection: {
        marginTop: theme.spacing.lg,
    },
    ingredientsTitle: {
        ...theme.typography.body1,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    ingredientsList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
    },
    ingredientTag: {
        backgroundColor: theme.colors.surface,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.sm,
    },
    ingredientText: {
        ...theme.typography.body2,
        color: theme.colors.text,
    },
    actions: {
        gap: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },
    saveButton: {
        marginBottom: theme.spacing.sm,
    },
    suggestionsActionButton: {
        borderColor: theme.colors.primary,
    },
    tipsList: {
        gap: theme.spacing.sm,
    },
    tipItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tipText: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
        marginLeft: theme.spacing.sm,
        flex: 1,
    },
});

export default AIAnalysisScreen;