import React, { useEffect, useState } from 'react';
import { Routes, Route, useSearchParams, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import WelcomePage from './pages/WelcomePage';
import ParaphrasePage from './pages/ParaphrasePage';
import MatchingGameWrapper from './components/GameModes/MatchingGame';
import { SentenceCompletion } from './components/GameModes/SentenceCompletion';
import { MultipleChoice } from './components/GameModes/MultipleChoice';
import { FlashCard } from './components/GameModes/FlashCard';
import { SpeakingGame } from './components/GameModes/SpeakingGame';
import { WordRace } from './components/GameModes/WordRace';
import { MemoryGame } from './components/GameModes/MemoryGame';
import WordFormsGame from './components/GameModes/WordFormsGame';
import EssayWritingPage from './pages/EssayWritingPage';
import { Navbar } from './components/Navbar';
import { WordDetail, newDetailedWords_part1 } from './data/words';
import { detailedWords_part1 as upperIntermediateWordsRaw } from './data/word4';
import { newDetailedWords_part1 as preIntermediateWordsRaw } from './data/word2';
import { newDetailedWords_part1 as foundationWordsRaw } from './data/word1';
import ProfilePage from './pages/ProfilePage';
import { GameWrapper } from './components/GameWrapper';
import PrepositionMasteryGame from './components/GameModes/PrepositionMasteryGame';
import { DefinitionToWordGame } from './components/GameModes/DefinitionToWordGame';
import { LearningMode } from './components/GameModes/LearningMode';
import CreateLiveQuiz from './pages/CreateLiveQuiz';
import QuizLobby from './pages/QuizLobby';
import QuizHostPlay from './pages/QuizHostPlay';
import JoinQuiz from './pages/JoinQuiz';
import PlayerQuizFlow from './pages/PlayerQuizFlow';
import DiscoverPage from './pages/DiscoverPage';
import MessagesPage from './pages/MessagesPage';
import { authService } from './services/authService';
import LeaderboardPage from './pages/LeaderboardPage';
import Iletisim from './pages/Iletisim';
import Destek from './pages/Destek';
import Hakkimizda from './pages/Hakkimizda';
import Sss from './pages/Sss';
import AdminPanel from './pages/AdminPanel';
import GrammarGamePage from './pages/GrammarGamePage';
// import SubscriptionInfo from './pages/SubscriptionInfo';
// import { getAuth } from 'firebase/auth';
// import { userService } from './services/userService';

// Korumalı Route bileşeni
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode;
  isAuthenticated: boolean | null;
}> = ({ children, isAuthenticated }) => {
  // Eğer authentication durumu henüz yüklenmediyse loading göster
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#111] to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Yükleniyor...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    // Modal aç
    window.dispatchEvent(new CustomEvent('show-auth'));
    return null; // Hiçbir şey render etme
  }
  
  return <>{children}</>;
};

// Ana sayfa yönlendirme bileşeni
const HomeRedirect: React.FC<{ 
  filteredWords: WordDetail[]; 
  currentUnit: string; 
  currentLevel: string;
  setCurrentUnit: (unit: string) => void;
  setCurrentLevel: (level: 'intermediate' | 'upper-intermediate' | 'pre-intermediate' | 'foundation') => void;
  isAuthenticated: boolean | null;
}> = ({ 
  filteredWords, 
  currentUnit, 
  currentLevel,
  setCurrentUnit,
  setCurrentLevel,
  isAuthenticated
}) => {
  // Eğer authentication durumu henüz yüklenmediyse loading göster
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#111] to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Yükleniyor...</p>
        </div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    return (
      <>
        <Navbar 
          onShowAuth={() => window.dispatchEvent(new CustomEvent('show-auth'))} 
          currentUnit={currentUnit}
          setCurrentUnit={setCurrentUnit}
          currentLevel={currentLevel as 'intermediate' | 'upper-intermediate' | 'pre-intermediate' | 'foundation'}
          setCurrentLevel={setCurrentLevel}
        />
        <div className="pt-32">
          <HomePage filteredWords={filteredWords} currentUnit={currentUnit} currentLevel={currentLevel as 'intermediate' | 'upper-intermediate' | 'pre-intermediate' | 'foundation'} />
        </div>
      </>
    );
  }
  
  return <WelcomePage />;
};

