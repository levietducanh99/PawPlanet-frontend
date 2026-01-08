import { useState } from 'react';
import { encyclopediaService } from '@/services/encyclopedia.service';
import { AddEncyclopediaMediaRequest } from '@/services/api';

export const useEncyclopediaMedia = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addMediaToSpecies = async (
    speciesId: number,
    request: AddEncyclopediaMediaRequest
  ): Promise<boolean> => {
    setUploading(true);
    setError(null);
    try {
      await encyclopediaService.addMediaToSpecies(speciesId, request);
      return true;
    } catch (err) {
      setError(err as Error);
      return false;
    } finally {
      setUploading(false);
    }
  };

  const addMediaToBreed = async (
    breedId: number,
    request: AddEncyclopediaMediaRequest
  ): Promise<boolean> => {
    setUploading(true);
    setError(null);
    try {
      await encyclopediaService.addMediaToBreed(breedId, request);
      return true;
    } catch (err) {
      setError(err as Error);
      return false;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    error,
    addMediaToSpecies,
    addMediaToBreed,
  };
};

