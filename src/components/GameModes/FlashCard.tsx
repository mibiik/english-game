import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Sparkles } from 'lucide-react';
import { WordDetail } from '../../data/words';
import { gameStateManager } from '../../lib/utils';
import { gameScoreService } from '../../services/gameScoreService';
import { updateWordDifficulty } from '../../data/difficultWords';
import { learningStatsTracker } from '../../data/learningStats';
import { authService } from '../../services/authService';
import { soundService } from '../../services/soundService';

interface FlashCardProps {
  words: WordDetail[];
}

interface GameState {
  currentIndex: number;
  showTranslation: boolean;
  knownWords: string[];
  unknownWords: string[];
  reviewMode: boolean;
}

export const FlashCard: React.FC<FlashCardProps> = ({ words }) => {
  // Tüm hook'lar component'in en başında
  const [roundWords, setRoundWords] = useState<WordDetail[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [repeatList, setRepeatList] = useState<WordDetail[]>([]);
  const [isRepeatMode, setIsRepeatMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [knownWords, setKnownWords] = useState<string[]>([]);
  const [unknownWords, setUnknownWords] = useState<string[]>([]);
  const [reviewMode, setReviewMode] = useState(false);

  // Oyun anahtarı
  const GAME_KEY = 'flashCard';

  // İlk yükleme - localStorage'dan state'i kontrol et
  useEffect(() => {
    if (words.length > 0) {
      const savedState = gameStateManager.loadGameState(GAME_KEY) as GameState | null;
      if (savedState) {
        setCurrentIndex(savedState.currentIndex);
        setShowTranslation(savedState.showTranslation);
        setKnownWords(savedState.knownWords);
        setUnknownWords(savedState.unknownWords);
        setReviewMode(savedState.reviewMode);
      }
    }
  }, [words, GAME_KEY]);

  // Her state değişikliğinde localStorage'a kaydet
  useEffect(() => {
    if (words.length > 0) {
      const gameState: GameState = {
        currentIndex,
        showTranslation,
        knownWords,
        unknownWords,
        reviewMode
      };
      gameStateManager.saveGameState(GAME_KEY, gameState);
    }
  }, [currentIndex, showTranslation, knownWords, unknownWords, reviewMode, words.length, GAME_KEY]);

  // En başa kaydır
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const startNewRound = useCallback((customList?: WordDetail[]) => {
    const base = customList && customList.length > 0 ? customList : words;
    const shuffled = [...base].sort(() => 0.5 - Math.random());
    setRoundWords(shuffled);
    setCurrentWordIndex(0);
    setIsFlipped(false);
    setScore(0);
    setIsRepeatMode(!!customList);
  }, [words]);

  useEffect(() => {
    if (words.length > 0) {
      startNewRound();
    }
  }, [words, startNewRound]);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextCard = (known: boolean) => {
    const currentWord = roundWords[currentWordIndex];
    if (!known) {
      setScore(score - 2);
      // Anında puan ekle
      const userId = authService.getCurrentUserId();
      if (userId) {
        gameScoreService.addScore(userId, 'flashcard', -2);
      }
      setRepeatList(prev => {
        // Aynı kelime tekrar eklenmesin
        if (prev.find(w => w.headword === currentWord.headword)) return prev;
        return [...prev, currentWord];
      });
      soundService.playWrong();
    } else {
      setScore(score + 2);
      // Anında puan ekle
      const userId = authService.getCurrentUserId();
      if (userId) {
        gameScoreService.addScore(userId, 'flashcard', 2);
      }
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1000);
      soundService.playCorrect();
      // Eğer tekrar modundaysa ve biliyorum dediyse, tekrar listesinden çıkar
      if (isRepeatMode) {
        setRepeatList(prev => prev.filter(w => w.headword !== currentWord.headword));
      }
    }

    setIsFlipped(false);
    setTimeout(() => {
      if (currentWordIndex < roundWords.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
      } else {
        // Tur bitti, skoru kaydet
        const finalScore = score + (known ? 1 : 0);
        const unit = roundWords[0]?.unit || '1';
        try {
          gameScoreService.saveScore('flashcard', finalScore, unit);
        } catch (error) {
          console.error('Skor kaydedilirken hata:', error);
        }
        
        if (!isRepeatMode && repeatList.length > 0) {
          // Tekrar moduna geç
          startNewRound(repeatList);
        } else if (isRepeatMode && repeatList.length > 0) {
          // Tekrar modunda, hala tekrar listesi varsa devam et
          startNewRound(repeatList);
        } else {
          // Tekrar listesi boşsa yeni rastgele tur başlat
          setRepeatList([]);
          setIsRepeatMode(false);
          startNewRound();
        }
      }
    }, 200);
  };

  // Erken return sadece hook'lardan sonra
  if (roundWords.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-gray-600">Kelime kartları hazırlanıyor...</p>
      </div>
    );
  }

  const currentWord = roundWords[currentWordIndex];
  const progress = ((currentWordIndex + 1) / roundWords.length) * 100;

  const currentWords = reviewMode ? 
    words.filter(word => unknownWords.includes(word.headword)) : 
    words;

  return (
    <div className="flex flex-col items-center space-y-6 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold text-purple-600">
            Kelime {currentWordIndex + 1}/{roundWords.length}
          </div>
          <button
            onClick={() => startNewRound(repeatList)}
            className="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
            title="Yeni Tur"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="relative w-full max-w-md aspect-[3/2] perspective-1000">
        <motion.div
          className="w-full h-full cursor-pointer transform-style-3d"
          onClick={handleCardClick}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="absolute w-full h-full backface-hidden">
            <div className="w-full h-full bg-white rounded-xl shadow-lg p-8 flex items-center justify-center border-2 border-purple-200 hover:border-purple-400 transition-colors">
              <h2 className="text-3xl font-bold text-center text-purple-700">
                {currentWord.headword}
              </h2>
            </div>
          </div>
          <div className="absolute w-full h-full backface-hidden rotate-y-180">
            <div className="w-full h-full bg-purple-50 rounded-xl shadow-lg p-8 flex items-center justify-center border-2 border-purple-200 hover:border-purple-400 transition-colors">
              <h2 className="text-3xl font-bold text-center text-purple-700">
                {currentWord.turkish}
              </h2>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex space-x-4 mt-6">
        <button
          onClick={() => handleNextCard(false)}
          className="px-6 py-3 bg-red-100 text-red-600 rounded-lg font-semibold hover:bg-red-200 transition-colors"
        >
          Bilmiyorum
        </button>
        <button
          onClick={() => handleNextCard(true)}
          className="px-6 py-3 bg-green-100 text-green-600 rounded-lg font-semibold hover:bg-green-200 transition-colors"
        >
          Biliyorum
        </button>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>Harika!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};