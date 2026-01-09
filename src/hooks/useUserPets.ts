import { useEffect, useState } from 'react';
import { petService } from '@/services/pet.service';
import type { AllPetsResponseDTO } from '@/services/api';

/**
 * Hook to fetch user's pets
 * @param userId - User ID. If not provided, fetches current user's pets
 * @returns pets, loading state, and error
 */
export const useUserPets = (userId?: number | null) => {
  const [pets, setPets] = useState<AllPetsResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchPets = async () => {
      console.log('🐾 useUserPets: Starting to fetch pets...', { userId });

      try {
        let data: AllPetsResponseDTO[];

        if (userId !== undefined && userId !== null) {
          // Fetch other user's pets using getAllUserPets API
          console.log('🐾 useUserPets: Fetching pets for user ID:', userId);
          data = await petService.getUserPets(userId);
        } else {
          // Fetch current user's pets
          console.log('🐾 useUserPets: Fetching current user pets');
          data = await petService.getAllMyPets();
        }

        console.log('🐾 useUserPets: Received pets data:', data);
        if (mounted) {
          setPets(data || []);
          console.log('🐾 useUserPets: Set pets to state, count:', data?.length || 0);
        }
      } catch (err) {
        console.error('🐾 useUserPets: Error:', err);
        if (mounted) setError(err instanceof Error ? err.message : 'Failed to load pets');
      } finally {
        if (mounted) {
          console.log('🐾 useUserPets: Loading finished');
          setLoading(false);
        }
      }
    };

    fetchPets();

    return () => {
      mounted = false;
      console.log('🐾 useUserPets: Component unmounted');
    };
  }, [userId]);

  console.log('🐾 useUserPets: Current state - loading:', loading, 'pets count:', pets?.length, 'error:', error);

  return { pets, loading, error };
};
