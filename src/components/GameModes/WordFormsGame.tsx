import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw, CheckCircle, XCircle, Trophy, AlertTriangle, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { WordDetail } from '../../data/words';
import { Button } from '../ui/button';
import { gameScoreService } from '../../services/gameScoreService';
import { authService } from '../../services/authService';
import { awardPoints } from '../../services/scoreService';
import { soundService } from '../../services/soundService';

// --- TYPE DEFINITIONS ---
interface WordFormsGameProps {
  words: WordDetail[];
}

interface WordFormQuestion {
  sentence: string;
  baseWord: string;
  correctAnswer: string;
}

type GameStatus = 'loading' | 'playing' | 'answered' | 'completed' | 'error';

// --- HELPER FUNCTIONS ---
const generateWordFormQuestions = async (words: WordDetail[]): Promise<WordFormQuestion[]> => {
  if (words.length === 0) return [];

  const selectedForms = words.map(word => {
    const allForms = [
      ...(word.forms.verb?.map(f => ({ type: 'verb', form: f })) || []),
      ...(word.forms.noun?.map(f => ({ type: 'noun', form: f })) || []),
      ...(word.forms.adjective?.map(f => ({ type: 'adjective', form: f })) || []),
      ...(word.forms.adverb?.map(f => ({ type: 'adverb', form: f })) || []),
    ];
    const chosenForm = allForms.length > 0 ? allForms[Math.floor(Math.random() * allForms.length)] : { type: 'base', form: word.headword };
    return { baseWord: word.headword, selectedForm: chosenForm.form };
  });

  const prompt = `
    Create B1-B2 level English sentences for the following word forms. 
    Replace each target word with "_____".
    The sentence context must clearly indicate which word form is needed.
    Word forms:
    ${selectedForms.map((item, i) => `${i + 1}. Word: "${item.selectedForm}" (from base: ${item.baseWord})`).join('\n')}
    RULES:
    - Return ONLY a valid JSON array of objects.
    - JSON structure: { "sentence": "...", "baseWord": "...", "correctAnswer": "..." }
  `;

  try {
    const results = await aiService.generateWordFormsQuestion(prompt);
    return Array.isArray(results) ? results.filter(q => q.sentence && q.baseWord && q.correctAnswer) : [];
  } catch (error) {
    console.error('Error generating word form questions:', error);
    return [];
  }
};

const getSentenceParts = (sentence: string): [string, string] => {
    const parts = sentence.split('_____');
    return [parts[0] || '', parts[1] || ''];
};


// --- MAIN COMPONENT ---
const INITIAL_LOAD_COUNT = 5;

