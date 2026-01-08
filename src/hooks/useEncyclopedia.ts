import { useCallback, useEffect, useMemo, useState } from 'react';

import type {
  EncyclopediaBreedDetail,
  EncyclopediaBreedListItem,
  EncyclopediaClass,
  EncyclopediaSearchResult,
  EncyclopediaSpeciesDetail,
  EncyclopediaSpeciesListItem,
  PagedResult,
} from '@/domain/encyclopedia';

import { encyclopediaService } from '@/services/encyclopedia.service';

const DEFAULT_PAGE_SIZE = 24;

export const useEncyclopediaClasses = () => {
  const [data, setData] = useState<EncyclopediaClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await encyclopediaService.listClasses();
      setData(res);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  return { data, loading, error, refetch: fetchAll };
};

export const useEncyclopediaSpeciesList = (params?: {
  q?: string;
  classId?: number;
  page?: number;
  size?: number;
}) => {
  const [data, setData] = useState<PagedResult<EncyclopediaSpeciesListItem>>({
    items: [],
    page: 0,
    size: params?.size ?? DEFAULT_PAGE_SIZE,
    totalItems: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const normalized = useMemo(
    () => ({
      q: params?.q?.trim() || undefined,
      classId: params?.classId,
      page: params?.page ?? 0,
      size: params?.size ?? DEFAULT_PAGE_SIZE,
    }),
    [params?.q, params?.classId, params?.page, params?.size]
  );

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (normalized.q) {
        const res = await encyclopediaService.searchSpecies(normalized.q, {
          page: normalized.page,
          size: normalized.size,
        });
        setData(res);
        return;
      }

      if (typeof normalized.classId === 'number') {
        const res = await encyclopediaService.listSpeciesByClass(normalized.classId, {
          page: normalized.page,
          size: normalized.size,
        });
        setData(res);
        return;
      }

      const res = await encyclopediaService.listSpecies({
        page: normalized.page,
        size: normalized.size,
      });
      setData(res);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [normalized.classId, normalized.page, normalized.q, normalized.size]);

  useEffect(() => {
    void fetchList();
  }, [fetchList]);

  return { data, loading, error, refetch: fetchList };
};

export const useEncyclopediaSpeciesDetail = (id?: number) => {
  const [data, setData] = useState<EncyclopediaSpeciesDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDetail = useCallback(async () => {
    if (typeof id !== 'number' || Number.isNaN(id)) return;
    setLoading(true);
    setError(null);
    try {
      const res = await encyclopediaService.getSpeciesById(id);
      setData(res);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchDetail();
  }, [fetchDetail]);

  return { data, loading, error, refetch: fetchDetail };
};

export const useEncyclopediaBreedDetail = (id?: number) => {
  const [data, setData] = useState<EncyclopediaBreedDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDetail = useCallback(async () => {
    if (typeof id !== 'number' || Number.isNaN(id)) return;
    setLoading(true);
    setError(null);
    try {
      const res = await encyclopediaService.getBreedById(id);
      setData(res);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchDetail();
  }, [fetchDetail]);

  return { data, loading, error, refetch: fetchDetail };
};

export const useEncyclopediaSearch = () => {
  const [data, setData] = useState<EncyclopediaSearchResult>({ items: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const search = useCallback(async (q: string) => {
    const query = q.trim();
    if (!query) {
      setData({ items: [] });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await encyclopediaService.globalSearch(query);
      setData(res);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, search };
};

export const useEncyclopediaBreedsBySpecies = (speciesId?: number) => {
  const [data, setData] = useState<EncyclopediaBreedListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBreeds = useCallback(async () => {
    if (typeof speciesId !== 'number' || Number.isNaN(speciesId)) {
      setData([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await encyclopediaService.listAllBreedsBySpecies(speciesId);
      setData(res);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [speciesId]);

  useEffect(() => {
    void fetchBreeds();
  }, [fetchBreeds]);

  return { data, loading, error, refetch: fetchBreeds };
};

export const useEncyclopediaBreedDetailBySlug = (slug?: string) => {
  const [data, setData] = useState<EncyclopediaBreedDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    try {
      const res = await encyclopediaService.getBreedBySlug(slug);
      setData(res);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void fetchDetail();
  }, [fetchDetail]);

  return { data, loading, error, refetch: fetchDetail };
};

export const useEncyclopediaSpeciesDetailBySlug = (slug?: string) => {
  const [data, setData] = useState<EncyclopediaSpeciesDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    try {
      const res = await encyclopediaService.getSpeciesBySlug(slug);
      setData(res);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void fetchDetail();
  }, [fetchDetail]);

  return { data, loading, error, refetch: fetchDetail };
};
