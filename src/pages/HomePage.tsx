import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { Zap, Brain, Mic, BookOpen, Award, Star, Type, BookCopy, Layers, Sparkles, Puzzle } from 'lucide-react';
import logo from '../components/a.png';
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
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  gradient: string;
  requiresParams?: boolean;
}

const gameModes: GameMode[] = [
  {
    title: "Eşleştirme",
    description: "Kelime ve anlamlarını eşleştirerek kelime bilginizi test edin.",
    icon: <Zap className="w-8 h-8 text-white" />,
    path: "/matching-game",
    gradient: "from-blue-500 to-cyan-500",
    requiresParams: true,
  },
  {
    title: "Çoktan Seçmeli",
    description: "Verilen kelimenin doğru anlamını şıklar arasından bulun.",
    icon: <Award className="w-8 h-8 text-white" />,
    path: "/multiple-choice",
    gradient: "from-green-500 to-emerald-500",
    requiresParams: true,
  },
  {
    title: "Cümle Tamamlama",
    description: "Cümlelerdeki boşlukları doğru kelimelerle doldurun.",
    icon: <BookOpen className="w-8 h-8 text-white" />,
    path: "/sentence-completion",
    gradient: "from-yellow-500 to-amber-500",
    requiresParams: true,
  },
  {
    title: "Kelime Kartları",
    description: "Klasik kelime kartlarıyla yeni kelimeler öğrenin ve tekrar yapın.",
    icon: <BookCopy className="w-8 h-8 text-white" />,
    path: "/flashcard",
    gradient: "from-orange-500 to-red-500",
    requiresParams: true,
  },
  {
    title: "Kelime Yarışı",
    description: "Zamana karşı yarışarak ne kadar hızlı kelime bildiğinizi gösterin.",
    icon: <Brain className="w-8 h-8 text-white" />,
    path: "/word-race",
    gradient: "from-red-500 to-rose-500",
    requiresParams: true,
  },
  {
    title: "Kelime Türleri",
    description: "Kelimelerin türlerini (isim, fiil, sıfat vb.) ayırt etme becerisi kazanın.",
    icon: <Type className="w-8 h-8 text-white" />,
    path: "/word-types",
    gradient: "from-indigo-500 to-purple-500",
    requiresParams: true,
  },
  {
    title: "Kelime Formları",
    description: "Kelimelerin farklı formlarını (isim, fiil, sıfat vb.) kullanarak cümleleri tamamla.",
    icon: <Layers className="w-8 h-8 text-white" />,
    path: "/word-forms",
    gradient: "from-pink-500 to-rose-500",
    requiresParams: true,
  },
  {
    title: "Paraphrase Challenge",
    description: "Yapay zeka ile cümleleri yeniden yazarak akademik yazma becerini geliştir.",
    icon: <Sparkles className="w-8 h-8 text-white" />,
    path: "/paraphrase",
    gradient: "from-purple-500 to-indigo-600",
    requiresParams: false,
  },
  {
    title: "Preposition Mastery",
    description: "Yapay zeka tarafından üretilen cümlelerdeki eksik edatları bularak bilgini sına.",
    icon: <Puzzle className="w-8 h-8 text-white" />,
    path: "/preposition-mastery",
    gradient: "from-teal-500 to-cyan-600",
    requiresParams: false,
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: "easeOut"
    }
  })
};

const GameCard: React.FC<{mode: GameMode, index: number}> = ({ mode, index }) => {
  const { title, description, icon, path, gradient, requiresParams } = mode;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const handleClick = () => {
    if (requiresParams) {
      const unit = searchParams.get('unit') || 'all';
      const level = searchParams.get('level') || 'intermediate';
      navigate(`${path}?unit=${unit}&level=${level}`);
    } else {
      navigate(path);
    }
  };

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={`relative rounded-2xl p-6 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br ${gradient} cursor-pointer`}
      onClick={handleClick}
    >
      <div>
        <div className="bg-white/20 rounded-full w-14 h-14 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/80 text-sm leading-relaxed">{description}</p>
      </div>
      <div className="mt-4">
        <div className="text-white font-semibold flex items-center gap-2">
          Oyna <Zap className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
};

const HomePage: React.FC = () => {
  const [params] = useSearchParams();
  const [currentParams, setCurrentParams] = useState({ unit: '1', level: 'intermediate' });
  
  // URL parametrelerini gerçek zamanlı olarak takip et
  useEffect(() => {
    const unit = params.get('unit') || '1';
    const level = params.get('level') || 'intermediate';
    setCurrentParams({ unit, level });
  }, [params]);

  const { unit, level } = currentParams;

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
          {gameModes.map((mode, index) => (
            <GameCard key={mode.title} mode={mode} index={index} />
          ))}
        </motion.div>
      </main>
      <div className="w-full text-center mt-16 mb-4">
        <span className="text-xs text-gray-500 dark:text-gray-600 tracking-wide">powered by mirac</span>
      </div>
    </div>
  );
};

export default HomePage;