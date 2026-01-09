/**
 * Hook for updating user profile
 */

import { useState } from 'react';
import { userService } from '@/services/user.service';
import type { UpdateProfileRequest, User } from '@/domain/auth';

interface UseUpdateProfileReturn {
  updateProfile: (request: UpdateProfileRequest) => Promise<User | null>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

/**
 * Hook for updating current user profile
 */
export const useUpdateProfile = (): UseUpdateProfileReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (request: UpdateProfileRequest): Promise<User | null> => {
    setLoading(true);
    setError(null);

    try {
      return await userService.updateMyProfile(request);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    updateProfile,
    loading,
    error,
    clearError
  };
};

