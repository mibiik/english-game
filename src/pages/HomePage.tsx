import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiAcademicCap, HiClipboardList, HiCollection, HiDocumentText, HiSwitchHorizontal, HiLightBulb, HiPuzzle, HiSpeakerphone, HiBookOpen, HiLightningBolt, HiMicrophone, HiUserGroup, HiX } from 'react-icons/hi';
import logo from './a.png';
// import icoLogo from './ico.png';
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
    { id: 'learning-mode', title: 'Öğretici Mod', icon: <HiLightBulb />, link: `/learning-mode?unit=${unit}&level=${level}`, color: '', shadow: '' },
    { id: 'multiple-choice', title: 'Çoktan Seçmeli', icon: <HiClipboardList />, link: `/multiple-choice?unit=${unit}&level=${level}`, color: '', shadow: '' },
    { id: 'matching', title: 'Eşleştirme', icon: <HiSwitchHorizontal />, link: `/matching-game?unit=${unit}&level=${level}`, color: '', shadow: '' },
    { id: 'sentence-completion', title: 'Boşluk Doldurma', icon: <HiDocumentText />, link: `/sentence-completion?unit=${unit}&level=${level}`, color: '', shadow: '' },
    { id: 'word-forms', title: 'Kelime Formları', icon: <HiCollection />, link: `/word-forms?unit=${unit}&level=${level}`, color: '', shadow: '' },
    { id: 'definition-to-word', title: 'Tanımdan Kelime', icon: <HiBookOpen />, link: `/definition-to-word?unit=${unit}&level=${level}`, color: '', shadow: '' },
    { id: 'paraphrase', title: 'Paraphrase', icon: <HiSpeakerphone />, link: `/paraphrase`, color: '', shadow: '' },
    { id: 'essay-writing', title: 'Essay Yazma', icon: <HiDocumentText />, link: '/essay-writing', color: '', shadow: '' },
    { id: 'preposition-mastery', title: 'Preposition', icon: <HiPuzzle />, link: '/preposition-mastery', color: '', shadow: '' },
    { id: 'flashcard', title: 'Kelime Kartları', icon: <HiCollection />, link: `/flashcard?unit=${unit}&level=${level}`, color: '', shadow: '' },
    { id: 'word-race', title: 'Kelime Yarışı', icon: <HiLightningBolt />, link: `/word-race?unit=${unit}&level=${level}`, color: '', shadow: '' },
    { id: 'speaking', title: 'Konuşma', icon: <HiMicrophone />, link: `/speaking?unit=${unit}&level=${level}`, color: '', shadow: '' },
  ];

  const headingLines = [
    <>
      <div className="text-center">
        <div className="mb-2">
          <span className="text-white text-9xl font-bebas tracking-wider uppercase drop-shadow font-extrabold">ELC </span>
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
        <div className="text-white font-bebas text-6xl md:text-7xl tracking-wider uppercase">
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
              <HiUserGroup className="w-4 h-4" />
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
              <HiAcademicCap className="w-4 h-4" />
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
    <div className="min-h-screen bg-gradient-to-br from-[#080b16] via-[#0a0d1a] to-[#01020a] text-gray-100 overflow-x-hidden relative">
      {/* Sabit beyaz küçük yıldızlar */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute w-1 h-1 bg-white rounded-full" style={{ left: '12%', top: '18%' }} />
        <div className="absolute w-0.5 h-0.5 bg-white rounded-full" style={{ left: '40%', top: '30%' }} />
        <div className="absolute w-0.5 h-0.5 bg-white rounded-full" style={{ left: '70%', top: '12%' }} />
        <div className="absolute w-1 h-1 bg-white rounded-full" style={{ left: '80%', top: '40%' }} />
        <div className="absolute w-0.5 h-0.5 bg-white rounded-full" style={{ left: '60%', top: '70%' }} />
      </div>
      {/* Hafif mavi bulut efekti */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] rounded-full bg-[#1a233a]/40 blur-3xl" />
      </div>
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
        {/* Büyük glow efektli yıldızlar */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`glow-star-${i}`}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: `${120 + Math.random() * 100}px`,
              height: `${120 + Math.random() * 100}px`,
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              background: 'radial-gradient(circle, #fff 0%, #2a1a5a 40%, #0a0120 100%)',
              opacity: 0.10 + Math.random() * 0.15,
              filter: 'blur(16px)'
            }}
            animate={{ opacity: [0.08, 0.18, 0.08] }}
            transition={{ duration: 8 + Math.random() * 4, repeat: Infinity, repeatType: 'reverse', delay: Math.random() * 4 }}
          />
        ))}
        {/* Mor-mavi bulutlar */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`cloud-${i}`}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: `${300 + Math.random() * 200}px`,
              height: `${180 + Math.random() * 120}px`,
              left: `${5 + Math.random() * 80}%`,
              top: `${20 + Math.random() * 60}%`,
              background: 'radial-gradient(circle, #2a1a5a 0%, #0a0120 60%, transparent 100%)',
              opacity: 0.08 + Math.random() * 0.10,
              filter: 'blur(60px)'
            }}
            animate={{ opacity: [0.06, 0.14, 0.06] }}
            transition={{ duration: 12 + Math.random() * 6, repeat: Infinity, repeatType: 'reverse', delay: Math.random() * 6 }}
          />
        ))}
      </div>

      <main className="w-full px-2 sm:px-4 lg:px-8 py-10 relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative mb-10 text-left"
        >
          <div className="max-w-xl ml-0 md:ml-16">
            <motion.h1
              className="text-6xl md:text-9xl font-extrabold tracking-wider font-bebas uppercase mb-4 drop-shadow-[0_0_18px_rgba(0,190,255,0.25)] text-center leading-tight"
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              {headingLines.map((line, lineIndex) => (
                <span className="block" key={lineIndex}>{line}</span>
              ))}
            </motion.h1>
            
            {/* Mobilde başlığın hemen altında Oyun Modları butonu */}
            <motion.div
              className="flex justify-center mb-6 md:hidden"
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
                <HiAcademicCap className="w-8 h-8 text-red-500 drop-shadow-lg" />
                <span className="text-sm text-gray-400 mt-2 font-medium">Oyun Modları</span>
              </motion.button>
            </motion.div>
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
            src={logo}
            alt="WordPlay Logo"
            className="absolute top-[-2rem] left-[40rem] w-[28rem] lg:w-[700px] h-auto hidden md:block pointer-events-none drop-shadow-[0_0_24px_rgba(255,0,80,0.5)]"
            style={{ filter: 'drop-shadow(0 0 24px #ff0080)' }}
            animate={{ scale: [1, 1.01, 1], filter: [
              'drop-shadow(0 0 24px #ff0080)',
              'drop-shadow(0 0 26px #ff0080)',
              'drop-shadow(0 0 24px #ff0080)'
            ] }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 2.2,
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
                    <HiX className="w-6 h-6" />
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

        {/* Oyun Modları Görseldeki Bordo-Siyah Kartlar */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-12 mt-4">
          {gameModes.map((mode, idx) => {
            // Her karta çok hafif farklı bir transparan pastel renk
            const pastelGradients = [
              'from-[#ff416c]/10 to-[#ff4b2b]/10',
              'from-[#42e695]/10 to-[#3bb2b8]/10',
              'from-[#4776e6]/10 to-[#8e54e9]/10',
              'from-[#f7971e]/10 to-[#ffd200]/10',
              'from-[#f953c6]/10 to-[#b91d73]/10',
              'from-[#43cea2]/10 to-[#185a9d]/10',
            ];
            const pastelBg = pastelGradients[idx % pastelGradients.length];
            // Başlığa göre dosya adı eşleştirme
            const imageMap: Record<string, string> = {
              'Öğretici Mod': 'ogrenmemodu.jpg',
              'Çoktan Seçmeli': 'coktansecmeli.jpg',
              'Eşleştirme': 'eşeştirme.jpg',
              'Boşluk Doldurma': 'boslukdoldurma.jpg',
              'Kelime Formları': 'wordform.jpg',
              'Tanımdan Kelime': 'tanım.jpg',
              'Paraphrase': 'parapprase.jpg',
              'Essay Yazma': 'essay.jpg',
              'Preposition': 'preposition.jpg',
              'Kelime Kartları': 'kelimekartlari.jpg',
              'Kelime Yarışı': 'kelimeyarisi.jpg',
              'Konuşma': 'konusma.jpg', // örnek, png de olabilir
            };
            const imgSrc = imageMap[mode.title] ? `/assets/aaaaaaaadwü/${imageMap[mode.title]}` : '';
            // Bordo-kırmızı/siyah gradient
            const bgGradient = 'from-[#2a0618] via-[#a10d2f] to-[#1a0105]';
            return (
              <Link to={mode.link} key={mode.id} className={`relative group rounded-xl overflow-hidden shadow-lg border-2 border-white/10 bg-black/30 bg-gradient-to-br ${pastelBg} flex flex-col backdrop-blur-md transition-all duration-200 hover:scale-105 cursor-pointer p-2 md:p-3`}>
                {/* Başlık kartın en üstünde */}
                <div className="w-full flex justify-center pt-2 pb-2 z-30">
                  <span className="text-3xl md:text-5xl font-extrabold font-bebas uppercase drop-shadow-lg text-white text-center px-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                    {mode.title}
                  </span>
                </div>
                {/* Güçlü transparan border */}
                <div className="absolute inset-0 z-10 rounded-xl pointer-events-none border-2 border-white/20 group-hover:border-[#ff416c]/60 transition-all duration-300" />
                {/* Görsel ve başlık */}
                <div className="relative w-full aspect-[1/1] min-h-[16px] md:min-h-[28px] overflow-hidden flex flex-col justify-center items-center"> 
                  <Link to={mode.link} className="absolute inset-0 w-full h-full z-10">
                    <img src={imgSrc} alt="Oyun görseli" className="w-full h-full object-cover object-center rounded-t-xl transition-transform duration-300 group-hover:scale-110 group-hover:brightness-110" />
                  </Link>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
      {/* Sabit sağ alt köşede, dikkat çekmeyen bir şekilde */}
      <div className="fixed bottom-2 right-3 z-50 pointer-events-none select-none">
        <span className="text-xs text-gray-400 dark:text-gray-600 tracking-wide opacity-70">made by Miraç Birlik</span>
      </div>
    </div>
  );
};

export default HomePage;