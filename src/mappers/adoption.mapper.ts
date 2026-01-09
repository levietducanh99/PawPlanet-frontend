/**
 * Mappers for Adoption Profile
 * 
 * Maps between backend DTOs and frontend domain models.
 * This file is the ONLY place that should break when backend changes.
 */

import { PetAdoptionProfileDto } from '@/services/api';
import type { AdoptionProfile, CreateAdoptionProfileRequest } from '@/domain/adoption';

/**
 * Map backend DTO to frontend domain model
 */
export const mapAdoptionProfileDtoToModel = (dto: PetAdoptionProfileDto): AdoptionProfile => {
  return {
    petId: dto.petId || 0,
    healthStatus: dto.healthStatus || '',
    vaccinated: dto.vaccinated || false,
    sterilized: dto.sterilized || false,
    personality: dto.personality || '',
    habits: dto.habits || '',
    favoriteActivities: dto.favoriteActivities || '',
    careInstructions: dto.careInstructions || '',
    diet: dto.diet || '',
    adoptionRequirements: dto.adoptionRequirements || '',
    reasonForAdoption: dto.reasonForAdoption || '',
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
};

/**
 * Map frontend request to backend DTO
 */
export const mapCreateAdoptionProfileRequestToDto = (
  request: CreateAdoptionProfileRequest
): PetAdoptionProfileDto => {
  return {
    healthStatus: request.healthStatus,
    vaccinated: request.vaccinated,
    sterilized: request.sterilized,
    personality: request.personality,
    habits: request.habits,
    favoriteActivities: request.favoriteActivities,
    careInstructions: request.careInstructions,
    diet: request.diet,
    adoptionRequirements: request.adoptionRequirements,
    reasonForAdoption: request.reasonForAdoption,
  };
};
