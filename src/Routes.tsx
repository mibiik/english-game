import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Routes, Route, useSearchParams } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { WordDetail, detailedWords_pathways3_part1 as intermediateWordsRaw } from './data/intermediate';
import { detailedWords_part1 as upperIntermediateWordsRaw } from './data/upperIntermediate';
import { detailedWords_part1 as foundationWordsRaw } from './data/foundation';
import { detailedWords_part1 as preIntermediateWordsRaw } from './data/preintermediate';
import AdSense from './components/AdSense';
import { ADSENSE_SLOTS } from './config/apiKeys';

// Lazy loading için bileşenleri import et
const HomePage = lazy(() => import('./pages/HomePage'));
const WelcomePage = lazy(() => import('./pages/WelcomePage'));
const GameModesPage = lazy(() => import('./pages/GameModesPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AboutFounder = lazy(() => import('./pages/AboutFounder'));
const SeasonLeaderboardPage = lazy(() => import('./pages/SeasonLeaderboardPage'));
const MessagesPage = lazy(() => import('./pages/MessagesPage'));

const Iletisim = lazy(() => import('./pages/Iletisim'));
const Sss = lazy(() => import('./pages/Sss'));
const Destek = lazy(() => import('./pages/Destek'));
const Gizlilik = lazy(() => import('./pages/Gizlilik'));
const KullanimSartlari = lazy(() => import('./pages/KullanimSartlari'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const ParaphrasePage = lazy(() => import('./pages/ParaphrasePage'));
const GrammarGamePage = lazy(() => import('./pages/GrammarGamePage'));
const EssayWritingPage = lazy(() => import('./pages/EssayWritingPage'));
const AllWordsPage = lazy(() => import('./pages/AllWordsPage'));
const SupabaseTestPage = lazy(() => import('./pages/SupabaseTestPage'));


// Game Modes - Lazy loading
const MultipleChoice = lazy(() => import('./components/GameModes/MultipleChoice').then(module => ({ default: module.MultipleChoice })));
const MatchingGame = lazy(() => import('./components/GameModes/MatchingGame').then(module => ({ default: module.default })));
const FlashCard = lazy(() => import('./components/GameModes/FlashCard').then(module => ({ default: module.FlashCard })));
const WordRace = lazy(() => import('./components/GameModes/WordRace').then(module => ({ default: module.WordRace })));
const SentenceCompletion = lazy(() => import('./components/GameModes/SentenceCompletion').then(module => ({ default: module.SentenceCompletion })));
const DefinitionToWordGame = lazy(() => import('./components/GameModes/DefinitionToWordGame').then(module => ({ default: module.DefinitionToWordGame })));
const PrepositionMasteryGame = lazy(() => import('./components/GameModes/PrepositionMasteryGame').then(module => ({ default: module.PrepositionMasteryGame })));
const LearningMode = lazy(() => import('./components/GameModes/LearningMode').then(module => ({ default: module.LearningMode })));
const MemoryGame = lazy(() => import('./components/GameModes/MemoryGame').then(module => ({ default: module.MemoryGame })));
const SpeakingGame = lazy(() => import('./components/GameModes/SpeakingGame').then(module => ({ default: module.SpeakingGame })));
const WordFormsGame = lazy(() => import('./components/GameModes/WordFormsGame'));

// Loading Spinner bileşeni
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
  </div>
);

// Korumalı Route bileşeni
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode;
  isAuthenticated: boolean | null;
}> = ({ children, isAuthenticated }) => {
  

  // useEffect must be called unconditionally (Rules of Hooks).
  // If the user is explicitly unauthenticated, redirect to /welcome.
  useEffect(() => {
    if (isAuthenticated === false) {
      // Use location replace to avoid leaving a history entry for the protected page
      window.location.replace('/welcome');
    }
  }, [isAuthenticated]);

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

  // Giriş yapmamış kullanıcılar için kısa bir yönlendirme ekranı göster (useEffect yukarıda yönlendirir)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#111] to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Yönlendiriliyor...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};


interface AppRoutesProps {
  currentUnit: string;
  setCurrentUnit: (unit: string) => void;
  currentLevel: 'intermediate' | 'upper-intermediate' | 'pre-intermediate' | 'foundation' | 'kuepe';
  setCurrentLevel: (level: 'intermediate' | 'upper-intermediate' | 'pre-intermediate' | 'foundation' | 'kuepe') => void;
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
        <Route path="/" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Navbar 
                onShowAuth={() => window.dispatchEvent(new CustomEvent('show-auth'))} 
                currentUnit={currentUnit}
                setCurrentUnit={setCurrentUnit}
                currentLevel={currentLevel}
                setCurrentLevel={setCurrentLevel}
              />
              <div className="pt-32">
                <Suspense fallback={<LoadingSpinner />}>
                  <HomePage filteredWords={filteredWords} currentUnit={currentUnit} currentLevel={currentLevel} />
                </Suspense>
              </div>
          </ProtectedRoute>
  } />
        <Route path="/welcome" element={
          <Suspense fallback={<LoadingSpinner />}>
            <WelcomePage />
          </Suspense>
        } />
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
                <Suspense fallback={<LoadingSpinner />}>
                  <HomePage filteredWords={filteredWords} currentUnit={currentUnit} currentLevel={currentLevel} />
                </Suspense>
              </div>
          </ProtectedRoute>
        } />
        <Route path="/game-modes" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <>
              <Navbar 
                onShowAuth={() => window.dispatchEvent(new CustomEvent('show-auth'))} 
                currentUnit={currentUnit}
                setCurrentUnit={setCurrentUnit}
                currentLevel={currentLevel}
                setCurrentLevel={setCurrentLevel}
              />
              <div>
                <Suspense fallback={<LoadingSpinner />}>
                  <GameModesPage currentUnit={currentUnit} currentLevel={currentLevel} />
                </Suspense>
              </div>
            </>
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
                <Suspense fallback={<LoadingSpinner />}>
                  <ProfilePage />
                </Suspense>
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
                <Suspense fallback={<LoadingSpinner />}>
                  <ParaphrasePage />
                </Suspense>
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
                <Suspense fallback={<LoadingSpinner />}>
                  <GameWrapperWithParams component={PrepositionMasteryGame} />
                </Suspense>
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
              <div className="pt-40">
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
              <div>
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
              <div>
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
        {/* KUEPE modu kaldırıldı */}
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
        

        {/* Mesajlar Rotaları */}
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
                <SeasonLeaderboardPage />
              </div>
            </>
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AdminPage />
          </ProtectedRoute>
        } />
        <Route path="/iletisim" element={<Iletisim />} />
        <Route path="/destek" element={<Destek />} />
        <Route path="/hakkimizda" element={<AboutFounder />} />
        <Route path="/sss" element={<Sss />} />
        <Route path="/gizlilik" element={<Gizlilik />} />
        <Route path="/kullanim-sartlari" element={<KullanimSartlari />} />
        <Route path="/about-founder" element={<AboutFounder />} />
        <Route path="/all-words" element={
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
                <AllWordsPage currentLevel={currentLevel} />
              </div>
            </>
          </ProtectedRoute>
        } />
        <Route path="/supabase-test" element={<SupabaseTestPage />} />
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
    // KUEPE kaldırıldı
    case 'intermediate':
    default:
      sourceData = intermediateWordsRaw;
      break;
  }

  console.log('getWordsByParams called with:', { unit, level });
  console.log('Source data length:', sourceData.length);
  console.log('Available units in source data:', [...new Set(sourceData.map(w => w.unit))].sort());
  
  // KUEPE için ünite filtrelemesi yok, tüm kelimeler döndürülür
  if (level === 'kuepe') {
    console.log('KUEPE level - returning all words:', sourceData.length);
    return sourceData;
  }
  
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
    console.log('MatchingGame: Unit words count:', newWords.filter(w => w.unit === unit).length);
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

  // Unit kontrolü
  const unitWords = words.filter(w => w.unit === unit);
  if (unitWords.length === 0) {
    console.error('❌ MatchingGame: Bu unit için kelime bulunamadı:', { unit, level, totalWords: words.length });
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Bu ünite için kelime bulunamadı</div>
          <p className="text-gray-300 mb-4">Unit: {unit}, Level: {level}</p>
          <button 
            onClick={() => window.location.href = '/home'} 
            className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  console.log('✅ MatchingGame: Oyun başlatılıyor:', { 
    unit, 
    level, 
    totalWords: words.length, 
    unitWords: unitWords.length 
  });

  return (
    <>
      <MatchingGame words={words} />
      <div className="w-full flex justify-center mt-6 mb-6">
        <AdSense slot={ADSENSE_SLOTS.HOME_FOOTER} className="w-full max-w-3xl" />
      </div>
    </>
  );
}


function GameWrapperWithParams({ component }: { component: React.ComponentType<any> }) {
  const { unit, level } = useGameParams();
  const [words, setWords] = useState<WordDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('GameWrapper: URL params changed:', { unit, level, componentName: component.name });
    console.log('GameWrapper: Available data sources:', {
      intermediateCount: intermediateWordsRaw.length,
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
    // LearningMode sadece words prop'u alıyor
    const compElement = component.name === 'LearningMode'
      ? React.createElement(component, { words })
      : React.createElement(component, { words, unit, level });

    return (
      <>
        {compElement}
        <div className="w-full flex justify-center mt-6 mb-6">
          <AdSense slot={ADSENSE_SLOTS.HOME_FOOTER} className="w-full max-w-3xl" />
        </div>
      </>
    );
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

export default AppRoutes;