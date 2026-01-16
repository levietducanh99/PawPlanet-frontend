import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/auth.service';
import { useRefreshToken } from '@/hooks/useRefreshToken';
import type { User, LoginCredentials } from '@/domain/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  isRefreshing: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  loginWithToken: (token: string, user?: User) => void;
  logout: () => Promise<void>;
  verify: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Use refresh token hook for automatic token refresh
  const {
    user: refreshUser,
    isAuthenticated: refreshIsAuthenticated,
    isRefreshing,
    refreshToken: refreshTokenFn,
    validateToken,
  } = useRefreshToken();

  // Sync auth state from refresh token hook
  useEffect(() => {
    if (refreshUser) {
      setUser(refreshUser);
      setIsAuthenticated(refreshIsAuthenticated);
    }
  }, [refreshUser, refreshIsAuthenticated]);

  // Verify token using refresh token hook's validation
  const verify = useCallback(async () => {
    setLoading(true);
    try {
      const isValid = await validateToken();
      setIsAuthenticated(isValid);

      if (!isValid) {
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        setUser(null);
      }
    } catch {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [validateToken]);

  useEffect(() => {
    verify();
  }, [verify]);

  // Login: set state ngay, không verify lại
  const login = useCallback(async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const result = await authService.login(credentials);
      if (result.success && result.token.authenticated) {
        setIsAuthenticated(true);
        if (result.user) setUser(result.user);
        if (credentials.remember && result.token.token) {
          localStorage.setItem('authToken', result.token.token);
        }
        if (result.token.token) {
          localStorage.setItem('authToken', result.token.token);
        }
        return true;
      } else {
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }
    } catch (e) {
      setIsAuthenticated(false);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Login with token (for Google OAuth): directly set authenticated state
  const loginWithToken = useCallback((token: string, userData?: User) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
    if (userData) {
      setUser(userData);
    }
  }, []);

  // Logout: clear state ngay, không verify lại
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
      if (token) await authService.logout(token);
    } catch (e) {
      // log error nếu muốn
      // console.error(e);
    }
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUser(null);
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      loading,
      isRefreshing,
      login,
      loginWithToken,
      logout,
      verify,
      refreshToken: refreshTokenFn
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
};
