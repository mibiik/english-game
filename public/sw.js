const CACHE_NAME = 'wordplay-pwa-v1'; // PWA için yeni cache
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/a.png',
  // Game mode images
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
  // Sound files
  '/correct-choice-43861.mp3',
  '/wrong-47985.mp3'
];

// Firebase config (Service Worker için)
const firebaseConfig = {
  apiKey: "AIzaSyBv5CmjWcqUD-IoUR6fRODD1QkD6rRd_dc",
  authDomain: "engllish-e9b66.firebaseapp.com",
  projectId: "engllish-e9b66",
  storageBucket: "engllish-e9b66.firebasestorage.app",
  messagingSenderId: "108757647621",
  appId: "1:108757647621:web:42842dc88178c7058bb76c",
  measurementId: "G-ND05BVBP39"
};


// Firebase Firestore bağlantısı
async function initializeFirebase() {
  try {
    // Service Worker'da Firebase'i devre dışı bırak
    // CDN yükleme sorunları nedeniyle geçici olarak kapatıldı
    console.log('Firebase Service Worker\'da devre dışı bırakıldı');
    return null;
  } catch (error) {
    console.error('Firebase başlatılamadı:', error);
    return null;
  }
}


// Install event
self.addEventListener('install', (event) => {
  console.log('🔄 Service Worker yükleniyor...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✅ Cache açıldı:', CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Tüm dosyalar cache\'lendi');
        // Yeni service worker'ı hemen aktif et
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Cache yükleme hatası:', error);
      })
  );
});

// Fetch event - Cache stratejisini iyileştir
self.addEventListener('fetch', (event) => {
  // API çağrıları için cache kullanma
  if (event.request.url.includes('/api/') || event.request.url.includes('firebase')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // HTML dosyaları için network-first stratejisi - daha esnek
  if (event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Başarılı response'u cache'le
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Network başarısız olursa cache'den döndür
          return caches.match(event.request);
        })
    );
    return;
  }

  // JavaScript ve CSS dosyaları için stale-while-revalidate stratejisi
  if (event.request.destination === 'script' || event.request.destination === 'style') {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          const fetchPromise = fetch(event.request)
            .then((networkResponse) => {
              // Başarılı response'u cache'le (chrome-extension hariç)
              if (networkResponse.status === 200 && !event.request.url.startsWith('chrome-extension://')) {
                const responseClone = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, responseClone).catch(error => {
                    console.warn('Cache put hatası:', error);
                  });
                });
              }
              return networkResponse;
            })
            .catch(() => {
              // Network hatası durumunda cached response'u döndür
              return cachedResponse;
            });

          // Önce cache'den döndür, sonra network'ten güncelle
          return cachedResponse || fetchPromise;
        })
    );
    return;
  }

  // Diğer dosyalar için cache-first stratejisi
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
      .catch(() => {
        // Hata durumunda offline sayfası göster
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      })
  );
});

// Activate event - Eski cache'leri temizle
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker aktifleştiriliyor...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('🗑️ Eski cache siliniyor:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Eski cache\'ler temizlendi');
      // Tüm client'ları kontrol et
      return self.clients.claim();
    })
  );
});

// Message event - ana uygulamadan gelen mesajları dinle
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    // Yeni service worker'ı hemen aktif et
    self.skipWaiting();
  }
});


// Push event - push notification'ları
self.addEventListener('push', (event) => {
  console.log('📱 Push notification alındı:', event);
  
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || data.message,
      icon: '/a.png',
      badge: '/a.png',
      vibrate: [100, 50, 100],
      tag: data.tag || 'wordplay-notification',
      requireInteraction: true,
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
        url: data.url || '/',
        type: data.type || 'general'
      },
      actions: [
        {
          action: 'open',
          title: 'Aç',
          icon: '/a.png'
        },
        {
          action: 'close',
          title: 'Kapat',
          icon: '/a.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  } else {
    // Varsayılan bildirim
    const options = {
      body: 'WordPlay\'den yeni bir bildirim!',
      icon: '/a.png',
      badge: '/a.png',
      vibrate: [100, 50, 100],
      tag: 'wordplay-default',
      requireInteraction: true
    };
    
    event.waitUntil(
      self.registration.showNotification('WordPlay', options)
    );
  }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification tıklandı:', event);
  
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data;
  
  if (action === 'close') {
    return;
  }
  
  // Uygulamayı aç
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Zaten açık bir pencere varsa odaklan
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          if (data && data.url) {
            client.navigate(data.url);
          }
          return client.focus();
        }
      }
      
      // Yeni pencere aç
      if (clients.openWindow) {
        const url = data && data.url ? data.url : '/';
        return clients.openWindow(url);
      }
    })
  );
});

// Background sync event
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync:', event.tag);
  
  if (event.tag === 'daily-reminder') {
    event.waitUntil(sendDailyReminder());
  }
});

// Günlük hatırlatma gönder
async function sendDailyReminder() {
  try {
    const options = {
      body: 'Bugün kaç kelime öğrendin? WordPlay ile İngilizce seviyeni yükselt!',
      icon: '/a.png',
      badge: '/a.png',
      tag: 'daily-reminder',
      requireInteraction: true,
      data: {
        type: 'daily_reminder',
        url: '/home'
      }
    };
    
    await self.registration.showNotification('🎯 Günlük Kelime Hedefin!', options);
  } catch (error) {
    console.error('Günlük hatırlatma gönderilemedi:', error);
  }
} 