import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Check, X, Trophy, ArrowLeft, Swords, Sparkles, Star, BrainCircuit } from 'lucide-react';
import { PrepositionExercise } from '../../types';
import { aiService } from '../../services/aiService';
import { prepositionsByLevel, Preposition } from '../../data/prepositions';
import { gameScoreService } from '../../services/gameScoreService';
import { authService } from '../../services/authService';
import { awardPoints } from '../../services/scoreService';
import { soundService } from '../../services/soundService';

type GameState = 'menu' | 'loading' | 'playing' | 'finished';
type Difficulty = 'easy' | 'medium' | 'hard' | 'mixed';

const BATCH_SIZE = 5;

const generateQuestionsForDifficulty = async (difficulty: Difficulty): Promise<PrepositionExercise[]> => {
      const prepsToFetch: { prep: string; difficulty: 'easy' | 'medium' | 'hard' }[] = [];
    
      for (let i = 0; i < BATCH_SIZE; i++) {
        let actualDifficulty: 'easy' | 'medium' | 'hard';
        if (difficulty === 'mixed') {
          const allLevels = Object.keys(prepositionsByLevel) as Array<'easy' | 'medium' | 'hard'>;
          actualDifficulty = allLevels[Math.floor(Math.random() * allLevels.length)];
        } else {
            actualDifficulty = difficulty;
        }
        const prepList = prepositionsByLevel[actualDifficulty];
        const randomPrep = prepList[Math.floor(Math.random() * prepList.length)];
        prepsToFetch.push({ prep: randomPrep.prep, difficulty: actualDifficulty });
      }

    const prompt = `Create ${BATCH_SIZE} English sentences for a preposition exercise based on these words and difficulties: ${prepsToFetch.map(p => `${p.prep} (${p.difficulty})`).join(', ')}.
    RULES:
    - Each sentence must have one preposition missing, replaced with '___'.
    - Provide the correct preposition and three plausible distractor prepositions.
    - Return as a JSON array of objects. Each object must have: "sentence" (string), "options" (array of 4 strings), and "correctAnswer" (the correct preposition string).
    - Ensure the options are shuffled and the correct answer isn't always in the same position.
    - The sentence must be natural and appropriate for a B1-B2 English learner.`;

    try {
        const response = await aiService.generateText(prompt);
        // A more robust cleaning and parsing logic might be needed here.
        // For now, assuming aiService has cleanJson method or similar.
        const cleanedResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedResponse);
    } catch (error) {
        console.error('Failed to generate preposition questions:', error);
        return [];
    }
};


