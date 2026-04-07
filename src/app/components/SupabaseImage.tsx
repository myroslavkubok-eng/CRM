import { useState } from 'react';

interface SupabaseImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  loading?: 'lazy' | 'eager';
  onError?: () => void;
  onLoad?: () => void;
}

/**
 * Компонент для отображения изображений из Supabase Storage
 * с fallback на случай ошибки загрузки
 * 
 * @example
 * <SupabaseImage
 *   src={salon.logoUrl}
 *   alt={salon.name}
 *   className="w-20 h-20 rounded-full object-cover"
 *   fallbackSrc="/default-salon-logo.png"
 * />
 */
export function SupabaseImage({
  src,
  alt,
  className = '',
  fallbackSrc = '',
  loading = 'lazy',
  onError,
  onLoad,
}: SupabaseImageProps) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setError(true);
    setIsLoading(false);
    onError?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  // Если ошибка и есть fallback, показываем fallback
  const imageSrc = error && fallbackSrc ? fallbackSrc : src;

  // Если нет src вообще, показываем placeholder
  if (!src && !fallbackSrc) {
    return (
      <div
        className={`bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center ${className}`}
      >
        <svg
          className="w-1/3 h-1/3 text-purple-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Loading Skeleton */}
      {isLoading && (
        <div
          className={`absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse ${className}`}
        />
      )}

      {/* Image */}
      <img
        src={imageSrc}
        alt={alt}
        className={className}
        loading={loading}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  );
}