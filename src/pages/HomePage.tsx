import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiAcademicCap, HiClipboardList, HiCollection, HiDocumentText, HiSwitchHorizontal, HiLightBulb, HiPuzzle, HiSpeakerphone, HiBookOpen, HiLightningBolt, HiMicrophone, HiUserGroup, HiX, HiChevronDown, HiMinus, HiChevronUp } from 'react-icons/hi';
import { FaCheckCircle } from 'react-icons/fa';
// import icoLogo from './ico.png';
import { newDetailedWords_part1 } from '../data/words';
import { detailedWords_part1 as upperIntermediateWordsRaw, WordDetail } from '../data/word4';
import { gameStateManager } from '../lib/utils';
import { userService } from '../services/userService';
import { authService } from '../services/authService';
import { Trophy } from 'lucide-react';
import { collection, getDocs, getFirestore, orderBy, query, onSnapshot } from 'firebase/firestore';
import app from '../config/firebase';
import SupportModal from '../components/SupportModal';
import FeedbackButton from '../components/FeedbackButton';

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
  const [showLeaderboard, setShowLeaderboard] = useState(true); // leaderboard açık/kapalı
  // Liderlik verisi
  const [topUsers, setTopUsers] = useState<{displayName:string, photoURL?:string, totalScore:number}[]>([]);

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

  useEffect(() => {
    const db = getFirestore(app);
    const q = query(collection(db, 'userProfiles'), orderBy('totalScore', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let fetched = querySnapshot.docs.map(doc => {
        const d = doc.data();
        return {
          displayName: d.displayName || '',
          photoURL: d.photoURL || undefined,
          totalScore: d.totalScore || 0,
          userId: doc.id,
        };
      });
      // Emir'in userId'si
      const emirId = 'dZFMjEqoTDTJCMyiNmQ3cMaCqx83';
      fetched = fetched.map(u =>
        u.userId === emirId ? { ...u, totalScore: (u.totalScore || 0) + 11000 } : u
      );
      // Sıralamayı güncel puana göre yap
      fetched = fetched.filter(u => u.displayName && u.displayName.trim() !== '').sort((a, b) => b.totalScore - a.totalScore);
      setTopUsers(fetched.slice(0, 5)); // Artık ilk 5 kullanıcıyı alıyoruz
    });
    return () => unsubscribe();
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
    {
      id: 'grammar-game',
      title: 'Gramer Oyunu',
      icon: <HiBookOpen className="w-8 h-8 text-indigo-500" />,
      link: '/grammar-game',
      color: 'from-indigo-500 to-blue-500',
      shadow: 'shadow-indigo-500/30',
    },
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

  // PRO rozeti SVG
  const ProBadge = (
    <span className="inline-block align-middle ml-1" style={{verticalAlign:'middle'}}>
      <svg width="2em" height="2em" viewBox="0 0 40 40" style={{display:'inline-block'}}>
        <circle cx="20" cy="20" r="18" fill="#22c55e" />
        <polygon points="20,8 23,17 32,17 25,22 27,31 20,26 13,31 15,22 8,17 17,17" fill="#fff" />
      </svg>
    </span>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#070a1a] via-[#0a0d1a] to-[#01020a] text-gray-100 overflow-hidden relative pt-8 md:pt-14">
      <FeedbackButton />
      {/* Masaüstü: başlık ve mini leaderboard yan yana, mobilde alt alta */}
      <div className="w-full flex flex-col md:flex-row md:items-start md:justify-center gap-8 md:gap-16 px-2 md:px-8 max-w-7xl mx-auto pt-0 md:pt-1">
        {/* Başlık ve açıklama */}
        <div className="flex-1">
          <h1 className="text-6xl md:text-9xl font-extrabold tracking-wider font-bebas uppercase mb-4 drop-shadow-[0_0_18px_rgba(0,190,255,0.25)] text-center md:text-left leading-tight">
            {headingLines.map((line, lineIndex) => (
              <span className="block" key={lineIndex}>{line}</span>
            ))}
          </h1>
          <p className="mt-6 mb-8 text-base text-gray-300 font-inter leading-relaxed text-center md:text-left">
            Koç Üniversitesi ELC'nin güncel kelime listeleriyle tam uyumlu, öğrenme sürecinizi hızlandırmak için tasarlanmış interaktif alıştırmalarla İngilizce'nizi geliştirin.<br/>
            <span className="block mt-2 text-sm text-gray-400 font-semibold opacity-60">Bu site Koç Üniversitesi'nin resmi sitesi değildir, bağımsız bir girişimdir.</span>
          </p>
        </div>
        {/* Mini Leaderboard */}
        {topUsers.length >= 3 && (
          <div className="flex-1 max-w-md md:max-w-lg lg:max-w-xl mx-auto md:mx-0 mb-2 md:mb-0 md:mt-0 flex flex-col items-center p-4 md:p-2 bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-3xl border-2 border-gray-700 shadow-2xl scale-105 md:scale-110 relative md:py-2">
            {/* Küçült butonu sadece masaüstünde */}
            <button
              className="absolute top-2 right-2 md:block hidden z-20 bg-gray-800/80 hover:bg-gray-700 text-gray-300 rounded-full p-1 transition-all"
              onClick={() => setShowLeaderboard((v) => !v)}
              title={showLeaderboard ? 'Küçült' : 'Büyüt'}
            >
              {showLeaderboard ? <HiMinus className="w-5 h-5" /> : <HiChevronUp className="w-5 h-5" />}
            </button>
            {/* Eğer küçültülmüşse sadece ikon ve "Leaderboard" yazısı göster */}
            {!showLeaderboard ? (
              <div className="flex flex-col items-center justify-center w-full h-24 cursor-pointer select-none" onClick={() => setShowLeaderboard(true)}>
                <Trophy className="w-8 h-8 text-yellow-400 mb-1" />
                <span className="text-base font-bold text-gray-200">Leaderboard</span>
                <span className="text-xs text-gray-400">Büyütmek için tıkla</span>
              </div>
            ) : (
              <>
                <div className="w-full text-center mb-5 md:mb-2">
                  <span className="text-2xl md:text-xl font-black text-white tracking-wide uppercase drop-shadow">Leaderboard</span>
                </div>
                <div className="flex items-end justify-center gap-4 md:gap-3 mb-2 md:mb-1">
                  {/* 2. Kullanıcı */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-10 h-10 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-purple-200 to-purple-400 flex items-center justify-center overflow-hidden border-2 border-purple-300 mb-1">
                      {topUsers[1]?.photoURL ? (
                        <img src={topUsers[1].photoURL} alt={topUsers[1].displayName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-base md:text-sm font-bold text-purple-600">{topUsers[1]?.displayName?.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <span className="text-xs md:text-xs font-extrabold text-purple-300 text-center w-full tracking-wide" style={{letterSpacing:'0.04em'}}>{topUsers[1]?.displayName?.toUpperCase()}</span>
                    <span className="text-base md:text-base font-extrabold text-white text-center w-full">{topUsers[1]?.totalScore}</span>
                    <span className="mt-1 text-xs bg-purple-400 text-white rounded-full px-2 py-0.5 font-bold">2</span>
                  </div>
                  {/* 1. Kullanıcı */}
                  <div className="flex flex-col items-center flex-1 z-10">
                    <div className="w-20 h-20 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-yellow-200 via-yellow-400 to-orange-400 flex items-center justify-center overflow-hidden border-4 border-yellow-300 mb-1 shadow-lg relative" style={{boxShadow:'0 0 32px 8px #ffd70088, 0 0 0 6px #fffbe6cc'}}>
                      {/* Altın parlama efekti */}
                      <div className="absolute inset-0 rounded-full pointer-events-none animate-pulse" style={{boxShadow:'0 0 32px 12px #ffd70088, 0 0 0 8px #fffbe644'}}></div>
                      {topUsers[0]?.photoURL ? (
                        <img src={topUsers[0].photoURL} alt={topUsers[0].displayName} className="w-full h-full object-cover relative z-10" />
                      ) : (
                        <span className="text-3xl md:text-2xl font-extrabold text-yellow-700 relative z-10">{topUsers[0]?.displayName?.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <span className="text-base md:text-base font-extrabold text-yellow-300 text-center w-full tracking-wide" style={{letterSpacing:'0.04em'}}>{topUsers[0]?.displayName?.toUpperCase()}</span>
                    <span className="text-2xl md:text-xl font-extrabold text-white text-center w-full">{topUsers[0]?.totalScore}</span>
                    <span className="mt-1 text-xs bg-yellow-400 text-yellow-900 rounded-full px-2 py-0.5 font-bold">1</span>
                  </div>
                  {/* 3. Kullanıcı */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-8 h-8 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-pink-200 to-pink-400 flex items-center justify-center overflow-hidden border-2 border-pink-300 mb-1">
                      {topUsers[2]?.photoURL ? (
                        <img src={topUsers[2].photoURL} alt={topUsers[2].displayName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs md:text-xs font-bold text-pink-600">{topUsers[2]?.displayName?.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <span className="text-xs md:text-xs font-extrabold text-pink-300 text-center w-full tracking-wide" style={{letterSpacing:'0.04em'}}>{topUsers[2]?.displayName?.toUpperCase()}</span>
                    <span className="text-sm md:text-xs font-extrabold text-white text-center w-full">{topUsers[2]?.totalScore}</span>
                    <span className="mt-1 text-xs bg-pink-400 text-white rounded-full px-2 py-0.5 font-bold">3</span>
                  </div>
                </div>
                {/* 4 ve 5. kullanıcılar için ek liste */}
                {(topUsers[3] || topUsers[4]) && (
                  <div className="w-full mt-2 md:mt-1">
                    <ul className="divide-y divide-gray-700">
                      {topUsers.slice(3, 5).map((user, idx) => (
                        <li key={user.displayName} className="flex items-center py-2 md:py-1 gap-3">
                          <div className={`w-8 h-8 md:w-7 md:h-7 rounded-full flex items-center justify-center overflow-hidden border-2 ${idx === 0 ? 'border-blue-400' : 'border-green-400'} bg-gray-800`}>
                            {user.photoURL ? (
                              <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                            ) : (
                              <span className={`text-base md:text-sm font-bold ${idx === 0 ? 'text-blue-400' : 'text-green-400'}`}>{user.displayName.charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                          <span className="flex-1 text-sm md:text-xs font-semibold text-gray-200 truncate">{user.displayName}</span>
                          <span className="text-base md:text-xs font-bold text-gray-100">{user.totalScore}</span>
                          <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-bold ${idx === 0 ? 'bg-blue-400 text-white' : 'bg-green-400 text-white'}`}>{idx + 4}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <button onClick={()=>navigate('/leaderboard')} className="mt-2 md:mt-1 px-4 py-1 md:px-3 md:py-1 rounded-full bg-gray-900 border border-gray-600 text-gray-200 text-xs md:text-xs font-semibold hover:bg-gray-800 hover:text-white transition-all">Tümünü Gör</button>
              </>
            )}
          </div>
        )}
      </div>
      {/* Masaüstü için destek kutusu (başlık ve leaderboarddan sonra, oyun modlarının üstünde) */}
      <div className="hidden md:block w-full max-w-5xl mx-auto mt-8 mb-8">
        <div className="bg-green-100 border border-green-400 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center">
          <div className="text-red-600 text-2xl font-extrabold mb-3">ÜCRETSİZ <span className="text-green-900 font-black">AMA</span></div>
          <div className="text-green-900 mb-4 text-lg">Uygulama tamamen ücretsiz; <span className="font-bold text-green-700">ama</span> yayında kalması ve gelişmesi için desteğe ihtiyacımız var.<br/>Küçük bir katkı bile çok değerli!<br/>{ProBadge} ile bize destek olabilirsin.</div>
          <a href="https://www.shopier.com/37829492" target="_blank" rel="noopener noreferrer" className="inline-block bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:from-green-600 hover:to-green-700 text-white font-extrabold py-5 px-16 rounded-full shadow-2xl transition text-2xl mt-4 animate-bounce-slow animate-pulse-bright">
            <span className="mr-3 align-middle" style={{display:'inline-block', verticalAlign:'middle', width:'2em', height:'2em', position:'relative'}}>
              <svg fill="#fff" stroke="#fff" width="1.7em" height="1.7em" viewBox="144 144 512 512" xmlns="http://www.w3.org/2000/svg" style={{position:'relative', zIndex:1}}>
                <g><g>
                  <circle cx="456" cy="312" r="28" fill="#FFD700" stroke="#FFD700" strokeWidth="4" />
                  <path d="m456.32 424.81c-62.145 0-112.7-50.559-112.7-112.7s50.559-112.7 112.7-112.7 112.7 50.559 112.7 112.7-50.559 112.7-112.7 112.7zm0-201.38c-48.895 0-88.672 39.777-88.672 88.672s39.777 88.672 88.672 88.672 88.672-39.777 88.672-88.672-39.777-88.672-88.672-88.672z"></path>
                  <path d="m602.1 468.29c-7.3555-16.652-27.055-24.285-47.887-18.566l-0.32812 0.074219c-0.60547 0.125-1.5352 0.35156-2.5938 0.70703-12.293 4.2305-30.102 10.73-47.281 17.004-9.168 3.3516-18.539 6.7773-27.055 9.8477-2.3672-12.543-11.285-22.695-24.105-26.047-19.723-5.1875-38.113-13.227-57.586-21.766-10.277-4.5078-20.906-9.1445-31.664-13.301-26.375-10.176-51.891-9.2695-75.824 2.6953-10.957 5.4648-21.867 10.984-32.797 16.473-16.098 8.1133-32.746 16.5-49.172 24.609-2.3438 1.1602-9.5234 4.6836-11.992 12.621-2.4688 7.9336 1.3867 14.887 2.6719 17.18l3.3008 5.9453c8.8438 15.871 17.961 32.293 25.996 48.719 2.7461 5.6172 7.4297 13.402 16.172 15.844 9.5469 2.6719 17.938-2.7188 20.68-4.4844 12.043-7.7344 23.301-7.4062 37.633 1.0586 23.25 13.73 41.766 23.301 60.055 31.008 11.715 4.9375 23.199 7.4297 34.637 7.4297 9.8984 0 19.75-1.8633 29.676-5.543 22.598-8.4141 44.16-18.363 69.602-30.73l6.4219-3.125c26.324-12.797 53.531-25.996 80.105-39.5 21.16-10.719 29.523-29.637 21.336-48.152zm-32.219 26.754c-26.375 13.402-53.504 26.574-79.727 39.324l-6.4219 3.125c-24.812 12.066-45.797 21.738-67.484 29.824-15.617 5.8203-30.406 5.3398-46.578-1.4844-17.254-7.2812-34.891-16.398-57.184-29.574-11.184-6.6016-22.141-9.9258-32.797-9.9258-10.328 0-20.355 3.0977-30.027 9.2969-0.40234 0.25-0.73047 0.45312-1.0586 0.62891-0.35156-0.57812-0.75391-1.3359-1.2578-2.3438-8.3125-17.004-17.609-33.703-26.602-49.852l-2.0391-3.6523c15.742-7.7852 31.641-15.793 47.031-23.555 10.906-5.4922 21.816-10.984 32.723-16.449 17.887-8.9414 36.352-9.5234 56.453-1.7617 10.277 3.9531 20.656 8.4883 30.684 12.898 19.445 8.5156 39.574 17.332 61.113 22.973 6.0469 1.5859 7.332 7.3789 6.6016 11.863-0.90625 5.4922-6.8281 6.9258-11.664 7.1289-1.1836 0.050782-2.4922 0.023438-3.9062 0.023438-0.60547 0-1.1836 0-1.7891-0.023438-3.6523-0.42969-57.156-6.5742-84.793-10-0.78125-0.20312-1.7617-0.37891-2.9492-0.42969h-0.37891c-6.4727 0-11.812 5.1406-11.992 11.664-0.17578 5.9961 4.0547 11.082 9.75 12.168 0.48047 0.125 1.1094 0.27734 1.8633 0.35156 15.871 1.9648 38.34 4.6367 54.059 6.5 9.0195 1.0586 17.156 2.0156 23.023 2.6719 2.9727 0.32812 5.3672 0.60547 7.0273 0.78125 1.2852 0.15234 2.5703 0.27734 3.8281 0.27734h0.050781v0.050781c0.65625 0 1.3086 0 1.9648 0.023437 0.75391 0 1.5117 0.023438 2.2656 0.023438 0.95703 0 1.9648-0.023438 2.9961-0.050782 11.84-0.52734 21.461-5.0117 27.559-12.316 11.613-4.0547 26.98-9.6719 41.918-15.141 17.004-6.2227 34.562-12.621 46.629-16.777l0.25-0.050782c0.48047-0.10156 0.95703-0.22656 1.4375-0.35156 9.1172-2.4922 17.18-0.40234 19.598 5.0898 3.6055 8.0078-3.5508 13.699-10.176 17.051z"></path>
                  <path d="m496.33 285.16c-3.1758-3.4258-9.0938-5.4922-15.289-0.074219-1.6367 1.4375-3.0742 2.9219-4.4844 4.3828l-10.328 10.68c-4.5859 4.7344-4.5859 4.7344-9.6992 10l-11.109 11.461-1.8125-1.8125c-1.8633-1.8633-3.6289-3.7031-5.4141-5.5664l-0.42969-0.42969c-1.5859-1.6641-3.1992-3.3008-4.8125-4.9375-2.7969-2.8477-5.8203-4.3086-8.9414-4.3086-1.9414 0-4.8359 0.57812-7.5586 3.3516-1.7383 1.7617-6.8281 8.1875 1.082 16.449 4.7109 4.9375 9.4727 9.8242 14.207 14.711l4.3086 4.457c1.9141 1.9648 4.6367 4.2812 8.793 4.6094l0.27734 0.023438h0.27734c5.0898-0.050782 8.0625-3.2734 9.8242-5.2148 0.22656-0.25 0.45312-0.50391 0.67969-0.73047l16.879-17.434c4.6602-4.7852 7.5312-7.7578 20.73-21.41 0.75391-0.78125 1.5117-1.5859 2.2656-2.3945 4.6328-4.9805 4.8594-11.203 0.55469-15.812z"></path>
                </g></g>
              </svg>
            </span>
            Destek Ol
          </a>
          {/* Shopier onay satırı - masaüstü */}
          <div className="flex items-center justify-center mt-2">
            <span className="text-black font-normal italic text-xs font-sans flex items-center">Shopier tarafından onaylanmıştır <img src="/assets/aaaaaaaadwü/shield_9623201.png" alt="onaylı" className="ml-1 w-4 h-4 inline-block align-middle" /></span>
          </div>
          <div className="text-sm text-green-800 mt-3">(Destek olanlara uygulama içinde {ProBadge})</div>
        </div>
      </div>
      {/* Mobil için destek kutusu (eski yeri) */}
      <div className="block md:hidden w-full max-w-2xl mx-auto mt-6 mb-8">
        <div className="bg-green-100 border border-green-400 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center">
          <div className="text-red-600 text-xl font-extrabold mb-2">ÜCRETSİZ <span className="text-green-900 font-black">AMA</span></div>
          <div className="text-green-900 mb-3 text-base">Uygulama tamamen ücretsiz; <span className="font-bold text-green-700">ama</span> yayında kalması ve gelişmesi için desteğe ihtiyacımız var.<br/>Küçük bir katkı bile çok değerli!<br/>{ProBadge} ile bize destek olabilirsin.</div>
          <a href="https://www.shopier.com/37829492" target="_blank" rel="noopener noreferrer" className="inline-block bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:from-green-600 hover:to-green-700 text-white font-extrabold py-4 px-12 rounded-full shadow-2xl transition text-2xl mt-4 animate-bounce-slow animate-pulse-bright">
            <span className="mr-3 align-middle" style={{display:'inline-block', verticalAlign:'middle', width:'2em', height:'2em'}}>
              <svg fill="#fff" stroke="#fff" width="1.7em" height="1.7em" viewBox="144 144 512 512" xmlns="http://www.w3.org/2000/svg">
                <g><g><path d="m456.32 424.81c-62.145 0-112.7-50.559-112.7-112.7s50.559-112.7 112.7-112.7 112.7 50.559 112.7 112.7-50.559 112.7-112.7 112.7zm0-201.38c-48.895 0-88.672 39.777-88.672 88.672s39.777 88.672 88.672 88.672 88.672-39.777 88.672-88.672-39.777-88.672-88.672-88.672z"></path><path d="m602.1 468.29c-7.3555-16.652-27.055-24.285-47.887-18.566l-0.32812 0.074219c-0.60547 0.125-1.5352 0.35156-2.5938 0.70703-12.293 4.2305-30.102 10.73-47.281 17.004-9.168 3.3516-18.539 6.7773-27.055 9.8477-2.3672-12.543-11.285-22.695-24.105-26.047-19.723-5.1875-38.113-13.227-57.586-21.766-10.277-4.5078-20.906-9.1445-31.664-13.301-26.375-10.176-51.891-9.2695-75.824 2.6953-10.957 5.4648-21.867 10.984-32.797 16.473-16.098 8.1133-32.746 16.5-49.172 24.609-2.3438 1.1602-9.5234 4.6836-11.992 12.621-2.4688 7.9336 1.3867 14.887 2.6719 17.18l3.3008 5.9453c8.8438 15.871 17.961 32.293 25.996 48.719 2.7461 5.6172 7.4297 13.402 16.172 15.844 9.5469 2.6719 17.938-2.7188 20.68-4.4844 12.043-7.7344 23.301-7.4062 37.633 1.0586 23.25 13.73 41.766 23.301 60.055 31.008 11.715 4.9375 23.199 7.4297 34.637 7.4297 9.8984 0 19.75-1.8633 29.676-5.543 22.598-8.4141 44.16-18.363 69.602-30.73l6.4219-3.125c26.324-12.797 53.531-25.996 80.105-39.5 21.16-10.719 29.523-29.637 21.336-48.152zm-32.219 26.754c-26.375 13.402-53.504 26.574-79.727 39.324l-6.4219 3.125c-24.812 12.066-45.797 21.738-67.484 29.824-15.617 5.8203-30.406 5.3398-46.578-1.4844-17.254-7.2812-34.891-16.398-57.184-29.574-11.184-6.6016-22.141-9.9258-32.797-9.9258-10.328 0-20.355 3.0977-30.027 9.2969-0.40234 0.25-0.73047 0.45312-1.0586 0.62891-0.35156-0.57812-0.75391-1.3359-1.2578-2.3438-8.3125-17.004-17.609-33.703-26.602-49.852l-2.0391-3.6523c15.742-7.7852 31.641-15.793 47.031-23.555 10.906-5.4922 21.816-10.984 32.723-16.449 17.887-8.9414 36.352-9.5234 56.453-1.7617 10.277 3.9531 20.656 8.4883 30.684 12.898 19.445 8.5156 39.574 17.332 61.113 22.973 6.0469 1.5859 7.332 7.3789 6.6016 11.863-0.90625 5.4922-6.8281 6.9258-11.664 7.1289-1.1836 0.050782-2.4922 0.023438-3.9062 0.023438-0.60547 0-1.1836 0-1.7891-0.023438-3.6523-0.42969-57.156-6.5742-84.793-10-0.78125-0.20312-1.7617-0.37891-2.9492-0.42969h-0.37891c-6.4727 0-11.812 5.1406-11.992 11.664-0.17578 5.9961 4.0547 11.082 9.75 12.168 0.48047 0.125 1.1094 0.27734 1.8633 0.35156 15.871 1.9648 38.34 4.6367 54.059 6.5 9.0195 1.0586 17.156 2.0156 23.023 2.6719 2.9727 0.32812 5.3672 0.60547 7.0273 0.78125 1.2852 0.15234 2.5703 0.27734 3.8281 0.27734h0.050781v0.050781c0.65625 0 1.3086 0 1.9648 0.023437 0.75391 0 1.5117 0.023438 2.2656 0.023438 0.95703 0 1.9648-0.023438 2.9961-0.050782 11.84-0.52734 21.461-5.0117 27.559-12.316 11.613-4.0547 26.98-9.6719 41.918-15.141 17.004-6.2227 34.562-12.621 46.629-16.777l0.25-0.050782c0.48047-0.10156 0.95703-0.22656 1.4375-0.35156 9.1172-2.4922 17.18-0.40234 19.598 5.0898 3.6055 8.0078-3.5508 13.699-10.176 17.051z"></path><path d="m496.33 285.16c-3.1758-3.4258-9.0938-5.4922-15.289-0.074219-1.6367 1.4375-3.0742 2.9219-4.4844 4.3828l-10.328 10.68c-4.5859 4.7344-4.5859 4.7344-9.6992 10l-11.109 11.461-1.8125-1.8125c-1.8633-1.8633-3.6289-3.7031-5.4141-5.5664l-0.42969-0.42969c-1.5859-1.6641-3.1992-3.3008-4.8125-4.9375-2.7969-2.8477-5.8203-4.3086-8.9414-4.3086-1.9414 0-4.8359 0.57812-7.5586 3.3516-1.7383 1.7617-6.8281 8.1875 1.082 16.449 4.7109 4.9375 9.4727 9.8242 14.207 14.711l4.3086 4.457c1.9141 1.9648 4.6367 4.2812 8.793 4.6094l0.27734 0.023438h0.27734c5.0898-0.050782 8.0625-3.2734 9.8242-5.2148 0.22656-0.25 0.45312-0.50391 0.67969-0.73047l16.879-17.434c4.6602-4.7852 7.5312-7.7578 20.73-21.41 0.75391-0.78125 1.5117-1.5859 2.2656-2.3945 4.6328-4.9805 4.8594-11.203 0.55469-15.812z"></path></g></g></svg>
            </span>
            Destek Ol
          </a>
          {/* Shopier onay satırı - mobil */}
          <div className="flex items-center justify-center mt-2">
            <span className="text-black font-normal italic text-xs font-sans flex items-center">Shopier tarafından onaylanmıştır <img src="/assets/aaaaaaaadwü/shield_9623201.png" alt="onaylı" className="ml-1 w-4 h-4 inline-block align-middle" /></span>
          </div>
          <div className="text-xs text-green-800 mt-2">(Destek olanlara uygulama içinde {ProBadge})</div>
        </div>
      </div>
      {/* Sabit beyaz küçük yıldızlar */}
      {/* Derinlik için birden fazla yıldız katmanı */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Uzak, çok küçük yıldızlar */}
        {[...Array(120)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-30"
            style={{
              width: `${Math.random() * 1 + 0.5}px`,
              height: `${Math.random() * 1 + 0.5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(0.5px)'
            }}
          />
        ))}
        {/* Orta katman yıldızlar */}
        {[...Array(40)].map((_, i) => (
          <div
            key={`mid-${i}`}
            className="absolute rounded-full bg-blue-200 opacity-50"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(1.2px)'
            }}
          />
        ))}
        {/* Yakın, parlak yıldızlar */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`close-${i}`}
            className="absolute rounded-full bg-white opacity-80 shadow-lg"
            style={{
              width: `${Math.random() * 3 + 2}px`,
              height: `${Math.random() * 3 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(0.5px)'
            }}
          />
        ))}
      </div>
      {/* Nebula ve galaksi efektleri için ekstra katmanlar */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Büyük mor bulutlar */}
        {[...Array(2)].map((_, i) => (
          <div
            key={`nebula-purple-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${600 + Math.random() * 300}px`,
              height: `${300 + Math.random() * 200}px`,
              left: `${10 + Math.random() * 70}%`,
              top: `${10 + Math.random() * 70}%`,
              background: 'radial-gradient(circle, #a259ff55 0%, #2a1a5a33 60%, transparent 100%)',
              opacity: 0.18 + Math.random() * 0.10,
              filter: 'blur(60px)'
            }}
          />
        ))}
        {/* Büyük mavi bulutlar */}
        {[...Array(2)].map((_, i) => (
          <div
            key={`nebula-blue-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${500 + Math.random() * 300}px`,
              height: `${250 + Math.random() * 200}px`,
              left: `${10 + Math.random() * 70}%`,
              top: `${10 + Math.random() * 70}%`,
              background: 'radial-gradient(circle, #00c3ff44 0%, #1a233a33 60%, transparent 100%)',
              opacity: 0.13 + Math.random() * 0.10,
              filter: 'blur(60px)'
            }}
          />
        ))}
        {/* Hafif pembe galaksi izi */}
        <div
          className="absolute rounded-full"
          style={{
            width: '900px',
            height: '200px',
            left: '30%',
            top: '60%',
            background: 'radial-gradient(circle, #ff61a6aa 0%, #0a0d1a00 80%)',
            opacity: 0.10,
            filter: 'blur(80px)'
          }}
        />
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
      {/* Gezegenler: Farklı boyut, renk ve konumda, derinlik için blur ve opacity ile */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Uzak, saydam mavi gezegen */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '90px',
            height: '90px',
            left: '12%',
            top: '7%',
            background: 'radial-gradient(circle at 60% 40%, #4fd1ff 0%, #1a2a4a 90%)',
            boxShadow: '0 0 40px 8px #4fd1ff33',
            opacity: 0.22,
            filter: 'blur(2.5px)'
          }}
          animate={{ y: [0, 10, 0], scale: [1, 1.03, 1] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Masaüstü için: Ay benzeri gezegen */}
        <motion.div
          className="absolute rounded-full hidden md:block"
          style={{
            width: '80px',
            height: '80px',
            left: '78%',
            top: '2%',
            background: 'radial-gradient(circle at 60% 40%, #e0e7ef 0%, #bfc9d6 60%, #7a8596 100%)',
            boxShadow: '0 0 60px 12px #bfc9d655, 0 0 120px 24px #e0e7ef22',
            opacity: 0.22,
            filter: 'blur(1.8px)'
          }}
          animate={{
            scale: [1, 1.06, 1],
            filter: [
              'blur(1.8px) brightness(1)',
              'blur(2.2px) brightness(1.08)',
              'blur(1.8px) brightness(1)'
            ]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Kraterler */}
          <div style={{position:'absolute', left:'22px', top:'18px', width:'13px', height:'13px', borderRadius:'50%', background:'radial-gradient(circle, #bfc9d6 60%, transparent 100%)', opacity:0.18}} />
          <div style={{position:'absolute', left:'48px', top:'36px', width:'8px', height:'8px', borderRadius:'50%', background:'radial-gradient(circle, #7a8596 60%, transparent 100%)', opacity:0.22}} />
          <div style={{position:'absolute', left:'30px', top:'54px', width:'6px', height:'6px', borderRadius:'50%', background:'radial-gradient(circle, #bfc9d6 60%, transparent 100%)', opacity:0.13}} />
        </motion.div>
        {/* Mobil için: Ay benzeri gezegen */}
        <motion.div
          className="absolute rounded-full md:hidden"
          style={{
            width: '38px',
            height: '38px',
            right: '6px',
            top: '6px',
            background: 'radial-gradient(circle at 60% 40%, #e0e7ef 0%, #bfc9d6 60%, #7a8596 100%)',
            boxShadow: '0 0 18px 4px #bfc9d655, 0 0 36px 8px #e0e7ef22',
            opacity: 0.22,
            filter: 'blur(1.2px)'
          }}
          animate={{
            scale: [1, 1.08, 1],
            filter: [
              'blur(1.2px) brightness(1)',
              'blur(1.6px) brightness(1.08)',
              'blur(1.2px) brightness(1)'
            ]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Kraterler */}
          <div style={{position:'absolute', left:'10px', top:'7px', width:'6px', height:'6px', borderRadius:'50%', background:'radial-gradient(circle, #bfc9d6 60%, transparent 100%)', opacity:0.18}} />
          <div style={{position:'absolute', left:'22px', top:'18px', width:'4px', height:'4px', borderRadius:'50%', background:'radial-gradient(circle, #7a8596 60%, transparent 100%)', opacity:0.22}} />
        </motion.div>
      </div>

      <main className="w-full px-2 sm:px-4 lg:px-8 py-10 relative z-10">
        {/* İsim Alma Modal */}
        {showNameModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
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
            </div>
          </div>
        )}

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
                  <span
                    className="text-2xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold font-bebas uppercase drop-shadow-lg text-white text-center px-0 flex items-center justify-center gap-2"
                    style={{
                      letterSpacing: '0.01em',
                      fontWeight: 700,
                      width: '100%',
                      display: 'block',
                      fontSize: (typeof window !== 'undefined' && window.innerWidth >= 768)
                        ? '2.2rem'
                        : 'clamp(1.6rem, 6.5vw, 4.1rem)',
                      lineHeight: 1.1,
                      ...(typeof window !== 'undefined' && window.innerWidth >= 768
                        ? {
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }
                        : {
                            whiteSpace: 'normal',
                            overflow: 'visible',
                            textOverflow: 'unset',
                          }),
                    }}
                  >
                    {mode.title}
                    {mode.id === 'matching' && (
                      <span title="En Çok Oynanan" className="ml-1 align-middle text-yellow-400 text-xl md:text-2xl animate-bounce-slow">⭐</span>
                    )}
                  </span>
                </div>
                {/* Güçlü transparan border */}
                <div className="absolute inset-0 z-10 rounded-xl pointer-events-none border-2 border-white/20 group-hover:border-[#ff416c]/60 transition-all duration-300" />
                {/* Görsel ve başlık */}
                <div className="relative w-full aspect-[1/1] min-h-[16px] md:min-h-[28px] overflow-hidden flex flex-col justify-center items-center"> 
                  <img src={imgSrc} alt="Oyun görseli" className="w-full h-full object-cover object-center rounded-t-xl transition-transform duration-300 group-hover:scale-110 group-hover:brightness-110" />
                </div>
              </Link>
            );
          })}
        </div>
      </main>
      {/* Sabit sağ alt köşede, dikkat çekmeyen bir şekilde */}
      {/* Footer: iletişim, destek, hakkımızda, SSS */}
      <div className="w-full text-center py-6 mt-12 text-xs text-gray-400">
        <a href="/iletisim" className="mx-2 hover:underline">İletişim</a>|
        <a href="/destek" className="mx-2 hover:underline">Destek</a>|
        <a href="/hakkimizda" className="mx-2 hover:underline">Hakkımızda</a>|
        <a href="/sss" className="mx-2 hover:underline">Sıkça Sorulan Sorular</a>
      </div>
      <div className="fixed bottom-2 right-3 z-50 pointer-events-auto select-none">
        <FeedbackButton />
      </div>
    </div>
  );
};

export default HomePage;