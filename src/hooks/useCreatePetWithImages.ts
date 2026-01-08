/**
 * Hook for Create Pet with Image Upload
 *
 * This hook handles the complete flow:
 * 1. Upload image to Cloudinary FIRST (if provided)
 * 2. Get publicId from Cloudinary response
 * 3. Create pet with avatarPublicId
 */

import { useState } from 'react';
import { useCreatePet } from './useCreatePet';
import { uploadMedia } from '@/services/media.service';
import { message } from 'antd';

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
}

export const useCreatePetWithImages = (): UseCreatePetWithImagesReturn => {
  const [isCreating, setIsCreating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const { createPet } = useCreatePet();

  const createPetWithImages = async (data: CreatePetWithImagesData): Promise<boolean> => {
    setIsCreating(true);
    setError(null);
    setUploadProgress(0);

    try {
      let avatarPublicId: string | undefined = undefined;

      // Step 1: Upload image FIRST if provided
      if (data.photo) {
        setUploadProgress(10);
        message.loading('Uploading image...', 0);

        const uploadResult = await uploadMedia(data.photo, {
          context: 'PET_AVATAR',
        });

        // Extract publicId from Cloudinary response
        avatarPublicId = uploadResult.publicId;

        setUploadProgress(50);
        message.destroy(); // Clear loading message
        message.success('Image uploaded successfully!');
      }

      // Step 2: Create pet with avatarPublicId
      setUploadProgress(60);
      const petData = {
        name: data.name,
        speciesId: data.speciesId,
        breedId: data.breedId,
        birthDate: data.birthDate,
        gender: data.gender,
        description: data.description,
        weight: data.weight,
        height: data.height,
        avatarPublicId, // Send publicId to backend
      };

      const createdPet = await createPet(petData);

      if (!createdPet?.id) {
        throw new Error('Failed to create pet - no ID returned');
      }

      setUploadProgress(100);
      message.success('Pet created successfully!');
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
  };
};
