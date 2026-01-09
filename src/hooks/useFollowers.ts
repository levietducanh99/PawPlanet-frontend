/**
 * Hook to fetch user's followers and following
 */

import { useState, useEffect } from 'react';
import { followService, FollowerUser } from '@/services/follow.service';

/**
 * Hook to fetch followers of a user
 */
export const useFollowers = (userId: number | null) => {
  const [followers, setFollowers] = useState<FollowerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchFollowers = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('🔵 useFollowers: Fetching followers for user ID:', userId);
        const data = await followService.getFollowers(userId);

        if (mounted) {
          console.log('🔵 useFollowers: Success, followers count:', data.length);
          setFollowers(data);
        }
      } catch (err) {
        console.error('🔴 useFollowers: Error:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load followers');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchFollowers();

    return () => {
      mounted = false;
    };
  }, [userId]);

  return { followers, loading, error };
};

/**
 * Hook to fetch users that a user is following
 */
export const useFollowing = (userId: number | null) => {
  const [following, setFollowing] = useState<FollowerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchFollowing = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('🔵 useFollowing: Fetching following for user ID:', userId);
        const data = await followService.getFollowing(userId);

        if (mounted) {
          console.log('🔵 useFollowing: Success, following count:', data.length);
          setFollowing(data);
        }
      } catch (err) {
        console.error('🔴 useFollowing: Error:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load following');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchFollowing();

    return () => {
      mounted = false;
    };
  }, [userId]);

  return { following, loading, error };
};

