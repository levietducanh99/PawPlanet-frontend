/**
 * Media Upload Hook
 *
 * Provides React hook for media upload with loading/error states.
 * UI components should use this hook instead of calling service directly.
 */

import { useState } from 'react';
import type { MediaContext, CloudinaryUploadResponse, UploadProgress } from '@/domain/media';
import { uploadMedia } from '@/services/media.service';

interface UseMediaUploadOptions {
  onSuccess?: (result: CloudinaryUploadResponse) => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: UploadProgress) => void;
}

interface UseMediaUploadReturn {
  upload: (file: File, context: MediaContext, ownerIdOrSlug?: number | string) => Promise<void>;
  uploading: boolean;
  progress: UploadProgress | null;
  error: Error | null;
  result: CloudinaryUploadResponse | null;
  reset: () => void;
}

/**
 * Hook for uploading media files
 *
 * @example
 * // In a component
 * const { upload, uploading, progress, error, result } = useMediaUpload({
 *   onSuccess: (result) => {
 *     console.log('Uploaded:', result.secureUrl);
 *   }
 * });
 *
 * const handleFileSelect = async (file: File) => {
 *   await upload(file, 'USER_AVATAR', userId);
 * };
 */
export const useMediaUpload = (options?: UseMediaUploadOptions): UseMediaUploadReturn => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<CloudinaryUploadResponse | null>(null);

  const upload = async (
    file: File,
    context: MediaContext,
    ownerIdOrSlug?: number | string
  ) => {
    setUploading(true);
    setError(null);
    setProgress(null);
    setResult(null);

    try {
      // Determine if ownerIdOrSlug is an ID or slug based on context
      const isEncyclopedia = context.startsWith('ENCYCLOPEDIA_');
      const request = isEncyclopedia
        ? { context, slug: ownerIdOrSlug as string }
        : { context, ownerId: ownerIdOrSlug as number };

      // TODO: Implement real progress tracking with XMLHttpRequest
      // For now, simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (!prev) return { loaded: 0, total: file.size, percentage: 0 };
          const newLoaded = Math.min(prev.loaded + file.size / 10, file.size);
          return {
            loaded: newLoaded,
            total: file.size,
            percentage: (newLoaded / file.size) * 100,
          };
        });
      }, 200);

      const uploadResult = await uploadMedia(file, request);

      clearInterval(progressInterval);
      setProgress({ loaded: file.size, total: file.size, percentage: 100 });

      setResult(uploadResult);
      options?.onSuccess?.(uploadResult);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Upload failed');
      setError(error);
      options?.onError?.(error);
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setUploading(false);
    setProgress(null);
    setError(null);
    setResult(null);
  };

  return {
    upload,
    uploading,
    progress,
    error,
    result,
    reset,
  };
};

