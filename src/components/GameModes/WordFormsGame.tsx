import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw, CheckCircle, XCircle, Trophy, AlertTriangle, ArrowRight } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { WordDetail } from '../../data/words';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

// --- TYPE DEFINITIONS ---
interface WordFormsGameProps {
  words: WordDetail[];
}

interface WordFormQuestion {
  sentence: string;
  baseWord: string;
  correctAnswer: string;
}

type GameStatus = 'loading' | 'playing' | 'answered' | 'completed' | 'error';

// --- HELPER FUNCTIONS ---

/**
 * AI'a gönderilecek soruları hazırlar ve AI servisinden yanıt alır.
 */
const generateWordFormQuestions = async (words: WordDetail[]): Promise<WordFormQuestion[]> => {
  if (words.length === 0) return [];

  // Her kelimeden rastgele bir form seç (fiil, isim, sıfat vb.)
  const selectedForms = words.map(word => {
    const allForms = [
      ...(word.forms.verb?.map(f => ({ type: 'verb', form: f })) || []),
      ...(word.forms.noun?.map(f => ({ type: 'noun', form: f })) || []),
      ...(word.forms.adjective?.map(f => ({ type: 'adjective', form: f })) || []),
      ...(word.forms.adverb?.map(f => ({ type: 'adverb', form: f })) || []),
    ];

    const chosenForm = allForms.length > 0 
      ? allForms[Math.floor(Math.random() * allForms.length)] 
      : { type: 'base', form: word.headword };

    return { baseWord: word.headword, selectedForm: chosenForm.form };
  });

  const prompt = `
    Create B1-B2 level English sentences for the following word forms. 
    Replace each target word with "_____".
    The sentence context must clearly indicate which word form is needed.

    Word forms:
    ${selectedForms.map((item, i) => `${i + 1}. Word: "${item.selectedForm}" (from base: ${item.baseWord})`).join('\n')}

    RULES:
    - Return ONLY a valid JSON array of objects.
    - JSON structure: { "sentence": "...", "baseWord": "...", "correctAnswer": "..." }
    - Example for "competition" (from compete): { "sentence": "The _____ was very intense.", "baseWord": "compete", "correctAnswer": "competition" }
  `;

  try {
    const results = await aiService.generateWordFormsQuestion(prompt);
    // Gelen yanıtın dizi olduğundan ve gerekli alanları içerdiğinden emin ol
    return Array.isArray(results) ? results.filter(q => q.sentence && q.baseWord && q.correctAnswer) : [];
  } catch (error) {
    console.error('Error generating word form questions:', error);
    return []; // Hata durumunda boş dizi dön
  }
};

// --- MAIN COMPONENT ---

const WordFormsGame: React.FC<WordFormsGameProps> = ({ words }) => {
  const [status, setStatus] = useState<GameStatus>('loading');
  const [questions, setQuestions] = useState<WordFormQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadQuestions = useCallback(async () => {
    setStatus('loading');
    const generatedQuestions = await generateWordFormQuestions(words);
    if (generatedQuestions.length > 0) {
      setQuestions(generatedQuestions);
      setStatus('playing');
    } else {
      setStatus('error');
    }
  }, [words]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  useEffect(() => {
    if (status === 'playing' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [status, currentIndex]);

  const handleAnswerSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (status !== 'playing' || !userAnswer.trim()) return;

    const currentQuestion = questions[currentIndex];
    const correct = userAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
    
    setIsCorrect(correct);
    setStatus('answered');
    if (correct) setScore(prev => prev + 1);

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setUserAnswer('');
        setIsCorrect(null);
        setStatus('playing');
      } else {
        setStatus('completed');
      }
    }, correct ? 1200 : 2000);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setUserAnswer('');
    setIsCorrect(null);
    loadQuestions();
  };

  // --- RENDER FUNCTIONS ---
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