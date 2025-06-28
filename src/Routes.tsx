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


interface AppRoutesProps {
  currentUnit: string;
  setCurrentUnit: (unit: string) => void;
  currentLevel: 'intermediate' | 'upper-intermediate' | 'pre-intermediate' | 'foundation';
  setCurrentLevel: (level: 'intermediate' | 'upper-intermediate' | 'pre-intermediate' | 'foundation') => void;
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
          <Route path="/" element={<HomePage filteredWords={filteredWords} currentUnit={currentUnit} currentLevel={currentLevel} />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/paraphrase" element={<ParaphrasePage />} />
          <Route path="/preposition-mastery" element={<PrepositionMasteryGame />} />
          <Route path="/matching-game" element={<MatchingGameWrapper words={filteredWords} />} />
          <Route path="/sentence-completion" element={<GameWrapper component={SentenceCompletion} words={filteredWords} />} />
          <Route path="/multiple-choice" element={<GameWrapper component={MultipleChoice} words={filteredWords} />} />
          <Route path="/flashcard" element={<GameWrapper component={FlashCard} words={filteredWords} />} />
          <Route path="/speaking" element={<GameWrapper component={SpeakingGame} words={filteredWords} />} />
          <Route path="/word-race" element={<GameWrapper component={WordRace} words={filteredWords} />} />
          <Route path="/memory-game" element={<GameWrapper component={MemoryGame} words={filteredWords} />} />
          <Route path="/word-forms" element={<GameWrapper component={WordFormsGame} words={filteredWords} />} />
          <Route path="/essay-writing" element={<EssayWritingPage />} />
          <Route path="/definition-to-word" element={<GameWrapper component={DefinitionToWordGame} words={filteredWords} />} />
          <Route path="/learning-mode" element={<GameWrapper component={LearningMode} words={filteredWords} />} />
        </Routes>
      </div>
    </>
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