import React, { useState, useEffect } from 'react';
import { Word } from '../../data/words';
import { VocabularyService } from '../../services/vocabularyService';
import { SentenceCompletionService } from '../../services/sentenceCompletionService';
import { RefreshCw, CheckCircle, XCircle, Info } from 'lucide-react';

interface SentenceCompletionProps {
  words: Word[];
  unit: string;
}

interface Question {
  sentence: string;
  correctAnswer: string;
  options: string[];
}

export const SentenceCompletion: React.FC<SentenceCompletionProps> = ({ words, unit }) => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const vocabularyService = VocabularyService.getInstance();
  const sentenceService = SentenceCompletionService.getInstance();

  useEffect(() => {
    initializeGame();
  }, [unit]);

  const initializeGame = async () => {
    setLoading(true);
    setError(null);
    try {
      // Ünitedeki tüm kelimeleri al ve rastgele sırala
      const unitWords = vocabularyService.getUnitWords(words, unit);
      const shuffledWords = vocabularyService.shuffleArray(unitWords);
      const wordTexts = shuffledWords.map(word => word.english);
      
      // Cümleleri oluştur
      const questions = await sentenceService.generateSentenceCompletions(wordTexts);
      
      setQuestions(questions);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setScore(0);
      setGameCompleted(false);
    } catch (error) {
      console.error('Oyun başlatılırken hata:', error);
      setError('Cümleler oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    const correct = answer === questions[currentQuestionIndex].correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore(prevScore => prevScore + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setGameCompleted(true);
      }
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[400px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mb-4"></div>
        <p className="text-lg text-purple-700 font-medium">Cümleler oluşturuluyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[400px]">
        <div className="text-red-500 mb-4">
          <XCircle className="w-16 h-16 mx-auto mb-4" />
          <p className="text-lg text-center">{error}</p>
        </div>
        <button
          onClick={initializeGame}
          className="px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[400px]">
        <p className="text-lg text-gray-600 mb-4">Bu ünitede henüz kelime bulunmamaktadır.</p>
      </div>
    );
  }

  if (gameCompleted) {
    return (
      <div className="min-h-screen p-4 sm:p-8 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Tebrikler!</h2>
            <p className="text-xl text-gray-700">{score} / {questions.length} doğru</p>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-lg text-gray-700 text-center">
                Başarı Oranı: {Math.round((score / questions.length) * 100)}%
              </p>
            </div>

            <button
              onClick={initializeGame}
              className="w-full py-3 bg-purple-500 text-white rounded-lg text-lg font-medium
                hover:bg-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Tekrar Oyna
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="p-4 sm:p-8 flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Soru {currentQuestionIndex + 1} / {questions.length}
          </h2>
          <div className="text-lg text-gray-700">
            Skor: {score}
          </div>
        </div>
        <button
          onClick={initializeGame}
          className="p-3 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors shadow-sm"
          title="Yeni Sorular"
        >
          <RefreshCw className="w-6 h-6" />
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <p className="text-xl text-gray-800 mb-8 leading-relaxed">
          {currentQuestion.sentence}
        </p>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const word = words.find(w => w.english.toLowerCase() === option.toLowerCase());
            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={selectedAnswer !== null}
                className={`w-full p-4 rounded-lg text-left transition-all ${selectedAnswer === null ? 'hover:bg-blue-50 text-blue-600' : ''} ${
                  selectedAnswer === option
                    ? isCorrect
                      ? 'bg-green-50 text-green-800 border-2 border-green-400 shadow-sm'
                      : 'bg-red-50 text-red-800 border-2 border-red-400 shadow-sm'
                    : selectedAnswer !== null && option === currentQuestion.correctAnswer
                      ? 'bg-green-50 text-green-800 border-2 border-green-400 shadow-sm'
                      : 'bg-blue-50 text-blue-600 border border-blue-200 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">{option}</span>
                  <Info className="w-5 h-5 text-blue-400 opacity-50" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
