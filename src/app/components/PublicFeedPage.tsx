import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Heart, 
  MessageCircle, 
  Clock,
  TrendingUp,
  Eye
} from 'lucide-react';
import { Button } from './ui/button';
import { FeedPostCard } from './FeedPostCard';
import { CreateFeedPost } from './CreateFeedPost';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { useAuth } from '../../../contexts/AuthContext';

interface FeedPost {
  id: string;
  salonId: string;
  salonName: string;
  type: 'post' | 'last-minute';
  title: string;
  description: string;
  imageUrl?: string;
  category?: string;
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
  viewsCount?: number;
}

export function PublicFeedPage() {
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'post' | 'last-minute'>('all');

  // Demo salon info for create post
  const demoSalonId = 'demo-salon-1';
  const demoSalonName = 'Luxury Beauty Lounge';

  useEffect(() => {
    loadPosts();
  }, [filterType]);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      
      const url = filterType === 'all' 
        ? `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/feed/posts`
        : `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/feed/posts?type=${filterType}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load posts');
      }

      const data = await response.json();
      
      // Add random view counts for demo
      const postsWithViews = data.posts.map((post: FeedPost) => ({
        ...post,
        viewsCount: Math.floor(Math.random() * 10000) + 500,
      }));
      
      setPosts(postsWithViews);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Failed to load feed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!session?.access_token) {
      toast.error('Please login to delete posts');
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
        throw new Error('Failed to delete post');
      }

      toast.success('Post deleted');
      loadPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!session?.access_token) {
      toast.error('Please login to like posts');
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

      loadPosts();
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Failed to like post');
    }
  };

  const canCreatePost = user?.user_metadata?.role === 'owner' || user?.user_metadata?.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Fixed on mobile like Instagram */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Katia
              </h1>
              <span className="text-gray-400">|</span>
              <span className="text-sm text-gray-600 font-medium">Feed</span>
            </div>
            
            <div className="flex items-center gap-2">
              {canCreatePost && (
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Create</span>
                </Button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filterType === 'all'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Posts
            </button>
            <button
              onClick={() => setFilterType('post')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filterType === 'post'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Heart className="w-3.5 h-3.5 inline mr-1" />
              Posts
            </button>
            <button
              onClick={() => setFilterType('last-minute')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filterType === 'last-minute'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5 inline mr-1" />
              Last Minute
            </button>
          </div>
        </div>
      </div>

      {/* Feed Grid - Instagram style */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4">
        {isLoading ? (
          <div className="grid grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-2">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-sm" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-6">No posts yet. Be the first to share!</p>
            {canCreatePost && (
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Post
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-2">
            {posts.map((post) => (
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
      </div>

      {/* Create Post Modal */}
      {canCreatePost && (
        <CreateFeedPost
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={loadPosts}
          salonId={demoSalonId}
          salonName={demoSalonName}
          accessToken={session?.access_token || ''}
        />
      )}
    </div>
  );
}