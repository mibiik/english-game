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
      return 'bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 shadow-sm';
    }

    if (option === questions[currentIndex].correctAnswer) {
      return 'bg-green-50 border-green-500 text-green-800 shadow-md';
    }

    if (option === selectedAnswer && option !== questions[currentIndex].correctAnswer) {
      return 'bg-red-50 border-red-500 text-red-800 shadow-md';
    }

    return 'bg-white border-gray-200 text-gray-600 opacity-60';
  };

  const renderContent = () => {
    if (status === 'loading') return <InitialLoadingScreen />;
    if (status === 'error') return <ErrorDisplay onRetry={loadGame} />;
    if (status === 'completed') return <CompletedDisplay score={score} total={questions.length} onPlayAgain={handlePlayAgain} />;
    if (questions.length === 0) return <GameSkeleton />;

    const currentQuestion = questions[currentIndex];

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col">
        {/* Header */}
        <Header score={score} currentIndex={currentIndex} totalQuestions={questions.length} />
        
        {/* Main Game Area */}
        <main className="flex-1 flex items-center justify-center p-4">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl"
          >
            {/* Question */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Boşluğu doğru kelime ile doldurun
              </h2>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <p className="text-xl text-gray-700 leading-relaxed">
                  {currentQuestion.sentence.split('___').map((part, index) => (
                    <React.Fragment key={index}>
                      {part}
                      {index < currentQuestion.sentence.split('___').length - 1 && (
                        <span className="inline-block w-24 h-8 mx-2 border-b-2 border-blue-400 bg-blue-50 rounded"></span>
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
                  className={`${getButtonClass(option)} p-4 rounded-lg font-medium text-lg transition-all duration-300 disabled:cursor-not-allowed`}
                  whileHover={{ scale: status === 'playing' ? 1.02 : 1 }}
                  whileTap={{ scale: status === 'playing' ? 0.98 : 1 }}
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
                    <div className="flex items-center justify-center gap-3 text-green-600">
                      <CheckCircle className="w-6 h-6" />
                      <span className="text-xl font-bold">Doğru!</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3 text-red-600">
                      <XCircle className="w-6 h-6" />
                      <span className="text-xl font-bold">Yanlış!</span>
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
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Önceki
              </Button>

              <div className="text-gray-600 text-lg font-medium">
                {currentIndex + 1} / {questions.length}
              </div>

              <Button
                onClick={handleNextQuestion}
                disabled={status !== 'answered'}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {currentIndex === questions.length - 1 ? 'Bitir' : 'Sonraki'}
                <ArrowRight className="w-4 h-4 ml-2" />
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
  <header className="bg-white shadow-sm border-b border-gray-200 p-4">
    <div className="max-w-2xl mx-auto flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Trophy className="w-6 h-6 text-yellow-500" />
        <div className="text-lg font-bold text-gray-800">{score} / {totalQuestions * 2}</div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-24 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>
    </div>
  </header>
);

const InitialLoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center">
    <div className="text-center bg-white rounded-xl shadow-lg p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
      />
      <h2 className="text-xl font-bold text-gray-800 mb-2">Oyun Yükleniyor</h2>
      <p className="text-gray-600">Cümleler hazırlanıyor...</p>
    </div>
  </div>
);

const GameSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center">
    <div className="text-center bg-white rounded-xl shadow-lg p-8">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
      <p className="text-gray-600">Daha fazla soru yükleniyor...</p>
    </div>
  </div>
);

const ErrorDisplay: React.FC<{ onRetry: () => void; message?: string }> = ({ onRetry, message }) => (
  <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center">
    <div className="text-center bg-white rounded-xl shadow-lg p-8 max-w-md">
      <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-gray-800 mb-4">Hata Oluştu</h2>
      <p className="text-gray-600 mb-6">{message || "Oyun yüklenirken bir hata oluştu."}</p>
      <Button
        onClick={onRetry}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Tekrar Dene
      </Button>
    </div>
  </div>
);

const CompletedDisplay: React.FC<{ score: number; total: number; onPlayAgain: () => void; }> = ({ score, total, onPlayAgain }) => (
  <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center bg-white rounded-xl shadow-lg p-8 max-w-md w-full"
    >
      <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Oyun Tamamlandı!</h2>
      <div className="text-xl font-bold text-blue-600 mb-6">
        Puanınız: {score} / {total * 2}
      </div>
      <div className="text-lg text-gray-600 mb-8">
        Başarı oranı: {Math.round((score / (total * 2)) * 100)}%
      </div>
      <Button
        onClick={onPlayAgain}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
      >
        <RefreshCw className="w-5 h-5 mr-2" />
        Tekrar Oyna
      </Button>
    </motion.div>
  </div>
);
