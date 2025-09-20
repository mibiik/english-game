import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import { WordDetail } from '../../data/words';
import { supabaseAuthService } from '../../services/supabaseAuthService';
import { supabaseGameScoreService } from '../../services/supabaseGameScoreService';
import { soundService } from '../../services/soundService';

interface MemoryGameProps {
  words: WordDetail[];
  onGameComplete?: () => void;
}

interface Card {
  id: number;
  word: string;
  isFlipped: boolean;
  isMatched: boolean;
  type: 'headword' | 'turkish';
  pairId: number;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({ words, onGameComplete }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  // Supabase auth kullan
  const [roundWords, setRoundWords] = useState<WordDetail[]>([]);

  const startNewRound = useCallback(() => {
    const gameWords = [...words].sort(() => 0.5 - Math.random()).slice(0, 8);
    setRoundWords(gameWords);

    const cardPairs = gameWords.flatMap((word, index) => [
      {
        id: index * 2,
        word: word.headword,
        isFlipped: false,
        isMatched: false,
        type: 'headword' as const,
        pairId: index,
      },
      {
        id: index * 2 + 1,
        word: word.turkish,
        isFlipped: false,
        isMatched: false,
        type: 'turkish' as const,
        pairId: index,
      }
    ]);

    setCards(shuffleArray(cardPairs));
    setFlippedCards([]);
    setMatchedPairs(0);
    setScore(0);
    setMoves(0);
    setGameOver(false);
  }, [words]);

  useEffect(() => {
    if (words.length > 0) {
      startNewRound();
    }
  }, [words, startNewRound]);

  const shuffleArray = (array: Card[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleCardClick = (clickedCard: Card) => {
    if (flippedCards.length === 2 || clickedCard.isFlipped || clickedCard.isMatched) {
      return;
    }

    const newCards = cards.map(card =>
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);

    const newFlippedCards = [...flippedCards, clickedCard];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      checkForMatch(newFlippedCards);
    }
  };

  const checkForMatch = (flippedPair: Card[]) => {
    const [firstCard, secondCard] = flippedPair;
    const isMatch = firstCard.pairId === secondCard.pairId;

    setTimeout(() => {
      const newCards = cards.map(card => {
        if (card.id === firstCard.id || card.id === secondCard.id) {
          return {
            ...card,
            isFlipped: false,
            isMatched: isMatch
          };
        }
        return card;
      });

      setCards(newCards);
      setFlippedCards([]);

      if (isMatch) {
        const newScore = score + 10;
        setScore(newScore);
        const newMatchedPairs = matchedPairs + 1;
        setMatchedPairs(newMatchedPairs);
        soundService.playCorrect();

        if (newMatchedPairs === roundWords.length) {
          handleGameOver(newScore);
        }
      } else {
        soundService.playWrong();
      }
    }, 1000);
  };

  const handleGameOver = async (finalScore: number) => {
    setGameOver(true);
    const userId = supabaseAuthService.getCurrentUserId();
    if (userId) {
      await supabaseGameScoreService.addScore(userId, 'memory-game', finalScore);
    }
    if (onGameComplete) {
      onGameComplete();
    }
  };

  const cardVariants = {
    flipped: {
      rotateY: 180,
      transition: { duration: 0.3 }
    },
    unflipped: {
      rotateY: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Brain className="w-8 h-8 text-purple-500" />
          <h1 className="text-2xl font-bold">Hafıza Oyunu</h1>
        </div>
        <div className="flex justify-center gap-8 text-lg">
          <div>Skor: {score}</div>
          <div>Hamle: {moves}</div>
        </div>
      </div>

      {gameOver ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Tebrikler!</h2>
          <p className="text-lg mb-4">Toplam Skor: {score}</p>
          <button
            onClick={startNewRound}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Tekrar Oyna
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {cards.map(card => (
            <motion.div
              key={card.id}
              className={`relative aspect-[3/4] cursor-pointer ${
                card.isMatched ? 'opacity-50' : ''
              }`}
              onClick={() => handleCardClick(card)}
              animate={card.isFlipped ? 'flipped' : 'unflipped'}
              variants={cardVariants}
              style={{ perspective: 1000 }}
            >
              <div
                className={`absolute inset-0 rounded-xl p-4 flex items-center justify-center text-center transition-transform duration-300 transform ${
                  card.isFlipped ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-lg' : 
                  'bg-gradient-to-br from-purple-500 to-indigo-600'
                }`}
              >
                {card.isFlipped ? (
                  <span className="font-medium">{card.word}</span>
                ) : (
                  <Brain className="w-8 h-8 text-white" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};