interface AppRoutesProps {
  currentUnit: string;
  setCurrentUnit: (unit: string) => void;
  currentLevel: 'intermediate' | 'upper-intermediate' | 'pre-intermediate' | 'foundation';
  setCurrentLevel: (level: 'intermediate' | 'upper-intermediate' | 'pre-intermediate' | 'foundation') => void;
  filteredWords: WordDetail[];
  isAuthenticated: boolean | null;
}

export const AppRoutes: React.FC<AppRoutesProps> = ({ 
  currentUnit, 
  setCurrentUnit,
  currentLevel,
  setCurrentLevel,
  filteredWords,
  isAuthenticated,
}) => {
  return (
    <Routes>
      {/* <Route path="/subscription-info" element={<SubscriptionInfo />} /> */}
      <Route path="/" element={<HomeRedirect filteredWords={filteredWords} currentUnit={currentUnit} currentLevel={currentLevel} setCurrentUnit={setCurrentUnit} setCurrentLevel={setCurrentLevel} isAuthenticated={isAuthenticated} />} />
      <Route path="/home" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Navbar 
              onShowAuth={() => window.dispatchEvent(new CustomEvent('show-auth'))} 
              currentUnit={currentUnit}
              setCurrentUnit={setCurrentUnit}
              currentLevel={currentLevel}
              setCurrentLevel={setCurrentLevel}
            />
            <div className="pt-32">
              <HomePage filteredWords={filteredWords} currentUnit={currentUnit} currentLevel={currentLevel} />
            </div>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <>
            <Navbar 
              onShowAuth={() => window.dispatchEvent(new CustomEvent('show-auth'))} 
              currentUnit={currentUnit}
              setCurrentUnit={setCurrentUnit}
              currentLevel={currentLevel}
              setCurrentLevel={setCurrentLevel}
            />
            <div className="pt-32">
              <ProfilePage />
            </div>
          </>
        </ProtectedRoute>
      } />
      <Route path="/paraphrase" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <>
            <Navbar 
              onShowAuth={() => window.dispatchEvent(new CustomEvent('show-auth'))} 
              currentUnit={currentUnit}
              setCurrentUnit={setCurrentUnit}
              currentLevel={currentLevel}
              setCurrentLevel={setCurrentLevel}
            />
            <div className="pt-32">
              <ParaphrasePage />
            </div>
          </>
        </ProtectedRoute>
      } />
      <Route path="/preposition-mastery" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <>
            <Navbar 
              onShowAuth={() => window.dispatchEvent(new CustomEvent('show-auth'))} 
              currentUnit={currentUnit}
              setCurrentUnit={setCurrentUnit}
              currentLevel={currentLevel}
              setCurrentLevel={setCurrentLevel}
            />
            <div className="pt-32">
              <PrepositionMasteryGame />
            </div>
          </>
        </ProtectedRoute>
      } />
      <Route path="/matching-game" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <>
            <Navbar 
              onShowAuth={() => window.dispatchEvent(new CustomEvent('show-auth'))} 
              currentUnit={currentUnit}
              setCurrentUnit={setCurrentUnit}
              currentLevel={currentLevel}
              setCurrentLevel={setCurrentLevel}
            />
            <div className="pt-32">
              <MatchingGameWrapperWithParams />
            </div>
          </>
        </ProtectedRoute>
      } />
      <Route path="/sentence-completion" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <>
            <Navbar 
              onShowAuth={() => window.dispatchEvent(new CustomEvent('show-auth'))} 
              currentUnit={currentUnit}
              setCurrentUnit={setCurrentUnit}
              currentLevel={currentLevel}
              setCurrentLevel={setCurrentLevel}
            />
            <div className="pt-32">
              <GameWrapperWithParams component={SentenceCompletion} />
            </div>
          </>
        </ProtectedRoute>
      } />
      <Route path="/multiple-choice" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <>
            <Navbar 
              onShowAuth={() => window.dispatchEvent(new CustomEvent('show-auth'))} 
              currentUnit={currentUnit}
              setCurrentUnit={setCurrentUnit}
              currentLevel={currentLevel}
              setCurrentLevel={setCurrentLevel}
            />
            <div className="pt-32">
              <GameWrapperWithParams component={MultipleChoice} />
            </div>
          </>
        </ProtectedRoute>
      } />
      <Route path="/flashcard" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <>
            <Navbar 
              onShowAuth={() => window.dispatchEvent(new CustomEvent('show-auth'))} 
              currentUnit={currentUnit}
              setCurrentUnit={setCurrentUnit}
              currentLevel={currentLevel}
              setCurrentLevel={setCurrentLevel}
            />
            <div className="pt-32">
              <GameWrapperWithParams component={FlashCard} />
            </div>
          </>
        </ProtectedRoute>
      } />
      <Route path="/speaking" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <>
            <Navbar 
              onShowAuth={() => window.dispatchEvent(new CustomEvent('show-auth'))} 
              currentUnit={currentUnit}
              setCurrentUnit={setCurrentUnit}
              currentLevel={currentLevel}
              setCurrentLevel={setCurrentLevel}
            />
            <div className="pt-32">
              <GameWrapperWithParams component={SpeakingGame} />
            </div>
          </>
        </ProtectedRoute>
      } />
      <Route path="/word-race" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <>
            <Navbar 
              onShowAuth={() => window.dispatchEvent(new CustomEvent('show-auth'))} 
              currentUnit={currentUnit}
              setCurrentUnit={setCurrentUnit}
              currentLevel={currentLevel}
              setCurrentLevel={setCurrentLevel}
            />
            <div className="pt-32">
              <GameWrapperWithParams component={WordRace} />
            </div>
          </>
        </ProtectedRoute>
      } />
      <Route path="/memory-game" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <>
            <Navbar 
              onShowAuth={() => window.dispatchEvent(new CustomEvent('show-auth'))} 
              currentUnit={currentUnit}
              setCurrentUnit={setCurrentUnit}
              currentLevel={currentLevel}
              setCurrentLevel={setCurrentLevel}
            />
            <div className="pt-32">
              <GameWrapperWithParams component={MemoryGame} />
            </div>
          </>
        </ProtectedRoute>
      } />
      <Route path="/word-forms" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <>
            <Navbar 
              onShowAuth={() => window.dispatchEvent(new CustomEvent('show-auth'))} 
              currentUnit={currentUnit}
              setCurrentUnit={setCurrentUnit}
              currentLevel={currentLevel}
              setCurrentLevel={setCurrentLevel}
            />
            <div className="pt-32">
              <GameWrapperWithParams component={WordFormsGame} />
            </div>
          </>
        </ProtectedRoute>
      } />
      <Route path="/essay-writing" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <>
            <Navbar 
              onShowAuth={() => window.dispatchEvent(new CustomEvent('show-auth'))} 
              currentUnit={currentUnit}
              setCurrentUnit={setCurrentUnit}
              currentLevel={currentLevel}
              setCurrentLevel={setCurrentLevel}
            />
            <div className="pt-32">
              <EssayWritingPage />
            </div>
          </>
        </ProtectedRoute>
      } />
      <Route path="/definition-to-word" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <>
            <Navbar 
              onShowAuth={() => window.dispatchEvent(new CustomEvent('show-auth'))} 
              currentUnit={currentUnit}
              setCurrentUnit={setCurrentUnit}
              currentLevel={currentLevel}
              setCurrentLevel={setCurrentLevel}
            />
            <div className="pt-32">
              <GameWrapperWithParams component={DefinitionToWordGame} />
            </div>
          </>
        </ProtectedRoute>
      } />
      <Route path="/learning-mode" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <>
            <Navbar 
              onShowAuth={() => window.dispatchEvent(new CustomEvent('show-auth'))} 
              currentUnit={currentUnit}
              setCurrentUnit={setCurrentUnit}
              currentLevel={currentLevel}
              setCurrentLevel={setCurrentLevel}
            />
            <div className="pt-32">
              <GameWrapperWithParams component={LearningMode} />
            </div>
          </>
        </ProtectedRoute>
      } />
      <Route path="/grammar-game" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <>
            <Navbar 
              onShowAuth={() => window.dispatchEvent(new CustomEvent('show-auth'))} 
              currentUnit={currentUnit}
              setCurrentUnit={setCurrentUnit}
              currentLevel={currentLevel}
              setCurrentLevel={setCurrentLevel}
            />
            <div className="pt-32">
              <GrammarGamePage />
            </div>
          </>
        </ProtectedRoute>
      } />
      
      {/* Canlı Quiz Rotaları */}
      <Route path="/live-quiz/create" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <>
            <Navbar 
              onShowAuth={() => window.dispatchEvent(new CustomEvent('show-auth'))} 
              currentUnit={currentUnit}
              setCurrentUnit={setCurrentUnit}
              currentLevel={currentLevel}
              setCurrentLevel={setCurrentLevel}
            />
            <div className="pt-32">
              <CreateLiveQuiz />
            </div>
          </>
        </ProtectedRoute>
      } />
      <Route path="/live-quiz/join" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <>
            <Navbar 
              onShowAuth={() => window.dispatchEvent(new CustomEvent('show-auth'))} 
              currentUnit={currentUnit}
              setCurrentUnit={setCurrentUnit}
              currentLevel={currentLevel}
              setCurrentLevel={setCurrentLevel}
            />
            <div className="pt-32">
              <JoinQuiz />
            </div>
          </>
        </ProtectedRoute>
      } />
      <Route path="/live-quiz/lobby/:roomCode" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <>
            <Navbar 
              onShowAuth={() => window.dispatchEvent(new CustomEvent('show-auth'))} 
              currentUnit={currentUnit}
              setCurrentUnit={setCurrentUnit}
              currentLevel={currentLevel}
              setCurrentLevel={setCurrentLevel}
            />
            <div className="pt-32">
              <QuizLobby />
            </div>
          </>
        </ProtectedRoute>
      } />
      <Route path="/live-quiz/play/host/:roomCode" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <>
            <Navbar 
              onShowAuth={() => window.dispatchEvent(new CustomEvent('show-auth'))} 
              currentUnit={currentUnit}
              setCurrentUnit={setCurrentUnit}
              currentLevel={currentLevel}
              setCurrentLevel={setCurrentLevel}
            />
            <div className="pt-32">
              <QuizHostPlay />
            </div>
          </>
        </ProtectedRoute>
      } />
      <Route path="/live-quiz/player-lobby/:roomCode" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <>
            <Navbar 
              onShowAuth={() => window.dispatchEvent(new CustomEvent('show-auth'))} 
              currentUnit={currentUnit}
              setCurrentUnit={setCurrentUnit}
              currentLevel={currentLevel}
              setCurrentLevel={setCurrentLevel}
            />
            <div className="pt-32">
              <PlayerQuizFlow />
            </div>
          </>
        </ProtectedRoute>
      } />

      {/* Keşfet ve Mesajlar Rotaları */}
      <Route path="/discover" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <>
            <Navbar 
              onShowAuth={() => window.dispatchEvent(new CustomEvent('show-auth'))} 
              currentUnit={currentUnit}
              setCurrentUnit={setCurrentUnit}
              currentLevel={currentLevel}
              setCurrentLevel={setCurrentLevel}
            />
            <div className="pt-32">
              <DiscoverPage />
            </div>
          </>
        </ProtectedRoute>
      } />
      <Route path="/messages" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <>
            <Navbar 
              onShowAuth={() => window.dispatchEvent(new CustomEvent('show-auth'))} 
              currentUnit={currentUnit}
              setCurrentUnit={setCurrentUnit}
              currentLevel={currentLevel}
              setCurrentLevel={setCurrentLevel}
            />
            <div className="pt-32">
              <MessagesPage />
            </div>
          </>
        </ProtectedRoute>
      } />
      <Route path="/leaderboard" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <>
            <Navbar 
              onShowAuth={() => window.dispatchEvent(new CustomEvent('show-auth'))} 
              currentUnit={currentUnit}
              setCurrentUnit={setCurrentUnit}
              currentLevel={currentLevel}
              setCurrentLevel={setCurrentLevel}
            />
            <div className="pt-32">
              <LeaderboardPage />
            </div>
          </>
        </ProtectedRoute>
      } />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/iletisim" element={<Iletisim />} />
      <Route path="/destek" element={<Destek />} />
      <Route path="/hakkimizda" element={<Hakkimizda />} />
      <Route path="/sss" element={<Sss />} />

    </Routes>
  );
};

