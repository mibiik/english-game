import React, { useState, useEffect, useRef } from 'react';
import { WordDetail } from '../../data/words';
import { gameStateManager } from '../../lib/utils';
import { CheckCircle, X, RotateCcw, Sparkles, ArrowRight, Brain, Flame, Trophy } from 'lucide-react';
import { definitionCacheService } from '../../services/definitionCacheService';
import { motion, AnimatePresence } from 'framer-motion';
import { gameScoreService } from '../../services/gameScoreService';
import { authService } from '../../services/authService';
import { awardPoints } from '../../services/scoreService';

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
  progress: number;
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
  const [progress, setProgress] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
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

  // Oyunu başlat - Hızlı loading ile
  const initializeGame = async () => {
    if (gameInitialized.current || words.length === 0) return;
    
    // Önce kaydedilmiş state'i kontrol et
    const savedState = gameStateManager.loadGameState(GAME_KEY) as GameState | null;
    if (savedState && savedState.questions.length > 0) {
      // Kaydedilmiş oyun var, yükle
      setQuestions(savedState.questions);
      setCurrentIndex(savedState.currentIndex);
      setSelectedAnswer(savedState.selectedAnswer);
      setIsCorrect(savedState.isCorrect);
      setScore(savedState.score);
      setStreak(savedState.streak);
      setMaxStreak(savedState.maxStreak);
      setShowFeedback(savedState.showFeedback);
      setUnitCompleted(savedState.unitCompleted);
      setProgress(savedState.progress);
      setShowHint(savedState.showHint);
      setIsDarkMode(savedState.isDarkMode);
      gameInitialized.current = true;
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);

    try {
      const headwords = words.map(w => w.headword);
      console.log('⚡ Hızlı oyun başlatılıyor:', headwords.length, 'kelime');
      
      // Hızlı loading için timeout + fallback
      const definitionPromise = definitionCacheService.getDefinitions(headwords, 'en');
      const quickStartPromise = new Promise<Record<string, string>>(resolve => {
        setTimeout(() => {
          console.log('⏰ Quick start timeout, boş definition\'larla başlıyor');
          resolve({});
        }, 2000); // 2 saniye
      });

      // Hangisi önce gelirse onu kullan
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
      setProgress(0);
      
      gameInitialized.current = true;
      setIsLoading(false);
      
      // Arka planda eksik definition'ları doldur
      if (Object.keys(definitions).length < headwords.length) {
        console.log('🔄 Eksik definition\'lar arka planda yükleniyor...');
        definitionCacheService.getDefinitions(headwords, 'en').then(fullDefinitions => {
          setQuestions(prev => prev.map(q => ({
            ...q,
            definition: fullDefinitions[q.correct] || q.definition
          })));
          console.log('✅ Arka plan definition yüklemesi tamamlandı');
        });
      }
      
    } catch (error) {
      console.error('❌ Game initialization error:', error);
      // Fallback: Boş definition'larla başla
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

  // Ünite veya kelime değişikliğini kontrol et
  useEffect(() => {
    const hasUnitChanged = previousUnit.current !== '' && previousUnit.current !== unit;
    const hasWordsChanged = previousWordsCount.current !== 0 && previousWordsCount.current !== words.length;
    
    if (hasUnitChanged || hasWordsChanged) {
      console.log('🔄 Değişiklik algılandı:', { 
        unit: `${previousUnit.current} → ${unit}`,
        words: `${previousWordsCount.current} → ${words.length}`,
        hasUnitChanged,
        hasWordsChanged
      });
      
      // Oyunu sıfırla
      gameInitialized.current = false;
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
      setProgress(0);
    }
    
    // Değerleri güncelle
    previousUnit.current = unit;
    previousWordsCount.current = words.length;
    
    // Oyunu başlat
    if (words.length > 0) {
      gameInitialized.current = false;
      initializeGame();
    }
  }, [words, unit]);

  // Progress hesapla
  useEffect(() => {
    if (questions.length > 0) {
      setProgress(((currentIndex + 1) / questions.length) * 100);
    }
  }, [currentIndex, questions.length]);

  // Her state değişikliğinde localStorage'a kaydet
  useEffect(() => {
    if (questions.length > 0 && gameInitialized.current) {
      const gameState: GameState = {
        questions,
        currentIndex,
        selectedAnswer,
        isCorrect,
        score,
        streak,
        maxStreak,
        showFeedback,
        unitCompleted,
        progress,
        showHint,
        isDarkMode
      };
      gameStateManager.saveGameState(GAME_KEY, gameState);
    }
  }, [questions, currentIndex, selectedAnswer, isCorrect, score, streak, maxStreak, showFeedback, unitCompleted, progress, showHint, isDarkMode, GAME_KEY]);

  // Cevap seçildiğinde
  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    const correct = answer === questions[currentIndex].correct;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore(prev => prev + 1);
      setStreak(prev => {
        const newStreak = prev + 1;
        setMaxStreak(current => Math.max(current, newStreak));
        return newStreak;
      });
      const bonus = Math.min(streak, 5);
      awardPoints('definitionToWord', 1 + bonus, unit);
    } else {
      setStreak(0);
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
    setProgress(0);
    initializeGame();
  };

  // Loading
  if (isLoading) {
    return (
      <div className={!isDarkMode ? 'min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4' : 'min-h-screen bg-gray-950 flex items-center justify-center p-4'}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className={`w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center border ${
            !isDarkMode 
              ? 'bg-white border-slate-200 shadow-md' 
              : 'bg-gray-800 border-gray-700'
          }`}>
            <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className={`text-sm ${!isDarkMode ? 'text-slate-600' : 'text-gray-400'}`}>
            Yükleniyor...
          </p>
        </motion.div>
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
      <div className={!isDarkMode ? 'min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4' : 'min-h-screen bg-gray-950 flex items-center justify-center p-4'}>
        <div className={`text-center ${!isDarkMode ? 'text-slate-800' : 'text-white'}`}>
          <X className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Kelime Bulunamadı</h2>
          <p className={!isDarkMode ? 'text-slate-600' : 'text-gray-400'}>
            Bu ünitede kullanılabilir kelime yok.
          </p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  
  // Theme sınıfları
  const themeClasses = !isDarkMode ? {
    bg: 'min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100',
    container: 'max-w-4xl mx-auto p-4',
    headerBg: 'bg-white',
    headerText: 'text-slate-700',
    headerBorder: 'border-slate-200',
    cardBg: 'bg-white',
    cardBorder: 'border-slate-200',
    cardText: 'text-slate-800',
    buttonBase: 'bg-gradient-to-r from-slate-50 to-slate-100 hover:from-blue-50 hover:to-blue-100 border-2 border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700',
    buttonCorrect: 'bg-gradient-to-r from-green-500 to-green-600 text-white border-2 border-green-400 shadow-lg shadow-green-200',
    buttonWrong: 'bg-gradient-to-r from-red-500 to-red-600 text-white border-2 border-red-400 shadow-lg shadow-red-200',
    buttonDisabled: 'bg-slate-100 border-2 border-slate-200 text-slate-400',
    hintButton: 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-300',
    hintShow: 'bg-blue-100 text-blue-700 border border-blue-300',
    progressBg: 'bg-slate-200',
    progressFill: 'bg-gradient-to-r from-blue-500 to-purple-600',
    feedbackCorrect: 'bg-green-100 text-green-700',
    feedbackWrong: 'bg-red-100 text-red-700',
    toggleButton: 'bg-slate-200 hover:bg-slate-300 text-slate-700'
  } : {
    bg: 'min-h-screen bg-gray-950',
    container: 'max-w-4xl mx-auto p-4 text-white',
    headerBg: 'bg-gray-900',
    headerText: 'text-gray-300',
    headerBorder: 'border-gray-800',
    cardBg: 'bg-gray-900',
    cardBorder: 'border-gray-800',
    cardText: 'text-white',
    buttonBase: 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:border-gray-600',
    buttonCorrect: 'bg-emerald-500 border-emerald-500 text-white',
    buttonWrong: 'bg-red-500 border-red-500 text-white',
    buttonDisabled: 'bg-gray-800 border-gray-700 text-gray-500',
    hintButton: 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700',
    hintShow: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    progressBg: 'bg-gray-800',
    progressFill: 'bg-gradient-to-r from-blue-500 to-purple-600',
    feedbackCorrect: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    feedbackWrong: 'bg-red-500/20 text-red-400 border border-red-500/30',
    toggleButton: 'bg-gray-700 hover:bg-gray-600 text-gray-300'
  };

  const getButtonStyle = (option: string) => {
    if (selectedAnswer === null) {
      return `w-full p-6 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer ${themeClasses.buttonBase}`;
    }
    if (option === currentQuestion.correct) {
      return `w-full p-6 text-lg font-semibold rounded-xl transition-all duration-300 scale-105 ${themeClasses.buttonCorrect}`;
    }
    if (option === selectedAnswer) {
      return `w-full p-6 text-lg font-semibold rounded-xl transition-all duration-300 scale-105 ${themeClasses.buttonWrong}`;
    }
    return `w-full p-6 text-lg font-semibold rounded-xl transition-all duration-300 opacity-60 ${themeClasses.buttonDisabled}`;
  };

  return (
    <div className={themeClasses.bg}>
      <div className={themeClasses.container}>
        
        {/* Header Stats - MultipleChoice tarzı */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-6">
            <div className={`flex items-center gap-2 ${themeClasses.headerBg} rounded-full px-4 py-2 shadow-md border ${themeClasses.headerBorder}`}>
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className={`font-bold ${themeClasses.headerText}`}>{score}</span>
              <span className="text-slate-500">/{questions.length}</span>
            </div>
            {streak > 0 && (
              <div className="flex items-center gap-2 bg-orange-100 rounded-full px-4 py-2 shadow-md">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="font-bold text-orange-600">{streak} 🔥</span>
              </div>
            )}
            {/* Theme Toggle Button */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`px-4 py-2 rounded-full transition-colors ${themeClasses.toggleButton}`}
              title={isDarkMode ? "Light Mode'a geç" : "Dark Mode'a geç"}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
          <div className={`${themeClasses.headerText} font-medium`}>
            {currentIndex + 1} / {questions.length}
          </div>
        </div>

        {/* Feedback - En üstte */}
        <div className="mb-4 h-16 flex items-center justify-center">
          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className={`flex items-center justify-center gap-3 p-4 rounded-xl transition-all duration-300 ${
                  isCorrect ? themeClasses.feedbackCorrect : themeClasses.feedbackWrong
                }`}
              >
                {isCorrect ? (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    <span className="font-semibold text-lg">Harika! +1 puan</span>
                  </>
                ) : (
                  <>
                    <X className="w-6 h-6" />
                    <span className="font-semibold text-lg">Doğrusu: {currentQuestion.correct}</span>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className={`w-full ${themeClasses.progressBg} rounded-full h-3 shadow-inner`}>
            <motion.div
              className={`${themeClasses.progressFill} h-3 rounded-full transition-all duration-500 ease-out shadow-lg`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Question Section */}
        <div className="text-center mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`${themeClasses.cardBg} rounded-2xl shadow-xl p-8 mb-8 transform transition-all duration-300 border ${themeClasses.cardBorder}`}>
                <p className={`text-lg md:text-xl leading-relaxed ${themeClasses.cardText} mb-6`}>
                  {currentQuestion.definition}
                </p>
                <p className={`${themeClasses.cardText} opacity-70`}>Doğru kelimeyi seçin</p>
              </div>
              
              {/* Hint Section */}
              <div className="mb-6">
                {!showHint ? (
                  <button 
                    onClick={() => setShowHint(true)}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${themeClasses.hintButton}`}
                  >
                    İpucu Göster
                  </button>
                ) : (
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${themeClasses.hintShow}`}>
                    <p className="font-medium">{currentQuestion.turkish}</p>
                  </div>
                )}
              </div>
            </motion.div>
                     </AnimatePresence>
         </div>

        {/* Options Grid - MultipleChoice tarzı */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {currentQuestion.options.map((option, index) => (
            <motion.button
              key={`${currentIndex}-${index}-${option}`}
              onClick={() => handleAnswerSelect(option)}
              disabled={selectedAnswer !== null}
              className={getButtonStyle(option)}
              whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
              whileTap={{ scale: 0.98 }}
            >
              {option}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}; 