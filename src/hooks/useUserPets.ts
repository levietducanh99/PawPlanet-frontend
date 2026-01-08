import { useEffect, useState } from 'react';
import { petService } from '@/services/pet.service';
import type { AllPetsResponseDTO } from '@/services/api';

export const useUserPets = () => {
  const [pets, setPets] = useState<AllPetsResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    console.log('🐾 useUserPets: Starting to fetch pets with generated API...');

    petService.getAllMyPets()
      .then((data: AllPetsResponseDTO[]) => {
        console.log('🐾 useUserPets: Received pets data:', data);
        if (mounted) {
          // Data đã đúng structure từ generated API
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
  }, []);

  console.log('🐾 useUserPets: Current state - loading:', loading, 'pets count:', pets?.length, 'error:', error);

  return { pets, loading, error };
};