function getWordsByParams(unit: string, level: string): WordDetail[] {
  let sourceData: WordDetail[];

  switch (level) {
    case 'upper-intermediate':
      sourceData = upperIntermediateWordsRaw;
      break;
    case 'pre-intermediate':
      sourceData = preIntermediateWordsRaw;
      break;
    case 'foundation':
      sourceData = foundationWordsRaw;
      break;
    case 'intermediate':
    default:
      sourceData = newDetailedWords_part1;
      break;
  }

  console.log('getWordsByParams called with:', { unit, level });
  console.log('Source data length:', sourceData.length);
  console.log('Available units in source data:', [...new Set(sourceData.map(w => w.unit))].sort());
  
  if (unit === 'all') {
    console.log('Returning all words:', sourceData.length);
    return sourceData;
  }
  
  const filteredWords = sourceData.filter(word => word.unit === unit);
  console.log(`Words for unit ${unit}:`, filteredWords.length);
  console.log('First few words:', filteredWords.slice(0, 3).map(w => ({ headword: w.headword, unit: w.unit })));
  
  if (filteredWords.length === 0) {
    console.warn(`No words found for unit ${unit}, falling back to all words`);
    return sourceData.slice(0, 20); // Fallback: ilk 20 kelimeyi döndür
  }
  
  return filteredWords;
}

