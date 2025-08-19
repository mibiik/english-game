import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { measureWebVitals, measurePageLoad, measureMemory, measureNetwork, preventLayoutShift, checkPerformanceBudget } from './utils/webVitals'

// CLS önleme başlat
preventLayoutShift();

// Service Worker registration - Sadece production'da
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', async () => {
    try {
      // Önce mevcut service worker'ları kontrol et
      const registrations = await navigator.serviceWorker.getRegistrations();
      
      // Eski service worker'ları kaldır
      for (const registration of registrations) {
        if (registration.active) {
          console.log('🔄 Eski service worker kaldırılıyor...');
          await registration.unregister();
        }
      }

      // Yeni service worker'ı kaydet
      const registration = await navigator.serviceWorker.register('/sw.js', {
        updateViaCache: 'none', // Cache'i devre dışı bırak
        scope: '/' // Root scope'u kullan
      });
      
      console.log('✅ Service Worker kaydedildi:', registration);

      // Service worker güncellemelerini dinle
      registration.addEventListener('updatefound', () => {
        console.log('🔄 Service Worker güncellemesi bulundu');
        const newWorker = registration.installing;
        
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('🔄 Yeni service worker yüklendi, sayfa yenileniyor...');
              // Kullanıcıya bildir ve sayfayı yenile
              if (confirm('Yeni güncelleme mevcut. Sayfa yenilensin mi?')) {
                window.location.reload();
              }
            }
          });
        }
      });

      // Service worker mesajlarını dinle
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'CACHE_UPDATED') {
          console.log('✅ Cache güncellendi');
        }
      });

      // Service worker hata durumlarını dinle
      navigator.serviceWorker.addEventListener('error', (event) => {
        console.error('❌ Service Worker hatası:', event);
      });

    } catch (registrationError) {
      console.error('❌ Service Worker kayıt hatası:', registrationError);
    }
  });
}

// Development modda service worker'ları temizle
if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    const registrations = await navigator.serviceWorker.getRegistrations();
    registrations.forEach(registration => {
      console.log('🧹 Development modda service worker temizleniyor...');
      registration.unregister();
    });
  });
}

// Web Vitals izleme başlat
measureWebVitals();
measurePageLoad();
measureMemory();
measureNetwork();

// Memory kullanımını periyodik olarak izle - daha uzun interval
const memoryInterval = setInterval(() => {
  measureMemory();
}, 60000); // 60 saniyede bir (daha az sıklıkta)

// Performance budget kontrolü - sayfa yüklendikten sonra
window.addEventListener('load', () => {
  setTimeout(() => {
    checkPerformanceBudget();
  }, 2000);
});

// Memory cleanup
window.addEventListener('beforeunload', () => {
  clearInterval(memoryInterval);
});

// Memory pressure event listener
if ('memory' in performance) {
  window.addEventListener('memorypressure', () => {
    console.warn('⚠️ Memory pressure detected, cleaning up...');
    // Garbage collection'ı tetikle
    if ('gc' in window) {
      (window as any).gc();
    }
  });
}

// CLS için viewport meta tag kontrolü
const viewportMeta = document.querySelector('meta[name="viewport"]');
if (!viewportMeta) {
  const meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
  document.head.appendChild(meta);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
