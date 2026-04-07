import { useState } from 'react';
import { mockBookings, mockSalons } from '../data/mockData';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Progress } from '../components/ui/progress';
import { SalonCard } from '../components/SalonCard';
import { RescheduleBookingModal } from '../components/RescheduleBookingModal';
import { CancelBookingModal } from '../components/CancelBookingModal';
import { RepeatBookingButton } from '../components/RepeatBookingButton';
import { VoiceBookingButton } from '../components/VoiceBookingButton';
import { Footer } from '../components/Footer';
import { ClientNotificationSettings } from '../components/ClientNotificationSettings';
import { Link, useNavigate } from 'react-router-dom';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  Calendar,
  Heart,
  User,
  Settings,
  Clock,
  MapPin,
  Star,
  Gift,
  CreditCard,
  Download,
  Bell,
  Shield,
  LogOut,
  Search,
  Bot,
  TrendingUp,
  Award,
  Users,
  Sparkles,
  Copy,
  Check,
  X,
  ChevronRight,
  Package,
  Receipt,
  MessageSquare,
  Image as ImageIcon,
  Crown,
  Zap,
  Target,
  BarChart3,
  Scissors,
  Trash2,
} from 'lucide-react';

export function ClientDashboard() {
  const { formatPrice, currency } = useCurrency();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [referralCopied, setReferralCopied] = useState(false);
  
  // Modal states
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  // Mock Data
  const [bookings, setBookings] = useState(mockBookings);
  const upcomingBookings = bookings.filter(b => b.status === 'upcoming');
  const pastBookings = bookings.filter(b => b.status === 'completed');
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled');
  const favoriteSalons = mockSalons.slice(0, 6);
  
  // Favorite Services (NEW)
  const [favoriteServices, setFavoriteServices] = useState([
    {
      id: '1',
      name: 'Balayage Hair Color',
      salonName: 'Glamour Studio',
      salonId: '1',
      price: 350,
      duration: 180,
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop',
    },
    {
      id: '2',
      name: 'Classic Manicure & Pedicure',
      salonName: 'Beauty Haven',
      salonId: '2',
      price: 120,
      duration: 90,
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop',
    },
    {
      id: '3',
      name: 'Deep Tissue Massage',
      salonName: 'Serenity Spa',
      salonId: '3',
      price: 280,
      duration: 60,
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop',
    },
  ]);

  // Handlers
  const handleOpenReschedule = (booking: any) => {
    setSelectedBooking(booking);
    setRescheduleModalOpen(true);
  };

  const handleOpenCancel = (booking: any) => {
    setSelectedBooking(booking);
    setCancelModalOpen(true);
  };

  const handleRescheduleSuccess = (updatedBooking: any) => {
    // Update bookings list
    setBookings(prev => prev.map(b => 
      b.id === updatedBooking.id ? updatedBooking : b
    ));
  };

  const handleCancelSuccess = () => {
    // Update booking status
    setBookings(prev => prev.map(b => 
      b.id === selectedBooking.id ? { ...b, status: 'cancelled' } : b
    ));
  };

  const handleRepeatBooking = (booking: any) => {
    console.log('Repeating booking:', booking);
    // Navigate to salon booking page with pre-filled data
    navigate(`/salon/${booking.salonId}/book`, { 
      state: { 
        prefilled: booking 
      } 
    });
  };

  const handleVoiceBooking = (booking: any) => {
    console.log('Voice booking created:', booking);
    // Handle voice booking - could navigate to booking confirmation
    navigate('/');
  };

  const getSalonForBooking = (booking: any) => {
    return mockSalons.find(s => s.name === booking.salonName) || mockSalons[0];
  };

  // Get user info from auth context or use mock data
  const getUserName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Anna Smith';
  };

  const getUserEmail = () => {
    return user?.email || 'anna.smith@example.com';
  };

  const getUserAvatar = () => {
    return user?.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop';
  };

  const userProfile = {
    name: getUserName(),
    email: getUserEmail(),
    phone: '+1 (555) 123-4567',
    avatar: getUserAvatar(),
    memberSince: 'January 2024',
    totalVisits: 15,
    loyaltyPoints: 180,
    nextRewardAt: 250,
    membershipTier: 'Gold',
    totalSpent: 1250,
  };

  const stats = [
    {
      icon: Calendar,
      label: 'Total Visits',
      value: userProfile.totalVisits.toString(),
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      trend: '+3 this month',
    },
    {
      icon: Sparkles,
      label: 'Loyalty Points',
      value: userProfile.loyaltyPoints.toString(),
      bgColor: 'bg-pink-100',
      iconColor: 'text-pink-600',
      trend: '70 to next reward',
    },
    {
      icon: Gift,
      label: 'Active Rewards',
      value: '3',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      trend: 'Expiring soon: 1',
    },
    {
      icon: Heart,
      label: 'Favorite Salons',
      value: favoriteSalons.length.toString(),
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
      trend: 'View all',
    },
  ];

  const activeRewards = [
    {
      id: '1',
      title: '20% Off Next Visit',
      description: 'Valid for any service over $50',
      expiresAt: 'Dec 31, 2024',
      code: 'SAVE20',
      type: 'discount',
    },
    {
      id: '2',
      title: 'Free Manicure',
      description: 'Complimentary service at Luxe Beauty',
      expiresAt: 'Jan 15, 2025',
      code: 'FREEMANI',
      type: 'free',
    },
    {
      id: '3',
      title: '$15 Credit',
      description: 'Referral bonus - use anywhere',
      expiresAt: 'No expiry',
      code: 'REF15',
      type: 'credit',
    },
  ];

  const paymentMethods = [
    {
      id: '1',
      type: 'Visa',
      last4: '4242',
      expiry: '12/25',
      isDefault: true,
    },
    {
      id: '2',
      type: 'Mastercard',
      last4: '8888',
      expiry: '09/26',
      isDefault: false,
    },
  ];

  const transactions = [
    {
      id: '1',
      date: 'Dec 15, 2024',
      salon: 'Luxe Beauty Bar',
      service: 'Hair Color & Style',
      amount: 120,
      status: 'completed',
    },
    {
      id: '2',
      date: 'Dec 10, 2024',
      salon: 'Glow Spa',
      service: 'Manicure & Pedicure',
      amount: 65,
      status: 'completed',
    },
    {
      id: '3',
      date: 'Dec 5, 2024',
      salon: 'Elite Salon',
      service: 'Haircut',
      amount: 45,
      status: 'refunded',
    },
  ];

  const myReviews = [
    {
      id: '1',
      salon: 'Luxe Beauty Bar',
      salonImage: mockSalons[0].image,
      rating: 5,
      date: 'Dec 15, 2024',
      comment: 'Amazing service! The staff was professional and friendly. Will definitely come back!',
      helpful: 12,
    },
    {
      id: '2',
      salon: 'Glow Spa',
      salonImage: mockSalons[1].image,
      rating: 4,
      date: 'Dec 10, 2024',
      comment: 'Great experience overall. Clean facility and skilled technicians.',
      helpful: 8,
    },
  ];

  const pendingReviews = pastBookings.slice(0, 2);

  const beautyPreferences = {
    favoriteServices: ['Hair Coloring', 'Manicure', 'Facial Treatment'],
    preferredTime: 'Afternoon (2 PM - 5 PM)',
    priceRange: '$50 - $150',
    notifications: {
      email: true,
      sms: true,
      promotions: true,
      reminders: true,
    },
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText('ANNA2024');
    setReferralCopied(true);
    setTimeout(() => setReferralCopied(false), 2000);
  };

  return (
    <div key={currency.code} className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600 text-white">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 md:w-20 md:h-20 ring-4 ring-white/30">
                <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                <AvatarFallback className="text-2xl">{userProfile.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold mb-1">
                  Welcome back, {userProfile.name.split(' ')[0]}! 👋
                </h1>
                <p className="text-purple-100 flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  {userProfile.membershipTier} Member • {userProfile.memberSince}
                </p>
                <p className="text-white/90 text-sm mt-1">
                  You have <span className="font-bold">{upcomingBookings.length}</span> upcoming appointments
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <Search className="w-4 h-4 mr-2" />
                Find Salon
              </Button>
              <Button
                onClick={() => navigate('/')}
                className="bg-white text-purple-600 hover:bg-white/90"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 -mt-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="p-4 md:p-6 hover:shadow-lg transition-all duration-300 bg-white border-2 border-gray-100"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 md:w-12 md:h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.iconColor}`} />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.trend}</p>
              </Card>
            );
          })}
        </div>

        {/* Main Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border border-gray-200 flex-wrap h-auto p-1">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Appointments</span>
            </TabsTrigger>
            <TabsTrigger value="favorites" className="gap-2">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Favorites</span>
            </TabsTrigger>
            <TabsTrigger value="rewards" className="gap-2">
              <Gift className="w-4 h-4" />
              <span className="hidden sm:inline">Rewards</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Payments</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="gap-2">
              <Star className="w-4 h-4" />
              <span className="hidden sm:inline">Reviews</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            {/* Upcoming Appointments Preview */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">📅 Upcoming Appointments</h2>
                {upcomingBookings.length > 0 && (
                  <Button
                    variant="ghost"
                    onClick={() => setActiveTab('appointments')}
                    className="text-purple-600 hover:text-purple-700"
                  >
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>

              {upcomingBookings.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {upcomingBookings.slice(0, 2).map((booking) => (
                    <Card key={booking.id} className="p-6 hover:shadow-lg transition-all border-2 border-gray-100">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-lg mb-1">{booking.salonName}</h3>
                          <p className="text-gray-600">{booking.service}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-700 border-0">
                          Confirmed
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-purple-600" />
                          <span className="font-medium text-gray-900">{booking.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-purple-600" />
                          <span>{booking.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-purple-600" />
                          <span>{booking.staff}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t">
                        <span className="text-2xl font-bold text-purple-600">
                          {formatPrice(booking.price)}
                        </span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Details
                          </Button>
                          <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
                            Manage
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg text-gray-600 mb-2">No upcoming appointments</p>
                  <p className="text-sm text-gray-500 mb-4">Book your next beauty session</p>
                  <Button
                    onClick={() => navigate('/')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Browse Salons
                  </Button>
                </Card>
              )}
            </section>

            {/* Repeat Last Visit - AI Powered */}
            {pastBookings.length > 0 && (
              <section>
                <RepeatBookingButton
                  lastBooking={{
                    id: pastBookings[0].id,
                    date: pastBookings[0].date,
                    services: [{
                      id: '1',
                      name: pastBookings[0].service,
                      price: pastBookings[0].price,
                      duration: 60,
                    }],
                    master: {
                      id: '1',
                      name: pastBookings[0].staff,
                      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop',
                    },
                    salon: {
                      id: pastBookings[0].salonId || '1',
                      name: pastBookings[0].salonName,
                    },
                    totalPrice: pastBookings[0].price,
                    totalDuration: 60,
                    masterNotes: 'Client prefers natural look. Allergic to certain chemicals.',
                  }}
                  onRepeatBooking={handleRepeatBooking}
                  variant="large"
                />
              </section>
            )}

            {/* Favorite Salons Preview */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">❤️ Favorite Salons</h2>
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab('favorites')}
                  className="text-purple-600 hover:text-purple-700"
                >
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {favoriteSalons.slice(0, 3).map((salon) => (
                  <SalonCard key={salon.id} salon={salon} />
                ))}
              </div>
            </section>

            {/* Active Rewards Preview */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">🎁 Active Rewards</h2>
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab('rewards')}
                  className="text-purple-600 hover:text-purple-700"
                >
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {activeRewards.map((reward) => (
                  <Card
                    key={reward.id}
                    className="p-6 border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                        <Gift className="w-6 h-6 text-white" />
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          reward.type === 'discount'
                            ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                            : reward.type === 'free'
                            ? 'bg-green-100 text-green-700 border-green-300'
                            : 'bg-blue-100 text-blue-700 border-blue-300'
                        }
                      >
                        {reward.type === 'discount' ? 'Discount' : reward.type === 'free' ? 'Free Service' : 'Credit'}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{reward.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>Expires: {reward.expiresAt}</span>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border-2 border-dashed border-purple-300">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-purple-600">{reward.code}</span>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Special Offers */}
            <section className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">🔥 Special Offers Just For You!</h2>
                  <p className="text-purple-100 mb-4">
                    Exclusive deals from your favorite salons. Limited time only!
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-white/20 border-white/30 text-white">
                      Up to 30% OFF
                    </Badge>
                    <Badge className="bg-white/20 border-white/30 text-white">
                      New Services
                    </Badge>
                    <Badge className="bg-white/20 border-white/30 text-white">
                      Premium Locations
                    </Badge>
                  </div>
                </div>
                <Button
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-white/90"
                  onClick={() => navigate('/feed')}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  View Offers
                </Button>
              </div>
            </section>
          </TabsContent>

          {/* APPOINTMENTS TAB */}
          <TabsContent value="appointments" className="space-y-6">
            <Tabs defaultValue="upcoming" className="space-y-4">
              <TabsList className="bg-white border border-gray-200">
                <TabsTrigger value="upcoming">
                  Upcoming ({upcomingBookings.length})
                </TabsTrigger>
                <TabsTrigger value="past">
                  Past ({pastBookings.length})
                </TabsTrigger>
                <TabsTrigger value="cancelled">
                  Cancelled ({cancelledBookings.length})
                </TabsTrigger>
              </TabsList>

              {/* Upcoming */}
              <TabsContent value="upcoming" className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <Card key={booking.id} className="p-6 hover:shadow-lg transition-all">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-bold">{booking.salonName}</h3>
                          <Badge className="bg-green-100 text-green-700 border-0">
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-gray-600">
                          <p className="font-medium text-gray-900 text-lg">{booking.service}</p>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <span className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-purple-600" />
                              <span className="font-medium">{booking.date}</span>
                            </span>
                            <span className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-purple-600" />
                              {booking.time}
                            </span>
                            <span className="flex items-center gap-2">
                              <User className="w-4 h-4 text-purple-600" />
                              {booking.staff}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-4">
                        <p className="text-2xl font-bold text-purple-600">
                          {formatPrice(booking.price)}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm">
                            <MapPin className="w-4 h-4 mr-1" />
                            Directions
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleOpenReschedule(booking)}>
                            Reschedule
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:border-red-600" onClick={() => handleOpenCancel(booking)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              {/* Past */}
              <TabsContent value="past" className="space-y-4">
                {pastBookings.map((booking) => (
                  <Card key={booking.id} className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-bold">{booking.salonName}</h3>
                          <Badge variant="secondary">{booking.status}</Badge>
                        </div>
                        <div className="space-y-2 text-gray-600">
                          <p className="font-medium text-gray-900">{booking.service}</p>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <span className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {booking.date}
                            </span>
                            <span className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {booking.time}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-4">
                        <p className="text-xl font-bold text-gray-600">
                          {formatPrice(booking.price)}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
                            <Star className="w-4 h-4 mr-1" />
                            Write Review
                          </Button>
                          <Button variant="outline" size="sm">
                            Book Again
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              {/* Cancelled */}
              <TabsContent value="cancelled" className="space-y-4">
                {cancelledBookings.length > 0 ? (
                  cancelledBookings.map((booking) => (
                    <Card key={booking.id} className="p-6 opacity-60">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg">{booking.salonName}</h3>
                            <Badge variant="outline" className="border-red-300 text-red-600">
                              Cancelled
                            </Badge>
                          </div>
                          <p className="text-gray-600">{booking.service}</p>
                          <p className="text-sm text-gray-500 mt-1">{booking.date} • {booking.time}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Book Again
                        </Button>
                      </div>
                    </Card>
                  ))
                ) : (
                  <Card className="p-12 text-center text-gray-500">
                    <X className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">No cancelled appointments</p>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* FAVORITES TAB */}
          <TabsContent value="favorites" className="space-y-8">
            {/* Favorite Salons Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Heart className="w-6 h-6 text-pink-600" />
                  Your Favorite Salons
                </h2>
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Find More
                </Button>
              </div>

              {favoriteSalons.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteSalons.map((salon) => (
                    <SalonCard key={salon.id} salon={salon} />
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg text-gray-600 mb-2">No favorite salons yet</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Save salons you love for easy access
                  </p>
                  <Button
                    onClick={() => navigate('/')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    Browse Salons
                  </Button>
                </Card>
              )}
            </div>

            {/* Favorite Services Section - NEW */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Scissors className="w-6 h-6 text-purple-600" />
                  Your Favorite Services
                </h2>
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Browse Services
                </Button>
              </div>

              {favoriteServices.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favoriteServices.map((service) => (
                    <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-all">
                      <div className="relative h-32">
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => {
                            setFavoriteServices(favoriteServices.filter(s => s.id !== service.id));
                          }}
                          className="absolute top-2 right-2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all"
                        >
                          <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 mb-1">{service.name}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                          <MapPin className="w-3 h-3" />
                          {service.salonName}
                        </p>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm text-gray-500">From</span>
                            <p className="font-bold text-purple-600">{formatPrice(service.price)}</p>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Clock className="w-3 h-3" />
                            {service.duration} min
                          </div>
                        </div>
                        <Link to={`/salon/${service.salonId}`}>
                          <Button className="w-full mt-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                            Book Now
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <Scissors className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg text-gray-600 mb-2">No favorite services yet</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Save your favorite services for quick booking
                  </p>
                  <Button
                    onClick={() => navigate('/')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    Browse Services
                  </Button>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* REWARDS TAB */}
          <TabsContent value="rewards" className="space-y-6">
            {/* Loyalty Progress */}
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Loyalty Progress</h3>
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                  {userProfile.membershipTier}
                </Badge>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Current Points</span>
                  <span className="font-bold text-lg text-purple-600">
                    {userProfile.loyaltyPoints} / {userProfile.nextRewardAt}
                  </span>
                </div>
                <Progress
                  value={(userProfile.loyaltyPoints / userProfile.nextRewardAt) * 100}
                  className="h-3"
                />
                <p className="text-sm text-gray-600">
                  Earn <span className="font-bold text-purple-600">70 more points</span> to unlock your next reward! 🎁
                </p>
              </div>
            </Card>

            {/* Active Rewards */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Active Rewards</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeRewards.map((reward) => (
                  <Card
                    key={reward.id}
                    className="p-6 border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                        <Gift className="w-6 h-6 text-white" />
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          reward.type === 'discount'
                            ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                            : reward.type === 'free'
                            ? 'bg-green-100 text-green-700 border-green-300'
                            : 'bg-blue-100 text-blue-700 border-blue-300'
                        }
                      >
                        {reward.type === 'discount' ? 'Discount' : reward.type === 'free' ? 'Free Service' : 'Credit'}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{reward.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>Expires: {reward.expiresAt}</span>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border-2 border-dashed border-purple-300">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-purple-600">{reward.code}</span>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Referral Program */}
            <Card className="p-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="w-10 h-10" />
                    <h2 className="text-3xl font-bold">Refer Friends, Earn Rewards!</h2>
                  </div>
                  <p className="text-purple-100 mb-4">
                    Share your referral code and get <span className="font-bold text-white">$15 credit</span> for each friend who signs up!
                  </p>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border-2 border-white/30">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-purple-100 mb-1">Your Referral Code</p>
                        <p className="text-2xl font-mono font-bold">ANNA2024</p>
                      </div>
                      <Button
                        onClick={copyReferralCode}
                        className="bg-white text-purple-600 hover:bg-white/90"
                      >
                        {referralCopied ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Code
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Membership Tiers */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Membership Tiers</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {['Silver', 'Gold', 'Platinum'].map((tier, index) => (
                  <Card
                    key={tier}
                    className={`p-6 ${
                      tier === userProfile.membershipTier
                        ? 'border-2 border-purple-600 bg-purple-50'
                        : 'border-2 border-gray-200'
                    }`}
                  >
                    <div className="text-center">
                      <div
                        className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${
                          index === 0
                            ? 'bg-gray-200'
                            : index === 1
                            ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                            : 'bg-gradient-to-r from-purple-600 to-pink-600'
                        }`}
                      >
                        <Crown className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-bold text-xl mb-2">{tier}</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {index === 0 ? '0-99 points' : index === 1 ? '100-249 points' : '250+ points'}
                      </p>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>• {index === 0 ? '5%' : index === 1 ? '10%' : '15%'} discount</p>
                        <p>• {index === 0 ? 'Basic' : index === 1 ? 'Priority' : 'VIP'} booking</p>
                        <p>• {index === 0 ? 'Monthly' : index === 1 ? 'Weekly' : 'Daily'} offers</p>
                      </div>
                      {tier === userProfile.membershipTier && (
                        <Badge className="mt-4 bg-purple-600 text-white">
                          Current Tier
                        </Badge>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </TabsContent>

          {/* PAYMENTS TAB */}
          <TabsContent value="payments" className="space-y-6">
            {/* Payment Methods */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Payment Methods</h2>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Add Card
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <Card key={method.id} className="p-6 border-2 border-gray-200 hover:border-purple-300 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <CreditCard className="w-6 h-6 text-gray-600" />
                          <span className="font-bold text-lg">{method.type}</span>
                        </div>
                        <p className="text-2xl font-mono">•••• {method.last4}</p>
                        <p className="text-sm text-gray-600 mt-1">Expires {method.expiry}</p>
                      </div>
                      {method.isDefault && (
                        <Badge className="bg-purple-100 text-purple-700 border-0">
                          Default
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {!method.isDefault && (
                        <Button variant="outline" size="sm">
                          Set as Default
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        Remove
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Transaction History */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Transaction History</h2>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>

              <Card>
                <div className="divide-y">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Receipt className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="font-bold">{transaction.salon}</h3>
                              <p className="text-sm text-gray-600">{transaction.service}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">{transaction.date}</p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-xl font-bold mb-2 ${
                              transaction.status === 'refunded' ? 'text-gray-500' : 'text-gray-900'
                            }`}
                          >
                            {transaction.status === 'refunded' ? '-' : ''}
                            {formatPrice(transaction.amount)}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                              className={
                                transaction.status === 'completed'
                                  ? 'bg-green-100 text-green-700 border-0'
                                  : 'bg-gray-100 text-gray-700 border-0'
                              }
                            >
                              {transaction.status}
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </section>

            {/* Spending Summary */}
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100">
              <h3 className="text-xl font-bold mb-4">Spending Summary</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {formatPrice(userProfile.totalSpent)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">This Month</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatPrice(230)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Savings</p>
                  <p className="text-3xl font-bold text-green-600">
                    {formatPrice(150)}
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* REVIEWS TAB */}
          <TabsContent value="reviews" className="space-y-6">
            {/* Pending Reviews */}
            {pendingReviews.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">✍️ Pending Reviews</h2>
                <div className="space-y-4">
                  {pendingReviews.map((booking) => (
                    <Card key={booking.id} className="p-6 border-2 border-yellow-200 bg-yellow-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-lg mb-1">{booking.salonName}</h3>
                          <p className="text-gray-600">{booking.service}</p>
                          <p className="text-sm text-gray-500 mt-1">{booking.date}</p>
                        </div>
                        <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                          <Star className="w-4 h-4 mr-2" />
                          Write Review
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* My Reviews */}
            <section>
              <h2 className="text-2xl font-bold mb-4">My Reviews</h2>
              <div className="space-y-4">
                {myReviews.map((review) => (
                  <Card key={review.id} className="p-6">
                    <div className="flex gap-4">
                      <img
                        src={review.salonImage}
                        alt={review.salon}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-lg">{review.salon}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">{review.date}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </div>
                        <p className="text-gray-700 mb-3">{review.comment}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            {review.helpful} found helpful
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </TabsContent>

          {/* SETTINGS TAB */}
          <TabsContent value="settings" className="space-y-6">
            {/* Profile Information */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                    <AvatarFallback className="text-2xl">{userProfile.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xl font-bold mb-1">{userProfile.name}</p>
                    <p className="text-gray-600 mb-2">{userProfile.email}</p>
                    <Button variant="outline" size="sm">
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Change Photo
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      defaultValue="Anna"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      defaultValue="Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      defaultValue={userProfile.email}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      defaultValue={userProfile.phone}
                    />
                  </div>
                </div>

                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Save Changes
                </Button>
              </div>
            </Card>

            {/* Beauty Preferences */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Beauty Preferences</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Favorite Services</label>
                  <div className="flex flex-wrap gap-2">
                    {beautyPreferences.favoriteServices.map((service) => (
                      <Badge
                        key={service}
                        className="bg-purple-100 text-purple-700 border-purple-300 px-4 py-2"
                      >
                        {service}
                        <X className="w-3 h-3 ml-2 cursor-pointer" />
                      </Badge>
                    ))}
                    <Button variant="outline" size="sm">
                      + Add Service
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Preferred Time</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                      <option>Morning (9 AM - 12 PM)</option>
                      <option selected>Afternoon (2 PM - 5 PM)</option>
                      <option>Evening (5 PM - 8 PM)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Price Range</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                      <option>$0 - $50</option>
                      <option selected>$50 - $150</option>
                      <option>$150 - $300</option>
                      <option>$300+</option>
                    </select>
                  </div>
                </div>
              </div>
            </Card>

            {/* Notification Settings */}
            <ClientNotificationSettings />

            {/* Privacy & Security */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Privacy & Security</h2>
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Change Password
                  </span>
                  <ChevronRight className="w-5 h-5" />
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Two-Factor Authentication
                  </span>
                  <Badge className="bg-green-100 text-green-700 border-0">Enabled</Badge>
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Download My Data
                  </span>
                  <ChevronRight className="w-5 h-5" />
                </Button>
                <Button variant="outline" className="w-full justify-between text-red-600 hover:text-red-700 hover:border-red-600">
                  <span className="flex items-center gap-2">
                    <X className="w-5 h-5" />
                    Delete Account
                  </span>
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </Card>

            {/* Logout */}
            <Card className="p-6 border-2 border-red-200 bg-red-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg mb-1">Sign Out</h3>
                  <p className="text-sm text-gray-600">You can always sign back in anytime</p>
                </div>
                <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Reschedule Booking Modal */}
      <RescheduleBookingModal
        isOpen={rescheduleModalOpen}
        onClose={() => setRescheduleModalOpen(false)}
        booking={selectedBooking}
        onSuccess={handleRescheduleSuccess}
      />

      {/* Cancel Booking Modal */}
      <CancelBookingModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        booking={selectedBooking}
        onSuccess={handleCancelSuccess}
      />

      {/* Voice Booking - Floating Button */}
      <VoiceBookingButton
        variant="floating"
        onBookingCreated={handleVoiceBooking}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}