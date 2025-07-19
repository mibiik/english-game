import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw, ChevronLeft, ChevronRight, Lightbulb, Send, ArrowLeft, Target, CheckCircle, XCircle, Trophy, Sparkles, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { aiService } from '../services/aiService';

interface ParaphraseAttempt {
  type: 'parenthetical' | 'reporting' | 'according';
  typeName: string;
  answer: string;
  feedback?: {
    correct: boolean;
    similarity: string;
    feedback: string;
    suggestion: string;
  };
  isEvaluated: boolean;
}

const ParaphrasePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [originalSentence, setOriginalSentence] = useState<string>('');
  const [isLoadingSentence, setIsLoadingSentence] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const pageInitialized = useRef(false);
  
  const [paraphraseAttempts, setParaphraseAttempts] = useState<ParaphraseAttempt[]>([
    {
      type: 'parenthetical',
      typeName: 'Parenthetical Citation',
      answer: '',
      isEvaluated: false
    },
    {
      type: 'reporting',
      typeName: 'Reporting Verb Citation', 
      answer: '',
      isEvaluated: false
    },
    {
      type: 'according',
      typeName: 'According to Citation',
      answer: '',
      isEvaluated: false
    }
  ]);

  const generateSentence = async () => {
    if (isLoadingSentence) return;
    setIsLoadingSentence(true);
    try {
      const sentence = await aiService.generateAcademicSentence();
      setOriginalSentence(sentence);
    } catch (error) {
      console.error('Sentence generation error:', error);
      setOriginalSentence('Climate change affects biodiversity significantly (Smith, 2020, p.45).');
    } finally {
      setIsLoadingSentence(false);
    }
  };

  const startGame = async () => {
    if (!originalSentence) {
      await generateSentence();
    }
    setGameStarted(true);
    setCurrentStep(0);
  };

  const evaluateCurrentAttempt = async () => {
    if (!paraphraseAttempts[currentStep].answer.trim() || isEvaluating) return;
    
    setIsEvaluating(true);
    try {
      const feedback = await aiService.evaluateParaphrase(
        originalSentence,
        paraphraseAttempts[currentStep].answer,
        paraphraseAttempts[currentStep].type
      );
      
      const updatedAttempts = [...paraphraseAttempts];
      updatedAttempts[currentStep] = {
        ...updatedAttempts[currentStep],
        feedback,
        isEvaluated: true
      };
      setParaphraseAttempts(updatedAttempts);
      
    } catch (error) {
      console.error('Evaluation error:', error);
    } finally {
      setIsEvaluating(false);
    }
  };

  const goToNextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResult(true);
    }
  };

  const updateAnswer = (answer: string) => {
    const updatedAttempts = [...paraphraseAttempts];
    updatedAttempts[currentStep] = {
      ...updatedAttempts[currentStep],
      answer
    };
    setParaphraseAttempts(updatedAttempts);
  };

  const resetGame = async () => {
    setGameStarted(false);
    setShowResult(false);
    setCurrentStep(0);
    setParaphraseAttempts([
      {
        type: 'parenthetical',
        typeName: 'Parenthetical Citation',
        answer: '',
        isEvaluated: false
      },
      {
        type: 'reporting',
        typeName: 'Reporting Verb Citation', 
        answer: '',
        isEvaluated: false
      },
      {
        type: 'according',
        typeName: 'According to Citation',
        answer: '',
        isEvaluated: false
      }
    ]);
    await generateSentence();
  };

  useEffect(() => {
    if (pageInitialized.current === false) {
    generateSentence();
      pageInitialized.current = true;
    }
  }, []);

  const getParaphraseHints = (type: string) => {
    switch (type) {
      case 'parenthetical':
        return [
          '📌 Parenthetical Citation: Place the source in parentheses at the end',
          '✅ Correct: "Climate change affects biodiversity (Smith, 2020)."',
          '✅ Correct: "Global warming is critical (Jones, 2023, p.45)."',
          '❌ Wrong: Don\'t forget the parentheses'
        ];
      case 'reporting':
        return [
          '📌 Reporting Verb Citation: Include author name with a reporting verb',
          '✅ Correct: "Smith (2020) argues that climate change is serious."',
          '✅ Correct: "Jones (2023) states that biodiversity is declining."',
          '🎯 Verbs: argues, states, claims, suggests, indicates, asserts'
        ];
      case 'according':
        return [
          '📌 According to Citation: Start with "According to"',
          '✅ Correct: "According to Smith (2020), climate change is serious."',
          '✅ Correct: "According to research (Jones, 2023), biodiversity is declining."',
          '❌ Wrong: Don\'t forget to start with "According to"'
        ];
      default:
        return [];
    }
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-2xl w-full border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Paraphrase Challenge</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Paraphrase AI-generated sentences in 3 different citation styles
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
            <h3 className="text-gray-900 dark:text-white font-semibold mb-3">How to Play:</h3>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2 text-sm">
              <li>• AI will generate an academic sentence for you</li>
              <li>• Rewrite this sentence using 3 different paraphrase methods:</li>
              <li className="ml-6">1. Parenthetical citation</li>
              <li className="ml-6">2. Reporting verb citation</li>
              <li className="ml-6">3. "According to" citation</li>
              <li>• AI will evaluate each of your attempts</li>
            </ul>
          </div>

          {originalSentence && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <h4 className="text-blue-800 dark:text-blue-300 text-sm font-semibold mb-2">Generated Sentence:</h4>
              <p className="text-gray-900 dark:text-white text-sm">{originalSentence}</p>
            </div>
          )}

          <button
            onClick={startGame}
            disabled={isLoadingSentence || !originalSentence}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
          >
            {isLoadingSentence ? (
              <div className="flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin" />
                Generating Sentence...
              </div>
            ) : (
              'Start Game'
            )}
          </button>

          <button
            onClick={() => navigate('/')}
            className="mt-4 flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (showResult) {
    const correctAnswers = paraphraseAttempts.filter(attempt => attempt.feedback?.correct).length;
    const percentage = Math.round((correctAnswers / 3) * 100);
    
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-2xl w-full border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Results</h2>
            <p className="text-gray-600 dark:text-gray-400">Paraphrase Challenge completed</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{correctAnswers}</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Correct</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">3</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Total</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{percentage}%</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Success</div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {paraphraseAttempts.map((attempt, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  {attempt.feedback?.correct ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="text-gray-900 dark:text-white font-semibold">{attempt.typeName}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm ml-auto">
                    Similarity: {attempt.feedback?.similarity}%
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">{attempt.answer}</p>
                <p className="text-gray-600 dark:text-gray-400 text-xs">{attempt.feedback?.feedback}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={resetGame}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              Play Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-900 dark:text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentAttempt = paraphraseAttempts[currentStep];
  const hints = getParaphraseHints(currentAttempt.type);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Home
          </button>
          
          <div className="flex items-center gap-4">
            <div className="text-gray-900 dark:text-white text-lg font-semibold">
              {currentStep + 1} / 3
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              {currentAttempt.typeName}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-8">
          <div 
            style={{ width: `${((currentStep + 1) / 3) * 100}%` }}
            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          {/* Challenge Info */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-gray-900 dark:text-white text-xl font-bold">{currentAttempt.typeName}</h3>
              <p className="text-gray-600 dark:text-gray-400">Paraphrase the AI-generated sentence</p>
            </div>
          </div>

          {/* Original Sentence */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
            <h4 className="text-blue-800 dark:text-blue-300 text-sm font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI-Generated Sentence:
            </h4>
            <p className="text-gray-900 dark:text-white text-lg">{originalSentence}</p>
          </div>

          {/* Hints */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
            <h5 className="text-yellow-800 dark:text-yellow-300 font-semibold mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              {currentAttempt.typeName} Tips:
            </h5>
            <ul className="text-yellow-700 dark:text-yellow-200 space-y-1 text-sm">
              {hints.map((hint, index) => (
                <li key={index}>• {hint}</li>
              ))}
            </ul>
          </div>

          {/* User Input */}
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
              Your Paraphrase:
            </label>
            <textarea
              value={currentAttempt.answer}
              onChange={(e) => updateAnswer(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
                              placeholder={`Rewrite the sentence using ${currentAttempt.typeName} method...`}
              disabled={currentAttempt.isEvaluated}
            />
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {currentAttempt.feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6"
              >
                {/* Score Header */}
                <div className={`flex items-center gap-3 p-4 rounded-t-lg border-t border-l border-r ${
                  currentAttempt.feedback.correct 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                }`}>
                  <div className="flex-shrink-0">
                    {currentAttempt.feedback.correct ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className={`font-semibold ${currentAttempt.feedback.correct ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                      AI Evaluation
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Score: {currentAttempt.feedback.similarity}/100
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    currentAttempt.feedback.correct 
                      ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200' 
                      : 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200'
                  }`}>
                    {currentAttempt.feedback.correct ? 'Passed' : 'Needs Work'}
                  </div>
                </div>

                {/* Feedback Content */}
                <div className="bg-white dark:bg-gray-800 border-l border-r border-gray-200 dark:border-gray-600 p-4">
                  <div className="space-y-3">
                    {currentAttempt.feedback.feedback.split('\n').filter(line => line.trim()).map((paragraph, index) => {
                      // Clean and format the text
                      let cleanText = paragraph.trim();
                      
                      // Remove stars and markdown formatting
                      cleanText = cleanText.replace(/\*+/g, '');
                      cleanText = cleanText.replace(/^#+\s*/g, '');
                      cleanText = cleanText.replace(/^-+\s*/g, '');
                      
                      // Skip empty lines or separator lines
                      if (!cleanText || cleanText.match(/^-+$/) || cleanText.length < 3) {
                        return null;
                      }

                      // Check if it's a header (contains common header words)
                      const isHeader = cleanText.match(/^(TASK ACHIEVEMENT|ORGANIZATION|CONTENT|LANGUAGE|OVERALL|FEEDBACK|EVALUATION|SCORE)/i);
                      
                      if (isHeader) {
                        return (
                          <div key={index} className="border-l-4 border-blue-400 pl-3 py-2 bg-blue-50 dark:bg-blue-900/20">
                            <h4 className="font-semibold text-blue-800 dark:text-blue-300 text-sm uppercase tracking-wide">
                              {cleanText}
                            </h4>
                          </div>
                        );
                      }

                      // Regular paragraph
                      return (
                        <div key={index} className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed pl-4">
                          {cleanText}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Suggestion */}
                {currentAttempt.feedback.suggestion && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-b-lg p-4">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-yellow-800 dark:text-yellow-300 text-sm mb-1">
                          Suggestion
                        </div>
                        <div className="text-yellow-700 dark:text-yellow-200 text-sm">
                          {currentAttempt.feedback.suggestion.replace(/\*+/g, '')}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex gap-4">
            {!currentAttempt.isEvaluated ? (
              <button
                onClick={evaluateCurrentAttempt}
                disabled={!currentAttempt.answer.trim() || isEvaluating}
                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                              {isEvaluating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  AI Evaluating...
                </>
              ) : (
                <>
                  <MessageCircle className="w-5 h-5" />
                  Evaluate with AI
                </>
              )}
              </button>
            ) : (
              <button
                onClick={goToNextStep}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {currentStep < 2 ? (
                  <>
                    <ArrowLeft className="w-5 h-5 rotate-180" />
                    Next Type
                  </>
                ) : (
                  <>
                    <Trophy className="w-5 h-5" />
                    View Results
                  </>
                )}
              </button>
            )}
            
            {currentAttempt.isEvaluated && (
              <button
                onClick={() => {
                  const updatedAttempts = [...paraphraseAttempts];
                  updatedAttempts[currentStep] = {
                    ...updatedAttempts[currentStep],
                    answer: '',
                    feedback: undefined,
                    isEvaluated: false
                  };
                  setParaphraseAttempts(updatedAttempts);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParaphrasePage;