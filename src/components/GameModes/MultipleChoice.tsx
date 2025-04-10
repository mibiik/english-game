import React, { useState, useEffect } from 'react';
import { Word } from '../../data/words';
import { wordTracker } from '../../data/wordTracker';
import { updateWordDifficulty } from '../../data/difficultWords';
import { learningStatsTracker } from '../../data/learningStats';

interface MultipleChoiceProps {
  words: Word[];
  unit: number;
}

export const MultipleChoice: React.FC<MultipleChoiceProps> = ({ words, unit }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [unitWords, setUnitWords] = useState<Word[]>([]);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);

  useEffect(() => {
    const filteredWords = words.filter(word => word.unit === unit);
    setUnitWords(filteredWords);
    if (filteredWords.length > 0) {
      wordTracker.initializeUnit(words, unit);
      generateOptions(filteredWords, 0);
    }
  }, [words, unit]);

  const generateOptions = (wordList: Word[], index: number) => {
    // Rastgele bir kelime seç
    const availableWords = wordList.filter(word => !wordTracker.isWordSeen(word));
    const currentWord = availableWords.length > 0 
      ? availableWords[Math.floor(Math.random() * availableWords.length)]
      : wordList[Math.floor(Math.random() * wordList.length)];

    if (!currentWord) return;
    
    wordTracker.markWordAsSeen(currentWord);

    // Doğru cevabı ayır
    const correctAnswer = currentWord.turkish;
    
    // Diğer kelimeleri karıştır ve 3 tanesini seç
    const otherWords = wordList
      .filter(w => w.turkish !== correctAnswer && w.unit === currentWord.unit)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.turkish);

    // Doğru cevabı rastgele bir pozisyona yerleştir
    const randomPosition = Math.floor(Math.random() * 4);
    const allOptions = [...otherWords];
    allOptions.splice(randomPosition, 0, correctAnswer);
    
    setOptions(allOptions);
    setCurrentWordIndex(wordList.indexOf(currentWord));
  };

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections

    const currentWord = unitWords[currentWordIndex];
    const correct = answer === currentWord.turkish;
    
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setTotalAnswered(prev => prev + 1);

    // Zorlu kelimeler sistemine kelimeyi ekle
    updateWordDifficulty(currentWord, correct);

    if (correct) {
      setScore(prev => prev + 1);
      learningStatsTracker.recordWordLearned(currentWord);
    }

    setTimeout(() => {
      if (currentWordIndex < unitWords.length - 1) {
        setCurrentWordIndex(prev => prev + 1);
        generateOptions(unitWords, currentWordIndex + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      }
    }, correct ? 500 : 2000);
  };

  const getButtonStyle = (option: string) => {
    if (selectedAnswer === null) {
      return 'bg-white hover:bg-gray-100 border border-gray-200 cursor-pointer';
    }

    const currentWord = unitWords[currentWordIndex];
    if (option === currentWord.turkish) {
      return 'bg-green-500 text-white cursor-not-allowed';
    }
    if (option === selectedAnswer) {
      return 'bg-red-500 text-white cursor-not-allowed';
    }
    return 'bg-white border border-gray-200 cursor-not-allowed opacity-50';
  };

  if (unitWords.length === 0) {
    return <div className="text-center p-4">Bu ünitede kelime bulunmamaktadır.</div>;
  }

  const isGameComplete = currentWordIndex === unitWords.length - 1 && selectedAnswer !== null;

  const currentWord = unitWords[currentWordIndex];
  const progress = ((currentWordIndex + 1) / unitWords.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="text-base sm:text-lg font-semibold text-gray-700">
          Skor: {score}/{totalAnswered}
        </div>
        <div className="text-sm sm:text-base text-gray-600">
          {currentWordIndex + 1} / {unitWords.length}
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{currentWord.english}</h2>
        <p className="text-gray-600 text-base sm:text-lg">Doğru Türkçe karşılığını seçin</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(option)}
            className={`p-4 text-base sm:text-lg rounded-lg transition-all duration-300 shadow-md hover:shadow-lg relative z-20 ${getButtonStyle(option)}`}
            disabled={selectedAnswer !== null}
          >
            {option}
          </button>
        ))}
      </div>

      {isCorrect !== null && (
        <div className={`text-center text-lg font-semibold ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
          {isCorrect ? 'Doğru!' : `Yanlış! Doğru cevap: ${currentWord.turkish}`}
        </div>
      )}

      {isGameComplete && (
        <div className="mt-8 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Oyun Sonu Analizi</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-800 mb-2">Genel Performans</h4>
                <p className="text-blue-700">Toplam Soru: <span className="font-bold">{unitWords.length}</span></p>
                <p className="text-green-700">Doğru Cevap: <span className="font-bold">{score}</span></p>
                <p className="text-red-700">Yanlış Cevap: <span className="font-bold">{totalAnswered - score}</span></p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-green-800 mb-2">Doğruluk Oranı</h4>
                <p className="text-green-700 text-2xl font-bold">
                  {totalAnswered > 0 ? `${Math.round((score / totalAnswered) * 100)}%` : '0%'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-purple-800 mb-2">İlerleme Durumu</h4>
                <div className="w-full bg-purple-200 rounded-full h-4 mb-2">
                  <div
                    className="bg-purple-600 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-purple-700">Ünite Tamamlanma: <span className="font-bold">{Math.round(progress)}%</span></p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-orange-800 mb-2">Öğrenme Performansı</h4>
                <p className="text-orange-700">
                  {totalAnswered > 0 ?
                    (score / totalAnswered >= 0.8 ?
                      'Harika bir performans! Bu üniteyi başarıyla tamamladınız.' :
                      score / totalAnswered >= 0.6 ?
                        'İyi gidiyorsunuz! Biraz daha pratik yaparak daha da gelişebilirsiniz.' :
                        'Bu ünite için biraz daha çalışmanız gerekiyor.'
                    ) : 'Henüz yeterli veri yok.'}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-800 mb-2">Kelime İlerlemesi</h4>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-blue-600">
                    {(() => {
                      const progress = wordTracker.getProgress(unit);
                      return `${progress.seenCount}/${progress.totalCount} kelime görüldü (${progress.percentage}%)`;
                    })()}
                  </div>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${wordTracker.getProgress(unit).percentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};