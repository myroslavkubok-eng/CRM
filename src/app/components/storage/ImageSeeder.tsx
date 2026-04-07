import { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { projectId, publicAnonKey } from '../../../../utils/supabase/info';

interface SeedImage {
  url: string;
  folder: string;
  name: string;
}

// Демонстрационные изображения для заполнения Storage
const SEED_IMAGES: SeedImage[] = [
  // Logos (салоны красоты)
  { url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400', folder: 'logos', name: 'salon-logo-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400', folder: 'logos', name: 'salon-logo-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400', folder: 'logos', name: 'salon-logo-3.jpg' },
  
  // Products (косметика и продукты)
  { url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800', folder: 'products', name: 'product-lipstick.jpg' },
  { url: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800', folder: 'products', name: 'product-makeup.jpg' },
  { url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800', folder: 'products', name: 'product-skincare.jpg' },
  { url: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800', folder: 'products', name: 'product-cosmetics.jpg' },
  { url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800', folder: 'products', name: 'product-nails.jpg' },
  
  // Certificates (подарочные сертификаты)
  { url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1200', folder: 'certificates', name: 'cert-background-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1487700160041-babef9c3cb55?w=1200', folder: 'certificates', name: 'cert-background-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200', folder: 'certificates', name: 'cert-background-3.jpg' },
  
  // Masters (мастера/стилисты)
  { url: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=600', folder: 'masters', name: 'master-stylist-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600', folder: 'masters', name: 'master-stylist-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600', folder: 'masters', name: 'master-makeup-artist.jpg' },
  { url: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600', folder: 'masters', name: 'master-hairdresser.jpg' },
  
  // Gallery (работы салона)
  { url: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=1000', folder: 'gallery', name: 'work-hairstyle-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=1000', folder: 'gallery', name: 'work-hairstyle-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1000', folder: 'gallery', name: 'work-makeup-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=1000', folder: 'gallery', name: 'work-nails-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1604902396830-aca29e19b067?w=1000', folder: 'gallery', name: 'work-nails-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=1000', folder: 'gallery', name: 'work-salon-1.jpg' },
  
  // Avatars (аватары пользователей)
  { url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', folder: 'avatars', name: 'avatar-woman-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', folder: 'avatars', name: 'avatar-woman-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', folder: 'avatars', name: 'avatar-man-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', folder: 'avatars', name: 'avatar-man-2.jpg' },
  
  // General (общие изображения)
  { url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200', folder: 'general', name: 'salon-interior-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1200', folder: 'general', name: 'salon-interior-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=1200', folder: 'general', name: 'beauty-salon.jpg' },
];

interface ImageSeederProps {
  onUploadComplete?: () => void;
}

export function ImageSeeder({ onUploadComplete }: ImageSeederProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<Array<{ name: string; success: boolean; error?: string }>>([]);
  const [completed, setCompleted] = useState(false);

  const uploadImage = async (seedImage: SeedImage) => {
    try {
      // Загружаем изображение с Unsplash
      const response = await fetch(seedImage.url);
      const blob = await response.blob();

      // Создаем FormData для отправки
      const formData = new FormData();
      formData.append('file', blob, seedImage.name);
      formData.append('folder', seedImage.folder);

      // Отправляем на наш backend
      const uploadResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/storage/upload`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.statusText}`);
      }

      const data = await uploadResponse.json();
      return { name: seedImage.name, success: true, url: data.publicUrl };
    } catch (error) {
      return { 
        name: seedImage.name, 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  };

  const seedAllImages = async () => {
    setUploading(true);
    setProgress(0);
    setResults([]);
    setCompleted(false);

    const uploadResults = [];

    for (let i = 0; i < SEED_IMAGES.length; i++) {
      const result = await uploadImage(SEED_IMAGES[i]);
      uploadResults.push(result);
      setProgress(Math.round(((i + 1) / SEED_IMAGES.length) * 100));
      setResults([...uploadResults]);
      
      // Небольшая пауза между загрузками
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setUploading(false);
    setCompleted(true);
    if (onUploadComplete) {
      onUploadComplete();
    }
  };

  const successCount = results.filter(r => r.success).length;
  const failureCount = results.filter(r => !r.success).length;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          <Upload className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Image Seeder</h2>
          <p className="text-sm text-gray-500">Загрузить демо-изображения в Storage</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{SEED_IMAGES.length}</p>
          <p className="text-xs text-purple-700 mt-1">Всего изображений</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{successCount}</p>
          <p className="text-xs text-green-700 mt-1">Загружено</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{failureCount}</p>
          <p className="text-xs text-red-700 mt-1">Ошибок</p>
        </div>
      </div>

      {/* Breakdown by folder */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">По папкам:</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {Object.entries(
            SEED_IMAGES.reduce((acc, img) => {
              acc[img.folder] = (acc[img.folder] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          ).map(([folder, count]) => (
            <div key={folder} className="flex justify-between items-center bg-gray-50 rounded px-3 py-2">
              <span className="text-gray-600 capitalize">{folder}</span>
              <span className="font-semibold text-gray-900">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      {uploading && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Загрузка...</span>
            <span className="text-sm font-bold text-purple-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={seedAllImages}
        disabled={uploading}
        className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        {uploading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Загрузка {progress}%...
          </>
        ) : completed ? (
          <>
            <CheckCircle className="w-5 h-5" />
            Загрузка завершена!
          </>
        ) : (
          <>
            <Upload className="w-5 h-5" />
            Загрузить {SEED_IMAGES.length} изображений
          </>
        )}
      </button>

      {/* Results */}
      {results.length > 0 && (
        <div className="mt-6 max-h-64 overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Результаты:</h3>
          <div className="space-y-1">
            {results.map((result, index) => (
              <div
                key={index}
                className={`flex items-center justify-between text-xs px-3 py-2 rounded ${
                  result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {result.success ? (
                    <CheckCircle className="w-3 h-3 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  )}
                  <span className="truncate">{result.name}</span>
                </div>
                {!result.success && result.error && (
                  <span className="text-xs opacity-70 ml-2">{result.error}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {completed && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-green-900">Готово!</h3>
              <p className="text-sm text-green-700 mt-1">
                Успешно загружено {successCount} из {SEED_IMAGES.length} изображений.
                {failureCount > 0 && ` ${failureCount} ошибок.`}
              </p>
              <p className="text-xs text-green-600 mt-2">
                Проверьте Storage Admin для просмотра загруженных файлов.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}