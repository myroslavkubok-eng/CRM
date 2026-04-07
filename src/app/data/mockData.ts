// Mock data for the Katia platform
import { generateTimeSlots, AvailableDay } from '../utils/availabilityUtils';

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  category: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  image: string;
  rating: number;
  specialties: string[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  avatar: string;
}

export interface Salon {
  id: string;
  name: string;
  image: string;
  gallery?: string[]; // Array of gallery images
  rating: number;
  reviewCount: number;
  location: string;
  city: string;
  country: string;
  priceFrom: number;
  distance: number; // Расстояние в километрах
  isFeatured: boolean;
  isNew: boolean;
  isOpenNow: boolean; // Открыт ли салон сейчас
  isPremium: boolean; // Premium salon
  isRecommended: boolean; // Recommended salon
  discount?: number; // Discount percentage (0-100)
  services: Service[];
  staff: StaffMember[];
  reviews: Review[];
  about: string;
  openHours: string;
  availableSlots: AvailableDay[]; // Available time slots
}

export interface Booking {
  id: string;
  salonName: string;
  service: string;
  date: string;
  time: string;
  staff: string;
  price: number;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export const mockSalons: Salon[] = [
  {
    id: '1',
    name: 'Glamour Studio',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1626383137804-ff908d2753a2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1626379501846-0df4067b8bb9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1619607146034-5a05296c8f9a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&h=600&fit=crop',
    ],
    rating: 4.8,
    reviewCount: 245,
    location: 'Downtown, New York',
    city: 'New York',
    country: 'USA',
    priceFrom: 45,
    distance: 1.2,
    isFeatured: true,
    isNew: false,
    isOpenNow: true,
    isPremium: true,
    isRecommended: true,
    discount: 10,
    about: 'Premium beauty salon offering a full range of services in a luxurious setting.',
    openHours: 'Mon-Sat: 9:00 AM - 8:00 PM, Sun: 10:00 AM - 6:00 PM',
    services: [
      { id: 's1', name: 'Haircut & Styling', duration: 60, price: 65, category: 'hairstylist' },
      { id: 's2', name: 'Hair Coloring', duration: 120, price: 120, category: 'hairstylist' },
      { id: 's3', name: 'Manicure', duration: 45, price: 35, category: 'manicure' },
      { id: 's4', name: 'Pedicure', duration: 60, price: 45, category: 'pedicure' },
      { id: 's5', name: 'Facial Treatment', duration: 75, price: 85, category: 'facial' },
    ],
    staff: [
      {
        id: 'st1',
        name: 'Sarah Johnson',
        role: 'Senior Stylist',
        image: 'https://i.pravatar.cc/150?img=1',
        rating: 4.9,
        specialties: ['Haircut & Styling', 'Hair Coloring'],
      },
      {
        id: 'st2',
        name: 'Emily Davis',
        role: 'Nail Specialist',
        image: 'https://i.pravatar.cc/150?img=5',
        rating: 4.8,
        specialties: ['Manicure', 'Pedicure'],
      },
      {
        id: 'st3a',
        name: 'Jessica Williams',
        role: 'Facial Specialist',
        image: 'https://i.pravatar.cc/150?img=47',
        rating: 4.9,
        specialties: ['Facial Treatment'],
      },
    ],
    reviews: [
      {
        id: 'r1',
        author: 'Jessica M.',
        rating: 5,
        date: '2024-12-15',
        comment: 'Amazing service! Sarah did a fantastic job with my hair color.',
        avatar: 'https://i.pravatar.cc/150?img=10',
      },
      {
        id: 'r2',
        author: 'Amanda K.',
        rating: 4,
        date: '2024-12-10',
        comment: 'Great salon, very professional staff. Will come back!',
        avatar: 'https://i.pravatar.cc/150?img=20',
      },
    ],
    availableSlots: generateTimeSlots(7, 9, 21, 30, 0.4),
  },
  {
    id: '2',
    name: 'Bella Vista Spa',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1731336479432-3eb5fdb3ab1c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1758632031161-b6d7e913c2b9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1712725213051-8d7d6a52edaf?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1761971975724-31001b4de0bf?w=800&h=600&fit=crop',
    ],
    rating: 4.9,
    reviewCount: 189,
    location: 'Midtown, New York',
    city: 'New York',
    country: 'USA',
    priceFrom: 55,
    distance: 2.5,
    isFeatured: true,
    isNew: false,
    isOpenNow: true,
    isPremium: true,
    isRecommended: true,
    discount: 5,
    about: 'Luxury spa and wellness center with expert therapists and premium products.',
    openHours: 'Mon-Sun: 9:00 AM - 9:00 PM',
    services: [
      { id: 's6', name: 'Deep Tissue Massage', duration: 90, price: 110, category: 'massage' },
      { id: 's7', name: 'Swedish Massage', duration: 60, price: 85, category: 'massage' },
      { id: 's8', name: 'Lash Extensions', duration: 120, price: 150, category: 'eyelashes' },
    ],
    staff: [
      {
        id: 'st3',
        name: 'Maria Garcia',
        role: 'Massage Therapist',
        image: 'https://i.pravatar.cc/150?img=9',
        rating: 5.0,
        specialties: ['Deep Tissue Massage', 'Swedish Massage'],
      },
    ],
    reviews: [],
    availableSlots: generateTimeSlots(7, 9, 21, 30, 0.4),
  },
  {
    id: '3',
    name: 'Luxe Beauty Bar',
    image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&h=600&fit=crop',
    rating: 4.7,
    reviewCount: 156,
    location: 'Brooklyn, New York',
    city: 'New York',
    country: 'USA',
    priceFrom: 40,
    distance: 3.8,
    isFeatured: false,
    isNew: true,
    isOpenNow: false,
    isPremium: false,
    isRecommended: true,
    discount: 15,
    about: 'Modern beauty bar specializing in nails and lashes.',
    openHours: 'Tue-Sun: 10:00 AM - 7:00 PM',
    services: [
      { id: 's9', name: 'Gel Manicure', duration: 50, price: 45, category: 'manicure' },
      { id: 's10', name: 'Acrylic Nails', duration: 90, price: 70, category: 'manicure' },
    ],
    staff: [],
    reviews: [],
    availableSlots: generateTimeSlots(7, 10, 19, 30, 0.6),
  },
  {
    id: '4',
    name: 'Downtown Beauty Hub',
    image: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=800&h=600&fit=crop',
    rating: 4.6,
    reviewCount: 198,
    location: 'Downtown Dubai, Dubai',
    city: 'Dubai',
    country: 'UAE',
    priceFrom: 35,
    distance: 0.8,
    isFeatured: true,
    isNew: false,
    isOpenNow: true,
    isPremium: false,
    isRecommended: true,
    discount: 20,
    about: 'Your neighborhood beauty destination for nails and lashes.',
    openHours: 'Mon-Sun: 9:00 AM - 9:00 PM',
    services: [
      { id: 's11', name: 'Classic Manicure', duration: 45, price: 35, category: 'manicure' },
      { id: 's12', name: 'Gel Manicure', duration: 60, price: 50, category: 'manicure' },
      { id: 's13', name: 'Classic Lash Extensions', duration: 120, price: 120, category: 'eyelashes' },
      { id: 's14', name: 'Volume Lash Extensions', duration: 150, price: 180, category: 'eyelashes' },
      { id: 's15', name: 'Pedicure', duration: 60, price: 45, category: 'pedicure' },
    ],
    staff: [
      {
        id: 'st4',
        name: 'Aisha Ahmed',
        role: 'Nail Artist',
        image: 'https://i.pravatar.cc/150?img=25',
        rating: 4.7,
        specialties: ['Manicure', 'Pedicure'],
      },
      {
        id: 'st5',
        name: 'Fatima Al Mansoori',
        role: 'Lash Specialist',
        image: 'https://i.pravatar.cc/150?img=32',
        rating: 4.8,
        specialties: ['Lash Extensions'],
      },
    ],
    reviews: [
      {
        id: 'r3',
        author: 'Sarah K.',
        rating: 5,
        date: '2024-12-20',
        comment: 'Best lash extensions in Dubai! Fatima is amazing!',
        avatar: 'https://i.pravatar.cc/150?img=15',
      },
    ],
    availableSlots: generateTimeSlots(7, 9, 21, 30, 0.5),
  },
  {
    id: '5',
    name: 'Marina Glam Studio',
    image: 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=800&h=600&fit=crop',
    rating: 4.9,
    reviewCount: 342,
    location: 'Dubai Marina, Dubai',
    city: 'Dubai',
    country: 'UAE',
    priceFrom: 65,
    distance: 4.2,
    isFeatured: true,
    isNew: false,
    isOpenNow: true,
    isPremium: true,
    isRecommended: true,
    discount: 0,
    about: 'Luxury beauty salon with waterfront views offering premium services.',
    openHours: 'Mon-Sun: 10:00 AM - 10:00 PM',
    services: [
      { id: 's16', name: 'Premium Manicure', duration: 60, price: 65, category: 'manicure' },
      { id: 's17', name: 'Russian Manicure', duration: 75, price: 85, category: 'manicure' },
      { id: 's18', name: 'Mega Volume Lashes', duration: 180, price: 250, category: 'eyelashes' },
      { id: 's19', name: 'Lash Lift & Tint', duration: 90, price: 120, category: 'eyelashes' },
      { id: 's20', name: 'Brow Lamination', duration: 60, price: 95, category: 'brow' },
      { id: 's21', name: 'Hot Stone Massage', duration: 90, price: 180, category: 'massage' },
    ],
    staff: [
      {
        id: 'st6',
        name: 'Natalia Ivanova',
        role: 'Master Nail Artist',
        image: 'https://i.pravatar.cc/150?img=33',
        rating: 5.0,
        specialties: ['Russian Manicure', 'Gel Extensions'],
      },
      {
        id: 'st7',
        name: 'Olga Petrova',
        role: 'Lash Expert',
        image: 'https://i.pravatar.cc/150?img=44',
        rating: 4.9,
        specialties: ['Mega Volume Lashes', 'Lash Lift'],
      },
    ],
    reviews: [
      {
        id: 'r4',
        author: 'Emma W.',
        rating: 5,
        date: '2024-12-18',
        comment: 'Absolutely worth it! Premium quality and amazing service.',
        avatar: 'https://i.pravatar.cc/150?img=45',
      },
    ],
    availableSlots: generateTimeSlots(7, 10, 22, 30, 0.3),
  },
  {
    id: '6',
    name: 'Jumeirah Beauty Lounge',
    image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=800&h=600&fit=crop',
    rating: 4.5,
    reviewCount: 127,
    location: 'Jumeirah, Dubai',
    city: 'Dubai',
    country: 'UAE',
    priceFrom: 40,
    distance: 6.5,
    isFeatured: false,
    isNew: true,
    isOpenNow: true,
    isPremium: false,
    isRecommended: false,
    discount: 25,
    about: 'Cozy neighborhood salon with friendly atmosphere.',
    openHours: 'Mon-Sat: 9:00 AM - 8:00 PM',
    services: [
      { id: 's22', name: 'Express Manicure', duration: 30, price: 30, category: 'manicure' },
      { id: 's23', name: 'Full Set Acrylics', duration: 120, price: 90, category: 'manicure' },
      { id: 's24', name: 'Classic Lashes', duration: 90, price: 100, category: 'eyelashes' },
    ],
    staff: [],
    reviews: [],
    availableSlots: generateTimeSlots(7, 9, 20, 30, 0.7),
  },
  {
    id: '7',
    name: 'Palm Beauty Center',
    image: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=800&h=600&fit=crop',
    rating: 4.8,
    reviewCount: 215,
    location: 'Palm Jumeirah, Dubai',
    city: 'Dubai',
    country: 'UAE',
    priceFrom: 75,
    distance: 8.2,
    isFeatured: true,
    isNew: false,
    isOpenNow: true,
    isPremium: true,
    isRecommended: true,
    discount: 0,
    about: 'Exclusive beauty center on the Palm with world-class services.',
    openHours: 'Mon-Sun: 10:00 AM - 11:00 PM',
    services: [
      { id: 's25', name: 'Luxury Manicure', duration: 75, price: 95, category: 'manicure' },
      { id: 's26', name: 'Hybrid Lash Extensions', duration: 150, price: 220, category: 'eyelashes' },
      { id: 's27', name: 'Microblading', duration: 180, price: 850, category: 'brow' },
      { id: 's28', name: 'Deep Tissue Massage', duration: 90, price: 200, category: 'massage' },
    ],
    staff: [
      {
        id: 'st8',
        name: 'Isabella Martinez',
        role: 'Premium Stylist',
        image: 'https://i.pravatar.cc/150?img=28',
        rating: 4.9,
        specialties: ['Luxury Services'],
      },
    ],
    reviews: [],
    availableSlots: generateTimeSlots(7, 10, 23, 30, 0.2),
  },
  {
    id: '8',
    name: 'City Walk Nails & Lashes',
    image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&h=600&fit=crop',
    rating: 4.4,
    reviewCount: 89,
    location: 'Downtown Dubai, Dubai',
    city: 'Dubai',
    country: 'UAE',
    priceFrom: 30,
    distance: 1.5,
    isFeatured: false,
    isNew: false,
    isOpenNow: true,
    isPremium: false,
    isRecommended: true,
    discount: 15,
    about: 'Affordable beauty services in the heart of Downtown.',
    openHours: 'Mon-Sun: 9:00 AM - 9:00 PM',
    services: [
      { id: 's29', name: 'Basic Manicure', duration: 40, price: 30, category: 'manicure' },
      { id: 's30', name: 'Gel Polish', duration: 50, price: 45, category: 'manicure' },
      { id: 's31', name: 'Classic Lashes', duration: 100, price: 95, category: 'eyelashes' },
      { id: 's32', name: 'Lash Refill', duration: 60, price: 65, category: 'eyelashes' },
    ],
    staff: [],
    reviews: [],
    availableSlots: generateTimeSlots(7, 9, 21, 30, 0.6),
  },
];

