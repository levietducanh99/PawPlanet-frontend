/**
 * Frontend Domain Models for Encyclopedia
 *
 * These types are UI-facing and must stay stable even if backend DTOs change.
 */

export interface EncyclopediaClass {
  id: number;
  name: string;
  code?: string;
  slug?: string;
  description?: string;
  avatarUrl?: string;
}

export interface EncyclopediaSearchItem {
  /** Unique across types, formatted like `${type}-${id}` */
  key: string;
  type: 'CLASS' | 'SPECIES' | 'BREED';
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
}

export interface EncyclopediaSearchResult {
  items: EncyclopediaSearchItem[];
}

export interface EncyclopediaSpeciesListItem {
  id: number;
  classId?: number;
  name: string;
  slug?: string;
  scientificName?: string;
  description?: string;
  avatarUrl?: string;
}

export interface EncyclopediaSpeciesDetail {
  id: number;
  classId?: number;
  name: string;
  slug?: string;
  scientificName?: string;
  description?: string;
  heroUrl?: string;
  thumbnailUrl?: string;
  galleryPreview: EncyclopediaMedia[];
  attributes: EncyclopediaAttribute[];
  sections: EncyclopediaSection[];
}

export interface EncyclopediaBreedListItem {
  id: number;
  speciesId: number;
  name: string;
  slug?: string;
  origin?: string;
  shortDescription?: string;
  taxonomyType?: string;
  avatarUrl?: string;
}

export interface EncyclopediaBreedDetail {
  id: number;
  speciesId?: number;
  name: string;
  slug?: string;
  origin?: string;
  shortDescription?: string;
  taxonomyType?: string;
  heroUrl?: string;
  thumbnailUrl?: string;
  galleryPreview: EncyclopediaMedia[];
  attributes: EncyclopediaAttribute[];
  sections: EncyclopediaSection[];
}

export interface EncyclopediaMedia {
  id: number;
  url: string;
  type?: string;
  role?: string;
  displayOrder?: number;
}

export interface EncyclopediaAttribute {
  id: number;
  key: string;
  value?: string;
  valueMin?: number;
  valueMax?: number;
  unit?: string;
  displayOrder?: number;
}

export interface EncyclopediaSection {
  id: number;
  title: string;
  content?: string;
  displayOrder?: number;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

