import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw } from 'lucide-react';
import { WordDetail } from '../../data/words';

interface FlashCardProps {
  words: WordDetail[];
}

export const FlashCard: React.FC<FlashCardProps> = ({ words }) => {
  const [roundWords, setRoundWords] = useState<WordDetail[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const startNewRound = useCallback(() => {
    const shuffled = [...words].sort(() => 0.5 - Math.random());
    setRoundWords(shuffled.slice(0, 15)); // Her turda 15 kelime
    setCurrentWordIndex(0);
    setIsFlipped(false);
    setScore(0);
  }, [words]);

  useEffect(() => {
    if (words.length > 0) {
      startNewRound();
    }
  }, [words, startNewRound]);

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
      if (currentWordIndex < roundWords.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
      } else {
        // Son kelimeden sonra turu yeniden başlat
        startNewRound();
      }
    }, 200);
  };

  if (roundWords.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-gray-600">Kelime kartları hazırlanıyor...</p>
      </div>
    );
  }

  const currentWord = roundWords[currentWordIndex];
  const progress = ((currentWordIndex + 1) / roundWords.length) * 100;

  return (
    <div className="flex flex-col items-center space-y-6 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold text-purple-600">
            Kelime {currentWordIndex + 1}/{roundWords.length}
          </div>
          <button
            onClick={startNewRound}
            className="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
            title="Yeni Tur"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
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
                {currentWord.headword}
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