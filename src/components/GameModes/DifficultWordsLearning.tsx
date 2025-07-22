import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { WordDetail } from '../../data/words';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Eye, Ear, Heart, Move, Lightbulb, Clock, 
  Play, Pause, RotateCcw, CheckCircle, XCircle, 
  Camera, Sparkles, Timer, Trophy, Target,
  Volume2, Image as ImageIcon, Zap, BookOpen
} from 'lucide-react';
import { aiService } from '../../services/aiService';
import { gameScoreService } from '../../services/gameScoreService';
import { authService } from '../../services/authService';

interface DifficultWordsLearningProps {
  words: WordDetail[];
  onBack: () => void;
}

type LearningMethod = 
  | 'spaced_repetition'
  | 'visual_association' 
  | 'multi_sensory'
  | 'personal_connection'
  | 'active_recall';

type SpacedRepetitionStage = 'first' | 'second' | 'third' | 'completed';

// StoryTheme artık kullanılmıyor - basit görsel sistem

interface WordProgress {
  word: string;
  spacedRepetition: {
    stage: SpacedRepetitionStage;
    nextReviewTime: number;
    correctCount: number;
  };
  imageUrl?: string;
  imagePrompt?: string;
  personalConnection?: string;
  multiSensoryData?: {
    kinesthetic?: string;
    auditory?: string;
    visual?: string;
    emotional?: string;
    conceptual?: string;
    spatial?: string;
  };
}

type Theme = 'ocean' | 'pink' | 'dark';

const getThemeClasses = (theme: Theme) => {
  switch (theme) {
    case 'ocean':
      return {
        bg: 'bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-100',
        cardBg: 'bg-white/70 backdrop-blur-lg border border-blue-200',
        text: 'text-slate-800',
        headerText: 'text-blue-700',
        button: 'bg-blue-500 hover:bg-blue-600 text-white',
        secondaryButton: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
        accent: 'text-blue-600',
        success: 'text-green-600',
        error: 'text-red-600'
      };
    case 'pink':
      return {
        bg: 'bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50',
        cardBg: 'bg-white/70 backdrop-blur-lg border border-pink-200',
        text: 'text-slate-800',
        headerText: 'text-pink-700',
        button: 'bg-pink-500 hover:bg-pink-600 text-white',
        secondaryButton: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
        accent: 'text-pink-600',
        success: 'text-green-600',
        error: 'text-red-600'
      };
    default: // dark
      return {
        bg: 'bg-gradient-to-br from-gray-900 via-slate-900 to-black',
        cardBg: 'bg-gray-800/60 backdrop-blur-lg border border-gray-700',
        text: 'text-gray-200',
        headerText: 'text-cyan-400',
        button: 'bg-cyan-500 hover:bg-cyan-600 text-white',
        secondaryButton: 'bg-gray-700 hover:bg-gray-600 text-white',
        accent: 'text-cyan-400',
        success: 'text-green-400',
        error: 'text-red-400'
      };
  }
};

const SPACED_INTERVALS = [10 * 60 * 1000, 20 * 60 * 1000, 30 * 60 * 1000]; // 10, 20, 30 dakika

