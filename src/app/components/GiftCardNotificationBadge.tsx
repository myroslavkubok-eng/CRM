import { useState, useEffect } from 'react';
import { Bell, Gift, Check, X } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { GiftCardNotification, formatNotificationMessage } from '../types/giftCardUpdates';
import { useCurrency } from '../../contexts/CurrencyContext';

interface GiftCardNotificationBadgeProps {
  userId: string;
  onViewGiftCard?: (code: string) => void;
}

export function GiftCardNotificationBadge({
  userId,
  onViewGiftCard,
}: GiftCardNotificationBadgeProps) {
  const { formatPrice } = useCurrency();
  const [notifications, setNotifications] = useState<GiftCardNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Simulate real-time notifications (replace with actual WebSocket/polling)
  useEffect(() => {
    // TODO: Subscribe to real-time updates
    // const unsubscribe = subscribeToGiftCardUpdates({
    //   userId,
    //   giftCardCodes: [], // Get from user's gift cards
    //   onUpdate: (message) => {
    //     const userNotif = message.affectedUsers.find(u => u.userId === userId);
    //     if (userNotif) {
    //       addNotification(userNotif.notification);
    //     }
    //   }
    // });
    
    // Mock notification for demo
    const mockNotification: GiftCardNotification = {
      id: 'notif1',
      eventType: 'redeemed',
      giftCardCode: 'KATIA-A7X9-2K4M-3P5Q',
      timestamp: new Date(),
      recipientUserId: userId,
      recipientRole: 'purchaser',
      message: 'Jane Smith used your gift card',
      details: {
        amountUsed: 60,
        remainingBalance: 140,
        serviceName: 'Haircut & Styling',
        usedBy: 'Jane Smith',
        salonName: 'Glamour Studio',
      },
      read: false,
      priority: 'medium',
      actionUrl: '/gift-cards/purchased/KATIA-A7X9-2K4M-3P5Q',
    };
    
    // Simulate notification after 3 seconds (for demo)
    const timeout = setTimeout(() => {
      setNotifications([mockNotification]);
      setUnreadCount(1);
    }, 3000);
    
    return () => {
      clearTimeout(timeout);
      // unsubscribe();
    };
  }, [userId]);

  const addNotification = (notification: GiftCardNotification) => {
    setNotifications(prev => [notification, ...prev]);
    if (!notification.read) {
      setUnreadCount(prev => prev + 1);
    }
    
    // Show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Gift Card Update', {
        body: formatNotificationMessage(notification),
        icon: '/gift-card-icon.png',
        badge: unreadCount + 1,
      });
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const removeNotification = (notificationId: string) => {
    const notification = notifications.find(n => n.id === notificationId);
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const getPriorityColor = (priority: GiftCardNotification['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-4 border-l-red-500';
      case 'medium':
        return 'border-l-4 border-l-yellow-500';
      case 'low':
        return 'border-l-4 border-l-blue-500';
    }
  };

  const getEventIcon = (eventType: GiftCardNotification['eventType']) => {
    switch (eventType) {
      case 'redeemed':
        return '🎉';
      case 'received':
        return '📥';
      case 'viewed':
        return '👀';
      case 'expired':
        return '⏰';
      case 'cancelled':
        return '❌';
      case 'refunded':
        return '💰';
      default:
        return '🎁';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">{unreadCount}</span>
          </div>
        )}
      </button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 top-12 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[600px] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50">
              <div>
                <h3 className="font-bold text-gray-900">Gift Card Updates</h3>
                <p className="text-xs text-gray-600">
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              </div>
              {unreadCount > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={markAllAsRead}
                  className="text-xs gap-1"
                >
                  <Check className="w-3 h-3" />
                  Mark all read
                </Button>
              )}
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Gift className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                        !notification.read ? 'bg-purple-50' : ''
                      } ${getPriorityColor(notification.priority)}`}
                      onClick={() => {
                        markAsRead(notification.id);
                        if (onViewGiftCard) {
                          onViewGiftCard(notification.giftCardCode);
                        }
                        setIsOpen(false);
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className="text-2xl flex-shrink-0">
                          {getEventIcon(notification.eventType)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-semibold text-sm text-gray-900">
                              {notification.message}
                            </h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notification.id);
                              }}
                              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <p className="text-xs text-gray-600 mb-2">
                            {formatNotificationMessage(notification)}
                          </p>

                          {/* Details */}
                          {notification.details.amountUsed && (
                            <div className="flex items-center gap-4 text-xs">
                              <span className="text-red-600 font-semibold">
                                -{formatPrice(notification.details.amountUsed)} used
                              </span>
                              <span className="text-green-600 font-semibold">
                                {formatPrice(notification.details.remainingBalance || 0)} left
                              </span>
                            </div>
                          )}

                          {/* Timestamp */}
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                            <code className="text-xs font-mono text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                              {notification.giftCardCode}
                            </code>
                          </div>
                        </div>
                      </div>

                      {/* Unread indicator */}
                      {!notification.read && (
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-purple-600 rounded-full" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => {
                    // Navigate to full notifications page
                    window.location.href = '/gift-cards';
                  }}
                  className="w-full text-center text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  View All Gift Cards →
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
