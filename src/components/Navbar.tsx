import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, User, Menu, X, Moon, Sun, Book, ChevronDown } from 'lucide-react';
import { authService } from '../services/authService';
import { UserProfile } from './UserProfile';

interface NavbarProps {
  onShowAuth: () => void;
  onShowLeaderboard: () => void;
  currentUnit?: string;
  setCurrentUnit?: (unit: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onShowAuth, onShowLeaderboard, currentUnit, setCurrentUnit }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUnitMenuOpen, setIsUnitMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const units = Array.from({ length: 10 }, (_, i) => (i + 1).toString());

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      setUserProfile(user);
    });

    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }

    return () => unsubscribe();
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-purple-100 dark:border-purple-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo ve Ana Menü */}
          <div className="flex items-center gap-4">
            {!isHomePage && (
              <button
                onClick={() => navigate('/')}
                className="p-2 rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </button>
            )}
            <Link to="/" className="flex items-center gap-2">
              <img src="/assets/aaaaaaaadwü/1.png" alt="Logo" className="w-8 h-8" />
              <span className="font-bold text-xl text-purple-700 dark:text-purple-400">KoçGames</span>
            </Link>
          </div>

          {/* Masaüstü Menü */}
          <div className="hidden md:flex items-center gap-6">
            {/* Ünite Seçici */}
            {currentUnit && setCurrentUnit && (
              <div className="relative">
                <button
                  onClick={() => setIsUnitMenuOpen(!isUnitMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
                >
                  <Book className="w-4 h-4" />
                  <span>Ünite {currentUnit}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isUnitMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Ünite Menüsü */}
                {isUnitMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-purple-100 dark:border-purple-800">
                    <div className="grid grid-cols-2 gap-1 p-2">
                      {units.map((unit) => (
                        <button
                          key={unit}
                          onClick={() => {
                            setCurrentUnit(unit);
                            setIsUnitMenuOpen(false);
                          }}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                            ${currentUnit === unit
                              ? 'bg-purple-500 text-white'
                              : 'hover:bg-purple-50 dark:hover:bg-purple-900/30 text-gray-700 dark:text-gray-300'
                            }`}
                        >
                          Ünite {unit}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Liderlik Tablosu */}
            <button
              onClick={onShowLeaderboard}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-colors"
            >
              <Trophy className="w-4 h-4" />
              <span>Liderlik</span>
            </button>

            {/* Tema Değiştirici */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Kullanıcı Profili / Giriş */}
            {isAuthenticated ? (
              <UserProfile user={userProfile} />
            ) : (
              <button
                onClick={onShowAuth}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Giriş Yap</span>
              </button>
            )}
          </div>

          {/* Mobil Menü Butonu */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            ) : (
              <Menu className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            )}
          </button>
        </div>

        {/* Mobil Menü */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            {currentUnit && setCurrentUnit && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Ünite Seçimi</span>
                </div>
                <div className="grid grid-cols-2 gap-2 px-2">
                  {units.map((unit) => (
                    <button
                      key={unit}
                      onClick={() => {
                        setCurrentUnit(unit);
                        setIsMenuOpen(false);
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                        ${currentUnit === unit
                          ? 'bg-purple-500 text-white'
                          : 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50'
                        }`}
                    >
                      Ünite {unit}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2 px-2">
              <button
                onClick={() => {
                  onShowLeaderboard();
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
              >
                <Trophy className="w-4 h-4" />
                <span>Liderlik Tablosu</span>
              </button>

              <button
                onClick={toggleDarkMode}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                {isDarkMode ? (
                  <>
                    <Sun className="w-4 h-4" />
                    <span>Açık Tema</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4" />
                    <span>Koyu Tema</span>
                  </>
                )}
              </button>

              {!isAuthenticated && (
                <button
                  onClick={() => {
                    onShowAuth();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white"
                >
                  <User className="w-4 h-4" />
                  <span>Giriş Yap</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};