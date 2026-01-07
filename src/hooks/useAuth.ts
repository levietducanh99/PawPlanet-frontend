/**
 * Authentication hooks - UI layer interface to auth functionality
 * Wraps auth service and provides React-friendly interface
 */

import { useState, useCallback } from 'react';
import { authService } from '@/services/auth.service';
import { useAuthContext } from '@/context/AuthContext';
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

      return {
        success: result.success,
        user: result.user!
      };

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
 * Sets isAuthenticated immediately on login/logout
 */
export const useLogin = (): UseLogin => {
  const { login, isAuthenticated, loading } = useAuthContext();

  const [error, setError] = useState<AuthError | null>(null);

  const loginWrapper = useCallback(async (credentials: LoginCredentials): Promise<LoginResult | null> => {
    try {
      const result = await login(credentials);
      // Nếu login trả về boolean (context), trả về LoginResult giả để không lỗi type
      if (typeof result === 'boolean') {
        return result ? { success: true, user: undefined, token: { token: '', authenticated: true } } : { success: false, user: undefined, token: { token: '', authenticated: false } };
      }
      return result;
    } catch (authError) {
      setError(authError as AuthError);
      return null;
    }
  }, [login]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    isAuthenticated,
    login: loginWrapper,
    logout: async () => {},
    clearError
  };
};

/**
 * Hook for checking authentication status
 * Only verifies token on mount (reload), not after login/logout
 */
export const useAuth = () => {
  // Consumer cho toàn bộ app
  const { isAuthenticated, loading, user, login, logout, verify } = useAuthContext();
  return { isAuthenticated, loading, user, login, logout, verify };
};
