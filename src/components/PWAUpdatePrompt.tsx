import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, X } from 'lucide-react';

export const PWAUpdatePrompt: React.FC = () => {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        // Güncelleme var mı kontrol et
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Yeni güncelleme mevcut
                setWaitingWorker(newWorker);
                setShowUpdatePrompt(true);
              }
            });
          }
        });

        // Zaten bekleyen bir worker var mı kontrol et
        if (registration.waiting) {
          setWaitingWorker(registration.waiting);
          setShowUpdatePrompt(true);
        }
      });

      // Service Worker kontrol mesajlarını dinle
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // Yeni service worker devralındı, sayfayı yenile
        window.location.reload();
      });
    }
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      // Yeni service worker'a "skipWaiting" mesajı gönder
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      setShowUpdatePrompt(false);
    }
  };

  const handleSkip = () => {
    setShowUpdatePrompt(false);
  };

  return (
    <AnimatePresence>
      {showUpdatePrompt && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-sm"
        >
          <div className="bg-blue-50 rounded-xl shadow-lg border border-blue-200 p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-white" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-blue-900 mb-1">
                  Yeni Güncelleme Mevcut!
                </h3>
                <p className="text-xs text-blue-700 mb-3">
                  WordPlay'in yeni sürümü hazır. Güncellemek için tıklayın.
                </p>
              </div>
              
              <button
                onClick={handleSkip}
                className="flex-shrink-0 p-1 text-blue-400 hover:text-blue-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleUpdate}
                className="flex-1 bg-blue-500 text-white text-sm font-medium py-2 px-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Güncelle
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSkip}
                className="px-3 py-2 text-sm text-blue-500 hover:text-blue-700 transition-colors"
              >
                Daha Sonra
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAUpdatePrompt;
