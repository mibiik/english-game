import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Trophy, Target, CheckCircle, XCircle } from 'lucide-react';
import { WordDetail } from '../../data/words';
import { learningStatsTracker } from '../../data/learningStats';
import { updateWordDifficulty } from '../../data/difficultWords';
import { supabaseAuthService } from '../../services/supabaseAuthService';
import { supabaseGameScoreService } from '../../services/supabaseGameScoreService';
import { soundService } from '../../services/soundService';

interface MultipleChoiceProps {
  words: WordDetail[];
}

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

export const MultipleChoice: React.FC<MultipleChoiceProps> = React.memo(({ words }) => {
  const [roundWords, setRoundWords] = useState<WordDetail[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0); // Doğru sayısını takip etmek için
  const [streak, setStreak] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<Theme>('blue');
  const [scoreChange, setScoreChange] = useState<null | { value: number, key: number }>(null);
  const [wrongWords, setWrongWords] = useState<WordDetail[]>([]); // Yanlış yapılan kelimeler
  const [isReviewMode, setIsReviewMode] = useState(false); // Tekrar gösterim modu
  const [reviewRound, setReviewRound] = useState(1); // Tekrar gösterim turu
  const [showReviewInfo, setShowReviewInfo] = useState(false); // Tekrar bilgisi gösterimi
  const [showCongratulations, setShowCongratulations] = useState(false); // Tebrik modalı

  const themeClasses = useMemo(() => getThemeClasses(theme), [theme]);
  
  const shuffleArray = useCallback(<T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  const generateOptions = useCallback((wordList: WordDetail[], currentIndex: number) => {
    const currentWord = wordList[currentIndex];
    const correctAnswer = currentWord.turkish;
  
    const wrongOptions = shuffleArray(
      wordList
        .filter((_, idx) => idx !== currentIndex)
        .map(word => word.turkish)
    ).slice(0, 3);
  
    const allOptions = shuffleArray([...wrongOptions, correctAnswer]);
    setOptions(allOptions);
  }, [shuffleArray]);

  // Mevcut kelimeyi memoize et
  const currentWord = useMemo(() => {
    return roundWords[currentWordIndex];
  }, [roundWords, currentWordIndex]);

  const isGameComplete = currentWordIndex >= roundWords.length - 1 && selectedAnswer !== null;
  const progress = ((currentWordIndex + 1) / roundWords.length) * 100;

  const startNewRound = useCallback(() => {
    const shuffledWords = shuffleArray(words);
    setRoundWords(shuffledWords);
    setCurrentWordIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setCorrectCount(0);
    setStreak(0);
    setShowFeedback(false);
    setWrongWords([]);
    setIsReviewMode(false);
    setReviewRound(1);
    setShowReviewInfo(false);
    setShowCongratulations(false);
    if (shuffledWords.length > 0) {
      generateOptions(shuffledWords, 0);
    }
  }, [words, shuffleArray, generateOptions]);

  const startNewGame = useCallback(() => {
    startNewRound();
  }, [startNewRound]);

  // İlk yükleme - her zaman yeni oyun başlat
  useEffect(() => {
    if (words.length > 0) {
      // Her zaman yeni oyun başlat
      setTimeout(() => {
        startNewRound();
        setIsLoading(false);
      }, 100);
    }
  }, [words, startNewRound]);

  // En başa kaydır - TÜM HOOK'LAR burada, koşullu return'lerden ÖNCE
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer !== null) return;

    const currentWord = roundWords[currentWordIndex];
    const correct = answer === currentWord.turkish;
    
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setShowFeedback(true);
    
    updateWordDifficulty(currentWord, correct);

    if (correct) {
      const bonus = Math.min(streak, 2); // Maksimum 2 bonus puan
      const totalPoints = 2 + bonus;
      setScore(prev => prev + totalPoints);
      setCorrectCount(prev => prev + 1);
      setScoreChange({ value: totalPoints, key: Date.now() });
      setStreak(prev => prev + 1);
      learningStatsTracker.recordWordLearned(currentWord);
      const userId = supabaseAuthService.getCurrentUserId();
      if (userId) {
        supabaseGameScoreService.addScore(userId, 'multiple-choice', totalPoints);
      }
      soundService.playCorrect();
      
      // Tekrar gösterim modunda doğru yapıldıysa yanlış kelimeler listesinden çıkar
      if (isReviewMode) {
        setWrongWords(prev => prev.filter(word => word.headword !== currentWord.headword));
      }
    } else {
      setScore(prev => prev - 2);
      setScoreChange({ value: -2, key: Date.now() });
      setStreak(0);
      setWrongWords(prev => [...prev, currentWord]); // Yanlış yapılan kelimeyi ekle
      const userId = supabaseAuthService.getCurrentUserId();
      if (userId) {
        supabaseGameScoreService.addScore(userId, 'multiple-choice', -2);
      }
      soundService.playWrong();
    }

    // Doğru cevaplarda 1 saniye, yanlışlarda 1.5 saniye
    setTimeout(() => {
      handleNextWord();
    }, correct ? 1000 : 1500);
  };

  const handleNextWord = useCallback(() => {
    const nextIndex = currentWordIndex + 1;
    
    if (nextIndex >= roundWords.length) {
      // Tüm kelimeler bitti, yanlış yapılanları kontrol et
      if (wrongWords.length > 0 && !isReviewMode) {
        // Yanlış yapılan kelimeleri tekrar göster
        const shuffledWrongWords = shuffleArray(wrongWords);
        setRoundWords(shuffledWrongWords);
        setCurrentWordIndex(0);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setShowFeedback(false);
        setIsReviewMode(true);
        setReviewRound(prev => prev + 1);
        setShowReviewInfo(true); // Tekrar bilgisi göster
        if (shuffledWrongWords.length > 0) {
          generateOptions(shuffledWrongWords, 0);
        }
        return;
      } else if (isReviewMode && wrongWords.length > 0) {
        // Tekrar gösterim modunda da yanlış yapılanlar varsa devam et
        const newWrongWords = wrongWords.filter(word => 
          !roundWords.some(roundWord => roundWord.headword === word.headword)
        );
        if (newWrongWords.length > 0) {
          const shuffledNewWrongWords = shuffleArray(newWrongWords);
          setRoundWords(shuffledNewWrongWords);
          setWrongWords(newWrongWords);
          setCurrentWordIndex(0);
          setSelectedAnswer(null);
          setIsCorrect(null);
          setShowFeedback(false);
          setReviewRound(prev => prev + 1);
          setShowReviewInfo(true); // Tekrar bilgisi göster
          if (shuffledNewWrongWords.length > 0) {
            generateOptions(shuffledNewWrongWords, 0);
          }
          return;
        }
      }
      
              // Gerçekten oyun bitti, tebrik modalını göster
        setShowCongratulations(true);
        const finalScore = score + (isCorrect ? 1 : 0);
        const unit = roundWords[0]?.unit || '1';
      try {
        supabaseGameScoreService.saveScore('multiple-choice', finalScore, unit);
      } catch (error) {
        console.error('Skor kaydedilirken hata:', error);
      }
      return;
    }

    setCurrentWordIndex(nextIndex);
    generateOptions(roundWords, nextIndex);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowFeedback(false);
  }, [roundWords, currentWordIndex, generateOptions, score, isCorrect, wrongWords, isReviewMode, shuffleArray]);

  const getButtonStyle = (option: string) => {
    if (selectedAnswer === null) {
      return `${themeClasses.buttonBase} transform hover:scale-[1.02] cursor-pointer shadow-sm hover:shadow-md`;
    }

    const currentWord = roundWords[currentWordIndex];
    if (option === currentWord.turkish) {
      return `${themeClasses.buttonCorrect} shadow-lg scale-[1.02] ring-2`;
    }
    if (option === selectedAnswer) {
      return `${themeClasses.buttonWrong} shadow-lg scale-[1.02] ring-2`;
    }
    return `${themeClasses.buttonBase} opacity-40 cursor-not-allowed`;
  };

  // KOŞULLU RETURN'LER TÜM HOOK'LARDAN SONRA
  if (roundWords.length === 0) {
    if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Kelimeler yükleniyor...</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-slate-600 text-lg">Kelime bulunamadı</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 transition-colors duration-500 ${themeClasses.bg}`} style={{ paddingTop: 'calc(64px + 1rem)', marginTop: '-128px' }}>
      {/* Tekrar Bilgisi Modal */}
      {showReviewInfo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl ${themeClasses.cardBg}`}>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${themeClasses.headerText}`}>
                Yanlışların Tekrarı
              </h3>
              <p className={`text-lg mb-6 ${themeClasses.text}`}>
                <span className="font-bold text-orange-600">{wrongWords.length}</span> kelimeyi yanlış yaptınız.
              </p>
              <p className={`text-base mb-6 ${themeClasses.text}`}>
                Bu kelimeleri tekrar çalışalım! Doğru yapana kadar devam edeceğiz.
              </p>
              <button
                onClick={() => setShowReviewInfo(false)}
                className={`px-6 py-3 rounded-lg font-semibold text-white transition-transform transform hover:scale-105 shadow-lg ${themeClasses.progressFill}`}
              >
                Başla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tebrik Modal */}
      {showCongratulations && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl ${themeClasses.cardBg}`}>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center animate-bounce">
                <span className="text-3xl">🎉</span>
              </div>
              <h3 className={`text-3xl font-bold mb-4 ${themeClasses.headerText}`}>
                Tebrikler!
              </h3>
              <p className={`text-lg mb-4 ${themeClasses.text}`}>
                Tüm kelimeleri başarıyla tamamladınız!
              </p>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6">
                <p className={`text-sm ${themeClasses.text}`}>
                  <span className="font-bold text-green-600">Doğru Sayısı:</span> {correctCount} / {roundWords.length}
                </p>
                <p className={`text-sm ${themeClasses.text}`}>
                  <span className="font-bold text-blue-600">Toplam Puan:</span> {score}
                </p>
                {isReviewMode && (
                  <p className={`text-sm ${themeClasses.text}`}>
                    <span className="font-bold text-orange-600">Tekrar Turu:</span> {reviewRound - 1}
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCongratulations(false);
                  }}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-transform transform hover:scale-105 shadow-lg ${themeClasses.progressFill}`}
                >
                  Tamamla
                </button>
                <button
                  onClick={() => {
                    setShowCongratulations(false);
                    startNewRound();
                  }}
                  className="flex-1 px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-transform transform hover:scale-105 shadow-lg"
                >
                  Tekrar Oyna
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Puan Gösterimi */}
      {scoreChange && (
        <div key={scoreChange.key} className={`fixed top-1/3 left-1/2 -translate-x-1/2 z-50 pointer-events-none select-none animate-fade-in-out`}
          style={{ fontSize: '2.5rem', fontWeight: 'bold', color: scoreChange.value > 0 ? '#22c55e' : '#ef4444', textShadow: '0 2px 8px rgba(0,0,0,0.15)', opacity: '0.3' }}>
          {scoreChange.value > 0 ? `+${scoreChange.value}` : scoreChange.value}
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        {!isGameComplete ? (
          <>
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              {/* Stats */}
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-2 rounded-full px-4 py-2 shadow-md ${themeClasses.statBg}`}>
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className={`font-bold ${themeClasses.text}`}>{correctCount}</span>
                  <span className={`opacity-70 ${themeClasses.text}`}>/{currentWordIndex + 1}</span>
                </div>
                {streak > 0 && (
                  <div className="flex items-center gap-2 bg-orange-100 rounded-full px-4 py-2 shadow-md">
                    <Target className="w-5 h-5 text-orange-500" />
                    <span className="font-bold text-orange-600">{streak} 🔥</span>
                  </div>
                )}
                {isReviewMode && (
                  <div className="flex items-center gap-2 bg-red-100 rounded-full px-4 py-2 shadow-md">
                    <span className="text-red-600 font-bold">Tekrar {reviewRound}</span>
                    <span className="text-red-600 text-sm">({wrongWords.length} kelime)</span>
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
                <h2 className={`text-3xl md:text-4xl font-bold mb-2 ${themeClasses.headerText}`}>
                  {currentWord.headword}
                </h2>
                <p className={`${themeClasses.text}`}>Doğru Türkçe karşılığını seçin</p>
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
              {options.map((option, index) => (
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
          </>
        ) : (
          <div className="text-center flex flex-col items-center justify-center min-h-[70vh]">
            <Trophy className="w-24 h-24 text-yellow-400 mb-6" />
            <h2 className={`text-4xl font-bold mb-4 ${themeClasses.headerText}`}>Oyun Bitti!</h2>
            <p className={`text-xl mb-6 ${themeClasses.text}`}>
              Doğru Sayısı: <span className="font-extrabold">{correctCount} / {roundWords.length}</span>
            </p>
            <p className={`text-lg mb-6 ${themeClasses.text}`}>
              Toplam Puan: <span className="font-extrabold">{score}</span>
            </p>
            {isReviewMode && (
              <p className={`text-lg mb-6 ${themeClasses.text}`}>
                Tekrar Gösterim: <span className="font-extrabold">{reviewRound - 1} tur</span>
              </p>
            )}
            <button
              onClick={startNewGame}
              className={`px-8 py-3 rounded-lg font-semibold text-white transition-transform transform hover:scale-105 shadow-lg ${themeClasses.progressFill}`}
            >
              Yeniden Oyna
            </button>
          </div>
        )}
      </div>
    </div>
  );
});