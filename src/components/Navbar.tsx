import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  User, 
  Menu, 
  X, 
  BookOpen, 
  GraduationCap, 
  SlidersHorizontal, 
  Layers, 
  Book, 
  ChevronDown, 
  Search, 
  MessageCircle, 
  Users, 
  Settings, 
  LogOut, 
  Trophy, 
  Volume2, 
  VolumeX, 
  Shield,
  Bell,
  Star
} from 'lucide-react';
import { UnitSelector } from './UnitSelector';
import { authService } from '../services/authService';
import { soundService } from '../services/soundService';
import { gameScoreService } from '../services/gameScoreService';
import { db } from '../config/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface NavbarProps {
  onShowAuth: () => void;
  currentUnit: string;
  setCurrentUnit: (unit: string) => void;
  currentLevel: 'intermediate' | 'upper-intermediate' | 'pre-intermediate' | 'foundation';
  setCurrentLevel: (level: 'intermediate' | 'upper-intermediate' | 'pre-intermediate' | 'foundation') => void;
}

// Mobile Menu Component
const MobileMenu: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  currentLevel: string;
  setCurrentLevel: (level: 'intermediate' | 'upper-intermediate' | 'pre-intermediate' | 'foundation') => void;
  currentUnit: string;
  setCurrentUnit: (unit: string) => void;
  userScore: number | null;
  isAdmin: boolean;
  onShowAuth: () => void;
}> = ({ isOpen, onClose, currentLevel, setCurrentLevel, currentUnit, setCurrentUnit, userScore, isAdmin, onShowAuth }) => {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState<'level' | 'unit' | null>(null);

  const levels = [
    { id: 'foundation', name: 'Foundation' },
    { id: 'pre-intermediate', name: 'Pre-Intermediate' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'upper-intermediate', name: 'Upper-Intermediate' },
  ];

  const units = Array.from({ length: 8 }, (_, i) => `Ünite ${i + 1}`);

  const handleLevelSelect = (levelName: string) => {
    const selectedLevel = levels.find(l => l.name === levelName);
    if (selectedLevel) {
      setCurrentLevel(selectedLevel.id as any);
    }
    setOpenDropdown(null); // Dropdown'ı kapat
  };

  const handleUnitSelect = (unit: string) => {
    const unitNumber = unit.replace('Ünite ', '');
    setCurrentUnit(unitNumber);
    setOpenDropdown(null); // Dropdown'ı kapat
  };

  const handleProfileClick = () => {
    if (authService.isAuthenticated()) {
      navigate('/profile');
    } else {
      onShowAuth();
    }
    onClose();
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      onClose();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Menu Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-80 bg-gradient-to-b from-gray-900 to-black border-l border-gray-800 z-50 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">Menü</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto h-full">
              {/* User Score */}
              {userScore !== null && (
                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-4 border border-yellow-500/30">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                    <div>
                      <div className="text-sm text-gray-400">Toplam Puan</div>
                      <div className="text-2xl font-bold text-yellow-400">{userScore}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Level & Unit Selector */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Seviye</label>
                  <div className="relative">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === 'level' ? null : 'level')}
                      className="w-full flex items-center justify-between p-3 bg-gray-800 rounded-lg text-white hover:bg-gray-700 transition-colors"
                    >
                      <span>{levels.find(l => l.id === currentLevel)?.name}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'level' ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === 'level' && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 rounded-lg border border-gray-700 shadow-xl z-10">
                        {levels.map((level) => (
                          <button
                            key={level.id}
                            onClick={() => handleLevelSelect(level.name)}
                            className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors first:rounded-t-lg last:rounded-b-lg"
                          >
                            {level.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Ünite</label>
                  <div className="relative">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === 'unit' ? null : 'unit')}
                      className="w-full flex items-center justify-between p-3 bg-gray-800 rounded-lg text-white hover:bg-gray-700 transition-colors"
                    >
                      <span>Ünite {currentUnit}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'unit' ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === 'unit' && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 rounded-lg border border-gray-700 shadow-xl z-10 max-h-48 overflow-y-auto">
                        {units.map((unit) => (
                          <button
                            key={unit}
                            onClick={() => handleUnitSelect(unit)}
                            className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                          >
                            {unit}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

                             {/* Navigation Links */}
               <div className="space-y-2">
                 <button
                   onClick={() => { navigate('/home'); onClose(); }}
                   className="w-full flex items-center gap-3 p-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                 >
                   <Home className="w-5 h-5" />
                   <span>Ana Sayfa</span>
                 </button>
                 
                 <button
                   onClick={() => { navigate('/leaderboard'); onClose(); }}
                   className="w-full flex items-center gap-3 p-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                 >
                   <Trophy className="w-5 h-5" />
                   <span>Liderlik Tablosu</span>
                 </button>

                 {isAdmin && (
                   <button
                     onClick={() => { navigate('/admin'); onClose(); }}
                     className="w-full flex items-center gap-3 p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                   >
                     <Shield className="w-5 h-5" />
                     <span>Admin Panel</span>
                   </button>
                 )}
               </div>

              {/* User Actions */}
              <div className="pt-4 border-t border-gray-800">
                <button
                  onClick={handleProfileClick}
                  className="w-full flex items-center gap-3 p-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors mb-2"
                >
                  <User className="w-5 h-5" />
                  <span>{authService.isAuthenticated() ? 'Profil' : 'Giriş Yap'}</span>
                </button>

                {authService.isAuthenticated() && (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Çıkış Yap</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export const Navbar: React.FC<NavbarProps> = ({ 
  onShowAuth,
  currentUnit,
  setCurrentUnit,
  currentLevel,
  setCurrentLevel,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('soundEnabled');
    return saved ? JSON.parse(saved) : true;
  });
  const [userScore, setUserScore] = useState<number | null>(() => {
    const stored = localStorage.getItem('userScore');
    return stored ? Number(stored) : null;
  });
  const [isAdmin, setIsAdmin] = useState(false);
  
  const lastScrollY = useRef(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll hide/show logic
  useEffect(() => {
    let ticking = false;
    
    const updateNavbar = () => {
      const currentScrollY = window.scrollY;
      const scrollThreshold = 50;
      
      if (currentScrollY > lastScrollY.current && currentScrollY > scrollThreshold) {
        // Scrolling down - hide navbar
        if (!isHidden) {
          setIsHidden(true);
        }
      } else if (currentScrollY < lastScrollY.current || currentScrollY <= scrollThreshold) {
        // Scrolling up or at top - show navbar
        if (isHidden) {
          setIsHidden(false);
        }
      }
      
      lastScrollY.current = currentScrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    };

    // Add scroll listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll);
    };
  }, [isHidden]);

  // User data fetching
  useEffect(() => {
    let unsub: (() => void) | undefined;
    if (authService.isAuthenticated()) {
      const userId = authService.getCurrentUserId();
      if (userId) {
        const userProfileRef = doc(db, 'userProfiles', userId);
        unsub = onSnapshot(userProfileRef, (docSnap) => {
          const data = docSnap.data();
          const score = data?.totalScore || 0;
          setUserScore(score);
          localStorage.setItem('userScore', String(score));
          
          // Admin check
          const adminUserIds = ['VtSQP9JxPSVmRrHUyeMX9aYBMDq1', 'D1QC2'];
          const adminEmails = ['mbirlik24@ku.edu.tr'];
          const userEmail = data?.email || '';
          setIsAdmin(adminUserIds.includes(userId) || adminEmails.includes(userEmail));
        });
      }
    } else {
      setUserScore(null);
      setIsAdmin(false);
      localStorage.removeItem('userScore');
    }
    return () => { unsub && unsub(); };
  }, []);

  const handleProfileClick = () => {
    if (authService.isAuthenticated()) {
      navigate('/profile');
    } else {
      onShowAuth();
    }
  };

  const toggleSound = () => {
    soundService.toggleSound();
    setSoundEnabled(soundService.isSoundEnabled());
  };

  const handleLogoClick = () => {
    setIsMenuOpen(false);
    if (location.pathname === '/home') {
      const gameModesSection = document.getElementById('game-modes-section');
      if (gameModesSection) {
        gameModesSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    } else {
      // Oyun sayfalarındaysa ana sayfaya git ve oyun modlarına scroll yap
      navigate('/home');
      // Ana sayfa yüklendikten sonra oyun modlarına scroll yap
      setTimeout(() => {
        const gameModesSection = document.getElementById('game-modes-section');
        if (gameModesSection) {
          gameModesSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    }
  };

  return (
    <>
      {/* Main Navbar */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
          isHidden ? '-translate-y-full' : 'translate-y-0'
        }`}
        style={{
          background: 'rgb(0, 0, 0)',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/home" onClick={handleLogoClick} className="flex items-center">
                <img 
                  src="/a.png" 
                  alt="ELC Wordplay Logo" 
                  className="h-10 w-auto mr-3 select-none" 
                  draggable="false" 
                />
              </Link>
              
              {/* Mobile Level/Unit Display - Clickable */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="md:hidden ml-3 px-3 py-1.5 rounded-lg bg-gray-800/30 hover:bg-gray-700/50 transition-all duration-200 border border-gray-700/50 hover:border-gray-600/50"
              >
                <div className="text-sm font-semibold text-white">
                  {currentLevel === 'foundation' ? 'Fou' : 
                   currentLevel === 'pre-intermediate' ? 'Pre' : 
                   currentLevel === 'intermediate' ? 'Int' : 'Upp'}-{currentUnit}
                </div>
              </button>
            </div>

            {/* Desktop Center - Unit Selector */}
            <div className="hidden md:flex items-center justify-center flex-1">
              <UnitSelector 
                currentUnit={currentUnit}
                setCurrentUnit={setCurrentUnit}
                currentLevel={currentLevel}
                setCurrentLevel={setCurrentLevel}
              />
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-2">
              {/* User Score */}
              {userScore !== null && (
                <button
                  onClick={() => navigate('/leaderboard')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30 text-yellow-400 hover:from-yellow-500/30 hover:to-orange-500/30 transition-all duration-200"
                >
                  <Trophy className="w-4 h-4" />
                  <span className="text-sm font-semibold">{userScore}</span>
                </button>
              )}

              {/* Profile - Desktop Only */}
              <motion.button 
                onClick={handleProfileClick} 
                className="hidden md:flex p-2 rounded-lg bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-200" 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                title="Profil"
              >
                <User className="w-5 h-5" />
              </motion.button>

              {/* Sound Toggle */}
              <motion.button
                onClick={toggleSound}
                className="p-2 rounded-lg bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={soundEnabled ? 'Sesi Kapat' : 'Sesi Aç'}
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </motion.button>

              {/* Admin Panel */}
              {isAdmin && (
                <motion.button 
                  onClick={() => navigate('/admin')} 
                  className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/30 transition-all duration-200" 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }} 
                  title="Admin Panel"
                >
                  <Shield className="w-5 h-5" />
                </motion.button>
              )}



              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setIsMenuOpen(true)}
                className="md:hidden p-2 rounded-lg bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Menu className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        currentLevel={currentLevel}
        setCurrentLevel={setCurrentLevel}
        currentUnit={currentUnit}
        setCurrentUnit={setCurrentUnit}
        userScore={userScore}
        isAdmin={isAdmin}
        onShowAuth={onShowAuth}
      />

      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>
    </>
  );
};