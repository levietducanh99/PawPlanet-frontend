/**
 * usePetAdoption Hook
 * 
 * Manages pet adoption profile state and operations.
 * Provides methods to create and fetch adoption profiles.
 */

import { useState, useCallback } from 'react';
import { adoptionService } from '@/services/adoption.service';
import type { AdoptionProfile, CreateAdoptionProfileRequest } from '@/domain/adoption';

interface UsePetAdoptionReturn {
  adoptionProfile: AdoptionProfile | null;
  loading: boolean;
  error: string | null;
  createProfile: (petId: number, profileData: CreateAdoptionProfileRequest) => Promise<boolean>;
  fetchProfile: (petId: number) => Promise<void>;
  clearError: () => void;
}

export const usePetAdoption = (): UsePetAdoptionReturn => {
  const [adoptionProfile, setAdoptionProfile] = useState<AdoptionProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Create adoption profile for a pet
   */
  const createProfile = useCallback(
    async (petId: number, profileData: CreateAdoptionProfileRequest): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        const profile = await adoptionService.createAdoptionProfile(petId, profileData);
        setAdoptionProfile(profile);

        return true;
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to create adoption profile';
        setError(errorMessage);
        console.error('usePetAdoption.createProfile error:', err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Fetch adoption profile for a pet
   */
  const fetchProfile = useCallback(async (petId: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const profile = await adoptionService.getAdoptionProfile(petId);
      setAdoptionProfile(profile);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch adoption profile';
      setError(errorMessage);
      console.error('usePetAdoption.fetchProfile error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    adoptionProfile,
    loading,
    error,
    createProfile,
    fetchProfile,
    clearError,
  };
};
