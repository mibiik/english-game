import React, { useState, useEffect, useCallback } from 'react';
import { WordDetail } from '../../types';

interface WordDetectiveProps {
  words: WordDetail[];
  unit: string;
  level: string;
}

interface Story {
  id: number;
  title: string;
  content: string;
  blanks: Blank[];
  difficulty: 'easy' | 'medium' | 'hard';
}

interface Blank {
  id: number;
  position: number;
  correctWord: string;
  options: string[];
  hint?: string;
}

const WordDetective: React.FC<WordDetectiveProps> = ({ words, unit, level }) => {
  // Props kullanılmıyor ama gelecekte kullanılabilir
  console.log('WordDetective props:', { words: words.length, unit, level });
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [scoredAnswers, setScoredAnswers] = useState<Set<number>>(new Set()); // Skorlanan cevapları takip et
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'finished' | 'loading'>('loading');
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  // const [showHint, setShowHint] = useState<{ [key: number]: boolean }>({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 dakika
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  // Hikaye verileri
  const stories: Story[] = [
    {
      id: 1,
      title: "The Mysterious Library",
      content: "In the old library, Sarah discovered a ___ book that contained ancient ___ about a lost civilization. The ___ was written in a language she had never seen before. As she turned the pages, she felt a strange ___ coming from the text. Suddenly, the book began to ___ with a golden light, and she realized it was no ordinary ___.",
      blanks: [
        { id: 1, position: 0, correctWord: "mysterious", options: ["mysterious", "ordinary", "simple", "boring"] },
        { id: 2, position: 1, correctWord: "knowledge", options: ["knowledge", "stories", "pictures", "music"] },
        { id: 3, position: 2, correctWord: "manuscript", options: ["manuscript", "newspaper", "magazine", "letter"] },
        { id: 4, position: 3, correctWord: "energy", options: ["energy", "cold", "heat", "wind"] },
        { id: 5, position: 4, correctWord: "glow", options: ["glow", "disappear", "break", "close"] },
        { id: 6, position: 5, correctWord: "artifact", options: ["artifact", "toy", "tool", "weapon"] }
      ],
      difficulty: 'easy'
    },
    {
      id: 2,
      title: "The Space Adventure",
      content: "Captain Johnson and his crew were on a ___ mission to explore a distant planet. Their spaceship had been ___ through space for months when they finally reached their ___. The planet's atmosphere was ___ and filled with strange gases. As they landed, they discovered ___ creatures that had never been seen before. The crew knew they had made a ___ discovery that would change everything.",
      blanks: [
        { id: 1, position: 0, correctWord: "dangerous", options: ["dangerous", "safe", "easy", "boring"] },
        { id: 2, position: 1, correctWord: "traveling", options: ["traveling", "sleeping", "eating", "dancing"] },
        { id: 3, position: 2, correctWord: "destination", options: ["destination", "home", "school", "restaurant"] },
        { id: 4, position: 3, correctWord: "toxic", options: ["toxic", "clean", "fresh", "sweet"] },
        { id: 5, position: 4, correctWord: "alien", options: ["alien", "friendly", "normal", "common"] },
        { id: 6, position: 5, correctWord: "revolutionary", options: ["revolutionary", "small", "old", "simple"] }
      ],
      difficulty: 'medium'
    },
    {
      id: 3,
      title: "The Time Machine",
      content: "Professor Williams had spent years building a ___ that could transport people through time. The machine was incredibly ___ and required precise calculations to work properly. When he finally activated it, he found himself in a ___ era where dinosaurs still roamed the earth. The experience was both ___ and terrifying. He realized that time travel was not just a ___ but a reality that could change the course of history.",
      blanks: [
        { id: 1, position: 0, correctWord: "contraption", options: ["contraption", "toy", "book", "car"] },
        { id: 2, position: 1, correctWord: "complex", options: ["complex", "simple", "easy", "cheap"] },
        { id: 3, position: 2, correctWord: "prehistoric", options: ["prehistoric", "modern", "future", "recent"] },
        { id: 4, position: 3, correctWord: "exhilarating", options: ["exhilarating", "boring", "scary", "sad"] },
        { id: 5, position: 4, correctWord: "fantasy", options: ["fantasy", "reality", "dream", "nightmare"] }
      ],
      difficulty: 'hard'
    }
  ];

  // Timer
  useEffect(() => {
    if (gameStatus === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      finishGame();
    }
  }, [timeLeft, gameStatus]);

  // Oyunu başlat
  const startGame = useCallback(() => {
    setCurrentStory(stories[currentStoryIndex]);
    setSelectedAnswers({});
    setScoredAnswers(new Set());
    setGameStatus('playing');
    setTimeLeft(300);
    setStreak(0);
    setMaxStreak(0);
    // setShowHint({});
  }, [currentStoryIndex]);

  // Cevap seç
  const selectAnswer = (blankId: number, answer: string) => {
    // Eğer bu cevap için daha önce skor verilmemişse
    if (!scoredAnswers.has(blankId)) {
      const blank = currentStory?.blanks.find(b => b.id === blankId);
      if (blank && answer) {
        const isCorrect = answer === blank.correctWord;
        
        if (isCorrect) {
          // Doğru cevap - streak artır ve skor ekle
          setStreak(prev => {
            const newStreak = prev + 1;
            setMaxStreak(prevMax => Math.max(prevMax, newStreak));
            // Yeni streak ile skor hesapla
            setScore(prevScore => prevScore + 10 + (newStreak * 2));
            return newStreak;
          });
        } else {
          // Yanlış cevap - streak sıfırla
          setStreak(0);
        }
        
        // Bu cevabı skorlanmış olarak işaretle
        setScoredAnswers(prev => new Set(prev).add(blankId));
      }
    }
    
    setSelectedAnswers(prev => ({
      ...prev,
      [blankId]: answer
    }));
  };

  // İpucu göster - şu an kullanılmıyor
  // const toggleHint = (blankId: number) => {
  //   setShowHint(prev => ({
  //     ...prev,
  //     [blankId]: !prev[blankId]
  //   }));
  // };

  // Cevabı kontrol et (sadece görsel geri bildirim için)
  const isAnswerCorrect = (blankId: number, answer: string) => {
    const blank = currentStory?.blanks.find(b => b.id === blankId);
    if (!blank) return false;
    return answer === blank.correctWord;
  };

  // Oyunu bitir
  const finishGame = () => {
    setGameStatus('finished');
  };

  // Sonraki hikaye
  const nextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setCurrentStory(stories[currentStoryIndex + 1]);
      setSelectedAnswers({});
      setScoredAnswers(new Set());
      // setShowHint({});
    } else {
      finishGame();
    }
  };

  // Oyunu yeniden başlat
  const restartGame = () => {
    setCurrentStoryIndex(0);
    setScore(0);
    setMaxStreak(0);
    startGame();
  };

  // Hikayeyi render et
  const renderStory = () => {
    if (!currentStory) return null;

    const parts = currentStory.content.split('___');
    const blanks = currentStory.blanks.sort((a, b) => a.position - b.position);

    return (
      <div className="space-y-4">
        {parts.map((part, index) => (
          <span key={index}>
            {part}
            {index < blanks.length && (
              <select
                value={selectedAnswers[blanks[index].id] || ''}
                onChange={(e) => selectAnswer(blanks[index].id, e.target.value)}
                className={`mx-2 px-3 py-1 border-2 rounded-lg ${
                  selectedAnswers[blanks[index].id] 
                    ? isAnswerCorrect(blanks[index].id, selectedAnswers[blanks[index].id])
                      ? 'border-green-500 bg-green-100'
                      : 'border-red-500 bg-red-100'
                    : 'border-gray-300'
                }`}
              >
                <option value="">Seçiniz</option>
                {blanks[index].options.map((option, optIndex) => (
                  <option key={optIndex} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
          </span>
        ))}
      </div>
    );
  };

  // Oyun yükleniyor
  if (gameStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Word Detective</h2>
          <p className="text-purple-200">Hikaye hazırlanıyor...</p>
          <button
            onClick={startGame}
            className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Oyunu Başlat
          </button>
        </div>
      </div>
    );
  }

  // Oyun bitti
  if (gameStatus === 'finished') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center">
          <h2 className="text-3xl font-bold text-purple-800 mb-4">🎉 Oyun Bitti!</h2>
          <div className="space-y-2 mb-6">
            <p className="text-lg"><span className="font-semibold">Skor:</span> {score}</p>
            <p className="text-lg"><span className="font-semibold">En Uzun Seri:</span> {maxStreak}</p>
            <p className="text-lg"><span className="font-semibold">Hikaye:</span> {currentStory?.title}</p>
          </div>
          <div className="space-y-2">
            <button
              onClick={restartGame}
              className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Yeniden Başla
            </button>
            {currentStoryIndex < stories.length - 1 && (
              <button
                onClick={nextStory}
                className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Sonraki Hikaye
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Oyun oynanıyor
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-purple-800">🔍 Word Detective</h1>
            <div className="text-right">
              <p className="text-lg font-semibold">Skor: {score}</p>
              <p className="text-sm text-gray-600">Seri: {streak}</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">{currentStory?.title}</h2>
            <div className="text-right">
              <p className="text-lg font-semibold text-red-600">
                ⏰ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </p>
            </div>
          </div>
        </div>

        {/* Hikaye */}
        <div className="bg-white rounded-xl p-6 mb-6">
          <div className="text-lg leading-relaxed text-gray-800">
            {renderStory()}
          </div>
        </div>

        {/* Kontroller */}
        <div className="flex justify-between">
          <button
            onClick={finishGame}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Oyunu Bitir
          </button>
          <button
            onClick={nextStory}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Sonraki Hikaye
          </button>
        </div>
      </div>
    </div>
  );
};

export default WordDetective;
