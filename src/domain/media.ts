/**
 * Frontend Domain Models for Media
 *
 * These types represent the frontend's view of media data,
 * independent of backend API structure.
 */

export type MediaContext =
  | 'USER_AVATAR'           // User avatar image - requires ownerId (userId)
  | 'PET_AVATAR'            // Pet avatar image - requires ownerId (petId)
  | 'PET_GALLERY'           // Pet gallery images - requires ownerId (petId)
  | 'POST_MEDIA'            // Post media (images/videos) - requires ownerId (postId)
  | 'ENCYCLOPEDIA_CLASS'    // Encyclopedia class images - requires slug
  | 'ENCYCLOPEDIA_SPECIES'  // Encyclopedia species images - requires slug
  | 'ENCYCLOPEDIA_BREED';   // Encyclopedia breed images - requires slug

export interface SignMediaRequest {
  context: MediaContext;
  ownerId?: number;
  slug?: string;
}

export interface SignMediaResponse {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  assetFolder: string;
  publicId?: string;
  resourceType: string;
}

export interface CloudinaryUploadResponse {
  publicId: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resourceType: string;
  createdAt: string;
  bytes: number;
  type: string;
  url: string;
  secureUrl: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

