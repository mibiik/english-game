import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ParaphrasePage from './pages/ParaphrasePage';
import { MatchingGame } from './components/GameModes/MatchingGame';
import { SentenceCompletion } from './components/GameModes/SentenceCompletion';
import { MultipleChoice } from './components/GameModes/MultipleChoice';
import { FlashCard } from './components/GameModes/FlashCard';
import { SpeakingGame } from './components/GameModes/SpeakingGame';
import { WordRace } from './components/GameModes/WordRace';
import { MemoryGame } from './components/GameModes/MemoryGame';
import { TimedMatchingGame } from './components/GameModes/TimedMatchingGame';
import { words } from './data/words';
import { Navbar } from './components/Navbar';

export const AppRoutes: React.FC = () => {
  const [currentUnit, setCurrentUnit] = useState("1");

  return (
    <>
      <Navbar 
        onShowAuth={() => window.dispatchEvent(new CustomEvent('show-auth'))} 
        onShowLeaderboard={() => window.dispatchEvent(new CustomEvent('show-leaderboard'))}
        currentUnit={currentUnit}
        setCurrentUnit={setCurrentUnit}
      />
      <div className="pt-16"> {/* Navbar'ın altında kalan içeriğin düzgün görünmesi için padding-top ekledik */}
        <Routes>
          <Route path="/" element={<HomePage currentUnit={currentUnit} setCurrentUnit={setCurrentUnit} />} />
          <Route path="/paraphrase" element={<ParaphrasePage />} />
          <Route path="/matching-game" element={<MatchingGame words={words} unit={currentUnit} />} />
          <Route path="/sentence-completion" element={<SentenceCompletion words={words} unit={currentUnit} />} />
          <Route path="/multiple-choice" element={<MultipleChoice words={words} unit={currentUnit} />} />
          <Route path="/flashcard" element={<FlashCard words={words} unit={currentUnit} />} />
          <Route path="/speaking" element={<SpeakingGame words={words} unit={currentUnit} />} />
          <Route path="/word-race" element={<WordRace words={words} unit={currentUnit} />} />
          <Route path="/memory-game" element={<MemoryGame words={words} unit={currentUnit} />} />
          <Route path="/timed-matching-game" element={<TimedMatchingGame words={words} unit={currentUnit} />} />
        </Routes>
      </div>
    </>
    
  );
};