/**
 * Booking Workflow System
 * 
 * Professional 2-way confirmation system:
 * - Client books → Salon confirms
 * - Salon reschedules → Client confirms
 * - Real-time calendar sync
 * - Conflict prevention
 * - Auto-decline timer
 */

/**
 * Booking Status
 */
export type BookingStatus = 
  | 'pending'                 // ⏳ Waiting for salon confirmation
  | 'confirmed'               // ✅ Salon confirmed
  | 'rescheduled_pending'     // 📅 Salon changed time, waiting for client
  | 'declined_by_salon'       // ❌ Salon declined
  | 'cancelled_by_client'     // ❌ Client cancelled
  | 'cancelled_by_salon'      // ❌ Salon cancelled
  | 'completed'               // ✅ Service completed
  | 'no_show'                 // ❌ Client didn't show up
  | 'expired';                // ⏰ Auto-declined (no response)

/**
 * Calendar Slot Status
 */
export type CalendarSlotStatus = 
  | 'available'      // ✅ Free
  | 'temp_hold'      // ⏳ Pending booking (temporary hold)
  | 'confirmed'      // 🔒 Confirmed booking
  | 'blocked';       // ❌ Master unavailable

/**
 * Status Change Actor
 */
export type StatusChangeActor = 
  | 'client'
  | 'salon'
  | 'master'
  | 'system';  // Auto-actions

/**
 * Booking Status History Entry
 */
export interface BookingStatusHistory {
  id: string;
  status: BookingStatus;
  timestamp: Date;
  changedBy: StatusChangeActor;
  actorId: string;           // user/salon/master ID
  actorName: string;         // Display name
  reason?: string;           // Reason for change
  previousTime?: Date;       // For reschedules
  newTime?: Date;            // For reschedules
  previousMasterId?: string; // If master changed
  newMasterId?: string;
  notes?: string;
}

/**
 * Booking with Full Workflow Data
 */
export interface BookingWithWorkflow {
  id: string;
  
  // Basic info
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  isNewClient: boolean;
  
  salonId: string;
  salonName: string;
  
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number; // minutes
  
  masterId: string;
  masterName: string;
  
  // Timing
  requestedDateTime: Date;  // Original request
  confirmedDateTime?: Date; // After salon confirms
  startTime: Date;          // Current scheduled time
  endTime: Date;
  
  // Status
  status: BookingStatus;
  statusHistory: BookingStatusHistory[];
  
  // Calendar sync
  calendarSlotStatus: CalendarSlotStatus;
  tempHoldExpiresAt?: Date; // When temp hold expires (30 min)
  
  // Confirmation
  confirmationRequired: boolean;
  confirmationDeadline?: Date; // 2 hours from creation
  confirmedAt?: Date;
  confirmedBy?: string;
  
  // Reschedule data
  rescheduleRequest?: {
    requestedBy: 'salon' | 'client';
    requestedAt: Date;
    originalDateTime: Date;
    newDateTime: Date;
    reason: string;
    expiresAt: Date; // 24 hours to respond
  };
  
  // Payment
  depositPaid: boolean;
  depositAmount: number;
  totalAmount: number;
  remainingAmount: number;
  
  // Decline data
  declineReason?: string;
  declinedAt?: Date;
  declinedBy?: StatusChangeActor;
  
  // Cancellation
  cancellationReason?: string;
  cancelledAt?: Date;
  cancelledBy?: StatusChangeActor;
  refundAmount?: number;
  
  // No-show
  noShowMarkedAt?: Date;
  noShowPenalty?: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Salon Confirmation Action
 */
export interface SalonConfirmationAction {
  bookingId: string;
  action: 'confirm' | 'decline' | 'reschedule';
  
  // For decline
  declineReason?: string;
  suggestedAlternatives?: {
    dateTime: Date;
    masterId: string;
    masterName: string;
  }[];
  
  // For reschedule
  newDateTime?: Date;
  newMasterId?: string;
  rescheduleReason?: string;
  
  // Actor
  actorId: string;
  actorName: string;
}

/**
 * Client Response to Reschedule
 */
export interface ClientRescheduleResponse {
  bookingId: string;
  action: 'accept' | 'decline';
  
  // For decline
  declineReason?: string;
  requestRefund: boolean;
}

/**
 * Calendar Conflict Check Result
 */
export interface CalendarConflictCheck {
  hasConflict: boolean;
  conflictType?: 'confirmed' | 'temp_hold' | 'blocked';
  conflictingBookingId?: string;
  conflictingBookingClient?: string;
  suggestedAlternatives: {
    dateTime: Date;
    masterId: string;
    masterName: string;
    available: boolean;
  }[];
}

/**
 * Auto-Decline Configuration
 */
export interface AutoDeclineConfig {
  enabled: boolean;
  timeoutMinutes: number;        // Default: 120 (2 hours)
  sendReminderAt: number;        // Minutes before timeout (60 min)
  autoRefundOnDecline: boolean;  // Full refund
  notifySalon: boolean;
}

/**
 * Booking Notification
 */
export interface BookingNotification {
  id: string;
  bookingId: string;
  recipientType: 'client' | 'salon' | 'master';
  recipientId: string;
  
