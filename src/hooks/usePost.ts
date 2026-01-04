/**
 * Post & Timeline Hooks
 *
 * React hooks for post and timeline related data management.
 * Currently using MOCK data for UI development.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getPetProfile,
  getPetTimeline,
  getUserPets,
  createPost,
  togglePostLike,
  getPostComments,
  sharePost
} from '@/services/post.service.mock';
import type { Post, PetTimeline, CreatePostRequest, Comment, PetProfile } from '@/domain/post';

/**
 * Hook for managing pet profile data
 */
export const usePetProfile = (petId: number | null) => {
  const [profile, setProfile] = useState<PetProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (!petId) return;

    try {
      setLoading(true);
      setError(null);
      const profileData = await getPetProfile(petId);
      setProfile(profileData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load pet profile';
      setError(errorMessage);
      console.error('Error loading pet profile:', err);
    } finally {
      setLoading(false);
    }
  }, [petId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    loading,
    error,
    refetch: loadProfile
  };
};

/**
 * Hook for managing pet timeline
 */
export const usePetTimeline = (petId: number | null) => {
  const [timeline, setTimeline] = useState<PetTimeline | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadTimeline = useCallback(async (refresh: boolean = false) => {
    if (!petId) return;

    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const timelineData = await getPetTimeline(petId, 1, 20);
      setTimeline(timelineData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load timeline';
      setError(errorMessage);
      console.error('Error loading timeline:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [petId]);

  useEffect(() => {
    if (petId) {
      loadTimeline();
    }
  }, [loadTimeline]);

  const refresh = useCallback(() => {
    loadTimeline(true);
  }, [loadTimeline]);

  return {
    timeline,
    loading,
    error,
    refreshing,
    refresh,
    refetch: loadTimeline
  };
};

/**
 * Hook for managing user's pets
 */
export const useUserPets = () => {
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserPets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userPets = await getUserPets();
      setPets(userPets);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load user pets';
      setError(errorMessage);
      console.error('Error loading user pets:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserPets();
  }, [loadUserPets]);

  return {
    pets,
    loading,
    error,
    refetch: loadUserPets
  };
};

/**
 * Hook for post interactions (like, comment, share)
 */
export const usePostActions = () => {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  const likePost = useCallback(async (postId: number, isCurrentlyLiked: boolean) => {
    const key = `like-${postId}`;
    try {
      setLoading(prev => ({ ...prev, [key]: true }));
      await togglePostLike(postId, isCurrentlyLiked);
      return !isCurrentlyLiked;
    } catch (err) {
      console.error('Error liking post:', err);
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  }, []);

  const sharePostAction = useCallback(async (postId: number) => {
    const key = `share-${postId}`;
    try {
      setLoading(prev => ({ ...prev, [key]: true }));
      await sharePost(postId);
    } catch (err) {
      console.error('Error sharing post:', err);
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  }, []);

  return {
    likePost,
    sharePost: sharePostAction,
    loading
  };
};

/**
 * Hook for creating new posts
 */
export const useCreatePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (request: CreatePostRequest): Promise<Post | null> => {
    try {
      setLoading(true);
      setError(null);
      const newPost = await createPost(request);
      return newPost;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create post';
      setError(errorMessage);
      console.error('Error creating post:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    create,
    loading,
    error
  };
};

/**
 * Hook for managing post comments
 */
export const usePostComments = (postId: number | null) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    if (!postId) return;

    try {
      setLoading(true);
      setError(null);
      const commentsData = await getPostComments(postId);
      setComments(commentsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load comments';
      setError(errorMessage);
      console.error('Error loading comments:', err);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  return {
    comments,
    loading,
    error,
    refetch: loadComments
  };
};
