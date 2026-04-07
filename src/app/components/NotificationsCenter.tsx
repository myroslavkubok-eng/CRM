import { useState } from 'react';
import { Bell, X, Calendar, UserPlus, XCircle, DollarSign, Package, AlertTriangle, MessageSquare, Gift } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface Notification {
  id: string;
  type: 'booking' | 'cancellation' | 'payment' | 'low_stock' | 'review' | 'reminder' | 'loyalty' | 'new_client';
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface NotificationsCenterProps {
  userRole?: 'owner' | 'admin' | 'master';
}

export function NotificationsCenter({ userRole = 'owner' }: NotificationsCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'booking',
      title: 'New Booking',
      message: 'Anna Kowalska - Women\'s Haircut, Dec 24 at 14:00',
      time: '2 min ago',
      read: false,
      priority: 'high'
    },
    {
      id: '2',
      type: 'cancellation',
      title: 'Booking Cancelled',
      message: 'Client "Emma W." cancelled appointment for Dec 25',
      time: '15 min ago',
      read: false,
      priority: 'high'
    },
    {
      id: '3',
      type: 'payment',
      title: 'Payment Received',
      message: 'AED 450 received from Client #123',
      time: '1 hour ago',
      read: false,
      priority: 'medium'
    },
    {
      id: '4',
      type: 'low_stock',
      title: 'Low Stock Alert',
      message: 'Hair Dye #45 - Only 2 bottles left',
      time: '2 hours ago',
      read: false,
      priority: 'high'
    },
    {
      id: '5',
      type: 'review',
      title: 'New Review',
      message: '⭐⭐⭐⭐⭐ "Amazing service!" - Sarah M.',
      time: '3 hours ago',
      read: true,
      priority: 'low'
    },
    {
      id: '6',
      type: 'reminder',
      title: 'Upcoming Meeting',
      message: 'Staff meeting in 30 minutes',
      time: '30 min ago',
      read: true,
      priority: 'medium'
    },
    {
      id: '7',
      type: 'new_client',
      title: 'New Client Registered',
      message: 'Lisa Johnson joined via online booking',
      time: '4 hours ago',
      read: true,
      priority: 'low'
    },
    {
      id: '8',
      type: 'loyalty',
      title: 'Loyalty Milestone',
      message: 'Emma Watson reached Gold tier (5,000 points)',
      time: '5 hours ago',
      read: true,
      priority: 'low'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'cancellation':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'payment':
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case 'low_stock':
        return <Package className="w-5 h-5 text-orange-600" />;
      case 'review':
        return <MessageSquare className="w-5 h-5 text-purple-600" />;
      case 'reminder':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'new_client':
        return <UserPlus className="w-5 h-5 text-pink-600" />;
      case 'loyalty':
        return <Gift className="w-5 h-5 text-yellow-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-gray-300';
      default:
        return 'border-l-gray-300';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
    setIsOpen(false);
  };

  // Filter notifications by role
  const filteredNotifications = notifications.filter(notification => {
    if (userRole === 'admin') {
      // Admin doesn't see payment notifications
      return notification.type !== 'payment';
    }
    if (userRole === 'master') {
      // Master only sees booking, cancellation, and review notifications related to them
      return ['booking', 'cancellation', 'review'].includes(notification.type);
    }
    return true; // Owner sees everything
  });

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Notifications Panel */}
          <div className="absolute right-0 mt-2 w-96 max-h-[80vh] bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50">
              <div>
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-purple-600" />
                  Notifications
                </h3>
                <p className="text-xs text-gray-600">{unreadCount} unread</p>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white rounded"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-12 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredNotifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 ${
                        getPriorityColor(notification.priority)
                      } ${!notification.read ? 'bg-blue-50' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className={`text-sm font-medium ${
                              !notification.read ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <X className="w-3 h-3 text-gray-400" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{notification.message}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">{notification.time}</span>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {filteredNotifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={clearAll}
                  className="w-full text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Clear All Notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
