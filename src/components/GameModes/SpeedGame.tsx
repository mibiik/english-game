import { useState, useEffect } from 'react';
import { Word } from '../../data/words';

interface SpeedGameProps {
  words: Word[];
  unit: string;
}

export function SpeedGame({ words, unit }: SpeedGameProps) {
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120); // 120 saniye
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [bonusPoints, setBonusPoints] = useState(0);

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

  const calculateBonusPoints = (currentStreak: number) => {
    if (currentStreak >= 5) return 5;
    if (currentStreak >= 3) return 3;
    return 1;
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(120);
    setIsPlaying(true);
    setStreak(0);
    setHighestStreak(0);
    setTotalAttempts(0);
    setBonusPoints(0);
    nextWord();
  };

  const nextWord = () => {
    const randomIndex = Math.floor(Math.random() * words.length);
    setCurrentWord(words[randomIndex]);
    setInput('');
    setShowCorrectAnswer(false);
    setIsCorrect(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPlaying || !currentWord) return;

    setTotalAttempts(prev => prev + 1);
    const userInput = input.toLowerCase().trim();
    const correctAnswer = currentWord.turkish.toLowerCase().trim();
    const isAnswerCorrect = userInput === correctAnswer || correctAnswer.includes(userInput) || userInput.includes(correctAnswer);
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setHighestStreak(Math.max(highestStreak, newStreak));
      const bonus = calculateBonusPoints(newStreak);
      setBonusPoints(prev => prev + bonus);
      setScore(prev => prev + bonus);
      
      setTimeout(() => {
        nextWord();
      }, 1000);
    } else {
      setStreak(0);
      setShowCorrectAnswer(true);
      setTimeout(() => {
        setShowCorrectAnswer(false);
      }, 2000);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl shadow-xl transform transition-all duration-300 hover:shadow-2xl border border-teal-100">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 text-transparent bg-clip-text animate-pulse">
            Skor: {score}
          </div>
          <div className="text-lg font-semibold text-teal-600 animate-bounce">
            Bonus: +{bonusPoints}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 text-transparent bg-clip-text animate-pulse">
            {timeLeft}s
          </div>
          <div className="text-lg font-semibold text-teal-600">
            Seri: {streak} 🔥
          </div>
        </div>
      </div>

      {!isPlaying ? (
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 text-transparent bg-clip-text mb-4 animate-pulse">
            Hız Oyunu
          </h2>
          <p className="text-teal-600 mb-6 font-semibold">
            En yüksek seri: {highestStreak} 🏆
          </p>
          <button
            onClick={startGame}
            className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl
              transform transition-all duration-300 hover:scale-105 hover:shadow-lg
              active:scale-95 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50
              text-xl font-bold backdrop-blur-sm"
          >
            Oyunu Başlat
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-md transform transition-all duration-300 hover:shadow-lg border border-teal-100">
            <div className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
              {currentWord?.english}
            </div>
            {streak >= 3 && (
              <div className="absolute top-2 right-2 animate-pulse">
                <span className="text-sm font-semibold text-teal-600 animate-bounce">
                  {streak >= 5 ? '+5' : '+3'} bonus!
                </span>
              </div>
            )}
          </div>

          {isCorrect !== null && (
            <div className={`text-center transition-all duration-300 ${isCorrect ? 'animate-bounce' : 'animate-shake'}`}>
              {isCorrect ? (
                <div className="text-green-500 font-bold text-2xl">DOĞRU! 🎉</div>
              ) : (
                <div className="space-y-2">
                  <div className="text-red-500 font-bold text-xl">Yanlış</div>
                  {showCorrectAnswer && (
                    <div className="text-green-600 font-semibold">
                      Doğru cevap: {currentWord?.turkish}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(score / (totalAttempts || 1)) * 100}%` }}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full p-4 border-2 rounded-xl
                border-teal-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50
                transform transition-all duration-300 hover:shadow-md
                text-lg placeholder-teal-400 bg-white/80 backdrop-blur-sm"
              placeholder="Türkçe çevirisini yazın..."
              autoFocus
            />
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl
                  transform transition-all duration-300 hover:scale-105 hover:shadow-lg
                  active:scale-95 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50
                  text-lg font-semibold backdrop-blur-sm"
              >
                Gönder
              </button>
              <button
                type="button"
                onClick={nextWord}
                className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl
                  transform transition-all duration-300 hover:scale-105 hover:shadow-lg
                  active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50
                  text-lg font-semibold backdrop-blur-sm"
              >
                Pas Geç
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}