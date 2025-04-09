import React, { useState, useEffect } from 'react';
import { Word } from '../../data/words';
import { learningStats } from '../../data/learningStats';

interface WordScrambleProps {
  words: Word[];
  unit: string;
}

export const WordScramble: React.FC<WordScrambleProps> = ({ words, unit }) => {
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [scrambledWord, setScrambledWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [message, setMessage] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isEnglishMode, setIsEnglishMode] = useState(false);

  const unitWords = words.filter((word) => word.unit === unit);

  const scrambleWord = (word: string) => {
    const array = word.toLowerCase().split('');
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
  };

  const getNextWord = () => {
    const randomIndex = Math.floor(Math.random() * unitWords.length);
    const word = unitWords[randomIndex];
    setCurrentWord(word);
    setScrambledWord(scrambleWord(isEnglishMode ? word.english : word.turkish));
    setUserInput('');
    setMessage('');
    setIsCorrect(false);
    setShowAnswer(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentWord) return;

    if (userInput.toLowerCase() === (isEnglishMode ? currentWord.english : currentWord.turkish).toLowerCase()) {
      setMessage('Doğru!');
      setIsCorrect(true);
      learningStats.recordWordLearned(currentWord);
      setTimeout(getNextWord, 1500);
    } else {
      setMessage('Yanlış, tekrar deneyin.');
    }
  };

  useEffect(() => {
    getNextWord();
  }, [unit]);

  useEffect(() => {
    if (currentWord) {
      setScrambledWord(scrambleWord(isEnglishMode ? currentWord.english : currentWord.turkish));
    }
  }, [isEnglishMode, currentWord]);

  return (
    <div className="max-w-lg mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6 transform transition-all duration-300 hover:shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center flex-1">
            {isEnglishMode ? currentWord?.turkish : currentWord?.english}
          </h2>
          <button
            onClick={() => setIsEnglishMode(!isEnglishMode)}
            className="px-6 py-2.5 bg-indigo-100 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-200 transition-all duration-300 transform hover:scale-105 ml-4"
          >
            {isEnglishMode ? 'TR' : 'EN'}
          </button>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-6">
          <p className="text-3xl font-bold text-center text-gray-800 tracking-wider">{scrambledWord}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={`${isEnglishMode ? 'İngilizce' : 'Türkçe'} kelimeyi yazın`}
            className="w-full p-4 text-lg border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            Kontrol Et
          </button>
        </form>
        {message && (
          <div
            className={`mt-6 p-4 rounded-lg text-center text-lg font-semibold ${isCorrect ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'} transform transition-all duration-300`}
          >
            {message}
          </div>
        )}
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => setShowAnswer(true)}
          className="flex-1 bg-amber-100 text-amber-700 py-3 px-6 rounded-lg font-semibold hover:bg-amber-200 transform transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
        >
          Cevabı Göster
        </button>
        <button
          onClick={getNextWord}
          className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transform transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
        >
          Sonraki Kelime
        </button>
      </div>
      {showAnswer && (
        <div className="mt-6 p-6 bg-amber-50 rounded-xl border-2 border-amber-100 transform transition-all duration-300">
          <p className="text-center text-lg text-amber-700 font-semibold">
            Doğru cevap: {isEnglishMode ? currentWord?.english : currentWord?.turkish}
          </p>
        </div>
      )}
    </div>
  );
};