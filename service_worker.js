const CACHE_NAME = "app-cache-v2"; // Increment this version when you update files
const urlsToCache = [
  "index.html",
  "index.js",
  "manifest.json",
  "style.css",
  "main.js",
  "quran.png",
  "quran192.png",
  "images/asr.png",
  "images/dhuhr.png",
  "images/fajr.png",
  "images/isha.png",
  "images/maghrib.png",
  "images/podium.png",
  "images/quran (3).png",
  "images/star (1).png",
  "images/pexels-simon-lovi-886614858-20082339.jpg",
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
