import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Lightbulb, Sparkles, CheckCircle, XCircle, RefreshCw, Trophy, ChevronRight, StopCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GeminiService } from '../../services/geminiService';
import { Preposition, prepositionsByLevel } from '../../data/prepositions';

type Difficulty = 'easy' | 'medium' | 'hard' | 'mixed';

interface PrepositionExercise {
  sentence: string;
  correctAnswer: string;
  options: string[];
  sourcePrep: Preposition;
}

const PrepositionMasteryGame: React.FC = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [currentExercise, setCurrentExercise] = useState<PrepositionExercise | null>(null);
  const [nextExercise, setNextExercise] = useState<PrepositionExercise | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [score, setScore] = useState(0);
  const [questionsAttempted, setQuestionsAttempted] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const geminiService = GeminiService.getInstance();

  const fetchExercise = useCallback(async (selectedDifficulty: Difficulty): Promise<PrepositionExercise | null> => {
    try {
      let prepList: Preposition[] = [];
      let actualDifficulty: 'easy' | 'medium' | 'hard';

      if (selectedDifficulty === 'mixed') {
        // Create a flat list of all prepositions with their original difficulty
        const allPreps = (Object.keys(prepositionsByLevel) as Array<'easy' | 'medium' | 'hard'>).flatMap(level => 
          prepositionsByLevel[level].map(prep => ({ ...prep, difficulty: level }))
        );
        const randomPrepInfo = allPreps[Math.floor(Math.random() * allPreps.length)];
        const { difficulty, ...randomPrep } = randomPrepInfo;
        actualDifficulty = difficulty;
        const exerciseData = await geminiService.generatePrepositionExercise(randomPrep.prep, actualDifficulty);
        return { ...exerciseData, sourcePrep: randomPrep };
      } else {
        prepList = prepositionsByLevel[selectedDifficulty];
        actualDifficulty = selectedDifficulty;
        const randomPrep = prepList[Math.floor(Math.random() * prepList.length)];
        const exerciseData = await geminiService.generatePrepositionExercise(randomPrep.prep, actualDifficulty);
        return { ...exerciseData, sourcePrep: randomPrep };
      }
    } catch (error) {
      console.error('Error fetching preposition exercise:', error);
      return null;
    }
  }, []);

  const preloadNextExercise = useCallback(async (selectedDifficulty: Difficulty) => {
    const exercise = await fetchExercise(selectedDifficulty);
    setNextExercise(exercise);
  }, [fetchExercise]);

  const startGame = async (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setIsLoading(true);
    const firstExercise = await fetchExercise(selectedDifficulty);
    setCurrentExercise(firstExercise);
    preloadNextExercise(selectedDifficulty);
    setIsLoading(false);
  };

  const handleAnswerSelect = (option: string) => {
    if (isEvaluated) return;
    setSelectedAnswer(option);
  };

  const handleEvaluate = () => {
    if (!selectedAnswer) return;
    setIsEvaluated(true);
    if (selectedAnswer === currentExercise?.correctAnswer) {
      setScore(prev => prev + 1);
    }
    setQuestionsAttempted(prev => prev + 1);
  };

  const handleNextQuestion = () => {
    setIsEvaluated(false);
    setSelectedAnswer(null);
    setCurrentExercise(nextExercise);
    if (difficulty) {
      preloadNextExercise(difficulty);
    }
  };

  const handleEndGame = () => {
    setShowResult(true);
  };

  if (!difficulty) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 text-white">
        <div className="text-center mb-10">
          <Sparkles className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">Preposition Mastery</h1>
          <p className="text-lg text-gray-400">Bir zorluk seviyesi seçerek başla.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
          {(['easy', 'medium', 'hard', 'mixed'] as Difficulty[]).map(level => (
            <motion.button
              key={level}
              onClick={() => startGame(level)}
              className="p-8 rounded-lg text-left bg-gray-800 border border-gray-700 hover:border-cyan-500 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <h2 className="text-2xl font-bold capitalize mb-2 text-cyan-400">{level}</h2>
              <p className="text-gray-400">
                {level === 'easy' && 'Temel zaman ve yer edatları.'}
                {level === 'medium' && 'Daha karmaşık edatlar ve phrasal verbs.'}
                {level === 'hard' && 'İleri seviye, deyimsel ve bağımlı edatlar.'}
                {level === 'mixed' && 'Tüm seviyelerden rastgele edatlar.'}
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }
  
  if (showResult) {
     return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-2xl w-full border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Oyun Bitti!</h2>
            <p className="text-gray-600 dark:text-gray-400">Harika iş çıkardın!</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6 text-center">
            <h3 className="text-gray-900 dark:text-white font-semibold mb-3">Skorun</h3>
            <p className="text-5xl font-bold text-blue-500">{score} / {questionsAttempted}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setShowResult(false);
                setScore(0);
                setQuestionsAttempted(0);
                setDifficulty(null);
              }}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              Tekrar Oyna
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-900 dark:text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              Ana Sayfa
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setDifficulty(null)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Seviye Seç
          </button>
          <div className="flex items-center gap-4">
            <span className="bg-cyan-500 text-white px-3 py-1 rounded-full text-sm font-semibold capitalize">{difficulty}</span>
            <div className="text-gray-900 dark:text-white text-lg font-semibold">
              Skor: {score}
            </div>
            <button
              onClick={handleEndGame}
              className="flex items-center gap-2 text-red-500 hover:text-red-400 bg-red-900/50 px-3 py-1 rounded-full transition-colors"
              title="Oyunu Bitir ve Skoru Gör"
            >
              <StopCircle className="w-5 h-5" />
              Bitir
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <AnimatePresence mode="wait">
            {(isLoading || !currentExercise) ? (
              <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-20">
                <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
                <p className="mt-4 text-gray-600 dark:text-gray-400">Yeni alıştırma hazırlanıyor...</p>
              </motion.div>
            ) : (
              <motion.div key={currentExercise.sentence} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 dark:text-white text-xl font-bold">Edatları Ustalaş</h3>
                    <p className="text-gray-600 dark:text-gray-400">Cümledeki boşluğu doğru edatla tamamla.</p>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8 text-center">
                  <p className="text-gray-900 dark:text-white text-2xl font-medium tracking-wide">
                    {currentExercise.sentence.split('[BLANK]')[0]}
                    <span className="inline-block bg-gray-200 dark:bg-gray-700 rounded-md px-4 py-1 mx-2 text-transparent">...</span>
                    {currentExercise.sentence.split('[BLANK]')[1]}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {currentExercise.options.map(option => (
                    <motion.button
                      key={option}
                      onClick={() => handleAnswerSelect(option)}
                      className={`p-4 rounded-lg text-lg font-semibold border-2 transition-all duration-200
                        ${isEvaluated 
                          ? (option === currentExercise.correctAnswer ? 'bg-green-100 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-300' 
                            : (option === selectedAnswer ? 'bg-red-100 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-300' 
                              : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500'))
                          : (selectedAnswer === option ? 'bg-blue-500 border-blue-500 text-white' 
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700')
                        }`
                      }
                      disabled={isEvaluated}
                      whileHover={{ scale: isEvaluated ? 1 : 1.05 }}
                      whileTap={{ scale: isEvaluated ? 1 : 0.95 }}
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>

                 {!isEvaluated ? (
                  <button
                    onClick={handleEvaluate}
                    disabled={!selectedAnswer}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    Kontrol Et
                  </button>
                ) : (
                  <div className="text-center">
                    <AnimatePresence>
                      {selectedAnswer === currentExercise.correctAnswer ? (
                        <motion.div initial={{opacity: 0, y:10}} animate={{opacity:1, y:0}} className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 font-semibold text-lg mb-4">
                          <CheckCircle /> Doğru Cevap!
                        </motion.div>
                      ) : (
                        <motion.div initial={{opacity: 0, y:10}} animate={{opacity:1, y:0}} className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400 font-semibold text-lg mb-4">
                          <XCircle /> Yanlış Cevap. Doğrusu: {currentExercise.correctAnswer}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <button
                      onClick={handleNextQuestion}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                    >
                      Sıradaki Soru <ChevronRight className="w-5 h-5 inline-block" />
                    </button>
                  </div>
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