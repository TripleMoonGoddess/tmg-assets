// Service Worker for Triple Moon Goddess PWA
const CACHE_NAME = 'tmg-widget-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Let all requests pass through to network
  // PWA primarily for "Add to Home Screen" capability
  event.respondWith(fetch(event.request));
});
