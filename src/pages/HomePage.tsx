import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Brain, Mic, BookOpen, Award, Star, Type, BookCopy, Layers, Sparkles, Puzzle, Sun, X } from 'lucide-react';
import logo from './a.png';
import { newDetailedWords_part1 } from '../data/words';
import { detailedWords_part1 as upperIntermediateWordsRaw, WordDetail } from '../data/word4';

export interface Word {
  english: string;
  turkish: string;
  unit: string;
}

const getCustomWords = (): Word[] => {
  if (typeof window === 'undefined') return [];
  try {
    const allCustomWords: Word[] = [];
    
    for (let unit = 1; unit <= 12; unit++) {
      const savedWords = localStorage.getItem(`customWords_unit_${unit}`);
      if (savedWords) {
        const parsedWords = JSON.parse(savedWords);
        if (Array.isArray(parsedWords)) {
          const validWords = parsedWords.filter(word =>
            word &&
            typeof word === 'object' &&
            typeof word.english === 'string' &&
            typeof word.turkish === 'string' &&
            typeof word.unit === 'string'
          );
          allCustomWords.push(...validWords);
        }
      }
    }
    
    return allCustomWords;
  } catch (error) {
    console.error('Özel kelimeler yüklenirken hata oluştu:', error);
    return [];
  }
};

const intermediateWords: WordDetail[] = newDetailedWords_part1;
const upperIntermediateWords: WordDetail[] = upperIntermediateWordsRaw;

type AnyWord = Word | WordDetail;
const isWordDetail = (word: AnyWord): word is WordDetail => 'headword' in word;

interface GameMode {
  id: string;
  title: string;
  link: string;
  icon: JSX.Element;
  color: string;
  shadow: string;
}

