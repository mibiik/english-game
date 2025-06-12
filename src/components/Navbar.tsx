import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, User, Menu, X, BookOpen, GraduationCap, SlidersHorizontal, Layers, Book } from 'lucide-react';
import logo from './a.png';
import { UnitSelector } from './UnitSelector';
import { authService } from '../services/authService';

interface NavbarProps {
  onShowAuth: () => void;
  currentUnit: string;
  setCurrentUnit: (unit: string) => void;
  currentLevel: 'intermediate' | 'upper-intermediate';
  setCurrentLevel: (level: 'intermediate' | 'upper-intermediate') => void;
}

// BottomSheet Bileşeni
type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  currentLevel: 'intermediate' | 'upper-intermediate';
  setCurrentLevel: (level: 'intermediate' | 'upper-intermediate') => void;
  currentUnit: string;
  setCurrentUnit: (unit: string) => void;
};

const BottomSheet: React.FC<BottomSheetProps> = ({
  open, onClose, currentLevel, setCurrentLevel, currentUnit, setCurrentUnit
}) => {
  const [step, setStep] = useState<'level' | 'unit'>('level');
  const [pendingLevel, setPendingLevel] = useState<string | null>(null);
  const [pendingUnit, setPendingUnit] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setStep('level');
      setPendingLevel(null);
      setPendingUnit(null);
      setError(null);
    }
  }, [open]);

  useEffect(() => {
    if (step === 'unit' && pendingUnit && pendingLevel) {
      setCurrentLevel(pendingLevel as any);
      setCurrentUnit(pendingUnit);
      setTimeout(() => {
        onClose();
      }, 200);
    }
  }, [step, pendingUnit, pendingLevel, setCurrentLevel, setCurrentUnit, onClose]);

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
        className="fixed left-1/2 -translate-x-1/2 right-0 bottom-0 z-50 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 rounded-t-3xl shadow-2xl p-8 pt-14 border-t border-gray-800 flex flex-col items-center w-full max-w-xl animate-slideup"
        style={{ minHeight: 420, maxHeight: '92vh', overflowY: 'auto' }}
      >
        {/* Kapat */}
        <button
          className="absolute top-5 right-7 text-gray-400 hover:text-gray-200 p-2 text-3xl bg-gray-800/60 rounded-full shadow-lg"
          onClick={onClose}
          aria-label="Kapat"
        >
          ×
        </button>
        {/* Step 1: Kur seçimi */}
        {step === 'level' && (
          <div className="w-full flex flex-col items-center">
            <div className="flex flex-col items-center mb-6">
              <span className="inline-block p-4 rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-500 mb-3 shadow-lg">
                <Layers className="w-10 h-10 text-white" />
              </span>
              <div className="text-3xl font-extrabold text-white tracking-wide mb-2">Kur Seç</div>
              <div className="text-base text-gray-400 mb-2">Hangi seviyede çalışmak istiyorsun?</div>
            </div>
            <div className="flex gap-6 mb-2 w-full justify-center">
              <button
                onClick={() => { setPendingLevel('intermediate'); setStep('unit'); }}
                className={`px-8 py-5 rounded-2xl text-xl font-bold transition-all border-2 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg w-40 flex flex-col items-center justify-center
                  bg-gradient-to-br from-cyan-600 to-blue-700 text-white
                  hover:scale-105 active:scale-95
                  ${pendingLevel === 'intermediate' ? 'ring-4 ring-cyan-400 scale-105' : ''}`}
              >
                Intermediate
              </button>
              <button
                onClick={() => { setPendingLevel('upper-intermediate'); setStep('unit'); }}
                className={`px-8 py-5 rounded-2xl text-xl font-bold transition-all border-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 shadow-lg w-40 flex flex-col items-center justify-center
                  bg-gradient-to-br from-fuchsia-600 to-purple-700 text-white
                  hover:scale-105 active:scale-95
                  ${pendingLevel === 'upper-intermediate' ? 'ring-4 ring-fuchsia-400 scale-105' : ''}`}
              >
                Upper-Int
              </button>
            </div>
            <div className="mt-6 text-center text-sm text-gray-500 max-w-xs">
              Seçtiğin kura göre sana uygun üniteleri göreceksin.
            </div>
          </div>
        )}
        {/* Step 2: Ünite seçimi */}
        {step === 'unit' && (
          <div className="w-full flex flex-col items-center">
            <div className="flex flex-col items-center mb-6">
              <span className="inline-block p-4 rounded-full bg-gradient-to-br from-cyan-500 to-fuchsia-500 mb-3 shadow-lg">
                <Book className="w-10 h-10 text-white" />
              </span>
              <div className="text-3xl font-extrabold text-white tracking-wide mb-2">Ünite Seç</div>
              <div className="text-base text-gray-400 mb-2">Çalışmak istediğin üniteyi seç.</div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-4">
              {Array.from({ length: 8 }, (_, i) => (i + 1).toString()).map((unit) => (
                <button
                  key={unit}
                  onClick={() => { setPendingUnit(unit); }}
                  className={`py-5 rounded-2xl text-xl font-bold transition-all border-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-lg flex flex-col items-center justify-center
                    bg-gradient-to-br from-gray-800 to-gray-900 text-white
                    hover:scale-105 active:scale-95
                    ${pendingUnit === unit ? 'ring-4 ring-cyan-400 scale-105 bg-gradient-to-br from-cyan-600 to-blue-700' : ''}`}
                >
                  {unit}
                </button>
              ))}
            </div>
            <div className="w-full flex flex-col items-center mt-2">
              <div className="bg-gray-800/80 rounded-xl px-6 py-3 flex flex-col items-center shadow-inner">
                <span className="text-sm text-gray-400 mb-1">Seçilen Kur</span>
                <span className="text-lg font-bold text-cyan-400 mb-2">{pendingLevel === 'intermediate' ? 'Intermediate' : 'Upper-Int'}</span>
                <span className="text-sm text-gray-400 mb-1">Seçilen Ünite</span>
                <span className="text-lg font-bold text-fuchsia-400">{pendingUnit || '-'}</span>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="mt-6 text-center text-base text-red-400 bg-red-900/30 rounded-xl px-4 py-2">
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
  const lastScrollY = useRef(0);
  const navigate = useNavigate();
  
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

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800 h-32 flex items-center transition-transform duration-300 ${isHidden ? '-translate-y-full' : 'translate-y-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between">
            
            <div className="flex-shrink-0 flex items-center relative">
              <Link to="/" onClick={() => { setIsMenuOpen(false); setIsBottomSheetOpen(false); }}>
                <img src={logo} alt="Logo" className="h-20 w-auto" />
              </Link>
              {/* Mobilde seçim butonu */}
              <button
                className="ml-6 md:hidden px-5 py-3 rounded-2xl bg-gray-800 text-lg font-bold text-gray-100 border border-gray-700 shadow hover:bg-gray-700 transition-colors"
                onClick={() => setIsBottomSheetOpen(true)}
                aria-label="Kurs ve Ünite Seçimi"
              >
                {currentLevel === 'intermediate' ? 'Int' : 'Up-Int'} | {currentUnit}
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
              <motion.button onClick={handleProfileClick} className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} title="Profil">
                <User className="w-6 h-6" />
              </motion.button>
            </div>
            
            {/* Mobile: Hamburger Menu Button */}
            <div className="md:hidden">
              <motion.button onClick={handleProfileClick} className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} title="Profil">
                <User className="w-7 h-7" />
              </motion.button>
            </div>

          </div>
        </div>
      </nav>

      {/* Mobile Menu Panel kaldırıldı */}

      {/* Bottom Sheet Panel */}
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