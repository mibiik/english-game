import React, { useState, useEffect } from 'react';
import { Word } from '../../types';
import { wordTracker } from '../../data/wordTracker';
import { gameScoreService } from '../../services/gameScoreService';
import { authService } from '../../services/authService';
import { awardPoints } from '../../services/scoreService';

interface TimedMatchingGameProps {
  words: Word[];
  unit: string;
}

export function TimedMatchingGame({ words, unit }: TimedMatchingGameProps) {
  const [cards, setCards] = useState<Array<{ word: Word; isFlipped: boolean; isMatched: boolean; type: 'english' | 'turkish' }>>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [totalPairs, setTotalPairs] = useState(0);

  const initializeGame = () => {
    wordTracker.initializeUnit(words, unit);
    const gameWords = wordTracker.getUnseenWords(words, unit).slice(0, 8); // Get 8 words for 16 cards
    setTotalPairs(gameWords.length);

    const cardPairs = gameWords.flatMap((word: Word) => [
      { word, isFlipped: false, isMatched: false, type: 'english' as const },
      { word, isFlipped: false, isMatched: false, type: 'turkish' as const }
    ]);

    // Shuffle cards
    const shuffledCards = cardPairs.sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setScore(0);
    setMatchedPairs(0);
    setTimeLeft(120);
    setGameOver(false);
    setIsGameActive(true);
  };

  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      // Süre doldu, skoru kaydet
      try {
        gameScoreService.saveScore('timedMatching', score, unit);
      } catch (error) {
        console.error('Skor kaydedilirken hata:', error);
      }
      setGameOver(true);
      setIsGameActive(false);
    }
  }, [isGameActive, timeLeft]);

  const handleCardClick = (index: number) => {
    if (
      !isGameActive ||
      cards[index].isMatched ||
      cards[index].isFlipped ||
      selectedCards.length >= 2
    ) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    setSelectedCards(prev => [...prev, index]);

    if (selectedCards.length === 1) {
      const firstCard = cards[selectedCards[0]];
      const secondCard = cards[index];

      if (
        firstCard.word.en === secondCard.word.en &&
        firstCard.type !== secondCard.type
      ) {
        // Match found
        setTimeout(() => {
          const updatedCards = [...cards];
          updatedCards[selectedCards[0]].isMatched = true;
          updatedCards[index].isMatched = true;
          setCards(updatedCards);
          setSelectedCards([]);
          setScore(prev => prev + 10);
          setMatchedPairs(prev => prev + 1);
          // Anında puan ekle
          awardPoints('timedMatching', 10, unit);
          if (matchedPairs + 1 === totalPairs) {
            // Oyun bitti, skoru kaydet
            try {
              gameScoreService.saveScore('timedMatching', score + 10, unit);
            } catch (error) {
              console.error('Skor kaydedilirken hata:', error);
            }
            setGameOver(true);
            setIsGameActive(false);
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          const updatedCards = [...cards];
          updatedCards[selectedCards[0]].isFlipped = false;
          updatedCards[index].isFlipped = false;
          setCards(updatedCards);
          setSelectedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-2">
          <div className="text-3xl font-bold text-purple-800">
            Skor: {score}
          </div>
          <div className="text-lg font-medium text-purple-600">
            Eşleşen: {matchedPairs}/{totalPairs}
          </div>
        </div>
        <div className="text-2xl font-bold text-red-600 animate-pulse">
          {timeLeft}s
        </div>
      </div>

      {!isGameActive && !gameOver && (
        <button
          onClick={initializeGame}
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl
            text-xl font-bold shadow-lg transform transition-all duration-300
            hover:scale-105 hover:shadow-xl active:scale-95"
        >
          Oyunu Başlat
        </button>
      )}

      {isGameActive && (
        <div className="grid grid-cols-4 gap-4">
          {cards.map((card, index) => (
            <button
              key={index}
              onClick={() => handleCardClick(index)}
              className={`aspect-square p-2 rounded-xl text-center flex items-center justify-center
                transform transition-all duration-300 ${card.isFlipped || card.isMatched
                  ? 'bg-white shadow-md border-2 border-purple-300'
                  : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg hover:scale-105 active:scale-95'
                }`}
              disabled={card.isMatched}
            >
              <span className="text-sm sm:text-base font-medium">
                {card.isFlipped || card.isMatched
                  ? card.type === 'english'
                    ? card.word.en
                    : card.word.tr
                  : '?'}
              </span>
            </button>
          ))}
        </div>
      )}

      {gameOver && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100 mt-6">
          <h2 className="text-2xl font-bold text-purple-800 mb-4 text-center">
            {matchedPairs === totalPairs ? 'Tebrikler!' : 'Süre Doldu!'}
          </h2>
          <div className="space-y-3">
            <p className="text-lg text-purple-700">
              Toplam Skor: <span className="font-bold">{score}</span>
            </p>
            <p className="text-lg text-purple-700">
              Eşleşen Çiftler: <span className="font-bold">{matchedPairs}/{totalPairs}</span>
            </p>
            <p className="text-lg text-purple-700">
              Kalan Süre: <span className="font-bold">{timeLeft} saniye</span>
            </p>
          </div>
          <button
            onClick={initializeGame}
            className="w-full mt-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl
              text-lg font-semibold shadow-md transform transition-all duration-300
              hover:scale-102 hover:shadow-lg active:scale-98"
          >
            Tekrar Oyna
          </button>
        </div>
      )}
    </div>
  );
}