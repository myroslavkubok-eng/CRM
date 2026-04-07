import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

// Helper functions for localStorage-based KV store (temporary until backend integration)
const kvGet = async (key: string) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

const kvSet = async (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const kvDel = async (key: string) => {
  localStorage.removeItem(key);
};

export interface NotificationSettings {
  enabled: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  reminders: {
    threeDaysBefore: boolean;
    oneDayBefore: boolean;
    twoHoursBefore: boolean;
    thirtyMinutesBefore: boolean;
  };
  marketing: boolean;
  newBookings: boolean; // For salon owners/admins
  cancellations: boolean; // For salon owners/admins
}

export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

interface NotificationsContextType {
  settings: NotificationSettings;
  updateSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
  subscribeToPush: () => Promise<boolean>;
  unsubscribeFromPush: () => Promise<boolean>;
  isPushSubscribed: boolean;
  isPushSupported: boolean;
  testNotification: () => Promise<void>;
}

const defaultSettings: NotificationSettings = {
  enabled: true,
  emailNotifications: true,
  pushNotifications: false,
  smsNotifications: false,
  reminders: {
    threeDaysBefore: true,
    oneDayBefore: true,
    twoHoursBefore: true,
    thirtyMinutesBefore: false,
  },
  marketing: false,
  newBookings: true,
  cancellations: true,
};

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [isPushSubscribed, setIsPushSubscribed] = useState(false);
  const [isPushSupported, setIsPushSupported] = useState(false);

  // Check if push notifications are supported
  useEffect(() => {
    const supported = 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
    setIsPushSupported(supported);
  }, []);

  // Load user notification settings
  useEffect(() => {
    if (!user) {
      setSettings(defaultSettings);
      return;
    }

    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    try {
      const key = `notifications:settings:${user.id}`;
      const savedSettings = await kvGet(key);
      
      if (savedSettings) {
        setSettings({ ...defaultSettings, ...savedSettings });
      }

      // Check if user is subscribed to push
      checkPushSubscription();
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  const checkPushSubscription = async () => {
    if (!isPushSupported) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsPushSubscribed(!!subscription);
    } catch (error) {
      console.error('Error checking push subscription:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<NotificationSettings>) => {
    if (!user) return;

    try {
      const updated = { ...settings, ...newSettings };
      setSettings(updated);

      const key = `notifications:settings:${user.id}`;
      await kvSet(key, updated);
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  };

  const subscribeToPush = async (): Promise<boolean> => {
    if (!isPushSupported) {
      console.log('Push notifications not supported');
      return false;
    }

    try {
      // Request notification permission
      const permission = await Notification.requestPermission();
      
      if (permission !== 'granted') {
        console.log('Notification permission denied');
        return false;
      }

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready;

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          // VAPID public key - в production нужно заменить на настоящий
          'BEl62iUYgUivxIkv69yViEuiBIa-Ib37J8xQmrUM-M0J7kQN7vvYLAMZNm2mH1kz8H8cQ8v5mL6iJ9c3pR5J0Ek'
        ),
      });

      // Save subscription to backend
      await saveSubscriptionToServer(subscription);

      setIsPushSubscribed(true);
      
      // Update settings
      await updateSettings({ pushNotifications: true });

      return true;
    } catch (error) {
      console.error('Error subscribing to push:', error);
      return false;
    }
  };

  const unsubscribeFromPush = async (): Promise<boolean> => {
    if (!isPushSupported) return false;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
        await removeSubscriptionFromServer(subscription);
      }

      setIsPushSubscribed(false);
      await updateSettings({ pushNotifications: false });

      return true;
    } catch (error) {
      console.error('Error unsubscribing from push:', error);
      return false;
    }
  };

  const saveSubscriptionToServer = async (subscription: PushSubscription) => {
    if (!user) return;

    try {
      const subscriptionData = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: arrayBufferToBase64(subscription.getKey('p256dh')!),
          auth: arrayBufferToBase64(subscription.getKey('auth')!),
        },
      };

      const key = `push:subscription:${user.id}`;
      await kvSet(key, subscriptionData);
    } catch (error) {
      console.error('Error saving subscription:', error);
    }
  };

  const removeSubscriptionFromServer = async (subscription: PushSubscription) => {
    if (!user) return;

    try {
      const key = `push:subscription:${user.id}`;
      await kvDel(key);
    } catch (error) {
      console.error('Error removing subscription:', error);
    }
  };

  const testNotification = async () => {
    if (!isPushSupported) {
      alert('Push notifications not supported on this device');
      return;
    }

    if (Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        alert('Please enable notifications to test');
        return;
      }
    }

    // Show local notification for testing
    new Notification('Katia Booking Reminder', {
      body: 'Your appointment is coming up soon! 💇‍♀️',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      vibrate: [200, 100, 200],
      tag: 'test-notification',
    });
  };

  return (
    <NotificationsContext.Provider
      value={{
        settings,
        updateSettings,
        subscribeToPush,
        unsubscribeFromPush,
        isPushSubscribed,
        isPushSupported,
        testNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationsProvider');
  }
  return context;
}

// Utility functions
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}