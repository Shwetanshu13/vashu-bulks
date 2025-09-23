import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authAPI } from '../utils/api';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthState();
    }, []);

    const checkAuthState = async () => {
        try {
            const token = await SecureStore.getItemAsync('authToken');
            if (token) {
                // Verify token with backend
                const userData = await authAPI.verifyToken(token);
                setUser(userData);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            await SecureStore.deleteItemAsync('authToken');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await authAPI.login(email, password);
            const { token, user: userData } = response;

            await SecureStore.setItemAsync('authToken', token);
            setUser(userData);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const signup = async (userData) => {
        try {
            const response = await authAPI.signup(userData);
            return { success: true, data: response };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Signup failed'
            };
        }
    };

    const forgotPassword = async (email) => {
        try {
            await authAPI.forgotPassword(email);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to send reset email'
            };
        }
    };

    const verifyEmail = async (token) => {
        try {
            const response = await authAPI.verifyEmail(token);
            const { token: authToken, user: userData } = response;

            await SecureStore.setItemAsync('authToken', authToken);
            setUser(userData);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Verification failed'
            };
        }
    };

    const logout = async () => {
        try {
            await SecureStore.deleteItemAsync('authToken');
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const value = {
        user,
        loading,
        login,
        signup,
        logout,
        forgotPassword,
        verifyEmail,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};