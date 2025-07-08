import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw, CheckCircle, XCircle, Trophy, Palette, Sun, Moon, ChevronLeft, ChevronRight } from 'lucide-react';
import { WordDetail } from '../../data/words';
import { SentenceCompletionService, SentenceQuestion } from '../../services/sentenceCompletionService';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';

interface SentenceCompletionProps {
  words: WordDetail[];
}

type GameState = 'loading' | 'playing' | 'answered' | 'completed' | 'error';
type Theme = 'blue' | 'pink' | 'classic';

const BLANK_PLACEHOLDER = '______';

const getThemeClasses = (theme: Theme) => {
    switch (theme) {
        case 'blue':
            return {
                bg: 'bg-gradient-to-br from-sky-100 to-blue-200',
                cardBg: 'bg-white/60 backdrop-blur-lg',
                text: 'text-slate-800',
                headerText: 'text-blue-700',
                buttonBase: 'bg-white/80 hover:bg-white border border-blue-200 text-slate-700',
                buttonCorrect: 'bg-green-500 text-white border-green-500',
                buttonWrong: 'bg-red-500 text-white border-red-500',
                progressFill: 'bg-blue-500',
                navButton: 'bg-white/50 hover:bg-white/90 text-blue-700'
            };
        case 'pink':
            return {
                bg: 'bg-gradient-to-br from-rose-100 to-pink-200',
                cardBg: 'bg-white/60 backdrop-blur-lg',
                text: 'text-slate-800',
                headerText: 'text-pink-700',
                buttonBase: 'bg-white/80 hover:bg-white border border-pink-200 text-slate-700',
                buttonCorrect: 'bg-green-500 text-white border-green-500',
                buttonWrong: 'bg-red-500 text-white border-red-500',
                progressFill: 'bg-pink-500',
                navButton: 'bg-white/50 hover:bg-white/90 text-pink-700'
            };
        default: // classic
            return {
                bg: 'bg-gradient-to-br from-gray-900 to-black',
                cardBg: 'bg-gray-800/50 backdrop-blur-lg border border-gray-700',
                text: 'text-gray-200',
                headerText: 'text-cyan-400',
                buttonBase: 'bg-gray-700/80 hover:bg-gray-700 border border-gray-600 text-gray-200',
                buttonCorrect: 'bg-green-500/80 text-white border-green-500',
                buttonWrong: 'bg-red-500/80 text-white border-red-500',
                progressFill: 'bg-cyan-500',
                navButton: 'bg-gray-700 hover:bg-gray-600 text-cyan-400'
            };
    }
};

const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

