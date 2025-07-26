import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';
import { authService } from '../services/authService';
import { db } from '../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

interface MehmetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MehmetModal: React.FC<MehmetModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = async () => {
    setIsLoading(true);
    try {
      const userId = authService.getCurrentUserId();
      if (userId) {
        // Firebase'de modal gösterildi flag'ini güncelle
        const userProfileRef = doc(db, 'userProfiles', userId);
        await updateDoc(userProfileRef, {
          mehmetModalShown: true,
          mehmetModalShownAt: new Date()
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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Kapatma butonu */}
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* İçerik */}
            <div className="text-center">
              {/* İkon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>

              {/* Başlık */}
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Puan Sorunu Çözüldü! 🎉
              </h2>

              {/* Mesaj */}
              <div className="text-gray-600 mb-6 space-y-3">
                <p>
                  Merhaba <span className="font-semibold text-blue-600">Mehmet</span>!
                </p>
                <p className="text-sm text-gray-500">
                  Artık leaderboard'da doğru puanını görebilirsin.
                </p>
              </div>

              {/* Buton */}
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {isLoading ? 'Kapatılıyor...' : 'Anladım, Teşekkürler!'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MehmetModal; 