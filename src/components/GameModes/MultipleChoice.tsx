import React, { useState, useEffect } from 'react';
import { Word } from '../../data/words';
import { updateWordDifficulty } from '../../data/difficultWords';

interface MultipleChoiceProps {
  words: Word[];
  unit: string;
}

export function MultipleChoice({ words, unit }: MultipleChoiceProps) {
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [unitWords, setUnitWords] = useState<Word[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  useEffect(() => {
    const filteredWords = words.filter(word => word.unit === unit);
    setUnitWords(filteredWords);
    if (filteredWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredWords.length);
      const initialWord = filteredWords[randomIndex];
      const initialOptions = generateOptions(initialWord.turkish, filteredWords);
      setCurrentWord(initialWord);
      setOptions(initialOptions);
    }
  }, [unit, words]);

  const generateOptions = (correctAnswer: string, wordList: Word[] = unitWords) => {
    if (!wordList.length) return [];
    
    const allOptions = wordList
      .map(word => word.turkish)
      .filter(word => word !== correctAnswer);
    
    if (allOptions.length < 3) return [correctAnswer];
    
    const shuffled = allOptions.sort(() => Math.random() - 0.5);
    const wrongOptions = shuffled.slice(0, 3);
    
    return [...wrongOptions, correctAnswer]
      .sort(() => Math.random() - 0.5);
  };

  const nextQuestion = () => {
    if (!unitWords.length) return;
    
    const randomIndex = Math.floor(Math.random() * unitWords.length);
    const word = unitWords[randomIndex];
    if (word) {
      const newOptions = generateOptions(word.turkish);
      setCurrentWord(word);
      setOptions(newOptions);
    }
  };

  const handleAnswer = (answer: string, index: number) => {
    if (!currentWord) return;

    setSelectedOption(index);
    const isAnswerCorrect = answer === currentWord.turkish;
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      setScore(score + 1);
    } else {
      setShowCorrectAnswer(true);
    }

    updateWordDifficulty(currentWord, isAnswerCorrect);
    setQuestionCount(questionCount + 1);

    setTimeout(() => {
      if (questionCount < 9) {
        nextQuestion();
        setSelectedOption(null);
        setIsCorrect(null);
        setShowCorrectAnswer(false);
      }
    }, 1000);
  };

  const startNewGame = () => {
    setScore(0);
    setQuestionCount(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setShowCorrectAnswer(false);
    nextQuestion();
  };

  return (
    <div className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg border border-indigo-100">
      {questionCount < 10 ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col gap-2">
              <div className="text-2xl font-bold text-indigo-800">
                Skor: {score}
              </div>
              <div className="text-sm font-medium text-purple-600">
                Soru: {questionCount + 1}/10
              </div>
            </div>
            <button
              onClick={startNewGame}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg
                transition-all duration-300 hover:shadow-md
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            >
              Yeniden Başla
            </button>
          </div>
          <div className="text-3xl font-bold text-center mb-8 text-indigo-800">
            {currentWord?.english}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option, index)}
                className={`
                  p-6 rounded-xl text-lg font-medium
                  transition-all duration-300
                  ${selectedOption === index
                    ? isCorrect
                      ? 'bg-green-100 text-green-800 shadow-lg ring-2 ring-green-400'
                      : 'bg-red-100 text-red-800 shadow-lg ring-2 ring-red-400'
                    : showCorrectAnswer && option === currentWord?.turkish
                      ? 'animate-pulse bg-green-100 text-green-800 shadow-lg ring-2 ring-green-400'
                      : 'bg-white hover:shadow-md border border-indigo-100 hover:border-indigo-300 text-indigo-800 cursor-pointer'
                  }
                  focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
                  ${selectedOption !== null ? 'pointer-events-none opacity-75' : ''}
                `}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center space-y-6">
          <div className="text-4xl font-bold text-indigo-800">
            Oyun Bitti!
          </div>
          <div className="text-2xl text-purple-600">
            Final Skor: <span className="font-bold">{score}/10</span>
          </div>
          <button
            onClick={startNewGame}
            className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg
              transition-all duration-300 hover:shadow-md
              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          >
            Tekrar Oyna
          </button>
        </div>
      )}
    </div>
  );
}