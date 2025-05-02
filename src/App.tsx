import React, { useState } from 'react';
import { Sparkles, RefreshCw, Layout, Book, PenTool, Plus, Mic, Clock, BarChart, Trophy, Type, User, FileText } from 'lucide-react';
import { learningStatsTracker } from './data/learningStats';
import { LearningStatsModal } from './components/LearningStatsModal';
import { words } from './data/words';
import { MatchingGame } from './components/GameModes/MatchingGame';
import { SentenceBuilder } from './components/GameModes/SentenceBuilder';
import { SentenceCompletion } from './components/GameModes/SentenceCompletion';
import { MultipleChoice } from './components/GameModes/MultipleChoice';
import { FlashCard } from './components/GameModes/FlashCard';
import { SpeakingGame } from './components/GameModes/SpeakingGame';
import { WordRace } from './components/GameModes/WordRace';
import { AddWord } from './components/AddWord';

import { UnitSelector } from './components/UnitSelector';

import { Leaderboard } from './components/Leaderboard';
import { Auth } from './components/Auth';
import WordListManager from './components/WordListManager';
import { WordListImport } from './components/WordListImport';
import { WordListView } from './components/WordListView';
import { ParaphraseChallenge } from './components/GameModes/ParaphraseChallenge';

type GameMode = 'matching' | 'multiple-choice' | 'flashcard' | 'custom-words' | 'sentence' | 'speaking' | 'word-race' | 'sentence-completion' | 'paraphrase-challenge';

interface CustomWord {
  english: string;
  turkish: string;
  unit: string;
}

function App() {
  const [currentUnit, setCurrentUnit] = useState('1');
  const [gameMode, setGameMode] = useState<GameMode>('matching');
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [showUnitSelector, setShowUnitSelector] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showWordListManager, setShowWordListManager] = useState(false);
  const [showWordListImport, setShowWordListImport] = useState(false);
  const [showWordListView, setShowWordListView] = useState(false);
  const todayStats = learningStatsTracker.getTodayStats();

  const gameModes = [
    { id: 'paraphrase-challenge', name: 'Paraphrase Challenge', icon: FileText },
    { id: 'matching', name: 'Eşleştirme Oyunu', icon: Layout },
    { id: 'sentence-completion', name: 'Cümle Tamamlama', icon: Type },
    { id: 'multiple-choice', name: 'Çoktan Seçmeli', icon: Book },
    { id: 'flashcard', name: 'Kelime Kartları', icon: PenTool },
    { id: 'speaking', name: 'Konuşma Pratiği', icon: Mic },
    { id: 'word-race', name: 'Kelime Yarışması', icon: Trophy },
    { id: 'custom-words', name: 'Özel Kelimeler', icon: Plus },
  ] as const;

  const renderGame = () => {
    switch (gameMode) {
      case 'matching':
        return <MatchingGame words={words} unit={currentUnit} />;

      case 'multiple-choice':
        return <MultipleChoice words={words} unit={currentUnit} />;
      case 'flashcard':
        return <FlashCard words={words} unit={currentUnit} />;

      case 'custom-words':
        return <AddWord onWordAdded={() => {
          // Sayfayı yenile ve kelimeleri güncelle
          window.location.reload();
        }} />;
      case 'speaking':
        return <SpeakingGame words={words} unit={currentUnit} />;
      case 'word-race':
        return <WordRace words={words} unit={currentUnit} />;
      case 'sentence-completion':
        return <SentenceCompletion words={words} unit={currentUnit} />;
      case 'paraphrase-challenge':
        return <ParaphraseChallenge words={words} unit={currentUnit} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobil menü butonu */}
          <button
            onClick={() => setShowUnitDropdown(!showUnitDropdown)}
            className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-500 to-indigo-500
              rounded-full shadow-lg flex items-center justify-center z-50
              transform transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <svg
              className={`w-6 h-6 text-white transform transition-transform duration-300 ${showUnitDropdown ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className={`lg:w-72 bg-white p-6 rounded-xl shadow-lg border border-purple-100 lg:h-fit lg:sticky lg:top-6 flex flex-col gap-4
            fixed lg:relative inset-0 lg:inset-auto z-40 transform transition-transform duration-300 ease-in-out
            ${showUnitDropdown ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
          >
            <div className="w-full p-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              <h1 className="text-lg font-bold text-center">Koç Üniversitesi Intermediate Words</h1>
            </div>
            
            <UnitSelector currentUnit={currentUnit} setCurrentUnit={setCurrentUnit} />
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-[#6A4C93]">Oyun Modları</h2>
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

              <div className="mt-6 space-y-4">
                <button
                  onClick={() => setShowStatsModal(true)}
                  className="w-full p-4 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg
                    hover:shadow-xl transition-all duration-300 transform hover:scale-102"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BarChart className="w-6 h-6" />
                      <span className="text-base font-medium">Bugün Kaç Kelime Öğrendim?</span>
                    </div>
                    <span className="text-xl font-bold">{todayStats.wordsLearned}</span>
                  </div>
                </button>
                
                <button
                  onClick={() => setShowLeaderboard(true)}
                  className="w-full p-4 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg
                    hover:shadow-xl transition-all duration-300 transform hover:scale-102"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Trophy className="w-6 h-6" />
                      <span className="text-base font-medium">Liderlik Tablosu</span>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => setShowAuth(true)}
                  className="w-full p-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg
                    hover:shadow-xl transition-all duration-300 transform hover:scale-102"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User className="w-6 h-6" />
                      <span className="text-base font-medium">Kayıt Ol / Giriş Yap</span>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => setShowWordListManager(true)}
                  className="w-full p-4 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg
                    hover:shadow-xl transition-all duration-300 transform hover:scale-102"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-6 h-6" />
                      <span className="text-base font-medium">Kelime Listelerim</span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1">
            {showStatsModal && <LearningStatsModal onClose={() => setShowStatsModal(false)} />}
            {showLeaderboard && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                onClick={() => setShowLeaderboard(false)}
              >
                <div 
                  className="bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Leaderboard onClose={() => setShowLeaderboard(false)} />
                </div>
              </div>
            )}
            {showAuth && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                  <Auth onClose={() => setShowAuth(false)} />
                </div>
              </div>
            )}
            
            {showWordListManager && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-gradient-to-br from-green-100 via-teal-100 to-emerald-100 rounded-xl shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                  <WordListManager onClose={() => setShowWordListManager(false)} />
                </div>
              </div>
            )}
            
            {showWordListImport && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100 rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <WordListImport 
                    onClose={() => setShowWordListImport(false)} 
                    onImportSuccess={() => {
                      setShowWordListImport(false);
                      setShowWordListManager(true);
                    }} 
                  />
                </div>
              </div>
            )}
            
            {showWordListView && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-gradient-to-br from-purple-100 via-violet-100 to-indigo-100 rounded-xl shadow-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                  <WordListView onClose={() => setShowWordListView(false)} />
                </div>
              </div>
            )}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
              {renderGame()}
            </div>
            <div className="text-center text-[#6A4C93] text-lg font-medium mt-4 mb-6">
              powered by mirac
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;