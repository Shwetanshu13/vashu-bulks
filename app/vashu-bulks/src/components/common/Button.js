import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    View,
} from 'react-native';
import { theme } from '../../styles/theme';

const Button = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    style,
    textStyle,
    ...props
}) => {
    const getButtonStyle = () => {
        const baseStyle = [styles.button];

        // Variant styles
        if (variant === 'primary') {
            baseStyle.push(styles.primaryButton);
        } else if (variant === 'secondary') {
            baseStyle.push(styles.secondaryButton);
        } else if (variant === 'outline') {
            baseStyle.push(styles.outlineButton);
        }

        // Size styles
        if (size === 'small') {
            baseStyle.push(styles.smallButton);
        } else if (size === 'large') {
            baseStyle.push(styles.largeButton);
        }

        // State styles
        if (disabled) {
            baseStyle.push(styles.disabledButton);
        }

        return baseStyle;
    };

    const getTextStyle = () => {
        const baseStyle = [styles.buttonText];

        if (variant === 'primary') {
            baseStyle.push(styles.primaryText);
        } else if (variant === 'secondary') {
            baseStyle.push(styles.secondaryText);
        } else if (variant === 'outline') {
            baseStyle.push(styles.outlineText);
        }

        if (size === 'small') {
            baseStyle.push(styles.smallText);
        } else if (size === 'large') {
            baseStyle.push(styles.largeText);
        }

        if (disabled) {
            baseStyle.push(styles.disabledText);
        }

        return baseStyle;
    };

    return (
        <TouchableOpacity
            style={[...getButtonStyle(), style]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
            {...props}
        >
            <View style={styles.buttonContent}>
                {loading && (
                    <ActivityIndicator
                        size="small"
                        color={variant === 'primary' ? '#FFFFFF' : theme.colors.primary}
                        style={styles.loadingIndicator}
                    />
                )}
                <Text style={[...getTextStyle(), textStyle]}>
                    {title}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: theme.borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        minHeight: 48,
        ...theme.shadows.sm,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        ...theme.typography.body1,
        fontWeight: '600',
        textAlign: 'center',
    },
    loadingIndicator: {
        marginRight: theme.spacing.sm,
    },

    // Variant styles
    primaryButton: {
        backgroundColor: theme.colors.primary,
    },
    secondaryButton: {
        backgroundColor: theme.colors.secondary,
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.primary,
    },

    // Size styles
    smallButton: {
        minHeight: 36,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
    },
    largeButton: {
        minHeight: 56,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
    },

    // Text styles
    primaryText: {
        color: '#FFFFFF',
    },
    secondaryText: {
        color: '#FFFFFF',
    },
    outlineText: {
        color: theme.colors.primary,
    },
    smallText: {
        fontSize: 14,
    },
    largeText: {
        fontSize: 18,
    },

    // Disabled styles
    disabledButton: {
        backgroundColor: theme.colors.disabled,
        shadowOpacity: 0,
        elevation: 0,
    },
    disabledText: {
        color: '#FFFFFF',
    },
});

export default Button;