import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { learningStatsTracker } from '../../data/learningStats';
import { Star, Trophy, Medal, ArrowRight, CheckCircle, Target } from 'lucide-react';
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
    if (words && words.length === 0) {
      console.log("No words found for this unit/level, navigating to home.");
      navigate('/');
    }
  }, [words, navigate]);

  if (!words) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Kelimeler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (words.length === 0) {
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
  
  const previousWords = useRef<WordDetail[]>([]);
  const previousUnit = useRef<string>('');
  
  // Ünite kelimelerini al
  const unitWords = words.filter(word => word.unit === unit);
  const totalUnitWords = unitWords.length;
  const completedWords = usedWords.filter(word => unitWords.some(uw => uw.headword === word)).length;
  const unitProgress = Math.round((completedWords / totalUnitWords) * 100);
  
  const startNewGame = useCallback(() => {
    setShowResult(false);
    
    // Ünite kelimelerini al
    const currentUnitWords = words.filter(word => word.unit === unit);
    
    // usedWords'u güncel state'ten al
    setUsedWords(currentUsedWords => {
      // Önce kullanılmamış ünite kelimelerini al
      const availableUnitWords = currentUnitWords.filter(word => !currentUsedWords.includes(word.headword));
      
      let wordsForRound: WordDetail[] = [];
      let newUsedWords = currentUsedWords;
      
      if (availableUnitWords.length >= 9) {
        // Yeterli kelime varsa 9 tane al
        wordsForRound = availableUnitWords.slice(0, 9);
        newUsedWords = [...new Set([...currentUsedWords, ...wordsForRound.map(w => w.headword)])];
      } else if (availableUnitWords.length > 0) {
        // Az kelime kaldıysa hepsini al
        wordsForRound = availableUnitWords;
        newUsedWords = [...new Set([...currentUsedWords, ...wordsForRound.map(w => w.headword)])];
      } else {
        // Kelimeler bitti, baştan başla
        wordsForRound = currentUnitWords.slice(0, Math.min(9, currentUnitWords.length));
        newUsedWords = wordsForRound.map(w => w.headword);
      }

      const roundWords = wordsForRound.sort(() => 0.5 - Math.random());
      
      const englishCards = roundWords.map(word => ({ ...word, id: Math.random(), type: 'english' as const }));
      const turkishCards = roundWords.map(word => ({ ...word, id: Math.random(), type: 'turkish' as const }));

      setGameWords([...englishCards, ...turkishCards].sort(() => 0.5 - Math.random()));
      setMatchedPairs([]);
      setSelectedEnglish(null);
      setSelectedTurkish(null);
      setIsChecking(false);
      
      return newUsedWords;
    });
  }, [words, unit]);

  const handleManualNewGame = useCallback(() => {
    setScore(0);
    setAttempts(0);
    startNewGame();
  }, [startNewGame]);

  useEffect(() => {
    const hasWordsChanged = JSON.stringify(previousWords.current) !== JSON.stringify(words);
    const hasUnitChanged = previousUnit.current !== '' && previousUnit.current !== unit;
    
    if (hasWordsChanged || hasUnitChanged) {
      console.log('🔄 MatchingGame değişiklik algılandı:', { 
        unit: `${previousUnit.current} → ${unit}`,
        wordsChanged: hasWordsChanged,
        unitChanged: hasUnitChanged
      });
      
      // Oyunu sıfırla
      setGameWords([]);
      setSelectedEnglish(null);
      setSelectedTurkish(null);
      setMatchedPairs([]);
      setIsChecking(false);
      setScore(0);
      setAttempts(0);
      setShowResult(false);
      setUsedWords([]);
    }
    
    // Değerleri güncelle
    previousWords.current = words;
    previousUnit.current = unit;
  }, [words, unit]);

  // Ayrı useEffect ile oyunu başlat
  useEffect(() => {
    if (words.length > 0 && gameWords.length === 0 && !showResult) {
      startNewGame();
    }
  }, [words, gameWords.length, showResult, startNewGame]);

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
        className={`w-full h-20 sm:h-24 md:h-28 flex items-center justify-center p-1 sm:p-2 rounded-lg cursor-pointer transition-all duration-300 transform ${cardStateClasses}`}
        onClick={() => handleCardClick(card)}
      >
        <h3 className="text-center text-sm sm:text-base md:text-lg font-semibold text-white px-1 max-w-full overflow-hidden whitespace-nowrap text-ellipsis">
          {card.type === 'english' ? card.headword : card.turkish}
        </h3>
      </div>
    );
  };

  if (showResult) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center bg-gray-900 p-8 rounded-xl shadow-2xl w-full max-w-md">
          <h2 className="text-4xl font-black text-yellow-400 mb-4">Round Tamamlandı!</h2>
          <div className="bg-blue-900/30 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="w-5 h-5 text-blue-400" />
              <p className="text-blue-300 font-semibold">Unit {unit} Progress</p>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${unitProgress}%` }}
              />
            </div>
            <p className="text-gray-300">{completedWords} / {totalUnitWords} kelime (%{unitProgress})</p>
          </div>
          <div className="grid grid-cols-2 gap-4 my-6">
              <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="text-gray-400">Round Skoru</p>
                  <p className="text-3xl font-bold">{score}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="text-gray-400">Doğruluk</p>
                  <p className="text-3xl font-bold">{attempts > 0 ? `${Math.round((matchedPairs.length / attempts) * 100)}%` : '100%'}</p>
              </div>
          </div>
          <div className="flex justify-center space-x-4 mt-8">
              <button onClick={handleManualNewGame} className="w-full text-center rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 text-lg font-semibold text-white shadow-lg hover:scale-105 transition-transform duration-200">
                  Devam Et
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
    <div className="flex items-center justify-center min-h-screen bg-black text-white p-2 sm:p-4">
      <div className="w-full max-w-4xl mx-auto relative">
        {/* Modern Header */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-xl p-4 mb-6 border border-gray-700 shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-cyan-500/20 rounded-lg p-2 border border-cyan-500/30">
                <Target className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Unit {unit}</h2>
                <p className="text-gray-400 text-sm">Eşleştirme Oyunu</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-gray-400 text-sm">Progress:</span>
                <span className="text-cyan-400 font-bold text-lg">{completedWords}/{totalUnitWords}</span>
              </div>
              <div className="w-28 bg-gray-700 rounded-full h-2.5 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2.5 rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: `${unitProgress}%` }}
                />
              </div>
              <div className="text-center mt-1">
                <span className="text-cyan-400 font-semibold text-sm">{unitProgress}%</span>
              </div>
            </div>
            
            <button
              onClick={handleManualNewGame}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-5 py-2.5 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-cyan-400/50"
              title="Sonraki Round"
            >
              <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                <span>İlerle</span>
              </div>
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8">
          <div className="w-full md:w-1/2">
            <h3 className="text-xl sm:text-2xl font-bold text-center text-cyan-400 mb-3 sm:mb-5">İNGİLİZCE</h3>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
              {gameWords.filter(w => w.type === 'english').map(renderCard)}
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <h3 className="text-xl sm:text-2xl font-bold text-center text-fuchsia-400 mb-3 sm:mb-5">TÜRKÇE</h3>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
              {gameWords.filter(w => w.type === 'turkish').map(renderCard)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MatchingGameWrapper;
