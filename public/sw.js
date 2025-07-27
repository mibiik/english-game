const CACHE_NAME = 'wordplay-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/assets/aaaaaaaadwü/ogrenmemodu.jpg',
  '/assets/aaaaaaaadwü/coktansecmeli.jpg',
  '/assets/aaaaaaaadwü/eşeştirme.jpg',
  '/assets/aaaaaaaadwü/boslukdoldurma.jpg',
  '/assets/aaaaaaaadwü/wordform.jpg',
  '/assets/aaaaaaaadwü/tanım.jpg',
  '/assets/aaaaaaaadwü/parapprase.jpg',
  '/assets/aaaaaaaadwü/essay.jpg',
  '/assets/aaaaaaaadwü/preposition.jpg',
  '/assets/aaaaaaaadwü/kelimekartlari.jpg',
  '/assets/aaaaaaaadwü/kelimeyarisi.jpg',
  '/assets/aaaaaaaadwü/konusma.jpg',
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 