import {
  Configuration,
  EncyclopediaClassesApi,
  EncyclopediaSpeciesApi,
  EncyclopediaBreedsApi,
  EncyclopediaSearchApi,
} from '@/services/api';

import apiClient from '@/services/apiConfig';

import type {
  EncyclopediaBreedDetail,
  EncyclopediaBreedListItem,
  EncyclopediaClass,
  EncyclopediaSearchResult,
  EncyclopediaSpeciesDetail,
  EncyclopediaSpeciesListItem,
  PagedResult,
} from '@/domain/encyclopedia';

import {
  mapAnimalClass,
  mapBreedDetail,
  mapBreedListItem,
  mapPagedBreeds,
  mapPagedSpecies,
  mapSearch,
  mapSpeciesDetail,
} from '@/mappers/encyclopedia.mapper';

const apiConfiguration = new Configuration({
  basePath: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
});

const classesApi = new EncyclopediaClassesApi(apiConfiguration, undefined, apiClient);
const speciesApi = new EncyclopediaSpeciesApi(apiConfiguration, undefined, apiClient);
const breedsApi = new EncyclopediaBreedsApi(apiConfiguration, undefined, apiClient);
const searchApi = new EncyclopediaSearchApi(apiConfiguration, undefined, apiClient);

export interface ListSpeciesParams {
  page?: number;
  size?: number;
}

export interface ListBreedsParams {
  page?: number;
  size?: number;
  speciesId?: number;
  taxonomyType?: string;
}

export const encyclopediaService = {
  async listClasses(): Promise<EncyclopediaClass[]> {
    const res = await classesApi.listAll1();
    const dtos = res.data?.result ?? [];
    return dtos.map(mapAnimalClass);
  },

  async getClassByCode(code: string): Promise<EncyclopediaClass> {
    const res = await classesApi.getByCode({ code });
    const dto = res.data?.result;
    // Normalize to frontend domain
    return mapAnimalClass(dto ?? { id: 0, name: code });
  },

  async listSpecies(params: ListSpeciesParams = {}): Promise<PagedResult<EncyclopediaSpeciesListItem>> {
    const res = await speciesApi.list({ page: params.page, size: params.size });
    return mapPagedSpecies(res.data?.result);
  },

  async getSpeciesById(id: number): Promise<EncyclopediaSpeciesDetail> {
    const res = await speciesApi.getById({ id });
    const dto = res.data?.result;
    return mapSpeciesDetail(dto ?? { id });
  },

  async searchSpecies(q: string, params: ListSpeciesParams = {}): Promise<PagedResult<EncyclopediaSpeciesListItem>> {
    const res = await speciesApi.search({ q, page: params.page, size: params.size });
    return mapPagedSpecies(res.data?.result);
  },

  async listSpeciesByClass(classId: number, params: ListSpeciesParams = {}): Promise<PagedResult<EncyclopediaSpeciesListItem>> {
    const res = await classesApi.getSpeciesByClass({ classId, page: params.page, size: params.size });
    return mapPagedSpecies(res.data?.result);
  },

  async listBreeds(params: ListBreedsParams = {}): Promise<PagedResult<EncyclopediaBreedListItem>> {
    const res = await breedsApi.list1({
      page: params.page,
      size: params.size,
      speciesId: params.speciesId,
      taxonomyType: params.taxonomyType,
    });
    return mapPagedBreeds(res.data?.result);
  },

  async listAllBreedsBySpecies(speciesId: number): Promise<EncyclopediaBreedListItem[]> {
    const res = await breedsApi.listAllBySpecies({ speciesId });
    const dtos = res.data?.result ?? [];
    return dtos.map(mapBreedListItem);
  },

  async getBreedById(id: number): Promise<EncyclopediaBreedDetail> {
    const res = await breedsApi.getById2({ id });
    const dto = res.data?.result;
    return mapBreedDetail(dto ?? { id });
  },

  async globalSearch(q: string): Promise<EncyclopediaSearchResult> {
    const res = await searchApi.search1({ q });
    const dto = res.data?.result;
    return mapSearch(dto ?? { items: [] });
  },
};
