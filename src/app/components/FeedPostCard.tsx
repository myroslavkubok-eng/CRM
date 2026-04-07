import { Heart, Eye, Trash2, Share2 } from 'lucide-react';
import { useState } from 'react';
import { ShareModal } from './ShareModal';

interface FeedPostCardProps {
  post: {
    id: string;
    salonId: string;
    salonName: string;
    type: 'post' | 'last-minute';
    title: string;
    description: string;
    imageUrl?: string;
    createdAt: string;
    authorName: string;
    authorId: string;
    serviceId?: string;
    serviceName?: string;
    originalPrice?: number;
    discountPrice?: number;
    availableDate?: string;
    availableTime?: string;
    likes?: string[];
    category?: string;
    viewsCount?: number;
    isPremium?: boolean;
  };
  currentUserId?: string;
  onDelete?: (postId: string) => void;
  onLike?: (postId: string) => void;
}

export function FeedPostCard({ post, currentUserId, onDelete, onLike }: FeedPostCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  const isLiked = post.likes?.includes(currentUserId || '') || false;
  const likesCount = post.likes?.length || 0;
  const viewsCount = post.viewsCount || 0;
  
  const canDelete = currentUserId && post.authorId === currentUserId;

  const calculateDiscount = () => {
    if (!post.originalPrice || !post.discountPrice) return 0;
    return Math.round(((post.originalPrice - post.discountPrice) / post.originalPrice) * 100);
  };

  const formatCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  // Gradient backgrounds based on category
  const gradients = [
    'from-cyan-400 to-blue-500',
    'from-pink-400 to-red-500',
    'from-purple-400 to-indigo-500',
    'from-green-400 to-emerald-500',
    'from-orange-400 to-pink-500',
    'from-blue-400 to-purple-500',
    'from-yellow-400 to-orange-500',
    'from-rose-400 to-pink-500',
  ];

  const gradientIndex = post.category 
    ? post.category.charCodeAt(0) % gradients.length 
    : Math.floor(Math.random() * gradients.length);

  return (
    <div className="flex flex-col">
      {/* Card Container */}
      <div className="relative group cursor-pointer aspect-square overflow-hidden rounded-sm bg-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
        {/* Background Gradient or Image */}
        {post.imageUrl && !imageError ? (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradients[gradientIndex]}`} />
        )}

        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Multiple Badges - Top */}
        <div className="absolute top-1 sm:top-2 left-1 sm:left-2 flex gap-0.5 sm:gap-1 z-10">
          {/* Last Minute Badge */}
          {post.type === 'last-minute' && (
            <div className="bg-yellow-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[8px] sm:text-[10px] font-bold shadow-lg uppercase">
              Last Minute
            </div>
          )}
          
          {/* Sale/Discount Badge */}
          {calculateDiscount() > 0 && (
            <div className="bg-red-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[8px] sm:text-[10px] font-bold shadow-lg">
              -{calculateDiscount()}%
            </div>
          )}
          
          {/* Premium Badge (if salon has premium subscription) */}
          {post.isPremium && (
            <div className="bg-orange-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[8px] sm:text-[10px] font-bold shadow-lg uppercase">
              Premium
            </div>
          )}
        </div>

        {/* Delete Button (only for post author) */}
        {canDelete && onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('Are you sure you want to delete this post?')) {
                onDelete(post.id);
              }
            }}
            className="absolute top-1 sm:top-2 right-1 sm:right-2 z-10 p-1 sm:p-1.5 bg-red-500 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
          </button>
        )}

        {/* Content - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-1.5 sm:p-2 z-10">
          <h3 className="text-white font-bold text-[10px] sm:text-xs mb-0.5 sm:mb-1 line-clamp-1">
            {post.title}
          </h3>
          <p className="text-white/90 text-[8px] sm:text-[10px] mb-0.5 sm:mb-1 line-clamp-1">
            {post.salonName}
          </p>
          
          {/* Price Info */}
          {post.discountPrice && (
            <div className="flex items-center gap-1 mb-1 sm:mb-1.5">
              {post.originalPrice && (
                <span className="text-white/70 line-through text-[8px] sm:text-[10px]">
                  {post.originalPrice} AED
                </span>
              )}
              <span className="text-white font-bold text-[10px] sm:text-xs">
                {post.discountPrice} AED
              </span>
            </div>
          )}

          {/* Book Button */}
          <button className="w-full bg-white hover:bg-gray-100 text-purple-600 font-bold py-1 sm:py-1.5 px-2 rounded text-[10px] sm:text-xs transition-colors shadow-md">
            Book
          </button>
        </div>

        {/* Hover Overlay with more details */}
        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-2 sm:p-3 z-20">
          <p className="text-white text-center text-[10px] sm:text-xs mb-2 sm:mb-3 line-clamp-3">
            {post.description}
          </p>
          {post.category && (
            <span className="text-white/80 text-[8px] sm:text-[10px] mb-2">
              {post.category}
            </span>
          )}
          <button className="bg-white hover:bg-gray-100 text-purple-600 font-bold py-1.5 sm:py-2 px-3 sm:px-4 rounded-full text-[10px] sm:text-xs transition-colors shadow-lg">
            View Details
          </button>
        </div>
      </div>

      {/* Stats Below Card */}
      <div className="flex items-center gap-2 sm:gap-3 mt-1 sm:mt-1.5 px-0.5">
        {/* Views */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-600" />
          <span className="text-gray-700 font-medium text-[10px] sm:text-xs">
            {formatCount(viewsCount)}
          </span>
        </div>

        {/* Likes */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLike?.(post.id);
          }}
          className="flex items-center gap-0.5 sm:gap-1 hover:opacity-80 transition-opacity"
          disabled={!onLike}
        >
          <Heart 
            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-colors ${
              isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
          <span className={`font-medium text-[10px] sm:text-xs ${
            isLiked ? 'text-red-500' : 'text-gray-700'
          }`}>
            {formatCount(likesCount)}
          </span>
        </button>

        {/* Share Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsShareModalOpen(true);
          }}
          className="flex items-center gap-0.5 sm:gap-1 hover:opacity-80 transition-opacity"
        >
          <Share2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-600" />
          <span className="text-gray-700 font-medium text-[10px] sm:text-xs">
            Share
          </span>
        </button>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Share Post"
        description={`Share "${post.title}" from ${post.salonName} with your friends`}
        shareUrl={`${window.location.origin}/feed/${post.id}`}
        shareText={`Check out this amazing ${post.type === 'last-minute' ? 'last-minute deal' : 'post'}: ${post.title} at ${post.salonName}!`}
      />
    </div>
  );
}