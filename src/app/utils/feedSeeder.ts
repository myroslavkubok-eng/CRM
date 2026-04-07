/**
 * Feed Seeder - Utility to populate demo feed posts
 * This is used for development and demo purposes
 */

import { projectId, publicAnonKey } from '../../../utils/supabase/info';

export interface SeedPost {
  salonId: string;
  salonName: string;
  type: 'post' | 'last-minute';
  title: string;
  description: string;
  imageUrl?: string;
  category?: string;
  serviceName?: string;
  serviceId?: string;
  originalPrice?: number;
  discountPrice?: number;
  availableDate?: string;
  availableTime?: string;
}

// Demo seed posts - все указывают на реальные салоны
export const DEMO_FEED_POSTS: SeedPost[] = [
  // Salon 1: VLV Beauty
  {
    salonId: 'vlv-beauty-dubai',
    salonName: 'VLV Beauty Dubai',
    type: 'post',
    title: 'Lash & Brow Training',
    description: 'Professional training seminars - 6 seminars available now! Book your spot today.',
    category: 'Education & Training',
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c032?w=800',
    serviceId: 'lash-brow-training',
  },
  
  // Salon 2: MBS My Business School
  {
    salonId: 'mbs-business-school',
    salonName: 'MBS Business School',
    type: 'post',
    title: 'Business Seminars',
    description: 'Grow your beauty business with our expert seminars',
    category: 'Business Training',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    serviceId: 'business-seminar',
  },

  // Salon 3: Elegant Wedding Venue
  {
    salonId: 'elegant-wedding-venue',
    salonName: 'Elegant Wedding & Events',
    type: 'post',
    title: 'Luxury Wedding Venue',
    description: '23.2k views - The perfect venue for your special day',
    category: 'Wedding & Events',
    imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800',
    serviceId: 'wedding-venue',
  },

  // Last Minute Deal 1
  {
    salonId: 'vlv-beauty-dubai',
    salonName: 'VLV Beauty Dubai',
    type: 'last-minute',
    title: 'Eyelash Extension',
    description: 'Classic or Volume lashes - Special price for today only!',
    category: 'Lash & Brow',
    imageUrl: 'https://images.unsplash.com/photo-1583001931096-959e991ba510?w=800',
    serviceId: 'lash-extension',
    serviceName: 'Eyelash Extension',
    originalPrice: 300,
    discountPrice: 225,
    availableDate: new Date().toISOString().split('T')[0],
    availableTime: '14:00',
  },

  // Salon 4: Luxury Spa
  {
    salonId: 'luxury-spa-wellness',
    salonName: 'Luxury Spa & Wellness',
    type: 'post',
    title: 'Professional Coaching',
    description: '1.586 views - Transform your life with our coaching sessions',
    category: 'Coaching & Wellness',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
    serviceId: 'life-coaching',
  },

  // Salon 5: Glamour Studio
  {
    salonId: 'glamour-studio-dubai',
    salonName: 'Glamour Studio Dubai',
    type: 'post',
    title: 'Beauty & Style Consultation',
    description: '9.776 views - Personal styling and beauty consultation',
    category: 'Consultation',
    imageUrl: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=800',
    serviceId: 'style-consultation',
  },

  // Last Minute Deal 2
  {
    salonId: 'elite-hair-spa',
    salonName: 'Elite Hair & Spa',
    type: 'last-minute',
    title: 'Keratin Hair Treatment',
    description: 'Smooth and shiny hair - Last slot available today!',
    category: 'Hair Treatment',
    imageUrl: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800',
    serviceId: 'keratin-treatment',
    serviceName: 'Keratin Hair Treatment',
    originalPrice: 350,
    discountPrice: 245,
    availableDate: new Date().toISOString().split('T')[0],
    availableTime: '16:00',
  },

  // Salon 6: Royal Beauty Center
  {
    salonId: 'royal-beauty-center',
    salonName: 'Royal Beauty Center',
    type: 'post',
    title: 'Salon Management App',
    description: '1.034 views - Automate your salon bookings in minutes',
    category: 'Business Tools',
    imageUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800',
    serviceId: 'app-demo',
  },

  // Salon 7: Beauty Paradise
  {
    salonId: 'beauty-paradise-spa',
    salonName: 'Beauty Paradise Spa',
    type: 'post',
    title: 'Stress Relief Package',
    description: '86 views - Optimize your routine with our wellness package',
    category: 'Spa & Wellness',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800',
    serviceId: 'wellness-package',
  },

  // Last Minute Deal 3
  {
    salonId: 'glamour-studio-dubai',
    salonName: 'Glamour Studio Dubai',
    type: 'last-minute',
    title: 'Balayage Hair Color',
    description: 'Beautiful balayage transformation - Today only!',
    category: 'Hair Coloring',
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
    serviceId: 'balayage-color',
    serviceName: 'Balayage Hair Coloring',
    originalPrice: 400,
    discountPrice: 280,
    availableDate: new Date().toISOString().split('T')[0],
    availableTime: '11:00',
  },

  // Salon 8: Modern Beauty Hub
  {
    salonId: 'modern-beauty-hub',
    salonName: 'Modern Beauty Hub',
    type: 'post',
    title: 'Mobile Booking Platform',
    description: '1.139 views - User-friendly app for salon bookings',
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
    serviceId: 'mobile-app',
  },

  // Salon 9: Elegant Nails
  {
    salonId: 'elegant-nails-studio',
    salonName: 'Elegant Nails Studio',
    type: 'post',
    title: 'Inspirational Journey',
    description: '3.448 views - Go wherever the wind takes you',
    category: 'Lifestyle',
    imageUrl: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=800',
    serviceId: 'lifestyle-coaching',
  },

  // Last Minute Deal 4
  {
    salonId: 'luxury-spa-wellness',
    salonName: 'Luxury Spa & Wellness',
    type: 'last-minute',
    title: 'Deep Tissue Massage',
    description: 'Relief from muscle tension - Available now!',
    category: 'Massage Therapy',
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
    serviceId: 'deep-massage',
    serviceName: 'Deep Tissue Massage',
    originalPrice: 280,
    discountPrice: 210,
    availableDate: new Date().toISOString().split('T')[0],
    availableTime: '18:00',
  },
];

