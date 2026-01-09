// src/services/like.service.ts
import { LikeControllerApi, LikeRequest, LikeDetailResponse } from '@/services/api';
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

/**
 * Get all likes for a post
 */
export const getAllLikes = async (postId: number): Promise<{ userId: number; username: string; avatarUrl?: string }[]> => {
  const res = await api.getAllLikes({ postId });
  const data: LikeDetailResponse[] = res.data || [];
  return data.map((dto) => ({
    userId: dto.userId ?? 0,
    username: dto.userName || 'Unknown',
    avatarUrl: dto.userAvatar,
  }));
};
