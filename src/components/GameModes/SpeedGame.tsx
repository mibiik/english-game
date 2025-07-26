import React, { useState, useEffect, useRef, useCallback } from 'react';
import { WordDetail } from '../../data/words';
import { wordTracker } from '../../data/wordTracker';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Flame, Award, BarChart2, CheckCircle, XCircle, Clock, Brain } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { definitionCacheService } from '../../services/definitionCacheService';
import { gameStateManager } from '../../lib/utils';
import { learningStatsTracker } from '../../data/learningStats';
import { updateWordDifficulty } from '../../data/difficultWords';
import { CheckCircle as CheckCircleIcon, X, Timer, Trophy, Target, RefreshCw, Clock as ClockIcon } from 'lucide-react';
import { gameScoreService } from '../../services/gameScoreService';
import { authService } from '../../services/authService';
import { awardPoints } from '../../services/scoreService';
import { soundService } from '../../services/soundService';

interface SpeedGameProps {
  words: WordDetail[];
  unit: string;
}

interface Question {
  word: WordDetail;
  options: string[];
  correctAnswer: string;
}

interface GameState {
  questions: Question[];
  currentQuestionIndex: number;
  selectedAnswer: string | null;
  correctAnswersCount: number;
  totalAnswered: number;
  timeLeft: number;
  isGameActive: boolean;
  isGameCompleted: boolean;
  showFeedback: boolean;
  isCorrect: boolean | null;
  streak: number;
  bestStreak: number;
}

const MAX_TIME = 60; // saniye
const COMBO_FOR_FIRE_MODE = 5;
const TIME_BONUS_PER_CORRECT = 1; // saniye

