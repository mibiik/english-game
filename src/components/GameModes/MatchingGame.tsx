import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { WordDetail } from '../../data/words';
import { gameScoreService } from '../../services/gameScoreService';
import { authService } from '../../services/authService';
import { AlarmClock, Target, Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';
import { soundService } from '../../services/soundService';
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
    console.log('🔄 MatchingGameWrapper - Kelimeler kontrol ediliyor:', { 
      wordsCount: words?.length || 0,
      hasWords: !!words,
      isArray: Array.isArray(words)
    });
    
    // Kelime kontrolü
    if (!words || !Array.isArray(words) || words.length === 0) {
      console.warn('⚠️ MatchingGameWrapper - Kelime bulunamadı, ana sayfaya yönlendiriliyor');
      navigate('/home');
      return;
    }
    
    // En az bir kelimenin unit bilgisi var mı kontrol et
    const hasValidUnit = words.some(word => word.unit);
    if (!hasValidUnit) {
      console.warn('⚠️ MatchingGameWrapper - Geçerli unit bilgisi bulunamadı, ana sayfaya yönlendiriliyor');
      navigate('/home');
      return;
    }
  }, [words, navigate]);
  
  // Kelime kontrolü
  if (!words || !Array.isArray(words) || words.length === 0) {
    console.log('❌ MatchingGameWrapper - Kelime yok, null döndürülüyor');
    return null;
  }
  
  // Unit bilgisi kontrolü
  const unit = words[0]?.unit;
  if (!unit) {
    console.log('❌ MatchingGameWrapper - Unit bilgisi yok, null döndürülüyor');
    return null;
  }
  
  console.log('✅ MatchingGameWrapper - Oyun başlatılıyor:', { 
    wordsCount: words.length, 
    unit,
    unitWordsCount: words.filter(w => w.unit === unit).length 
  });
  
  return <MatchingGame words={words} unit={unit} />;
};

