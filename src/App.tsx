import { BrowserRouter } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AppRoutes } from './Routes';
import { Auth } from './components/Auth';
import { Leaderboard } from './components/Leaderboard';
import { Analytics } from '@vercel/analytics/react';
import { authService } from './services/authService';
import { ProfilePage } from './pages/ProfilePage';
import { Routes, Route } from 'react-router-dom';
import { MatchingGame } from './components/GameModes/MatchingGame';
import { WordRace } from './components/GameModes/WordRace';
import { FlashCard } from './components/GameModes/FlashCard';
import { MultipleChoice } from './components/GameModes/MultipleChoice';
import { SentenceCompletion } from './components/GameModes/SentenceCompletion';
import { ParaphraseChallenge } from './components/GameModes/ParaphraseChallenge';

function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Sistem tercihine göre karanlık mod ayarı
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    darkModeMediaQuery.addEventListener('change', handleChange);
    return () => darkModeMediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Karanlık mod değişikliğini HTML'e uygula
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Auth ve Leaderboard event listener'ları
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Routes>
          <Route path="*" element={<AppRoutes />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
        
        {/* Auth Modal */}
        {showAuth && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Auth onClose={() => setShowAuth(false)} />
          </div>
        )}
        
        {/* Leaderboard Modal */}
        {showLeaderboard && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Leaderboard onClose={() => setShowLeaderboard(false)} />
          </div>
        )}
      </div>
      <Analytics />
    </BrowserRouter>
  );
}

export default App;