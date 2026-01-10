/**
 * Hooks for urgent posts functionality
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { getUrgentPosts, countUrgentPosts } from '@/services/post.service';
import type { Post } from '@/domain/post';

/**
 * Hook to fetch and manage urgent posts
 */
export const useUrgentPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadPosts = useCallback(async (refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      
      const urgentPosts = await getUrgentPosts();
      setPosts(urgentPosts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load urgent posts';
      setError(errorMessage);
      console.error('Failed to load urgent posts:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const refresh = useCallback(() => loadPosts(true), [loadPosts]);

  return { posts, loading, error, refreshing, refresh, refetch: loadPosts };
};

/**
 * Hook to fetch urgent posts count with polling
 * @param pollingInterval - Interval in milliseconds (default: 30000 = 30 seconds)
 * @param enabled - Whether polling is enabled (default: true)
 */
export const useUrgentPostCount = (pollingInterval = 30000, enabled = true) => {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchCount = useCallback(async () => {
    try {
      setError(null);
      const urgentCount = await countUrgentPosts();
      setCount(urgentCount);
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load urgent count';
      setError(errorMessage);
      console.error('Failed to fetch urgent post count:', err);
      setLoading(false);
      // Don't throw error - fail silently for badge count
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      // Clear interval and reset when disabled
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Initial fetch
    fetchCount();

    // Set up polling
    intervalRef.current = setInterval(() => {
      fetchCount();
    }, pollingInterval);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [fetchCount, pollingInterval, enabled]);

  return { count, loading, error, refetch: fetchCount };
};
