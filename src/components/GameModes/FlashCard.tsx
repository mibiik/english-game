import React, { useState, useEffect } from 'react';
import { Word } from '../../data/words';

interface FlashCardProps {
  words: Word[];
  unit: number;
}

export function FlashCard({ words, unit }: FlashCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [unitWords, setUnitWords] = useState<Word[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const filteredWords = words.filter(word => word.unit === unit);
    setUnitWords(filteredWords);
    setProgress(0);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [unit, words]);

  const handleNextCard = () => {
    if (currentIndex < unitWords.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setIsFlipped(false);
      setProgress((nextIndex / (unitWords.length - 1)) * 100);
    }
  };

  const handlePrevCard = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setIsFlipped(false);
      setProgress((prevIndex / (unitWords.length - 1)) * 100);
    }
  };

  if (unitWords.length === 0) return null;

  return (
    <div className="p-8 bg-white rounded-xl shadow-lg">
      <div className="mb-6">
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-[#4B8B9F] h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-right text-sm text-[#6A4C93] mt-2">
          {currentIndex + 1} / {unitWords.length}
        </div>
      </div>

      <div
        className={`
          relative w-full aspect-[3/2] cursor-pointer
          transform-gpu transition-all duration-500
          ${isFlipped ? 'rotate-y-180' : ''}
        `}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`
            absolute inset-0 w-full h-full
            flex items-center justify-center
            bg-white shadow-md
            text-[#4B8B9F] text-3xl font-bold p-8 text-center
            rounded-xl
            backface-hidden
            ${isFlipped ? 'rotate-y-180 opacity-0' : ''}
          `}
        >
          {unitWords[currentIndex].english}
        </div>

        <div
          className={`
            absolute inset-0 w-full h-full
            flex items-center justify-center
            bg-white shadow-md
            text-[#FF8C42] text-3xl font-bold p-8 text-center
            rounded-xl
            backface-hidden rotate-y-180
            ${isFlipped ? 'rotate-y-0 opacity-100' : 'opacity-0'}
          `}
        >
          {unitWords[currentIndex].turkish}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrevCard}
          disabled={currentIndex === 0}
          className={`
            px-6 py-3 rounded-lg transition-all duration-300
            ${currentIndex === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white shadow-md text-[#4B8B9F] hover:ring-2 hover:ring-[#4B8B9F]'}
          `}
        >
          Önceki
        </button>

        <button
          onClick={handleNextCard}
          disabled={currentIndex === unitWords.length - 1}
          className={`
            px-6 py-3 rounded-lg transition-all duration-300
            ${currentIndex === unitWords.length - 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white shadow-md text-[#4B8B9F] hover:ring-2 hover:ring-[#4B8B9F]'}
          `}
        >
          Sonraki
        </button>
      </div>
    </div>
  );
}