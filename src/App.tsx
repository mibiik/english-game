import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
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

function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [currentUnit, setCurrentUnit] = useState("1");
  const [currentLevel, setCurrentLevel] = useState<'intermediate' | 'upper-intermediate'>('intermediate');
  const [filteredWords, setFilteredWords] = useState<WordDetail[]>([]);

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
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <AppRoutes 
          currentUnit={currentUnit}
          setCurrentUnit={setCurrentUnit}
          currentLevel={currentLevel}
          setCurrentLevel={setCurrentLevel}
          filteredWords={filteredWords}
        />
        {showAuth && <Auth onClose={() => setShowAuth(false)} />}
        {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} />}
      </div>
      <Analytics />
    </BrowserRouter>
  );
}

export default App;