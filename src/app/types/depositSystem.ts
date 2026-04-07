/**
 * Deposit & Payment System for Salon Bookings
 * 
 * КРИТИЧЕСКАЯ ФУНКЦИЯ для защиты от no-shows и fake bookings
 */

/**
 * Типы депозита
 */
export type DepositType = 
  | 'none'          // Депозит не требуется
  | 'fixed'         // Фиксированная сумма (AED 50)
  | 'percentage';   // Процент от стоимости (20%)

/**
 * Cancellation Policy (Политика отмены)
 */
export interface CancellationPolicy {
  enabled: boolean;
  
  // Временные рамки для возврата
  fullRefundHours: number;      // Полный возврат если отмена за X часов (24h)
  partialRefundHours: number;   // Частичный возврат если отмена за X часов (12h)
  partialRefundPercent: number; // Процент возврата (50%)
  
  // No-show policy
  noShowRefund: boolean;         // Возвращать ли при no-show (обычно false)
  noShowPenalty: number;         // Штраф за no-show (может быть > депозита)
  
  // Reschedule policy
  allowReschedule: boolean;      // Разрешить перенос
  rescheduleHours: number;       // За сколько часов можно перенести (6h)
  rescheduleLimit: number;       // Сколько раз можно переносить (2)
}

/**
 * Настройки депозита для салона
 */
export interface SalonDepositSettings {
  salonId: string;
  
  // Основные настройки
  depositEnabled: boolean;        // Требовать ли депозит
  depositType: DepositType;       // Тип депозита
  
  // Параметры депозита
  fixedAmount?: number;           // Для 'fixed' (AED 50)
  percentageAmount?: number;      // Для 'percentage' (20)
  minDepositAmount?: number;      // Минимальный депозит (AED 30)
  maxDepositAmount?: number;      // Максимальный депозит (AED 200)
  
  // Payment options для клиентов
  allowPayInSalon: boolean;       // Разрешить оплату на месте
  allowFullPayment: boolean;      // Разрешить полную оплату сразу
  requireDepositForNewClients: boolean; // Обязательный депозит для новых клиентов
  
  // Cancellation policy
  cancellationPolicy: CancellationPolicy;
  
  // Stripe Connect
  stripeConnected: boolean;       // Подключен ли Stripe
  stripeAccountId?: string;       // Stripe Connect Account ID
  platformFeePercent: number;     // Platform fee (3%)
  
  // Дополнительно
  customMessage?: string;         // Сообщение клиенту о депозите
  autoReminders: boolean;         // Автоматические напоминания
  reminderHoursBefore: number[];  // За сколько часов напоминать [24, 6, 1]
}

/**
 * Payment Option для отображения клиенту
 */
export interface PaymentOption {
  id: 'deposit' | 'in-salon' | 'full';
  label: string;
  amount: number;                 // Сколько платить сейчас
  totalAmount: number;            // Общая стоимость услуги
  remainingAmount: number;        // Сколько платить потом
  recommended: boolean;           // Рекомендуемый вариант
  enabled: boolean;               // Доступен ли (может быть отключен)
  disabledReason?: string;        // Почему отключен
  description: string;            // Описание для клиента
  icon: string;                   // Иконка
}

/**
 * Booking Payment Info
 */
export interface BookingPayment {
  bookingId: string;
  salonId: string;
  
  // Суммы
  totalAmount: number;            // Общая стоимость
  depositAmount: number;          // Размер депозита
  paidAmount: number;             // Уже оплачено
  remainingAmount: number;        // Осталось оплатить
  
  // Payment method
  paymentOption: 'deposit' | 'in-salon' | 'full';
  paymentStatus: 'pending' | 'deposit_paid' | 'fully_paid' | 'failed' | 'refunded';
  
  // Stripe info
  paymentIntentId?: string;       // Stripe Payment Intent
  chargeId?: string;              // Stripe Charge ID
  refundId?: string;              // Stripe Refund ID (если был возврат)
  
  // Cancellation
  cancelled: boolean;
  cancelledAt?: Date;
  cancelReason?: string;
  refundAmount?: number;          // Сумма возврата
  
  // No-show
  noShow: boolean;
  noShowAt?: Date;
  penaltyAmount?: number;         // Штраф за no-show
  
  // Timestamps
  createdAt: Date;
  paidAt?: Date;
  fullyPaidAt?: Date;
}

/**
 * Stripe Connect Onboarding
 */
export interface StripeConnectOnboarding {
  salonId: string;
  ownerId: string;
  
  // Onboarding status
  onboardingStatus: 'not_started' | 'in_progress' | 'completed' | 'failed';
  stripeAccountId?: string;
  
  // Onboarding URLs
  onboardingUrl?: string;         // Stripe onboarding link
  returnUrl: string;              // После успешной настройки
  refreshUrl: string;             // Если нужно вернуться
  
