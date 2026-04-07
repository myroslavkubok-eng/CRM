/**
 * 🔐 Salon Auto-Block System
 * 
 * Автоматическая блокировка салонов при:
 * 1. Неоплате подписки (payment_failed)
 * 2. Обработанном возврате (refund_processed)
 * 3. Истечении подписки (subscription_expired)
 * 
 * Данные салона сохраняются в базе 90 дней для возможности восстановления
 */

export interface SalonStatus {
  id: number;
  isBlocked: boolean;
  blockReason?: 'payment_failed' | 'refund_processed' | 'subscription_expired' | 'manual_block';
  blockedDate?: string;
  canRestore: boolean;
  daysUntilDeletion?: number;
}

export interface SubscriptionInfo {
  id: string;
  salonId: number;
  status: 'active' | 'past_due' | 'canceled' | 'expired';
  expiryDate: string;
  lastPaymentDate: string;
  lastPaymentStatus: 'success' | 'failed' | 'pending';
  paymentFailedCount: number;
}

/**
 * Проверяет, нужно ли заблокировать салон
 */
export function checkSalonAutoBlock(subscription: SubscriptionInfo): SalonStatus {
  const now = new Date();
  const expiryDate = new Date(subscription.expiryDate);
  const daysSinceExpiry = Math.floor((now.getTime() - expiryDate.getTime()) / (1000 * 60 * 60 * 24));

  // 1. Проверка истечения подписки
  if (subscription.status === 'expired' || daysSinceExpiry > 0) {
    return {
      id: subscription.salonId,
      isBlocked: true,
      blockReason: 'subscription_expired',
      blockedDate: expiryDate.toISOString(),
      canRestore: true,
      daysUntilDeletion: Math.max(0, 90 - daysSinceExpiry),
    };
  }

  // 2. Проверка неудачных платежей (3 попытки)
  if (subscription.paymentFailedCount >= 3 || subscription.status === 'past_due') {
    return {
      id: subscription.salonId,
      isBlocked: true,
      blockReason: 'payment_failed',
      blockedDate: new Date().toISOString(),
      canRestore: true,
      daysUntilDeletion: 90,
    };
  }

  // 3. Подписка отменена (возврат обработан)
  if (subscription.status === 'canceled') {
    return {
      id: subscription.salonId,
      isBlocked: true,
      blockReason: 'refund_processed',
      blockedDate: new Date().toISOString(),
      canRestore: true,
      daysUntilDeletion: 90,
    };
  }

  // Все ОК - салон активен
  return {
    id: subscription.salonId,
    isBlocked: false,
    canRestore: false,
  };
}

/**
 * Автоматическая проверка всех салонов (запускается по расписанию)
 */
export async function runAutoBlockCheck(subscriptions: SubscriptionInfo[]): Promise<SalonStatus[]> {
  const results: SalonStatus[] = [];

  for (const subscription of subscriptions) {
    const status = checkSalonAutoBlock(subscription);
    if (status.isBlocked) {
      results.push(status);
      
      // Логирование для админа
      console.log(`🔒 AUTO-BLOCK: Salon ${subscription.salonId}`, {
        reason: status.blockReason,
        date: status.blockedDate,
        canRestore: status.canRestore,
      });

      // В реальной системе здесь будет:
      // 1. Обновление статуса в базе данных
      // 2. Отправка email владельцу
      // 3. Создание записи в audit log
      // await blockSalon(subscription.salonId, status);
    }
  }

  return results;
}

/**
 * Webhook handler для Stripe событий
 */
export function handleStripeWebhook(event: any): SalonStatus | null {
  switch (event.type) {
    case 'invoice.payment_failed':
      // Платеж не прошел
      return {
        id: event.data.object.metadata.salonId,
        isBlocked: true,
        blockReason: 'payment_failed',
        blockedDate: new Date(event.created * 1000).toISOString(),
        canRestore: true,
        daysUntilDeletion: 90,
      };

    case 'customer.subscription.deleted':
      // Подписка отменена (возврат)
      return {
        id: event.data.object.metadata.salonId,
        isBlocked: true,
        blockReason: 'refund_processed',
        blockedDate: new Date(event.created * 1000).toISOString(),
        canRestore: true,
        daysUntilDeletion: 90,
      };

    case 'invoice.payment_succeeded':
      // Платеж успешен - разблокировать если был заблокирован
      console.log(`✅ Payment success - unblocking salon ${event.data.object.metadata.salonId}`);
      return null;

    default:
      return null;
  }
}

