import React, { useEffect, useState } from 'react';
import { Routes, Route, useSearchParams } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ParaphrasePage from './pages/ParaphrasePage';
import MatchingGameWrapper from './components/GameModes/MatchingGame';
import { SentenceCompletion } from './components/GameModes/SentenceCompletion';
import { MultipleChoice } from './components/GameModes/MultipleChoice';
import { FlashCard } from './components/GameModes/FlashCard';
import { SpeakingGame } from './components/GameModes/SpeakingGame';
import { WordRace } from './components/GameModes/WordRace';
import { MemoryGame } from './components/GameModes/MemoryGame';
import WordFormsGame from './components/GameModes/WordFormsGame';
import { Navbar } from './components/Navbar';
import ProfilePage from './pages/ProfilePage';
import { GameWrapper } from './components/GameWrapper';
import { WordDetail } from './data/words';
import { newDetailedWords_part1 } from './data/words';
import { detailedWords_part1 as upperIntermediateWordsRaw } from './data/word4';

interface AppRoutesProps {
  currentUnit: string;
  setCurrentUnit: (unit: string) => void;
  currentLevel: 'intermediate' | 'upper-intermediate';
  setCurrentLevel: (level: 'intermediate' | 'upper-intermediate') => void;
  filteredWords: WordDetail[];
}

export const AppRoutes: React.FC<AppRoutesProps> = ({ 
  currentUnit, 
  setCurrentUnit,
  currentLevel,
  setCurrentLevel,
  filteredWords,
}) => {
  return (
    <>
      <Navbar 
        onShowAuth={() => window.dispatchEvent(new CustomEvent('show-auth'))} 
        currentUnit={currentUnit}
        setCurrentUnit={setCurrentUnit}
        currentLevel={currentLevel}
        setCurrentLevel={setCurrentLevel}
      />
      <div className="pt-32">
        <Routes>
          <Route path="/" element={<HomePage filteredWords={filteredWords} />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/paraphrase" element={<ParaphrasePage />} />
          <Route path="/matching-game" element={<MatchingGameWrapperWithParams />} />
          <Route path="/sentence-completion" element={<GameWrapperWithParams component={SentenceCompletion} />} />
          <Route path="/multiple-choice" element={<GameWrapperWithParams component={MultipleChoice} />} />
          <Route path="/flashcard" element={<GameWrapperWithParams component={FlashCard} />} />
          <Route path="/speaking" element={<GameWrapperWithParams component={SpeakingGame} />} />
          <Route path="/word-race" element={<GameWrapperWithParams component={WordRace} />} />
          <Route path="/memory-game" element={<GameWrapperWithParams component={MemoryGame} />} />
          <Route path="/word-forms" element={<GameWrapperWithParams component={WordFormsGame} />} />
        </Routes>
      </div>
    </>
  );
};

function getWordsByParams(unit: string, level: string): WordDetail[] {
  let sourceData: WordDetail[] = level === 'upper-intermediate' ? upperIntermediateWordsRaw : newDetailedWords_part1;
  if (unit === 'all') return sourceData;
  return sourceData.filter(word => word.unit === unit);
}

function useGameParams() {
  const [params] = useSearchParams();
  const unit = params.get('unit') || '1';
  const level = params.get('level') || 'intermediate';
  return { unit, level };
}

function MatchingGameWrapperWithParams() {
  const { unit, level } = useGameParams();
  const [words, setWords] = useState<WordDetail[]>([]);
  const [gameKey, setGameKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('MatchingGame: URL params changed:', { unit, level });
    const newWords = getWordsByParams(unit, level);
    console.log('MatchingGame: New words count:', newWords.length);
    setWords(newWords);
    setIsLoading(false);
    // Oyunu yeniden başlatmak için key'i değiştir
    setGameKey(prev => {
      const newKey = prev + 1;
      console.log('MatchingGame: Game key updated to:', newKey);
      return newKey;
    });
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

  return <MatchingGameWrapper key={gameKey} words={words} />;
}

function GameWrapperWithParams({ component }: { component: React.ComponentType<any> }) {
  const { unit, level } = useGameParams();
  const [words, setWords] = useState<WordDetail[]>([]);
  const [gameKey, setGameKey] = useState(0);
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
    // Oyunu yeniden başlatmak için key'i değiştir
    setGameKey(prev => {
      const newKey = prev + 1;
      console.log('GameWrapper: Game key updated to:', newKey);
      return newKey;
    });
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
    return <GameWrapper key={gameKey} component={component} words={words} />;
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