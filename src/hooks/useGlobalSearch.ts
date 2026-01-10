/**
 * Global search hook
 */

import { useState, useCallback } from 'react';
import { searchService } from '@/services/search.service';
import type { GlobalSearchResult, SearchType } from '@/domain/search';

export const useGlobalSearch = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GlobalSearchResult>({ users: [], pets: [] });

  const search = useCallback(async (query: string, type: SearchType = 'all', limit: number = 10) => {
    if (query.length < 2) {
      setResults({ users: [], pets: [] });
      return;
    }

    setLoading(true);
    try {
      const result = await searchService.globalSearch(query, type, limit);
      setResults(result);
    } catch (error) {
      console.error('Search error:', error);
      setResults({ users: [], pets: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults({ users: [], pets: [] });
  }, []);

  return {
    loading,
    results,
    search,
    clearResults
  };
};

