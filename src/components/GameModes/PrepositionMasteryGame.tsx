import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Check, X, Trophy, ChevronLeft, BrainCircuit } from 'lucide-react';
import { PrepositionExercise } from '../../types';
import { aiService } from '../../services/aiService';
import { prepositionsByLevel } from '../../data/prepositions';
import { supabaseGameScoreService } from '../../services/supabaseGameScoreService';
import { authService } from '../../services/authService';
import { awardPoints } from '../../services/scoreService';
import { soundService } from '../../services/soundService';
import AIServiceModal from '../AIServiceModal';
import { useNavigate, useSearchParams } from 'react-router-dom';

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
    const cleanedResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error('Failed to generate preposition questions:', error);
    return [];
  }
};

export const PrepositionMasteryGame: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentUnit = searchParams.get('unit') || '1';
  const currentLevel = searchParams.get('level') || 'intermediate';
  
  const [gameState, setGameState] = useState<GameState>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [exercises, setExercises] = useState<PrepositionExercise[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [scoreChange, setScoreChange] = useState<null | { value: number, key: number }>(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [pendingDifficulty, setPendingDifficulty] = useState<Difficulty | null>(null);
  const [theme, setTheme] = useState<'blue' | 'pink' | 'classic'>('blue');

  // Tema renkleri
  const themeClasses = theme === 'blue' ? {
    bg: 'bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100',
    cardBg: 'bg-white/60 backdrop-blur-lg',
    border: 'border-blue-200',
    text: 'text-blue-800',
    textSecondary: 'text-blue-600',
    textDark: 'text-blue-900',
    button: 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700',
    progress: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    buttonCorrect: 'bg-green-500 text-white border-green-500',
    buttonWrong: 'bg-red-500 text-white border-red-500',
    buttonBase: 'bg-white/80 hover:bg-white border border-blue-200 text-blue-700'
  } : theme === 'pink' ? {
    bg: 'bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100',
    cardBg: 'bg-white/60 backdrop-blur-lg',
    border: 'border-pink-200',
    text: 'text-pink-800',
    textSecondary: 'text-pink-600',
    textDark: 'text-pink-900',
    button: 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700',
    progress: 'bg-gradient-to-r from-pink-500 to-rose-600',
    buttonCorrect: 'bg-green-500 text-white border-green-500',
    buttonWrong: 'bg-red-500 text-white border-red-500',
    buttonBase: 'bg-white/80 hover:bg-white border border-pink-200 text-pink-700'
  } : {
    bg: 'bg-black',
    cardBg: 'bg-gray-800/50 backdrop-blur-lg border border-gray-700',
    border: 'border-gray-700',
    text: 'text-gray-200',
    textSecondary: 'text-cyan-400',
    textDark: 'text-white',
    button: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700',
    progress: 'bg-gradient-to-r from-cyan-500 to-blue-600',
    buttonCorrect: 'bg-green-500/80 text-white border-green-500',
    buttonWrong: 'bg-red-500/80 text-white border-red-500',
    buttonBase: 'bg-gray-700/80 hover:bg-gray-700 border border-gray-600 text-gray-200'
  };

  // Sayfa açıldığında en üste kaydır
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  // Soru değiştiğinde en üste kaydır
  useEffect(() => {
    if (gameState === 'playing') {
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 100);
    }
  }, [currentQuestionIndex, gameState]);

  const continueGame = useCallback(async (selectedDifficulty: Difficulty) => {
    setGameState('loading');
    try {
      const newExercises = await generateQuestionsForDifficulty(selectedDifficulty);
      if (newExercises.length === 0) throw new Error("No questions generated.");
      setExercises(newExercises);
      setCurrentQuestionIndex(0);
      setScore(0);
      setStreak(0);
      setSelectedAnswer(null);
      setGameState('playing');
    } catch (error) {
      console.error('Error starting game:', error);
      setGameState('menu'); 
    }
  }, []);

  const startGame = useCallback((selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    
    // Easy veya medium seçildiyse AI modal'ı göster
    if (selectedDifficulty === 'easy' || selectedDifficulty === 'medium') {
      const hasSeenAIModal = localStorage.getItem('preposition-ai-modal-seen');
      if (!hasSeenAIModal) {
        setPendingDifficulty(selectedDifficulty);
        setShowAIModal(true);
        return;
      }
    }
    
    continueGame(selectedDifficulty);
  }, [continueGame]);

  const handleAnswerSelect = (option: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(option);
    if (option === exercises[currentQuestionIndex]?.correctAnswer) {
      const bonus = Math.min(streak, 2);
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
      const userId = authService.getCurrentUserId();
      if (userId) {
        supabaseGameScoreService.addScore(userId, 'prepositionMastery', -2);
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
      const saveScore = async () => {
        try {
          const finalScore = score + (selectedAnswer === exercises[currentQuestionIndex]?.correctAnswer ? 2 : 0);
          await supabaseGameScoreService.saveScore('prepositionMastery', finalScore, 'all');
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
    setCurrentQuestionIndex(0);
    setScore(0);
    setStreak(0);
    setSelectedAnswer(null);
  };

  const renderMenu = () => (
    <div className={`text-center ${themeClasses.cardBg} rounded-2xl shadow-xl border ${themeClasses.border} p-8`}>
      <BrainCircuit className={`w-16 h-16 mx-auto mb-4 ${themeClasses.textSecondary}`} />
      <h1 className={`text-4xl font-black mb-2 ${themeClasses.textDark}`}>Preposition Mastery</h1>
      <p className={`text-lg mb-8 ${themeClasses.text}`}>Choose a difficulty to begin your training.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(['easy', 'medium', 'hard', 'mixed'] as Difficulty[]).map(level => (
          <motion.button
            key={level}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => startGame(level)}
            className={`p-6 rounded-2xl text-left ${themeClasses.buttonBase} transition-all shadow-sm`}
          >
            <h2 className={`text-xl font-bold capitalize ${themeClasses.textDark}`}>{level}</h2>
          </motion.button>
        ))}
      </div>
      {/* Tema Seçimi */}
      <div className="flex items-center justify-center gap-3 mt-8">
        <button
          onClick={() => setTheme('classic')}
          className={`w-8 h-8 rounded-full border-2 transition-all ${theme === 'classic' ? 'bg-gray-800 border-cyan-400' : 'bg-gray-600 border-gray-300'}`}
          title="Klasik Tema"
        />
        <button
          onClick={() => setTheme('blue')}
          className={`w-8 h-8 rounded-full border-2 transition-all ${theme === 'blue' ? 'bg-blue-500 border-blue-600' : 'bg-blue-300 border-blue-400'}`}
          title="Mavi Tema"
        />
        <button
          onClick={() => setTheme('pink')}
          className={`w-8 h-8 rounded-full border-2 transition-all ${theme === 'pink' ? 'bg-pink-400 border-pink-600' : 'bg-pink-300 border-pink-400'}`}
          title="Pembe Tema"
        />
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className={`text-center ${themeClasses.cardBg} rounded-2xl shadow-xl border ${themeClasses.border} p-8`}>
      <Loader2 className={`w-12 h-12 animate-spin ${themeClasses.textSecondary} mx-auto`} />
      <p className={`mt-4 text-lg ${themeClasses.text}`}>Yapay zeka ile sorular hazırlanıyor...</p>
    </div>
  );

  const renderFinished = () => (
    <div className={`text-center ${themeClasses.cardBg} rounded-2xl shadow-xl border ${themeClasses.border} p-8`}>
      <Trophy className={`w-16 h-16 mx-auto mb-4 ${theme === 'classic' ? 'text-amber-400' : theme === 'pink' ? 'text-pink-500' : 'text-amber-500'}`} />
      <h2 className={`text-4xl font-black mb-4 ${themeClasses.textSecondary}`}>Oyun Bitti!</h2>
      <div className={`p-4 rounded-xl mb-6 border ${theme === 'classic' ? 'bg-gray-800/50 border-gray-700' : theme === 'pink' ? 'bg-gradient-to-r from-pink-50 to-rose-50 border-pink-100' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100'}`}>
        <p className={`text-3xl font-bold ${themeClasses.textDark}`}>{score}</p>
        <p className={`mt-2 ${themeClasses.text}`}>{exercises.length} sorudan {Math.max(0, Math.floor(score / 2))} doğru</p>
      </div>
      {/* Tema Seçimi */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <button
          onClick={() => setTheme('classic')}
          className={`w-8 h-8 rounded-full border-2 transition-all ${theme === 'classic' ? 'bg-gray-800 border-cyan-400' : 'bg-gray-600 border-gray-300'}`}
          title="Klasik Tema"
        />
        <button
          onClick={() => setTheme('blue')}
          className={`w-8 h-8 rounded-full border-2 transition-all ${theme === 'blue' ? 'bg-blue-500 border-blue-600' : 'bg-blue-300 border-blue-400'}`}
          title="Mavi Tema"
        />
        <button
          onClick={() => setTheme('pink')}
          className={`w-8 h-8 rounded-full border-2 transition-all ${theme === 'pink' ? 'bg-pink-400 border-pink-600' : 'bg-pink-300 border-pink-400'}`}
          title="Pembe Tema"
        />
      </div>
      <div className="flex gap-3">
        <button 
          onClick={() => navigate(`/game-modes?unit=${currentUnit}&level=${currentLevel}`)} 
          className={`flex-1 flex items-center justify-center gap-2 text-center rounded-full px-6 py-3 text-lg font-semibold text-white shadow-lg bg-gray-500 hover:bg-gray-600 transition-all duration-200`}
        >
          <ChevronLeft className="w-5 h-5" />
          Geri Dön
        </button>
        <motion.button 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }}
          onClick={() => startGame(difficulty!)} 
          className={`flex-1 rounded-full px-6 py-3 text-lg font-semibold text-white shadow-lg ${themeClasses.button} transition-all duration-200`}
        >
          Tekrar Oyna
        </motion.button>
      </div>
    </div>
  );

  const renderPlaying = () => {
    if (!exercises[currentQuestionIndex]) return null;
    const { sentence, options, correctAnswer } = exercises[currentQuestionIndex];
    const isAnswered = selectedAnswer !== null;

    return (
      <div className="w-full">
        {/* HUD */}
        <div className={`flex justify-between items-center mb-4 ${themeClasses.cardBg} rounded-xl shadow border ${themeClasses.border} px-4 py-3`}>
          <div className="flex items-center gap-2">
            <button 
              onClick={resetGame} 
              className={`${themeClasses.textSecondary} hover:opacity-80 transition-all duration-200 p-1`}
              title="Oyun Modlarına Dön"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className={`${themeClasses.text} font-semibold`}>Skor: <span className={`font-bold text-xl ${themeClasses.textDark}`}>{score}</span></div>
          </div>
          <div className={`${themeClasses.textSecondary} text-sm font-medium`}>{currentQuestionIndex + 1} / {exercises.length}</div>
          <div className={`${themeClasses.textSecondary} text-sm font-medium`}>Seri: {streak}</div>
          {/* Tema Seçimi */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme('classic')}
              className={`w-6 h-6 rounded-full border-2 transition-all ${theme === 'classic' ? 'bg-gray-800 border-cyan-400' : 'bg-gray-600 border-gray-300'}`}
              title="Klasik Tema"
            />
            <button
              onClick={() => setTheme('blue')}
              className={`w-6 h-6 rounded-full border-2 transition-all ${theme === 'blue' ? 'bg-blue-500 border-blue-600' : 'bg-blue-300 border-blue-400'}`}
              title="Mavi Tema"
            />
            <button
              onClick={() => setTheme('pink')}
              className={`w-6 h-6 rounded-full border-2 transition-all ${theme === 'pink' ? 'bg-pink-400 border-pink-600' : 'bg-pink-300 border-pink-400'}`}
              title="Pembe Tema"
            />
          </div>
        </div>

        {/* Progress Bar */}
        <div className={`w-full ${themeClasses.cardBg} rounded-full h-3 mb-4 border ${themeClasses.border} shadow-sm`}>
          <motion.div 
            className={`h-full rounded-full ${themeClasses.progress}`}
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestionIndex + 1) / exercises.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Kart */}
        <motion.div 
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${themeClasses.cardBg} rounded-2xl shadow-xl border ${themeClasses.border} p-6 md:p-8`}
        >
          {/* Soru */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="text-center mb-6"
            >
              <p className={`text-3xl md:text-4xl font-bold ${themeClasses.textDark} p-4 rounded-xl ${themeClasses.cardBg} min-h-[6rem] flex items-center justify-center`}>
                {sentence.replace('___', '______')}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Seçenekler */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {options.map(option => {
              const isCorrect = option === correctAnswer;
              const isSelected = option === selectedAnswer;
              let buttonClass = themeClasses.buttonBase;
              if (isAnswered) {
                if (isCorrect) buttonClass = themeClasses.buttonCorrect;
                else if (isSelected) buttonClass = themeClasses.buttonWrong;
                else buttonClass = `${themeClasses.cardBg} border ${themeClasses.border} ${themeClasses.text} opacity-60`;
              }
              return (
                <motion.button
                  key={option}
                  onClick={() => handleAnswerSelect(option)}
                  whileHover={!isAnswered ? { scale: 1.02 } : {}}
                  whileTap={!isAnswered ? { scale: 0.98 } : {}}
                  disabled={isAnswered}
                  className={`flex items-center justify-between p-4 rounded-xl text-lg font-semibold border-2 transition-all w-full text-left ${buttonClass}`}
                >
                  <span>{option}</span>
                  {isAnswered && isCorrect && <Check className="w-6 h-6" />}
                  {isAnswered && isSelected && !isCorrect && <X className="w-6 h-6" />}
                </motion.button>
              );
            })}
          </div>

          {/* Next Button */}
          {isAnswered && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleNextQuestion}
              className={`w-full py-4 rounded-full text-white font-semibold shadow-lg ${themeClasses.button} transition-all duration-200`}
            >
              {currentQuestionIndex === exercises.length - 1 ? 'Oyunu Bitir' : 'Sonraki Soru'}
            </motion.button>
          )}
        </motion.div>
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
    <div className={`flex items-start justify-center min-h-screen p-1 sm:p-2 md:p-4 ${themeClasses.bg} pt-8 md:pt-12`}>
      <div className="w-full max-w-2xl mx-auto relative">
        {/* Puan Gösterimi */}
        {scoreChange && (
          <div
            key={scoreChange.key}
            className={`fixed top-1/3 left-1/2 -translate-x-1/2 z-50 pointer-events-none select-none animate-fade-in-out`}
            style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: scoreChange.value > 0 ? '#22c55e' : '#ef4444',
              textShadow: '0 2px 8px rgba(0,0,0,0.15)',
              opacity: '0.3'
            }}
          >
            {scoreChange.value > 0 ? `+${scoreChange.value}` : scoreChange.value}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={gameState}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* AI Service Modal - Easy/Medium seçiminden sonra göster */}
      <AIServiceModal
        isOpen={showAIModal}
        onClose={() => {
          setShowAIModal(false);
          localStorage.setItem('preposition-ai-modal-seen', 'true');
          // Modal kapandıktan sonra oyunu başlat
          if (pendingDifficulty) {
            continueGame(pendingDifficulty);
            setPendingDifficulty(null);
          }
        }}
        serviceName="Preposition Mastery"
      />
    </div>
  );
};

export default PrepositionMasteryGame;
