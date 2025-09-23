import React, { useState } from 'react';
import {
    TextInput,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';

const Input = ({
    label,
    placeholder,
    value,
    onChangeText,
    error,
    secureTextEntry = false,
    keyboardType = 'default',
    multiline = false,
    numberOfLines = 1,
    style,
    inputStyle,
    disabled = false,
    leftIcon,
    rightIcon,
    onRightIconPress,
    ...props
}) => {
    const [isSecure, setIsSecure] = useState(secureTextEntry);
    const [isFocused, setIsFocused] = useState(false);

    const handleToggleSecure = () => {
        setIsSecure(!isSecure);
    };

    const renderRightIcon = () => {
        if (secureTextEntry) {
            return (
                <TouchableOpacity onPress={handleToggleSecure}>
                    <Ionicons
                        name={isSecure ? 'eye-off' : 'eye'}
                        size={20}
                        color={theme.colors.textSecondary}
                    />
                </TouchableOpacity>
            );
        }

        if (rightIcon) {
            return (
                <TouchableOpacity onPress={onRightIconPress}>
                    {rightIcon}
                </TouchableOpacity>
            );
        }

        return null;
    };

    return (
        <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View style={[
                styles.inputContainer,
                isFocused && styles.focusedContainer,
                error && styles.errorContainer,
                disabled && styles.disabledContainer,
            ]}>
                {leftIcon && (
                    <View style={styles.leftIconContainer}>
                        {leftIcon}
                    </View>
                )}

                <TextInput
                    style={[
                        styles.input,
                        leftIcon && styles.inputWithLeftIcon,
                        (rightIcon || secureTextEntry) && styles.inputWithRightIcon,
                        multiline && styles.multilineInput,
                        inputStyle,
                    ]}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={isSecure}
                    keyboardType={keyboardType}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    editable={!disabled}
                    placeholderTextColor={theme.colors.textSecondary}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />

                {(rightIcon || secureTextEntry) && (
                    <View style={styles.rightIconContainer}>
                        {renderRightIcon()}
                    </View>
                )}
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing.md,
    },
    label: {
        ...theme.typography.body2,
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
        fontWeight: '600',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.background,
        minHeight: 48,
    },
    focusedContainer: {
        borderColor: theme.colors.primary,
        borderWidth: 2,
    },
    errorContainer: {
        borderColor: theme.colors.error,
    },
    disabledContainer: {
        backgroundColor: theme.colors.surface,
        opacity: 0.7,
    },
    input: {
        flex: 1,
        ...theme.typography.body1,
        color: theme.colors.text,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        textAlignVertical: 'top',
    },
    inputWithLeftIcon: {
        paddingLeft: theme.spacing.xs,
    },
    inputWithRightIcon: {
        paddingRight: theme.spacing.xs,
    },
    multilineInput: {
        minHeight: 80,
    },
    leftIconContainer: {
        paddingLeft: theme.spacing.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightIconContainer: {
        paddingRight: theme.spacing.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        ...theme.typography.caption,
        color: theme.colors.error,
        marginTop: theme.spacing.xs,
    },
});

export default Input;