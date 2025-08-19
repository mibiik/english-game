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

// Monitoring sistemi
let monitoringInterval;
let scoreHistory = new Map();
const ANOMALY_THRESHOLD = 100; // Anomali eşiği

// Firebase Firestore bağlantısı
async function initializeFirebase() {
  try {
    // Firebase'i Service Worker'da başlat
    if (typeof importScripts === 'function') {
      importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
      importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore-compat.js');
      
      firebase.initializeApp(firebaseConfig);
      const db = firebase.firestore();
      return db;
    }
  } catch (error) {
    console.error('Firebase başlatılamadı:', error);
    return null;
  }
}

// Puan değişikliğini kontrol et
async function checkScoreChanges(db) {
  try {
    const usersRef = db.collection('userProfiles');
    const snapshot = await usersRef.orderBy('totalScore', 'desc').get();
    
    snapshot.forEach((doc) => {
      const userData = doc.data();
      const userId = doc.id;
      const newScore = userData.totalScore || 0;
      const userName = userData.displayName || 'Bilinmeyen Kullanıcı';
      
      // Kullanıcının geçmiş puanını al
      const history = scoreHistory.get(userId);
      const oldScore = history?.scores[history.scores.length - 1]?.score || 0;
      
      // Puan değişikliğini hesapla
      const change = newScore - oldScore;
      
      // Eğer puan düştüyse ve anomali eşiğini geçtiyse
      if (change < -ANOMALY_THRESHOLD) {
        console.warn('🚨 ARKA PLAN ANOMALİ ALGILANDI:', {
          userId,
          userName,
          oldScore,
          newScore,
          change,
          timestamp: new Date()
        });
        
        // Anomaliyi kaydet
        saveAnomaly(db, {
          userId,
          userName,
          oldScore,
          newScore,
          change,
          timestamp: new Date(),
          reason: 'Arka plan monitoring - ani puan düşüşü',
          isAnomaly: true
        });
        
        // Admin'e bildir
        notifyAdmin(db, {
          userId,
          userName,
          oldScore,
          newScore,
          change,
          timestamp: new Date(),
          type: 'score_anomaly',
          title: 'Puan Anomalisi Algılandı',
          message: `${userName} kullanıcısının puanı ${oldScore}'den ${newScore}'e düştü (${change} puan)`
        });
        
        // Son puanı yedekle
        backupLastScore(db, userId, userName, oldScore);
      }
      
      // Puan geçmişini güncelle
      updateScoreHistory(userId, userName, newScore);
    });
  } catch (error) {
    console.error('Puan kontrolü sırasında hata:', error);
  }
}

// Puan geçmişini güncelle
function updateScoreHistory(userId, userName, score) {
  const history = scoreHistory.get(userId) || { userId, userName, scores: [] };
  history.scores.push({ score, timestamp: new Date() });
  
  // Son 10 puanı tut
  if (history.scores.length > 10) {
    history.scores = history.scores.slice(-10);
  }
  
  scoreHistory.set(userId, history);
}

// Anomaliyi kaydet
async function saveAnomaly(db, scoreChange) {
  try {
    await db.collection('scoreAnomalies').add({
      ...scoreChange,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (error) {
    console.error('Anomali kaydedilirken hata:', error);
  }
}

// Admin'e bildir
async function notifyAdmin(db, notification) {
  try {
    await db.collection('adminNotifications').add({
      ...notification,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      isRead: false
    });
  } catch (error) {
    console.error('Admin bildirimi gönderilirken hata:', error);
  }
}

// Son puanı yedekle
async function backupLastScore(db, userId, userName, score) {
  try {
    await db.collection('scoreBackups').add({
      userId,
      userName,
      score,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (error) {
    console.error('Puan yedeklenirken hata:', error);
  }
}

// Monitoring'i başlat
async function startBackgroundMonitoring() {
  // Eğer zaten çalışıyorsa tekrar başlatma
  if (monitoringInterval) {
    console.log('⚠️ Monitoring zaten aktif');
    return;
  }
  
  console.log('🔄 Arka plan monitoring başlatılıyor...');
  
  const db = await initializeFirebase();
  if (!db) {
    console.error('Firebase başlatılamadı, monitoring başlatılamıyor');
    return;
  }
  
  // İlk kontrol
  await checkScoreChanges(db);
  
  // Her 5 dakikada bir kontrol et (daha az sıklık)
  monitoringInterval = setInterval(async () => {
    await checkScoreChanges(db);
  }, 300000); // 5 dakika
  
  console.log('✅ Arka plan monitoring aktif');
}

// Monitoring'i durdur
function stopBackgroundMonitoring() {
  if (monitoringInterval) {
    clearInterval(monitoringInterval);
    monitoringInterval = null;
    console.log('🛑 Arka plan monitoring durduruldu');
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
    }).then(() => {
      // Monitoring'i sadece bir kez başlat
      setTimeout(() => {
        startBackgroundMonitoring();
      }, 5000); // 5 saniye sonra başlat
    })
  );
});

// Message event - ana uygulamadan gelen mesajları dinle
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'START_MONITORING') {
    startBackgroundMonitoring();
  } else if (event.data && event.data.type === 'STOP_MONITORING') {
    stopBackgroundMonitoring();
  }
});

// Sync event - arka plan senkronizasyonu
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-monitoring') {
    event.waitUntil(checkScoreChanges());
  }
});

// Push event - push notification'ları
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.message,
      icon: '/a.png',
      badge: '/a.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
}); 