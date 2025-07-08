import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, RefreshCw, ChevronLeft, ChevronRight, Trophy, Sparkles } from 'lucide-react';
import { WordDetail } from '../../data/words';

interface DefinitionToWordGameV2Props {
  words: WordDetail[];
}

type Theme = 'blue' | 'pink' | 'dark';

const getThemeClasses = (theme: Theme) => {
  switch (theme) {
    case 'blue':
      return {
        bg: 'bg-gradient-to-br from-sky-100 to-blue-200',
        card: 'bg-white/80',
        text: 'text-blue-900',
        header: 'text-blue-700',
        button: 'bg-blue-500 hover:bg-blue-600 text-white',
        buttonWrong: 'bg-red-500 text-white',
        buttonCorrect: 'bg-green-500 text-white',
        progress: 'bg-blue-500',
      };
    case 'pink':
      return {
        bg: 'bg-gradient-to-br from-rose-100 to-pink-200',
        card: 'bg-white/80',
        text: 'text-pink-900',
        header: 'text-pink-700',
        button: 'bg-pink-500 hover:bg-pink-600 text-white',
        buttonWrong: 'bg-red-500 text-white',
        buttonCorrect: 'bg-green-500 text-white',
        progress: 'bg-pink-500',
      };
    default:
      return {
        bg: 'bg-gradient-to-br from-gray-900 to-black',
        card: 'bg-gray-900/80',
        text: 'text-gray-100',
        header: 'text-cyan-400',
        button: 'bg-cyan-500 hover:bg-cyan-600 text-white',
        buttonWrong: 'bg-red-600 text-white',
        buttonCorrect: 'bg-green-600 text-white',
        progress: 'bg-cyan-500',
      };
  }
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const DefinitionToWordGameV2: React.FC<DefinitionToWordGameV2Props> = ({ words }) => {
  const [theme, setTheme] = useState<Theme>('blue');
  const [questions, setQuestions] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const themeClasses = getThemeClasses(theme);

  // Soru ve şıklar hazırla
  useEffect(() => {
    if (words.length === 0) return;
    const qs = shuffle(words).map((w, idx, arr) => {
      const wrongs = shuffle(arr.filter(x => x.headword !== w.headword)).slice(0, 3).map(x => x.headword);
      const options = shuffle([w.headword, ...wrongs]);
      return {
        definition: w.turkish || '',
        correct: w.headword,
        options,
        turkish: w.turkish,
      };
    });
    setQuestions(qs);
    setCurrent(0);
    setSelected(null);
    setIsCorrect(null);
    setScore(0);
    setShowFeedback(false);
    setGameOver(false);
    window.scrollTo(0, 0);
  }, [words]);

  const handleSelect = (option: string) => {
    if (selected !== null) return;
    setSelected(option);
    const correct = option === questions[current].correct;
    setIsCorrect(correct);
    setShowFeedback(true);
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      setShowFeedback(false);
      if (current < questions.length - 1) {
        setCurrent(c => c + 1);
        setSelected(null);
        setIsCorrect(null);
      } else {
        setGameOver(true);
      }
    }, 1200);
  };

  const handleRestart = () => {
    setQuestions([]);
    setCurrent(0);
    setSelected(null);
    setIsCorrect(null);
    setScore(0);
    setShowFeedback(false);
    setGameOver(false);
    // Soruları tekrar hazırla
    const qs = shuffle(words).map((w, idx, arr) => {
      const wrongs = shuffle(arr.filter(x => x.headword !== w.headword)).slice(0, 3).map(x => x.headword);
      const options = shuffle([w.headword, ...wrongs]);
      return {
        definition: w.turkish || '',
        correct: w.headword,
        options,
        turkish: w.turkish,
      };
    });
    setQuestions(qs);
    window.scrollTo(0, 0);
  };

  if (words.length === 0) {
    return <div className="flex items-center justify-center min-h-[60vh] text-xl text-gray-400">Kelime bulunamadı.</div>;
  }

  if (questions.length === 0) {
    return <div className="flex items-center justify-center min-h-[60vh] text-xl text-gray-400">Sorular hazırlanıyor...</div>;
  }

  if (gameOver) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${themeClasses.bg}`}>
        <div className={`max-w-md w-full rounded-2xl shadow-2xl p-8 text-center ${themeClasses.card}`}>
          <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
          <h2 className={`text-3xl font-bold mb-2 ${themeClasses.header}`}>Oyun Bitti!</h2>
          <p className={`text-lg mb-6 ${themeClasses.text}`}>Skorun: <span className="font-bold">{score} / {questions.length}</span></p>
          <button onClick={handleRestart} className={`w-full py-3 rounded-lg font-semibold mt-2 ${themeClasses.button}`}>Yeniden Oyna</button>
        </div>
        <div className="flex gap-2 mt-6">
          <button onClick={() => setTheme('blue')} className={`w-8 h-8 rounded-full bg-blue-500 ${theme === 'blue' ? 'ring-2 ring-blue-500' : ''}`}></button>
          <button onClick={() => setTheme('pink')} className={`w-8 h-8 rounded-full bg-pink-500 ${theme === 'pink' ? 'ring-2 ring-pink-500' : ''}`}></button>
          <button onClick={() => setTheme('dark')} className={`w-8 h-8 rounded-full bg-gray-900 border border-gray-600 ${theme === 'dark' ? 'ring-2 ring-cyan-400' : ''}`}></button>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-2 ${themeClasses.bg}`}>
      <div className="w-full max-w-md mx-auto rounded-2xl shadow-2xl p-4 md:p-8 mt-6 mb-6 flex flex-col gap-6 items-center justify-center" style={{ background: 'rgba(255,255,255,0.7)' }}>
        <div className="flex justify-between items-center w-full mb-2">
          <h2 className={`text-xl font-bold ${themeClasses.header}`}>Tanımdan Kelime</h2>
          <div className="flex gap-2">
            <button onClick={() => setTheme('blue')} className={`w-6 h-6 rounded-full bg-blue-500 ${theme === 'blue' ? 'ring-2 ring-blue-500' : ''}`}></button>
            <button onClick={() => setTheme('pink')} className={`w-6 h-6 rounded-full bg-pink-500 ${theme === 'pink' ? 'ring-2 ring-pink-500' : ''}`}></button>
            <button onClick={() => setTheme('dark')} className={`w-6 h-6 rounded-full bg-gray-900 border border-gray-600 ${theme === 'dark' ? 'ring-2 ring-cyan-400' : ''}`}></button>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div className={`${themeClasses.progress} h-2 rounded-full transition-all duration-300`} style={{ width: `${progress}%` }} />
        </div>
        <div className={`w-full rounded-xl p-4 mb-2 shadow ${themeClasses.card} flex flex-col gap-2`}>
          <div className={`text-base md:text-lg font-semibold mb-2 ${themeClasses.text}`}>{q.definition}</div>
        </div>
        <div className="grid grid-cols-1 gap-3 w-full">
          {q.options.map((option: string, i: number) => {
            let btnClass = themeClasses.button;
            if (selected !== null) {
              if (option === q.correct) btnClass = themeClasses.buttonCorrect;
              else if (option === selected) btnClass = themeClasses.buttonWrong;
              else btnClass += ' opacity-40';
            }
            return (
              <motion.button
                key={option}
                onClick={() => handleSelect(option)}
                disabled={selected !== null}
                className={`w-full py-3 rounded-lg font-semibold text-lg transition-all duration-200 shadow ${btnClass}`}
                whileHover={{ scale: selected === null ? 1.03 : 1 }}
                whileTap={{ scale: selected === null ? 0.97 : 1 }}
              >
                {option}
              </motion.button>
            );
          })}
        </div>
        <div className="flex justify-between items-center w-full mt-4">
          <button onClick={handleRestart} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm ${themeClasses.button}`}><RefreshCw className="w-4 h-4" /> Yeniden</button>
          <div className={`text-sm font-bold ${themeClasses.text}`}>{current + 1} / {questions.length}</div>
        </div>
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`w-full flex items-center justify-center gap-2 mt-2 p-3 rounded-lg font-semibold text-lg ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
            >
              {isCorrect ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
              {isCorrect ? 'Doğru!' : 'Yanlış'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}; 