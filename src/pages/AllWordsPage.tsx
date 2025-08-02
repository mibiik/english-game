import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { WordDetail } from '../data/words';
import { newDetailedWords_part1 as foundationWords } from '../data/word1';
import { newDetailedWords_part1 as preIntermediateWords } from '../data/word2';
import { detailedWords_part1 as upperIntermediateWords } from '../data/word4';
import { newDetailedWords_part1 as intermediateWords } from '../data/words';
import { kuepeWords } from '../data/kuepe';
import { definitionCacheService } from '../services/definitionCacheService';
import { ArrowLeft, ArrowRight, ArrowUp, Lightbulb, Star, Loader2, Volume2, Bookmark, Sparkles, Zap, CheckCircle } from 'lucide-react';

interface AllWordsPageProps {
  currentLevel: string;
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

const WordFormsDisplay: React.FC<{ forms: WordDetail['forms']; themeClasses: any }> = ({ forms, themeClasses }) => {
  const formEntries = Object.entries(forms).filter(([, value]) => Array.isArray(value) && value.length > 0);

  if (formEntries.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className={`font-semibold text-lg ${themeClasses.headerText} mb-3`}>
        Kelime Formları
      </h3>
      <div className="flex flex-wrap gap-2">
        {formEntries.map(([type, words]) => (
          <div key={type} className={`${themeClasses.popoverBg} rounded-md px-3 py-1 border`}>
            <span className={`text-xs ${themeClasses.headerText} capitalize mr-2`}>{type}:</span>
            <span className={`text-sm ${themeClasses.popoverText}`}>{words.join(', ')}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AllWordsPage: React.FC<AllWordsPageProps> = ({ currentLevel }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('all');
  const [selectedWord, setSelectedWord] = useState<WordDetail | null>(null);
  const [showWordDetail, setShowWordDetail] = useState(false);
  const [theme, setTheme] = useState<Theme>('blue');

  // Seviye değiştiğinde search ve filter'ları sıfırla
  useEffect(() => {
    setSearchTerm('');
    setSelectedUnit('all');
    setSelectedWord(null);
    setShowWordDetail(false);
    setDefinitionState({
      word: null,
      definition: null,
      isLoading: false,
      error: null,
      targetId: null,
    });
  }, [currentLevel]);

  // Arama yapıldığında sayfanın üstüne scroll yap
  useEffect(() => {
    if (searchTerm.trim()) {
      // Kısa bir gecikme ile scroll yap (animasyonların tamamlanması için)
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  }, [searchTerm]);
  const [definitionState, setDefinitionState] = useState<DefinitionState>({
    word: null,
    definition: null,
    isLoading: false,
    error: null,
    targetId: null,
  });

  // Tüm kelimeleri birleştir
  const allWords = useMemo(() => {
    let words: WordDetail[] = [];
    
    console.log('AllWordsPage - currentLevel changed:', currentLevel);
    
    switch (currentLevel) {
      case 'foundation':
        words = foundationWords;
        break;
      case 'pre-intermediate':
        words = preIntermediateWords;
        break;
      case 'upper-intermediate':
        words = upperIntermediateWords;
        break;
      case 'kuepe':
        words = kuepeWords;
        break;
      case 'intermediate':
      default:
        words = intermediateWords;
        break;
    }
    
    console.log('AllWordsPage - words loaded:', words.length, 'for level:', currentLevel);
    console.log('AllWordsPage - first few words:', words.slice(0, 3).map(w => ({ headword: w.headword, unit: w.unit })));
    
    return words;
  }, [currentLevel]);

  // Filtrelenmiş kelimeler
  const filteredWords = useMemo(() => {
    const filtered = allWords.filter(word => {
      const matchesSearch = searchTerm === '' || 
        word.headword.toLowerCase().includes(searchTerm.toLowerCase()) || 
        word.turkish.toLowerCase().includes(searchTerm.toLowerCase());
      
      // KUEPE için ünite filtrelemesi yok
      const matchesUnit = currentLevel === 'kuepe' || selectedUnit === 'all' || word.unit === selectedUnit;
      
      return matchesSearch && matchesUnit;
    });

    // Arama terimi varsa, eşleşen kelimeleri önce sırala
    if (searchTerm.trim()) {
      return filtered.sort((a, b) => {
        const aHeadword = a.headword.toLowerCase();
        const bHeadword = b.headword.toLowerCase();
        const aTurkish = a.turkish.toLowerCase();
        const bTurkish = b.turkish.toLowerCase();
        const searchLower = searchTerm.toLowerCase();

        // Tam eşleşme kontrolü
        const aExactMatch = aHeadword === searchLower || aTurkish === searchLower;
        const bExactMatch = bHeadword === searchLower || bTurkish === searchLower;

        if (aExactMatch && !bExactMatch) return -1;
        if (!aExactMatch && bExactMatch) return 1;

        // Başlangıç eşleşmesi kontrolü
        const aStartsWith = aHeadword.startsWith(searchLower) || aTurkish.startsWith(searchLower);
        const bStartsWith = bHeadword.startsWith(searchLower) || bTurkish.startsWith(searchLower);

        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;

        // İçerik eşleşmesi kontrolü
        const aContains = aHeadword.includes(searchLower) || aTurkish.includes(searchLower);
        const bContains = bHeadword.includes(searchLower) || bTurkish.includes(searchLower);

        if (aContains && !bContains) return -1;
        if (!aContains && bContains) return 1;

        // Eşitse alfabetik sırala
        return aHeadword.localeCompare(bHeadword);
      });
    }

    return filtered;
  }, [allWords, searchTerm, selectedUnit]);

  // Mevcut üniteler
  const units = useMemo(() => {
    return [...new Set(allWords.map(word => word.unit))].sort();
  }, [allWords]);

  const handleWordClick = useCallback(async (word: WordDetail) => {
    setSelectedWord(word);
    setShowWordDetail(true);
    
    // Tanım yükle
    if (word.headword) {
      setDefinitionState(prev => ({
        ...prev,
        word: word.headword,
        isLoading: true,
        error: null,
        targetId: `word-${word.headword}`
      }));

      try {
        const definition = await definitionCacheService.getDefinition(word.headword);
        setDefinitionState(prev => ({
          ...prev,
          definition,
          isLoading: false
        }));
      } catch (error) {
        setDefinitionState(prev => ({
          ...prev,
          error: 'Tanım yüklenirken hata oluştu',
          isLoading: false
        }));
      }
    }
  }, []);

  const closeWordDetail = useCallback(() => {
    setShowWordDetail(false);
    setSelectedWord(null);
    setDefinitionState({
      word: null,
      definition: null,
      isLoading: false,
      error: null,
      targetId: null,
    });
  }, []);

  const themeClasses = getThemeClasses(theme);

  return (
    <div className={`min-h-screen ${themeClasses.bg} transition-all duration-300`}>
      <div className="container mx-auto px-4 py-4 pt-20 md:pt-24">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className={`text-2xl md:text-4xl font-bold ${themeClasses.headerText} mb-2 md:mb-4`}>
            Tüm Kelimeler
          </h1>
          <p className={`text-sm md:text-lg ${themeClasses.text} mb-4 md:mb-6`}>
            {currentLevel} seviyesindeki tüm kelimeleri keşfedin
          </p>
        </div>

        {/* Search and Filter */}
        <div className={`${themeClasses.cardBg} rounded-lg p-4 md:p-6 mb-4 md:mb-6 shadow-lg`}>
          <div className="flex flex-col gap-3 md:gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
              <input
                type="text"
                placeholder="Kelimelerde ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-9 md:pl-10 pr-4 py-2 md:py-3 rounded-lg border text-sm md:text-base ${themeClasses.text} ${themeClasses.formButton} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            {/* Unit Filter and Theme Toggle Row */}
            <div className="flex gap-2 md:gap-4">
              {/* Unit Filter - KUEPE için gizle */}
              {currentLevel !== 'kuepe' && (
                <div className="relative flex-1">
                  <select
                    value={selectedUnit}
                    onChange={(e) => setSelectedUnit(e.target.value)}
                    className={`w-full px-3 md:px-4 py-2 md:py-3 rounded-lg border text-sm md:text-base ${themeClasses.text} ${themeClasses.formButton} focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8 md:pr-10`}
                  >
                    <option value="all">Tüm Üniteler</option>
                    {units.map(unit => (
                      <option key={unit} value={unit}>Ünite {unit}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5 pointer-events-none" />
                </div>
              )}

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'blue' ? 'pink' : theme === 'pink' ? 'classic' : 'blue')}
                className={`px-3 md:px-4 py-2 md:py-3 rounded-lg ${themeClasses.button} transition-colors flex-shrink-0`}
              >
                <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        </div>

                 {/* Results Count */}
         <div className={`${themeClasses.cardBg} rounded-lg p-3 md:p-4 mb-4 md:mb-6 shadow-lg`}>
           <p className={`${themeClasses.text} text-center text-sm md:text-base`}>
             <BookOpen className="inline w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
             {filteredWords.length} kelime bulundu
           </p>
         </div>

                  {/* Words Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
           <AnimatePresence>
            {filteredWords.map((word, index) => (
              <motion.div
                key={word.headword}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => handleWordClick(word)}
                className={`${themeClasses.cardBg} rounded-lg p-3 md:p-4 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200 transform hover:scale-105 border border-transparent hover:border-blue-300`}
              >
                                 <div className="text-center">
                   <h3 className={`font-bold text-base md:text-lg ${themeClasses.headerText} mb-1 md:mb-2`}>
                     {searchTerm ? (
                       <span dangerouslySetInnerHTML={{
                         __html: word.headword.replace(
                           new RegExp(`(${searchTerm})`, 'gi'),
                           '<mark class="bg-yellow-300 text-black px-1 rounded">$1</mark>'
                         )
                       }} />
                     ) : (
                       word.headword
                     )}
                   </h3>
                   <p className={`${themeClasses.text} text-sm md:text-base mb-1 md:mb-2`}>
                     {searchTerm ? (
                       <span dangerouslySetInnerHTML={{
                         __html: word.turkish.replace(
                           new RegExp(`(${searchTerm})`, 'gi'),
                           '<mark class="bg-yellow-300 text-black px-1 rounded">$1</mark>'
                         )
                       }} />
                     ) : (
                       word.turkish
                     )}
                   </p>
                   <span className={`text-xs px-2 py-1 rounded-full ${themeClasses.secondaryButton}`}>
                     {currentLevel === 'kuepe' ? 'KUEPE' : `Ünite ${word.unit}`}
                   </span>
                 </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

                 {/* Word Detail Modal */}
         <AnimatePresence>
           {showWordDetail && selectedWord && (
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
               onClick={closeWordDetail}
             >
               <motion.div
                 initial={{ scale: 0.9, opacity: 0, y: 20 }}
                 animate={{ scale: 1, opacity: 1, y: 0 }}
                 exit={{ scale: 0.9, opacity: 0, y: 20 }}
                 transition={{ type: "spring", damping: 25, stiffness: 300 }}
                 className={`${themeClasses.cardBg} rounded-2xl p-6 md:p-8 max-w-3xl w-full mx-4 max-h-[85vh] overflow-y-auto shadow-2xl border border-white/10`}
                 onClick={(e) => e.stopPropagation()}
               >
                                 {/* Close Button */}
                 <button
                   onClick={closeWordDetail}
                   className={`absolute top-4 right-4 p-2 rounded-full bg-black/10 hover:bg-black/20 ${themeClasses.text} hover:text-red-500 transition-all duration-200 backdrop-blur-sm`}
                 >
                   <X className="w-5 h-5" />
                 </button>

                                 {/* Word Header */}
                 <div className="text-center mb-6 md:mb-8">
                   <div className="inline-flex items-center gap-2 mb-3">
                     <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                     <span className={`text-sm font-medium ${themeClasses.text} opacity-70`}>Ünite {selectedWord.unit}</span>
                     <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                   </div>
                   <h2 className={`text-3xl md:text-4xl font-bold ${themeClasses.headerText} mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
                     {selectedWord.headword}
                   </h2>
                   <p className={`text-xl md:text-2xl ${themeClasses.text} mb-4 font-medium`}>
                     {selectedWord.turkish}
                   </p>
                   <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
                 </div>

                                                  {/* Definition */}
                 <div className="mb-6 md:mb-8">
                   <div className="flex items-center gap-3 mb-4">
                     <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                       <BookOpen className="w-4 h-4 text-white" />
                     </div>
                     <h3 className={`font-bold text-lg md:text-xl ${themeClasses.headerText}`}>
                       Tanım
                     </h3>
                   </div>
                   <div className={`${themeClasses.popoverBg} rounded-xl p-5 md:p-6 border border-white/10 shadow-lg backdrop-blur-sm`}>
                     {definitionState.isLoading ? (
                       <div className="flex items-center justify-center py-6">
                         <div className="flex items-center gap-3">
                           <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                           <span className={`${themeClasses.popoverText} text-base font-medium`}>Tanım yükleniyor...</span>
                         </div>
                       </div>
                     ) : definitionState.error ? (
                       <div className="flex items-center gap-3 py-4">
                         <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                           <X className="w-4 h-4 text-red-500" />
                         </div>
                         <p className={`${themeClasses.popoverText} text-red-500 font-medium`}>
                           {definitionState.error}
                         </p>
                       </div>
                     ) : definitionState.definition ? (
                       <div className="space-y-3">
                         <p className={`${themeClasses.popoverText} text-base leading-relaxed`}>
                           {definitionState.definition}
                         </p>
                         <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                           <div className="w-2 h-2 rounded-full bg-green-500"></div>
                           <span className={`${themeClasses.popoverText} text-sm opacity-70`}>Tanım başarıyla yüklendi</span>
                         </div>
                       </div>
                     ) : (
                       <div className="flex items-center gap-3 py-4">
                         <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                           <BookOpen className="w-4 h-4 text-gray-500" />
                         </div>
                         <p className={`${themeClasses.popoverText} italic text-gray-500`}>
                           Tanım bulunamadı
                         </p>
                       </div>
                     )}
                   </div>
                 </div>

                                 {/* Word Forms */}
                 {selectedWord.forms && (
                   <div className="mb-4 md:mb-6">
                     <WordFormsDisplay forms={selectedWord.forms} themeClasses={themeClasses} />
                   </div>
                 )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AllWordsPage; 