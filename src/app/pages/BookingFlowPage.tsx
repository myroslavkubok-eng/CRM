import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCurrency } from '../../contexts/CurrencyContext';
import { mockSalons } from '../data/mockData';
import type { BookingSettings } from '../components/BookingSettingsTab';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Calendar } from '../components/ui/calendar';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { AuthModal } from '../components/AuthModal';
import { Footer } from '../components/Footer';
import {
  Clock,
  MapPin,
  Star,
  Plus,
  Trash2,
  ChevronLeft,
  Calendar as CalendarIcon,
  User,
  CheckCircle2,
  Gift,
  Repeat,
  Package as PackageIcon,
  Users,
} from 'lucide-react';

interface BookedService {
  id: string;
  service: any;
  staffId: string | null;
  date: Date | undefined;
  time: string | null;
}

export function BookingFlowPage() {
  const { salonId, serviceId } = useParams<{ salonId: string; serviceId: string }>();
  const navigate = useNavigate();
  const { formatPrice, currency } = useCurrency();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [bookingType, setBookingType] = useState<'single' | 'package' | 'recurring' | 'group'>('single');
  const [recurringFrequency, setRecurringFrequency] = useState<'weekly' | 'biweekly' | 'triweekly' | 'monthly'>('weekly');
  const [recurringOccurrences, setRecurringOccurrences] = useState(12);
  const [groupSize, setGroupSize] = useState(2);
  
  // Load booking settings from localStorage
  const [bookingSettings, setBookingSettings] = useState<BookingSettings>({
    groupDiscounts: {
      tier1: { minPeople: 2, maxPeople: 3, discount: 5 },
      tier2: { minPeople: 4, maxPeople: 5, discount: 10 },
      tier3: { minPeople: 6, maxPeople: 99, discount: 15 },
    },
    packageDealsDiscount: 20,
    recurringDiscount: 10,
    enableGroupBooking: true,
    enablePackageDeals: true,
    enableRecurringBooking: true,
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('bookingSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      console.log('🔥 LOADED BOOKING SETTINGS:', parsed);
      setBookingSettings(parsed);
    } else {
      console.log('⚠️ NO BOOKING SETTINGS IN localStorage - using defaults');
    }
  }, []);

  // Calculate group discount based on size
  const getGroupDiscount = (size: number): number => {
    const { tier1, tier2, tier3 } = bookingSettings.groupDiscounts;
    
    console.log(`💰 Calculating discount for ${size} people:`, { tier1, tier2, tier3 });
    
    if (size >= tier3.minPeople) {
      console.log(`✅ Tier 3: ${tier3.discount}%`);
      return tier3.discount;
    }
    if (size >= tier2.minPeople && size <= tier2.maxPeople) {
      console.log(`✅ Tier 2: ${tier2.discount}%`);
      return tier2.discount;
    }
    if (size >= tier1.minPeople && size <= tier1.maxPeople) {
      console.log(`✅ Tier 1: ${tier1.discount}%`);
      return tier1.discount;
    }
    
    console.log('❌ No discount tier matched');
    return 0;
  };

  const salon = mockSalons.find((s) => s.id === salonId);
  const initialService = salon?.services.find((s) => s.id === serviceId);

  const [bookedServices, setBookedServices] = useState<BookedService[]>([
    {
      id: Date.now().toString(),
      service: initialService!,
      staffId: null,
      date: undefined,
      time: null,
    },
  ]);

  const [activeServiceIndex, setActiveServiceIndex] = useState(0);

  if (!salon || !initialService) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-600">Booking not found</p>
      </div>
    );
  }

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

  // Mock booked slots (for demonstration)
  const bookedSlots = [
    '9:00 AM',
    '9:15 AM',
    '10:30 AM',
    '11:00 AM',
    '2:00 PM',
    '3:30 PM',
  ];

  const isSlotAvailable = (time: string, date: Date | undefined) => {
    if (!date) return true;
    // Check if today and time has passed
    const today = new Date();
    if (
      date.toDateString() === today.toDateString() &&
      bookedSlots.includes(time)
    ) {
      return false;
    }
    return true;
  };

  const handleAddService = () => {
    if (salon.services.length > 0) {
      setBookedServices([
        ...bookedServices,
        {
          id: Date.now().toString(),
          service: salon.services[0],
          staffId: null,
          date: undefined,
          time: null,
        },
      ]);
      setActiveServiceIndex(bookedServices.length);
    }
  };

  const handleAddServiceFromDropdown = (serviceId: string) => {
    const service = salon.services.find((s) => s.id === serviceId);
    if (service) {
      setBookedServices([
        ...bookedServices,
        {
          id: Date.now().toString(),
          service: service,
          staffId: null,
          date: undefined,
          time: null,
        },
      ]);
      setActiveServiceIndex(bookedServices.length);
    }
  };

  const handleRemoveService = (index: number) => {
    if (bookedServices.length > 1) {
      const newServices = bookedServices.filter((_, i) => i !== index);
      setBookedServices(newServices);
      setActiveServiceIndex(Math.max(0, index - 1));
    }
  };

  const handleServiceChange = (index: number, field: string, value: any) => {
    const newServices = [...bookedServices];
    newServices[index] = { ...newServices[index], [field]: value };
    setBookedServices(newServices);
  };

  const handleServiceSelect = (index: number, serviceId: string) => {
    const service = salon.services.find((s) => s.id === serviceId);
    if (service) {
      const newServices = [...bookedServices];
      newServices[index].service = service;
      setBookedServices(newServices);
    }
  };

  const calculateTotal = () => {
    return bookedServices.reduce((total, item) => total + item.service.price, 0);
  };

  const isBookingComplete = () => {
    return bookedServices.every(
      (item) => item.staffId && item.date && item.time
    );
  };

  const handleBooking = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      // Complete booking
      navigate('/dashboard');
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setShowAuthModal(false);
    // Complete booking
    navigate('/dashboard');
  };

  const activeService = bookedServices[activeServiceIndex];

  return (
    <div key={currency.code} className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to salon
          </button>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <img
                src={salon.image}
                alt={salon.name}
                className="w-20 h-20 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {salon.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{salon.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>
                      {salon.rating} ({salon.reviewCount} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{salon.openHours}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Type Selector */}
        <div className="mb-6">
          <Card className="p-4">
            <div className="flex flex-col gap-3">
              <span className="text-sm font-semibold text-gray-700">Booking Type:</span>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setBookingType('single')}
                  className={`flex-1 min-w-[140px] px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    bookingType === 'single'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  Single Visit
                </button>
                <button
                  onClick={() => setBookingType('package')}
                  className={`flex-1 min-w-[140px] px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    bookingType === 'package'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Gift className="w-4 h-4" />
                  <span className="whitespace-nowrap">Package Deal</span>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded">Save 20%</span>
                </button>
                <button
                  onClick={() => setBookingType('recurring')}
                  className={`flex-1 min-w-[140px] px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    bookingType === 'recurring'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Repeat className="w-4 h-4" />
                  Recurring
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded">Auto-book</span>
                </button>
                <button
                  onClick={() => setBookingType('group')}
                  className={`flex-1 min-w-[140px] px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    bookingType === 'group'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Group Booking
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded">Book for {groupSize} people</span>
                </button>
              </div>
            </div>

            {/* Recurring Options */}
            {bookingType === 'recurring' && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Frequency
                    </label>
                    <select
                      value={recurringFrequency}
                      onChange={(e) => setRecurringFrequency(e.target.value as 'weekly' | 'biweekly' | 'triweekly' | 'monthly')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="weekly">Every Week</option>
                      <option value="biweekly">Every 2 Weeks</option>
                      <option value="triweekly">Every 3 Weeks</option>
                      <option value="monthly">Every Month</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Number of Appointments
                    </label>
                    <input
                      type="number"
                      value={recurringOccurrences}
                      onChange={(e) => setRecurringOccurrences(Number(e.target.value))}
                      min={1}
                      max={52}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-900">
                    <strong>📅 You'll be booked for:</strong> {recurringOccurrences} appointments,{' '}
                    {recurringFrequency === 'weekly' ? 'every week' : recurringFrequency === 'biweekly' ? 'every 2 weeks' : recurringFrequency === 'triweekly' ? 'every 3 weeks' : 'every month'}
                    {' '}({Math.ceil(recurringOccurrences * (recurringFrequency === 'weekly' ? 1 : recurringFrequency === 'biweekly' ? 2 : recurringFrequency === 'triweekly' ? 3 : 4) / 4)} months total)
                  </p>
                </div>
              </div>
            )}

            {/* Package Deal Info */}
            {bookingType === 'package' && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <PackageIcon className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">💅 Popular Package: Manicure + Pedicure</h4>
                      <p className="text-sm text-gray-600 mb-2">Get both services together and save 20%</p>
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="text-sm text-gray-500 line-through">{formatPrice(120)}</span>
                          <span className="text-xl font-bold text-purple-600 ml-2">{formatPrice(96)}</span>
                        </div>
                        <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">Save {formatPrice(24)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Group Booking Options */}
            {bookingType === 'group' && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Number of People
                      </label>
                      <input
                        type="number"
                        value={groupSize}
                        onChange={(e) => setGroupSize(Math.max(2, Number(e.target.value)))}
                        min={2}
                        max={20}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Group Discount
                      </label>
                      <div className="px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                        <span className="text-lg font-bold text-green-600">
                          {getGroupDiscount(groupSize)}% OFF
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Users className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">👥 Group Booking Benefits</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>✅ Same time slot for everyone</li>
                          <li>✅ Multiple masters assigned automatically</li>
                          <li>✅ Group discount: {getGroupDiscount(groupSize)}% off per person</li>
                          <li>✅ Perfect for events: Weddings, Birthdays, Corporate</li>
                        </ul>
                        <div className="mt-3 pt-3 border-t border-blue-200">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Total for {groupSize} people:</span>
                            <div className="text-right">
                              <div className="text-xs text-gray-500 line-through">
                                {formatPrice(calculateTotal() * groupSize)}
                              </div>
                              <div className="text-xl font-bold text-purple-600">
                                {formatPrice(
                                  calculateTotal() * groupSize * 
                                  (1 - getGroupDiscount(groupSize) / 100)
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Main Booking Interface */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Services List */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Services</h2>
                <Select onValueChange={handleAddServiceFromDropdown}>
                  <SelectTrigger className="w-[180px] bg-white hover:bg-gray-50 text-purple-600 border-2 border-purple-600 font-semibold">
                    <Plus className="w-4 h-4 mr-1" />
                    <SelectValue placeholder="Add Service" />
                  </SelectTrigger>
                  <SelectContent>
                    {salon.services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        <div className="flex items-center justify-between w-full gap-3">
                          <span className="font-medium">{service.name}</span>
                          <span className="text-xs text-gray-500">
                            {service.duration} min • {formatPrice(service.price)}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                {bookedServices.map((item, index) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      activeServiceIndex === index
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                    onClick={() => setActiveServiceIndex(index)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1" onClick={(e) => e.stopPropagation()}>
                        <Select
                          value={item.service.id}
                          onValueChange={(value) => handleServiceSelect(index, value)}
                        >
                          <SelectTrigger className="w-full mb-2 h-auto p-0 border-0 hover:bg-transparent">
                            <p className="font-semibold text-gray-900 text-sm text-left">
                              {item.service.name}
                            </p>
                          </SelectTrigger>
                          <SelectContent>
                            {salon.services.map((service) => (
                              <SelectItem key={service.id} value={service.id}>
                                <div className="flex items-center justify-between w-full gap-3">
                                  <span className="font-medium">{service.name}</span>
                                  <span className="text-xs text-gray-500">
                                    {service.duration} min • {formatPrice(service.price)}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Clock className="w-3 h-3" />
                          <span>{item.service.duration} min</span>
                          <span className="text-purple-600 font-semibold">
                            {formatPrice(item.service.price)}
                          </span>
                        </div>
                      </div>
                      {bookedServices.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveService(index);
                          }}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Status Indicators */}
                    <div className="flex items-center gap-2 mt-2">
                      <div
                        className={`flex items-center gap-1 text-xs ${
                          item.staffId ? 'text-green-600' : 'text-gray-400'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Staff</span>
                      </div>
                      <div
                        className={`flex items-center gap-1 text-xs ${
                          item.date ? 'text-green-600' : 'text-gray-400'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Date</span>
                      </div>
                      <div
                        className={`flex items-center gap-1 text-xs ${
                          item.time ? 'text-green-600' : 'text-gray-400'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Time</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Total Card */}
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(calculateTotal())}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Services</span>
                  <span>{bookedServices.length}</span>
                </div>
                <div className="pt-3 border-t border-purple-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {formatPrice(calculateTotal())}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right: Service Details & Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Staff Selection */}
            <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-purple-600" />
                Select Master
              </h3>
              <div className="space-y-3">
                <div
                  onClick={() =>
                    handleServiceChange(activeServiceIndex, 'staffId', 'any')
                  }
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    activeService.staffId === 'any'
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <p className="font-semibold text-gray-900">Any Available Master</p>
                  <p className="text-sm text-gray-600">
                    First available specialist
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {salon.staff.map((member) => (
                    <div
                      key={member.id}
                      onClick={() =>
                        handleServiceChange(
                          activeServiceIndex,
                          'staffId',
                          member.id
                        )
                      }
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        activeService.staffId === member.id
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={member.image} alt={member.name} />
                          <AvatarFallback>{member.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {member.name}
                          </p>
                          <p className="text-xs text-gray-600">{member.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-600">
                            {member.rating}
                          </span>
                        </div>
                        <div className="flex-1 text-xs text-gray-500">
                          {member.specialties.join(', ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Date & Time Selection */}
            <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-purple-600" />
                Select Date & Time
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Calendar */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Pick a Date
                  </h4>
                  <Calendar
                    mode="single"
                    selected={activeService.date}
                    onSelect={(date) =>
                      handleServiceChange(activeServiceIndex, 'date', date)
                    }
                    className="rounded-lg border"
                    disabled={(date) => {
                      // Disable past dates
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                  />
                </div>

                {/* Time Slots */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Available Times
                  </h4>
                  {activeService.date ? (
                    <div className="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto pr-2">
                      {timeSlots.map((time) => {
                        const available = isSlotAvailable(
                          time,
                          activeService.date
                        );
                        return (
                          <Button
                            key={time}
                            variant={
                              activeService.time === time ? 'default' : 'outline'
                            }
                            disabled={!available}
                            className={`h-10 text-xs ${
                              activeService.time === time
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                                : available
                                ? ''
                                : 'opacity-40'
                            }`}
                            onClick={() =>
                              handleServiceChange(
                                activeServiceIndex,
                                'time',
                                time
                              )
                            }
                          >
                            {time}
                          </Button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-96 text-gray-400">
                      <div className="text-center">
                        <CalendarIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Please select a date first</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Book Button */}
            <Button
              onClick={handleBooking}
              disabled={!isBookingComplete()}
              className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBookingComplete()
                ? 'Complete Booking'
                : 'Please complete all selections'}
            </Button>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}