import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Brain, Mic, BookOpen, Award, Star, Type, BookCopy, Layers, Sparkles, Puzzle, Book, Trash2 } from 'lucide-react';
import logo from './a.png';
import { newDetailedWords_part1 } from '../data/words';
import { detailedWords_part1 as upperIntermediateWordsRaw, WordDetail } from '../data/word4';
import { gameStateManager } from '../lib/utils';

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

interface HomePageProps {
  filteredWords: any[];
  currentUnit: string;
  currentLevel: string;
}

const gameModeDescriptions: Record<string, string> = {
  'multiple-choice': 'Verilen kelimenin doğru anlamını şıklar arasından bulun.',
  'matching': 'Kelimeleri doğru anlamlarıyla eşleştirin.',
  'sentence-completion': 'Cümledeki boşluğu en uygun kelimeyle doldurun.',
  'word-forms': 'Kelimenin doğru formunu (isim, fiil, sıfat vb.) seçin.',
  'definition-to-word': 'Verilen tanıma uygun kelimeyi bulun.',
  'paraphrase': 'Cümleleri yeniden ifade etme becerilerinizi test edin.',
  'essay-writing': 'Verilen konuda kısa bir kompozisyon yazarak yazma pratiği yapın.',
  'preposition-mastery': 'Cümlelerde eksik olan edatları (preposition) tamamlayın.',
  'flashcard': 'Kelimelerin anlamlarını hızlıca gözden geçirin ve bildiklerinizi işaretleyin.',
  'word-race': 'Zamana karşı yarışarak verilen kelimenin doğru anlamını bulun.',
  'speaking': 'Verilen kelimeleri doğru bir şekilde telaffuz ederek konuşma pratiği yapın.',
  'learning-mode': 'Oyunlara başlamadan önce kelimeleri, anlamlarını ve örnek cümleleri öğrenin.',
};

const HomePage: React.FC<HomePageProps> = ({ filteredWords, currentUnit, currentLevel }) => {
  const unit = currentUnit;
  const level = currentLevel;
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearGameStates = () => {
    gameStateManager.clearAllGameStates();
    setShowClearConfirm(true);
    setTimeout(() => setShowClearConfirm(false), 2000);
  };

  const gameModes: GameMode[] = [
    { id: 'learning-mode', title: 'Öğretici Mod', icon: <Book />, link: `/learning-mode?unit=${unit}&level=${level}`, color: 'from-blue-500 to-indigo-600', shadow: 'hover:shadow-blue-500/30' },
    { id: 'multiple-choice', title: 'Çoktan Seçmeli', icon: <Award />, link: `/multiple-choice?unit=${unit}&level=${level}`, color: 'from-amber-500 to-orange-600', shadow: 'hover:shadow-amber-500/30' },
    { id: 'matching', title: 'Eşleştirme', icon: <BookCopy />, link: `/matching-game?unit=${unit}&level=${level}`, color: 'from-cyan-500 to-blue-600', shadow: 'hover:shadow-cyan-500/30' },
    { id: 'sentence-completion', title: 'Boşluk Doldurma', icon: <Zap />, link: `/sentence-completion?unit=${unit}&level=${level}`, color: 'from-green-500 to-emerald-600', shadow: 'hover:shadow-green-500/30' },
    { id: 'word-forms', title: 'Kelime Formları', icon: <Layers />, link: `/word-forms?unit=${unit}&level=${level}`, color: 'from-pink-500 to-rose-500', shadow: 'hover:shadow-pink-500/30' },
    { id: 'definition-to-word', title: 'Tanımdan Kelime', icon: <Type />, link: `/definition-to-word?unit=${unit}&level=${level}`, color: 'from-green-700 to-blue-700', shadow: 'hover:shadow-green-700/30' },
    { id: 'paraphrase', title: 'Paraphrase', icon: <Sparkles />, link: `/paraphrase`, color: 'from-purple-500 to-indigo-600', shadow: 'hover:shadow-purple-500/30' },
    { id: 'essay-writing', title: 'Essay Yazma', icon: <BookOpen />, link: '/essay-writing', color: 'from-gray-500 to-gray-600', shadow: 'hover:shadow-gray-500/30' },
    { id: 'preposition-mastery', title: 'Preposition Mastery', icon: <Puzzle />, link: '/preposition-mastery', color: 'from-teal-500 to-cyan-600', shadow: 'hover:shadow-teal-500/30' },
    { id: 'flashcard', title: 'Kelime Kartları', icon: <Brain />, link: `/flashcard?unit=${unit}&level=${level}`, color: 'from-violet-500 to-fuchsia-600', shadow: 'hover:shadow-violet-500/30' },
    { id: 'word-race', title: 'Kelime Yarışı', icon: <Zap />, link: `/word-race?unit=${unit}&level=${level}`, color: 'from-red-500 to-red-600', shadow: 'hover:shadow-red-500/30' },
    { id: 'speaking', title: 'Konuşma', icon: <Mic />, link: `/speaking?unit=${unit}&level=${level}`, color: 'from-rose-500 to-red-600', shadow: 'hover:shadow-rose-500/30' },
  ];

  const headingLines = ["Koç WordPlay'e", "Hoş Geldiniz"];

  const sentenceVariant = {
    hidden: { opacity: 0 },
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#111] to-black text-gray-100 overflow-x-hidden">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative mb-20 text-left"
        >
          <div className="max-w-xl">
            <motion.h1
              className="text-5xl md:text-6xl font-black text-white tracking-tighter font-outfit uppercase drop-shadow-[0_0_12px_rgba(0,190,255,0.3)]"
              variants={sentenceVariant}
            >
              {headingLines.map((line, lineIndex) => (
                <span className="block" key={lineIndex}>
                  {line && line.split("").map((char, charIndex) => (
                    <motion.span key={char + "-" + charIndex} variants={letterVariant}>
                      {char}
                    </motion.span>
                  ))}
                </span>
              ))}
            </motion.h1>
            <motion.p 
              className="mt-6 mb-8 text-lg text-gray-300"
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
            className="absolute -top-10 right-0 w-80 lg:w-[500px] h-auto -mr-16 hidden md:block pointer-events-none"
            animate={{ y: ["-4px", "4px"], rotate: [-2, 2] }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 8,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          variants={cardContainerVariant}
          initial="hidden"
          animate="visible"
        >
          {gameModes.map((mode) => (
            <Link to={mode.link} key={mode.id} className="block group">
              <motion.div 
                className={`group bg-white/5 backdrop-blur-md p-5 rounded-2xl h-full border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 shadow-lg ${mode.shadow}`}
                variants={cardItemVariant}
              >
                <div className={`w-12 h-12 flex items-center justify-center rounded-md mb-4 bg-gradient-to-br ${mode.color}`}>
                  {React.cloneElement(mode.icon, { className: 'w-7 h-7 text-white' })}
                  </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white transition-colors">{mode.title}</h3>
                </div>
                <p className="text-gray-400 text-sm mt-2">{gameModeDescriptions[mode.id] || 'Bu mod için açıklama yakında eklenecek.'}</p>
                </motion.div>
              </Link>
          ))}
        </motion.div>
      </main>
      <div className="w-full text-center mt-8 mb-4">
        <span className="text-xs text-gray-500 dark:text-gray-600 tracking-wide">powered by mirac</span>
      </div>
    </div>
  );
};

export default HomePage;