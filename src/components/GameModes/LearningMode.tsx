import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { WordDetail } from '../../data/words';
import { definitionCacheService } from '../../services/definitionCacheService';
import { ArrowLeft, ArrowRight, Lightbulb, Star, Loader2, Volume2, ChevronLeft, ChevronRight, Bookmark, Sparkles, Zap, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DifficultWordsLearning } from './DifficultWordsLearning';
// Tüm kelimeler için import
import { allWordsWithTranslations } from '../../data/allWords';
import { newDetailedWords_part1 as foundationWords } from '../../data/word1';
import { newDetailedWords_part1 as preIntermediateWords } from '../../data/word2';
import { detailedWords_part1 as upperIntermediateWords } from '../../data/word4';
import { newDetailedWords_part1 as intermediateWords } from '../../data/words';
import { awardPoints } from '../../services/scoreService';
import { userService } from '../../services/userService';
import { authService } from '../../services/authService';

interface LearningModeProps {
  words: WordDetail[];
}

interface DefinitionState {
  word: string | null;
  definition: string | null;
  isLoading: boolean;
  error: string | null;
  targetId: string | null;
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
                button: 'bg-blue-500 hover:bg-blue-600 text-white',
                secondaryButton: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
                formButton: 'bg-blue-100/60 hover:bg-blue-200/80 text-blue-800',
                popoverBg: 'bg-white border-blue-300',
                popoverText: 'text-slate-700',
                popoverArrow: 'border-blue-300 bg-white'
            };
        case 'pink':
            return {
                bg: 'bg-gradient-to-br from-rose-100 to-pink-200',
                cardBg: 'bg-white/60 backdrop-blur-lg',
                text: 'text-slate-800',
                headerText: 'text-pink-700',
                button: 'bg-pink-500 hover:bg-pink-600 text-white',
                secondaryButton: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
                formButton: 'bg-pink-100/60 hover:bg-pink-200/80 text-pink-800',
                popoverBg: 'bg-white border-pink-300',
                popoverText: 'text-slate-700',
                popoverArrow: 'border-pink-300 bg-white'
            };
        default: // classic
            return {
                bg: 'bg-gradient-to-br from-gray-900 to-black',
                cardBg: 'bg-gray-800/50 backdrop-blur-lg border border-gray-700',
                text: 'text-gray-200',
                headerText: 'text-cyan-400',
                button: 'bg-cyan-500 hover:bg-cyan-600 text-white',
                secondaryButton: 'bg-gray-700 hover:bg-gray-600 text-white',
                formButton: 'bg-gray-700/60 hover:bg-gray-700 text-cyan-200',
                popoverBg: 'bg-gray-900 border-cyan-500',
                popoverText: 'text-white',
                popoverArrow: 'border-cyan-500 bg-gray-900'
            };
    }
};