function useGameParams() {
  const [params] = useSearchParams();
  let unit = params.get('unit');
  let level = params.get('level');

  if (!unit) {
    unit = localStorage.getItem('currentUnit') || '1';
  }
  if (!level) {
    level = localStorage.getItem('currentLevel') || 'foundation';
  }
  return { unit, level };
}

function MatchingGameWrapperWithParams() {
  const { unit, level } = useGameParams();
  const [words, setWords] = useState<WordDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('MatchingGame: URL params changed:', { unit, level });
    const newWords = getWordsByParams(unit, level);
    console.log('MatchingGame: New words count:', newWords.length);
    setWords(newWords);
    setIsLoading(false);
  }, [unit, level]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Oyun yükleniyor...</p>
        </div>
      </div>
    );
  }

  return <MatchingGameWrapper words={words} />;
}

function GameWrapperWithParams({ component }: { component: React.ComponentType<any> }) {
  const { unit, level } = useGameParams();
  const [words, setWords] = useState<WordDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('GameWrapper: URL params changed:', { unit, level, componentName: component.name });
    console.log('GameWrapper: Available data sources:', {
      intermediateCount: newDetailedWords_part1.length,
      upperIntermediateCount: upperIntermediateWordsRaw.length
    });
    
    const newWords = getWordsByParams(unit, level);
    console.log('GameWrapper: New words count:', newWords.length);
    console.log('GameWrapper: First few words:', newWords.slice(0, 3).map(w => ({ headword: w.headword, unit: w.unit })));
    
    setWords(newWords);
    setIsLoading(false);
  }, [unit, level]);

  if (isLoading) {
    console.log('GameWrapper: Loading component:', component.name);
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Oyun yükleniyor...</p>
        </div>
      </div>
    );
  }

  console.log('GameWrapper: Rendering component:', component.name, 'with words:', words.length);
  
  try {
    return React.createElement(component, { words, unit, level });
  } catch (error) {
    console.error('GameWrapper: Error rendering component:', component.name, error);
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Oyun yüklenirken hata oluştu</div>
          <p className="text-gray-300 mb-4">{component.name} component'inde problem var</p>
          <button 
            onClick={() => window.location.href = '/'} 
            className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }
}