import { useState } from 'react';
import {
  uploadImage,
  validateImageFile,
  IMAGE_FOLDERS,
} from '../utils/supabaseStorage';

interface UseImageUploadReturn {
  uploading: boolean;
  progress: number;
  error: string | null;
  imageUrl: string | null;
  uploadImageFile: (file: File, folder?: string) => Promise<string | null>;
  reset: () => void;
}

/**
 * React hook для загрузки изображений в Supabase Storage
 * 
 * @example
 * const { uploadImageFile, uploading, imageUrl, error } = useImageUpload();
 * 
 * const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
 *   const file = e.target.files?.[0];
 *   if (file) {
 *     const url = await uploadImageFile(file, IMAGE_FOLDERS.LOGOS);
 *     if (url) {
 *       console.log('Uploaded:', url);
 *     }
 *   }
 * };
 */
export function useImageUpload(): UseImageUploadReturn {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const uploadImageFile = async (
    file: File,
    folder: string = IMAGE_FOLDERS.GENERAL
  ): Promise<string | null> => {
    try {
      setUploading(true);
      setError(null);
      setProgress(0);

      // Валидация файла
      validateImageFile(file);
      setProgress(20);

      // Загрузка
      const url = await uploadImage(file, folder);
      setProgress(100);
      setImageUrl(url);

      return url;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to upload image';
      setError(errorMessage);
      console.error('❌ Upload error:', errorMessage);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setUploading(false);
    setProgress(0);
    setError(null);
    setImageUrl(null);
  };

  return {
    uploading,
    progress,
    error,
    imageUrl,
    uploadImageFile,
    reset,
  };
}
