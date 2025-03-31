import React, { useState, useEffect } from 'react';
import { Word } from '../../data/words';

interface QuizGameProps {
  words: Word[];
  unit: string;
}

export function QuizGame({ words, unit }: QuizGameProps) {
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  useEffect(() => {
    const filteredWords = words.filter(word => word.unit === unit);
    if (filteredWords.length > 0) {
      startNewQuestion(filteredWords);
    }
  }, [unit, words]);

  const startNewQuestion = (wordList: Word[]) => {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    const word = wordList[randomIndex];
    setCurrentWord(word);

    // Doğru cevap ve 3 yanlış seçenek oluştur
    const wrongOptions = wordList
      .filter(w => w.turkish !== word.turkish)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.turkish);

    const allOptions = [...wrongOptions, word.turkish];
    setOptions(allOptions.sort(() => Math.random() - 0.5));
    setSelectedOption(null);
    setIsCorrect(null);
    setShowCorrectAnswer(false);
  };

  const handleOptionSelect = async (index: number) => {
    if (selectedOption !== null || !currentWord) return;

    try {
      setSelectedOption(index);
      const isAnswerCorrect = options[index] === currentWord.turkish;
      setIsCorrect(isAnswerCorrect);

      if (isAnswerCorrect) {
        const streakBonus = Math.floor(streak / 2);
        const points = 10 + streakBonus;
        setScore(prev => prev + points);
        setStreak(prev => prev + 1);
        setBestScore(prev => Math.max(prev, score + points));
      } else {
        setStreak(0);
        setScore(prev => Math.max(0, prev - 5));
        setShowCorrectAnswer(true);
      }

      setAttempts(prev => prev + 1);

      // 2 saniye sonra yeni soruya geç
      await new Promise(resolve => setTimeout(resolve, 2000));
      startNewQuestion(words.filter(word => word.unit === unit));
    } catch (error) {
      console.error('Seçenek seçme hatası:', error);
      setSelectedOption(null);
      setIsCorrect(null);
    }
  };

  const startGame = () => {
    setScore(0);
    setAttempts(0);
    setStreak(0);
    startNewQuestion(words.filter(word => word.unit === unit));
  };

  return (
    <div className="p-8 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-lg border border-yellow-100">
      {(
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <div className="text-2xl font-bold text-orange-800">
                Puan: {score}
              </div>
              <div className="text-sm font-medium text-orange-600">
                Streak: {streak} 🔥
              </div>
              <div className="text-sm font-medium text-orange-600">
                En İyi Puan: {bestScore}
              </div>
            </div>
            <button
              onClick={() => startGame()}
              className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg
                transform transition-all duration-300 hover:scale-105 hover:shadow-md
                active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
            >
              Yeniden Başla
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-yellow-200">
            <div className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-yellow-600 to-orange-600 text-transparent bg-clip-text">
              {currentWord?.english}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  className={`
                    p-4 rounded-lg text-lg font-medium text-center
                    transform transition-all duration-300 cursor-pointer
                    ${selectedOption === index
                      ? isCorrect
                        ? 'bg-green-100 text-green-800 scale-105 shadow-lg ring-2 ring-green-400'
                        : 'bg-red-100 text-red-800 scale-105 shadow-lg ring-2 ring-red-400'
                      : showCorrectAnswer && option === currentWord?.turkish
                        ? 'animate-pulse bg-green-100 text-green-800 scale-105 shadow-lg ring-2 ring-green-400'
                        : 'bg-white hover:bg-yellow-50 hover:shadow-md border-2 border-yellow-200 text-yellow-700'
                    }
                  `}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}