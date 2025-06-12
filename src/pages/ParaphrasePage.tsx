import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, Target, CheckCircle, XCircle, Lightbulb, RefreshCw, Trophy } from 'lucide-react';
import { WordDetail } from '../data/words';
import { newDetailedWords_part1 } from '../data/words';
import { detailedWords_part1 as upperIntermediateWordsRaw } from '../data/word4';

interface ParaphraseChallenge {
  id: number;
  originalSentence: string;
  targetStyle: string;
  hints: string[];
  possibleAnswers: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

const ParaphrasePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const unit = searchParams.get('unit') || '1';
  const level = searchParams.get('level') || 'intermediate';
  
  const [currentChallenge, setCurrentChallenge] = useState<ParaphraseChallenge | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [challengeIndex, setChallengeIndex] = useState(0);

  // Kelime verilerini al
  const words: WordDetail[] = level === 'upper-intermediate' 
    ? upperIntermediateWordsRaw.filter(word => word.unit === unit)
    : newDetailedWords_part1.filter(word => word.unit === unit);

  // Paraphrase challenge'ları oluştur
  const generateChallenges = (): ParaphraseChallenge[] => {
    const selectedWords = words.slice(0, 5); // İlk 5 kelimeyi al
    
    return selectedWords.map((word, index) => ({
      id: index + 1,
      originalSentence: `The research demonstrates that ${word.headword} is crucial for academic success.`,
      targetStyle: index % 3 === 0 ? 'Parantez içi alıntı' : index % 3 === 1 ? 'Fiil ile anlatımsal alıntı' : 'According to ile anlatımsal alıntı',
      hints: [
        `"${word.headword}" kelimesini kullanın`,
        `${word.turkish} anlamına gelir`,
        `Kelime formları: ${Object.values(word.forms).flat().join(', ')}`
      ],
      possibleAnswers: [
        `According to research, ${word.headword} is crucial for academic success.`,
        `Research shows that ${word.headword} is crucial for academic success.`,
        `Studies indicate that ${word.headword} is crucial for academic success.`
      ],
      difficulty: index < 2 ? 'easy' : index < 4 ? 'medium' : 'hard'
    }));
  };

  const [challenges] = useState<ParaphraseChallenge[]>(generateChallenges());

  const startGame = () => {
    setGameStarted(true);
    setCurrentChallenge(challenges[0]);
    setChallengeIndex(0);
    setScore(0);
    setTotalAttempts(0);
  };

  const checkAnswer = () => {
    if (!currentChallenge || !userAnswer.trim()) return;

    setTotalAttempts(prev => prev + 1);
    
    // Basit kontrol - kelime içeriyor mu ve mantıklı mı
    const isCorrect = currentChallenge.possibleAnswers.some(answer => 
      userAnswer.toLowerCase().includes(answer.toLowerCase().split(' ').slice(0, 3).join(' '))
    ) || userAnswer.toLowerCase().includes('according to') || userAnswer.toLowerCase().includes('research shows');

    if (isCorrect) {
      setFeedback('correct');
      setScore(prev => prev + 1);
      setTimeout(() => {
        nextChallenge();
      }, 2000);
    } else {
      setFeedback('incorrect');
      setTimeout(() => {
        setFeedback(null);
      }, 2000);
    }
  };

