import {
  PetControllerApi,
  EncyclopediaSpeciesApi,
  EncyclopediaBreedsApi,
  CreatePetRequestDTO,
  PetProfileDTO,
  SpeciesResponse,
  BreedResponse,
  Configuration
} from './api';
import apiClient from './apiConfig';
import type { Pet, CreatePetRequest } from '@/domain/pet';

// Create API configuration
const apiConfiguration = new Configuration({
  basePath: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  // Add auth headers if needed
});

// Initialize API clients
const petApi = new PetControllerApi(apiConfiguration, undefined, apiClient);
const speciesApi = new EncyclopediaSpeciesApi(apiConfiguration, undefined, apiClient);
const breedsApi = new EncyclopediaBreedsApi(apiConfiguration, undefined, apiClient);

export interface CreatePetData {
  name: string;
  speciesId: number;
  breedId?: number;
  birthDate?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  description?: string;
  weight?: number;
  height?: number;
  status?: string;
  url?: string;
}

export interface SpeciesListResponse {
  data: SpeciesResponse[];
  success: boolean;
  message?: string;
}

export interface BreedsListResponse {
  data: BreedResponse[];
  success: boolean;
  message?: string;
}

export const petService = {
  // Create new pet
  async createPet(petData: CreatePetData): Promise<PetProfileDTO> {
    try {
      const createPetRequest: CreatePetRequestDTO = {
        name: petData.name,
        speciesId: petData.speciesId,
        breedId: petData.breedId,
        birthDate: petData.birthDate,
        gender: petData.gender,
        description: petData.description,
        weight: petData.weight,
        height: petData.height,
        status: petData.status || 'ACTIVE',
      };

      const response = await petApi.createPet({
        createPetRequestDTO: createPetRequest
      });

      return response.data;
    } catch (error: any) {
      console.error('STATUS:', error.response?.status);
      console.error('BACKEND MESSAGE:', error.response?.data);

      // Handle specific database constraint errors for pet creation
      if (error.response?.status === 400) {
        const message = error.response?.data?.message || '';

        if (message.includes('duplicate key value') && message.includes('pet_media_pkey')) {
          throw new Error('Media upload conflict. Please try uploading your pet photos again.');
        }

        if (message.includes('constraint')) {
          throw new Error('Data validation failed. Please check your pet information and try again.');
        }

        // Generic 400 error
        throw new Error(error.response?.data?.message || 'Invalid pet data. Please check your information.');
      }

      throw error;
    }
  },

  // Get all species (for dropdown)
  async getSpecies(): Promise<SpeciesResponse[]> {
    try {
      const response = await speciesApi.list({
        size: 1000 // Get all species
      });

      if (response.data?.result?.items) {
        return response.data.result.items;
      }

      return [];
    } catch (error: any) {
      console.error('STATUS:', error.response?.status);
      console.error('BACKEND MESSAGE:', error.response?.data);
      throw error;
    }
  },

  // Get breeds by species ID
  async getBreedsBySpecies(speciesId: number): Promise<BreedResponse[]> {
    try {
      const response = await breedsApi.listAllBySpecies({
        speciesId: speciesId
      });

      if (response.data?.result) {
        return response.data.result;
      }

      return [];
    } catch (error: any) {
      console.error('STATUS:', error.response?.status);
      console.error('BACKEND MESSAGE:', error.response?.data);
      throw error;
    }
  },

  // Get pet by ID
  async getPetById(id: number): Promise<PetProfileDTO> {
    try {
      const response = await petApi.getPetById({ id });
      return response.data;
    } catch (error: any) {
      console.error('STATUS:', error.response?.status);
      console.error('BACKEND MESSAGE:', error.response?.data);
      throw error;
    }
  },

  // Get user's pets - since there's no direct API, we'll use getUserProfile and extract pet info
  // or create a method that assumes we can get pets by user ID somehow
  async getUserPets(_userId?: number): Promise<PetProfileDTO[]> {
    try {
      // For now, return empty array as we don't have a direct API
      // In a real implementation, this would be a specific endpoint like /api/v1/users/{userId}/pets
      console.warn('getUserPets API endpoint not available, returning empty array');
      return [];
    } catch (error: any) {
      console.error('STATUS:', error.response?.status);
      console.error('BACKEND MESSAGE:', error.response?.data);
      throw error;
    }
  }
};

// Legacy functions for backward compatibility
export const getPetById = async (id: number): Promise<Pet> => {
  // Convert PetProfileDTO to Pet domain model if needed
  const profile = await petService.getPetById(id);
  // Add mapping logic here if Pet and PetProfileDTO are different
  return profile as unknown as Pet;
};

export const createPet = async (request: CreatePetRequest): Promise<Pet> => {
  // Convert CreatePetRequest to CreatePetData
  const petData: CreatePetData = {
    name: request.name,
    speciesId: request.speciesId || 1, // Default fallback
    breedId: request.breedId,
    birthDate: request.birthDate,
    gender: request.gender as 'MALE' | 'FEMALE' | 'OTHER',
    description: request.description,
    weight: request.weight,
    height: request.height
  };

  const profile = await petService.createPet(petData);
  return profile as unknown as Pet;
};

export const updatePet = async (_id: number, _request: Partial<CreatePetRequest>): Promise<Pet> => {
  // Implementation for update will be added later
  throw new Error('Update pet API not implemented yet');
};

export const followPet = async (_petId: number): Promise<void> => {
  // Implementation for follow will be added later
  throw new Error('Follow pet API not implemented yet');
};

export const unfollowPet = async (_petId: number): Promise<void> => {
  // Implementation for unfollow will be added later
  throw new Error('Unfollow pet API not implemented yet');
};
