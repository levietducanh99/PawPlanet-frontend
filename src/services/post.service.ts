// src/services/post.service.ts
import { PostControllerApi, CreatePostRequest } from '@/services/api';
import { mapPost } from '@/mappers/post.mapper';
import { Post } from '@/domain/post';

const api = new PostControllerApi();

export const createPost = async (data: CreatePostRequest): Promise<Post> => {
  // Lấy token từ localStorage/sessionStorage
  const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await api.createPost({ createPostRequest: data }, { headers });
  return mapPost(res.data);
};
