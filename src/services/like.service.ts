// src/services/like.service.ts
import { LikeControllerApi, LikeRequest } from '@/services/api';
import { apiClient } from './apiConfig';

const api = new LikeControllerApi(undefined, undefined, apiClient);

/**
 * Toggle like/unlike on a post
 */
export const togglePostLike = async (postId: number): Promise<{ liked: boolean; likeCount: number }> => {
  const likeRequest: LikeRequest = {
    postId,
  };

  const res = await api.toggleLike({ likeRequest });

  return {
    liked: res.data.liked ?? false,
    likeCount: res.data.likeCount ?? 0,
  };
};

