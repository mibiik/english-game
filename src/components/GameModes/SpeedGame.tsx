import React, { useState, useEffect } from 'react';
import { Word } from '../../data/words';
import { wordTracker } from '../../data/wordTracker';

interface SpeedGameProps {
  words: Word[];
  unit: string;
}

export function SpeedGame({ words, unit }: SpeedGameProps) {
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
      setIsGameActive(false);
    }
  }, [isGameActive, timeLeft]);

  const startGame = () => {
    setScore(0);
    setCombo(0);
    setBestCombo(0);
    setTotalAttempts(0);
    setCorrectAttempts(0);
    setTimeLeft(60);
    setGameOver(false);
    setIsGameActive(true);
    generateNewWord();
  };

  const generateNewWord = () => {
    wordTracker.initializeUnit(words, unit);
    const newWord = wordTracker.getNextWord(words, unit);
    if (!newWord) return;

    wordTracker.markWordAsSeen(newWord);
    setCurrentWord(newWord);
    setUserInput('');
    setShowFeedback(false);
    setIsCorrect(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentWord || !isGameActive) return;

    const answer = userInput.trim().toLowerCase();
    const correct = answer === currentWord.turkish.toLowerCase();

    setTotalAttempts(prev => prev + 1);
    setShowFeedback(true);
    setIsCorrect(correct);

    if (correct) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      setBestCombo(prev => Math.max(prev, newCombo));
      setCorrectAttempts(prev => prev + 1);
      setScore(prev => prev + (10 + Math.floor(newCombo / 3)));

      setTimeout(() => {
        generateNewWord();
      }, 1000);
    } else {
      setCombo(0);
      setTimeout(() => {
        generateNewWord();
      }, 2000);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl border border-blue-100">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="text-3xl sm:text-2xl font-bold text-blue-800">
              Skor: {score}
            </div>
            <div className="text-base sm:text-sm font-medium">
              <span className="text-blue-600">Combo: {combo} 🔥</span>
              <span className="mx-2 text-gray-400">|</span>
              <span className="text-indigo-600">En İyi Combo: {bestCombo}</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-red-600 animate-pulse">
            {timeLeft}s
          </div>
        </div>

        {!isGameActive && !gameOver && (
          <button
            onClick={startGame}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl
              text-xl font-bold shadow-lg transform transition-all duration-300
              hover:scale-105 hover:shadow-xl active:scale-95"
          >
            Oyunu Başlat
          </button>
        )}

        {isGameActive && currentWord && (
          <div className="bg-white p-8 rounded-xl shadow-lg border border-blue-50">
            <div className="text-4xl sm:text-3xl font-bold text-center mb-8
              bg-gradient-to-r from-blue-600 to-indigo-600
              text-transparent bg-clip-text animate-pulse">
              {currentWord.english}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={userInput}
                onChange={handleInputChange}
                placeholder="Türkçe karşılığını yazın..."
                className="w-full p-4 text-lg border-2 border-blue-200 rounded-xl
                  focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none
                  transition-all duration-300"
                autoFocus
              />
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500
                  text-white rounded-xl text-lg font-semibold shadow-md
                  transform transition-all duration-300
                  hover:scale-102 hover:shadow-lg active:scale-98"
              >
                Kontrol Et
              </button>
            </form>

            {showFeedback && (
              <div className={`mt-6 text-center text-lg font-medium
                ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {isCorrect
                  ? `Harika! +${10 + Math.floor(combo / 3)} puan kazandın!`
                  : `Yanlış! Doğru cevap: ${currentWord.turkish}`}
              </div>
            )}
          </div>
        )}

        {gameOver && (
          <div className="bg-white p-8 rounded-xl shadow-lg border border-blue-50">
            <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">Oyun Sonu Analizi</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Skor Detayları</h3>
                  <p className="text-blue-700">Toplam Skor: <span className="font-bold">{score}</span></p>
                  <p className="text-indigo-700">En İyi Combo: <span className="font-bold">{bestCombo}</span></p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Doğruluk Analizi</h3>
                  <p className="text-green-700">Doğru Kelimeler: <span className="font-bold">{correctAttempts}</span></p>
                  <p className="text-red-700">Yanlış Kelimeler: <span className="font-bold">{totalAttempts - correctAttempts}</span></p>
                  <p className="text-green-700">Doğruluk Oranı: <span className="font-bold">
                    {totalAttempts > 0 ? `${Math.round((correctAttempts / totalAttempts) * 100)}%` : '0%'}
                  </span></p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">Hız Analizi</h3>
                  <p className="text-purple-700">Kelime/Dakika: <span className="font-bold">
                    {Math.round((totalAttempts / 60) * 60)}
                  </span></p>
                  <p className="text-purple-700">Ortalama Süre: <span className="font-bold">
                    {totalAttempts > 0 ? `${Math.round(60 / totalAttempts)} saniye` : '0 saniye'}
                  </span></p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-orange-800 mb-2">Performans Özeti</h3>
                  <p className="text-orange-700">
                    {totalAttempts > 0 ? 
                      `${Math.round((correctAttempts / totalAttempts) * 100)}% doğruluk oranı ile dakikada ${Math.round((totalAttempts / 60) * 60)} kelime çözdünüz.` : 
                      'Henüz yeterli veri yok.'}
                    {bestCombo >= 5 && ' Etkileyici bir combo serisi yakaladınız!'}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Kelime İlerlemesi</h3>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-blue-600">
                      {(() => {
                        const progress = wordTracker.getProgress(unit);
                        return `${progress.seenCount}/${progress.totalCount} kelime görüldü (${progress.percentage}%)`;
                      })()}
                    </div>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${wordTracker.getProgress(unit).percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={startGame}
              className="mt-6 px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500
                text-white rounded-xl text-lg font-bold shadow-md
                transform transition-all duration-300
                hover:scale-105 hover:shadow-lg active:scale-95"
            >
              Tekrar Oyna
            </button>
          </div>
        )}

        {isGameActive && (
          <div className="text-center text-sm text-gray-600">
            Toplam Kelime: {totalAttempts} | Doğru: {correctAttempts} | 
            Doğruluk: {totalAttempts > 0
              ? `${Math.round((correctAttempts / totalAttempts) * 100)}%`
              : '0%'}
          </div>
        )}
      </div>
    </div>
  );
}