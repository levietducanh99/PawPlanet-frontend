import { useState, useEffect, useCallback } from 'react';
import { userService } from '@/services/user.service';
import { useAuth } from './useAuth';
import type { User } from '@/domain/auth';

interface UseUserProfileReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearError: () => void;
}

/**
 * Hook to get current user profile
 * Automatically loads user profile when authenticated and clears when logged out
 */
export const useUserProfile = (): UseUserProfileReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen to auth state changes
  const { isAuthenticated, loading: authLoading } = useAuth();

  const fetchUserProfile = useCallback(async () => {
    // If not authenticated, clear user data immediately
    if (!isAuthenticated) {
      setUser(null);
      setLoading(false);
      setError(null);
      return;
    }

    // Check if user is authenticated
    const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');

    if (!token) {
      setUser(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userProfile = await userService.getMyProfile();
      setUser(userProfile);
    } catch (err: unknown) {
      console.error('Failed to fetch user profile:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load user profile';
      setError(errorMessage);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const refetch = useCallback(async () => {
    await fetchUserProfile();
  }, [fetchUserProfile]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load user profile when auth state changes
  useEffect(() => {
    // Don't fetch if auth is still loading
    if (authLoading) return;

    fetchUserProfile();
  }, [fetchUserProfile, authLoading]);

  return {
    user,
    loading,
    error,
    refetch,
    clearError
  };
};

interface UseUserByIdReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchUser: (id: number) => Promise<void>;
  clearError: () => void;
}

/**
 * Hook to get user profile by ID
 */
export const useUserById = (): UseUserByIdReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const userProfile = await userService.getUserProfile(id);
      setUser(userProfile);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load user profile';
      setError(errorMessage);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    loading,
    error,
    fetchUser,
    clearError
  };
};

// For compatibility with existing components - provide simple pets interface
export interface SidebarPet {
  id: number;
  name: string;
  type: 'dog' | 'cat' | 'bird' | 'other';
  avatarUrl?: string;
}

/**
 * Hook to get simplified pets data for Sidebar
 * Returns empty list until a real API endpoint is available.
 */
export const useUserSidebarPets = () => {
  const [pets, setPets] = useState<SidebarPet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserPets = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // No mock data. If there's no endpoint yet, we keep this empty.
      setPets([]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load user pets';
      setError(errorMessage);
      setPets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');

    if (token) {
      fetchUserPets();
    } else {
      setLoading(false);
      setPets([]);
      setError(null);
    }
  }, [fetchUserPets]);

  const refetch = useCallback(() => {
    fetchUserPets();
  }, [fetchUserPets]);

  return {
    pets,
    loading,
    error,
    refetch,
  };
};
