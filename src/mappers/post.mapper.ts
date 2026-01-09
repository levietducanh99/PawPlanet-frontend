// src/mappers/post.mapper.ts
import { PostMediaDTO, PostResponse } from '@/services/api';
import { Post, PostMedia, TaggedPet } from '@/domain/post';

export const mapPost = (dto: PostResponse): Post => {
  const firstPet = dto.pets && dto.pets[0] ? dto.pets[0] : undefined;

  // Map all tagged pets
  const taggedPets: TaggedPet[] = (dto.pets || []).map(pet => ({
    id: pet.id!,
    name: pet.name || '',
    species: pet.speciesName || '',
    breed: pet.breedName,
    avatarUrl: pet.avatarUrl,
  }));

  return {
    id: dto.id!,
    content: dto.content || '',
    authorId: dto.authorId!,
    authorName: dto.authorUsername || '',
    authorUsername: dto.authorUsername || '',
    authorAvatar: dto.authorAvatarUrl,

    // Pet info (backward compatibility - keep first pet)
    petId: firstPet?.id,
    petName: firstPet?.name,
    petAvatar: firstPet?.avatarUrl,

    // Tagged pets (new feature)
    taggedPets: taggedPets.length > 0 ? taggedPets : undefined,

    // UI display fields
    badge: undefined, // TODO: Map from backend if available
    petOwnerName: firstPet?.ownerUsername,
    petDisplay: firstPet ? `${firstPet.speciesName || ''} · ${firstPet.breedName || ''}`.trim() : undefined,

    // Post metadata
    createdAt: dto.createdAt!,
    likeCount: dto.likeCount ?? 0,
    commentCount: dto.commentCount ?? 0,
    shareCount: 0, // Backend chưa có field này
    isLiked: dto.liked ?? false,

    // Media
    media: (dto.media || []).map((m: PostMediaDTO): PostMedia => ({
      id: m.id!,
      type: m.type as 'image' | 'video',
      url: m.url!,
      displayOrder: m.displayOrder ?? 0,
    })),

    // Tags and metadata
    tags: dto.hashtags ? dto.hashtags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
    type: (dto.type as Post['type']) || 'general',
    location: dto.location,
    contactInfo: dto.contactInfo,
  };
};

export const mapPosts = (dtos: PostResponse[]): Post[] => dtos.map(mapPost);
