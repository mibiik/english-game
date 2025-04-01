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
      setIsFlipped(false);
      setCurrentIndex(nextIndex);
      setProgress((nextIndex / (unitWords.length - 1)) * 100);
    }
  };

  const handlePrevCard = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setIsFlipped(false);
      setCurrentIndex(prevIndex);
      setProgress((prevIndex / (unitWords.length - 1)) * 100);
    }
  };

  if (unitWords.length === 0) return null;

  return (
    <div className="min-h-[80vh] sm:min-h-[600px] flex flex-col justify-center items-center p-2 sm:p-4 md:p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-3 sm:p-4 md:p-6">
        <div className="mb-8">
          <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#4B8B9F] to-[#6A4C93] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-3">
            <span className="text-sm font-medium text-[#4B8B9F]">
              Kelime {currentIndex + 1} / {unitWords.length}
            </span>
            <span className="text-sm font-medium text-[#6A4C93]">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        <div
          className={`
            relative w-full aspect-[3/2] sm:aspect-[4/3] md:aspect-[3/2] mx-auto
            [perspective:1000px] cursor-pointer
            group
          `}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div
            className={`
              absolute inset-0 w-full h-full
              [transform-style:preserve-3d] transition-transform duration-100 ease-out
              ${isFlipped ? '[transform:rotateY(180deg)]' : '[transform:rotateY(0deg)]'}
            `}
          >
            <div
              className={`
                absolute inset-0 w-full h-full
                flex flex-col items-center justify-center
                bg-gradient-to-br from-white to-gray-50
                shadow-lg rounded-2xl p-8
                [backface-visibility:hidden]
                group-hover:shadow-xl
                transition-shadow duration-300
                border border-gray-100
              `}
            >
              <span className="text-lg sm:text-2xl md:text-4xl font-bold text-[#4B8B9F] text-center break-words">
                {unitWords[currentIndex].english}
              </span>
              <span className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500">Çevirmek için tıkla</span>
            </div>

            <div
              className={`
                absolute inset-0 w-full h-full
                flex flex-col items-center justify-center
                bg-gradient-to-br from-white to-gray-50
                shadow-lg rounded-2xl p-8
                [backface-visibility:hidden] [transform:rotateY(180deg)]
                group-hover:shadow-xl
                transition-shadow duration-300
                border border-gray-100
              `}
            >
              <span className="text-lg sm:text-2xl md:text-4xl font-bold text-[#FF8C42] text-center break-words">
                {unitWords[currentIndex].turkish}
              </span>
              <span className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500">Çevirmek için tıkla</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between mt-6 sm:mt-8 gap-3 sm:gap-4">
          <button
            onClick={handlePrevCard}
            disabled={currentIndex === 0}
            className={`
              flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-medium
              transition-all duration-300 transform
              ${currentIndex === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-[#4B8B9F] shadow-md hover:shadow-lg hover:scale-105 active:scale-95'}
            `}
          >
            Önceki
          </button>

          <button
            onClick={handleNextCard}
            disabled={currentIndex === unitWords.length - 1}
            className={`
              flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-medium
              transition-all duration-300 transform
              ${currentIndex === unitWords.length - 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-[#4B8B9F] shadow-md hover:shadow-lg hover:scale-105 active:scale-95'}
            `}
          >
            Sonraki
          </button>
        </div>
      </div>
    </div>
  );
}