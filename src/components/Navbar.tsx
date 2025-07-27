import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, User, Menu, X, BookOpen, GraduationCap, SlidersHorizontal, Layers, Book, ChevronDown, Search, MessageCircle, Users, Settings, LogOut, Trophy, Volume2, VolumeX, Shield } from 'lucide-react';
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

// BottomSheet Bileşeni
type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  currentLevel: 'intermediate' | 'upper-intermediate' | 'pre-intermediate' | 'foundation';
  setCurrentLevel: (level: 'intermediate' | 'upper-intermediate' | 'pre-intermediate' | 'foundation') => void;
  currentUnit: string;
  setCurrentUnit: (unit: string) => void;
};

// Mobile Dropdown Component
const MobileDropdown: React.FC<{
  label: string;
  icon: React.ReactNode;
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ label, icon, options, selectedOption, onSelect, isOpen, onToggle }) => {
  return (
    <div className="w-full">
      <motion.button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 px-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-300 hover:bg-gray-800 transition-colors"
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-semibold text-left">{label}: {selectedOption}</span>
        </div>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2 p-2 bg-gray-900/80 rounded-xl shadow-xl border border-gray-700 backdrop-blur-sm">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    onSelect(option);
                    onToggle();
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors mb-1 last:mb-0
                    ${selectedOption === option
                      ? 'bg-cyan-500 text-white'
                      : 'hover:bg-gray-800 text-gray-300'
                    }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const BottomSheet: React.FC<BottomSheetProps> = ({
  open, onClose, currentLevel, setCurrentLevel, currentUnit, setCurrentUnit
}) => {
  const [openDropdown, setOpenDropdown] = useState<'level' | 'unit' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const units = Array.from({ length: 8 }, (_, i) => `Ünite ${i + 1}`);
  const levels: { id: 'intermediate' | 'upper-intermediate' | 'pre-intermediate' | 'foundation'; name: string }[] = [
    { id: 'foundation', name: 'Foundation' },
    { id: 'pre-intermediate', name: 'Pre-Intermediate' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'upper-intermediate', name: 'Upper-Intermediate' },
  ];

  useEffect(() => {
    if (open) {
      setOpenDropdown(null);
      setError(null);
    }
  }, [open]);

  const handleLevelSelect = (levelName: string) => {
    const selectedLevel = levels.find(l => l.name === levelName);
    if (selectedLevel) {
      setCurrentLevel(selectedLevel.id);
    }
  };

  const handleUnitSelect = (unit: string) => {
    const unitNumber = unit.replace('Ünite ', '');
    setCurrentUnit(unitNumber);
  };

  if (!open) return null;

  return (
    <>
      {/* Arka plan */}
      <div
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className="fixed left-1/2 -translate-x-1/2 right-0 bottom-0 z-50 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 rounded-t-3xl shadow-2xl p-6 pt-12 border-t border-gray-800 flex flex-col w-full max-w-xl animate-slideup"
        style={{ minHeight: 400, maxHeight: '85vh', overflowY: 'auto' }}
      >
        {/* Kapat */}
        <button
          className="absolute top-4 right-6 text-gray-400 hover:text-gray-200 p-2 text-2xl bg-gray-800/60 rounded-full shadow-lg"
          onClick={onClose}
          aria-label="Kapat"
        >
          ×
        </button>

        {/* Başlık */}
        <div className="text-center mb-8">
          <div className="text-2xl font-bold text-white mb-2">Kur ve Ünite Seçimi</div>
          <div className="text-sm text-gray-400">Web sürümü ile aynı deneyim</div>
        </div>

        {/* Dropdown'lar */}
        <div className="space-y-4 mb-6">
          <MobileDropdown 
            label="Kur"
            icon={<Layers className="w-5 h-5 text-fuchsia-400" />}
            options={levels.map(l => l.name)}
            selectedOption={levels.find(l => l.id === currentLevel)?.name || 'Intermediate'}
            onSelect={handleLevelSelect}
            isOpen={openDropdown === 'level'}
            onToggle={() => setOpenDropdown(openDropdown === 'level' ? null : 'level')}
          />
          
          <MobileDropdown 
            label="Ünite"
            icon={<Book className="w-5 h-5 text-cyan-400" />}
            options={units}
            selectedOption={`Ünite ${currentUnit}`}
            onSelect={handleUnitSelect}
            isOpen={openDropdown === 'unit'}
            onToggle={() => setOpenDropdown(openDropdown === 'unit' ? null : 'unit')}
          />
        </div>

        {/* Seçim Özeti */}
        <div className="bg-gray-800/60 rounded-xl p-4 mb-4 border border-gray-700">
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-2">Mevcut Seçim</div>
            <div className="flex justify-between items-center">
              <div className="text-center">
                <div className="text-xs text-gray-500">Kur</div>
                <div className="text-lg font-bold text-fuchsia-400">
                  {levels.find(l => l.id === currentLevel)?.name || 'Intermediate'}
                </div>
              </div>
              <div className="w-px h-8 bg-gray-600"></div>
              <div className="text-center">
                <div className="text-xs text-gray-500">Ünite</div>
                <div className="text-lg font-bold text-cyan-400">
                  {currentUnit}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kapat Butonu */}
        <button
          onClick={onClose}
          className="w-full py-4 bg-gradient-to-r from-cyan-600 to-fuchsia-600 text-white rounded-xl font-semibold hover:from-cyan-700 hover:to-fuchsia-700 transition-all shadow-lg"
        >
          Tamam
        </button>

        {error && (
          <div className="mt-4 text-center text-sm text-red-400 bg-red-900/30 rounded-xl px-4 py-2">
            {error}
          </div>
        )}
      </div>
    </>
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
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('soundEnabled');
    return saved ? JSON.parse(saved) : true;
  });
  const lastScrollY = useRef(0);
  const navigate = useNavigate();
  const location = useLocation();
  const [userScore, setUserScore] = useState<number | null>(() => {
    const stored = localStorage.getItem('userScore');
    return stored ? Number(stored) : null;
  });
  const [isAdmin, setIsAdmin] = useState(false);

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
          localStorage.setItem('userScore', String(score)); // localStorage'a yaz
          
          // Admin kontrolü - belirli kullanıcı ID'leri ve email'leri admin olabilir
          const adminUserIds = ['VtSQP9JxPSVmRrHUyeMX9aYBMDq1', 'D1QC2']; // Görkem ve diğer admin ID'leri
          const adminEmails = ['mbirlik24@ku.edu.tr']; // Admin email'leri
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

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 40) {
        setIsHidden(true); // aşağı kaydırınca gizle
      } else {
        setIsHidden(false); // yukarı kaydırınca göster
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuAction = (action: () => void) => {
    action();
    setIsMenuOpen(false);
  };

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
    setIsBottomSheetOpen(false);
    
    // Eğer zaten ana sayfadaysa, oyun modlarına scroll yap
    if (location.pathname === '/home') {
      const gameModesSection = document.getElementById('game-modes-section');
      if (gameModesSection) {
        gameModesSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-transparent transition-all duration-300 ${isHidden ? '-translate-y-full' : 'translate-y-0'}`}
        style={{ height: location.pathname === '/' && showAnnouncement ? '168px' : '128px' }}>
        {/* Ana Navbar */}
        <div className="h-32 flex items-center bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex items-center justify-between">
              <div className="flex-shrink-0 flex items-center relative">
                <Link to="/home" onClick={handleLogoClick} className="flex items-center">
                  <img src="/a.png" alt="ELC Wordplay Logo" className="h-16 md:h-24 w-auto mr-2 select-none" draggable="false" />
                </Link>
                {/* Mobilde seçim butonu */}
                <button
                  className="ml-2 md:ml-4 md:hidden px-4 py-2.5 rounded-lg bg-gray-800 text-sm font-bold text-gray-100 border border-gray-700 shadow hover:bg-gray-700 transition-colors"
                  onClick={() => setIsBottomSheetOpen(true)}
                  aria-label="Kurs ve Ünite Seçimi"
                >
                  {currentLevel === 'foundation' ? 'Fou' : currentLevel === 'pre-intermediate' ? 'Pre' : currentLevel === 'intermediate' ? 'Int' : 'Upp'} | {currentUnit}
                </button>
              </div>
              {/* Desktop: Center Filters & Right Icons */}
              <div className="hidden md:flex flex-grow items-center justify-center">
                <UnitSelector 
                  currentUnit={currentUnit}
                  setCurrentUnit={setCurrentUnit}
                  currentLevel={currentLevel}
                  setCurrentLevel={setCurrentLevel}
                />
              </div>
              <div className="hidden md:flex items-center space-x-5">
                {userScore !== null && (
                  <button
                    onClick={() => navigate('/leaderboard')}
                    className="flex items-center gap-1 text-yellow-400 hover:bg-yellow-500/10 rounded px-1 py-0.5 transition-colors"
                    style={{ fontWeight: 500, fontSize: '15px', lineHeight: '1.1' }}
                    title="Toplam Puan (Liderlik Tablosu için tıkla)"
                  >
                    <Trophy className="w-4 h-4" />
                    <span className="text-yellow-300">{userScore}</span>
                  </button>
                )}
                <motion.button
                  onClick={toggleSound}
                  className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title={soundEnabled ? 'Sesi Kapat' : 'Sesi Aç'}
                  aria-label={soundEnabled ? 'Sesi Kapat' : 'Sesi Aç'}
                >
                  {soundEnabled ? <Volume2 className="w-7 h-7" /> : <VolumeX className="w-7 h-7" />}
                </motion.button>
                {isAdmin && (
                  <motion.button 
                    onClick={() => navigate('/admin')} 
                    className="p-2 rounded-full text-red-400 hover:text-red-300 hover:bg-red-500/10" 
                    whileHover={{ scale: 1.1 }} 
                    whileTap={{ scale: 0.95 }} 
                    title="Admin Panel"
                  >
                    <Shield className="w-7 h-7" />
                  </motion.button>
                )}
                <motion.button onClick={handleProfileClick} className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} title="Profil">
                  <User className="w-7 h-7" />
                </motion.button>
              </div>
              {/* Mobile: Profile Button Only */}
              <div className="md:hidden flex items-center space-x-1">
                {userScore !== null && (
                  <button
                    onClick={() => navigate('/leaderboard')}
                    className="flex items-center gap-0.5 text-yellow-400 hover:bg-yellow-500/10 rounded px-0.5 py-0.5 transition-colors"
                    style={{ fontWeight: 500, fontSize: '11px', lineHeight: '1' }}
                    title="Toplam Puan (Liderlik Tablosu için tıkla)"
                  >
                    <Trophy className="w-3 h-3" />
                    <span className="text-yellow-300">{userScore}</span>
                  </button>
                )}
                <motion.button
                  onClick={toggleSound}
                  className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title={soundEnabled ? 'Sesi Kapat' : 'Sesi Aç'}
                  aria-label={soundEnabled ? 'Sesi Kapat' : 'Sesi Aç'}
                >
                  {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </motion.button>
                {isAdmin && (
                  <motion.button 
                    onClick={() => navigate('/admin')} 
                    className="p-1.5 rounded-full text-red-400 hover:text-red-300 hover:bg-red-500/10" 
                    whileHover={{ scale: 1.1 }} 
                    whileTap={{ scale: 0.95 }} 
                    title="Admin Panel"
                  >
                    <Shield className="w-5 h-5" />
                  </motion.button>
                )}
                <motion.button 
                  onClick={handleProfileClick} 
                  className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10" 
                  whileHover={{ scale: 1.1 }} 
                  whileTap={{ scale: 0.95 }} 
                  title="Profil"
                >
                  <User className="w-5 h-5" />
                </motion.button>
              </div>
            </div> {/* .flex items-center justify-between */}
          </div> {/* .max-w-7xl mx-auto ... */}
        </div> {/* .h-32 flex items-center */}
        {showAnnouncement && location.pathname === '/' && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-br from-[#070a1a] via-[#0a0d1a] to-[#01020a] text-white h-10 shadow-xl border-t border-orange-400/30">
            {/* Subtle glow efekti */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
              <div className="flex items-center justify-center h-full relative">
                <div className="flex items-center gap-3">
                  <span className="text-lg">☀️</span>
                  <span className="font-semibold text-sm sm:text-base tracking-wide text-white drop-shadow-sm">
                    Tüm Yaz Kelime Listeleri güncellendi. Keşfet!
                  </span>
                  <span className="text-sm"></span>
                </div>
                <button
                  onClick={() => setShowAnnouncement(false)}
                  className="absolute right-0 p-1.5 rounded-full hover:bg-orange-700/40 transition-all duration-200 hover:scale-105 group"
                  aria-label="Duyuruyu kapat"
                >
                  <X className="w-4 h-4 text-white/90 group-hover:text-white transition-colors" />
                </button>
              </div>
            </div>
            {/* Minimal alt çizgi */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-300/50 to-transparent"></div>
          </div>
        )}
      </nav>

    <BottomSheet
      open={isBottomSheetOpen}
      onClose={() => setIsBottomSheetOpen(false)}
      currentLevel={currentLevel}
      setCurrentLevel={setCurrentLevel}
      currentUnit={currentUnit}
      setCurrentUnit={setCurrentUnit}
    />
  </>
);
};

const LevelDisplay: React.FC<{ level: 'intermediate' | 'upper-intermediate' | 'pre-intermediate' }> = ({ level }) => {
  const levelMap = {
    'pre-intermediate': { text: 'Pre-Int', color: 'bg-green-500' },
    'intermediate': { text: 'Int', color: 'bg-cyan-500' },
    'upper-intermediate': { text: 'Up-Int', color: 'bg-purple-500' },
  };
  const { text, color } = levelMap[level];

  return (
    <div className={`text-xs font-semibold text-white px-2 py-1 rounded-full ${color}`}>
      {text}
    </div>
  );
};

const MobileNav: React.FC<{
  isOpen: boolean,
  user: any,
  onShowAuth: () => void,
  onLogout: () => Promise<void>,
  currentUnit: string,
  setCurrentUnit: (unit: string) => void,
  currentLevel: 'intermediate' | 'upper-intermediate' | 'pre-intermediate',
  setCurrentLevel: (level: 'intermediate' | 'upper-intermediate' | 'pre-intermediate') => void
}> = ({ isOpen, user, onShowAuth, onLogout, currentUnit, setCurrentUnit, currentLevel, setCurrentLevel }) => {
  if (!isOpen) return null;

  return (
    <div className="mt-6">
      <label htmlFor="level-select-mobile" className="block text-sm font-medium text-gray-400 mb-2">Level</label>
      <select
        id="level-select-mobile"
        value={currentLevel}
        onChange={(e) => setCurrentLevel(e.target.value as 'intermediate' | 'upper-intermediate' | 'pre-intermediate')}
        className="w-full bg-gray-700 text-white rounded-md px-3 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
      >
        <option value="pre-intermediate">Pre-Intermediate</option>
        <option value="intermediate">Intermediate</option>
        <option value="upper-intermediate">Upper-Intermediate</option>
      </select>
    </div>
  );
};