import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { WordDetail } from '../../data/words';
import { SentenceCompletionService, SentenceQuestion } from '../../services/sentenceCompletionService';
import { gameStateManager } from '../../lib/utils';
import { RefreshCw, CheckCircle, XCircle, PlayCircle, Loader2, Trophy, Settings, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SentenceCompletionProps {
  words: WordDetail[];
  unit: string;
}

interface GameState {
  questions: SentenceQuestion[];
  currentQuestionIndex: number;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  score: number;
  gameCompleted: boolean;
  gameStarted: boolean;
  theme: 'classic' | 'blue' | 'pink';
}

type Theme = 'classic' | 'blue' | 'pink';

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
  const [theme, setTheme] = useState<Theme>('blue');

  const GAME_KEY = `sentenceCompletion_${unit}`;

  const sentenceService = useMemo(() => SentenceCompletionService.getInstance(), []);

  const shuffleArray = useCallback(<T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  // Tema sınıfları
  const getThemeClasses = () => {
    switch (theme) {
      case 'blue':
        return {
          bg: 'bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100',
          headerBg: 'bg-white',
          headerText: 'text-blue-700',
          headerBorder: 'border-blue-200',
          cardBg: 'bg-white',
          cardBorder: 'border-blue-200',
          cardText: 'text-gray-800',
          buttonBase: 'bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border-2 border-blue-200 hover:border-blue-400 text-gray-700 hover:text-blue-700',
          buttonCorrect: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-2 border-green-400 shadow-lg shadow-green-200/50',
          buttonWrong: 'bg-gradient-to-r from-red-500 to-rose-600 text-white border-2 border-red-400 shadow-lg shadow-red-200/50',
          buttonDisabled: 'bg-gray-50 border-2 border-gray-200 text-gray-400',
          progressBg: 'bg-gray-200',
          progressFill: 'bg-gradient-to-r from-blue-500 to-indigo-600',
          scoreText: 'text-blue-600'
        };
      case 'pink':
        return {
          bg: 'bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100',
          headerBg: 'bg-white',
          headerText: 'text-pink-700',
          headerBorder: 'border-pink-200',
          cardBg: 'bg-white',
          cardBorder: 'border-pink-200',
          cardText: 'text-gray-800',
          buttonBase: 'bg-white hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 border-2 border-pink-200 hover:border-pink-400 text-gray-700 hover:text-pink-700',
          buttonCorrect: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-2 border-green-400 shadow-lg shadow-green-200/50',
          buttonWrong: 'bg-gradient-to-r from-red-500 to-rose-600 text-white border-2 border-red-400 shadow-lg shadow-red-200/50',
          buttonDisabled: 'bg-gray-50 border-2 border-gray-200 text-gray-400',
          progressBg: 'bg-gray-200',
          progressFill: 'bg-gradient-to-r from-pink-500 to-rose-600',
          scoreText: 'text-pink-600'
        };
      default: // classic
        return {
          bg: 'bg-black text-white',
          headerBg: 'bg-gray-900',
          headerText: 'text-green-400',
          headerBorder: 'border-gray-800',
          cardBg: 'bg-gray-900',
          cardBorder: 'border-gray-800',
          cardText: 'text-gray-200',
          buttonBase: 'border-gray-700 bg-gray-800 hover:bg-gray-700 hover:border-gray-600 text-white',
          buttonCorrect: 'border-green-500 bg-green-500/20 text-green-300',
          buttonWrong: 'border-red-500 bg-red-500/20 text-red-300',
          buttonDisabled: 'border-gray-700 bg-gray-800 text-gray-500',
          progressBg: 'bg-gray-800',
          progressFill: 'bg-gradient-to-r from-green-500 to-emerald-500',
          scoreText: 'text-green-400'
        };
    }
  };

  useEffect(() => {
    if (words.length > 0) {
      const savedState = gameStateManager.loadGameState(GAME_KEY) as GameState | null;
      if (savedState && savedState.questions.length > 0 && savedState.currentQuestionIndex < savedState.questions.length) {
        // Kaydedilmiş oyun var, yükle
        console.log('Kaydedilmiş oyun yükleniyor:', savedState);
        setQuestions(savedState.questions);
        setCurrentQuestionIndex(savedState.currentQuestionIndex);
        setSelectedAnswer(savedState.selectedAnswer);
        setIsCorrect(savedState.isCorrect);
        setScore(savedState.score);
        setGameCompleted(savedState.gameCompleted);
        setGameStarted(savedState.gameStarted);
        setTheme(savedState.theme);
      } else {
        // Kaydedilmiş oyun yok, hemen başlat
        startQuickGame();
      }
    }
  }, [words, GAME_KEY]);

  useEffect(() => {
    if (questions.length > 0 && gameStarted) {
      const gameState: GameState = {
        questions,
        currentQuestionIndex,
        selectedAnswer,
        isCorrect,
        score,
        gameCompleted,
        gameStarted,
        theme
      };
      gameStateManager.saveGameState(GAME_KEY, gameState);
    }
  }, [questions, currentQuestionIndex, selectedAnswer, isCorrect, score, gameCompleted, gameStarted, theme, GAME_KEY]);

  const startQuickGame = useCallback(async () => {
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

    // İlk 10 kelimeyi al (veya daha az varsa hepsini)
    const initialWords = words.slice(0, 10);
    const wordTexts = initialWords.map(word => word.headword);
    
    try {
      console.log('İlk 10 kelime için cümleler üretiliyor...');
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
      setLoading(false);

      // Arka planda kalan kelimeleri üret (sessizce)
      if (words.length > 10) {
        const remainingWords = words.slice(10);
        const remainingWordTexts = remainingWords.map(word => word.headword);
        
        // Arka planda sessizce üret
        sentenceService.generateSentenceCompletions(remainingWordTexts).then(remainingQuestions => {
          if (remainingQuestions.length > 0) {
            const allQuestionsWithShuffledOptions = [
              ...questionsWithShuffledOptions,
              ...remainingQuestions.map(q => ({
                ...q,
                options: shuffleArray(q.options)
              }))
            ];
            setQuestions(allQuestionsWithShuffledOptions);
            console.log('Arka planda kalan kelimeler eklendi:', remainingQuestions.length);
          }
        }).catch(error => {
          console.error('Arka plan kelime üretimi hatası:', error);
          // Hata olsa bile oyun devam eder
        });
      }
    } catch (error: any) {
      console.error('Oyun başlatılırken hata:', error);
      setError(error.message || 'Cümleler oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
      setQuestions([]);
      setLoading(false);
    }
  }, [words, sentenceService, shuffleArray, GAME_KEY]);

  const fetchQuestionsAndStartGame = useCallback(async () => {
    gameStateManager.clearGameState(GAME_KEY); // Yeni oyun başlarken temizle
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
  }, [words, sentenceService, shuffleArray, GAME_KEY]);

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
    const accuracy = Math.round((score / questions.length) * 100);
    const themeClasses = getThemeClasses();
    
    return (
      <>
        <div className={`flex items-center justify-center min-h-screen p-4 ${themeClasses.bg}`}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`max-w-lg mx-auto rounded-3xl p-8 text-center border w-full ${
              theme === 'blue' ? 'bg-white border-blue-200 shadow-2xl' :
              theme === 'pink' ? 'bg-white border-pink-200 shadow-2xl' :
              'bg-gray-900 border-gray-800'
            }`}
          >
            <Trophy className={`w-20 h-20 mx-auto mb-4 ${
              theme === 'blue' ? 'text-blue-500' :
              theme === 'pink' ? 'text-pink-500' :
              'text-yellow-400'
            }`} />
            <h2 className={`text-3xl font-bold mb-2 ${
              theme === 'blue' ? 'text-blue-700' :
              theme === 'pink' ? 'text-pink-700' :
              'text-white'
            }`}>Oyun Bitti!</h2>
            <p className={`mb-8 ${
              theme === 'blue' ? 'text-blue-600' :
              theme === 'pink' ? 'text-pink-600' :
              'text-gray-400'
            }`}>Harika bir iş çıkardın.</p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className={`rounded-xl p-4 ${
                theme === 'blue' ? 'bg-blue-50 border border-blue-200' :
                theme === 'pink' ? 'bg-pink-50 border border-pink-200' :
                'bg-gray-800'
              }`}>
                <p className={`text-3xl font-bold ${
                  theme === 'blue' ? 'text-blue-600' :
                  theme === 'pink' ? 'text-pink-600' :
                  'text-green-400'
                }`}>{score}/{questions.length}</p>
                <p className={`text-sm ${
                  theme === 'blue' ? 'text-blue-600' :
                  theme === 'pink' ? 'text-pink-600' :
                  'text-gray-400'
                }`}>Skor</p>
              </div>
              <div className={`rounded-xl p-4 ${
                theme === 'blue' ? 'bg-indigo-50 border border-indigo-200' :
                theme === 'pink' ? 'bg-rose-50 border border-rose-200' :
                'bg-gray-800'
              }`}>
                <p className={`text-3xl font-bold ${
                  theme === 'blue' ? 'text-indigo-600' :
                  theme === 'pink' ? 'text-rose-600' :
                  'text-blue-400'
                }`}>{accuracy}%</p>
                <p className={`text-sm ${
                  theme === 'blue' ? 'text-indigo-600' :
                  theme === 'pink' ? 'text-rose-600' :
                  'text-gray-400'
                }`}>Başarı</p>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button 
                onClick={fetchQuestionsAndStartGame} 
                className={`w-full text-center rounded-xl px-6 py-3 text-lg font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 ${
                  theme === 'blue' ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
                  theme === 'pink' ? 'bg-gradient-to-r from-pink-500 to-rose-500' :
                  'bg-gradient-to-r from-green-500 to-emerald-600'
                }`}
              >
                Tekrar Oyna
              </button>
              <button 
                onClick={() => window.location.href = '/'} 
                className="w-full text-center rounded-xl bg-gradient-to-r from-slate-400 to-slate-500 px-6 py-3 text-lg font-semibold text-white shadow-lg hover:shadow-xl hover:from-slate-500 hover:to-slate-600 transition-all duration-200"
              >
                Ana Menü
              </button>
            </div>
          </motion.div>
        </div>
      </>
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

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const themeClasses = getThemeClasses();

  return (
    <div className={`min-h-screen p-4 sm:p-6 md:p-8 ${themeClasses.bg}`}>
      <div className="max-w-4xl mx-auto">
        {/* Modern Header */}
        <div className={`rounded-xl p-3 mb-4 shadow-lg border ${themeClasses.headerBg} ${themeClasses.headerBorder}`}>
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className={`rounded-lg p-2 border shadow-sm ${
                theme === 'blue' ? 'bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300' :
                theme === 'pink' ? 'bg-gradient-to-br from-pink-100 to-pink-200 border-pink-300' :
                'bg-green-500/20 border-green-500/30'
              }`}>
                <Target className={`w-5 h-5 ${
                  theme === 'blue' ? 'text-blue-600' :
                  theme === 'pink' ? 'text-pink-600' :
                  'text-green-400'
                }`} />
              </div>
              <div>
                <h2 className={`text-lg font-bold ${themeClasses.headerText}`}>Unit {unit}</h2>
                <p className={`text-xs font-medium ${
                  theme === 'blue' ? 'text-blue-600' :
                  theme === 'pink' ? 'text-pink-600' :
                  'text-gray-400'
                }`}>Boşluk Doldurma Oyunu</p>
              </div>
            </div>
            
            {/* Tema Seçici */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setTheme('classic')}
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  theme === 'classic' ? 'bg-gray-800 border-green-400' : 'bg-gray-600 border-gray-400'
                }`}
                title="Klasik Tema"
              />
              <button
                onClick={() => setTheme('blue')}
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  theme === 'blue' ? 'bg-blue-500 border-blue-600' : 'bg-blue-300 border-blue-400'
                }`}
                title="Mavi Tema"
              />
              <button
                onClick={() => setTheme('pink')}
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  theme === 'pink' ? 'bg-pink-500 border-pink-600' : 'bg-pink-300 border-pink-400'
                }`}
                title="Pembe Tema"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className={`text-xs font-medium ${
                  theme === 'blue' ? 'text-blue-600' :
                  theme === 'pink' ? 'text-pink-600' :
                  'text-gray-400'
                }`}>{currentQuestionIndex + 1}/{questions.length}</div>
                <div className={`w-16 bg-gray-200 rounded-full h-1.5 ${
                  theme === 'blue' ? 'bg-blue-100' :
                  theme === 'pink' ? 'bg-pink-100' :
                  'bg-gray-700'
                }`}>
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      theme === 'blue' ? 'bg-gradient-to-r from-blue-400 to-indigo-500' :
                      theme === 'pink' ? 'bg-gradient-to-r from-pink-400 to-rose-500' :
                      'bg-gradient-to-r from-green-400 to-emerald-500'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <div className={`text-2xl font-bold ${themeClasses.scoreText}`}>{score}</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={`w-full rounded-full h-3 mb-6 ${themeClasses.progressBg}`}>
          <motion.div
            className={`h-3 rounded-full transition-all duration-500 shadow-sm ${themeClasses.progressFill}`}
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
            className={`p-8 rounded-2xl shadow-2xl border mb-8 ${themeClasses.cardBg} ${themeClasses.cardBorder}`}
          >
            <p className={`text-2xl md:text-3xl text-center leading-relaxed ${themeClasses.cardText}`}>
              {currentQuestion.sentence.replace(currentQuestion.correctAnswer, BLANK_PLACEHOLDER)}
            </p>
          </motion.div>
        </AnimatePresence>
        
        {/* Seçenekler */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedAnswer === option;
            const isTheCorrectAnswer = option === currentQuestion.correctAnswer;
            
            let buttonClass = themeClasses.buttonBase;
            if (isSelected) {
              buttonClass = isCorrect ? themeClasses.buttonCorrect : themeClasses.buttonWrong;
            } else if (selectedAnswer !== null && isTheCorrectAnswer) {
              buttonClass = themeClasses.buttonCorrect;
            } else if (selectedAnswer !== null) {
              buttonClass = themeClasses.buttonDisabled;
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
