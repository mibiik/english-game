import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Gift, X, ThumbsUp, ThumbsDown, Coffee, MessageCircle } from 'lucide-react';
import { authService } from '../services/authService';
import { db } from '../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

interface FinalExamSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FinalExamSupportModal: React.FC<FinalExamSupportModalProps> = ({ isOpen, onClose }) => {
  const [hasBeenHelpful, setHasBeenHelpful] = useState<boolean | null>(null);
  const [showSupportOptions, setShowSupportOptions] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState<string>('');

  // Kullanıcı adını al
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userId = authService.getCurrentUserId();
        if (userId) {
          const { doc, getDoc } = await import('firebase/firestore');
          const userProfileRef = doc(db, 'userProfiles', userId);
          const userDoc = await getDoc(userProfileRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const displayName = userData?.displayName || userData?.userName || 'öğrenci';
            setUserName(displayName);
          } else {
            setUserName('öğrenci');
          }
        }
      } catch (error) {
        console.error('Kullanıcı adı alınırken hata:', error);
        setUserName('öğrenci');
      }
    };

    if (isOpen) {
      fetchUserName();
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };

  const handleHelpfulResponse = async (helpful: boolean) => {
    setHasBeenHelpful(helpful);
    
    // Firebase'e kaydet
    try {
      const userId = authService.getCurrentUserId();
      if (userId) {
        const { doc, updateDoc, collection, addDoc, serverTimestamp } = await import('firebase/firestore');
        
        // Kullanıcı profilini güncelle
        const userProfileRef = doc(db, 'userProfiles', userId);
        await updateDoc(userProfileRef, {
          finalExamModalResponse: helpful,
          finalExamModalResponseAt: serverTimestamp(),
          lastUpdated: serverTimestamp()
        });
        
        // Ayrı bir koleksiyona detaylı kayıt ekle
        await addDoc(collection(db, 'finalExamModalResponses'), {
          userId: userId,
          userName: userName,
          response: helpful,
          timestamp: serverTimestamp(),
          userAgent: navigator.userAgent,
          screenSize: `${window.innerWidth}x${window.innerHeight}`
        });
      }
    } catch (error) {
      console.error('Final modal yanıtı kaydedilirken hata:', error);
    }
    
    if (helpful) {
      setShowSupportOptions(true);
    } else {
      // Eğer faydalı değilse feedback sistemini aç
      setShowFeedbackModal(true);
    }
  };

  const handleSupportClick = async () => {
    setIsLoading(true);
    try {
      const userId = authService.getCurrentUserId();
      if (userId) {
        const { doc, updateDoc, collection, addDoc, serverTimestamp } = await import('firebase/firestore');
        
        // Firebase'de destek olundu flag'ini güncelle
        const userProfileRef = doc(db, 'userProfiles', userId);
        await updateDoc(userProfileRef, {
          finalExamModalShown: true,
          finalExamModalShownAt: new Date(),
          wordplayHelpful: true,
          hasSupported: true,
          supportedAt: new Date()
        });
        
        // Destek işlemini ayrı koleksiyona kaydet
        await addDoc(collection(db, 'supportActions'), {
          userId: userId,
          userName: userName,
          action: 'final_modal_support',
          amount: 49.90,
          currency: 'TRY',
          timestamp: serverTimestamp(),
          userAgent: navigator.userAgent,
          screenSize: `${window.innerWidth}x${window.innerHeight}`,
          source: 'final_exam_modal'
        });
      }
    } catch (error) {
      console.error('Destek kaydı güncellenirken hata:', error);
    } finally {
      setIsLoading(false);
      // Shopier'a yönlendir
      window.open('https://www.shopier.com/37829492', '_blank');
      handleClose();
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
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Kapatma butonu - sadece ikinci aşamada görünür */}
            {hasBeenHelpful !== null && (
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* İçerik */}
            <div className="text-center">
              {/* İkon */}
              <div className="flex justify-center mb-4">
                <img 
                  src="/a.png" 
                  alt="Final Sınavı" 
                  className="w-32 h-32 object-contain"
                />
              </div>

              {/* Başlık */}
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Final Sınavında Başarılar! 🎓
              </h2>

              {/* Mesaj */}
              <div className="text-gray-600 mb-6 space-y-3">
                <p className="text-lg font-bold">
                  Sevgili <span className="text-blue-600">{userName}</span>!
                </p>
                <p className="text-sm leading-relaxed">
                  Finalde başarılar dileriz! Tüm çalışmalarının karşılığını alacağına eminiz.
                </p>
                <p className="text-sm leading-relaxed">
                  <span className="font-semibold text-purple-600">Wordplay</span> size bu süreçte faydalı oldu mu?
                </p>
              </div>

              {/* Faydalı mı sorusu */}
              {hasBeenHelpful === null && (
                <div className="space-y-4 mb-4">
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => handleHelpfulResponse(true)}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
                    >
                      Evet, çok faydalı!
                    </button>
                    <button
                      onClick={() => handleHelpfulResponse(false)}
                      className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
                    >
                      Hayır
                    </button>
                  </div>
                </div>
              )}

              {/* Destek seçenekleri */}
              {showSupportOptions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                    <div className="flex items-center justify-center mb-3">
                      <Heart className="w-6 h-6 text-red-500 mr-2" />
                      <span className="text-lg font-semibold text-gray-800">Teşekkürler!</span>
                    </div>
                    <p className="text-gray-600 mb-4 text-sm">
                      Wordplay'i beğendiğinize sevindik! Eğer isterseniz, <span className="font-bold text-green-600">güvenli</span> bir şekilde projemizi destekleyebilirsiniz.
                    </p>
                    
                    {/* Destek kartı */}
                    <div className="bg-white rounded-lg p-4 border border-green-200 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Coffee className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-gray-800">Bir Kahve ☕</span>
                        </div>
                        <span className="text-lg font-bold text-green-600">₺49,90</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-3">
                        Geliştiricilere bir kahve ısmarla, daha fazla özellik geliştirmemize yardımcı ol!
                      </p>
                      
                      <button
                        onClick={handleSupportClick}
                        disabled={isLoading}
                        className="w-full bg-green-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-600 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Yönlendiriliyor...
                          </>
                        ) : (
                          <>
                            <Gift className="w-4 h-4" />
                            Destek Ol
                          </>
                        )}
                      </button>
                    </div>
                    
                    <p className="text-xs text-gray-400 text-center">
                      💳 <span className="font-bold text-green-600">Güvenli</span> ödeme sistemi ile Shopier üzerinden
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* Feedback Modal */}
      <AnimatePresence>
        {showFeedbackModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowFeedbackModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Kapatma butonu */}
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>

              {/* İçerik */}
              <div className="text-center">
                {/* İkon */}
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-red-600" />
                  </div>
                </div>

                {/* Başlık */}
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  Görüşünüzü Alalım! 💬
                </h2>

                {/* Mesaj */}
                <div className="text-gray-600 mb-6 space-y-3">
                  <p className="text-base">
                    Sevgili <span className="font-semibold text-blue-600">{userName}</span>!
                  </p>
                  <p className="text-sm leading-relaxed">
                    Wordplay'i beğenmediğinize üzüldük. Görüş, öneri ve şikayetlerinizi dinlemek istiyoruz.
                  </p>
                  <p className="text-sm leading-relaxed">
                    Bize nasıl daha iyi hizmet verebileceğimizi söyleyin!
                  </p>
                </div>

                {/* Butonlar */}
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setShowFeedbackModal(false);
                      onClose(); // Ana modalı da kapat
                      // Kısa bir gecikme sonra feedback butonunu tetikle
                      setTimeout(() => {
                        const feedbackButton = document.querySelector('[title="Geri Bildirim Gönder"]') as HTMLButtonElement;
                        if (feedbackButton) {
                          feedbackButton.click();
                        }
                      }, 300);
                    }}
                    className="w-full bg-red-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Görüş & Öneri Gönder
                  </button>
                  
                  <button
                    onClick={() => setShowFeedbackModal(false)}
                    className="w-full bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300 transition-all duration-200"
                  >
                    Şimdilik Kapat
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};

export default FinalExamSupportModal; 