import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UnitSelector } from './UnitSelector';
import { ArrowLeft, Trophy, User, Menu, X, Moon, Sun } from 'lucide-react';

interface NavbarProps {
  onShowAuth: () => void;
  onShowLeaderboard: () => void;
  currentUnit?: string;
  setCurrentUnit?: (unit: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onShowAuth, onShowLeaderboard, currentUnit, setCurrentUnit }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Karanlık mod kontrolü
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    darkModeMediaQuery.addEventListener('change', handleChange);
    return () => darkModeMediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Scroll kontrolü
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${isScrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md' : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto py-3 px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center group transition-all duration-300 hover:scale-105">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full opacity-70 group-hover:opacity-100 blur-sm group-hover:blur transition-all duration-300"></div>
              <div className="relative">
                <img 
                  src="/assets/aaaaaaaadwü/1.png" 
                  alt="Koç Games Logo" 
                  className="h-10 w-10 mr-2 object-contain" 
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-purple-800 dark:text-purple-400 text-lg tracking-wide">KoçWordPlay</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">İngilizce Öğrenme Platformu</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {!isHomePage && currentUnit && setCurrentUnit && (
              <>
                <Link to="/" className="flex items-center justify-center p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg border-2 border-purple-400 hover:border-purple-600 transition-all group">
                  <ArrowLeft size={20} className="text-purple-600 dark:text-purple-400 group-hover:text-purple-800 dark:group-hover:text-purple-300 transition-colors" />
                </Link>
                
                <div className="w-44">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-2 border border-purple-300 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-700 transition-all">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Ünite Seçimi</span>
                    </div>
                    <UnitSelector currentUnit={currentUnit} setCurrentUnit={setCurrentUnit} />
                  </div>
                </div>
              </>
            )}
            
            <button 
              onClick={onShowLeaderboard}
              className="flex items-center px-4 py-2 text-sm rounded-lg text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-colors"
            >
              <Trophy className="w-4 h-4 mr-2" />
              <span>Liderlik Tablosu</span>
            </button>
            
            <button 
              onClick={onShowAuth}
              className="flex items-center px-4 py-2 text-sm rounded-lg text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
            >
              <User className="w-4 h-4 mr-2" />
              <span>Kayıt Ol / Giriş Yap</span>
            </button>

            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600" />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600" />
              )}
            </button>
            
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/50 hover:bg-purple-200 dark:hover:bg-purple-900 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              ) : (
                <Menu className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 px-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-purple-100 dark:border-purple-900">
            <div className="space-y-3">
              {!isHomePage && currentUnit && setCurrentUnit && (
                <div className="p-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Ünite Seçimi</span>
                  </div>
                  <UnitSelector currentUnit={currentUnit} setCurrentUnit={setCurrentUnit} />
                </div>
              )}
              
              <div className="grid grid-cols-1 gap-2">
                <Link to="/" className="flex items-center p-3 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors">
                  <span className="text-purple-700 dark:text-purple-400 font-medium">Ana Sayfa</span>
                </Link>
                
                <button 
                  onClick={onShowLeaderboard}
                  className="flex items-center p-3 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/30 transition-colors"
                >
                  <Trophy className="w-5 h-5 mr-2 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-yellow-700 dark:text-yellow-400 font-medium">Liderlik Tablosu</span>
                </button>
                
                <button 
                  onClick={onShowAuth}
                  className="flex items-center p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <User className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                  <span className="text-blue-700 dark:text-blue-400 font-medium">Kayıt Ol / Giriş Yap</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};