/**
 * Media Service
 *
 * Handles media upload operations using Cloudinary.
 * This service follows the architecture rules:
 * - Uses OpenAPI generated client (when available)
 * - Maps backend DTOs to frontend domain models
 * - Provides clean API for UI layer
 */

import { apiClient } from './apiConfig';
import type { MediaItem, AddPetMediaRequest } from './api';
import type {
  SignMediaRequest,
  SignMediaResponse,
  CloudinaryUploadResponse,
} from '@/domain/media';

/**
 * Detect resource type from file
 * @param file - File to check
 * @returns 'image' or 'video'
 */
const detectResourceType = (file: File): 'image' | 'video' => {
  if (file.type.startsWith('video/')) {
    return 'video';
  }
  return 'image';
};

/**
 * Step 1: Request signature from backend
 *
 * @param request - Sign request with context and owner info
 * @returns Signature and upload configuration
 */
export const signMediaUpload = async (
  request: SignMediaRequest
): Promise<SignMediaResponse> => {
  console.log('🔵 Backend sign request:', request);

  const response = await apiClient.post('/api/v1/media/sign', {
    context: request.context,
    ownerId: request.ownerId,
    slug: request.slug,
    resourceType: request.resourceType, // Send resource type to backend
  });

  console.log('🔵 Backend sign response:', response.data);

  // Map backend response to frontend domain model
  const signData = {
    signature: response.data.signature,
    timestamp: response.data.timestamp,
    apiKey: response.data.api_key,
    cloudName: response.data.cloud_name,
    assetFolder: response.data.asset_folder,
    publicId: response.data.public_id,
    resourceType: response.data.resource_type,
  };

  console.log('🔵 Mapped signData:', signData);
  return signData;
};

/**
 * Step 2: Upload file to Cloudinary
 *
 * @param file - File to upload
 * @param signData - Signature data from backend
 * @returns Cloudinary upload response
 */
