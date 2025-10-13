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
  Star,
  RefreshCw,
  Crown
} from 'lucide-react';
import { UnitSelector } from './UnitSelector';
import { supabaseAuthService } from '../services/supabaseAuthService';
import { useIsMobile } from '../hooks/useDeviceDetection';
import { soundService } from '../services/soundService';
import { supabaseGameScoreService } from '../services/supabaseGameScoreService';
import { supabaseScoreService } from '../services/supabaseScoreService';

interface NavbarProps {
  onShowAuth: () => void;
  currentUnit: string;
  setCurrentUnit: (unit: string) => void;
  currentLevel: 'intermediate' | 'upper-intermediate' | 'pre-intermediate' | 'foundation' | 'kuepe';
  setCurrentLevel: (level: 'intermediate' | 'upper-intermediate' | 'pre-intermediate' | 'foundation' | 'kuepe') => void;
}

// Mobile Menu Component
const MobileMenu: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  currentLevel: string;
  setCurrentLevel: (level: 'intermediate' | 'upper-intermediate' | 'pre-intermediate' | 'foundation' | 'kuepe') => void;
  currentUnit: string;
  setCurrentUnit: (unit: string) => void;
  userScore: number | null;
  userRank: number | null;
  isAdmin: boolean;
  onShowAuth: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
}> = ({ isOpen, onClose, currentLevel, setCurrentLevel, currentUnit, setCurrentUnit, userScore, userRank, isAdmin, onShowAuth, soundEnabled, toggleSound }) => {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState<'level' | 'unit' | null>(null);

  // KUEPE yetkisi kontrolü
  const isKuepeAuthorized = () => {
    if (!supabaseAuthService.isAuthenticated()) return false;
    
    const currentUser = supabaseAuthService.getStoredUser();
    if (!currentUser || !currentUser.email) return false;
    
    const email = currentUser.email.toLowerCase();
    
    // Sadece defne ve mbirlik24@ku.edu.tr kullanıcılarına göster
    return email === 'oz.defne2004@gmail.com' || email === 'mbirlik24@ku.edu.tr';
  };

  const levels = [
    { id: 'foundation', name: 'Foundation' },
    { id: 'pre-intermediate', name: 'Pre-Intermediate' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'upper-intermediate', name: 'Upper-Intermediate' },
    ...(isKuepeAuthorized() ? [{ id: 'kuepe', name: 'KUEPE' }] : []),
  ];

  const units = Array.from({ length: 8 }, (_, i) => `Ünite ${i + 1}`);

  const handleLevelSelect = (levelName: string) => {
    const selectedLevel = levels.find(l => l.name === levelName);
    if (selectedLevel) {
      setCurrentLevel(selectedLevel.id as any);
      
      // KUEPE seçildiğinde direkt KUEPE moduna yönlendir
      if (selectedLevel.id === 'kuepe' && isKuepeAuthorized()) {
        navigate('/kuepe-mode?unit=1&level=kuepe');
        onClose();
        return;
      }
    }
    setOpenDropdown(null); // Dropdown'ı kapat
  };

  const handleUnitSelect = (unit: string) => {
    const unitNumber = unit.replace('Ünite ', '');
    setCurrentUnit(unitNumber);
    setOpenDropdown(null); // Dropdown'ı kapat
  };

  const handleProfileClick = () => {
    if (supabaseAuthService.isAuthenticated()) {
      navigate('/profile');
    } else {
      onShowAuth();
    }
    onClose();
  };

  const handleLogout = async () => {
    try {
      await supabaseAuthService.logout();
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
                    <div className="flex-1">
                      <div className="text-sm text-gray-400">Toplam Puan</div>
                      <div className="text-2xl font-bold text-yellow-400">{userScore}</div>
                    </div>
                    {userRank && (
                      <div className="flex items-center gap-2 bg-yellow-500/20 rounded-lg px-3 py-2 border border-yellow-500/30">
                        <Crown className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-bold text-yellow-400">#{userRank}</span>
                      </div>
                    )}
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

                {currentLevel !== 'kuepe' && (
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
                )}
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
                     className="w-full flex items-center gap-3 p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-colors"
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
                  <span>{supabaseAuthService.isAuthenticated() ? 'Profil' : 'Giriş Yap'}</span>
                </button>

                {/* Sound Toggle - Mobile Only */}
                <button
                  onClick={toggleSound}
                  className="w-full flex items-center gap-3 p-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors mb-2"
                >
                  {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  <span>{soundEnabled ? 'Sesi Kapat' : 'Sesi Aç'}</span>
                </button>

                {supabaseAuthService.isAuthenticated() && (
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
  const [userRank, setUserRank] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Cihaz tespit hook'u
  const { isMobile } = useIsMobile();
  
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
    const fetchUserData = async () => {
      if (supabaseAuthService.isAuthenticated()) {
        const userId = supabaseAuthService.getCurrentUserId();
        if (userId) {
          try {
            // Kullanıcı profilini getir
            const { data: userProfile, error } = await supabaseScoreService.getUserProfile(userId);
            if (userProfile) {
              setUserScore(userProfile.totalScore);
              localStorage.setItem('userScore', String(userProfile.totalScore));
              
              // Admin check
              const adminUserIds = ['VtSQP9JxPSVmRrHUyeMX9aYBMDq1', 'D1QC2'];
              const adminEmails = ['mbirlik24@ku.edu.tr'];
              const userEmail = userProfile.email || '';
              setIsAdmin(adminUserIds.includes(userId) || adminEmails.includes(userEmail));
            }

            // Kullanıcı sıralamasını al
            const rank = await supabaseScoreService.getUserRanking(userId);
            setUserRank(rank);
            
            // Sezon skorunu al
            console.log('🔍 Navbar: Sezon skoru alınıyor...', userId);
            const seasonScore = await supabaseScoreService.getUserSeasonScore(userId);
            console.log('📊 Navbar: Sezon skoru alındı:', seasonScore);
            if (seasonScore !== null) {
              setUserScore(seasonScore);
              localStorage.setItem('userScore', String(seasonScore));
              console.log('✅ Navbar: Skor güncellendi:', seasonScore);
            }

            // Real-time skor dinleyicisi başlat
            const unsubscribe = await supabaseScoreService.startScoreListener(userId, (newScore) => {
              console.log('🔄 Navbar skor güncellendi:', newScore);
              setUserScore(newScore);
              localStorage.setItem('userScore', String(newScore));
            });

            // Cleanup function'ı return et
            return unsubscribe;
          } catch (error) {
            console.error('Kullanıcı verisi alınırken hata:', error);
          }
        }
      } else {
        setUserScore(null);
        setUserRank(null);
        setIsAdmin(false);
        localStorage.removeItem('userScore');
      }
    };

    let cleanup: (() => void) | undefined;
    
    fetchUserData().then(unsubscribe => {
      if (unsubscribe) {
        cleanup = unsubscribe;
      }
    });

    // Custom event listener for score updates
    const handleScoreUpdate = async (event: CustomEvent) => {
      console.log('🎯 Custom event: scoreUpdated', event.detail);
      const { userId: eventUserId } = event.detail;
      const currentUserId = supabaseAuthService.getCurrentUserId();
      
      console.log('🔍 Custom event: User ID kontrolü', { eventUserId, currentUserId });
      
      if (eventUserId === currentUserId) {
        console.log('✅ Custom event: Aynı kullanıcı, skor güncelleniyor...');
        // Güncel sezon skorunu al
        const seasonScore = await supabaseScoreService.getUserSeasonScore(currentUserId);
        console.log('📊 Custom event: Yeni skor alındı:', seasonScore);
        if (seasonScore !== null) {
          console.log('🔄 Custom event ile skor güncellendi:', seasonScore);
          setUserScore(seasonScore);
          localStorage.setItem('userScore', String(seasonScore));
        }
      } else {
        console.log('❌ Custom event: Farklı kullanıcı, skor güncellenmiyor');
      }
    };

    window.addEventListener('scoreUpdated', handleScoreUpdate as EventListener);

    // Cleanup function
    return () => {
      if (cleanup) {
        cleanup();
      }
      window.removeEventListener('scoreUpdated', handleScoreUpdate as EventListener);
    };
  }, []);

  const handleProfileClick = () => {
    if (supabaseAuthService.isAuthenticated()) {
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
    
    // Mevcut sayfa yolunu kontrol et
    const currentPath = location.pathname;
    
    // Oyun sayfaları listesi
    const gamePaths = [
      '/multiple-choice',
      '/matching-game',
      '/flashcard',
      '/word-race',
      '/sentence-completion',
      '/definition-to-word',
      '/learning-mode',
      '/memory-game',
      '/speaking',
      '/word-forms',
      '/paraphrase',
      '/preposition-mastery',
      '/grammar-game',
      '/essay-writing',
      '/kuepe-mode'
    ];
    
    // Eğer oyun modları sayfasındaysa ana sayfaya git
    if (currentPath === '/game-modes') {
      navigate('/');
    }
    // Eğer herhangi bir oyun sayfasındaysa oyun modlarına git
    else if (gamePaths.some(path => currentPath.startsWith(path))) {
      navigate('/game-modes');
    }
    // Diğer durumlarda ana sayfaya git
    else {
      navigate('/');
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
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <button onClick={handleLogoClick} className="flex items-center">
                <img 
                  src="/a.png" 
                  alt="ELC Wordplay Logo" 
                  className="h-12 md:h-16 w-auto mr-2 md:mr-3 select-none" 
                  draggable="false" 
                />
              </button>
            </div>

            {/* Desktop Center - Unit Selector */}
            <div className="hidden md:flex items-center justify-center flex-1 px-4">
              <UnitSelector 
                currentUnit={currentUnit}
                setCurrentUnit={setCurrentUnit}
                currentLevel={currentLevel}
                setCurrentLevel={setCurrentLevel}
              />
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-2 md:space-x-3">
              {/* Mobile Level/Unit Display - Clickable */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="md:hidden px-2 py-1 rounded-xl bg-gray-800/30 hover:bg-gray-700/50 transition-all duration-200 border border-gray-700/50 hover:border-gray-600/50"
              >
                <div className="text-sm font-semibold text-white">
                  {currentLevel === 'foundation' ? 'Fou' : 
                   currentLevel === 'pre-intermediate' ? 'Pre' : 
                   currentLevel === 'intermediate' ? 'Int' : 
                   currentLevel === 'upper-intermediate' ? 'Upp' :
                   currentLevel === 'kuepe' ? 'KUEPE' : 'Int'}-{currentUnit}
                </div>
              </button>

              {/* User Score */}
              {userScore !== null && (
                <button
                  onClick={() => navigate('/leaderboard')}
                  className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1 md:py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/30 text-yellow-400 hover:from-yellow-500/30 hover:to-orange-500/30 transition-all duration-200"
                >
                  <Trophy className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-sm md:text-base font-semibold">{userScore}</span>
                  {userRank && (
                    <div className="flex items-center gap-1 bg-yellow-500/20 rounded-xl px-1 md:px-2 py-0.5 md:py-1 border border-yellow-500/30">
                      <Crown className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="text-xs md:text-sm font-bold">#{userRank}</span>
                    </div>
                  )}
                </button>
              )}

              {/* Profile - Desktop Only */}
              <motion.button 
                onClick={handleProfileClick} 
                className="hidden md:flex p-3 rounded-xl bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-200" 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                title="Profil"
              >
                <User className="w-6 h-6" />
              </motion.button>

              {/* Sound Toggle - Desktop Only */}
              <motion.button 
                onClick={toggleSound} 
                className="hidden md:flex p-3 rounded-xl bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-200" 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                title={soundEnabled ? 'Sesi Kapat' : 'Sesi Aç'}
              >
                {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
              </motion.button>

              {/* Admin Panel - Desktop Only */}
              {isAdmin && (
                <motion.button 
                  onClick={() => navigate('/admin')} 
                  className="hidden md:flex p-3 rounded-xl bg-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/30 transition-all duration-200" 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }} 
                  title="Admin Panel"
                >
                  <Shield className="w-6 h-6" />
                </motion.button>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setIsMenuOpen(true)}
                className="md:hidden p-2 md:p-3 rounded-xl bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Menu className="w-5 h-5 md:w-6 md:h-6" />
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
        userRank={userRank}
        isAdmin={isAdmin}
        onShowAuth={onShowAuth}
        soundEnabled={soundEnabled}
        toggleSound={toggleSound}
      />

      {/* Spacer for fixed navbar */}
      <div className="h-16 md:h-20"></div>
    </>
  );
};