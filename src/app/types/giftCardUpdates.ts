/**
 * Real-time Gift Card Updates System
 * 
 * Когда сертификат используется, оба пользователя (покупатель и получатель)
 * получают обновление статуса в реальном времени
 */

/**
 * Типы событий обновлений
 */
export type GiftCardUpdateEvent =
  | 'purchased'       // Сертификат куплен
  | 'sent'            // Отправлен получателю
  | 'received'        // Получен получателем
  | 'viewed'          // Просмотрен получателем
  | 'redeemed'        // Использован (частично или полностью)
  | 'expired'         // Истёк срок действия
  | 'cancelled'       // Отменён
  | 'refunded';       // Возвращены деньги

/**
 * Notification для real-time обновлений
 */
export interface GiftCardNotification {
  id: string;
  eventType: GiftCardUpdateEvent;
  giftCardCode: string;
  timestamp: Date;
  
  // Для кого это уведомление
  recipientUserId: string;
  recipientRole: 'purchaser' | 'recipient';
  
  // Детали события
  message: string;
  details: {
    amountUsed?: number;
    remainingBalance?: number;
    serviceName?: string;
    bookingId?: string;
    usedBy?: string; // Имя того, кто использовал
    salonName?: string;
  };
  
  // UI metadata
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string; // Ссылка для перехода
}

/**
 * WebSocket message для real-time updates
 */
export interface GiftCardWebSocketMessage {
  type: 'gift_card_update';
  giftCardCode: string;
  event: GiftCardUpdateEvent;
  
  // Обновлённые данные
  updatedGiftCard: {
    remainingBalance: number;
    status: 'active' | 'partially_used' | 'fully_used' | 'expired' | 'cancelled';
    lastUsed?: {
      date: string;
      amountUsed: number;
      serviceName: string;
    };
  };
  
  // Для кого это обновление (может быть несколько получателей)
  affectedUsers: Array<{
    userId: string;
    role: 'purchaser' | 'recipient';
    notification: GiftCardNotification;
  }>;
}

/**
 * Push notification payload
 */
export interface GiftCardPushNotification {
  title: string;
  body: string;
  icon?: string;
  badge?: number;
  data: {
    giftCardCode: string;
    eventType: GiftCardUpdateEvent;
    actionUrl: string;
  };
}

/**
 * Helper: Генерация уведомлений для покупателя
 */
export function createPurchaserNotification(
  event: GiftCardUpdateEvent,
  giftCardCode: string,
  details: GiftCardNotification['details']
): GiftCardNotification {
  const messages: Record<GiftCardUpdateEvent, string> = {
    purchased: 'Gift card purchased successfully',
    sent: `Gift card sent to ${details.usedBy || 'recipient'}`,
    received: `${details.usedBy || 'Recipient'} received your gift card`,
    viewed: `${details.usedBy || 'Recipient'} viewed your gift card`,
    redeemed: `${details.usedBy || 'Recipient'} used your gift card at ${details.salonName}`,
    expired: 'Gift card has expired',
    cancelled: 'Gift card has been cancelled',
    refunded: 'Gift card refund processed',
  };

  const priorities: Record<GiftCardUpdateEvent, 'low' | 'medium' | 'high'> = {
    purchased: 'high',
    sent: 'medium',
    received: 'low',
    viewed: 'low',
    redeemed: 'medium',
    expired: 'low',
    cancelled: 'high',
    refunded: 'high',
  };

  return {
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    eventType: event,
    giftCardCode,
    timestamp: new Date(),
    recipientUserId: '', // Will be set by caller
    recipientRole: 'purchaser',
    message: messages[event],
    details,
    read: false,
    priority: priorities[event],
    actionUrl: `/gift-cards/purchased/${giftCardCode}`,
  };
}

/**
 * Helper: Генерация уведомлений для получателя
 */
