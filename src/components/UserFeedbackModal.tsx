import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, Zap, Clock, MousePointer } from 'lucide-react';
import { authService } from '../services/authService';
import { db } from '../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

interface UserFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserFeedbackModal: React.FC<UserFeedbackModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = async () => {
    setIsLoading(true);
    try {
      const userId = authService.getCurrentUserId();
      if (userId) {
        // Firebase'de modal gösterildi flag'ini güncelle
        const userProfileRef = doc(db, 'userProfiles', userId);
        await updateDoc(userProfileRef, {
          userFeedbackModalShown: true,
          userFeedbackModalShownAt: new Date()
        });
      }
    } catch (error) {
      console.error('Modal flag güncellenirken hata:', error);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl shadow-2xl max-w-lg w-full p-8 relative border border-blue-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Kapatma butonu */}
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-white/50"
            >
              <X className="w-6 h-6" />
            </button>

            {/* İçerik */}
            <div className="text-center space-y-6">
              {/* İkon */}
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
              </div>

              {/* Başlık */}
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Sorun Çözüldü! 🎉
                </h2>
                <p className="text-gray-600 text-lg">
                  Eşleştirme oyunundaki performans sorunu düzeltildi
                </p>
              </div>

              {/* Sorun Açıklaması */}
              <div className="bg-white/70 rounded-2xl p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <MousePointer className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-800 mb-1">Sorun:</h3>
                    <p className="text-gray-600 text-sm">
                      "Eşleştirmede süreli olunca şık seçmek bazen çalışmıyor tek tıklamada seçmiş olmuyorum tutukluk yapıyor gibi ara sıra ama süresiz olunca tek tıklamada kelimeyi seçebiliyorum"
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Zap className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-800 mb-1">Çözüm:</h3>
                    <p className="text-gray-600 text-sm">
                      Timer performans optimizasyonu, kart tıklama olaylarının iyileştirilmesi ve React memoization teknikleri uygulandı
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-800 mb-1">Sonuç:</h3>
                    <p className="text-gray-600 text-sm">
                      Artık süreli modda da kartlar tek tıklamada seçilebiliyor ve oyun daha akıcı çalışıyor
                    </p>
                  </div>
                </div>
              </div>

              {/* Teşekkür Mesajı */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-4 text-white">
                <p className="font-semibold">
                  Geri bildirimin için teşekkürler! 🙏
                </p>
                <p className="text-blue-100 text-sm mt-1">
                  Bu tür geri bildirimler uygulamanın gelişmesine büyük katkı sağlıyor.
                </p>
              </div>

              {/* Buton */}
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-4 px-8 rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 transform hover:scale-105"
              >
                {isLoading ? 'Kapatılıyor...' : 'Harika! Anladım'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 