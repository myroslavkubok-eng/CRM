import { useState } from 'react';
import { RefreshCw, Calendar, Clock, User, Sparkles, Check } from 'lucide-react';
import { Button } from './ui/button';
import { useCurrency } from '../../contexts/CurrencyContext';
import { toast } from 'sonner';

interface PastBooking {
  id: string;
  date: string;
  services: {
    id: string;
    name: string;
    price: number;
    duration: number;
  }[];
  master: {
    id: string;
    name: string;
    avatar: string;
  };
  salon: {
    id: string;
    name: string;
  };
  totalPrice: number;
  totalDuration: number;
  masterNotes?: string;
}

interface RepeatBookingButtonProps {
  lastBooking?: PastBooking;
  onRepeatBooking: (booking: PastBooking) => void;
  variant?: 'default' | 'compact' | 'large';
  className?: string;
}

export function RepeatBookingButton({ 
  lastBooking, 
  onRepeatBooking,
  variant = 'default',
  className = ''
}: RepeatBookingButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { formatPrice } = useCurrency();

  if (!lastBooking) return null;

  const handleRepeatBooking = async () => {
    setIsLoading(true);
    
    // Simulate finding similar time slot
    setTimeout(() => {
      toast.success('Finding similar time slot...', {
        description: 'We\'re looking for the best time for you!',
      });
      
      setTimeout(() => {
        onRepeatBooking(lastBooking);
        setIsLoading(false);
        toast.success('Booking repeated!', {
          description: `${lastBooking.services.length} service(s) with ${lastBooking.master.name}`,
        });
      }, 1500);
    }, 800);
  };

  // Compact variant - just a button
  if (variant === 'compact') {
    return (
      <Button
        onClick={handleRepeatBooking}
        disabled={isLoading}
        size="sm"
        className={`bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white ${className}`}
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Finding slot...
          </>
        ) : (
          <>
            <RefreshCw className="w-4 h-4 mr-2" />
            Repeat Last Visit
          </>
        )}
      </Button>
    );
  }

  // Large variant - full card with details
  if (variant === 'large') {
    return (
      <div className={`bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 ${className}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">Repeat Last Visit</h3>
              <p className="text-sm text-gray-600">Book the same services again</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {formatPrice(lastBooking.totalPrice)}
            </div>
            <div className="text-xs text-gray-500">{lastBooking.totalDuration} min</div>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          {/* Services */}
          <div className="bg-white rounded-lg p-3">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Services</div>
            <div className="space-y-1">
              {lastBooking.services.map((service) => (
                <div key={service.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-900">{service.name}</span>
                  </div>
                  <span className="text-gray-600">{formatPrice(service.price)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Master */}
          <div className="bg-white rounded-lg p-3">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Master</div>
            <div className="flex items-center gap-3">
              <img
                src={lastBooking.master.avatar}
                alt={lastBooking.master.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="font-medium text-gray-900">{lastBooking.master.name}</div>
                <div className="text-xs text-gray-500">Same master as before</div>
              </div>
            </div>
          </div>

          {/* Last visit date */}
          <div className="bg-white rounded-lg p-3">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Previous Visit</div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Calendar className="w-4 h-4 text-purple-500" />
              <span>{new Date(lastBooking.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>

          {/* Master notes */}
          {lastBooking.masterNotes && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">Master's Notes</div>
              <p className="text-sm text-amber-900 italic">"{lastBooking.masterNotes}"</p>
            </div>
          )}
        </div>

        <Button
          onClick={handleRepeatBooking}
          disabled={isLoading}
          className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Finding Perfect Time Slot...
            </>
          ) : (
            <>
              <RefreshCw className="w-5 h-5 mr-2" />
              Repeat This Booking
            </>
          )}
        </Button>

        <p className="text-xs text-center text-gray-500 mt-3">
          We'll find a similar time slot for you
        </p>
      </div>
    );
  }

  // Default variant - collapsible card
  return (
    <div className={`bg-white rounded-xl border-2 border-purple-200 overflow-hidden transition-all ${className}`}>
      {/* Header - always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-purple-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <div className="font-bold text-gray-900">Repeat Last Visit</div>
            <div className="text-xs text-gray-500">
              {lastBooking.services.length} service(s) • {formatPrice(lastBooking.totalPrice)}
            </div>
          </div>
        </div>
        <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="space-y-3 mt-3">
            {/* Services list */}
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Services</div>
              {lastBooking.services.map((service) => (
                <div key={service.id} className="flex items-center justify-between py-1 text-sm">
                  <span className="text-gray-700">{service.name}</span>
                  <span className="text-gray-900 font-medium">{formatPrice(service.price)}</span>
                </div>
              ))}
            </div>

            {/* Master */}
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
              <User className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-gray-700">with {lastBooking.master.name}</span>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-gray-700">{lastBooking.totalDuration} minutes</span>
            </div>

            <Button
              onClick={handleRepeatBooking}
              disabled={isLoading}
              className="w-full mt-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Finding slot...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Book Again
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
