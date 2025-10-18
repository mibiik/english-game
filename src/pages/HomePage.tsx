import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { supabase } from '../config/supabase';
import { db } from '../config/firebase';
import { FIREBASE_SEASON_ID } from '../constants/seasons';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import FeedbackButton from '../components/FeedbackButton';

export interface Word {
  english: string;
  turkish: string;
  unit: string;
}



interface HomePageProps {
  filteredWords: any[];
  currentUnit: string;
  currentLevel: 'intermediate' | 'upper-intermediate' | 'pre-intermediate' | 'foundation' | 'kuepe';
}


const HomePage: React.FC<HomePageProps> = React.memo(({ filteredWords, currentUnit, currentLevel }) => {
  // Hooks must run unconditionally at the top of the component (Rules of Hooks).
  const navigate = useNavigate();
  const [showLeaderboard, setShowLeaderboard] = useState(true);
  const [topUsers, setTopUsers] = useState<{displayName:string, photoURL?:string, totalScore:number}[]>([]);
  const [currentSeason, setCurrentSeason] = useState<{id: string, name: string} | null>(null);
  const [firebaseUsers, setFirebaseUsers] = useState<{ userId: string; displayName: string; photoURL?: string; totalScore: number }[]>([]);
  const [firebaseOldSeasonName, setFirebaseOldSeasonName] = useState<string | null>(null);

  // Defensive check: Eğer props'lar eksikse yükleniyor göster
  if (!filteredWords || !currentUnit || !currentLevel) {
    return <div className="text-white text-center py-20">Yükleniyor...</div>;
  }






  // Memoized leaderboard data
  const leaderboardData = useMemo(() => {
    return topUsers.slice(0, 5);
  }, [topUsers]);


  useEffect(() => {
    // Aktif sezon: Supabase
    const fetchLeaderboardData = async () => {
      try {
        console.log('🔍 HomePage: Leaderboard verisi yükleniyor...');
        
        // AKTİF SEZON - SUPABASE'DEN AL
        console.log('📊 Aktif sezon Supabase\'den alınıyor...');
        const { data: seasonsData, error: seasonsError } = await supabase
          .from('seasons')
          .select('id, name, isactive')
          .eq('isactive', true)
          .order('created_at', { ascending: false })
          .limit(1);

        if (!seasonsError && seasonsData && seasonsData.length > 0) {
          const activeSeason = seasonsData[0];
          setCurrentSeason({ id: activeSeason.id, name: activeSeason.name });
          console.log('✅ Aktif sezon Supabase\'den yüklendi:', activeSeason.name);

          // Aktif sezon skorları Supabase'den
          const { data: activeData, error: activeError } = await supabase
            .from('season_scores')
            .select(`
              total_score,
              user_id,
              users!inner(display_name, avatar_url, id)
            `)
            .eq('season_id', activeSeason.id)
            .not('users.display_name', 'is', null)
            .not('users.display_name', 'eq', '')
            .order('total_score', { ascending: false })
            .limit(5);

          if (!activeError && activeData) {
            const activeUsers = activeData
              .filter(item => item.users && typeof item.users === 'object' && (item.users as any).display_name && (item.users as any).display_name.trim() !== '')
              .map(item => ({
                displayName: (item.users as any).display_name || '',
                photoURL: (item.users as any).avatar_url || undefined,
                totalScore: item.total_score || 0,
                userId: (item.users as any).id,
              }));
            setTopUsers(activeUsers);
            console.log('✅ Aktif sezon skorları Supabase\'den yüklendi:', activeUsers);
          }
        } else {
          console.log('⚠️ Aktif sezon Supabase\'de bulunamadı');
        }


      } catch (error) {
        console.error('❌ Leaderboard yüklenirken hata:', error);
      }
    };

    fetchLeaderboardData();
    // Ayrıca Firebase - eski sezon verilerini arkaplanda yükle (kısa gösterim için)
    const loadFirebaseOldSeason = async () => {
      try {
        const usersQuery = query(collection(db, 'userProfiles'), orderBy('totalScore', 'desc'));
        const usersSnapshot = await getDocs(usersQuery);
          if (!usersSnapshot.empty) {
          const firebaseSeasonId = FIREBASE_SEASON_ID;
          setFirebaseOldSeasonName('2024-25 Sezonu');

          const fUsers = usersSnapshot.docs
            .map((doc) => ({ userId: doc.id, ...(doc.data() as any) }))
            .filter(u => u.displayName && u.displayName !== 'Anonim' && u.displayName.trim() !== '' && (u.totalScore || 0) > 0)
            .map((u, idx) => ({ userId: u.userId, displayName: u.displayName, photoURL: u.photoURL || u.avatarUrl, totalScore: u.totalScore || 0 }))
            .slice(0, 10);

          setFirebaseUsers(fUsers);
        }
      } catch (err) {
        console.warn('Firebase eski sezon yükleme hatası (HomePage):', err);
      }
    };

    loadFirebaseOldSeason();
  }, []);




  const headingLines = [
    <>
      <div className="text-center">
        <div className="mb-2">

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
        <div className="text-white drop-shadow-[0_0_10px_rgba(0,0,0,0.5)] font-bebas text-6xl md:text-7xl tracking-wider uppercase">
          Hoş Geldin Koç'lu!
        </div>
      </div>
    </>
  ];


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
    <div className="min-h-screen bg-gradient-to-br from-[#070a1a] via-[#0a0d1a] to-[#01020a] text-gray-100 overflow-hidden relative" style={{ paddingTop: '64px', marginTop: '-128px' }}>
      {/* 2025-2026 Güncel ELC Şeridi - Navbar'ın hemen altında, sabit */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 25 }}
        className="fixed top-16 md:top-20 left-0 right-0 z-30 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 text-white py-2 px-4 shadow-lg"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <span className="inline-flex items-center font-semibold text-xs md:text-sm">
            2025-2026 güncel ELC kelimeleri kullanmaya hazır
          </span>
        </div>
      </motion.div>
      
      <FeedbackButton />
      {/* Masaüstü: başlık ve mini leaderboard yan yana, mobilde alt alta */}
      <div className="relative z-20 w-full flex flex-col md:flex-row md:items-start md:justify-center gap-8 md:gap-16 px-2 md:px-8 max-w-7xl mx-auto pt-4 md:pt-4">
        {/* Başlık ve açıklama */}
        <div className="flex-1">
          <h1 className="relative z-20 -mt-8 md:-mt-12 text-6xl md:text-9xl font-extrabold tracking-wider font-bebas uppercase mb-4 drop-shadow-[0_0_18px_rgba(0,190,255,0.25)] text-center md:text-left leading-tight">
            {headingLines.map((line, lineIndex) => (
              <span className="block" key={lineIndex}>{line}</span>
            ))}
          </h1>
          <p className="relative z-20 mt-6 mb-8 text-base text-white font-inter leading-relaxed text-center md:text-left">
            Koç Üniversitesi Hazırlık programının güncel kelime listeleriyle tam uyumlu, öğrenme sürecinizi hızlandırmak için tasarlanmış interaktif alıştırmalarla İngilizce'nizi geliştirin.<br/>
            <span className="block mt-2 text-sm text-gray-300 font-semibold">Bu site Koç Üniversitesi'nin resmi sitesi değildir, bağımsız bir girişimdir.</span>
          </p>
          <div className="relative z-20 flex justify-center mb-6">
            <Link
              to="/game-modes"
              className="group relative z-20 inline-flex items-center justify-center px-12 py-3 bg-white text-gray-900 rounded-2xl text-base font-bold transition-all duration-300 hover:bg-gray-100 hover:scale-105 shadow-lg hover:shadow-xl border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gray-900 rounded-full group-hover:bg-red-500 transition-colors duration-300"></div>
                <span>Çalışmaya Başla</span>
                <div className="w-2 h-2 bg-gray-900 rounded-full group-hover:bg-red-500 transition-colors duration-300"></div>
              </div>
            </Link>
          </div>
          
          {/* Masaüstü için destek kutusu - Sol tarafta (Çok Geniş) */}
          <div className="relative z-20 hidden md:block mt-6">
          <div className="relative z-20 bg-green-100 border border-green-400 rounded-xl shadow-md p-4 flex flex-col items-center text-center max-w-xl">
              <div className="text-red-600 text-lg font-extrabold mb-1">ÜCRETSİZ <span className="text-green-900 font-black">AMA</span></div>
              <div className="text-green-900 mb-2 text-sm">Uygulama tamamen ücretsiz; <span className="font-bold text-green-700">ama</span> yayında kalması ve gelişmesi için desteğe ihtiyacımız var.<br/>Küçük bir katkı bile çok değerli!<br/>{ProBadge} ile bize destek olabilirsin.</div>
              <a href="https://www.shopier.com/37829492" target="_blank" rel="noopener noreferrer" className="inline-block bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transition text-sm mt-1">
                <span className="mr-1 align-middle" style={{display:'inline-block', verticalAlign:'middle', width:'1em', height:'1em', position:'relative'}}>
                  <svg fill="#fff" stroke="#fff" width="0.8em" height="0.8em" viewBox="144 144 512 512" xmlns="http://www.w3.org/2000/svg" style={{position:'relative', zIndex:1}}>
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
              {/* Shopier onay satırı */}
              <div className="flex items-center justify-center mt-2">
                <span className="text-black font-normal italic text-xs font-sans flex items-center">Shopier tarafından onaylanmıştır <img src="/assets/aaaaaaaadwü/shield_9623201.png" alt="onaylı" className="ml-1 w-4 h-4 inline-block align-middle" /></span>
              </div>
              <div className="text-sm text-green-800 mt-2">(Destek olanlara uygulama içinde {ProBadge})</div>
            </div>
          </div>
        </div>
        {/* Leaderboards */}
        <div className="relative z-20 flex-1 max-w-4xl mx-auto md:mx-0 mb-2 md:mb-0 md:mt-0 flex flex-col gap-4">
          {/* Aktif Sezon Leaderboard */}
          <div className="relative z-20 flex flex-col items-center p-4 bg-gradient-to-br from-green-900/80 to-green-800/80 rounded-3xl border-2 border-green-700 shadow-2xl">
            <div className="w-full text-center mb-4">
              <span className="text-2xl font-black text-green-300 tracking-wide uppercase drop-shadow">
                {currentSeason?.name || 'Aktif Sezon'}
              </span>
              <div className="w-16 h-1 bg-green-400 mx-auto mt-2 rounded-full"></div>
            </div>
            {/* Aktif Sezon Leaderboard İçeriği */}
            {showLeaderboard ? (
              <>
                <div className="flex items-end justify-center gap-4 md:gap-3 mb-2 md:mb-1">
                  {/* 2. Kullanıcı */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-10 h-10 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-purple-200 to-purple-400 flex items-center justify-center overflow-hidden border-2 border-purple-300 mb-1">
                      {leaderboardData[1]?.photoURL ? (
                        <img src={leaderboardData[1].photoURL} alt={leaderboardData[1].displayName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-base md:text-sm font-bold text-purple-600">{leaderboardData[1]?.displayName?.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <span className="text-xs md:text-xs font-extrabold text-purple-300 text-center w-full tracking-wide" style={{letterSpacing:'0.04em'}}>{leaderboardData[1]?.displayName?.toUpperCase()}</span>
                    <span className="text-base md:text-base font-extrabold text-white text-center w-full">{leaderboardData[1]?.totalScore}</span>
                    <span className="mt-1 text-xs bg-purple-400 text-white rounded-full px-2 py-0.5 font-bold">2</span>
                  </div>
                  {/* 1. Kullanıcı */}
                  <div className="flex flex-col items-center flex-1 z-10">
                    <div className="w-20 h-20 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-yellow-200 via-yellow-400 to-orange-400 flex items-center justify-center overflow-hidden border-4 border-yellow-300 mb-1 shadow-lg relative" style={{boxShadow:'0 0 32px 8px #ffd70088, 0 0 0 6px #fffbe6cc'}}>
                      {/* Altın parlama efekti */}
                      <div className="absolute inset-0 rounded-full pointer-events-none animate-pulse" style={{boxShadow:'0 0 32px 12px #ffd70088, 0 0 0 8px #fffbe644'}}></div>
                      {leaderboardData[0]?.photoURL ? (
                        <img src={leaderboardData[0].photoURL} alt={leaderboardData[0].displayName} className="w-full h-full object-cover relative z-10" />
                      ) : (
                        <span className="text-3xl md:text-2xl font-extrabold text-yellow-700 relative z-10">{leaderboardData[0]?.displayName?.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <span className="text-base md:text-base font-extrabold text-yellow-300 text-center w-full tracking-wide" style={{letterSpacing:'0.04em'}}>{leaderboardData[0]?.displayName?.toUpperCase()}</span>
                    <span className="text-2xl md:text-xl font-extrabold text-white text-center w-full">{leaderboardData[0]?.totalScore}</span>
                    <span className="mt-1 text-xs bg-yellow-400 text-yellow-900 rounded-full px-2 py-0.5 font-bold">1</span>
                  </div>
                  {/* 3. Kullanıcı */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-8 h-8 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-pink-200 to-pink-400 flex items-center justify-center overflow-hidden border-2 border-pink-300 mb-1">
                      {leaderboardData[2]?.photoURL ? (
                        <img src={leaderboardData[2].photoURL} alt={leaderboardData[2].displayName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs md:text-xs font-bold text-pink-600">{leaderboardData[2]?.displayName?.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <span className="text-xs md:text-xs font-extrabold text-pink-300 text-center w-full tracking-wide" style={{letterSpacing:'0.04em'}}>{leaderboardData[2]?.displayName?.toUpperCase()}</span>
                    <span className="text-sm md:text-xs font-extrabold text-white text-center w-full">{leaderboardData[2]?.totalScore}</span>
                    <span className="mt-1 text-xs bg-pink-400 text-white rounded-full px-2 py-0.5 font-bold">3</span>
                  </div>
                </div>
                {/* 4 ve 5. kullanıcılar için ek liste */}
                {(leaderboardData[3] || leaderboardData[4]) && (
                  <div className="w-full mt-2 md:mt-1">
                    <ul className="divide-y divide-gray-700">
                      {leaderboardData.slice(3, 5).map((user, idx) => (
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
                <button onClick={() => {
                  // Mevcut sezon bilgisini localStorage'a kaydet
                  if (currentSeason) {
                    localStorage.setItem('selectedSeasonFromHome', currentSeason.id);
                  }
                  navigate('/leaderboard');
                }} className="mt-2 md:mt-1 px-4 py-1 md:px-3 md:py-1 rounded-full bg-gray-900 border border-gray-600 text-gray-200 text-xs md:text-xs font-semibold hover:bg-gray-800 hover:text-white transition-all">Tümünü Gör</button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-24 cursor-pointer select-none" onClick={() => setShowLeaderboard(true)}>
                <Trophy className="w-8 h-8 text-green-400 mb-1" />
                <span className="text-base font-bold text-gray-200">Aktif Sezon</span>
                <span className="text-xs text-gray-400">Büyütmek için tıkla</span>
              </div>
            )}
          </div>


        </div>
      </div>
      
      {/* Eski Sezon (Firebase) - Aktif sezona benzer leaderboard */}
      {firebaseUsers && firebaseUsers.length > 0 && (
        <div className="relative z-20 flex-1 max-w-4xl mx-auto md:mx-0 mb-2 md:mb-0 md:mt-6 flex flex-col gap-4">
          <div className="relative z-20 flex flex-col items-center p-4 bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-3xl border-2 border-gray-700 shadow-2xl">
            <div className="w-full text-center mb-4">
              <span className="text-2xl font-black text-gray-300 tracking-wide uppercase drop-shadow">
                {firebaseOldSeasonName || 'Eski Sezon'}
              </span>
              <div className="w-16 h-1 bg-gray-500 mx-auto mt-2 rounded-full"></div>
            </div>

            {/* Podium benzeri gösterim (3 üst) */}
            <div className="flex items-end justify-center gap-4 md:gap-3 mb-2 md:mb-1 w-full">
              {/* 2. Kullanıcı */}
              <div className="flex flex-col items-center flex-1">
                <div className="w-10 h-10 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-purple-200 to-purple-400 flex items-center justify-center overflow-hidden border-2 border-purple-300 mb-1">
                  {firebaseUsers[1]?.photoURL ? (
                    <img src={firebaseUsers[1].photoURL} alt={firebaseUsers[1].displayName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-base md:text-sm font-bold text-purple-600">{firebaseUsers[1]?.displayName?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span className="text-xs md:text-xs font-extrabold text-purple-300 text-center w-full tracking-wide" style={{letterSpacing:'0.04em'}}>{firebaseUsers[1]?.displayName?.toUpperCase()}</span>
                <span className="text-base md:text-base font-extrabold text-white text-center w-full">{firebaseUsers[1]?.totalScore}</span>
                <span className="mt-1 text-xs bg-purple-400 text-white rounded-full px-2 py-0.5 font-bold">2</span>
              </div>

              {/* 1. Kullanıcı */}
              <div className="flex flex-col items-center flex-1 z-10">
                <div className="w-20 h-20 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 flex items-center justify-center overflow-hidden border-4 border-gray-300 mb-1 shadow-lg relative" style={{boxShadow:'0 0 32px 8px #bbb, 0 0 0 6px #fff3'}}>
                  <div className="absolute inset-0 rounded-full pointer-events-none animate-pulse" style={{boxShadow:'0 0 32px 12px #ddd'}}></div>
                  {firebaseUsers[0]?.photoURL ? (
                    <img src={firebaseUsers[0].photoURL} alt={firebaseUsers[0].displayName} className="w-full h-full object-cover relative z-10" />
                  ) : (
                    <span className="text-3xl md:text-2xl font-extrabold text-gray-700 relative z-10">{firebaseUsers[0]?.displayName?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span className="text-base md:text-base font-extrabold text-gray-300 text-center w-full tracking-wide" style={{letterSpacing:'0.04em'}}>{firebaseUsers[0]?.displayName?.toUpperCase()}</span>
                <span className="text-2xl md:text-xl font-extrabold text-white text-center w-full">{firebaseUsers[0]?.totalScore}</span>
                <span className="mt-1 text-xs bg-gray-400 text-gray-900 rounded-full px-2 py-0.5 font-bold">1</span>
              </div>

              {/* 3. Kullanıcı */}
              <div className="flex flex-col items-center flex-1">
                <div className="w-8 h-8 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-pink-200 to-pink-400 flex items-center justify-center overflow-hidden border-2 border-pink-300 mb-1">
                  {firebaseUsers[2]?.photoURL ? (
                    <img src={firebaseUsers[2].photoURL} alt={firebaseUsers[2].displayName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs md:text-xs font-bold text-pink-600">{firebaseUsers[2]?.displayName?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span className="text-xs md:text-xs font-extrabold text-pink-300 text-center w-full tracking-wide" style={{letterSpacing:'0.04em'}}>{firebaseUsers[2]?.displayName?.toUpperCase()}</span>
                <span className="text-sm md:text-xs font-extrabold text-white text-center w-full">{firebaseUsers[2]?.totalScore}</span>
                <span className="mt-1 text-xs bg-pink-400 text-white rounded-full px-2 py-0.5 font-bold">3</span>
              </div>
            </div>

            {/* 4-5 listesi */}
            {(firebaseUsers[3] || firebaseUsers[4]) && (
              <div className="w-full mt-2 md:mt-1">
                <ul className="divide-y divide-gray-700">
                  {firebaseUsers.slice(3, 5).map((user, idx) => (
                    <li key={user.userId} className="flex items-center py-2 md:py-1 gap-3">
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

            <button onClick={() => {
            localStorage.setItem('selectedSeasonFromHome', FIREBASE_SEASON_ID);
              navigate('/leaderboard');
            }} className="mt-2 md:mt-1 px-4 py-1 md:px-3 md:py-1 rounded-full bg-gray-900 border border-gray-600 text-gray-200 text-xs md:text-xs font-semibold hover:bg-gray-800 hover:text-white transition-all">Tümünü Gör</button>
          </div>
        </div>
      )}
      {/* About Founder Button - Moved below */}
      <div className="relative z-20 flex justify-center mt-8 mb-6">
        <Link 
          to="/about-founder" 
          className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 hover:border-white/50 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg"
        >
          About Founder
        </Link>
      </div>
      
      {/* Mobil için destek kutusu (eski yeri) */}
      <div className="relative z-20 block md:hidden w-full max-w-2xl mx-auto mt-6 mb-8">
        <div className="relative z-20 bg-green-100 border border-green-400 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center">
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
      {/* Sabit beyaz küçük yıldızlar - Optimized */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Uzak, çok küçük yıldızlar - Sabit pozisyonlar */}
        <div className="absolute w-0.5 h-0.5 bg-white opacity-30 rounded-full" style={{ left: '10%', top: '15%', filter: 'blur(0.5px)' }} />
        <div className="absolute w-0.5 h-0.5 bg-white opacity-30 rounded-full" style={{ left: '25%', top: '8%', filter: 'blur(0.5px)' }} />
        <div className="absolute w-0.5 h-0.5 bg-white opacity-30 rounded-full" style={{ left: '45%', top: '22%', filter: 'blur(0.5px)' }} />
        <div className="absolute w-0.5 h-0.5 bg-white opacity-30 rounded-full" style={{ left: '67%', top: '12%', filter: 'blur(0.5px)' }} />
        <div className="absolute w-0.5 h-0.5 bg-white opacity-30 rounded-full" style={{ left: '85%', top: '18%', filter: 'blur(0.5px)' }} />
        <div className="absolute w-0.5 h-0.5 bg-white opacity-30 rounded-full" style={{ left: '15%', top: '35%', filter: 'blur(0.5px)' }} />
        <div className="absolute w-0.5 h-0.5 bg-white opacity-30 rounded-full" style={{ left: '35%', top: '42%', filter: 'blur(0.5px)' }} />
        <div className="absolute w-0.5 h-0.5 bg-white opacity-30 rounded-full" style={{ left: '55%', top: '38%', filter: 'blur(0.5px)' }} />
        <div className="absolute w-0.5 h-0.5 bg-white opacity-30 rounded-full" style={{ left: '75%', top: '45%', filter: 'blur(0.5px)' }} />
        <div className="absolute w-0.5 h-0.5 bg-white opacity-30 rounded-full" style={{ left: '92%', top: '32%', filter: 'blur(0.5px)' }} />
        
        {/* Orta katman yıldızlar - Sabit pozisyonlar */}
        <div className="absolute w-1 h-1 bg-blue-200 opacity-50 rounded-full" style={{ left: '20%', top: '25%', filter: 'blur(1.2px)' }} />
        <div className="absolute w-1 h-1 bg-blue-200 opacity-50 rounded-full" style={{ left: '40%', top: '15%', filter: 'blur(1.2px)' }} />
        <div className="absolute w-1 h-1 bg-blue-200 opacity-50 rounded-full" style={{ left: '60%', top: '28%', filter: 'blur(1.2px)' }} />
        <div className="absolute w-1 h-1 bg-blue-200 opacity-50 rounded-full" style={{ left: '80%', top: '20%', filter: 'blur(1.2px)' }} />
        <div className="absolute w-1 h-1 bg-blue-200 opacity-50 rounded-full" style={{ left: '30%', top: '50%', filter: 'blur(1.2px)' }} />
        <div className="absolute w-1 h-1 bg-blue-200 opacity-50 rounded-full" style={{ left: '50%', top: '55%', filter: 'blur(1.2px)' }} />
        <div className="absolute w-1 h-1 bg-blue-200 opacity-50 rounded-full" style={{ left: '70%', top: '48%', filter: 'blur(1.2px)' }} />
        <div className="absolute w-1 h-1 bg-blue-200 opacity-50 rounded-full" style={{ left: '90%', top: '52%', filter: 'blur(1.2px)' }} />
        
        {/* Yakın, parlak yıldızlar - Sabit pozisyonlar */}
        <div className="absolute w-2 h-2 bg-white opacity-80 shadow-lg rounded-full" style={{ left: '12%', top: '30%', filter: 'blur(0.5px)' }} />
        <div className="absolute w-2 h-2 bg-white opacity-80 shadow-lg rounded-full" style={{ left: '38%', top: '18%', filter: 'blur(0.5px)' }} />
        <div className="absolute w-2 h-2 bg-white opacity-80 shadow-lg rounded-full" style={{ left: '65%', top: '35%', filter: 'blur(0.5px)' }} />
        <div className="absolute w-2 h-2 bg-white opacity-80 shadow-lg rounded-full" style={{ left: '88%', top: '25%', filter: 'blur(0.5px)' }} />
        <div className="absolute w-2 h-2 bg-white opacity-80 shadow-lg rounded-full" style={{ left: '22%', top: '60%', filter: 'blur(0.5px)' }} />
        <div className="absolute w-2 h-2 bg-white opacity-80 shadow-lg rounded-full" style={{ left: '45%', top: '65%', filter: 'blur(0.5px)' }} />
        <div className="absolute w-2 h-2 bg-white opacity-80 shadow-lg rounded-full" style={{ left: '68%', top: '58%', filter: 'blur(0.5px)' }} />
        <div className="absolute w-2 h-2 bg-white opacity-80 shadow-lg rounded-full" style={{ left: '85%', top: '62%', filter: 'blur(0.5px)' }} />
      </div>
      
      {/* Nebula ve galaksi efektleri - Optimized */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Büyük mor bulutlar - Sabit pozisyonlar */}
        <div className="absolute rounded-full" style={{
          width: '700px',
          height: '350px',
          left: '15%',
          top: '20%',
              background: 'radial-gradient(circle, #a259ff55 0%, #2a1a5a33 60%, transparent 100%)',
          opacity: 0.18,
              filter: 'blur(60px)'
        }} />
        <div className="absolute rounded-full" style={{
          width: '600px',
          height: '300px',
          left: '60%',
          top: '10%',
          background: 'radial-gradient(circle, #a259ff55 0%, #2a1a5a33 60%, transparent 100%)',
          opacity: 0.15,
          filter: 'blur(60px)'
        }} />
        
        {/* Büyük mavi bulutlar - Sabit pozisyonlar */}
        <div className="absolute rounded-full" style={{
          width: '500px',
          height: '250px',
          left: '25%',
          top: '40%',
              background: 'radial-gradient(circle, #00c3ff44 0%, #1a233a33 60%, transparent 100%)',
          opacity: 0.13,
              filter: 'blur(60px)'
        }} />
        <div className="absolute rounded-full" style={{
          width: '450px',
          height: '220px',
          left: '70%',
          top: '50%',
          background: 'radial-gradient(circle, #00c3ff44 0%, #1a233a33 60%, transparent 100%)',
          opacity: 0.12,
          filter: 'blur(60px)'
        }} />
        
        {/* Hafif pembe galaksi izi - Sabit pozisyon */}
        <div className="absolute rounded-full" style={{
            width: '900px',
            height: '200px',
            left: '30%',
            top: '60%',
            background: 'radial-gradient(circle, #ff61a6aa 0%, #0a0d1a00 80%)',
            opacity: 0.10,
            filter: 'blur(80px)'
        }} />
      </div>
      
      {/* Hafif mavi bulut efekti - Optimized */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] rounded-full bg-[#1a233a]/40 blur-3xl" />
      </div>
      
      {/* Floating Elements - Optimized with fewer elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {/* Ana uçuşan elementler - Sabit pozisyonlar */}
          <motion.div
            className="absolute w-2 h-2 bg-red-500/20 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
            duration: 15,
              repeat: Infinity,
            delay: 2,
          }}
          style={{ left: '20%', top: '30%' }}
        />
        <motion.div
          className="absolute w-2 h-2 bg-red-500/20 rounded-full"
          animate={{
            x: [0, 80, 0],
            y: [0, -80, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            delay: 5,
          }}
          style={{ left: '60%', top: '20%' }}
        />
        <motion.div
          className="absolute w-2 h-2 bg-red-500/20 rounded-full"
          animate={{
            x: [0, 120, 0],
            y: [0, -120, 0],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            delay: 8,
          }}
          style={{ left: '80%', top: '40%' }}
        />
        
        {/* Büyük uçuşan elementler - Sabit pozisyonlar */}
          <motion.div
            className="absolute w-1 h-1 bg-cyan-500/30 rounded-full"
            animate={{
              x: [0, 200, 0],
              y: [0, -200, 0],
              opacity: [0.1, 0.6, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
            duration: 20,
              repeat: Infinity,
            delay: 3,
          }}
          style={{ left: '15%', top: '50%' }}
        />
        <motion.div
          className="absolute w-1 h-1 bg-cyan-500/30 rounded-full"
          animate={{
            x: [0, 150, 0],
            y: [0, -150, 0],
            opacity: [0.1, 0.5, 0.1],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            delay: 7,
          }}
          style={{ left: '75%', top: '25%' }}
        />
        
        {/* Yıldız şeklinde elementler - Sabit pozisyonlar */}
          <motion.div
            className="absolute w-1 h-1 bg-yellow-500/40"
            style={{
            left: '25%',
            top: '35%',
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
            }}
            animate={{
              rotate: [0, 360],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
            duration: 10,
              repeat: Infinity,
            delay: 1,
            }}
          />
          <motion.div
          className="absolute w-1 h-1 bg-yellow-500/40"
          style={{
            left: '55%',
            top: '45%',
            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
          }}
            animate={{
            rotate: [0, 360],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.1, 1],
            }}
            transition={{
            duration: 12,
              repeat: Infinity,
            delay: 4,
            }}
        />
        
        {/* Büyük glow efektli yıldızlar - Sabit pozisyonlar */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
            style={{
            width: '150px',
            height: '150px',
            left: '10%',
            top: '15%',
            background: 'radial-gradient(circle, #fff 0%, #2a1a5a 40%, #0a0120 100%)',
            opacity: 0.12,
            filter: 'blur(16px)'
          }}
          animate={{ opacity: [0.08, 0.18, 0.08] }}
          transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse', delay: 2 }}
        />
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
            width: '120px',
            height: '120px',
            left: '70%',
            top: '25%',
              background: 'radial-gradient(circle, #fff 0%, #2a1a5a 40%, #0a0120 100%)',
            opacity: 0.10,
              filter: 'blur(16px)'
            }}
          animate={{ opacity: [0.06, 0.15, 0.06] }}
          transition={{ duration: 12, repeat: Infinity, repeatType: 'reverse', delay: 6 }}
          />
        
        {/* Mor-mavi bulutlar - Sabit pozisyonlar */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
            width: '350px',
            height: '200px',
            left: '20%',
            top: '30%',
              background: 'radial-gradient(circle, #2a1a5a 0%, #0a0120 60%, transparent 100%)',
            opacity: 0.08,
              filter: 'blur(60px)'
            }}
            animate={{ opacity: [0.06, 0.14, 0.06] }}
          transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse', delay: 3 }}
          />
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: '300px',
            height: '180px',
            left: '65%',
            top: '40%',
            background: 'radial-gradient(circle, #2a1a5a 0%, #0a0120 60%, transparent 100%)',
            opacity: 0.09,
            filter: 'blur(60px)'
          }}
          animate={{ opacity: [0.07, 0.13, 0.07] }}
          transition={{ duration: 18, repeat: Infinity, repeatType: 'reverse', delay: 8 }}
        />
      </div>


      <main className="w-full px-2 sm:px-4 lg:px-8 py-10 relative z-10">


      </main>
      {/* Sabit sağ alt köşede, dikkat çekmeyen bir şekilde */}
      <div className="fixed bottom-2 right-3 z-50 pointer-events-auto select-none">
        <FeedbackButton />
      </div>


    </div>
  );
});

export default HomePage;