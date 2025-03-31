import React, { useState } from 'react';
import { Sparkles, RefreshCw, Layout, Timer, Book, Shuffle, PenTool, AlertTriangle, Plus, Brain, Clock } from 'lucide-react';
import { words } from './data/words';
import { MatchingGame } from './components/GameModes/MatchingGame';
import { SpeedGame } from './components/GameModes/SpeedGame';
import { MultipleChoice } from './components/GameModes/MultipleChoice';
import { WordScramble } from './components/GameModes/WordScramble';
import { FlashCard } from './components/GameModes/FlashCard';
import { DifficultWords } from './components/GameModes/DifficultWords';
import { AddWord } from './components/GameModes/AddWord';

import { TimedMatchingGame } from './components/GameModes/TimedMatchingGame';

type GameMode = 'matching' | 'multiple-choice' | 'flashcard' | 'custom-words' | 'speed' | 'scramble' | 'difficult' | 'memory' | 'timed-matching';

interface CustomWord {
  english: string;
  turkish: string;
  unit: string;
}

function App() {
  const [currentUnit, setCurrentUnit] = useState('1');
  const [gameMode, setGameMode] = useState<GameMode>('matching');
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);

  const gameModes = [
    { id: 'matching', name: 'Eşleştirme Oyunu', icon: Layout },

    { id: 'timed-matching', name: 'Zamanlı Eşleştirme', icon: Clock },
    { id: 'multiple-choice', name: 'Çoktan Seçmeli', icon: Book },
    { id: 'speed', name: 'Hız Oyunu', icon: Timer },
    { id: 'scramble', name: 'Karışık Harfler', icon: Shuffle },
    { id: 'flashcard', name: 'Kelime Kartları', icon: PenTool },
    { id: 'difficult', name: 'Zorlu Kelimeler', icon: AlertTriangle },
    { id: 'custom-words', name: 'Özel Kelimeler', icon: Plus },
  ] as const;

  const renderGame = () => {
    switch (gameMode) {
      case 'matching':
        return <MatchingGame words={words} unit={currentUnit} />;

      case 'timed-matching':
        return <TimedMatchingGame words={words} unit={currentUnit} />;
      case 'multiple-choice':
        return <MultipleChoice words={words} unit={currentUnit} />;
      case 'flashcard':
        return <FlashCard words={words} unit={currentUnit} />;
      case 'speed':
        return <SpeedGame words={words} unit={currentUnit} />;
      case 'scramble':
        return <WordScramble words={words} unit={currentUnit} />;
      case 'difficult':
        return <DifficultWords words={words} unit={currentUnit} />;
      case 'custom-words':
        return <AddWord unit={currentUnit} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100 p-8 relative overflow-hidden animate-gradient-xy">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9ImEiIGN4PSIxMDAlIiBjeT0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZmZiIgc3RvcC1vcGFjaXR5PSIuNCIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2ZmZiIgc3RvcC1vcGFjaXR5PSIwIi8+PC9yYWRpYWxHcmFkaWVudD48L2RlZnM+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI4MCIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] animate-sparkle opacity-50"></div>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center p-6 rounded-2xl bg-white shadow-lg transition-transform duration-300 hover:scale-102 border border-purple-100">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h1 className="text-4xl font-bold text-[#6A4C93] flex items-center gap-3">
              <Sparkles className="w-10 h-10 text-[#4B8B9F] animate-pulse" />
              KOÇ ÜNİVERSİTESİ INTERMEDIATE KELİME ALIŞTIRMASI
            </h1>
            <div className="relative">
              <button
                onClick={() => setShowUnitDropdown(!showUnitDropdown)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl
                  flex items-center gap-2 font-medium hover:shadow-md transition-all duration-300"
              >
                <span>Ünite {currentUnit}</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${showUnitDropdown ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showUnitDropdown && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-purple-100 py-2 z-10">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((unit) => (
                    <button
                      key={unit}
                      onClick={() => {
                        setCurrentUnit(unit.toString());
                        setShowUnitDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-purple-50 transition-colors duration-200
                        ${currentUnit === unit.toString() ? 'text-purple-600 font-medium' : 'text-gray-700'}`}
                    >
                      Ünite {unit}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <p className="text-[#4B8B9F] text-lg font-medium">Kelime haznenizi geliştirmek için bir oyun modu seçin!</p>
        </div>

        <div className="flex gap-8">
          <div className="w-72 bg-white p-6 rounded-xl shadow-lg border border-purple-100 h-fit sticky top-6">
            <h2 className="text-xl font-bold text-[#6A4C93] mb-4">Oyun Modları</h2>
            <div className="flex flex-col gap-3">
              {gameModes.map(({ id, name, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setGameMode(id as GameMode)}
                  className={`
                    p-4 rounded-xl transition-all duration-300 flex items-center gap-3
                    transform hover:scale-102 hover:shadow-md w-full
                    ${gameMode === id 
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg' 
                      : 'bg-purple-50 text-[#6A4C93] hover:bg-purple-100'}
                  `}
                >
                  <Icon className={`w-6 h-6 transition-transform ${gameMode === id ? 'text-white' : 'text-purple-500'}`} />
                  <span className="text-base font-medium">{name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100 mb-6">
              {renderGame()}
            </div>
          </div>
        </div>

        <div className="text-center text-[#6A4C93] opacity-70 text-base font-medium">
          powered by mirac
        </div>
      </div>
    </div>
  );
}

export default App;