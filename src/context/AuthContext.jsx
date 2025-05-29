import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api.js';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth должен использоваться внутри AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Проверяем авторизацию при загрузке приложения
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('authToken');
            
            if (token) {
                try {
                    // Пытаемся получить профиль пользователя
                    const userData = await authAPI.getProfile();
                    setUser(userData);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Ошибка при проверке авторизации:', error);
                    // Токен неверный, удаляем его
                    authAPI.logout();
                    setUser(null);
                    setIsAuthenticated(false);
                }
            }
            
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (loginData) => {
        try {
            setLoading(true);
            const response = await authAPI.login(loginData);
            
            // Получаем данные пользователя
            const userData = await authAPI.getProfile();
            
            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('isAuthenticated', 'true');
            
            return { success: true, user: userData };
        } catch (error) {
            console.error('Ошибка входа:', error);
            return { 
                success: false, 
                error: error.message || 'Ошибка входа. Проверьте данные.' 
            };
        } finally {
            setLoading(false);
        }
    };

    const register = async (registerData) => {
        try {
            setLoading(true);
            const response = await authAPI.register(registerData);
            
            // Получаем данные пользователя
            const userData = await authAPI.getProfile();
            
            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('isAuthenticated', 'true');
            
            return { success: true, user: userData };
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            return { 
                success: false, 
                error: error.message || 'Ошибка регистрации. Попробуйте снова.' 
            };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authAPI.logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    const updateUser = async (updatedData) => {
        try {
            const response = await authAPI.updateProfile(updatedData);
            const updatedUser = { ...user, ...response };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return { success: true, user: updatedUser };
        } catch (error) {
            console.error('Ошибка обновления профиля:', error);
            return { 
                success: false, 
                error: error.message || 'Ошибка обновления профиля' 
            };
        }
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        register,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 