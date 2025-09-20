import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Trophy, Loader2, AlertTriangle, RefreshCw, ArrowLeft, ArrowRight, CheckCircle, XCircle, Target } from 'lucide-react';
import { SentenceCompletionService, SentenceQuestion } from '../../services/sentenceCompletionService';
import { gameScoreService } from '../../services/gameScoreService';
import { WordDetail } from '../../data/words';
import { authService } from '../../services/authService';
import { awardPoints } from '../../services/scoreService';
import { soundService } from '../../services/soundService';

interface SentenceCompletionProps {
  words: WordDetail[];
}

type GameStatus = 'loading' | 'playing' | 'answered' | 'completed' | 'error';

const INITIAL_LOAD_COUNT = 10; // İlk 10 soru
type Theme = 'blue' | 'pink' | 'classic';

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
                statBg: 'bg-white/50 backdrop-blur-sm',
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
                statBg: 'bg-white/50 backdrop-blur-sm',
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
                statBg: 'bg-gray-800/40 backdrop-blur-sm',
            };
    }
};

export const SentenceCompletion: React.FC<SentenceCompletionProps> = ({ words }) => {
  // State for game logic
  const [status, setStatus] = useState<GameStatus>('loading');
  const [questions, setQuestions] = useState<SentenceQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  
  // State for game tracking
  const [streak, setStreak] = useState(0);
  const [scoreChange, setScoreChange] = useState<null | { value: number, key: number }>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [theme, setTheme] = useState<Theme>('blue');
  const [correctCount, setCorrectCount] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const themeClasses = useMemo(() => getThemeClasses(theme), [theme]);

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
    setCorrectCount(0);

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

    // Tüm kelimeleri rastgele karıştır
    const shuffledWords = shuffleArray(wordList);
    const initialWords = shuffledWords.slice(0, INITIAL_LOAD_COUNT);
    const remainingWords = shuffledWords.slice(INITIAL_LOAD_COUNT);

    try {
      const initialQuestions = await SentenceCompletionService.generateSentenceCompletions(initialWords);
      if (initialQuestions.length === 0) throw new Error("AI failed to generate initial questions.");

      // İlk soruları da rastgele karıştır
      const shuffledInitialQuestions = shuffleArray(initialQuestions);
      setQuestions(shuffledInitialQuestions);
      setStatus('playing');

      // Arka planda diğer soruları üret
      if (remainingWords.length > 0) {
        setIsLoadingMore(true);
        SentenceCompletionService.generateSentenceCompletions(remainingWords).then(additionalQuestions => {
          // Ek soruları da rastgele karıştır ve mevcut sorularla birleştir
          const shuffledAdditionalQuestions = shuffleArray(additionalQuestions);
          setQuestions(prev => {
            const allQuestions = [...prev, ...shuffledAdditionalQuestions];
            return shuffleArray(allQuestions); // Tüm soruları tekrar karıştır
          });
          setIsLoadingMore(false);
        }).catch(error => {
          console.error("Background loading failed:", error);
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
      setCorrectCount(prev => prev + 1);
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
    if (currentIndex < words.length - 1) {
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
  const getButtonStyle = (option: string) => {
    if (selectedAnswer === null) {
      return `${themeClasses.buttonBase} transform hover:scale-[1.02] cursor-pointer shadow-sm hover:shadow-md`;
    }

    if (option === questions[currentIndex].correctAnswer) {
      return `${themeClasses.buttonCorrect} shadow-lg scale-[1.02] ring-2`;
    }
    if (option === selectedAnswer) {
      return `${themeClasses.buttonWrong} shadow-lg scale-[1.02] ring-2`;
    }
    return `${themeClasses.buttonBase} opacity-40 cursor-not-allowed`;
  };

  const progress = ((currentIndex + 1) / words.length) * 100;

  const renderContent = () => {
    if (status === 'loading') return <InitialLoadingScreen />;
    if (status === 'error') return <ErrorDisplay onRetry={loadGame} />;
    if (status === 'completed') return <CompletedDisplay score={score} total={words.length} onPlayAgain={handlePlayAgain} />;
    if (questions.length === 0) return <GameSkeleton />;

    const currentQuestion = questions[currentIndex];

    return (
      <div className={`min-h-screen p-4 transition-colors duration-500 ${themeClasses.bg}`}>
        {/* Puan Gösterimi */}
        {scoreChange && (
          <div key={scoreChange.key} className={`fixed top-1/3 left-1/2 -translate-x-1/2 z-50 pointer-events-none select-none animate-fade-in-out`}
            style={{ fontSize: '2.5rem', fontWeight: 'bold', color: scoreChange.value > 0 ? '#22c55e' : '#ef4444', textShadow: '0 2px 8px rgba(0,0,0,0.15)', opacity: '0.3' }}>
            {scoreChange.value > 0 ? `+${scoreChange.value}` : scoreChange.value}
          </div>
        )}
        
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            {/* Stats */}
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-2 rounded-full px-4 py-2 shadow-md ${themeClasses.statBg}`}>
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className={`font-bold ${themeClasses.text}`}>{correctCount}</span>
                <span className={`opacity-70 ${themeClasses.text}`}>/{currentIndex + 1}</span>
              </div>
              {streak > 0 && (
                <div className="flex items-center gap-2 bg-orange-100 rounded-full px-4 py-2 shadow-md">
                  <Target className="w-5 h-5 text-orange-500" />
                  <span className="font-bold text-orange-600">{streak} 🔥</span>
                </div>
              )}
            </div>
            {/* Theme Changer */}
            <div className="flex items-center gap-2 p-2 rounded-full shadow-md">
              <button onClick={() => setTheme('blue')} className={`w-7 h-7 rounded-full bg-blue-500 transition-all duration-300 ${theme === 'blue' ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`} aria-label="Mavi Tema"></button>
              <button onClick={() => setTheme('pink')} className={`w-7 h-7 rounded-full bg-pink-500 transition-all duration-300 ${theme === 'pink' ? 'ring-2 ring-offset-2 ring-pink-500' : ''}`} aria-label="Pembe Tema"></button>
              <button onClick={() => setTheme('classic')} className={`w-7 h-7 rounded-full bg-gray-800 border border-gray-600 transition-all duration-300 ${theme === 'classic' ? 'ring-2 ring-offset-2 ring-gray-500' : ''}`} aria-label="Karanlık Tema"></button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-slate-200/50 rounded-full h-2.5 shadow-inner">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ease-out shadow-md ${themeClasses.progressFill}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Section */}
          <div className="text-center mb-6">
            <div className={`rounded-2xl shadow-xl p-6 mb-4 transform transition-all duration-300 ${themeClasses.cardBg}`}>
              <h2 className={`text-2xl font-bold mb-4 ${themeClasses.headerText}`}>
                Boşluğu doğru kelime ile doldurun
              </h2>
              <div className="bg-gray-50/50 rounded-lg p-6 border border-gray-200/50">
                <p className={`text-xl ${themeClasses.text} leading-relaxed`}>
                  {(() => {
                    const parts = currentQuestion.sentence.split('___');
                    // Sadece ilk boşluğu göster, diğerlerini normal metin olarak bırak
                    return parts.map((part, index) => (
                      <React.Fragment key={index}>
                        {part}
                        {index === 0 && parts.length > 1 && (
                          <span className="inline-block w-24 h-8 mx-2 border-b-2 border-blue-400 bg-blue-50/50 rounded"></span>
                        )}
                      </React.Fragment>
                    ));
                  })()}
                </p>
              </div>
            </div>

            {/* Feedback - Sabit yükseklik */}
            <div className="mb-4 h-12 flex items-center justify-center">
              {showFeedback && (
                <div className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 shadow-md ${
                  isCorrect ? 'bg-green-100/80' : 'bg-red-100/80'
                }`}>
                  {isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                  <span className={`font-semibold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {isCorrect ? "Doğru!" : "Yanlış"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={selectedAnswer !== null}
                className={`p-5 rounded-2xl text-lg font-bold transition-all duration-300 ease-in-out text-center ${getButtonStyle(
                  option
                )}`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            <Button
              onClick={handlePreviousQuestion}
              disabled={currentIndex === 0}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Önceki
            </Button>

            <div className={`text-lg font-medium ${themeClasses.text}`}>
              {currentIndex + 1} / {words.length}
            </div>

            <Button
              onClick={handleNextQuestion}
              disabled={status !== 'answered'}
              className={`px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ${themeClasses.progressFill} text-white hover:opacity-90`}
            >
              {currentIndex === words.length - 1 ? 'Bitir' : 'Sonraki'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
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
  <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center" style={{ paddingTop: '64px', marginTop: '-128px' }}>
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
  <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center" style={{ paddingTop: '64px', marginTop: '-128px' }}>
    <div className="text-center bg-white rounded-xl shadow-lg p-8">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
      <p className="text-gray-600">Daha fazla soru yükleniyor...</p>
    </div>
  </div>
);

const ErrorDisplay: React.FC<{ onRetry: () => void; message?: string }> = ({ onRetry, message }) => (
  <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center" style={{ paddingTop: '64px', marginTop: '-128px' }}>
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
  <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center" style={{ paddingTop: '64px', marginTop: '-128px' }}>
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
