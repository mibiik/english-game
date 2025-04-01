import React, { useState, useEffect } from 'react';
import { Word } from '../../data/words';

interface SpeedGameProps {
  words: Word[];
  unit: string;
}

export function SpeedGame({ words, unit }: SpeedGameProps) {
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [unitWords, setUnitWords] = useState<Word[]>([]);

  useEffect(() => {
    setUnitWords(words);
  }, [words]);

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
    }
  }, [isPlaying, timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setIsPlaying(true);
    nextWord();
  };

  const nextWord = () => {
    const randomIndex = Math.floor(Math.random() * words.length);
    setCurrentWord(words[randomIndex]);
    setInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPlaying || !currentWord) return;

    if (input.toLowerCase() === currentWord.turkish.toLowerCase()) {
      setScore(score + 1);
    }
    nextWord();
  };

  return (
    <div className="p-4 sm:p-4 md:p-6 bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
      <div className="flex justify-between mb-4 sm:mb-4">
        <div className="text-2xl sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
          Skor: {score}
        </div>
        <div className="text-2xl sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
          Süre: {timeLeft}s
        </div>
      </div>

      {!isPlaying ? (
        <button
          onClick={startGame}
          className="w-full py-4 sm:py-3 md:py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg
            transform transition-all duration-300 hover:scale-105 hover:shadow-lg
            active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 text-lg sm:text-base md:text-lg"
        >
          Oyunu Başlat
        </button>
      ) : (
        <div>
          <div className="text-3xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-6 md:mb-8 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            {currentWord?.english}
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full p-4 sm:p-3 md:p-4 border-2 rounded-lg mb-4 sm:mb-3 md:mb-4 transition-all duration-300
                border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
                transform hover:scale-102 text-lg sm:text-base md:text-lg"
              placeholder="Türkçe çevirisini yazın..."
              autoFocus
            />
            <button
              type="submit"
              className="w-full py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg
                transform transition-all duration-300 hover:scale-105 hover:shadow-lg
                active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 text-sm sm:text-base md:text-lg"
            >
              Gönder
            </button>
          </form>
        </div>
      )}
    </div>
  );
}