// src/services/post.service.ts
import { PostControllerApi, CreatePostRequest as ApiCreatePostRequest, MediaUrlRequest as ApiMediaUrlRequest } from '@/services/api';
import { mapPost, mapPosts } from '@/mappers/post.mapper';
import { Post, CreatePostRequest as DomainCreatePostRequest, PostMediaRequest } from '@/domain/post';
import { apiClient } from './apiConfig';

const api = new PostControllerApi(undefined, undefined, apiClient);

/**
 * Tạo post mới
 */
export const createPost = async (data: DomainCreatePostRequest): Promise<Post> => {
  // Map domain CreatePostRequest sang API CreatePostRequest
  const apiMediaUrls: ApiMediaUrlRequest[] | undefined = data.mediaUrls?.map((m: PostMediaRequest) => ({
    // The generated API expects 'url' field; backend now interprets this as publicId
    url: m.publicId,
    type: m.type,
  }));

  const apiRequest: ApiCreatePostRequest = {
    content: data.content,
    petIds: data.petIds ?? (data.petId ? [data.petId] : undefined),
    hashtags: data.hashtags,
    type: data.type,
    mediaUrls: apiMediaUrls,
  } as ApiCreatePostRequest;

  const res = await api.createPost({ createPostRequest: apiRequest });
  return mapPost(res.data);
};

/**
 * Lấy danh sách post của user hiện tại
 */
export const getMyPosts = async (): Promise<Post[]> => {
  const res = await api.getMyPosts();
  return mapPosts(res.data);
};

/**
 * Lấy news feed
 */
export const getNewsFeed = async (): Promise<Post[]> => {
  const res = await api.getNewsFeed();
  return mapPosts(res.data);
};

/**
 * Lấy post theo ID
 */
export const getPostById = async (id: number): Promise<Post> => {
  const res = await api.getPostById({ id });
  return mapPost(res.data);
};

/**
 * Lấy danh sách post của pet
 */
export const getPostsByPetId = async (petId: number): Promise<Post[]> => {
  const res = await api.getPostsByPetId({ petId });
  return mapPosts(res.data);
};

/**
 * Lấy danh sách post của user
 */
export const getPostsByUserId = async (userId: number): Promise<Post[]> => {
  const res = await api.getPostsByUserId({ userId });
  return mapPosts(res.data);
};

/**
 * Cập nhật post
 */
export const updatePost = async (id: number, data: DomainCreatePostRequest): Promise<Post> => {
  // Map similar to create
  const apiMediaUrls: ApiMediaUrlRequest[] | undefined = data.mediaUrls?.map((m: PostMediaRequest) => ({ url: m.publicId, type: m.type }));
  const updateReq: any = {
    content: data.content,
    mediaUrls: apiMediaUrls,
    hashtags: data.hashtags,
    type: data.type,
  };
  const res = await api.updatePost({ id, updatePostRequest: updateReq });
  return mapPost(res.data);
};