export const mockBookings: Booking[] = [
  {
    id: 'b1',
    salonName: 'Glamour Studio',
    service: 'Haircut & Styling',
    date: '2024-12-28',
    time: '2:00 PM',
    staff: 'Sarah Johnson',
    price: 65,
    status: 'upcoming',
  },
  {
    id: 'b2',
    salonName: 'Glamour Studio',
    service: 'Facial Treatment',
    date: '2024-12-10',
    time: '11:00 AM',
    staff: 'Sarah Johnson',
    price: 85,
    status: 'completed',
  },
];

export const serviceCategories = [
  { id: 'manicure', name: 'Manicure', icon: 'Sparkles' },
  { id: 'pedicure', name: 'Pedicure', icon: 'Footprints' },
  { id: 'eyelashes', name: 'Eyelashes', icon: 'Eye' },
  { id: 'brow', name: 'Brow', icon: 'Scan' },
  { id: 'barber', name: 'Barber', icon: 'Scissors' },
  { id: 'cosmetology', name: 'Cosmetology', icon: 'Sparkle' },
  { id: 'laser', name: 'Laser', icon: 'Zap' },
  { id: 'makeup', name: 'Make up', icon: 'Palette' },
  { id: 'hairstylist', name: 'Hair stylist', icon: 'ScissorsLineDashed' },
  { id: 'tattoo', name: 'Tattoo', icon: 'Pen' },
  { id: 'piercing', name: 'Piercing', icon: 'CircleDot' },
  { id: 'spa', name: 'Spa', icon: 'Waves' },
  { id: 'pmu', name: 'PMU', icon: 'Brush' },
  { id: 'massage', name: 'Massage', icon: 'Hand' },
  { id: 'waxing', name: 'Waxing', icon: 'Droplet' },
  { id: 'facial', name: 'Facial', icon: 'Smile' },
  { id: 'fitness', name: 'Fitness', icon: 'Dumbbell' },
  { id: 'other', name: 'Other', icon: 'Star' },
];