/**
 * Seed demo posts to the feed
 * This function should be called with proper authentication
 */
export async function seedDemoFeedPosts(accessToken: string): Promise<{ success: boolean; message: string }> {
  try {
    let successCount = 0;
    let errorCount = 0;

    for (const post of DEMO_FEED_POSTS) {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/feed/posts`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(post),
          }
        );

        if (response.ok) {
          successCount++;
        } else {
          errorCount++;
          console.error(`Failed to create post: ${post.title}`);
        }
      } catch (error) {
        errorCount++;
        console.error(`Error creating post: ${post.title}`, error);
      }
    }

    return {
      success: true,
      message: `Feed seeding completed! Created ${successCount} posts, ${errorCount} errors.`,
    };
  } catch (error) {
    console.error('Feed seeding error:', error);
    return {
      success: false,
      message: 'Failed to seed feed posts',
    };
  }
}

/**
 * Clear all feed posts (for testing/demo purposes)
 */
export async function clearAllFeedPosts(accessToken: string): Promise<{ success: boolean; message: string }> {
  try {
    // Get all posts
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/feed/posts`,
      {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    const data = await response.json();
    const posts = data.posts || [];

    let deletedCount = 0;

    for (const post of posts) {
      try {
        const deleteResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/feed/posts/${post.id}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (deleteResponse.ok) {
          deletedCount++;
        }
      } catch (error) {
        console.error(`Error deleting post: ${post.id}`, error);
      }
    }

    return {
      success: true,
      message: `Deleted ${deletedCount} posts`,
    };
  } catch (error) {
    console.error('Clear feed error:', error);
    return {
      success: false,
      message: 'Failed to clear feed posts',
    };
  }
}