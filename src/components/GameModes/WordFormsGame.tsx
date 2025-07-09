import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw, CheckCircle, XCircle, Trophy, Play, ArrowRight, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { WordDetail } from '../../data/words';

interface WordFormsGameProps {
  words: WordDetail[];
}

interface WordFormQuestion {
  sentence: string;
  baseWord: string;
  correctAnswer: string;
}

interface QuestionState {
  userAnswer: string;
  isCorrect: boolean | null;
  isAnswered: boolean;
}

type GameState = 'loading' | 'playing' | 'answered' | 'completed' | 'error';
type Theme = 'ocean' | 'pink' | 'dark';

const getThemeClasses = (theme: Theme) => {
    switch (theme) {
        case 'ocean':
            return {
                bg: 'bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50',
                cardBg: 'bg-white/80 backdrop-blur-xl border border-blue-100 shadow-2xl',
                text: 'text-slate-800',
                accent: 'text-blue-600',
                button: 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl',
                progress: 'bg-blue-500',
                input: 'text-blue-700',
                theme: 'bg-blue-500'
            };
        case 'pink':
            return {
                bg: 'bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50',
                cardBg: 'bg-white/80 backdrop-blur-xl border border-pink-100 shadow-2xl',
                text: 'text-slate-800',
                accent: 'text-pink-600',
                button: 'bg-pink-500 hover:bg-pink-600 text-white shadow-lg hover:shadow-xl',
                progress: 'bg-pink-500',
                input: 'text-pink-700',
                theme: 'bg-pink-500'
            };
        default: // dark
            return {
                bg: 'bg-gradient-to-br from-gray-900 via-slate-900 to-black',
                cardBg: 'bg-gray-800/80 backdrop-blur-xl border border-gray-700 shadow-2xl',
                text: 'text-gray-100',
                accent: 'text-gray-300',
                button: 'bg-gray-700 hover:bg-gray-600 text-white shadow-lg hover:shadow-xl',
                progress: 'bg-gray-600',
                input: 'text-gray-200',
                theme: 'bg-gray-800'
            };
    }
};

const generateWordFormQuestions = async (words: WordDetail[]): Promise<WordFormQuestion[]> => {
    if (words.length === 0) return [];

    // Her kelimeden rastgele bir form seç
    const selectedForms = words.map(word => {
        const allForms = [];
        
        // Tüm formları topla
        if (word.forms.verb && word.forms.verb.length > 0) {
            allForms.push(...word.forms.verb.map(form => ({ type: 'verb', form })));
        }
        if (word.forms.noun && word.forms.noun.length > 0) {
            allForms.push(...word.forms.noun.map(form => ({ type: 'noun', form })));
        }
        if (word.forms.adjective && word.forms.adjective.length > 0) {
            allForms.push(...word.forms.adjective.map(form => ({ type: 'adjective', form })));
        }
        if (word.forms.adverb && word.forms.adverb.length > 0) {
            allForms.push(...word.forms.adverb.map(form => ({ type: 'adverb', form })));
        }
        
        // Eğer form yoksa ana kelimeyi ekle
        if (allForms.length === 0) {
            allForms.push({ type: 'base', form: word.headword });
        }
        
        // Rastgele bir form seç
        const randomForm = allForms[Math.floor(Math.random() * allForms.length)];
        
        return {
            baseWord: word.headword,
            selectedForm: randomForm.form,
            type: randomForm.type
        };
    });

    // AI'ya göndermek için format
    const formsForAI = selectedForms.map((item, index) => 
        `${index + 1}. Word: "${item.selectedForm}" (base: ${item.baseWord})`
    ).join('\n');

    const prompt = `Create B1-B2 level English sentences for these word forms. Replace each word with "___" in the sentence.

Selected forms:
${formsForAI}

Rules:
- Create natural B1-B2 level sentences
- Replace the selected word form with "___" (three underscores)
- Make sure the sentence context clearly indicates which word form fits
- Return JSON array with sentence, baseWord, and correctAnswer

Example:
Input: "competition" (base: compete)
Output: {"sentence": "The ___ was very intense.", "baseWord": "compete", "correctAnswer": "competition"}

Return ONLY JSON array:`;

    try {
        const results = await aiService.generateWordFormsQuestion(prompt);
        return Array.isArray(results) ? results.filter(q => q.sentence && q.baseWord && q.correctAnswer) : [];
    } catch (error) {
        console.error('Word forms generation error:', error);
        return [];
    }
};

