// Lightweight mock adapter that provides functions used by hooks during dev / storybook.
// Exports: getPetProfile, getPetTimeline, sharePost

import { PetProfileDTO } from './api';
import { mapPost, mapPosts } from '@/mappers/post.mapper';
import { Post } from '@/domain/post';

// Try to use real services if available
let petService: any = null;
let postService: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  petService = require('./pet.service').petService;
} catch (e) {
  // ignore
}
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  postService = require('./post.service');
} catch (e) {
  // ignore
}

export const getPetProfile = async (petId: number): Promise<any> => {
  if (petService && typeof petService.getPetById === 'function') {
    return petService.getPetById(petId);
  }
  // Minimal fallback
  return {
    id: petId,
    name: 'Unknown Pet',
    avatar: null,
    description: '',
    speciesName: '',
  } as unknown as PetProfileDTO;
};

export const getPetTimeline = async (petId: number, page = 1, size = 20): Promise<any> => {
  if (postService && typeof postService.getPostsByPetId === 'function') {
    const posts = await postService.getPostsByPetId(petId);
    return { items: posts, page, size, total: posts.length } as any;
  }
  // Fallback empty timeline structure
  return { items: [], page, size, total: 0 };
};

export const sharePost = async (postId: number): Promise<void> => {
  // If there's a real share endpoint we could call, but for now this is a no-op for UI.
  return Promise.resolve();
};
