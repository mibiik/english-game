import React, { useState, useEffect } from 'react';
import { Word } from '../../data/words';
import { GameModal } from './GameModal';

interface WordHuntGameProps {
  words: Word[];
  unit: string;
}

export function WordHuntGame({ words, unit }: WordHuntGameProps) {
  const [gameWords, setGameWords] = useState<Word[]>([]);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const filteredWords = words.filter(word => word.unit === unit);
    setGameWords(filteredWords);
  }, [unit, words]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isPlaying) {
      endGame();
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setIsPlaying(true);
    setFoundWords([]);
    setStreak(0);
    nextWord();
  };

  const endGame = () => {
    setIsPlaying(false);
    if (score > bestScore) {
      setBestScore(score);
    }
  };

  const nextWord = () => {
    const remainingWords = gameWords.filter(word => !foundWords.includes(word.english));
    if (remainingWords.length === 0) {
      endGame();
      return;
    }
    const randomIndex = Math.floor(Math.random() * remainingWords.length);
    setCurrentWord(remainingWords[randomIndex]);
    setInput('');
    setShowHint(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPlaying || !currentWord) return;

    const isCorrect = input.toLowerCase().trim() === currentWord.turkish.toLowerCase().trim();

    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft / 10);
      const streakBonus = Math.floor(streak / 2);
      const points = 10 + timeBonus + streakBonus;
      
      setScore(score + points);
      setStreak(prev => prev + 1);
      setFoundWords([...foundWords, currentWord.english]);
      nextWord();
    } else {
      setStreak(0);
      setScore(prev => Math.max(0, prev - 5));
    }
  };

  const handleSkip = () => {
    if (!isPlaying || !currentWord) return;
    setStreak(0);
    setScore(prev => Math.max(0, prev - 3));
    nextWord();
  };

  const handleHint = () => {
    if (!isPlaying || !currentWord) return;
    setScore(prev => Math.max(0, prev - 2));
    setShowHint(true);
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg border border-blue-100">
      <GameModal
        isOpen={!isPlaying && showModal}
        onClose={() => setShowModal(false)}
        onStart={() => {
          setShowModal(false);
          startGame();
        }}
        title="Kelime Avı"
        description="60 saniye içinde İngilizce kelimelerin Türkçe karşılıklarını doğru bir şekilde yazın! Her doğru cevap için puan kazanın. Streak bonusu ve kalan süre bonusu ile puanınızı katlayın. İpucu kullanabilir veya zor kelimeleri atlayabilirsiniz, ancak bunlar puanınızı düşürür."
        icon="🎯"
      />
      {!isPlaying && !showModal ? (
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            Kelime Avı
          </h2>
          {bestScore > 0 && (
            <p className="text-lg font-medium text-purple-600">
              En Yüksek Puan: {bestScore}
            </p>
          )}
          <button
            onClick={() => {
              setShowModal(true);
            }}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg
              transform transition-all duration-300 hover:scale-105 hover:shadow-lg
              active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          >
            Oyunu Başlat
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <div className="text-2xl font-bold text-blue-800">
                Puan: {score}
              </div>
              <div className="text-sm font-medium text-purple-600">
                Streak: {streak} 🔥
              </div>
            </div>
            <div className="text-2xl font-bold text-purple-800">
              {timeLeft}s
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-blue-200">
            <div className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              {currentWord?.english}
            </div>
            {showHint && (
              <div className="text-sm text-center text-purple-600 mb-4">
                İpucu: {currentWord?.turkish.slice(0, 2)}...
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full p-4 border-2 rounded-lg
                  border-blue-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
                  transform transition-all duration-300"
                placeholder="Türkçe çevirisini yazın..."
                autoFocus
              />
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg
                    transform transition-all duration-300 hover:scale-105 hover:shadow-lg
                    active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                >
                  Gönder
                </button>
                <button
                  type="button"
                  onClick={handleHint}
                  className="px-4 py-3 bg-purple-100 text-purple-700 rounded-lg
                    transform transition-all duration-300 hover:bg-purple-200
                    active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                  disabled={showHint}
                >
                  İpucu (-2 puan)
                </button>
                <button
                  type="button"
                  onClick={handleSkip}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg
                    transform transition-all duration-300 hover:bg-gray-200
                    active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                >
                  Geç (-3 puan)
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md border border-blue-200">
            <h3 className="text-lg font-medium text-blue-800 mb-3">Bulunan Kelimeler:</h3>
            <div className="flex flex-wrap gap-2">
              {foundWords.map((word, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}