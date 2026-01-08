// src/hooks/useCreatePost.ts
import { useState, useCallback } from 'react';
import { createPost } from '@/services/post.service';
import { Post } from '@/domain/post';
import type { CreatePostRequest as DomainCreatePostRequest } from '@/domain/post';

export const useCreatePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Post | null>(null);

  const submit = useCallback(async (data: DomainCreatePostRequest) => {
    setLoading(true);
    setError(null);
    try {
      // Pass domain request directly to service; service handles mapping to API
      const post = await createPost(data);
      setResult(post);
      return post;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { submit, loading, error, result };
};
