import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WordDetail } from '../../data/word4';
import { BookOpen, Target, CheckCircle, XCircle, Lightbulb, RefreshCw, Trophy, Clock, Zap } from 'lucide-react';

interface WordFormsGameProps {
  words: WordDetail[];
}

interface WordChallenge {
  id: number;
  word: WordDetail;
  targetForm: keyof WordDetail['forms'];
  sentence: string;
  blankPosition: number;
  correctAnswers: string[];
  hint: string;
}

const FORM_NAMES = {
  verb: 'Fiil',
  noun: 'İsim', 
  adjective: 'Sıfat',
  adverb: 'Zarf'
};

const FORM_COLORS = {
  verb: 'from-blue-500 to-cyan-500',
  noun: 'from-green-500 to-emerald-500',
  adjective: 'from-purple-500 to-pink-500',
  adverb: 'from-orange-500 to-red-500'
};

export const WordFormsGame: React.FC<WordFormsGameProps> = ({ words }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [challenges, setChallenges] = useState<WordChallenge[]>([]);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const generateChallenges = useCallback((): WordChallenge[] => {
    const shuffledWords = [...words].sort(() => 0.5 - Math.random()).slice(0, 8);
    
    return shuffledWords.map((word, index) => {
      // Mevcut formları kontrol et
      const availableForms = Object.entries(word.forms)
        .filter(([_, forms]) => forms.length > 0)
        .map(([form, _]) => form as keyof WordDetail['forms']);
      
      if (availableForms.length === 0) return null;
      
      const targetForm = availableForms[Math.floor(Math.random() * availableForms.length)];
      const correctAnswers = word.forms[targetForm];
      
      // Cümle şablonları
      const sentenceTemplates = {
        verb: [
          `Students must _____ their assignments on time.`,
          `The teacher will _____ the lesson tomorrow.`,
          `We need to _____ this problem carefully.`
        ],
        noun: [
          `The _____ of this research is very important.`,
          `This _____ will help us understand better.`,
          `The main _____ is clearly explained.`
        ],
        adjective: [
          `The results were very _____ for our study.`,
          `This method is more _____ than others.`,
          `The _____ approach works better.`
        ],
        adverb: [
          `The students worked _____ on their project.`,
          `She explained the concept _____.`,
          `The data was analyzed _____.`
        ]
      };
      
      const templates = sentenceTemplates[targetForm];
      const sentence = templates[Math.floor(Math.random() * templates.length)];
      
      return {
        id: index + 1,
        word,
        targetForm,
        sentence,
        blankPosition: sentence.indexOf('_____'),
        correctAnswers,
        hint: `"${word.headword}" kelimesinin ${FORM_NAMES[targetForm]} hali (${word.turkish})`
      };
    }).filter(Boolean) as WordChallenge[];
  }, [words]);

  const startGame = () => {
    const newChallenges = generateChallenges();
    setChallenges(newChallenges);
    setCurrentChallengeIndex(0);
    setScore(0);
    setGameStarted(true);
    setGameCompleted(false);
    setTimeLeft(30);
    setTimerActive(true);
    setUserAnswer('');
    setFeedback(null);
    setShowHint(false);
  };

  const handleTimeUp = () => {
    setTimerActive(false);
    setFeedback('incorrect');
    setTimeout(() => {
      nextChallenge();
    }, 1500);
  };

  const checkAnswer = () => {
    if (!userAnswer.trim()) return;
    
    setTimerActive(false);
    const currentChallenge = challenges[currentChallengeIndex];
    const isCorrect = currentChallenge.correctAnswers.some(
      answer => answer.toLowerCase() === userAnswer.toLowerCase().trim()
    );

    if (isCorrect) {
      setFeedback('correct');
      setScore(prev => prev + 1);
      setTimeout(() => {
        nextChallenge();
      }, 1500);
    } else {
      setFeedback('incorrect');
      setTimeout(() => {
        nextChallenge();
      }, 2000);
    }
  };

  const nextChallenge = () => {
    if (currentChallengeIndex < challenges.length - 1) {
      setCurrentChallengeIndex(prev => prev + 1);
      setUserAnswer('');
      setFeedback(null);
      setShowHint(false);
      setTimeLeft(30);
      setTimerActive(true);
    } else {
      setGameCompleted(true);
      setTimerActive(false);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameCompleted(false);
    setCurrentChallengeIndex(0);
    setScore(0);
    setUserAnswer('');
    setFeedback(null);
    setShowHint(false);
    setTimerActive(false);
    setTimeLeft(30);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-2xl w-full text-center border border-white/20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Zap className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-4xl font-bold text-white mb-4">Word Forms Challenge</h1>
          <p className="text-purple-200 text-lg mb-6">
            Kelimelerin doğru formlarını kullanarak cümleleri tamamlayın
          </p>
          
          <div className="bg-white/5 rounded-2xl p-6 mb-8 text-left">
            <h3 className="text-white font-semibold mb-3">Nasıl Oynanır:</h3>
            <ul className="text-purple-200 space-y-2">
              <li>• Cümledeki boşluğu doğru kelime formuyla doldurun</li>
              <li>• Her soru için 30 saniye süreniz var</li>
              <li>• İpuçları için 💡 butonuna tıklayın</li>
              <li>• Fiil, isim, sıfat ve zarf formlarını kullanın</li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/5 rounded-2xl p-4">
              <div className="text-2xl font-bold text-white">{words.length}</div>
              <div className="text-purple-300 text-sm">Kelime Havuzu</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-4">
              <div className="text-2xl font-bold text-white">8</div>
              <div className="text-purple-300 text-sm">Challenge</div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-4 px-8 rounded-2xl text-xl font-bold shadow-lg hover:shadow-purple-500/25 transition-all"
          >
            Oyuna Başla
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (gameCompleted) {
    const percentage = Math.round((score / challenges.length) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-2xl w-full text-center border border-white/20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Trophy className="w-12 h-12 text-white" />
          </motion.div>

          <h2 className="text-4xl font-bold text-white mb-4">Harika!</h2>
          <p className="text-purple-200 text-lg mb-8">Word Forms Challenge'ı tamamladınız</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white/5 rounded-2xl p-4">
              <div className="text-3xl font-bold text-white">{score}</div>
              <div className="text-purple-300">Doğru</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-4">
              <div className="text-3xl font-bold text-white">{challenges.length}</div>
              <div className="text-purple-300">Toplam</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-4">
              <div className="text-3xl font-bold text-white">%{percentage}</div>
              <div className="text-purple-300">Başarı</div>
            </div>
          </div>

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetGame}
              className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-6 rounded-2xl font-bold"
            >
              Tekrar Oyna
            </motion.button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-purple-300 text-sm">powered by mirac</p>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentChallenge = challenges[currentChallengeIndex];
  if (!currentChallenge) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="text-white text-lg font-semibold">
              {currentChallengeIndex + 1} / {challenges.length}
            </div>
            <div className="text-purple-300">
              Skor: {score}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-white" />
            <div className={`text-xl font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>
              {timeLeft}s
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/10 rounded-full h-2 mb-8">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${((currentChallengeIndex + 1) / challenges.length) * 100}%` }}
            className="bg-gradient-to-r from-indigo-400 to-purple-400 h-2 rounded-full transition-all duration-500"
          />
        </div>

        {/* Timer Bar */}
        <div className="w-full bg-white/10 rounded-full h-1 mb-8">
          <motion.div 
            animate={{ width: `${(timeLeft / 30) * 100}%` }}
            className={`h-1 rounded-full transition-all duration-1000 ${
              timeLeft <= 10 ? 'bg-red-400' : 'bg-green-400'
            }`}
          />
        </div>

        <motion.div
          key={currentChallenge.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20"
        >
          {/* Challenge Info */}
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-12 h-12 bg-gradient-to-br ${FORM_COLORS[currentChallenge.targetForm]} rounded-full flex items-center justify-center`}>
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white text-xl font-bold">Challenge {currentChallenge.id}</h3>
              <p className="text-purple-300">{FORM_NAMES[currentChallenge.targetForm]} formu gerekli</p>
            </div>
          </div>

          {/* Word Info */}
          <div className="bg-white/5 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white text-lg font-semibold">{currentChallenge.word.headword}</h4>
                <p className="text-purple-300">{currentChallenge.word.turkish}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${FORM_COLORS[currentChallenge.targetForm]} text-white`}>
                {FORM_NAMES[currentChallenge.targetForm]}
              </div>
            </div>
          </div>

          {/* Sentence */}
          <div className="bg-white/5 rounded-2xl p-6 mb-6">
            <h4 className="text-purple-300 text-sm font-semibold mb-3">Cümleyi Tamamlayın:</h4>
            <div className="text-white text-xl leading-relaxed">
              {currentChallenge.sentence.split('_____').map((part, index) => (
                <span key={index}>
                  {part}
                  {index < currentChallenge.sentence.split('_____').length - 1 && (
                    <span className="inline-block mx-2 px-4 py-2 bg-white/20 rounded-lg border-2 border-dashed border-white/40 min-w-[120px] text-center">
                      {userAnswer || '?'}
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* User Input */}
          <div className="mb-6">
            <label className="block text-purple-300 text-sm font-semibold mb-2">
              Cevabınız:
            </label>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
              className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 text-lg"
              placeholder="Kelimeyi buraya yazın..."
              disabled={feedback !== null}
            />
          </div>

          {/* Hint */}
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 mb-6"
              >
                <h5 className="text-yellow-300 font-semibold mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  İpucu:
                </h5>
                <p className="text-yellow-200">{currentChallenge.hint}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Feedback */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex items-center gap-3 p-4 rounded-2xl mb-6 ${
                  feedback === 'correct' 
                    ? 'bg-green-500/10 border border-green-500/20' 
                    : 'bg-red-500/10 border border-red-500/20'
                }`}
              >
                {feedback === 'correct' ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400" />
                )}
                <div>
                  <span className={feedback === 'correct' ? 'text-green-300' : 'text-red-300'}>
                    {feedback === 'correct' ? 'Mükemmel! Doğru cevap.' : 'Yanlış cevap.'}
                  </span>
                  {feedback === 'incorrect' && (
                    <div className="text-red-200 text-sm mt-1">
                      Doğru cevap: {currentChallenge.correctAnswers.join(' veya ')}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-2xl border border-white/20 hover:bg-white/20 transition-all"
              disabled={feedback !== null}
            >
              <Lightbulb className="w-5 h-5" />
              İpucu
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={checkAnswer}
              disabled={!userAnswer.trim() || feedback !== null}
              className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-6 rounded-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Kontrol Et
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}; 