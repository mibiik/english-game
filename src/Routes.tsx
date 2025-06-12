import React from 'react';
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
  const words = getWordsByParams(unit, level);
  return <MatchingGameWrapper words={words} />;
}

function GameWrapperWithParams({ component }: { component: React.ComponentType<any> }) {
  const { unit, level } = useGameParams();
  const words = getWordsByParams(unit, level);
  return <GameWrapper component={component} words={words} />;
}