export function createRecipientNotification(
  event: GiftCardUpdateEvent,
  giftCardCode: string,
  details: GiftCardNotification['details']
): GiftCardNotification {
  const messages: Record<GiftCardUpdateEvent, string> = {
    purchased: 'You received a gift card!',
    sent: 'A gift card is on its way to you',
    received: 'Gift card added to your account',
    viewed: 'You viewed this gift card',
    redeemed: `You used ${details.amountUsed ? 'AED ' + details.amountUsed : 'the gift card'}`,
    expired: 'Your gift card has expired',
    cancelled: 'Gift card has been cancelled',
    refunded: 'Gift card has been refunded',
  };

  const priorities: Record<GiftCardUpdateEvent, 'low' | 'medium' | 'high'> = {
    purchased: 'high',
    sent: 'medium',
    received: 'high',
    viewed: 'low',
    redeemed: 'medium',
    expired: 'medium',
    cancelled: 'high',
    refunded: 'medium',
  };

  return {
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    eventType: event,
    giftCardCode,
    timestamp: new Date(),
    recipientUserId: '', // Will be set by caller
    recipientRole: 'recipient',
    message: messages[event],
    details,
    read: false,
    priority: priorities[event],
    actionUrl: `/gift-cards/received/${giftCardCode}`,
  };
}

/**
 * Helper: Форматирование сообщения для отображения
 */
export function formatNotificationMessage(notification: GiftCardNotification): string {
  const { eventType, details } = notification;

  switch (eventType) {
    case 'redeemed':
      if (notification.recipientRole === 'purchaser') {
        return `${details.usedBy} used ${details.amountUsed ? 'AED ' + details.amountUsed : 'your gift card'} for ${details.serviceName} at ${details.salonName}. Remaining balance: AED ${details.remainingBalance}`;
      } else {
        return `You used AED ${details.amountUsed} for ${details.serviceName}. Remaining balance: AED ${details.remainingBalance}`;
      }

    case 'received':
      if (notification.recipientRole === 'purchaser') {
        return `${details.usedBy} received your gift card (${notification.giftCardCode})`;
      } else {
        return `Gift card ${notification.giftCardCode} added to your account`;
      }

    case 'viewed':
      return `${details.usedBy || 'Recipient'} viewed the gift card`;

    default:
      return notification.message;
  }
}

/**
 * Example Usage:
 * 
 * // When gift card is redeemed:
 * const purchaserNotif = createPurchaserNotification('redeemed', 'KATIA-A7X9-2K4M-3P5Q', {
 *   amountUsed: 60,
 *   remainingBalance: 140,
 *   serviceName: 'Haircut & Styling',
 *   usedBy: 'Jane Smith',
 *   salonName: 'Glamour Studio',
 * });
 * 
 * const recipientNotif = createRecipientNotification('redeemed', 'KATIA-A7X9-2K4M-3P5Q', {
 *   amountUsed: 60,
 *   remainingBalance: 140,
 *   serviceName: 'Haircut & Styling',
 *   salonName: 'Glamour Studio',
 * });
 * 
 * // Send to both users
 * sendNotificationToPurchaser(purchaserNotif);
 * sendNotificationToRecipient(recipientNotif);
 */

/**
 * Subscription interface для WebSocket
 */
export interface GiftCardSubscription {
  userId: string;
  giftCardCodes: string[];
  onUpdate: (message: GiftCardWebSocketMessage) => void;
}

/**
 * Helper: Subscribe to gift card updates
 */
export function subscribeToGiftCardUpdates(
  subscription: GiftCardSubscription
): () => void {
  // TODO: Implement WebSocket connection
  
  // Example WebSocket setup:
  // const ws = new WebSocket('wss://api.katia.com/gift-cards/subscribe');
  // ws.send(JSON.stringify({
  //   type: 'subscribe',
  //   userId: subscription.userId,
  //   giftCardCodes: subscription.giftCardCodes
  // }));
  // 
  // ws.onmessage = (event) => {
  //   const message: GiftCardWebSocketMessage = JSON.parse(event.data);
  //   subscription.onUpdate(message);
  // };
  
  // Return unsubscribe function
  return () => {
    // ws.close();
    console.log('Unsubscribed from gift card updates');
  };
}

/**
 * Polling альтернатива для WebSocket
 * (Если WebSocket недоступен)
 */
export async function pollGiftCardUpdates(
  userId: string,
  giftCardCodes: string[],
  lastCheckTimestamp: Date
): Promise<GiftCardNotification[]> {
  // TODO: Implement polling API call
  
  // Example:
  // const response = await fetch(`/api/gift-cards/updates`, {
  //   method: 'POST',
  //   body: JSON.stringify({
  //     userId,
  //     giftCardCodes,
  //     since: lastCheckTimestamp.toISOString()
  //   })
  // });
  // 
  // return await response.json();
  
  return [];
}
