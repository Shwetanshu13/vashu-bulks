'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { authUtils, tokenUtils, userUtils } from '../utils/auth';

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
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check authentication status on mount
        checkAuthStatus();
    }, []);

    const checkAuthStatus = () => {
        try {
            const isValidAuth = authUtils.isAuthenticated();
            const userData = userUtils.getUser();

            if (isValidAuth && userData) {
                setUser(userData);
                setIsAuthenticated(true);
            } else {
                // Clean up invalid data
                authUtils.logout();
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            authUtils.logout();
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const login = (token, userData) => {
        try {
            authUtils.login(token, userData);
            setUser(userData);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = () => {
        try {
            authUtils.logout();
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const updateUser = (userData) => {
        try {
            userUtils.setUser(userData);
            setUser(userData);
        } catch (error) {
            console.error('Update user failed:', error);
        }
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        updateUser,
        checkAuthStatus,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;