export const PrepositionMasteryGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [exercises, setExercises] = useState<PrepositionExercise[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [scoreChange, setScoreChange] = useState<null | { value: number, key: number }>(null);

  const startGame = useCallback(async (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setGameState('loading');
    try {
      const newExercises = await generateQuestionsForDifficulty(selectedDifficulty);
      if (newExercises.length === 0) throw new Error("No questions generated.");
      setExercises(newExercises);
      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectedAnswer(null);
      setGameState('playing');
    } catch (error) {
      console.error('Error starting game:', error);
      setGameState('menu'); 
    }
  }, []);

  const handleAnswerSelect = (option: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(option);
    if (option === exercises[currentQuestionIndex]?.correctAnswer) {
      const bonus = Math.min(streak, 2); // Maksimum 2 bonus puan
      const totalPoints = 2 + bonus;
      setScore(prev => prev + totalPoints);
      setScoreChange({ value: totalPoints, key: Date.now() });
      setStreak(prev => prev + 1);
      awardPoints('prepositionMastery', totalPoints, 'unit');
      soundService.playCorrect();
    } else {
      setScore(prev => prev - 2);
      setScoreChange({ value: -2, key: Date.now() });
      setStreak(0);
      // Anında puan ekle
      const userId = authService.getCurrentUserId();
      if (userId) {
        gameScoreService.addScore(userId, 'prepositionMastery', -2);
      }
      soundService.playWrong();
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < exercises.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      setGameState('finished');
      // Oyun bittiğinde skoru kaydet
      const saveScore = async () => {
        try {
          const finalScore = score + (selectedAnswer === exercises[currentQuestionIndex]?.correctAnswer ? 1 : 0);
          await gameScoreService.saveScore('prepositionMastery', finalScore, 'all');
          console.log('PrepositionMasteryGame skoru kaydedildi:', finalScore);
        } catch (error) {
          console.error('PrepositionMasteryGame skoru kaydedilirken hata:', error);
        }
      };
      saveScore();
    }
  };
  
  const resetGame = () => {
    setGameState('menu');
    setDifficulty(null);
    setExercises([]);
  };

  const renderMenu = () => (
    <div className="text-center">
      <BrainCircuit className="w-16 h-16 mx-auto text-indigo-500 mb-4" />
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Preposition Mastery</h1>
      <p className="text-lg text-gray-600 mb-8">Choose a difficulty to begin your training.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(['easy', 'medium', 'hard', 'mixed'] as Difficulty[]).map(level => (
            <motion.button
              key={level}
              whileHover={{ scale: 1.05 }}
              onClick={() => startGame(level)}
              className="p-6 rounded-xl text-left bg-gray-50 border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all"
            >
              <h2 className="text-xl font-bold capitalize text-indigo-700">{level}</h2>
            </motion.button>
          ))}
        </div>
      </div>
    );

  const renderLoading = () => (
    <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
        <p className="mt-4 text-lg text-gray-700">Crafting your custom exercises...</p>
        </div>
      );

  const renderFinished = () => (
            <div className="text-center">
      <Trophy className="w-20 h-20 mx-auto text-green-500 mb-6" />
                <h2 className="text-3xl font-bold mb-4">Round Complete!</h2>
      <p className="text-xl text-gray-600 mb-8">
        Your score: <strong className="text-indigo-600">{score}</strong> / {exercises.length}
      </p>
      <div className="flex justify-center gap-4">
        <motion.button whileHover={{ scale: 1.05 }} onClick={() => startGame(difficulty!)} className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700">Play Again</motion.button>
        <motion.button whileHover={{ scale: 1.05 }} onClick={resetGame} className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300">Back to Menu</motion.button>
            </div>
        </div>
      );

  const renderPlaying = () => {
    if (!exercises[currentQuestionIndex]) return null;
    const { sentence, options, correctAnswer } = exercises[currentQuestionIndex];
    const isAnswered = selectedAnswer !== null;

  return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <button onClick={resetGame} className="flex items-center gap-2 text-gray-500 hover:text-gray-800"><ArrowLeft className="w-5 h-5" /> Menu</button>
          <div className="text-right">
            <p className="font-bold text-lg text-indigo-600">Score: {score}</p>
            <p className="text-sm text-gray-500">{currentQuestionIndex + 1} / {exercises.length}</p>
          </div>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full mb-8">
            <motion.div className="h-2 bg-indigo-500 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / exercises.length) * 100}%` }} transition={{ duration: 0.5 }} />
        </div>
          <AnimatePresence mode="wait">
          <motion.div key={currentQuestionIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <p className="text-center text-3xl font-serif text-gray-800 p-4 rounded-lg bg-gray-100 min-h-[6rem] flex items-center justify-center">
              {sentence.replace('___', '______')}
                  </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
              {options.map(option => {
                const isCorrect = option === correctAnswer;
                const isSelected = option === selectedAnswer;
                let buttonClass = 'bg-white border-gray-300 hover:border-indigo-500';
                if(isAnswered) {
                    if(isCorrect) buttonClass = 'bg-green-100 border-green-500 text-green-800';
                    else if (isSelected) buttonClass = 'bg-red-100 border-red-500 text-red-800';
                    else buttonClass = 'bg-gray-100 border-gray-300 text-gray-500 opacity-60';
                }
                return (
                    <motion.button key={option} onClick={() => handleAnswerSelect(option)}
                        className={`flex items-center justify-between p-4 rounded-lg text-lg font-semibold border-2 transition-all w-full text-left ${buttonClass}`}
                        disabled={isAnswered} whileHover={{ scale: isAnswered ? 1 : 1.05 }}>
                        <span>{option}</span>
                        {isAnswered && isCorrect && <Check className="w-6 h-6 text-green-600" />}
                        {isAnswered && isSelected && !isCorrect && <X className="w-6 h-6 text-red-600" />}
                    </motion.button>
                )
              })}
                </div>
            {isAnswered && (
                <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={handleNextQuestion}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold">
                    {currentQuestionIndex === exercises.length - 1 ? 'Finish Game' : 'Next Question'}
                </motion.button>
                )}
              </motion.div>
          </AnimatePresence>
        </div>
    );
  };
  
  const renderContent = () => {
    switch (gameState) {
      case 'menu': return renderMenu();
      case 'loading': return renderLoading();
      case 'playing': return renderPlaying();
      case 'finished': return renderFinished();
      default: return renderMenu();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col items-center justify-center font-sans" style={{ paddingTop: 'calc(64px + 1rem)', marginTop: '-128px' }}>
      {/* Puan Gösterimi */}
      {scoreChange && (
        <div key={scoreChange.key} className={`fixed top-1/3 left-1/2 -translate-x-1/2 z-50 pointer-events-none select-none animate-fade-in-out`}
          style={{ fontSize: '2.5rem', fontWeight: 'bold', color: scoreChange.value > 0 ? '#22c55e' : '#ef4444', textShadow: '0 2px 8px rgba(0,0,0,0.15)', opacity: '0.3' }}>
          {scoreChange.value > 0 ? `+${scoreChange.value}` : scoreChange.value}
        </div>
      )}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <AnimatePresence mode="wait">
          <motion.div key={gameState} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PrepositionMasteryGame; 