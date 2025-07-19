import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Brain, Mic, BookOpen, Award, Star, Type, BookCopy, Layers, Sparkles, Puzzle, Book, Trash2, Users, GraduationCap, UserPlus, X, LogIn, ChevronDown } from 'lucide-react';
import logo from './a.png';
import icoLogo from '../ico.png';
import { newDetailedWords_part1 } from '../data/words';
import { detailedWords_part1 as upperIntermediateWordsRaw, WordDetail } from '../data/word4';
import { gameStateManager } from '../lib/utils';
import { userService } from '../services/userService';
import { authService } from '../services/authService';

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
  'live-quiz-host': 'Öğrencileriniz için canlı bir kelime yarışması başlatın ve yönetin.',
  'live-quiz-join': 'Oda kodunu kullanarak mevcut bir canlı yarışmaya katılın.',
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
  const navigate = useNavigate();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Kullanıcının oturum durumunu kontrol et
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
    };
    
    // Sayfa yüklendiğinde kontrol et
    checkAuth();

    // Auth modal'ı kapandığında oturum durumunu tekrar kontrol et
    const handleAuthClose = () => {
      setTimeout(() => {
        checkAuth();
      }, 100);
    };

    // Periyodik olarak oturum durumunu kontrol et (her 2 saniyede)
    const interval = setInterval(checkAuth, 2000);

    window.addEventListener('auth-closed', handleAuthClose);
    
    return () => {
      window.removeEventListener('auth-closed', handleAuthClose);
      clearInterval(interval);
    };
  }, []);

  const handleClearGameStates = () => {
    gameStateManager.clearAllGameStates();
    setShowClearConfirm(true);
    setTimeout(() => setShowClearConfirm(false), 2000);
  };

  const handleNameSubmit = async () => {
    if (!userName.trim()) return;
    
    setIsLoading(true);
    try {
      await userService.saveUserName(userName.trim());
      // İsimi localStorage'a kaydet
      localStorage.setItem('userName', userName.trim());
      // İsim kaydedildikten sonra normal Auth modal'ını aç
      window.dispatchEvent(new CustomEvent('show-auth'));
      setShowNameModal(false);
      setUserName('');
    } catch (error) {
      console.error('İsim kayıt hatası:', error);
    } finally {
      setIsLoading(false);
    }
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

  const headingLines = [
    <>
      <div className="text-center">
        <div className="mb-2">
          <span className="text-white">ELC </span>
          <motion.span
            className="inline-block align-middle"
            initial={{ opacity: 0, x: -40, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2, type: 'spring', stiffness: 80 }}
          >
            <span className="text-red-600 drop-shadow font-bebas text-6xl md:text-7xl tracking-wider uppercase">Word</span>
            <span className="text-white drop-shadow-lg font-bebas text-6xl md:text-7xl tracking-wider uppercase">Play'e</span>
          </motion.span>
        </div>
        <div className="text-white font-bebas text-5xl md:text-7xl tracking-wider uppercase">
          Hoş Geldin Koç'lu!
        </div>
        {!isAuthenticated && (
          <div className="flex gap-3 justify-center mt-3">
            <motion.button
              onClick={() => {
                const event = new CustomEvent('show-auth', { detail: { mode: 'register' } });
                window.dispatchEvent(event);
              }}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-1.5"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <UserPlus className="w-4 h-4" />
              Kayıt Ol
            </motion.button>
            <motion.button
              onClick={() => {
                const event = new CustomEvent('show-auth', { detail: { mode: 'login' } });
                window.dispatchEvent(event);
              }}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-1.5"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogIn className="w-4 h-4" />
              Giriş Yap
            </motion.button>
          </div>
        )}
      </div>
    </>
  ];

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
    <div className="min-h-screen bg-gradient-to-b from-[#111] to-black text-gray-100 overflow-x-hidden relative">
      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(35)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-red-500/20 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
        
        {/* Büyük uçuşan elementler */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`large-${i}`}
            className="absolute w-1 h-1 bg-cyan-500/30 rounded-full"
            animate={{
              x: [0, 200, 0],
              y: [0, -200, 0],
              opacity: [0.1, 0.6, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Infinity,
              delay: Math.random() * 10,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
        
        {/* Yıldız şeklinde elementler */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute w-1 h-1 bg-yellow-500/40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
            }}
            animate={{
              rotate: [0, 360],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 8 + 8,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}

        {/* Ek küçük elementler */}
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={`small-${i}`}
            className="absolute w-1 h-1 bg-purple-500/25 rounded-full"
            animate={{
              x: [0, 150, 0],
              y: [0, -150, 0],
              opacity: [0.1, 0.5, 0.1],
            }}
            transition={{
              duration: Math.random() * 12 + 12,
              repeat: Infinity,
              delay: Math.random() * 8,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative mb-20 text-left"
        >
          {/* Mobil Logo */}
          <motion.div
            className="flex justify-center mb-6 md:hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img
              src={icoLogo}
              alt="WordPlay Logo"
              className="w-36 h-36 drop-shadow-2xl"
            />
          </motion.div>

          {/* Mobil Scroll İkonu */}
          <motion.div
            className="flex justify-center mb-8 md:hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.button
              className="flex flex-col items-center cursor-pointer"
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              onClick={() => {
                const gameModesSection = document.querySelector('.grid.grid-cols-2.md\\:grid-cols-3.lg\\:grid-cols-4');
                if (gameModesSection) {
                  gameModesSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                  });
                }
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronDown className="w-8 h-8 text-red-500 drop-shadow-lg" />
              <span className="text-sm text-gray-400 mt-2 font-medium">Oyun Modları</span>
            </motion.button>
          </motion.div>

          <div className="max-w-xl">
            <motion.h1
              className="text-7xl md:text-9xl font-extrabold tracking-wider font-bebas uppercase mb-4 drop-shadow-[0_0_18px_rgba(0,190,255,0.25)] text-center leading-tight"
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              {headingLines.map((line, lineIndex) => (
                <span className="block" key={lineIndex}>{line}</span>
              ))}
            </motion.h1>
            <motion.div
              className="w-full max-w-4xl h-1 mx-auto bg-gradient-to-r from-red-800 via-red-600 to-red-400 rounded-full mb-6 overflow-hidden"
              initial={{ opacity: 0, scaleX: 0.7 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.5 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-transparent via-white to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            </motion.div>
            <motion.p 
              className="mt-6 mb-8 text-base text-gray-300 font-inter leading-relaxed"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              Koç Üniversitesi ELC'nin güncel kelime listeleriyle tam uyumlu, öğrenme sürecinizi hızlandırmak için tasarlanmış interaktif alıştırmalarla İngilizce'nizi geliştirin.
            </motion.p>
          </div>

          <motion.img
            src={icoLogo}
            alt="WordPlay Logo"
            className="absolute -top-10 right-0 w-64 lg:w-[400px] h-auto -mr-16 hidden md:block pointer-events-none"
            animate={{ y: ["-4px", "4px"], rotate: [-2, 2] }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 8,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* İsim Alma Modal */}
        <AnimatePresence>
          {showNameModal && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Hoş Geldiniz!</h2>
                  <button
                    onClick={() => setShowNameModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="İsminizi girin..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4 text-gray-900"
                  onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
                />
                <button
                  onClick={handleNameSubmit}
                  disabled={isLoading || !userName.trim()}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {isLoading ? 'Kaydediliyor...' : 'Devam Et'}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
                  <h3 className="text-xl font-bold text-white transition-colors font-heading">{mode.title}</h3>
                </div>
                <p className="text-gray-400 text-sm mt-2 font-inter leading-relaxed">{gameModeDescriptions[mode.id] || 'Bu mod için açıklama yakında eklenecek.'}</p>
                </motion.div>
              </Link>
          ))}
        </motion.div>
      </main>
      <div className="w-full text-center mt-8 mb-4 relative z-10">
        <span className="text-xs text-gray-500 dark:text-gray-600 tracking-wide">powered by mirac</span>
      </div>
    </div>
  );
};

export default HomePage;