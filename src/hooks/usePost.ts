/**
 * Post & Timeline Hooks
 */
import { useState, useEffect, useCallback } from 'react';
import {
  getNewsFeed,
  getMyPosts,
  getPostById,
  getPostsByPetId,
  getPostsByUserId,
  createPost as createPostService,
  deletePost as deletePostService,
  updatePost as updatePostService,
} from '@/services/post.service';
import { togglePostLike } from '@/services/like.service';
import { getCommentsByPostId, createComment } from '@/services/comment.service';
import {
  getPetProfile,
  getPetTimeline,
  sharePost
} from '@/services/post.service.mock';
import type { Post, PetTimeline, CreatePostRequest, PetProfile } from '@/domain/post';
import type { UpdatePostRequest } from '@/services/api';
import type { Comment } from '@/services/comment.service';
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
    } finally {
      setLoading(false);
    }
  }, [petId]);
  useEffect(() => { loadProfile(); }, [loadProfile]);
  return { profile, loading, error, refetch: loadProfile };
};
export const usePetTimeline = (petId: number | null) => {
  const [timeline, setTimeline] = useState<PetTimeline | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const loadTimeline = useCallback(async (refresh = false) => {
    if (!petId) return;
    try {
      if (refresh) setRefreshing(true); else setLoading(true);
      setError(null);
      const timelineData = await getPetTimeline(petId, 1, 20);
      setTimeline(timelineData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load timeline');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [petId]);
  useEffect(() => { if (petId) loadTimeline(); }, [loadTimeline, petId]);
  const refresh = useCallback(() => loadTimeline(true), [loadTimeline]);
  return { timeline, loading, error, refreshing, refresh, refetch: loadTimeline };
};

export const usePostActions = () => {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const likePost = useCallback(async (postId: number) => {
    const key = `like-${postId}`;
    try {
      setLoading(prev => ({ ...prev, [key]: true }));
      return await togglePostLike(postId);
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  }, []);

  const sharePostAction = useCallback(async (postId: number) => {
    const key = `share-${postId}`;
    try {
      setLoading(prev => ({ ...prev, [key]: true }));
      await sharePost(postId);
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  }, []);

  const deletePostAction = useCallback(async (postId: number) => {
    const key = `delete-${postId}`;
    try {
      setLoading(prev => ({ ...prev, [key]: true }));
      await deletePostService(postId);
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  }, []);

  const updatePostAction = useCallback(async (postId: number, data: UpdatePostRequest) => {
    const key = `update-${postId}`;
    try {
      setLoading(prev => ({ ...prev, [key]: true }));
      return await updatePostService(postId, data);
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  }, []);

  return { likePost, sharePost: sharePostAction, deletePost: deletePostAction, updatePost: updatePostAction, loading };
};
export const useCreatePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const create = useCallback(async (request: CreatePostRequest): Promise<Post | null> => {
    try {
      setLoading(true);
      return await createPostService(request);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  return { create, loading, error };
};
export const useNewsFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const loadFeed = useCallback(async (refresh = false) => {
    try {
      if (refresh) setRefreshing(true); else setLoading(true);
      setError(null);
      const feedPosts = await getNewsFeed();
      setPosts(feedPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load news feed');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);
  useEffect(() => { loadFeed(); }, [loadFeed]);
  const refresh = useCallback(() => loadFeed(true), [loadFeed]);
  return { posts, loading, error, refreshing, refresh, refetch: loadFeed };
};
export const useMyPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      const myPosts = await getMyPosts();
      setPosts(myPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { loadPosts(); }, [loadPosts]);
  return { posts, loading, error, refetch: loadPosts };
};
export const usePostDetail = (postId: number | null) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadPost = useCallback(async () => {
    if (!postId) return;
    try {
      setLoading(true);
      const postData = await getPostById(postId);
      setPost(postData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setLoading(false);
    }
  }, [postId]);
  useEffect(() => { loadPost(); }, [loadPost]);
  return { post, loading, error, refetch: loadPost };
};
export const usePetPosts = (petId: number | null) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadPosts = useCallback(async () => {
    if (!petId) return;
    try {
      setLoading(true);
      const petPosts = await getPostsByPetId(petId);
      setPosts(petPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setLoading(false);
    }
  }, [petId]);
  useEffect(() => { loadPosts(); }, [loadPosts]);
  return { posts, loading, error, refetch: loadPosts };
};
export const useUserPosts = (userId: number | null) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadPosts = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const userPosts = await getPostsByUserId(userId);
      setPosts(userPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setLoading(false);
    }
  }, [userId]);
  useEffect(() => { loadPosts(); }, [loadPosts]);
  return { posts, loading, error, refetch: loadPosts };
};

export const usePostComments = (postId: number | null) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    if (!postId) return;
    try {
      setLoading(true);
      setError(null);
      const commentsData = await getCommentsByPostId(postId);
      setComments(commentsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  const addComment = useCallback(async (content: string) => {
    if (!postId) return null;
    try {
      setCreating(true);
      setError(null);
      const newComment = await createComment(postId, content);
      setComments(prev => [...prev, newComment]);
      return newComment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create comment');
      throw err;
    } finally {
      setCreating(false);
    }
  }, [postId]);

  useEffect(() => { loadComments(); }, [loadComments]);

  return {
    comments,
    loading,
    creating,
    error,
    refetch: loadComments,
    addComment,
  };
};

