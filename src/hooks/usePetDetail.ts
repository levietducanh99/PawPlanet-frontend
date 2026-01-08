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
    } catch (err) {
      console.error('🐕 usePetDetail: Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load pet details');
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