  type: 
    | 'booking_created'           // New booking request
    | 'booking_confirmed'         // Salon confirmed
    | 'booking_declined'          // Salon declined
    | 'booking_reschedule_request' // Reschedule request
    | 'booking_reschedule_accepted' // Accepted reschedule
    | 'booking_reschedule_declined' // Declined reschedule
    | 'booking_cancelled'         // Cancelled
    | 'booking_reminder'          // Upcoming appointment
    | 'booking_no_show'           // Marked as no-show
    | 'confirmation_reminder'     // Reminder to confirm
    | 'auto_decline_warning';     // About to auto-decline
  
  title: string;
  message: string;
  actionUrl?: string;
  
  // Real-time
  sentAt: Date;
  readAt?: Date;
  dismissed: boolean;
  
  // Channels
  channels: ('app' | 'email' | 'sms' | 'push')[];
}

/**
 * Pending Bookings Summary for Salon
 */
export interface PendingBookingsSummary {
  total: number;
  urgent: number; // Expiring in < 30 min
  conflicts: number; // Has calendar conflicts
  byMaster: {
    masterId: string;
    masterName: string;
    count: number;
  }[];
}

/**
 * Client Booking View
 */
export interface ClientBookingView {
  booking: BookingWithWorkflow;
  
  // UI helpers
  statusLabel: string;
  statusColor: 'green' | 'yellow' | 'red' | 'gray';
  statusIcon: string;
  
  canCancel: boolean;
  canReschedule: boolean;
  
  // Actions available
  availableActions: {
    type: 'cancel' | 'accept_reschedule' | 'decline_reschedule' | 'contact_salon';
    label: string;
    variant: 'primary' | 'secondary' | 'danger';
  }[];
  
  // Countdown
  showCountdown: boolean;
  countdownLabel?: string;
  countdownExpiresAt?: Date;
}

/**
 * Salon Booking View
 */
export interface SalonBookingView {
  booking: BookingWithWorkflow;
  
  // UI helpers
  isPending: boolean;
  isUrgent: boolean; // < 30 min until auto-decline
  hasConflict: boolean;
  
  conflictDetails?: CalendarConflictCheck;
  
  // Master availability
  masterAvailable: boolean;
  masterOtherBookings: {
    startTime: Date;
    endTime: Date;
    clientName: string;
  }[];
  
  // Actions
  canConfirm: boolean;
  canDecline: boolean;
  canReschedule: boolean;
  
  // Countdown
  autoDeclineIn?: number; // minutes
}

/**
 * Default configurations
 */
export const DEFAULT_AUTO_DECLINE_CONFIG: AutoDeclineConfig = {
  enabled: true,
  timeoutMinutes: 120, // 2 hours
  sendReminderAt: 60,  // 1 hour before timeout
  autoRefundOnDecline: true,
  notifySalon: true,
};

export const TEMP_HOLD_DURATION_MINUTES = 30;
export const RESCHEDULE_RESPONSE_DEADLINE_HOURS = 24;

/**
 * Helper: Get status label and color
 */
export function getBookingStatusDisplay(status: BookingStatus): {
  label: string;
  color: 'green' | 'yellow' | 'red' | 'gray';
  icon: string;
} {
  switch (status) {
    case 'pending':
      return {
        label: 'Pending Confirmation',
        color: 'yellow',
        icon: '⏳',
      };
    case 'confirmed':
      return {
        label: 'Confirmed',
        color: 'green',
        icon: '✅',
      };
    case 'rescheduled_pending':
      return {
        label: 'Reschedule Request',
        color: 'yellow',
        icon: '📅',
      };
    case 'declined_by_salon':
      return {
        label: 'Declined by Salon',
        color: 'red',
        icon: '❌',
      };
    case 'cancelled_by_client':
      return {
        label: 'Cancelled',
        color: 'gray',
        icon: '❌',
      };
    case 'cancelled_by_salon':
      return {
        label: 'Cancelled by Salon',
        color: 'red',
        icon: '❌',
      };
    case 'completed':
      return {
        label: 'Completed',
        color: 'green',
        icon: '✅',
      };
    case 'no_show':
      return {
        label: 'No Show',
        color: 'red',
        icon: '❌',
      };
    case 'expired':
      return {
        label: 'Expired',
        color: 'gray',
        icon: '⏰',
      };
    default:
      return {
        label: 'Unknown',
        color: 'gray',
        icon: '❓',
      };
  }
}

/**
 * Helper: Check if booking can be cancelled
 */
export function canCancelBooking(booking: BookingWithWorkflow): boolean {
  return ['pending', 'confirmed', 'rescheduled_pending'].includes(booking.status);
}

/**
 * Helper: Check if booking can be rescheduled
 */
export function canRescheduleBooking(booking: BookingWithWorkflow): boolean {
  return ['confirmed'].includes(booking.status);
}

/**
 * Helper: Get time until auto-decline
 */
export function getTimeUntilAutoDecline(booking: BookingWithWorkflow): number | null {
  if (booking.status !== 'pending' || !booking.confirmationDeadline) {
    return null;
  }
  
  const now = new Date();
  const deadline = new Date(booking.confirmationDeadline);
  const diffMs = deadline.getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  return diffMinutes > 0 ? diffMinutes : 0;
}

/**
 * Helper: Check if booking is urgent (< 30 min until auto-decline)
 */
export function isBookingUrgent(booking: BookingWithWorkflow): boolean {
  const timeUntil = getTimeUntilAutoDecline(booking);
  return timeUntil !== null && timeUntil < 30;
}

/**
 * Helper: Format time remaining
 */
export function formatTimeRemaining(minutes: number): string {
  if (minutes < 1) {
    return 'Less than 1 minute';
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  
  return `${mins} minutes`;
}
