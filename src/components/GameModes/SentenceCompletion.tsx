import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Trophy, Loader2, AlertTriangle, RefreshCw, ArrowLeft, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { SentenceCompletionService, SentenceQuestion } from '../../services/sentenceCompletionService';
import { gameScoreService } from '../../services/gameScoreService';
import { WordDetail } from '../../data/words';
import { authService } from '../../services/authService';
import { awardPoints } from '../../services/scoreService';
import { soundService } from '../../services/soundService';

interface SentenceCompletionProps {
  words: WordDetail[];
}

const INITIAL_LOAD_COUNT = 5;

type GameStatus = 'loading' | 'playing' | 'answered' | 'completed' | 'error';

export const SentenceCompletion: React.FC<SentenceCompletionProps> = ({ words }) => {
  // State for game logic
  const [status, setStatus] = useState<GameStatus>('loading');
  const [questions, setQuestions] = useState<SentenceQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  
  // State for background loading
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [streak, setStreak] = useState(0);
  const [scoreChange, setScoreChange] = useState<null | { value: number, key: number }>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // --- DATA LOADING AND GAME SETUP ---
  const loadGame = useCallback(async () => {
    setStatus('loading');
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsLoadingMore(false);
    setStreak(0);
    setShowFeedback(false);
    setIsCorrect(null);

    const shuffleArray = (array: any[]) => {
      const newArray = [...array];
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[i], newArray[j]];
      }
      return newArray;
    };

    const wordList = shuffleArray(words).map(w => w.headword);
    SentenceCompletionService.setWordPool(wordList);

    const initialWords = wordList.slice(0, INITIAL_LOAD_COUNT);
    const remainingWords = wordList.slice(INITIAL_LOAD_COUNT);

    try {
      const initialQuestions = await SentenceCompletionService.generateSentenceCompletions(initialWords);
      if (initialQuestions.length === 0) throw new Error("AI failed to generate initial questions.");

      setQuestions(initialQuestions);
      setStatus('playing');

      if (remainingWords.length > 0) {
        setIsLoadingMore(true);
        SentenceCompletionService.generateSentenceCompletions(remainingWords).then(additionalQuestions => {
          setQuestions(prev => [...prev, ...additionalQuestions]);
          setIsLoadingMore(false);
        });
      }
    } catch (error) {
      console.error("Failed to load game:", error);
      setStatus('error');
    }
  }, [words]);

  useEffect(() => {
    loadGame();
  }, [loadGame]);

  // --- GAME ACTION HANDLERS ---
  const handleAnswerSelect = (option: string) => {
    if (status !== 'playing') return;

    setSelectedAnswer(option);
    setStatus('answered');
    setShowFeedback(true);

    const correct = option === questions[currentIndex].correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 2);
      setScoreChange({ value: +2, key: Date.now() });
      setStreak(prev => prev + 1);
      const bonus = Math.min(streak, 2);
      awardPoints('sentence-completion', 2 + bonus, words[0]?.unit || '1');
      soundService.playCorrect();
    } else {
      setScore(prev => prev - 2);
      setScoreChange({ value: -2, key: Date.now() });
      setStreak(0);
      awardPoints('sentence-completion', -2, words[0]?.unit || '1');
      soundService.playWrong();
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setStatus('playing');
      setShowFeedback(false);
      setIsCorrect(null);
    } else {
      setStatus('completed');
    }
  };

  const handlePreviousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setSelectedAnswer(null);
      setStatus('playing');
      setShowFeedback(false);
      setIsCorrect(null);
    }
  };

  const handlePlayAgain = () => {
    loadGame();
  };

  // --- UI HELPERS ---
  const getButtonClass = (option: string) => {
    if (status !== 'answered') {
      return 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-2 border-transparent hover:border-blue-300 transition-all duration-300 transform hover:scale-105';
    }

    if (option === questions[currentIndex].correctAnswer) {
      return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-2 border-green-300 shadow-lg';
    }

    if (option === selectedAnswer && option !== questions[currentIndex].correctAnswer) {
      return 'bg-gradient-to-r from-red-500 to-pink-600 text-white border-2 border-red-300 shadow-lg';
    }

    return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-2 border-gray-300 opacity-60';
  };

  const renderContent = () => {
    if (status === 'loading') return <InitialLoadingScreen />;
    if (status === 'error') return <ErrorDisplay onRetry={loadGame} />;
    if (status === 'completed') return <CompletedDisplay score={score} total={questions.length} onPlayAgain={handlePlayAgain} />;
    if (questions.length === 0) return <GameSkeleton />;

    const currentQuestion = questions[currentIndex];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
        {/* Header */}
        <Header score={score} currentIndex={currentIndex} totalQuestions={questions.length} />
        
        {/* Main Game Area */}
        <main className="flex-1 flex items-center justify-center p-4">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 w-full max-w-4xl"
          >
            {/* Question */}
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Boşluğu doğru kelime ile doldurun
              </h2>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                <p className="text-xl md:text-2xl text-white leading-relaxed">
                  {currentQuestion.sentence.split('___').map((part, index) => (
                    <React.Fragment key={index}>
                      {part}
                      {index < currentQuestion.sentence.split('___').length - 1 && (
                        <span className="inline-block w-32 h-8 mx-2 border-b-4 border-pink-400 bg-pink-100/20 rounded"></span>
                      )}
                    </React.Fragment>
                  ))}
                </p>
              </div>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={status !== 'playing'}
                  className={`${getButtonClass(option)} p-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed`}
                  whileHover={{ scale: status === 'playing' ? 1.05 : 1 }}
                  whileTap={{ scale: status === 'playing' ? 0.95 : 1 }}
                >
                  {option}
                </motion.button>
              ))}
            </div>

            {/* Feedback Animation */}
            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-center mb-6"
                >
                  {isCorrect ? (
                    <div className="flex items-center justify-center gap-3 text-green-400">
                      <CheckCircle className="w-8 h-8" />
                      <span className="text-2xl font-bold">Doğru!</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3 text-red-400">
                      <XCircle className="w-8 h-8" />
                      <span className="text-2xl font-bold">Yanlış!</span>
                      <span className="text-lg">Doğru cevap: {currentQuestion.correctAnswer}</span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center">
              <Button
                onClick={handlePreviousQuestion}
                disabled={currentIndex === 0}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Önceki
              </Button>

              <div className="text-white text-lg font-semibold">
                {currentIndex + 1} / {questions.length}
              </div>

              <Button
                onClick={handleNextQuestion}
                disabled={status !== 'answered'}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {currentIndex === questions.length - 1 ? 'Bitir' : 'Sonraki'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  };

  return renderContent();
};

// --- YARDIMCI BİLEŞENLER ---

const Header: React.FC<{ score: number; currentIndex: number; totalQuestions: number; }> = ({ score, currentIndex, totalQuestions }) => (
  <header className="bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 text-white p-4 shadow-lg border-b border-white/20">
    <div className="max-w-4xl mx-auto flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Trophy className="w-8 h-8 text-yellow-400" />
        <div>
          <div className="text-2xl font-bold">Puan: {score}</div>
          <div className="text-sm text-gray-300">Soru {currentIndex + 1} / {totalQuestions}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-32 bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>
    </div>
  </header>
);

// --- YENİ BAŞLANGIÇ YÜKLEME EKRANI BİLEŞENİ ---
const InitialLoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
    <div className="text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
      />
      <h2 className="text-2xl font-bold text-white mb-2">Oyun Yükleniyor</h2>
      <p className="text-gray-300">Cümleler hazırlanıyor...</p>
    </div>
  </div>
);

const GameSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
      <p className="text-white">Daha fazla soru yükleniyor...</p>
    </div>
  </div>
);

const ErrorDisplay: React.FC<{ onRetry: () => void; message?: string }> = ({ onRetry, message }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
    <div className="text-center bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
      <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-white mb-4">Hata Oluştu</h2>
      <p className="text-gray-300 mb-6">{message || "Oyun yüklenirken bir hata oluştu."}</p>
      <Button
        onClick={onRetry}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
      >
        <RefreshCw className="w-5 h-5 mr-2" />
        Tekrar Dene
      </Button>
    </div>
  </div>
);

const CompletedDisplay: React.FC<{ score: number; total: number; onPlayAgain: () => void; }> = ({ score, total, onPlayAgain }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-md w-full"
    >
      <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
      <h2 className="text-3xl font-bold text-white mb-4">Oyun Tamamlandı!</h2>
      <div className="text-2xl font-bold text-blue-400 mb-6">
        Puanınız: {score} / {total * 2}
      </div>
      <div className="text-lg text-gray-300 mb-8">
        Başarı oranı: {Math.round((score / (total * 2)) * 100)}%
      </div>
      <Button
        onClick={onPlayAgain}
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105"
      >
        <RefreshCw className="w-6 h-6 mr-2" />
        Tekrar Oyna
      </Button>
    </motion.div>
  </div>
);
