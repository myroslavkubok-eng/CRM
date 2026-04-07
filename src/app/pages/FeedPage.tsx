import { useState, useEffect } from 'react';
import { PlusCircle, Filter, Loader2, Rss, Sparkles, MapPin, Globe } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { FeedPostCard } from '../components/FeedPostCard';
import { CreateFeedPost } from '../components/CreateFeedPost';
import { Button } from '../components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { seedDemoFeedPosts } from '../utils/feedSeeder';

interface FeedPost {
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
  city?: string;
  country?: string;
}

export function FeedPage() {
  const { user, session } = useAuth();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'post' | 'last-minute' | 'sale'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('UAE'); // Default to UAE for Dubai clients
  
  // Demo salon data (в реальности нужно получать из профиля пользователя)
  const [userSalonId, setUserSalonId] = useState<string>('');
  const [userSalonName, setUserSalonName] = useState<string>('');
  const [canCreatePost, setCanCreatePost] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [showMockDemo, setShowMockDemo] = useState(false);

  // Mock demo posts for immediate display
  const mockDemoPosts: FeedPost[] = [
    {
      id: '1-demo',
      salonId: 'vlv-beauty-dubai',
      salonName: 'VLV Beauty Dubai',
      type: 'post',
      title: 'Lash & Brow Training',
      description: 'Professional training seminars',
      category: 'Education & Training',
      imageUrl: '',
      createdAt: new Date().toISOString(),
      authorName: 'VLV Beauty',
      authorId: 'demo-author',
      serviceId: 'lash-brow-training',
      likes: [],
      viewsCount: 23200,
      city: 'Dubai',
      country: 'UAE',
      isPremium: true,
    },
    {
      id: '2-demo',
      salonId: 'mbs-business-school',
      salonName: 'MBS Business School',
      type: 'last-minute',
      title: 'Business Seminars',
      description: 'Grow your beauty business',
      category: 'Business Training',
      imageUrl: '',
      createdAt: new Date().toISOString(),
      authorName: 'MBS School',
      authorId: 'demo-author',
      serviceId: 'business-seminar',
      serviceName: 'Business Seminar',
      originalPrice: 500,
      discountPrice: 350,
      likes: ['user1', 'user2'],
      viewsCount: 8942,
      city: 'Dubai',
      country: 'UAE',
      isPremium: true,
    },
    {
      id: '3-demo',
      salonId: 'elegant-wedding-venue',
      salonName: 'Elegant Wedding & Events',
      type: 'last-minute',
      title: 'Luxury Wedding Venue',
      description: 'Perfect venue for your special day',
      category: 'Wedding & Events',
      imageUrl: '',
      createdAt: new Date().toISOString(),
      authorName: 'Elegant Events',
      authorId: 'demo-author',
      serviceId: 'wedding-venue',
      serviceName: 'Wedding Venue',
      // No prices - will show yellow LAST MINUTE badge
      likes: ['user1', 'user2', 'user3'],
      viewsCount: 15340,
      city: 'Abu Dhabi',
      country: 'UAE',
    },
    {
      id: '4-demo',
      salonId: 'glamour-studio-dubai',
      salonName: 'Glamour Studio Dubai',
      type: 'last-minute',
      title: 'Eyelash Extension',
      description: 'Classic or Volume lashes',
      category: 'Lash & Brow',
      imageUrl: '',
      createdAt: new Date().toISOString(),
      authorName: 'Glamour Studio',
      authorId: 'demo-author',
      serviceId: 'lash-extension',
      serviceName: 'Eyelash Extension',
      originalPrice: 300,
      discountPrice: 225,
      likes: ['user1'],
      viewsCount: 5621,
      city: 'Dubai',
      country: 'UAE',
    },
    {
      id: '5-demo',
      salonId: 'luxury-spa-wellness',
      salonName: 'Luxury Spa & Wellness',
      type: 'post',
      title: 'Professional Coaching',
      description: 'Transform your life',
      category: 'Coaching & Wellness',
      imageUrl: '',
      createdAt: new Date().toISOString(),
      authorName: 'Luxury Spa',
      authorId: 'demo-author',
      serviceId: 'life-coaching',
      likes: [],
      viewsCount: 1586,
      city: 'New York',
      country: 'USA',
      isPremium: false,
    },
    {
      id: '6-demo',
      salonId: 'glamour-studio-dubai',
      salonName: 'Glamour Studio Dubai',
      type: 'post',
      title: 'Beauty & Style Consultation',
      description: 'Personal styling and beauty',
      category: 'Consultation',
      imageUrl: '',
      createdAt: new Date().toISOString(),
      authorName: 'Glamour Studio',
      authorId: 'demo-author',
      serviceId: 'style-consultation',
      likes: ['user1', 'user2', 'user3', 'user4'],
      viewsCount: 9776,
      city: 'Dubai',
      country: 'UAE',
      isPremium: true,
    },
    {
      id: '7-demo',
      salonId: 'elite-hair-spa',
      salonName: 'Elite Hair & Spa',
      type: 'last-minute',
      title: 'Keratin Hair Treatment',
      description: 'Smooth and shiny hair',
      category: 'Hair Treatment',
      imageUrl: '',
      createdAt: new Date().toISOString(),
      authorName: 'Elite Hair',
      authorId: 'demo-author',
      serviceId: 'keratin-treatment',
      serviceName: 'Keratin Treatment',
      originalPrice: 350,
      discountPrice: 245,
      likes: ['user1', 'user2'],
      viewsCount: 4892,
      city: 'Sharjah',
      country: 'UAE',
    },
    {
      id: '8-demo',
      salonId: 'royal-beauty-center',
      salonName: 'Royal Beauty Center',
      type: 'last-minute',
      title: 'Salon Management App',
      description: 'Automate your salon bookings',
      category: 'Business Tools',
      imageUrl: '',
      createdAt: new Date().toISOString(),
      authorName: 'Royal Beauty',
      authorId: 'demo-author',
      serviceId: 'app-demo',
      serviceName: 'App Demo',
      // No prices - will show yellow LAST MINUTE badge
      likes: ['user1'],
      viewsCount: 1034,
      city: 'Los Angeles',
      country: 'USA',
    },
    {
      id: '9-demo',
      salonId: 'beauty-paradise-spa',
      salonName: 'Beauty Paradise Spa',
      type: 'post',
      title: 'Stress Relief Package',
      description: 'Optimize your wellness routine',
      category: 'Spa & Wellness',
      imageUrl: '',
      createdAt: new Date().toISOString(),
      authorName: 'Beauty Paradise',
      authorId: 'demo-author',
      serviceId: 'wellness-package',
      likes: [],
      viewsCount: 86,
      city: 'Dubai',
      country: 'UAE',
    },
    {
      id: '10-demo',
      salonId: 'glamour-studio-dubai',
      salonName: 'Glamour Studio Dubai',
      type: 'last-minute',
      title: 'Balayage Hair Color',
      description: 'Beautiful transformation',
      category: 'Hair Coloring',
      imageUrl: '',
      createdAt: new Date().toISOString(),
      authorName: 'Glamour Studio',
      authorId: 'demo-author',
      serviceId: 'balayage-color',
      serviceName: 'Balayage Color',
      originalPrice: 400,
      discountPrice: 280,
      likes: ['user1', 'user2', 'user3'],
      viewsCount: 7234,
      city: 'Dubai',
      country: 'UAE',
      isPremium: true,
    },
    {
      id: '11-demo',
      salonId: 'modern-beauty-hub',
      salonName: 'Modern Beauty Hub',
      type: 'post',
      title: 'Mobile Booking Platform',
      description: 'User-friendly app for salons',
      category: 'Technology',
      imageUrl: '',
      createdAt: new Date().toISOString(),
      authorName: 'Modern Beauty',
      authorId: 'demo-author',
      serviceId: 'mobile-app',
      likes: ['user1', 'user2'],
      viewsCount: 1139,
      city: 'London',
      country: 'UK',
    },
    {
      id: '12-demo',
      salonId: 'elegant-nails-studio',
      salonName: 'Elegant Nails Studio',
      type: 'post',
      title: 'Inspirational Journey',
      description: 'Go wherever the wind takes you',
      category: 'Lifestyle',
      imageUrl: '',
      createdAt: new Date().toISOString(),
      authorName: 'Elegant Nails',
      authorId: 'demo-author',
      serviceId: 'lifestyle-coaching',
      likes: ['user1', 'user2', 'user3', 'user4', 'user5'],
      viewsCount: 3448,
      city: 'Dubai',
      country: 'UAE',
    },
  ];

  useEffect(() => {
    loadPosts();
    checkUserPermissions();
  }, []);

  useEffect(() => {
    // Apply filter and geo-filter
    const postsToFilter = showMockDemo ? mockDemoPosts : posts;
    
    // First apply geo-filter
    const geoFilteredPosts = selectedCountry === 'All' 
      ? postsToFilter 
      : postsToFilter.filter(post => post.country === selectedCountry);
    
    // Then apply type filter
    if (filter === 'all') {
      setFilteredPosts(geoFilteredPosts);
    } else if (filter === 'sale') {
      // Show only posts with discounts
      setFilteredPosts(geoFilteredPosts.filter(post => 
        post.originalPrice && post.discountPrice && post.originalPrice > post.discountPrice
      ));
    } else {
      setFilteredPosts(geoFilteredPosts.filter(post => post.type === filter));
    }
  }, [filter, posts, showMockDemo, selectedCountry]);

  const checkUserPermissions = async () => {
    if (!user || !session) {
      setCanCreatePost(false);
      return;
    }

    try {
      // Получаем информацию о салоне пользователя
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/salons/user/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.salon) {
          setUserSalonId(data.salon.id);
          setUserSalonName(data.salon.name);
          
          // Провеяем роль (owner или admin моут создавать посты)
          const userRole = user.user_metadata?.role;
          setCanCreatePost(userRole === 'owner' || userRole === 'admin');
        }
      }
    } catch (error) {
      console.error('Error checking user permissions:', error);
    }
  };

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/feed/posts`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to load posts');
      }

      const data = await response.json();
      
      // Add random view counts for demo
      const postsWithViews = (data.posts || []).map((post: FeedPost) => ({
        ...post,
        viewsCount: Math.floor(Math.random() * 10000) + 500,
      }));
      
      setPosts(postsWithViews);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Failed to load feed posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!session?.access_token) {
      toast.error('You must be logged in to delete posts');
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/feed/posts/${postId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete post');
      }

      toast.success('Post deleted successfully');
      loadPosts(); // Reload posts
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete post');
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!session?.access_token) {
      toast.error('You must be logged in to like posts');
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/feed/posts/${postId}/like`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to like post');
      }

      // Optimistically update the UI
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            const likes = post.likes || [];
            const userId = user?.id || '';
            
            if (likes.includes(userId)) {
              return { ...post, likes: likes.filter(id => id !== userId) };
            } else {
              return { ...post, likes: [...likes, userId] };
            }
          }
          return post;
        })
      );
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Failed to like post');
    }
  };

  const handleSeedDemoPosts = async () => {
    if (!session?.access_token) {
      toast.error('You must be logged in to seed demo posts');
      return;
    }

    try {
      setIsSeeding(true);
      toast.info('Seeding demo posts...');
      
      const result = await seedDemoFeedPosts(session.access_token);
      
      if (result.success) {
        toast.success(result.message);
        loadPosts(); // Reload to show new posts
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error seeding posts:', error);
      toast.error('Failed to seed demo posts');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 mt-20 pb-20">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-white shadow-lg">
              <Rss className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-purple-600 mb-2">
            Beauty Feed
          </h1>
          <p className="text-gray-700 text-lg">
            Discover the latest from salons and exclusive last-minute deals
          </p>
        </div>

        {/* Filters and Create Button */}
        <div className="flex flex-col gap-4 mb-8">
          {/* Type Filters */}
          <div className="flex flex-col gap-4 items-center">
            {/* Filter Buttons - Centered, one line on desktop */}
            <div className="flex gap-2 sm:gap-3 flex-wrap sm:flex-nowrap justify-center">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                className={`rounded-full px-4 sm:px-6 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                  filter === 'all' 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl' 
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-purple-300 hover:text-purple-600'
                }`}
              >
                All Posts
              </Button>
              <Button
                variant={filter === 'post' ? 'default' : 'outline'}
                onClick={() => setFilter('post')}
                className={`rounded-full px-4 sm:px-6 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                  filter === 'post' 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl' 
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-purple-300 hover:text-purple-600'
                }`}
              >
                Updates
              </Button>
              <Button
                variant={filter === 'last-minute' ? 'default' : 'outline'}
                onClick={() => setFilter('last-minute')}
                className={`rounded-full px-4 sm:px-6 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                  filter === 'last-minute' 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl' 
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-purple-300 hover:text-purple-600'
                }`}
              >
                Last Minute
              </Button>
              <Button
                variant={filter === 'sale' ? 'default' : 'outline'}
                onClick={() => setFilter('sale')}
                className={`rounded-full px-4 sm:px-6 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                  filter === 'sale' 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl' 
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-purple-300 hover:text-purple-600'
                }`}
              >
                Sales
              </Button>
            </div>

            {/* Create Post Button - Centered below */}
            {canCreatePost && (
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full px-6 shadow-lg"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Post
              </Button>
            )}
          </div>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-2">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-sm" />
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Rss className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'Be the first to create a post!' 
                : filter === 'sale'
                ? 'No sales available right now'
                : `No ${filter === 'last-minute' ? 'last-minute deals' : 'regular posts'} available`
              }
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => setShowMockDemo(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                View Demo Feed
              </Button>
              {canCreatePost && (
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  variant="outline"
                  className="border-purple-300 hover:bg-purple-50"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Create Post
                </Button>
              )}
              {session && (
                <Button
                  onClick={handleSeedDemoPosts}
                  disabled={isSeeding}
                  variant="outline"
                  className="border-purple-300 hover:bg-purple-50"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isSeeding ? 'Loading...' : 'Load Real Posts'}
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-2">
            {filteredPosts.map(post => (
              <FeedPostCard
                key={post.id}
                post={post}
                currentUserId={user?.id}
                onDelete={handleDeletePost}
                onLike={handleLikePost}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create Post Modal */}
      {canCreatePost && session && (
        <CreateFeedPost
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={loadPosts}
          salonId={userSalonId}
          salonName={userSalonName}
          accessToken={session.access_token}
        />
      )}
    </div>
  );
}