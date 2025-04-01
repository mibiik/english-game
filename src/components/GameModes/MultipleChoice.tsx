import React, { useState, useEffect } from 'react';
import { Word } from '../../data/words';
import { updateWordDifficulty } from '../../data/difficultWords';

interface MultipleChoiceProps {
  words: Word[];
  unit: number;
}

export const MultipleChoice: React.FC<MultipleChoiceProps> = ({ words, unit }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [unitWords, setUnitWords] = useState<Word[]>([]);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);

  useEffect(() => {
    const filteredWords = words.filter(word => word.unit === unit);
    setUnitWords(filteredWords);
    if (filteredWords.length > 0) {
      generateOptions(filteredWords, 0);
    }
  }, [words, unit]);

  const generateOptions = (wordList: Word[], index: number) => {
    const currentWord = wordList[index];
    if (!currentWord) return;

    const allWords = words.filter(w => w.turkish !== currentWord.turkish);
    const wrongOptions = allWords
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.turkish);

    const allOptions = [...wrongOptions, currentWord.turkish];
    setOptions(allOptions.sort(() => Math.random() - 0.5));
  };

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections

    const currentWord = unitWords[currentWordIndex];
    const correct = answer === currentWord.turkish;
    
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setTotalAnswered(prev => prev + 1);

    // Zorlu kelimeler sistemine kelimeyi ekle
    updateWordDifficulty(currentWord, correct);

    if (correct) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentWordIndex < unitWords.length - 1) {
        setCurrentWordIndex(prev => prev + 1);
        generateOptions(unitWords, currentWordIndex + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      }
    }, correct ? 500 : 2000);
  };

  const getButtonStyle = (option: string) => {
    if (selectedAnswer === null) {
      return 'bg-white hover:bg-gray-100 border border-gray-200 cursor-pointer';
    }

    const currentWord = unitWords[currentWordIndex];
    if (option === currentWord.turkish) {
      return 'bg-green-500 text-white cursor-not-allowed';
    }
    if (option === selectedAnswer) {
      return 'bg-red-500 text-white cursor-not-allowed';
    }
    return 'bg-white border border-gray-200 cursor-not-allowed opacity-50';
  };

  if (unitWords.length === 0) {
    return <div className="text-center p-4">Bu ünitede kelime bulunmamaktadır.</div>;
  }

  const currentWord = unitWords[currentWordIndex];
  const progress = ((currentWordIndex + 1) / unitWords.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-semibold text-gray-700">
          Skor: {score}/{totalAnswered}
        </div>
        <div className="text-gray-600">
          {currentWordIndex + 1} / {unitWords.length}
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-800">{currentWord.english}</h2>
        <p className="text-gray-600 text-lg">Doğru Türkçe karşılığını seçin</p>
      </div>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(option)}
            className={`p-4 text-lg rounded-lg transition-all duration-300 shadow-md hover:shadow-lg relative z-20 ${getButtonStyle(option)}`}
            disabled={selectedAnswer !== null}
          >
            {option}
          </button>
        ))}
      </div>

      {isCorrect !== null && (
        <div className={`text-center text-lg font-semibold ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
          {isCorrect ? 'Doğru!' : `Yanlış! Doğru cevap: ${currentWord.turkish}`}
        </div>
      )}
    </div>
  );
};