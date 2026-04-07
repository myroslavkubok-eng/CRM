/**
 * Backend types for Deposit System
 * Mirror of frontend types for backend use
 */

export type DepositType = 
  | 'none'
  | 'fixed'
  | 'percentage';

export interface CancellationPolicy {
  enabled: boolean;
  fullRefundHours: number;
  partialRefundHours: number;
  partialRefundPercent: number;
  noShowRefund: boolean;
  noShowPenalty: number;
  allowReschedule: boolean;
  rescheduleHours: number;
  rescheduleLimit: number;
}

export interface SalonDepositSettings {
  salonId: string;
  depositEnabled: boolean;
  depositType: DepositType;
  fixedAmount?: number;
  percentageAmount?: number;
  minDepositAmount?: number;
  maxDepositAmount?: number;
  allowPayInSalon: boolean;
  allowFullPayment: boolean;
  requireDepositForNewClients: boolean;
  cancellationPolicy: CancellationPolicy;
  stripeConnected: boolean;
  stripeAccountId?: string;
  platformFeePercent: number;
  customMessage?: string;
  autoReminders: boolean;
  reminderHoursBefore: number[];
}

export interface PaymentOption {
  id: 'deposit' | 'in-salon' | 'full';
  label: string;
  amount: number;
  totalAmount: number;
  remainingAmount: number;
  recommended: boolean;
  enabled: boolean;
  disabledReason?: string;
  description: string;
  icon: string;
}

export interface BookingPayment {
  bookingId: string;
  salonId: string;
  totalAmount: number;
  depositAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentOption: 'deposit' | 'in-salon' | 'full';
  paymentStatus: 'pending' | 'deposit_paid' | 'fully_paid' | 'failed' | 'refunded';
  paymentIntentId?: string;
  chargeId?: string;
  refundId?: string;
  cancelled: boolean;
  cancelledAt?: Date;
  cancelReason?: string;
  refundAmount?: number;
  noShow: boolean;
  noShowAt?: Date;
  penaltyAmount?: number;
  createdAt: Date;
  paidAt?: Date;
  fullyPaidAt?: Date;
}

export interface StripeConnectOnboarding {
  salonId: string;
  ownerId: string;
  onboardingStatus: 'not_started' | 'in_progress' | 'completed' | 'failed';
  stripeAccountId?: string;
  onboardingUrl?: string;
  returnUrl: string;
  refreshUrl: string;
  accountEnabled: boolean;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  requirementsNeeded: string[];
  connectedAt?: Date;
  lastUpdated: Date;
}

export interface PlatformFeeSettings {
  enabled: boolean;
  feePercent: number;
  feeFixed?: number;
  chargeOnDeposit: boolean;
  chargeOnFullPayment: boolean;
  payoutSchedule: 'daily' | 'weekly' | 'monthly';
  minimumPayout: number;
}

export const DEFAULT_DEPOSIT_SETTINGS: SalonDepositSettings = {
  salonId: '',
  depositEnabled: false,
  depositType: 'fixed',
  fixedAmount: 50,
  percentageAmount: 20,
  minDepositAmount: 30,
  maxDepositAmount: 200,
  allowPayInSalon: true,
  allowFullPayment: true,
  requireDepositForNewClients: false,
  cancellationPolicy: {
    enabled: true,
    fullRefundHours: 24,
    partialRefundHours: 12,
    partialRefundPercent: 50,
    noShowRefund: false,
    noShowPenalty: 0,
    allowReschedule: true,
    rescheduleHours: 6,
    rescheduleLimit: 2,
  },
  stripeConnected: false,
  platformFeePercent: 3,
  autoReminders: true,
  reminderHoursBefore: [24, 6, 1],
};

// Helper functions (same as frontend)

export function calculateDeposit(
  totalAmount: number,
  settings: SalonDepositSettings
): number {
  if (!settings.depositEnabled) return 0;
  
  let deposit = 0;
  
  switch (settings.depositType) {
    case 'fixed':
      deposit = settings.fixedAmount || 0;
      break;
      
    case 'percentage':
      deposit = (totalAmount * (settings.percentageAmount || 0)) / 100;
      break;
      
    case 'none':
    default:
      deposit = 0;
  }
  
  if (settings.minDepositAmount && deposit < settings.minDepositAmount) {
    deposit = settings.minDepositAmount;
  }
  if (settings.maxDepositAmount && deposit > settings.maxDepositAmount) {
    deposit = settings.maxDepositAmount;
  }
  
  return Math.round(deposit * 100) / 100;
}

export function calculateRefund(
  payment: BookingPayment,
  settings: SalonDepositSettings,
  hoursBeforeAppointment: number,
  isNoShow: boolean = false
): number {
  const policy = settings.cancellationPolicy;
  
  if (isNoShow) {
    return policy.noShowRefund ? payment.paidAmount : 0;
  }
  
  if (hoursBeforeAppointment >= policy.fullRefundHours) {
    return payment.paidAmount;
  }
  
  if (hoursBeforeAppointment >= policy.partialRefundHours) {
    return (payment.paidAmount * policy.partialRefundPercent) / 100;
  }
  
  return 0;
}

export function canReschedule(
  booking: { 
    rescheduleCount: number;
    appointmentDate: Date;
  },
  settings: SalonDepositSettings
): { canReschedule: boolean; reason?: string } {
  const policy = settings.cancellationPolicy;
  
  if (!policy.allowReschedule) {
    return { canReschedule: false, reason: 'Rescheduling not allowed' };
  }
  
  if (booking.rescheduleCount >= policy.rescheduleLimit) {
    return { 
      canReschedule: false, 
      reason: `Maximum ${policy.rescheduleLimit} reschedules allowed` 
    };
  }
  
  const hoursUntilAppointment = 
    (booking.appointmentDate.getTime() - Date.now()) / (1000 * 60 * 60);
  
  if (hoursUntilAppointment < policy.rescheduleHours) {
    return { 
      canReschedule: false, 
      reason: `Must reschedule at least ${policy.rescheduleHours} hours before appointment` 
    };
  }
  
  return { canReschedule: true };
}
