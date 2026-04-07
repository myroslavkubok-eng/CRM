import { Resource } from '../components/ResourceManagementTab';

export interface Booking {
  id: string;
  service: string;
  startTime: string;
  duration: number;
  date: string;
  masterId: string;
}

export interface AvailabilityCheck {
  isAvailable: boolean;
  availableSlots: number;
  totalCapacity: number;
  conflictingBookings?: Booking[];
  message?: string;
}

/**
 * Check if a resource is available for a specific service at a given time
 */
export function checkResourceAvailability(
  resources: Resource[],
  existingBookings: Booking[],
  service: string,
  date: string,
  startTime: string,
  duration: number
): AvailabilityCheck {
  // Find resources that support this service
  const supportingResources = resources.filter(
    r => r.assignedServices.includes(service) && r.status === 'active'
  );

  // If no resources support this service, it's available (no restrictions)
  if (supportingResources.length === 0) {
    return {
      isAvailable: true,
      availableSlots: 999,
      totalCapacity: 999,
      message: 'No resource restrictions for this service'
    };
  }

  // Calculate total capacity for this service
  const totalCapacity = supportingResources.reduce((sum, r) => sum + r.quantity, 0);

  // Find overlapping bookings
  const overlappingBookings = findOverlappingBookings(
    existingBookings,
    supportingResources,
    date,
    startTime,
    duration
  );

  // Calculate available slots
  const usedSlots = overlappingBookings.length;
  const availableSlots = totalCapacity - usedSlots;

  return {
    isAvailable: availableSlots > 0,
    availableSlots: Math.max(0, availableSlots),
    totalCapacity,
    conflictingBookings: overlappingBookings,
    message: availableSlots > 0 
      ? `${availableSlots} of ${totalCapacity} slots available`
      : `All ${totalCapacity} slots are booked at this time`
  };
}

/**
 * Find bookings that overlap with the requested time slot
 */
function findOverlappingBookings(
  bookings: Booking[],
  resources: Resource[],
  date: string,
  startTime: string,
  duration: number
): Booking[] {
  const requestedStart = parseTime(startTime);
  const requestedEnd = requestedStart + duration;

  // Get all services supported by these resources
  const supportedServices = new Set(
    resources.flatMap(r => r.assignedServices)
  );

  return bookings.filter(booking => {
    // Only check bookings for the same date
    if (booking.date !== date) return false;

    // Only check bookings that use the same type of resource
    if (!supportedServices.has(booking.service)) return false;

    const bookingStart = parseTime(booking.startTime);
    const bookingEnd = bookingStart + booking.duration;

    // Check for time overlap
    return (requestedStart < bookingEnd && requestedEnd > bookingStart);
  });
}

/**
 * Parse time string (HH:MM) to minutes since midnight
 */
function parseTime(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Format minutes to HH:MM
 */
function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * Get all available time slots for a service on a specific date
 */
export function getAvailableTimeSlots(
  resources: Resource[],
  existingBookings: Booking[],
  service: string,
  date: string,
  workingHours: { start: string; end: string },
  slotDuration: number = 30
): string[] {
  const availableSlots: string[] = [];
  
  const startMinutes = parseTime(workingHours.start);
  const endMinutes = parseTime(workingHours.end);

  // Generate all possible time slots
  for (let time = startMinutes; time < endMinutes; time += slotDuration) {
    const timeString = formatTime(time);
    
    const availability = checkResourceAvailability(
      resources,
      existingBookings,
      service,
      date,
      timeString,
      slotDuration
    );

    if (availability.isAvailable) {
      availableSlots.push(timeString);
    }
  }

  return availableSlots;
}

/**
 * Get resource utilization statistics for a date range
 */
export function getResourceUtilization(
  resources: Resource[],
  bookings: Booking[],
  startDate: string,
  endDate: string
): {
  resourceId: string;
  resourceName: string;
  totalCapacity: number;
  usedSlots: number;
  utilizationRate: number;
}[] {
  return resources
    .filter(r => r.status === 'active')
    .map(resource => {
      // Count bookings that use this resource
      const relevantBookings = bookings.filter(
        b => resource.assignedServices.includes(b.service) &&
        b.date >= startDate &&
        b.date <= endDate
      );

      const totalCapacity = resource.quantity * 10; // Assuming 10 slots per day per resource
      const usedSlots = relevantBookings.length;
      const utilizationRate = (usedSlots / totalCapacity) * 100;

      return {
        resourceId: resource.id,
        resourceName: resource.name,
        totalCapacity,
        usedSlots,
        utilizationRate: Math.round(utilizationRate)
      };
    });
}

/**
 * Validate if a booking can be created without resource conflicts
 */
export function validateBooking(
  resources: Resource[],
  existingBookings: Booking[],
  newBooking: {
    service: string;
    date: string;
    startTime: string;
    duration: number;
  }
): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check resource availability
  const availability = checkResourceAvailability(
    resources,
    existingBookings,
    newBooking.service,
    newBooking.date,
    newBooking.startTime,
    newBooking.duration
  );

  if (!availability.isAvailable) {
    errors.push(
      `No available resources for ${newBooking.service} at ${newBooking.startTime}. ` +
      `All ${availability.totalCapacity} slots are booked.`
    );
  } else if (availability.availableSlots === 1) {
    warnings.push(
      `This is the last available slot for ${newBooking.service} at this time.`
    );
  } else if (availability.availableSlots <= 3) {
    warnings.push(
      `Only ${availability.availableSlots} slots remaining for this time.`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Suggest alternative time slots if the requested slot is unavailable
 */
export function suggestAlternativeSlots(
  resources: Resource[],
  existingBookings: Booking[],
  service: string,
  date: string,
  requestedTime: string,
  duration: number,
  workingHours: { start: string; end: string },
  maxSuggestions: number = 5
): string[] {
  const allAvailableSlots = getAvailableTimeSlots(
    resources,
    existingBookings,
    service,
    date,
    workingHours,
    30
  );

  if (allAvailableSlots.length === 0) {
    return [];
  }

  const requestedMinutes = parseTime(requestedTime);

  // Sort slots by proximity to requested time
  const sortedSlots = allAvailableSlots.sort((a, b) => {
    const diffA = Math.abs(parseTime(a) - requestedMinutes);
    const diffB = Math.abs(parseTime(b) - requestedMinutes);
    return diffA - diffB;
  });

  return sortedSlots.slice(0, maxSuggestions);
}
