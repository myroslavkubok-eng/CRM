/**
 * PWA Utilities для Katia Beauty Platform
 * Регистрация Service Worker, Push notifications, Install prompt
 */

/* ============================================
   SERVICE WORKER REGISTRATION
   ============================================ */

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    return null;
  }

  try {
    // Создаем Service Worker inline (работает в любом окружении)
    const registration = await registerInlineServiceWorker();
    
    if (registration) {
      console.log('[PWA] ✅ Service Worker зарегистрирован (inline mode)');
      
      // Проверяем обновления
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        newWorker?.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('[PWA] ✅ Новая версия готова');
            showUpdateNotification();
          }
        });
      });
      
      return registration;
    }
    
    return null;
  } catch (error) {
    // Тихо игнорируем - PWA опциональный
    return null;
  }
}

// Inline Service Worker - работает везде
async function registerInlineServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  try {
    // Минимальный Service Worker код
    const swCode = `
      const CACHE_NAME = 'katia-v1';
      
      self.addEventListener('install', (event) => {
        self.skipWaiting();
      });
      
      self.addEventListener('activate', (event) => {
        event.waitUntil(self.clients.claim());
      });
      
      self.addEventListener('fetch', (event) => {
        // Пропускаем non-GET запросы
        if (event.request.method !== 'GET') return;
        
        // Пропускаем chrome extensions
        if (event.request.url.startsWith('chrome-extension://')) return;
        
        event.respondWith(
          fetch(event.request)
            .then(response => {
              // Кешируем успешные ответы
              if (response && response.status === 200) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                  cache.put(event.request, responseClone);
                });
              }
              return response;
            })
            .catch(() => {
              // При ошибке пробуем вернуть из кеша
              return caches.match(event.request);
            })
        );
      });
    `;
    
    // Создаем blob URL для Service Worker
    const blob = new Blob([swCode], { type: 'application/javascript' });
    const swUrl = URL.createObjectURL(blob);
    
    // Регистрируем
    const registration = await navigator.serviceWorker.register(swUrl, {
      scope: '/'
    });
    
    return registration;
  } catch (error) {
    return null;
  }
}

export function unregisterServiceWorker(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return Promise.resolve(false);
  }

  return navigator.serviceWorker.getRegistration()
    .then((registration) => {
      if (registration) {
        return registration.unregister();
      }
      return false;
    });
}

function showUpdateNotification() {
  if (window.confirm('Доступна новая версия приложения. Обновить сейчас?')) {
    window.location.reload();
  }
}

/* ============================================
   INSTALL PROMPT - Установка PWA
   ============================================ */

let deferredPrompt: any = null;

export function initInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallButton();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    hideInstallButton();
  });
}

export async function promptInstall(): Promise<boolean> {
  if (!deferredPrompt) {
    return false;
  }

  try {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    deferredPrompt = null;
    
    return outcome === 'accepted';
  } catch (error) {
    return false;
  }
}

export function canInstall(): boolean {
  return deferredPrompt !== null;
}

function showInstallButton() {
  window.dispatchEvent(new CustomEvent('pwa-install-available'));
}

function hideInstallButton() {
  window.dispatchEvent(new CustomEvent('pwa-install-completed'));
}

/* ============================================
   PUSH NOTIFICATIONS
   ============================================ */

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission === 'denied') {
    return 'denied';
  }

  const permission = await Notification.requestPermission();
  return permission;
}

export async function subscribeToPushNotifications(
  registration: ServiceWorkerRegistration
): Promise<PushSubscription | null> {
  try {
    const permission = await requestNotificationPermission();
    
    if (permission !== 'granted') {
      return null;
    }

    // Для demo используем заглушку
    // В production нужен реальный VAPID key
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        'BEl62iUYgUivxIkv69yViEuiBIa-Ib37J8xQmrUM-M0J7kQN7vvYLAMZNm2mH1kz8H8cQ8v5mL6iJ9c3pR5J0Ek'
      )
    });

    await sendSubscriptionToServer(subscription);
    
    return subscription;
  } catch (error) {
    return null;
  }
}

