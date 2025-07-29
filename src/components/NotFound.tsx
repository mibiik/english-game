import React, { useState } from 'react';
import { notificationService } from '../services/notificationService';
import { authService } from '../services/authService';

const NotFound: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleReport = async () => {
    if (isSubmitting || submitted) return;
    
    setIsSubmitting(true);
    
    try {
      const currentUser = authService.getCurrentUser();
      
      await notificationService.send404Notification({
        userId: currentUser?.uid || 'anonymous',
        userEmail: currentUser?.email || 'anonymous@example.com',
        userName: currentUser?.displayName || 'Anonim Kullanıcı',
        message: '404 sayfasına erişim denemesi',
        pageUrl: window.location.href,
        userAgent: navigator.userAgent
      });
      
      setSubmitted(true);
    } catch (error) {
      console.error('Bildirim gönderilirken hata:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#111] to-black flex items-center justify-center">
      <div className="text-center">
        <div className="text-9xl font-bold text-red-500 mb-4">404</div>
        <h1 className="text-3xl font-semibold text-white mb-4">Sayfa Bulunamadı</h1>
        <p className="text-gray-400 mb-8 text-lg">
          Aradığınız sayfa geçici olarak kullanılamıyor veya mevcut değil.
        </p>
        
        {!submitted ? (
          <button 
            onClick={handleReport}
            disabled={isSubmitting}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Gönderiliyor...' : 'Bu Sorunu Bildir'}
          </button>
        ) : (
          <div className="text-green-400 text-lg">
            ✓ Bildiriminiz alındı. Teşekkürler!
          </div>
        )}
      </div>
    </div>
  );
};

export default NotFound; 