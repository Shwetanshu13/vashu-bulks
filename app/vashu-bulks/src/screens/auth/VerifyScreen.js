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

const VerifyScreen = ({ navigation, route }) => {
    const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(false);

    const { verifyEmail } = useAuth();
    const email = route?.params?.email || '';

    const handleVerify = async () => {
        if (!verificationCode.trim()) {
            Alert.alert('Error', 'Please enter the verification code');
            return;
        }

        setLoading(true);
        try {
            const result = await verifyEmail(verificationCode.trim());
            if (result.success) {
                Alert.alert(
                    'Success',
                    'Your account has been verified successfully!',
                    [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
                );
            } else {
                Alert.alert('Verification Failed', result.error);
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        // This would typically call a resend verification API
        Alert.alert(
            'Code Resent',
            'A new verification code has been sent to your email'
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Verify Your Email</Text>
                    <Text style={styles.subtitle}>
                        We've sent a verification code to{'\n'}
                        {email || 'your email address'}
                    </Text>
                </View>

                <View style={styles.form}>
                    <Input
                        label="Verification Code"
                        placeholder="Enter 6-digit code"
                        value={verificationCode}
                        onChangeText={setVerificationCode}
                        keyboardType="number-pad"
                        maxLength={6}
                    />

                    <Button
                        title="Verify Account"
                        onPress={handleVerify}
                        loading={loading}
                        style={styles.verifyButton}
                    />

                    <TouchableOpacity
                        style={styles.resendButton}
                        onPress={handleResendCode}
                    >
                        <Text style={styles.resendText}>Didn't receive code? Resend</Text>
                    </TouchableOpacity>
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
    verifyButton: {
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },
    resendButton: {
        alignSelf: 'center',
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

export default VerifyScreen;