export async function unsubscribeFromPushNotifications(
  registration: ServiceWorkerRegistration
): Promise<boolean> {
  try {
    const subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      return false;
    }

    const success = await subscription.unsubscribe();
    
    await removeSubscriptionFromServer(subscription);
    
    return success;
  } catch (error) {
    return false;
  }
}

export function showLocalNotification(title: string, options?: NotificationOptions) {
  if (!('Notification' in window)) {
    return;
  }

  if (Notification.permission !== 'granted') {
    return;
  }

  const notification = new Notification(title, {
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    ...options
  });

  notification.onclick = (event) => {
    event.preventDefault();
    window.focus();
    notification.close();
  };

  return notification;
}

/* ============================================
   OFFLINE DETECTION
   ============================================ */

export function isOnline(): boolean {
  return navigator.onLine;
}

export function onOnline(callback: () => void): () => void {
  window.addEventListener('online', callback);
  return () => window.removeEventListener('online', callback);
}

export function onOffline(callback: () => void): () => void {
  window.addEventListener('offline', callback);
  return () => window.removeEventListener('offline', callback);
}

/* ============================================
   CACHE MANAGEMENT
   ============================================ */

export async function clearAllCaches(): Promise<void> {
  if (!('caches' in window)) {
    return;
  }

  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
}

export async function getCacheSize(): Promise<number> {
  if (!('caches' in window)) {
    return 0;
  }

  let totalSize = 0;
  const cacheNames = await caches.keys();

  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    
    for (const request of keys) {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    }
  }

  return totalSize;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/* ============================================
   APP UPDATE
   ============================================ */

export function skipWaiting() {
  if (!navigator.serviceWorker.controller) {
    return;
  }

  navigator.serviceWorker.controller.postMessage({
    type: 'SKIP_WAITING'
  });
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}

async function sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
  // TODO: Отправить subscription на backend
}

async function removeSubscriptionFromServer(subscription: PushSubscription): Promise<void> {
  // TODO: Удалить subscription с backend
}

/* ============================================
   PLATFORM DETECTION
   ============================================ */

export function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  );
}

export function getPlatform(): 'ios' | 'android' | 'desktop' {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (/iphone|ipad|ipod/.test(userAgent)) {
    return 'ios';
  }
  
  if (/android/.test(userAgent)) {
    return 'android';
  }
  
  return 'desktop';
}

export function canShare(): boolean {
  return 'share' in navigator;
}

export async function shareContent(data: ShareData): Promise<boolean> {
  if (!canShare()) {
    return false;
  }

  try {
    await navigator.share(data);
    return true;
  } catch (error) {
    return false;
  }
}

/* ============================================
   CAMERA & FILE ACCESS
   ============================================ */

export function canAccessCamera(): boolean {
  return 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;
}

export async function requestCameraAccess(): Promise<MediaStream | null> {
  if (!canAccessCamera()) {
    return null;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
      audio: false
    });
    return stream;
  } catch (error) {
    return null;
  }
}

/* ============================================
   VIBRATION
   ============================================ */

export function vibrate(pattern: number | number[]): boolean {
  if (!('vibrate' in navigator)) {
    return false;
  }

  return navigator.vibrate(pattern);
}

export function vibrateSuccess() {
  vibrate([100, 50, 100]);
}

export function vibrateError() {
  vibrate([200, 100, 200, 100, 200]);
}

/* ============================================
   GEOLOCATION
   ============================================ */

export function canUseGeolocation(): boolean {
  return 'geolocation' in navigator;
}

export async function getCurrentPosition(): Promise<GeolocationPosition | null> {
  if (!canUseGeolocation()) {
    return null;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => {
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  });
}