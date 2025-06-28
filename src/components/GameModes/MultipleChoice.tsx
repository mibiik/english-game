import React, { useState, useEffect, useCallback } from 'react';
import { WordDetail } from '../../data/word4';
import { updateWordDifficulty } from '../../data/difficultWords';
import { learningStatsTracker } from '../../data/learningStats';
import { CheckCircle, XCircle, ArrowRight, Trophy, Target } from 'lucide-react';

interface MultipleChoiceProps {
  words: WordDetail[];
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

  useEffect(() => {
    if (words.length > 0) {
      startNewRound();
    }
  }, [words, startNewRound]);

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
      return 'bg-gradient-to-r from-slate-50 to-slate-100 hover:from-blue-50 hover:to-blue-100 border-2 border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 transform hover:scale-105 cursor-pointer';
    }

    const currentWord = roundWords[currentWordIndex];
    if (option === currentWord.turkish) {
      return 'bg-gradient-to-r from-green-500 to-green-600 text-white border-2 border-green-400 shadow-lg shadow-green-200 scale-105';
    }
    if (option === selectedAnswer) {
      return 'bg-gradient-to-r from-red-500 to-red-600 text-white border-2 border-red-400 shadow-lg shadow-red-200 scale-105';
    }
    return 'bg-slate-100 border-2 border-slate-200 text-slate-400 opacity-60';
  };

  if (roundWords.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Kelimeler yükleniyor...</p>
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
            <div className="flex justify-between items-center mb-8">
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
            <div className="mb-8">
              <div className="w-full bg-slate-200 rounded-full h-3 shadow-inner">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out shadow-lg"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question Section */}
            <div className="text-center mb-12">
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 transform transition-all duration-300">
                <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                  {currentWord.headword}
                </h2>
                <p className="text-slate-600 text-lg">Doğru Türkçe karşılığını seçin</p>
              </div>

              {/* Feedback - Sabit yükseklik */}
              <div className="mb-6 h-16 flex items-center justify-center">
                {showFeedback && (
                  <div className={`flex items-center justify-center gap-3 p-4 rounded-xl transition-all duration-300 ${
                    isCorrect 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-6 h-6" />
                        <span className="font-semibold text-lg">Harika! +1 puan</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6" />
                        <span className="font-semibold text-lg">Doğrusu: {currentWord.turkish}</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {options.map((option, index) => (
                <button
                  key={`${currentWordIndex}-${index}-${option}`}
                  onClick={() => handleAnswerSelect(option)}
                  className={`p-6 text-lg font-semibold rounded-xl transition-all duration-300 ${getButtonStyle(option)}`}
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
                onClick={startNewRound}
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