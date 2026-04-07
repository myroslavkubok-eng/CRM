import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { mockSalons } from '../data/mockData';
import { Star, MapPin, Clock, Phone, Mail, X, Images, Check, Car, Baby, CreditCard, Users, ChevronLeft, ChevronRight, MessageCircle, Calendar, Bot, Navigation, ArrowLeft, Heart, Share2, Gift } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useServices } from '../../contexts/ServicesContext';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import Slider from 'react-slick';
import { Calendar as CalendarComponent } from '../components/ui/calendar';
import { AuthModal } from '../components/AuthModal';
import { AIBookingChat } from '../components/AIBookingChat';
import { SalonMapModal } from '../components/SalonMapModal';
import { SalonCard } from '../components/SalonCard';
import { ShareSalonModal } from '../components/ShareSalonModal';
import { BuyGiftCardModal } from '../components/BuyGiftCardModal';
import { toast } from 'sonner';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../components/ui/carousel';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

interface BookedService {
  id: string;
  service: {
    id: string;
    name: string;
    duration: number;
    price: number;
    category: string;
  };
  staffId: string | null;
  date: Date | undefined;
  time: string | null;
}

export function SalonProfilePage() {
  const { salonId } = useParams<{ salonId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { formatPrice, currency } = useCurrency();
  const salon = mockSalons.find(s => s.id === salonId);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [bookedServices, setBookedServices] = useState<BookedService[]>([]);
  const [preSelectedService, setPreSelectedService] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showGiftCardModal, setShowGiftCardModal] = useState(false);
  
  // Gift Card Settings - Mock (в реальном приложении загружается с backend)
  const giftCardSettings = {
    enabled: true, // Owner включил функцию
    presetAmounts: [100, 200, 300, 500, 1000],
    allowCustomAmounts: true,
    minAmount: 50,
    maxAmount: 5000
  };
  
  // Toggle favorite
  const toggleFavorite = async () => {
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      toast.success(`❤️ ${salon.name} added to favorites!`);
    } else {
      toast.success(`${salon.name} removed from favorites`);
    }
  };
  
  // Share functions
  const shareToSocial = (platform: string) => {
    const url = window.location.href;
    const text = `Check out ${salon.name} on Katia! ${salon.rating}⭐ rated salon in ${salon.location}`;
    
    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      instagram: url, // Instagram doesn't support direct sharing via URL, copy link instead
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    };
    
    if (platform === 'instagram' || platform === 'copy') {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } else {
      window.open(urls[platform], '_blank', 'width=600,height=400');
      toast.success(`Sharing to ${platform}!`);
    }
    setShowShareMenu(false);
  };

  // Auto-open booking modal from Public Feed
  useEffect(() => {
    const state = location.state as any;
    if (state?.openBooking) {
      setShowBookingModal(true);
      // Store pre-selected service if provided
      if (state?.selectedService) {
        setPreSelectedService(state.selectedService);
      }
      // Clear the state to prevent re-opening on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Scroll to top when component mounts or salonId changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [salonId]);

  if (!salon) {
    return <div className="container mx-auto px-4 py-8">Salon not found</div>;
  }

  const servicesByCategory = salon.services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, typeof salon.services>);

  // Get salon categories from services
  const salonCategories = [...new Set(salon.services.map(s => s.category))];

  // Find nearby salons with similar services in the same city
  const nearbySalons = mockSalons
    .filter(s => {
      // Exclude current salon
      if (s.id === salon.id) return false;
      
      // Same city
      if (s.city !== salon.city) return false;
      
      // Has at least one matching category
      const otherSalonCategories = [...new Set(s.services.map(service => service.category))];
      const hasMatchingCategory = salonCategories.some(cat => otherSalonCategories.includes(cat));
      
      return hasMatchingCategory;
    })
    .slice(0, 6); // Show max 6 nearby salons

  const openingHours = [
    { day: 'Monday', hours: '9:00 AM - 10:00 PM', isOpen: true },
    { day: 'Tuesday', hours: '9:00 AM - 10:00 PM', isOpen: true },
    { day: 'Wednesday', hours: '9:00 AM - 10:00 PM', isOpen: true },
    { day: 'Thursday', hours: '9:00 AM - 10:00 PM', isOpen: true },
    { day: 'Friday', hours: '9:00 AM - 10:00 PM', isOpen: true },
    { day: 'Saturday', hours: '9:00 AM - 10:00 PM', isOpen: true },
    { day: 'Sunday', hours: '9:00 AM - 10:00 PM', isOpen: true },
  ];

  const additionalInfo = [
    { icon: Check, label: 'Instant Confirmation' },
    { icon: CreditCard, label: 'Pay by app' },
    { icon: Baby, label: 'Kid-friendly' },
    { icon: Car, label: 'Parking available' },
    { icon: Users, label: 'Woman-owned' },
  ];

  return (
    <div key={currency.code} className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 md:px-6 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        {/* Photo Gallery - Google Maps Style - Compact Size */}
        {salon.gallery && salon.gallery.length > 0 ? (
          <div className="relative w-full mb-6">
            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-1 md:gap-2 h-[250px] md:h-[350px] rounded-lg overflow-hidden">
              {/* Main large image - takes 3/4 on desktop */}
              <div className="md:col-span-3 relative group overflow-hidden cursor-pointer h-full" onClick={() => setShowAllPhotos(true)}>
                <img
                  src={salon.gallery[0]}
                  alt={`${salon.name} - Main`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
              </div>

              {/* Smaller images on the right - 1/4 on desktop */}
              <div className="hidden md:grid md:grid-rows-2 gap-2 h-full">
                {salon.gallery.slice(1, 3).map((image, index) => (
                  <div key={index} className="relative group overflow-hidden cursor-pointer h-full" onClick={() => setShowAllPhotos(true)}>
                    <img
                      src={image}
                      alt={`${salon.name} - ${index + 2}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                    {index === 1 && salon.gallery.length > 3 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                        <div className="text-white text-center">
                          <Images className="w-6 h-6 mx-auto mb-1" />
                          <span className="font-semibold text-sm">+{salon.gallery.length - 3} photos</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* "See all photos" button overlay */}
            <Button
              onClick={() => setShowAllPhotos(true)}
              variant="outline"
              size="sm"
              className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm border-gray-300 text-gray-900 hover:bg-white shadow-lg text-xs"
            >
              <Images className="w-3 h-3 mr-1" />
              See all photos
            </Button>
          </div>
        ) : (
          /* Fallback if no gallery */
          <div className="relative w-full h-[250px] md:h-[350px] overflow-hidden rounded-lg mb-6">
            <img
              src={salon.image}
              alt={salon.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Salon Info Section */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{salon.name}</h1>
                {salon.isFeatured && (
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                    Featured
                  </Badge>
                )}
                {salon.isNew && (
                  <Badge className="bg-green-500 text-white border-0">
                    New
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-900">{salon.rating}</span>
                  <span>({salon.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-5 h-5" />
                  <span>{salon.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-5 h-5" />
                  <span>{salon.openHours}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Favorite Button */}
              <Button
                onClick={toggleFavorite}
                className={`flex items-center gap-2 px-4 py-2 h-auto transition-all ${
                  isFavorite 
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg' 
                    : 'bg-white border-2 border-gray-300 hover:border-pink-400 hover:bg-pink-50 text-gray-700'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
                <span className="font-medium text-sm hidden md:inline">
                  {isFavorite ? 'Saved' : 'Save'}
                </span>
              </Button>
              
              {/* Share Button */}
              <Button
                onClick={() => setShowShareMenu(true)}
                className="flex items-center gap-2 px-4 py-2 h-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg transition-all"
              >
                <Share2 className="w-5 h-5" />
                <span className="font-medium text-sm hidden md:inline">Share</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Modal - Full Gallery View */}
      {showAllPhotos && salon.gallery && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl max-h-screen overflow-auto">
            {/* Close Button */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm">
              <h2 className="text-white text-2xl font-bold">{salon.name} - Gallery</h2>
              <Button
                onClick={() => setShowAllPhotos(false)}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {salon.gallery.map((image, index) => (
                <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                  <img
                    src={image}
                    alt={`${salon.name} - Photo ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Mobile AI Agent - Compact Top Bar */}
        <div className="lg:hidden mb-4">
          <Card className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-gray-900">AI Booking Assistant</h3>
                <p className="text-xs text-gray-600">Available 24/7 • Instant help</p>
              </div>
              <Button
                onClick={() => setShowAIChat(true)}
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-1"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden xs:inline">Chat</span>
              </Button>
            </div>
          </Card>
        </div>

        {/* Two Column Layout: Services (Left) + Sticky Sidebar (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Services & Tabs */}
          <div className="lg:col-span-8">
            <Tabs defaultValue="services" className="space-y-6">
              <TabsList className="bg-white border border-gray-200">
                <TabsTrigger value="services">Services</TabsTrigger>
                {/* Показываем вкладку только если Owner включил функцию */}
                {giftCardSettings.enabled && (
                  <TabsTrigger value="giftcards">
                    <Gift className="w-4 h-4 mr-1" />
                    Gift Cards
                  </TabsTrigger>
                )}
                <TabsTrigger value="staff">Staff</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
              </TabsList>

              {/* Services Tab */}
              <TabsContent value="services" className="space-y-4">
                {Object.entries(servicesByCategory).map(([category, services]) => (
                  <Card key={category} className="p-4">
                    <h3 className="text-lg font-bold capitalize mb-3">{category}</h3>
                    <div className="space-y-3">
                      {services.map(service => (
                        <div
                          key={service.id}
                          className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <div className="flex-1">
                            <h4 className="font-semibold">{service.name}</h4>
                            <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {service.duration} min
                              </span>
                              <span className="font-bold text-purple-600">
                                {formatPrice(service.price)}
                              </span>
                            </div>
                          </div>
                          <Button
                            onClick={() => navigate(`/booking/${salon.id}/${service.id}`)}
                            size="sm"
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          >
                            Book
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </TabsContent>

              {/* Gift Cards Tab */}
              <TabsContent value="giftcards" className="space-y-4">
                {/* Hero Banner with Image */}
                <Card className="overflow-hidden">
                  <div className="grid md:grid-cols-2 gap-0">
                    {/* Left: Beautiful Image */}
                    <div className="relative h-64 md:h-auto">
                      <img
                        src="https://images.unsplash.com/photo-1759563871370-692ab3de97ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBnaWZ0JTIwY2FyZCUyMHByZXNlbnR8ZW58MXx8fHwxNzY2NjU1MTM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                        alt="Gift Card"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20" />
                    </div>
                    
                    {/* Right: Content */}
                    <div className="p-6 md:p-8 flex flex-col justify-center bg-gradient-to-br from-purple-50 to-pink-50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                          <Gift className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">Gift Cards</h3>
                          <p className="text-sm text-purple-600">Perfect for any occasion</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-6">
                        Give the gift of relaxation and beauty with a gift card from {salon.name}. Perfect for birthdays, anniversaries, holidays, or just to show someone you care.
                      </p>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span>Valid for all services at {salon.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span>Can be used in multiple visits</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span>Delivered instantly via email</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span>Never expires</span>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => setShowGiftCardModal(true)}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                        size="lg"
                      >
                        <Gift className="w-5 h-5 mr-2" />
                        Buy Gift Card Now
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Available Amounts */}
                <Card className="p-6">
                  <h3 className="font-bold text-lg mb-4">Choose an Amount</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {giftCardSettings.presetAmounts.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setShowGiftCardModal(true)}
                        className="group relative p-6 rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:shadow-lg transition-all duration-200 bg-white hover:bg-purple-50"
                      >
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                            {formatPrice(amount)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 group-hover:text-purple-600 transition-colors">
                            Gift Card
                          </div>
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  {giftCardSettings.allowCustomAmounts && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-center gap-2 text-sm text-blue-900">
                        <CreditCard className="w-4 h-4" />
                        <span className="font-medium">Want a custom amount?</span>
                      </div>
                      <p className="text-xs text-blue-700 mt-1">
                        Choose any amount from {formatPrice(giftCardSettings.minAmount)} to {formatPrice(giftCardSettings.maxAmount)} during checkout
                      </p>
                    </div>
                  )}
                </Card>

                {/* How It Works */}
                <Card className="p-6">
                  <h3 className="font-bold text-lg mb-4">How It Works</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-3 font-bold">
                        1
                      </div>
                      <h4 className="font-semibold mb-2">Select Amount</h4>
                      <p className="text-sm text-gray-600">
                        Choose a preset amount or enter a custom value
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-3 font-bold">
                        2
                      </div>
                      <h4 className="font-semibold mb-2">Personalize</h4>
                      <p className="text-sm text-gray-600">
                        Add recipient info and a personal message
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-3 font-bold">
                        3
                      </div>
                      <h4 className="font-semibold mb-2">Send Instantly</h4>
                      <p className="text-sm text-gray-600">
                        Gift card delivered via email right away
                      </p>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Staff Tab */}
              <TabsContent value="staff" className="space-y-4">
                {salon.staff.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {salon.staff.map(member => (
                      <Card key={member.id} className="p-4">
                        <div className="flex flex-col items-center text-center">
                          <Avatar className="w-20 h-20 mb-3">
                            <AvatarImage src={member.image} alt={member.name} />
                            <AvatarFallback>{member.name[0]}</AvatarFallback>
                          </Avatar>
                          <h3 className="font-semibold">{member.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{member.role}</p>
                          <div className="flex items-center gap-1 mb-3">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{member.rating}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {member.specialties.map((specialty, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 text-center text-gray-500">
                    No staff information available
                  </Card>
                )}
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-4">
                {salon.reviews.length > 0 ? (
                  salon.reviews.map(review => (
                    <Card key={review.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={review.avatar} alt={review.author} />
                          <AvatarFallback>{review.author[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-sm">{review.author}</h4>
                              <p className="text-xs text-gray-500">{review.date}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold text-sm">{review.rating}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700">{review.comment}</p>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <Card className="p-8 text-center text-gray-500">
                    No reviews yet
                  </Card>
                )}
              </TabsContent>

              {/* About Tab */}
              <TabsContent value="about" className="space-y-4">
                <Card className="p-4">
                  <h3 className="text-lg font-bold mb-2">About</h3>
                  <p className="text-sm text-gray-700">{salon.about}</p>
                </Card>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Opening Hours */}
                  <Card className="p-4">
                    <h3 className="text-lg font-bold mb-3">Opening times</h3>
                    <div className="space-y-2">
                      {openingHours.map((schedule, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            {schedule.isOpen && (
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                            )}
                            <span className={schedule.isOpen ? 'text-gray-900' : 'text-gray-400'}>
                              {schedule.day}
                            </span>
                          </div>
                          <span className="text-gray-600 text-sm">{schedule.hours}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Additional Information */}
                  <Card className="p-4">
                    <h3 className="text-lg font-bold mb-3">Additional information</h3>
                    <div className="space-y-2">
                      {additionalInfo.map((info, index) => {
                        const Icon = info.icon;
                        return (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-600" />
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4 text-gray-600" />
                              <span className="text-gray-900">{info.label}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </div>

                {/* Map */}
                <Card className="p-4">
                  <h3 className="text-lg font-bold mb-3">Location</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <MapPin className="w-4 h-4" />
                      <span>{salon.location}</span>
                    </div>
                    <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                      <div className="text-center text-gray-500">
                        <MapPin className="w-10 h-10 mx-auto mb-2 text-purple-600" />
                        <p className="font-semibold text-sm">Map view</p>
                        <p className="text-xs">{salon.location}</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Contact */}
                <Card className="p-4">
                  <h3 className="text-lg font-bold mb-3">Contact</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-900">+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-900">contact@{salon.name.toLowerCase().replace(/\s+/g, '')}.com</span>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column: Sticky Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              {/* Booking Action Buttons */}
              <Card className="p-4">
                <div className="space-y-3">
                  <Button
                    onClick={() => setShowAIChat(true)}
                    className="w-full gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    size="lg"
                  >
                    <Bot className="w-5 h-5" />
                    Book via AI Agent
                  </Button>
                  <Button
                    onClick={() => {
                      // Navigate to BookingFlowPage with first service pre-selected
                      const firstService = salon.services[0];
                      navigate(`/booking/${salon.id}/${firstService.id}`);
                    }}
                    variant="outline"
                    className="w-full gap-2 border-2"
                    size="lg"
                  >
                    <Calendar className="w-5 h-5" />
                    Book Appointment
                  </Button>
                </div>
              </Card>

              {/* Need Help Booking? */}
              <Card className="p-4 bg-blue-50 border-blue-100">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-900">Need Help Booking?</h3>
                    <p className="text-sm text-blue-700">Available 24/7</p>
                  </div>
                </div>
                <p className="text-sm text-blue-800 mb-3">
                  Our AI assistant can help you find the perfect slot, answer questions about services, or manage your booking instantly.
                </p>
                <Button
                  onClick={() => setShowAIChat(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat with Assistant
                </Button>
              </Card>

              {/* Contact & Location */}
              <Card className="p-4">
                <h3 className="font-bold mb-3">Contact & Location</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-purple-600" />
                    <span className="text-gray-700">{salon.location}</span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full gap-2 text-purple-600 border-purple-600 hover:bg-purple-50"
                    onClick={() => setShowMapModal(true)}
                  >
                    <Navigation className="w-4 h-4" />
                    Get Directions
                  </Button>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700">+1 (555) 123-4567</span>
                  </div>
                </div>
              </Card>

              {/* Opening Hours */}
              <Card className="p-4">
                <h3 className="font-bold mb-3">Opening Hours</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">Monday - Friday</span>
                    <span className="text-green-600 font-medium">09:00 - 20:00</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">Saturday</span>
                    <span className="text-green-600 font-medium">10:00 - 18:00</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">Sunday</span>
                    <span className="text-red-600 font-medium">Closed</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Venues Nearby Section */}
        {nearbySalons.length > 0 && (
          <section className="mt-12 mb-8 bg-gradient-to-b from-white to-purple-50 -mx-4 px-4 py-12">
            <div className="container mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
                    <MapPin className="w-8 h-8 text-purple-500" />
                    Venues Nearby
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Similar salons in {salon.city} offering {salonCategories.slice(0, 2).join(', ')}
                    {salonCategories.length > 2 && ' and more'}
                  </p>
                </div>
              </div>

              {/* Desktop */}
              <div className="hidden md:block">
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {nearbySalons.map(nearbySalon => (
                      <CarouselItem key={nearbySalon.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                        <SalonCard salon={nearbySalon} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden md:flex" />
                  <CarouselNext className="hidden md:flex" />
                </Carousel>
              </div>

              {/* Mobile */}
              <div className="md:hidden">
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-2">
                    {nearbySalons.map(nearbySalon => (
                      <CarouselItem key={nearbySalon.id} className="pl-2 basis-[85%]">
                        <SalonCard salon={nearbySalon} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && <BookingModal salon={salon} onClose={() => setShowBookingModal(false)} preSelectedService={preSelectedService} />}

      {/* AI Chat Modal */}
      {showAIChat && <AIBookingChat salon={salon} onClose={() => setShowAIChat(false)} />}

      {/* Map Modal */}
      {showMapModal && <SalonMapModal salon={salon} onClose={() => setShowMapModal(false)} />}

      {/* Share Modal */}
      <ShareSalonModal
        salonName={salon.name}
        salonLocation={salon.location}
        salonRating={salon.rating}
        isOpen={showShareMenu}
        onClose={() => setShowShareMenu(false)}
      />

      {/* Buy Gift Card Modal */}
      {showGiftCardModal && (
        <BuyGiftCardModal
          salonId={salon.id}
          salonName={salon.name}
          onClose={() => setShowGiftCardModal(false)}
        />
      )}

      <Footer />
    </div>
  );
}

// Custom Arrow Components
function CustomPrevArrow(props: any) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ChevronLeft className="w-5 h-5 text-gray-700" />
    </button>
  );
}

function CustomNextArrow(props: any) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ChevronRight className="w-5 h-5 text-gray-700" />
    </button>
  );
}

// Booking Modal Component
interface BookingModalProps {
  salon: any;
  onClose: () => void;
  preSelectedService?: any;
}

function BookingModal({ salon, onClose, preSelectedService }: BookingModalProps) {
  const { formatPrice } = useCurrency();
  const { services } = useServices();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedStaff, setSelectedStaff] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Handle pre-selected service from feed
  useEffect(() => {
    if (preSelectedService) {
      // Try to find exact match in services by name
      const matchedService = services.find((s: any) => 
        s.name.toLowerCase() === preSelectedService.name.toLowerCase() ||
        s.category.toLowerCase() === preSelectedService.category.toLowerCase()
      );
      
      if (matchedService) {
        setSelectedService(matchedService);
      } else {
        // If no exact match, create a temporary service object
        setSelectedService({
          id: 'temp-' + Date.now(),
          name: preSelectedService.name,
          category: preSelectedService.category,
          price: preSelectedService.price * (1 - (preSelectedService.discount || 0) / 100),
          originalPrice: preSelectedService.price,
          discount: preSelectedService.discount,
          duration: preSelectedService.duration
        });
      }
    }
  }, [preSelectedService, services]);

  // Generate time slots (every 15 minutes from 9:00 AM to 8:00 PM)
  const generateTimeSlots = () => {
    const slots: string[] = [];
    const startHour = 9;
    const endHour = 20;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const hourStr = hour > 12 ? hour - 12 : hour;
        const minuteStr = minute.toString().padStart(2, '0');
        const period = hour >= 12 ? 'PM' : 'AM';
        slots.push(`${hourStr}:${minuteStr} ${period}`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Mock booked slots
  const bookedSlots = ['9:00 AM', '9:15 AM', '10:30 AM', '11:00 AM', '2:00 PM', '3:30 PM'];

  const isComplete = selectedService && selectedStaff && selectedDate && selectedTime;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center gap-4">
            <img
              src={salon.image}
              alt={salon.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold">{salon.name}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{salon.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{salon.openHours}</span>
              </div>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Side - Selection */}
            <div className="lg:col-span-2 space-y-6">
              {/* Select Service */}
              <div>
                <h3 className="text-xl font-bold mb-4">Services</h3>
                <Card className="p-4 border-2 border-purple-100">
                  <Select
                    value={selectedService?.id || ''}
                    onValueChange={(value) => {
                      const service = services.find((s: any) => s.id === value);
                      setSelectedService(service);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service: any) => (
                        <SelectItem key={service.id} value={service.id}>
                          <div className="flex items-center justify-between w-full gap-4">
                            <div className="flex flex-col items-start">
                              <span className="font-medium">{service.name}</span>
                              <span className="text-xs text-gray-500">{service.category}</span>
                            </div>
                            <div className="flex flex-col items-end">
                              {service.discount && service.discount > 0 ? (
                                <>
                                  <span className="text-xs text-gray-400 line-through">
                                    {formatPrice(service.originalPrice || service.price)}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <span className="text-purple-600 font-semibold">
                                      {formatPrice(service.price)}
                                    </span>
                                    <span className="text-xs bg-red-500 text-white px-1 rounded">
                                      -{service.discount}%
                                    </span>
                                  </div>
                                </>
                              ) : (
                                <span className="text-purple-600 font-semibold">
                                  {formatPrice(service.price)}
                                </span>
                              )}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedService && (
                    <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold">{selectedService.name}</span>
                          <p className="text-xs text-gray-600">{selectedService.category}</p>
                        </div>
                        <div className="text-right">
                          {selectedService.discount && selectedService.discount > 0 ? (
                            <>
                              <div className="text-xs text-gray-400 line-through">
                                {formatPrice(selectedService.originalPrice || selectedService.price)}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-purple-600 font-bold">
                                  {formatPrice(selectedService.price)}
                                </span>
                                <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded font-bold">
                                  -{selectedService.discount}%
                                </span>
                              </div>
                            </>
                          ) : (
                            <span className="text-purple-600 font-bold">
                              {formatPrice(selectedService.price)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                        <Clock className="w-3 h-3" />
                        <span>{selectedService.duration} min</span>
                      </div>
                      {selectedService.description && (
                        <p className="text-xs text-gray-600 mt-2 border-t border-purple-100 pt-2">
                          {selectedService.description}
                        </p>
                      )}
                    </div>
                  )}
                </Card>
              </div>

              {/* Select Master */}
              <div>
                <h3 className="text-xl font-bold mb-4">Select Master</h3>
                <div className="space-y-3">
                  {/* Any Available Master */}
                  <Card
                    className={`p-4 cursor-pointer transition-all ${
                      selectedStaff === 'any'
                        ? 'border-2 border-purple-500 bg-purple-50'
                        : 'border-2 border-gray-200 hover:border-purple-300'
                    }`}
                    onClick={() => setSelectedStaff('any')}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">Any Available Master</h4>
                        <p className="text-sm text-gray-600">First available specialist</p>
                      </div>
                      {selectedStaff === 'any' && (
                        <Check className="w-6 h-6 text-purple-600" />
                      )}
                    </div>
                  </Card>

                  {/* Staff Members */}
                  {salon.staff.map((member: any) => (
                    <Card
                      key={member.id}
                      className={`p-4 cursor-pointer transition-all ${
                        selectedStaff === member.id
                          ? 'border-2 border-purple-500 bg-purple-50'
                          : 'border-2 border-gray-200 hover:border-purple-300'
                      }`}
                      onClick={() => setSelectedStaff(member.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={member.image} alt={member.name} />
                          <AvatarFallback>{member.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-semibold">{member.name}</h4>
                          <p className="text-sm text-gray-600">{member.role}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{member.rating}</span>
                          </div>
                        </div>
                        {selectedStaff === member.id && (
                          <Check className="w-6 h-6 text-purple-600" />
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Select Date & Time */}
              <div>
                <h3 className="text-xl font-bold mb-4">Select Date & Time</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Pick a Date */}
                  <div>
                    <h4 className="font-semibold mb-3">Pick a Date</h4>
                    <Card className="p-4 border-2 border-purple-100">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        className="rounded-md"
                      />
                    </Card>
                  </div>

                  {/* Available Times */}
                  <div>
                    <h4 className="font-semibold mb-3">Available Times</h4>
                    <Card className="p-4 border-2 border-purple-100">
                      {selectedDate ? (
                        <div className="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto">
                          {timeSlots.map((slot) => {
                            const isBooked = bookedSlots.includes(slot);
                            return (
                              <Button
                                key={slot}
                                variant={selectedTime === slot ? 'default' : 'outline'}
                                size="sm"
                                disabled={isBooked}
                                onClick={() => setSelectedTime(slot)}
                                className={`${
                                  selectedTime === slot
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                                    : ''
                                } ${isBooked ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                {slot}
                              </Button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          <Clock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                          <p className="font-semibold">Please select a date first</p>
                        </div>
                      )}
                    </Card>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-0">
                <Card className="p-4 border-2 border-purple-100 bg-purple-50">
                  <h3 className="font-bold mb-4">Subtotal</h3>
                  
                  {selectedService ? (
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">Services</span>
                        <span className="font-semibold">1</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Subtotal</span>
                        <span className="font-bold text-lg text-purple-600">
                          {formatPrice(selectedService.price)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 mb-4">No service selected</p>
                  )}

                  <div className="border-t border-purple-200 pt-4">
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-bold text-lg">Total</span>
                      <span className="font-bold text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {selectedService ? formatPrice(selectedService.price) : formatPrice(0)}
                      </span>
                    </div>

                    <Button
                      disabled={!isComplete}
                      onClick={() => setShowAuthModal(true)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6"
                      size="lg"
                    >
                      {isComplete ? 'Complete Booking' : 'Please complete all selections'}
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          onClose();
          // Redirect to confirmation page or dashboard
          navigate('/dashboard');
        }}
      />
    </div>
  );
}