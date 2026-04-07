import { useState } from 'react';
import { Plus, Upload, Heart, Share2, MessageCircle, TrendingUp, Zap, Calendar, MapPin, Globe, Building2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useCurrency } from '../../contexts/CurrencyContext';
import { ServicePostModal, type NewServicePost } from './ServicePostModal';

interface FeedPost {
  id: string;
  image: string;
  likes: number;
  comments: number;
  shares: number;
  caption?: string;
  date: string;
  // Service-specific fields
  isService?: boolean;
  serviceName?: string;
  serviceCategory?: string;
  originalPrice?: number;
  discount?: number;
  currency?: string;
  isLastMinute?: boolean;
  isPromoted?: boolean;
  salonName?: string;
  salonAvatar?: string;
  duration?: number;
  serviceDescription?: string;
  // Main Feed Publishing
  publishedToMainFeed?: boolean;
}

export function BeautyFeedTab() {
  const { formatPrice } = useCurrency();
  const [isServicePostModalOpen, setIsServicePostModalOpen] = useState(false);
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1619367901998-73b3a70b3898?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBzYWxvbiUyMHdvcmt8ZW58MXx8fHwxNzY2MzMyMjM0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      likes: 142,
      comments: 23,
      shares: 12,
      caption: 'Beautiful balayage transformation ✨',
      date: 'Dec 14',
      isService: false
    },
    {
      id: 'promo-1',
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWxheWFnZSUyMGhhaXIlMjBjb2xvcnxlbnwxfHx8fDE3NjYzMzIyMzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      likes: 287,
      comments: 45,
      shares: 32,
      date: 'Dec 15',
      isService: true,
      isPromoted: true,
      serviceName: 'Balayage Hair Coloring',
      serviceCategory: 'Hair Coloring',
      originalPrice: 150,
      discount: 25,
      currency: 'USD',
      isLastMinute: false,
      salonName: 'Katia Beauty Studio',
      salonAvatar: 'K',
      duration: 180,
      serviceDescription: 'Professional balayage technique with premium products. Includes consultation, coloring, toning, and styling.',
      caption: '🔥 SPECIAL OFFER: Get 25% off our signature balayage! Limited slots available this week.'
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1659036354224-48dd0a9a6b86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWlyJTIwc3R5bGluZyUyMHNhbG9ufGVufDF8fHx8MTc2NjMyNTE0NXww&ixlib=rb-4.1.0&q=80&w=1080',
      likes: 89,
      comments: 15,
      shares: 8,
      caption: 'Fresh haircut and styling',
      date: 'Dec 13',
      isService: false
    },
    {
      id: 'promo-2',
      image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXNzYWdlJTIwc3BhfGVufDF8fHx8MTc2NjMzMjIzNXww&ixlib=rb-4.1.0&q=80&w=1080',
      likes: 198,
      comments: 31,
      shares: 18,
      date: 'Dec 15',
      isService: true,
      isPromoted: false,
      serviceName: 'Relaxing Spa Massage',
      serviceCategory: 'Spa Treatment',
      originalPrice: 80,
      discount: 0,
      currency: 'USD',
      isLastMinute: true,
      salonName: 'Serenity Spa',
      salonAvatar: 'S',
      duration: 60,
      serviceDescription: 'Full body relaxation massage with aromatherapy oils.',
      caption: '⚡ LAST MINUTE DEAL: Available TODAY! Book your relaxation session now.'
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1659391542239-9648f307c0b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWlscyUyMG1hbmljdXJlfGVufDF8fHx8MTc2NjMzMjIzNHww&ixlib=rb-4.1.0&q=80&w=1080',
      likes: 201,
      comments: 34,
      shares: 19,
      caption: 'Nail art perfection 💅',
      date: 'Dec 12',
      isService: false
    },
    {
      id: '4',
      image: 'https://images.unsplash.com/photo-1619367901998-73b3a70b3898?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBzYWxvbiUyMHdvcmt8ZW58MXx8fHwxNzY2MzMyMjM0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      likes: 156,
      comments: 28,
      shares: 14,
      caption: 'Gorgeous hair color',
      date: 'Dec 11',
      isService: false
    }
  ]);

  const handlePostService = (newPost: NewServicePost) => {
    const servicePost: FeedPost = {
      id: `service-${Date.now()}`,
      image: newPost.image,
      likes: 0,
      comments: 0,
      shares: 0,
      date: 'Just now',
      isService: true,
      serviceName: newPost.serviceName,
      serviceCategory: newPost.serviceCategory,
      originalPrice: newPost.originalPrice,
      discount: newPost.discount,
      currency: newPost.currency,
      isLastMinute: newPost.isLastMinute,
      isPromoted: newPost.isPromoted,
      salonName: 'Katia Beauty Studio', // Default salon name
      salonAvatar: 'K',
      duration: newPost.duration,
      serviceDescription: newPost.description,
      caption: newPost.description,
      publishedToMainFeed: false // Default: not published
    };

    setFeedPosts([servicePost, ...feedPosts]);
  };

  const handleToggleMainFeed = (postId: string) => {
    setFeedPosts(feedPosts.map(post => 
      post.id === postId 
        ? { ...post, publishedToMainFeed: !post.publishedToMainFeed }
        : post
    ));
  };

  const handleBookService = (post: FeedPost) => {
    // TODO: Navigate to booking modal with pre-filled service
    console.log('Booking service:', post);
    alert(`Booking ${post.serviceName} at ${post.salonName}!\n\nPrice: ${post.discount && post.discount > 0 
      ? `${formatPrice(post.originalPrice!)} → ${formatPrice(post.originalPrice! * (1 - post.discount / 100))} (${post.discount}% OFF)` 
      : formatPrice(post.originalPrice!)}\n\nThis will open the booking modal with pre-filled service.`);
  };

  // Sort posts: promoted first, then by date
  const sortedPosts = [...feedPosts].sort((a, b) => {
    if (a.isPromoted && !b.isPromoted) return -1;
    if (!a.isPromoted && b.isPromoted) return 1;
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🎨 Beauty Feed</h2>
          <p className="text-sm text-gray-500">Showcase your services and work to the community</p>
        </div>
        <Button 
          className="bg-pink-600 hover:bg-pink-700 text-white gap-2"
          onClick={() => setIsServicePostModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Promote Service
        </Button>
      </div>

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <div className="p-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Promote Your Services</h3>
            <p className="text-sm text-gray-600">
              Share your services with photos, special discounts, and last-minute deals. 
              Promoted posts appear first in the feed for maximum visibility! 🚀
            </p>
          </div>
        </div>
      </Card>

      {/* Posts Feed - Instagram Style Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedPosts.map(post => (
          <Card key={post.id} className={`overflow-hidden group hover:shadow-2xl transition-all ${
            post.publishedToMainFeed ? 'ring-2 ring-green-400' : ''
          }`}>
            {/* Photo with Overlay */}
            <div className="relative aspect-square bg-gray-100 overflow-hidden">
              <img
                src={post.image}
                alt={post.serviceName || 'Beauty work'}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              
              {/* Top Badges */}
              <div className="absolute top-2 left-2 right-2 flex items-start justify-between">
                {/* Left: Last Minute / Promoted */}
                <div className="flex flex-col gap-1">
                  {post.isService && post.isLastMinute && (
                    <div className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      LAST
                    </div>
                  )}
                  {post.isPromoted && (
                    <div className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
                      ⭐ TOP
                    </div>
                  )}
                </div>

                {/* Right: Discount Badge */}
                {post.isService && post.discount && post.discount > 0 && (
                  <div className="bg-red-500 text-white px-3 py-2 rounded-lg shadow-lg">
                    <div className="text-xl font-bold">-{post.discount}%</div>
                  </div>
                )}
              </div>

              {/* Bottom: Status Badge */}
              <div className="absolute bottom-2 right-2">
                {post.publishedToMainFeed ? (
                  <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    PUBLIC
                  </div>
                ) : (
                  <div className="bg-gray-800/80 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    SALON
                  </div>
                )}
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  {/* Engagement Stats */}
                  <div className="flex items-center gap-4 mb-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4 fill-white" />
                      <span className="font-bold">{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span className="font-bold">{post.comments}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 className="w-4 h-4" />
                      <span className="font-bold">{post.shares}</span>
                    </div>
                  </div>

                  {/* Service Info */}
                  {post.isService && (
                    <div className="mb-2">
                      <div className="text-xs text-purple-300 mb-1">{post.serviceCategory}</div>
                      <div className="font-bold text-sm mb-1 line-clamp-1">{post.serviceName}</div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-3 h-3" />
                        <span>{post.duration}min</span>
                        <span className="mx-1">•</span>
                        {post.discount && post.discount > 0 ? (
                          <>
                            <span className="line-through text-gray-300 text-xs">
                              {formatPrice(post.originalPrice!)}
                            </span>
                            <span className="font-bold text-green-400">
                              {formatPrice(post.originalPrice! * (1 - post.discount / 100))}
                            </span>
                          </>
                        ) : (
                          <span className="font-bold">
                            {formatPrice(post.originalPrice!)}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Regular Post Caption */}
                  {!post.isService && post.caption && (
                    <p className="text-sm line-clamp-2 mb-2">{post.caption}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Card Footer - Always Visible */}
            <div className="p-3 bg-white">
              {post.isService ? (
                <div className="space-y-2">
                  {/* Service Title */}
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 line-clamp-1">
                      {post.serviceName}
                    </h4>
                    <div className="text-xs text-gray-500">{post.serviceCategory}</div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={post.publishedToMainFeed ? "default" : "outline"}
                      className={`flex-1 gap-1 h-8 text-xs ${
                        post.publishedToMainFeed
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'border-purple-600 text-purple-600 hover:bg-purple-50'
                      }`}
                      onClick={() => handleToggleMainFeed(post.id)}
                    >
                      <Globe className="w-3 h-3" />
                      {post.publishedToMainFeed ? 'Live' : 'Publish'}
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-8 text-xs"
                      onClick={() => handleBookService(post)}
                    >
                      Book
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-700 line-clamp-2 mb-2">{post.caption}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex gap-3">
                      <span>❤️ {post.likes}</span>
                      <span>💬 {post.comments}</span>
                    </div>
                    <span>{post.date}</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Stats Summary */}
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-none">
        <div className="p-6">
          <h3 className="font-bold text-gray-900 mb-4">Feed Performance</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div>
              <div className="text-sm text-gray-600 mb-1">Total Posts</div>
              <div className="text-3xl font-bold text-gray-900">{feedPosts.length}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Service Posts</div>
              <div className="text-3xl font-bold text-purple-600">
                {feedPosts.filter(p => p.isService).length}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Published</div>
              <div className="text-3xl font-bold text-green-600">
                {feedPosts.filter(p => p.publishedToMainFeed).length}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Total Likes</div>
              <div className="text-3xl font-bold text-pink-600">
                {feedPosts.reduce((sum, post) => sum + post.likes, 0)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Promoted</div>
              <div className="text-3xl font-bold text-yellow-600">
                {feedPosts.filter(p => p.isPromoted).length}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Service Post Modal */}
      <ServicePostModal
        isOpen={isServicePostModalOpen}
        onClose={() => setIsServicePostModalOpen(false)}
        onSubmit={handlePostService}
        salonName="Katia Beauty Studio"
        salonAvatar="K"
      />
    </div>
  );
}