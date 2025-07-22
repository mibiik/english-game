import React from 'react';

interface DefneSpecialModalProps {
  onClose: () => void;
}

const DefneSpecialModal: React.FC<DefneSpecialModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 shadow-2xl min-w-[320px] max-w-[90vw] relative border-2 border-pink-400">
        <button onClick={onClose} className="absolute top-3 right-3 text-pink-400 text-2xl font-bold hover:text-pink-600">×</button>
        <div className="flex flex-col items-center gap-3">
          <div className="text-4xl">👑</div>
          <h2 className="text-2xl font-bold text-pink-600 text-center">EŞLEŞTİRME OYUNUN KRALÇİESİ GELDİ</h2>
          <p className="text-pink-700 text-center font-bold">DEFNE ÖZZ TAM BİR VİRTÜOZ </p>
        </div>
      </div>
    </div>
  );
};

export default DefneSpecialModal; 