const WordFormsGame: React.FC<WordFormsGameProps> = ({ words }) => {
  const [status, setStatus] = useState<GameStatus>('loading');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isWaitingForMore, setIsWaitingForMore] = useState(false);
  const [questions, setQuestions] = useState<WordFormQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [streak, setStreak] = useState(0);
  const [scoreChange, setScoreChange] = useState<null | { value: number, key: number }>(null);

  const loadQuestions = useCallback(async () => {
    setStatus('loading');
    setIsCorrect(null);
    setUserAnswer('');

    // Fisher-Yates shuffle algorithm
    const shuffleArray = (array: any[]) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    const shuffledWords = shuffleArray([...words]);

    const initialWords = shuffledWords.slice(0, INITIAL_LOAD_COUNT);
    const remainingWords = shuffledWords.slice(INITIAL_LOAD_COUNT);

    const initialQuestions = await generateWordFormQuestions(initialWords);

    if (initialQuestions.length > 0) {
      setQuestions(initialQuestions);
      setStatus('playing');

      // Load the rest in the background
      if (remainingWords.length > 0) {
        setIsLoadingMore(true);
        generateWordFormQuestions(remainingWords).then(additionalQuestions => {
          setQuestions(prevQuestions => [...prevQuestions, ...additionalQuestions]);
          setIsLoadingMore(false);
        });
      }
    } else {
      setStatus('error');
    }
  }, [words]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  useEffect(() => {
    if (status === 'playing' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [status, currentIndex]);

  const handleAnswerSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (status !== 'playing' || !userAnswer.trim()) return;

    const currentQuestion = questions[currentIndex];
    const correct = userAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
    
    setIsCorrect(correct);
    if (correct) {
      setScore(prev => prev + 2);
      setScoreChange({ value: +2, key: Date.now() });
      setStreak(prev => prev + 1);
      const bonus = Math.min(streak, 2); // Maksimum 2 bonus puan
      awardPoints('wordForms', 2 + bonus, words[0]?.unit || '1');
      soundService.playCorrect();
    } else {
      setScore(prev => prev - 2);
      setScoreChange({ value: -2, key: Date.now() });
      setStreak(0);
      awardPoints('wordForms', -2, words[0]?.unit || '1');
      soundService.playWrong();
    }
    setStatus('answered');
  };

    const handleNextQuestion = () => {
    const isLastLoadedQuestion = currentIndex === questions.length - 1;

    if (!isLastLoadedQuestion) {
      setCurrentIndex(prev => prev + 1);
      setUserAnswer('');
      setIsCorrect(null);
      setStatus('playing');
    } else { // On the last loaded question
      if (isLoadingMore) {
        setIsWaitingForMore(true);
      } else {
        // Oyun bitti, skoru kaydet
        const unit = words[0]?.unit || '1';
        try {
          gameScoreService.saveScore('wordForms', score, unit);
        } catch (error) {
          console.error('Skor kaydedilirken hata:', error);
        }
        setStatus('completed');
      }
    }
  };

  useEffect(() => {
    // Automatically advance after questions have loaded if the user was waiting.
    if (isWaitingForMore && !isLoadingMore) {
      setIsWaitingForMore(false);
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setUserAnswer('');
        setIsCorrect(null);
        setStatus('playing');
      } else {
        // This could happen if the remaining words failed to generate questions
        setStatus('completed');
      }
    }
  }, [isWaitingForMore, isLoadingMore, questions.length, currentIndex]);

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setIsWaitingForMore(false);
    loadQuestions();
  };

  const currentQuestion = questions[currentIndex];
  // Progress should be based on the total number of words, not just loaded questions
  const totalQuestions = words.length;
  const progress = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

  // --- RENDER LOGIC ---

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-100 text-slate-700">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <p className="mt-4 text-lg">Loading questions...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-100 text-red-600">
        <AlertTriangle className="w-12 h-12" />
        <p className="mt-4 text-lg">Failed to load questions.</p>
                <Button onClick={loadQuestions} className="mt-4 bg-blue-600 hover:bg-blue-700">
          <RefreshCw className="mr-2 h-4 w-4" /> Try Again
        </Button>
      </div>
    );
  }

  if (status === 'completed') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-2xl shadow-xl text-center"
        >
          <Trophy className="w-20 h-20 text-yellow-500 mx-auto" />
          <h2 className="text-4xl font-bold text-slate-800 mt-4">Game Over!</h2>
          <p className="text-xl text-slate-600 mt-2">
            Your final score is
          </p>
          <p className="text-6xl font-bold text-blue-600 my-4">
            {score} / {questions.length}
          </p>
                              <Button onClick={handleRestart} className="mt-6 bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6">
            <RefreshCw className="mr-2 h-5 w-5" /> Play Again
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
        <div className="flex flex-col h-screen bg-gray-50 font-sans">
      {/* Puan Gösterimi */}
      {scoreChange && (
        <div key={scoreChange.key} className={`fixed top-1/3 left-1/2 -translate-x-1/2 z-50 pointer-events-none select-none animate-fade-in-out`}
          style={{ fontSize: '2.5rem', fontWeight: 'bold', color: scoreChange.value > 0 ? '#22c55e' : '#ef4444', textShadow: '0 2px 8px rgba(0,0,0,0.15)', opacity: '0.3' }}>
          {scoreChange.value > 0 ? `+${scoreChange.value}` : scoreChange.value}
        </div>
      )}
      {/* Header */}
      <header className="p-4 bg-white shadow-sm">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <h1 className="text-xl font-bold text-gray-700">Word Forms Challenge</h1>
          <div className="text-lg font-semibold text-gray-600">
            Score: <span className="text-blue-600">{score}</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <motion.div
                className="bg-blue-600 h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
            />
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl text-center"
          >
            <p className="text-lg text-gray-500 mb-4">
              Complete the sentence with the correct form of <strong className="text-blue-600">{currentQuestion.baseWord}</strong>.
            </p>
            
            <div className="text-3xl font-serif text-gray-800 bg-gray-100 p-6 rounded-lg min-h-[8rem] flex items-center justify-center flex-wrap">
                {getSentenceParts(currentQuestion.sentence)[0]}
                <form onSubmit={handleAnswerSubmit} className="inline-block mx-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className={`w-48 bg-transparent border-b-2 p-2 text-center text-3xl font-serif focus:outline-none transition-colors duration-300
                            ${isCorrect === true ? 'border-green-500 text-green-600' : isCorrect === false ? 'border-red-500 text-red-600' : 'border-gray-300 focus:border-blue-500'}`}
                        placeholder="..."
                        disabled={status === 'answered'}
                        autoComplete="off"
                    />
                </form>
                {getSentenceParts(currentQuestion.sentence)[1]}
            </div>

            <div className="mt-6 min-h-[80px]">
              {status === 'playing' && (
                                <Button onClick={handleAnswerSubmit} disabled={!userAnswer.trim()} className="bg-blue-600 hover:bg-blue-700 text-lg px-10 py-6">
                  Check Answer
                </Button>
              )}

              <AnimatePresence>
                {status === 'answered' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center"
                  >
                    {isCorrect ? (
                      <div className="flex items-center gap-3 text-green-600">
                        <CheckCircle className="w-8 h-8" />
                        <span className="text-2xl font-bold">Correct!</span>
                      </div>
                    ) : (
                      <div className="text-red-600">
                        <div className="flex items-center gap-3">
                            <XCircle className="w-8 h-8" />
                            <span className="text-2xl font-bold">Incorrect</span>
                        </div>
                        <p className="text-lg mt-2">
                          The correct answer is: <strong className="font-bold">{currentQuestion.correctAnswer}</strong>
                        </p>
                      </div>
                    )}
                                                                                <Button 
                      onClick={handleNextQuestion} 
                      className="mt-4 bg-gray-800 hover:bg-gray-900 text-lg px-10 py-6 min-w-[200px]"
                      disabled={isWaitingForMore}
                    >
                      {currentIndex === questions.length - 1 && isLoadingMore ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Loading More...
                        </>
                      ) : (
                        <>
                          {currentIndex < totalQuestions - 1 ? 'Next Question' : 'Finish'}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default WordFormsGame;