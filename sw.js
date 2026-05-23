/**
 * Checkpoint Cloud — Service Worker
 * Caches the app shell + checkpoint data for offline use.
 * Strategy: cache-first for assets, network-first for data.
 */

const CACHE_NAME = 'checkpoint-cloud-v1';
const CACHE_VERSION = '1.0.0';

// App shell — cache on install, serve from cache always
const SHELL_ASSETS = [
  '/checkpoint-cloud/',
  '/checkpoint-cloud/index.html',
  '/checkpoint-cloud/manifest.json',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
];

// Data files — cache but refresh in background
const DATA_ASSETS = [
  '/checkpoint-cloud/data/checkpoints-dana-point.json',
  '/checkpoint-cloud/data/checkpoints-dana-point.csv',
];

// ---- INSTALL ----
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cache shell assets — ignore failures on external CDN
      return Promise.allSettled(
        [...SHELL_ASSETS, ...DATA_ASSETS].map(url =>
          cache.add(url).catch(() => {/* CDN may be unavailable — that's ok */})
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// ---- ACTIVATE ----
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ---- FETCH ----
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Data files: network-first, fall back to cache
  if (DATA_ASSETS.some(a => event.request.url.includes('checkpoints-dana-point'))) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Tile requests: network only (too many to cache)
  if (url.hostname.includes('basemaps.cartocdn.com')) {
    event.respondWith(fetch(event.request).catch(() => new Response('', { status: 503 })));
    return;
  }

  // Everything else: cache-first
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => {
        // Offline fallback for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/checkpoint-cloud/index.html');
        }
      });
    })
  );
});

// ---- PUSH (future: checkpoint alerts) ----
self.addEventListener('push', event => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || '⚠️ Checkpoint Alert', {
      body: data.body || 'New DUI checkpoint reported in your area.',
      icon: '/checkpoint-cloud/manifest.json',
      badge: '/checkpoint-cloud/manifest.json',
      tag: 'checkpoint-alert',
      data: { url: data.url || '/checkpoint-cloud/' }
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
