// src/hooks/usePetFollowers.ts
import { useState, useCallback } from 'react';
import { petService } from '@/services/pet.service';
import { UserResponse } from '@/services/api';

export const usePetFollowers = () => {
  const [followers, setFollowers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFollowers = useCallback(async (petId: number) => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔵 usePetFollowers: Fetching followers for pet ID:', petId);
      const followersList = await petService.getPetFollowers(petId);

      console.log('🔵 usePetFollowers: Followers loaded:', followersList.length);
      setFollowers(followersList);
      return followersList;
    } catch (err: unknown) {
      console.error('🔴 usePetFollowers: Error loading followers:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to load followers';
      setError(errorMsg);
      setFollowers([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies - stable function

  return {
    followers,
    loading,
    error,
    fetchFollowers
  };
};

