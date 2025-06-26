import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Lightbulb, Sparkles, CheckCircle, XCircle, RefreshCw, Trophy, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GeminiService } from '../../services/geminiService';
import { Preposition, prepositionsByLevel } from '../../data/prepositions';
import { PrepositionExercise } from '../../types';

type Difficulty = 'easy' | 'medium' | 'hard' | 'mixed';

const geminiService = GeminiService.getInstance();
const BATCH_SIZE = 5;

const PrepositionMasteryGame: React.FC = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [exercises, setExercises] = useState<PrepositionExercise[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [score, setScore] = useState(0);
  const [questionsAttempted, setQuestionsAttempted] = useState(0);
  const gameInitialized = useRef(false);

  const fetchExercisesBatch = useCallback(async (selectedDifficulty: Difficulty) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const prepsToFetch: { prep: string; difficulty: 'easy' | 'medium' | 'hard' }[] = [];
      for (let i = 0; i < BATCH_SIZE; i++) {
      let prepList: Preposition[] = [];
      let actualDifficulty: 'easy' | 'medium' | 'hard';

      if (selectedDifficulty === 'mixed') {
          const allLevels = Object.keys(prepositionsByLevel) as Array<'easy' | 'medium' | 'hard'>;
          actualDifficulty = allLevels[Math.floor(Math.random() * allLevels.length)];
          prepList = prepositionsByLevel[actualDifficulty];
      } else {
        actualDifficulty = selectedDifficulty;
          prepList = prepositionsByLevel[actualDifficulty];
        }
        const randomPrep = prepList[Math.floor(Math.random() * prepList.length)];
        prepsToFetch.push({ prep: randomPrep.prep, difficulty: actualDifficulty });
      }

      const newExercises = await geminiService.generatePrepositionExercise(prepsToFetch);
      setExercises(newExercises);
      setCurrentQuestionIndex(0);
      setIsEvaluated(false);
      setSelectedAnswer(null);
    } catch (error) {
      console.error('Error fetching preposition exercises:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const startGame = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setScore(0);
    setQuestionsAttempted(0);
    fetchExercisesBatch(selectedDifficulty);
  };

  const handleAnswerSelect = (option: string) => {
    if (isEvaluated) return;
    setSelectedAnswer(option);
    setIsEvaluated(true);
    if (option === exercises[currentQuestionIndex]?.correctAnswer) {
      setScore(prev => prev + 1);
    }
    setQuestionsAttempted(prev => prev + 1);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < exercises.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    setIsEvaluated(false);
    setSelectedAnswer(null);
    } else {
      // End of batch, fetch new ones
    if (difficulty) {
        fetchExercisesBatch(difficulty);
      }
    }
  };

  const currentExercise = exercises[currentQuestionIndex];

  if (!difficulty) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center mb-10">
          <Sparkles className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Preposition Mastery</h1>
          <p className="text-lg text-gray-600">Choose a difficulty level to start.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
          {(['easy', 'medium', 'hard', 'mixed'] as Difficulty[]).map(level => (
            <motion.button
              key={level}
              onClick={() => startGame(level)}
              className="p-8 rounded-xl text-left bg-white border border-gray-200 shadow-md hover:shadow-lg hover:border-indigo-500 transition-all"
              whileHover={{ scale: 1.03 }}
            >
              <h2 className="text-2xl font-bold capitalize mb-2 text-indigo-700">{level}</h2>
              <p className="text-gray-600">
                {level === 'easy' && 'Basic prepositions of time and place.'}
                {level === 'medium' && 'More complex prepositions and phrasal verbs.'}
                {level === 'hard' && 'Advanced, idiomatic, and dependent prepositions.'}
                {level === 'mixed' && 'Random prepositions from all levels.'}
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }
  
  if (isLoading && exercises.length === 0) {
     return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-gray-800">
            <RefreshCw className="w-12 h-12 animate-spin text-indigo-600" />
            <p className="mt-4 text-lg">Preparing your exercises...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setDifficulty(null)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Levels
          </button>
          <div className="flex items-center gap-4">
            <span className="bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-semibold capitalize">{difficulty}</span>
            <div className="text-gray-900 text-lg font-bold">
              Score: {score} / {questionsAttempted}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <AnimatePresence mode="wait">
            {!currentExercise ? (
              <motion.div key="loader" className="text-center py-20">
                <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin mx-auto" />
              </motion.div>
            ) : (
              <motion.div key={currentQuestionIndex} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}>
                <div className="text-center mb-8">
                  <p className="text-gray-600 text-lg mb-3">Complete the sentence with the correct preposition.</p>
                  <p className="text-gray-900 text-3xl font-serif font-medium tracking-wide min-h-[8rem]">
                    {currentExercise.sentence.split('[BLANK]')[0]}
                    <span className="inline-block bg-gray-200 rounded-md w-32 h-10 mx-2"></span>
                    {currentExercise.sentence.split('[BLANK]')[1]}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {currentExercise.options.map(option => (
                    <motion.button
                      key={option}
                      onClick={() => handleAnswerSelect(option)}
                      className={`p-4 rounded-lg text-lg font-semibold border-2 transition-all duration-200
                        ${isEvaluated 
                          ? (option === currentExercise.correctAnswer ? 'bg-green-100 border-green-500 text-green-800' 
                            : (option === selectedAnswer ? 'bg-red-100 border-red-500 text-red-800' : 'bg-gray-100 border-gray-300 text-gray-500'))
                          : 'bg-white border-gray-300 hover:border-indigo-500 hover:bg-indigo-50'
                        }`
                      }
                      disabled={isEvaluated}
                      whileHover={{ scale: isEvaluated ? 1 : 1.05 }}
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>

                {isEvaluated && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                      {selectedAnswer === currentExercise.correctAnswer ? (
                        <div className="flex items-center justify-center gap-2 text-green-600 font-semibold text-xl mb-4">
                          <CheckCircle /> Correct!
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2 text-red-600 font-semibold text-xl mb-4">
                          <XCircle /> Incorrect. The right answer is: <strong className="ml-1">{currentExercise.correctAnswer}</strong>
                        </div>
                      )}
                    <button
                      onClick={handleNextQuestion}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-8 rounded-lg font-semibold transition-colors text-lg"
                    >
                      Next Question <ChevronRight className="w-5 h-5 inline-block" />
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PrepositionMasteryGame; 