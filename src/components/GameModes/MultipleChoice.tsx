import React, { useState, useEffect, useCallback } from 'react';
import { WordDetail } from '../../data/word4';
import { updateWordDifficulty } from '../../data/difficultWords';
import { learningStatsTracker } from '../../data/learningStats';
import { gameStateManager } from '../../lib/utils';
import { CheckCircle, XCircle, ArrowRight, Trophy, Target } from 'lucide-react';

interface MultipleChoiceProps {
  words: WordDetail[];
}

interface GameState {
  roundWords: WordDetail[];
  currentWordIndex: number;
  options: string[];
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  score: number;
  streak: number;
  showFeedback: boolean;
}

export const MultipleChoice: React.FC<MultipleChoiceProps> = ({ words }) => {
  const [roundWords, setRoundWords] = useState<WordDetail[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Oyun anahtarı
  const GAME_KEY = 'multipleChoice';
  
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

  const startNewRound = useCallback(() => {
    const shuffledWords = shuffleArray(words);
    setRoundWords(shuffledWords);
    setCurrentWordIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setStreak(0);
    setShowFeedback(false);
    if (shuffledWords.length > 0) {
      generateOptions(shuffledWords, 0);
    }
  }, [words, shuffleArray, generateOptions]);

  const startNewGame = useCallback(() => {
    gameStateManager.clearGameState(GAME_KEY); // Yeni oyun başlarken eski state'i temizle
    startNewRound();
  }, [startNewRound, GAME_KEY]);

  // İlk yükleme - localStorage'dan state'i kontrol et
  useEffect(() => {
    if (words.length > 0) {
      const savedState = gameStateManager.loadGameState(GAME_KEY) as GameState | null;
      if (savedState && savedState.roundWords.length > 0 && savedState.currentWordIndex < savedState.roundWords.length) {
        // Kaydedilmiş oyun var, yükle
        console.log('Kaydedilmiş oyun yükleniyor:', savedState);
        setRoundWords(savedState.roundWords);
        setCurrentWordIndex(savedState.currentWordIndex);
        setOptions(savedState.options);
        setSelectedAnswer(savedState.selectedAnswer);
        setIsCorrect(savedState.isCorrect);
        setScore(savedState.score);
        setStreak(savedState.streak);
        setShowFeedback(savedState.showFeedback);
        setIsLoading(false);
      } else {
        // Kaydedilmiş oyun yok, yeni oyun başlat
        console.log('Yeni oyun başlatılıyor');
        setTimeout(() => {
      startNewRound();
          setIsLoading(false);
        }, 100); // Kısa bir delay ile yeni oyun başlat
      }
    }
  }, [words, startNewRound, GAME_KEY]);

  // Her state değişikliğinde localStorage'a kaydet
  useEffect(() => {
    if (roundWords.length > 0 && !isLoading) {
      const gameState: GameState = {
        roundWords,
        currentWordIndex,
        options,
        selectedAnswer,
        isCorrect,
        score,
        streak,
        showFeedback
      };
      gameStateManager.saveGameState(GAME_KEY, gameState);
    }
  }, [roundWords, currentWordIndex, options, selectedAnswer, isCorrect, score, streak, showFeedback, GAME_KEY, isLoading]);

  const handleNextWord = useCallback(() => {
    const nextIndex = currentWordIndex + 1;
    
    if (nextIndex >= roundWords.length) {
      return;
    }

    setCurrentWordIndex(nextIndex);
    generateOptions(roundWords, nextIndex);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowFeedback(false);
  }, [roundWords, currentWordIndex, generateOptions]);

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer !== null) return;

    const currentWord = roundWords[currentWordIndex];
    const correct = answer === currentWord.turkish;
    
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setShowFeedback(true);
    
    updateWordDifficulty(currentWord, correct);

    if (correct) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
      learningStatsTracker.recordWordLearned(currentWord);
    } else {
      setStreak(0);
    }

    // Doğru cevaplarda 1 saniye, yanlışlarda 1.5 saniye
    setTimeout(() => {
      handleNextWord();
    }, correct ? 1000 : 1500);
  };

  const getButtonStyle = (option: string) => {
    if (selectedAnswer === null) {
      return 'bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border-2 border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-700 transform hover:scale-[1.02] cursor-pointer shadow-sm hover:shadow-md';
    }

    const currentWord = roundWords[currentWordIndex];
    if (option === currentWord.turkish) {
      return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-2 border-green-400 shadow-lg shadow-green-200/50 scale-[1.02] ring-2 ring-green-300';
    }
    if (option === selectedAnswer) {
      return 'bg-gradient-to-r from-red-500 to-rose-600 text-white border-2 border-red-400 shadow-lg shadow-red-200/50 scale-[1.02] ring-2 ring-red-300';
    }
    return 'bg-slate-50 border-2 border-slate-200 text-slate-400 opacity-50';
  };

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

  const isGameComplete = currentWordIndex >= roundWords.length - 1 && selectedAnswer !== null;
  const currentWord = roundWords[currentWordIndex];
  const progress = ((currentWordIndex + 1) / roundWords.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        {!isGameComplete ? (
          <>
            {/* Header Stats */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="font-bold text-slate-700">{score}</span>
                  <span className="text-slate-500">/{currentWordIndex + 1}</span>
                </div>
                {streak > 0 && (
                  <div className="flex items-center gap-2 bg-orange-100 rounded-full px-4 py-2 shadow-md">
                    <Target className="w-5 h-5 text-orange-500" />
                    <span className="font-bold text-orange-600">{streak} 🔥</span>
                  </div>
                )}
              </div>
              <div className="text-slate-600 font-medium">
                {currentWordIndex + 1} / {roundWords.length}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="w-full bg-slate-200 rounded-full h-2 shadow-inner">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out shadow-md"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question Section */}
            <div className="text-center mb-6">
              <div className="bg-white rounded-2xl shadow-xl p-6 mb-4 transform transition-all duration-300">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                  {currentWord.headword}
                </h2>
                <p className="text-slate-600">Doğru Türkçe karşılığını seçin</p>
              </div>

              {/* Feedback - Sabit yükseklik */}
              <div className="mb-4 h-12 flex items-center justify-center">
                {showFeedback && (
                  <div className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 shadow-md ${
                    isCorrect 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                      : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                  }`}>
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Doğru! +1 puan</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5" />
                        <span className="font-medium">Doğrusu: {currentWord.turkish}</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
              {options.map((option, index) => (
                <button
                  key={`${currentWordIndex}-${index}-${option}`}
                  onClick={() => handleAnswerSelect(option)}
                  className={`p-4 text-base font-medium rounded-lg transition-all duration-300 ${getButtonStyle(option)}`}
                  disabled={selectedAnswer !== null}
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        ) : (
          /* Game Complete Screen */
          <div className="text-center max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="mb-6">
                <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-slate-800 mb-2">Tebrikler!</h3>
                <p className="text-slate-600">Turu başarıyla tamamladınız</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                  <h4 className="text-lg font-semibold text-blue-800 mb-2">Toplam Skor</h4>
                  <p className="text-3xl font-bold text-blue-600">{score}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                  <h4 className="text-lg font-semibold text-green-800 mb-2">Doğruluk</h4>
                  <p className="text-3xl font-bold text-green-600">
                    {Math.round((score / (currentWordIndex + 1)) * 100)}%
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                  <h4 className="text-lg font-semibold text-purple-800 mb-2">Kelime</h4>
                  <p className="text-3xl font-bold text-purple-600">{currentWordIndex + 1}</p>
                </div>
              </div>

              <button
                onClick={startNewGame}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
              >
                <ArrowRight className="w-6 h-6" />
                Yeni Tur Başlat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};