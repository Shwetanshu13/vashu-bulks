export const theme = {
    colors: {
        primary: '#2196F3',
        primaryDark: '#1976D2',
        secondary: '#FF9800',
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        background: '#FFFFFF',
        surface: '#F5F5F5',
        text: '#212121',
        textSecondary: '#757575',
        border: '#E0E0E0',
        disabled: '#BDBDBD',
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },
    borderRadius: {
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
    },
    typography: {
        h1: {
            fontSize: 32,
            fontWeight: 'bold',
            lineHeight: 40,
        },
        h2: {
            fontSize: 24,
            fontWeight: 'bold',
            lineHeight: 32,
        },
        h3: {
            fontSize: 20,
            fontWeight: '600',
            lineHeight: 28,
        },
        body1: {
            fontSize: 16,
            fontWeight: 'normal',
            lineHeight: 24,
        },
        body2: {
            fontSize: 14,
            fontWeight: 'normal',
            lineHeight: 20,
        },
        caption: {
            fontSize: 12,
            fontWeight: 'normal',
            lineHeight: 16,
        },
    },
    shadows: {
        sm: {
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.18,
            shadowRadius: 1.0,
            elevation: 1,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        lg: {
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.30,
            shadowRadius: 4.65,
            elevation: 8,
        },
    },
};