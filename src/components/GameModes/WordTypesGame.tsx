import React, { useState, useEffect } from 'react';
import { Word } from '../../data/words';
import { supabaseGameScoreService } from '../../services/supabaseGameScoreService';
import { useAuth } from '../../services/authService';
import { wordTypes, WordType } from '../../data/wordTypes';
import { Type, CheckCircle, XCircle } from 'lucide-react';
import { authService } from '../../services/authService';
import { soundService } from '../../services/soundService';

interface WordTypesGameProps {
  words: Word[];
  unit: string;
  onGameComplete?: () => void;
}

const WordTypesGame: React.FC<WordTypesGameProps> = ({ words, unit, onGameComplete }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  const [showAnswer, setShowAnswer] = useState(false);
  const { currentUser } = useAuth();

  // Sadece kelime tipleri veritabanında bulunan kelimeleri filtrele
  const availableWords = words.filter(word => wordTypes[word.english.toLowerCase()]);

  const handleTypeSelection = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const checkAnswer = () => {
    const currentWord = availableWords[currentWordIndex].english.toLowerCase();
    const correctTypes = wordTypes[currentWord]?.map(t => t.type) || [];
    
    const isCorrect = selectedTypes.length === correctTypes.length &&
      selectedTypes.every(type => correctTypes.includes(type as any));

    if (isCorrect) {
      setScore(score + 2);
      setFeedback('Doğru! 🎉');
      soundService.playCorrect();
      // Anında puan ekle
      const userId = authService.getCurrentUserId();
      if (userId) {
        gameScoreService.addScore(userId, 'wordTypes', 2);
      }
    } else {
      setScore(score - 2);
      // Anında puan ekle
      const userId = authService.getCurrentUserId();
      if (userId) {
        gameScoreService.addScore(userId, 'wordTypes', -2);
      }
      setFeedback('Yanlış.');
      soundService.playWrong();
    }

    setShowAnswer(true);

    setTimeout(() => {
      if (currentWordIndex < availableWords.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
        setSelectedTypes([]);
        setFeedback('');
        setShowAnswer(false);
      } else {
        setGameOver(true);
        if (currentUser) {
          supabaseGameScoreService.saveScore('wordTypes', score, unit);
        }
        if (onGameComplete) {
          onGameComplete();
        }
      }
    }, 3000);
  };

  if (availableWords.length === 0) {
    return (
      <div className="p-4 max-w-lg mx-auto text-center">
        <div className="text-2xl font-bold mb-4">Üzgünüz!</div>
        <p>Bu ünitede kelime tipleri oyunu için uygun kelime bulunmamaktadır.</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      {!gameOver ? (
        <div className="space-y-4">
          <div className="text-2xl font-bold text-center mb-4 flex items-center justify-center gap-2">
            <Type className="w-8 h-8" />
            <span>Kelime Tipleri Oyunu</span>
          </div>
          
          <div className="text-xl text-center mb-6">
            {availableWords[currentWordIndex].english}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {['noun', 'verb', 'adjective', 'adverb'].map((type) => (
              <button
                key={type}
                onClick={() => !showAnswer && handleTypeSelection(type)}
                disabled={showAnswer}
                className={`p-4 rounded-lg font-medium transition-all duration-300 ${
                  selectedTypes.includes(type)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                } ${showAnswer ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                {type}
              </button>
            ))}
          </div>

          {!showAnswer && (
            <button
              onClick={checkAnswer}
              className="w-full p-4 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors duration-300 mt-6"
              disabled={selectedTypes.length === 0}
            >
              Kontrol Et
            </button>
          )}

          {showAnswer && (
            <div className="mt-6 space-y-4">
              <div className={`text-center text-lg font-medium ${
                feedback.startsWith('Doğru') ? 'text-green-500' : 'text-red-500'
              }`}>
                {feedback}
              </div>
              
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="font-medium mb-2">Doğru cevap:</div>
                <div className="space-y-2">
                  {wordTypes[availableWords[currentWordIndex].english.toLowerCase()].map((type, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="font-medium">{type.type}:</span>
                      <span>{type.turkish}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="text-center mt-6">
            <div className="text-lg font-medium">Skor: {score}</div>
            <div className="text-sm text-gray-500">
              {currentWordIndex + 1} / {availableWords.length}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold">Oyun Bitti!</h2>
          <div className="text-4xl font-bold text-green-500">{score} puan</div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
          >
            Tekrar Oyna
          </button>
        </div>
      )}
    </div>
  );
};

export default WordTypesGame; 