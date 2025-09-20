import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Monitor } from 'lucide-react';
import { useIsMobile } from '../hooks/useDeviceDetection';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [showInstallInstructions, setShowInstallInstructions] = useState(false);
  
  // Cihaz tespit hook'u
  const { isMobile } = useIsMobile();

  useEffect(() => {
    // PWA zaten yüklü mü kontrol et
    const checkIfInstalled = () => {
      // Standalone modda çalışıyorsa kurulu demektir
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        localStorage.setItem('pwa-installed', 'true');
        return;
      }
      
      // localStorage'dan kurulum durumunu kontrol et
      const isInstalled = localStorage.getItem('pwa-installed');
      if (isInstalled === 'true') {
        setIsInstalled(true);
        return;
      }
      
      // iOS Safari için özel kontrol
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS && (window.navigator as any).standalone) {
        setIsInstalled(true);
        localStorage.setItem('pwa-installed', 'true');
      }
    };

    checkIfInstalled();
    
    // Kullanıcı daha önce dismiss etmişse gösterme kontrolü
    const checkDismissStatus = () => {
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      const dismissedTime = localStorage.getItem('pwa-install-dismissed-time');
      
      if (dismissed && dismissedTime) {
        const oneWeekInMs = 7 * 24 * 60 * 60 * 1000; // 1 hafta
        const timeSinceDismissed = Date.now() - parseInt(dismissedTime);
        
        if (timeSinceDismissed < oneWeekInMs) {
          return false; // Henüz 1 hafta geçmemiş
        } else {
          // 1 hafta geçmiş, tekrar göster
          localStorage.removeItem('pwa-install-dismissed');
          localStorage.removeItem('pwa-install-dismissed-time');
        }
      }
      return true;
    };

    // Install prompt event'ini dinle
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      if (!checkDismissStatus()) return;
      
      // Mobil cihazlarda 3 saniye sonra göster
      if (isMobile) {
        setTimeout(() => {
          setShowPrompt(true);
        }, 3000);
      } else {
        setShowPrompt(true);
      }
    };

    // App installed event'ini dinle
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      
      // Kurulum tamamlandı, artık bildirimi gösterme
      localStorage.setItem('pwa-installed', 'true');
      localStorage.setItem('pwa-install-date', new Date().toISOString());
      localStorage.removeItem('pwa-install-dismissed');
      localStorage.removeItem('pwa-install-dismissed-time');
      
      console.log('🎉 PWA başarıyla kuruldu!');
      
      // Teşekkür mesajı göster
      setShowThankYou(true);
      setTimeout(() => setShowThankYou(false), 4000);
    };

    // Android'de PWA kurulum durumunu kontrol et
    const checkAndroidInstallStatus = () => {
      if (isMobile && /Android/i.test(navigator.userAgent)) {
        // Android'de standalone modda çalışıyorsa kurulu demektir
        const isStandalone = (window.navigator as any).standalone === true || 
                           window.matchMedia('(display-mode: standalone)').matches;
        
        if (isStandalone) {
          setIsInstalled(true);
          localStorage.setItem('pwa-installed', 'true');
          console.log('📱 Android PWA zaten kurulu');
        }
      }
    };

    // Android kurulum durumunu kontrol et
    checkAndroidInstallStatus();

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Mobil cihazlarda manuel olarak kurulum bildirimini göster
    if (isMobile && !isInstalled && checkDismissStatus()) {
      const manualPromptTimer = setTimeout(() => {
        // beforeinstallprompt event'i henüz tetiklenmemişse manuel göster
        if (!deferredPrompt && !isInstalled) {
          console.log('📱 Mobil cihazda PWA kurulum bildirimi gösteriliyor');
          setShowPrompt(true);
        }
      }, 3000); // 3 saniye bekle
      
      return () => {
        clearTimeout(manualPromptTimer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [deferredPrompt, isInstalled]);

  const handleInstallClick = async () => {
    // Android için özel kurulum mantığı
    if (isMobile && !deferredPrompt) {
      // Android'de manuel kurulum talimatları göster
      console.log('📱 Android manuel kurulum talimatları gösteriliyor');
      
      // Kurulum talimatları modal'ı göster
      setShowInstallInstructions(true);
      return;
    }

    // Normal PWA kurulum süreci
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error('Error during PWA install:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
    localStorage.setItem('pwa-install-dismissed-time', Date.now().toString());
  };

  // iOS için özel talimatlar
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  if (isInstalled) return null;

  return (
    <AnimatePresence>
      {/* Kurulum Bildirimi */}
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.9 }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm"
        >
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-2xl border-2 border-blue-200 p-4 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-gray-900 mb-1">
                  📱 WordPlay'i İndir!
                </h3>
                
                {isIOS && isSafari ? (
                  <div className="text-sm text-gray-700 space-y-2">
                    <p className="font-medium">🍎 iOS Kurulum:</p>
                    <div className="bg-white/50 rounded-lg p-2 border border-blue-200">
                      <div className="flex items-center gap-2 text-blue-700 text-xs">
                        <Monitor className="w-4 h-4" />
                        <span className="font-medium">Safari → Paylaş → Ana Ekrana Ekle</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-700 font-medium">
                      🚀 Ana ekranına ekle ve daha hızlı erişim sağla!
                    </p>
                    <div className="bg-white/70 rounded-lg p-2 border border-blue-300">
                      <div className="flex items-center gap-1 text-xs text-green-700 font-medium">
                        <span>✓</span>
                        <span>İnternetsiz çalışır</span>
                        <span>✓</span>
                        <span>Anında açılır</span>
                        <span>✓</span>
                        <span>Uygulama deneyimi</span>
                      </div>
                    </div>
                    <p className="text-xs text-blue-600 font-medium">
                      📱 Haftada bir hatırlatırız!
                    </p>
                  </div>
                )}
              </div>
              
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-white/50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {!(isIOS && isSafari) && (
              <div className="flex gap-2 mt-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={handleInstallClick}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  Şimdi İndir
                </motion.button>
                
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDismiss}
                  className="px-4 py-3 text-sm text-gray-600 hover:text-gray-800 hover:bg-white/50 rounded-xl transition-colors font-medium"
                >
                  Sonra
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Android Kurulum Talimatları */}
      {showInstallInstructions && (
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.9 }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm"
        >
          <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl shadow-2xl border-2 border-orange-200 p-4 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-gray-900 mb-3">
                  📱 Android Kurulum Talimatları
                </h3>
                
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="bg-white/70 rounded-lg p-3 border border-orange-300">
                    <div className="flex items-center gap-2 text-orange-700 font-medium mb-2">
                      <span className="text-lg">1️⃣</span>
                      <span>Chrome menüsünü aç</span>
                    </div>
                    <p className="text-xs text-gray-600">Sağ üstteki üç nokta (...) butonuna tıkla</p>
                  </div>
                  
                  <div className="bg-white/70 rounded-lg p-3 border border-orange-300">
                    <div className="flex items-center gap-2 text-orange-700 font-medium mb-2">
                      <span className="text-lg">2️⃣</span>
                      <span>"Ana ekrana ekle" seç</span>
                    </div>
                    <p className="text-xs text-gray-600">Menüden "Ana ekrana ekle" seçeneğini bul ve tıkla</p>
                  </div>
                  
                  <div className="bg-white/70 rounded-lg p-3 border border-orange-300">
                    <div className="flex items-center gap-2 text-orange-700 font-medium mb-2">
                      <span className="text-lg">3️⃣</span>
                      <span>Kurulumu onayla</span>
                    </div>
                    <p className="text-xs text-gray-600">"Ekle" butonuna tıklayarak kurulumu tamamla</p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setShowInstallInstructions(false)}
                className="flex-shrink-0 p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-white/50 transition-colors"
              >
                <X className="w-4 h-6" />
              </button>
            </div>
            
            <div className="flex gap-2 mt-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowInstallInstructions(false)}
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-600 text-white text-sm font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:from-orange-600 hover:to-amber-700 transition-all shadow-lg"
              >
                Anladım
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Teşekkür Mesajı */}
      {showThankYou && (
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.9 }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm"
        >
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl shadow-2xl border-2 border-green-200 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    ✓
                  </motion.div>
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-900 mb-1">
                  🎉 Harika! Kurulum Tamamlandı
                </h3>
                <p className="text-sm text-gray-700">
                  WordPlay artık ana ekranınızda! Keyifli öğrenmeler dileriz.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;
