/**
 * Hook for viewing and managing user profile
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '@/services/user.service';
import type { User } from '@/domain/auth';

interface UseViewProfileReturn {
  viewProfile: () => void;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

interface UseProfileDataReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  clearError: () => void;
}

/**
 * Hook for navigating to profile page
 * Simple navigation utility
 */
export const useViewProfile = (): UseViewProfileReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const viewProfile = () => {
    try {
      setLoading(true);
      setError(null);
      navigate('/profile');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to navigate to profile';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    viewProfile,
    loading,
    error,
    clearError
  };
};

/**
 * Hook for fetching and managing profile data
 * Useful for profile page component
 */
export const useProfileData = (): UseProfileDataReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const userProfile = await userService.getMyProfile();
      setUser(userProfile);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load profile';
      setError(errorMessage);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    user,
    loading,
    error,
    refreshProfile,
    clearError
  };
};
