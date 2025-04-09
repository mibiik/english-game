import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface FlashCardProps {
  words: {
    english: string;
    turkish: string;
    unit: string;
  }[];
  unit: string;
}

export const FlashCard: React.FC<FlashCardProps> = ({ words, unit }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const filteredWords = words.filter((word) => word.unit === unit);

  useEffect(() => {
    setCurrentWordIndex(0);
    setIsFlipped(false);
    setProgress(0);
  }, [unit]);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextCard = (known: boolean) => {
    if (known) {
      setScore(score + 1);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1000);
    }

    setIsFlipped(false);
    setTimeout(() => {
      if (currentWordIndex < filteredWords.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
        setProgress(((currentWordIndex + 1) / filteredWords.length) * 100);
      } else {
        setCurrentWordIndex(0);
        setProgress(0);
      }
    }, 200);
  };

  if (filteredWords.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-gray-600">Bu ünitede henüz kelime bulunmamaktadır.</p>
      </div>
    );
  }

  const currentWord = filteredWords[currentWordIndex];

  return (
    <div className="flex flex-col items-center space-y-6 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold text-purple-600">
            Kelime {currentWordIndex + 1}/{filteredWords.length}
          </div>
          <div className="text-lg font-semibold text-green-600">
            Skor: {score}
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="relative w-full max-w-md aspect-[3/2] perspective-1000">
        <motion.div
          className="w-full h-full cursor-pointer transform-style-3d"
          onClick={handleCardClick}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="absolute w-full h-full backface-hidden">
            <div className="w-full h-full bg-white rounded-xl shadow-lg p-8 flex items-center justify-center border-2 border-purple-200 hover:border-purple-400 transition-colors">
              <h2 className="text-3xl font-bold text-center text-purple-700">
                {currentWord.english}
              </h2>
            </div>
          </div>
          <div className="absolute w-full h-full backface-hidden rotate-y-180">
            <div className="w-full h-full bg-purple-50 rounded-xl shadow-lg p-8 flex items-center justify-center border-2 border-purple-200 hover:border-purple-400 transition-colors">
              <h2 className="text-3xl font-bold text-center text-purple-700">
                {currentWord.turkish}
              </h2>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex space-x-4 mt-6">
        <button
          onClick={() => handleNextCard(false)}
          className="px-6 py-3 bg-red-100 text-red-600 rounded-lg font-semibold hover:bg-red-200 transition-colors"
        >
          Bilmiyorum
        </button>
        <button
          onClick={() => handleNextCard(true)}
          className="px-6 py-3 bg-green-100 text-green-600 rounded-lg font-semibold hover:bg-green-200 transition-colors"
        >
          Biliyorum
        </button>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>Harika!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};