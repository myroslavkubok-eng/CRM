// Utility functions for managing salon availability and time slots

export interface TimeSlot {
  date: string; // YYYY-MM-DD format
  time: string; // HH:MM format (24h)
  available: boolean;
  staffId?: string;
}

export interface AvailableDay {
  date: string;
  dayName: string;
  slots: TimeSlot[];
}

/**
 * Generate available time slots for a salon
 * @param daysAhead - Number of days to generate slots for
 * @param startHour - Opening hour (24h format)
 * @param endHour - Closing hour (24h format)
 * @param slotDuration - Duration of each slot in minutes
 * @param occupancyRate - Percentage of slots that are already booked (0-1)
 */
export function generateTimeSlots(
  daysAhead: number = 7,
  startHour: number = 9,
  endHour: number = 20,
  slotDuration: number = 30,
  occupancyRate: number = 0.5 // 50% booked by default
): AvailableDay[] {
  const days: AvailableDay[] = [];
  const today = new Date();

  for (let dayOffset = 0; dayOffset < daysAhead; dayOffset++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + dayOffset);
    
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
    
    const slots: TimeSlot[] = [];
    
    // Generate slots for the day
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // Skip past time slots for today
        if (dayOffset === 0) {
          const now = new Date();
          const slotTime = new Date(currentDate);
          slotTime.setHours(hour, minute);
          if (slotTime <= now) {
            continue;
          }
        }
        
        // Randomly mark slots as available/unavailable based on occupancy rate
        const isAvailable = Math.random() > occupancyRate;
        
        slots.push({
          date: dateStr,
          time: timeStr,
          available: isAvailable,
        });
      }
    }
    
    days.push({
      date: dateStr,
      dayName,
      slots,
    });
  }
  
  return days;
}

/**
 * Get next available slot for a salon
 */
export function getNextAvailableSlot(availableDays: AvailableDay[]): TimeSlot | null {
  for (const day of availableDays) {
    const availableSlot = day.slots.find(slot => slot.available);
    if (availableSlot) {
      return availableSlot;
    }
  }
  return null;
}

/**
 * Get all available slots for today
 */
export function getTodayAvailableSlots(availableDays: AvailableDay[]): TimeSlot[] {
  const today = new Date().toISOString().split('T')[0];
  const todayData = availableDays.find(day => day.date === today);
  return todayData ? todayData.slots.filter(slot => slot.available) : [];
}

/**
 * Get count of available slots for a specific day
 */
export function getAvailableSlotsCount(availableDays: AvailableDay[], date?: string): number {
  if (date) {
    const dayData = availableDays.find(day => day.date === date);
    return dayData ? dayData.slots.filter(slot => slot.available).length : 0;
  }
  
  // Count all available slots
  return availableDays.reduce((total, day) => {
    return total + day.slots.filter(slot => slot.available).length;
  }, 0);
}

/**
 * Get next 3 available time slots
 */
export function getNextThreeSlots(availableDays: AvailableDay[]): TimeSlot[] {
  const availableSlots: TimeSlot[] = [];
  
  for (const day of availableDays) {
    for (const slot of day.slots) {
      if (slot.available) {
        availableSlots.push(slot);
        if (availableSlots.length === 3) {
          return availableSlots;
        }
      }
    }
  }
  
  return availableSlots;
}

/**
 * Format time slot for display
 */
export function formatTimeSlot(slot: TimeSlot): string {
  const date = new Date(slot.date);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  const isToday = date.toDateString() === today.toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();
  
  let dateStr = '';
  if (isToday) {
    dateStr = 'Today';
  } else if (isTomorrow) {
    dateStr = 'Tomorrow';
  } else {
    dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  
  return `${dateStr} at ${slot.time}`;
}

/**
 * Check if salon has available slots
 */
export function hasAvailableSlots(availableDays: AvailableDay[]): boolean {
  if (!availableDays || !Array.isArray(availableDays)) return false;
  
  return availableDays.some(day => 
    day.slots.some(slot => slot.available)
  );
}

/**
 * Get salon availability summary
 */
export function getAvailabilitySummary(availableDays: AvailableDay[]): {
  hasSlots: boolean;
  nextSlot: TimeSlot | null;
  todayCount: number;
  tomorrowCount: number;
  totalCount: number;
} {
  if (!availableDays || !Array.isArray(availableDays)) {
    return {
      hasSlots: false,
      nextSlot: null,
      todayCount: 0,
      tomorrowCount: 0,
      totalCount: 0,
    };
  }
  
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  
  return {
    hasSlots: hasAvailableSlots(availableDays),
    nextSlot: getNextAvailableSlot(availableDays),
    todayCount: getAvailableSlotsCount(availableDays, today),
    tomorrowCount: getAvailableSlotsCount(availableDays, tomorrowStr),
    totalCount: getAvailableSlotsCount(availableDays),
  };
}