import React, { useState, useEffect } from 'react';
import { Word } from '../../data/words';
import { getMostDifficultWords, WordDifficulty, updateWordDifficulty } from '../../data/difficultWords';

interface DifficultWordsProps {
  words: Word[];
  unit: string;
}

export function DifficultWords({ words, unit }: DifficultWordsProps) {
  const [difficultWords, setDifficultWords] = useState<WordDifficulty[]>([]);
  const [selectedWord, setSelectedWord] = useState<WordDifficulty | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);

  useEffect(() => {
    loadDifficultWords();
  }, [unit]);

  const loadDifficultWords = () => {
    const words = getMostDifficultWords(10).filter(w => w.word.unit === unit);
    setDifficultWords(words);
    setSelectedWord(words.length > 0 ? words[0] : null);
  };

  const handleAnswerSubmit = () => {
    if (!selectedWord) return;

    const isCorrect = userAnswer.toLowerCase().trim() === selectedWord.word.turkish.toLowerCase();
    updateWordDifficulty(selectedWord.word, isCorrect);

    setFeedback({
      message: isCorrect ? 'Doğru!' : 'Yanlış. Tekrar deneyin.',
      isCorrect
    });

    if (isCorrect) {
      setTimeout(() => {
        const nextWord = difficultWords.find(w => w !== selectedWord);
        setSelectedWord(nextWord || null);
        setUserAnswer('');
        setShowAnswer(false);
        setFeedback(null);
        loadDifficultWords();
      }, 1500);
    }
  };

  if (difficultWords.length === 0) {
    return (
      <div className="text-center p-8 animate-fadeIn">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Zorlu Kelimeler
        </h2>
        <p className="text-gray-600">
          Henüz zorlandığınız kelime bulunmuyor. Diğer oyun modlarında pratik yaptıkça, 
          burada zorlandığınız kelimeler görünecek.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-8 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8">
        {selectedWord && (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-3xl sm:text-4xl font-bold mb-4">{selectedWord.word.english}</h3>
              <p className="text-base sm:text-lg text-gray-600">
                Bu kelimeyi {selectedWord.wrongAttempts} kez yanlış yaptınız
                ({Math.round((selectedWord.wrongAttempts / selectedWord.totalAttempts) * 100)}% hata oranı)
              </p>
            </div>

            <div className="space-y-6">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Türkçe karşılığını yazın"
                className="w-full p-4 text-xl border-2 rounded-xl focus:ring-4 focus:ring-purple-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleAnswerSubmit()}
              />

              <div className="flex justify-between gap-6">
                <button
                  onClick={handleAnswerSubmit}
                  className="flex-1 bg-purple-600 text-white py-4 px-6 text-lg rounded-xl hover:bg-purple-700 transition-colors"
                >
                  Kontrol Et
                </button>
                <button
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="flex-1 bg-gray-200 text-gray-700 py-4 px-6 text-lg rounded-xl hover:bg-gray-300 transition-colors"
                >
                  {showAnswer ? 'Cevabı Gizle' : 'Cevabı Göster'}
                </button>
              </div>
            </div>

            {feedback && (
              <div
                className={`text-center p-4 text-lg rounded-xl ${feedback.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
              >
                {feedback.message}
              </div>
            )}

            {showAnswer && (
              <div className="text-center p-4 bg-gray-100 rounded-xl">
                <p className="text-xl font-medium">Cevap: {selectedWord.word.turkish}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        {difficultWords.map((word) => (
          <button
            key={word.word.english}
            onClick={() => {
              setSelectedWord(word);
              setUserAnswer('');
              setShowAnswer(false);
              setFeedback(null);
            }}
            className={`p-6 rounded-xl text-lg transition-all ${selectedWord === word
              ? 'bg-purple-600 text-white shadow-xl transform scale-105'
              : 'bg-white text-gray-700 shadow-lg hover:shadow-xl hover:scale-102'}`}
          >
            <div className="font-bold text-xl">{word.word.english}</div>
            <div className="text-sm mt-2 opacity-75">
              {Math.round((word.wrongAttempts / word.totalAttempts) * 100)}% hata
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}