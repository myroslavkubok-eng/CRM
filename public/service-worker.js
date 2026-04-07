/* 
 * Katia Beauty Platform - Service Worker
 * PWA для работы offline, кеширования и push-уведомлений
 */

const CACHE_VERSION = 'katia-v1.0.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;

// Ресурсы для предварительного кеширования
const PRECACHE_URLS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Ресурсы, которые всегда должны быть свежими (network-first)
const NETWORK_FIRST_URLS = [
  '/api/',
  '/supabase/',
  '/functions/'
];

// Максимальный размер динамического кеша
const MAX_CACHE_SIZE = 50;
const MAX_IMAGE_CACHE_SIZE = 30;

/* ============================================
   УСТАНОВКА (Install)
   ============================================ */
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[Service Worker] Precaching static assets');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => {
        console.log('[Service Worker] Installed successfully');
        return self.skipWaiting(); // Активировать сразу
      })
      .catch((error) => {
        console.error('[Service Worker] Installation failed:', error);
      })
  );
});

/* ============================================
   АКТИВАЦИЯ (Activate)
   ============================================ */
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        // Удаляем старые кеши
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName.startsWith('katia-') && cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== IMAGE_CACHE;
            })
            .map((cacheName) => {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[Service Worker] Activated successfully');
        return self.clients.claim(); // Контролировать все вкладки
      })
  );
});

/* ============================================
   FETCH - Стратегии кеширования
   ============================================ */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Игнорируем non-GET запросы
  if (request.method !== 'GET') {
    return;
  }

  // Игнорируем chrome extensions
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // Стратегия для изображений: Cache First
  if (request.destination === 'image') {
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE, MAX_IMAGE_CACHE_SIZE));
    return;
  }

  // Стратегия для API: Network First
  if (NETWORK_FIRST_URLS.some(apiUrl => url.pathname.includes(apiUrl))) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Стратегия для HTML: Network First с fallback
  if (request.headers.get('accept').includes('text/html')) {
    event.respondWith(networkFirstWithOffline(request));
    return;
  }

  // Стратегия для статических файлов: Cache First
  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'font' ||
    request.destination === 'manifest'
  ) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
    return;
  }

  // Для всего остального: Stale While Revalidate
  event.respondWith(staleWhileRevalidate(request));
});

/* ============================================
   CACHE FIRST - Сначала кеш, потом сеть
   ============================================ */
async function cacheFirstStrategy(request, cacheName = DYNAMIC_CACHE, maxSize = MAX_CACHE_SIZE) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    console.log('[Service Worker] Cache hit:', request.url);
    return cached;
  }

  try {
    const response = await fetch(request);
    
    if (response && response.status === 200) {
      const clonedResponse = response.clone();
      cache.put(request, clonedResponse);
      await limitCacheSize(cacheName, maxSize);
    }
    
    return response;
  } catch (error) {
    console.error('[Service Worker] Fetch failed:', error);
    
    // Возвращаем offline страницу для навигации
    if (request.destination === 'document') {
      return caches.match('/offline.html');
    }
    
    throw error;
  }
}

/* ============================================
   NETWORK FIRST - Сначала сеть, потом кеш
   ============================================ */
async function networkFirstStrategy(request) {
  const cache = await caches.open(DYNAMIC_CACHE);

  try {
    const response = await fetch(request);
    
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[Service Worker] Network failed, trying cache:', request.url);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    throw error;
  }
}

/* ============================================
   NETWORK FIRST with Offline Fallback
   ============================================ */
async function networkFirstWithOffline(request) {
  try {
    const response = await fetch(request);
    
    if (response && response.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    
    if (cached) {
      return cached;
    }
    
    // Показываем offline страницу
    return caches.match('/offline.html');
  }
}

/* ============================================
   STALE WHILE REVALIDATE
   ============================================ */
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response && response.status === 200) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);

  return cached || fetchPromise;
}

/* ============================================
   УТИЛИТЫ
   ============================================ */

// Ограничение размера кеша
async function limitCacheSize(cacheName, maxSize) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxSize) {
    // Удаляем самые старые записи
    const keysToDelete = keys.slice(0, keys.length - maxSize);
    await Promise.all(keysToDelete.map(key => cache.delete(key)));
  }
}

/* ============================================
   BACKGROUND SYNC - Синхронизация в фоне
   ============================================ */
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'sync-bookings') {
    event.waitUntil(syncBookings());
  }
});

async function syncBookings() {
  console.log('[Service Worker] Syncing bookings...');
  // Здесь будет логика синхронизации бронирований
  // когда восстановится интернет
}

/* ============================================
   PUSH NOTIFICATIONS - Уведомления
   ============================================ */
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received:', event);
  
  let notificationData = {
    title: 'Katia Beauty',
    body: 'У вас новое уведомление',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'katia-notification',
    requireInteraction: false
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        ...notificationData,
        ...data,
        data: data // Сохраняем данные для клика
      };
    } catch (error) {
      console.error('[Service Worker] Failed to parse push data:', error);
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

/* ============================================
   NOTIFICATION CLICK - Клик по уведомлению
   ============================================ */
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked:', event);
  
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Ищем уже открытую вкладку
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Открываем новую вкладку
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

/* ============================================
   MESSAGES - Сообщения от клиента
   ============================================ */
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    const urls = event.data.urls || [];
    event.waitUntil(
      caches.open(DYNAMIC_CACHE)
        .then(cache => cache.addAll(urls))
    );
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      })
    );
  }
});

console.log('[Service Worker] Loaded successfully');