export function MatchingGame({ words, unit }: MatchingGameProps) {
  const navigate = useNavigate();
  
  // Debug log
  console.log('🎮 MatchingGame - Component başlatıldı:', { 
    wordsCount: words?.length || 0, 
    unit, 
    hasWords: !!words,
    isArray: Array.isArray(words)
  });
  
  const [gameWords, setGameWords] = useState<GameWord[]>([]);
  const [selectedEnglish, setSelectedEnglish] = useState<GameWord | null>(null);
  const [selectedTurkish, setSelectedTurkish] = useState<GameWord | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [theme, setTheme] = useState<'classic' | 'blue' | 'pink'>('blue');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [wrongMessage, setWrongMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(true);
  const [bonus, setBonus] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const previousWords = useRef<WordDetail[]>([]);
  const previousUnit = useRef<string>('');
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(1);
  const [lastRoundWords, setLastRoundWords] = useState<GameWord[]>([]);
  const [wrongCards, setWrongCards] = useState<number[]>([]);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [scoreChange, setScoreChange] = useState<null | { value: number, key: number }>(null);
  const [showDefneModal, setShowDefneModal] = useState(false);
  const [removeTimer, setRemoveTimer] = useState(false); // Süre kaldırıldı mı?

  // Kullanıcı ID'sini al
  const userId = authService.getCurrentUserId();

  // Oyun açılır açılmaz defne ise modalı göster
  useEffect(() => {
    if (userId === 'SHYestLnCWh6FFQ6H08iErDzAb12' || userId === 'uckYnXidETgbgd8sI6ehlgZQnT43') {
      setShowDefneModal(true);
    }
  }, [userId]);

  // Round başlatma
  const startNewGame = useCallback((customWords?: GameWord[]) => {
    console.log('🎮 MatchingGame - startNewGame çağrıldı:', { 
      customWords: !!customWords, 
      wordsCount: words.length, 
      unit,
      currentUnitWords: words.filter(w => w.unit === unit).length 
    });
    
    setShowResult(false);
    setScore(0);
    setBonus(0);
    setRemoveTimer(false); // Her yeni oyunda süre kaldırma sıfırlanır
    setTimeLeft(60);
    setTimerActive(true);
    setScoreSaved(false); // Yeni round için puan kaydetme durumunu sıfırla
    
    if (customWords) {
      // Tekrar oyna için aynı roundu başlat
      setGameWords(customWords);
      setLastRoundWords(customWords);
      setMatchedPairs([]);
      setSelectedEnglish(null);
      setSelectedTurkish(null);
      setIsChecking(false);
      return;
    }

    // Tüm ünite kelimeleri
    const currentUnitWords = words.filter(word => word.unit === unit);
    
    // Kelime kontrolü
    if (currentUnitWords.length === 0) {
      console.error('❌ MatchingGame - Bu ünite için kelime bulunamadı:', { unit, totalWords: words.length });
      return;
    }
    
    const total = currentUnitWords.length;
    const rounds = Math.ceil(total / 9);
    setTotalRounds(rounds);
    
    // Her zaman Round 1'den başla
    setCurrentRound(1);
    
    // Bu round için kelimeleri seç (her zaman ilk 9 kelime)
    const roundStartIndex = 0;
    const roundEndIndex = Math.min(roundStartIndex + 9, total);
    const roundWords = currentUnitWords.slice(roundStartIndex, roundEndIndex);
    
    console.log('📝 MatchingGame - Round kelimeleri hazırlanıyor:', { 
      roundWordsCount: roundWords.length, 
      totalWords: total,
      roundStartIndex,
      roundEndIndex 
    });
    
    // Kartları oluştur
    const englishCards = roundWords.map(word => ({ ...word, id: Math.random(), type: 'english' as const }));
    const turkishCards = roundWords.map(word => ({ ...word, id: Math.random(), type: 'turkish' as const }));
    const allCards = [...englishCards, ...turkishCards].sort(() => 0.5 - Math.random());
    
    console.log('🎴 MatchingGame - Kartlar oluşturuldu:', { 
      totalCards: allCards.length, 
      englishCards: englishCards.length, 
      turkishCards: turkishCards.length 
    });
    
    setGameWords(allCards);
    setLastRoundWords(allCards);
    setMatchedPairs([]);
    setSelectedEnglish(null);
    setSelectedTurkish(null);
    setIsChecking(false);
  }, [words, unit]);

  // Tekrar oyna fonksiyonu:
  const handleReplayRound = () => {
    setScoreSaved(false); // Tekrar oyna için puan kaydetme durumunu sıfırla
    startNewGame(lastRoundWords);
  };

  const handlePreviousRound = () => {
    const currentUnitWords = words.filter(word => word.unit === unit);
    const total = currentUnitWords.length;
    const totalRounds = Math.ceil(total / 9);
    
    setCurrentRound(prev => {
      if (prev <= 1) return totalRounds;
      return prev - 1;
    });
    
    // Yeni round için oyunu başlat
    const prevRound = currentRound <= 1 ? totalRounds : currentRound - 1;
    const roundStartIndex = (prevRound - 1) * 9;
    const roundEndIndex = Math.min(roundStartIndex + 9, total);
    const roundWords = currentUnitWords.slice(roundStartIndex, roundEndIndex);
    
    const englishCards = roundWords.map(word => ({ ...word, id: Math.random(), type: 'english' as const }));
    const turkishCards = roundWords.map(word => ({ ...word, id: Math.random(), type: 'turkish' as const }));
    const allCards = [...englishCards, ...turkishCards].sort(() => 0.5 - Math.random());
    
    setGameWords(allCards);
    setLastRoundWords(allCards);
    setMatchedPairs([]);
    setSelectedEnglish(null);
    setSelectedTurkish(null);
    setIsChecking(false);
    setScore(0);
    setBonus(0);
    setTimeLeft(60);
    setTimerActive(true);
    setScoreSaved(false);
    setShowResult(false); // Round bitiş ekranını kapat
  };

  const handleNextRound = () => {
    const currentUnitWords = words.filter(word => word.unit === unit);
    const total = currentUnitWords.length;
    const totalRounds = Math.ceil(total / 9);
    
    setCurrentRound(prev => {
      if (prev >= totalRounds) return 1;
      return prev + 1;
    });
    
    // Yeni round için oyunu başlat
    const nextRound = currentRound >= totalRounds ? 1 : currentRound + 1;
    const roundStartIndex = (nextRound - 1) * 9;
    const roundEndIndex = Math.min(roundStartIndex + 9, total);
    const roundWords = currentUnitWords.slice(roundStartIndex, roundEndIndex);
    
    const englishCards = roundWords.map(word => ({ ...word, id: Math.random(), type: 'english' as const }));
    const turkishCards = roundWords.map(word => ({ ...word, id: Math.random(), type: 'turkish' as const }));
    const allCards = [...englishCards, ...turkishCards].sort(() => 0.5 - Math.random());
    
    setGameWords(allCards);
    setLastRoundWords(allCards);
    setMatchedPairs([]);
    setSelectedEnglish(null);
    setSelectedTurkish(null);
    setIsChecking(false);
    setScore(0);
    setBonus(0);
    setTimeLeft(60);
    setTimerActive(true);
    setScoreSaved(false);
    setShowResult(false); // Round bitiş ekranını kapat
  };

  useEffect(() => {
    const hasWordsChanged = JSON.stringify(previousWords.current) !== JSON.stringify(words);
    const hasUnitChanged = previousUnit.current !== '' && previousUnit.current !== unit;
    
    // Sadece gerçekten değişiklik varsa ve oyun henüz başlamamışsa sıfırla
    if ((hasWordsChanged || hasUnitChanged) && gameWords.length === 0) {
      setSelectedEnglish(null);
      setSelectedTurkish(null);
      setMatchedPairs([]);
      setIsChecking(false);
      setScore(0);
      setShowResult(false);
      setCurrentRound(1);
      setTotalRounds(1);
      setLastRoundWords([]);
      setWrongCards([]);
      setScoreSaved(false);
      setScoreChange(null);
      setTimeLeft(60);
      setTimerActive(true);
      setBonus(0);
      setRemoveTimer(false); // Süre kaldırma durumunu sıfırla
    }
    
    previousWords.current = words;
    previousUnit.current = unit;
  }, [words, unit, gameWords.length]);

  useEffect(() => {
    // Oyun başlatma koşullarını kontrol et
    const shouldStartGame = words.length > 0 && 
                           gameWords.length === 0 && 
                           !showResult && 
                           unit && 
                           words.some(word => word.unit === unit);
    
    if (shouldStartGame) {
      console.log('🔄 MatchingGame - Oyun başlatılıyor:', { 
        wordsCount: words.length, 
        unit, 
        unitWordsCount: words.filter(w => w.unit === unit).length 
      });
      startNewGame();
    }
  }, [words, gameWords.length, showResult, startNewGame, unit]);

  // Timer başlatma ve azaltma
  useEffect(() => {
    if (timerActive && timeLeft > 0 && !showResult && !removeTimer) {
      timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && timerActive && !removeTimer) {
      setTimerActive(false);
      setShowResult(true);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [timerActive, timeLeft, showResult, removeTimer]);

  // Kartlara tıklama
  const handleCardClick = (card: GameWord) => {
    if (isChecking || matchedPairs.includes(card.headword) || showResult) return;
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
      if (selectedEnglish.headword === selectedTurkish.headword) {
        setMatchedPairs(prev => [...prev, selectedEnglish.headword]);
        const point = removeTimer ? 4 : 2;
        setScore(prev => prev + point); // Doğru eşleşmede +2 veya +4 puan
        setScoreChange({ value: +point, key: Date.now() });
        soundService.playCorrect();
        setSelectedEnglish(null);
        setSelectedTurkish(null);
        setIsChecking(false);
      } else {
        setScore(prev => prev - 2); // Yanlış eşleşmede -2 puan
        setScoreChange({ value: -2, key: Date.now() });
        setWrongCards([selectedEnglish.id, selectedTurkish.id]);
        soundService.playWrong();
        setTimeout(() => {
          setWrongCards([]);
        }, 700);
        setSelectedEnglish(null);
        setSelectedTurkish(null);
        setIsChecking(false);
      }
    }
  }, [selectedEnglish, selectedTurkish]);

  // Süre kaldırma butonu fonksiyonu
  const handleRemoveTimer = () => {
    setRemoveTimer(true);
    setTimerActive(false);
    setTimeLeft(Infinity); // Sonsuz süre
  };

  // Round bittiğinde puanı ve bonusu kaydet
  useEffect(() => {
    const saveScore = async () => {
      if (gameWords.length > 0 && (matchedPairs.length === gameWords.length / 2 || (timeLeft === 0 && !removeTimer)) && !showResult && !scoreSaved) {
        setTimerActive(false);
        // Süre bonusu hesapla - sadece süre kaldırılmadıysa
        const calculatedBonus = removeTimer ? 0 : Math.ceil(timeLeft / 2);
        setBonus(calculatedBonus);
        const finalScore = score + calculatedBonus;
        
        // Kullanıcı ID'sini al ve puanı topla
        const userId = authService.getCurrentUserId();
        console.log('🔥 MatchingGame - Round bitti:', { userId, finalScore, score, calculatedBonus, currentRound, totalRounds });
        if (userId) {
          try {
            await gameScoreService.addScore(userId, 'matching', finalScore);
            console.log('✅ Puan başarıyla eklendi:', finalScore);
            setScoreSaved(true);
        } catch (error) {
            console.error('❌ Puan eklenirken hata:', error);
        }
      } else {
          console.error('❌ Kullanıcı ID bulunamadı');
        }
        
            setShowResult(true);
      }
    };
    
    saveScore();
  }, [matchedPairs, gameWords, score, unit, timeLeft, showResult, scoreSaved, currentRound, totalRounds, removeTimer]);

  // Tasarım ve görsel yapı korunacak, sadece puan sistemi sadeleşecek
    if (showResult) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100" style={{ marginTop: '-160px' }}>
        <div className="text-center p-8 rounded-2xl shadow-2xl w-full max-w-lg border bg-white border-blue-200">
          <h2 className="text-4xl font-black mb-4 text-blue-600">Oyun Tamamlandı! 🎉</h2>
          <div className="p-4 rounded-xl mb-6 border bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="font-semibold text-blue-600">Oyun Skoru</span>
            </div>
            <p className="text-3xl font-bold text-blue-800">{score} + <span className="text-green-600">{bonus} Bonus</span></p>
            <p className="mt-2 text-blue-700">Toplam: {score + bonus} puan</p>
            <p className="mt-2 text-blue-700">{matchedPairs.length} / {gameWords.length / 2} kelime eşleştirdin</p>
          </div>
          <button onClick={handleNextRound} className="w-full text-center rounded-xl px-6 py-3 text-lg font-semibold text-white shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-200">Sonraki Round</button>
          <button onClick={handleReplayRound} className="w-full text-center rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-600 px-6 py-3 text-lg font-semibold text-white shadow-lg hover:shadow-xl hover:from-yellow-500 hover:to-yellow-700 transition-all duration-200 mt-4">Tekrar Oyna</button>
          <button onClick={() => navigate('/')} className="w-full text-center rounded-xl bg-gradient-to-r from-slate-400 to-slate-500 px-6 py-3 text-lg font-semibold text-white shadow-lg hover:shadow-xl hover:from-slate-500 hover:to-slate-600 transition-all duration-200 mt-4">Git</button>
        </div>
    </div>
  );
  }

  // Kart render fonksiyonu
  const renderCard = (card: GameWord) => {
    const isSelected = card.id === selectedEnglish?.id || card.id === selectedTurkish?.id;
    const isMatched = matchedPairs.includes(card.headword);
    const isWrong = wrongCards.includes(card.id);
    let cardStateClasses = '';
    const themes = {
      classic: {
        normal: 'bg-gray-800 border-gray-700 hover:border-cyan-400 text-white',
        selected: 'bg-cyan-500 border-cyan-600 text-white scale-105',
        matched: 'bg-green-500 border-green-600 text-white opacity-80 cursor-default',
        wrong: 'bg-red-500 border-red-600 text-white animate-shake',
      },
      blue: {
        normal: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:border-blue-400 text-blue-900 hover:shadow-lg',
        selected: 'bg-gradient-to-br from-blue-400 to-blue-500 border-blue-500 text-white scale-105 shadow-xl',
        matched: 'bg-gradient-to-br from-emerald-400 to-emerald-500 border-emerald-500 text-white shadow-lg cursor-default',
        wrong: 'bg-gradient-to-br from-red-400 to-red-500 border-red-500 text-white animate-shake shadow-lg',
      },
      pink: {
        normal: 'bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 hover:border-pink-400 text-pink-900 hover:shadow-lg',
        selected: 'bg-gradient-to-br from-pink-400 to-pink-500 border-pink-500 text-white scale-105 shadow-xl',
        matched: 'bg-gradient-to-br from-emerald-400 to-emerald-500 border-emerald-500 text-white shadow-lg cursor-default',
        wrong: 'bg-gradient-to-br from-red-400 to-red-500 border-red-500 text-white animate-shake shadow-lg',
      }
    };
    cardStateClasses = themes[theme].normal;
    if (isMatched) {
      cardStateClasses = themes[theme].matched;
    } else if (isWrong) {
      cardStateClasses = themes[theme].wrong;
    } else if (isSelected) {
      cardStateClasses = themes[theme].selected;
    }
    return (
      <div
        key={card.id}
        className={`w-full h-20 sm:h-24 md:h-28 lg:h-32 flex items-center justify-center p-1 sm:p-2 md:p-3 rounded-2xl cursor-pointer transition-all duration-300 transform border-2 ${cardStateClasses}`}
        onClick={() => handleCardClick(card)}
      >
        <h3 className="text-center text-sm sm:text-base md:text-lg lg:text-xl font-semibold px-0.5 max-w-full break-words leading-tight">
          {card.type === 'english' ? card.headword : card.turkish}
        </h3>
      </div>
    );
  };

  // Yeni: Oyun Bilgi Kartı Bileşeni
  function GameInfoCard({ unit, timeLeft, theme, setTheme, matchedPairs, totalPairs, onPreviousRound, onNextRound }: { unit: string, timeLeft: number, theme: string, setTheme: (t: any) => void, matchedPairs: string[], totalPairs: number, onPreviousRound: () => void, onNextRound: () => void }) {
    // Kırmızı ve animasyonlu süre stili
    const timeClass = timeLeft <= 10
      ? 'font-bold text-red-600 text-2xl sm:text-3xl md:text-4xl lg:text-5xl animate-pulse'
      : 'font-bold text-red-500 text-2xl sm:text-3xl md:text-4xl lg:text-5xl';
    return (
      <div className="relative flex flex-row md:flex-col items-center justify-center gap-2 md:gap-3 bg-white rounded-xl shadow border border-blue-100 px-3 py-2 md:py-3 w-full max-w-sm md:max-w-xs mx-auto md:h-full md:py-6">
        {/* Round etiketi */}
        <div className="absolute -top-4 md:-top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-20">
          Ünite {unit}
            </div>

        <div className="flex-1 min-w-0 text-left md:w-full">
          <div className="text-lg sm:text-xl font-bold text-blue-800 truncate md:truncate">{matchedPairs.length} / {totalPairs}</div>
          <div className="text-sm sm:text-base text-blue-500 font-medium truncate md:truncate">Eşleştirme Oyunu</div>
          <div className="flex items-center justify-start gap-2 mt-1 sm:mt-2">
            <button
              onClick={onPreviousRound}
              className="p-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors"
              title="Önceki Round"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-base sm:text-lg text-blue-600 font-medium">Round {currentRound}/{totalRounds}</span>
            <button
              onClick={onNextRound}
              className="p-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors"
              title="Sonraki Round"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
            </div>
        <div className="flex items-center gap-2 md:gap-1 md:flex-col md:mt-3 flex-col">
          <span className={timeClass}>
            {timeLeft === Infinity ? '∞' : `${timeLeft}s`}
          </span>
          {/* Süreyi kaldırma butonu küçük ve hemen altında */}
          {!removeTimer && timerActive && (
            <button
              onClick={handleRemoveTimer}
              className="mt-1 px-2 py-1 text-xs bg-red-500 text-white rounded shadow hover:bg-red-600 transition-all"
              style={{fontSize:'0.75rem', minWidth:'auto'}}
            >
              Süreyi Kaldır
            </button>
          )}
          {removeTimer && (
            <div className="mt-1 px-2 py-1 text-xs bg-gray-400 text-white rounded select-none opacity-70 cursor-not-allowed" style={{fontSize:'0.75rem', minWidth:'auto'}}>
              Süre Kaldırıldı
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 ml-2 md:ml-0 md:mt-3 md:flex-col">
          <button
            onClick={() => setTheme('classic')}
            className={`w-6 h-6 rounded-full border-2 transition-all ${theme === 'classic' ? 'bg-gray-800 border-blue-400' : 'bg-gray-600 border-gray-300'}`}
            title="Klasik Tema"
          />
          <button
            onClick={() => setTheme('blue')}
            className={`w-6 h-6 rounded-full border-2 transition-all ${theme === 'blue' ? 'bg-blue-500 border-blue-600' : 'bg-blue-300 border-blue-400'}`}
            title="Mavi Tema"
          />
          <button
            onClick={() => setTheme('pink')}
            className={`w-6 h-6 rounded-full border-2 transition-all ${theme === 'pink' ? 'bg-pink-400 border-pink-600' : 'bg-pink-300 border-pink-400'}`}
            title="Pembe Tema"
          />
        </div>
      </div>
    );
  }

  // Defne Modal göster
  if (showDefneModal) {
    return (
      <DefneSpecialModal onClose={() => setShowDefneModal(false)} />
    );
  }

  // Ana oyun ekranı
  return (
      <div className={`flex items-center justify-center min-h-screen p-1 sm:p-2 md:p-4 ${
        theme === 'blue' ? 'bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100' :
        theme === 'pink' ? 'bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100' :
        'bg-black text-white'
      }`} style={{ marginTop: '-160px' }}>
        <div className="w-full max-w-6xl mx-auto relative">
        {/* Yanlış eşleşme bildirimi */}
        {wrongMessage && (
            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-red-600/90 text-white text-3xl font-extrabold rounded-2xl px-10 py-6 shadow-xl border-2 border-red-200 animate-fade-in-out">
              {wrongMessage}
              </div>
            </div>
          )}
        {scoreChange && (
  <div key={scoreChange.key} className={`fixed top-1/3 left-1/2 -translate-x-1/2 z-50 pointer-events-none select-none animate-fade-in-out`}
    style={{ fontSize: '2.5rem', fontWeight: 'bold', color: scoreChange.value > 0 ? '#22c55e' : '#ef4444', textShadow: '0 2px 8px rgba(0,0,0,0.15)', opacity: '0.3' }}>
    {scoreChange.value > 0 ? `+${scoreChange.value}` : scoreChange.value}
  </div>
)}
        {/* Mobilde yatay, masaüstünde dikey olarak ortada info kartı */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch w-full" style={{ marginTop: '-128px' }}>
          <div className="flex-1">
              <div className="grid grid-cols-3 gap-0.5 sm:gap-1.5 md:gap-2">
              {gameWords.filter(w => w.type === 'english').map(renderCard)}
            </div>
          </div>
          <div className="flex items-center justify-center my-4 md:my-0">
            <GameInfoCard 
              unit={unit} 
              timeLeft={timeLeft} 
              theme={theme} 
              setTheme={setTheme} 
              matchedPairs={matchedPairs} 
              totalPairs={gameWords.length / 2}
              onPreviousRound={handlePreviousRound}
              onNextRound={handleNextRound}
            />
          </div>
          <div className="flex-1">
              <div className="grid grid-cols-3 gap-0.5 sm:gap-1.5 md:gap-2">
              {gameWords.filter(w => w.type === 'turkish').map(renderCard)}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default MatchingGameWrapper;