export function SpeedGame({ words, unit }: SpeedGameProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [timeLeft, setTimeLeft] = useState(MAX_TIME);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    () => Number(localStorage.getItem('speedGameHighScore') || '0')
  );
  const [combo, setCombo] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect' | 'ai-checking' | 'ai-correct', message: string } | null>(null);
  const [isAiChecking, setIsAiChecking] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const previousWords = useRef<WordDetail[]>([]);
  const previousUnit = useRef<string>('');

  // Oyun anahtarı
  const GAME_KEY = 'speedGame';
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('speedGameHighScore', score.toString());
    }
  }, [score, highScore]);

  // Ünite veya kelime değişikliğini kontrol et
  useEffect(() => {
    const hasWordsChanged = JSON.stringify(previousWords.current) !== JSON.stringify(words);
    const hasUnitChanged = previousUnit.current !== '' && previousUnit.current !== unit;
    
    if (hasWordsChanged || hasUnitChanged) {
      console.log('🔄 SpeedGame değişiklik algılandı:', { 
        unit: `${previousUnit.current} → ${unit}`,
        wordsChanged: hasWordsChanged,
        unitChanged: hasUnitChanged
      });
      
      // Oyunu sıfırla
      setQuestions([]);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setCorrectAnswersCount(0);
      setTotalAnswered(0);
      setTimeLeft(MAX_TIME);
      setIsGameActive(false);
      setGameOver(false);
      setShowFeedback(false);
      setIsCorrect(null);
      setStreak(0);
      setBestStreak(0);
      setScore(0);
      setCombo(0);
      setIsAiChecking(false);
    }
    
    // Değerleri güncelle
    previousWords.current = words;
    previousUnit.current = unit;
  }, [words, unit]);

  // AI ile cevap kontrol fonksiyonu - çok liberal
  const checkWithAI = useCallback(async (userAnswer: string, englishWord: string, turkishAnswer: string): Promise<boolean> => {
    console.log('🤖 AI kontrol başlatıldı:', { userAnswer, englishWord, turkishAnswer });
    
    try {
      const prompt = `
      ÇOK ÖNEMLİ: Bu bir hız oyunu, kullanıcı hızlı yazıyor. Çok toleranslı ol!
      
      İngilizce kelime: "${englishWord}"
      Kullanıcının yazdığı: "${userAnswer}"
      Sistem beklediği: "${turkishAnswer}"
      
      Kullanıcının cevabı doğru kabul edilebilir mi? Sadece "true" veya "false" yanıtla.
      
      ÇOK ESNEK KRİTERLER:
      - Eş anlamlı kelimeler → DOĞRU
      - Yakın anlamlar → DOĞRU  
      - Kısmi cevaplar → DOĞRU
      - Yazım hataları → DOĞRU (1-2 harf fark olabilir)
      - Kısaltmalar → DOĞRU
      - Kelime kökü doğruysa → DOĞRU
      - Anlamsal benzerlik varsa → DOĞRU
      
      Örnekler:
      - "zarar" için "zara" → true
      - "kredi" için "itibar" → true  
      - "gelecek" için "glcek" → true
      - "güzel" için "gzel" → true
      - "araba" için "oto" → true
      
      Sadece anlamsız/tamamen yanlış cevapları false ver!
      `;
      
      console.log('🤖 AI prompt gönderiliyor...');
      
      const result = await aiService.generateText(prompt);
      const response = (typeof result === 'string' ? result : JSON.stringify(result)).toLowerCase().trim();
      
      console.log('🤖 AI yanıtı:', response);
      
      const isCorrect = response.includes('true') || response === 'true';
      console.log('🤖 AI sonucu:', isCorrect ? '✅ DOĞRU' : '❌ YANLIŞ');
      
      return isCorrect;
    } catch (error) {
      console.error('🤖 AI hatası:', error);
      
      // ÇOOOOK esnek fallback - neredeyse her şeyi kabul et
      const userLower = userAnswer.toLowerCase().trim().replace(/[.,!?;]/g, '');
      const turkishLower = turkishAnswer.toLowerCase().trim().replace(/[.,!?;]/g, '');
      
      console.log('🔄 Fallback kontrol:', { userLower, turkishLower });
      
      // Virgülle ayrılmış kontrol
      if (turkishLower.includes(',')) {
        const alternatives = turkishLower.split(',').map(alt => alt.trim());
        const isMatch = alternatives.some(alt => 
          userLower === alt || 
          userLower.includes(alt) || 
          alt.includes(userLower) ||
          calculateBasicSimilarity(userLower, alt) > 0.4 // %40 benzerlik yeter
        );
        console.log('🔄 Virgüllü fallback:', isMatch);
        return isMatch;
      }
      
      // Tek kelime için süper esnek kontrol
      const similarity = calculateBasicSimilarity(userLower, turkishLower);
      const isMatch = similarity > 0.3 || // %30 benzerlik yeter
                     userLower.includes(turkishLower) || 
                     turkishLower.includes(userLower) ||
                     userLower.length >= 3 && turkishLower.startsWith(userLower.slice(0, 3)); // İlk 3 harf aynıysa
      
      console.log('🔄 Fallback sonucu:', { similarity: similarity.toFixed(2), isMatch });
      return isMatch;
    }
  }, []);

  // Sadece %100 kesin doğruları yakalar, gerisini AI'ya bırakır
  const checkAnswer = useCallback((userAnswer: string, correctAnswer: string): boolean => {
    const normalizeText = (text: string) => text.toLowerCase().trim().replace(/[.,!?;]/g, '');
    
    const answer = normalizeText(userAnswer);
    const correct = normalizeText(correctAnswer);
    
    console.log('🔍 Sistem hızlı kontrol:', { answer, correct });
    
    // Çok kısa cevapları direkt reddet
    if (answer.length <= 1) {
      console.log('❌ Çok kısa cevap');
      return false;
    }
    
    // Sadece TAM eşleşmeleri kabul et
    if (answer === correct) {
      console.log('✅ Tam eşleşme');
      return true;
    }
    
    // Virgülle ayrılmış alternatifler için tam eşleşme kontrol et
    const alternatives = correct.split(',').map(alt => normalizeText(alt.trim()));
    for (const alt of alternatives) {
      if (answer === alt) {
        console.log('✅ Alternatif tam eşleşme:', alt);
        return true;
      }
    }
    
    console.log('❓ Belirsiz, AI\'ya gönderiliyor');
    return false;
  }, []);

  // Basit benzerlik hesaplama
  const calculateBasicSimilarity = (str1: string, str2: string): number => {
    const len1 = str1.length;
    const len2 = str2.length;
    const maxLen = Math.max(len1, len2);
    
    if (maxLen === 0) return 1;
    
    // Ortak karakterleri say
    let commonChars = 0;
    const chars1 = str1.split('');
    const chars2 = str2.split('');
    
    for (const char of chars1) {
      const index = chars2.indexOf(char);
      if (index !== -1) {
        commonChars++;
        chars2.splice(index, 1); // Kullanılan karakteri kaldır
      }
    }
    
    return commonChars / maxLen;
  };

  const generateNewWord = useCallback(() => {
    wordTracker.initializeUnit(words, unit);
    const newWord = wordTracker.getNextWord(words, unit);
    if (!newWord) {
      // Kelime havuzu bitti, oyunu bitir
      setTimeLeft(0);
      return;
    };
    wordTracker.markWordAsSeen(newWord);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(null);
    setIsAiChecking(false);
  }, [words, unit]);

  const startGame = useCallback(async () => {
    setScore(0);
    setCombo(0);
    setTimeLeft(MAX_TIME);
    setGameOver(false);
    setIsGameActive(true);
    
    // Kelimelerin Türkçe anlamlarını önceden cache'le
    console.log('🔄 Kelime anlamları cache\'leniyor...');
    try {
      const headwords = words.map(w => w.headword);
      await definitionCacheService.getDefinitions(headwords, 'tr');
      console.log('✅ Türkçe anlamlar cache\'lendi');
    } catch (error) {
      console.error('❌ Cache hatası:', error);
    }
    
    generateNewWord();
    inputRef.current?.focus();
  }, [generateNewWord, words]);

  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft <= 0 && isGameActive) {
      setGameOver(true);
      setIsGameActive(false);
    }
  }, [isGameActive, timeLeft]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnswer || !isGameActive || isAiChecking) return;

    const answer = selectedAnswer.trim();
    
    // Eğer cevap boşsa hiçbir şey yapma
    if (!answer) return;
    
    const isCorrect = checkAnswer(answer, questions[currentQuestionIndex].word.turkish);

    if (isCorrect) {
      // Sistem doğru diyor - direkt kabul et
      const isFireMode = combo >= COMBO_FOR_FIRE_MODE;
      const points = isFireMode ? 25 : 10;
      setScore(prev => prev + points);
      setCombo(prev => prev + 1);
      setTimeLeft(prev => Math.min(MAX_TIME, prev + TIME_BONUS_PER_CORRECT));
      setFeedback({ type: 'correct', message: `+${points} Puan! +${TIME_BONUS_PER_CORRECT}sn` });
      soundService.playCorrect();
      // Anında puan ekle
      awardPoints('speedGame', 10, unit);
      // Anında puan ekle (AI onaylı cevaplar için de aşağıda var)
      const userId = authService.getCurrentUserId();
      if (userId) {
        gameScoreService.addScore(userId, 'speedGame', points);
      }
      setTimeout(generateNewWord, 500);
    } else {
      // Sistem yanlış diyor - AI'ya sor
      setIsAiChecking(true);
      setFeedback({ type: 'ai-checking', message: '🤖 AI kontrol ediyor... Belki doğrudur!' });
      
      try {
        const aiResult = await checkWithAI(answer, questions[currentQuestionIndex].word.headword, questions[currentQuestionIndex].word.turkish);
        
        if (aiResult) {
          // AI doğru diyor - kabul et
          const isFireMode = combo >= COMBO_FOR_FIRE_MODE;
          const points = (isFireMode ? 25 : 10) + 5; // AI bonus +5 puan
          setScore(prev => prev + points);
          setCombo(prev => prev + 1);
          setTimeLeft(prev => Math.min(MAX_TIME, prev + TIME_BONUS_PER_CORRECT));
          setFeedback({ type: 'ai-correct', message: `AI Onayladı! +${points} Puan! 🤖` });
          soundService.playCorrect();
          // Anında puan ekle
          const userId = authService.getCurrentUserId();
          if (userId) {
            gameScoreService.addScore(userId, 'speedGame', points);
          }
        } else {
          // AI de yanlış diyor
          setCombo(0);
          setFeedback({ type: 'incorrect', message: `Doğru: ${questions[currentQuestionIndex].word.turkish}` });
          soundService.playWrong();
        }
      } catch (error) {
        // AI hatası - sistem cevabını kullan
        setCombo(0);
        setFeedback({ type: 'incorrect', message: `Doğru: ${questions[currentQuestionIndex].word.turkish}` });
        soundService.playWrong();
      }
      
      setIsAiChecking(false);
      setTimeout(generateNewWord, 1500);
    }
  };

  const isFireMode = combo >= COMBO_FOR_FIRE_MODE;

  // En başa kaydır
  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (!isGameActive && !gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-250px)] bg-gray-900 text-white p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-gray-800 p-10 rounded-2xl shadow-2xl border border-gray-700"
        >
          <h1 className="text-5xl font-extrabold mb-2 text-cyan-400">Hız Oyunu</h1>
          <p className="text-gray-400 mb-6">Süre dolmadan olabildiğince çok kelimeyi doğru yaz!</p>
          <div className="bg-green-900/30 p-4 rounded-lg mb-6">
            <h3 className="text-green-400 font-semibold mb-2">🤖 AI Kontrol!</h3>
            <p className="text-gray-300 text-sm">Sistem yanlış derse AI hızlıca kontrol eder ve doğru cevapları onaylar!</p>
            <p className="text-cyan-300 text-xs mt-2">AI onaylı cevaplarda +5 bonus puan!</p>
          </div>
          <button
            onClick={startGame}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-xl font-bold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/30 active:scale-95"
          >
            Oyunu Başlat
          </button>
          <div className="mt-6 text-lg text-amber-400 font-semibold">
            <Award className="inline-block w-6 h-6 mr-2" />
            En Yüksek Skor: {highScore}
          </div>
        </motion.div>
      </div>
    );
  }

  // Oyun sonunda skor kaydetme
  useEffect(() => {
    if (gameOver && score > 0) {
      const saveScore = async () => {
        try {
          await gameScoreService.saveScore('speedGame', score, unit);
          console.log('SpeedGame skoru kaydedildi:', score);
        } catch (error) {
          console.error('SpeedGame skoru kaydedilirken hata:', error);
        }
      };
      saveScore();
    }
  }, [gameOver, score, unit]);

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-250px)] bg-gray-900 text-white p-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-700"
        >
          <h2 className="text-4xl font-bold mb-4 text-red-500">Süre Doldu!</h2>
          <div className="text-6xl font-extrabold text-cyan-400 mb-6">{score}</div>
          {score === highScore && score > 0 && <p className="text-amber-400 mb-4 text-xl animate-pulse">Yeni Yüksek Skor!</p>}
          <button onClick={startGame} className="w-full py-3 mb-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-lg font-bold shadow-lg hover:scale-105 transition-transform">
            Tekrar Oyna
          </button>
          <div className="text-left text-gray-300">
            <p><strong>Eski Yüksek Skor:</strong> {highScore}</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] bg-gray-900 text-white p-4 font-sans relative overflow-hidden">
        {isFireMode && <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-orange-500/20 to-yellow-500/20 animate-pulse pointer-events-none"></div>}
      <div className="w-full max-w-2xl mx-auto relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-3xl font-bold text-cyan-400">Skor: {score}</div>
          <div className={`flex items-center gap-2 text-2xl font-bold ${isFireMode ? 'text-orange-400' : 'text-gray-400'}`}>
            <Flame className={`transition-colors ${isFireMode ? 'text-orange-400 animate-bounce' : ''}`} />
            {combo}
          </div>
          <div className="text-lg text-amber-400"><Award className="inline-block w-5 h-5 mr-1" /> {highScore}</div>
        </div>

        {/* Time Bar */}
        <div className="w-full bg-gray-700 rounded-full h-4 mb-6 border border-gray-600">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${timeLeft > 10 ? 'from-green-400 to-cyan-400' : 'from-yellow-400 to-red-500'}`}
            initial={{ width: '100%' }}
            animate={{ width: `${(timeLeft / MAX_TIME) * 100}%` }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </div>
        <div className="absolute top-[80px] right-0 text-2xl font-bold">{timeLeft}s</div>

        {/* Game Area */}
        <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700 text-center">
            <AnimatePresence mode="wait">
                <motion.div
                    key={questions[currentQuestionIndex]?.word.headword}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                >
                    <div className="text-6xl font-extrabold tracking-wide text-white mb-8" style={{ textShadow: "0 0 20px rgba(255,255,255,0.3)" }}>
                        {questions[currentQuestionIndex]?.word.headword}
                    </div>
                </motion.div>
            </AnimatePresence>
            <form onSubmit={handleSubmit}>
                <input
                    ref={inputRef}
                    type="text"
                    value={selectedAnswer || ''}
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                    placeholder="Hızlıca yaz..."
                    className="w-full p-4 text-center text-xl bg-gray-900 border-2 border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                    autoFocus
                    autoComplete="off"
                    disabled={isAiChecking}
                />
            </form>
            <div className="h-12 mt-4 flex items-center justify-center">
                <AnimatePresence>
                    {feedback && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`flex items-center gap-2 text-lg font-semibold px-4 py-2 rounded-lg
                                ${feedback.type === 'correct' ? 'bg-green-500/20 text-green-300' : 
                                  feedback.type === 'ai-correct' ? 'bg-purple-500/20 text-purple-300' :
                                  feedback.type === 'ai-checking' ? 'bg-blue-500/20 text-blue-300' :
                                  'bg-red-500/20 text-red-300'}`}
                        >
                            {feedback.type === 'correct' ? <CheckCircleIcon /> : 
                             feedback.type === 'ai-correct' ? <Brain className="animate-pulse" /> :
                             feedback.type === 'ai-checking' ? <Brain className="animate-spin" /> :
                             <XCircle />}
                            {feedback.message}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
      </div>
    </div>
  );
}