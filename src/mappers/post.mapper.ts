// src/mappers/post.mapper.ts
import { PostMediaDTO, PostResponse } from '@/services/api';
import { Post, PostMedia } from '@/domain/post';

export const mapPost = (dto: PostResponse): Post => ({
  id: dto.id!,
  content: dto.content || '',
  authorId: dto.authorId!,
  authorName: dto.authorUsername || '',
  authorUsername: dto.authorUsername || '',
  authorAvatar: dto.authorAvatarUrl,
  petId: dto.pets && dto.pets[0] ? dto.pets[0].id : undefined,
  petName: dto.pets && dto.pets[0] ? dto.pets[0].name : undefined,
  createdAt: dto.createdAt!,
  likeCount: dto.likeCount ?? 0,
  commentCount: dto.commentCount ?? 0,
  shareCount: 0,
  isLiked: dto.liked ?? false,
  media: (dto.media || []).map((m: PostMediaDTO): PostMedia => ({
    id: m.id!,
    type: m.type as 'image' | 'video',
    url: m.url!,

    displayOrder: m.displayOrder ?? 0,
  })),
  tags: dto.hashtags ? dto.hashtags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
  type: (dto.type as Post['type']) || 'general',
  location: dto.location,
  contactInfo: dto.contactInfo,
});

export const mapPosts = (dtos: PostResponse[]): Post[] => dtos.map(mapPost);
