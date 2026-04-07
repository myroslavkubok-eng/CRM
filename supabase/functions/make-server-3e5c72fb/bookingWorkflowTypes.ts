/**
 * Backend types for Booking Workflow
 * Mirror of frontend types
 */

export type BookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'rescheduled_pending'
  | 'declined_by_salon'
  | 'cancelled_by_client'
  | 'cancelled_by_salon'
  | 'completed'
  | 'no_show'
  | 'expired';

export type CalendarSlotStatus = 
  | 'available'
  | 'temp_hold'
  | 'confirmed'
  | 'blocked';

export type StatusChangeActor = 
  | 'client'
  | 'salon'
  | 'master'
  | 'system';

export interface BookingStatusHistory {
  id: string;
  status: BookingStatus;
  timestamp: Date;
  changedBy: StatusChangeActor;
  actorId: string;
  actorName: string;
  reason?: string;
  previousTime?: Date;
  newTime?: Date;
  previousMasterId?: string;
  newMasterId?: string;
  notes?: string;
}

export interface BookingWithWorkflow {
  id: string;
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
  serviceDuration: number;
  masterId: string;
  masterName: string;
  requestedDateTime: Date;
  confirmedDateTime?: Date;
  startTime: Date;
  endTime: Date;
  status: BookingStatus;
  statusHistory: BookingStatusHistory[];
  calendarSlotStatus: CalendarSlotStatus;
  tempHoldExpiresAt?: Date;
  confirmationRequired: boolean;
  confirmationDeadline?: Date;
  confirmedAt?: Date;
  confirmedBy?: string;
  rescheduleRequest?: {
    requestedBy: 'salon' | 'client';
    requestedAt: Date;
    originalDateTime: Date;
    newDateTime: Date;
    reason: string;
    expiresAt: Date;
  };
  depositPaid: boolean;
  depositAmount: number;
  totalAmount: number;
  remainingAmount: number;
  declineReason?: string;
  declinedAt?: Date;
  declinedBy?: StatusChangeActor;
  cancellationReason?: string;
  cancelledAt?: Date;
  cancelledBy?: StatusChangeActor;
  refundAmount?: number;
  noShowMarkedAt?: Date;
  noShowPenalty?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SalonConfirmationAction {
  bookingId: string;
  action: 'confirm' | 'decline' | 'reschedule';
  declineReason?: string;
  suggestedAlternatives?: {
    dateTime: Date;
    masterId: string;
    masterName: string;
  }[];
  newDateTime?: Date;
  newMasterId?: string;
  rescheduleReason?: string;
  actorId: string;
  actorName: string;
}

export interface ClientRescheduleResponse {
  bookingId: string;
  action: 'accept' | 'decline';
  declineReason?: string;
  requestRefund: boolean;
}

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

export interface AutoDeclineConfig {
  enabled: boolean;
  timeoutMinutes: number;
  sendReminderAt: number;
  autoRefundOnDecline: boolean;
  notifySalon: boolean;
}

export const DEFAULT_AUTO_DECLINE_CONFIG: AutoDeclineConfig = {
  enabled: true,
  timeoutMinutes: 120,
  sendReminderAt: 60,
  autoRefundOnDecline: true,
  notifySalon: true,
};

export const TEMP_HOLD_DURATION_MINUTES = 30;
export const RESCHEDULE_RESPONSE_DEADLINE_HOURS = 24;
