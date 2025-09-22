const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// API utility functions
export const authAPI = {
    async signup(userData) {
        const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Signup failed');
        }

        return data;
    },

    async login(credentials) {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        return data;
    },

    async verifyEmail(token) {
        const response = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Email verification failed');
        }

        return data;
    },

    async resendVerification(email) {
        const response = await fetch(`${API_BASE_URL}/api/auth/resend-verification`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to resend verification');
        }

        return data;
    },
};

// Token management utilities
export const tokenUtils = {
    setToken(token) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', token);
        }
    },

    getToken() {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('auth_token');
        }
        return null;
    },

    removeToken() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
        }
    },

    isTokenValid() {
        const token = this.getToken();
        if (!token) return false;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 > Date.now();
        } catch {
            return false;
        }
    },
};

// User data utilities
export const userUtils = {
    setUser(user) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('user_data', JSON.stringify(user));
        }
    },

    getUser() {
        if (typeof window !== 'undefined') {
            const userData = localStorage.getItem('user_data');
            return userData ? JSON.parse(userData) : null;
        }
        return null;
    },

    removeUser() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('user_data');
        }
    },
};

// Form validation utilities
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password) => {
    if (password.length < 6) {
        return 'Password must be at least 6 characters long';
    }
    return null;
};

export const validateName = (name) => {
    if (!name || name.trim().length < 2) {
        return 'Name must be at least 2 characters long';
    }
    return null;
};

// Auth state management
export const authUtils = {
    isAuthenticated() {
        return tokenUtils.isTokenValid() && userUtils.getUser() !== null;
    },

    logout() {
        tokenUtils.removeToken();
        userUtils.removeUser();
    },

    login(token, user) {
        tokenUtils.setToken(token);
        userUtils.setUser(user);
    },
};