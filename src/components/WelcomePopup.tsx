import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';

interface WelcomePopupProps {
  onClose: (name: string | null) => void;
}

export const WelcomePopup: React.FC<WelcomePopupProps> = ({ onClose }) => {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (name.trim()) {
      onClose(name.trim());
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 15, stiffness: 150 }}
          className="relative z-10 w-full max-w-sm bg-gray-900 border border-gray-700 rounded-lg shadow-2xl p-8 text-center"
        >
          <button 
            onClick={() => onClose(null)}
            className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors"
            aria-label="Kapat"
          >
            <X className="w-6 h-6" />
          </button>

          <h2 className="text-3xl font-bold text-white mb-2">
            Hoşgeldin KOÇ'LU
          </h2>
          <p className="text-gray-400 mb-6">
            Sana nasıl hitap etmeliyiz?
          </p>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }} 
            className="relative"
          >
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="İsmini yaz..."
              className="w-full p-3 pr-12 text-center text-lg bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all"
            />
            <button
              type="submit"
              disabled={!name.trim()}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
              aria-label="Devam et"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}; 