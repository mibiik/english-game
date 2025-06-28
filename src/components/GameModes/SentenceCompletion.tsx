import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { WordDetail } from '../../data/words';
import { SentenceCompletionService, SentenceQuestion } from '../../services/sentenceCompletionService';
import { RefreshCw, CheckCircle, XCircle, PlayCircle, Loader2, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SentenceCompletionProps {
  words: WordDetail[];
  unit: string;
}

const BLANK_PLACEHOLDER = '______';

export const SentenceCompletion: React.FC<SentenceCompletionProps> = ({ words, unit }) => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<SentenceQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  const sentenceService = useMemo(() => SentenceCompletionService.getInstance(), []);

  const shuffleArray = useCallback(<T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  const fetchQuestionsAndStartGame = useCallback(async () => {
    if (words.length === 0) {
        setError("Bu ünite için kelime bulunamadı.");
        return;
    }

    setLoading(true);
    setGameStarted(true);
    setError(null);
    setGameCompleted(false);
    setScore(0);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);

    const wordTexts = words.map(word => word.headword);
    
    try {
      const generatedQuestions = await sentenceService.generateSentenceCompletions(wordTexts);
      
      if (generatedQuestions.length === 0) {
        setError('Yapay zeka bu kelimelerle soru oluşturamadı. Lütfen tekrar deneyin.');
        setLoading(false);
        return;
      }

      const questionsWithShuffledOptions = generatedQuestions.map(q => ({
        ...q,
        options: shuffleArray(q.options)
      }));

      setQuestions(questionsWithShuffledOptions);
    } catch (error: any) {
      console.error('Oyun başlatılırken hata:', error);
      setError(error.message || 'Cümleler oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, [words, sentenceService, shuffleArray]);

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    const correct = answer === questions[currentQuestionIndex].correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore(prevScore => prevScore + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setGameCompleted(true);
      }
    }, correct ? 1200 : 2000);
  };
  
  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] bg-gray-950 text-white p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-gray-900 p-10 rounded-2xl shadow-2xl border border-gray-800 max-w-lg"
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
             <PlayCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold mb-2 text-white">Boşluk Doldurma</h1>
          <p className="text-gray-400 mb-8">Yapay zeka ile hazırlanan cümlelerdeki boşlukları doğru kelimelerle tamamla.</p>
          <button
            onClick={fetchQuestionsAndStartGame}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-lg font-bold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-green-500/30 active:scale-95"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Oyuna Başla'}
          </button>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] bg-gray-950 text-white p-4">
        <Loader2 className="w-12 h-12 animate-spin text-green-400 mb-4" />
        <p className="text-lg text-gray-300 font-medium">Yapay zeka cümleleri hazırlıyor...</p>
        <p className="text-sm text-gray-500">Bu işlem biraz zaman alabilir.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] bg-gray-950 text-white p-4">
        <div className="text-center bg-gray-900 p-10 rounded-2xl shadow-2xl border border-red-800 max-w-lg">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Bir Sorun Oluştu</h2>
          <p className="text-red-400 text-center mb-6">{error}</p>
          <button
            onClick={fetchQuestionsAndStartGame}
            className="w-full py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (gameCompleted) {
    const accuracy = Math.round((score / words.length) * 100);
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-lg mx-auto bg-gray-900 rounded-3xl p-8 text-center border border-gray-800 w-full"
        >
          <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Oyun Bitti!</h2>
          <p className="text-gray-400 mb-8">Harika bir iş çıkardın.</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-800 rounded-xl p-4">
              <p className="text-3xl font-bold text-green-400">{score}/{words.length}</p>
              <p className="text-sm text-gray-400">Skor</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4">
              <p className="text-3xl font-bold text-blue-400">{accuracy}%</p>
              <p className="text-sm text-gray-400">Başarı</p>
            </div>
          </div>

          <button 
            onClick={fetchQuestionsAndStartGame} 
            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium transition-colors"
          >
            Tekrar Oyna
          </button>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] bg-gray-950 text-white p-4">
         <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
         <p className="text-lg text-center text-red-400">Sorular yüklenemedi.</p>
      </div>
    );
  }

  const progress = ((currentQuestionIndex + 1) / words.length) * 100;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-2xl font-bold text-green-400">Skor: {score}</div>
          <div className="text-lg text-gray-400">
            {currentQuestionIndex + 1} / {words.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-800 rounded-full h-2.5 mb-8">
          <motion.div
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2.5 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Soru Kartı */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-800 mb-8"
          >
            <p className="text-2xl md:text-3xl text-center text-gray-200 leading-relaxed">
              {currentQuestion.sentence.replace(currentQuestion.correctAnswer, BLANK_PLACEHOLDER)}
            </p>
          </motion.div>
        </AnimatePresence>
        
        {/* Seçenekler */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedAnswer === option;
            const isTheCorrectAnswer = option === currentQuestion.correctAnswer;
            
            let buttonClass = 'border-gray-700 bg-gray-800 hover:bg-gray-700 hover:border-gray-600';
            if (isSelected) {
              buttonClass = isCorrect ? 'border-green-500 bg-green-500/20 text-green-300 scale-105' : 'border-red-500 bg-red-500/20 text-red-300 scale-105';
            } else if (selectedAnswer !== null && isTheCorrectAnswer) {
              buttonClass = 'border-green-500 bg-green-500/20 text-green-300';
            }

            return (
              <motion.button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                disabled={selectedAnswer !== null}
                className={`w-full p-5 rounded-xl text-lg font-semibold border-2 transition-all duration-200 transform disabled:cursor-not-allowed ${buttonClass}`}
                whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
              >
                {option}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
