// src/services/comment.service.ts
import { CommentControllerApi, CommentRequest, CommentDetailResponse } from '@/services/api';
import { apiClient } from './apiConfig';

const api = new CommentControllerApi(undefined, undefined, apiClient);

export interface Comment {
  id: number;
  postId: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  likeCount: number;
  liked: boolean;
  parentId?: number | null;
  replies?: Comment[];
}

/**
 * Get all comments for a post
 */
export const getCommentsByPostId = async (postId: number): Promise<Comment[]> => {
  const res = await api.getAllComments({ postId });

  // Helper to map possible nested dto replies
  const mapDtoToComment = (dto: CommentDetailResponse): Comment => ({
    id: dto.id ?? 0,
    postId: postId,
    userId: dto.userId ?? 0,
    userName: dto.userName ?? 'Unknown',
    userAvatar: dto.userAvatar,
    content: dto.content ?? '',
    createdAt: dto.createdAt ?? new Date().toISOString(),
    likeCount: 0,
    liked: false,
    parentId: dto.parentId ?? null,
    replies: ((dto as any).replies || (dto as any).children || []).map((r: CommentDetailResponse) => mapDtoToComment(r)),
  });

  return (res.data || []).map(mapDtoToComment);
};

/**
 * Create a new comment on a post
 */
export const createComment = async (postId: number, content: string, parentId?: number): Promise<Comment> => {
  const commentRequest: CommentRequest = {
    postId,
    content,
    parentId,
  };

  const res = await api.createComment({ commentRequest });

  return {
    id: res.data.id ?? 0,
    postId: res.data.postId ?? postId,
    userId: res.data.userId ?? 0,
    userName: 'You',
    content: res.data.content ?? '',
    createdAt: res.data.createdAt ?? new Date().toISOString(),
    likeCount: 0,
    liked: false,
  };
};
