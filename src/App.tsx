import { useState, useEffect } from 'react';
import { BrowserRouter, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { AppRoutes } from './Routes';
import { Analytics } from '@vercel/analytics/react';
import { supabaseAuthService } from './services/supabaseAuthService';
import { supabase } from './config/supabase';
import MehmetModal from './components/MehmetModal';
import { PerformanceMonitor } from './components/PerformanceMonitor';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import NotificationPermission from './components/NotificationPermission';
import { userAnalyticsService } from './services/userAnalyticsService';
import { deviceDetectionService } from './services/deviceDetectionService';
import { analyticsCollector } from './services/analyticsCollector';
import { notificationService } from './services/notificationService';
import { puterService } from './services/puterService';
import LazyAuth from './components/LazyAuth';
import SharePromptModal from './components/SharePromptModal';


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

  // Authentication durumu - null: yükleniyor, true: giriş yapmış, false: giriş yapmamış
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(() => {
    // Başlangıçta localStorage'dan kontrol et
    try {
      const storedUser = localStorage.getItem('supabase.auth.token');
      const authUserId = localStorage.getItem('authUserId');
      // Eğer localStorage'da oturum bilgisi varsa, null döndür (yükleniyor)
      // Böylece asenkron kontrol tamamlanana kadar kullanıcı yönlendirilmez
      if (storedUser && authUserId) {
        return null; // Yükleniyor durumu
      }
      return false; // Kesinlikle giriş yapmamış
    } catch {
      return null; // Hata durumunda yükleniyor
    }
  });

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

  const [showMehmetModal, setShowMehmetModal] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Platform tespiti kaldırıldı (oturum korunumu için agresif temizlik devre dışı)

  // Cache temizleme fonksiyonu
  // Oturumun korunması adına agresif cache temizleme kaldırıldı.

  // Uygulama başlangıcında cache kontrolü
  useEffect(() => {
    // Build time kontrolü
    const buildTime = (window as any).__BUILD_TIME__;
    const lastBuildTime = safeGetItem('lastBuildTime');
    
    if (buildTime && lastBuildTime && buildTime !== lastBuildTime) {
      console.log('🔄 Yeni build tespit edildi, yumuşak yenileme yapılıyor (oturum korunur)...');
      safeSetItem('lastBuildTime', buildTime);
      // Oturumu etkilemeden sadece sayfayı yenile
      window.location.reload();
      return;
    }

    // İlk yüklemede build time'ı kaydet
    if (buildTime && !lastBuildTime) {
      safeSetItem('lastBuildTime', buildTime);
    }

    // Kullanıcılar için otomatik bir kez cache temizleme (iOS Safari'de devre dışı)
    // Oturumu riske atmamak için otomatik cache temizleme KAPATILDI

    // Puter servisini başlat
    const initializePuter = async () => {
      try {
        console.log('🚀 Puter servisi başlatılıyor...');
        await puterService.initialize();
        console.log('✅ Puter servisi başarıyla başlatıldı');
      } catch (error) {
        console.error('❌ Puter servisi başlatılamadı:', error);
      }
    };

    initializePuter();
  }, []);

  // Paylaşım modali zamanlayıcı
  useEffect(() => {
    const INTERVAL_MS = 12 * 60 * 60 * 1000; // 12 saat

    let intervalId: number | undefined;

    const checkFromProfileAndMaybeShow = async () => {
      try {
        if (!isAuthenticated) return;
        const userId = localStorage.getItem('authUserId');
        if (!userId) return;

        const { data, error } = await supabase
          .from('users')
          .select('sharePromptLastShownAt')
          .eq('id', userId)
          .single();

        if (error) {
          console.warn('sharePromptLastShownAt okunamadı, varsayılan gösterim uygulanacak:', error.message);
        }

        const last = data?.sharePromptLastShownAt ? new Date(data.sharePromptLastShownAt).getTime() : 0;
        console.log('SharePrompt kontrolü:', { lastShownAt: data?.sharePromptLastShownAt, last, now: Date.now() });
        if (Date.now() - last >= INTERVAL_MS) {
          setShowShareModal(true);
        }
      } catch (e) {
        console.warn('Share modal profil kontrol hatası, varsayılan gösterim uygulanacak:', e);
        setShowShareModal(true);
      }
    };

    // Açılışta hemen kontrol et
    checkFromProfileAndMaybeShow();

    // Düzenli aralıklarla kontrol et (5 dk)
    intervalId = window.setInterval(() => {
      checkFromProfileAndMaybeShow();
    }, 5 * 60 * 1000);

    return () => {
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [isAuthenticated]);

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

  // Ana uygulama monitoring'i
  useEffect(() => {
    console.log('🚀 Uygulama başlatılıyor - Monitoring başlatılıyor...');
    
    // Ana uygulama monitoring'i
    if (isAuthenticated) {
      const userId = localStorage.getItem('authUserId');
      if (userId) {
        userAnalyticsService.startMonitoring(userId, (data) => {
          console.log('Analytics update:', data);
        });
      }
    }
    
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
    };
  }, []);

  // Sayfa yüklendiğinde localStorage'dan authentication durumunu kontrol et (SADECE İLK YÜKLEMEDE)
  useEffect(() => {
    const checkStoredAuth = async () => {
      const storedUser = localStorage.getItem('supabase.auth.token');
      const authUserId = localStorage.getItem('authUserId');
      
      if (storedUser && authUserId) {
        try {
          // Supabase session'ını kontrol et
          const isSessionValid = await supabaseAuthService.isSessionValid();
          
          if (isSessionValid) {
            setIsAuthenticated(true);
            console.log('✅ Kullanıcı session geçerli, authenticated olarak yüklendi');
            
            // Eğer welcome sayfasındaysa ana sayfaya yönlendir
            if (location.pathname === '/welcome') {
              navigate('/', { replace: true });
            }
          } else {
            // Session geçersiz, localStorage'ı temizle
            console.log('❌ Session geçersiz, localStorage temizleniyor');
            localStorage.removeItem('supabase.auth.token');
            localStorage.removeItem('authUserId');
            localStorage.removeItem('lastAuthCheck');
            localStorage.removeItem('isAuthenticated');
            setIsAuthenticated(false);
            
            // Korumalı sayfadaysa welcome sayfasına yönlendir
            const publicPages = ['/welcome', '/hakkimizda', '/iletisim', '/sss', '/destek', '/gizlilik', '/kullanim-sartlari', '/about-founder'];
            if (!publicPages.includes(location.pathname)) {
              navigate('/welcome', { replace: true });
            }
          }
        } catch (error) {
          console.error('❌ Session validation error:', error);
          localStorage.removeItem('supabase.auth.token');
          localStorage.removeItem('authUserId');
          localStorage.removeItem('lastAuthCheck');
          localStorage.removeItem('isAuthenticated');
          setIsAuthenticated(false);
        }
      } else {
        // localStorage'da oturum bilgisi yok
        console.log('ℹ️ localStorage\'da oturum bilgisi bulunamadı');
        setIsAuthenticated(false);
      }
    };

    checkStoredAuth();
  }, []); // Sadece component mount olduğunda çalışsın

  // Supabase Authentication durumunu dinle
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔐 Auth state changed:', event, session ? 'User logged in' : 'User logged out');
      const user = session?.user || null;
      setIsAuthenticated(!!user);
      
      if (user) {
        // Kullanıcı giriş yapmış
        console.log('✅ User is authenticated:', user.email);
        
        // Oturum bilgilerini localStorage'a kaydet
        localStorage.setItem('lastAuthCheck', new Date().toISOString());
        localStorage.setItem('authUserId', user.id);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('supabase.auth.token', JSON.stringify({
          id: user.id,
          email: user.email,
          displayName: user.user_metadata?.display_name,
          photoURL: user.user_metadata?.avatar_url,
          lastLogin: new Date().toISOString()
        }));
        
        // Cihaz bilgisini tespit et ve kaydet
        deviceDetectionService.saveDeviceInfo(user.id).then(() => {
          console.log('📱 Cihaz bilgisi kaydedildi');
        }).catch((_error) => {
          console.error('Cihaz bilgisi kaydedilirken hata:', _error);
        });
        
        // Cihaz değişikliği kontrolü
        deviceDetectionService.detectDeviceChange().then((hasChanged) => {
          if (hasChanged) {
            console.log('🔄 Cihaz değişikliği tespit edildi ve kaydedildi');
          }
        }).catch((error) => {
          console.error('Cihaz değişikliği kontrolünde hata:', error);
        });
        
        // Eğer welcome sayfasındaysa ana sayfaya yönlendir
        if (location.pathname === '/welcome') {
          navigate('/', { replace: true });
        }
      } else {
        // Kullanıcı çıkış yapmış
        console.log('❌ User is not authenticated');
        
        // localStorage'dan oturum bilgilerini temizle
        localStorage.removeItem('lastAuthCheck');
        localStorage.removeItem('authUserId');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('supabase.auth.token');
        
        // Eğer korumalı bir sayfadaysa welcome sayfasına yönlendir
        const publicPages = ['/welcome', '/hakkimizda', '/iletisim', '/sss', '/destek', '/gizlilik', '/kullanim-sartlari', '/about-founder'];
        if (!publicPages.includes(location.pathname)) {
          navigate('/welcome', { replace: true });
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

  // Auth modal event listener
  useEffect(() => {
    const handleShowAuth = () => {
      setAuthMode('login');
      setShowAuth(true);
    };

    window.addEventListener('show-auth', handleShowAuth);
    
    return () => {
      window.removeEventListener('show-auth', handleShowAuth);
    };
  }, []);

  // Mehmet Bahçeçi için modal kontrolü
  useEffect(() => {
    const checkMehmetModal = async () => {
      if (isAuthenticated) {
        const userId = supabaseAuthService.getCurrentUserId();
        if (userId === 'hBXgKnZcj5g0SlyiwcRADWm3q6v1') {
          try {
            const { data: userProfile, error: _error } = await supabase
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

  const handleSetCurrentLevel = (level: 'intermediate' | 'upper-intermediate' | 'pre-intermediate' | 'foundation' | 'kuepe') => {
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
        filteredWords={[]}
        isAuthenticated={isAuthenticated}
      />
      <MehmetModal 
        isOpen={showMehmetModal} 
        onClose={() => setShowMehmetModal(false)} 
      />
      <SharePromptModal
        isOpen={showShareModal}
        onClose={() => {
          (async () => {
            try {
              const userId = localStorage.getItem('authUserId');
              if (userId) {
                await supabase
                  .from('users')
                  .update({ sharePromptLastShownAt: new Date().toISOString() })
                  .eq('id', userId);
              }
            } catch (e) {
              console.warn('sharePromptLastShownAt güncellenemedi:', e);
            } finally {
              setShowShareModal(false);
            }
          })();
        }}
      />
      
      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl"></div>
            <div className="relative p-8">
              <button
                onClick={() => setShowAuth(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <LazyAuth
                mode={authMode}
                onClose={() => setShowAuth(false)}
                onSuccess={() => { 
                  setShowAuth(false); 
                  navigate('/home'); 
                }}
              />
              <div className="mt-6 text-center">
                <span className="text-white/60 text-sm">
                  {authMode === 'login' ? 'Hesabınız yok mu?' : 'Zaten hesabınız var mı?'}
                </span>
                <button
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  className="ml-2 text-white hover:text-white/80 font-medium text-sm transition-colors duration-200"
                >
                  {authMode === 'login' ? 'Kayıt ol' : 'Giriş yap'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
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
