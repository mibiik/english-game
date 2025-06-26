import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { GeminiService } from '../../services/geminiService';
import { WordDetail } from '../../data/words';
import { WordFormsQuestion } from '../../types';

const geminiService = GeminiService.getInstance();

interface WordFormsGameProps {
  words: WordDetail[];
}

const WordFormsGame: React.FC<WordFormsGameProps> = ({ words }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<WordFormsQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const gameInitialized = useRef(false);

  const fetchGameData = async () => {
    setIsLoading(true);
    setError(null);
    setIsChecked(false);
    setQuestions([]);
    
    try {
      if (words.length < 10) {
        throw new Error(`This unit requires at least 10 words for this game.`);
      }
      
      const selectedWords = [...words].sort(() => 0.5 - Math.random()).slice(0, 10);
      const headwords = selectedWords.map(w => w.headword);
      
      const newQuestions = await geminiService.generateWordFormsExercise(headwords);

      if (!newQuestions || newQuestions.length === 0) {
        throw new Error('Failed to generate a valid exercise from the AI service. Please try again.');
      }
      
      setQuestions(newQuestions);
      setUserAnswers(new Array(newQuestions.length).fill(''));

    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (gameInitialized.current === false && words.length > 0) {
        fetchGameData();
        gameInitialized.current = true;
    }
  }, [words]);

  const handleInputChange = (index: number, value: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value;
    setUserAnswers(newAnswers);
  };

  const checkAnswers = () => {
    setIsChecked(true);
  };
  
  if (isLoading) {
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-50 text-gray-800">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
            <p className="mt-4 text-lg">Generating your personalized exercise...</p>
        </div>
    );
  }

  if (error) {
    return <div className="flex flex-col justify-center items-center h-screen bg-red-50 text-red-700 p-4 text-center">
      <p className="text-xl">{error}</p>
      <button onClick={fetchGameData} className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors">
        <RefreshCw className="w-5 h-5" /> Try Again
      </button>
    </div>;
  }

    return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 flex items-center justify-center text-gray-800">
        <div className="w-full max-w-3xl">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-10"
            >
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Word Forms Challenge</h1>
                <p className="text-md sm:text-lg text-gray-600 mt-2">Complete each sentence with the correct form of the given word.</p>
            </motion.div>

            <div className="space-y-4">
                {questions.map((q, index) => {
                    const isCorrect = userAnswers[index].trim().toLowerCase() === q.solution.toLowerCase();
                    const sentenceParts = q.sentence.split('[BLANK]');
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
                        >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                               <div className="flex-1">
                                    <p className="text-gray-700 text-xl leading-relaxed">
                                       <span className="text-indigo-600 font-bold mr-3">{index + 1}.</span>
                                        {sentenceParts[0]}
                                        <span className="inline-block w-48 mx-1">
                                            <input
                                                type="text"
                                                value={userAnswers[index]}
                                                onChange={(e) => handleInputChange(index, e.target.value)}
                                                disabled={isChecked}
                                                className={`w-full bg-gray-100 border-b-2 text-gray-800 text-center text-lg p-1 focus:outline-none transition-all duration-300 rounded-t-md ${
                                                    isChecked 
                                                    ? (isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50')
                                                    : 'border-gray-300 focus:border-indigo-500 focus:bg-white'
                                                }`}
                                            />
                                        </span>
                                        {sentenceParts[1]}
                                    </p>
                                    <div className="pl-8 sm:pl-9 mt-1">
                                        <span className="text-gray-500 text-sm">
                                            (Use a form of: <strong className="font-semibold text-gray-700">{q.headword}</strong>)
                                        </span>
                                    </div>
                               </div>

                                <div className={`transition-all duration-300 ${isChecked ? 'w-32 opacity-100' : 'w-0 opacity-0'}`}>
                                    {isChecked && (
                                        <div className={`flex items-center text-md font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                            {isCorrect ? <CheckCircle className="w-6 h-6 mr-2" /> : <XCircle className="w-6 h-6 mr-2" />}
                                            <span>{isCorrect ? 'Correct' : 'Incorrect'}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                             {isChecked && !isCorrect && (
                                <motion.div 
                                    initial={{opacity: 0, y: -10}}
                                    animate={{opacity: 1, y: 0}}
                                    className="pl-8 sm:pl-9 mt-3 text-green-600 text-md"
                                >
                                    Correct answer: <strong className="font-bold">{q.solution}</strong>
                                </motion.div>
                            )}
                        </motion.div>
                    )
                })}
            </div>

            <div className="mt-12 flex justify-center gap-4">
                <motion.button
                    onClick={checkAnswers}
                    disabled={isChecked}
                    whileHover={{ scale: 1.05 }}
                    className="px-10 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all text-lg"
                >
                    Check Answers
                </motion.button>
                <motion.button
                    onClick={fetchGameData}
                    whileHover={{ scale: 1.05 }}
                    className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                >
                    <RefreshCw className="w-5 h-5" />
                </motion.button>
            </div>
        </div>
    </div>
  );
};

export default WordFormsGame; 