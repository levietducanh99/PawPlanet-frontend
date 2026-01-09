import { useState, useEffect, useCallback } from 'react';
import { ExploreItemUnion } from '@/domain/explore';
import { exploreService } from '@/services/explore.service';

interface UseExploreFeedResult {
  items: ExploreItemUnion[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
}

/**
 * Custom hook for explore feed with infinite scroll
 */
export function useExploreFeed(limit: number = 30): UseExploreFeedResult {
  const [items, setItems] = useState<ExploreItemUnion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seed, setSeed] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);

  const fetchItems = useCallback(async (currentSeed?: string, append: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const response = await exploreService.getExploreFeed({
        limit,
        seed: currentSeed,
      });

      if (append) {
        setItems(prev => [...prev, ...(response.items as ExploreItemUnion[])]);
      } else {
        setItems(response.items as ExploreItemUnion[]);
      }

      setSeed(response.seed);
      setHasMore(response.items.length === limit);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load explore feed');
      console.error('Explore feed error:', err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchItems(seed, true);
    }
  }, [loading, hasMore, seed, fetchItems]);

  const refresh = useCallback(() => {
    setSeed(undefined);
    fetchItems(undefined, false);
  }, [fetchItems]);

  // Initial load
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
  };
}

