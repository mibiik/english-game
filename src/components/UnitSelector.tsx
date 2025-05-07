import React from 'react';

interface UnitSelectorProps {
  currentUnit: string;
  setCurrentUnit: (unit: string) => void;
}

const unitData = [
  { id: 1, title: 'Unit 1' },
  { id: 2, title: 'Unit 2' },
  { id: 3, title: 'Unit 3' },
  { id: 4, title: 'Unit 4' },
  { id: 5, title: 'Unit 5' },
  { id: 6, title: 'Unit 6' },
  { id: 7, title: 'Unit 7' },
  { id: 8, title: 'Unit 8' },
];

export function UnitSelector({ currentUnit, setCurrentUnit }: UnitSelectorProps) {
  return (
    <div className="relative w-full pt-1">
      <select
        value={currentUnit}
        onChange={(e) => setCurrentUnit(e.target.value)}
        className="w-full p-2 text-sm font-medium text-gray-700 bg-white border border-purple-200 rounded-lg
          appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400
          focus:border-transparent hover:border-purple-300 transition-all"
      >
        {unitData.map((unit) => (
          <option key={unit.id} value={unit.id.toString()}>
            {unit.title}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <div className="bg-purple-100 rounded-full p-1">
          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}