export const SentenceCompletion: React.FC<SentenceCompletionProps> = ({ words }) => {
  const [questions, setQuestions] = useState<SentenceQuestion[]>([]);
  const [totalQuestionCount, setTotalQuestionCount] = useState(0);
  const [gameState, setGameState] = useState<GameState>('loading');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [theme, setTheme] = useState<Theme>('blue');
  
  const advanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const backgroundFetchInitiated = useRef(false);
  const themeClasses = getThemeClasses(theme);

  const loadQuestions = useCallback(async (isInitialLoad = true) => {
    if (words.length === 0) {
      setErrorMessage('Bu ünite için soru oluşturulacak kelime bulunamadı.');
      setGameState('error');
      return;
    }
    
    if (isInitialLoad) {
        setGameState('loading');
        setTotalQuestionCount(words.length);
        setCurrentIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setQuestions([]);
        backgroundFetchInitiated.current = false;
    }

    try {
        const shuffledWords = isInitialLoad ? shuffleArray(words) : words;
        const initialWords = shuffledWords.slice(0, 10);
        const remainingWords = shuffledWords.slice(10);

        const initialQuestions = await SentenceCompletionService.generateSentenceCompletions(initialWords.map(w => w.headword));

        if (initialQuestions.length === 0 && isInitialLoad) {
            setErrorMessage('Yapay zeka bu kelimelerle soru oluşturamadı.');
            setGameState('error');
            return;
        }

        setQuestions(initialQuestions);
        setGameState('playing');

        if (remainingWords.length > 0 && !backgroundFetchInitiated.current) {
            backgroundFetchInitiated.current = true;
            SentenceCompletionService.generateSentenceCompletions(remainingWords.map(w => w.headword))
                .then(remainingQuestions => {
                    setQuestions(prev => shuffleArray([...prev, ...remainingQuestions]));
                })
                .catch(err => {
                    console.error("Arka plan soru yükleme hatası:", err);
                });
        }

    } catch (error) {
      console.error('Failed to load questions:', error);
      setErrorMessage('Sorular yüklenirken bir hata oluştu.');
      setGameState('error');
    }
  }, [words]);

  useEffect(() => {
    loadQuestions(true);
    return () => {
        if (advanceTimeoutRef.current) {
            clearTimeout(advanceTimeoutRef.current);
        }
    };
  }, [loadQuestions]);

  const handleNextQuestion = useCallback(() => {
    if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setGameState('playing');
    } else {
      setGameState('completed');
    }
  }, [currentIndex, questions.length]);

  const handlePreviousQuestion = () => {
    if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
    if (currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setGameState('playing');
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (gameState !== 'playing') return;

    const currentQuestion = questions[currentIndex];
    const correct = answer === currentQuestion.correctAnswer;

    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setGameState('answered');

    if (correct) {
      setScore(prev => prev + 1);
    }

    advanceTimeoutRef.current = setTimeout(() => {
        handleNextQuestion();
    }, 2000);
  };
  
  const currentQuestion = questions[currentIndex];

  const renderContent = () => {
    if (gameState === 'loading' || !currentQuestion) {
        return (
            <div className="flex flex-col items-center justify-center text-center p-8 h-64">
              <Loader2 className={`w-12 h-12 animate-spin ${themeClasses.headerText}`} />
              <p className={`mt-4 text-lg font-semibold ${themeClasses.text}`}>Sorular hazırlanıyor...</p>
            </div>
          );
    }
  
    if (gameState === 'error') {
        return (
            <div className="flex flex-col items-center justify-center text-center p-8 h-64 bg-red-500/10 rounded-2xl">
              <XCircle className="w-16 h-16 text-red-400" />
              <p className={`mt-4 text-xl font-bold ${themeClasses.text}`}>Bir Hata Oluştu</p>
              <p className="text-red-300 mt-2">{errorMessage}</p>
              <Button onClick={() => loadQuestions(true)} className="mt-6 bg-red-500 hover:bg-red-600 text-white">
                <RefreshCw className="w-4 h-4 mr-2" /> Tekrar Dene
              </Button>
            </div>
          );
    }
  
    if (gameState === 'completed') {
        return (
            <div className="flex flex-col items-center justify-center text-center p-8 h-64 bg-green-500/10 rounded-2xl">
              <Trophy className="w-20 h-20 text-yellow-400 drop-shadow-lg" />
              <p className={`mt-4 text-3xl font-black ${themeClasses.text}`}>Tebrikler!</p>
              <p className={`text-xl mt-2 ${themeClasses.text}`}>
                Skorun: <span className={`font-bold ${themeClasses.headerText}`}>{score} / {questions.length}</span>
              </p>
              <Button onClick={() => loadQuestions(true)} className="mt-8 bg-blue-500 hover:bg-blue-600 text-white">
                <RefreshCw className="w-4 h-4 mr-2" /> Yeniden Başla
              </Button>
            </div>
          );
    }

    return (
        <>
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="p-6 md:p-8 rounded-2xl shadow-lg min-h-[120px] flex items-center justify-center"
                >
                    <p className={`text-xl md:text-2xl text-center leading-relaxed font-medium ${themeClasses.text}`}>
                        {currentQuestion.sentence.split('___')[0]}
                        <span className="inline-block bg-black/10 dark:bg-white/10 px-4 py-1 rounded-md mx-2 text-transparent">
                            {BLANK_PLACEHOLDER}
                        </span>
                        {currentQuestion.sentence.split('___')[1]}
                    </p>
                </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between items-center my-4 md:my-6">
                <Button onClick={handlePreviousQuestion} disabled={currentIndex === 0 || gameState === 'answered'} className={`px-3 py-2 h-auto shadow-md ${themeClasses.navButton}`}>
                    <ChevronLeft className="w-5 h-5" />
                </Button>
                <div className={`text-sm font-bold ${themeClasses.text}`}>
                    {currentIndex + 1} / {totalQuestionCount > 0 ? totalQuestionCount : questions.length}
                </div>
                <Button onClick={handleNextQuestion} disabled={currentIndex === questions.length - 1 || gameState === 'answered'} className={`px-3 py-2 h-auto shadow-md ${themeClasses.navButton}`}>
                    <ChevronRight className="w-5 h-5" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedAnswer === option;
                    const isTheCorrectAnswer = option === currentQuestion.correctAnswer;
                    
                    let buttonClass = themeClasses.buttonBase;
                    let icon = null;

                    if (gameState === 'answered') {
                        if (isTheCorrectAnswer) {
                            buttonClass = themeClasses.buttonCorrect;
                            icon = <CheckCircle className="w-5 h-5" />;
                        } else if (isSelected) {
                            buttonClass = themeClasses.buttonWrong;
                            icon = <XCircle className="w-5 h-5" />;
                        } else {
                            buttonClass += ' opacity-40 cursor-not-allowed';
                        }
                    }

                    return (
                        <motion.button
                            key={index}
                            onClick={() => handleAnswerSelect(option)}
                            disabled={gameState === 'answered'}
                            className={`p-4 rounded-xl text-lg font-semibold transition-all duration-300 w-full flex items-center justify-between shadow-md ${buttonClass}`}
                            whileHover={{ scale: gameState === 'playing' ? 1.03 : 1, y: gameState === 'playing' ? -2 : 0 }}
                            whileTap={{ scale: gameState === 'playing' ? 0.98 : 1 }}
                        >
                            <span>{option}</span>
                            <AnimatePresence>
                                {icon && (
                                    <motion.div initial={{scale:0.5, opacity: 0}} animate={{scale:1, opacity: 1}} exit={{scale:0.5, opacity: 0}}>
                                        {icon}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    );
                })}
            </div>

            <AnimatePresence>
                {gameState === 'answered' && !isCorrect && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 text-center"
                    >
                         <p className={`text-md font-semibold ${themeClasses.text}`}>
                            Doğru Cevap: <strong className={themeClasses.headerText}>{currentQuestion.correctAnswer}</strong>
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
  };

  return (
    <div className={`w-full min-h-screen p-2 md:p-6 transition-colors duration-500 ${themeClasses.bg}`}>
        <div className={`w-full max-w-3xl mx-auto p-4 md:p-8 rounded-2xl shadow-2xl transition-colors duration-500 ${themeClasses.cardBg}`}>
            <div className="flex justify-between items-center mb-4">
                <h2 className={`text-2xl md:text-3xl font-bold ${themeClasses.headerText}`}>Boşluk Doldurma</h2>
                <div className="flex items-center gap-2">
                    <button onClick={() => setTheme('blue')} className={`w-8 h-8 rounded-full bg-blue-500 transition-all duration-300 ${theme === 'blue' ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`} aria-label="Mavi Tema"></button>
                    <button onClick={() => setTheme('pink')} className={`w-8 h-8 rounded-full bg-pink-500 transition-all duration-300 ${theme === 'pink' ? 'ring-2 ring-offset-2 ring-pink-500' : ''}`} aria-label="Pembe Tema"></button>
                    <button onClick={() => setTheme('classic')} className={`w-8 h-8 rounded-full bg-gray-800 border border-gray-600 transition-all duration-300 ${theme === 'classic' ? 'ring-2 ring-offset-2 ring-gray-500' : ''}`} aria-label="Karanlık Tema"></button>
                </div>
            </div>
            <Progress value={(currentIndex / (totalQuestionCount - 1)) * 100} className="h-1.5" progressClassName={themeClasses.progressFill} />
            <div className="mt-6">
                {renderContent()}
            </div>
        </div>
    </div>
  );
}; 