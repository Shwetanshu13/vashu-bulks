import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { theme } from '../../styles/theme';

const SignupScreen = ({ navigation }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const { signup } = useAuth();

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword.trim()) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignup = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const userData = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim(),
                password: formData.password,
            };

            const result = await signup(userData);
            if (result.success) {
                Alert.alert(
                    'Success',
                    'Account created successfully! Please check your email to verify your account.',
                    [{ text: 'OK', onPress: () => navigation.navigate('Verify') }]
                );
            } else {
                Alert.alert('Signup Failed', result.error);
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Join Vashu Bulks and start your diet journey</Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.nameRow}>
                            <Input
                                label="First Name"
                                placeholder="First name"
                                value={formData.firstName}
                                onChangeText={(value) => updateField('firstName', value)}
                                error={errors.firstName}
                                style={styles.nameInput}
                            />
                            <Input
                                label="Last Name"
                                placeholder="Last name"
                                value={formData.lastName}
                                onChangeText={(value) => updateField('lastName', value)}
                                error={errors.lastName}
                                style={styles.nameInput}
                            />
                        </View>

                        <Input
                            label="Email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChangeText={(value) => updateField('email', value)}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            error={errors.email}
                        />

                        <Input
                            label="Password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChangeText={(value) => updateField('password', value)}
                            secureTextEntry
                            error={errors.password}
                        />

                        <Input
                            label="Confirm Password"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChangeText={(value) => updateField('confirmPassword', value)}
                            secureTextEntry
                            error={errors.confirmPassword}
                        />

                        <Button
                            title="Create Account"
                            onPress={handleSignup}
                            loading={loading}
                            style={styles.signupButton}
                        />
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.loginLink}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: theme.spacing.lg,
    },
    header: {
        alignItems: 'center',
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.lg,
    },
    title: {
        ...theme.typography.h1,
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    subtitle: {
        ...theme.typography.body1,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
    form: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    nameInput: {
        flex: 1,
    },
    signupButton: {
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: theme.spacing.lg,
    },
    footerText: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
    },
    loginLink: {
        ...theme.typography.body2,
        color: theme.colors.primary,
        fontWeight: '600',
    },
});

export default SignupScreen;