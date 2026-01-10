// Lightweight mock adapter that provides functions used by hooks during dev / storybook.
// Exports: getPetProfile, getPetTimeline, sharePost

import type { PetProfileDTO } from './api';

// Try to use real services if available
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let petService: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let postService: any = null;

try {
  // @ts-ignore - dynamic require for optional dependency
  petService = require('./pet.service').petService;
} catch (e) {
  // ignore
}
try {
  // @ts-ignore - dynamic require for optional dependency
  postService = require('./post.service');
} catch (e) {
  // ignore
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getPetTimeline = async (petId: number, page = 1, size = 20): Promise<any> => {
  if (postService && typeof postService.getPostsByPetId === 'function') {
    const posts = await postService.getPostsByPetId(petId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { items: posts, page, size, total: posts.length } as any;
  }
  // Fallback empty timeline structure
  return { items: [], page, size, total: 0 };
};

export const sharePost = async (): Promise<void> => {
  // If there's a real share endpoint we could call, but for now this is a no-op for UI.
  return Promise.resolve();
};


