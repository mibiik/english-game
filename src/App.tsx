import React, { useState, useEffect } from 'react';
import { BrowserRouter, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { AppRoutes } from './Routes';
import { Auth } from './components/Auth';
import Leaderboard from './components/Leaderboard';
import { Analytics } from '@vercel/analytics/react';
import { authService } from './services/authService';
import ProfilePage from './pages/ProfilePage';
import { newDetailedWords_part1 } from './data/words';
import { detailedWords_part1 as upperIntermediateWordsRaw, WordDetail } from './data/word4';
import { newDetailedWords_part1 as preIntermediateWordsRaw } from './data/word2';
import { newDetailedWords_part1 as foundationWordsRaw } from './data/word1';
import { auth } from './config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { X, Sparkles } from 'lucide-react';
import { userService } from './services/userService';

const intermediateWords: WordDetail[] = newDetailedWords_part1;
const upperIntermediateWords: WordDetail[] = upperIntermediateWordsRaw;
const preIntermediateWords: WordDetail[] = preIntermediateWordsRaw;
const foundationWords: WordDetail[] = foundationWordsRaw;

function AppContent() {
  const [showAuth, setShowAuth] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Kullanıcı ismini localStorage'dan al
  const [userName, setUserName] = useState<string | null>(() => {
    return localStorage.getItem('userName');
  });

  // Auth modal'ının giriş mi kayıt mı olduğunu belirle
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');

  // Firebase Authentication durumu
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const [currentLevel, setCurrentLevel] = useState<'intermediate' | 'upper-intermediate' | 'pre-intermediate' | 'foundation'>(() => {
    const urlLevel = searchParams.get('level') as 'intermediate' | 'upper-intermediate' | 'pre-intermediate' | 'foundation';
    if (urlLevel) {
      localStorage.setItem('currentLevel', urlLevel);
      return urlLevel;
    }
    const savedLevel = localStorage.getItem('currentLevel') as 'intermediate' | 'upper-intermediate' | 'pre-intermediate' | 'foundation';
    return savedLevel || 'foundation';
  });

  const [currentUnit, setCurrentUnit] = useState(() => {
    const urlUnit = searchParams.get('unit');
    if (urlUnit) {
      localStorage.setItem('currentUnit', urlUnit);
      return urlUnit;
    }
    const savedUnit = localStorage.getItem('currentUnit');
    return savedUnit || "1";
  });

  const [filteredWords, setFilteredWords] = useState<WordDetail[]>([]);

  // Firebase Authentication durumunu dinle
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
      setIsAuthenticated(!!user);
      
      if (user) {
        // Kullanıcı giriş yapmış
        console.log('User is authenticated:', user.email);
        
        // Oturum bilgilerini localStorage'a kaydet
        localStorage.setItem('lastAuthCheck', new Date().toISOString());
        
        // Eğer karşılama sayfasındaysa ana sayfaya yönlendir
        if (location.pathname === '/') {
          navigate('/home', { replace: true });
        }
      } else {
        // Kullanıcı çıkış yapmış
        console.log('User is not authenticated');
        
        // localStorage'dan oturum bilgilerini temizle
        localStorage.removeItem('lastAuthCheck');
        
        // Eğer korumalı bir sayfadaysa karşılama sayfasına yönlendir
        if (location.pathname !== '/') {
          navigate('/', { replace: true });
        }
      }
    });

    return () => unsubscribe();
  }, [navigate, location.pathname]);

  // Sayfa yüklendiğinde oturum durumunu kontrol et
  useEffect(() => {
    const lastAuthCheck = localStorage.getItem('lastAuthCheck');
    if (lastAuthCheck) {
      const lastCheck = new Date(lastAuthCheck);
      const now = new Date();
      const diffInHours = (now.getTime() - lastCheck.getTime()) / (1000 * 60 * 60);
      
      // Son 24 saat içinde auth check yapılmışsa, kullanıcı muhtemelen hala oturum açık
      if (diffInHours < 24) {
        console.log('Recent auth check found, user likely still authenticated');
      }
    }
  }, []);





  // URL parametrelerini güncelle
  const updateURLParams = (unit: string, level: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('unit', unit);
    newParams.set('level', level);
    setSearchParams(newParams, { replace: true });
  };

  // Unit değiştiğinde URL'yi ve localStorage'ı güncelle
  const handleSetCurrentUnit = (unit: string) => {
    console.log('App: Setting current unit to:', unit);
    setCurrentUnit(unit);
    localStorage.setItem('currentUnit', unit);
    updateURLParams(unit, currentLevel);
  };

  // Level değiştiğinde URL'yi ve localStorage'ı güncelle
  const handleSetCurrentLevel = (level: 'intermediate' | 'upper-intermediate' | 'pre-intermediate' | 'foundation') => {
    console.log('App: Setting current level to:', level);
    setCurrentLevel(level);
    localStorage.setItem('currentLevel', level);
    updateURLParams(currentUnit, level);
  };

  // URL parametreleri değiştiğinde state'i ve localStorage'ı güncelle
  useEffect(() => {
    const urlUnit = searchParams.get('unit');
    const urlLevel = searchParams.get('level') as 'intermediate' | 'upper-intermediate' | 'pre-intermediate' | 'foundation';
    
    // Sadece parametre varsa güncelle
    if (urlUnit && urlUnit !== currentUnit) {
      setCurrentUnit(urlUnit);
      localStorage.setItem('currentUnit', urlUnit);
    }
    if (urlLevel && urlLevel !== currentLevel) {
      setCurrentLevel(urlLevel);
      localStorage.setItem('currentLevel', urlLevel);
    }
    // Parametre yoksa hiçbir şey yapma
  }, [searchParams, currentUnit, currentLevel]);

  // Filtrelenmiş kelimeleri güncelle
  useEffect(() => {
    let sourceData: WordDetail[];
    
    if (currentLevel === 'upper-intermediate') {
      sourceData = upperIntermediateWords;
    } else if (currentLevel === 'pre-intermediate') {
      sourceData = preIntermediateWords;
    } else if (currentLevel === 'foundation') {
      sourceData = foundationWords;
    } else {
      sourceData = intermediateWords;
    }

    if (currentUnit === 'all') {
      setFilteredWords(sourceData);
    } else {
      const unitFilter = (word: WordDetail) => word.unit === currentUnit;
      setFilteredWords(sourceData.filter(unitFilter));
    }
  }, [currentLevel, currentUnit]);

  useEffect(() => {
    const handleShowAuth = (event: any) => {
      setAuthMode(event.detail?.mode || 'register');
      setShowAuth(true);
    };

    window.addEventListener('show-auth', handleShowAuth);

    return () => {
      window.removeEventListener('show-auth', handleShowAuth);
    };
  }, []);

  // Auth modal kapandığında event dinle
  useEffect(() => {
    const handleAuthClosed = () => {
      console.log('Auth modal closed');
    };

    window.addEventListener('auth-closed', handleAuthClosed);
    return () => window.removeEventListener('auth-closed', handleAuthClosed);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#111] to-black">
      <AppRoutes 
        currentUnit={currentUnit}
        setCurrentUnit={handleSetCurrentUnit}
        currentLevel={currentLevel}
        setCurrentLevel={handleSetCurrentLevel}
        filteredWords={filteredWords}
        isAuthenticated={isAuthenticated}
      />
      {showAuth && <Auth onClose={() => {
        setShowAuth(false);
        // Auth modal kapandığında event gönder
        window.dispatchEvent(new CustomEvent('auth-closed'));
      }} userName={userName || undefined} isLogin={authMode === 'login'} />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
      <Analytics />
    </BrowserRouter>
  );
}

export default App;