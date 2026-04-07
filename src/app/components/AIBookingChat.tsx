import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, X, Clock, Users, Calendar as CalendarIcon, Sparkles, MapPin, Phone, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useBookings } from '../../contexts/BookingsContext';
import { AuthModal } from './AuthModal';

interface AIBookingChatProps {
  salon: any;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: Date;
  type?: 'text' | 'category-buttons' | 'service-buttons' | 'date-buttons' | 'time-buttons' | 'staff-buttons' | 'confirm-buttons' | 'add-more-buttons';
  data?: any;
}

interface BookedServiceItem {
  service: any;
  staff: any;
  date: Date;
  time: string;
}

// Category display names and emojis
const CATEGORY_CONFIG: Record<string, { label: string; emoji: string }> = {
  hairstylist: { label: 'Haircuts & Styling', emoji: '✂️' },
  manicure: { label: 'Manicure', emoji: '💅' },
  pedicure: { label: 'Pedicure', emoji: '🦶' },
  facial: { label: 'Facial Care', emoji: '✨' },
  massage: { label: 'Massage', emoji: '💆' },
  makeup: { label: 'Makeup', emoji: '💄' },
  waxing: { label: 'Waxing', emoji: '🌟' },
  eyebrows: { label: 'Brows & Lashes', emoji: '👁️' },
};

