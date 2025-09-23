import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

const Card = ({
    children,
    title,
    subtitle,
    style,
    headerStyle,
    contentStyle,
    ...props
}) => {
    return (
        <View style={[styles.card, style]} {...props}>
            {(title || subtitle) && (
                <View style={[styles.header, headerStyle]}>
                    {title && <Text style={styles.title}>{title}</Text>}
                    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                </View>
            )}
            <View style={[styles.content, contentStyle]}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.lg,
        ...theme.shadows.md,
        marginBottom: theme.spacing.md,
    },
    header: {
        paddingHorizontal: theme.spacing.md,
        paddingTop: theme.spacing.md,
        paddingBottom: theme.spacing.sm,
    },
    title: {
        ...theme.typography.h3,
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    subtitle: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
    },
    content: {
        padding: theme.spacing.md,
    },
});

export default Card;