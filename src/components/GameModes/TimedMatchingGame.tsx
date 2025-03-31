import React, { useState, useEffect } from 'react';
import { Word } from '../../data/words';
import { GameModal } from './GameModal';

interface TimedMatchingGameProps {
  words: Word[];
  unit: string;
}

export function TimedMatchingGame({ words, unit }: TimedMatchingGameProps) {
  const [selectedWords, setSelectedWords] = useState<Word[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [selectedEnglishCard, setSelectedEnglishCard] = useState<number | null>(null);
  const [selectedTurkishCard, setSelectedTurkishCard] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [bestScore, setBestScore] = useState<number>(0);

  useEffect(() => {
    startNewGame();
  }, [unit, words]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (startTime && !showResult) {
      timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [startTime, showResult]);

  const startNewGame = () => {
    const unitWords = words.filter(word => word.unit === unit);
    const gameWords = [...unitWords]
      .sort(() => Math.random() - 0.5)
      .slice(0, 12);
    
    const englishCards = gameWords.map(word => ({ ...word, id: Math.random(), type: 'english' }));
    const turkishCards = gameWords.map(word => ({ ...word, id: Math.random(), type: 'turkish' }));
    
    setSelectedWords([...englishCards, ...turkishCards].sort(() => Math.random() - 0.5));
    setMatchedPairs([]);
    setScore(0);
    setAttempts(0);
    setShowResult(false);
    setStartTime(Date.now());
    setElapsedTime(0);
    setStreak(0);
  };

  const calculateScore = (isMatch: boolean) => {
    if (isMatch) {
      const timeBonus = Math.max(0, 30 - elapsedTime);
      const streakBonus = Math.floor(streak / 2);
      return 10 + timeBonus + streakBonus;
    }
    return -5;
  };

  const handleCardClick = (index: number) => {
    if (matchedPairs.includes(index)) return;
    
    const clickedCard = selectedWords[index];
    
    if (clickedCard.type === 'english') {
      if (selectedEnglishCard === index) {
        setSelectedEnglishCard(null);
        return;
      }
      setSelectedEnglishCard(index);
      if (selectedTurkishCard !== null) {
        const englishCard = selectedWords[index];
        const turkishCard = selectedWords[selectedTurkishCard];
        setAttempts(attempts + 1);

        const isMatch = englishCard.english === turkishCard.english;

        if (isMatch) {
          setMatchedPairs([...matchedPairs, index, selectedTurkishCard]);
          setStreak(prev => prev + 1);
          const pointsEarned = calculateScore(true);
          setScore(prev => prev + pointsEarned);
          setSelectedEnglishCard(null);
          setSelectedTurkishCard(null);
          
          if (matchedPairs.length + 2 === selectedWords.length) {
            const finalTime = Math.floor((Date.now() - (startTime || 0)) / 1000);
            if (!bestTime || finalTime < bestTime) {
              setBestTime(finalTime);
            }
            if (score > bestScore) {
              setBestScore(score);
            }
            setTimeout(() => setShowResult(true), 500);
          }
        } else {
          setStreak(0);
          const pointsLost = calculateScore(false);
          setScore(prev => Math.max(0, prev + pointsLost));
          setTimeout(() => {
            setSelectedEnglishCard(null);
            setSelectedTurkishCard(null);
          }, 1000);
        }
      }
    } else {
      if (selectedTurkishCard === index) {
        setSelectedTurkishCard(null);
        return;
      }
      setSelectedTurkishCard(index);
      if (selectedEnglishCard !== null) {
        const englishCard = selectedWords[selectedEnglishCard];
        const turkishCard = selectedWords[index];
        setAttempts(attempts + 1);

        const isMatch = englishCard.english === turkishCard.english;

        if (isMatch) {
          setMatchedPairs([...matchedPairs, selectedEnglishCard, index]);
          setStreak(prev => prev + 1);
          const pointsEarned = calculateScore(true);
          setScore(prev => prev + pointsEarned);
          setSelectedEnglishCard(null);
          setSelectedTurkishCard(null);
          
          if (matchedPairs.length + 2 === selectedWords.length) {
            const finalTime = Math.floor((Date.now() - (startTime || 0)) / 1000);
            if (!bestTime || finalTime < bestTime) {
              setBestTime(finalTime);
            }
            if (score > bestScore) {
              setBestScore(score);
            }
            setTimeout(() => setShowResult(true), 500);
          }
        } else {
          setStreak(0);
          const pointsLost = calculateScore(false);
          setScore(prev => Math.max(0, prev + pointsLost));
          setTimeout(() => {
            setSelectedEnglishCard(null);
            setSelectedTurkishCard(null);
          }, 1000);
        }
      }
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg border border-indigo-100">
      <GameModal
        isOpen={!showResult && showModal}
        onClose={() => setShowModal(false)}
        onStart={() => {
          setShowModal(false);
          startNewGame();
        }}
        title="Zamanlı Eşleştirme Oyunu"
        description="İngilizce ve Türkçe kelimeleri en kısa sürede eşleştirin! Her doğru eşleştirme için temel puan, süre bonusu ve streak bonusu kazanın. Yanlış eşleştirmeler puanınızı düşürür. En iyi sürenizi ve puanınızı geçmeye çalışın!"
        icon="⏱️"
      />
      {!showResult && !showModal ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col gap-2">
              <div className="text-2xl font-bold text-indigo-800">
                Puan: {score}
              </div>
              <div className="text-sm font-medium text-purple-600">
                Streak: {streak} 🔥
              </div>
              <div className="text-sm font-medium text-purple-600">
                En İyi Puan: {bestScore}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="text-xl font-bold text-indigo-800">
                Süre: {elapsedTime}s
              </div>
              {bestTime && (
                <div className="text-sm font-medium text-purple-600">
                  En İyi Süre: {bestTime}s
                </div>
              )}
              <div className="text-sm font-medium text-purple-600">
                Deneme: {attempts}
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg
                  transform transition-all duration-300 hover:scale-105 hover:shadow-md
                  active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              >
                Yeniden Başla
              </button>
            </div>
          </div>

          <div className="flex gap-8">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-purple-700 mb-4 text-center">İngilizce Kelimeler</h3>
              <div className="grid grid-cols-3 gap-4">
                {selectedWords
                  .filter(word => word.type === 'english')
                  .map((word, index) => (
                    <div
                      key={index}
                      onClick={() => handleCardClick(selectedWords.findIndex(w => w.id === word.id))}
                      className={`
                        rounded-lg cursor-pointer p-4 text-center
                        transform transition-all duration-300
                        min-h-[100px] flex items-center justify-center
                        ${matchedPairs.includes(selectedWords.findIndex(w => w.id === word.id))
                          ? 'bg-green-100 text-green-800 scale-105 shadow-lg ring-2 ring-green-400'
                          : selectedEnglishCard === selectedWords.findIndex(w => w.id === word.id)
                          ? 'bg-purple-100 text-purple-800 scale-105 shadow-lg ring-2 ring-purple-400'
                          : selectedTurkishCard === selectedWords.findIndex(w => w.id === word.id)
                          ? 'bg-purple-100 text-purple-800 scale-105 shadow-lg ring-2 ring-purple-400'
                          : (selectedEnglishCard !== null && selectedTurkishCard !== null) && !matchedPairs.includes(selectedWords.findIndex(w => w.id === word.id))
                            ? 'bg-red-100 text-red-800 scale-105 shadow-lg ring-2 ring-red-400'
                            : 'bg-white hover:bg-purple-50 hover:shadow-md border-2 border-purple-200 text-purple-700'}
                      `}
                    >
                      <span className="text-lg font-medium">{word.english}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="w-px bg-purple-200 self-stretch"></div>

            <div className="flex-1">
              <h3 className="text-lg font-medium text-pink-700 mb-4 text-center">Türkçe Kelimeler</h3>
              <div className="grid grid-cols-3 gap-4">
                {selectedWords
                  .filter(word => word.type === 'turkish')
                  .map((word, index) => (
                    <div
                      key={index}
                      onClick={() => handleCardClick(selectedWords.findIndex(w => w.id === word.id))}
                      className={`
                        rounded-lg cursor-pointer p-4 text-center
                        transform transition-all duration-300
                        min-h-[100px] flex items-center justify-center
                        ${matchedPairs.includes(selectedWords.findIndex(w => w.id === word.id))
                          ? 'bg-green-100 text-green-800 scale-105 shadow-lg ring-2 ring-green-400'
                          : selectedEnglishCard === selectedWords.findIndex(w => w.id === word.id)
                          ? 'bg-pink-100 text-pink-800 scale-105 shadow-lg ring-2 ring-pink-400'
                          : selectedTurkishCard === selectedWords.findIndex(w => w.id === word.id)
                          ? 'bg-pink-100 text-pink-800 scale-105 shadow-lg ring-2 ring-pink-400'
                          : (selectedEnglishCard !== null && selectedTurkishCard !== null) && !matchedPairs.includes(selectedWords.findIndex(w => w.id === word.id))
                            ? 'bg-red-100 text-red-800 scale-105 shadow-lg ring-2 ring-red-400'
                            : 'bg-white hover:bg-pink-50 hover:shadow-md border-2 border-pink-200 text-pink-700'}
                      `}
                    >
                      <span className="text-lg font-medium">{word.turkish}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            Tebrikler!
          </h2>
          <div className="space-y-4 text-lg">
            <p className="text-gray-700">
              {attempts} denemede tüm eşleştirmeleri tamamladınız!
            </p>
            <p className="text-purple-600 font-medium">
              Süreniz: {elapsedTime} saniye
              {bestTime === elapsedTime && <span className="ml-2">🏆 Yeni Rekor!</span>}
            </p>
            <p className="text-pink-600 font-medium">
              Toplam Puan: {score}
              {score === bestScore && <span className="ml-2">🌟 Yeni Rekor!</span>}
            </p>
            {bestTime && (
              <p className="text-purple-500">
                En İyi Süre: {bestTime} saniye
              </p>
            )}
            <p className="text-pink-500">
              En Yüksek Puan: {bestScore}
            </p>
          </div>
          <button
            onClick={startNewGame}
            className="mt-8 w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg
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