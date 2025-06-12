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

const intermediateWords: WordDetail[] = newDetailedWords_part1;
const upperIntermediateWords: WordDetail[] = upperIntermediateWordsRaw;

function AppContent() {
  const [showAuth, setShowAuth] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  
  // URL parametrelerinden başlangıç değerlerini al
  const [currentUnit, setCurrentUnit] = useState(() => searchParams.get('unit') || "1");
  const [currentLevel, setCurrentLevel] = useState<'intermediate' | 'upper-intermediate'>(() => 
    (searchParams.get('level') as 'intermediate' | 'upper-intermediate') || 'intermediate'
  );
  const [filteredWords, setFilteredWords] = useState<WordDetail[]>([]);

  // URL parametrelerini güncelle
  const updateURLParams = (unit: string, level: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('unit', unit);
    newParams.set('level', level);
    setSearchParams(newParams, { replace: true });
  };

  // Unit değiştiğinde URL'yi güncelle
  const handleSetCurrentUnit = (unit: string) => {
    console.log('App: Setting current unit to:', unit);
    setCurrentUnit(unit);
    updateURLParams(unit, currentLevel);
  };

  // Level değiştiğinde URL'yi güncelle
  const handleSetCurrentLevel = (level: 'intermediate' | 'upper-intermediate') => {
    console.log('App: Setting current level to:', level);
    setCurrentLevel(level);
    updateURLParams(currentUnit, level);
  };

  // URL parametreleri değiştiğinde state'i güncelle
  useEffect(() => {
    const urlUnit = searchParams.get('unit');
    const urlLevel = searchParams.get('level') as 'intermediate' | 'upper-intermediate';
    
    console.log('App: URL params changed:', { urlUnit, urlLevel, currentUnit, currentLevel });
    
    if (urlUnit && urlUnit !== currentUnit) {
      console.log('App: Updating unit from URL:', urlUnit);
      setCurrentUnit(urlUnit);
    }
    if (urlLevel && urlLevel !== currentLevel) {
      console.log('App: Updating level from URL:', urlLevel);
      setCurrentLevel(urlLevel);
    }
  }, [searchParams]);

  // Filtrelenmiş kelimeleri güncelle
  useEffect(() => {
    let sourceData: WordDetail[];
    
    if (currentLevel === 'upper-intermediate') {
      sourceData = upperIntermediateWords;
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