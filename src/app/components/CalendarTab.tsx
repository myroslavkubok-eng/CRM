import { useState, useEffect, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ChevronLeft, ChevronRight, Plus, CreditCard, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from './ui/button';
import { CheckoutModal } from './CheckoutModal';
import { BookAppointmentModal } from './BookAppointmentModal';
import { useCurrency } from '../../contexts/CurrencyContext';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface Booking {
  id: string;
  clientName: string;
  service: string;
  startTime: string;
  duration: number;
  status: 'paid' | 'deposit' | 'unpaid';
  masterId: string;
  date: string;
  category?: string;
  color?: string;
  price?: number;
  description?: string;
  discount?: number;
  originalPrice?: number;
}

interface Master {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface CalendarTabProps {
  onNewBooking?: () => void;
}

const ITEM_TYPE = 'BOOKING';

// Service category colors - 18 categories
const SERVICE_CATEGORY_COLORS: { [key: string]: { bg: string; border: string; text: string } } = {
  // Nails
  'Manicure': { bg: 'bg-pink-100', border: 'border-l-pink-500', text: 'text-pink-900' },
  'Pedicure': { bg: 'bg-orange-100', border: 'border-l-orange-500', text: 'text-orange-900' },
  
  // Eyes
  'Eyelashes': { bg: 'bg-purple-100', border: 'border-l-purple-500', text: 'text-purple-900' },
  'Brow': { bg: 'bg-amber-100', border: 'border-l-amber-600', text: 'text-amber-900' },
  
  // Hair
  'Barber': { bg: 'bg-blue-100', border: 'border-l-blue-500', text: 'text-blue-900' },
  'Hair stylist': { bg: 'bg-indigo-100', border: 'border-l-indigo-500', text: 'text-indigo-900' },
  
  // Skin & Beauty
  'Cosmetology': { bg: 'bg-cyan-100', border: 'border-l-cyan-500', text: 'text-cyan-900' },
  'Facial': { bg: 'bg-rose-100', border: 'border-l-rose-500', text: 'text-rose-900' },
  'Laser': { bg: 'bg-red-100', border: 'border-l-red-500', text: 'text-red-900' },
  'Make up': { bg: 'bg-fuchsia-100', border: 'border-l-fuchsia-500', text: 'text-fuchsia-900' },
  
  // Body Art
  'Tattoo': { bg: 'bg-slate-100', border: 'border-l-slate-600', text: 'text-slate-900' },
  'Piercing': { bg: 'bg-gray-100', border: 'border-l-gray-500', text: 'text-gray-900' },
  'PMU': { bg: 'bg-violet-100', border: 'border-l-violet-500', text: 'text-violet-900' },
  
  // Wellness
  'Spa': { bg: 'bg-emerald-100', border: 'border-l-emerald-500', text: 'text-emerald-900' },
  'Massage': { bg: 'bg-teal-100', border: 'border-l-teal-500', text: 'text-teal-900' },
  'Fitness': { bg: 'bg-lime-100', border: 'border-l-lime-600', text: 'text-lime-900' },
  
  // Hair Removal
  'Waxing': { bg: 'bg-yellow-100', border: 'border-l-yellow-500', text: 'text-yellow-900' },
  
  // Other
  'Other': { bg: 'bg-zinc-100', border: 'border-l-zinc-500', text: 'text-zinc-900' },
};

function BookingCard({ 
  booking, 
  onDrop,
  onCheckout,
  view
}: { 
  booking: Booking; 
  onDrop: (id: string, masterId: string, time: string) => void;
  onCheckout: (booking: Booking) => void;
  view: 'day' | 'week' | 'month';
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { id: booking.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Get category colors based on category field (not service name)
  const categoryColors = SERVICE_CATEGORY_COLORS[booking.category || ''] || {
    bg: 'bg-gray-100',
    border: 'border-l-gray-500',
    text: 'text-gray-900'
  };

  const statusBadges = {
    paid: 'bg-green-500 text-white',
    deposit: 'bg-yellow-500 text-white',
    unpaid: 'bg-red-500 text-white'
  };

  const statusLabels = {
    paid: 'Paid',
    deposit: 'Dep',
    unpaid: 'Unpaid'
  };

  if (view === 'month') {
    return (
      <div
        ref={drag}
        className={`${categoryColors.bg} ${categoryColors.border} border-l-4 rounded p-1 mb-0.5 cursor-move text-[10px] ${
          isDragging ? 'opacity-50' : 'opacity-100'
        }`}
      >
        <div className={`font-medium truncate ${categoryColors.text}`}>{booking.startTime} {booking.clientName}</div>
      </div>
    );
  }

  return (
    <div
      ref={drag}
      className={`${categoryColors.bg} ${categoryColors.border} border-l-4 rounded-lg p-2 mb-1 cursor-move hover:shadow-md transition-shadow group relative ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
      style={{
        height: view === 'day' ? `${booking.duration * 60}px` : 'auto',
        minHeight: view === 'day' ? '60px' : 'auto'
      }}
    >
      <div className="flex items-start justify-between mb-1">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`font-semibold text-sm truncate ${categoryColors.text}`}>
              {booking.clientName}
            </span>
          </div>
          <div className={`text-xs truncate ${categoryColors.text} opacity-80`}>{booking.service}</div>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadges[booking.status]}`}>
          {statusLabels[booking.status]}
        </span>
      </div>
      <div className={`text-xs opacity-70 ${categoryColors.text}`}>{booking.startTime}</div>
      
      {(booking.status === 'unpaid' || booking.status === 'deposit') && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCheckout(booking);
          }}
          className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-purple-600 hover:bg-purple-700 text-white text-xs px-2 py-1 rounded flex items-center gap-1"
        >
          <CreditCard className="w-3 h-3" />
          Check Out
        </button>
      )}
    </div>
  );
}

function TimeSlot({ 
  time, 
  masterId, 
  bookings,
  onDrop,
  onCheckout,
  view,
  date
}: { 
  time: string; 
  masterId: string; 
  bookings: Booking[];
  onDrop: (bookingId: string, masterId: string, time: string) => void;
  onCheckout: (booking: Booking) => void;
  view: 'day' | 'week' | 'month';
  date?: string;
}) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ITEM_TYPE,
    drop: (item: { id: string }) => {
      onDrop(item.id, masterId, time);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const slotBookings = bookings.filter(
    b => b.masterId === masterId && b.startTime === time && (!date || b.date === date)
  );

  return (
    <div
      ref={drop}
      className={`border-r border-gray-200 transition-colors ${
        isOver ? 'bg-purple-50' : 'hover:bg-gray-50'
      }`}
      style={{ 
        minHeight: view === 'day' ? '15px' : view === 'week' ? '60px' : '80px',
        height: view === 'day' ? '15px' : 'auto'
      }}
    >
      {slotBookings.map(booking => (
        <BookingCard key={booking.id} booking={booking} onDrop={onDrop} onCheckout={onCheckout} view={view} />
      ))}
    </div>
  );
}

export function CalendarTab({ onNewBooking }: CalendarTabProps) {
  const [view, setView] = useState<'day' | 'week' | 'month'>('day');
  const [currentDate, setCurrentDate] = useState(new Date(2024, 10, 15));
  const [checkoutBooking, setCheckoutBooking] = useState<Booking | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isBookAppointmentOpen, setIsBookAppointmentOpen] = useState(false);
  const [isServiceDetailsOpen, setIsServiceDetailsOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const { currency } = useCurrency();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const generate15MinuteSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 19; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        slots.push(time);
      }
    }
    slots.push('20:00');
    return slots;
  };

  const timeSlots = generate15MinuteSlots();

  const getCurrentTimePosition = () => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    if (hours < 9 || hours >= 20) return null;
    const minutesSince9AM = (hours - 9) * 60 + minutes;
    return minutesSince9AM;
  };

  const currentTimePosition = getCurrentTimePosition();

  // Для демонстрации: 3 мастера
  const allMasters: Master[] = [
    { id: 'alice', name: 'Alice', role: 'Stylist', avatar: '👩‍🦰' },
    { id: 'bob', name: 'Bob', role: 'Barber', avatar: '👨‍🦱' },
    { id: 'elena', name: 'Elena', role: 'Nail Tech', avatar: '👩‍🦳' }
  ];

  const masters = allMasters;

  const services = [
    { id: 'haircut', name: 'Haircut', duration: 60, price: 65 },
    { id: 'beard', name: 'Beard Trim', duration: 30, price: 25 },
    { id: 'manicure', name: 'Manicure', duration: 60, price: 45 },
    { id: 'pedicure', name: 'Pedicure', duration: 75, price: 55 },
    { id: 'coloring', name: 'Hair Coloring', duration: 120, price: 120 },
    { id: 'styling', name: 'Hair Styling', duration: 45, price: 40 }
  ];

  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      clientName: 'Sarah J.',
      service: 'Haircut',
      startTime: '10:00',
      duration: 1,
      status: 'deposit',
      masterId: 'alice',
      date: '2024-11-15',
      category: 'Hair stylist'
    },
    {
      id: '2',
      clientName: 'Mike T.',
      service: 'Beard Trim',
      startTime: '12:00',
      duration: 0.5,
      status: 'paid',
      masterId: 'bob',
      date: '2024-11-15',
      category: 'Barber'
    },
    {
      id: '3',
      clientName: 'Jessica W.',
      service: 'Manicure',
      startTime: '14:00',
      duration: 1,
      status: 'unpaid',
      masterId: 'elena',
      date: '2024-11-15',
      category: 'Manicure'
    },
    {
      id: '4',
      clientName: 'Anna K.',
      service: 'Eyelash Extensions',
      startTime: '11:00',
      duration: 1.5,
      status: 'paid',
      masterId: 'alice',
      date: '2024-11-15',
      category: 'Eyelashes'
    },
    {
      id: '5',
      clientName: 'Tom B.',
      service: 'Spa Treatment',
      startTime: '15:30',
      duration: 2,
      status: 'deposit',
      masterId: 'elena',
      date: '2024-11-15',
      category: 'Spa'
    }
  ]);

  const handleDrop = (bookingId: string, masterId: string, time: string) => {
    setBookings(prev => 
      prev.map(b => 
        b.id === bookingId 
          ? { ...b, masterId, startTime: time }
          : b
      )
    );
  };

  const handleCheckout = (booking: Booking) => {
    setCheckoutBooking(booking);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutComplete = (paymentMethod: string, total: number) => {
    if (checkoutBooking) {
      setBookings(prev =>
        prev.map(b =>
          b.id === checkoutBooking.id
            ? { ...b, status: 'paid' as const }
            : b
        )
      );
    }
    alert(`✅ Payment completed!\n\nClient: ${checkoutBooking?.clientName}\nTotal: $${total.toFixed(2)}\nMethod: ${paymentMethod}`);
    setIsCheckoutOpen(false);
    setCheckoutBooking(null);
  };

  const handleNewBookingConfirm = (bookingData: any) => {
    const newBookings = bookingData.bookings.map((item: any) => ({
      id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      clientName: bookingData.clientName,
      service: item.serviceName,
      startTime: item.time,
      duration: item.duration / 60,
      status: 'unpaid' as const,
      masterId: item.masterId || masters[0].id,
      date: item.date
    }));
    setBookings(prev => [...prev, ...newBookings]);
    alert(
      `✅ Booking Confirmed!\n\n` +
      `Client: ${bookingData.clientName}\n` +
      `Phone: ${bookingData.clientPhone}\n` +
      `Services: ${bookingData.bookings.length}\n` +
      `Total: $${bookingData.bookings.reduce((sum: number, b: any) => sum + b.price, 0).toFixed(2)}\n\n` +
      `📱 Confirmation sent via WhatsApp/SMS\n` +
      `🔔 Reminders set for 24h and 1h before appointment`
    );
    setIsBookAppointmentOpen(false);
  };

  const formatDate = (date: Date) => {
    if (view === 'day') {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'long', 
        day: 'numeric',
        year: 'numeric' 
      });
    } else if (view === 'week') {
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      });
    }
  };

  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getWeekDays = () => {
    const days = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const days = [];

    for (let i = 0; i < startDay; i++) {
      const prevDate = new Date(year, month, -startDay + i + 1);
      days.push({ date: prevDate, isCurrentMonth: false });
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }

    return days;
  };

  const useCarousel = masters.length > 10;
  const masterColumnWidth = useCarousel ? 'auto' : `${100 / masters.length}%`;

  const renderDayView = () => {
    if (useCarousel) {
      const sliderSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 10,
        slidesToScroll: 5,
        arrows: true,
        responsive: [
          { breakpoint: 1920, settings: { slidesToShow: 10, slidesToScroll: 5 } },
          { breakpoint: 1440, settings: { slidesToShow: 7, slidesToScroll: 3 } },
          { breakpoint: 1024, settings: { slidesToShow: 5, slidesToScroll: 2 } },
          { breakpoint: 768, settings: { slidesToShow: 3, slidesToScroll: 1 } }
        ]
      };

      return (
        <div className="relative">
          <div className="border-b border-gray-200 bg-gray-50 flex">
            <div className="w-20 flex-shrink-0 p-3 font-medium text-xs text-gray-500 border-r border-gray-200">
              TIME
            </div>
            <div className="flex-1">
              <Slider {...sliderSettings}>
                {masters.map(master => (
                  <div key={master.id} className="px-2">
                    <div className="p-3 text-center border-r border-gray-200">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-xl">
                          {master.avatar}
                        </div>
                        <div className="font-semibold text-xs text-gray-900 truncate w-full">
                          {master.name}
                        </div>
                        <div className="text-[10px] text-gray-500 truncate w-full">
                          {master.role}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>

          <div className="relative">
            {currentTimePosition !== null && (
              <div className="absolute left-0 right-0 z-10 pointer-events-none" style={{ top: `${currentTimePosition}px` }}>
                <div className="flex items-center">
                  <div className="w-20 flex items-center justify-end pr-2">
                    <div className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </div>
                  </div>
                  <div className="flex-1 h-0.5 bg-red-500 relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full" />
                  </div>
                </div>
              </div>
            )}

            <div className={isFullscreen ? "overflow-y-auto h-full" : "overflow-y-auto max-h-[600px]"}>
              {timeSlots.map((time) => {
                const isHourMark = time.endsWith(':00');
                const isHalfHourMark = time.endsWith(':30');
                
                return (
                  <div 
                    key={time} 
                    className="flex" 
                    style={{ 
                      height: '15px',
                      borderTop: isHourMark 
                        ? '1px solid #d1d5db' 
                        : isHalfHourMark 
                        ? '1px solid #e5e7eb' 
                        : '1px solid #f3f4f6'
                    }}
                  >
                    <div className="w-20 flex-shrink-0 border-r border-gray-200 bg-gray-50">
                      {(isHourMark || isHalfHourMark) && (
                        <div className={`text-[11px] font-medium px-2 -mt-2 ${isHourMark ? 'text-gray-700' : 'text-gray-500'}`}>
                          {time}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 flex">
                      {masters.map(master => (
                        <div key={`${time}-${master.id}`} style={{ width: masterColumnWidth }}>
                          <TimeSlot time={time} masterId={master.id} bookings={bookings} onDrop={handleDrop} onCheckout={handleCheckout} view="day" />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="relative">
          <div className="border-b border-gray-200 bg-gray-50 flex">
            <div className="w-20 flex-shrink-0 p-3 font-medium text-xs text-gray-500 border-r border-gray-200">
              TIME
            </div>
            <div className="flex-1 flex">
              {masters.map(master => (
                <div key={master.id} style={{ width: masterColumnWidth }} className="border-r border-gray-200">
                  <div className="p-3 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-xl">
                        {master.avatar}
                      </div>
                      <div className="font-semibold text-xs text-gray-900 truncate w-full">
                        {master.name}
                      </div>
                      <div className="text-[10px] text-gray-500 truncate w-full">
                        {master.role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            {currentTimePosition !== null && (
              <div className="absolute left-0 right-0 z-10 pointer-events-none" style={{ top: `${currentTimePosition}px` }}>
                <div className="flex items-center">
                  <div className="w-20 flex items-center justify-end pr-2">
                    <div className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </div>
                  </div>
                  <div className="flex-1 h-0.5 bg-red-500 relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full" />
                  </div>
                </div>
              </div>
            )}

            <div className={isFullscreen ? "overflow-y-auto h-full" : "overflow-y-auto max-h-[600px]"}>
              {timeSlots.map((time) => {
                const isHourMark = time.endsWith(':00');
                const isHalfHourMark = time.endsWith(':30');
                
                return (
                  <div 
                    key={time} 
                    className="flex" 
                    style={{ 
                      height: '15px',
                      borderTop: isHourMark 
                        ? '1px solid #d1d5db' 
                        : isHalfHourMark 
                        ? '1px solid #e5e7eb' 
                        : '1px solid #f3f4f6'
                    }}
                  >
                    <div className="w-20 flex-shrink-0 border-r border-gray-200 bg-gray-50">
                      {(isHourMark || isHalfHourMark) && (
                        <div className={`text-[11px] font-medium px-2 -mt-2 ${isHourMark ? 'text-gray-700' : 'text-gray-500'}`}>
                          {time}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 flex">
                      {masters.map(master => (
                        <div key={`${time}-${master.id}`} style={{ width: masterColumnWidth }}>
                          <TimeSlot time={time} masterId={master.id} bookings={bookings} onDrop={handleDrop} onCheckout={handleCheckout} view="day" />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays();
    const hourSlots = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

    return (
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50">
            <div className="p-3 text-xs font-medium text-gray-500">TIME</div>
            {weekDays.map((day, idx) => (
              <div key={idx} className="p-3 text-center border-l border-gray-200">
                <div className="font-semibold text-sm text-gray-900">
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-xs text-gray-600">
                  {day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>

          <div className={isFullscreen ? "overflow-y-auto h-full" : "overflow-y-auto max-h-[600px]"}>
            {hourSlots.map((time) => (
              <div key={time} className="grid grid-cols-8 border-b border-gray-100">
                <div className="p-2 text-xs font-medium text-gray-600 border-r border-gray-200 bg-gray-50">
                  {time}
                </div>
                {weekDays.map((day, idx) => {
                  const dateStr = day.toISOString().split('T')[0];
                  const dayBookings = bookings.filter(b => b.date === dateStr && b.startTime === time);
                  return (
                    <div key={idx} className="p-2 border-l border-gray-200 min-h-[60px]">
                      {dayBookings.map(booking => (
                        <BookingCard key={booking.id} booking={booking} onDrop={handleDrop} onCheckout={handleCheckout} view="week" />
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const monthDays = getMonthDays();
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div>
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
          {weekDays.map(day => (
            <div key={day} className="p-3 text-center font-medium text-sm text-gray-700">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {monthDays.map(({ date, isCurrentMonth }, idx) => {
            const dateStr = date.toISOString().split('T')[0];
            const dayBookings = bookings.filter(b => b.date === dateStr);
            const isToday = date.toDateString() === new Date().toDateString();

            return (
              <div
                key={idx}
                className={`min-h-[100px] p-2 border-r border-b border-gray-200 ${
                  !isCurrentMonth ? 'bg-gray-50' : 'bg-white'
                } ${isToday ? 'ring-2 ring-purple-500 ring-inset' : ''}`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  !isCurrentMonth ? 'text-gray-400' : isToday ? 'text-purple-600' : 'text-gray-900'
                }`}>
                  {date.getDate()}
                </div>
                <div className="space-y-0.5">
                  {dayBookings.map(booking => (
                    <BookingCard key={booking.id} booking={booking} onDrop={handleDrop} onCheckout={handleCheckout} view="month" />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white flex flex-col' : 'space-y-4'}`}>
        <div className={`flex items-center justify-between ${isFullscreen ? 'p-6 pb-4 flex-shrink-0' : ''}`}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <span className="text-purple-600">📅</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Booking Calendar</h2>
            </div>
            
            <div className="flex items-center gap-2">
              <button onClick={goToPrevious} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <span className="text-sm font-medium text-gray-700 min-w-[200px] text-center">
                {formatDate(currentDate)}
              </span>
              <button onClick={goToNext} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button onClick={() => setView('day')} className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${view === 'day' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
                Day
              </button>
              <button onClick={() => setView('week')} className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${view === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
                Week
              </button>
              <button onClick={() => setView('month')} className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${view === 'month' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
                Month
              </button>
            </div>

            <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsFullscreen(!isFullscreen)}>
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>

            <Button onClick={() => setIsBookAppointmentOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
              <Plus className="w-4 h-4" />
              New Booking
            </Button>
          </div>
        </div>

        <div className={`${isFullscreen ? 'flex-1 overflow-auto px-6' : ''}`}>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden h-full">
            {view === 'day' && renderDayView()}
            {view === 'week' && renderWeekView()}
            {view === 'month' && renderMonthView()}
          </div>
        </div>

        {!isFullscreen && (
          <div className="space-y-3">
            {/* Category Colors Legend - All 18 Categories */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <span className="text-gray-700 font-semibold text-sm">Service Categories:</span>
                </div>
                <div className="grid grid-cols-6 gap-x-6 gap-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-pink-500 flex-shrink-0" />
                    <span className="text-gray-600 text-xs">Manicure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-orange-500 flex-shrink-0" />
                    <span className="text-gray-600 text-xs">Pedicure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-purple-500 flex-shrink-0" />
                    <span className="text-gray-600 text-xs">Eyelashes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-amber-600 flex-shrink-0" />
                    <span className="text-gray-600 text-xs">Brow</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-500 flex-shrink-0" />
                    <span className="text-gray-600 text-xs">Barber</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-indigo-500 flex-shrink-0" />
                    <span className="text-gray-600 text-xs">Hair Stylist</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-cyan-500 flex-shrink-0" />
                    <span className="text-gray-600 text-xs">Cosmetology</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-rose-500 flex-shrink-0" />
                    <span className="text-gray-600 text-xs">Facial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-500 flex-shrink-0" />
                    <span className="text-gray-600 text-xs">Laser</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-fuchsia-500 flex-shrink-0" />
                    <span className="text-gray-600 text-xs">Make up</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-slate-600 flex-shrink-0" />
                    <span className="text-gray-600 text-xs">Tattoo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gray-500 flex-shrink-0" />
                    <span className="text-gray-600 text-xs">Piercing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-violet-500 flex-shrink-0" />
                    <span className="text-gray-600 text-xs">PMU</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-emerald-500 flex-shrink-0" />
                    <span className="text-gray-600 text-xs">Spa</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-teal-500 flex-shrink-0" />
                    <span className="text-gray-600 text-xs">Massage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-lime-600 flex-shrink-0" />
                    <span className="text-gray-600 text-xs">Fitness</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-yellow-500 flex-shrink-0" />
                    <span className="text-gray-600 text-xs">Waxing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-zinc-500 flex-shrink-0" />
                    <span className="text-gray-600 text-xs">Other</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Payment Status & Tips */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-4">
                <span className="text-gray-700 font-medium">Payment Status:</span>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-500" />
                  <span className="text-gray-600">Paid</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-yellow-500" />
                  <span className="text-gray-600">Deposit</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-500" />
                  <span className="text-gray-600">Unpaid</span>
                </div>
              </div>
              
              <div className="text-gray-500 border-l border-gray-300 pl-6">💡 Drag bookings to reschedule</div>
            </div>
          </div>
        )}
      </div>

      {checkoutBooking && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => {
            setIsCheckoutOpen(false);
            setCheckoutBooking(null);
          }}
          orderId={checkoutBooking.id}
          clientName={checkoutBooking.clientName}
          initialItems={[{ id: checkoutBooking.id, name: checkoutBooking.service, price: 65, type: 'service' }]}
          onComplete={handleCheckoutComplete}
        />
      )}

      <BookAppointmentModal
        isOpen={isBookAppointmentOpen}
        onClose={() => setIsBookAppointmentOpen(false)}
        salonName="Glamour Downtown"
        masters={masters}
        services={services}
        existingBookings={bookings.map(b => ({
          masterId: b.masterId,
          date: b.date,
          time: b.startTime,
          duration: b.duration * 60
        }))}
        onConfirm={handleNewBookingConfirm}
      />
    </DndProvider>
  );
}