import React, { useState, useEffect } from 'react';
import { Word } from '../../data/words';
import { learningStatsTracker } from '../../data/learningStats';
import { Star, Trophy, Medal, Award, Zap } from 'lucide-react';
interface MatchingGameProps {
  words: Word[];
  unit: string;
}

export function MatchingGame({ words, unit }: MatchingGameProps) {
  const [selectedWords, setSelectedWords] = useState<Word[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);
  const [showBadgeAnimation, setShowBadgeAnimation] = useState(false);
  const [lastBadge, setLastBadge] = useState('');

  const [selectedEnglishCard, setSelectedEnglishCard] = useState<number | null>(null);
  const [selectedTurkishCard, setSelectedTurkishCard] = useState<number | null>(null);

  useEffect(() => {
    startNewGame();
  }, [unit, words]);

  const startNewGame = () => {
    const unitWords = words.filter(word => word.unit === unit);
    const availableWords = unitWords.filter(word => !usedWords.includes(word.english));
    
    // Eğer kullanılmamış kelime sayısı 6'dan azsa, kullanılan kelimeleri sıfırla
    if (availableWords.length < 6) {
      setUsedWords([]);
    }
    
    // Yeni kelimeler seç
    const gameWords = [...(availableWords.length >= 9 ? availableWords : unitWords)]
      .sort(() => Math.random() - 0.5)
      .slice(0, 9);
    
    // Seçilen kelimeleri kullanılanlar listesine ekle
    setUsedWords(prev => [...prev, ...gameWords.map(word => word.english)]);
    
    const englishCards = gameWords.map(word => ({ ...word, id: Math.random(), type: 'english' }));
    const turkishCards = gameWords.map(word => ({ ...word, id: Math.random(), type: 'turkish' }));
    
    setSelectedWords([...englishCards, ...turkishCards].sort(() => Math.random() - 0.5));
    setSelectedCards([]);
    setMatchedPairs([]);
    setScore(0);
    setAttempts(0);
    setCombo(0);
    setBestCombo(0);
    setBadges([]);
    setShowBadgeAnimation(false);
    setShowResult(false);
    setSelectedEnglishCard(null);
    setSelectedTurkishCard(null);
  };

  const handleCardClick = (index: number) => {
    if (matchedPairs.includes(index)) return;
    
    const clickedCard = selectedWords[index];
    
    if (clickedCard.type === 'english') {
      if (selectedEnglishCard === index) {
        setSelectedEnglishCard(null);
        return;
      }
      setSelectedEnglishCard(index);
      if (selectedTurkishCard !== null) {
        const englishCard = selectedWords[index];
        const turkishCard = selectedWords[selectedTurkishCard];
        setAttempts(attempts + 1);

        const isMatch = englishCard.english === turkishCard.english;

        if (isMatch) {
          setMatchedPairs([...matchedPairs, index, selectedTurkishCard]);
          const newCombo = combo + 1;
          setCombo(newCombo);
          setBestCombo(Math.max(bestCombo, newCombo));
          const points = Math.floor(10 * (1 + newCombo * 0.1));
          setScore(score + points);
          setSelectedEnglishCard(null);
          setSelectedTurkishCard(null);
          
          // Başarı rozetleri kontrolü
          const newBadges = [...badges];
          if (newCombo === 3 && !badges.includes('combo3')) {
            newBadges.push('combo3');
            setLastBadge("3'lü Combo!");
            setShowBadgeAnimation(true);
          } else if (newCombo === 5 && !badges.includes('combo5')) {
            newBadges.push('combo5');
            setLastBadge("5'li Combo!");
            setShowBadgeAnimation(true);
          }
          if (score + points >= 100 && !badges.includes('score100')) {
            newBadges.push('score100');
            setLastBadge('100 Puan!');
            setShowBadgeAnimation(true);
          }
          setBadges(newBadges);
          
          // Öğrenme istatistiklerini kaydet
          learningStatsTracker.recordWordLearned(selectedWords[index]);
          
          if (matchedPairs.length + 2 === selectedWords.length) {
            setTimeout(() => setShowResult(true), 500);
          }
        } else {
          // Yanlış eşleşme durumunda kırmızı renk gösterimi için bekletme
          setTimeout(() => {
            setSelectedEnglishCard(null);
            setSelectedTurkishCard(null);
            setCombo(0);
          }, 1000);
        }
      }
    } else {
      if (selectedTurkishCard === index) {
        setSelectedTurkishCard(null);
        return;
      }
      setSelectedTurkishCard(index);
      if (selectedEnglishCard !== null) {
        const englishCard = selectedWords[selectedEnglishCard];
        const turkishCard = selectedWords[index];
        setAttempts(attempts + 1);

        const isMatch = englishCard.english === turkishCard.english;

        if (isMatch) {
          setMatchedPairs([...matchedPairs, selectedEnglishCard, index]);
          const newCombo = combo + 1;
          setCombo(newCombo);
          setBestCombo(Math.max(bestCombo, newCombo));
          const points = Math.floor(10 * (1 + newCombo * 0.1));
          setScore(score + points);
          setSelectedEnglishCard(null);
          setSelectedTurkishCard(null);
          
          // Başarı rozetleri kontrolü
        const newBadges = [...badges];
if (newCombo === 3 && !badges.includes('combo3')) {
  newBadges.push('combo3');
  setLastBadge("3'lü Combo!");
  setShowBadgeAnimation(true);
} else if (newCombo === 5 && !badges.includes('combo5')) {
  newBadges.push('combo5');
  setLastBadge("5'li Combo!");
  setShowBadgeAnimation(true);
}
if (score + points >= 100 && !badges.includes('score100')) {
  newBadges.push('score100');
  setLastBadge('100 Puan!');
  setShowBadgeAnimation(true);
}

setBadges(newBadges);

// 1 saniye sonra animasyonu kapat
setTimeout(() => {
  setShowBadgeAnimation(false);
}, 1000);

          
          // Öğrenme istatistiklerini kaydet
          learningStatsTracker.recordWordLearned(selectedWords[index]);
          
          if (matchedPairs.length + 2 === selectedWords.length) {
            setTimeout(() => setShowResult(true), 500);
          }
        } else {
          // Yanlış eşleşme durumunda kırmızı renk gösterimi için bekletme
          setTimeout(() => {
            setSelectedEnglishCard(null);
            setSelectedTurkishCard(null);
            setCombo(0);
          }, 1000);
        }
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 rounded-2xl shadow-2xl border-2 border-violet-200/30 backdrop-blur-sm relative">
      {showBadgeAnimation && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-badge-pop">
          <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-6 py-3 rounded-full shadow-xl text-lg font-bold flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            {lastBadge}
          </div>
        </div>
      )}
      {!showResult ? (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
            <div className="flex flex-col gap-2 bg-white/80 p-3 sm:p-4 rounded-xl shadow-lg backdrop-blur-sm border border-violet-100 w-full sm:w-auto">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                    {score} Puan
                  </div>
                  <div className="text-sm font-medium text-purple-600 flex items-center gap-2">
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                    Combo: {combo}x
                  </div>
                </div>
                <div className="flex gap-1 sm:gap-2">
                  {badges.includes('combo3') && (
                    <div className="text-amber-500" title="3'lü Combo"><Star className="w-5 h-5 sm:w-6 sm:h-6" /></div>
                  )}
                  {badges.includes('combo5') && (
                    <div className="text-amber-500" title="5'li Combo"><Medal className="w-5 h-5 sm:w-6 sm:h-6" /></div>
                  )}
                  {badges.includes('score100') && (
                    <div className="text-amber-500" title="100 Puan"><Trophy className="w-5 h-5 sm:w-6 sm:h-6" /></div>
                  )}
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Eşleşmeler: {score}/9
              </div>
              <div className="text-sm font-medium text-purple-600 flex items-center gap-2">
                <span className="material-icons text-base sm:text-lg">refresh</span>
                Deneme: {attempts}
              </div>
            </div>
            <button
              onClick={startNewGame}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white rounded-xl
                transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600
                active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 text-sm sm:text-base font-medium
                shadow-lg shadow-purple-500/30 w-full sm:w-auto"
            >
              İlerle
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            <div className="w-full md:flex-1">
              <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-3 sm:mb-4 text-center">İngilizce Kelimeler</h3>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {selectedWords
                  .filter(word => word.type === 'english')
                  .map((word, index) => (
                    <div
                      key={index}
                      onClick={() => handleCardClick(selectedWords.findIndex(w => w.id === word.id))}
                      className={`
                        rounded-xl cursor-pointer p-1 sm:p-2 text-center
                        transform transition-all duration-500 ease-in-out
                        min-h-[70px] sm:min-h-[90px] md:min-h-[110px] 
                        flex items-center justify-center
                        backdrop-blur-sm border-2
                        overflow-hidden whitespace-normal
                        ${matchedPairs.includes(selectedWords.findIndex(w => w.id === word.id))
                          ? 'bg-gradient-to-br from-emerald-100 to-green-100 text-emerald-800 scale-105 shadow-xl border-emerald-200/50 animate-pulse'
                          : selectedEnglishCard === selectedWords.findIndex(w => w.id === word.id)
                          ? 'bg-gradient-to-br from-violet-100 to-purple-100 text-violet-800 scale-105 shadow-xl border-violet-200/50'
                          : selectedTurkishCard === selectedWords.findIndex(w => w.id === word.id)
                          ? 'bg-gradient-to-br from-violet-100 to-purple-100 text-violet-800 scale-105 shadow-xl border-violet-200/50'
                          : (selectedEnglishCard !== null && selectedTurkishCard !== null) && !matchedPairs.includes(selectedWords.findIndex(w => w.id === word.id))
                            ? 'bg-gradient-to-br from-rose-100 to-red-100 text-rose-800 scale-105 shadow-xl border-rose-200/50 animate-shake'
                            : 'bg-white/80 hover:bg-gradient-to-br hover:from-violet-50 hover:to-purple-50 border-violet-200/30 hover:border-violet-300/50 text-gray-700 hover:scale-105 hover:shadow-lg'}
                      `}
                    >
                      <span className="text-xs sm:text-sm md:text-base font-medium break-words hyphens-auto px-1 w-full leading-tight">{word.english}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="w-full h-px md:w-px md:h-auto bg-gray-200"></div>

            <div className="w-full md:flex-1">
              <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-3 sm:mb-4 text-center">Türkçe Kelimeler</h3>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {selectedWords
                  .filter(word => word.type === 'turkish')
                  .map((word, index) => (
                    <div
                      key={index}
                      onClick={() => handleCardClick(selectedWords.findIndex(w => w.id === word.id))}
                      className={`
                        rounded-xl cursor-pointer p-1 sm:p-2 text-center
                        transform transition-all duration-500 ease-in-out
                        min-h-[70px] sm:min-h-[90px] md:min-h-[110px] 
                        flex items-center justify-center
                        backdrop-blur-sm border-2
                        overflow-hidden whitespace-normal
                        ${matchedPairs.includes(selectedWords.findIndex(w => w.id === word.id))
                          ? 'bg-gradient-to-br from-emerald-100 to-green-100 text-emerald-800 scale-105 shadow-xl border-emerald-200/50 animate-pulse'
                          : selectedEnglishCard === selectedWords.findIndex(w => w.id === word.id)
                          ? 'bg-gradient-to-br from-violet-100 to-purple-100 text-violet-800 scale-105 shadow-xl border-violet-200/50'
                          : selectedTurkishCard === selectedWords.findIndex(w => w.id === word.id)
                          ? 'bg-gradient-to-br from-violet-100 to-purple-100 text-violet-800 scale-105 shadow-xl border-violet-200/50'
                          : (selectedEnglishCard !== null && selectedTurkishCard !== null) && !matchedPairs.includes(selectedWords.findIndex(w => w.id === word.id))
                            ? 'bg-gradient-to-br from-rose-100 to-red-100 text-rose-800 scale-105 shadow-xl border-rose-200/50 animate-shake'
                            : 'bg-white/80 hover:bg-gradient-to-br hover:from-violet-50 hover:to-purple-50 border-violet-200/30 hover:border-violet-300/50 text-gray-700 hover:scale-105 hover:shadow-lg'}
                      `}
                    >
                      <span className="text-xs sm:text-sm md:text-base font-medium break-words hyphens-auto px-1 w-full leading-tight">{word.turkish}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center bg-white/80 p-8 rounded-2xl shadow-xl backdrop-blur-sm border-2 border-violet-200/30">
          <div className="inline-block p-4 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 mb-6">
            <Trophy className="w-12 h-12 text-violet-600" />
          </div>
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Tebrikler!
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 p-6 rounded-xl border border-violet-100">
              <h3 className="text-lg font-semibold text-violet-800 mb-3">Performans</h3>
              <div className="space-y-2">
                <p className="text-purple-700">
                  <span className="font-medium">Toplam Puan:</span> {score}
                </p>
                <p className="text-purple-700">
                  <span className="font-medium">En İyi Combo:</span> {bestCombo}x
                </p>
                <p className="text-purple-700">
                  <span className="font-medium">Deneme Sayısı:</span> {attempts}
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-xl border border-amber-100">
              <h3 className="text-lg font-semibold text-amber-800 mb-3">Başarılar</h3>
              <div className="flex flex-wrap gap-3">
                {badges.includes('combo3') && (
                  <div className="flex items-center gap-2 bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full">
                    <Star className="w-4 h-4" />
                    <span className="text-sm font-medium">3'lü Combo</span>
                  </div>
                )}
                {badges.includes('combo5') && (
                  <div className="flex items-center gap-2 bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full">
                    <Medal className="w-4 h-4" />
                    <span className="text-sm font-medium">5'li Combo</span>
                  </div>
                )}
                {badges.includes('score100') && (
                  <div className="flex items-center gap-2 bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full">
                    <Trophy className="w-4 h-4" />
                    <span className="text-sm font-medium">100 Puan</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={startNewGame}
            className="w-full py-4 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white rounded-xl
              transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600
              active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 text-lg font-medium
              shadow-lg shadow-purple-500/30"
          >
            Yeniden Başla
          </button>
        </div>
      )}
    </div>
  );
}
