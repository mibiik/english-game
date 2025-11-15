import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, CheckCircle, XCircle, ChevronLeft } from 'lucide-react';
import { WordDetail } from '../../data/intermediate';
import { motion, AnimatePresence } from 'framer-motion';
import { gameStateManager } from '../../lib/utils';
import { updateWordDifficulty } from '../../data/difficultWords';
import { learningStatsTracker } from '../../data/learningStats';
import { Timer, Target, RotateCcw, CheckCircle as CheckCircleIcon, X } from 'lucide-react';
import { supabaseGameScoreService } from '../../services/supabaseGameScoreService';
import { awardPoints } from '../../services/scoreService';
import { soundService } from '../../services/soundService';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface WordRaceProps {
  words: WordDetail[];
}

interface GameState {
  currentWordIndex: number;
  userInput: string;
  score: number;
  correctCount: number;
  incorrectCount: number;
  timeLeft: number;
  isGameActive: boolean;
  gameCompleted: boolean;
  feedback: { message: string; isCorrect: boolean } | null;
  usedWords: WordDetail[];
  streak: number;
}

const RACE_DURATION = 90; // saniye
const WORDS_IN_RACE = 30; // Yarıştaki toplam kelime sayısı

export function WordRace({ words }: WordRaceProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentUnit = searchParams.get('unit') || '1';
  const currentLevel = searchParams.get('level') || 'intermediate';
  const [raceWords, setRaceWords] = useState<WordDetail[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(RACE_DURATION);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);
  const [usedWords, setUsedWords] = useState<WordDetail[]>([]);
  const [streak, setStreak] = useState(0);
  const [theme, setTheme] = useState<'blue' | 'pink' | 'classic'>('blue');

  // Oyun anahtarı
  const GAME_KEY = 'wordRace';

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Sayfa açıldığında en üste kaydır
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  useEffect(() => {
    if (words.length > 0) {
      const shuffled = [...words].sort(() => 0.5 - Math.random());
      setRaceWords(shuffled.slice(0, WORDS_IN_RACE));
    }
  }, [words]);

  // Oyunu otomatik başlat
  useEffect(() => {
    if (raceWords.length > 0 && !isGameActive && !gameCompleted) {
      gameStateManager.clearGameState(GAME_KEY);
      setCurrentWordIndex(0);
      setScore(0);
      setTimeLeft(RACE_DURATION);
      setCorrectCount(0);
      setIncorrectCount(0);
      setGameCompleted(false);
      setIsGameActive(true);
      setUserInput('');
      setFeedback(null);
      setUsedWords([]);
      setStreak(0);
    }
  }, [raceWords.length, isGameActive, gameCompleted, GAME_KEY]);

  const startGame = useCallback(() => {
    gameStateManager.clearGameState(GAME_KEY); // Yeni oyun başlarken state'i temizle
    setCurrentWordIndex(0);
    setScore(0);
    setTimeLeft(RACE_DURATION);
    setCorrectCount(0);
    setIncorrectCount(0);
    setGameCompleted(false);
    setIsGameActive(true);
    setUserInput('');
    setFeedback(null);
    setUsedWords([]);
    setStreak(0);
  }, [GAME_KEY]);

  // İlk yükleme - localStorage'dan state'i kontrol et
  useEffect(() => {
    if (words.length > 0) {
      const savedState = gameStateManager.loadGameState(GAME_KEY) as GameState | null;
      if (savedState && savedState.usedWords.length > 0) {
        // Kaydedilmiş oyun var, yükle
        setCurrentWordIndex(savedState.currentWordIndex);
        setUserInput(savedState.userInput);
        setScore(savedState.score);
        setCorrectCount(savedState.correctCount);
        setIncorrectCount(savedState.incorrectCount);
        setTimeLeft(savedState.timeLeft);
        setIsGameActive(savedState.isGameActive);
        setGameCompleted(savedState.gameCompleted);
        setFeedback(savedState.feedback);
        setUsedWords(savedState.usedWords);
        setStreak(savedState.streak || 0);
        
        // Eğer oyun aktifse timer'ı yeniden başlat
        if (savedState.isGameActive && savedState.timeLeft > 0) {
          // Timer'ı başlat
          timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
              if (prev <= 1) {
                setGameCompleted(true);
                setIsGameActive(false);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
      }
    }
  }, [words, GAME_KEY]);

  // Her state değişikliğinde localStorage'a kaydet
  useEffect(() => {
    if (words.length > 0 && (isGameActive || gameCompleted)) {
      const gameState: GameState = {
        currentWordIndex,
        userInput,
        score,
        correctCount,
        incorrectCount,
        timeLeft,
        isGameActive,
        gameCompleted,
        feedback,
        usedWords,
        streak
      };
      gameStateManager.saveGameState(GAME_KEY, gameState);
    }
  }, [currentWordIndex, userInput, score, correctCount, incorrectCount, timeLeft, isGameActive, gameCompleted, feedback, usedWords, streak, words.length, GAME_KEY]);

  useEffect(() => {
    if(isGameActive) {
      window.scrollTo(0, 0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isGameActive, currentWordIndex]);

  const endGame = useCallback(() => {
    setGameCompleted(true);
    setIsGameActive(false);
    
    // Oyun bitti, skoru kaydet
    const unit = raceWords[0]?.unit || '1';
    try {
      supabaseGameScoreService.saveScore('word-race', score, unit);
    } catch (error) {
      console.error('Skor kaydedilirken hata:', error);
    }
  }, [score, raceWords]);

  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft <= 0 && isGameActive) {
      endGame();
    }
  }, [isGameActive, timeLeft, endGame]);

  const nextWord = useCallback(() => {
    if (currentWordIndex + 1 >= raceWords.length) {
        endGame();
        return;
    }
    setFeedback(null);
    setCurrentWordIndex(prev => prev + 1);
    setUserInput('');
    setStreak(0);
  }, [currentWordIndex, raceWords.length, endGame]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isGameActive || !raceWords[currentWordIndex]) return;

    const currentWord = raceWords[currentWordIndex];
    const answer = userInput.trim().toLowerCase();
    const isCorrect = answer === currentWord.headword.toLowerCase();

    if (isCorrect) {
      setScore(prev => prev + 2);
      setCorrectCount(prev => prev + 1);
      setStreak(prev => prev + 1);
      setFeedback({ message: `+2`, isCorrect: true });
      const bonus = Math.min(streak, 2); // Maksimum 2 bonus puan
      awardPoints('word-race', 2 + bonus, raceWords[0]?.unit || '1');
      soundService.playCorrect();
      setTimeout(nextWord, 500);
    } else {
      setScore(prev => prev - 2);
      setStreak(0);
      awardPoints('word-race', -2, raceWords[0]?.unit || '1');
      setFeedback({ message: `-2 | Doğru: ${currentWord.headword}`, isCorrect: false });
      soundService.playWrong();
      setTimeout(nextWord, 1300);
    }
  };
  
  const timePercentage = (timeLeft / RACE_DURATION) * 100;
  
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
  
  // Güvenli erişim
  if (raceWords.length === 0) {
    return <div className={`flex items-start justify-center min-h-screen w-full ${themeClasses.bg} p-4 pt-8 ${themeClasses.text}`}>Yarış için kelimeler hazırlanıyor...</div>;
  }

  const currentWord = raceWords[currentWordIndex];

  // Oyun bitti ekranı
  if (gameCompleted && !isGameActive) {
    return (
      <div className={`flex items-start justify-center min-h-screen w-full ${themeClasses.bg} p-4 pt-8`}>
        <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={`text-center ${themeClasses.cardBg} rounded-2xl shadow-2xl w-full max-w-md border ${themeClasses.border} p-8`}
        >
          <h2 className={`text-4xl font-black mb-4 ${themeClasses.textSecondary}`}>Yarış Bitti!</h2>
          <div className={`p-4 rounded-xl mb-6 border ${theme === 'classic' ? 'bg-gray-800/50 border-gray-700' : theme === 'pink' ? 'bg-gradient-to-r from-pink-50 to-rose-50 border-pink-100' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100'}`}>
            <p className={`text-3xl font-bold ${themeClasses.textDark}`}>{score}</p>
            <p className={`mt-2 ${themeClasses.text}`}>{correctCount} doğru kelime</p>
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
              Tekrar Yarış
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`flex items-start justify-center min-h-screen p-1 sm:p-2 md:p-4 ${themeClasses.bg} pt-8 md:pt-12`}>
      <div className="w-full max-w-lg mx-auto relative">
          {/* Süre Çubuğu */}
          <div className={`w-full ${themeClasses.cardBg} rounded-full h-3 mb-4 border ${themeClasses.border} shadow-sm`}>
            <motion.div
              className={`h-full rounded-full ${themeClasses.progress}`}
              initial={{ width: '100%' }}
              animate={{ width: `${timePercentage}%` }}
              transition={{ duration: 1, ease: 'linear' }}
            />
          </div>

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
              <div className={`${themeClasses.textSecondary} text-sm font-medium`}>{correctCount} / {WORDS_IN_RACE}</div>
              <div className={`font-bold text-xl ${themeClasses.textDark}`}>{timeLeft}s</div>
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
                    key={currentWord.turkish}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    <h3 className={`text-4xl md:text-5xl font-black text-center ${themeClasses.textDark} mb-4`}>
                        {currentWord.turkish}
                    </h3>
                </motion.div>
            </AnimatePresence>

            {/* İpucu */}
            {currentWord.headword && currentWord.headword.length > 0 && (
              <p className={`text-center text-sm ${themeClasses.textSecondary} font-semibold mb-4`}>
                İpucu: {currentWord.headword[0].toUpperCase()}...{currentWord.headword[currentWord.headword.length - 1].toUpperCase()}
              </p>
            )}

            {/* Geri bildirim */}
            <div className="h-10 flex items-center justify-center mb-4">
                <AnimatePresence>
                    {feedback && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className={`flex items-center gap-2 font-bold px-4 py-2 rounded-full text-base
                            ${feedback.isCorrect ? 'bg-green-500 text-white shadow-lg' : 'bg-red-500 text-white shadow-lg'}`}
                        >
                            {feedback.isCorrect ? <CheckCircleIcon size={20} /> : <X size={20} />}
                            {feedback.message}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            {/* Giriş Alanı */}
            <form onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="İngilizce kelimeyi yaz..."
                className={`w-full p-4 text-center text-xl ${themeClasses.inputBg} border-2 ${themeClasses.inputBorder} rounded-xl ${themeClasses.textDark} ${themeClasses.placeholder} focus:outline-none focus:ring-4 transition-all font-semibold shadow-sm`}
                autoFocus
                autoComplete="off"
              />
            </form>
          </motion.div>
      </div>
    </div>
  );
}