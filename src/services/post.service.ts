// src/services/post.service.ts
import { PostControllerApi, CreatePostRequest, UpdatePostRequest } from '@/services/api';
import { mapPost, mapPosts } from '@/mappers/post.mapper';
import { Post } from '@/domain/post';
import { apiClient } from './apiConfig';

const api = new PostControllerApi(undefined, undefined, apiClient);

/**
 * Tạo post mới
 */
export const createPost = async (data: CreatePostRequest): Promise<Post> => {
  // Data already in correct API format - no mapping needed
  const res = await api.createPost({ createPostRequest: data });
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
export const updatePost = async (id: number, data: UpdatePostRequest): Promise<Post> => {
  // Data already in correct API format
  const res = await api.updatePost({ id, updatePostRequest: data });
  return mapPost(res.data);
};
