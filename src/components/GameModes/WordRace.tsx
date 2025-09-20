import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, CheckCircle, XCircle } from 'lucide-react';
import { WordDetail } from '../../data/words';
import { motion, AnimatePresence } from 'framer-motion';
import { gameStateManager } from '../../lib/utils';
import { updateWordDifficulty } from '../../data/difficultWords';
import { learningStatsTracker } from '../../data/learningStats';
import { Timer, Target, RotateCcw, CheckCircle as CheckCircleIcon, X } from 'lucide-react';
import { supabaseGameScoreService } from '../../services/supabaseGameScoreService';
import { awardPoints } from '../../services/scoreService';
import { soundService } from '../../services/soundService';

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

  // Oyun anahtarı
  const GAME_KEY = 'wordRace';

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (words.length > 0) {
      const shuffled = [...words].sort(() => 0.5 - Math.random());
      setRaceWords(shuffled.slice(0, WORDS_IN_RACE));
    }
  }, [words]);

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
      inputRef.current?.focus();
      window.scrollTo(0, 0);
    }
  }, [isGameActive]);

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
    const isCorrect = answer === currentWord.turkish.toLowerCase();

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
      setFeedback({ message: `-2 | Doğru: ${currentWord.turkish}`, isCorrect: false });
      soundService.playWrong();
      setTimeout(nextWord, 1300);
    }
  };
  
  const timePercentage = (timeLeft / RACE_DURATION) * 100;
  
  // Güvenli erişim
  if (raceWords.length === 0) {
    // Kelimeler henüz yüklenmediyse bir yükleme durumu gösterilebilir
    return <div className="flex items-center justify-center min-h-screen w-full bg-gray-900 text-white p-4" style={{ paddingTop: '64px', marginTop: '-128px' }}>Yarış için kelimeler hazırlanıyor...</div>;
  }

  const currentWord = raceWords[currentWordIndex];

  // Ana Ekran ve Oyun Bitiş Ekranı
  if (!isGameActive) {
      return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-900 text-white p-4" style={{ paddingTop: '64px', marginTop: '-128px' }}>
        <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="text-center bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-purple-500/20 w-full max-w-md"
        >
          <Trophy className="w-16 h-16 mx-auto text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)] mb-4" />
          <h2 className="text-4xl font-extrabold text-white mb-2">Kelime Yarışı</h2>
          {gameCompleted ? (
            <>
              <p className="text-lg text-gray-300 mt-4">Yarış bitti!</p>
              <p className="text-5xl font-bold my-4 text-purple-400">{score}</p>
              <div className="text-gray-400">
                {correctCount} doğru kelime ile yarışı tamamladın.
              </div>
            </>
          ) : (
            <div className="text-gray-400 my-6 space-y-2">
              <p>Ekrana gelen kelimenin Türkçe karşılığını yaz.</p>
              <p>Süren dolmadan en yüksek puanı topla!</p>
            </div>
          )}
          <button onClick={startGame} className="mt-8 w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl text-xl font-bold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/30 active:scale-95">
            {gameCompleted ? 'Tekrar Yarış' : 'Yarışı Başlat'}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-900 text-white p-4 font-sans" style={{ paddingTop: '64px', marginTop: '-128px' }}>
      <div className="w-full max-w-lg">
          {/* Süre Çubuğu */}
          <div className="w-full bg-gray-700/50 rounded-full h-3 mb-4 border border-gray-600">
            <motion.div
              className="h-full rounded-full"
              style={{
                  background: `linear-gradient(90deg, ${
                  timePercentage > 50 ? 'rgb(74 222 128)' : timePercentage > 20 ? 'rgb(250 204 21)' : 'rgb(239 68 68)'
                  }, ${
                  timePercentage > 50 ? 'rgb(34 197 94)' : timePercentage > 20 ? 'rgb(234 179 8)' : 'rgb(220 38 38)'
                  })`
              }}
              initial={{ width: '100%' }}
              animate={{ width: `${timePercentage}%` }}
              transition={{ duration: 1, ease: 'linear' }}
            />
          </div>

          {/* Kart */}
          <motion.div 
            key={currentWordIndex}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-purple-500/20"
          >
            {/* HUD */}
            <div className="flex justify-between items-center text-lg text-gray-300 mb-8">
                <div>Skor: <span className="font-bold text-xl text-white">{score}</span></div>
                <div>{correctCount} / {WORDS_IN_RACE}</div>
                <div className="font-bold text-xl text-white">{timeLeft}s</div>
            </div>
            
            {/* Kelime */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentWord.headword}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                >
                    <h3 className="text-5xl md:text-6xl font-extrabold text-center text-white" style={{textShadow: '0 0 15px rgba(255,255,255,0.2)'}}>
                        {currentWord.headword}
                    </h3>
                </motion.div>
            </AnimatePresence>

            <p className="text-center text-purple-300/80 my-4 text-md">Türkçe karşılığını yaz</p>

            {/* Geri bildirim */}
            <div className="h-10 flex items-center justify-center">
                <AnimatePresence>
                    {feedback && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className={`flex items-center gap-2 font-semibold px-4 py-2 rounded-full text-lg
                            ${feedback.isCorrect ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}
                        >
                            {feedback.isCorrect ? <CheckCircleIcon size={20} /> : <X size={20} />}
                            {feedback.message}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            {/* Giriş Alanı */}
            <form onSubmit={handleSubmit} className="mt-4">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="..."
                className="w-full p-4 text-center text-2xl bg-gray-900/50 border-2 border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                autoFocus
                autoComplete="off"
              />
            </form>
          </motion.div>
      </div>
    </div>
  );
}