const WordFormsGame: React.FC<WordFormsGameProps> = ({ words }) => {
    const [questions, setQuestions] = useState<WordFormQuestion[]>([]);
    const [gameState, setGameState] = useState<GameState>('loading');
  const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [theme, setTheme] = useState<Theme>('ocean');
    const [totalWords, setTotalWords] = useState(0);
    const [questionStates, setQuestionStates] = useState<QuestionState[]>([]);
    
    const advanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const backgroundFetchInitiated = useRef(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const themeClasses = getThemeClasses(theme);

    // Cümleyi temizle
    const getSentenceParts = (sentence: string) => {
        return sentence.replace('___', '[MASK]').split('[MASK]');
    };

    // En başa kaydır
    useEffect(() => { window.scrollTo(0, 0); }, []);

    const loadQuestions = useCallback(async (isInitialLoad = true) => {
        if (words.length === 0) {
            setErrorMessage('Bu ünite için soru oluşturulacak kelime bulunamadı.');
            setGameState('error');
            return;
        }
        
        setGameState('loading');
        if (isInitialLoad) {
            setCurrentIndex(0);
            setScore(0);
            setUserAnswer('');
            setIsCorrect(null);
            setQuestions([]);
            setQuestionStates([]);
            setTotalWords(words.length);
            backgroundFetchInitiated.current = false;
        }
      
        try {
            const shuffledWords = isInitialLoad ? [...words].sort(() => Math.random() - 0.5) : words;
            const initialWords = shuffledWords.slice(0, 10);
            const remainingWords = shuffledWords.slice(10);
            const initialQuestions = await generateWordFormQuestions(initialWords);

            if (initialQuestions.length === 0 && isInitialLoad) {
                setErrorMessage('Yapay zeka bu kelimelerle soru oluşturamadı.');
                setGameState('error');
                return;
      }
      
            setQuestions([...initialQuestions].sort(() => Math.random() - 0.5));
            // Initialize question states
            setQuestionStates(initialQuestions.map(() => ({
                userAnswer: '',
                isCorrect: null,
                isAnswered: false
            })));
            setGameState('playing');

            if (remainingWords.length > 0 && !backgroundFetchInitiated.current) {
                backgroundFetchInitiated.current = true;
                generateWordFormQuestions(remainingWords)
                    .then((remainingQuestions: WordFormQuestion[]) => {
                        // Yeni gelen soruları kendi içinde karıştır ve mevcut listenin sonuna ekle
                        const shuffledRemaining = [...remainingQuestions].sort(() => Math.random() - 0.5);
                        setQuestions(prev => [...prev, ...shuffledRemaining]);
                        setQuestionStates(prev => [
                            ...prev, 
                            ...remainingQuestions.map(() => ({
                                userAnswer: '',
                                isCorrect: null,
                                isAnswered: false
                            }))
                        ]);
                    })
                    .catch((err: any) => console.error("Arka plan soru yükleme hatası:", err));
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
            if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
        };
    }, [loadQuestions]);

    useEffect(() => {
        if (gameState === 'playing' && inputRef.current) {
            inputRef.current.focus();
        }
    }, [currentIndex, gameState]);

    const handleNextQuestion = useCallback(() => {
        if (advanceTimeoutRef.current) {
            clearTimeout(advanceTimeoutRef.current);
            advanceTimeoutRef.current = null;
        }

        if (currentIndex + 1 < questions.length) {
            setCurrentIndex(prev => prev + 1);
            setUserAnswer('');
            setIsCorrect(null);
            setGameState('playing');
        } else {
            setGameState('completed');
        }
    }, [currentIndex, questions.length]);

    const handlePreviousQuestion = useCallback(() => {
        if (currentIndex > 0) {
            // Mevcut sorunun durumunu kaydet
            if (questionStates[currentIndex]) {
                setQuestionStates(prev => {
                    const newStates = [...prev];
                    newStates[currentIndex] = {
                        userAnswer,
                        isCorrect,
                        isAnswered: gameState === 'answered'
                    };
                    return newStates;
                });
            }

            const newIndex = currentIndex - 1;
            setCurrentIndex(newIndex);
            
            // Önceki sorunun durumunu yükle
            const prevState = questionStates[newIndex];
            if (prevState && prevState.isAnswered) {
                setUserAnswer(prevState.userAnswer);
                setIsCorrect(prevState.isCorrect);
                setGameState('answered');
            } else {
                setUserAnswer('');
                setIsCorrect(null);
                setGameState('playing');
            }
            
            if (advanceTimeoutRef.current) {
                clearTimeout(advanceTimeoutRef.current);
                advanceTimeoutRef.current = null;
            }
        }
    }, [currentIndex, questionStates, userAnswer, isCorrect, gameState]);

    const handleCheckAnswer = useCallback(() => {
        if (gameState === 'playing') {
            if (userAnswer.trim() === '') {
                // Eğer cevap verilmemişse, doğru cevabı göster
                const currentQuestion = questions[currentIndex];
                if (currentQuestion) {
                    setUserAnswer(currentQuestion.correctAnswer);
                    setIsCorrect(false);
                    setGameState('answered');
                    
                    advanceTimeoutRef.current = setTimeout(() => {
                        if (currentIndex + 1 < questions.length) {
                            setCurrentIndex(prev => prev + 1);
                            setUserAnswer('');
                            setIsCorrect(null);
                            setGameState('playing');
                        } else {
                            setGameState('completed');
                        }
                    }, 2000);
                }
            } else {
                // Cevabı kontrol et
                handleAnswerSubmit();
            }
        } else if (gameState === 'answered') {
            // Mevcut sorunun durumunu kaydet
            setQuestionStates(prev => {
                const newStates = [...prev];
                newStates[currentIndex] = {
                    userAnswer,
                    isCorrect,
                    isAnswered: true
                };
                return newStates;
            });

            // Cevap verildikten sonra sonraki soruya geç
            if (currentIndex + 1 < questions.length) {
                const newIndex = currentIndex + 1;
                setCurrentIndex(newIndex);
                
                // Sonraki sorunun durumunu yükle
                const nextState = questionStates[newIndex];
                if (nextState && nextState.isAnswered) {
                    setUserAnswer(nextState.userAnswer);
                    setIsCorrect(nextState.isCorrect);
                    setGameState('answered');
                } else {
                    setUserAnswer('');
                    setIsCorrect(null);
                    setGameState('playing');
                }
                
                if (advanceTimeoutRef.current) {
                    clearTimeout(advanceTimeoutRef.current);
                    advanceTimeoutRef.current = null;
                }
            } else {
                setGameState('completed');
            }
        }
    }, [gameState, userAnswer, questions, currentIndex]);

    const handleManualNext = useCallback(() => {
        // Sadece sonraki soruya geçiş için
        if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
            setUserAnswer('');
            setIsCorrect(null);
            setGameState('playing');
            if (advanceTimeoutRef.current) {
                clearTimeout(advanceTimeoutRef.current);
                advanceTimeoutRef.current = null;
    }
        }
    }, [currentIndex, questions.length]);

    const handleAnswerSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (gameState !== 'playing' || !userAnswer.trim()) return;

        const currentQuestion = questions[currentIndex];
        if (!currentQuestion) return;

        const correct = userAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
        setIsCorrect(correct);
        setGameState('answered');

        if (correct) setScore(prev => prev + 1);

        advanceTimeoutRef.current = setTimeout(() => {
            handleNextQuestion();
        }, correct ? 1500 : 2500);
  };

    if (gameState === 'loading') {
        return (
            <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-500 ${themeClasses.bg}`}>
                <div className="text-center">
                    <Loader2 className={`w-12 h-12 animate-spin mx-auto mb-6 ${themeClasses.accent}`} />
                    <h2 className={`text-2xl font-bold ${themeClasses.text}`}>Sorular Hazırlanıyor...</h2>
                    <p className={`mt-2 text-lg ${themeClasses.accent}`}>Lütfen bekleyin, kelimeleriniz için en iyi alıştırmaları oluşturuyoruz.</p>
                </div>
            </div>
        );
    }

    if (gameState === 'error') {
    return (
            <div className={`min-h-screen flex items-center justify-center ${themeClasses.bg}`}>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-12 rounded-3xl ${themeClasses.cardBg} text-center max-w-md`}
                >
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                    <h2 className={`text-2xl font-bold ${themeClasses.text} mb-4`}>Bir Hata Oluştu</h2>
                    <p className="text-red-500 mb-6">{errorMessage}</p>
                    <button 
                        onClick={() => loadQuestions(true)} 
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 mx-auto"
                    >
                        <RefreshCw className="w-4 h-4" /> Tekrar Dene
                    </button>
                </motion.div>
        </div>
    );
  }

    if (gameState === 'completed') {
        const percentage = Math.round((score / totalWords) * 100);
        return (
            <div className={`min-h-screen flex items-center justify-center ${themeClasses.bg}`}>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-12 rounded-3xl ${themeClasses.cardBg} text-center max-w-lg`}
                >
                    <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
                    <h2 className={`text-4xl font-bold ${themeClasses.accent} mb-4`}>Tebrikler!</h2>
                    <div className={`text-6xl font-bold ${themeClasses.text} mb-2`}>{percentage}%</div>
                    <p className={`text-xl ${themeClasses.text} mb-6`}>
                        {score} / {totalWords} doğru cevap
                    </p>
                    <button 
                        onClick={() => loadQuestions(true)} 
                        className={`${themeClasses.button} px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 mx-auto`}
                    >
                        <Play className="w-5 h-5" /> Yeniden Başla
      </button>
                </motion.div>
            </div>
        );
  }
    
    const currentQuestion = questions[currentIndex];
    if (!currentQuestion) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${themeClasses.bg}`}>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-12 rounded-3xl ${themeClasses.cardBg} text-center max-w-md`}
                >
                    <Loader2 className={`w-16 h-16 animate-spin mx-auto ${themeClasses.accent} mb-6`} />
                    <h2 className={`text-xl font-semibold ${themeClasses.text}`}>Soru yükleniyor...</h2>
                </motion.div>
            </div>
        );
    }

    const sentenceParts = currentQuestion.sentence.split('___');
   
   // Eğer ___ ile split olmazsa, alternatif formatları dene
   let normalizedSentence = currentQuestion.sentence;
   if (sentenceParts.length === 1) {
       // ___ yoksa, farklı boşluk formatlarını ___ ile değiştir
       normalizedSentence = normalizedSentence
           .replace(/_{1,10}/g, '___')  // _ veya __ formatlarını ___ yap
           .replace(/\[BLANK\]/g, '___') // [BLANK] formatını ___ yap
           .replace(/\.\.\./g, '___')    // ... formatını ___ yap
           .replace(/__+/g, '___');      // Birden fazla _ yi ___ yap
       
       // Yeniden split et
       const newParts = normalizedSentence.split('___');
       if (newParts.length > 1) {
           sentenceParts.length = 0;
           sentenceParts.push(...newParts);
       }
   }
   
   // Eğer hala split olmazsa, manuel boşluk ekle
   if (sentenceParts.length === 1) {
       // Cümlenin ortasına boşluk ekle
       const words = currentQuestion.sentence.split(' ');
       const midPoint = Math.floor(words.length / 2);
       sentenceParts.length = 0;
       sentenceParts.push(
           words.slice(0, midPoint).join(' '),
           words.slice(midPoint).join(' ')
       );
   }
   
    const progress = ((currentIndex + 1) / totalWords) * 100;

    return (
        <div className={`h-screen overflow-hidden ${themeClasses.bg} transition-all duration-500`}>
            {/* Header */}
            <div className="p-4 sm:p-6">
                <div className="max-w-4xl mx-auto">
                    {/* Mobile Layout */}
                    <div className="block sm:hidden mb-4">
                        <div className="flex justify-between items-center mb-3">
                            <h1 className={`text-xl font-bold ${themeClasses.accent}`}>Kelime Formları</h1>
                            <div className={`text-sm font-bold ${themeClasses.text}`}>
                                {currentIndex + 1} / {totalWords}
                            </div>
                        </div>
                        <div className="flex justify-center gap-3">
                            <button 
                                onClick={() => setTheme('ocean')} 
                                className={`w-6 h-6 rounded-full bg-blue-500 transition-all ${theme === 'ocean' ? 'ring-2 ring-blue-200 scale-110' : ''}`} 
                            />
                            <button 
                                onClick={() => setTheme('pink')} 
                                className={`w-6 h-6 rounded-full bg-pink-500 transition-all ${theme === 'pink' ? 'ring-2 ring-pink-200 scale-110' : ''}`} 
                            />
                            <button 
                                onClick={() => setTheme('dark')} 
                                className={`w-6 h-6 rounded-full bg-gray-800 transition-all ${theme === 'dark' ? 'ring-2 ring-gray-400 scale-110' : ''}`} 
                            />
                        </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:flex justify-between items-center">
                        <h1 className={`text-3xl font-bold ${themeClasses.accent}`}>Kelime Formları</h1>
                        <div className="flex items-center gap-4">
                            <div className={`text-lg font-bold ${themeClasses.text}`}>
                                {currentIndex + 1} / {totalWords}
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setTheme('ocean')} 
                                    className={`w-8 h-8 rounded-full bg-blue-500 transition-all ${theme === 'ocean' ? 'ring-4 ring-blue-200 scale-110' : ''}`} 
                                />
                                <button 
                                    onClick={() => setTheme('pink')} 
                                    className={`w-8 h-8 rounded-full bg-pink-500 transition-all ${theme === 'pink' ? 'ring-4 ring-pink-200 scale-110' : ''}`} 
                                />
                                <button 
                                    onClick={() => setTheme('dark')} 
                                    className={`w-8 h-8 rounded-full bg-gray-800 transition-all ${theme === 'dark' ? 'ring-4 ring-gray-400 scale-110' : ''}`} 
                                />
                            </div>
                        </div>
                    </div>
                
                    {/* Progress Bar */}
                    <div className="mt-4 sm:mt-6">
                        <div className="w-full bg-white/50 rounded-full h-2 sm:h-3 overflow-hidden">
                            <motion.div
                                className={`h-full ${themeClasses.progress} rounded-full`}
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Game Area */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
                <div className="max-w-4xl w-full">
                    <div className={`${themeClasses.cardBg} rounded-2xl sm:rounded-3xl p-4 sm:p-12 text-center flex flex-col justify-between h-full`}>
                        <div className="flex-1 flex flex-col justify-center">
                            {/* Sentence with smooth animation */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        className="relative"
                    >
                        <p className={`text-center text-xl mb-4 ${themeClasses.accent}`}>Complete the sentence with the correct form of <strong className={themeClasses.text}>{currentQuestion.baseWord}</strong>.</p>
                        
                        <div className={`text-center text-3xl font-serif p-8 rounded-2xl min-h-[10rem] flex items-center justify-center flex-wrap ${themeClasses.text}`}>
                            {getSentenceParts(currentQuestion.sentence)[0]}
                            <div className="inline-block w-48 mx-2 align-middle">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAnswerSubmit()}
                                    className={`w-full bg-transparent border-b-2 p-2 text-center text-3xl font-serif focus:outline-none transition-colors duration-300
                                        ${isCorrect === true ? 'border-green-400' : isCorrect === false ? 'border-red-400' : `border-gray-400/50 focus:border-blue-400`}
                                        ${themeClasses.input}`}
                                    placeholder="..."
                                    disabled={gameState === 'answered'}
                                />
                            </div>
                            {getSentenceParts(currentQuestion.sentence)[1]}
                        </div>

                        <div className="text-center mt-4">
                            <p className={`text-lg ${themeClasses.text}`}>
                                (Use the correct form of: <strong className={themeClasses.accent}>{currentQuestion.baseWord}</strong>
                                {gameState === 'answered' && !isCorrect && 
                                    <span className="text-red-600">, correct answer: <strong>{currentQuestion.correctAnswer}</strong></span>
                                }
                                )
                            </p>
                        </div>

                        <div className="mt-8 flex flex-col items-center">
                            {gameState !== 'answered' && (
                                 <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleAnswerSubmit()}
                                    className={`py-3 px-12 rounded-lg font-semibold transition-colors duration-300 w-full sm:w-auto ${themeClasses.button}`}
                                    disabled={!userAnswer.trim()}
                                >
                                    Check Answer
                                </motion.button>
                            )}
                           
                            <AnimatePresence>
                                {gameState === 'answered' && (
                                    <motion.button
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        onClick={handleNextQuestion}
                                        className={`py-3 px-12 rounded-lg font-semibold transition-colors duration-300 w-full sm:w-auto ${themeClasses.button}`}
                                    >
                                        {currentIndex + 1 < questions.length ? 'Next Question' : 'Finish Game'}
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </AnimatePresence>
                        </div>

                        <div>
                            {/* Navigation Buttons */}
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-8 mb-3 sm:mb-6">
                                <div className="flex gap-3 sm:gap-8 w-full sm:w-auto">
                                    <button
                                        onClick={handlePreviousQuestion}
                                        disabled={currentIndex === 0}
                                        className={`
                                            flex items-center justify-center gap-2 px-4 sm:px-8 py-2 sm:py-4 rounded-2xl 
                                            text-sm sm:text-base font-medium transition-all duration-500 flex-1 sm:flex-none
                                            backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl
                                            ${currentIndex === 0 
                                                ? 'bg-gray-200/50 text-gray-400 cursor-not-allowed border-gray-200/30' 
                                                : `bg-white/20 ${themeClasses.text} hover:bg-white/30 hover:scale-105 active:scale-95`
                                            }
                                        `}
                                    >
                                        <ChevronLeft className="w-3 h-3 sm:w-5 sm:h-5" /> 
                                        <span className="hidden sm:inline">Önceki</span>
                                        <span className="sm:hidden">Geri</span>
                                    </button>

                                    <button
                                        onClick={handleCheckAnswer}
                                        disabled={gameState === 'answered' && currentIndex + 1 >= questions.length}
                                        className={`
                                            flex items-center justify-center gap-2 px-4 sm:px-8 py-2 sm:py-4 rounded-2xl 
                                            text-sm sm:text-base font-medium transition-all duration-500 flex-1 sm:flex-none
                                            backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl
                                            ${gameState === 'answered' && currentIndex + 1 >= questions.length
                                                ? 'bg-gray-200/50 text-gray-400 cursor-not-allowed border-gray-200/30'
                                                : `${themeClasses.button} hover:scale-105 active:scale-95`
                                            }
                                        `}
                                    >
                                        {gameState === 'playing' ? (
                                            <>
                                                <Check className="w-3 h-3 sm:w-5 sm:h-5" />
                                                <span className="hidden sm:inline">Kontrol Et</span>
                                                <span className="sm:hidden">Kontrol</span>
                    </>
                ) : (
                                            <>
                                                <ChevronRight className="w-3 h-3 sm:w-5 sm:h-5" />
                                                <span className="hidden sm:inline">Sonraki</span>
                                                <span className="sm:hidden">İleri</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                {gameState === 'playing' && (
                                    <p className={`text-xs sm:text-base ${themeClasses.text} opacity-60 flex items-center gap-1 sm:gap-2 mt-1 sm:mt-0 font-light`}>
                                        <span className="hidden sm:inline">Kelimeyi yazın, Enter'a basın veya Kontrol Et'e tıklayın</span>
                                        <span className="sm:hidden">Yazın ve Kontrol Et'e tıklayın</span>
                                        <ArrowRight className="w-3 h-3 sm:w-5 sm:h-5" />
                                    </p>
                                )}
                            </div>

                            {/* Feedback */}
                            <div className="min-h-[60px] sm:min-h-[80px] flex items-center justify-center">
                                <AnimatePresence>
                                    {gameState === 'answered' && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{ duration: 0.3 }}
                                            className="text-center px-2"
                                        >
                                            {isCorrect ? (
                                                <div className="space-y-1 sm:space-y-3">
                                                    <div className="flex items-center justify-center gap-2 sm:gap-3 text-green-600">
                                                        <CheckCircle className="w-6 h-6 sm:w-12 sm:h-12" />
                                                        <span className="text-lg sm:text-3xl font-bold">Mükemmel!</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-1 sm:space-y-3">
                                                    <div className="flex items-center justify-center gap-2 sm:gap-3 text-red-600">
                                                        <XCircle className="w-6 h-6 sm:w-12 sm:h-12" />
                                                        <span className="text-lg sm:text-3xl font-bold">Yanlış</span>
                                                    </div>
                                                    <p className={`text-xs sm:text-xl ${themeClasses.text}`}>
                                                        Doğru cevap: <span className={`font-bold ${themeClasses.accent}`}>{currentQuestion.correctAnswer}</span>
                                                    </p>
                                                </div>
                                            )}
                                        </motion.div>
                )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    </div>
  );
};

export default WordFormsGame; 