export const DifficultWordsLearning: React.FC<DifficultWordsLearningProps> = ({ words, onBack }) => {
  const [theme, setTheme] = useState<Theme>('ocean');
  const [currentMethod, setCurrentMethod] = useState<LearningMethod>('spaced_repetition');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [progress, setProgress] = useState<Record<string, WordProgress>>({});
  const [isGeneratingVisual, setIsGeneratingVisual] = useState(false);
  const [imageLoading, setImageLoading] = useState<Record<string, boolean>>({});
  // Hikaye teması artık kullanılmıyor
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    totalReviews: 0,
    correctAnswers: 0,
    startTime: Date.now()
  });

  const themeClasses = getThemeClasses(theme);
  const currentWord = words[currentWordIndex];

  // Initialize progress for each word and load story theme
  useEffect(() => {
    const initialProgress: Record<string, WordProgress> = {};
    words.forEach(word => {
      const saved = localStorage.getItem(`word_progress_${word.headword}`);
      if (saved) {
        initialProgress[word.headword] = JSON.parse(saved);
      } else {
        initialProgress[word.headword] = {
          word: word.headword,
          spacedRepetition: {
            stage: 'first',
            nextReviewTime: Date.now(),
            correctCount: 0
          }
        };
      }
    });
    setProgress(initialProgress);

    // Hikaye teması artık kullanılmıyor
  }, [words]);

  // Save progress to localStorage
  const saveProgress = useCallback((wordProgress: WordProgress) => {
    localStorage.setItem(`word_progress_${wordProgress.word}`, JSON.stringify(wordProgress));
    setProgress(prev => ({ ...prev, [wordProgress.word]: wordProgress }));
  }, []);

  // Get words due for review
  const wordsForReview = useMemo(() => {
    const now = Date.now();
    return words.filter(word => {
      const wordProgress = progress[word.headword];
      if (!wordProgress) return true;
      
      if (wordProgress.spacedRepetition.stage === 'completed') return false;
      return wordProgress.spacedRepetition.nextReviewTime <= now;
    });
  }, [words, progress]);

  // Generate visual association using AI
  const generateVisualAssociation = async (word: WordDetail) => {
    setIsGeneratingVisual(true);
    try {
      const visualData = await aiService.generateVisualAssociation(word.headword, word.turkish);
      
      const currentProgress = progress[word.headword] || {
        word: word.headword,
        spacedRepetition: { stage: 'first' as SpacedRepetitionStage, nextReviewTime: Date.now(), correctCount: 0 }
      };
      
      saveProgress({
        ...currentProgress,
        imageUrl: visualData.imageUrl,
        imagePrompt: visualData.prompt
      });
    } catch (error) {
      console.error('Visual generation failed:', error);
    }
    setIsGeneratingVisual(false);
  };

  // Handle spaced repetition answer
  const handleSpacedRepetitionAnswer = (correct: boolean) => {
    const wordProgress = progress[currentWord.headword];
    if (!wordProgress) return;

    const newStats = {
      ...sessionStats,
      totalReviews: sessionStats.totalReviews + 1,
      correctAnswers: correct ? sessionStats.correctAnswers + 1 : sessionStats.correctAnswers
    };
    setSessionStats(newStats);

    // Session sonunda skor kaydetme
    if (newStats.totalReviews >= 10) {
      const saveScore = async () => {
        try {
          const finalScore = Math.round((newStats.correctAnswers / newStats.totalReviews) * 100);
          await gameScoreService.saveScore('difficultWords', finalScore, 'all');
          console.log('DifficultWordsLearning skoru kaydedildi:', finalScore);
        } catch (error) {
          console.error('DifficultWordsLearning skoru kaydedilirken hata:', error);
        }
      };
      saveScore();
    }

    if (correct) {
      // Anında puan ekle
      const userId = authService.getCurrentUserId();
      if (userId) {
        gameScoreService.addScore(userId, 'difficultWordsLearning', 1);
      }
      const currentStage = wordProgress.spacedRepetition.stage;
      let nextStage: SpacedRepetitionStage;
      let nextReviewTime: number;

      switch (currentStage) {
        case 'first':
          nextStage = 'second';
          nextReviewTime = Date.now() + SPACED_INTERVALS[0];
          break;
        case 'second':
          nextStage = 'third';
          nextReviewTime = Date.now() + SPACED_INTERVALS[1];
          break;
        case 'third':
          nextStage = 'completed';
          nextReviewTime = Date.now() + SPACED_INTERVALS[2];
          break;
        default:
          nextStage = 'completed';
          nextReviewTime = Date.now() + SPACED_INTERVALS[2];
      }

      saveProgress({
        ...wordProgress,
        spacedRepetition: {
          stage: nextStage,
          nextReviewTime,
          correctCount: wordProgress.spacedRepetition.correctCount + 1
        }
      });
    } else {
      // Reset to first stage if incorrect
      saveProgress({
        ...wordProgress,
        spacedRepetition: {
          stage: 'first',
          nextReviewTime: Date.now() + SPACED_INTERVALS[0],
          correctCount: 0
        }
      });
    }

    // Move to next word
    setTimeout(() => {
      if (currentWordIndex < wordsForReview.length - 1) {
        setCurrentWordIndex(prev => prev + 1);
      } else {
        setCurrentWordIndex(0);
      }
      setShowAnswer(false);
    }, 1500);
  };

  // Text to speech
  const speak = (text: string, lang: string = 'en-US') => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (words.length === 0) {
    return (
      <div className={`min-h-screen p-4 ${themeClasses.bg}`}>
        <div className="max-w-2xl mx-auto">
          <div className={`p-8 rounded-2xl ${themeClasses.cardBg} text-center`}>
            <Trophy className={`w-16 h-16 mx-auto mb-4 ${themeClasses.accent}`} />
            <h2 className={`text-2xl font-bold mb-4 ${themeClasses.text}`}>
              Tebrikler! 🎉
            </h2>
            <p className={`text-lg mb-6 ${themeClasses.text}`}>
              Şu an zorlandığınız kelime bulunmuyor. Tüm kelimelerinizi başarıyla öğrenmişsiniz!
            </p>
            <button
              onClick={onBack}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${themeClasses.button}`}
            >
              Geri Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderSpacedRepetition = () => (
    <div className={`p-6 rounded-2xl ${themeClasses.cardBg}`}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Clock className={`w-6 h-6 ${themeClasses.accent}`} />
          <h3 className={`text-xl font-bold ${themeClasses.headerText}`}>
            Aralıklı Tekrar
          </h3>
        </div>
        <div className={`text-sm ${themeClasses.text}`}>
          {currentWordIndex + 1} / {wordsForReview.length}
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className={`text-4xl font-bold mb-4 ${themeClasses.text}`}>
          {currentWord.headword}
        </h2>
        <button
          onClick={() => speak(currentWord.headword)}
          className={`p-2 rounded-full ${themeClasses.secondaryButton} mb-4`}
        >
          <Volume2 className="w-5 h-5" />
        </button>

        <AnimatePresence>
          {showAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <p className={`text-2xl font-semibold ${themeClasses.accent} mb-2`}>
                {currentWord.turkish}
              </p>
              {currentWord.collocations && currentWord.collocations.length > 0 && (
                <p className={`text-sm ${themeClasses.text} italic`}>
                  {currentWord.collocations[0]}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {!showAnswer ? (
          <button
            onClick={() => setShowAnswer(true)}
            className={`px-8 py-3 rounded-lg font-semibold ${themeClasses.button}`}
          >
            Cevabı Göster
          </button>
        ) : (
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => handleSpacedRepetitionAnswer(false)}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold"
            >
              <XCircle className="w-5 h-5" />
              Hatırlamadım
            </button>
            <button
              onClick={() => handleSpacedRepetitionAnswer(true)}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold"
            >
              <CheckCircle className="w-5 h-5" />
              Hatırladım
            </button>
          </div>
        )}
      </div>

      {/* Progress indicator */}
      <div className="mt-6">
        <div className="flex justify-between text-sm mb-2">
          <span className={themeClasses.text}>İlerleme</span>
          <span className={themeClasses.text}>
            {progress[currentWord.headword]?.spacedRepetition.stage === 'completed' ? 'Tamamlandı' : 
             progress[currentWord.headword]?.spacedRepetition.stage === 'third' ? '3/3' :
             progress[currentWord.headword]?.spacedRepetition.stage === 'second' ? '2/3' : '1/3'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: progress[currentWord.headword]?.spacedRepetition.stage === 'completed' ? '100%' : 
                     progress[currentWord.headword]?.spacedRepetition.stage === 'third' ? '75%' :
                     progress[currentWord.headword]?.spacedRepetition.stage === 'second' ? '50%' : '25%'
            }}
          ></div>
        </div>
      </div>
    </div>
  );

  const renderVisualAssociation = () => (
    <div className={`p-6 rounded-2xl ${themeClasses.cardBg}`}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Eye className={`w-6 h-6 ${themeClasses.accent}`} />
          <h3 className={`text-xl font-bold ${themeClasses.headerText}`}>
            Görsel İlişkilendirme
          </h3>
        </div>
        {/* Tema değiştirme artık yok */}
      </div>

      {/* Tema göstergesi artık yok - her kelime kendi optimum görselini alıyor */}

      <div className="text-center mb-6">
        <h2 className={`text-3xl font-bold mb-2 ${themeClasses.text}`}>
          {currentWord.headword}
        </h2>
        <p className={`text-xl ${themeClasses.accent} mb-4`}>
          {currentWord.turkish}
        </p>

        {progress[currentWord.headword]?.imageUrl ? (
          <div className="mb-4 space-y-4">
            {/* Resim Önizlemesi */}
            <div className="relative rounded-lg overflow-hidden shadow-lg bg-gray-50">
              {imageLoading[currentWord.headword] && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Sparkles className="w-5 h-5 animate-spin" />
                    <span>Resim yükleniyor...</span>
                  </div>
                </div>
              )}
              <img 
                src={progress[currentWord.headword]?.imageUrl} 
                alt={`${currentWord.headword} görsel hafıza`}
                className="w-full max-h-80 object-contain"
                onLoad={() => {
                  setImageLoading(prev => ({...prev, [currentWord.headword]: false}));
                }}
                onLoadStart={() => {
                  setImageLoading(prev => ({...prev, [currentWord.headword]: true}));
                }}
                onError={(e) => {
                  setImageLoading(prev => ({...prev, [currentWord.headword]: false}));
                  // Resim yüklenemezse gizle
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                AI Generated
              </div>
            </div>

            {/* Yeniden Oluştur Butonu */}
            <div className="text-center">
              <button
                onClick={() => generateVisualAssociation(currentWord)}
                disabled={isGeneratingVisual}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium mx-auto text-sm ${themeClasses.secondaryButton}`}
              >
                {isGeneratingVisual ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Yeniden Oluşturuluyor...
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
                    Yeniden Oluştur
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <p className={`text-sm ${themeClasses.text} mb-4`}>
              Bu kelime için görsel oluşturalım!
            </p>
            <button
              onClick={() => generateVisualAssociation(currentWord)}
              disabled={isGeneratingVisual}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold mx-auto ${themeClasses.button}`}
            >
              {isGeneratingVisual ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" />
                  Görsel Oluşturuluyor...
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5" />
                  Görsel Oluştur
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderMultiSensory = () => (
    <div className={`p-6 rounded-2xl ${themeClasses.cardBg}`}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Brain className={`w-6 h-6 ${themeClasses.accent}`} />
          <h3 className={`text-xl font-bold ${themeClasses.headerText}`}>
            Çok Duyulu Kodlama (KAVE COGS)
          </h3>
        </div>
      </div>

      <div className="text-center mb-6">
        <h2 className={`text-3xl font-bold mb-2 ${themeClasses.text}`}>
          {currentWord.headword}
        </h2>
        <p className={`text-xl ${themeClasses.accent} mb-6`}>
          {currentWord.turkish}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg ${themeClasses.cardBg} border`}>
            <div className="flex items-center gap-2 mb-2">
              <Move className="w-5 h-5 text-orange-500" />
              <span className="font-semibold">Kinesthetic (Hareket)</span>
            </div>
            <p className="text-sm">Bu kelimeyi nasıl hareketle gösterebilirsin?</p>
          </div>

          <div className={`p-4 rounded-lg ${themeClasses.cardBg} border`}>
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className="w-5 h-5 text-blue-500" />
              <span className="font-semibold">Auditory (İşitsel)</span>
            </div>
            <button 
              onClick={() => speak(currentWord.headword)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Telaffuzu dinle ve tekrarla
            </button>
          </div>

          <div className={`p-4 rounded-lg ${themeClasses.cardBg} border`}>
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-green-500" />
              <span className="font-semibold">Visual (Görsel)</span>
            </div>
            <p className="text-sm">Bu kelimeyi temsil eden bir resim çiz</p>
          </div>

          <div className={`p-4 rounded-lg ${themeClasses.cardBg} border`}>
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="font-semibold">Emotional (Duygusal)</span>
            </div>
            <p className="text-sm">Bu kelime seni nasıl hissettiriyor?</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActiveRecall = () => (
    <div className={`p-6 rounded-2xl ${themeClasses.cardBg}`}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Zap className={`w-6 h-6 ${themeClasses.accent}`} />
          <h3 className={`text-xl font-bold ${themeClasses.headerText}`}>
            Aktif Hatırlama Oyunu
          </h3>
        </div>
      </div>

      <div className="text-center">
        <div className={`p-6 rounded-lg bg-gradient-to-r from-yellow-100 to-orange-100 mb-6`}>
          <h2 className={`text-2xl font-bold text-gray-800 mb-4`}>
            Hızlı Çağrışım!
          </h2>
          <p className={`text-lg text-gray-700 mb-2`}>
            "{currentWord.turkish}" kelimesinin İngilizcesi nedir?
          </p>
          <p className="text-sm text-gray-600">
            5 saniye içinde cevap ver!
          </p>
        </div>

        <button
          onClick={() => setShowAnswer(!showAnswer)}
          className={`px-8 py-3 rounded-lg font-semibold ${themeClasses.button}`}
        >
          {showAnswer ? 'Cevabı Gizle' : 'Cevabı Göster'}
        </button>

        {showAnswer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6"
          >
            <p className={`text-4xl font-bold ${themeClasses.accent}`}>
              {currentWord.headword}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen p-4 ${themeClasses.bg}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className={`text-3xl font-bold ${themeClasses.headerText}`}>
              Gelişmiş Öğrenme Sistemi
            </h1>
            <p className={`text-sm ${themeClasses.text} mt-1`}>
              {wordsForReview.length} kelime tekrar için hazır
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button onClick={() => setTheme('ocean')} className={`w-8 h-8 rounded-full bg-blue-500 ${theme === 'ocean' ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}></button>
            <button onClick={() => setTheme('pink')} className={`w-8 h-8 rounded-full bg-pink-500 ${theme === 'pink' ? 'ring-2 ring-offset-2 ring-pink-500' : ''}`}></button>
            <button onClick={() => setTheme('dark')} className={`w-8 h-8 rounded-full bg-gray-800 ${theme === 'dark' ? 'ring-2 ring-offset-2 ring-gray-500' : ''}`}></button>
          </div>
        </div>

        {/* Stats */}
        <div className={`p-4 rounded-lg ${themeClasses.cardBg} mb-6`}>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className={`text-2xl font-bold ${themeClasses.accent}`}>
                {sessionStats.totalReviews}
              </p>
              <p className={`text-sm ${themeClasses.text}`}>Toplam Tekrar</p>
            </div>
            <div>
              <p className={`text-2xl font-bold ${themeClasses.success}`}>
                {sessionStats.totalReviews > 0 ? Math.round((sessionStats.correctAnswers / sessionStats.totalReviews) * 100) : 0}%
              </p>
              <p className={`text-sm ${themeClasses.text}`}>Başarı Oranı</p>
            </div>
            <div>
              <p className={`text-2xl font-bold ${themeClasses.accent}`}>
                {Math.round((Date.now() - sessionStats.startTime) / (1000 * 60))}dk
              </p>
              <p className={`text-sm ${themeClasses.text}`}>Çalışma Süresi</p>
            </div>
          </div>
        </div>

        {/* Method Selector */}
        <div className={`p-4 rounded-lg ${themeClasses.cardBg} mb-6`}>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setCurrentMethod('spaced_repetition')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentMethod === 'spaced_repetition' ? themeClasses.button : themeClasses.secondaryButton
              }`}
            >
              <Clock className="w-4 h-4 inline mr-1" />
              Aralıklı Tekrar
            </button>
            <button
              onClick={() => setCurrentMethod('visual_association')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentMethod === 'visual_association' ? themeClasses.button : themeClasses.secondaryButton
              }`}
            >
              <Eye className="w-4 h-4 inline mr-1" />
              Görsel İlişki
            </button>
            <button
              onClick={() => setCurrentMethod('multi_sensory')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentMethod === 'multi_sensory' ? themeClasses.button : themeClasses.secondaryButton
              }`}
            >
              <Brain className="w-4 h-4 inline mr-1" />
              Çok Duyulu
            </button>
            <button
              onClick={() => setCurrentMethod('active_recall')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentMethod === 'active_recall' ? themeClasses.button : themeClasses.secondaryButton
              }`}
            >
              <Zap className="w-4 h-4 inline mr-1" />
              Aktif Hatırlama
            </button>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMethod}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentMethod === 'spaced_repetition' && renderSpacedRepetition()}
            {currentMethod === 'visual_association' && renderVisualAssociation()}
            {currentMethod === 'multi_sensory' && renderMultiSensory()}
            {currentMethod === 'active_recall' && renderActiveRecall()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={onBack}
            className={`px-6 py-3 rounded-lg font-semibold ${themeClasses.secondaryButton}`}
          >
            Geri Dön
          </button>
          
          {wordsForReview.length > 1 && (
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentWordIndex(prev => Math.max(0, prev - 1))}
                disabled={currentWordIndex === 0}
                className={`px-4 py-2 rounded-lg ${themeClasses.secondaryButton} disabled:opacity-50`}
              >
                Önceki
              </button>
              <button
                onClick={() => setCurrentWordIndex(prev => Math.min(wordsForReview.length - 1, prev + 1))}
                disabled={currentWordIndex >= wordsForReview.length - 1}
                className={`px-4 py-2 rounded-lg ${themeClasses.secondaryButton} disabled:opacity-50`}
              >
                Sonraki
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 