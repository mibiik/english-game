import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

interface MemoryGameProps {
  words: {
    english: string;
    turkish: string;
    unit: string;
  }[];
  unit: string;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({ words, unit }) => {
  const [cards, setCards] = useState<Array<{
    id: number;
    content: string;
    isFlipped: boolean;
    isMatched: boolean;
    language: 'english' | 'turkish';
  }>>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);

  useEffect(() => {
    initializeGame();
  }, [unit]);

  const initializeGame = () => {
    const filteredWords = words.filter((word) => word.unit === unit).slice(0, 6);
    const gameCards = filteredWords.flatMap((word, index) => [
      {
        id: index * 2,
        content: word.english,
        isFlipped: false,
        isMatched: false,
        language: 'english' as const,
      },
      {
        id: index * 2 + 1,
        content: word.turkish,
        isFlipped: false,
        isMatched: false,
        language: 'turkish' as const,
      },
    ]);

    setCards(shuffleArray(gameCards));
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameCompleted(false);
  };

  const shuffleArray = <T extends unknown>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleCardClick = (id: number) => {
    if (
      flippedCards.length === 2 ||
      cards[id].isFlipped ||
      cards[id].isMatched
    ) {
      return;
    }

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);

    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      checkForMatch(newFlippedCards[0], newFlippedCards[1]);
    }
  };

  const checkForMatch = (firstId: number, secondId: number) => {
    const firstCard = cards[firstId];
    const secondCard = cards[secondId];

    if (
      firstCard.language !== secondCard.language &&
      isWordPair(firstCard.content, secondCard.content)
    ) {
      const newCards = [...cards];
      newCards[firstId].isMatched = true;
      newCards[secondId].isMatched = true;
      setCards(newCards);
      setMatchedPairs(matchedPairs + 1);
      setFlippedCards([]);

      if (matchedPairs + 1 === cards.length / 2) {
        setGameCompleted(true);
      }
    } else {
      setTimeout(() => {
        const newCards = [...cards];
        newCards[firstId].isFlipped = false;
        newCards[secondId].isFlipped = false;
        setCards(newCards);
        setFlippedCards([]);
      }, 1000);
    }
  };

  const isWordPair = (content1: string, content2: string): boolean => {
    return words.some(
      (word) =>
        (word.english === content1 && word.turkish === content2) ||
        (word.english === content2 && word.turkish === content1)
    );
  };

  if (cards.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-gray-600">Bu ünitede henüz kelime bulunmamaktadır.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Hafıza Oyunu</h2>
      </div>
      
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold text-purple-600">
            Eşleşen Çiftler: {matchedPairs}/{cards.length / 2}
          </div>
          <div className="text-lg font-semibold text-green-600">
            Hamle: {moves}
          </div>
        </div>

        {gameCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-xl shadow-xl text-white text-center mt-6"
        >
          <h3 className="text-2xl font-bold mb-2">Tebrikler!</h3>
          <p className="mb-4">Oyunu {moves} hamlede tamamladınız.</p>
          <button
            onClick={initializeGame}
            className="px-6 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors shadow-md"
          >
            Tekrar Oyna
          </button>
        </motion.div>
      )}
      </div>

      <div className="grid grid-cols-3 gap-4 w-full max-w-md">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            className={`aspect-square cursor-pointer ${card.isMatched ? 'opacity-50' : ''}`}
            onClick={() => handleCardClick(card.id)}
            whileHover={{ scale: card.isMatched ? 1 : 1.05 }}
            whileTap={{ scale: card.isMatched ? 1 : 0.95 }}
          >
            <div
              className={`w-full h-full rounded-xl shadow-md transition-transform duration-300 transform-gpu ${card.isFlipped ? 'rotate-y-180' : ''} preserve-3d`}
            >
              <div className="absolute w-full h-full backface-hidden">
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <Brain className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="absolute w-full h-full backface-hidden rotate-y-180">
                <div className="w-full h-full bg-white rounded-xl border-2 border-purple-200 p-2 flex items-center justify-center text-center">
                  <span className="text-sm font-semibold text-purple-700 break-words">
                    {card.content}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};