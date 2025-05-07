import { BrowserRouter } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AppRoutes } from './Routes';
import { Auth } from './components/Auth';
import { Leaderboard } from './components/Leaderboard';
import { Analytics } from '@vercel/analytics/react';

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

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <AppRoutes />
        
        {/* Auth Modal */}
        {showAuth && (
          <Auth onClose={() => setShowAuth(false)} />
        )}
        
        {/* Leaderboard Modal */}
        {showLeaderboard && (
          <Leaderboard onClose={() => setShowLeaderboard(false)} />
        )}
      </div>
      <Analytics />
    </BrowserRouter>
  );
}

export default App;