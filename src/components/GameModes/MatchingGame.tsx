import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { learningStatsTracker } from '../../data/learningStats';
import { Star, Trophy, Medal, ArrowRight, CheckCircle, Target, Zap, Flame, Award, Sparkles, Crown } from 'lucide-react';
import { WordDetail } from '../../data/words';
import { gameScoreService } from '../../services/gameScoreService';
import { authService } from '../../services/authService';
import { awardPoints } from '../../services/scoreService';
import DefneSpecialModal from '../DefneSpecialModal';

interface GameWord extends WordDetail {
  type: 'english' | 'turkish';
  id: number;
}

interface MatchingGameProps {
  words: WordDetail[];
  unit: string;
}

const MatchingGameWrapper = ({ words }: { words: WordDetail[] }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (words && words.length === 0) {
      console.log("No words found for this unit/level, navigating to home.");
      navigate('/home');
    }
  }, [words, navigate]);

  if (!words) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Kelimeler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (words.length === 0) {
    return null;
  }
  
  const unit = words[0]?.unit;
  if (!unit) {
    return null; 
  }

  return <MatchingGame words={words} unit={unit} />;
};

export function MatchingGame({ words, unit }: MatchingGameProps) {
  const navigate = useNavigate();
  const [gameWords, setGameWords] = useState<GameWord[]>([]);
  const [selectedEnglish, setSelectedEnglish] = useState<GameWord | null>(null);
  const [selectedTurkish, setSelectedTurkish] = useState<GameWord | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [theme, setTheme] = useState<'classic' | 'blue' | 'pink'>('blue');
  const [combo, setCombo] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showUnitComplete, setShowUnitComplete] = useState(false);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [motivationalMessage, setMotivationalMessage] = useState('');
  
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [usedWords, setUsedWords] = useState<string[]>([]);
  
  const previousWords = useRef<WordDetail[]>([]);
  const previousUnit = useRef<string>('');
  
  const [showDefneModal, setShowDefneModal] = useState(false);

  useEffect(() => {
    const userId = authService.getCurrentUserId();
    if (userId === 'uckYnXidETgbgd8sI6ehlgZQnT43') {
      setShowDefneModal(true);
    }
  }, []);

  // Ünite kelimelerini al
  const unitWords = words.filter(word => word.unit === unit);
  const totalUnitWords = unitWords.length;
  const completedWords = usedWords.filter(word => unitWords.some(uw => uw.headword === word)).length;
  const unitProgress = Math.round((completedWords / totalUnitWords) * 100);
  
  const startNewGame = useCallback(() => {
    setShowResult(false);
    
    // Ünite kelimelerini al
    const currentUnitWords = words.filter(word => word.unit === unit);
    
    // usedWords'u güncel state'ten al
    setUsedWords(currentUsedWords => {
      // Önce kullanılmamış ünite kelimelerini al
      const availableUnitWords = currentUnitWords.filter(word => !currentUsedWords.includes(word.headword));
      
      let wordsForRound: WordDetail[] = [];
      let newUsedWords = currentUsedWords;
      
      if (availableUnitWords.length >= 9) {
        // Yeterli kelime varsa 9 tane al
        wordsForRound = availableUnitWords.slice(0, 9);
        newUsedWords = [...new Set([...currentUsedWords, ...wordsForRound.map(w => w.headword)])];
      } else if (availableUnitWords.length > 0) {
        // Az kelime kaldıysa hepsini al
        wordsForRound = availableUnitWords;
        newUsedWords = [...new Set([...currentUsedWords, ...wordsForRound.map(w => w.headword)])];
      } else {
        // Kelimeler bitti, baştan başla
        wordsForRound = currentUnitWords.slice(0, Math.min(9, currentUnitWords.length));
        newUsedWords = wordsForRound.map(w => w.headword);
      }

      const roundWords = wordsForRound.sort(() => 0.5 - Math.random());
      
      const englishCards = roundWords.map(word => ({ ...word, id: Math.random(), type: 'english' as const }));
      const turkishCards = roundWords.map(word => ({ ...word, id: Math.random(), type: 'turkish' as const }));

      setGameWords([...englishCards, ...turkishCards].sort(() => 0.5 - Math.random()));
      setMatchedPairs([]);
      setSelectedEnglish(null);
      setSelectedTurkish(null);
      setIsChecking(false);
      
      return newUsedWords;
    });
  }, [words, unit]);

  const handleManualNewGame = useCallback(() => {
    setScore(0);
    setAttempts(0);
    setCombo(0);
    setMotivationalMessage('');
    startNewGame();
  }, [startNewGame]);

  useEffect(() => {
    const hasWordsChanged = JSON.stringify(previousWords.current) !== JSON.stringify(words);
    const hasUnitChanged = previousUnit.current !== '' && previousUnit.current !== unit;
    
    if (hasWordsChanged || hasUnitChanged) {
      console.log('🔄 MatchingGame değişiklik algılandı:', { 
        unit: `${previousUnit.current} → ${unit}`,
        wordsChanged: hasWordsChanged,
        unitChanged: hasUnitChanged
      });
      
      // Oyunu sıfırla
      setGameWords([]);
      setSelectedEnglish(null);
      setSelectedTurkish(null);
      setMatchedPairs([]);
      setIsChecking(false);
      setScore(0);
      setAttempts(0);
      setShowResult(false);
      setUsedWords([]);
    }
    
    // Değerleri güncelle
    previousWords.current = words;
    previousUnit.current = unit;
  }, [words, unit]);

  // Ayrı useEffect ile oyunu başlat
  useEffect(() => {
    if (words.length > 0 && gameWords.length === 0 && !showResult) {
      startNewGame();
    }
  }, [words, gameWords.length, showResult, startNewGame]);

  // En başa kaydır
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleCardClick = (card: GameWord) => {
    if (isChecking || matchedPairs.includes(card.headword)) {
      return;
    }

    if (selectedEnglish && selectedTurkish && selectedEnglish.headword !== selectedTurkish.headword) {
      setSelectedEnglish(null);
      setSelectedTurkish(null);
      setIsChecking(false);
    }

    if (card.type === 'english') {
      setSelectedEnglish(card.id === selectedEnglish?.id ? null : card);
    } else if (card.type === 'turkish') {
      setSelectedTurkish(card.id === selectedTurkish?.id ? null : card);
    }
  };
  
  useEffect(() => {
    if (selectedEnglish && selectedTurkish) {
      setIsChecking(true);
      setAttempts(prev => prev + 1);
      if (selectedEnglish.headword === selectedTurkish.headword) {
        setMatchedPairs(prev => [...prev, selectedEnglish.headword]);
        learningStatsTracker.recordWordLearned(selectedEnglish);
        const newCombo = combo + 1;
        const newStreak = streak + 1;
        const bonusPoints = Math.min(newCombo * 2, 20); // Max 20 bonus
        setCombo(newCombo);
        setStreak(newStreak);
        const bonus = Math.min(newStreak, 5);
        setScore(prev => prev + 1 + bonus); // Ekran skoru da bonuslu
        setMotivationalMessage(getMotivationalMessage(newCombo, newStreak));
        checkAchievements(newCombo, newStreak, score + 1 + bonus);
        // Her doğru eşleşmede streak bonusu ekle
        awardPoints('matching', 1 + bonus, unit);
        setSelectedEnglish(null);
        setSelectedTurkish(null);
        setIsChecking(false);
      } else {
        setCombo(0); // Combo sıfırlanır
        setStreak(0);
        setMotivationalMessage('');
        setTimeout(() => {
          setSelectedEnglish(null);
          setSelectedTurkish(null);
          setIsChecking(false);
        }, 300);
      }
    }
  }, [selectedEnglish, selectedTurkish, combo, streak, score]);

  useEffect(() => {
    if (gameWords.length > 0 && matchedPairs.length === gameWords.length / 2) {
      // Ünite tamamlanma kontrolü
      if (unitProgress >= 100) {
        setShowUnitComplete(true);
        setShowConfetti(true);
        // Skoru kaydet
        try {
          gameScoreService.saveScore('matching', score, unit);
        } catch (error) {
          console.error('Skor kaydedilirken hata:', error);
        }
        setTimeout(() => {
          setShowConfetti(false);
          setShowUnitComplete(false);
          setShowResult(true);
        }, 4000);
      } else {
        // Skoru kaydet
        try {
          gameScoreService.saveScore('matching', score, unit);
        } catch (error) {
          console.error('Skor kaydedilirken hata:', error);
        }
        setTimeout(() => {
            setShowResult(true);
        }, 500);
    }
    }
  }, [matchedPairs, gameWords, unitProgress, score, unit]);

  // Motivasyonlu mesajlar
  const getMotivationalMessage = (combo: number, streak: number) => {
    if (combo >= 5) return "🔥 Muhteşem! Combo yapıyorsun!";
    if (combo >= 3) return "⚡ Harika gidiyorsun!";
    if (streak >= 10) return "🚀 İnanılmaz streak!";
    if (streak >= 5) return "💪 Süper performans!";
    return "";
  };

  // Achievement sistemi
  const checkAchievements = (combo: number, streak: number, score: number) => {
    const newAchievements: string[] = [];
    if (combo >= 5 && !achievements.includes('combo-master')) {
      newAchievements.push('combo-master');
    }
    if (streak >= 10 && !achievements.includes('streak-legend')) {
      newAchievements.push('streak-legend');
    }
    if (score >= 100 && !achievements.includes('score-hunter')) {
      newAchievements.push('score-hunter');
    }
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  // Konfeti efekti component
  const Confetti = () => (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            fontSize: '20px'
          }}
        >
          {['🎉', '⭐', '🎊', '💫', '🏆'][Math.floor(Math.random() * 5)]}
        </div>
      ))}
    </div>
  );

  const renderCard = (card: GameWord) => {
    const isSelected = card.id === selectedEnglish?.id || card.id === selectedTurkish?.id;
    const isMatched = matchedPairs.includes(card.headword);
    const isMismatched = isChecking && isSelected && !isMatched;

    let cardStateClasses = '';
    
    // Tema renkleri
    const themes = {
      classic: {
        normal: 'bg-gray-800 border-gray-700 hover:border-cyan-400 text-white',
        selected: 'bg-cyan-500 border-cyan-600 text-white scale-105',
        matched: 'bg-green-500 border-green-600 text-white opacity-80 cursor-default',
        mismatched: 'bg-red-500 border-red-600 text-white animate-shake'
      },
      blue: {
        normal: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:border-blue-400 text-blue-900 hover:shadow-lg',
        selected: 'bg-gradient-to-br from-blue-400 to-blue-500 border-blue-500 text-white scale-105 shadow-xl',
        matched: 'bg-gradient-to-br from-emerald-400 to-emerald-500 border-emerald-500 text-white shadow-lg cursor-default',
        mismatched: 'bg-gradient-to-br from-red-400 to-red-500 border-red-500 text-white animate-shake shadow-lg'
      },
      pink: {
        normal: 'bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 hover:border-pink-400 text-pink-900 hover:shadow-lg',
        selected: 'bg-gradient-to-br from-pink-400 to-pink-500 border-pink-500 text-white scale-105 shadow-xl',
        matched: 'bg-gradient-to-br from-emerald-400 to-emerald-500 border-emerald-500 text-white shadow-lg cursor-default',
        mismatched: 'bg-gradient-to-br from-red-400 to-red-500 border-red-500 text-white animate-shake shadow-lg'
      }
    };
    
    cardStateClasses = themes[theme].normal;
    if (isMatched) {
      cardStateClasses = themes[theme].matched;
    } else if (isMismatched) {
      cardStateClasses = themes[theme].mismatched;
    } else if (isSelected) {
      cardStateClasses = themes[theme].selected;
    }

    return (
      <div
        key={card.id}
        className={`w-full h-24 sm:h-28 md:h-32 lg:h-36 flex items-center justify-center p-2 sm:p-3 rounded-xl cursor-pointer transition-all duration-300 transform border-2 ${cardStateClasses}`}
        onClick={() => handleCardClick(card)}
      >
        <h3 className="text-center text-sm sm:text-base md:text-lg lg:text-xl font-semibold px-1 max-w-full break-words leading-tight">
          {card.type === 'english' ? card.headword : card.turkish}
        </h3>
      </div>
    );
  };

  // Ünite tamamlama kutlaması
  if (showUnitComplete) {
    return (
      <>
        {showConfetti && <Confetti />}
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
          <div className="text-center bg-white p-12 rounded-3xl shadow-2xl w-full max-w-lg border-4 border-yellow-300">
            <div className="mb-6">
              <Crown className="w-20 h-20 mx-auto text-yellow-500 animate-bounce" />
            </div>
            <h1 className="text-5xl font-black text-transparent bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text mb-4">
              🎊 ÜNİTE TAMAMLANDI! 🎊
            </h1>
            <p className="text-2xl text-gray-700 mb-6">Unit {unit} başarıyla tamamlandı!</p>
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-2xl mb-6">
              <p className="text-lg text-yellow-800 font-bold">🏆 Harika bir performans sergileddin!</p>
              <p className="text-md text-yellow-700 mt-2">Tüm kelimeleri öğrendin ve unit'i bitirdin!</p>
            </div>
            <div className="flex justify-center gap-4">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <Medal className="w-8 h-8 text-orange-500" />
              <Star className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (showResult) {
    return (
      <>
        {showConfetti && <Confetti />}
        <div className={`flex items-center justify-center min-h-screen ${
          theme === 'blue' ? 'bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100' :
          theme === 'pink' ? 'bg-gradient-to-br from-pink-50 via-pink-100 to-rose-100' :
          'bg-black text-white'
        }`}>
          <div className={`text-center p-8 rounded-2xl shadow-2xl w-full max-w-lg border ${
            theme === 'blue' ? 'bg-white border-blue-200' :
            theme === 'pink' ? 'bg-white border-pink-200' :
            'bg-gray-900 border-gray-700'
          }`}>
            <h2 className={`text-4xl font-black mb-4 ${
              theme === 'blue' ? 'text-blue-600' :
              theme === 'pink' ? 'text-pink-600' :
              'text-yellow-400'
            }`}>Round Tamamlandı! 🎉</h2>
            
            {/* Combo ve Streak Gösterimi */}
            <div className="flex justify-center gap-4 mb-4">
              {combo > 0 && (
                <div className="flex items-center gap-1 bg-orange-100 px-3 py-1 rounded-full">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-orange-700 font-bold">{combo}x Combo</span>
                </div>
              )}
              {streak > 0 && (
                <div className="flex items-center gap-1 bg-blue-100 px-3 py-1 rounded-full">
                  <Zap className="w-4 h-4 text-blue-500" />
                  <span className="text-blue-700 font-bold">{streak} Streak</span>
                </div>
              )}
            </div>

            {/* Achievement Rozetleri */}
            {achievements.length > 0 && (
              <div className="flex justify-center gap-2 mb-4">
                {achievements.includes('combo-master') && (
                  <div className="bg-yellow-100 p-2 rounded-full" title="Combo Master">
                    <Award className="w-6 h-6 text-yellow-600" />
                  </div>
                )}
                {achievements.includes('streak-legend') && (
                  <div className="bg-purple-100 p-2 rounded-full" title="Streak Legend">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                  </div>
                )}
                {achievements.includes('score-hunter') && (
                  <div className="bg-green-100 p-2 rounded-full" title="Score Hunter">
                    <Trophy className="w-6 h-6 text-green-600" />
                  </div>
                )}
              </div>
            )}

            <div className={`p-4 rounded-xl mb-6 border ${
              theme === 'blue' ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100' :
              theme === 'pink' ? 'bg-gradient-to-r from-pink-50 to-rose-50 border-pink-100' :
              'bg-blue-900/30 border-blue-700'
            }`}>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className={`w-5 h-5 ${
                  theme === 'blue' ? 'text-blue-600' :
                  theme === 'pink' ? 'text-pink-600' :
                  'text-blue-400'
                }`} />
                <p className={`font-semibold ${
                  theme === 'blue' ? 'text-blue-600' :
                  theme === 'pink' ? 'text-pink-600' :
                  'text-blue-300'
                }`}>Unit {unit} Progress</p>
              </div>
              <div className={`w-full rounded-full h-3 mb-2 ${
                theme === 'blue' ? 'bg-blue-100' :
                theme === 'pink' ? 'bg-pink-100' :
                'bg-gray-700'
              }`}>
                <div 
                  className={`h-3 rounded-full transition-all duration-500 shadow-sm ${
                    theme === 'blue' ? 'bg-gradient-to-r from-blue-400 to-indigo-500' :
                    theme === 'pink' ? 'bg-gradient-to-r from-pink-400 to-rose-500' :
                    'bg-gradient-to-r from-blue-500 to-cyan-500'
                  }`}
                style={{ width: `${unitProgress}%` }}
              />
            </div>
              <p className={`${
                theme === 'blue' ? 'text-blue-700' :
                theme === 'pink' ? 'text-pink-700' :
                'text-gray-300'
              }`}>{completedWords} / {totalUnitWords} kelime (%{unitProgress})</p>
          </div>
          <div className="grid grid-cols-2 gap-4 my-6">
              <div className={`p-4 rounded-xl border ${
                theme === 'blue' ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200' :
                theme === 'pink' ? 'bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200' :
                'bg-gray-800 border-gray-700'
              }`}>
                <p className={`font-medium ${
                  theme === 'blue' ? 'text-blue-600' :
                  theme === 'pink' ? 'text-pink-600' :
                  'text-gray-400'
                }`}>Round Skoru</p>
                <p className={`text-3xl font-bold ${
                  theme === 'blue' ? 'text-blue-800' :
                  theme === 'pink' ? 'text-pink-800' :
                  'text-white'
                }`}>{score}</p>
              </div>
              <div className={`p-4 rounded-xl border ${
                theme === 'blue' ? 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200' :
                theme === 'pink' ? 'bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200' :
                'bg-gray-800 border-gray-700'
              }`}>
                <p className={`font-medium ${
                  theme === 'blue' ? 'text-indigo-600' :
                  theme === 'pink' ? 'text-rose-600' :
                  'text-gray-400'
                }`}>Doğruluk</p>
                <p className={`text-3xl font-bold ${
                  theme === 'blue' ? 'text-indigo-800' :
                  theme === 'pink' ? 'text-rose-800' :
                  'text-white'
                }`}>{attempts > 0 ? `${Math.round((matchedPairs.length / attempts) * 100)}%` : '100%'}</p>
              </div>
          </div>
          <div className="flex justify-center space-x-4 mt-8">
              {unitProgress < 100 && (
                <button
                  onClick={handleManualNewGame}
                  className={`w-full text-center rounded-xl px-6 py-3 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 ${
                    theme === 'blue' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700' :
                    theme === 'pink' ? 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700' :
                    'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500'
                  }`}
                >
                  Sonraki Round
                </button>
              )}
              <button onClick={() => navigate('/')} className="w-full text-center rounded-xl bg-gradient-to-r from-slate-400 to-slate-500 px-6 py-3 text-lg font-semibold text-white shadow-lg hover:shadow-xl hover:from-slate-500 hover:to-slate-600 transition-all duration-200">
                  Ana Menü
              </button>
          </div>
        </div>
      </div>
      </>
    );
  }

  return (
    <>
      {showDefneModal && (
        <DefneSpecialModal onClose={() => setShowDefneModal(false)} />
      )}
      {showConfetti && <Confetti />}
      <div className={`flex items-center justify-center min-h-screen p-2 sm:p-4 ${
        theme === 'blue' ? 'bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100' :
        theme === 'pink' ? 'bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100' :
        'bg-black text-white'
      }`}>
        <div className="w-full max-w-6xl mx-auto relative">
          {/* Motivasyonlu Mesaj */}
          {motivationalMessage && (
            <div className="text-center mb-4">
              <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-2 rounded-full font-bold shadow-lg animate-pulse">
                {motivationalMessage}
              </div>
            </div>
          )}

          {/* Modern Header */}
          <div className={`rounded-xl p-3 mb-4 shadow-lg border ${
            theme === 'blue' ? 'bg-gradient-to-r from-white via-blue-50 to-white border-blue-200' :
            theme === 'pink' ? 'bg-gradient-to-r from-white via-pink-50 to-white border-pink-200' :
            'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-gray-700'
          }`}>
            <div className="flex justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className={`rounded-lg p-2 border shadow-sm ${
                  theme === 'blue' ? 'bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300' :
                  theme === 'pink' ? 'bg-gradient-to-br from-pink-100 to-pink-200 border-pink-300' :
                  'bg-cyan-500/20 border-cyan-500/30'
                }`}>
                  <Target className={`w-5 h-5 ${
                    theme === 'blue' ? 'text-blue-600' :
                    theme === 'pink' ? 'text-pink-600' :
                    'text-cyan-400'
                  }`} />
                </div>
                <div>
                  <h2 className={`text-lg font-bold ${
                    theme === 'blue' ? 'text-blue-800' :
                    theme === 'pink' ? 'text-pink-800' :
                    'text-white'
                  }`}>Unit {unit}</h2>
                  <p className={`text-xs font-medium ${
                    theme === 'blue' ? 'text-blue-600' :
                    theme === 'pink' ? 'text-pink-600' :
                    'text-gray-400'
                  }`}>Eşleştirme Oyunu</p>
                </div>
              </div>
              
              {/* Tema Seçici */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setTheme('classic')}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    theme === 'classic' ? 'bg-gray-800 border-cyan-400' : 'bg-gray-600 border-gray-400'
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
                  }`}>{completedWords}/{totalUnitWords}</div>
                  <div className={`w-16 bg-gray-200 rounded-full h-1.5 ${
                    theme === 'blue' ? 'bg-blue-100' :
                    theme === 'pink' ? 'bg-pink-100' :
                    'bg-gray-700'
                  }`}>
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        theme === 'blue' ? 'bg-gradient-to-r from-blue-400 to-indigo-500' :
                        theme === 'pink' ? 'bg-gradient-to-r from-pink-400 to-rose-500' :
                        'bg-gradient-to-r from-cyan-400 to-blue-500'
                      }`}
                      style={{ width: `${unitProgress}%` }}
                    />
              </div>
            </div>
            
            <button
              onClick={handleManualNewGame}
                  className={`px-3 py-1.5 rounded-lg font-medium text-white shadow hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm ${
                    theme === 'blue' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700' :
                    theme === 'pink' ? 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700' :
                    'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500'
                  }`}
              title="Sonraki Round"
            >
                <ArrowRight className="w-4 h-4" />
                </button>
              </div>
          </div>
        </div>

          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
          <div className="w-full md:w-1/2">
              <h3 className={`text-lg sm:text-xl font-bold text-center mb-2 py-1.5 rounded-lg border ${
                theme === 'blue' ? 'text-blue-600 bg-gradient-to-r from-blue-100 to-blue-200 border-blue-300' :
                theme === 'pink' ? 'text-pink-600 bg-gradient-to-r from-pink-100 to-pink-200 border-pink-300' :
                'text-cyan-400'
              }`}>İNGİLİZCE</h3>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {gameWords.filter(w => w.type === 'english').map(renderCard)}
            </div>
          </div>
          <div className="w-full md:w-1/2">
              <h3 className={`text-lg sm:text-xl font-bold text-center mb-2 py-1.5 rounded-lg border ${
                theme === 'blue' ? 'text-indigo-600 bg-gradient-to-r from-indigo-100 to-indigo-200 border-indigo-300' :
                theme === 'pink' ? 'text-rose-600 bg-gradient-to-r from-rose-100 to-rose-200 border-rose-300' :
                'text-fuchsia-400'
              }`}>TÜRKÇE</h3>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {gameWords.filter(w => w.type === 'turkish').map(renderCard)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MatchingGameWrapper;