  const nextChallenge = () => {
    if (challengeIndex < challenges.length - 1) {
      setChallengeIndex(prev => prev + 1);
      setCurrentChallenge(challenges[challengeIndex + 1]);
      setUserAnswer('');
      setFeedback(null);
      setShowHints(false);
    } else {
      setShowResult(true);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setShowResult(false);
    setCurrentChallenge(null);
    setUserAnswer('');
    setFeedback(null);
    setScore(0);
    setTotalAttempts(0);
    setChallengeIndex(0);
    setShowHints(false);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-2xl w-full text-center border border-white/20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <BookOpen className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-4xl font-bold text-white mb-4">Paraphrase Challenge</h1>
          <p className="text-purple-200 text-lg mb-6">
            Akademik cümleleri farklı şekillerde yeniden ifade etmeyi öğrenin
          </p>
          
          <div className="bg-white/5 rounded-2xl p-6 mb-8 text-left">
            <h3 className="text-white font-semibold mb-3">Nasıl Oynanır:</h3>
            <ul className="text-purple-200 space-y-2">
              <li>• Verilen cümleyi farklı bir şekilde yeniden yazın</li>
              <li>• Parantez içi alıntı, fiil ile anlatımsal alıntı kullanın</li>
              <li>• İpuçları için 💡 butonuna tıklayın</li>
              <li>• {challenges.length} farklı challenge'ı tamamlayın</li>
            </ul>
          </div>

          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{challenges.length}</div>
              <div className="text-purple-300 text-sm">Challenge</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{words.length}</div>
              <div className="text-purple-300 text-sm">Kelime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{level === 'intermediate' ? 'Int' : 'Up-Int'}</div>
              <div className="text-purple-300 text-sm">Seviye</div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-8 rounded-2xl text-xl font-bold shadow-lg hover:shadow-purple-500/25 transition-all"
          >
            Oyuna Başla
          </motion.button>

          <button
            onClick={() => navigate('/')}
            className="mt-4 flex items-center justify-center gap-2 text-purple-300 hover:text-white transition-colors mx-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            Ana Sayfaya Dön
          </button>
        </motion.div>
      </div>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / challenges.length) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
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

          <h2 className="text-4xl font-bold text-white mb-4">Tebrikler!</h2>
          <p className="text-purple-200 text-lg mb-8">Paraphrase Challenge'ı tamamladınız</p>

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
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-2xl font-bold"
            >
              Tekrar Oyna
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="flex-1 bg-white/10 text-white py-3 px-6 rounded-2xl font-bold border border-white/20"
            >
              Ana Sayfa
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Ana Sayfa
          </button>
          
          <div className="flex items-center gap-4">
            <div className="text-white text-lg font-semibold">
              {challengeIndex + 1} / {challenges.length}
            </div>
            <div className="text-purple-300">
              Skor: {score}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/10 rounded-full h-2 mb-8">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${((challengeIndex + 1) / challenges.length) * 100}%` }}
            className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-500"
          />
        </div>

        {currentChallenge && (
          <motion.div
            key={currentChallenge.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20"
          >
            {/* Challenge Info */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white text-xl font-bold">Challenge {currentChallenge.id}</h3>
                <p className="text-purple-300">{currentChallenge.targetStyle}</p>
              </div>
            </div>

            {/* Original Sentence */}
            <div className="bg-white/5 rounded-2xl p-6 mb-6">
              <h4 className="text-purple-300 text-sm font-semibold mb-2">Orijinal Cümle:</h4>
              <p className="text-white text-lg leading-relaxed">{currentChallenge.originalSentence}</p>
            </div>

            {/* User Input */}
            <div className="mb-6">
              <label className="block text-purple-300 text-sm font-semibold mb-2">
                Yeniden İfade Edin:
              </label>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                rows={3}
                placeholder="Cümleyi farklı bir şekilde yazın..."
              />
            </div>

            {/* Hints */}
            <AnimatePresence>
              {showHints && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 mb-6"
                >
                  <h5 className="text-yellow-300 font-semibold mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    İpuçları:
                  </h5>
                  <ul className="text-yellow-200 space-y-1">
                    {currentChallenge.hints.map((hint, index) => (
                      <li key={index}>• {hint}</li>
                    ))}
                  </ul>
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
                  <span className={feedback === 'correct' ? 'text-green-300' : 'text-red-300'}>
                    {feedback === 'correct' ? 'Harika! Doğru cevap.' : 'Tekrar deneyin. İpuçlarına bakabilirsiniz.'}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowHints(!showHints)}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-2xl border border-white/20 hover:bg-white/20 transition-all"
              >
                <Lightbulb className="w-5 h-5" />
                İpuçları
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={checkAnswer}
                disabled={!userAnswer.trim() || feedback === 'correct'}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Kontrol Et
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ParaphrasePage;