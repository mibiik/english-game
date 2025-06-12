import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, User, Menu, X, BookOpen, GraduationCap, SlidersHorizontal } from 'lucide-react';
import logo from './a.png';
import { UnitSelector } from './UnitSelector';

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
  if (!open) return null;
  return (
    <>
      {/* Arka plan */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className="fixed left-1/2 -translate-x-1/2 right-0 bottom-0 z-50 bg-gray-900 dark:bg-gray-950 rounded-t-3xl shadow-2xl p-12 pt-16 border-t border-gray-800 flex flex-col items-center w-full max-w-xl"
        style={{ minHeight: 380, maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Kapat */}
        <button
          className="absolute top-7 right-10 text-gray-400 hover:text-gray-200 p-2 text-3xl"
          onClick={onClose}
          aria-label="Kapat"
        >
          ×
        </button>
        {/* Başlık */}
        <div className="mb-8 w-full flex flex-col items-center">
          <div className="text-2xl font-extrabold text-gray-100 mb-4 tracking-wide">
            Seçim Yap
          </div>
          <div className="flex gap-4 mb-2">
            <button
              onClick={() => { setCurrentLevel('intermediate'); onClose(); }}
              className={`px-6 py-2.5 rounded-xl text-base font-semibold transition-all border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 ${currentLevel === 'intermediate' ? 'bg-gray-800 text-gray-100 shadow-lg' : 'bg-gray-900 text-gray-400 hover:bg-gray-800'}`}
            >
              Intermediate
            </button>
            <button
              onClick={() => { setCurrentLevel('upper-intermediate'); onClose(); }}
              className={`px-6 py-2.5 rounded-xl text-base font-semibold transition-all border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 ${currentLevel === 'upper-intermediate' ? 'bg-gray-800 text-gray-100 shadow-lg' : 'bg-gray-900 text-gray-400 hover:bg-gray-800'}`}
            >
              Upper-Int
            </button>
          </div>
        </div>
        {/* Ünite */}
        <div className="w-full flex flex-col items-center">
          <div className="text-lg font-bold text-gray-100 mb-3">
            Ünite Seç
          </div>
          <div className="flex gap-4 flex-wrap justify-center">
            {Array.from({ length: 8 }, (_, i) => (i + 1).toString()).map((unit) => (
              <button
                key={unit}
                onClick={() => { setCurrentUnit(unit); onClose(); }}
                className={`px-6 py-3 rounded-xl text-xl font-bold transition-all border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2 ${currentUnit === unit ? 'bg-gray-800 text-gray-100 shadow-lg' : 'bg-gray-900 text-gray-400 hover:bg-gray-800'}`}
              >
                {unit}
              </button>
            ))}
          </div>
        </div>
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
  const navigate = useNavigate();
  
  const handleMenuAction = (action: () => void) => {
    action();
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800 h-32 flex items-center">
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
              <motion.button onClick={() => navigate('/profile')} className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} title="Profil">
                <User className="w-6 h-6" />
              </motion.button>
            </div>
            
            {/* Mobile: Hamburger Menu Button */}
            <div className="md:hidden">
              <motion.button onClick={() => navigate('/profile')} className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} title="Profil">
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