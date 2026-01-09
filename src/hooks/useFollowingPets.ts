import { useState, useCallback, useEffect, useRef } from 'react';
import { petService } from '@/services/pet.service';
import { mapPetProfileToSummary } from '@/mappers/pet.mapper';
import type { PetSummary } from '@/domain/pet';

interface UseFollowingPetsResult {
  pets: PetSummary[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  fetchIfNeeded: () => Promise<void>;
}

/**
 * Hook to fetch pets followed by a user
 * Auto-fetches on mount to display count immediately
 */
export const useFollowingPets = (userId: number | null): UseFollowingPetsResult => {
  const [pets, setPets] = useState<PetSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);

  const fetchFollowingPets = useCallback(async () => {
    if (!userId) {
      setPets([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔵 useFollowingPets: Fetching following pets for user:', userId);

      const petProfiles = await petService.getFollowingPets(userId);
      const petSummaries = petProfiles.map(mapPetProfileToSummary);

      console.log('🔵 useFollowingPets: Successfully fetched', petSummaries.length, 'pets');

      // Log first pet details for debugging
      if (petSummaries.length > 0) {
        console.log('🔵 useFollowingPets: First pet data:', {
          id: petSummaries[0].id,
          name: petSummaries[0].name,
          avatarUrl: petSummaries[0].avatarUrl,
          speciesName: petSummaries[0].speciesName,
          breedName: petSummaries[0].breedName,
          ownerUsername: petSummaries[0].ownerUsername
        });
      }

      setPets(petSummaries);
      hasFetchedRef.current = true;
    } catch (err) {
      console.error('🔴 useFollowingPets: Error fetching following pets:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch following pets');
      setPets([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Fetch only if not already fetched (for manual refetch)
   */
  const fetchIfNeeded = useCallback(async () => {
    if (!hasFetchedRef.current && !loading) {
      await fetchFollowingPets();
    }
  }, [fetchFollowingPets, loading]);

  /**
   * Force refetch (ignores cache)
   */
  const refetch = useCallback(async () => {
    hasFetchedRef.current = false;
    await fetchFollowingPets();
  }, [fetchFollowingPets]);

  // Auto-fetch when userId is available
  useEffect(() => {
    hasFetchedRef.current = false;
    setPets([]);
    setError(null);

    // Auto-fetch on mount or when userId changes
    if (userId) {
      fetchFollowingPets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return {
    pets,
    loading,
    error,
    refetch,
    fetchIfNeeded
  };
};

