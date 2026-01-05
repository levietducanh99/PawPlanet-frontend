/**
 * Pet Data Mappers
 *
 * Maps backend DTOs to frontend domain models.
 * This is the only place that should know about backend structure.
 */

import type { Pet, PetMedia } from '@/domain/pet';

// For now, we'll create placeholder types since the mapper isn't used in ViewPetPage
export const mapPetMedia = (dto: any): PetMedia => ({
  id: dto.id || 0,
  type: dto.type || '',
  role: dto.role || '',
  url: dto.url || '',
  displayOrder: dto.displayOrder || 0,
});

export const mapPet = (dto: any): Pet => ({
  id: dto.id || 0,
  name: dto.name || '',
  speciesId: dto.speciesId || 0,
  speciesName: dto.speciesName || '',
  breedId: dto.breedId,
  breedName: dto.breedName,
  birthDate: dto.birthDate,
  gender: dto.gender as 'male' | 'female' | undefined,
  description: dto.description,
  status: (dto.status as 'Public' | 'For Adoption' | 'Venomous') || 'Public',
  ownerId: dto.ownerId || 0,
  ownerUsername: dto.ownerUsername || '',
  weight: dto.weight,
  height: dto.height,
  canFollow: dto.canFollow || false,
  isOwner: dto.owner || false,
  isFollowing: dto.following || false,
  media: dto.media ? dto.media.map(mapPetMedia) : [],
  avatarUrl: dto.media?.find((m: any) => m.role === 'avatar')?.url,
  followerCount: 0,
  followingCount: 0,
});
