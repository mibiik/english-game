import React, { useState, useEffect, useRef } from 'react';
import { WordDetail } from '../../data/words';
import { gameStateManager } from '../../lib/utils';
import { CheckCircle, X, RotateCcw, Sparkles, ArrowRight, Brain, Flame, Trophy, Target, XCircle } from 'lucide-react';
import { definitionCacheService } from '../../services/definitionCacheService';
import { motion, AnimatePresence } from 'framer-motion';
import { gameScoreService } from '../../services/gameScoreService';
import { authService } from '../../services/authService';
import { awardPoints } from '../../services/scoreService';
import { soundService } from '../../services/soundService';

interface DefinitionToWordGameProps {
  words: WordDetail[];
  unit: string;
}

interface Question {
  definition: string;
  correct: string;
  options: string[];
  turkish: string;
  wordId: string;
}

interface GameState {
  questions: Question[];
  currentIndex: number;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  score: number;
  streak: number;
  maxStreak: number;
  showFeedback: boolean;
  unitCompleted: boolean;
  showHint: boolean;
  isDarkMode: boolean;
}

export const DefinitionToWordGame: React.FC<DefinitionToWordGameProps> = ({ words, unit }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [unitCompleted, setUnitCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [theme, setTheme] = useState<'blue' | 'pink' | 'classic'>('blue');
  const [scoreChange, setScoreChange] = useState<null | { value: number, key: number }>(null);
  
  // Oyun anahtarı
  const GAME_KEY = `definitionToWord_${unit}`;
  
  const gameInitialized = useRef(false);
  const previousUnit = useRef<string>('');
  const previousWordsCount = useRef<number>(0);

  // En başa kaydır
  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Rastgele seçenekler oluştur
  const generateRandomOptions = (correctWord: string, allWords: WordDetail[]): string[] => {
    const wrongOptions = allWords
      .filter(w => w.headword !== correctWord)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.headword);
    
    const allOptions = [correctWord, ...wrongOptions];
    return allOptions.sort(() => Math.random() - 0.5);
  };

  // initializeGame fonksiyonunu sadeleştir:
  const initializeGame = async () => {
    if (gameInitialized.current || words.length === 0) return;
    setIsLoading(true);
    try {
      const headwords = words.map(w => w.headword);
      const definitionPromise = definitionCacheService.getDefinitions(headwords, 'en');
      const quickStartPromise = new Promise<Record<string, string>>(resolve => {
        setTimeout(() => resolve({}), 2000);
      });
      const definitions = await Promise.race([definitionPromise, quickStartPromise]);
      const gameQuestions: Question[] = words.map(word => ({
        definition: definitions[word.headword] || `Loading definition for "${word.headword}"...`,
        correct: word.headword,
        options: generateRandomOptions(word.headword, words),
        turkish: word.turkish,
        wordId: word.headword
      }));
      const shuffledQuestions = gameQuestions.sort(() => Math.random() - 0.5);
      setQuestions(shuffledQuestions);
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setScore(0);
      setStreak(0);
      setMaxStreak(0);
      setShowFeedback(false);
      setShowHint(false);
      setUnitCompleted(false);
      gameInitialized.current = true;
      setIsLoading(false);
      // Arka planda eksik definition'ları doldur
      if (Object.keys(definitions).length < headwords.length) {
        definitionCacheService.getDefinitions(headwords, 'en').then(fullDefinitions => {
          setQuestions(prev => prev.map(q => ({
            ...q,
            definition: fullDefinitions[q.correct] || q.definition
          })));
        });
      }
    } catch (error) {
      const gameQuestions: Question[] = words.map(word => ({
        definition: `Loading definition for "${word.headword}"...`,
        correct: word.headword,
        options: generateRandomOptions(word.headword, words),
        turkish: word.turkish,
        wordId: word.headword
      }));
      setQuestions(gameQuestions.sort(() => Math.random() - 0.5));
      setIsLoading(false);
    }
  };

  // useEffect ile başlatma kısmını sadeleştir:
  useEffect(() => {
    previousUnit.current = unit;
    previousWordsCount.current = words.length;
    if (words.length > 0) {
      gameInitialized.current = false;
      initializeGame();
    }
  }, [words, unit]);

  // Progress hesapla
  useEffect(() => {
    if (questions.length > 0) {
      // setProgress(((currentIndex + 1) / questions.length) * 100); // Removed
    }
  }, [currentIndex, questions.length]);

  // Cevap seçildiğinde
  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    const correct = answer === questions[currentIndex].correct;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore(prev => prev + 2);
      setScoreChange({ value: +2, key: Date.now() });
      setStreak(prev => {
        const newStreak = prev + 1;
        setMaxStreak(current => Math.max(current, newStreak));
        return newStreak;
      });
      const bonus = Math.min(streak, 2); // Maksimum 2 bonus puan
      awardPoints('definitionToWord', 2 + bonus, unit);
      soundService.playCorrect();
    } else {
      setScore(prev => prev - 2);
      setScoreChange({ value: -2, key: Date.now() });
      setStreak(0);
      awardPoints('definitionToWord', -2, unit);
      soundService.playWrong();
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setShowFeedback(false);
        setShowHint(false); // Hint'i sıfırla
      } else {
        setUnitCompleted(true);
        // Ünite tamamlandığında skoru kaydet
        const saveScore = async () => {
          try {
            await gameScoreService.saveScore('definitionToWord', score, unit);
            console.log('DefinitionToWordGame skoru kaydedildi:', score);
          } catch (error) {
            console.error('DefinitionToWordGame skoru kaydedilirken hata:', error);
          }
        };
        saveScore();
      }
    }, correct ? 1500 : 2500);
  };

  // Oyunu yeniden başlat
  const restartGame = () => {
    gameStateManager.clearGameState(GAME_KEY); // State'i temizle
    gameInitialized.current = false;
    // State'leri sıfırla
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setShowFeedback(false);
    setShowHint(false);
    setUnitCompleted(false);
    initializeGame();
  };

  // Loading
  const themeClasses = theme === 'blue' ? {
    bg: 'bg-gradient-to-br from-sky-100 to-blue-200',
    cardBg: 'bg-white/60 backdrop-blur-lg',
    text: 'text-slate-800',
    headerText: 'text-blue-700',
    buttonBase: 'bg-white/80 hover:bg-white border border-blue-200 text-slate-700',
    buttonCorrect: 'bg-green-500 text-white border-green-500',
    buttonWrong: 'bg-red-500 text-white border-red-500',
    progressFill: 'bg-blue-500',
    statBg: 'bg-white/50 backdrop-blur-sm',
  } : theme === 'pink' ? {
    bg: 'bg-gradient-to-br from-rose-100 to-pink-200',
    cardBg: 'bg-white/60 backdrop-blur-lg',
    text: 'text-slate-800',
    headerText: 'text-pink-700',
    buttonBase: 'bg-white/80 hover:bg-white border border-pink-200 text-slate-700',
    buttonCorrect: 'bg-green-500 text-white border-green-500',
    buttonWrong: 'bg-red-500 text-white border-red-500',
    progressFill: 'bg-pink-500',
    statBg: 'bg-white/50 backdrop-blur-sm',
  } : {
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

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-[60vh] ${themeClasses.bg}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Kelimeler yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Unit completed
  if (unitCompleted) {
    const accuracy = Math.round((score / questions.length) * 100);

    return (
      <div className={!isDarkMode ? 'min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4' : 'min-h-screen bg-gray-950 flex items-center justify-center p-4'}>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`max-w-lg mx-auto rounded-3xl p-8 text-center shadow-2xl ${
            !isDarkMode 
              ? 'bg-white border border-slate-200' 
              : 'bg-gray-900 border border-gray-800'
          }`}
        >
          <div className={`w-16 h-16 mx-auto mb-6 rounded-xl bg-emerald-500 flex items-center justify-center`}>
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          
          <h2 className={`text-xl font-bold mb-2 ${!isDarkMode ? 'text-slate-800' : 'text-white'}`}>
            {unit} Tamamlandı
          </h2>
          <p className={`mb-6 ${!isDarkMode ? 'text-slate-600' : 'text-gray-400'}`}>
            Harika iş çıkardın!
          </p>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className={`rounded-xl p-4 ${!isDarkMode ? 'bg-gradient-to-br from-blue-50 to-blue-100' : 'bg-gray-800'}`}>
              <p className={`text-2xl font-bold ${!isDarkMode ? 'text-blue-600' : 'text-emerald-400'}`}>{score}</p>
              <p className={`text-sm ${!isDarkMode ? 'text-blue-800' : 'text-gray-400'}`}>Doğru</p>
            </div>
            <div className={`rounded-xl p-4 ${!isDarkMode ? 'bg-gradient-to-br from-green-50 to-green-100' : 'bg-gray-800'}`}>
              <p className={`text-2xl font-bold ${!isDarkMode ? 'text-green-600' : 'text-blue-400'}`}>{accuracy}%</p>
              <p className={`text-sm ${!isDarkMode ? 'text-green-800' : 'text-gray-400'}`}>Doğruluk</p>
            </div>
            <div className={`rounded-xl p-4 ${!isDarkMode ? 'bg-gradient-to-br from-purple-50 to-purple-100' : 'bg-gray-800'}`}>
              <p className={`text-2xl font-bold ${!isDarkMode ? 'text-purple-600' : 'text-purple-400'}`}>{maxStreak}</p>
              <p className={`text-sm ${!isDarkMode ? 'text-purple-800' : 'text-gray-400'}`}>En İyi Seri</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={restartGame} 
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                !isDarkMode 
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' 
                  : 'bg-gray-800 hover:bg-gray-700 text-white'
              }`}
            >
              Tekrar Dene
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // No questions
  if (questions.length === 0) {
    return (
      <div className={`flex items-center justify-center min-h-[60vh] ${themeClasses.bg}`}>
        <div className="text-center">
          <p className="text-slate-600 text-lg">Kelime bulunamadı</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

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
              <span className={`font-bold ${themeClasses.text}`}>{score}</span>
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
            <h2 className={`text-3xl md:text-4xl font-bold mb-2 ${themeClasses.headerText}`}>{currentQuestion.definition}</h2>
            <p className={`${themeClasses.text}`}>Doğru İngilizce kelimeyi seçin</p>
          </div>
          {/* Feedback - Sabit yükseklik */}
          <div className="mb-4 h-12 flex items-center justify-center">
            {showFeedback && (
              <div className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 shadow-md ${isCorrect ? 'bg-green-100/80' : 'bg-red-100/80'}`}>
                {isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
                <span className={`font-semibold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>{isCorrect ? "Doğru!" : `Yanlış! Doğru cevap: ${currentQuestion.correct}`}</span>
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
              className={`p-5 rounded-2xl text-lg font-bold transition-all duration-300 ease-in-out text-center ${selectedAnswer === null ? themeClasses.buttonBase + ' transform hover:scale-[1.02] cursor-pointer shadow-sm hover:shadow-md' : option === currentQuestion.correct ? themeClasses.buttonCorrect + ' shadow-lg scale-[1.02] ring-2' : option === selectedAnswer ? themeClasses.buttonWrong + ' shadow-lg scale-[1.02] ring-2' : themeClasses.buttonBase + ' opacity-40 cursor-not-allowed'}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}; 