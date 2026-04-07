import { useState, useRef } from 'react';
import { Upload, X, Check, AlertCircle } from 'lucide-react';
import { useImageUpload } from '../../hooks/useImageUpload';
import { IMAGE_FOLDERS } from '../../utils/supabaseStorage';

interface ImageUploaderProps {
  folder?: string;
  onUploadComplete?: (url: string) => void;
  currentImageUrl?: string;
  label?: string;
  className?: string;
}

/**
 * Компонент для загрузки изображений в Supabase Storage
 * 
 * @example
 * <ImageUploader
 *   folder={IMAGE_FOLDERS.LOGOS}
 *   onUploadComplete={(url) => setSalonLogo(url)}
 *   currentImageUrl={salonLogo}
 *   label="Логотип салона"
 * />
 */
export function ImageUploader({
  folder = IMAGE_FOLDERS.GENERAL,
  onUploadComplete,
  currentImageUrl,
  label = 'Upload Image',
  className = '',
}: ImageUploaderProps) {
  const { uploadImageFile, uploading, error, imageUrl } = useImageUpload();
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Показываем превью
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Загружаем файл
    const url = await uploadImageFile(file, folder);
    if (url && onUploadComplete) {
      onUploadComplete(url);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onUploadComplete) {
      onUploadComplete('');
    }
  };

  const displayUrl = imageUrl || preview;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Upload Area */}
      <div className="relative">
        {!displayUrl ? (
          // Upload Button
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="relative w-full h-48 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <div className="flex flex-col items-center justify-center h-full">
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-3" />
                  <p className="text-sm text-gray-600">Uploading...</p>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400 mb-3 group-hover:text-purple-500 transition-colors" />
                  <p className="text-sm text-gray-600 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, WebP or SVG (max 5MB)
                  </p>
                </>
              )}
            </div>
          </button>
        ) : (
          // Preview with Remove Button
          <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200 group">
            <img
              src={displayUrl}
              alt="Preview"
              className="w-full h-full object-contain bg-gray-50"
            />
            
            {/* Remove Button */}
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Success Indicator */}
            {imageUrl && (
              <div className="absolute top-2 left-2 p-2 bg-green-500 text-white rounded-full shadow-lg">
                <Check className="w-4 h-4" />
              </div>
            )}
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Info Text */}
      {displayUrl && imageUrl && (
        <p className="text-xs text-green-600 flex items-center gap-1">
          <Check className="w-3 h-3" />
          Image uploaded successfully
        </p>
      )}
    </div>
  );
}
