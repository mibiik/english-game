import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { GeminiService } from '../../services/geminiService';
import { newDetailedWords_part1 as intermediateWords, WordDetail } from '../../data/words';
import { detailedWords_part1 as upperIntermediateWords } from '../../data/word4';

const geminiService = GeminiService.getInstance();

const WordFormsGame: React.FC = () => {
  const [searchParams] = useSearchParams();
  const unit = searchParams.get('unit') || '1';
  const level = searchParams.get('level') || 'intermediate';

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paragraph, setParagraph] = useState<string>('');
  const [solutions, setSolutions] = useState<Record<string, string>>({});
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, 'correct' | 'incorrect' | 'unanswered'>>({});
  const [isChecked, setIsChecked] = useState(false);
  
  const wordSource = useMemo(() => {
    return level === 'intermediate' ? intermediateWords : upperIntermediateWords;
  }, [level]);

  const fetchGameData = async () => {
    setIsLoading(true);
    setError(null);
    setIsChecked(false);
    setParagraph('');
    setSolutions({});
    setUserAnswers({});
    setFeedback({});

    try {
      const unitWords = wordSource.filter(w => w.unit === unit);
      if (unitWords.length < 10) {
        throw new Error(`Unit ${unit} does not have enough words for this game.`);
      }
      
      const selectedWords = [...unitWords].sort(() => 0.5 - Math.random()).slice(0, 10);
      const headwords = selectedWords.map(w => w.headword);
      
      const { paragraph: newParagraph, solutions: newSolutions } = await geminiService.generateWordFormsParagraph(headwords);

      if (!newParagraph || Object.keys(newSolutions).length === 0) {
        throw new Error('Failed to generate a valid paragraph from the AI service.');
      }
      
      setParagraph(newParagraph);
      setSolutions(newSolutions);

      const initialAnswers: Record<string, string> = {};
      const initialFeedback: Record<string, 'correct' | 'incorrect' | 'unanswered'> = {};
      Object.keys(newSolutions).forEach(key => {
        initialAnswers[key] = '';
        initialFeedback[key] = 'unanswered';
      });
      setUserAnswers(initialAnswers);
      setFeedback(initialFeedback);

    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchGameData();
  }, [unit, level]);

  const handleInputChange = (headword: string, value: string) => {
    setUserAnswers(prev => ({ ...prev, [headword]: value }));
  };

  const checkAnswers = () => {
    const newFeedback: Record<string, 'correct' | 'incorrect' | 'unanswered'> = {};
    Object.keys(solutions).forEach(headword => {
      const isCorrect = userAnswers[headword]?.trim().toLowerCase() === solutions[headword]?.toLowerCase();
      newFeedback[headword] = isCorrect ? 'correct' : 'incorrect';
    });
    setFeedback(newFeedback);
    setIsChecked(true);
  };
  
  const renderParagraph = () => {
    const parts = paragraph.split(/(_______ \([^)]+\))/g);
    return parts.map((part, index) => {
      const match = part.match(/_______ \(([^)]+)\)/);
      if (match) {
        const headword = match[1];
        const feedbackStatus = feedback[headword];
        
        let borderColor = 'border-slate-300 focus:border-blue-500';
        if (isChecked) {
          borderColor = feedbackStatus === 'correct' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50';
        }

        return (
          <span key={index} className="inline-block mx-1 align-bottom">
            <input
              type="text"
              value={userAnswers[headword] || ''}
              onChange={(e) => handleInputChange(headword, e.target.value)}
              placeholder={`(${headword})`}
              aria-label={headword}
              disabled={isChecked}
              className={`w-28 sm:w-36 px-2 py-1 border-b-2 transition-colors duration-300 rounded-t-md focus:outline-none ${borderColor} text-center`}
            />
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen bg-slate-50"><Loader2 className="w-12 h-12 animate-spin text-blue-600" /></div>;
  }

  if (error) {
    return <div className="flex flex-col justify-center items-center h-screen bg-red-50 text-red-700 p-4 text-center">
      <p>{error}</p>
      <button onClick={fetchGameData} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Try Again</button>
    </div>;
  }

    return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-4 sm:p-8"
      >
        <h1 className="text-xl sm:text-3xl font-bold text-slate-800 mb-2 text-center sm:text-left">Word Forms Challenge</h1>
        <p className="text-sm sm:text-base text-slate-600 mb-6 text-center sm:text-left">Fill in the blanks with the correct form of the word in parentheses.</p>

        <div className="text-base sm:text-lg leading-relaxed sm:leading-loose text-slate-700 bg-slate-100 p-4 sm:p-6 rounded-xl border border-slate-200">
          {renderParagraph()}
          </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <motion.button
            onClick={checkAnswers}
            disabled={isChecked}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isChecked ? <CheckCircle className="w-5 h-5" /> : null}
            Check Answers
          </motion.button>
          <motion.button
            onClick={fetchGameData}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto flex-1 px-6 py-3 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            New Paragraph
            </motion.button>
        </div>

        {isChecked && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            <h3 className="font-bold mb-2">Correct Answers:</h3>
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-1">
              {Object.entries(solutions).map(([headword, solution]) => (
                <li key={headword}>
                  <span className="font-semibold">{headword}:</span> {solution}
                </li>
              ))}
            </ul>
          </div>
        )}
        </motion.div>
    </div>
  );
};

export default WordFormsGame; 