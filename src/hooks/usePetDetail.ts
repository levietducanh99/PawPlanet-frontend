import { useEffect, useState, useCallback } from 'react';
import { getPetById } from '@/services/pet.service';
import type { Pet } from '@/domain/pet';

export const usePetDetail = (petId: number | null) => {
  const [pet, setPet] = useState<Pet | null>(null);
  const [pageLoading, setPageLoading] = useState(true); // Only for initial page load
  const [error, setError] = useState<string | null>(null);

  const fetchPetData = useCallback(async (id: number) => {
    setPageLoading(true);
    setError(null);

    try {
      console.log('🐕 usePetDetail: Fetching pet details for ID:', id);
      const data = await getPetById(id);
      console.log('🐕 usePetDetail: Received pet data:', data);
      setPet(data);
    } catch (err: any) {
      console.error('🐕 usePetDetail: Error:', err);

      // Check if this is a 403 FORBIDDEN error for private/hidden pet
      const errorMessage = err instanceof Error ? err.message : String(err);
      const isPrivateError = err.isPrivate ||
                            errorMessage.toLowerCase().includes('private') ||
                            errorMessage.toLowerCase().includes('hidden') ||
                            errorMessage.includes('403');

      if (isPrivateError) {
        console.log('🔒 usePetDetail: Detected private/hidden pet, creating minimal pet object');

        // Extract pet info from error if available
        const petInfo = err.petInfo || {};
        const ownerUsername = petInfo.ownerUsername || 'Pet Owner';
        const petName = petInfo.name || 'Private Pet';

        // Determine status from error message
        let status: 'HIDDEN' | 'PRIVATE' = 'PRIVATE';
        if (errorMessage.toLowerCase().includes('hidden')) {
          status = 'HIDDEN';
        }

        console.log('🔒 usePetDetail: Creating minimal pet with status:', status);

        // Create a minimal pet object for private/hidden status display
        const minimalPet: Pet = {
          id: id,
          name: petName,
          speciesId: petInfo.speciesId || 0,
          speciesName: petInfo.speciesName || 'Unknown',
          breedName: petInfo.breedName,
          status: status,
          ownerId: petInfo.ownerId || 0,
          ownerUsername: ownerUsername,
          canFollow: false,
          isOwner: false,
          isFollowing: false,
          media: [],
          followerCount: 0,
          followingCount: 0
        };

        setPet(minimalPet);
        // Don't set error so the UI can show the nice private/hidden screen
        setError(null);
      } else {
        setError(errorMessage);
      }
    } finally {
      setPageLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    if (petId) {
      fetchPetData(petId);
    }
  }, [petId, fetchPetData]);

  useEffect(() => {
    if (!petId) {
      setPet(null);
      setPageLoading(false);
      setError(null);
      return;
    }

    fetchPetData(petId);
  }, [petId, fetchPetData]);

  console.log('🐕 usePetDetail: Current state - pageLoading:', pageLoading, 'pet:', pet?.name, 'error:', error);

  return { pet, pageLoading, error, refetch };
};
