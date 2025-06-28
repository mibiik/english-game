import React, { useState, useEffect, useRef, useCallback } from 'react';
import { WordDetail } from '../../data/words';
import { wordTracker } from '../../data/wordTracker';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Flame, Award, BarChart2, CheckCircle, XCircle, Clock } from 'lucide-react';

interface SpeedGameProps {
  words: WordDetail[];
  unit: string;
}

const MAX_TIME = 60; // saniye
const COMBO_FOR_FIRE_MODE = 5;
const TIME_BONUS_PER_CORRECT = 1; // saniye

export function SpeedGame({ words, unit }: SpeedGameProps) {
  const [currentWord, setCurrentWord] = useState<WordDetail | null>(null);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    () => Number(localStorage.getItem('speedGameHighScore') || '0')
  );
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(MAX_TIME);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect', message: string } | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('speedGameHighScore', score.toString());
    }
  }, [score, highScore]);

  const generateNewWord = useCallback(() => {
    wordTracker.initializeUnit(words, unit);
    const newWord = wordTracker.getNextWord(words, unit);
    if (!newWord) {
      // Kelime havuzu bitti, oyunu bitir
      setTimeLeft(0);
      return;
    };
    wordTracker.markWordAsSeen(newWord);
    setCurrentWord(newWord);
    setUserInput('');
    setFeedback(null);
  }, [words, unit]);

  const startGame = useCallback(() => {
    setScore(0);
    setCombo(0);
    setTimeLeft(MAX_TIME);
    setGameOver(false);
    setIsGameActive(true);
    generateNewWord();
    inputRef.current?.focus();
  }, [generateNewWord]);

  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft <= 0 && isGameActive) {
      setGameOver(true);
      setIsGameActive(false);
    }
  }, [isGameActive, timeLeft]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentWord || !isGameActive) return;

    const answer = userInput.trim().toLowerCase();
    const isCorrect = answer === currentWord.turkish.toLowerCase();

    if (isCorrect) {
      const isFireMode = combo >= COMBO_FOR_FIRE_MODE;
      const points = isFireMode ? 25 : 10;
      setScore(prev => prev + points);
      setCombo(prev => prev + 1);
      setTimeLeft(prev => Math.min(MAX_TIME, prev + TIME_BONUS_PER_CORRECT));
      setFeedback({ type: 'correct', message: `+${points} Puan! +${TIME_BONUS_PER_CORRECT}sn` });
    } else {
      setCombo(0);
      setFeedback({ type: 'incorrect', message: `Doğru: ${currentWord.turkish}` });
    }
    
    setTimeout(generateNewWord, 500);
  };

  const isFireMode = combo >= COMBO_FOR_FIRE_MODE;

  if (!isGameActive && !gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-250px)] bg-gray-900 text-white p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-gray-800 p-10 rounded-2xl shadow-2xl border border-gray-700"
        >
          <h1 className="text-5xl font-extrabold mb-2 text-cyan-400">Hız Oyunu</h1>
          <p className="text-gray-400 mb-6">Süre dolmadan olabildiğince çok kelimeyi doğru yaz!</p>
          <button
            onClick={startGame}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-xl font-bold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/30 active:scale-95"
          >
            Oyunu Başlat
          </button>
          <div className="mt-6 text-lg text-amber-400 font-semibold">
            <Award className="inline-block w-6 h-6 mr-2" />
            En Yüksek Skor: {highScore}
          </div>
        </motion.div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-250px)] bg-gray-900 text-white p-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-700"
        >
          <h2 className="text-4xl font-bold mb-4 text-red-500">Süre Doldu!</h2>
          <div className="text-6xl font-extrabold text-cyan-400 mb-6">{score}</div>
          {score === highScore && score > 0 && <p className="text-amber-400 mb-4 text-xl animate-pulse">Yeni Yüksek Skor!</p>}
          <button onClick={startGame} className="w-full py-3 mb-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-lg font-bold shadow-lg hover:scale-105 transition-transform">
            Tekrar Oyna
          </button>
          <div className="text-left text-gray-300">
            <p><strong>Eski Yüksek Skor:</strong> {highScore}</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] bg-gray-900 text-white p-4 font-sans relative overflow-hidden">
        {isFireMode && <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-orange-500/20 to-yellow-500/20 animate-pulse pointer-events-none"></div>}
      <div className="w-full max-w-2xl mx-auto relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-3xl font-bold text-cyan-400">Skor: {score}</div>
          <div className={`flex items-center gap-2 text-2xl font-bold ${isFireMode ? 'text-orange-400' : 'text-gray-400'}`}>
            <Flame className={`transition-colors ${isFireMode ? 'text-orange-400 animate-bounce' : ''}`} />
            {combo}
          </div>
          <div className="text-lg text-amber-400"><Award className="inline-block w-5 h-5 mr-1" /> {highScore}</div>
        </div>

        {/* Time Bar */}
        <div className="w-full bg-gray-700 rounded-full h-4 mb-6 border border-gray-600">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${timeLeft > 10 ? 'from-green-400 to-cyan-400' : 'from-yellow-400 to-red-500'}`}
            initial={{ width: '100%' }}
            animate={{ width: `${(timeLeft / MAX_TIME) * 100}%` }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </div>
        <div className="absolute top-[80px] right-0 text-2xl font-bold">{timeLeft}s</div>

        {/* Game Area */}
        <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700 text-center">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentWord?.headword}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                >
                    <div className="text-6xl font-extrabold tracking-wide text-white mb-8" style={{ textShadow: "0 0 20px rgba(255,255,255,0.3)" }}>
                        {currentWord?.headword}
                    </div>
                </motion.div>
            </AnimatePresence>
            <form onSubmit={handleSubmit}>
                <input
                    ref={inputRef}
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Hızlıca yaz..."
                    className="w-full p-4 text-center text-xl bg-gray-900 border-2 border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                    autoFocus
                    autoComplete="off"
                />
            </form>
            <div className="h-12 mt-4 flex items-center justify-center">
                <AnimatePresence>
                    {feedback && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`flex items-center gap-2 text-lg font-semibold px-4 py-2 rounded-lg
                                ${feedback.type === 'correct' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}
                        >
                            {feedback.type === 'correct' ? <CheckCircle /> : <XCircle />}
                            {feedback.message}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
      </div>
    </div>
  );
}