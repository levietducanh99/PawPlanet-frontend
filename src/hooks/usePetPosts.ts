// src/hooks/usePetPosts.ts
import { useState, useEffect } from 'react';
import { petService } from '@/services/pet.service';
import { mapPosts } from '@/mappers/post.mapper';
import { Post } from '@/domain/post';

export const usePetPosts = (petId: number | null | undefined) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!petId) {
      setPosts([]);
      return;
    }

    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('🔵 usePetPosts: Fetching posts for pet ID:', petId);
        const postResponses = await petService.getPetPosts(petId);
        const mappedPosts = mapPosts(postResponses);

        console.log('🔵 usePetPosts: Posts loaded:', mappedPosts.length);
        setPosts(mappedPosts);
      } catch (err: any) {
        console.error('🔴 usePetPosts: Error loading posts:', err);
        setError(err.message || 'Failed to load posts');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [petId]);

  const refetch = async () => {
    if (petId) {
      setLoading(true);
      try {
        const postResponses = await petService.getPetPosts(petId);
        const mappedPosts = mapPosts(postResponses);
        setPosts(mappedPosts);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load posts');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    posts,
    loading,
    error,
    refetch
  };
};

