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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <button
            onClick={() => setShowUnitDropdown(!showUnitDropdown)}
            className="lg:hidden fixed bottom-4 right-4 z-50 p-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full shadow-lg"
          >
            Menü
          </button>

          <div className={`fixed lg:relative inset-0 lg:inset-auto z-40 lg:z-auto ${showUnitDropdown ? 'flex' : 'hidden lg:flex'} lg:w-72 bg-white p-6 rounded-xl shadow-lg border border-purple-100 lg:h-fit lg:sticky lg:top-6 flex-col`}>
            <div className="w-full mb-4 p-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center">
              <h1 className="text-lg font-bold">Koç Üniversitesi Intermediate Words</h1>
            </div>
            <div className="flex justify-between items-center lg:block mb-4">
              <h2 className="text-xl font-bold text-[#6A4C93]">Oyun Modları</h2>
              <button
                onClick={() => setShowUnitDropdown(false)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="relative mb-4">
              <button
                onClick={() => setShowUnitDropdown(!showUnitDropdown)}
                className="w-full p-4 rounded-xl bg-purple-500 text-white shadow-lg"
              >
                Ünite {currentUnit}
              </button>
              {showUnitDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-purple-100 py-2 z-10">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((unit) => (
                    <button
                      key={unit}
                      onClick={() => {
                        setCurrentUnit(unit.toString());
                        setShowUnitDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-purple-50 transition-colors duration-200 ${currentUnit === String(unit) ? "text-purple-600 font-medium" : "text-gray-700"}`}
                    >
                      Ünite {unit}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3">
              {gameModes.map(({ id, name, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    setGameMode(id as GameMode);
                    setShowUnitDropdown(false);
                  }}
                  className={`p-4 rounded-xl transition-all duration-300 flex items-center gap-3 transform hover:scale-102 hover:shadow-md w-full ${gameMode === id ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg' : 'bg-purple-50 text-[#6A4C93] hover:bg-purple-100'}`}
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