export const uploadToCloudinary = async (
  file: File,
  signData: SignMediaResponse
): Promise<CloudinaryUploadResponse> => {
  console.log('🔵 Cloudinary upload debug - signData:', signData);

  // Validate required fields
  if (!signData.signature || !signData.timestamp || !signData.apiKey || !signData.cloudName) {
    throw new Error('Missing required Cloudinary parameters from backend');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('signature', signData.signature);
  formData.append('timestamp', signData.timestamp.toString());
  formData.append('api_key', signData.apiKey);

  // Add folder if provided
  if (signData.assetFolder) {
    // Cloudinary signed uploads expect the backend-provided key 'asset_folder' in our flow
    // Backend sends 'assetFolder' in the sign response; we must pass it as 'asset_folder'
    formData.append('asset_folder', signData.assetFolder);
  }

  // Add public_id if provided
  if (signData.publicId) {
    formData.append('public_id', signData.publicId);
  }

  // Add resource_type if provided (default to 'image')
  const resourceType = signData.resourceType || 'image';

  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${signData.cloudName}/${resourceType}/upload`;

  console.log('🔵 Cloudinary upload URL:', cloudinaryUrl);
  console.log('🔵 FormData entries:');
  for (const [key, value] of formData.entries()) {
    if (key === 'file') {
      console.log(`  ${key}:`, file.name, file.size, 'bytes', file.type);
    } else {
      console.log(`  ${key}:`, value);
    }
  }

  const response = await fetch(cloudinaryUrl, {
    method: 'POST',
    body: formData,
  });

  console.log('🔵 Cloudinary response status:', response.status);
  console.log('🔵 Cloudinary response headers:', Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    const errorText = await response.text();
    console.error('🔴 Cloudinary error response:', errorText);
    throw new Error(`Cloudinary upload failed: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  console.log('🟢 Cloudinary success response:', data);

  // Map Cloudinary response to frontend domain model
  return {
    publicId: data.public_id,
    version: data.version,
    signature: data.signature,
    width: data.width,
    height: data.height,
    format: data.format,
    resourceType: data.resource_type,
    createdAt: data.created_at,
    bytes: data.bytes,
    type: data.type,
    url: data.url,
    secureUrl: data.secure_url,
  };
};

/**
 * Complete upload flow: Sign + Upload
 *
 * This is the main function to use for uploading media.
 * It handles both steps: getting signature and uploading to Cloudinary.
 *
 * @example
 * // Upload user logo
 * const result = await uploadMedia(file, {
 *   context: 'USER_AVATAR',
 *   ownerId: 123
 * });
 *
 * @example
 * // Upload pet gallery image
 * const result = await uploadMedia(file, {
 *   context: 'PET_GALLERY',
 *   ownerId: 456
 * });
 *
 * @example
 * // Upload encyclopedia class image
 * const result = await uploadMedia(file, {
 *   context: 'ENCYCLOPEDIA_CLASS',
 *   slug: 'mammalia'
 * });
 *
 * @example
 * // Upload encyclopedia species image
 * const result = await uploadMedia(file, {
 *   context: 'ENCYCLOPEDIA_SPECIES',
 *   slug: 'canis-lupus'
 * });
 *
 * @example
 * // Upload encyclopedia breed image
 * const result = await uploadMedia(file, {
 *   context: 'ENCYCLOPEDIA_BREED',
 *   slug: 'golden-retriever'
 * });
 */
export const uploadMedia = async (
  file: File,
  request: SignMediaRequest
): Promise<CloudinaryUploadResponse> => {
  // Detect resource type from file
  const resourceType = detectResourceType(file);

  console.log(`🔵 Detected resource type: ${resourceType} for file: ${file.name} (${file.type})`);

  // Step 1: Get signature from backend with resource type
  const signData = await signMediaUpload({
    ...request,
    resourceType, // Explicitly pass resource type to backend
  });

  // Step 2: Upload to Cloudinary with correct endpoint
  return uploadToCloudinary(file, signData);
};

/**
 * Upload user logo
 */
export const uploadUserAvatar = async (
  file: File,
  userId: number
): Promise<CloudinaryUploadResponse> => {
  return uploadMedia(file, {
    context: 'USER_AVATAR',
    ownerId: userId,
  });
};

/**
 * Upload pet logo
 */
export const uploadPetAvatar = async (
  file: File,
  petId: number
): Promise<CloudinaryUploadResponse> => {
  return uploadMedia(file, {
    context: 'PET_AVATAR',
    ownerId: petId,
  });
};

/**
 * Upload pet gallery image
 */
export const uploadPetGallery = async (
  file: File,
  petId: number
): Promise<CloudinaryUploadResponse> => {
  return uploadMedia(file, {
    context: 'PET_GALLERY',
    ownerId: petId,
  });
};

/**
 * Upload post media
 */
export const uploadPostMedia = async (
  file: File,
  postId: number
): Promise<CloudinaryUploadResponse> => {
  return uploadMedia(file, {
    context: 'POST_MEDIA',
    ownerId: postId,
  });
};

/**
 * Upload encyclopedia breed image
 */
export const uploadEncyclopediaBreed = async (
  file: File,
  slug: string
): Promise<CloudinaryUploadResponse> => {
  return uploadMedia(file, {
    context: 'ENCYCLOPEDIA_BREED',
    slug,
  });
};

/**
 * Upload encyclopedia class image
 */
export const uploadEncyclopediaClass = async (
  file: File,
  slug: string
): Promise<CloudinaryUploadResponse> => {
  return uploadMedia(file, {
    context: 'ENCYCLOPEDIA_CLASS',
    slug,
  });
};

/**
 * Upload encyclopedia species image
 */
export const uploadEncyclopediaSpecies = async (
  file: File,
  slug: string
): Promise<CloudinaryUploadResponse> => {
  return uploadMedia(file, {
    context: 'ENCYCLOPEDIA_SPECIES',
    slug,
  });
};

/**
 * Upload media for pet and link it to pet
 *
 * This function handles two different flows:
 *
 * **For AVATAR**:
 * 1. Uploads file to Cloudinary using PET_AVATAR context
 * 2. Updates pet profile with avatarPublicId via PUT /api/v1/pets/{id}
 *
 * **For GALLERY**:
 * 1. Uploads file to Cloudinary using PET_GALLERY context
 * 2. Links media to pet gallery via POST /api/v1/pets/{id}/gallery
 *    - MediaItem.type = "image" or "video" (detected from file)
 *    - Backend will assign role (PRIMARY, GALLERY, etc.)
 *
 * @param petId - Pet ID to add media to
 * @param file - File to upload (image or video)
 * @param role - Upload purpose: 'avatar' (profile pic) or 'gallery' (gallery photo/video)
 * @returns Backend response with added media info
 *
 * @example
 * // Upload avatar
 * await uploadMediaForPet(123, avatarFile, 'avatar');
 * // → PUT /api/v1/pets/123 with avatarPublicId
 *
 * @example
 * // Upload to gallery
 * await uploadMediaForPet(123, photoFile, 'gallery');
 * // → POST /api/v1/pets/123/gallery with mediaItems: [{publicId, type: "image"}]
 */
export const uploadMediaForPet = async (
  petId: number,
  file: File,
  role: 'avatar' | 'gallery' = 'gallery'
): Promise<any> => {
  // Step 1: Upload to Cloudinary with appropriate context
  const context = role === 'avatar' ? 'PET_AVATAR' : 'PET_GALLERY';

  console.log(`🔵 Uploading pet media with role: ${role}, context: ${context}`);

  const cloudinaryResponse = await uploadMedia(file, {
    context,
    ownerId: petId,
  });

  console.log('🔵 Cloudinary upload successful:', cloudinaryResponse);

  // Step 2: Link media to pet via appropriate backend API
  if (role === 'avatar') {
    // For AVATAR: Update pet profile with avatarPublicId
    console.log('🔵 Updating pet avatar via PUT /api/v1/pets/{id}');

    const response = await apiClient.put(`/api/v1/pets/${petId}`, {
      avatarPublicId: cloudinaryResponse.publicId,
    });

    console.log('🔵 Backend avatar update response:', response.data);
    return response.data;

  } else {
    // For GALLERY/PRIMARY: Add to gallery via POST /api/v1/pets/{id}/gallery
    console.log('🔵 Adding media to gallery via POST /api/v1/pets/{id}/gallery');

    // MediaItem.type must be "image" or "video" (media type from Cloudinary)
    // NOT "PRIMARY" or "GALLERY" (those are roles, handled by backend)
    const mediaType = cloudinaryResponse.resourceType || 'image'; // 'image' or 'video'

    const mediaItem: MediaItem = {
      publicId: cloudinaryResponse.publicId,
      type: mediaType, // ✅ Must be "image" or "video"
    };

    const requestBody: AddPetMediaRequest = {
      mediaItems: [mediaItem],
    };

    console.log('🔵 Linking media to pet gallery:', { petId, requestBody });

    const response = await apiClient.post(`/api/v1/pets/${petId}/gallery`, requestBody);

    console.log('🔵 Backend gallery link response:', response.data);
    return response.data;
  }
};
