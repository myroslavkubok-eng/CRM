// Gift Card Analytics - Role-Based Access Control

import { GiftCardAnalytics } from './giftCard';

/**
 * ADMIN VIEW - Can see usage stats but NOT financial data
 * Admins track operational metrics without access to revenue
 */
export interface AdminGiftCardAnalytics {
  salonId: string;
  period: 'week' | 'month' | 'quarter' | 'year' | 'all';
  
  // ✅ ALLOWED: Quantity metrics
  totalSold: number; // Количество проданных
  totalRedeemed: number; // Использовано
  totalActive: number; // Активных
  totalExpired: number; // Истекших
  redemptionRate: number; // % использования
  
  // ✅ ALLOWED: Usage patterns (без сумм)
  redemptionsByDate: Array<{ 
    date: string; 
    count: number; // Только количество, НЕТ amount
  }>;
  
  // ✅ ALLOWED: Popular amounts (количество без revenue)
  popularAmounts: Array<{ 
    amount: number; // Номинал
    count: number; // Сколько раз покупали
    // ❌ НЕТ: total revenue from this amount
  }>;
  
  // ❌ BLOCKED: Все финансовые данные скрыты
  // - totalRevenue
  // - averageValue
  // - salesByDate (with revenue)
  // - topPurchasers (with totalSpent)
}

/**
 * OWNER VIEW - Full access to all data including financials
 * Owners see complete analytics with revenue and financial metrics
 */
export interface OwnerGiftCardAnalytics extends GiftCardAnalytics {
  // ✅ FULL ACCESS: All fields from GiftCardAnalytics
  // Including:
  // - totalRevenue
  // - averageValue
  // - salesByDate (with revenue)
  // - topPurchasers (with totalSpent)
}

/**
 * Filter analytics by user role
 */
export function filterAnalyticsByRole(
  fullAnalytics: GiftCardAnalytics,
  role: 'owner' | 'admin'
): AdminGiftCardAnalytics | OwnerGiftCardAnalytics {
  if (role === 'owner') {
    // Owner gets everything
    return fullAnalytics;
  }
  
  // Admin gets filtered version (no financial data)
  return {
    salonId: fullAnalytics.salonId,
    period: fullAnalytics.period,
    
    // Quantity metrics only
    totalSold: fullAnalytics.totalSold,
    totalRedeemed: fullAnalytics.totalRedeemed,
    totalActive: fullAnalytics.totalActive,
    totalExpired: fullAnalytics.totalExpired,
    redemptionRate: fullAnalytics.redemptionRate,
    
    // Remove revenue from redemptions
    redemptionsByDate: fullAnalytics.redemptionsByDate.map(item => ({
      date: item.date,
      count: item.count,
      // amount field removed
    })),
    
    // Popular amounts without revenue
    popularAmounts: fullAnalytics.popularAmounts,
    
    // Remove all financial fields:
    // - totalRevenue
    // - averageValue
    // - salesByDate
    // - topPurchasers
  };
}

/**
 * Check if user can view financial data
 */
export function canViewFinancials(role: 'owner' | 'admin' | 'master' | 'client'): boolean {
  return role === 'owner'; // Only owners can see money
}

/**
 * Check if user can manage gift card settings
 */
export function canManageGiftCardSettings(role: 'owner' | 'admin' | 'master' | 'client'): boolean {
  return role === 'owner' || role === 'admin'; // Both can configure settings
}

/**
 * Check if user can view gift card list
 */
export function canViewGiftCardList(role: 'owner' | 'admin' | 'master' | 'client'): boolean {
  return role === 'owner' || role === 'admin'; // Both can see list
}

/**
 * Check if user can cancel/refund gift cards
 */
export function canCancelGiftCard(role: 'owner' | 'admin' | 'master' | 'client'): boolean {
  return role === 'owner'; // Only owner can cancel/refund
}
