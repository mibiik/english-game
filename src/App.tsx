import React, { useState, useEffect } from 'react';
import { BrowserRouter, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { AppRoutes } from './Routes';
import { Auth } from './components/Auth';
import { Analytics } from '@vercel/analytics/react';
import { supabaseAuthService } from './services/supabaseAuthService';
import ProfilePage from './pages/ProfilePage';
import { newDetailedWords_part1 } from './data/words';
import { detailedWords_part1 as upperIntermediateWordsRaw, WordDetail } from './data/word4';
import { newDetailedWords_part1 as preIntermediateWordsRaw } from './data/word2';
import { newDetailedWords_part1 as foundationWordsRaw } from './data/word1';
import { kuepeWords } from './data/kuepe';
import { supabase } from './config/supabase';
import { X, Sparkles } from 'lucide-react';
import MehmetModal from './components/MehmetModal';
import { PerformanceMonitor } from './components/PerformanceMonitor';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import NotificationPermission from './components/NotificationPermission';
import { userAnalyticsService } from './services/userAnalyticsService';
import { deviceDetectionService } from './services/deviceDetectionService';
import { analyticsCollector } from './services/analyticsCollector';
import { notificationService } from './services/notificationService';

const intermediateWords: WordDetail[] = newDetailedWords_part1;
const upperIntermediateWords: WordDetail[] = upperIntermediateWordsRaw;
const preIntermediateWords: WordDetail[] = preIntermediateWordsRaw;
const foundationWords: WordDetail[] = foundationWordsRaw;
const kuepeWordsList: WordDetail[] = kuepeWords;

function AppContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Güvenli localStorage yardımcıları
  const safeGetItem = (key: string): string | null => {
    try { return localStorage.getItem(key); } catch { return null; }
  };
  const safeSetItem = (key: string, value: string) => {
    try { localStorage.setItem(key, value); } catch { /* ignore */ }
  };
  const safeRemoveItem = (key: string) => {
    try { localStorage.removeItem(key); } catch { /* ignore */ }
  };
  
  // Kullanıcı ismini localStorage'dan al
  const [userName, setUserName] = useState<string | null>(() => {
    try { return localStorage.getItem('userName'); } catch { return null; }
  });

  // Firebase Authentication durumu
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const [currentLevel, setCurrentLevel] = useState<'intermediate' | 'upper-intermediate' | 'pre-intermediate' | 'foundation' | 'kuepe'>(() => {
    const urlLevel = searchParams.get('level') as 'intermediate' | 'upper-intermediate' | 'pre-intermediate' | 'foundation' | 'kuepe';
    if (urlLevel) {
      return urlLevel;
    }
    let savedLevel: any = null;
    try { savedLevel = localStorage.getItem('currentLevel') as any; } catch { savedLevel = null; }
    return savedLevel || 'foundation';
  });

  const [currentUnit, setCurrentUnit] = useState(() => {
    const urlUnit = searchParams.get('unit');
    if (urlUnit) {
      return urlUnit;
    }
    let savedUnit: string | null = null;
    try { savedUnit = localStorage.getItem('currentUnit'); } catch { savedUnit = null; }
    return savedUnit || "1";
  });

  const [filteredWords, setFilteredWords] = useState<WordDetail[]>([]);
  const [showMehmetModal, setShowMehmetModal] = useState(false);

  // iOS/Safari tespiti
  const isIOS = /iP(hone|od|ad)/.test(navigator.platform) || (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  // Cache temizleme fonksiyonu
  const clearAllCaches = async () => {
    try {
      // iOS Safari'de agresif cache temizleme oturumu düşürebilir; atla
      if (isIOS && isSafari) {
        console.warn('iOS Safari tespit edildi: cache temizleme atlanıyor.');
        return;
      }
      // Service Worker cache'lerini temizle
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }

      // Service Worker'ı yeniden yükle
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
        }
      }

      // IndexedDB'yi temizle
      if ('indexedDB' in window) {
        const databases = await indexedDB.databases();
        for (const db of databases) {
          if (db.name) {
            indexedDB.deleteDatabase(db.name);
          }
        }
      }

      // Sayfayı yenile
      window.location.reload();
    } catch (error) {
      console.error('❌ Cache temizleme hatası:', error);
    }
  };

  // Uygulama başlangıcında cache kontrolü
  useEffect(() => {
    // Build time kontrolü
    const buildTime = (window as any).__BUILD_TIME__;
    const lastBuildTime = safeGetItem('lastBuildTime');
    
    if (buildTime && lastBuildTime && buildTime !== lastBuildTime) {
      console.log('🔄 Yeni build tespit edildi, cache temizleniyor...');
      safeSetItem('lastBuildTime', buildTime);
      clearAllCaches();
      return;
    }

    // İlk yüklemede build time'ı kaydet
    if (buildTime && !lastBuildTime) {
      safeSetItem('lastBuildTime', buildTime);
    }

    // Kullanıcılar için otomatik bir kez cache temizleme (iOS Safari'de devre dışı)
    const hasClearedCache = safeGetItem('hasClearedCache');
    if (!hasClearedCache && !(isIOS && isSafari)) {
      console.log('🔄 İlk kez cache temizleme yapılıyor...');
      safeSetItem('hasClearedCache', 'true');
      setTimeout(() => {
        clearAllCaches();
      }, 3000);
      return;
    }
  }, []);

  // Bildirim servisini başlat
  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        // Service Worker'ı kaydet
        await notificationService.registerServiceWorker();
        
        // Bildirim izni varsa günlük hatırlatma ayarla
        if (Notification.permission === 'granted') {
          // Her gün saat 18:00'de hatırlatma gönder
          const now = new Date();
          const reminderTime = new Date();
          reminderTime.setHours(18, 0, 0, 0);
          
          if (now.getTime() < reminderTime.getTime()) {
            const timeUntilReminder = reminderTime.getTime() - now.getTime();
            setTimeout(() => {
              notificationService.sendDailyReminder();
            }, timeUntilReminder);
          }
        }
      } catch (error) {
        console.error('Bildirim servisi başlatılamadı:', error);
      }
    };

    initializeNotifications();
  }, []);

    console.log('🚀 Uygulama başlatılıyor - Monitoring başlatılıyor...');
    
    // Ana uygulama monitoring'i
    userAnalyticsService.startMonitoring();
    
    // Analiz veri toplamayı başlat
    analyticsCollector.startCollection();
    
    // Service Worker ile iletişim kur
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        // Service Worker'a monitoring başlatma mesajı gönder
        registration.active?.postMessage({
          type: 'START_MONITORING'
        });
        console.log('✅ Service Worker monitoring başlatıldı');
      });
    }
    
    // Uygulama kapanırken monitoring'i durdur
    return () => {
      console.log('🛑 Uygulama kapanıyor - Monitoring durduruluyor...');
      userAnalyticsService.stopMonitoring();
      analyticsCollector.stopCollection();
      
      // Service Worker'a monitoring durdurma mesajı gönder
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.active?.postMessage({
            type: 'STOP_MONITORING'
          });
        });
      }
    });
  }, []);


  // Supabase Authentication durumunu dinle
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session ? 'User logged in' : 'User logged out');
      const user = session?.user || null;
      setIsAuthenticated(!!user);
      
      if (user) {
        // Kullanıcı giriş yapmış
        console.log('User is authenticated:', user.email);
        
        // Oturum bilgilerini localStorage'a kaydet
        localStorage.setItem('lastAuthCheck', new Date().toISOString());
        localStorage.setItem('authUserId', user.id);
        
        // Cihaz bilgisini tespit et ve kaydet
        deviceDetectionService.saveDeviceInfo(user.id).then(() => {
          console.log('📱 Cihaz bilgisi kaydedildi');
        }).catch((error) => {
          console.error('Cihaz bilgisi kaydedilirken hata:', error);
        });
        
        // Cihaz değişikliği kontrolü
        deviceDetectionService.detectDeviceChange().then((hasChanged) => {
          if (hasChanged) {
            console.log('🔄 Cihaz değişikliği tespit edildi ve kaydedildi');
          }
        }).catch((error) => {
          console.error('Cihaz değişikliği kontrolünde hata:', error);
        });
        
        // Eğer karşılama sayfasındaysa ana sayfaya yönlendir
        if (location.pathname === '/') {
          navigate('/home', { replace: true });
        }
      } else {
        // Kullanıcı çıkış yapmış
        console.log('User is not authenticated');
        
        // localStorage'dan oturum bilgilerini temizle
        localStorage.removeItem('lastAuthCheck');
        localStorage.removeItem('authUserId');
        
        // Eğer korumalı bir sayfadaysa karşılama sayfasına yönlendir
        // Footer linkleri (hakkımızda, iletişim, sss, destek, gizlilik, kullanım şartları) korumalı değil
        const publicPages = ['/', '/hakkimizda', '/iletisim', '/sss', '/destek', '/gizlilik', '/kullanim-sartlari'];
        if (!publicPages.includes(location.pathname)) {
          navigate('/', { replace: true });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  // Sayfa yüklendiğinde ve sekme değişikliklerinde oturum durumunu kontrol et
  useEffect(() => {
    const checkAuthState = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const storedUserId = localStorage.getItem('authUserId');
      
      // Supabase auth state ile localStorage senkronizasyonu
      if (user && storedUserId && user.id === storedUserId) {
        // Tutarlı durum - kullanıcı giriş yapmış
        setIsAuthenticated(true);
        console.log('Auth state synchronized - user is authenticated');
      } else if (!user && !storedUserId) {
        // Tutarlı durum - kullanıcı giriş yapmamış
        setIsAuthenticated(false);
        console.log('Auth state synchronized - user is not authenticated');
      } else {
        // Tutarsız durum - localStorage'ı temizle ve Supabase state'ini kullan
        console.log('Auth state inconsistency detected, clearing localStorage');
        localStorage.removeItem('lastAuthCheck');
        localStorage.removeItem('authUserId');
        setIsAuthenticated(!!user);
      }
    };

    // İlk yükleme
    checkAuthState();

    // Sekme değişikliklerini dinle - daha az sıklıkta
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Tab became visible, checking auth state');
        // Sadece 5 saniyede bir kontrol et
        setTimeout(checkAuthState, 5000);
      }
    };

    // Focus event'ini dinle (sekme değişikliği) - daha az sıklıkta
    const handleFocus = () => {
      console.log('Window focused, checking auth state');
      // Sadece 5 saniyede bir kontrol et
      setTimeout(checkAuthState, 5000);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Mehmet Bahçeçi için modal kontrolü
  useEffect(() => {
    const checkMehmetModal = async () => {
      if (isAuthenticated) {
        const userId = supabaseAuthService.getCurrentUserId();
        if (userId === 'hBXgKnZcj5g0SlyiwcRADWm3q6v1') {
          try {
            const { data: userProfile, error } = await supabase
              .from('users')
              .select('mehmetModalShown')
              .eq('id', userId)
              .single();
            
            if (userProfile && !userProfile.mehmetModalShown) {
              setShowMehmetModal(true);
            }
          } catch (error) {
            console.error('Mehmet modal kontrolü sırasında hata:', error);
          }
        }
      }
    };
    checkMehmetModal();
  }, [isAuthenticated]);







  // URL parametreleri değiştiğinde state'i ve localStorage'ı güncelle
  useEffect(() => {
    const urlUnit = searchParams.get('unit');
    const urlLevel = searchParams.get('level') as 'intermediate' | 'upper-intermediate' | 'pre-intermediate' | 'foundation' | 'kuepe';
    if (urlUnit) {
      localStorage.setItem('currentUnit', urlUnit);
    }
    if (urlLevel) {
      localStorage.setItem('currentLevel', urlLevel);
    }
    if (urlUnit && urlUnit !== currentUnit) {
      setCurrentUnit(urlUnit);
    }
    if (urlLevel && urlLevel !== currentLevel) {
      setCurrentLevel(urlLevel);
    }
  }, [searchParams, currentUnit, currentLevel]);

  // Filtrelenmiş kelimeleri güncelle
  useEffect(() => {
    let sourceData: WordDetail[];
    if (currentLevel === 'upper-intermediate') {
      sourceData = upperIntermediateWords;
    } else if (currentLevel === 'pre-intermediate') {
      sourceData = preIntermediateWords;
    } else if (currentLevel === 'foundation') {
      sourceData = foundationWords;
    } else if (currentLevel === 'kuepe') {
      sourceData = kuepeWordsList;
    } else {
      sourceData = intermediateWords;
    }
    
    // KUEPE için ünite filtrelemesi yok, tüm kelimeler gösterilir
    if (currentLevel === 'kuepe') {
      setFilteredWords(sourceData);
    } else if (currentUnit === 'all') {
      setFilteredWords(sourceData);
    } else {
      const unitFilter = (word: WordDetail) => word.unit === currentUnit;
      setFilteredWords(sourceData.filter(unitFilter));
    }
  }, [currentLevel, currentUnit]);

  // currentUnit ve currentLevel güncelleyicileri
  const updateURLParams = (unit: string, level: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('unit', unit);
    newParams.set('level', level);
    setSearchParams(newParams, { replace: true });
  };
  const handleSetCurrentUnit = (unit: string) => {
    setCurrentUnit(unit);
    localStorage.setItem('currentUnit', unit);
    updateURLParams(unit, currentLevel);
  };
    setCurrentLevel(level);
    localStorage.setItem('currentLevel', level);
    updateURLParams(currentUnit, level);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#111] to-black">
      <AppRoutes 
        currentUnit={currentUnit}
        setCurrentUnit={handleSetCurrentUnit}
        currentLevel={currentLevel}
        setCurrentLevel={handleSetCurrentLevel}
        filteredWords={filteredWords}
        isAuthenticated={isAuthenticated}
      />
      <MehmetModal 
        isOpen={showMehmetModal} 
        onClose={() => setShowMehmetModal(false)} 
      />
      <PWAInstallPrompt />
      <NotificationPermission />
      <PerformanceMonitor />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
