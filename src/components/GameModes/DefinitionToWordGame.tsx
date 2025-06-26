import React, { useState, useEffect, useRef } from 'react';
import { newDetailedWords_part1 as foundationWords } from '../../data/word1';
import { newDetailedWords_part1 as preIntermediateWords } from '../../data/word2';
import { detailedWords_part1 as upperIntermediateWords } from '../../data/word4';
import { newDetailedWords_part1 as intermediateWords } from '../../data/words';
import { WordDetail } from '../../data/words';
import { CheckCircle, RefreshCw, Loader2 } from 'lucide-react';
import { getDefinitionsForWords } from '../../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';

// Tüm kelimeleri birleştir
const allWords: WordDetail[] = [
  ...foundationWords,
  ...preIntermediateWords,
  ...upperIntermediateWords,
  ...intermediateWords,
];

function getRandomElements<T>(arr: T[], n: number, exclude?: T[]): T[] {
  const result: T[] = [];
  const source = arr.filter(item => !(exclude && exclude.includes(item)));
  const usedIndices = new Set<number>();
  
  while (result.length < n && result.length < source.length) {
    const index = Math.floor(Math.random() * source.length);
    if (!usedIndices.has(index)) {
      result.push(source[index]);
      usedIndices.add(index);
    }
  }
  return result;
}

function generateDefinitionQuestions(batch: WordDetail[], definitions: Record<string, string>) {
  return batch.map(word => {
    const definition = definitions[word.headword];
    const wrongWords = getRandomElements(allWords, 3, [word]);
    const options = [word.headword, ...wrongWords.map(w => w.headword)].sort(() => Math.random() - 0.5);
    return {
      definition: definition || `Definition for "${word.headword}" could not be loaded.`,
      correct: word.headword,
      options,
      turkish: word.turkish,
    };
  });
}

export const DefinitionToWordGame: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [remainingWords, setRemainingWords] = useState<WordDetail[]>([]);
  const [totalAsked, setTotalAsked] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const gameInitialized = useRef(false);
  
  const BATCH_SIZE = 10;

  const startBatch = async (wordsPool: WordDetail[]) => {
    setLoading(true);
    const batch = wordsPool.slice(0, BATCH_SIZE);
    
    if (batch.length === 0) {
        setFinished(true);
        setLoading(false);
        return;
    }

    const headwords = batch.map(w => w.headword);
    const definitions = await getDefinitionsForWords(headwords);
    
    setQuestions(generateDefinitionQuestions(batch, definitions));
    setCurrent(0);
    setSelected(null);
    setIsCorrect(null);
    setScore(0);
    setFinished(false);
    setLoading(false);
  };

  useEffect(() => {
    if (gameInitialized.current === false) {
      const shuffled = [...allWords].sort(() => 0.5 - Math.random());
      setRemainingWords(shuffled);
      setTotalAsked(0);
      setTotalScore(0);
      startBatch(shuffled);
      gameInitialized.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nextBatch = async () => {
    const newPool = remainingWords.slice(BATCH_SIZE);
    setRemainingWords(newPool);
    setTotalAsked(prev => prev + questions.length);
    setTotalScore(prev => prev + score);
    if (newPool.length === 0) {
      setFinished(true);
      setQuestions([]);
      setLoading(false);
    } else {
      await startBatch(newPool);
    }
  };

  const handleSelect = (option: string) => {
    if (selected) return;
    setSelected(option);
    const correct = option === questions[current].correct;
    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent(c => c + 1);
        setSelected(null);
        setIsCorrect(null);
      } else {
        nextBatch();
      }
    }, 1500);
  };

  const handleRestart = () => {
    gameInitialized.current = false; // Oyunu yeniden başlatmaya izin ver
    const shuffled = [...allWords].sort(() => 0.5 - Math.random());
    setRemainingWords(shuffled);
    setTotalAsked(0);
    setTotalScore(0);
    startBatch(shuffled);
  };

  if (loading && questions.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white">
        <Loader2 className="w-12 h-12 animate-spin text-cyan-400" />
        <p className="mt-4 text-lg">Preparing definitions...</p>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md mx-auto bg-gray-800 rounded-2xl shadow-lg p-8 text-center"
        >
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Congratulations!</h2>
            <p className="text-lg text-gray-300 mb-6">You have completed all the words.</p>
            <p className="text-2xl font-bold text-cyan-400 mb-8">Final Score: {totalScore + score} / {totalAsked + questions.length}</p>
            <button 
                onClick={handleRestart} 
                className="w-full px-6 py-4 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700 transition-colors text-lg"
            >
                Play Again
            </button>
        </motion.div>
      </div>
    );
  }
  
  if (questions.length === 0) {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white">
            <Loader2 className="w-12 h-12 animate-spin text-cyan-400" />
            <p className="mt-4 text-lg">Loading next batch...</p>
        </div>
    );
  }

  const q = questions[current];

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-gray-800 rounded-2xl shadow-2xl p-8 text-white">
        <div className="relative mb-6">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <p className="text-gray-400 text-md mb-2">Which word has this definition?</p>
                    <p className="text-2xl font-semibold text-cyan-400 min-h-[100px]">{q.definition}</p>
                    <p className="text-gray-500 text-sm mt-2">Hint (Turkish): {q.turkish}</p>
                </motion.div>
            </AnimatePresence>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {q.options.map((option: string, i: number) => (
            <motion.button
              key={i}
              onClick={() => handleSelect(option)}
              disabled={!!selected}
              className={`p-4 rounded-lg font-semibold border-2 transition-all duration-300 text-lg
                ${selected === null 
                    ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-cyan-500' 
                    : option === q.correct 
                        ? 'bg-green-500/20 border-green-500 scale-105' 
                        : selected === option 
                            ? 'bg-red-500/20 border-red-500' 
                            : 'bg-gray-700 border-gray-600 opacity-50'
                }
              `}
            >
              {option}
            </motion.button>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6 text-gray-400">
          <div className="text-sm">Question {current + 1} of {questions.length}</div>
          <div className="text-sm">Score: {score}</div>
        </div>

        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
            <div className="bg-cyan-500 h-2.5 rounded-full" style={{width: `${((current + 1) / questions.length) * 100}%`}}></div>
        </div>

        <div className="text-right text-xs text-gray-500 mt-2">
            Remaining Words: {Math.max(0, remainingWords.length - BATCH_SIZE)}
        </div>
      </div>
    </div>
  );
}; 