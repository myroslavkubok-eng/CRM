import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Booking {
  id: string;
  clientName: string;
  clientPhone?: string;
  service: string;
  startTime: string; // Format: "10:00"
  duration: number; // in hours
  status: 'paid' | 'deposit' | 'unpaid' | 'upcoming';
  masterId: string;
  masterName?: string;
  date: string; // Format: "2024-11-15"
  category?: string;
  color?: string;
  price?: number;
  description?: string;
  discount?: number;
  originalPrice?: number;
  salonId?: string;
  salonName?: string;
  createdBy?: string; // e.g., "AI Agent Katia", "Owner", "Admin"
  createdAt?: string;
  workstationId?: string; // For workstation management
}

interface BookingsContextType {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  deleteBooking: (id: string) => void;
  getBookingsByDate: (date: Date) => Booking[];
  getBookingsByMaster: (masterId: string, date: Date) => Booking[];
  isTimeSlotAvailable: (masterId: string, date: Date, startTime: string, duration: number) => boolean;
  getAvailableTimeSlots: (masterId: string, date: Date, serviceDuration: number) => string[];
}

const BookingsContext = createContext<BookingsContextType | undefined>(undefined);

export function BookingsProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([
    // Sample bookings for demonstration
    {
      id: '1',
      clientName: 'Sarah J.',
      clientPhone: '+1 234 567 890',
      service: 'Haircut',
      startTime: '10:00',
      duration: 1,
      status: 'deposit',
      masterId: 'alice',
      masterName: 'Alice Johnson',
      date: '2024-11-15',
      category: 'Hair stylist',
      price: 65,
    },
    {
      id: '2',
      clientName: 'Mike T.',
      clientPhone: '+1 234 567 891',
      service: 'Beard Trim',
      startTime: '11:00',
      duration: 0.5,
      status: 'paid',
      masterId: 'bob',
      masterName: 'Bob Smith',
      date: '2024-11-15',
      category: 'Barber',
      price: 25,
    },
    {
      id: '3',
      clientName: 'Emma W.',
      clientPhone: '+1 234 567 892',
      service: 'Manicure',
      startTime: '14:00',
      duration: 1,
      status: 'unpaid',
      masterId: 'carol',
      masterName: 'Carol Davis',
      date: '2024-11-15',
      category: 'Manicure',
      price: 45,
    },
  ]);

  const addBooking = (booking: Booking) => {
    setBookings(prev => [...prev, booking]);
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings(prev =>
      prev.map(booking => (booking.id === id ? { ...booking, ...updates } : booking))
    );
  };

  const deleteBooking = (id: string) => {
    setBookings(prev => prev.filter(booking => booking.id !== id));
  };

  const getBookingsByDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return bookings.filter(booking => booking.date === dateStr);
  };

  const getBookingsByMaster = (masterId: string, date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return bookings.filter(
      booking => booking.masterId === masterId && booking.date === dateStr
    );
  };

  // Check if a time slot is available for a specific master
  const isTimeSlotAvailable = (
    masterId: string,
    date: Date,
    startTime: string,
    duration: number
  ): boolean => {
    const masterBookings = getBookingsByMaster(masterId, date);
    
    // Convert time to minutes for easier comparison
    const timeToMinutes = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const requestedStart = timeToMinutes(startTime);
    const requestedEnd = requestedStart + duration * 60;

    // Check if the requested slot overlaps with any existing booking
    for (const booking of masterBookings) {
      const bookingStart = timeToMinutes(booking.startTime);
      const bookingEnd = bookingStart + booking.duration * 60;

      // Check for overlap
      if (
        (requestedStart >= bookingStart && requestedStart < bookingEnd) ||
        (requestedEnd > bookingStart && requestedEnd <= bookingEnd) ||
        (requestedStart <= bookingStart && requestedEnd >= bookingEnd)
      ) {
        return false; // Slot is not available
      }
    }

    return true; // Slot is available
  };

  // Get all available time slots for a specific master on a specific date
  const getAvailableTimeSlots = (
    masterId: string,
    date: Date,
    serviceDuration: number
  ): string[] => {
    const availableSlots: string[] = [];
    const startHour = 9; // Salon opens at 9 AM
    const endHour = 20; // Salon closes at 8 PM
    const slotInterval = 15; // 15-minute intervals

    // Generate all possible time slots
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotInterval) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // Check if this slot can accommodate the service duration
        const slotMinutes = hour * 60 + minute;
        const serviceEndMinutes = slotMinutes + serviceDuration * 60;
        const endHourMinutes = endHour * 60;

        // Only add if service can be completed before salon closes
        if (serviceEndMinutes <= endHourMinutes) {
          if (isTimeSlotAvailable(masterId, date, timeStr, serviceDuration)) {
            // Format time for display (12-hour format)
            const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
            const period = hour >= 12 ? 'PM' : 'AM';
            const displayTime = `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
            availableSlots.push(displayTime);
          }
        }
      }
    }

    return availableSlots;
  };

  return (
    <BookingsContext.Provider
      value={{
        bookings,
        addBooking,
        updateBooking,
        deleteBooking,
        getBookingsByDate,
        getBookingsByMaster,
        isTimeSlotAvailable,
        getAvailableTimeSlots,
      }}
    >
      {children}
    </BookingsContext.Provider>
  );
}

export function useBookings() {
  const context = useContext(BookingsContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingsProvider');
  }
  return context;
}
