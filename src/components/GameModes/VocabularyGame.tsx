import React, { useState, useEffect } from 'react';
import { VocabularyService, Unit, VocabularyGame } from '../../services/vocabularyService';
import { generateSentences } from '../../services/openRouterService';
import { Word } from '../../data/words';

type VocabularyGameProps = {
  words: Word[];
  onComplete: () => void;
};

export const VocabularyGameComponent: React.FC<VocabularyGameProps> = ({ words, onComplete }) => {
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [gameState, setGameState] = useState<VocabularyGame | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  const vocabularyService = VocabularyService.getInstance();
  const units = vocabularyService.getUnits();

  const initializeGame = async (unit: Unit) => {
    setIsLoading(true);
    try {
      const game = await vocabularyService.initializeGame(words, unit);
      const sentences = await generateSentences(game.words.map(w => w.english));
      game.sentences = sentences.split('\n').filter(s => s.trim());
      setGameState(game);
      setCurrentIndex(0);
      setScore(0);
      setFeedback('');
    } catch (error) {
      console.error('Error initializing game:', error);
      setFeedback('Oyun başlatılırken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnitSelect = (unit: Unit) => {
    setSelectedUnit(unit);
    initializeGame(unit);
  };

  const handleAnswerSelect = (selectedAnswer: string) => {
    if (!gameState) return;

    const currentWord = gameState.correctAnswers[gameState.currentQuestionIndex];
    const isCorrect = selectedAnswer.toLowerCase() === currentWord.toLowerCase();

    if (isCorrect) {
      setGameState(prev => ({
        ...prev!,
        score: prev!.score + 1
      }));
      setFeedback('Doğru! 🎉');
    } else {
      setFeedback(`Yanlış. Doğru cevap: ${currentWord}`);
    }

    setTimeout(() => {
      if (gameState.currentQuestionIndex < gameState.words.length - 1) {
        setGameState(prev => ({
          ...prev!,
          currentQuestionIndex: prev!.currentQuestionIndex + 1
        }));
        setFeedback('');
      } else {
        onComplete();
      }
    }, 1500);
  };

  if (isLoading) {
    return <div className="p-4">Yükleniyor...</div>;
  }

  if (!selectedUnit) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Ünite Seçin</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {units.map((unit) => (
            <button
              key={unit.id}
              onClick={() => handleUnitSelect(unit)}
              className="p-4 border rounded-lg hover:bg-blue-50 transition-colors"
            >
              <h3 className="font-semibold">{unit.name}</h3>
              <p className="text-sm text-gray-600">{unit.description}</p>
              <p className="text-sm text-gray-500 mt-2">{unit.wordCount} kelime</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (!gameState) {
    return null;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Kelime Oyunu - {selectedUnit.name}</h2>
      <div className="mb-8">
        <p className="text-lg mb-2">{gameState.sentences[gameState.currentQuestionIndex]}</p>
        <div className="grid grid-cols-2 gap-4">
          {gameState.options[gameState.currentQuestionIndex].map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className="p-4 border rounded-lg hover:bg-blue-50 transition-colors"
              disabled={!!feedback}
            >
              {option}
            </button>
          ))}
        </div>
        {feedback && (
          <p className={`mt-4 text-center ${feedback.includes('Doğru') ? 'text-green-600' : 'text-red-600'}`}>
            {feedback}
          </p>
        )}
      </div>
      <div className="flex justify-between items-center">
        <div>İlerleme: {gameState.currentQuestionIndex + 1}/{gameState.words.length}</div>
        <div>Puan: {gameState.score}/{gameState.words.length}</div>
      </div>
    </div>
  );
};