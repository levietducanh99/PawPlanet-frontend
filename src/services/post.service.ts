// src/services/post.service.ts
import { PostControllerApi, CreatePostRequest } from '@/services/api';
import { mapPost } from '@/mappers/post.mapper';
import { Post } from '@/domain/post';

const api = new PostControllerApi();

export const createPost = async (data: CreatePostRequest): Promise<Post> => {
  const res = await api.createPost({ createPostRequest: data });
  return mapPost(res.data);
};
