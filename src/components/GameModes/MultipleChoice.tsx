import React, { useState, useEffect, useCallback } from 'react';
import { WordDetail } from '../../data/word4';
import { updateWordDifficulty } from '../../data/difficultWords';
import { learningStatsTracker } from '../../data/learningStats';

interface MultipleChoiceProps {
  words: WordDetail[];
}

export const MultipleChoice: React.FC<MultipleChoiceProps> = ({ words }) => {
  const [roundWords, setRoundWords] = useState<WordDetail[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  
  const shuffleArray = useCallback(<T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  const generateOptions = useCallback((wordList: WordDetail[], currentIndex: number) => {
    const currentWord = wordList[currentIndex];
    const correctAnswer = currentWord.turkish;
  
    const wrongOptions = shuffleArray(
      wordList
        .filter((_, idx) => idx !== currentIndex)
        .map(word => word.turkish)
    ).slice(0, 3);
  
    const allOptions = shuffleArray([...wrongOptions, correctAnswer]);
    setOptions(allOptions);
  }, [shuffleArray]);

  const startNewRound = useCallback(() => {
    const shuffledWords = shuffleArray(words); // Tüm kelimeleri kullan, sayı sınırı yok
    setRoundWords(shuffledWords);
    setCurrentWordIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    if (shuffledWords.length > 0) {
      generateOptions(shuffledWords, 0);
    }
  }, [words, shuffleArray, generateOptions]);

  useEffect(() => {
    if (words.length > 0) {
      startNewRound();
    }
  }, [words, startNewRound]);

  const handleNextWord = useCallback(() => {
    const nextIndex = currentWordIndex + 1;
    
    if (nextIndex >= roundWords.length) {
      // Oyun bitti - tüm kelimeler kullanıldı
      return;
    }

    setCurrentWordIndex(nextIndex);
    generateOptions(roundWords, nextIndex);
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, [roundWords, currentWordIndex, generateOptions]);

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer !== null) return;

    const currentWord = roundWords[currentWordIndex];
    const correct = answer === currentWord.turkish;
    
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    
    updateWordDifficulty(currentWord, correct);

    if (correct) {
      setScore(prev => prev + 1);
      learningStatsTracker.recordWordLearned(currentWord);
    }

    setTimeout(() => {
      handleNextWord();
    }, 1500);
  };

  const getButtonStyle = (option: string) => {
    if (selectedAnswer === null) {
      return 'bg-white hover:bg-gray-100 border border-gray-200 cursor-pointer';
    }

    const currentWord = roundWords[currentWordIndex];
    if (option === currentWord.turkish) {
      return 'bg-green-500 text-white cursor-not-allowed';
    }
    if (option === selectedAnswer) {
      return 'bg-red-500 text-white cursor-not-allowed';
    }
    return 'bg-white border border-gray-200 cursor-not-allowed opacity-50';
  };

  if (roundWords.length === 0) {
    return <div className="text-center p-4">Bu tur için kelime yükleniyor...</div>;
  }

  const isGameComplete = currentWordIndex >= roundWords.length - 1 && selectedAnswer !== null;
  const currentWord = roundWords[currentWordIndex];

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {!isGameComplete ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="text-base sm:text-lg font-semibold text-gray-700">
              Skor: {score}/{currentWordIndex + 1}
            </div>
            <div className="text-sm sm:text-base text-gray-600">
              {currentWordIndex + 1} / {roundWords.length}
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${((currentWordIndex + 1) / roundWords.length) * 100}%` }}
            />
          </div>

          <div className="text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{currentWord.headword}</h2>
            <p className="text-gray-600 text-base sm:text-lg">Doğru Türkçe karşılığını seçin</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className={`p-4 text-base sm:text-lg rounded-lg transition-all duration-300 shadow-md hover:shadow-lg relative z-20 ${getButtonStyle(option)}`}
                disabled={selectedAnswer !== null}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-8 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Tur Tamamlandı!</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-800 mb-2">Performans</h4>
                <p className="text-green-700">Doğru Cevap: <span className="font-bold">{score}</span></p>
                <p className="text-red-700">Yanlış Cevap: <span className="font-bold">{currentWordIndex + 1 - score}</span></p>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-green-800 mb-2">Doğruluk Oranı</h4>
                <p className="text-green-700 text-2xl font-bold">
                  {currentWordIndex + 1 > 0 ? `${Math.round((score / (currentWordIndex + 1)) * 100)}%` : '0%'}
                </p>
              </div>
          </div>
          <button
            onClick={startNewRound}
            className="mt-6 w-full py-3 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Yeni Tur
          </button>
        </div>
      )}
    </div>
  );
};