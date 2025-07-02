import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import kocLogo from '../koc-logo.png';
import { userService } from '../services/userService';

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
  const [step, setStep] = useState<'feedback' | 'name'>('feedback');

  useEffect(() => {
    setRandomMessage(welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)]);
  }, []);

  const handleSubmit = async () => {
    if (step === 'feedback') {
      if (!feedback.trim()) {
        setError('Lütfen görüş ve önerinizi yazın.');
        return;
      }
      setError('');
      setStep('name');
      return;
    }
    
    // step === 'name'
    if (!feedback.trim()) {
      setError('Lütfen geri bildiriminizi yazın.');
      return;
    }
    setError('');
    await userService.saveUserFeedback(name.trim() || 'Anonim', feedback.trim());
    onClose(name.trim() || null);
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
            onClick={async (e) => {
              e.preventDefault();
              if (step === 'feedback') {
                if (!feedback.trim()) {
                  setError('Lütfen görüş ve önerinizi yazın.');
                  return;
                }
              }
              setError('');
              if (step === 'name') {
                await userService.saveUserFeedback(name.trim() || 'Anonim', feedback.trim());
              }
              onClose(name.trim() || null);
            }}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Kapat"
          >
            <X className="w-6 h-6" />
          </button>

          <img src={kocLogo} alt="Koç Üniversitesi Logosu" className="w-24 h-24 mx-auto mb-4 bg-white rounded-full p-2 object-contain" />

          <h2 className="text-2xl font-bold text-white mb-3">
            {step === 'feedback' ? 'Wordplay Hakkında' : 'Son Bir Adım'}
          </h2>
          <p className="text-gray-300 mb-4 text-sm">
            {step === 'feedback' 
              ? 'Görüş ve önerilerinizi bizimle paylaşır mısınız?' 
              : 'İsterseniz isminizi de öğrenebilir miyiz?'
            }
          </p>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }} 
            className="relative flex flex-col items-center"
          >
            {step === 'feedback' && (
              <div className="w-full">
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Wordplay hakkında ne düşünüyorsunuz? Önerilerinizi yazın..."
                  className="w-full p-3 text-base bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all resize-none mb-3"
                  rows={4}
                  required
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!feedback.trim()}
                  className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
                >
                  Devam Et
                </button>
              </div>
            )}
            
            {step === 'name' && (
              <div className="w-full">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="İsminiz (isteğe bağlı)"
                  className="w-full p-3 text-center text-base bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all mb-3"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      await userService.saveUserFeedback('Anonim', feedback.trim());
                      onClose(null);
                    }}
                    className="flex-1 py-2.5 rounded-lg bg-gray-500 hover:bg-gray-600 text-white font-medium transition-all"
                  >
                    Geç
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all"
                  >
                    Tamamla
                  </button>
                </div>
              </div>
            )}
            
            {error && (
              <div className="text-red-400 text-xs mt-2 text-center">{error}</div>
            )}
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}; 