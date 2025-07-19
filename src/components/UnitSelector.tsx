import React, { useState, useRef, useEffect, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Book, Layers, X } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';

// Ekran boyutunu kontrol etmek için basit bir hook
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);
  return matches;
};

type Level = 'intermediate' | 'upper-intermediate' | 'pre-intermediate' | 'foundation';

interface UnitSelectorProps {
  currentUnit: string;
  setCurrentUnit: (unit: string) => void;
  currentLevel: Level;
  setCurrentLevel: (level: Level) => void;
}

// --- MASAÜSTÜ İÇİN DROPDOWN BİLEŞENİ ---
const Dropdown: React.FC<{
  label: string;
  icon: React.ReactNode;
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
}> = ({ label, icon, options, selectedOption, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors w-full justify-between"
        whileTap={{ scale: 0.97 }}
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-semibold">{label}: {selectedOption}</span>
        </div>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full p-2 bg-gray-900 rounded-lg shadow-xl border border-gray-700 z-50"
          >
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${selectedOption === option
                    ? 'bg-cyan-500 text-white'
                    : 'hover:bg-gray-800 text-gray-300'
                  }`}
              >
                {option}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


// --- MASAÜSTÜ BİLEŞENİ ---
const DesktopUnitSelector: React.FC<UnitSelectorProps> = ({ currentUnit, setCurrentUnit, currentLevel, setCurrentLevel }) => {
  const units = Array.from({ length: 8 }, (_, i) => `Ünite ${i + 1}`);
  const levels: { id: Level; name: string }[] = [
    { id: 'foundation', name: 'Foundation' },
    { id: 'pre-intermediate', name: 'Pre-Intermediate' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'upper-intermediate', name: 'Upper-Intermediate' },
  ];

  return (
    <div className="flex items-center gap-4">
      <Dropdown 
        label="Kur"
        icon={<Layers className="w-5 h-5 text-fuchsia-400" />}
        options={levels.map(l => l.name)}
        selectedOption={levels.find(l => l.id === currentLevel)?.name || 'Intermediate'}
        onSelect={(levelName) => {
          const selectedLevel = levels.find(l => l.name === levelName);
          if (selectedLevel) setCurrentLevel(selectedLevel.id);
        }}
      />
      <Dropdown 
        label="Ünite"
        icon={<Book className="w-5 h-5 text-cyan-400" />}
        options={units}
        selectedOption={`Ünite ${currentUnit}`}
        onSelect={(unit) => setCurrentUnit(unit.replace('Ünite ', ''))}
      />
    </div>
  );
};

// --- MOBİL BİLEŞENİ (SADELEŞTİRİLMİŞ) ---
const MobileUnitSelector: React.FC<UnitSelectorProps & { isOpen: boolean; onClose: () => void }> = ({
  currentUnit,
  setCurrentUnit,
  currentLevel,
  setCurrentLevel,
  isOpen,
  onClose
}) => {
  const units = Array.from({ length: 8 }, (_, i) => `${i + 1}`);
  const levels: { id: Level; name: string }[] = [
    { id: 'foundation', name: 'Foundation' },
    { id: 'pre-intermediate', name: 'Pre-Intermediate' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'upper-intermediate', name: 'Upper-Intermediate' },
  ];

  const handleLevelSelect = (levelId: Level) => {
    setCurrentLevel(levelId);
    setCurrentUnit('1'); // Seviye değişince üniteyi 1'e sıfırla
  };

  const handleUnitSelect = (unit: string) => {
    setCurrentUnit(unit);
    onClose(); // Ünite seçince paneli kapat
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Arka Plan */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        </Transition.Child>

        {/* Panel */}
        <div className="fixed inset-x-0 bottom-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
          >
            <Dialog.Panel className="w-full transform overflow-hidden rounded-t-2xl bg-black border-t border-gray-800 p-4 text-left align-middle shadow-2xl transition-all">
              
              {/* Panel tutamacı */}
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-700 mb-4" />

              <div className="space-y-4">
                {/* Kur Seçimi */}
                <div>
                  <h4 className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-2 px-1">Kur</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {levels.map(level => (
                      <button 
                        key={level.id} 
                        onClick={() => handleLevelSelect(level.id)} 
                        className={`p-3 text-sm font-semibold rounded-lg border transition-colors duration-150 ${currentLevel === level.id 
                          ? 'bg-white text-black border-white shadow-lg shadow-white/20' 
                          : 'bg-gray-800/50 text-gray-200 border-gray-700 hover:border-gray-500'}`
                        }
                      >
                        {level.name}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Ünite Seçimi */}
                <div>
                  <h4 className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-2 px-1">Ünite</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {units.map(unit => (
                      <button 
                        key={unit} 
                        onClick={() => handleUnitSelect(unit)} 
                        className={`p-3 aspect-square text-sm font-semibold rounded-lg border transition-colors duration-150 ${currentUnit === unit 
                          ? 'bg-white text-black border-white shadow-lg shadow-white/20' 
                          : 'bg-gray-800/50 text-gray-200 border-gray-700 hover:border-gray-500'}`
                        }
                      >
                        {unit}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

// --- ANA BİLEŞEN ---
export const UnitSelector: React.FC<UnitSelectorProps> = (props) => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    if (isMobile) {
        return (
            <>
                <button 
                    onClick={() => setIsMobileMenuOpen(true)} 
                    className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors text-sm"
                >
                    <Layers className="w-4 h-4 text-fuchsia-400" />
                    <span>{props.currentLevel.replace('-', ' ')} / Unit {props.currentUnit}</span>
                    <ChevronDown className="w-4 h-4" />
                </button>
                <MobileUnitSelector {...props} isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
            </>
        )
    }

    return <DesktopUnitSelector {...props} />;
};