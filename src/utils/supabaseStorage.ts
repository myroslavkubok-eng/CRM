import { projectId, publicAnonKey } from '../../utils/supabase/info';

const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb`;

export interface UploadResponse {
  uploadUrl: string;
  filePath: string;
  publicUrl: string;
  token?: string;
}

export interface ImageFile {
  name: string;
  path: string;
  publicUrl: string;
  created_at: string;
  updated_at: string;
  size: number;
}

export interface ListImagesResponse {
  files: ImageFile[];
  count: number;
  folder: string;
}

/**
 * Организация папок для разных типов изображений
 */
export const IMAGE_FOLDERS = {
  LOGOS: 'logos', // Логотипы салонов
  PRODUCTS: 'products', // Фото продуктов
  CERTIFICATES: 'certificates', // Дизайны сертификатов
  MASTERS: 'masters', // Фото мастеров
  GALLERY: 'gallery', // Галерея работ салонов
  AVATARS: 'avatars', // Аватары пользователей
  GENERAL: 'general', // Общие изображения
} as const;

/**
 * Загрузить изображение в Supabase Storage
 * 
 * @param file - File object из input[type="file"]
 * @param folder - Папка для организации (LOGOS, PRODUCTS, etc.)
 * @returns Promise с публичным URL изображения
 * 
 * @example
 * const file = event.target.files[0];
 * const url = await uploadImage(file, IMAGE_FOLDERS.LOGOS);
 * console.log('Image uploaded:', url);
 */
export async function uploadImage(
  file: File,
  folder: string = IMAGE_FOLDERS.GENERAL
): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await fetch(`${SERVER_URL}/storage/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload image');
    }

    const data = await response.json();
    console.log(`✅ Image uploaded to ${folder}:`, data.publicUrl);
    
    return data.publicUrl;
  } catch (error) {
    console.error('❌ Error uploading image:', error);
    throw error;
  }
}

/**
 * Получить список всех изображений в папке
 * 
 * @param folder - Папка (опционально, если не указана - все изображения)
 * @returns Promise с массивом изображений
 * 
 * @example
 * const logos = await listImages(IMAGE_FOLDERS.LOGOS);
 * logos.files.forEach(img => console.log(img.publicUrl));
 */
export async function listImages(
  folder?: string
): Promise<ListImagesResponse> {
  try {
    const url = folder
      ? `${SERVER_URL}/storage/images/${folder}`
      : `${SERVER_URL}/storage/images`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to list images');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Error listing images:', error);
    throw error;
  }
}

/**
 * Удалить изображение из Storage
 * 
 * @param filePath - Путь к файлу (из uploadImage response)
 * @returns Promise<void>
 * 
 * @example
 * await deleteImage('logos/1234567890-abc123.png');
 */
export async function deleteImage(filePath: string): Promise<void> {
  try {
    const response = await fetch(`${SERVER_URL}/storage/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ filePath }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete image');
    }

    console.log(`🗑️ Image deleted: ${filePath}`);
  } catch (error) {
    console.error('❌ Error deleting image:', error);
    throw error;
  }
}

/**
 * Получить публичный URL для файла
 * 
 * @param filePath - Путь к файлу
 * @returns Promise с публичным URL
 */
export async function getPublicUrl(filePath: string): Promise<string> {
  try {
    const response = await fetch(
      `${SERVER_URL}/storage/public-url/${filePath}`,
      {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get public URL');
    }

    const data = await response.json();
    return data.publicUrl;
  } catch (error) {
    console.error('❌ Error getting public URL:', error);
    throw error;
  }
}

/**
 * Валидация файла перед загрузкой
 * 
 * @param file - File object
 * @param maxSizeMB - Максимальный размер в MB (по умолчанию 5MB)
 * @returns true если валиден, иначе выбрасывает ошибку
 */
export function validateImageFile(file: File, maxSizeMB: number = 5): boolean {
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      `Invalid file type: ${file.type}. Allowed: PNG, JPEG, JPG, WebP, SVG`
    );
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error(
      `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Max: ${maxSizeMB}MB`
    );
  }

  return true;
}