import { useState, useEffect, useRef } from 'react';
import { X, Send, MapPin, Clock, DollarSign, Star, Sparkles, Bot, Calendar, ArrowRight, Check, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { mockSalons, Salon } from '../data/mockData';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useNavigate } from 'react-router-dom';
import { hasAvailableSlots, getAvailabilitySummary, formatTimeSlot } from '../utils/availabilityUtils';
import { City } from '../data/locations';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  salons?: Salon[];
  timestamp: Date;
}

interface AIBookingAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  userLocation?: string;
  userCity?: City;
}

// Selection state
interface SelectionState {
  services: string[];
  filters: string[];
  district?: string;
}

export function AIBookingAssistant({ isOpen, onClose, userLocation = 'Downtown Dubai', userCity }: AIBookingAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selection, setSelection] = useState<SelectionState>({ services: [], filters: [] });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selection]);

  // Reset selection when modal opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setSelection({ services: [], filters: [] });
      setTimeout(() => {
        const initialMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `👋 Hi! I'm AI Katia, your personal booking assistant.\n\nLet's find the perfect salon for you!\n\n🎯 Select one or more services below ⬇️`,
          timestamp: new Date(),
        };
        setMessages([initialMessage]);
      }, 500);
    }
  }, [isOpen]);

  const servicesList = [
    { id: 'manicure', label: 'Manicure', emoji: '💅', categories: ['manicure'] },
    { id: 'pedicure', label: 'Pedicure', emoji: '🦶', categories: ['pedicure'] },
    { id: 'haircut', label: 'Haircut', emoji: '✂️', categories: ['hairstylist'] },
    { id: 'brows', label: 'Brows', emoji: '👁️', categories: ['brow'] },
    { id: 'eyelashes', label: 'Eyelashes', emoji: '👀', categories: ['eyelashes'] },
    { id: 'massage', label: 'Massage', emoji: '💆', categories: ['massage'] },
    { id: 'barber', label: 'Barber', emoji: '💈', categories: ['barber'] },
    { id: 'cosmetology', label: 'Cosmetology', emoji: '💆‍♀️', categories: ['cosmetology'] },
    { id: 'laser', label: 'Laser', emoji: '✨', categories: ['laser'] },
    { id: 'makeup', label: 'Makeup', emoji: '💄', categories: ['makeup'] },
    { id: 'spa', label: 'SPA', emoji: '🧖', categories: ['spa'] },
    { id: 'pmu', label: 'PMU', emoji: '🎨', categories: ['pmu'] },
  ];

  const filtersList = [
    { id: 'nearby', label: 'Near me', emoji: '📍' },
    { id: 'today', label: 'Available today', emoji: '⚡' },
    { id: 'premium', label: 'Premium', emoji: '✨' },
    { id: 'cheap', label: 'Affordable', emoji: '💰' },
  ];

  // Toggle service selection
  const toggleService = (serviceId: string) => {
    setSelection(prev => {
      const services = prev.services.includes(serviceId)
        ? prev.services.filter(s => s !== serviceId)
        : [...prev.services, serviceId];
      return { ...prev, services };
    });
  };

  // Set filter
  const selectFilter = (filterId: 'nearby' | 'today' | 'cheap' | 'premium') => {
    setSelection(prev => {
      const filters = prev.filters.includes(filterId)
        ? prev.filters.filter(f => f !== filterId)
        : [...prev.filters, filterId];
      return { ...prev, filters };
    });
  };

  // Set district
  const selectDistrict = (districtName: string) => {
    setSelection(prev => ({
      ...prev,
      district: prev.district === districtName ? undefined : districtName
    }));
  };

  // Reset selection
  const resetSelection = () => {
    setSelection({ services: [], filters: [] });
    setMessages([]);
    setTimeout(() => {
      const initialMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `🔄 Let's start over!\n\n🎯 Select one or more services ⬇️`,
        timestamp: new Date(),
      };
      setMessages([initialMessage]);
    }, 300);
  };

  // Show salons based on selection
  const showSalons = () => {
    if (selection.services.length === 0) return;

    setIsTyping(true);
    setTimeout(() => {
      // Get all categories from selected services
      const selectedCategories = servicesList
        .filter(s => selection.services.includes(s.id))
        .flatMap(s => s.categories);

      // Start with all salons that have available slots
      let filteredSalons = mockSalons.filter(s => hasAvailableSlots(s.availableSlots));

      // Filter by services
      filteredSalons = filteredSalons.filter(salon =>
        salon.services.some(service =>
          selectedCategories.includes(service.category)
        )
      );

      // Apply filters (multiple can be active)
      if (selection.filters.includes('nearby')) {
        filteredSalons = filteredSalons
          .filter(s => s.distance <= 5.0);
      }
      
      if (selection.filters.includes('today')) {
        filteredSalons = filteredSalons.filter(s => {
          const availability = getAvailabilitySummary(s.availableSlots);
          return availability.todayCount > 0;
        });
      }
      
      if (selection.filters.includes('cheap')) {
        filteredSalons = filteredSalons
          .filter(s => s.priceFrom <= 50);
      }
      
      if (selection.filters.includes('premium')) {
        filteredSalons = filteredSalons.filter(s => s.isPremium);
      }

      // Sort by distance if nearby is selected, otherwise by price if cheap is selected
      if (selection.filters.includes('nearby')) {
        filteredSalons = filteredSalons.sort((a, b) => a.distance - b.distance);
      } else if (selection.filters.includes('cheap')) {
        filteredSalons = filteredSalons.sort((a, b) => a.priceFrom - b.priceFrom);
      }

      // Apply district filter
      if (selection.district) {
        filteredSalons = filteredSalons.filter(s => {
          // Extract just the district part from location (e.g., "Downtown Dubai, Dubai" -> "Downtown Dubai")
          const salonDistrict = s.location.split(',')[0].trim();
          return salonDistrict === selection.district;
        });
      }

      // Limit to top 4
      filteredSalons = filteredSalons.slice(0, 4);

      const servicesText = servicesList
        .filter(s => selection.services.includes(s.id))
        .map(s => s.label)
        .join(', ');

      const filtersText = selection.filters
        .map(f => filtersList.find(fl => fl.id === f)?.label)
        .filter(Boolean)
        .join(', ');

      const districtText = selection.district || userLocation;

      if (filteredSalons.length === 0) {
        addMessage(
          'assistant',
          `😔 I couldn't find any salons with the selected parameters:\n\n🎨 Services: ${servicesText}\n${filtersText ? `🔍 Filters: ${filtersText}\n` : ''}📍 District: ${districtText}\n\nTry changing your search parameters!`
        );
      } else {
        addMessage(
          'assistant',
          `🎉 Great! I found ${filteredSalons.length} ${filteredSalons.length === 1 ? 'salon' : 'salons'} for you:\n\n🎨 Services: ${servicesText}\n${filtersText ? `🔍 Filters: ${filtersText}\n` : ''}📍 District: ${districtText}\n\nChoose the one that suits you! ⬇️`,
          filteredSalons
        );
      }

      setIsTyping(false);
    }, 1000);
  };

  const addMessage = (role: 'assistant' | 'user', content: string, salons?: Salon[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      salons,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSalonSelect = (salon: Salon) => {
    navigate(`/salon/${salon.id}`, {
      state: {
        fromAI: true,
        aiRecommendation: true
      }
    });
    onClose();
  };

  // Check if can show salons
  const canShowSalons = selection.services.length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">AI Katia Assistant</h3>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-white/90">Online • Ready to help</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Selection Summary Bar */}
        {canShowSalons && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-3 border-b border-purple-200">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 flex items-center gap-3 flex-wrap text-sm">
                {/* Services */}
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 font-medium">Services:</span>
                  <div className="flex gap-1.5">
                    {servicesList
                      .filter(s => selection.services.includes(s.id))
                      .map(service => (
                        <span
                          key={service.id}
                          className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium"
                        >
                          {service.emoji} {service.label}
                        </span>
                      ))}
                  </div>
                </div>

                {/* Filter */}
                {selection.filters.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">•</span>
                    <div className="flex gap-1.5">
                      {selection.filters.map(filterId => {
                        const filter = filtersList.find(f => f.id === filterId);
                        return filter ? (
                          <span
                            key={filterId}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium"
                          >
                            {filter.emoji} {filter.label}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {/* District */}
                {selection.district && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">•</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                      📍 {selection.district}
                    </span>
                  </div>
                )}
              </div>

              {/* Reset Button */}
              <button
                onClick={resetSelection}
                className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-purple-50/30 to-white">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-3xl rounded-br-md'
                    : 'bg-white border border-gray-200 rounded-3xl rounded-bl-md'
                } px-5 py-3 shadow-sm`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-medium text-purple-600">AI Katia</span>
                  </div>
                )}
                <p className="whitespace-pre-line text-sm leading-relaxed">
                  {message.content}
                </p>

                {/* Salon Cards */}
                {message.salons && message.salons.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {message.salons.map((salon) => {
                      const availability = getAvailabilitySummary(salon.availableSlots);

                      return (
                        <div
                          key={salon.id}
                          className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-4 border border-purple-200 hover:shadow-lg transition-all cursor-pointer group"
                          onClick={() => handleSalonSelect(salon)}
                        >
                          <div className="flex gap-4">
                            {/* Salon Image */}
                            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                              <img
                                src={salon.image}
                                alt={salon.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                              />
                            </div>

                            {/* Salon Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h4 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                                  {salon.name}
                                </h4>
                                {salon.isPremium && (
                                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full flex-shrink-0">
                                    Premium
                                  </span>
                                )}
                              </div>

                              <div className="space-y-1.5 text-xs text-gray-600">
                                <div className="flex items-center gap-1.5">
                                  <MapPin className="w-3.5 h-3.5 text-purple-500" />
                                  <span>{salon.location} • {salon.distance}km</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                  <span className="font-medium text-gray-900">{salon.rating}</span>
                                  <span>({salon.reviewCount} reviews)</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <DollarSign className="w-3.5 h-3.5 text-green-500" />
                                  <span>From <span className="font-bold text-gray-900">{formatPrice(salon.priceFrom)}</span></span>
                                </div>
                                {availability.nextSlot && (
                                  <div className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                                    <span className="text-blue-600 font-medium">
                                      Next: {formatTimeSlot(availability.nextSlot)}
                                    </span>
                                  </div>
                                )}
                                {availability.todayCount > 0 && (
                                  <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-green-500" />
                                    <span className="text-green-600 font-medium">
                                      {availability.todayCount} slots today
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* View Button */}
                              <button className="mt-3 w-full px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs font-medium rounded-lg flex items-center justify-center gap-2 transition-all group-hover:shadow-md">
                                <span>View & Book</span>
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-3xl rounded-bl-md px-5 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Selection Panel */}
        <div className="px-6 py-4 bg-gradient-to-br from-gray-50 to-purple-50/30 border-t border-gray-200">
          {/* Step 1: Services */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                selection.services.length > 0 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {selection.services.length > 0 ? <Check className="w-4 h-4" /> : '1'}
              </div>
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Select services (multiple allowed)
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {servicesList.map((service) => (
                <button
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  className={`px-3 py-2 border rounded-lg text-xs font-medium transition-all shadow-sm hover:shadow-md ${
                    selection.services.includes(service.id)
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-transparent text-white'
                      : 'bg-white hover:bg-gray-50 border-purple-200 text-gray-700'
                  }`}
                >
                  {service.emoji} {service.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Filters (optional) */}
          {selection.services.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  selection.filters.length > 0 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {selection.filters.length > 0 ? <Check className="w-4 h-4" /> : '2'}
                </div>
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Filters (optional, multiple allowed)
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {filtersList.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => selectFilter(filter.id as any)}
                    className={`px-3 py-2 border rounded-lg text-xs font-medium transition-all shadow-sm hover:shadow-md ${
                      selection.filters.includes(filter.id)
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 border-transparent text-white'
                        : 'bg-white hover:bg-gray-50 border-blue-200 text-gray-700'
                    }`}
                  >
                    {filter.emoji} {filter.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: District (optional) */}
          {selection.services.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  selection.district ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {selection.district ? <Check className="w-4 h-4" /> : '3'}
                </div>
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  District {userCity?.name || ''} (optional)
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {userCity && userCity.districts.slice(0, 6).map((district) => (
                  <button
                    key={district.id}
                    onClick={() => selectDistrict(district.name)}
                    className={`px-3 py-2 border rounded-lg text-xs font-medium transition-all shadow-sm hover:shadow-md ${
                      selection.district === district.name
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-transparent text-white'
                        : 'bg-white hover:bg-gray-50 border-green-200 text-gray-700'
                    }`}
                  >
                    {district.emoji} {district.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Show Salons Button */}
          {canShowSalons && (
            <div className="pt-3 border-t border-gray-200">
              <Button
                onClick={showSalons}
                disabled={!canShowSalons}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Show Salons ({selection.services.length} {selection.services.length === 1 ? 'service' : 'services'})
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}