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
      // In development mode, provide mock user data for testing UI
      if (import.meta.env.DEV) {
        console.log('Development mode: Using mock user data since no auth token found');
        setUser({
          id: 1,
          email: 'dev@pawplanet.com',
          username: 'DevUser',
          avatarUrl: undefined,
          bio: 'Development user for testing UI'
        });
        setLoading(false);
        return;
      }

      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userProfile = await userService.getMyProfile();
      setUser(userProfile);
    } catch (err: unknown) {
      console.error('Failed to fetch user profile:', err);

      // In development mode, fall back to mock data instead of showing error
      if (import.meta.env.DEV && err instanceof Error && err.message?.includes('No authentication token')) {
        console.log('Development mode: Using mock user data due to auth error');
        setUser({
          id: 1,
          email: 'dev@pawplanet.com',
          username: 'DevUser',
          avatarUrl: undefined,
          bio: 'Development user for testing UI'
        });
        setError(null);
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load user profile';
        setError(errorMessage);
        setUser(null);
      }
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
 * Uses mock data until real API is available
 */
export const useUserSidebarPets = () => {
  const [pets, setPets] = useState<SidebarPet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserPets = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // For now, we'll use mock data since API endpoint doesn't exist
      // This simulates what would come from the user's pets
      const mockPets: SidebarPet[] = [
        {
          id: 1,
          name: 'Buddy',
          type: 'dog',
          avatarUrl: undefined
        },
        {
          id: 2,
          name: 'Whiskers',
          type: 'cat',
          avatarUrl: undefined
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setPets(mockPets);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load user pets';
      setError(errorMessage);
      setPets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check if user is authenticated before loading pets
    const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');

    if (token) {
      fetchUserPets();
    } else {
      setLoading(false);
      setPets([]);
    }
  }, []); // Empty dependency array for mount only

  const refetch = useCallback(() => {
    fetchUserPets();
  }, []); // Empty dependency to prevent circular updates

  return {
    pets,
    loading,
    error,
    refetch
  };
};
