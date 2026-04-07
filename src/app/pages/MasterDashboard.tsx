import { useState, useEffect } from 'react';
import { 
  Calendar, 
  User, 
  Camera, 
  Star, 
  Clock, 
  Award,
  ChevronLeft,
  ChevronRight,
  LogOut,
  CheckCircle,
  ArrowLeft,
  Maximize2,
  Minimize2,
  ShoppingBag
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useMasters } from '../../contexts/MastersContext';
import { useAuth } from '../../contexts/AuthContext';
import { QuickRetailCheckout } from '../components/QuickRetailCheckout';
import { EnhancedCheckoutModal } from '../components/EnhancedCheckoutModal';
import { DEMO_PRODUCTS } from '../data/demoProducts';
import { toast } from 'sonner';

type CalendarView = 'day' | 'week' | 'month';

interface MasterDashboardProps {
  onBack?: () => void;
}

export function MasterDashboard({ onBack }: MasterDashboardProps) {
  const { masters, updateMaster } = useMasters();
  const { signOut } = useAuth();
  const [view, setView] = useState<CalendarView>('day');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Quick Retail Checkout state
  const [showEnhancedCheckout, setShowEnhancedCheckout] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  // Update current time every minute for the red line
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  // Handle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    
    // Optional: Use browser's fullscreen API for mobile
    if (!isFullscreen && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {
        // Fallback if fullscreen API is not supported
      });
    } else if (isFullscreen && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {
        // Fallback
      });
    }
  };

  // В реальном приложении ID мастера будет из auth context
  const currentMaster = masters[0]; // Для примера берем первого мастера

  // Mock bookings - В продакшене это будет из контекста/API
  // Используем текущую дату для актуальности
  const today = new Date();
  const [mockBookings] = useState([
    // Сегодня
    {
      id: '1',
      clientName: 'Anna K.',
      service: 'Manicure',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      time: '10:00',
      duration: 60,
      price: 50,
      status: 'confirmed' as const,
      category: 'Manicure'
    },
    {
      id: '2',
      clientName: 'Maria S.',
      service: 'Pedicure',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      time: '14:30',
      duration: 90,
      price: 75,
      status: 'confirmed' as const,
      category: 'Pedicure'
    },
    // Завтра
    {
      id: '3',
      clientName: 'Ewa P.',
      service: 'Gel Manicure',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
      time: '11:15',
      duration: 75,
      price: 65,
      status: 'confirmed' as const,
      category: 'Manicure'
    },
    {
      id: '4',
      clientName: 'Katarzyna W.',
      service: 'Manicure + Design',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
      time: '15:30',
      duration: 90,
      price: 85,
      status: 'pending' as const,
      category: 'Manicure'
    },
    // Через 2 дня
    {
      id: '5',
      clientName: 'Joanna M.',
      service: 'Pedicure',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
      time: '10:00',
      duration: 90,
      price: 75,
      status: 'confirmed' as const,
      category: 'Pedicure'
    },
    // Через 3 дня
    {
      id: '6',
      clientName: 'Sofia L.',
      service: 'Manicure',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
      time: '13:00',
      duration: 60,
      price: 50,
      status: 'confirmed' as const,
      category: 'Manicure'
    },
    // Через 5 дней
    {
      id: '7',
      clientName: 'Natalia B.',
      service: 'Gel Manicure',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
      time: '09:30',
      duration: 75,
      price: 65,
      status: 'confirmed' as const,
      category: 'Manicure'
    },
    // Через неделю
    {
      id: '8',
      clientName: 'Alina K.',
      service: 'Pedicure',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
      time: '16:00',
      duration: 90,
      price: 75,
      status: 'pending' as const,
      category: 'Pedicure'
    },
    // Через 10 дней
    {
      id: '9',
      clientName: 'Diana M.',
      service: 'Manicure + Design',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10),
      time: '12:30',
      duration: 90,
      price: 85,
      status: 'confirmed' as const,
      category: 'Manicure'
    },
    // Через 2 недели
    {
      id: '10',
      clientName: 'Victoria S.',
      service: 'Manicure',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14),
      time: '11:00',
      duration: 60,
      price: 50,
      status: 'confirmed' as const,
      category: 'Manicure'
    },
  ]);

  if (!currentMaster) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Master profile not found</p>
        </div>
      </div>
    );
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        // Update master avatar
        updateMaster({
          ...currentMaster,
          avatar: imageUrl
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Filter bookings based on view
  const getBookingsForView = () => {
    const today = new Date(currentDate);
    today.setHours(0, 0, 0, 0);

    switch (view) {
      case 'day':
        return mockBookings.filter(booking => {
          const bookingDate = new Date(booking.date);
          bookingDate.setHours(0, 0, 0, 0);
          return bookingDate.getTime() === today.getTime();
        });
      
      case 'week':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay() + 1); // Monday
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        return mockBookings.filter(booking => {
          const bookingDate = new Date(booking.date);
          bookingDate.setHours(0, 0, 0, 0);
          return bookingDate >= weekStart && bookingDate <= weekEnd;
        });
      
      case 'month':
        return mockBookings.filter(booking => {
          const bookingDate = new Date(booking.date);
          return bookingDate.getMonth() === today.getMonth() && 
                 bookingDate.getFullYear() === today.getFullYear();
        });
      
      default:
        return mockBookings;
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    switch (view) {
      case 'day':
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'month':
        newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
    }
    
    setCurrentDate(newDate);
  };

  const getDateRangeLabel = () => {
    const options: Intl.DateTimeFormatOptions = { 
      month: 'long', 
      year: 'numeric',
      day: view === 'day' ? 'numeric' : undefined
    };
    
    if (view === 'week') {
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() - currentDate.getDay() + 1);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    
    return currentDate.toLocaleDateString('en-US', options);
  };

  const filteredBookings = getBookingsForView();
  const todayRevenue = filteredBookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.price, 0);

  // Fullscreen Calendar Component
  const FullscreenCalendar = () => (
    <div className="fixed inset-0 bg-gray-50 z-50 overflow-auto">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white sticky top-0 z-30">
        <div className="px-2 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden shrink-0">
                {currentMaster.avatar ? (
                  <img 
                    src={currentMaster.avatar} 
                    alt={currentMaster.firstName} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <span className="text-[10px] sm:text-xs font-bold">
                    {currentMaster.firstName[0]}{currentMaster.lastName[0]}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-xs sm:text-sm truncate">{currentMaster.firstName} {currentMaster.lastName}</div>
                <div className="text-[10px] sm:text-xs text-purple-100">{filteredBookings.length} appointments</div>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 shrink-0 text-xs"
              onClick={toggleFullscreen}
            >
              <Minimize2 className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Exit</span>
            </Button>
          </div>

          {/* Date Navigation - Compact */}
          <div className="mt-3 flex items-center justify-between gap-1 sm:gap-2">
            <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-8 w-8 p-0 shrink-0"
                onClick={() => navigateDate('prev')}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="font-bold text-[11px] sm:text-sm flex-1 text-center truncate">
                {getDateRangeLabel()}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-8 w-8 p-0 shrink-0"
                onClick={() => navigateDate('next')}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* View Toggle - Compact */}
            <div className="flex items-center gap-0.5 bg-white/10 rounded-lg p-0.5 shrink-0">
              <button
                onClick={() => setView('day')}
                className={`px-2 sm:px-3 py-1 rounded text-[10px] sm:text-xs font-bold transition-colors ${
                  view === 'day' 
                    ? 'bg-white text-purple-600 shadow-sm' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <span className="hidden sm:inline">Day</span>
                <span className="sm:hidden">D</span>
              </button>
              <button
                onClick={() => setView('week')}
                className={`px-2 sm:px-3 py-1 rounded text-[10px] sm:text-xs font-bold transition-colors ${
                  view === 'week' 
                    ? 'bg-white text-purple-600 shadow-sm' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <span className="hidden sm:inline">Week</span>
                <span className="sm:hidden">W</span>
              </button>
              <button
                onClick={() => setView('month')}
                className={`px-2 sm:px-3 py-1 rounded text-[10px] sm:text-xs font-bold transition-colors ${
                  view === 'month' 
                    ? 'bg-white text-purple-600 shadow-sm' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <span className="hidden sm:inline">Month</span>
                <span className="sm:hidden">M</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="p-4">
        <Card>
          <CardContent className="p-0">
            {/* Day View - Calendar Grid */}
            {view === 'day' && (
              <div className="overflow-auto max-h-[600px]">
                {/* Header with Master Name */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-purple-200 p-3 sticky top-0 z-20">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center overflow-hidden">
                      {currentMaster.avatar ? (
                        <img 
                          src={currentMaster.avatar} 
                          alt={`${currentMaster.firstName} ${currentMaster.lastName}`} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <span className="text-xs font-bold text-purple-600">
                          {currentMaster.firstName[0]}{currentMaster.lastName[0]}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-gray-900">
                      {currentMaster.firstName} {currentMaster.lastName}
                    </h3>
                  </div>
                </div>

                {/* Time Slots Grid with 15-minute intervals */}
                <div className="relative">
                  {/* Current Time Red Line */}
                  {(() => {
                    const now = currentTime;
                    const hours = now.getHours();
                    const minutes = now.getMinutes();
                    
                    // Only show line if current time is within working hours (9:00-20:00)
                    if (hours >= 9 && hours < 20) {
                      // Calculate position: each 15min slot is 40px high
                      const totalMinutesFromStart = (hours - 9) * 60 + minutes;
                      const position = (totalMinutesFromStart / 15) * 40;
                      
                      return (
                        <div 
                          className="absolute left-0 right-0 z-10 pointer-events-none"
                          style={{ top: `${position}px` }}
                        >
                          <div className="flex items-center">
                            <div className="w-20 flex-shrink-0 pr-2 text-right">
                              <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                                {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}
                              </span>
                            </div>
                            <div className="flex-1 h-0.5 bg-red-500 relative">
                              <div className="absolute -left-1 -top-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Generate 15-minute time slots from 9:00 to 20:00 */}
                  {Array.from({ length: 45 }, (_, i) => {
                    const totalMinutes = 9 * 60 + i * 15; // Start at 9:00, increment by 15 min
                    const hour = Math.floor(totalMinutes / 60);
                    const minute = totalMinutes % 60;
                    const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                    
                    // Find bookings that start at this time
                    const slotBookings = filteredBookings.filter(booking => {
                      return booking.time === time;
                    });

                    // Show time label only on the hour and half-hour
                    const showTimeLabel = minute === 0 || minute === 30;

                    return (
                      <div 
                        key={time}
                        className={`border-b transition-colors ${
                          minute === 0 ? 'border-gray-300' : 'border-gray-100'
                        } hover:bg-purple-50/20`}
                        style={{ height: '40px' }}
                      >
                        <div className="flex h-full">
                          {/* Time Label */}
                          <div className={`w-20 flex-shrink-0 pr-2 text-right border-r border-gray-200 ${
                            showTimeLabel ? 'pt-1' : ''
                          }`}>
                            {showTimeLabel && (
                              <span className="text-xs text-gray-500 font-medium">
                                {time}
                              </span>
                            )}
                          </div>
                          
                          {/* Booking Slot */}
                          <div className="flex-1 relative">
                            {slotBookings.length > 0 ? (
                              slotBookings.map(booking => {
                                // Calculate height based on duration (1 minute = 40/15 pixels)
                                const heightInPixels = (booking.duration / 15) * 40;
                                
                                return (
                                  <div
                                    key={booking.id}
                                    className={`absolute inset-x-0 mx-1 mt-0.5 rounded-lg p-2 border-l-4 shadow-sm ${
                                      booking.status === 'confirmed'
                                        ? 'bg-green-50 border-green-500'
                                        : 'bg-yellow-50 border-yellow-500'
                                    }`}
                                    style={{
                                      height: `${heightInPixels - 4}px`,
                                      minHeight: '36px'
                                    }}
                                  >
                                    <div className="flex items-start justify-between h-full">
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5 mb-0.5">
                                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0">
                                            <span className="text-[10px] font-bold text-purple-600">
                                              {booking.clientName.split(' ').map(n => n[0]).join('')}
                                            </span>
                                          </div>
                                          <div className="min-w-0 flex-1">
                                            <div className="font-bold text-xs text-gray-900 truncate">{booking.clientName}</div>
                                            <div className="text-[10px] text-gray-600 truncate">{booking.service}</div>
                                          </div>
                                        </div>
                                        {booking.duration >= 30 && (
                                          <div className="text-[10px] text-gray-500 ml-7 mt-1">
                                            {booking.duration} min • {booking.time}
                                          </div>
                                        )}
                                      </div>
                                      <div className={`text-[10px] font-medium px-1.5 py-0.5 rounded flex-shrink-0 ml-1 ${
                                        booking.status === 'confirmed'
                                          ? 'bg-green-200 text-green-800'
                                          : 'bg-yellow-200 text-yellow-800'
                                      }`}>
                                        {booking.status === 'confirmed' ? '✓' : '⏱'}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* View-only notice */}
                <div className="bg-blue-50 border-t border-blue-200 p-3 text-center sticky bottom-0">
                  <p className="text-xs text-blue-800">
                    📌 View-only calendar • Contact admin to modify bookings
                  </p>
                </div>
              </div>
            )}

            {/* Week View - Calendar Grid with 7 columns */}
            {view === 'week' && (() => {
              // Calculate week start (Monday)
              const weekStart = new Date(currentDate);
              weekStart.setDate(currentDate.getDate() - currentDate.getDay() + 1);
              
              // Generate 7 days (Mon-Sun)
              const weekDays = Array.from({ length: 7 }, (_, i) => {
                const day = new Date(weekStart);
                day.setDate(weekStart.getDate() + i);
                return day;
              });

              return (
                <div className="overflow-auto max-h-[600px]">
                  {/* Days Header */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-purple-200 sticky top-0 z-20">
                    <div className="flex">
                      <div className="w-16 flex-shrink-0"></div>
                      {weekDays.map((day, i) => {
                        const isToday = day.toDateString() === new Date().toDateString();
                        return (
                          <div key={i} className="flex-1 p-2 text-center border-l border-purple-200">
                            <div className={`text-xs font-medium ${isToday ? 'text-purple-600' : 'text-gray-600'}`}>
                              {day.toLocaleDateString('en-US', { weekday: 'short' })}
                            </div>
                            <div className={`text-sm font-bold ${isToday ? 'text-purple-600' : 'text-gray-900'}`}>
                              {day.getDate()}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Slots Grid */}
                  <div className="relative">
                    {/* Generate 15-minute time slots */}
                    {Array.from({ length: 45 }, (_, i) => {
                      const totalMinutes = 9 * 60 + i * 15;
                      const hour = Math.floor(totalMinutes / 60);
                      const minute = totalMinutes % 60;
                      const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                      const showTimeLabel = minute === 0 || minute === 30;

                      return (
                        <div 
                          key={time}
                          className={`border-b ${minute === 0 ? 'border-gray-300' : 'border-gray-100'}`}
                          style={{ height: '40px' }}
                        >
                          <div className="flex h-full">
                            {/* Time Label */}
                            <div className={`w-16 flex-shrink-0 pr-2 text-right border-r border-gray-200 ${showTimeLabel ? 'pt-1' : ''}`}>
                              {showTimeLabel && (
                                <span className="text-xs text-gray-500 font-medium">{time}</span>
                              )}
                            </div>

                            {/* Day Columns */}
                            {weekDays.map((day, dayIndex) => {
                              // Find bookings for this day and time
                              const dayBookings = filteredBookings.filter(booking => {
                                const bookingDate = new Date(booking.date);
                                return bookingDate.toDateString() === day.toDateString() && booking.time === time;
                              });

                              return (
                                <div key={dayIndex} className="flex-1 border-l border-gray-100 relative hover:bg-purple-50/20 transition-colors">
                                  {dayBookings.map(booking => {
                                    const heightInPixels = (booking.duration / 15) * 40;
                                    return (
                                      <div
                                        key={booking.id}
                                        className={`absolute inset-x-0 mx-0.5 mt-0.5 rounded p-1 border-l-2 text-[9px] ${
                                          booking.status === 'confirmed'
                                            ? 'bg-green-50 border-green-500'
                                            : 'bg-yellow-50 border-yellow-500'
                                        }`}
                                        style={{
                                          height: `${heightInPixels - 4}px`,
                                          minHeight: '36px'
                                        }}
                                      >
                                        <div className="font-bold text-gray-900 truncate">{booking.clientName}</div>
                                        <div className="text-gray-600 truncate">{booking.service}</div>
                                        <div className="text-gray-500">{booking.time}</div>
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* View-only notice */}
                  <div className="bg-blue-50 border-t border-blue-200 p-3 text-center sticky bottom-0">
                    <p className="text-xs text-blue-800">
                      📌 View-only calendar • Contact admin to modify bookings
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Month View - Calendar Grid */}
            {view === 'month' && (() => {
              const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
              const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
              const startDate = new Date(firstDayOfMonth);
              startDate.setDate(startDate.getDate() - (startDate.getDay() === 0 ? 6 : startDate.getDay() - 1));
              
              const days = [];
              const current = new Date(startDate);
              for (let i = 0; i < 35; i++) {
                days.push(new Date(current));
                current.setDate(current.getDate() + 1);
              }

              return (
                <div className="p-2 sm:p-4">
                  {/* Days of Week Header */}
                  <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                      <div key={day} className="p-1 sm:p-2 text-center text-[10px] sm:text-xs font-bold text-gray-600">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
                    {days.map((day, i) => {
                      const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                      const isToday = day.toDateString() === new Date().toDateString();
                      const dayBookings = filteredBookings.filter(booking => {
                        const bookingDate = new Date(booking.date);
                        return bookingDate.toDateString() === day.toDateString();
                      });

                      return (
                        <div
                          key={i}
                          className={`min-h-[60px] sm:min-h-[100px] p-1 sm:p-2 rounded border sm:border-2 ${
                            isToday 
                              ? 'bg-purple-50 border-purple-400' 
                              : isCurrentMonth 
                                ? 'bg-white border-gray-300' 
                                : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className={`text-[11px] sm:text-sm font-bold mb-0.5 sm:mb-1 ${
                            isToday 
                              ? 'text-purple-600' 
                              : isCurrentMonth 
                                ? 'text-gray-900' 
                                : 'text-gray-400'
                          }`}>
                            {day.getDate()}
                          </div>

                          {/* Bookings for this day - Mobile: show dots, Desktop: show details */}
                          <div className="space-y-0.5 sm:space-y-1">
                            {/* Mobile: Colored dots */}
                            <div className="flex flex-wrap gap-0.5 sm:hidden">
                              {dayBookings.slice(0, 4).map(booking => (
                                <div
                                  key={booking.id}
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    booking.status === 'confirmed'
                                      ? 'bg-green-500'
                                      : 'bg-yellow-500'
                                  }`}
                                  title={`${booking.time} - ${booking.clientName}`}
                                />
                              ))}
                            </div>
                            
                            {/* Desktop: Full booking cards */}
                            <div className="hidden sm:block">
                              {dayBookings.slice(0, 2).map(booking => (
                                <div
                                  key={booking.id}
                                  className={`text-[9px] p-1 rounded ${
                                    booking.status === 'confirmed'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}
                                >
                                  <div className="font-bold truncate">{booking.time}</div>
                                  <div className="truncate">{booking.clientName}</div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Overflow indicator */}
                          {dayBookings.length > 4 && (
                            <div className="text-[9px] sm:text-[10px] text-gray-600 font-medium mt-0.5 sm:mt-1">
                              +{dayBookings.length - 4}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* View-only notice */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center mt-4">
                    <p className="text-xs text-blue-800">
                      📌 View-only calendar • Contact admin to modify bookings
                    </p>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // If fullscreen mode is active, render fullscreen calendar
  if (isFullscreen) {
    return <FullscreenCalendar />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Floating Fullscreen Button - Mobile Optimized */}
      <button
        onClick={toggleFullscreen}
        className="fixed bottom-6 right-6 z-[9999] w-16 h-16 bg-gradient-to-br from-purple-600 via-purple-500 to-pink-600 text-white rounded-full shadow-2xl hover:shadow-[0_20px_50px_rgba(147,51,234,0.5)] transform hover:scale-110 transition-all duration-300 flex items-center justify-center group animate-pulse"
        aria-label="Fullscreen Calendar"
        style={{ boxShadow: '0 10px 40px rgba(147, 51, 234, 0.4)' }}
      >
        <Maximize2 className="w-7 h-7" />
        <span className="absolute -top-12 right-0 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-xl">
          📱 Fullscreen Mode
        </span>
      </button>

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={onBack}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              <div>
                <h1 className="text-3xl font-bold">Master Dashboard</h1>
                <p className="text-purple-100 mt-1">Manage your schedule and profile</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={onBack || (() => signOut())}
            >
              <LogOut className="w-4 h-4 mr-2" />
              {onBack ? 'Switch Role' : 'Sign Out'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Profile */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  {/* Avatar with Upload */}
                  <div className="relative inline-block mb-4">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center overflow-hidden">
                      {currentMaster.avatar ? (
                        <img 
                          src={currentMaster.avatar} 
                          alt={`${currentMaster.firstName} ${currentMaster.lastName}`} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <span className="text-4xl font-bold text-purple-600">
                          {currentMaster.firstName[0]}{currentMaster.lastName[0]}</span>
                      )}
                    </div>
                    
                    {/* Upload Button */}
                    <label className="absolute bottom-0 right-0 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-700 transition-colors shadow-lg">
                      <Camera className="w-5 h-5 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {currentMaster.firstName} {currentMaster.lastName}
                  </h2>
                  <p className="text-gray-600 mb-4">{currentMaster.categories.join(', ')}</p>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-bold text-lg text-gray-900">{currentMaster.rating?.toFixed(1)}</span>
                      </div>
                      <div className="text-xs text-gray-600">Rating</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="text-lg font-bold text-gray-900 mb-1">{currentMaster.completedBookings}</div>
                      <div className="text-xs text-gray-600">Bookings</div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-1">
                      <User className="w-4 h-4" />
                      <span>{currentMaster.email}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-3">📋 Quick Information</h3>
                <div className="space-y-3">
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Specialization</div>
                    <div className="text-sm font-medium text-gray-900">
                      {currentMaster.categories.join(', ')}
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Services Offered</div>
                    <div className="text-sm font-medium text-gray-900">
                      {currentMaster.services.length} services
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Total Clients Served</div>
                    <div className="text-sm font-medium text-gray-900">
                      {currentMaster.completedBookings} bookings
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Calendar */}
          <div className="lg:col-span-2 space-y-0">
            {/* Quick Retail Checkout - Products Only */}
            <div className="bg-white rounded-t-lg shadow-lg overflow-hidden mb-6">
              <QuickRetailCheckout
                salonId="demo-salon-123"
                products={DEMO_PRODUCTS}
                onCheckoutComplete={async (sale) => {
                  console.log('✅ Retail sale completed:', sale);
                  
                  toast.success(`🛍️ Sale completed! ${sale.items.length} items sold`, {
                    description: sale.certificateUsed 
                      ? `Certificate used: ${sale.certificateUsed.code}`
                      : `Total: AED ${sale.total}`,
                  });
                  
                  // In production: Send to backend
                  // await recordRetailSale(sale);
                }}
              />
            </div>

            {/* Today's Summary */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{filteredBookings.length}</div>
                      <div className="text-xs text-gray-600">Appointments</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {filteredBookings.filter(b => b.status === 'confirmed').length}
                      </div>
                      <div className="text-xs text-gray-600">Confirmed</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Calendar Controls - Date Navigation and View Toggle */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Date Navigation */}
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateDate('prev')}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>

                    <div className="text-lg font-bold text-gray-900 min-w-[200px] text-center">
                      {getDateRangeLabel()}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateDate('next')}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* View Toggle */}
                  <div className="flex items-center gap-1 sm:gap-2 bg-gray-100 rounded-lg p-1 shrink-0">
                    <button
                      onClick={() => setView('day')}
                      className={`px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors ${
                        view === 'day' 
                          ? 'bg-white text-purple-600 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <span className="hidden sm:inline">Day</span>
                      <span className="sm:hidden">D</span>
                    </button>
                    <button
                      onClick={() => setView('week')}
                      className={`px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors ${
                        view === 'week' 
                          ? 'bg-white text-purple-600 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <span className="hidden sm:inline">Week</span>
                      <span className="sm:hidden">W</span>
                    </button>
                    <button
                      onClick={() => setView('month')}
                      className={`px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors ${
                        view === 'month' 
                          ? 'bg-white text-purple-600 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <span className="hidden sm:inline">Month</span>
                      <span className="sm:hidden">M</span>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Calendar View */}
            <Card>
              <CardContent className="p-0">
                {/* Day View - Calendar Grid */}
                {view === 'day' && (
                  <div className="overflow-auto max-h-[600px]">
                    {/* Header with Master Name */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-purple-200 p-3 sticky top-0 z-20">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center overflow-hidden">
                          {currentMaster.avatar ? (
                            <img 
                              src={currentMaster.avatar} 
                              alt={`${currentMaster.firstName} ${currentMaster.lastName}`} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <span className="text-xs font-bold text-purple-600">
                              {currentMaster.firstName[0]}{currentMaster.lastName[0]}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-sm text-gray-900">
                          {currentMaster.firstName} {currentMaster.lastName}
                        </h3>
                      </div>
                    </div>

                    {/* Time Slots Grid with 15-minute intervals */}
                    <div className="relative">
                      {/* Current Time Red Line */}
                      {(() => {
                        const now = currentTime;
                        const hours = now.getHours();
                        const minutes = now.getMinutes();
                        
                        // Only show line if current time is within working hours (9:00-20:00)
                        if (hours >= 9 && hours < 20) {
                          // Calculate position: each 15min slot is 40px high
                          const totalMinutesFromStart = (hours - 9) * 60 + minutes;
                          const position = (totalMinutesFromStart / 15) * 40;
                          
                          return (
                            <div 
                              className="absolute left-0 right-0 z-10 pointer-events-none"
                              style={{ top: `${position}px` }}
                            >
                              <div className="flex items-center">
                                <div className="w-20 flex-shrink-0 pr-2 text-right">
                                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                                    {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}
                                  </span>
                                </div>
                                <div className="flex-1 h-0.5 bg-red-500 relative">
                                  <div className="absolute -left-1 -top-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })()}

                      {/* Generate 15-minute time slots from 9:00 to 20:00 */}
                      {Array.from({ length: 45 }, (_, i) => {
                        const totalMinutes = 9 * 60 + i * 15; // Start at 9:00, increment by 15 min
                        const hour = Math.floor(totalMinutes / 60);
                        const minute = totalMinutes % 60;
                        const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                        
                        // Find bookings that start at this time
                        const slotBookings = filteredBookings.filter(booking => {
                          return booking.time === time;
                        });

                        // Show time label only on the hour and half-hour
                        const showTimeLabel = minute === 0 || minute === 30;

                        return (
                          <div 
                            key={time}
                            className={`border-b transition-colors ${
                              minute === 0 ? 'border-gray-300' : 'border-gray-100'
                            } hover:bg-purple-50/20`}
                            style={{ height: '40px' }}
                          >
                            <div className="flex h-full">
                              {/* Time Label */}
                              <div className={`w-20 flex-shrink-0 pr-2 text-right border-r border-gray-200 ${
                                showTimeLabel ? 'pt-1' : ''
                              }`}>
                                {showTimeLabel && (
                                  <span className="text-xs text-gray-500 font-medium">
                                    {time}
                                  </span>
                                )}
                              </div>
                              
                              {/* Booking Slot */}
                              <div className="flex-1 relative">
                                {slotBookings.length > 0 ? (
                                  slotBookings.map(booking => {
                                    // Calculate height based on duration (1 minute = 40/15 pixels)
                                    const heightInPixels = (booking.duration / 15) * 40;
                                    
                                    return (
                                      <div
                                        key={booking.id}
                                        className={`absolute inset-x-0 mx-1 mt-0.5 rounded-lg p-2 border-l-4 shadow-sm ${
                                          booking.status === 'confirmed'
                                            ? 'bg-green-50 border-green-500'
                                            : 'bg-yellow-50 border-yellow-500'
                                        }`}
                                        style={{
                                          height: `${heightInPixels - 4}px`,
                                          minHeight: '36px'
                                        }}
                                      >
                                        <div className="flex items-start justify-between h-full">
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5 mb-0.5">
                                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0">
                                                <span className="text-[10px] font-bold text-purple-600">
                                                  {booking.clientName.split(' ').map(n => n[0]).join('')}
                                                </span>
                                              </div>
                                              <div className="min-w-0 flex-1">
                                                <div className="font-bold text-xs text-gray-900 truncate">{booking.clientName}</div>
                                                <div className="text-[10px] text-gray-600 truncate">{booking.service}</div>
                                              </div>
                                            </div>
                                            {booking.duration >= 30 && (
                                              <div className="text-[10px] text-gray-500 ml-7 mt-1">
                                                {booking.duration} min • {booking.time}
                                              </div>
                                            )}
                                          </div>
                                          <div className={`text-[10px] font-medium px-1.5 py-0.5 rounded flex-shrink-0 ml-1 ${
                                            booking.status === 'confirmed'
                                              ? 'bg-green-200 text-green-800'
                                              : 'bg-yellow-200 text-yellow-800'
                                          }`}>
                                            {booking.status === 'confirmed' ? '✓' : '⏱'}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })
                                ) : null}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* View-only notice */}
                    <div className="bg-blue-50 border-t border-blue-200 p-3 text-center sticky bottom-0">
                      <p className="text-xs text-blue-800">
                        📌 View-only calendar • Contact admin to modify bookings
                      </p>
                    </div>
                  </div>
                )}

                {/* Week View - Calendar Grid with 7 columns */}
                {view === 'week' && (() => {
                  // Calculate week start (Monday)
                  const weekStart = new Date(currentDate);
                  weekStart.setDate(currentDate.getDate() - currentDate.getDay() + 1);
                  
                  // Generate 7 days (Mon-Sun)
                  const weekDays = Array.from({ length: 7 }, (_, i) => {
                    const day = new Date(weekStart);
                    day.setDate(weekStart.getDate() + i);
                    return day;
                  });

                  return (
                    <div className="overflow-auto max-h-[600px]">
                      {/* Days Header */}
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-purple-200 sticky top-0 z-20">
                        <div className="flex">
                          <div className="w-16 flex-shrink-0"></div>
                          {weekDays.map((day, i) => {
                            const isToday = day.toDateString() === new Date().toDateString();
                            return (
                              <div key={i} className="flex-1 p-2 text-center border-l border-purple-200">
                                <div className={`text-xs font-medium ${isToday ? 'text-purple-600' : 'text-gray-600'}`}>
                                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                                </div>
                                <div className={`text-sm font-bold ${isToday ? 'text-purple-600' : 'text-gray-900'}`}>
                                  {day.getDate()}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Time Slots Grid */}
                      <div className="relative">
                        {/* Generate 15-minute time slots */}
                        {Array.from({ length: 45 }, (_, i) => {
                          const totalMinutes = 9 * 60 + i * 15;
                          const hour = Math.floor(totalMinutes / 60);
                          const minute = totalMinutes % 60;
                          const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                          const showTimeLabel = minute === 0 || minute === 30;

                          return (
                            <div 
                              key={time}
                              className={`border-b ${minute === 0 ? 'border-gray-300' : 'border-gray-100'}`}
                              style={{ height: '40px' }}
                            >
                              <div className="flex h-full">
                                {/* Time Label */}
                                <div className={`w-16 flex-shrink-0 pr-2 text-right border-r border-gray-200 ${showTimeLabel ? 'pt-1' : ''}`}>
                                  {showTimeLabel && (
                                    <span className="text-xs text-gray-500 font-medium">{time}</span>
                                  )}
                                </div>

                                {/* Day Columns */}
                                {weekDays.map((day, dayIndex) => {
                                  // Find bookings for this day and time
                                  const dayBookings = filteredBookings.filter(booking => {
                                    const bookingDate = new Date(booking.date);
                                    return bookingDate.toDateString() === day.toDateString() && booking.time === time;
                                  });

                                  return (
                                    <div key={dayIndex} className="flex-1 border-l border-gray-100 relative hover:bg-purple-50/20 transition-colors">
                                      {dayBookings.map(booking => {
                                        const heightInPixels = (booking.duration / 15) * 40;
                                        return (
                                          <div
                                            key={booking.id}
                                            className={`absolute inset-x-0 mx-0.5 mt-0.5 rounded p-1 border-l-2 text-[9px] ${
                                              booking.status === 'confirmed'
                                                ? 'bg-green-50 border-green-500'
                                                : 'bg-yellow-50 border-yellow-500'
                                            }`}
                                            style={{
                                              height: `${heightInPixels - 4}px`,
                                              minHeight: '36px'
                                            }}
                                          >
                                            <div className="font-bold text-gray-900 truncate">{booking.clientName}</div>
                                            <div className="text-gray-600 truncate">{booking.service}</div>
                                            <div className="text-gray-500">{booking.time}</div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* View-only notice */}
                      <div className="bg-blue-50 border-t border-blue-200 p-3 text-center sticky bottom-0">
                        <p className="text-xs text-blue-800">
                          📌 View-only calendar • Contact admin to modify bookings
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {/* Month View - Calendar Grid */}
                {view === 'month' && (() => {
                  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                  const startDate = new Date(firstDayOfMonth);
                  startDate.setDate(startDate.getDate() - (startDate.getDay() === 0 ? 6 : startDate.getDay() - 1));
                  
                  const days = [];
                  const current = new Date(startDate);
                  for (let i = 0; i < 35; i++) {
                    days.push(new Date(current));
                    current.setDate(current.getDate() + 1);
                  }

                  return (
                    <div className="p-2 sm:p-4">
                      {/* Days of Week Header */}
                      <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                          <div key={day} className="p-1 sm:p-2 text-center text-[10px] sm:text-xs font-bold text-gray-600">
                            {day}
                          </div>
                        ))}
                      </div>

                      {/* Calendar Grid */}
                      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
                        {days.map((day, i) => {
                          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                          const isToday = day.toDateString() === new Date().toDateString();
                          const dayBookings = filteredBookings.filter(booking => {
                            const bookingDate = new Date(booking.date);
                            return bookingDate.toDateString() === day.toDateString();
                          });

                          return (
                            <div
                              key={i}
                              className={`min-h-[60px] sm:min-h-[100px] p-1 sm:p-2 rounded border sm:border-2 ${
                                isToday 
                                  ? 'bg-purple-50 border-purple-400' 
                                  : isCurrentMonth 
                                    ? 'bg-white border-gray-300' 
                                    : 'bg-gray-50 border-gray-200'
                              }`}
                            >
                              <div className={`text-[11px] sm:text-sm font-bold mb-0.5 sm:mb-1 ${
                                isToday 
                                  ? 'text-purple-600' 
                                  : isCurrentMonth 
                                    ? 'text-gray-900' 
                                    : 'text-gray-400'
                              }`}>
                                {day.getDate()}
                              </div>

                              {/* Bookings for this day - Mobile: show dots, Desktop: show details */}
                              <div className="space-y-0.5 sm:space-y-1">
                                {/* Mobile: Colored dots */}
                                <div className="flex flex-wrap gap-0.5 sm:hidden">
                                  {dayBookings.slice(0, 4).map(booking => (
                                    <div
                                      key={booking.id}
                                      className={`w-1.5 h-1.5 rounded-full ${
                                        booking.status === 'confirmed'
                                          ? 'bg-green-500'
                                          : 'bg-yellow-500'
                                      }`}
                                      title={`${booking.time} - ${booking.clientName}`}
                                    />
                                  ))}
                                </div>
                                
                                {/* Desktop: Full booking cards */}
                                <div className="hidden sm:block">
                                  {dayBookings.slice(0, 2).map(booking => (
                                    <div
                                      key={booking.id}
                                      className={`text-[9px] p-1 rounded ${
                                        booking.status === 'confirmed'
                                          ? 'bg-green-100 text-green-800'
                                          : 'bg-yellow-100 text-yellow-800'
                                      }`}
                                    >
                                      <div className="font-bold truncate">{booking.time}</div>
                                      <div className="truncate">{booking.clientName}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Overflow indicator */}
                              {dayBookings.length > 4 && (
                                <div className="text-[9px] sm:text-[10px] text-gray-600 font-medium mt-0.5 sm:mt-1">
                                  +{dayBookings.length - 4}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* View-only notice */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center mt-4">
                        <p className="text-xs text-blue-800">
                          📌 View-only calendar • Contact admin to modify bookings
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-bold text-blue-900 mb-2">👁️ View-Only Calendar</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ You can view all your appointments and schedule</li>
                <li>✓ Client phone numbers are hidden for privacy</li>
                <li>✗ You cannot modify or cancel bookings</li>
                <li>✗ Contact salon administrator for any changes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}