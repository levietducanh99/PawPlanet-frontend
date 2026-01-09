/**
 * useDeletePet Hook
 *
 * Hook for deleting a pet
 */

import { useState } from 'react';
import { petService } from '@/services/pet.service';

export const useDeletePet = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deletePet = async (petId: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await petService.deletePet(petId);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete pet';
      setError(errorMessage);
      console.error('Error deleting pet:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    deletePet,
    loading,
    error
  };
};

