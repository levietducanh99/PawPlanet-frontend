import type {
  AnimalClassResponse,
  BreedDetailResponse,
  BreedResponse,
  EncyclopediaMediaResponse,
  SearchResponse,
  SpeciesDetailResponse,
  SpeciesResponse,
  PagedResultSpeciesResponse,
  PagedResultBreedResponse,
  SpeciesAttributeResponse,
  BreedAttributeResponse,
  SpeciesSectionContentResponse,
  BreedSectionContentResponse,
  SearchResultItem,
} from '@/services/api';

import type {
  EncyclopediaAttribute,
  EncyclopediaBreedDetail,
  EncyclopediaBreedListItem,
  EncyclopediaClass,
  EncyclopediaMedia,
  EncyclopediaSearchItem,
  EncyclopediaSearchResult,
  EncyclopediaSection,
  EncyclopediaSpeciesDetail,
  EncyclopediaSpeciesListItem,
  PagedResult,
} from '@/domain/encyclopedia';

const mapMedia = (dto: EncyclopediaMediaResponse): EncyclopediaMedia => ({
  id: dto.id ?? 0,
  url: dto.url ?? '',
  type: dto.type,
  role: dto.role,
  displayOrder: dto.displayOrder,
});

const mapSpeciesAttribute = (dto: SpeciesAttributeResponse): EncyclopediaAttribute => ({
  id: dto.id ?? 0,
  key: dto.key ?? '',
  // Backend provides min/max for numeric attributes.
  valueMin: dto.valueMin,
  valueMax: dto.valueMax,
  unit: dto.unit,
  displayOrder: dto.displayOrder,
});

const mapBreedAttribute = (dto: BreedAttributeResponse): EncyclopediaAttribute => ({
  id: dto.id ?? 0,
  key: dto.key ?? '',
  value: dto.value,
  displayOrder: dto.displayOrder,
});

const mapSpeciesSection = (dto: SpeciesSectionContentResponse): EncyclopediaSection => ({
  id: dto.id ?? 0,
  title: dto.sectionName ?? dto.sectionCode ?? 'Section',
  content: dto.content,
  displayOrder: dto.displayOrder,
});

const mapBreedSection = (dto: BreedSectionContentResponse): EncyclopediaSection => ({
  id: dto.id ?? 0,
  title: dto.sectionName ?? dto.sectionCode ?? 'Section',
  content: dto.content,
  displayOrder: dto.displayOrder,
});

export const mapAnimalClass = (dto: AnimalClassResponse): EncyclopediaClass => ({
  id: dto.id ?? 0,
  name: dto.name ?? '',
  code: dto.code,
  slug: dto.slug,
  description: dto.description,
  avatarUrl: dto.avatarUrl,
});

export const mapSpeciesListItem = (dto: SpeciesResponse): EncyclopediaSpeciesListItem => ({
  id: dto.id ?? 0,
  classId: dto.classId,
  name: dto.name ?? '',
  slug: dto.slug,
  scientificName: dto.scientificName,
  description: dto.description,
  avatarUrl: dto.avatarUrl,
});

export const mapBreedListItem = (dto: BreedResponse): EncyclopediaBreedListItem => ({
  id: dto.id ?? 0,
  speciesId: dto.speciesId ?? 0,
  name: dto.name ?? '',
  slug: dto.slug,
  origin: dto.origin,
  shortDescription: dto.shortDescription,
  taxonomyType: dto.taxonomyType,
  avatarUrl: dto.avatarUrl,
});

export const mapSpeciesDetail = (dto: SpeciesDetailResponse): EncyclopediaSpeciesDetail => ({
  id: dto.id ?? 0,
  classId: dto.classId,
  name: dto.name ?? '',
  slug: dto.slug,
  scientificName: dto.scientificName,
  description: dto.description,
  heroUrl: dto.heroUrl,
  thumbnailUrl: dto.thumbnailUrl,
  galleryPreview: (dto.galleryPreview ?? []).map(mapMedia),
  attributes: (dto.attributes ?? []).map(mapSpeciesAttribute),
  sections: (dto.sections ?? []).map(mapSpeciesSection),
});

export const mapBreedDetail = (dto: BreedDetailResponse): EncyclopediaBreedDetail => ({
  id: dto.id ?? 0,
  speciesId: dto.speciesId,
  name: dto.name ?? '',
  slug: dto.slug,
  origin: dto.origin,
  shortDescription: dto.shortDescription,
  taxonomyType: dto.taxonomyType,
  heroUrl: dto.heroUrl,
  thumbnailUrl: dto.thumbnailUrl,
  galleryPreview: (dto.galleryPreview ?? []).map(mapMedia),
  attributes: (dto.attributes ?? []).map(mapBreedAttribute),
  sections: (dto.sections ?? []).map(mapBreedSection),
});

export const mapSearch = (dto: SearchResponse): EncyclopediaSearchResult => {
  const items: EncyclopediaSearchItem[] = [];

  const pushItem = (raw: SearchResultItem): void => {
    const type = (raw.type ?? '').toUpperCase();
    const id = raw.id ?? 0;

    let normalizedType: EncyclopediaSearchItem['type'] = 'SPECIES';
    if (type === 'CLASS' || type === 'ANIMAL_CLASS') normalizedType = 'CLASS';
    else if (type === 'BREED') normalizedType = 'BREED';
    else if (type === 'SPECIES') normalizedType = 'SPECIES';

    items.push({
      key: `${normalizedType}-${id}`,
      type: normalizedType,
      id,
      title: raw.name ?? '',
      subtitle: raw.subtitle,
      imageUrl: raw.avatarUrl,
    });
  };

  (dto.items ?? []).forEach(pushItem);
  return { items };
};

export const mapPagedSpecies = (
  dto?: PagedResultSpeciesResponse
): PagedResult<EncyclopediaSpeciesListItem> => ({
  items: (dto?.items ?? []).map(mapSpeciesListItem),
  page: dto?.page ?? 0,
  size: dto?.size ?? 0,
  totalItems: dto?.totalElements ?? 0,
  totalPages: dto?.size ? Math.ceil((dto?.totalElements ?? 0) / dto.size) : 0,
});

export const mapPagedBreeds = (
  dto?: PagedResultBreedResponse
): PagedResult<EncyclopediaBreedListItem> => ({
  items: (dto?.items ?? []).map(mapBreedListItem),
  page: dto?.page ?? 0,
  size: dto?.size ?? 0,
  totalItems: dto?.totalElements ?? 0,
  totalPages: dto?.size ? Math.ceil((dto?.totalElements ?? 0) / dto.size) : 0,
});

