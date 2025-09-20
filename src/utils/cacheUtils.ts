// Cache yönetimi için utility fonksiyonları

export const clearAllCaches = async (): Promise<void> => {
  try {
    console.log('🔄 Cache temizleme başlatılıyor...');
    
    // Service Worker cache'lerini temizle
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => {
          console.log(`🗑️ Cache siliniyor: ${cacheName}`);
          return caches.delete(cacheName);
        })
      );
      console.log('✅ Tüm cache\'ler temizlendi');
    }

    // Service Worker'ları kaldır
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        console.log('🔄 Service Worker kaldırılıyor...');
        await registration.unregister();
      }
      console.log('✅ Service Worker\'lar kaldırıldı');
    }

    // IndexedDB'yi temizle (isteğe bağlı)
    if ('indexedDB' in window) {
      const databases = await indexedDB.databases();
      for (const db of databases) {
        if (db.name) {
          console.log(`🗑️ IndexedDB siliniyor: ${db.name}`);
          indexedDB.deleteDatabase(db.name);
        }
      }
    }

    // localStorage'ı temizle (isteğe bağlı - yorum satırından çıkarın)
    // localStorage.clear();
    // console.log('✅ localStorage temizlendi');

    console.log('✅ Tüm cache temizleme işlemleri tamamlandı');
  } catch (error) {
    console.error('❌ Cache temizleme hatası:', error);
    throw error;
  }
};

export const forceRefresh = (): void => {
  console.log('🔄 Sayfa zorla yenileniyor...');
  window.location.reload();
};

export const clearCacheAndRefresh = async (): Promise<void> => {
  await clearAllCaches();
  forceRefresh();
};

export const checkForUpdates = async (): Promise<boolean> => {
  try {
    // Service Worker güncellemelerini kontrol et
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('❌ Güncelleme kontrolü hatası:', error);
    return false;
  }
};

export const addCacheBustingToUrl = (url: string): string => {
  const separator = url.includes('?') ? '&' : '?';
  const timestamp = Date.now();
  return `${url}${separator}_t=${timestamp}`;
};

export const isCacheStale = (lastUpdate: string, maxAge: number = 24 * 60 * 60 * 1000): boolean => {
  const lastUpdateTime = new Date(lastUpdate).getTime();
  const currentTime = Date.now();
  return (currentTime - lastUpdateTime) > maxAge;
};

// Cache durumunu kontrol et
export const getCacheStatus = async (): Promise<{
  hasServiceWorker: boolean;
  cacheCount: number;
  storageUsage: number;
}> => {
  let hasServiceWorker = false;
  let cacheCount = 0;
  let storageUsage = 0;

  try {
    // Service Worker kontrolü
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      hasServiceWorker = !!registration;
    }

    // Cache sayısı
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      cacheCount = cacheNames.length;
    }

    // Storage kullanımı
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      storageUsage = estimate.usage || 0;
    }

    return { hasServiceWorker, cacheCount, storageUsage };
  } catch (error) {
    console.error('❌ Cache durumu kontrolü hatası:', error);
    return { hasServiceWorker: false, cacheCount: 0, storageUsage: 0 };
  }
};

// Debug için cache bilgilerini logla
export const logCacheInfo = async (): Promise<void> => {
  const status = await getCacheStatus();
  console.log('📊 Cache Durumu:', status);
  
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    console.log('📋 Mevcut Cache\'ler:', cacheNames);
  }
}; 