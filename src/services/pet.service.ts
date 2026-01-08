import {
  PetControllerApi,
  EncyclopediaSpeciesApi,
  EncyclopediaBreedsApi,
  CreatePetRequestDTO,
  UpdatePetRequestDTO,
  PetProfileDTO,
  AllPetsResponseDTO,
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
  avatarPublicId?: string; // Cloudinary public_id from upload response
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
        avatarPublicId: petData.avatarPublicId, // Send Cloudinary public_id
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
      console.log('🔵 petService.getPetById: Fetching pet ID:', id);

      const response = await petApi.getPetById({ id });
      console.log('🔵 petService.getPetById: API Response:', response.data);

      return response.data;
    } catch (error: any) {
      console.error('🔴 petService.getPetById - ERROR:', error.response?.status, error.response?.data);

      if (error.response?.status === 404) {
        throw new Error('Pet not found');
      } else if (error.response?.status === 401) {
        throw new Error('Authentication required');
      } else {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch pet details');
      }
    }
  },

  // Follow a pet
  async followPet(petId: number): Promise<void> {
    try {
      console.log('🔵 petService.followPet: Following pet ID:', petId);

      // Sử dụng generated API nếu có, hoặc manual call
      await apiClient.post(`/api/v1/pets/${petId}/follow`, {}, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('authToken') || localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('🔵 petService.followPet: Success');
    } catch (error: any) {
      console.error('🔴 petService.followPet - ERROR:', error.response?.status, error.response?.data);

      if (error.response?.status === 404) {
        throw new Error('Pet not found');
      } else if (error.response?.status === 401) {
        throw new Error('Authentication required');
      } else if (error.response?.status === 409) {
        throw new Error('Already following this pet');
      } else {
        throw new Error(error.response?.data?.message || error.message || 'Failed to follow pet');
      }
    }
  },

  // Unfollow a pet
  async unfollowPet(petId: number): Promise<void> {
    try {
      console.log('🔵 petService.unfollowPet: Unfollowing pet ID:', petId);

      await apiClient.delete(`/api/v1/pets/${petId}/follow`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('authToken') || localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('🔵 petService.unfollowPet: Success');
    } catch (error: any) {
      console.error('🔴 petService.unfollowPet - ERROR:', error.response?.status, error.response?.data);

      if (error.response?.status === 404) {
        throw new Error('Pet not found');
      } else if (error.response?.status === 401) {
        throw new Error('Authentication required');
      } else {
        throw new Error(error.response?.data?.message || error.message || 'Failed to unfollow pet');
      }
    }
  },

  // Update pet
  async updatePet(id: number, updateData: Partial<CreatePetRequest>): Promise<Pet> {
    try {
      console.log('🔵 petService.updatePet: Updating pet ID:', id, 'with data:', updateData);

      // Convert CreatePetRequest to UpdatePetRequestDTO format
      const updatePetRequestDTO: UpdatePetRequestDTO = {
        name: updateData.name,
        speciesId: updateData.speciesId,
        breedId: updateData.breedId,
        birthDate: updateData.birthDate,
        gender: updateData.gender,
        description: updateData.description,
        status: updateData.status,
        weight: updateData.weight,
        height: updateData.height,
      };

      // Use generated API method
      const response = await petApi.updatePet({
        id,
        updatePetRequestDTO
      });

      console.log('🔵 petService.updatePet: Success:', response.data);
      return response.data as unknown as Pet;
    } catch (error: any) {
      console.error('🔴 petService.updatePet - ERROR:', error.response?.status, error.response?.data);

      if (error.response?.status === 404) {
        throw new Error('Pet not found');
      } else if (error.response?.status === 401) {
        throw new Error('Authentication required');
      } else if (error.response?.status === 403) {
        throw new Error('You do not have permission to edit this pet');
      } else {
        throw new Error(error.response?.data?.message || error.message || 'Failed to update pet');
      }
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
  },

  // Get all pets of the current user
  async getAllMyPets(): Promise<AllPetsResponseDTO[]> {
    try {
      console.log('🔵 petService.getAllMyPets: Using generated API...');

      // Check auth token availability
      const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
      console.log('🔵 petService.getAllMyPets: Token available:', token ? 'Yes' : 'No');

      // Check API configuration
      console.log('🔵 petService.getAllMyPets: Base path:', apiConfiguration.basePath);

      // Sử dụng generated API client đã có configuration và auth
      const response = await petApi.getAllMyPets();
      console.log('🔵 petService.getAllMyPets: API Response status:', response.status);
      console.log('🔵 petService.getAllMyPets: API Response data:', response.data);

      // Response trực tiếp trả về Array<AllPetsResponseDTO>
      const petData: AllPetsResponseDTO[] = response.data || [];
      console.log('🔵 petService.getAllMyPets: Pet count:', petData.length);

      // Log first pet để debug structure
      if (petData.length > 0) {
        console.log('🔵 petService.getAllMyPets: First pet structure:', {
          id: petData[0].id,
          name: petData[0].name,
          avatar: petData[0].avatar,
          speciesName: petData[0].speciesName
        });
      }

      return petData;
    } catch (error: any) {
      console.error('🔴 petService.getAllMyPets - ERROR:', error.response?.status, error.response?.data);
      console.error('🔴 petService.getAllMyPets - Full error:', error);

      // Better error handling
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please login again.');
      } else if (error.response?.status === 404) {
        throw new Error('Pets not found');
      } else {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch pets');
      }
    }
  }
};

// Legacy functions for backward compatibility
export const getPetById = async (id: number): Promise<Pet> => {
  const profile = await petService.getPetById(id);
  // Import mapper to convert PetProfileDTO to Pet
  const { mapPetProfileToPet } = await import('@/mappers/pet.mapper');
  return mapPetProfileToPet(profile);
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

export const updatePet = async (id: number, request: Partial<CreatePetRequest>): Promise<Pet> => {
  return await petService.updatePet(id, request);
};

export const followPet = async (petId: number): Promise<void> => {
  return await petService.followPet(petId);
};

export const unfollowPet = async (petId: number): Promise<void> => {
  return await petService.unfollowPet(petId);
};
