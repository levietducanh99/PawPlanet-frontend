/**
 * Adoption Service
 * 
 * Service layer for pet adoption profile management.
 * Uses generated API and maps to frontend domain models.
 */

import { PetAdoptionProfileControllerApi, Configuration } from './api';
import apiClient from './apiConfig';
import type { AdoptionProfile, CreateAdoptionProfileRequest } from '@/domain/adoption';
import { 
  mapAdoptionProfileDtoToModel, 
  mapCreateAdoptionProfileRequestToDto 
} from '@/mappers/adoption.mapper';

// Create API configuration
const apiConfiguration = new Configuration({
  basePath: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
});

// Initialize API client
const adoptionApi = new PetAdoptionProfileControllerApi(
  apiConfiguration, 
  undefined, 
  apiClient
);

export const adoptionService = {
  /**
   * Create adoption profile for a pet
   */
  async createAdoptionProfile(
    petId: number,
    profileData: CreateAdoptionProfileRequest
  ): Promise<AdoptionProfile> {
    try {
      console.log('🔵 adoptionService.createAdoptionProfile: Creating profile for pet:', petId);
      
      const dto = mapCreateAdoptionProfileRequestToDto(profileData);
      
      const response = await adoptionApi.createProfile({
        petId,
        petAdoptionProfileDto: dto
      });
      
      console.log('🔵 adoptionService.createAdoptionProfile: Success');
      return mapAdoptionProfileDtoToModel(response.data);
    } catch (error: any) {
      console.error('🔴 adoptionService.createAdoptionProfile - ERROR:', error.response?.status, error.response?.data);
      
      if (error.response?.status === 404) {
        throw new Error('Pet not found');
      } else if (error.response?.status === 401) {
        throw new Error('Authentication required');
      } else if (error.response?.status === 403) {
        throw new Error('You do not have permission to create adoption profile for this pet');
      } else if (error.response?.status === 409) {
        throw new Error('Adoption profile already exists for this pet');
      } else {
        throw new Error(error.response?.data?.message || error.message || 'Failed to create adoption profile');
      }
    }
  },

  /**
   * Get adoption profile for a pet
   */
  async getAdoptionProfile(petId: number): Promise<AdoptionProfile> {
    try {
      console.log('🔵 adoptionService.getAdoptionProfile: Fetching profile for pet:', petId);
      
      const response = await adoptionApi.getProfile({ petId });
      
      console.log('🔵 adoptionService.getAdoptionProfile: Success');
      return mapAdoptionProfileDtoToModel(response.data);
    } catch (error: any) {
      console.error('🔴 adoptionService.getAdoptionProfile - ERROR:', error.response?.status, error.response?.data);
      
      if (error.response?.status === 404) {
        throw new Error('Adoption profile not found');
      } else if (error.response?.status === 401) {
        throw new Error('Authentication required');
      } else {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch adoption profile');
      }
    }
  }
};
