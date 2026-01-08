/**
 * usePetProfile Hook
 *
 * Hook for managing pet profile data
 */

import { useState, useEffect, useCallback } from 'react';

import { petService } from '@/services/pet.service';
import { mapPetProfileToPet } from '@/mappers/pet.mapper';
import type { Pet } from '@/domain/pet';

export const usePetProfile = (petId: number | null) => {
  const [profile, setProfile] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (!petId) return;

    try {
      setLoading(true);
      setError(null);
      const profileDTO = await petService.getPetById(petId);
      const pet = mapPetProfileToPet(profileDTO);
      setProfile(pet);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load pet profile';
      setError(errorMessage);
      console.error('Error loading pet profile:', err);
    } finally {
      setLoading(false);
    }
  }, [petId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    loading,
    error,
    refetch: loadProfile
  };
};