const HomePage: React.FC<{ filteredWords: any[] }> = ({ filteredWords }) => {
  const [searchParams] = useSearchParams();
  const [showWelcome, setShowWelcome] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const unit = searchParams.get('unit') || "1";
  const level = searchParams.get('level') || 'intermediate';

  const gameModes: GameMode[] = [
    { id: 'matching', title: 'Eşleştirme', icon: <BookCopy />, link: `/matching-game?unit=${unit}&level=${level}`, color: 'from-cyan-500 to-blue-600', shadow: 'hover:shadow-cyan-500/30' },
    { id: 'sentence-completion', title: 'Boşluk Doldurma', icon: <Zap />, link: `/sentence-completion?unit=${unit}&level=${level}`, color: 'from-green-500 to-emerald-600', shadow: 'hover:shadow-green-500/30' },
    { id: 'multiple-choice', title: 'Çoktan Seçmeli', icon: <Award />, link: `/multiple-choice?unit=${unit}&level=${level}`, color: 'from-amber-500 to-orange-600', shadow: 'hover:shadow-amber-500/30' },
    { id: 'word-forms', title: 'Kelime Formları', icon: <Layers />, link: `/word-forms?unit=${unit}&level=${level}`, color: 'from-pink-500 to-rose-500', shadow: 'hover:shadow-pink-500/30' },
    { id: 'paraphrase', title: 'Paraphrase', icon: <Sparkles />, link: `/paraphrase`, color: 'from-purple-500 to-indigo-600', shadow: 'hover:shadow-purple-500/30' },
    { id: 'essay-writing', title: 'Essay Yazma', icon: <BookOpen />, link: '/essay-writing', color: 'from-gray-500 to-gray-600', shadow: 'hover:shadow-gray-500/30' },
    { id: 'preposition-mastery', title: 'Preposition Mastery', icon: <Puzzle />, link: '/preposition-mastery', color: 'from-teal-500 to-cyan-600', shadow: 'hover:shadow-teal-500/30' },
    { id: 'flashcard', title: 'Kelime Kartları', icon: <Brain />, link: `/flashcard?unit=${unit}&level=${level}`, color: 'from-violet-500 to-fuchsia-600', shadow: 'hover:shadow-violet-500/30' },
    { id: 'word-race', title: 'Kelime Yarışı', icon: <Zap />, link: `/word-race?unit=${unit}&level=${level}`, color: 'from-red-500 to-red-600', shadow: 'hover:shadow-red-500/30' },
    { id: 'speaking', title: 'Konuşma', icon: <Mic />, link: `/speaking?unit=${unit}&level=${level}`, color: 'from-rose-500 to-red-600', shadow: 'hover:shadow-rose-500/30' },
  ];

  const headingLines = ["Koç Üniversitesi", "ELC Özel"];

  const sentenceVariant = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.1,
        staggerChildren: 0.04,
      },
    },
  };

  const letterVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const cardContainerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.5 }
    },
  };
  
  const cardItemVariant = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  useEffect(() => {
    if (localStorage.getItem('summerUpdateBannerDismissed_v4') !== 'true') {
      setIsBannerVisible(true);
    }
  }, []);

  const handleDismissBanner = () => {
    setIsBannerVisible(false);
    localStorage.setItem('summerUpdateBannerDismissed_v4', 'true');
  };

  useEffect(() => {
    const isFirstVisit = !localStorage.getItem('hasVisited');
  }, []);

  return (
    <div className="min-h-screen bg-black text-gray-100 overflow-x-hidden">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative mb-20"
        >
          <div className="max-w-xl">
            <motion.h1
              className="text-5xl md:text-6xl font-black text-white tracking-tighter text-left"
              variants={sentenceVariant}
            >
              {headingLines.map((line, lineIndex) => (
                <span className="block" key={lineIndex}>
                  {line.split("").map((char, charIndex) => (
                    <motion.span key={char + "-" + charIndex} variants={letterVariant}>
                      {char}
                    </motion.span>
                  ))}
                </span>
              ))}
            </motion.h1>
            <motion.p 
              className="mt-6 mb-8 text-lg text-gray-400 text-left"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              Koç Üniversitesi ELC'nin güncel kelime listeleriyle tam uyumlu, öğrenme sürecinizi hızlandırmak için tasarlanmış interaktif alıştırmalarla İngilizce'nizi geliştirin.
            </motion.p>
          </div>

          <motion.img
            src={logo}
            alt="KoçWordPlay Logo"
            className="absolute top-0 right-0 w-auto h-48 md:h-56 -mt-10 -mr-4 hidden lg:block"
            animate={{ y: ["-8px", "8px"] }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 3,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5"
          variants={cardContainerVariant}
          initial="hidden"
          animate="visible"
        >
          {gameModes.map((game) => (
            <motion.div
              key={game.id}
              variants={cardItemVariant}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Link to={game.link}>
                <div className={`group bg-gray-900 hover:bg-gray-800/80 p-5 rounded-lg h-full border border-gray-700 hover:border-gray-500 transition-all duration-200 shadow-lg ${game.shadow}`}>
                  <div className={`w-12 h-12 flex items-center justify-center rounded-md mb-4 bg-gradient-to-br ${game.color}`}>
                    {React.cloneElement(game.icon, { className: 'w-7 h-7 text-white' })}
                  </div>
                  <h3 className="font-bold text-white text-lg">{game.title}</h3>
                  <div className="text-sm font-medium text-gray-500 group-hover:text-cyan-400 transition-colors mt-1">
                    <span>Başla</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </main>
      <div className="w-full text-center mt-16 mb-4">
        <span className="text-xs text-gray-500 dark:text-gray-600 tracking-wide">powered by mirac</span>
      </div>

      <div className="bg-gray-900 min-h-screen">
        <AnimatePresence>
          {isBannerVisible && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
              style={{ background: 'linear-gradient(to right, #FBBF24, #F97316)' }}
            >
              <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between flex-wrap">
                  <div className="w-0 flex-1 flex items-center">
                    <span className="flex p-2 rounded-lg bg-orange-600/80">
                      <Sun className="h-6 w-6 text-white" aria-hidden="true" />
                    </span>
                    <p className="ml-3 font-medium text-white truncate">
                      <span className="md:hidden">Yeni Yaz Listeleri Yayında!</span>
                      <span className="hidden md:inline">Tüm seviyeler için Yaz Kelime Listeleri güncellendi. Keşfet!</span>
                    </p>
                  </div>
                  <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
                    <button
                      type="button"
                      className="-mr-1 flex p-2 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2"
                      onClick={handleDismissBanner}
                    >
                      <span className="sr-only">Kapat</span>
                      <X className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative isolate pt-14">
          
          <div className="py-24 sm:py-32 lg:pb-40">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <motion.h2
                  className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  {headingLines.map((line, lineIndex) => (
                    <span className="block" key={lineIndex}>
                      {line.split("").map((char, charIndex) => (
                        <motion.span key={char + "-" + charIndex} variants={letterVariant}>
                          {char}
                        </motion.span>
                      ))}
                    </span>
                  ))}
                </motion.h2>
                <motion.p 
                  className="mt-6 text-lg text-gray-400"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  Koç Üniversitesi ELC'nin güncel kelime listeleriyle tam uyumlu, öğrenme sürecinizi hızlandırmak için tasarlanmış interaktif alıştırmalarla İngilizce'nizi geliştirin.
                </motion.p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;