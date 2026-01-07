/**
 * Hook for Create Pet with Image Upload
 *
 * This hook handles the complete flow:
 * 1. Create pet with basic info (without image)
 * 2. Upload image to Cloudinary with petId
 * 3. Update pet with image URL
 */

import { useState } from 'react';
import { useCreatePet } from './useCreatePet';
import { useMediaUpload } from './useMediaUpload';
import { message } from 'antd';
import type { CloudinaryUploadResponse } from '@/domain/media';

interface CreatePetWithImagesData {
  name: string;
  speciesId: number; // Required field
  breedId?: number;
  birthDate?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER'; // Match CreatePetData interface
  description?: string;
  weight?: number;
  height?: number;
  photo?: File; // Optional image file to upload
}

interface UseCreatePetWithImagesReturn {
  createPetWithImages: (data: CreatePetWithImagesData) => Promise<boolean>;
  isCreating: boolean;
  uploadProgress: number;
  error: string | null;
  imageUrl: string | null;
}

export const useCreatePetWithImages = (): UseCreatePetWithImagesReturn => {
  const [isCreating, setIsCreating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const { createPet } = useCreatePet();

  const { upload: uploadImage } = useMediaUpload({
    onSuccess: (result: CloudinaryUploadResponse) => {
      setImageUrl(result.secureUrl);
      message.success('Pet image uploaded successfully!');
    },
    onError: (err) => {
      setError(err.message);
      message.error(`Image upload failed: ${err.message}`);
    },
    onProgress: (progress) => {
      setUploadProgress(progress.percentage);
    }
  });

  const createPetWithImages = async (data: CreatePetWithImagesData): Promise<boolean> => {
    setIsCreating(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Step 1: Create pet with basic info first (ensure required fields)
      const petData = {
        name: data.name,
        speciesId: data.speciesId, // Required field
        breedId: data.breedId,
        birthDate: data.birthDate,
        gender: data.gender,
        description: data.description,
        weight: data.weight,
        height: data.height,
      };

      const createdPet = await createPet(petData);

      if (!createdPet?.id) {
        throw new Error('Failed to create pet - no ID returned');
      }

      message.success('Pet created successfully!');

      // Step 2: Upload image if provided
      if (data.photo) {
        setUploadProgress(10);
        await uploadImage(data.photo, 'PET_AVATAR', createdPet.id);
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create pet';
      setError(errorMessage);
      message.error(errorMessage);
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createPetWithImages,
    isCreating,
    uploadProgress,
    error,
    imageUrl
  };
};
