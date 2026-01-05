/**
 * Authentication hooks - UI layer interface to auth functionality
 * Wraps auth service and provides React-friendly interface
 */

import React, { useState, useCallback } from 'react';
import { authService } from '@/services/auth.service';
import type { LoginCredentials, RegisterCredentials, AuthError, LoginResult, RegisterResult } from '@/domain/auth';

export interface UseLoginState {
  loading: boolean;
  error: AuthError | null;
  isAuthenticated: boolean;
}

export interface UseLoginActions {
  login: (credentials: LoginCredentials) => Promise<LoginResult | null>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export interface UseLogin extends UseLoginState, UseLoginActions {}

/**
 * Hook for handling user registration functionality
 * Manages register state and provides register action
 */
export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  const register = useCallback(async (credentials: RegisterCredentials): Promise<RegisterResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.register(credentials);

      if (result.success) {
        setIsRegistered(true);
      }

      return result;

    } catch (authError) {
      setError(authError as AuthError);
      setIsRegistered(false);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    isRegistered,
    register,
    clearError
  };
};

/**
 * Hook for handling user login functionality
 * Manages login state and provides login/logout actions
 */
export const useLogin = (): UseLogin => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = useCallback(async (credentials: LoginCredentials): Promise<LoginResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.login(credentials);

      if (result.success && result.token.authenticated) {
        setIsAuthenticated(true);

        // Store token in localStorage if remember me is checked
        if (credentials.remember && result.token.token) {
          localStorage.setItem('authToken', result.token.token);
        }

        // Store in sessionStorage for session-based auth
        if (result.token.token) {
          sessionStorage.setItem('authToken', result.token.token);
        }
      }

      return result;

    } catch (authError) {
      setError(authError as AuthError);
      setIsAuthenticated(false);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);

    try {
      // Get token from storage
      const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');

      if (token) {
        await authService.logout(token);
      }

      // Clear storage
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');

      setIsAuthenticated(false);
      setError(null);

    } catch (error) {
      console.error('Logout error:', error);
      // Clear local state even if logout API fails
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    clearError
  };
};

/**
 * Hook for checking authentication status
 */
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    setLoading(true);

    try {
      const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');

      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      const isValid = await authService.verifyToken(token);
      setIsAuthenticated(isValid);

      if (!isValid) {
        // Clear invalid token
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
      }

    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize auth check on mount
  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    isAuthenticated,
    loading,
    checkAuth
  };
};
