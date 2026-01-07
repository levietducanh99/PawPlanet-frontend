import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/auth.service';
import type { User, LoginCredentials } from '@/domain/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  verify: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Chỉ verify token khi mount (reload)
  const verify = useCallback(async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }
      const isValid = await authService.verifyToken(token);
      setIsAuthenticated(isValid);
      if (!isValid) {
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        setUser(null);
      } else {
        // Optionally: fetch user info here if needed
      }
    } catch {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

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
          sessionStorage.setItem('authToken', result.token.token);
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
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout, verify }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
};
