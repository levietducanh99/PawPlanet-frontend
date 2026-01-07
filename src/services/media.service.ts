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
import type {
  SignMediaRequest,
  SignMediaResponse,
  CloudinaryUploadResponse,
} from '@/domain/media';

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
 * // Upload user avatar
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
  // Step 1: Get signature from backend
  const signData = await signMediaUpload(request);

  // Step 2: Upload to Cloudinary
  return uploadToCloudinary(file, signData);
};

/**
 * Upload user avatar
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
 * Upload pet avatar
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

