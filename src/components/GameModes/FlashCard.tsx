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
import { definitionCacheService } from '../../services/definitionCacheService';

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
  const [showHint, setShowHint] = useState(true);
  const [showDefinition, setShowDefinition] = useState(false);
  const [definitionText, setDefinitionText] = useState<string>('');
  const [isLoadingDefinition, setIsLoadingDefinition] = useState(false);
  const [definitionMode, setDefinitionMode] = useState<'turkish' | 'english'>('turkish');
  const [wordDefinitions, setWordDefinitions] = useState<Record<string, string>>({});

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

  const loadDefinition = useCallback(async (word: string) => {
    if (definitionMode === 'english') {
      setIsLoadingDefinition(true);
      try {
        const definition = await definitionCacheService.getDefinition(word, 'en');
        setDefinitionText(definition);
        setShowDefinition(true);
      } catch (error) {
        console.error('Definition yüklenirken hata:', error);
        setDefinitionText('Definition could not be loaded.');
        setShowDefinition(true);
      } finally {
        setIsLoadingDefinition(false);
      }
    } else {
      setShowDefinition(false);
    }
  }, [definitionMode]);

  const loadWordDetails = useCallback(async (word: WordDetail) => {
    try {
      const definition = await definitionCacheService.getDefinition(word.headword, 'en');
      setWordDefinitions(prev => ({
        ...prev,
        [word.headword]: definition
      }));
    } catch (error) {
      console.error('Word details yüklenirken hata:', error);
    }
  }, []);

  const startNewRound = useCallback((customList?: WordDetail[]) => {
    const base = customList && customList.length > 0 ? customList : words;
    if (base.length === 0) return; // Eğer kelime yoksa çık
    
    const shuffled = [...base].sort(() => 0.5 - Math.random());
    setRoundWords(shuffled);
    setCurrentWordIndex(0);
    setIsFlipped(false);
    setScore(0);
    setIsRepeatMode(!!customList);
    setShowHint(true); // Yeni turda ipucunu tekrar göster
    
    // İlk kelime için definition yükle
    if (shuffled.length > 0) {
      loadDefinition(shuffled[0].headword);
    }
  }, [words, loadDefinition]);

  // Words geldiğinde oyunu başlat
  useEffect(() => {
    if (words.length > 0 && roundWords.length === 0) {
      startNewRound();
    }
  }, [words, roundWords.length, startNewRound]);

  const currentWord = roundWords[currentWordIndex];
  const progress = ((currentWordIndex + 1) / roundWords.length) * 100;

  // Definition mode değiştiğinde yeni definition yükle
  useEffect(() => {
    if (currentWord && definitionMode === 'english') {
      loadDefinition(currentWord.headword);
    } else {
      setShowDefinition(false);
    }
  }, [definitionMode, currentWord, loadDefinition]);

  const currentWords = reviewMode ? 
    words.filter(word => unknownWords.includes(word.headword)) : 
    words;

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
    setShowHint(false); // İpucunu kaldır
  };

  const handleNextCard = (known: boolean) => {
    const currentWord = roundWords[currentWordIndex];
    if (!known) {
      setScore(score - 1);
      // Anında puan ekle
      const userId = authService.getCurrentUserId();
      if (userId) {
        gameScoreService.addScore(userId, 'flashcard', -1);
      }
      setRepeatList(prev => {
        // Aynı kelime tekrar eklenmesin
        if (prev.find(w => w.headword === currentWord.headword)) return prev;
        // Yeni kelime eklendiğinde definition'ını yükle
        loadWordDetails(currentWord);
        return [...prev, currentWord];
      });
      soundService.playWrong();
    } else {
      setScore(score + 1);
      // Anında puan ekle
      const userId = authService.getCurrentUserId();
      if (userId) {
        gameScoreService.addScore(userId, 'flashcard', 1);
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
        // Yeni kelime için definition yükle
        const nextWord = roundWords[currentWordIndex + 1];
        if (nextWord) {
          loadDefinition(nextWord.headword);
        }
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

  return (
    <div className="flex flex-col items-center space-y-6 p-4 bg-gradient-to-br from-sky-100 to-blue-200 min-h-screen">
      {/* Seçenekler */}
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 p-1.5 rounded-xl bg-white/50 mb-4">
          <button 
            onClick={() => setDefinitionMode('turkish')} 
            className={`flex-1 text-center px-3 py-2 text-sm font-bold rounded-lg transition-colors ${
              definitionMode === 'turkish' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-500'
            }`}
          >
            Türkçe
          </button>
          <button 
            onClick={() => setDefinitionMode('english')} 
            className={`flex-1 text-center px-3 py-2 text-sm font-bold rounded-lg transition-colors ${
              definitionMode === 'english' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-500'
            }`}
          >
            İngilizce Tanım
          </button>
        </div>
      </div>

      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold text-blue-700">
            Kelime {currentWordIndex + 1}/{roundWords.length}
          </div>
          <button
            onClick={() => startNewRound(repeatList)}
            className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
            title="Yeni Tur"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="relative w-full max-w-md aspect-[3/2] perspective-1000">
        {/* Tıklama ipucu */}
        {showHint && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg"
            >
              Kartı çevirmek için tıklayın
            </motion.div>
          </div>
        )}
        
        {/* Arka kartlar - tasarım amaçlı */}
        <div className="absolute inset-0 transform translate-y-4 translate-x-2 z-0">
          <div className="w-full h-full bg-blue-50/80 rounded-xl shadow-lg border border-blue-100"></div>
        </div>
        <div className="absolute inset-0 transform translate-y-3 translate-x-1.5 z-0">
          <div className="w-full h-full bg-blue-100/70 rounded-xl shadow-md border border-blue-200"></div>
        </div>
        <div className="absolute inset-0 transform translate-y-2 translate-x-1 z-0">
          <div className="w-full h-full bg-blue-150/60 rounded-xl shadow-lg border border-blue-200"></div>
        </div>
        <div className="absolute inset-0 transform translate-y-1 translate-x-0.5 z-0">
          <div className="w-full h-full bg-blue-200/50 rounded-xl shadow-md border border-blue-300"></div>
        </div>
        
        <motion.div
          className="w-full h-full cursor-pointer transform-style-3d relative z-10"
          onClick={handleCardClick}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
          style={{ transformStyle: "preserve-3d" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute w-full h-full backface-hidden">
            <div className="w-full h-full bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-8 flex items-center justify-center border-2 border-blue-200 hover:border-blue-400 transition-colors">
              <h2 className="text-3xl font-bold text-center text-blue-700">
                {currentWord.headword}
              </h2>
            </div>
          </div>
          <div className="absolute w-full h-full backface-hidden rotate-y-180">
            <div className="w-full h-full bg-blue-50/80 backdrop-blur-lg rounded-xl shadow-lg p-8 flex flex-col items-center justify-center border-2 border-blue-200 hover:border-blue-400 transition-colors">
              {definitionMode === 'turkish' ? (
                <h2 className="text-3xl font-bold text-center text-blue-700">
                {currentWord.turkish}
              </h2>
              ) : (
                <div className="text-center">
                  {isLoadingDefinition ? (
                    <div className="text-blue-600 text-lg font-medium">Loading definition...</div>
                  ) : (
                    <div className="text-blue-700 text-lg font-semibold leading-relaxed">
                      {definitionText || 'Definition not available'}
                    </div>
                  )}
                </div>
              )}
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

      {/* Bilinmeyen kelimeler listesi */}
      {repeatList.length > 0 && (
        <div className="w-full max-w-6xl mt-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <h3 className="text-red-700 font-semibold text-lg mb-4 flex items-center">
              <span className="mr-2">📝</span>
              Tekrar Edilecek Kelimeler ({repeatList.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {repeatList.map((word, index) => (
                <div key={`${word.headword}-${index}`} className="relative bg-white rounded-xl shadow-lg border border-red-200 p-4 hover:shadow-xl transition-shadow">
                  <div className="text-center mb-3">
                    <div className="font-bold text-red-800 text-xl mb-2">
                      {word.headword}
                    </div>
                    <div className="text-red-600 text-lg mb-3">
                      {word.turkish}
                    </div>
                    {wordDefinitions[word.headword] && (
                      <div className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg mb-2 italic">
                        {wordDefinitions[word.headword]}
                      </div>
                    )}
                    {word.collocations && word.collocations.length > 0 && (
                      <div className="text-blue-600 text-xs bg-blue-50 p-2 rounded border-l-4 border-blue-300">
                        {word.collocations.join(' • ')}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setRepeatList(prev => prev.filter((_, i) => i !== index));
                    }}
                    className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors w-6 h-6 flex items-center justify-center text-xs"
                    title="Bu kelimeyi listeden çıkar"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            {repeatList.length > 0 && (
              <div className="mt-4 pt-3 border-t border-red-200">
                <button
                  onClick={() => {
                    setRepeatList([]);
                    setIsRepeatMode(false);
                  }}
                  className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
                >
                  Tümünü Temizle
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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