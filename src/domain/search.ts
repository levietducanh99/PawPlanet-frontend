/**
 * Frontend domain models for global search
 */

export interface SearchUser {
  id: number;
  username: string;
  fullName?: string;
  avatarUrl?: string;
}

export interface SearchPet {
  id: number;
  name: string;
  species?: string;
  breed?: string;
  avatarUrl?: string;
}

export interface GlobalSearchResult {
  users: SearchUser[];
  pets: SearchPet[];
}

export type SearchType = 'user' | 'pet' | 'all';

