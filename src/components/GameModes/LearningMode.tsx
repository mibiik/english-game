import React, { useState, useEffect, useMemo } from 'react';
import { WordDetail } from '../../data/words';
import { definitionCacheService } from '../../services/definitionCacheService';
import { ArrowLeft, ArrowRight, Lightbulb, Star, Loader2 } from 'lucide-react';

interface LearningModeProps {
  words: WordDetail[];
}

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [definitions, setDefinitions] = useState<Record<string, string>>({});
  const [isLoadingDefinitions, setIsLoadingDefinitions] = useState(false);
  
  const [difficultWords, setDifficultWords] = useState<string[]>(() => {
    const saved = localStorage.getItem('difficultWords');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [showOnlyDifficult, setShowOnlyDifficult] = useState(false);

  const wordsToDisplay = useMemo(() => {
    if (showOnlyDifficult) {
      return words.filter(word => difficultWords.includes(word.headword));
    }
    return words;
  }, [words, difficultWords, showOnlyDifficult]);


  useEffect(() => {
    localStorage.setItem('difficultWords', JSON.stringify(difficultWords));
  }, [difficultWords]);
  
  useEffect(() => {
    setCurrentIndex(0);
    setDefinitions({}); // Ünite değişince definitions'ı temizle
  }, [showOnlyDifficult, words]);

  useEffect(() => {
    const fetchInBatches = async (wordsToFetch: string[]) => {
      const batchSize = 10; // 10 kelimelik gruplar halinde çek
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
      // Tüm batch'ler bittikten sonra loading state'ini kapat
      // Not: her batch için ayrı loading state göstermek de bir seçenek olabilir
      // ama şimdilik genel bir loading yeterli.
      setIsLoadingDefinitions(false);
    };

    if (wordsToDisplay.length > 0) {
      // Henüz tanımı olmayan veya yüklenememiş kelimeleri bul
      const wordsWithoutDefs = wordsToDisplay
        .map(w => w.headword)
        .filter(headword => !definitions[headword]);

      if (wordsWithoutDefs.length > 0) {
        fetchInBatches(wordsWithoutDefs);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordsToDisplay]);

  const toggleDifficultWord = (headword: string) => {
    setDifficultWords(prev => 
      prev.includes(headword) 
        ? prev.filter(w => w !== headword) 
        : [...prev, headword]
    );
  };
  
  if (!words || words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white bg-gray-900 p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-red-500">Kelime bulunamadı.</h2>
        <p className="text-gray-400 mt-2">Lütfen bir ünite seçin.</p>
      </div>
    );
  }

  if (showOnlyDifficult && wordsToDisplay.length === 0) {
     return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] bg-black text-white p-4">
             <div className="w-full max-w-2xl bg-gray-900 rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">Zorlandığınız Kelime Yok</h2>
                <p className="text-gray-400 mb-6">Bir kelimeyi zor olarak işaretlemek için kelime kartındaki yıldız ikonuna tıklayın.</p>
                <button
                    onClick={() => setShowOnlyDifficult(false)}
                    className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                >
                    Tüm Kelimeleri Göster
                </button>
             </div>
        </div>
    );
  }

  const currentWord = wordsToDisplay[currentIndex];
  if (!currentWord) return null; // Should not happen if logic is correct

  const progress = wordsToDisplay.length > 0 ? Math.round(((currentIndex + 1) / wordsToDisplay.length) * 100) : 0;
  
  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % wordsToDisplay.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + wordsToDisplay.length) % wordsToDisplay.length);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] bg-black text-white p-4 sm:p-6">
      
      {/* Toggle Switch */}
      <div className="mb-6 flex items-center justify-center gap-4 bg-gray-800 p-2 rounded-lg">
          <button 
            onClick={() => setShowOnlyDifficult(false)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${!showOnlyDifficult ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
          >
            Tüm Kelimeler
          </button>
          <button 
            onClick={() => setShowOnlyDifficult(true)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors relative ${showOnlyDifficult ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
          >
            Zorlandıklarım
            {difficultWords.length > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {difficultWords.length}
                </span>
            )}
          </button>
      </div>

      <div className="w-full max-w-2xl bg-gray-900 rounded-2xl shadow-2xl shadow-cyan-500/10 p-6 sm:p-8 relative">
        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-6">
          <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-right text-gray-400 text-sm mb-4">{wordsToDisplay.length > 0 ? currentIndex + 1 : 0} / {wordsToDisplay.length}</p>

        <div className="text-center">
            <div className="flex items-center justify-center gap-4">
                <h2 className="text-4xl sm:text-5xl font-bold text-cyan-400 tracking-wider">
                    {currentWord.headword}
                </h2>
                <button onClick={() => toggleDifficultWord(currentWord.headword)} className="group">
                    <Star 
                        className={`transition-all duration-200 ${difficultWords.includes(currentWord.headword) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600 hover:text-yellow-400'}`}
                        size={30}
                    />
                </button>
            </div>
         
          <div className="bg-gray-800 p-4 rounded-lg text-left space-y-4 mt-6">
            <div>
              <h3 className="font-semibold text-white text-md mb-1">Türkçe Karşılığı:</h3>
              <p className="text-gray-300">{currentWord.turkish}</p>
            </div>
            
            <div>
                <h3 className="font-semibold text-white text-md mb-1 mt-4">Definition:</h3>
                {isLoadingDefinitions && !definitions[currentWord.headword] ? (
                    <div className="flex items-center text-gray-400">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Loading definition...</span>
                    </div>
                ) : (
                    <p className="text-gray-300">{definitions[currentWord.headword] || 'Not available.'}</p>
                )}
            </div>

            <WordFormsDisplay forms={currentWord.forms} />
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={goToPrevious}
            disabled={wordsToDisplay.length < 2}
            className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={20} />
            Önceki
          </button>
          <button
            onClick={goToNext}
            disabled={wordsToDisplay.length < 2}
            className="flex items-center gap-2 px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sonraki
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
       <div className="flex items-center text-gray-400 mt-6 text-center max-w-2xl">
            <Lightbulb className="mr-2 text-yellow-400 flex-shrink-0" size={20}/>
            <p className="text-sm">Kelimeleri öğrendikten sonra diğer oyun modları ile kendinizi test edin! Zorlandığınız kelimeleri <Star size={14} className="inline text-yellow-500" /> ikonuna basarak işaretleyebilirsiniz.</p>
        </div>
    </div>
  );
}; 