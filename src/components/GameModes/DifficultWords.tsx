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
    <div className="max-w-2xl mx-auto p-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-center text-gray-700 mb-8">
        Zorlu Kelimeler
      </h2>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        {selectedWord && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">{selectedWord.word.english}</h3>
              <p className="text-sm text-gray-500">
                Bu kelimeyi {selectedWord.wrongAttempts} kez yanlış yaptınız
                ({Math.round((selectedWord.wrongAttempts / selectedWord.totalAttempts) * 100)}% hata oranı)
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Türkçe karşılığını yazın"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleAnswerSubmit()}
              />

              <div className="flex justify-between gap-4">
                <button
                  onClick={handleAnswerSubmit}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Kontrol Et
                </button>
                <button
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  {showAnswer ? 'Cevabı Gizle' : 'Cevabı Göster'}
                </button>
              </div>
            </div>

            {feedback && (
              <div
                className={`text-center p-3 rounded-lg ${feedback.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
              >
                {feedback.message}
              </div>
            )}

            {showAnswer && (
              <div className="text-center p-3 bg-gray-100 rounded-lg">
                <p className="font-medium">Cevap: {selectedWord.word.turkish}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {difficultWords.map((word) => (
          <button
            key={word.word.english}
            onClick={() => {
              setSelectedWord(word);
              setUserAnswer('');
              setShowAnswer(false);
              setFeedback(null);
            }}
            className={`p-4 rounded-lg text-sm transition-all ${selectedWord === word
              ? 'bg-purple-600 text-white shadow-lg transform scale-105'
              : 'bg-white text-gray-700 shadow hover:shadow-md hover:scale-102'}`}
          >
            <div className="font-medium">{word.word.english}</div>
            <div className="text-xs mt-1 opacity-75">
              {Math.round((word.wrongAttempts / word.totalAttempts) * 100)}% hata
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}