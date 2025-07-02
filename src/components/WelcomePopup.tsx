import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import kocLogo from '../koc-logo.png';

interface WelcomePopupProps {
  onClose: (name: string | null) => void;
}

const welcomeMessages = [
  "Hazırlıktasın… ama kendini Harvard'da sanman çok normal.",
  "Burası hazırlık, ama biz seni ileri sarıyoruz!",
  "Hazırlıkta çok şey öğreneceksin… en çok da kantin fiyatlarını.",
  "Daha derse girmeden \"Koçluyum\" demek serbest.",
  "Hazırlıkta her şey serbest... ama devamsızlık hariç!",
  "Bugün hazırlık, yarın CEO… hiç bozma.",
  "Şimdi İngilizce, sonra dünya senin!",
  "\"Present simple\"la geldin, \"future perfect\"le gideceksin.",
  "ELC mi? İngilizce öğrenip sonra yine Türkçe konuşma yeri.",
  "Finale kadar her şey çok tatlı… Sonrası tat kaçırabilir 🍬",
  "Ders başlamadan kahve, dersten sonra panik!",
  "Grammar'ı çözemedik ama gözlüğümüz var, sorun yok!",
  "ELC: Eğlen, öğren, geç… ama en çok geç.",
  "Koç'a hoş geldin. Şimdi başlıyoruz... ama önce bir selfie!",
  "Burası ELC… Notlar uçar, devamsızlık sayılır!",
  "En zor cümle \"I have done my homework.\"",
  "Kahveni al, gözlüğünü tak, İngilizceye dal!",
  "Sınavdan düşük alsan da cool görünmen yeterli.",
  "Sınıfta ilk gün: \"I'm from Türkiye.\" Son gün: \"Still Türkiye.\"",
  "İngilizce konuşmak serbest… ama cesaret ekstra."
];

export const WelcomePopup: React.FC<WelcomePopupProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [feedback, setFeedback] = useState('');
  const [randomMessage, setRandomMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setRandomMessage(welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)]);
  }, []);

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Lütfen ismini yaz.');
      return;
    }
    if (!feedback.trim()) {
      setError('Lütfen geri bildiriminizi yazın.');
      return;
    }
    setError('');
    onClose(name.trim());
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
            onClick={(e) => {
              e.preventDefault();
              if (!feedback.trim()) {
                setError('Lütfen görüş ve önerinizi yazın.');
                return;
              }
              setError('');
              onClose(null);
            }}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 transition-colors"
            aria-label="Kapat"
          >
            <X className="w-6 h-6" />
          </button>

          <img src={kocLogo} alt="Koç Üniversitesi Logosu" className="w-32 h-32 mx-auto mb-6 bg-white rounded-full p-2 object-contain" />

          <h2 className="text-3xl font-bold text-white mb-2">
            Hoş geldin Koç'lu 😎
          </h2>
          <p className="text-purple-300/80 mb-4 h-10 flex items-center justify-center">
            {randomMessage}
          </p>
          <p className="text-gray-400 mb-6">
            Sana nasıl hitap etmeliyiz?
          </p>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }} 
            className="relative flex flex-col items-center"
          >
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="İsmini yaz..."
              className="w-full p-3 pr-12 text-center text-lg bg-gray-100 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all shadow mb-2"
              autoFocus
            />
            <div className="w-full mt-2">
              <div className="mb-2 text-blue-700 text-sm font-semibold bg-blue-50 rounded-lg px-3 py-2 border border-blue-100">
                Merhaba! <span className="font-bold text-blue-900">Wordplay</span> hakkında ne düşünüyorsun? <br />Görüş ve önerilerini lütfen bizimle paylaş.
              </div>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Ne düşünüyorsun? Önerin var mı? Geri bildirimin bizim için çok değerli!"
                className="w-full p-3 text-base bg-gray-100 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all resize-none shadow-sm mb-2"
                rows={3}
                required
              />
              <button
                type="submit"
                disabled={!name.trim() || !feedback.trim()}
                className="w-full py-2 mt-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
                aria-label="Devam et"
              >
                Devam et
              </button>
              {error && (
                <div className="text-red-500 text-xs mt-2 text-center">{error}</div>
              )}
            </div>
          </form>
          
          <p className="text-xs text-gray-500 mt-5">
            
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}; 