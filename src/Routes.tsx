import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
        onShowLeaderboard={() => window.dispatchEvent(new CustomEvent('show-leaderboard'))}
        currentUnit={currentUnit}
        setCurrentUnit={setCurrentUnit}
        currentLevel={currentLevel}
        setCurrentLevel={setCurrentLevel}
      />
      <div className="pt-24">
        <Routes>
          <Route path="/" element={<HomePage filteredWords={filteredWords} />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/paraphrase" element={<ParaphrasePage />} />
          <Route path="/matching-game" element={<MatchingGameWrapper words={filteredWords} />} />
          <Route path="/sentence-completion" element={<GameWrapper component={SentenceCompletion} words={filteredWords} />} />
          <Route path="/multiple-choice" element={<GameWrapper component={MultipleChoice} words={filteredWords} />} />
          <Route path="/flashcard" element={<GameWrapper component={FlashCard} words={filteredWords} />} />
          <Route path="/speaking" element={<GameWrapper component={SpeakingGame} words={filteredWords} />} />
          <Route path="/word-race" element={<GameWrapper component={WordRace} words={filteredWords} />} />
          <Route path="/memory-game" element={<GameWrapper component={MemoryGame} words={filteredWords} />} />
          <Route path="/word-forms" element={<GameWrapper component={WordFormsGame} words={filteredWords} />} />
        </Routes>
      </div>
    </>
  );
};