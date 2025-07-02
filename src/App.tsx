import React, { useState, useEffect } from 'react';
import { BrowserRouter, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { AppRoutes } from './Routes';
import { Auth } from './components/Auth';
import { Leaderboard } from './components/Leaderboard';
import { Analytics } from '@vercel/analytics/react';
import { authService } from './services/authService';
import ProfilePage from './pages/ProfilePage';
import { newDetailedWords_part1 } from './data/words';
import { detailedWords_part1 as upperIntermediateWordsRaw, WordDetail } from './data/word4';
import { newDetailedWords_part1 as preIntermediateWordsRaw } from './data/word2';
import { newDetailedWords_part1 as foundationWordsRaw } from './data/word1';
import { auth } from './config/firebase';
import { X, Sparkles } from 'lucide-react';
import { WelcomePopup } from './components/WelcomePopup';
import { userService } from './services/userService';

const intermediateWords: WordDetail[] = newDetailedWords_part1;
const upperIntermediateWords: WordDetail[] = upperIntermediateWordsRaw;
const preIntermediateWords: WordDetail[] = preIntermediateWordsRaw;
const foundationWords: WordDetail[] = foundationWordsRaw;

function AppContent() {
  const [showAuth, setShowAuth] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  
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

  useEffect(() => {
    const checkModalStatus = async () => {
      // Önce localStorage kontrol et (geçiş dönemi için)
      const hasSeenPopupLocal = localStorage.getItem('hasSeenWelcomePopupV2') || localStorage.getItem('hasSeenWelcomePopup');
      
      if (hasSeenPopupLocal) {
        // Eski kullanıcı - Firebase'e de kaydet
        await userService.markModalAsSeen();
        return; // Modal gösterme
      }
      
      // Firebase kontrolü
      const hasSeenPopupFirebase = await userService.checkIfModalSeen();
      if (!hasSeenPopupFirebase) {
        const timer = setTimeout(() => {
          setShowWelcomePopup(true);
        }, 5000);
        return () => clearTimeout(timer);
      }
    };
    
    checkModalStatus();
  }, []);

  const handleWelcomeClose = async (name: string | null) => {
    await userService.markModalAsSeen();
    localStorage.setItem('cookieConsent', 'true'); // Onay burada veriliyor
    
    if (name) {
      localStorage.setItem('userName', name);
      await userService.saveUserName(name);
    }
    setShowWelcomePopup(false);
  };

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
    const handleShowAuth = () => setShowAuth(true);
    const handleShowLeaderboard = () => setShowLeaderboard(true);

    window.addEventListener('show-auth', handleShowAuth);
    window.addEventListener('show-leaderboard', handleShowLeaderboard);

    return () => {
      window.removeEventListener('show-auth', handleShowAuth);
      window.removeEventListener('show-leaderboard', handleShowLeaderboard);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AppRoutes 
        currentUnit={currentUnit}
        setCurrentUnit={handleSetCurrentUnit}
        currentLevel={currentLevel}
        setCurrentLevel={handleSetCurrentLevel}
        filteredWords={filteredWords}
      />
      {showAuth && <Auth onClose={() => setShowAuth(false)} />}
      {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} />}
      {showWelcomePopup && <WelcomePopup onClose={handleWelcomeClose} />}
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