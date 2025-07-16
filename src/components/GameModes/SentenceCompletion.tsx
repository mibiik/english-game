import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw, Check, X, Trophy, Palette, ArrowLeft, ArrowRight, Sparkles, Brain, BookOpen } from 'lucide-react';
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
    // Mevcut getThemeClasses fonksiyonu burada kalabilir
    // Veya yeni tasarıma göre renkleri güncelleyebiliriz
    switch (theme) {
        case 'blue':
            return {
                bg: 'bg-gradient-to-br from-sky-50 to-indigo-100',
                cardBg: 'bg-white/70 backdrop-blur-xl border border-white/20',
                text: 'text-slate-800',
                headerText: 'text-blue-800',
                buttonBase: 'bg-white/80 hover:bg-white border-2 border-blue-200 text-blue-800 font-semibold',
                buttonCorrect: 'bg-green-500 text-white border-green-600 animate-pulse-correct',
                buttonWrong: 'bg-red-500 text-white border-red-600 animate-shake',
                progressFill: 'bg-gradient-to-r from-blue-400 to-indigo-500',
                progressBg: 'bg-blue-100',
                navButton: 'bg-white/80 hover:bg-white text-blue-600',
                icon: 'text-blue-600'
            };
        case 'pink':
            return {
                bg: 'bg-gradient-to-br from-rose-50 to-fuchsia-100',
                cardBg: 'bg-white/70 backdrop-blur-xl border border-white/20',
                text: 'text-slate-800',
                headerText: 'text-pink-800',
                buttonBase: 'bg-white/80 hover:bg-white border-2 border-pink-200 text-pink-800 font-semibold',
                buttonCorrect: 'bg-green-500 text-white border-green-600 animate-pulse-correct',
                buttonWrong: 'bg-red-500 text-white border-red-600 animate-shake',
                progressFill: 'bg-gradient-to-r from-pink-400 to-rose-500',
                progressBg: 'bg-pink-100',
                navButton: 'bg-white/80 hover:bg-white text-pink-600',
                icon: 'text-pink-600'
            };
        default: // classic
            return {
                bg: 'bg-gray-900',
                cardBg: 'bg-gray-800/80 backdrop-blur-xl border border-gray-700',
                text: 'text-gray-200',
                headerText: 'text-cyan-400',
                buttonBase: 'bg-gray-700 hover:bg-gray-600 border-2 border-gray-500 text-gray-100 font-semibold',
                buttonCorrect: 'bg-green-600 text-white border-green-500 animate-pulse-correct',
                buttonWrong: 'bg-red-600 text-white border-red-500 animate-shake',
                progressFill: 'bg-gradient-to-r from-cyan-400 to-blue-500',
                progressBg: 'bg-gray-700',
                navButton: 'bg-gray-700 hover:bg-gray-600 text-cyan-400',
                icon: 'text-cyan-400'
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
    const [gameState, setGameState] = useState<GameState>('loading');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [theme, setTheme] = useState<Theme>('blue');

    const advanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const themeClasses = getThemeClasses(theme);
    const serviceInitialized = useRef(false);

    const loadQuestions = useCallback(async () => {
        setGameState('loading');
        setCurrentIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setQuestions([]);

        if (words.length === 0) {
            setGameState('error');
            return;
        }

        try {
            if (!serviceInitialized.current) {
                const allWordHeadwords = words.map(w => w.headword);
                SentenceCompletionService.setWordPool(allWordHeadwords);
                serviceInitialized.current = true;
            }
            const shuffledWords = shuffleArray(words);
            const generatedQuestions = await SentenceCompletionService.generateSentenceCompletions(shuffledWords.map(w => w.headword));
            
            if (generatedQuestions.length === 0) {
                setGameState('error');
                return;
            }

            setQuestions(generatedQuestions);
            setGameState('playing');
        } catch (error) {
            console.error('Failed to load questions:', error);
            setGameState('error');
        }
    }, [words]);

    useEffect(() => {
        loadQuestions();
        return () => {
            if (advanceTimeoutRef.current) {
                clearTimeout(advanceTimeoutRef.current);
            }
        };
    }, [loadQuestions]);

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const handleAnswerSelect = (answer: string) => {
        if (gameState !== 'playing') return;

        setSelectedAnswer(answer);
        setGameState('answered');

        if (answer === questions[currentIndex].correctAnswer) {
            setScore(prev => prev + 1);
        }

        advanceTimeoutRef.current = setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setSelectedAnswer(null);
                setGameState('playing');
            } else {
                setGameState('completed');
            }
        }, 1500);
    };

    const restartGame = () => {
        serviceInitialized.current = false;
        loadQuestions();
    };

    const currentQuestion = questions[currentIndex];
    
    const renderContent = () => {
        if (gameState === 'loading') {
            return (
                <div className="flex flex-col items-center justify-center text-center p-8 h-96">
                    <Loader2 className={`w-16 h-16 animate-spin ${themeClasses.headerText}`} />
                    <p className={`mt-6 text-xl font-semibold ${themeClasses.text}`}>Yapay zeka ile sorular hazırlanıyor...</p>
                    <p className={`mt-2 text-sm ${themeClasses.text} opacity-70`}>Bu işlem biraz zaman alabilir.</p>
                </div>
            );
        }
    
        if (gameState === 'error') {
            return (
                <div className="flex flex-col items-center justify-center text-center p-8 h-96 bg-red-500/10 rounded-2xl">
                    <X className="w-20 h-20 text-red-500" />
                    <p className={`mt-4 text-2xl font-bold ${themeClasses.text}`}>Hata Oluştu</p>
                    <p className="text-red-400 mt-2">Sorular yüklenirken bir sorunla karşılaşıldı.</p>
                    <Button onClick={restartGame} className="mt-8 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg">
                        <RefreshCw className="w-5 h-5 mr-2" /> Tekrar Dene
                    </Button>
                </div>
            );
        }
    
        if (gameState === 'completed') {
            const accuracy = Math.round((score / questions.length) * 100);
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center p-8"
                >
                    <Trophy className="w-24 h-24 text-yellow-400 drop-shadow-lg animate-bounce" />
                    <h2 className={`mt-4 text-4xl font-black ${themeClasses.headerText}`}>Oyun Bitti!</h2>
                    <p className={`mt-2 text-xl ${themeClasses.text}`}>Harika iş çıkardın!</p>
                    
                    <div className={`mt-8 p-6 rounded-2xl w-full max-w-sm ${themeClasses.cardBg} shadow-xl`}>
                        <div className="text-lg font-bold">Sonuç</div>
                        <div className={`text-5xl font-extrabold my-2 ${themeClasses.headerText}`}>{score} / {questions.length}</div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                           <div className="bg-green-500 h-2.5 rounded-full" style={{width: `${accuracy}%`}}></div>
                        </div>
                        <div className="text-sm font-medium mt-2">Doğruluk: %{accuracy}</div>
                    </div>
                    
                    <Button onClick={restartGame} className="mt-8 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-transform">
                        <RefreshCw className="w-5 h-5 mr-3" /> Yeniden Başla
                    </Button>
                </motion.div>
            );
        }

        return (
            <div className="flex flex-col h-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex-grow flex flex-col justify-center"
                    >
                        <div className="text-center">
                            <p className={`${themeClasses.text} text-lg md:text-xl font-medium mb-2`}>Cümleyi tamamla:</p>
                            <p className={`text-2xl md:text-3xl lg:text-4xl text-center leading-relaxed font-bold ${themeClasses.text} min-h-[140px] flex items-center justify-center px-4`}>
                                {currentQuestion.sentence.split('___')[0]}
                                <span className="inline-block bg-black/10 dark:bg-white/10 px-6 py-2 rounded-lg mx-3 text-transparent shadow-inner">
                                    {BLANK_PLACEHOLDER}
                                </span>
                                {currentQuestion.sentence.split('___')[1]}
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>
                
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { staggerChildren: 0.1, delay: 0.2 } }}
                >
                    {currentQuestion.options.map((option, i) => {
                        const isCorrect = option === currentQuestion.correctAnswer;
                        const isSelected = selectedAnswer === option;
                        
                        let buttonClass = themeClasses.buttonBase;
                        if (gameState === 'answered') {
                           if(isCorrect) {
                               buttonClass = themeClasses.buttonCorrect;
                           } else if (isSelected) {
                               buttonClass = themeClasses.buttonWrong;
                           } else {
                               buttonClass += " opacity-50 cursor-not-allowed";
                           }
                        }

                        return (
                            <motion.button
                                key={i}
                                variants={{
                                    hidden: { y: 20, opacity: 0 },
                                    visible: { y: 0, opacity: 1 }
                                }}
                                onClick={() => handleAnswerSelect(option)}
                                disabled={gameState === 'answered'}
                                className={`w-full p-4 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-md ${buttonClass}`}
                            >
                                {option}
                                {gameState === 'answered' && isSelected && (
                                  <span className="absolute right-4 top-1/2 -translate-y-1/2">
                                    {isCorrect ? <Check/> : <X/>}
                                  </span>
                                )}
                            </motion.button>
                        );
                    })}
                </motion.div>
            </div>
        );
    }
    
    return (
        <div className={`min-h-screen p-4 sm:p-6 transition-colors duration-500 ${themeClasses.bg}`}>
            <div className={`max-w-4xl mx-auto ${themeClasses.cardBg} p-4 sm:p-8 rounded-3xl shadow-2xl`}>
                <header className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${themeClasses.bg}`}>
                            <BookOpen className={`w-7 h-7 ${themeClasses.icon}`} />
                        </div>
                        <div>
                            <h1 className={`text-2xl font-bold ${themeClasses.headerText}`}>Boşluk Doldurma</h1>
                            <p className={`${themeClasses.text} opacity-80 text-sm`}>Yapay zeka destekli cümle tamamlama</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-1 rounded-full border-2 border-gray-200 dark:border-gray-700">
                        {['classic', 'blue', 'pink'].map((t) => (
                            <button key={t} onClick={() => setTheme(t as Theme)} className={`w-7 h-7 rounded-full transition-all ${
                                t === 'classic' ? 'bg-gray-800' : t === 'blue' ? 'bg-blue-500' : 'bg-pink-500'
                            } ${theme === t ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-current' : ''}`} />
                        ))}
                    </div>
                </header>

                {gameState !== 'completed' && gameState !== 'loading' && (
                  <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                          <p className={`text-sm font-semibold ${themeClasses.text}`}>Soru {currentIndex + 1} / {questions.length}</p>
                          <p className={`text-sm font-semibold ${themeClasses.headerText}`}>Skor: {score}</p>
                      </div>
                      <div className={`w-full rounded-full h-3 ${themeClasses.progressBg}`}>
                          <motion.div
                              className={`h-3 rounded-full ${themeClasses.progressFill}`}
                              initial={{ width: '0%' }}
                              animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                              transition={{ duration: 0.5, ease: 'easeOut' }}
                          />
                      </div>
                  </div>
                )}

                <div className="min-h-[450px] flex items-center justify-center">
                    {renderContent()}
                </div>
            </div>
            <div className="w-full text-center mt-4">
              <span className="text-xs text-gray-500 dark:text-gray-400">powered by mirac</span>
            </div>
        </div>
    );
}; 