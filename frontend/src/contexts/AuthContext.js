import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored token on mount
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            try {
                const decoded = jwtDecode(token);

                // Check if token is expired
                if (decoded.exp * 1000 < Date.now()) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setLoading(false);
                    return;
                }

                // Set token in API headers
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                // Set user from localStorage
                setUser(JSON.parse(storedUser));
                setLoading(false);
            } catch (error) {
                console.error('Invalid token:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });

            // Extract token and user from response.data.data
            const token = response.data.data.token;
            const user = response.data.data.user;

            // Store token and user in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            // Set token in API headers
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Set user in state
            setUser(user);

            return { success: true };
        } catch (error) {
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);

            // Extract token and user from response.data.data
            const token = response.data.data.token;
            const user = response.data.data.user || {
                userId: response.data.data.userId,
                email: response.data.data.email,
                firstName: response.data.data.firstName,
                lastName: response.data.data.lastName,
                role: response.data.data.role
            };

            // Store token and user in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            // Set token in API headers
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Set user in state
            setUser(user);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Registration failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
