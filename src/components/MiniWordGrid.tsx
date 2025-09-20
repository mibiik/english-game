import React from 'react';
import { PenTool } from 'lucide-react';

interface MiniWordGridProps {
  words: string[];
  tall?: boolean;
}

const MiniWordGrid: React.FC<MiniWordGridProps> = ({ words, tall }) => {
  return (
    <div className={`bg-white rounded-xl border border-emerald-200 shadow-sm flex flex-col items-center p-3 mx-auto ${tall ? 'min-h-[340px] max-h-[600px] w-full' : 'max-w-[120px] min-w-[100px] h-[320px]'} overflow-auto`}>
      <PenTool className="w-7 h-7 text-emerald-500 mb-1" />
      <div className="text-xs font-bold text-gray-800 mb-2 text-center">Kelime Önerileri</div>
      <div className={`${tall ? 'grid grid-cols-1 gap-2 w-full' : 'grid grid-cols-2 gap-1 w-full'}`}>
        {words.length > 0 ? (
          words.map((word, i) => (
            <span key={i} className={`bg-emerald-50 text-emerald-700 ${tall ? 'px-3 py-2 text-sm' : 'px-2 py-1 text-xs'} rounded font-semibold border border-emerald-100 text-center truncate transition-transform hover:scale-105 cursor-pointer`}>
              {word}
            </span>
          ))
        ) : (
          <span className="text-gray-400 text-xs col-span-2 text-center">Kelime yok</span>
        )}
      </div>
    </div>
  );
};

export default MiniWordGrid; 