import { useState } from 'react';
import { petService, CreatePetData } from '@/services/pet.service';
import { PetProfileDTO, SpeciesResponse, BreedResponse } from '@/services/api';

interface UseCreatePetReturn {
  // State
  isCreating: boolean;
  createError: string | null;

  // Functions
  createPet: (petData: CreatePetData) => Promise<PetProfileDTO | null>;
  clearError: () => void;
}

export const useCreatePet = (): UseCreatePetReturn => {
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const createPet = async (petData: CreatePetData): Promise<PetProfileDTO | null> => {
    setIsCreating(true);
    setCreateError(null);

    try {
      return await petService.createPet(petData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create pet';
      setCreateError(errorMessage);
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  const clearError = () => {
    setCreateError(null);
  };

  return {
    isCreating,
    createError,
    createPet,
    clearError
  };
};

interface UseSpeciesReturn {
  // State
  species: SpeciesResponse[];
  isLoadingSpecies: boolean;
  speciesError: string | null;

  // Functions
  loadSpecies: () => Promise<void>;
  clearSpeciesError: () => void;
}

export const useSpecies = (): UseSpeciesReturn => {
  const [species, setSpecies] = useState<SpeciesResponse[]>([]);
  const [isLoadingSpecies, setIsLoadingSpecies] = useState(false);
  const [speciesError, setSpeciesError] = useState<string | null>(null);

  const loadSpecies = async (): Promise<void> => {
    setIsLoadingSpecies(true);
    setSpeciesError(null);

    try {
      const data = await petService.getSpecies();
      setSpecies(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load species';
      setSpeciesError(errorMessage);
    } finally {
      setIsLoadingSpecies(false);
    }
  };

  const clearSpeciesError = () => {
    setSpeciesError(null);
  };

  return {
    species,
    isLoadingSpecies,
    speciesError,
    loadSpecies,
    clearSpeciesError
  };
};

interface UseBreedsReturn {
  // State
  breeds: BreedResponse[];
  isLoadingBreeds: boolean;
  breedsError: string | null;

  // Functions
  loadBreeds: (speciesId: number) => Promise<void>;
  clearBreeds: () => void;
  clearBreedsError: () => void;
}

export const useBreeds = (): UseBreedsReturn => {
  const [breeds, setBreeds] = useState<BreedResponse[]>([]);
  const [isLoadingBreeds, setIsLoadingBreeds] = useState(false);
  const [breedsError, setBreedsError] = useState<string | null>(null);

  const loadBreeds = async (speciesId: number): Promise<void> => {
    setIsLoadingBreeds(true);
    setBreedsError(null);

    try {
      const data = await petService.getBreedsBySpecies(speciesId);
      setBreeds(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load breeds';
      setBreedsError(errorMessage);
    } finally {
      setIsLoadingBreeds(false);
    }
  };

  const clearBreeds = () => {
    setBreeds([]);
  };

  const clearBreedsError = () => {
    setBreedsError(null);
  };

  return {
    breeds,
    isLoadingBreeds,
    breedsError,
    loadBreeds,
    clearBreeds,
    clearBreedsError
  };
};

// Combined hook for CreatePetPage workflow
interface UseCreatePetWorkflowReturn {
  // Create Pet
  isCreating: boolean;
  createError: string | null;
  createPet: (petData: CreatePetData) => Promise<PetProfileDTO | null>;

  // Species
  species: SpeciesResponse[];
  isLoadingSpecies: boolean;
  speciesError: string | null;
  loadSpecies: () => Promise<void>;

  // Breeds
  breeds: BreedResponse[];
  isLoadingBreeds: boolean;
  breedsError: string | null;
  loadBreeds: (speciesId: number) => Promise<void>;
  clearBreeds: () => void;

  // Error management
  clearAllErrors: () => void;
}

export const useCreatePetWorkflow = (): UseCreatePetWorkflowReturn => {
  const {
    isCreating,
    createError,
    createPet,
    clearError: clearCreateError
  } = useCreatePet();

  const {
    species,
    isLoadingSpecies,
    speciesError,
    loadSpecies,
    clearSpeciesError
  } = useSpecies();

  const {
    breeds,
    isLoadingBreeds,
    breedsError,
    loadBreeds,
    clearBreeds,
    clearBreedsError
  } = useBreeds();

  const clearAllErrors = () => {
    clearCreateError();
    clearSpeciesError();
    clearBreedsError();
  };

  return {
    // Create Pet
    isCreating,
    createError,
    createPet,

    // Species
    species,
    isLoadingSpecies,
    speciesError,
    loadSpecies,

    // Breeds
    breeds,
    isLoadingBreeds,
    breedsError,
    loadBreeds,
    clearBreeds,

    // Error management
    clearAllErrors
  };
};
