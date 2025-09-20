import React from 'react';
import { Sparkles, Info } from 'lucide-react';

const tips = [
  'Açık bir giriş ve tez cümlesiyle başlayın.',
  'Her paragrafta tek ana fikir kullanın.',
  'Fikirlerinizi örneklerle destekleyin.',
  'Bağlaçlar kullanın (Ancak, Sonuç olarak...)',
];

const MiniTipStack: React.FC<{ tall?: boolean }> = ({ tall }) => {
  return (
    <div className={`bg-white rounded-xl border border-yellow-200 shadow-sm flex flex-col items-center p-3 mx-auto ${tall ? 'min-h-[340px] max-h-[600px] w-full' : 'max-w-[120px] min-w-[100px] h-[320px]'} overflow-auto`}>
      <Sparkles className="w-7 h-7 text-yellow-400 mb-1" />
      <div className="text-xs font-bold text-gray-800 mb-2 text-center">Yazma İpuçları</div>
      <div className={`flex flex-col ${tall ? 'gap-4 w-full' : 'gap-2 w-full'}` }>
        {tips.map((tip, i) => (
          <div key={i} className={`bg-yellow-50 border border-yellow-100 rounded ${tall ? 'p-3 text-sm' : 'p-2 text-xs'} text-gray-700 text-center flex items-center gap-1 transition-shadow hover:shadow-md`}>
            <Info className="w-3 h-3 text-yellow-400 inline-block mr-1" />
            <span className="truncate">{tip}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiniTipStack; 