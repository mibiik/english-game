import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { learningStatsTracker } from '../../data/learningStats';
import { Star, Trophy, Medal, ArrowRight } from 'lucide-react';
import { WordDetail } from '../../data/words';

interface GameWord extends WordDetail {
  type: 'english' | 'turkish';
  id: number;
}

interface MatchingGameProps {
  words: WordDetail[];
  unit: string;
}

const MatchingGameWrapper = ({ words }: { words: WordDetail[] }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!words || words.length === 0) {
      console.log("No words found, navigating to home.");
      navigate('/');
    }
  }, [words, navigate]);

  if (!words || words.length === 0) {
    return null;
  }
  
  const unit = words[0]?.unit;
  if (!unit) {
    return null; 
  }

  return <MatchingGame words={words} unit={unit} />;
};

export function MatchingGame({ words, unit }: MatchingGameProps) {
  const navigate = useNavigate();
  const [gameWords, setGameWords] = useState<GameWord[]>([]);
  const [selectedEnglish, setSelectedEnglish] = useState<GameWord | null>(null);
  const [selectedTurkish, setSelectedTurkish] = useState<GameWord | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [usedWords, setUsedWords] = useState<string[]>([]);
  
  const startNewGame = useCallback(() => {
    setShowResult(false);
    const availableWords = words.filter(word => !usedWords.includes(word.headword) && word.unit === unit);
    
    let wordsForRound = availableWords.length >= 9 ? availableWords : words.filter(word => word.unit === unit);
    if (wordsForRound.length < 9) {
        wordsForRound = words; // Fallback to all words if unit-specific are less than 9
    }

    const roundWords = wordsForRound.sort(() => 0.5 - Math.random()).slice(0, 9);
    
    setUsedWords(prev => [...new Set([...prev, ...roundWords.map(w => w.headword)])]);

    const englishCards = roundWords.map(word => ({ ...word, id: Math.random(), type: 'english' as const }));
    const turkishCards = roundWords.map(word => ({ ...word, id: Math.random(), type: 'turkish' as const }));

    setGameWords([...englishCards, ...turkishCards].sort(() => 0.5 - Math.random()));
    setMatchedPairs([]);
    setSelectedEnglish(null);
    setSelectedTurkish(null);
    setScore(0);
    setAttempts(0);
    setIsChecking(false);
  }, [words, unit, usedWords]);

  useEffect(() => {
    startNewGame();
  }, [words, unit]);

  const handleCardClick = (card: GameWord) => {
    if (isChecking || matchedPairs.includes(card.headword)) {
      return;
    }

    if (selectedEnglish && selectedTurkish && selectedEnglish.headword !== selectedTurkish.headword) {
      setSelectedEnglish(null);
      setSelectedTurkish(null);
      setIsChecking(false);
    }

    if (card.type === 'english') {
      setSelectedEnglish(card.id === selectedEnglish?.id ? null : card);
    } else if (card.type === 'turkish') {
      setSelectedTurkish(card.id === selectedTurkish?.id ? null : card);
    }
  };
  
  useEffect(() => {
    if (selectedEnglish && selectedTurkish) {
      setIsChecking(true);
      setAttempts(prev => prev + 1);
      if (selectedEnglish.headword === selectedTurkish.headword) {
        setMatchedPairs(prev => [...prev, selectedEnglish.headword]);
        learningStatsTracker.recordWordLearned(selectedEnglish);
        setScore(prev => prev + 10);
        setSelectedEnglish(null);
        setSelectedTurkish(null);
        setIsChecking(false);
      } else {
        setTimeout(() => {
          setSelectedEnglish(null);
          setSelectedTurkish(null);
          setIsChecking(false);
        }, 300);
      }
    }
  }, [selectedEnglish, selectedTurkish]);

  useEffect(() => {
    if (gameWords.length > 0 && matchedPairs.length === gameWords.length / 2) {
        setTimeout(() => {
            setShowResult(true);
        }, 500);
    }
  }, [matchedPairs, gameWords]);


  const renderCard = (card: GameWord) => {
    const isSelected = card.id === selectedEnglish?.id || card.id === selectedTurkish?.id;
    const isMatched = matchedPairs.includes(card.headword);
    const isMismatched = isChecking && isSelected && !isMatched;

    let cardStateClasses = 'bg-gray-800 border-gray-700 hover:border-cyan-400';
    if (isMatched) {
      cardStateClasses = 'bg-green-500 border-green-600 text-white opacity-80 cursor-default';
    } else if (isMismatched) {
      cardStateClasses = 'bg-red-500 border-red-600 text-white animate-shake';
    } else if (isSelected) {
      cardStateClasses = 'bg-cyan-500 border-cyan-600 text-white scale-105';
    }

    return (
      <div
        key={card.id}
        className={`w-full h-28 flex items-center justify-center p-2 rounded-lg cursor-pointer transition-all duration-300 transform ${cardStateClasses}`}
        onClick={() => handleCardClick(card)}
      >
        <h3 className="text-center text-lg font-semibold text-white max-w-full overflow-hidden whitespace-nowrap text-ellipsis">
          {card.type === 'english' ? card.headword : card.turkish}
        </h3>
      </div>
    );
  };

  if (showResult) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center bg-gray-900 p-8 rounded-xl shadow-2xl w-full max-w-md">
            <h2 className="text-4xl font-black text-yellow-400 mb-4">Harika İş!</h2>
            <div className="grid grid-cols-2 gap-4 my-6">
                <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-400">Skor</p>
                    <p className="text-3xl font-bold">{score}</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-400">Doğruluk</p>
                    <p className="text-3xl font-bold">{attempts > 0 ? `${Math.round((matchedPairs.length / attempts) * 100)}%` : '100%'}</p>
                </div>
            </div>
            <div className="flex justify-center space-x-4 mt-8">
                <button onClick={startNewGame} className="w-full text-center rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 text-lg font-semibold text-white shadow-lg hover:scale-105 transition-transform duration-200">
                    Yeni Oyun
                </button>
                <button onClick={() => navigate('/')} className="w-full text-center rounded-lg bg-gray-700 px-6 py-3 text-lg font-semibold text-white shadow-lg hover:bg-gray-600 transition-colors duration-200">
                    Ana Menü
                </button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="w-full max-w-4xl mx-auto relative">
        <button
          onClick={startNewGame}
          className="absolute top-1/2 -right-4 md:-right-12 transform -translate-y-1/2 p-3 bg-gray-800 border border-gray-700 rounded-full text-gray-300 hover:bg-gray-700 hover:text-white transition-all z-10"
          title="İlerle"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2">
            <h3 className="text-2xl font-bold text-center text-cyan-400 mb-5">İNGİLİZCE</h3>
            <div className="grid grid-cols-3 gap-4">
              {gameWords.filter(w => w.type === 'english').map(renderCard)}
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <h3 className="text-2xl font-bold text-center text-fuchsia-400 mb-5">TÜRKÇE</h3>
            <div className="grid grid-cols-3 gap-4">
              {gameWords.filter(w => w.type === 'turkish').map(renderCard)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MatchingGameWrapper;
