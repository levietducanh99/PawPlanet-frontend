/**
 * Frontend Domain Models for Pet Adoption
 *
 * These types represent the frontend's view of adoption data,
 * independent of backend API structure.
 */

export interface AdoptionProfile {
  petId: number;
  healthStatus: string;
  vaccinated: boolean;
  sterilized: boolean;
  personality: string;
  habits: string;
  favoriteActivities: string;
  careInstructions: string;
  diet: string;
  adoptionRequirements: string;
  reasonForAdoption: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAdoptionProfileRequest {
  healthStatus: string;
  vaccinated: boolean;
  sterilized: boolean;
  personality: string;
  habits: string;
  favoriteActivities: string;
  careInstructions: string;
  diet: string;
  adoptionRequirements: string;
  reasonForAdoption: string;
}
