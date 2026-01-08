/**
 * Frontend Domain Models for Pet
 *
 * These types represent the frontend's view of pet data,
 * independent of backend API structure.
 */

export interface Pet {
  id: number;
  name: string;
  speciesId: number;
  speciesName: string;
  breedId?: number;
  breedName?: string;
  birthDate?: string;
  gender?: 'male' | 'female';
  description?: string;
  status: 'Public' | 'For Adoption' | 'Venomous';
  ownerId: number;
  ownerUsername: string;
  weight?: number;
  height?: number;
  canFollow?: boolean;
  isOwner?: boolean;
  isFollowing?: boolean;
  media: PetMedia[];
  // These will be fetched separately or calculated on frontend
  avatarUrl?: string; // derived from media array
  followerCount: number; // will be fetched separately
  followingCount: number; // will be fetched separately
}

export interface PetMedia {
  id: number;
  type: string;
  role: string;
  url: string;
  displayOrder: number;
}

export interface PetStats {
  followerCount: number;
  followingCount: number;
  postCount: number;
}

export interface CreatePetRequest {
  name: string;
  speciesId: number;
  breedId?: number;
  birthDate?: string;
  gender?: string;
  description?: string;
  status?: string;
  weight?: number;
  height?: number;
  url?: string;
}
