import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, User, Menu, X, BookOpen, GraduationCap, SlidersHorizontal, Layers, Book, ChevronDown } from 'lucide-react';
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
  const levels: { id: 'intermediate' | 'upper-intermediate'; name: string }[] = [
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
                  {currentLevel === 'intermediate' ? 'Intermediate' : 'Upper-Int'}
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