import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, CheckCircle, XCircle } from 'lucide-react';
import { WordDetail } from '../../data/words';
import { motion, AnimatePresence } from 'framer-motion';

interface WordRaceProps {
  words: WordDetail[];
}

const RACE_DURATION = 90; // saniye
const WORDS_IN_RACE = 30; // Yarıştaki toplam kelime sayısı

export function WordRace({ words }: WordRaceProps) {
  const [raceWords, setRaceWords] = useState<WordDetail[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(RACE_DURATION);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [correctWords, setCorrectWords] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect', message: string } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const startGame = useCallback(() => {
    const shuffledWords = [...words].sort(() => 0.5 - Math.random());
    setRaceWords(shuffledWords.slice(0, WORDS_IN_RACE * 2));
    setCurrentWordIndex(0);
    setScore(0);
    setTimeLeft(RACE_DURATION);
    setCorrectWords(0);
    setGameOver(false);
    setIsGameActive(true);
    setUserInput('');
    setFeedback(null);
  }, [words]);

  useEffect(() => {
    if(isGameActive) inputRef.current?.focus();
  }, [isGameActive]);

  const endGame = useCallback(() => {
    setGameOver(true);
    setIsGameActive(false);
  }, []);

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
  }, [currentWordIndex, raceWords.length, endGame]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isGameActive || !raceWords[currentWordIndex]) return;

    const currentWord = raceWords[currentWordIndex];
    const answer = userInput.trim().toLowerCase();
    const isCorrect = answer === currentWord.turkish.toLowerCase();

    if (isCorrect) {
      const points = 10 + Math.floor(timeLeft / 15);
      setScore(prev => prev + points);
      setCorrectWords(prev => prev + 1);
      setFeedback({ type: 'correct', message: `+${points}` });
      setTimeout(nextWord, 500);
    } else {
      setFeedback({ type: 'incorrect', message: `Doğru: ${currentWord.turkish}`});
      setTimeout(nextWord, 1300);
    }
  };
  
  const timePercentage = (timeLeft / RACE_DURATION) * 100;
  const currentWord = raceWords[currentWordIndex];

  // Ana Ekran ve Oyun Bitiş Ekranı
  if (!isGameActive) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-gray-900 text-white p-4">
        <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="text-center bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-purple-500/20 w-full max-w-md"
        >
          <Trophy className="w-16 h-16 mx-auto text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)] mb-4" />
          <h2 className="text-4xl font-extrabold text-white mb-2">Kelime Yarışı</h2>
          {gameOver ? (
            <>
              <p className="text-lg text-gray-300 mt-4">Yarış bitti!</p>
              <p className="text-5xl font-bold my-4 text-purple-400">{score}</p>
              <div className="text-gray-400">
                {correctWords} doğru kelime ile yarışı tamamladın.
              </div>
            </>
          ) : (
            <div className="text-gray-400 my-6 space-y-2">
              <p>Ekrana gelen kelimenin Türkçe karşılığını yaz.</p>
              <p>Süren dolmadan en yüksek puanı topla!</p>
            </div>
          )}
          <button onClick={startGame} className="mt-8 w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl text-xl font-bold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/30 active:scale-95">
            {gameOver ? 'Tekrar Yarış' : 'Yarışı Başlat'}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-900 text-white p-4 font-sans">
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
                <div>{correctWords} / {WORDS_IN_RACE}</div>
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
                            ${feedback.type === 'correct' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}
                        >
                            {feedback.type === 'correct' ? <CheckCircle size={20} /> : <XCircle size={20} />}
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