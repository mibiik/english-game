import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Mic, Volume2, ChevronLeft, ChevronRight, CheckCircle, X } from 'lucide-react';
import { WordDetail } from '../../data/intermediate';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabaseAuthService } from '../../services/supabaseAuthService';
import { supabaseGameScoreService } from '../../services/supabaseGameScoreService';
import { awardPoints } from '../../services/scoreService';
import { soundService } from '../../services/soundService';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeakingGameProps {
  words: WordDetail[];
}

export function SpeakingGame({ words }: SpeakingGameProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentUnit = searchParams.get('unit') || '1';
  const currentLevel = searchParams.get('level') || 'intermediate';
  
  const [roundWords, setRoundWords] = useState<WordDetail[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [theme, setTheme] = useState<'blue' | 'pink' | 'classic'>('blue');
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Tema renkleri
  const themeClasses = theme === 'blue' ? {
    bg: 'bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100',
    cardBg: 'bg-white/60 backdrop-blur-lg',
    border: 'border-blue-200',
    text: 'text-blue-800',
    textSecondary: 'text-blue-600',
    textDark: 'text-blue-900',
    button: 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700',
    progress: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    inputBg: 'bg-white/80',
    inputBorder: 'border-blue-200 focus:border-blue-400 focus:ring-blue-300',
    placeholder: 'placeholder-blue-400'
  } : theme === 'pink' ? {
    bg: 'bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100',
    cardBg: 'bg-white/60 backdrop-blur-lg',
    border: 'border-pink-200',
    text: 'text-pink-800',
    textSecondary: 'text-pink-600',
    textDark: 'text-pink-900',
    button: 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700',
    progress: 'bg-gradient-to-r from-pink-500 to-rose-600',
    inputBg: 'bg-white/80',
    inputBorder: 'border-pink-200 focus:border-pink-400 focus:ring-pink-300',
    placeholder: 'placeholder-pink-400'
  } : {
    bg: 'bg-black',
    cardBg: 'bg-gray-800/50 backdrop-blur-lg border border-gray-700',
    border: 'border-gray-700',
    text: 'text-gray-200',
    textSecondary: 'text-cyan-400',
    textDark: 'text-white',
    button: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700',
    progress: 'bg-gradient-to-r from-cyan-500 to-blue-600',
    inputBg: 'bg-gray-900/50',
    inputBorder: 'border-gray-600 focus:border-cyan-400 focus:ring-cyan-300',
    placeholder: 'placeholder-gray-500'
  };

  // Oyunu başlat
  const startGame = useCallback(() => {
    if (words.length === 0) return;
    const shuffled = [...words].sort(() => 0.5 - Math.random());
    setRoundWords(shuffled);
    setCurrentWordIndex(0);
    setFeedback(null);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setGameCompleted(false);
    setIsGameActive(true);
    setIsListening(false);
  }, [words]);

  // Sayfa açıldığında en üste kaydır
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  // Oyunu otomatik başlat
  useEffect(() => {
    if (words.length > 0 && !isGameActive && !gameCompleted) {
      startGame();
    }
  }, [words.length, isGameActive, gameCompleted, startGame]);

  // Kelime değiştiğinde ve oyun aktif olduğunda en üste kaydır
  useEffect(() => {
    if (isGameActive) {
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 100);
    }
  }, [currentWordIndex, isGameActive]);

  // Speech synthesis başlat
  useEffect(() => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Kelime değiştiğinde recognition'ı temizle
  useEffect(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      } catch (e) {
        // Ignore errors
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, [currentWordIndex]);

  const nextWord = useCallback(() => {
    if (currentWordIndex < roundWords.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
      setFeedback(null);
      setIsListening(false);
    } else {
      // Tur bitti
      setGameCompleted(true);
      setIsGameActive(false);
      const unit = roundWords[0]?.unit || '1';
      try {
        const userId = supabaseAuthService.getCurrentUserId();
        if (userId) {
          supabaseGameScoreService.saveScore('speaking', score, unit);
        }
      } catch (error) {
        console.error('Skor kaydedilirken hata:', error);
      }
    }
  }, [currentWordIndex, roundWords.length, score, roundWords]);

  const speak = useCallback((text: string) => {
    if (!synthRef.current) return;
    
    // Önceki konuşmaları durdur
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    
    const voices = synthRef.current.getVoices();
    const enVoice = voices.find((v: SpeechSynthesisVoice) => v.lang.startsWith('en'));
    if (enVoice) utterance.voice = enVoice;
    
    if (voices.length === 0) {
      synthRef.current.onvoiceschanged = () => {
        const voices2 = synthRef.current.getVoices();
        const enVoice2 = voices2.find((v: SpeechSynthesisVoice) => v.lang.startsWith('en'));
        if (enVoice2) utterance.voice = enVoice2;
        synthRef.current.speak(utterance);
      };
    } else {
      synthRef.current.speak(utterance);
    }
  }, []);

  const startListening = useCallback(() => {
    const currentWord = roundWords[currentWordIndex];
    if (!currentWord || isListening) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setFeedback({ message: 'Tarayıcınız konuşma tanımayı desteklemiyor.', isCorrect: false });
      return;
    }

    // Önceki recognition'ı temizle
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      } catch (e) {
        // Ignore
      }
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    setIsListening(true);
    setFeedback({ message: 'Dinliyorum...', isCorrect: false });

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      const correctWord = currentWord.headword.toLowerCase();
      
      setIsListening(false);
      recognitionRef.current = null;

      if (transcript === correctWord) {
        const newScore = score + 10;
        const newStreak = streak + 1;
        setScore(newScore);
        setStreak(newStreak);
        setBestStreak(prev => Math.max(prev, newStreak));
        setFeedback({ message: 'Harika! Doğru telaffuz!', isCorrect: true });
        
        const bonus = Math.min(newStreak, 5);
        awardPoints('speaking', 10 + bonus, currentWord.unit);
        soundService.playCorrect();
        
        setTimeout(() => {
          nextWord();
        }, 1500);
      } else {
        setStreak(0);
        setFeedback({ message: `Tekrar deneyin. Söylediğiniz: "${transcript}"`, isCorrect: false });
        soundService.playWrong();
      }
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      recognitionRef.current = null;
      setFeedback({ message: `Hata: ${event.error}. Tekrar deneyin.`, isCorrect: false });
    };

    recognition.onend = () => {
      setIsListening(false);
      if (recognitionRef.current === recognition) {
        recognitionRef.current = null;
      }
    };

    try {
      recognition.start();
    } catch (e) {
      setIsListening(false);
      recognitionRef.current = null;
      setFeedback({ message: 'Mikrofon erişimi gerekli. Lütfen izin verin.', isCorrect: false });
    }
  }, [roundWords, currentWordIndex, isListening, score, streak, nextWord]);

  // Güvenli erişim
  if (roundWords.length === 0) {
    return <div className={`flex items-start justify-center min-h-screen w-full ${themeClasses.bg} p-4 pt-8 ${themeClasses.text}`}>Oyun için kelimeler hazırlanıyor...</div>;
  }

  const currentWord = roundWords[currentWordIndex];

  // Oyun bitti ekranı
  if (gameCompleted && !isGameActive) {
    return (
      <div className={`flex items-start justify-center min-h-screen w-full ${themeClasses.bg} p-4 pt-8`}>
        <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={`text-center ${themeClasses.cardBg} rounded-2xl shadow-2xl w-full max-w-md border ${themeClasses.border} p-8`}
        >
          <h2 className={`text-4xl font-black mb-4 ${themeClasses.textSecondary}`}>Oyun Bitti!</h2>
          <div className={`p-4 rounded-xl mb-6 border ${theme === 'classic' ? 'bg-gray-800/50 border-gray-700' : theme === 'pink' ? 'bg-gradient-to-r from-pink-50 to-rose-50 border-pink-100' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100'}`}>
            <p className={`text-3xl font-bold ${themeClasses.textDark}`}>{score}</p>
            <p className={`mt-2 ${themeClasses.text}`}>En iyi seri: {bestStreak}</p>
          </div>
          {/* Tema Seçimi */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <button
              onClick={() => setTheme('classic')}
              className={`w-8 h-8 rounded-full border-2 transition-all ${theme === 'classic' ? 'bg-gray-800 border-cyan-400' : 'bg-gray-600 border-gray-300'}`}
              title="Klasik Tema"
            />
            <button
              onClick={() => setTheme('blue')}
              className={`w-8 h-8 rounded-full border-2 transition-all ${theme === 'blue' ? 'bg-blue-500 border-blue-600' : 'bg-blue-300 border-blue-400'}`}
              title="Mavi Tema"
            />
            <button
              onClick={() => setTheme('pink')}
              className={`w-8 h-8 rounded-full border-2 transition-all ${theme === 'pink' ? 'bg-pink-400 border-pink-600' : 'bg-pink-300 border-pink-400'}`}
              title="Pembe Tema"
            />
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate(`/game-modes?unit=${currentUnit}&level=${currentLevel}`)} 
              className={`flex-1 flex items-center justify-center gap-2 text-center rounded-xl px-6 py-3 text-lg font-semibold text-white shadow-lg bg-gray-500 hover:bg-gray-600 transition-all duration-200`}
            >
              <ChevronLeft className="w-5 h-5" />
              Geri Dön
            </button>
            <button onClick={startGame} className={`flex-1 text-center rounded-xl px-6 py-3 text-lg font-semibold text-white shadow-lg ${themeClasses.button} transition-all duration-200`}>
              Tekrar Oyna
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentWord) {
    return <div className={`flex items-center justify-center min-h-screen ${themeClasses.bg} ${themeClasses.text}`}>Oyun yükleniyor...</div>;
  }

  return (
    <div className={`flex items-start justify-center min-h-screen p-1 sm:p-2 md:p-4 ${themeClasses.bg} pt-8 md:pt-12`}>
      <div className="w-full max-w-lg mx-auto relative">
          {/* HUD */}
          <div className={`flex justify-between items-center mb-4 ${themeClasses.cardBg} rounded-xl shadow border ${themeClasses.border} px-4 py-3`}>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => navigate(`/game-modes?unit=${currentUnit}&level=${currentLevel}`)} 
                  className={`${themeClasses.textSecondary} hover:opacity-80 transition-all duration-200 p-1`}
                  title="Oyun Modlarına Dön"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className={`${themeClasses.text} font-semibold`}>Skor: <span className={`font-bold text-xl ${themeClasses.textDark}`}>{score}</span></div>
              </div>
              <div className={`${themeClasses.textSecondary} text-sm font-medium`}>{currentWordIndex + 1} / {roundWords.length}</div>
              <div className={`${themeClasses.textSecondary} text-sm font-medium`}>Seri: {streak}</div>
              {/* Tema Seçimi */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTheme('classic')}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${theme === 'classic' ? 'bg-gray-800 border-cyan-400' : 'bg-gray-600 border-gray-300'}`}
                  title="Klasik Tema"
                />
                <button
                  onClick={() => setTheme('blue')}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${theme === 'blue' ? 'bg-blue-500 border-blue-600' : 'bg-blue-300 border-blue-400'}`}
                  title="Mavi Tema"
                />
                <button
                  onClick={() => setTheme('pink')}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${theme === 'pink' ? 'bg-pink-400 border-pink-600' : 'bg-pink-300 border-pink-400'}`}
                  title="Pembe Tema"
                />
              </div>
          </div>

          {/* Kart */}
          <motion.div 
            key={currentWordIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${themeClasses.cardBg} rounded-2xl shadow-xl border ${themeClasses.border} p-6 md:p-8`}
          >
            {/* Kelime */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentWord.headword}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="text-center mb-8"
                >
                    <h3 className={`text-5xl md:text-6xl lg:text-7xl font-black text-center ${themeClasses.textDark} mb-4`} style={{ textShadow: theme === 'classic' ? '0 0 20px rgba(6, 182, 212, 0.3)' : theme === 'pink' ? '0 0 20px rgba(236, 72, 153, 0.3)' : '0 0 20px rgba(59, 130, 246, 0.3)' }}>
                        {currentWord.headword}
                    </h3>
                    <p className={`text-xl md:text-2xl ${themeClasses.textSecondary} font-bold`}>
                        {currentWord.turkish}
                    </p>
                </motion.div>
            </AnimatePresence>

            {/* Butonlar */}
            <div className="flex items-center justify-center gap-5 mb-6">
              <motion.button
                onClick={() => speak(currentWord.headword)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`p-5 rounded-2xl ${themeClasses.cardBg} border-2 ${themeClasses.border} ${themeClasses.textSecondary} hover:shadow-xl transition-all duration-300 shadow-lg backdrop-blur-sm`}
                title="Kelimeyi dinle"
              >
                <Volume2 className="w-7 h-7" />
              </motion.button>

              <motion.button
                onClick={startListening}
                disabled={isListening}
                whileHover={!isListening ? { scale: 1.1 } : {}}
                whileTap={!isListening ? { scale: 0.95 } : {}}
                className={`p-6 rounded-2xl text-white transition-all duration-300 shadow-2xl border-2 ${
                  isListening 
                    ? 'bg-red-500 border-red-400 animate-pulse scale-110' 
                    : `${theme === 'classic' ? 'bg-gradient-to-br from-cyan-500 to-blue-600 border-cyan-400 hover:from-cyan-600 hover:to-blue-700' : theme === 'pink' ? 'bg-gradient-to-br from-pink-500 to-rose-600 border-pink-400 hover:from-pink-600 hover:to-rose-700' : 'bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-400 hover:from-blue-600 hover:to-indigo-700'}`
                }`}
                title="Telaffuz et"
              >
                <Mic className="w-9 h-9" />
              </motion.button>

              <motion.button
                onClick={nextWord}
                disabled={isListening}
                whileHover={!isListening ? { scale: 1.1 } : {}}
                whileTap={!isListening ? { scale: 0.95 } : {}}
                className={`p-5 rounded-2xl ${themeClasses.cardBg} border-2 ${themeClasses.border} ${themeClasses.textSecondary} hover:shadow-xl transition-all duration-300 shadow-lg backdrop-blur-sm ${isListening ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Sonraki kelime"
              >
                <ChevronRight className="w-7 h-7" />
              </motion.button>
            </div>

            {/* Geri bildirim */}
            <div className="h-12 flex items-center justify-center">
                <AnimatePresence>
                    {feedback && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className={`flex items-center gap-2 font-bold px-4 py-2 rounded-full text-base
                            ${feedback.isCorrect ? 'bg-green-500 text-white shadow-lg' : 'bg-red-500 text-white shadow-lg'}`}
                        >
                            {feedback.isCorrect ? <CheckCircle size={20} /> : <X size={20} />}
                            {feedback.message}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
          </motion.div>
      </div>
    </div>
  );
}
