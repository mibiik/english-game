import React, { useState, useEffect } from 'react';
import { Word } from '../../data/words';
import { GameModal } from './GameModal';

interface MatchingGameProps {
  words: Word[];
  unit: string;
}

export function MatchingGame({ words, unit }: MatchingGameProps) {
  const [selectedWords, setSelectedWords] = useState<Word[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [selectedEnglishCard, setSelectedEnglishCard] = useState<number | null>(null);
  const [selectedTurkishCard, setSelectedTurkishCard] = useState<number | null>(null);

  useEffect(() => {
    startNewGame();
  }, [unit, words]);

  const startNewGame = () => {
    const unitWords = words.filter(word => word.unit === unit);
    const gameWords = [...unitWords]
      .sort(() => Math.random() - 0.5)
      .slice(0, 12);
    
    const englishCards = gameWords.map(word => ({ ...word, id: Math.random(), type: 'english' }));
    const turkishCards = gameWords.map(word => ({ ...word, id: Math.random(), type: 'turkish' }));
    
    setSelectedWords([...englishCards, ...turkishCards].sort(() => Math.random() - 0.5));
    setSelectedCards([]);
    setMatchedPairs([]);
    setScore(0);
    setAttempts(0);
    setShowResult(false);
    setSelectedEnglishCard(null);
    setSelectedTurkishCard(null);
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
          setScore(score + 1);
          setSelectedEnglishCard(null);
          setSelectedTurkishCard(null);
          
          if (matchedPairs.length + 2 === selectedWords.length) {
            setTimeout(() => setShowResult(true), 500);
          }
        } else {
          // Yanlış eşleşme durumunda kırmızı renk gösterimi için bekletme
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
          setScore(score + 1);
          setSelectedEnglishCard(null);
          setSelectedTurkishCard(null);
          
          if (matchedPairs.length + 2 === selectedWords.length) {
            setTimeout(() => setShowResult(true), 500);
          }
        } else {
          // Yanlış eşleşme durumunda kırmızı renk gösterimi için bekletme
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
        title="Eşleştirme Oyunu"
        description="İngilizce ve Türkçe kelimeleri doğru şekilde eşleştirin! Her doğru eşleştirme için puan kazanın. Tüm kelimeleri eşleştirerek oyunu tamamlayın. Yanlış eşleştirmeler kırmızı renkte gösterilir ve doğru eşleştirmeyi bulmanız için size zaman tanınır."
        icon="🔄"
      />
      {!showResult && !showModal ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col gap-2">
              <div className="text-2xl font-bold text-indigo-800">
                Eşleşmeler: {score}/12
              </div>
              <div className="text-sm font-medium text-purple-600">
                Deneme: {attempts}
              </div>
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

          <div className="flex gap-8">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-700 mb-4 text-center">İngilizce Kelimeler</h3>
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
                          ? 'bg-green-100 text-green-800 scale-105 shadow-lg'
                          : selectedEnglishCard === selectedWords.findIndex(w => w.id === word.id)
                          ? 'bg-blue-100 text-blue-800 scale-105 shadow-lg'
                          : selectedTurkishCard === selectedWords.findIndex(w => w.id === word.id)
                          ? 'bg-blue-100 text-blue-800 scale-105 shadow-lg'
                          : (selectedEnglishCard !== null && selectedTurkishCard !== null) && !matchedPairs.includes(selectedWords.findIndex(w => w.id === word.id))
                            ? 'bg-red-100 text-red-800 scale-105 shadow-lg'
                            : 'bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-600'}
                      `}
                    >
                      <span className="text-lg font-medium">{word.english}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="w-px bg-gray-200 self-stretch"></div>

            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-700 mb-4 text-center">Türkçe Kelimeler</h3>
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
                          ? 'bg-green-100 text-green-800 scale-105 shadow-lg'
                          : selectedEnglishCard === selectedWords.findIndex(w => w.id === word.id)
                          ? 'bg-blue-100 text-blue-800 scale-105 shadow-lg'
                          : selectedTurkishCard === selectedWords.findIndex(w => w.id === word.id)
                          ? 'bg-blue-100 text-blue-800 scale-105 shadow-lg'
                          : (selectedEnglishCard !== null && selectedTurkishCard !== null) && !matchedPairs.includes(selectedWords.findIndex(w => w.id === word.id))
                            ? 'bg-red-100 text-red-800 scale-105 shadow-lg'
                            : 'bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-600'}
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
        <div className="text-center">
          <h2 className="text-2xl font-medium mb-4 text-gray-800">
            Tebrikler!
          </h2>
          <p className="text-gray-600 mb-6">
            {attempts} denemede tüm eşleştirmeleri tamamladınız!
          </p>
          <button
            onClick={startNewGame}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Yeniden Başla
          </button>
        </div>
      )}
    </div>
  );
}