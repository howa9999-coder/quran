const CACHE_NAME = "app-cache-v2"; // Increment this version when you update files
const urlsToCache = [
  "index.html",
  "index.js",
  "manifest.json",
  "style.css",
  "main.js",
  "icon192.png",
  "icon512.ico",
];

// Install service worker and cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // Immediately activate new service worker
});

// Activate service worker and remove old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); // Delete old cache
          }
        })
      );
    })
  );
  self.clients.claim(); // Take control of all clients immediately
});

// Fetch resources
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
