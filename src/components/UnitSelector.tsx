import React from 'react';

interface UnitSelectorProps {
  currentUnit: string;
  setCurrentUnit: (unit: string) => void;
}

const unitData = [
  { id: 1, title: 'Ünite 1' },
  { id: 2, title: 'Ünite 2' },
  { id: 3, title: 'Ünite 3' },
  { id: 4, title: 'Ünite 4' },
  { id: 5, title: 'Ünite 5' },
  { id: 6, title: 'Ünite 6' },
  { id: 7, title: 'Ünite 7' },
  { id: 8, title: 'Ünite 8' },
  { id: 9, title: 'Ünite 9' },
  { id: 10, title: 'Ünite 10' },
];

export function UnitSelector({ currentUnit, setCurrentUnit }: UnitSelectorProps) {
  return (
    <div className="relative w-full">
      <select
        value={currentUnit}
        onChange={(e) => setCurrentUnit(e.target.value)}
        className="w-full p-3 text-base bg-gradient-to-r from-white to-purple-50 border border-gray-300 rounded-lg
          appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500
          focus:border-transparent transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100
          hover:border-purple-300 active:scale-[0.98] shadow-sm hover:shadow-md"
      >
        {unitData.map((unit) => (
          <option key={unit.id} value={unit.id.toString()}>
            {unit.title}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg className="w-5 h-5 text-purple-500 transform transition-transform duration-300 hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}