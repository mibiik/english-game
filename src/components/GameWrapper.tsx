import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { WordDetail } from '../data/intermediate';
import { userAnalyticsService } from '../services/userAnalyticsService';

interface GameWrapperProps {
  component: React.ComponentType<any>;
  words: WordDetail[];
}

export const GameWrapper: React.FC<GameWrapperProps> = ({ component: Component, words }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hasCheckedWords, setHasCheckedWords] = useState(false);
  const [redirectTimer, setRedirectTimer] = useState<NodeJS.Timeout | null>(null);
  const [gameSessionId, setGameSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Kelimeler yüklendikten sonra kontrol et
    if (words !== undefined) {
      setHasCheckedWords(true);
      
      // Eğer kelimeler gerçekten boşsa (yüklendikten sonra), yönlendir
      if (words.length === 0) {
        console.log("GameWrapper: No words found for this unit/level after loading, redirecting to home.");
        // 3 saniye bekle, bu sürede localStorage'dan oyun yüklenebilir
        const timer = setTimeout(() => navigate('/home'), 3000);
        setRedirectTimer(timer);
      } else {
        // Kelimeler varsa, redirect timer'ı temizle
        if (redirectTimer) {
          clearTimeout(redirectTimer);
          setRedirectTimer(null);
        }
        
        // Oyun başlangıcını kaydet
        const startGameAnalytics = async () => {
          try {
            // URL'den oyun modunu ve seviye bilgilerini al
            const pathParts = location.pathname.split('/');
            const gameMode = pathParts[pathParts.length - 1] || 'unknown';
            const level = 'intermediate'; // Bu bilgiyi props olarak alabiliriz
            const unit = words[0]?.unit || '1';
            
            const sessionId = await userAnalyticsService.logGameStart(gameMode, level, unit);
            setGameSessionId(sessionId);
          } catch (error) {
            console.error('Oyun başlangıcı kaydedilirken hata:', error);
          }
        };
        
        startGameAnalytics();
      }
    }
  }, [words, navigate, redirectTimer, location.pathname]);

  // Component unmount olduğunda timer'ı temizle
  useEffect(() => {
    return () => {
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [redirectTimer]);

  // Henüz kelimeler kontrol edilmediyse loading göster
  if (!hasCheckedWords || !words) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Kelimeler yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Kelimeler yüklendi ama boş
  if (words.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Bu ünite için kelime bulunamadı</div>
          <p className="text-gray-300 mb-4">Ana sayfaya yönlendiriliyorsunuz... (3 saniye)</p>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-400 mx-auto"></div>
        </div>
      </div>
    );
  }

  // Oyun tamamlama fonksiyonu
  const handleGameComplete = async (score: number, wordsPlayed: number, correctAnswers: number, wrongAnswers: number) => {
    if (gameSessionId) {
      try {
        await userAnalyticsService.logGameComplete(gameSessionId, score, wordsPlayed, correctAnswers, wrongAnswers);
      } catch (error) {
        console.error('Oyun tamamlama kaydedilirken hata:', error);
      }
    }
  };

  return <Component words={words} onGameComplete={handleGameComplete} />;
}; 