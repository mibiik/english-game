import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, User, Menu, X, BookOpen, GraduationCap } from 'lucide-react';
import logo from './a.png';
import { UnitSelector } from './UnitSelector';

interface NavbarProps {
  onShowAuth: () => void;
  currentUnit: string;
  setCurrentUnit: (unit: string) => void;
  currentLevel: 'intermediate' | 'upper-intermediate';
  setCurrentLevel: (level: 'intermediate' | 'upper-intermediate') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onShowAuth,
  currentUnit,
  setCurrentUnit,
  currentLevel,
  setCurrentLevel,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleMenuAction = (action: () => void) => {
    action();
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800 h-24 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between">
            
            <div className="flex-shrink-0">
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                <img src={logo} alt="Logo" className="h-16 w-auto" />
              </Link>
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
              <motion.button onClick={onShowAuth} className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} title="Profil">
                <User className="w-6 h-6" />
              </motion.button>
            </div>
            
            {/* Mobile: Hamburger Menu Button */}
            <div className="md:hidden">
              <motion.button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2" whileTap={{ scale: 0.9 }}>
                <Menu className="w-7 h-7 text-white" />
              </motion.button>
            </div>

          </div>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full bg-black/90 backdrop-blur-lg z-40 p-8 pt-28 flex flex-col"
          >
            <div className="flex flex-col items-center gap-8">
              {/* Kurs Seviyesi Seçimi */}
              <div className="w-full">
                <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" /> Kurs Seviyesi
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleMenuAction(() => setCurrentLevel('intermediate'))}
                    className={`p-3 rounded-lg text-center transition-colors ${
                      currentLevel === 'intermediate'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Intermediate
                  </button>
                  <button
                    onClick={() => handleMenuAction(() => setCurrentLevel('upper-intermediate'))}
                    className={`p-3 rounded-lg text-center transition-colors ${
                      currentLevel === 'upper-intermediate'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Upper-Intermediate
                  </button>
                </div>
              </div>

              {/* Ünite Seçimi */}
              <div className="w-full">
                <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" /> Ünite Seçimi
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: 8 }, (_, i) => (i + 1).toString()).map((unit) => (
                    <button
                      key={unit}
                      onClick={() => handleMenuAction(() => setCurrentUnit(unit))}
                      className={`p-3 rounded-lg text-center transition-colors ${
                        currentUnit === unit
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      Ünite {unit}
                    </button>
                  ))}
                </div>
              </div>

              {/* Profil Butonu */}
              <button 
                onClick={() => handleMenuAction(onShowAuth)} 
                className="w-full flex items-center justify-center gap-2 p-4 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <User className="w-5 h-5" /> Profil / Giriş Yap
              </button>
            </div>

            <button onClick={() => setIsMenuOpen(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white">
              <X className="w-8 h-8"/>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};