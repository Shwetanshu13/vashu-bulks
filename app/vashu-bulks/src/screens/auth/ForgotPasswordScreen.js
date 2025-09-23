import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { theme } from '../../styles/theme';

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const { forgotPassword } = useAuth();

    const handleResetPassword = async () => {
        if (!email.trim()) {
            Alert.alert('Error', 'Please enter your email address');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        setLoading(true);
        try {
            const result = await forgotPassword(email.trim());
            if (result.success) {
                setEmailSent(true);
            } else {
                Alert.alert('Error', result.error);
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (emailSent) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Check Your Email</Text>
                        <Text style={styles.subtitle}>
                            We've sent a password reset link to {email}
                        </Text>
                    </View>

                    <View style={styles.actions}>
                        <Button
                            title="Back to Login"
                            onPress={() => navigation.navigate('Login')}
                            style={styles.button}
                        />
                        <TouchableOpacity
                            style={styles.resendButton}
                            onPress={() => setEmailSent(false)}
                        >
                            <Text style={styles.resendText}>Didn't receive email? Try again</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Reset Password</Text>
                    <Text style={styles.subtitle}>
                        Enter your email address and we'll send you a link to reset your password
                    </Text>
                </View>

                <View style={styles.form}>
                    <Input
                        label="Email"
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Button
                        title="Send Reset Link"
                        onPress={handleResetPassword}
                        loading={loading}
                        style={styles.button}
                    />
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.backLink}>Back to Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.lg,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },
    title: {
        ...theme.typography.h1,
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    subtitle: {
        ...theme.typography.body1,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    form: {
        marginBottom: theme.spacing.xl,
    },
    button: {
        marginTop: theme.spacing.md,
    },
    actions: {
        alignItems: 'center',
    },
    resendButton: {
        marginTop: theme.spacing.md,
    },
    resendText: {
        ...theme.typography.body2,
        color: theme.colors.primary,
    },
    footer: {
        alignItems: 'center',
    },
    backLink: {
        ...theme.typography.body2,
        color: theme.colors.primary,
        fontWeight: '600',
    },
});

export default ForgotPasswordScreen;