/**
 * Authentication Hooks
 *
 * Custom hooks để wrap auth service cho UI components.
 * Provides loading states, error handling, và clean API cho components.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { App } from 'antd';
import authService, { LoginFormData, RegisterFormData } from '../services/auth.service';

export interface UseLoginResult {
  login: (formData: LoginFormData) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export interface UseRegisterResult {
  register: (formData: RegisterFormData) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export interface UseAuthResult {
  isAuthenticated: boolean;
  logout: () => void;
  token: string | null;
  user: any;
}

/**
 * Hook cho login functionality
 */
export const useLogin = (): UseLoginResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { message } = App.useApp();

  const login = async (formData: LoginFormData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.login(formData);

      if (result.authenticated) {
        message.success('Login successful! Welcome back to PawPlanet!');

        // Redirect to main app
        navigate('/my-pets');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed. Please try again.';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loading,
    error
  };
};

/**
 * Hook cho register functionality
 */
export const useRegister = (): UseRegisterResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { message } = App.useApp();

  const register = async (formData: RegisterFormData) => {
    setLoading(true);
    setError(null);

    try {
      await authService.register(formData);

      message.success('Registration successful! Welcome to PawPlanet!');

      // Redirect to login page hoặc automatically log in
      navigate('/login');
    } catch (err: any) {
      const errorMessage = err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    loading,
    error
  };
};

/**
 * Hook cho authentication state management
 */
export const useAuth = (): UseAuthResult => {
  const navigate = useNavigate();
  const { message } = App.useApp();

  const isAuthenticated = authService.isAuthenticated();
  const token = authService.getToken();
  const user = authService.getCurrentUser();

  const logout = () => {
    authService.logout();
    message.success('Logged out successfully');
    navigate('/login');
  };

  return {
    isAuthenticated,
    logout,
    token,
    user
  };
};

/**
 * Hook để check auth status và redirect if needed
 */
export const useAuthGuard = (requireAuth: boolean = true) => {
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();

  React.useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      navigate('/login');
    } else if (!requireAuth && isAuthenticated) {
      navigate('/my-pets');
    }
  }, [isAuthenticated, requireAuth, navigate]);

  return isAuthenticated;
};
