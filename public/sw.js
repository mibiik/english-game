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
  console.log('🔄 Arka plan monitoring başlatılıyor...');
  
  const db = await initializeFirebase();
  if (!db) {
    console.error('Firebase başlatılamadı, monitoring başlatılamıyor');
    return;
  }
  
  // İlk kontrol
  await checkScoreChanges(db);
  
  // Her 30 saniyede bir kontrol et
  monitoringInterval = setInterval(async () => {
    await checkScoreChanges(db);
  }, 30000); // 30 saniye
  
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
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Service Worker yüklendiğinde monitoring'i başlat
        startBackgroundMonitoring();
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
    }).then(() => {
      // Service Worker aktif olduğunda monitoring'i başlat
      startBackgroundMonitoring();
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