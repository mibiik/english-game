import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Book, Layers } from 'lucide-react';

type Level = 'intermediate' | 'upper-intermediate';

interface UnitSelectorProps {
  currentUnit: string;
  setCurrentUnit: (unit: string) => void;
  currentLevel: Level;
  setCurrentLevel: (level: Level) => void;
}

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
        className="flex items-center gap-3 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
        whileTap={{ scale: 0.97 }}
      >
        {icon}
        <span className="font-semibold">{label}: {selectedOption}</span>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-56 p-2 bg-gray-900 rounded-lg shadow-xl border border-gray-700 z-50"
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


export const UnitSelector: React.FC<UnitSelectorProps> = ({
  currentUnit,
  setCurrentUnit,
  currentLevel,
  setCurrentLevel,
}) => {
  const units = Array.from({ length: 8 }, (_, i) => `Ünite ${i + 1}`);
  const levels: { id: Level; name: string }[] = [
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'upper-intermediate', name: 'Upper-Intermediate' },
  ];

  // Geçici seçimler
  const [pendingLevel, setPendingLevel] = useState<string | null>(null);
  const [pendingUnit, setPendingUnit] = useState<string | null>(null);
  const [levelTouched, setLevelTouched] = useState(false);
  const [unitTouched, setUnitTouched] = useState(false);

  useEffect(() => {
    if (levelTouched && unitTouched && pendingLevel && pendingUnit) {
      setCurrentLevel(pendingLevel as Level);
      setCurrentUnit(pendingUnit);
      setLevelTouched(false);
      setUnitTouched(false);
    }
  }, [pendingLevel, pendingUnit, levelTouched, unitTouched, setCurrentLevel, setCurrentUnit]);

  return (
    <div className="flex items-center gap-4">
      <Dropdown 
        label="Kur"
        icon={<Layers className="w-5 h-5 text-fuchsia-400" />}
        options={levels.map(l => l.name)}
        selectedOption={levels.find(l => l.id === (pendingLevel || currentLevel))?.name || 'Intermediate'}
        onSelect={(levelName) => {
          const selectedLevel = levels.find(l => l.name === levelName);
          if (selectedLevel) {
            setPendingLevel(selectedLevel.id);
            setLevelTouched(true);
          }
        }}
      />
      <Dropdown 
        label="Ünite"
        icon={<Book className="w-5 h-5 text-cyan-400" />}
        options={units}
        selectedOption={`Ünite ${pendingUnit || currentUnit}`}
        onSelect={(unit) => {
          setPendingUnit(unit.replace('Ünite ', ''));
          setUnitTouched(true);
        }}
      />
    </div>
  );
};