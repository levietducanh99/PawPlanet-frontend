import { useState } from 'react';
import { updatePet } from '@/services/pet.service';

export interface UpdatePetData {
  name?: string;
  speciesId?: number;
  breedId?: number;
  birthDate?: string;
  gender?: string;
  description?: string;
  status?: string;
  weight?: number;
  height?: number;
}

export const useUpdatePet = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePetData = async (petId: number, data: UpdatePetData): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔄 useUpdatePet: Updating pet ID:', petId, 'with data:', data);
      await updatePet(petId, data);
      console.log('✅ useUpdatePet: Pet updated successfully');
      return true;
    } catch (err) {
      console.error('❌ useUpdatePet: Update error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update pet';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    updatePetData,
    loading,
    error
  };
};

