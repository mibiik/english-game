import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SentenceCompletionService, SentenceQuestion } from '../../services/sentenceCompletionService';
import { Loader2, AlertTriangle, Trophy, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';

interface SentenceCompletionProps {
  words: { headword: string }[];
}

type GameStatus = 'loading' | 'playing' | 'answered' | 'completed' | 'error';

export const SentenceCompletion: React.FC<SentenceCompletionProps> = ({ words }) => {
  const [status, setStatus] = useState<GameStatus>('loading');
  const [questions, setQuestions] = useState<SentenceQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const loadNewQuestions = useCallback(async () => {
    setStatus('loading');
    setSelectedAnswer(null);
    setCurrentIndex(0);
    setScore(0);

    const wordList = words.map(w => w.headword);
    SentenceCompletionService.setWordPool(wordList); // Kelime havuzunu ayarla

    const generatedQuestions = await SentenceCompletionService.generateSentenceCompletions(wordList);

    if (generatedQuestions.length > 0) {
      setQuestions(generatedQuestions);
      setStatus('playing');
    } else {
      setStatus('error');
    }
  }, [words]);

  useEffect(() => {
    loadNewQuestions();
  }, [loadNewQuestions]);

  const handleAnswerSelect = (option: string) => {
    if (status !== 'playing') return;

    setSelectedAnswer(option);
    setStatus('answered');

    if (option === questions[currentIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setStatus('playing');
        setSelectedAnswer(null);
      } else {
        setStatus('completed');
      }
    }, 1500);
  };

  const getButtonClass = (option: string) => {
    if (status !== 'answered') {
      return 'bg-white hover:bg-blue-50 border-gray-300';
    }
    if (option === questions[currentIndex].correctAnswer) {
      return 'bg-green-500 text-white border-green-500 transform scale-105';
    }
    if (option === selectedAnswer) {
      return 'bg-red-500 text-white border-red-500';
    }
    return 'bg-white opacity-60 border-gray-300';
  };

  // --- RENDER FUNCTIONS ---

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center p-8 text-center h-80">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
      <h2 className="text-xl font-semibold text-gray-700">AI is preparing your questions...</h2>
      <p className="text-gray-500">This may take a moment.</p>
    </div>
  );

  const renderError = () => (
    <div className="flex flex-col items-center justify-center p-8 text-center h-80 bg-red-50 rounded-lg">
      <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
      <h2 className="text-xl font-bold text-red-800">Failed to Load Questions</h2>
      <p className="text-red-600 mb-6">The AI service might be unavailable. Please try again.</p>
      <Button onClick={loadNewQuestions} className="bg-red-500 hover:bg-red-600">
        <RefreshCw className="mr-2 h-4 w-4" /> Retry
      </Button>
    </div>
  );

  const renderCompleted = () => (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center p-8 text-center h-80">
      <Trophy className="w-16 h-16 text-yellow-500 mb-4" />
      <h2 className="text-3xl font-bold text-gray-800">Game Over!</h2>
      <p className="text-xl text-gray-600 mt-2">Your final score is: <span className="font-bold text-blue-600">{score} / {questions.length}</span></p>
      <Button onClick={loadNewQuestions} className="mt-8">
        <RefreshCw className="mr-2 h-4 w-4" /> Play Again
      </Button>
    </motion.div>
  );

  const renderGame = () => {
    if (!questions[currentIndex]) return renderError(); // Sorular bittiyse veya yoksa hata göster
    const { sentence, options } = questions[currentIndex];

    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500">Question {currentIndex + 1} of {questions.length}</p>
          <p className="text-lg font-semibold text-gray-800">Fill in the blank:</p>
        </div>
        <p className="text-2xl md:text-3xl text-center font-serif bg-gray-100 p-6 rounded-lg shadow-inner min-h-[100px]">
            {sentence.replace('_____', '_______')}
          </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {options.map((option) => (
            <motion.button
              key={option}
              onClick={() => handleAnswerSelect(option)}
              disabled={status === 'answered'}
              className={`w-full p-4 rounded-lg font-semibold text-lg border-2 shadow-sm transition-all duration-300 ${getButtonClass(option)}`}
              whileHover={{ scale: status === 'playing' ? 1.05 : 1 }}
            >
              {option}
            </motion.button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div key={status} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {status === 'loading' && renderLoading()}
          {status === 'error' && renderError()}
          {status === 'completed' && renderCompleted()}
          {(status === 'playing' || status === 'answered') && renderGame()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};



