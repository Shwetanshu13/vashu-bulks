import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import { theme } from '../../styles/theme';
import { mealsAPI } from '../../utils/api';

const AddMealScreen = ({ navigation, route }) => {
    const mealId = route?.params?.mealId;
    const isEditing = !!mealId;

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        image: null,
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isEditing) {
            loadMealData();
        }
    }, [mealId]);

    const loadMealData = async () => {
        try {
            const meal = await mealsAPI.getMeal(mealId);
            setFormData({
                name: meal.name || '',
                description: meal.description || '',
                calories: meal.calories?.toString() || '',
                protein: meal.protein?.toString() || '',
                carbs: meal.carbs?.toString() || '',
                fat: meal.fat?.toString() || '',
                image: meal.imageUrl ? { uri: meal.imageUrl } : null,
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to load meal data');
            navigation.goBack();
        }
    };

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Meal name is required';
        }

        if (formData.calories && isNaN(Number(formData.calories))) {
            newErrors.calories = 'Calories must be a number';
        }

        if (formData.protein && isNaN(Number(formData.protein))) {
            newErrors.protein = 'Protein must be a number';
        }

        if (formData.carbs && isNaN(Number(formData.carbs))) {
            newErrors.carbs = 'Carbs must be a number';
        }

        if (formData.fat && isNaN(Number(formData.fat))) {
            newErrors.fat = 'Fat must be a number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please grant camera roll permissions to add photos');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setFormData(prev => ({ ...prev, image: result.assets[0] }));
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
            setFormData(prev => ({ ...prev, image: result.assets[0] }));
        }
    };

    const showImagePicker = () => {
        Alert.alert(
            'Add Photo',
            'Choose how you want to add a photo',
            [
                { text: 'Camera', onPress: takePhoto },
                { text: 'Photo Library', onPress: pickImage },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            let imageUrl = null;

            // Upload image if one was selected
            if (formData.image && !formData.image.uri.startsWith('http')) {
                const imageResponse = await mealsAPI.uploadMealImage(formData.image);
                imageUrl = imageResponse.imageUrl;
            }

            const mealData = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                calories: formData.calories ? Number(formData.calories) : null,
                protein: formData.protein ? Number(formData.protein) : null,
                carbs: formData.carbs ? Number(formData.carbs) : null,
                fat: formData.fat ? Number(formData.fat) : null,
                imageUrl: imageUrl || formData.image?.uri,
            };

            if (isEditing) {
                await mealsAPI.updateMeal(mealId, mealData);
                Alert.alert('Success', 'Meal updated successfully');
            } else {
                await mealsAPI.createMeal(mealData);
                Alert.alert('Success', 'Meal added successfully');
            }

            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to save meal');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>
                    {isEditing ? 'Edit Meal' : 'Add Meal'}
                </Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <Card style={styles.section}>
                    <Input
                        label="Meal Name *"
                        placeholder="e.g., Grilled Chicken Salad"
                        value={formData.name}
                        onChangeText={(value) => updateField('name', value)}
                        error={errors.name}
                    />

                    <Input
                        label="Description"
                        placeholder="Describe your meal..."
                        value={formData.description}
                        onChangeText={(value) => updateField('description', value)}
                        multiline
                        numberOfLines={3}
                    />

                    {/* Image Section */}
                    <Text style={styles.sectionTitle}>Photo</Text>
                    <TouchableOpacity style={styles.imageContainer} onPress={showImagePicker}>
                        {formData.image ? (
                            <Image source={{ uri: formData.image.uri }} style={styles.mealImage} />
                        ) : (
                            <View style={styles.imagePlaceholder}>
                                <Ionicons name="camera" size={48} color={theme.colors.textSecondary} />
                                <Text style={styles.imagePlaceholderText}>Add Photo</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </Card>

                <Card title="Nutrition Information" style={styles.section}>
                    <View style={styles.nutritionRow}>
                        <Input
                            label="Calories"
                            placeholder="0"
                            value={formData.calories}
                            onChangeText={(value) => updateField('calories', value)}
                            keyboardType="numeric"
                            style={styles.nutritionInput}
                            error={errors.calories}
                        />
                        <Input
                            label="Protein (g)"
                            placeholder="0"
                            value={formData.protein}
                            onChangeText={(value) => updateField('protein', value)}
                            keyboardType="numeric"
                            style={styles.nutritionInput}
                            error={errors.protein}
                        />
                    </View>

                    <View style={styles.nutritionRow}>
                        <Input
                            label="Carbs (g)"
                            placeholder="0"
                            value={formData.carbs}
                            onChangeText={(value) => updateField('carbs', value)}
                            keyboardType="numeric"
                            style={styles.nutritionInput}
                            error={errors.carbs}
                        />
                        <Input
                            label="Fat (g)"
                            placeholder="0"
                            value={formData.fat}
                            onChangeText={(value) => updateField('fat', value)}
                            keyboardType="numeric"
                            style={styles.nutritionInput}
                            error={errors.fat}
                        />
                    </View>
                </Card>

                <Button
                    title={isEditing ? 'Update Meal' : 'Save Meal'}
                    onPress={handleSave}
                    loading={loading}
                    style={styles.saveButton}
                />
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
    section: {
        marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
        ...theme.typography.body1,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    imageContainer: {
        marginBottom: theme.spacing.md,
    },
    mealImage: {
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
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.sm,
    },
    nutritionRow: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    nutritionInput: {
        flex: 1,
    },
    saveButton: {
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.xl,
    },
});

export default AddMealScreen;