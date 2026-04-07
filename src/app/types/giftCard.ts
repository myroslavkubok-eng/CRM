// Gift Card System Types

export interface GiftCard {
  id: string;
  code: string; // Уникальный код (например: KATIA-A7X9-2K4M)
  salonId: string;
  salonName: string;
  
  // Financial
  amount: number; // Начальная сумма
  currency: string;
  remainingBalance: number; // Текущий остаток
  
  // Purchase Info
  purchasedBy: {
    name: string;
    email: string;
    userId?: string;
  };
  purchaseDate: Date;
  paymentIntentId: string; // Stripe Payment Intent ID
  stripeChargeId?: string;
  
  // Recipient Info
  recipientName: string;
  recipientEmail: string;
  personalMessage?: string;
  deliveryMethod: 'email' | 'print'; // Email или Print
  
  // Status
  status: 'active' | 'partially_used' | 'fully_used' | 'expired' | 'cancelled';
  
  // Usage History
  usageHistory: GiftCardUsage[];
  
  // Expiry
  expiryDate?: Date | null; // null = никогда не истекает
  
  // Settings (from salon)
  allowPartialUse: boolean; // Можно использовать частями
  allowMultipleServices: boolean; // Можно на несколько услуг
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastUsedAt?: Date;
}

export interface GiftCardUsage {
  id: string;
  date: Date;
  bookingId: string;
  customerId: string;
  customerName: string;
  amountUsed: number;
  remainingAfter: number;
  serviceName: string;
  serviceId: string;
}

export interface GiftCardSettings {
  salonId: string;
  
  // Features
  enabled: boolean; // Включены ли подарочные сертификаты
  allowCustomAmounts: boolean; // Произвольная сумма
  
  // Preset amounts
  presetAmounts: number[]; // [50, 100, 200, 500]
  minAmount: number;
  maxAmount: number;
  
  // Usage rules
  expiryMonths: number | null; // null = никогда не истекает
  allowPartialUse: boolean; // Частичное использование
  allowMultipleServices: boolean; // Несколько услуг
  requireMinimumPurchase: boolean;
  minimumPurchaseAmount?: number;
  
  // Design & Messaging
  customMessage?: string; // Сообщение от салона
  termsAndConditions?: string;
  emailTemplate?: string;
  
  // Notifications
  sendToRecipient: boolean; // Отправлять получателю
  sendToPurchaser: boolean; // Отправлять покупателю
  notifyOnUse: boolean; // Уведомлять при использовании
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface GiftCardPurchaseRequest {
  salonId: string;
  amount: number;
  currency: string;
  
  // Purchaser
  purchaserName: string;
  purchaserEmail: string;
  
  // Recipient
  recipientName: string;
  recipientEmail: string;
  personalMessage?: string;
  deliveryMethod: 'email' | 'print';
  
  // Payment
  paymentMethodId: string; // Stripe Payment Method ID
}

export interface GiftCardRedeemRequest {
  code: string;
  bookingId: string;
  amountToUse: number;
  serviceId: string;
  serviceName: string;
  customerId: string;
  customerName: string;
}

export interface GiftCardValidationResponse {
  valid: boolean;
  giftCard?: GiftCard;
  error?: string;
  remainingBalance?: number;
}

// Analytics Types
export interface GiftCardAnalytics {
  salonId: string;
  period: 'week' | 'month' | 'quarter' | 'year' | 'all';
  
  // Revenue
  totalSold: number; // Количество проданных
  totalRevenue: number; // Общая сумма
  averageValue: number; // Средняя сумма
  
  // Usage
  totalRedeemed: number; // Использовано
  totalActive: number; // Активных
  totalExpired: number; // Истекших
  redemptionRate: number; // % использования
  
  // Popular amounts
  popularAmounts: Array<{ amount: number; count: number }>;
  
  // Timeline
  salesByDate: Array<{ date: string; count: number; revenue: number }>;
  redemptionsByDate: Array<{ date: string; count: number; amount: number }>;
  
  // Top recipients
  topPurchasers: Array<{ name: string; email: string; totalSpent: number; count: number }>;
}

// Helper function to generate unique code
export function generateGiftCardCode(): string {
  const segments = 3;
  const segmentLength = 4;
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Без похожих символов (I, O, 0, 1)
  
  const code = Array.from({ length: segments }, () => {
    return Array.from({ length: segmentLength }, () => 
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
  }).join('-');
  
  return `KATIA-${code}`;
}

// Helper function to validate code format
export function isValidGiftCardCode(code: string): boolean {
  // Format: KATIA-XXXX-XXXX-XXXX
  const pattern = /^KATIA-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  return pattern.test(code);
}

// Helper function to check if gift card is expired
export function isGiftCardExpired(giftCard: GiftCard): boolean {
  if (!giftCard.expiryDate) return false; // Never expires
  return new Date(giftCard.expiryDate) < new Date();
}

// Helper function to check if gift card can be used
export function canUseGiftCard(giftCard: GiftCard, amountToUse: number): {
  canUse: boolean;
  reason?: string;
} {
  // Check status
  if (giftCard.status === 'cancelled') {
    return { canUse: false, reason: 'Gift card has been cancelled' };
  }
  
  if (giftCard.status === 'fully_used') {
    return { canUse: false, reason: 'Gift card has been fully used' };
  }
  
  if (giftCard.status === 'expired') {
    return { canUse: false, reason: 'Gift card has expired' };
  }
  
  // Check expiry
  if (isGiftCardExpired(giftCard)) {
    return { canUse: false, reason: 'Gift card has expired' };
  }
  
  // Check balance
  if (giftCard.remainingBalance <= 0) {
    return { canUse: false, reason: 'Gift card has no remaining balance' };
  }
  
  if (amountToUse > giftCard.remainingBalance) {
    return { canUse: false, reason: `Insufficient balance. Remaining: ${giftCard.remainingBalance}` };
  }
  
  return { canUse: true };
}
