import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, X, CheckCircle, AlertCircle } from 'lucide-react';
import { notificationService } from '../services/notificationService';

export const NotificationPermission: React.FC = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [showPrompt, setShowPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Mevcut izin durumunu kontrol et
    if ('Notification' in window) {
      setPermission(Notification.permission);
      
      // Eğer izin verilmemişse ve daha önce reddedilmemişse göster
      if (Notification.permission === 'default') {
        const dismissed = localStorage.getItem('notification-dismissed');
        const dismissedTime = localStorage.getItem('notification-dismissed-time');
        
        if (!dismissed || (dismissedTime && Date.now() - parseInt(dismissedTime) > 7 * 24 * 60 * 60 * 1000)) {
          setTimeout(() => setShowPrompt(true), 2000); // 2 saniye sonra göster
        }
      }
    }
  }, []);

  const handleRequestPermission = async () => {
    setIsLoading(true);
    
    try {
      const newPermission = await notificationService.requestPermission();
      setPermission(newPermission);
      
      if (newPermission === 'granted') {
        setShowSuccess(true);
        setShowPrompt(false);
        
        // Service Worker'ı kaydet
        await notificationService.registerServiceWorker();
        
        // Test bildirimi gönder
        setTimeout(() => {
          notificationService.sendLocalNotification(
            '🎉 Bildirimler Aktif!',
            {
              body: 'WordPlay\'den günlük hatırlatmalar ve başarı bildirimleri alacaksın!',
              tag: 'welcome-notification'
            }
          );
        }, 1000);
        
        // Başarı mesajını 3 saniye sonra kapat
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        // İzin reddedildi
        setShowPrompt(false);
        localStorage.setItem('notification-dismissed', 'true');
        localStorage.setItem('notification-dismissed-time', Date.now().toString());
      }
    } catch (error) {
      console.error('Bildirim izni hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('notification-dismissed', 'true');
    localStorage.setItem('notification-dismissed-time', Date.now().toString());
  };

  // Eğer izin zaten verilmişse hiçbir şey gösterme
  if (permission === 'granted') return null;

  return (
    <AnimatePresence>
      {/* Bildirim İzni İsteği */}
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.9 }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm"
        >
          <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-xl shadow-2xl border-2 border-purple-200 p-4 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Bell className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-gray-900 mb-1">
                  🔔 Bildirimleri Aç
                </h3>
                <p className="text-sm text-gray-700 font-medium mb-2">
                  Günlük hatırlatmalar ve başarı bildirimleri al!
                </p>
                <div className="bg-white/70 rounded-lg p-2 border border-purple-300">
                  <div className="flex items-center gap-1 text-xs text-purple-700 font-medium">
                    <span>✓</span>
                    <span>Günlük kelime hatırlatması</span>
                    <span>✓</span>
                    <span>Başarı bildirimleri</span>
                    <span>✓</span>
                    <span>Seviye tamamlama</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-white/50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex gap-2 mt-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                onClick={handleRequestPermission}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-sm font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Bell className="w-4 h-4" />
                )}
                {isLoading ? 'Açılıyor...' : 'Bildirimleri Aç'}
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleDismiss}
                className="px-4 py-3 text-sm text-gray-600 hover:text-gray-800 hover:bg-white/50 rounded-xl transition-colors font-medium"
              >
                Sonra
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Başarı Mesajı */}
      {showSuccess && (
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
                    <CheckCircle className="w-6 h-6 text-white" />
                  </motion.div>
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-900 mb-1">
                  🎉 Bildirimler Aktif!
                </h3>
                <p className="text-sm text-gray-700">
                  Artık günlük hatırlatmalar ve başarı bildirimleri alacaksın.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationPermission;
