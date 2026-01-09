/**
 * useRefreshToken Hook
 *
 * Manages automatic token refresh and authentication state.
 * Features:
 * - Automatic token refresh when expiring
 * - Token validation
 * - Handles refresh failures gracefully
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { authService } from '@/services/auth.service';
import { decodeJWT } from '@/utils/jwt';
import type { User } from '@/domain/auth';

interface UseRefreshTokenResult {
  user: User | null;
  isAuthenticated: boolean;
  isRefreshing: boolean;
  error: string | null;
  refreshToken: () => Promise<boolean>;
  validateToken: () => Promise<boolean>;
  clearError: () => void;
}

/**
 * Custom hook for managing token refresh
 * Wraps auth.service methods and provides state management
 */
export const useRefreshToken = (): UseRefreshTokenResult => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const refreshTimeoutRef = useRef<number | null>(null);

  /**
   * Get current token from storage
   */
  const getStoredToken = useCallback((): string | null => {
    return sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
  }, []);

  /**
   * Save token to storage
   */
  const saveToken = useCallback((token: string) => {
    // Maintain original storage location
    if (localStorage.getItem('authToken')) {
      localStorage.setItem('authToken', token);
    } else {
      sessionStorage.setItem('authToken', token);
    }
  }, []);

  /**
   * Extract user info from JWT token
   */
  const extractUserFromToken = useCallback((token: string): User | null => {
    try {
      const payload = decodeJWT(token);
      if (!payload) return null;

      return {
        id: payload.userId || 0,
        email: payload.sub || '',
        username: payload.sub?.split('@')[0] || 'User',
        role: payload.scope,
      };
    } catch (error) {
      console.error('❌ Failed to decode token:', error);
      return null;
    }
  }, []);

  /**
   * Calculate time until token expires (in milliseconds)
   */
  const getTimeUntilExpiry = useCallback((token: string): number | null => {
    try {
      const payload = decodeJWT(token);
      if (!payload || !payload.exp) return null;

      const expiryTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const timeUntilExpiry = expiryTime - currentTime;

      return timeUntilExpiry > 0 ? timeUntilExpiry : 0;
    } catch (error) {
      console.error('❌ Failed to get token expiry:', error);
      return null;
    }
  }, []);

  /**
   * Validate current token
   */
  const validateToken = useCallback(async (): Promise<boolean> => {
    const token = getStoredToken();
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      return false;
    }

    try {
      const isValid = await authService.verifyToken(token);

      if (isValid) {
        const userData = extractUserFromToken(token);
        setUser(userData);
        setIsAuthenticated(true);
        return true;
      } else {
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error('❌ Token validation failed:', error);
      setIsAuthenticated(false);
      setUser(null);
      return false;
    }
  }, [getStoredToken, extractUserFromToken]);

  /**
   * Refresh authentication token
   */
  const refreshToken = useCallback(async (): Promise<boolean> => {
    const currentToken = getStoredToken();
    if (!currentToken) {
      setError('No token available to refresh');
      return false;
    }

    setIsRefreshing(true);
    setError(null);

    try {
      console.log('🔄 useRefreshToken: Refreshing token...');

      const result = await authService.refreshToken(currentToken);

      if (result.success && result.token?.token) {
        // Save new token
        saveToken(result.token.token);

        // Update user state
        const userData = result.user || extractUserFromToken(result.token.token);
        setUser(userData);
        setIsAuthenticated(true);

        console.log('✅ useRefreshToken: Token refreshed successfully');

        return true;
      } else {
        setError('Token refresh returned invalid result');
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Token refresh failed';
      console.error('❌ useRefreshToken: Token refresh failed:', error);
      setError(errorMessage);
      setIsAuthenticated(false);
      setUser(null);
      return false;
    } finally {
      setIsRefreshing(false);
    }
  }, [getStoredToken, saveToken, extractUserFromToken]);

  /**
   * Schedule automatic token refresh before expiry
   * Refreshes at 80% of token lifetime or 5 minutes before expiry (whichever is earlier)
   */
  const scheduleTokenRefresh = useCallback((token: string) => {
    // Clear existing timeout
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    const timeUntilExpiry = getTimeUntilExpiry(token);
    if (!timeUntilExpiry || timeUntilExpiry <= 0) {
      console.log('⚠️ Token already expired or invalid expiry time');
      return;
    }

    // Refresh at 80% of lifetime or 5 minutes before expiry (whichever is earlier)
    const fiveMinutes = 5 * 60 * 1000;
    const refreshTime = Math.min(timeUntilExpiry * 0.8, timeUntilExpiry - fiveMinutes);

    if (refreshTime > 0) {
      console.log(`⏰ Scheduling token refresh in ${Math.round(refreshTime / 1000)} seconds`);

      refreshTimeoutRef.current = window.setTimeout(() => {
        console.log('⏰ Auto-refreshing token...');
        refreshToken();
      }, refreshTime);
    } else {
      console.log('⚠️ Token expiring soon, refreshing immediately');
      refreshToken();
    }
  }, [getTimeUntilExpiry, refreshToken]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Initialize on mount - validate token and schedule refresh
   */
  useEffect(() => {
    const initializeAuth = async () => {
      const token = getStoredToken();
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      // Validate current token
      const isValid = await validateToken();

      if (isValid) {
        // Schedule automatic refresh
        scheduleTokenRefresh(token);
      }
    };

    initializeAuth();

    // Cleanup timeout on unmount
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [getStoredToken, validateToken, scheduleTokenRefresh]);

  /**
   * Re-schedule token refresh when authentication state changes
   */
  useEffect(() => {
    if (isAuthenticated && !isRefreshing) {
      const token = getStoredToken();
      if (token) {
        scheduleTokenRefresh(token);
      }
    }
  }, [isAuthenticated, isRefreshing, getStoredToken, scheduleTokenRefresh]);

  return {
    user,
    isAuthenticated,
    isRefreshing,
    error,
    refreshToken,
    validateToken,
    clearError,
  };
};

