/**
 * Follow Hooks
 * Hooks for managing user followers and following
 */

import { useState, useCallback, useEffect } from 'react';
import { followService, type FollowerUser } from '@/services/follow.service';

interface UseFollowersReturn {
  followers: FollowerUser[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseFollowingReturn {
  following: FollowerUser[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseFollowActionsReturn {
  following: boolean;
  loading: boolean;
  toggleFollow: () => Promise<void>;
  error: string | null;
}

/**
 * Hook to get followers list for a user
 */
export const useFollowers = (userId: number | null): UseFollowersReturn => {
  const [followers, setFollowers] = useState<FollowerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFollowers = useCallback(async () => {
    if (!userId) {
      setFollowers([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await followService.getFollowers(userId);
      setFollowers(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load followers';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadFollowers();
  }, [loadFollowers]);

  return { followers, loading, error, refetch: loadFollowers };
};

/**
 * Hook to get following list for a user
 */
export const useFollowing = (userId: number | null): UseFollowingReturn => {
  const [following, setFollowing] = useState<FollowerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFollowing = useCallback(async () => {
    if (!userId) {
      setFollowing([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await followService.getFollowing(userId);
      setFollowing(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load following';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadFollowing();
  }, [loadFollowing]);

  return { following, loading, error, refetch: loadFollowing };
};

/**
 * Hook to handle follow/unfollow actions for a specific user
 */
export const useFollowActions = (userId: number | null, initialFollowing = false): UseFollowActionsReturn => {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleFollow = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      if (following) {
        await followService.unfollow(userId);
        setFollowing(false);
      } else {
        await followService.follow(userId);
        setFollowing(true);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update follow status';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId, following]);

  return { following, loading, toggleFollow, error };
};
