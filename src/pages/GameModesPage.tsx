import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { HiClipboardList, HiCollection, HiDocumentText, HiSwitchHorizontal, HiPuzzle, HiSpeakerphone, HiBookOpen, HiLightningBolt, HiHome } from 'react-icons/hi';

interface GameModesPageProps {
  currentUnit: string;
  currentLevel: 'intermediate' | 'upper-intermediate' | 'pre-intermediate' | 'foundation' | 'kuepe';
}

const GameModesPage: React.FC<GameModesPageProps> = ({ currentUnit, currentLevel }) => {
  // Memoized game modes
  const gameModes = useMemo(() => [
    {
      id: 'vocabulary',
      title: 'Learning Mode',
      description: 'Discover new words',
      icon: HiBookOpen,
      color: 'from-amber-500 to-yellow-500',
      imgSrc: '/assets/aaaaaaaadwü/ogrenmemodu.jpg',
      route: `/learning-mode?unit=${currentUnit}&level=${currentLevel}`
    },
    {
      id: 'definitionToWord',
      title: 'Definition to Word',
      description: 'Find word from definition',
      icon: HiBookOpen,
      color: 'from-lime-500 to-green-500',
      imgSrc: '/assets/aaaaaaaadwü/tanım.jpg',
      route: `/definition-to-word?unit=${currentUnit}&level=${currentLevel}`
    },
    {
      id: 'multiple-choice',
      title: 'Multiple Choice',
      description: 'Find the correct option',
      icon: HiClipboardList,
      color: 'from-green-500 to-emerald-500',
      imgSrc: '/assets/aaaaaaaadwü/coktansecmeli.jpg',
      route: `/multiple-choice?unit=${currentUnit}&level=${currentLevel}`
    },
    {
      id: 'matching',
      title: 'Matching',
      description: 'Match words with meanings',
      icon: HiSwitchHorizontal,
      color: 'from-blue-500 to-cyan-500',
      imgSrc: '/assets/aaaaaaaadwü/eşeştirme.jpg',
      route: `/matching-game?unit=${currentUnit}&level=${currentLevel}`
    },
    {
      id: 'flashcard',
      title: 'Flashcards',
      description: 'Learn with word cards',
      icon: HiCollection,
      color: 'from-yellow-500 to-orange-500',
      imgSrc: '/assets/aaaaaaaadwü/kelimekartlari.jpg',
      route: `/flashcard?unit=${currentUnit}&level=${currentLevel}`
    },
    {
      id: 'prepositionMastery',
      title: 'Preposition Mastery',
      description: 'Use prepositions correctly',
      icon: HiPuzzle,
      color: 'from-violet-500 to-purple-500',
      imgSrc: '/assets/aaaaaaaadwü/preposition.jpg',
      route: `/preposition-mastery?unit=${currentUnit}&level=${currentLevel}`
    },
    {
      id: 'sentence-completion',
      title: 'Sentence Completion',
      description: 'Complete missing words',
      icon: HiDocumentText,
      color: 'from-purple-500 to-violet-500',
      imgSrc: '/assets/aaaaaaaadwü/boslukdoldurma.jpg',
      route: `/sentence-completion?unit=${currentUnit}&level=${currentLevel}`
    },
    {
      id: 'speaking',
      title: 'Speaking',
      description: 'Practice pronunciation',
      icon: HiSpeakerphone,
      color: 'from-indigo-500 to-blue-500',
      imgSrc: '/assets/aaaaaaaadwü/konusma.jpg',
      route: `/speaking?unit=${currentUnit}&level=${currentLevel}`
    },
    {
      id: 'wordForms',
      title: 'Word Forms',
      description: 'Learn word forms',
      icon: HiPuzzle,
      color: 'from-rose-500 to-pink-500',
      imgSrc: '/assets/aaaaaaaadwü/wordform.jpg',
      route: `/word-forms?unit=${currentUnit}&level=${currentLevel}`
    },
    {
      id: 'word-race',
      title: 'Word Race',
      description: 'Think fast, write fast',
      icon: HiLightningBolt,
      color: 'from-red-500 to-pink-500',
      imgSrc: '/assets/aaaaaaaadwü/kelimeyarisi.jpg',
      route: `/word-race?unit=${currentUnit}&level=${currentLevel}`
    },
  ], [currentUnit, currentLevel]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#070a1a] via-[#0a0d1a] to-[#01020a] text-gray-100 overflow-hidden relative">
      {/* Header */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-4">
        {/* Home Button */}
        <div className="flex justify-start mb-4">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-700/80 to-gray-600/80 hover:from-gray-600/80 hover:to-gray-500/80 text-white rounded-full text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-600/50 hover:border-gray-500/50 backdrop-blur-sm"
          >
            <HiHome className="w-4 h-4" />
            <span>Ana Sayfa</span>
          </Link>
        </div>
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-wider font-bebas uppercase mb-4 drop-shadow-[0_0_18px_rgba(0,190,255,0.25)]">
            OYUN MODLARI
          </h1>
          <p className="text-lg text-gray-300 font-inter leading-relaxed max-w-2xl mx-auto">
            Farklı oyun modlarıyla İngilizce öğrenmeyi eğlenceli hale getirin. Her mod size farklı beceriler kazandırır.
          </p>
          <div className="mt-4 text-sm text-gray-400">
            <span className="bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30">
              {currentLevel.toUpperCase()} - Ünite {currentUnit}
            </span>
          </div>
        </div>
      </div>

      {/* Game Modes Grid */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {gameModes.map((mode) => {
            const IconComponent = mode.icon;
            const imgSrc = mode.imgSrc;
            
            return (
              <Link
                key={mode.id}
                to={mode.route}
                className="group relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-lg border border-gray-700/50 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-gray-600/50 cursor-pointer"
              >
                {/* Görsel ve başlık */}
                <div className="relative w-full aspect-[1/1] min-h-[120px] md:min-h-[160px] overflow-hidden flex flex-col justify-center items-center"> 
                  {/* Blurlu ve karartılmış arkaplan resmi */}
                  <img 
                    src={imgSrc} 
                    alt="" 
                    className="absolute inset-0 w-full h-full object-cover object-center blur-md brightness-50 scale-110" 
                  />
                  {/* Ana resim */}
                  <img 
                    src={imgSrc} 
                    alt="Oyun görseli" 
                    className="relative z-10 w-full h-full md:w-3/4 md:h-3/4 object-cover object-center rounded-t-xl transition-transform duration-300 group-hover:scale-110 group-hover:brightness-110" 
                  />
                </div>

                {/* İçerik */}
                <div className="p-3 md:p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <IconComponent className="w-5 h-5 text-blue-400" />
                    <h3 className="font-bold text-white text-sm md:text-base truncate">
                      {mode.title}
                    </h3>
                  </div>
                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                    {mode.description}
                  </p>
                </div>

                {/* Hover efekti */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300 rounded-2xl" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GameModesPage;
