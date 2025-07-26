import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Trophy, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
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

  // --- DATA LOADING AND GAME SETUP ---
  const loadGame = useCallback(async () => {
    setStatus('loading');
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsLoadingMore(false);
    setStreak(0); // Streak'i sıfırla

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

    if (option === questions[currentIndex].correctAnswer) {
      setScore(prev => prev + 2);
      setScoreChange({ value: +2, key: Date.now() });
      setStreak(prev => prev + 1);
      const bonus = Math.min(streak, 2); // Maksimum 2 bonus puan
      awardPoints('sentence-completion', 2 + bonus, words[0]?.unit || '1');
      soundService.playCorrect();
    } else {
      setScore(prev => prev - 2);
      setScoreChange({ value: -2, key: Date.now() });
      setStreak(0);
      awardPoints('sentence-completion', -2, words[0]?.unit || '1');
      soundService.playWrong();
    }

    setTimeout(() => {
      const isLastQuestion = currentIndex === words.length - 1;
      if (isLastQuestion) {
        // Oyun bitti, skoru kaydet
        const unit = words[0]?.unit || '1';
        try {
          gameScoreService.saveScore('sentence-completion', score + (option === questions[currentIndex].correctAnswer ? 1 : 0), unit);
        } catch (error) {
          console.error('Skor kaydedilirken hata:', error);
        }
        setStatus('completed');
      } else {
        setCurrentIndex(prev => prev + 1);
        setStatus('playing');
        setSelectedAnswer(null);
      }
    }, 1500);
  };

  // --- UI RENDER FUNCTIONS ---
  const getButtonClass = (option: string) => {
    // BURADA DEĞİŞİKLİK YAPILDI: Şıkların varsayılan ve pasif hallerinde metin rengi belirtildi.
    if (status !== 'answered') return 'bg-white hover:bg-blue-50 text-gray-900'; 
    if (option === questions[currentIndex].correctAnswer) return 'bg-green-100 border-green-500 text-green-800';
    if (option === selectedAnswer) return 'bg-red-100 border-red-500 text-red-800';
    return 'bg-white opacity-60 text-gray-900'; // Seçili olmayan ve doğru olmayan şıklar için
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return <InitialLoadingScreen />; // Yükleme ekranı burada kullanılıyor
      case 'error':
        return <ErrorDisplay onRetry={loadGame} />;
      case 'completed':
        return <CompletedDisplay score={score} total={words.length} onPlayAgain={loadGame} />;
      case 'playing':
      case 'answered':
        const question = questions[currentIndex];
        // Sadece soru yüklenene kadar GameSkeleton'ı koruyun (arka plan yüklemesi için)
        if (!question && isLoadingMore) return <GameSkeleton />; 
        if (!question) return <ErrorDisplay onRetry={loadGame} message="Question not found. Try again?" />;
        
        return (
          <motion.div 
            key={currentIndex} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <p className="text-2xl md:text-3xl text-center font-serif bg-gray-100 p-6 rounded-lg shadow-inner min-h-[100px] mb-8">
              {question.sentence}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={status === 'answered'}
                  className={`w-full text-left justify-start p-4 h-auto text-base border-2 transition-all duration-200 ${getButtonClass(option)}`}
                >
                  <span className="font-bold mr-3">{String.fromCharCode(65 + index)}</span>
                  {option}
                </Button>
              ))}
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  // --- MAIN COMPONENT LAYOUT ---
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen flex flex-col justify-center items-center">
      {/* Puan Gösterimi */}
      {scoreChange && (
        <div key={scoreChange.key} className={`fixed top-1/3 left-1/2 -translate-x-1/2 z-50 pointer-events-none select-none animate-fade-in-out`}
          style={{ fontSize: '2.5rem', fontWeight: 'bold', color: scoreChange.value > 0 ? '#22c55e' : '#ef4444', textShadow: '0 2px 8px rgba(0,0,0,0.15)', opacity: '0.3' }}>
          {scoreChange.value > 0 ? `+${scoreChange.value}` : scoreChange.value}
        </div>
      )}
      <div className="w-full max-w-2xl">
        <Header score={score} currentIndex={currentIndex} totalQuestions={words.length} />
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md mt-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// --- YARDIMCI BİLEŞENLER ---

const Header: React.FC<{ score: number; currentIndex: number; totalQuestions: number; }> = ({ score, currentIndex, totalQuestions }) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-2 text-gray-600">
      <h1 className="text-xl font-bold text-gray-800">Sentence Completion</h1>
      <p className="font-semibold">Score: <span className="text-blue-600">{score}</span></p>
    </div>
    <p className="text-right text-sm text-gray-500 mb-2">Question {Math.min(currentIndex + 1, totalQuestions)} of {totalQuestions}</p>
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <motion.div
        className="bg-blue-600 h-2.5 rounded-full"
        animate={{ width: `${(currentIndex / totalQuestions) * 100}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  </div>
);

// --- YENİ BAŞLANGIÇ YÜKLEME EKRANI BİLEŞENİ ---
const InitialLoadingScreen: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md min-h-[300px]">
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
      className="flex flex-col items-center"
    >
      <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-4" />
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Loading your game...</h2>
      <p className="text-gray-600 text-center">Please wait while we prepare the questions.</p>
    </motion.div>
  </div>
);

const GameSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-12 bg-gray-200 rounded w-full mb-8"></div>
    <div className="space-y-4">
      <div className="h-12 bg-gray-200 rounded w-full"></div>
      <div className="h-12 bg-gray-200 rounded w-full"></div>
      <div className="h-12 bg-gray-200 rounded w-full"></div>
      <div className="h-12 bg-gray-200 rounded w-full"></div>
    </div>
  </div>
);

const ErrorDisplay: React.FC<{ onRetry: () => void; message?: string }> = ({ onRetry, message }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
    <h2 className="text-xl font-bold text-red-800">Failed to Load Questions</h2>
    <p className="text-red-600 mb-6">{message || "The AI service might be unavailable. Please try again."}</p>
    <Button onClick={onRetry} className="bg-red-500 hover:bg-red-600">
      <RefreshCw className="mr-2 h-4 w-4" /> Retry
    </Button>
  </div>
);

const CompletedDisplay: React.FC<{ score: number; total: number; onPlayAgain: () => void; }> = ({ score, total, onPlayAgain }) => (
  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center p-8 text-center">
    <Trophy className="w-16 h-16 text-yellow-500 mb-4" />
    <h2 className="text-3xl font-bold text-gray-800">Game Over!</h2>
    <p className="text-xl text-gray-600 mt-2">Your final score is: <span className="font-bold text-blue-600">{score} / {total}</span></p>
    <Button onClick={onPlayAgain} className="mt-8">
      <RefreshCw className="mr-2 h-4 w-4" /> Play Again
    </Button>
  </motion.div>
);
