/**
 * Pet Service - Minimal Implementation
 *
 * Currently not used by ViewPetPage (uses mock service directly)
 */

import type { Pet, CreatePetRequest } from '@/domain/pet';

// Placeholder functions - ViewPetPage uses mock service directly
export const getPetById = async (_id: number): Promise<Pet> => {
  throw new Error('Use mock service for now');
};

export const createPet = async (_request: CreatePetRequest): Promise<Pet> => {
  throw new Error('Use mock service for now');
};

export const updatePet = async (_id: number, _request: Partial<CreatePetRequest>): Promise<Pet> => {
  throw new Error('Use mock service for now');
};

export const followPet = async (_petId: number): Promise<void> => {
  throw new Error('Use mock service for now');
};

export const unfollowPet = async (_petId: number): Promise<void> => {
  throw new Error('Use mock service for now');
};
