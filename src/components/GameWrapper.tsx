import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { WordDetail } from '../data/words';

interface GameWrapperProps {
  component: React.ComponentType<any>;
  words: WordDetail[];
}

export const GameWrapper: React.FC<GameWrapperProps> = ({ component: Component, words }) => {
  const navigate = useNavigate();
  const [hasCheckedWords, setHasCheckedWords] = useState(false);
  const [redirectTimer, setRedirectTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Kelimeler yüklendikten sonra kontrol et
    if (words !== undefined) {
      setHasCheckedWords(true);
      
      // Eğer kelimeler gerçekten boşsa (yüklendikten sonra), yönlendir
      if (words.length === 0) {
        console.log("GameWrapper: No words found for this unit/level after loading, redirecting to home.");
        // 3 saniye bekle, bu sürede localStorage'dan oyun yüklenebilir
        const timer = setTimeout(() => navigate('/'), 3000);
        setRedirectTimer(timer);
      } else {
        // Kelimeler varsa, redirect timer'ı temizle
        if (redirectTimer) {
          clearTimeout(redirectTimer);
          setRedirectTimer(null);
        }
      }
    }
  }, [words, navigate, redirectTimer]);

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

  return <Component words={words} />;
}; 