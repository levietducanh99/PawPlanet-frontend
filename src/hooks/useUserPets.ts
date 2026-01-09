import { useEffect, useState } from 'react';
import { petService } from '@/services/pet.service';
import type { AllPetsResponseDTO } from '@/services/api';

/**
 * Hook to fetch user's pets
 * @param userId - Optional user ID. If not provided, fetches current user's pets
 * @returns pets, loading state, and error
 *
 * TODO: Backend needs to implement GET /api/v1/users/{id}/pets endpoint
 * Currently only supports fetching current user's pets
 */
export const useUserPets = (userId?: number | null) => {
  const [pets, setPets] = useState<AllPetsResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    console.log('🐾 useUserPets: Starting to fetch pets with generated API...', { userId });

    // If userId is provided and it's not current user, we need a different API
    // TODO: Implement backend endpoint GET /api/v1/users/{id}/pets
    if (userId !== undefined && userId !== null) {
      // For now, return empty array for other users
      console.warn('🐾 useUserPets: Fetching pets for other users is not yet implemented in backend');
      setPets([]);
      setLoading(false);
      return;
    }

    petService.getAllMyPets()
      .then((data: AllPetsResponseDTO[]) => {
        console.log('🐾 useUserPets: Received pets data:', data);
        if (mounted) {
          setPets(data || []);
          console.log('🐾 useUserPets: Set pets to state, count:', data.length);
        }
      })
      .catch((err) => {
        console.error('🐾 useUserPets: Error:', err);
        if (mounted) setError(err instanceof Error ? err.message : 'Failed to load pets');
      })
      .finally(() => {
        if (mounted) {
          console.log('🐾 useUserPets: Loading finished');
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
      console.log('🐾 useUserPets: Component unmounted');
    };
  }, [userId]);

  console.log('🐾 useUserPets: Current state - loading:', loading, 'pets count:', pets?.length, 'error:', error);

  return { pets, loading, error };
};
