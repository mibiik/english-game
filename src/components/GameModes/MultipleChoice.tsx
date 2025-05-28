import React, { useState, useEffect } from 'react';
import { Word } from '../../data/words';
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
  const [usedWordIndices, setUsedWordIndices] = useState<number[]>([]);

  useEffect(() => {
    const filteredWords = words.filter(word => word.unit === unit);
    setUnitWords(filteredWords);
    setUsedWordIndices([]);
    if (filteredWords.length > 0) {
      generateOptions(filteredWords);
    }
  }, [words, unit]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const generateOptions = (wordList: Word[]) => {
    // Kullanılmayan kelimeleri bul
    const availableIndices = wordList
      .map((_, index) => index)
      .filter(index => !usedWordIndices.includes(index));
  
    if (availableIndices.length === 0) {
      setCurrentWordIndex(wordList.length - 1);
      return;
    }
  
    // Rastgele bir kelime seç
    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    const currentWord = wordList[randomIndex];
    
    setUsedWordIndices(prev => [...prev, randomIndex]);
    setCurrentWordIndex(randomIndex);
    
    // Doğru cevap
    const correctAnswer = currentWord.turkish;
  
    // Mevcut kelime dışındaki kelimeleri al ve rastgele 3 yanlış şık seç
    const wrongOptions = shuffleArray(
      wordList
        .filter((word, idx) => idx !== randomIndex)
        .map(word => word.turkish)
    ).slice(0, 3);
  
    // Tüm seçenekleri karıştır
    const allOptions = shuffleArray([...wrongOptions, correctAnswer]);
    setOptions(allOptions);
  };







const handleAnswerSelect = (answer: string) => {
  if (selectedAnswer !== null) return;

  const currentWord = unitWords[currentWordIndex];
  const correct = answer === currentWord.turkish;
  
  setSelectedAnswer(answer);
  setIsCorrect(correct);
  setTotalAnswered(prev => prev + 1);

  updateWordDifficulty(currentWord, correct);

  if (correct) {
    setScore(prev => prev + 1);
    learningStatsTracker.recordWordLearned(currentWord);
  }

  setTimeout(() => {
    // Sonraki kelimeye geç
    generateOptions(unitWords);
    setSelectedAnswer(null);
    setIsCorrect(null);
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

const isGameComplete = usedWordIndices.length === unitWords.length && selectedAnswer !== null;
const currentWord = unitWords[currentWordIndex];
const progress = (usedWordIndices.length / unitWords.length) * 100;

return (
  <div className="max-w-2xl mx-auto p-4 space-y-6">
    <div className="flex justify-between items-center mb-4">
      <div className="text-base sm:text-lg font-semibold text-gray-700">
        Skor: {score}/{totalAnswered}
      </div>
      <div className="text-sm sm:text-base text-gray-600">
        {usedWordIndices.length} / {unitWords.length}
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
          </div>
        </div>
      </div>
    )}
  </div>
);
};