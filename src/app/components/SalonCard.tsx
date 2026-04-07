import { Star, MapPin, Crown, TrendingUp, Sparkles, Tag, Heart, Share2 } from 'lucide-react';
import { Salon } from '../data/mockData';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Link } from 'react-router-dom';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useIsMobile } from './ui/use-mobile';
import { useState } from 'react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { ShareModal } from './ShareModal';

interface SalonCardProps {
  salon: Salon;
}

export function SalonCard({ salon }: SalonCardProps) {
  const { formatPrice, currency } = useCurrency();
  const isMobile = useIsMobile();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  // Toggle favorite
  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setFavoriteLoading(true);
    
    try {
      // TODO: Replace with real API call
      // For now, just toggle locally
      setIsFavorite(!isFavorite);
      
      if (!isFavorite) {
        toast.success(`❤️ ${salon.name} added to favorites!`);
      } else {
        toast.success(`${salon.name} removed from favorites`);
      }
      
      // Mock API call
      // await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/favorites/salon`, {
      //   method: isFavorite ? 'DELETE' : 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${publicAnonKey}`,
      //   },
      //   body: JSON.stringify({ salonId: salon.id }),
      // });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    } finally {
      setFavoriteLoading(false);
    }
  };
  
  // Share salon
  const shareSalon = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsShareModalOpen(true);
  };
  
  return (
    <Card 
      key={`${salon.id}-${currency.code}`} 
      className="overflow-hidden hover:shadow-lg transition-all duration-300 active:scale-[0.98]"
    >
      <div className={`relative ${isMobile ? 'h-40' : 'h-48'} overflow-hidden`}>
        <img
          src={salon.image}
          alt={salon.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        
        {/* Combined Badges - All badges that apply */}
        <div className={`absolute top-2 left-2 flex flex-wrap gap-1 ${isMobile ? 'max-w-[60%]' : ''}`}>
          {salon.isPremium && (
            <Badge className={`bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 font-bold shadow-lg ${isMobile ? 'text-[10px] px-1.5 py-0.5' : ''}`}>
              <Crown className={`${isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'} mr-1`} />
              PREMIUM
            </Badge>
          )}
          {salon.discount && salon.discount > 0 && (
            <Badge className={`bg-red-500 text-white border-0 font-bold shadow-lg ${isMobile ? 'text-[10px] px-1.5 py-0.5' : ''}`}>
              <Tag className={`${isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'} mr-1`} />
              -{salon.discount}%
            </Badge>
          )}
          {salon.isNew && (
            <Badge className={`bg-green-500 text-white border-0 font-bold shadow-lg ${isMobile ? 'text-[10px] px-1.5 py-0.5' : ''}`}>
              <Sparkles className={`${isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'} mr-1`} />
              NEW
            </Badge>
          )}
          {salon.isRecommended && (
            <Badge className={`bg-blue-500 text-white border-0 font-bold shadow-lg ${isMobile ? 'text-[10px] px-1.5 py-0.5' : ''}`}>
              <TrendingUp className={`${isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'} mr-1`} />
              RECOMMENDED
            </Badge>
          )}
        </div>
      </div>
      
      <div className={`${isMobile ? 'p-3' : 'p-4'}`}>
        <div className={`flex items-start justify-between ${isMobile ? 'mb-1.5' : 'mb-2'}`}>
          <Link to={`/salon/${salon.id}`} className="flex-1 min-w-0">
            <h3 className={`font-semibold hover:text-purple-600 transition-colors truncate ${isMobile ? 'text-base' : 'text-lg'}`}>
              {salon.name}
            </h3>
          </Link>
          <div className={`flex items-center gap-1 bg-purple-50 rounded-full flex-shrink-0 ml-2 ${isMobile ? 'px-1.5 py-0.5' : 'px-2 py-1'}`}>
            <Star className={`fill-purple-500 text-purple-500 ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
            <span className={`font-medium text-purple-700 ${isMobile ? 'text-xs' : 'text-sm'}`}>{salon.rating}</span>
          </div>
        </div>
        
        <div className={`flex items-center gap-1 text-gray-600 ${isMobile ? 'text-xs mb-2' : 'text-sm mb-3'}`}>
          <MapPin className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} flex-shrink-0`} />
          <span className="truncate">{salon.location}</span>
          <span className="text-gray-400 flex-shrink-0">• {salon.distance}km</span>
        </div>
        
        {/* Price and Action Buttons */}
        <div className="space-y-3">
          {/* Price Row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <span className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>From</span>
              {salon.discount && salon.discount > 0 ? (
                <div className={`flex items-center gap-1.5 ${isMobile ? 'flex-col items-start' : ''}`}>
                  <span className={`text-gray-400 line-through ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    {formatPrice(salon.priceFrom)}
                  </span>
                  <span className={`font-bold text-green-600 ${isMobile ? 'text-base' : 'text-lg'}`}>
                    {formatPrice(salon.priceFrom * (1 - salon.discount / 100))}
                  </span>
                </div>
              ) : (
                <span className={`font-bold text-gray-900 ml-1 ${isMobile ? 'text-base' : 'text-lg'}`}>
                  {formatPrice(salon.priceFrom)}
                </span>
              )}
            </div>
          </div>
          
          {/* View Salon & Book Now Buttons Row */}
          <div className="flex items-center gap-2">
            <Link to={`/salon/${salon.id}`} className="flex-1">
              <Button 
                variant="outline"
                className={`w-full border-2 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-400 ${isMobile ? 'text-xs px-2 py-1.5 h-auto' : ''}`}
              >
                View Salon
              </Button>
            </Link>
            <Link to={`/salon/${salon.id}`} className="flex-1">
              <Button 
                className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 ${isMobile ? 'text-xs px-2 py-1.5 h-auto' : ''}`}
              >
                Book Now
              </Button>
            </Link>
          </div>
          
          {/* Favorite & Share Buttons Row */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFavorite}
              disabled={favoriteLoading}
              className={`flex-1 flex items-center justify-center gap-2 border-2 rounded-lg transition-all ${
                isFavorite 
                  ? 'border-pink-500 bg-pink-50 text-pink-600 hover:bg-pink-100' 
                  : 'border-gray-200 bg-white text-gray-600 hover:border-pink-300 hover:bg-pink-50'
              } ${isMobile ? 'px-2 py-1.5' : 'px-3 py-2'}`}
            >
              {favoriteLoading ? (
                <div className="w-4 h-4 border-2 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
              ) : (
                <Heart className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${isFavorite ? 'fill-pink-500' : ''}`} />
              )}
              <span className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
                {isFavorite ? 'Saved' : 'Save'}
              </span>
            </button>
            
            <button
              onClick={shareSalon}
              className={`flex items-center justify-center gap-2 border-2 border-gray-200 bg-white text-gray-600 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all ${isMobile ? 'px-2 py-1.5' : 'px-3 py-2'}`}
            >
              <Share2 className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
              <span className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
                Share
              </span>
            </button>
          </div>
        </div>
        
        <div className={`text-gray-500 ${isMobile ? 'text-[10px] mt-1.5' : 'text-xs mt-2'}`}>
          {salon.reviewCount} reviews
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Share Salon"
        description={`Share ${salon.name} with your friends`}
        shareUrl={`${window.location.origin}/salon/${salon.id}`}
        shareText={`Check out ${salon.name} on Katia! ${salon.rating}⭐ rated salon in ${salon.location}`}
      />
    </Card>
  );
}