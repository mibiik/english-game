import React, { useState, useCallback, useEffect } from 'react';
import { WordDetail } from '../../data/words';
import { SentenceCompletionService, SentenceQuestion } from '../../services/sentenceCompletionService';
import { RefreshCw, CheckCircle, XCircle, Info, PlayCircle } from 'lucide-react';
import { allWords } from '../../data/allWords';

interface SentenceCompletionProps {
  words: WordDetail[];
}

export const SentenceCompletion: React.FC<SentenceCompletionProps> = ({ words }) => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<SentenceQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  const sentenceService = SentenceCompletionService.getInstance();

  const shuffleArray = useCallback(<T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  const getRandomWrongOptions = useCallback((correctAnswer: string, count: number): string[] => {
    const otherWords: string[] = allWords
      .filter((word: string) => word.toLowerCase() !== correctAnswer.toLowerCase());
    
    return shuffleArray(otherWords).slice(0, count);
  }, [shuffleArray]);

  const fetchQuestionsAndStartGame = useCallback(async () => {
    if (words.length === 0) {
        setError("Oyun için kelime bulunamadı.");
        return;
    }

    setLoading(true);
    setError(null);
    setGameStarted(true);

    const wordTexts = words.map(word => word.headword);
    
    try {
      const generatedQuestions = await sentenceService.generateSentenceCompletions(wordTexts);
      
      if (generatedQuestions.length === 0) {
        setError('Bu kelimelerle soru oluşturulamadı. Lütfen tekrar deneyin.');
        setLoading(false);
        return;
      }

      const questionsWithShuffledOptions = generatedQuestions.map(q => ({
        ...q,
        options: shuffleArray(q.options)
      }));

      setQuestions(questionsWithShuffledOptions);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setScore(0);
      setGameCompleted(false);
    } catch (error: any) {
      console.error('Oyun başlatılırken hata:', error);
      setError(error.message || 'Cümleler oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
      setQuestions([]);
      setCurrentQuestionIndex(0);
      setGameCompleted(false);
    } finally {
      setLoading(false);
    }
  }, [words, sentenceService]);

  useEffect(() => {
    if (gameStarted && words.length > 0) {
      fetchQuestionsAndStartGame();
    }
  }, [words, gameStarted, fetchQuestionsAndStartGame]);

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
  
  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[400px]">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Boşluk Doldurma</h2>
        <p className="text-gray-600 mb-8 text-center max-w-md">Yapay zeka tarafından oluşturulan cümlelerdeki boşlukları doğru kelimelerle doldurun.</p>
        <button
          onClick={() => setGameStarted(true)}
          className="px-8 py-4 bg-purple-600 text-white rounded-xl text-lg font-bold shadow-lg flex items-center gap-3
            transform transition-all duration-300 hover:scale-105 hover:bg-purple-700 active:scale-95"
        >
          <PlayCircle className="w-6 h-6" />
          Oyuna Başla
        </button>
      </div>
    );
  }

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
          onClick={fetchQuestionsAndStartGame}
          className="px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
        >
          Tekrar Dene
        </button>
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
              onClick={fetchQuestionsAndStartGame}
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

  if (!currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[400px]">
        <div className="text-red-500 mb-4">
          <XCircle className="w-16 h-16 mx-auto mb-4" />
          <p className="text-lg text-center">Sorular yüklenemedi. Lütfen tekrar deneyin.</p>
        </div>
        <button
          onClick={() => {
            setGameStarted(false);
            setQuestions([]);
            setError(null);
          }}
          className="px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
        >
          Ana Menüye Dön
        </button>
      </div>
    );
  }

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
          onClick={fetchQuestionsAndStartGame}
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
          {currentQuestion.options.map((option: string, index: number) => {
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
