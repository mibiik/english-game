import React, { useState, useEffect } from 'react';
import { Trophy, Timer, Star, Award } from 'lucide-react';
import { Word } from '../../data/words';
import { wordTracker } from '../../data/wordTracker';

interface WordRaceProps {
  words: Word[];
  unit: string;
}

export function WordRace({ words, unit }: WordRaceProps) {
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90); // 90 saniye
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [correctWords, setCorrectWords] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [achievements, setAchievements] = useState<string[]>([]);

  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [isGameActive, timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(90);
    setCorrectWords(0);
    setCurrentStreak(0);
    setBestStreak(0);
    setGameOver(false);
    setIsGameActive(true);
    setAchievements([]);
    generateNewWord();
  };

  const endGame = () => {
    setGameOver(true);
    setIsGameActive(false);
    checkAchievements();
  };

  const generateNewWord = () => {
    wordTracker.initializeUnit(words, unit);
    const newWord = wordTracker.getNextWord(words, unit);
    if (!newWord) return;

    wordTracker.markWordAsSeen(newWord);
    setCurrentWord(newWord);
    setUserInput('');
    setShowFeedback(false);
    setIsCorrect(null);
  };

  const checkAchievements = () => {
    const newAchievements: string[] = [];
    
    if (score >= 500) newAchievements.push('Kelime Ustası');
    if (bestStreak >= 10) newAchievements.push('Kombo Kralı');
    if (correctWords >= 30) newAchievements.push('Hız Ustası');
    
    setAchievements(newAchievements);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentWord || !isGameActive) return;

    const answer = userInput.trim().toLowerCase();
    const correct = answer === currentWord.turkish.toLowerCase();

    setShowFeedback(true);
    setIsCorrect(correct);

    if (correct) {
      const newStreak = currentStreak + 1;
      const streakBonus = Math.floor(newStreak / 3) * 5;
      const timeBonus = Math.floor(timeLeft / 30) * 10;
      const points = 10 + streakBonus + timeBonus;

      setScore(prev => prev + points);
      setCorrectWords(prev => prev + 1);
      setCurrentStreak(newStreak);
      setBestStreak(prev => Math.max(prev, newStreak));

      setTimeout(() => {
        generateNewWord();
      }, 1000);
    } else {
      setCurrentStreak(0);
      setTimeout(() => {
        generateNewWord();
      }, 2000);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {!isGameActive && !gameOver && (
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold text-purple-600">Kelime Yarışması</h2>
          <p className="text-gray-600">
            90 saniye içinde ne kadar çok kelime öğrenebilirsin? Hızlı ol, doğru cevapla ve puanını katlayarak artır!
          </p>
          <button
            onClick={startGame}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl
              text-xl font-bold shadow-lg transform transition-all duration-300
              hover:scale-105 hover:shadow-xl active:scale-95"
          >
            Yarışmayı Başlat
          </button>
        </div>
      )}

      {isGameActive && currentWord && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <div className="text-3xl font-bold text-purple-600">
                {score} Puan
              </div>
              <div className="text-sm text-purple-400">
                Doğru: {correctWords} | Seri: {currentStreak} | En İyi: {bestStreak}
              </div>
            </div>
            <div className="text-2xl font-bold text-red-500 animate-pulse">
              {timeLeft}s
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-purple-100">
            <div className="text-4xl font-bold text-center mb-8
              bg-gradient-to-r from-purple-600 to-indigo-600
              text-transparent bg-clip-text animate-pulse">
              {currentWord.english}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={userInput}
                onChange={handleInputChange}
                placeholder="Türkçe karşılığını yazın..."
                className="w-full p-4 text-lg border-2 border-purple-200 rounded-xl
                  focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none
                  transition-all duration-300"
                autoFocus
              />
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500
                  text-white rounded-xl text-lg font-semibold shadow-md
                  transform transition-all duration-300
                  hover:scale-102 hover:shadow-lg active:scale-98"
              >
                Kontrol Et
              </button>
            </form>

            {showFeedback && (
              <div className={`mt-6 text-center text-lg font-medium
                ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {isCorrect
                  ? `Harika! +${10 + Math.floor(currentStreak / 3) * 5 + Math.floor(timeLeft / 30) * 10} puan kazandın!`
                  : `Yanlış! Doğru cevap: ${currentWord.turkish}`}
              </div>
            )}
          </div>
        </div>
      )}

      {gameOver && (
        <div className="bg-white p-8 rounded-xl shadow-lg border border-purple-100 space-y-6">
          <h2 className="text-3xl font-bold text-center text-purple-600 mb-6">
            Yarışma Sonu!
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">
                  <Trophy className="inline-block w-6 h-6 mr-2" />
                  Skor Detayları
                </h3>
                <p className="text-purple-700">Toplam Puan: <span className="font-bold">{score}</span></p>
                <p className="text-purple-700">En İyi Seri: <span className="font-bold">{bestStreak}</span></p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  <Timer className="inline-block w-6 h-6 mr-2" />
                  Performans
                </h3>
                <p className="text-blue-700">Doğru Kelimeler: <span className="font-bold">{correctWords}</span></p>
                <p className="text-blue-700">Kelime/Dakika: <span className="font-bold">
                  {Math.round((correctWords / 90) * 60)}
                </span></p>
              </div>
            </div>

            <div className="space-y-4">
              {achievements.length > 0 && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                    <Star className="inline-block w-6 h-6 mr-2" />
                    Başarılar
                  </h3>
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center text-yellow-700 mb-2">
                      <Award className="w-5 h-5 mr-2" />
                      {achievement}
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={startGame}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500
                  text-white rounded-xl text-lg font-semibold shadow-md
                  transform transition-all duration-300
                  hover:scale-102 hover:shadow-lg active:scale-98"
              >
                Tekrar Oyna
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}