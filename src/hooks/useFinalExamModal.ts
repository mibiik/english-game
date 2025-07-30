import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const useFinalExamModal = () => {
  const [showFinalExamModal, setShowFinalExamModal] = useState(false);

  useEffect(() => {
    const checkFinalExamModal = async () => {
      const userId = authService.getCurrentUserId();
      if (userId) {
        try {
          const { doc, getDoc } = await import('firebase/firestore');
          const { db } = await import('../config/firebase');
          
          const userProfileRef = doc(db, 'userProfiles', userId);
          const userDoc = await getDoc(userProfileRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            const shownCount = data?.finalExamModalShownCount || 0;
            const lastShown = data?.finalExamModalLastShown;
            
            // Modal 3 defadan az gösterildiyse göster
            if (shownCount < 3) {
              setShowFinalExamModal(true);
            }
          } else {
            // Kullanıcı profili yoksa ilk kez göster
            setShowFinalExamModal(true);
          }
        } catch (error) {
          console.error('Final exam modal kontrolü sırasında hata:', error);
        }
      }
    };
    
    checkFinalExamModal();
  }, []);

  return {
    showFinalExamModal,
    setShowFinalExamModal
  };
}; 