const WordFormsDisplay: React.FC<{ forms: WordDetail['forms'] }> = ({ forms }) => {
  const formEntries = Object.entries(forms).filter(([, value]) => Array.isArray(value) && value.length > 0);

  if (formEntries.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="font-semibold text-white text-md mb-2 mt-4">Kelime Formları:</h3>
      <div className="flex flex-wrap gap-2">
        {formEntries.map(([type, words]) => (
          <div key={type} className="bg-gray-700 rounded-md px-3 py-1">
            <span className="text-xs text-cyan-400 capitalize mr-2">{type}:</span>
            <span className="text-sm text-gray-200">{words.join(', ')}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const LearningMode: React.FC<LearningModeProps> = ({ words }) => {
  // ALL HOOKS MUST BE CALLED FIRST - BEFORE ANY CONDITIONAL RETURNS
  const [currentIndex, setCurrentIndex] = useState(0);
  const [definitions, setDefinitions] = useState<Record<string, string>>({});
  const [isLoadingDefinitions, setIsLoadingDefinitions] = useState(false);
  const [showTurkish, setShowTurkish] = useState(true);
  const [theme, setTheme] = useState<Theme>('blue');
  const [mainDefinition, setMainDefinition] = useState<{ text: string | null, isLoading: boolean }>({ text: null, isLoading: false });
  const [definitionState, setDefinitionState] = useState<DefinitionState>({
    word: null,
    definition: null,
    isLoading: false,
    error: null,
    targetId: null,
  });
  
  const [showOnlyDifficult, setShowOnlyDifficult] = useState(false);
  const [showAdvancedLearning, setShowAdvancedLearning] = useState(false);
  const [removedMessage, setRemovedMessage] = useState<string | null>(null);
  const [difficultWords, setDifficultWords] = useState<string[]>(() => {
    try {
        const saved = localStorage.getItem('difficultWords');
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        return [];
    }
  });

  // Tüm kelimeleri birleştir
  const allDetailedWords = useMemo(() => [
    ...foundationWords,
    ...preIntermediateWords,
    ...upperIntermediateWords,
    ...intermediateWords
  ], []);

  const wordsToDisplay = useMemo(() => {
    if (showOnlyDifficult) {
      // Tüm zorlandığı kelimeleri göster (sadece mevcut üniteden değil)
      const difficultWordsList = allDetailedWords.filter(word => difficultWords.includes(word.headword));
      
      // Eğer zorlandığı kelime yoksa, rastgele 10 kelime göster
      if (difficultWordsList.length === 0) {
        const shuffledWords = [...allDetailedWords].sort(() => 0.5 - Math.random());
        return shuffledWords.slice(0, 10);
      }
      
      return difficultWordsList;
    }
    return words;
  }, [words, difficultWords, showOnlyDifficult, allDetailedWords]);

  // Tüm zorlandığı kelime sayısı (tüm ünitelerden)
  const totalDifficultWordsCount = useMemo(() => {
    return difficultWords.length;
  }, [difficultWords]);

  const popoverRef = useRef<HTMLDivElement>(null);
  const themeClasses = getThemeClasses(theme);
  const currentWord = useMemo(() => wordsToDisplay[currentIndex], [wordsToDisplay, currentIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % wordsToDisplay.length);
    setDefinitionState({ word: null, definition: null, isLoading: false, error: null, targetId: null });
  }, [wordsToDisplay.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + wordsToDisplay.length) % wordsToDisplay.length);
    setDefinitionState({ word: null, definition: null, isLoading: false, error: null, targetId: null });
  }, [wordsToDisplay.length]);

  const handleSpeak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const handleClosePopover = useCallback(() => {
    setDefinitionState({ word: null, definition: null, isLoading: false, error: null, targetId: null });
  }, []);

  // Zor kelime ekle/çıkar fonksiyonu
  const toggleDifficultWord = useCallback((headword: string) => {
    setDifficultWords(prev => {
      const isDifficult = prev.includes(headword);
      let newList: string[];
      if (isDifficult) {
        newList = prev.filter(word => word !== headword);
        setRemovedMessage(`${headword} zor kelimelerden kaldırıldı`);
        setTimeout(() => setRemovedMessage(null), 2000);
        // Eğer "Zorlandıklarım" kısmındaysak ve kelimeyi çıkarıyorsak
        if (showOnlyDifficult) {
            const newWordsToDisplay = allDetailedWords.filter(word => newList.includes(word.headword));
            
            // Eğer liste boşalacaksa veya mevcut indeks geçersiz olacaksa
            if (newWordsToDisplay.length === 0) {
                // Hiç zorlandığı kelime kalmadığında otomatik olarak "Tüm Kelimeler"e geç
                setTimeout(() => setShowOnlyDifficult(false), 100);
            } else if (currentIndex >= newWordsToDisplay.length) {
                // İndeks aralık dışı kalacaksa son kelimeye git
                setCurrentIndex(newWordsToDisplay.length - 1);
            }
        }
      } else {
        newList = [...prev, headword];
      }
      // Firestore'a da kaydet
      const userId = authService.getCurrentUserId();
      if (userId) {
        userService.saveDifficultWordsToCloud(userId, newList);
      }
      return newList;
    });
  }, [showOnlyDifficult, allDetailedWords, currentIndex]);

  const handleWordFormClick = useCallback(async (form: string, targetId: string) => {
    if (definitionState.targetId === targetId) {
      handleClosePopover();
      return;
    }

    setDefinitionState({ 
      word: form, 
      definition: null, 
      isLoading: true, 
      error: null, 
      targetId: targetId 
    });

    try {
      const definition = await definitionCacheService.getDefinition(form, 'en');
      setDefinitionState(prev => ({ ...prev, definition, isLoading: false }));
    } catch (error) {
      console.error(error);
      setDefinitionState(prev => ({ ...prev, error: 'Failed to fetch definition.', isLoading: false }));
    }
  }, [definitionState.targetId, handleClosePopover]);

  // Fetch definition for the main headword by deriving from the main definitions state
  useEffect(() => {
    if (currentWord) {
      const definitionText = definitions[currentWord.headword];
      if (definitionText) {
        setMainDefinition({ text: definitionText, isLoading: false });
      } else {
        // The other useEffect is responsible for fetching, so just show loading
      setMainDefinition({ text: null, isLoading: true });
      }
    }
  }, [currentWord, definitions]);

  useEffect(() => {
    localStorage.setItem('difficultWords', JSON.stringify(difficultWords));
  }, [difficultWords]);
  
  useEffect(() => {
    setCurrentIndex(0);
    setDefinitions({});
  }, [showOnlyDifficult, words]);

  // En başa kaydır
  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const fetchInBatches = async (wordsToFetch: string[]) => {
      const batchSize = 10;
      setIsLoadingDefinitions(true);

      for (let i = 0; i < wordsToFetch.length; i += batchSize) {
        const batch = wordsToFetch.slice(i, i + batchSize);
        if (batch.length > 0) {
          try {
            const newDefinitions = await definitionCacheService.getDefinitions(batch, 'en');
            setDefinitions(prev => ({ ...prev, ...newDefinitions }));
          } catch (error) {
            console.error("Error fetching batch definitions:", error);
            const failedDefinitions = batch.reduce((acc, word) => {
              acc[word] = 'Definition could not be loaded.';
              return acc;
            }, {} as Record<string, string>);
            setDefinitions(prev => ({ ...prev, ...failedDefinitions }));
          }
        }
      }
      setIsLoadingDefinitions(false);
    };

    if (wordsToDisplay.length > 0) {
      const wordsWithoutDefs = wordsToDisplay
        .map(w => w.headword)
        .filter(headword => !definitions[headword]);

      if (wordsWithoutDefs.length > 0) {
        fetchInBatches(wordsWithoutDefs);
      }
    }
  }, [wordsToDisplay, definitions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        const targetId = definitionState.targetId;
        const triggerButton = targetId ? document.getElementById(targetId) : null;
        if (triggerButton && triggerButton.contains(event.target as Node)) {
          return;
        }
        handleClosePopover();
      }
    };

    if (definitionState.targetId) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [definitionState.targetId, handleClosePopover]);

  // Her kelime gösteriminde 1 puan ekle
  useEffect(() => {
    if (currentWord && currentWord.headword) {
      awardPoints('learning-mode', 1, currentWord.unit || '1');
    }
    // eslint-disable-next-line
  }, [currentIndex]);

  // Component mount olduğunda Firestore'dan zor kelimeleri çek
  useEffect(() => {
    const userId = authService.getCurrentUserId();
    if (userId) {
      userService.getDifficultWordsFromCloud(userId).then(cloudWords => {
        if (cloudWords && Array.isArray(cloudWords)) {
          setDifficultWords(cloudWords);
          localStorage.setItem('difficultWords', JSON.stringify(cloudWords));
        }
      });
    }
  }, []);

  const renderWordForms = useCallback(() => {
    if (!currentWord || !currentWord.forms || Object.keys(currentWord.forms).length === 0) {
      return null;
    }

    const formsArray = Object.entries(currentWord.forms).flatMap(([type, formList]) =>
      (formList as string[]).map((form: string) => ({ type, form }))
    );

    if (formsArray.length === 0) {
        return null;
    }

    return (
      <div className="mt-6">
        <h3 className={`text-lg font-semibold ${themeClasses.headerText} mb-3 flex items-center`}>
          <Sparkles className="w-5 h-5 mr-2" /> Word Forms
        </h3>
        <div className="flex flex-wrap gap-3">
          {formsArray.map(({ type, form }, index) => {
            const targetId = `form-${currentIndex}-${index}`;
            return (
              <div key={`${type}-${index}`} className="relative">
                <button
                  id={targetId}
                  onClick={() => handleWordFormClick(form, targetId)}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${themeClasses.formButton} ${theme === 'classic' ? 'focus:ring-cyan-400' : theme === 'blue' ? 'focus:ring-blue-500' : 'focus:ring-pink-500'}`}
                >
                  <span className="font-bold capitalize">{type}:</span> {form}
                </button>
                <AnimatePresence>
                  {definitionState.targetId === targetId && (
                    <motion.div
                      ref={popoverRef}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.15 }}
                      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 p-4 rounded-lg shadow-2xl z-20 border ${themeClasses.popoverBg}`}
                    >
                      {definitionState.isLoading && (
                        <div className="flex items-center justify-center">
                           <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                        </div>
                      )}
                      {definitionState.error && <p className="text-red-400">{definitionState.error}</p>}
                      {definitionState.definition && <p className={`text-sm text-center ${themeClasses.popoverText}`}>{definitionState.definition}</p>}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    );
  }, [currentWord, themeClasses, theme, currentIndex, definitionState, handleWordFormClick]);

  // 2. Koşullu return'lar hook'lardan sonra olacak.
  if (!words || words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white bg-gray-900 p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-red-500">Kelime bulunamadı.</h2>
        <p className="text-gray-400 mt-2">Lütfen bir ünite seçin.</p>
      </div>
    );
  }

  if (showAdvancedLearning) {
    // Tüm zorlandığı kelimeleri göster (sadece mevcut üniteden değil)
    const difficultWordsData = allDetailedWords.filter(word => difficultWords.includes(word.headword));
    return (
      <DifficultWordsLearning 
        words={difficultWordsData} 
        onBack={() => setShowAdvancedLearning(false)}
      />
    );
  }



  const progress = wordsToDisplay.length > 0 ? Math.round(((currentIndex + 1) / wordsToDisplay.length) * 100) : 0;

  // 1. Tüm hook'lar ve swipe/klavye ile ilgili state/fonksiyonlar component fonksiyonunun en başında olacak:
  // SWIPE/KLAVYE HOOKLARI EN BAŞA ALINDI
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const [swipeDir, setSwipeDir] = useState<'left' | 'right' | null>(null);
  const triggerSwipe = (dir: 'left' | 'right') => {
    setSwipeDir(dir);
    setTimeout(() => setSwipeDir(null), 180);
  };
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchEndX.current - touchStartX.current;
      if (diff > 50) {
        triggerSwipe('right');
        handlePrev();
      } else if (diff < -50) {
        triggerSwipe('left');
        handleNext();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { triggerSwipe('right'); handlePrev(); }
      if (e.key === 'ArrowRight') { triggerSwipe('left'); handleNext(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  return (
    <div className={`w-full min-h-screen p-2 md:p-6 transition-colors duration-500 ${themeClasses.bg}`}>
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
            <div>
                <h2 className={`text-2xl md:text-3xl font-bold ${themeClasses.headerText}`}>
                    {words.length > 0 ? `${words.length} Kelime` : 'Kelime Listesi'}
                </h2>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={() => setTheme('blue')} className={`w-8 h-8 rounded-full bg-blue-500 transition-all duration-300 ${theme === 'blue' ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`} aria-label="Mavi Tema"></button>
                <button onClick={() => setTheme('pink')} className={`w-8 h-8 rounded-full bg-pink-500 transition-all duration-300 ${theme === 'pink' ? 'ring-2 ring-offset-2 ring-pink-500' : ''}`} aria-label="Pembe Tema"></button>
                <button onClick={() => setTheme('classic')} className={`w-8 h-8 rounded-full bg-gray-800 border border-gray-600 transition-all duration-300 ${theme === 'classic' ? 'ring-2 ring-offset-2 ring-gray-500' : ''}`} aria-label="Karanlık Tema"></button>
            </div>
        </div>

        <div className={`flex items-center justify-center gap-2 p-1.5 rounded-xl mb-4 ${theme === 'classic' ? 'bg-gray-900' : 'bg-white/50'}`}>
            <button onClick={() => setShowOnlyDifficult(false)} className={`flex-1 text-center px-3 py-2 text-sm font-bold rounded-lg transition-colors ${!showOnlyDifficult ? themeClasses.button : 'text-gray-500'}`}>
                Tüm Kelimeler
            </button>
            <button onClick={() => setShowOnlyDifficult(true)} className={`flex-1 text-center px-3 py-2 text-sm font-bold rounded-lg transition-colors relative ${showOnlyDifficult ? themeClasses.button : 'text-gray-500'}`}>
                Zorlandıklarım
                {totalDifficultWordsCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        {totalDifficultWordsCount}
                    </span>
                )}
            </button>
        </div>

        {/* Gelişmiş Öğrenme Sistemi Butonu */}
        {totalDifficultWordsCount > 0 && (
          <div className="mb-4">
            <button 
              onClick={() => setShowAdvancedLearning(true)}
              className={`w-full p-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${themeClasses.button} flex items-center justify-center gap-2 shadow-lg`}
            >
              <Zap className="w-5 h-5" />
              Gelişmiş Öğrenme Sistemi
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                {totalDifficultWordsCount} kelime
              </span>
            </button>
          </div>
        )}

        {/* Zorlandıklarım sekmesinde rastgele kelimeler gösterildiğinde bilgi mesajı */}
        {showOnlyDifficult && totalDifficultWordsCount === 0 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-center">
            <div className="flex items-center justify-center gap-2 text-blue-700">
              <Lightbulb className="w-5 h-5" />
              <span className="text-sm font-medium">
                Henüz zorlandığınız kelime yok. Size rastgele kelimeler gösteriyoruz. 
                Bir kelimeyi zor olarak işaretlemek için yıldız ikonuna tıklayın.
              </span>
            </div>
          </div>
        )}

        {/* Kelime kaldırma bildirimi */}
        <AnimatePresence>
            {removedMessage && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.3 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.5 }}
                    className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-lg z-50"
                >
                    <div className="flex items-center gap-2">
                        <CheckCircle className="text-green-500" />
                        <span>{removedMessage}</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {currentWord ? (
           <motion.div
             className={`relative p-5 md:p-8 rounded-2xl shadow-lg transition-colors duration-500 bg-white/80 dark:bg-gray-900/80 min-h-[320px] md:min-h-[440px] max-h-[600px] min-w-[280px] min-w-[320px] md:min-w-[560px] max-w-[720px] flex flex-col justify-between overflow-y-auto`}
             onTouchStart={handleTouchStart}
             onTouchEnd={handleTouchEnd}
             animate={swipeDir === 'left' ? { x: -40 } : swipeDir === 'right' ? { x: 40 } : { x: 0 }}
             transition={{ type: 'spring', stiffness: 300, damping: 20 }}
           >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className={`text-4xl md:text-5xl font-extrabold ${themeClasses.text} tracking-tight`}>
                            {currentWord.headword}
                        </h2>
                        <motion.p 
                            key={showTurkish ? 'tr' : 'hidden'}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`text-xl mt-2 cursor-pointer ${themeClasses.headerText}`}
                            onClick={() => setShowTurkish(!showTurkish)}
                            title="Anlamı gizle/göster"
                        >
                            {showTurkish ? currentWord.turkish : '...'}
                        </motion.p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => handleSpeak(currentWord.headword)} className={`transition-colors ${themeClasses.text} hover:${themeClasses.headerText}`}>
                            <Volume2 size={30} />
                        </button>
                        <button 
                            onClick={() => toggleDifficultWord(currentWord.headword)} 
                            title={difficultWords.includes(currentWord.headword) ? "Zorlandıklarımdan çıkar" : "Zorlandıklarıma ekle"}
                            className="transition-transform duration-200 hover:scale-110 active:scale-95"
                        >
                             <Star className={`transition-all duration-300 ${difficultWords.includes(currentWord.headword) ? `text-yellow-400 fill-yellow-400 drop-shadow-lg` : `${themeClasses.text} hover:text-yellow-400`}`} size={30} />
                        </button>
                    </div>
                </div>
                
                {/* Definition Section */}
                <div className="mt-4">
                     <h3 className={`text-md font-semibold ${themeClasses.headerText} mb-2`}>Definition:</h3>
                     {mainDefinition.isLoading ? (
                         <div className="flex items-center">
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            <span>Loading...</span>
                         </div>
                     ) : (
                        <p className={`text-md leading-relaxed ${themeClasses.text}`}>
                            {mainDefinition.text}
                        </p>
                     )}
                </div>

                {currentWord.collocations && currentWord.collocations.length > 0 && (
                    <div className="mt-4">
                         <h3 className={`text-md font-semibold ${themeClasses.headerText} mb-2`}>Örnek Kullanımlar (Collocations):</h3>
                         <p className={`text-md leading-relaxed italic ${themeClasses.text}`}>
                            {currentWord.collocations.join(', ')}
                        </p>
                    </div>
                )}
                
                {renderWordForms()}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className={`p-6 md:p-8 rounded-2xl shadow-2xl transition-colors duration-500 ${themeClasses.cardBg} text-center`}>
            <h2 className={`text-2xl font-bold ${themeClasses.text}`}>Kelime yükleniyor...</h2>
          </div>
        )}

        {/* Oklar: her zaman sayfanın en altında ortada, sticky/fixed */}
        <div className="fixed left-0 right-0 bottom-0 z-40 flex flex-col items-center justify-center pb-4 pointer-events-none select-none">
          <div className="mb-1 flex flex-col items-center gap-1 pointer-events-auto">
            <div className="text-base md:text-lg font-semibold text-blue-700 bg-white/80 dark:bg-gray-900/80 rounded-full px-4 py-1 shadow">
              {currentIndex + 1} / {wordsToDisplay.length}
            </div>
            <input
              type="range"
              min={1}
              max={wordsToDisplay.length}
              value={currentIndex + 1}
              onChange={e => setCurrentIndex(Number(e.target.value) - 1)}
              className="w-40 md:w-64 accent-blue-500 cursor-pointer"
              style={{ touchAction: 'none' }}
            />
          </div>
          <div className="flex gap-8 bg-white/80 dark:bg-gray-900/80 rounded-full shadow-lg px-6 py-3 pointer-events-auto mt-1">
            <button onClick={handlePrev} className="text-2xl md:text-3xl text-blue-500 hover:text-blue-700 transition-colors font-bold" aria-label="Önceki kelime">
              <ChevronLeft size={36} />
            </button>
            <button onClick={handleNext} className="text-2xl md:text-3xl text-blue-500 hover:text-blue-700 transition-colors font-bold" aria-label="Sonraki kelime">
              <ChevronRight size={36} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 