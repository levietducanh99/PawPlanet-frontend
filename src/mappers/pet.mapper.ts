import { PetProfileDTO, SpeciesResponse, BreedResponse } from '@/services/api';
import { Pet, PetMedia, CreatePetRequest, PetSummary } from '@/domain/pet';
import { CreatePetData } from '@/services/pet.service';

/**
 * Maps PetProfileDTO from API to Pet domain model
 */
export const mapPetProfileToPet = (dto: PetProfileDTO): Pet => {
  // Map media from DTO
  const media: PetMedia[] = dto.media?.map(mediaDto => ({
    id: mediaDto.id || 0,
    type: mediaDto.type || 'image',
    role: mediaDto.role || 'primary',
    url: mediaDto.url || '',
    displayOrder: mediaDto.displayOrder || 0
  })) || [];

  // Find logo URL from media
  const avatarMedia = media.find(m => m.role === 'avatar' || m.role === 'primary');
  const avatarUrl = avatarMedia?.url;

  // Map status
  let status: 'Public' | 'For Adoption' | 'Venomous' = 'Public';
  if (dto.status) {
    switch (dto.status.toLowerCase()) {
      case 'for_adoption':
      case 'adoption':
        status = 'For Adoption';
        break;
      case 'venomous':
      case 'dangerous':
        status = 'Venomous';
        break;
      default:
        status = 'Public';
    }
  }

  // Map gender
  let gender: 'male' | 'female' | undefined;
  if (dto.gender) {
    gender = dto.gender.toLowerCase() === 'male' ? 'male' : 'female';
  }

  return {
    id: dto.id || 0,
    name: dto.name || '',
    speciesId: dto.speciesId || 0,
    speciesName: dto.speciesName || '',
    breedId: dto.breedId,
    breedName: dto.breedName,
    birthDate: dto.birthDate,
    gender,
    description: dto.description,
    status,
    ownerId: dto.ownerId || 0,
    ownerUsername: dto.ownerUsername || '',
    weight: dto.weight,
    height: dto.height,
    canFollow: dto.canFollow ?? true,
    isOwner: dto.owner ?? false,
    isFollowing: dto.following ?? false,
    media,
    avatarUrl,
    followerCount: 0, // Will be fetched separately
    followingCount: 0, // Will be fetched separately
    likeCount: (dto as any).likeCount ?? 0, // Total likes from backend
    postCount: (dto as any).postCount ?? 0  // Total posts from backend
  };
};

/**
 * Maps PetProfileDTO to lightweight PetSummary for lists
 */
export const mapPetProfileToSummary = (dto: PetProfileDTO): PetSummary => {
  // Try to get avatar from direct field first (some endpoints return this)
  let avatarUrl: string | undefined = (dto as any).avatar;

  // If no direct avatar field, try to extract from media array
  if (!avatarUrl && dto.media && dto.media.length > 0) {
    const avatarMedia = dto.media.find(m => m.role === 'avatar' || m.role === 'primary');
    avatarUrl = avatarMedia?.url;

    // If still no avatar, take the first media item
    if (!avatarUrl && dto.media[0]) {
      avatarUrl = dto.media[0].url;
    }
  }

  // Get owner username with multiple fallbacks
  const ownerUsername = dto.ownerUsername || (dto as any).owner?.username || 'Unknown';

  console.log('🔵 mapPetProfileToSummary:', {
    petId: dto.id,
    petName: dto.name,
    hasDirectAvatar: !!(dto as any).avatar,
    hasMediaArray: !!dto.media,
    mediaLength: dto.media?.length || 0,
    firstMediaUrl: dto.media?.[0]?.url,
    firstMediaRole: dto.media?.[0]?.role,
    finalAvatarUrl: avatarUrl,
    ownerUsername: dto.ownerUsername,
    ownerField: (dto as any).owner,
    finalOwnerUsername: ownerUsername
  });

  return {
    id: dto.id || 0,
    name: dto.name || 'Unknown Pet',
    avatarUrl,
    speciesName: dto.speciesName || 'Unknown Species',
    breedName: dto.breedName,
    ownerUsername
  };
};

/**
 * Maps CreatePetRequest domain model to CreatePetData service model
 */
export const mapCreatePetRequestToData = (request: CreatePetRequest): CreatePetData => {
  // Map gender
  let gender: 'MALE' | 'FEMALE' | 'OTHER' | undefined;
  if (request.gender) {
    switch (request.gender.toLowerCase()) {
      case 'male':
        gender = 'MALE';
        break;
      case 'female':
        gender = 'FEMALE';
        break;
      default:
        gender = 'OTHER';
    }
  }

  return {
    name: request.name,
    speciesId: request.speciesId,
    breedId: request.breedId,
    birthDate: request.birthDate,
    gender,
    description: request.description,
    weight: request.weight,
    height: request.height,
    status: request.status || 'ACTIVE',
    url: request.url
  };
};

/**
 * Maps SpeciesResponse to simple dropdown option
 */
export interface SpeciesOption {
  id: number;
  name: string;
  scientificName?: string;
}

export const mapSpeciesToOptions = (species: SpeciesResponse[]): SpeciesOption[] => {
  return species.map(s => ({
    id: s.id || 0,
    name: s.name || '',
    scientificName: s.scientificName
  }));
};

/**
 * Maps BreedResponse to simple dropdown option
 */
export interface BreedOption {
  id: number;
  name: string;
  speciesId: number;
}

export const mapBreedsToOptions = (breeds: BreedResponse[]): BreedOption[] => {
  return breeds.map(b => ({
    id: b.id || 0,
    name: b.name || '',
    speciesId: b.speciesId || 0
  }));
};
