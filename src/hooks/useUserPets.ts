import { useEffect, useState } from 'react';
import { petService } from '@/services/pet.service';
import type { PetProfileDTO } from '@/services/api';

export const useUserPets = () => {
  const [pets, setPets] = useState<PetProfileDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    petService.getAllMyPets()
      .then((data) => { if (mounted) setPets(data); })
      .catch((err) => { if (mounted) setError(err instanceof Error ? err.message : 'Failed to load pets'); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  return { pets, loading, error };
};