/**
 * Проверка возможности восстановления салона
 */
export function canRestoreSalon(blockedDate: string): boolean {
  const blocked = new Date(blockedDate);
  const now = new Date();
  const daysSinceBlock = Math.floor((now.getTime() - blocked.getTime()) / (1000 * 60 * 60 * 24));
  
  // Можно восстановить в течение 90 дней
  return daysSinceBlock <= 90;
}

/**
 * Расчет дней до удаления данных
 */
export function getDaysUntilDeletion(blockedDate: string): number {
  const blocked = new Date(blockedDate);
  const now = new Date();
  const daysSinceBlock = Math.floor((now.getTime() - blocked.getTime()) / (1000 * 60 * 60 * 24));
  
  return Math.max(0, 90 - daysSinceBlock);
}

/**
 * Email уведомления
 */
export interface BlockNotificationEmail {
  to: string;
  salonName: string;
  blockReason: string;
  daysUntilDeletion: number;
  reactivationLink: string;
}

export function generateBlockNotificationEmail(
  salon: { name: string; email: string; id: number },
  status: SalonStatus
): BlockNotificationEmail {
  const reasonMessages = {
    payment_failed: 'Your payment method was declined',
    refund_processed: 'Your refund has been processed',
    subscription_expired: 'Your subscription has expired',
    manual_block: 'Your account has been suspended',
  };

  return {
    to: salon.email,
    salonName: salon.name,
    blockReason: status.blockReason ? reasonMessages[status.blockReason] : 'Unknown reason',
    daysUntilDeletion: status.daysUntilDeletion || 90,
    reactivationLink: `https://katia.beauty/reactivate/${salon.id}`,
  };
}

/**
 * Напоминания о скором удалении данных
 */
export function shouldSendDeletionWarning(blockedDate: string): boolean {
  const daysLeft = getDaysUntilDeletion(blockedDate);
  
  // Отправляем напоминания на 30, 14, 7, 3, 1 день до удаления
  return [30, 14, 7, 3, 1].includes(daysLeft);
}

/**
 * Автоматическое удаление данных после 90 дней
 */
export async function deleteExpiredSalonData(salonId: number, blockedDate: string): Promise<boolean> {
  if (!canRestoreSalon(blockedDate)) {
    console.log(`🗑️ DELETING salon ${salonId} data - 90 days passed`);
    
    // В реальной системе:
    // 1. Архивировать важные данные
    // 2. Удалить персональные данные (GDPR compliance)
    // 3. Сохранить минимальную информацию для аналитики
    // await archiveSalonData(salonId);
    // await deleteSalonPersonalData(salonId);
    
    return true;
  }
  
  return false;
}

/**
 * Пример использования в cron job
 */
export async function dailyAutoBlockCheck() {
  console.log('🔄 Running daily auto-block check...');
  
  // 1. Получить все активные подписки
  // const subscriptions = await fetchAllSubscriptions();
  
  // 2. Проверить каждую на необходимость блокировки
  // const blockedSalons = await runAutoBlockCheck(subscriptions);
  
  // 3. Отправить уведомления
  // for (const salon of blockedSalons) {
  //   await sendBlockNotification(salon);
  // }
  
  // 4. Проверить салоны на удаление (90 дней)
  // const expiredSalons = await fetchExpiredSalons();
  // for (const salon of expiredSalons) {
  //   if (shouldSendDeletionWarning(salon.blockedDate)) {
  //     await sendDeletionWarning(salon);
  //   }
  //   await deleteExpiredSalonData(salon.id, salon.blockedDate);
  // }
  
  console.log('✅ Daily auto-block check completed');
}
