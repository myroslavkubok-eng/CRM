import { useState, useEffect } from 'react';
import { Bell, ChevronLeft, ChevronRight, Plus, Clock, User, AlertCircle, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { QuickRetailCheckout } from './QuickRetailCheckout';
import {
  BookingWithWorkflow,
  getBookingStatusDisplay,
  getTimeUntilAutoDecline,
  isBookingUrgent,
} from '../types/bookingWorkflow';

interface Master {
  id: string;
  name: string;
  avatar: string;
  role: string;
  color: string;
}

interface CalendarEvent {
  id: string;
  clientName: string;
  service: string;
  startTime: string;
  duration: number;
  masterId: string;
  status: 'pending' | 'confirmed' | 'unpaid' | 'deposit';
  color: string;
}

interface BookingCalendarProps {
  salonId: string;
  masters: Master[];
  events: CalendarEvent[];
  pendingBookings: BookingWithWorkflow[];
  onEventClick: (event: CalendarEvent) => void;
  onNewBooking: () => void;
  onPendingClick: () => void;
}

export function BookingCalendar({
  salonId,
  masters,
  events,
  pendingBookings,
  onEventClick,
  onNewBooking,
  onPendingClick,
}: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('day');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Time slots (9:00 - 19:00)
  const timeSlots = Array.from({ length: 21 }, (_, i) => {
    const hour = Math.floor(9 + i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

  // Count pending bookings by urgency
  const urgentCount = pendingBookings.filter(b => isBookingUrgent(b)).length;
  const totalPendingCount = pendingBookings.length;

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Navigate date
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  // Get events for specific time slot and master
  const getEventsForSlot = (time: string, masterId: string) => {
    return events.filter(event => {
      const eventTime = event.startTime.split('T')[1]?.substring(0, 5) || event.startTime;
      return eventTime === time && event.masterId === masterId;
    });
  };

  // Calculate event height based on duration
  const getEventHeight = (duration: number) => {
    // Each 30-min slot is ~40px
    return (duration / 30) * 40;
  };

  // Get status badge
  const getStatusBadge = (status: CalendarEvent['status']) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500 text-white text-xs">⏳ Pending</Badge>;
      case 'confirmed':
        return <Badge className="bg-green-500 text-white text-xs">✅ Paid</Badge>;
      case 'unpaid':
        return <Badge className="bg-red-500 text-white text-xs">❌ Unpaid</Badge>;
      case 'deposit':
        return <Badge className="bg-orange-500 text-white text-xs">💰 Dep</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
            📅
          </div>
          <h2 className="text-xl font-bold text-gray-900">Booking Calendar</h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Pending notifications */}
          {totalPendingCount > 0 && (
            <button
              onClick={onPendingClick}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className={`w-6 h-6 ${urgentCount > 0 ? 'text-red-600 animate-pulse' : 'text-gray-600'}`} />
              <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                urgentCount > 0 ? 'bg-red-600 animate-bounce' : 'bg-yellow-500'
              }`}>
                {totalPendingCount}
              </div>
            </button>
          )}

          {/* Date navigation */}
          <div className="flex items-center gap-2">
            <Button
              onClick={() => navigateDate('prev')}
              variant="outline"
              size="sm"
              className="w-8 h-8 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="min-w-[250px] text-center font-semibold text-gray-900">
              {formatDate(currentDate)}
            </div>
            <Button
              onClick={() => navigateDate('next')}
              variant="outline"
              size="sm"
              className="w-8 h-8 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* View toggles */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('day')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                view === 'day' ? 'bg-white text-purple-600 shadow' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                view === 'week' ? 'bg-white text-purple-600 shadow' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setView('month')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                view === 'month' ? 'bg-white text-purple-600 shadow' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Month
            </button>
          </div>

          {/* Full screen toggle */}
          <Button variant="outline" size="sm" className="w-8 h-8 p-0">
            ⛶
          </Button>

          {/* New booking */}
          <Button
            onClick={onNewBooking}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white gap-2"
          >
            <Plus className="w-4 h-4" />
            New Booking
          </Button>
        </div>
      </div>

      {/* Pending bookings alert */}
      {totalPendingCount > 0 && (
        <div
          onClick={onPendingClick}
          className={`mx-4 mt-4 p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
            urgentCount > 0
              ? 'bg-red-50 border-red-200'
              : 'bg-yellow-50 border-yellow-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`flex-shrink-0 ${urgentCount > 0 ? 'animate-pulse' : ''}`}>
              <Bell className={`w-5 h-5 ${urgentCount > 0 ? 'text-red-600' : 'text-yellow-600'}`} />
            </div>
            <div className="flex-1">
              <div className={`font-semibold ${urgentCount > 0 ? 'text-red-900' : 'text-yellow-900'}`}>
                {urgentCount > 0 && `🚨 ${urgentCount} Urgent! `}
                {totalPendingCount} booking{totalPendingCount > 1 ? 's' : ''} waiting for confirmation
              </div>
              <div className={`text-sm ${urgentCount > 0 ? 'text-red-700' : 'text-yellow-700'}`}>
                {urgentCount > 0 
                  ? 'Some bookings will auto-decline soon. Click to review.'
                  : 'Click to review and confirm pending bookings.'
                }
              </div>
            </div>
            <ChevronRight className={urgentCount > 0 ? 'text-red-600' : 'text-yellow-600'} />
          </div>
        </div>
      )}

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto p-4">
        <div className="min-w-[900px]">
          {/* Masters header */}
          <div className="grid grid-cols-[80px_repeat(auto-fit,minmax(200px,1fr))] gap-2 mb-2">
            <div className="font-medium text-gray-700 text-sm">TIME</div>
            {masters.map((master) => (
              <div key={master.id} className="text-center">
                <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {master.avatar}
                  </div>
                  <div className="font-semibold text-gray-900 text-sm">{master.name}</div>
                  <div className="text-xs text-gray-600">{master.role}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Time slots */}
          <div className="space-y-0 border-t border-gray-200">
            {timeSlots.map((time, index) => (
              <div
                key={time}
                className={`grid grid-cols-[80px_repeat(auto-fit,minmax(200px,1fr))] gap-2 ${
                  index % 2 === 0 ? 'border-t border-gray-200' : ''
                }`}
                style={{ minHeight: '40px' }}
              >
                {/* Time label */}
                <div className="flex items-start pt-1 text-xs text-gray-600 font-medium">
                  {time}
                </div>

                {/* Master columns */}
                {masters.map((master) => {
                  const slotEvents = getEventsForSlot(time, master.id);
                  
                  return (
                    <div
                      key={`${time}-${master.id}`}
                      className="relative border-l border-gray-100 hover:bg-gray-50 transition-colors min-h-[40px]"
                    >
                      {slotEvents.map((event) => (
                        <div
                          key={event.id}
                          onClick={() => onEventClick(event)}
                          className="absolute inset-x-1 rounded-lg p-2 cursor-pointer hover:shadow-md transition-shadow border-l-4"
                          style={{
                            backgroundColor: `${event.color}20`,
                            borderLeftColor: event.color,
                            height: `${getEventHeight(event.duration)}px`,
                          }}
                        >
                          <div className="flex items-start justify-between mb-1">
                            <div className="font-semibold text-xs text-gray-900 truncate">
                              {event.clientName}
                            </div>
                            {getStatusBadge(event.status)}
                          </div>
                          <div className="text-xs text-gray-700 truncate">{event.service}</div>
                          <div className="text-xs text-gray-500 mt-1">{event.startTime}</div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="border-t border-gray-200 p-4">
        <div className="text-xs font-semibold text-gray-700 mb-2">Service Categories:</div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ec4899' }}></div>
            <span className="text-xs text-gray-600">Manicure</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f97316' }}></div>
            <span className="text-xs text-gray-600">Pedicure</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#a855f7' }}></div>
            <span className="text-xs text-gray-600">Eyelashes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
            <span className="text-xs text-gray-600">Brow</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
            <span className="text-xs text-gray-600">Barber</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#8b5cf6' }}></div>
            <span className="text-xs text-gray-600">Hair Stylist</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#06b6d4' }}></div>
            <span className="text-xs text-gray-600">Cosmetology</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ec4899' }}></div>
            <span className="text-xs text-gray-600">Facial</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#dc2626' }}></div>
            <span className="text-xs text-gray-600">Laser</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#c026d3' }}></div>
            <span className="text-xs text-gray-600">Make up</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#475569' }}></div>
            <span className="text-xs text-gray-600">Tattoo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#64748b' }}></div>
            <span className="text-xs text-gray-600">Piercing</span>
          </div>
        </div>
      </div>
    </div>
  );
}