export function AIBookingChat({ salon, onClose }: AIBookingChatProps) {
  const { formatPrice } = useCurrency();
  const { addBooking, getAvailableTimeSlots } = useBookings();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [bookedServices, setBookedServices] = useState<BookedServiceItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showCalendar, setShowCalendar] = useState('');
  const [currentMessageId, setCurrentMessageId] = useState<string>('');

  // Get unique categories from salon services
  const getCategories = () => {
    const categories = new Set<string>();
    salon.services.forEach((service: any) => {
      if (service.category) {
        categories.add(service.category);
      }
    });
    return Array.from(categories);
  };

  // Generate random number of people booking (1-3)
  const getRandomBookingCount = () => Math.floor(Math.random() * 3) + 1;

  // Generate time slots
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
  const bookedSlots = ['9:00 AM', '9:15 AM', '10:30 AM', '11:00 AM', '2:00 PM', '3:30 PM'];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial welcome message
  useEffect(() => {
    const categories = getCategories();
    const welcomeMessage: Message = {
      id: '1',
      sender: 'ai',
      text: `Welcome to ${salon.name}! 👋\n\nI'm AI Agent Katia and I can help you book services in one click.\n\nSelect a service category:`,
      timestamp: new Date(),
      type: 'category-buttons',
      data: categories
    };
    setMessages([welcomeMessage]);
  }, [salon]);

  // Add AI message with typing effect
  const addAIMessage = (text: string, type?: Message['type'], data?: any) => {
    setIsTyping(true);
    
    setTimeout(() => {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'ai',
        text,
        timestamp: new Date(),
        type,
        data
      };
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
    }, 1000);
  };

  // Add user message
  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    const categoryLabel = CATEGORY_CONFIG[category]?.label || category;
    addUserMessage(categoryLabel);

    const servicesInCategory = salon.services.filter((s: any) => s.category === category);
    addAIMessage(
      `Great! Select a service from the "${categoryLabel}" category:`,
      'service-buttons',
      servicesInCategory
    );
  };

  // Handle service selection
  const handleServiceSelect = (service: any) => {
    setSelectedService(service);
    addUserMessage(service.name);
    
    // Filter staff who can perform this service
    const availableStaff = salon.staff.filter((member: any) => 
      member.specialties && member.specialties.includes(service.name)
    );

    // Show message based on available staff
    const staffMessage = availableStaff.length > 0
      ? `Great! ${service.name} - ${formatPrice(service.price)}, ${service.duration} minutes.\n\nSelect a stylist:`
      : `Great! ${service.name} - ${formatPrice(service.price)}, ${service.duration} minutes.\n\nA stylist will be assigned automatically.\n\nSelect a date:`;

    if (availableStaff.length > 0) {
      addAIMessage(staffMessage, 'staff-buttons', availableStaff);
    } else {
      // If no staff specializes in this service, auto-assign and go to date selection
      setSelectedStaff(null);
      addAIMessage(staffMessage, 'date-buttons');
    }
  };

  // Handle staff selection
  const handleStaffSelect = (staff: any) => {
    setSelectedStaff(staff);
    addUserMessage(staff?.name || 'Any available stylist');

    addAIMessage(
      'Select a convenient date:',
      'date-buttons'
    );
  };

  // Handle date selection
  const handleDateSelect = (dateType: 'today' | 'tomorrow' | 'other', customDate?: Date) => {
    let dateText = '';
    let selectedDateObj: Date;

    if (dateType === 'today') {
      selectedDateObj = new Date();
      dateText = 'Today';
    } else if (dateType === 'tomorrow') {
      selectedDateObj = new Date();
      selectedDateObj.setDate(selectedDateObj.getDate() + 1);
      dateText = 'Tomorrow';
    } else if (customDate) {
      selectedDateObj = customDate;
      dateText = customDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    } else {
      return;
    }

    setSelectedDate(selectedDateObj);
    addUserMessage(dateText);

    // Get real available time slots from BookingsContext
    const masterId = selectedStaff?.id || salon.staff[0]?.id || 'any';
    const serviceDurationInHours = selectedService.duration / 60; // Convert minutes to hours
    
    const availableSlots = getAvailableTimeSlots(masterId, selectedDateObj, serviceDurationInHours);

    if (availableSlots.length === 0) {
      addAIMessage(
        `Sorry, there are no available slots for ${dateText.toLowerCase()}. Please try another date or select a different stylist.`,
        'date-buttons'
      );
    } else {
      addAIMessage(
        `✅ Found ${availableSlots.length} available slots on ${dateText.toLowerCase()}. Select a convenient time:`,
        'time-buttons',
        { availableSlots }
      );
    }
  };

  // Handle time selection
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    addUserMessage(time);

    // Add current service to booked services
    const newBooking: BookedServiceItem = {
      service: selectedService,
      staff: selectedStaff,
      date: selectedDate!,
      time: time
    };
    setBookedServices(prev => [...prev, newBooking]);

    // Ask if user wants to add more services
    addAIMessage(
      `Service "${selectedService.name}" added! ✅\n\nDo you want to add another service?`,
      'add-more-buttons'
    );
  };

  // Handle add more services
  const handleAddMore = (addMore: boolean) => {
    if (addMore) {
      addUserMessage('Yes, add another');
      
      // Reset current selections
      setSelectedCategory('');
      setSelectedService(null);
      setSelectedStaff(null);
      setSelectedDate(undefined);
      setSelectedTime('');

      const categories = getCategories();
      addAIMessage('Great! Select a category for the next service:', 'category-buttons', categories);
    } else {
      addUserMessage('No, finalize booking');
      showFinalSummary();
    }
  };

  // Show final summary with all bookings
  const showFinalSummary = () => {
    const totalPrice = bookedServices.reduce((sum, item) => sum + item.service.price, 0);
    
    let summary = `\n📋 Booking Details:\n\n`;
    summary += `📍 Salon: ${salon.name}\n`;
    summary += `📌 Address: ${salon.location}\n`;
    summary += ` Phone: ${salon.phone || '+1 (555) 123-4567'}\n\n`;
    
    summary += `📝 Booked Services:\n\n`;
    bookedServices.forEach((item, index) => {
      summary += `${index + 1}. ${item.service.name}\n`;
      summary += `   👤 ${item.staff?.name || 'Any available'}\n`;
      summary += `   📅 ${item.date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}\n`;
      summary += `   ⏰ ${item.time}\n`;
      summary += `   💰 ${formatPrice(item.service.price)}\n\n`;
    });
    
    summary += `💵 Total Price: ${formatPrice(totalPrice)}\n\n`;
    summary += `Confirm booking?`;

    addAIMessage(summary, 'confirm-buttons');
  };

  // Handle confirmation
  const handleConfirmBooking = (confirmed: boolean) => {
    if (confirmed) {
      addUserMessage('Yes, confirm');
      addAIMessage('Great! To finalize the booking, you need to log in.');
      
      // Save booking to localStorage
      setTimeout(() => {
        const bookingData = {
          id: `ai-booking-${Date.now()}`,
          salon: salon.name,
          salonId: salon.id,
          salonAddress: salon.location,
          salonPhone: salon.phone || '+1 (555) 123-4567',
          services: bookedServices,
          totalPrice: bookedServices.reduce((sum, item) => sum + item.service.price, 0),
          createdBy: 'AI Agent Katia',
          createdAt: new Date().toISOString(),
          chatHistory: messages,
          status: 'upcoming'
        };

        // Save to localStorage
        const existingBookings = JSON.parse(localStorage.getItem('aiBookings') || '[]');
        existingBookings.push(bookingData);
        localStorage.setItem('aiBookings', JSON.stringify(existingBookings));

        setShowAuthModal(true);
      }, 1000);
    } else {
      addUserMessage('No, change');
      
      // Reset everything
      setBookedServices([]);
      setSelectedCategory('');
      setSelectedService(null);
      setSelectedStaff(null);
      setSelectedDate(undefined);
      setSelectedTime('');

      const categories = getCategories();
      addAIMessage('Okay, let\'s start over. Select a service category:', 'category-buttons', categories);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h3 className="font-bold text-white">AI Agent Katia</h3>
              <p className="text-xs text-blue-100">Online • {salon.name}</p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div key={message.id}>
              {/* Message Bubble */}
              <div className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.sender === 'ai' && (
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <div className="w-full h-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  </Avatar>
                )}
                
                <div className={`max-w-[70%] ${message.sender === 'user' ? 'ml-auto' : ''}`}>
                  <div className={`rounded-2xl p-3 ${
                    message.sender === 'ai' 
                      ? 'bg-white border border-gray-200' 
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  }`}>
                    <p className="whitespace-pre-line text-sm">{message.text}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 px-2">
                    {message.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              {/* Category Buttons */}
              {message.sender === 'ai' && message.type === 'category-buttons' && (
                <div className="mt-3 ml-11 grid grid-cols-2 gap-2">
                  {message.data.map((category: string) => {
                    const config = CATEGORY_CONFIG[category] || { label: category, emoji: '📋' };
                    return (
                      <Button
                        key={category}
                        onClick={() => handleCategorySelect(category)}
                        variant="outline"
                        className="h-auto py-3 flex items-center justify-start gap-2 hover:border-purple-500 hover:bg-purple-50 whitespace-normal text-left"
                      >
                        <span className="text-2xl flex-shrink-0">{config.emoji}</span>
                        <span className="text-sm font-semibold break-words">{config.label}</span>
                      </Button>
                    );
                  })}
                </div>
              )}

              {/* Service Buttons */}
              {message.sender === 'ai' && message.type === 'service-buttons' && (
                <div className="mt-3 ml-11 space-y-2">
                  {message.data.map((service: any, index: number) => {
                    // Show booking indicator only on ~40% of services
                    const showBooking = Math.random() < 0.4;
                    const bookingCount = showBooking ? getRandomBookingCount() : 0;
                    return (
                      <Card
                        key={service.id}
                        className="p-2.5 hover:border-purple-500 transition-all cursor-pointer group relative overflow-hidden"
                        onClick={() => handleServiceSelect(service)}
                      >
                        {/* Live Indicator */}
                        {bookingCount > 0 && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-pink-500 text-white text-[10px] gap-1 px-2 py-0.5">
                              <div className="w-1 h-1 bg-white rounded-full animate-ping absolute left-1"></div>
                              <div className="w-1 h-1 bg-white rounded-full mr-1"></div>
                              {bookingCount} {bookingCount === 1 ? 'person' : bookingCount >= 2 && bookingCount <= 4 ? 'people' : 'people'} booking
                            </Badge>
                          </div>
                        )}

                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1 pr-2">
                            <h4 className="text-sm font-semibold group-hover:text-purple-600 transition-colors">
                              {service.name}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-gray-600 mt-0.5">
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
                            size="sm"
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-8 px-3 text-xs"
                          >
                            Select
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* Date Buttons */}
              {message.sender === 'ai' && message.type === 'date-buttons' && (
                <div className="mt-3 ml-11 space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      onClick={() => handleDateSelect('today')}
                      variant="outline"
                      className="h-auto py-3 flex flex-col gap-1 hover:border-purple-500"
                    >
                      <CalendarIcon className="w-4 h-4" />
                      <span className="text-sm font-semibold">Today</span>
                      <span className="text-xs text-gray-500">
                        {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                      </span>
                    </Button>
                    
                    <Button
                      onClick={() => handleDateSelect('tomorrow')}
                      variant="outline"
                      className="h-auto py-3 flex flex-col gap-1 hover:border-purple-500"
                    >
                      <CalendarIcon className="w-4 h-4" />
                      <span className="text-sm font-semibold">Tomorrow</span>
                      <span className="text-xs text-gray-500">
                        {new Date(Date.now() + 86400000).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                      </span>
                    </Button>
                    
                    <Button
                      onClick={() => {
                        setCurrentMessageId(message.id);
                        setShowCalendar(prev => prev === message.id ? '' : message.id);
                      }}
                      variant="outline"
                      className="h-auto py-3 flex flex-col gap-1 hover:border-purple-500"
                    >
                      <CalendarIcon className="w-4 h-4" />
                      <span className="text-sm font-semibold">Other date</span>
                      <span className="text-xs text-gray-500">Select</span>
                    </Button>
                  </div>

                  {/* Calendar Picker */}
                  {showCalendar === message.id && (
                    <Card className="p-3">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          if (date) {
                            handleDateSelect('other', date);
                            setShowCalendar('');
                          }
                        }}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                        className="rounded-md"
                      />
                    </Card>
                  )}
                </div>
              )}

              {/* Time Buttons */}
              {message.sender === 'ai' && message.type === 'time-buttons' && message.data?.availableSlots && (
                <div className="mt-3 ml-11 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 bg-white rounded-lg border">
                  {message.data.availableSlots.map((slot: string) => (
                    <Button
                      key={slot}
                      onClick={() => handleTimeSelect(slot)}
                      variant="outline"
                      size="sm"
                      className="hover:border-purple-500 hover:bg-purple-50 whitespace-nowrap text-xs"
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              )}

              {/* Staff Buttons */}
              {message.sender === 'ai' && message.type === 'staff-buttons' && (
                <div className="mt-3 ml-11 space-y-2">
                  <Card
                    className="p-2.5 hover:border-purple-500 transition-all cursor-pointer"
                    onClick={() => handleStaffSelect(null)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold">Any available stylist</h4>
                        <p className="text-xs text-gray-600">First available</p>
                      </div>
                    </div>
                  </Card>

                  {message.data.map((member: any) => (
                    <Card
                      key={member.id}
                      className="p-2.5 hover:border-purple-500 transition-all cursor-pointer"
                      onClick={() => handleStaffSelect(member)}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarImage src={member.image} alt={member.name} />
                          <AvatarFallback className="text-xs">{member.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold">{member.name}</h4>
                          <p className="text-xs text-gray-600">{member.role} • ⭐ {member.rating}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Add More Services Buttons */}
              {message.sender === 'ai' && message.type === 'add-more-buttons' && (
                <div className="mt-3 ml-11 grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => handleAddMore(true)}
                    variant="outline"
                    className="h-10 gap-2 border-purple-500 text-purple-600 hover:bg-purple-50"
                  >
                    <Plus className="w-4 h-4" />
                    Yes, add another
                  </Button>
                  
                  <Button
                    onClick={() => handleAddMore(false)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-10"
                  >
                    Finalize
                  </Button>
                </div>
              )}

              {/* Confirmation Buttons */}
              {message.sender === 'ai' && message.type === 'confirm-buttons' && (
                <div className="mt-3 ml-11 grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => handleConfirmBooking(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-10"
                  >
                    Yes, confirm
                  </Button>
                  
                  <Button
                    onClick={() => handleConfirmBooking(false)}
                    variant="outline"
                    className="border-purple-500 text-purple-600 hover:bg-purple-50 h-10"
                  >
                    No, change
                  </Button>
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <Avatar className="w-8 h-8">
                <div className="w-full h-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              </Avatar>
              <div className="bg-white border border-gray-200 rounded-2xl p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Footer Info */}
        <div className="border-t p-3 bg-white">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span>Booking through AI Agent Katia</span>
            {bookedServices.length > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {bookedServices.length} {bookedServices.length === 1 ? 'service' : 'services'}
              </Badge>
            )}
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
          console.log('Booking created by AI Agent Katia', bookedServices);
          navigate('/dashboard');
        }}
      />
    </div>
  );
}