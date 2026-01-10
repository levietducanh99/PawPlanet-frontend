/**
 * Search mappers - backend DTO to frontend domain
 */

import type { GlobalSearchResponse, SearchUserDTO, SearchPetDTO } from '@/services/api/api';
import type { GlobalSearchResult, SearchUser, SearchPet } from '@/domain/search';

export const mapSearchUser = (dto: SearchUserDTO): SearchUser => ({
  id: dto.id || 0,
  username: dto.username || '',
  fullName: dto.fullName,
  avatarUrl: dto.avatarUrl
});

export const mapSearchPet = (dto: SearchPetDTO): SearchPet => ({
  id: dto.id || 0,
  name: dto.name || '',
  species: dto.species,
  breed: dto.breed,
  avatarUrl: dto.avatarUrl
});

export const mapGlobalSearchResult = (response: GlobalSearchResponse): GlobalSearchResult => ({
  users: response.users?.map(mapSearchUser) || [],
  pets: response.pets?.map(mapSearchPet) || []
});

