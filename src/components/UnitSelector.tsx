import React, { useState, useRef, useEffect } from 'react';
import { Book, ChevronDown } from 'lucide-react';

interface UnitSelectorProps {
  currentUnit: string;
  setCurrentUnit: (unit: string) => void;
}

export function UnitSelector({ currentUnit, setCurrentUnit }: UnitSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const units = Array.from({ length: 10 }, (_, i) => (i + 1).toString());

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center justify-center" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={
          `flex items-center gap-3 px-6 py-2 rounded-full bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-purple-200 dark:border-purple-800 shadow-lg text-purple-700 dark:text-purple-200 font-semibold text-base transition-all duration-200 hover:bg-purple-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 w-full min-w-[200px]`
        }
      >
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 shadow-md">
          <Book className="w-5 h-5 text-white" />
        </span>
        <span className="font-semibold text-base">Ünite</span>
        <span className="font-bold text-lg tracking-wide">{currentUnit}</span>
        <ChevronDown className={`w-5 h-5 ml-auto transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className="absolute left-1/2 -translate-x-1/2 mt-2 z-50 w-48">
        <div className={`transition-all duration-200 ${open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'} origin-top shadow-2xl rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-purple-100 dark:border-purple-800 py-2 flex flex-col items-center`}> 
          {units.map((unit) => (
            <button
              key={unit}
              onClick={() => { setCurrentUnit(unit); setOpen(false); }}
              className={`w-36 my-1 py-2 rounded-lg text-base font-medium transition-all duration-150 flex items-center justify-center
                ${currentUnit === unit
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md scale-105'
                  : 'hover:bg-purple-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200'}
              `}
              style={{letterSpacing: '0.03em'}}
            >
              {unit}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}