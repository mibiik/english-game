import React, { useState, useEffect } from 'react';
import { Word } from '../../data/words';
import { wordTracker } from '../../data/wordTracker';

interface QuizGameProps {
  words: Word[];
  unit: string;
  onUnitComplete?: (unit: string) => void;
}

export function QuizGame({ words, unit, onUnitComplete }: QuizGameProps) {
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showUnitComplete, setShowUnitComplete] = useState(false);

  useEffect(() => {
    startNewGame();
  }, [unit, words]);

  const startNewGame = () => {
    setScore(0);
    setTotalQuestions(0);
    setStreak(0);
    generateNewQuestion();
  };

  const generateNewQuestion = () => {
    wordTracker.initializeUnit(words, unit);
    const newWord = wordTracker.getNextWord(words, unit);
    if (!newWord) return;
    
    setCurrentWord(newWord);
    wordTracker.markWordAsSeen(newWord);

    const wrongOptions = filteredWords
      .filter(w => w.turkish !== newWord.turkish)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.turkish);

    const allOptions = [...wrongOptions, newWord.turkish];
    setOptions(allOptions.sort(() => Math.random() - 0.5));
    setSelectedOption(null);
    setIsCorrect(null);
    setShowFeedback(false);
  };

  const handleAnswer = (answer: string) => {
    if (!currentWord || selectedOption) return;

    setSelectedOption(answer);
    const correct = answer === currentWord.turkish;
    setIsCorrect(correct);
    setShowFeedback(true);
    setTotalQuestions(prev => prev + 1);

    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setBestStreak(prev => Math.max(prev, newStreak));
      setScore(prev => prev + (10 + Math.floor(newStreak / 3)));
      const newProgress = Math.min(100, progress + 10);
      setProgress(newProgress);

      if (newProgress >= 100) {
        setShowUnitComplete(true);
        setTimeout(() => {
          if (onUnitComplete) {
            onUnitComplete(unit);
          }
        }, 2000);
      } else {
        setTimeout(() => {
          generateNewQuestion();
        }, 1000);
      }
    } else {
      setStreak(0);
      setProgress(prev => Math.max(0, prev - 5));

      setTimeout(() => {
        generateNewQuestion();
      }, 2000);
    }
  };

  if (!currentWord) return null;

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl border border-blue-100">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="text-3xl sm:text-2xl font-bold text-blue-800">
              Skor: {score}
            </div>
            <div className="text-base sm:text-sm font-medium">
              <span className="text-blue-600">Streak: {streak} 🔥</span>
              <span className="mx-2 text-gray-400">|</span>
              <span className="text-indigo-600">En İyi Streak: {bestStreak}</span>
            </div>
          </div>
          <button
            onClick={startNewGame}
            className="px-6 py-3 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg text-lg sm:text-base
              transform transition-all duration-300 hover:scale-105 hover:shadow-lg
              active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Yeniden Başla
          </button>
        </div>

        <div className="w-full bg-blue-100 rounded-full h-2">
          <div
            className="h-2 bg-blue-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg border border-blue-50">
          <div className="text-4xl sm:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-indigo-600
            text-transparent bg-clip-text animate-pulse">
            {currentWord.english}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                disabled={!!selectedOption}
                className={`
                  p-6 sm:p-4 rounded-xl text-xl sm:text-lg font-medium text-center
                  transform transition-all duration-300
                  ${selectedOption
                    ? option === currentWord.turkish
                      ? 'bg-green-100 text-green-800 scale-105 shadow-lg ring-2 ring-green-400'
                      : option === selectedOption
                        ? 'bg-red-100 text-red-800 scale-105 shadow-lg ring-2 ring-red-400'
                        : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-50 hover:bg-blue-100 hover:shadow-md text-blue-800 cursor-pointer'
                  }
                `}
              >
                {option}
              </button>
            ))}
          </div>

          {showFeedback && (
            <div className={`mt-6 text-center text-lg font-medium
              ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {isCorrect
                ? `Harika! +${10 + Math.floor(streak / 3)} puan kazandın!`
                : `Yanlış! Doğru cevap: ${currentWord.turkish}`}
            </div>
          )}
          
          {showUnitComplete && (
            <div className="mt-6 text-center text-2xl font-bold text-green-600 animate-bounce">
              Tebrikler! Bu üniteyi tamamladınız! 🎉
              <div className="text-lg font-medium text-blue-600 mt-2">
                Bir sonraki üniteye geçiliyor...
              </div>
            </div>
          )}
        </div>

        <div className="text-center text-sm text-gray-600">
          Toplam Soru: {totalQuestions} | Doğruluk: {totalQuestions > 0
            ? `${Math.round((score / (totalQuestions * 10)) * 100)}%`
            : '0%'}
        </div>

        {showUnitComplete && (
          <div className="mt-8 p-6 bg-white rounded-xl shadow-lg border border-blue-100">
            <h3 className="text-2xl font-bold text-blue-800 mb-4">Oyun Sonu Analizi</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div className="space-y-2">
                <p className="font-medium">Toplam Puan: <span className="text-blue-600">{score}</span></p>
                <p className="font-medium">En İyi Streak: <span className="text-indigo-600">{bestStreak}</span></p>
                <p className="font-medium">Doğruluk Oranı: <span className="text-green-600">
                  {totalQuestions > 0 ? `${Math.round((score / (totalQuestions * 10)) * 100)}%` : '0%'}
                </span></p>
              </div>
              <div className="space-y-2">
                <p className="font-medium">Toplam Soru: <span className="text-blue-600">{totalQuestions}</span></p>
                <p className="font-medium">Doğru Cevap: <span className="text-green-600">{Math.round(score / 10)}</span></p>
                <p className="font-medium">Yanlış Cevap: <span className="text-red-600">{totalQuestions - Math.round(score / 10)}</span></p>
              </div>
            </div>
            <div className="mt-4 space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-700 mb-2">Öğrenme Performansı</p>
                <p className="text-sm text-gray-600">
                  Bu ünitedeki performansınız {totalQuestions > 0 && Math.round((score / (totalQuestions * 10)) * 100) >= 80 ? 'çok iyi' : 'geliştirilmeli'}.
                  {bestStreak >= 5 && ' Etkileyici bir streak serisi yakaladınız!'}
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-700 mb-2">Kelime İlerlemesi</p>
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
        )}
      </div>
    </div>
  );
}