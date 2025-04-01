import React, { useState, useEffect } from 'react';
import { Word } from '../../data/words';
import { updateWordDifficulty } from '../../data/difficultWords';

interface WordScrambleProps {
  words: Word[];
  unit: string;
}

export function WordScramble({ words, unit }: WordScrambleProps) {
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [scrambledWord, setScrambledWord] = useState('');
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [unitWords, setUnitWords] = useState<Word[]>([]);
  const [gameWords, setGameWords] = useState<Word[]>([]);
  const [wrongWords, setWrongWords] = useState<Word[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const filteredWords = words.filter(word => word.unit === unit);
    setUnitWords(filteredWords);
    // Her bölüm için rastgele 12 kelime seç
    const selectedWords = [...filteredWords]
      .sort(() => Math.random() - 0.5)
      .slice(0, 12);
    setGameWords(selectedWords);
    setCurrentWordIndex(0);
    setWrongWords([]);
    setScore(0);
    setAttempts(0);
    if (selectedWords.length > 0) {
      setCurrentWord(selectedWords[0]);
      setScrambledWord(scrambleWord(selectedWords[0].english));
    }
  }, [unit, words]);

  const scrambleWord = (word: string) => {
    return word
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  };

  const nextWord = () => {
    if (currentWordIndex < gameWords.length - 1) {
      const nextIndex = currentWordIndex + 1;
      setCurrentWordIndex(nextIndex);
      setCurrentWord(gameWords[nextIndex]);
      setScrambledWord(scrambleWord(gameWords[nextIndex].english));
      setInput('');
      setIsCorrect(null);
      setShowResult(false);
    } else {
      setShowResult(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentWord) return;

    setAttempts(attempts + 1);
    const isAnswerCorrect = input.toLowerCase() === currentWord.english.toLowerCase();
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      setScore(score + 1);
      updateWordDifficulty(currentWord, true);
      setTimeout(() => {
        nextWord();
        setIsCorrect(null);
      }, 1000);
    } else {
      if (!wrongWords.includes(currentWord)) {
        setWrongWords([...wrongWords, currentWord]);
        updateWordDifficulty(currentWord, false);
      }
      setInput('');
    }
  };

  const startNewGame = () => {
    const selectedWords = [...unitWords]
      .sort(() => Math.random() - 0.5)
      .slice(0, 12);
    setGameWords(selectedWords);
    setCurrentWordIndex(0);
    setCurrentWord(selectedWords[0]);
    setScrambledWord(scrambleWord(selectedWords[0].english));
    setWrongWords([]);
    setScore(0);
    setAttempts(0);
    setInput('');
    setIsCorrect(null);
    setShowResult(false);
  };

  return (
    <div className="p-8 bg-white rounded-xl shadow-xl transform transition-all duration-500 hover:shadow-2xl">
      {!showResult ? (
        <>
          <div className="flex justify-between mb-6 animate-fadeIn">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
              Score: {score}
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
              Word: {currentWordIndex + 1}/12
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="text-3xl font-bold text-center animate-slideDown bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
              {scrambledWord}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${(currentWordIndex / gameWords.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={`w-full p-4 border-2 rounded-lg mb-4 transition-all duration-300 focus:ring-2 focus:ring-opacity-50 transform hover:scale-102
                ${isCorrect === true ? 'border-green-500 bg-green-50 focus:ring-green-500' : 
                  isCorrect === false ? 'border-red-500 bg-red-50 focus:ring-red-500' : 
                  'border-purple-300 focus:border-purple-500 focus:ring-purple-500'}`}
              placeholder="Unscramble the word..."
              autoFocus
            />
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg
                transform transition-all duration-300 hover:scale-105 hover:shadow-lg
                active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            >
              Submit
            </button>
          </form>

          <div className="mt-4 space-y-2">
            <div className="text-gray-600">
              İpucu: {currentWord?.turkish}
            </div>
            {isCorrect === false && (
              <div className="text-center mt-4 text-xl animate-fadeIn">
                <p className="text-red-600 font-semibold text-2xl mb-2">Yanlış! Doğru cevap:</p>
                <p className="font-bold text-green-600 text-2xl">{currentWord?.english}</p>
              </div>
            )}
            {isCorrect === true && (
              <div className="text-center mt-4 text-xl animate-bounce">
                <p className="text-green-600 font-bold text-3xl">DOĞRU!</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center animate-fadeIn">
          <h2 className="text-4xl font-bold mb-4 animate-bounce bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            Oyun Bitti!
          </h2>
          <p className="text-2xl mb-4 animate-slideUp">
            Skorunuz: <span className="font-bold text-purple-600">{score}/12</span>
          </p>
          
          {wrongWords.length > 0 && (
            <div className="mb-6 animate-slideUp">
              <h3 className="text-lg font-semibold mb-2 text-purple-600">Yanlış Yapılan Kelimeler:</h3>
              <div className="space-y-2">
                {wrongWords.map((word, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg shadow-sm transform transition-all duration-300 hover:scale-102 hover:shadow-md">
                    <span className="font-medium text-purple-600">{word.english}</span> - {word.turkish}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={startNewGame}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg
              transform transition-all duration-300 hover:scale-105 hover:shadow-lg
              active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          >
            Yeniden Başla
          </button>
        </div>
      )}
    </div>
  );
}