  // Account info
  accountEnabled: boolean;        // Может ли принимать платежи
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  
  // Requirements (что нужно заполнить)
  requirementsNeeded: string[];   // ['identity_document', 'bank_account', ...]
  
  // Timestamps
  connectedAt?: Date;
  lastUpdated: Date;
}

/**
 * Platform Fee Settings
 */
export interface PlatformFeeSettings {
  enabled: boolean;
  feePercent: number;             // 3% от транзакции
  feeFixed?: number;              // + фиксированная сумма (AED 2)
  
  // Fee calculation
  chargeOnDeposit: boolean;       // Брать fee с депозита
  chargeOnFullPayment: boolean;   // Брать fee с полной оплаты
  
  // Payout schedule
  payoutSchedule: 'daily' | 'weekly' | 'monthly';
  minimumPayout: number;          // Минимальная сумма для выплаты (AED 100)
}

/**
 * Helper: Calculate deposit amount
 */
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
  
  // Apply min/max limits
  if (settings.minDepositAmount && deposit < settings.minDepositAmount) {
    deposit = settings.minDepositAmount;
  }
  if (settings.maxDepositAmount && deposit > settings.maxDepositAmount) {
    deposit = settings.maxDepositAmount;
  }
  
  return Math.round(deposit * 100) / 100; // Round to 2 decimals
}

/**
 * Helper: Generate payment options for booking
 */
export function generatePaymentOptions(
  totalAmount: number,
  settings: SalonDepositSettings,
  isNewClient: boolean = false
): PaymentOption[] {
  const depositAmount = calculateDeposit(totalAmount, settings);
  
  const options: PaymentOption[] = [];
  
  // Option 1: Pay Deposit Only
  if (settings.depositEnabled && depositAmount > 0) {
    options.push({
      id: 'deposit',
      label: 'Pay Deposit',
      amount: depositAmount,
      totalAmount,
      remainingAmount: totalAmount - depositAmount,
      recommended: true,
      enabled: true,
      description: `Secure your booking with a ${settings.depositType === 'fixed' ? `AED ${depositAmount}` : `${settings.percentageAmount}%`} deposit. Pay the rest at the salon.`,
      icon: '💳',
    });
  }
  
  // Option 2: Pay in Salon
  const canPayInSalon = settings.allowPayInSalon && 
                       (!settings.requireDepositForNewClients || !isNewClient);
  
  options.push({
    id: 'in-salon',
    label: 'Pay at Salon',
    amount: 0,
    totalAmount,
    remainingAmount: totalAmount,
    recommended: false,
    enabled: canPayInSalon,
    disabledReason: !canPayInSalon 
      ? 'Deposit required for new clients' 
      : undefined,
    description: canPayInSalon
      ? 'No payment required now. Pay the full amount when you visit the salon.'
      : 'This salon requires a deposit to secure your booking.',
    icon: '🏪',
  });
  
  // Option 3: Pay Full Amount
  if (settings.allowFullPayment) {
    options.push({
      id: 'full',
      label: 'Pay Full Amount',
      amount: totalAmount,
      totalAmount,
      remainingAmount: 0,
      recommended: false,
      enabled: true,
      description: 'Pay the full amount now and skip payment at the salon.',
      icon: '✅',
    });
  }
  
  return options;
}

/**
 * Helper: Calculate refund amount based on cancellation time
 */
export function calculateRefund(
  payment: BookingPayment,
  settings: SalonDepositSettings,
  hoursBeforeAppointment: number,
  isNoShow: boolean = false
): number {
  const policy = settings.cancellationPolicy;
  
  // No-show - no refund (usually)
  if (isNoShow) {
    return policy.noShowRefund ? payment.paidAmount : 0;
  }
  
  // Full refund if cancelled early enough
  if (hoursBeforeAppointment >= policy.fullRefundHours) {
    return payment.paidAmount;
  }
  
  // Partial refund if within partial refund window
  if (hoursBeforeAppointment >= policy.partialRefundHours) {
    return (payment.paidAmount * policy.partialRefundPercent) / 100;
  }
  
  // Too late - no refund
  return 0;
}

/**
 * Helper: Check if can reschedule
 */
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

/**
 * Default settings для нового салона
 */
export const DEFAULT_DEPOSIT_SETTINGS: SalonDepositSettings = {
  salonId: '',
  
  // Deposit disabled by default
  depositEnabled: false,
  depositType: 'fixed',
  fixedAmount: 50,
  percentageAmount: 20,
  minDepositAmount: 30,
  maxDepositAmount: 200,
  
  // Payment options
  allowPayInSalon: true,
  allowFullPayment: true,
  requireDepositForNewClients: false,
  
  // Cancellation policy
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
  
  // Stripe
  stripeConnected: false,
  platformFeePercent: 3,
  
  // Reminders
  autoReminders: true,
  reminderHoursBefore: [24, 6, 1],
};
