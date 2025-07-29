import React, { useEffect, useState } from 'react';
import { Trophy, User, Crown, Medal, Award, Star } from 'lucide-react';
import { collection, getFirestore, orderBy, query, onSnapshot } from 'firebase/firestore';
import app from '../config/firebase';

interface UserProfile {
  userId: string;
  displayName: string;
  email: string;
  photoURL?: string;
  totalScore: number;
  badges?: string[];
  isFirstSupporter?: boolean;
}

// Profil fotoğrafı yüklenemezse fallback için yardımcı fonksiyon
function FallbackAvatar({ name, size = 40 }: { name: string, size?: number }) {
  return (
    <span style={{width:size, height:size}} className="flex items-center justify-center bg-gray-700/60 rounded-full">
      <span className="text-lg font-bold text-white/80">{name?.charAt(0)?.toUpperCase() || '?'}</span>
    </span>
  );
}

const LeaderboardPage: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0); // Sayfa açılınca en üste git
  }, []);

  useEffect(() => {
    setLoading(true);
    const db = getFirestore(app);
    
    // Hem userProfiles hem de users koleksiyonlarından veri çek
    const profilesQuery = query(collection(db, 'userProfiles'), orderBy('totalScore', 'desc'));
    const usersQuery = query(collection(db, 'users'), orderBy('totalScore', 'desc'));
    
    const unsubscribeProfiles = onSnapshot(profilesQuery, (profilesSnapshot) => {
      const unsubscribeUsers = onSnapshot(usersQuery, (usersSnapshot) => {
        // Her iki koleksiyondan gelen verileri birleştir
        const profilesData = new Map();
        const usersData = new Map();
        
        // userProfiles verilerini işle
        profilesSnapshot.docs.forEach(doc => {
          const data = doc.data();
          profilesData.set(doc.id, {
            userId: doc.id,
            displayName: data.displayName || '',
            email: data.email || '',
            photoURL: data.photoURL || undefined,
            totalScore: data.totalScore || 0,
            badges: data.badges || [],
            isFirstSupporter: !!data.isFirstSupporter,
          });
        });
        
        // users verilerini işle
        usersSnapshot.docs.forEach(doc => {
          const data = doc.data();
          usersData.set(doc.id, {
            userId: doc.id,
            displayName: data.displayName || '',
            email: data.email || '',
            photoURL: data.photoURL || undefined,
            totalScore: data.totalScore || 0,
            badges: data.badges || [],
            isFirstSupporter: !!data.isFirstSupporter,
          });
        });
        
        // Verileri birleştir - users koleksiyonundaki fotoğraf bilgisi öncelikli
        const mergedUsers = new Map();
        
        // Önce userProfiles verilerini ekle
        profilesData.forEach((user, userId) => {
          mergedUsers.set(userId, user);
        });
        
        // Sonra users verilerini ekle/güncelle (fotoğraf bilgisi için)
        usersData.forEach((user, userId) => {
          if (mergedUsers.has(userId)) {
            // Mevcut kullanıcıyı güncelle, fotoğraf bilgisi varsa ekle
            const existing = mergedUsers.get(userId);
            mergedUsers.set(userId, {
              ...existing,
              photoURL: user.photoURL || existing.photoURL,
              badges: user.badges || existing.badges,
              isFirstSupporter: user.isFirstSupporter || existing.isFirstSupporter,
            });
          } else {
            // Yeni kullanıcı ekle
            mergedUsers.set(userId, user);
          }
        });
        
        let fetchedUsers: UserProfile[] = Array.from(mergedUsers.values());
        
        // Sıralamayı güncel puana göre yap
        fetchedUsers = fetchedUsers.filter(u => u.displayName && u.displayName.trim() !== '').sort((a, b) => b.totalScore - a.totalScore);
        setUsers(fetchedUsers);
        setLoading(false);
      }, () => setLoading(false));
      
      return () => {
        unsubscribeUsers();
      };
    }, () => setLoading(false));
    
    return () => {
      unsubscribeProfiles();
    };
  }, []);

  // Türkçe karakter ve boşluk-normalizasyon fonksiyonu
  function normalize(str: string) {
    return str
      .toLocaleLowerCase('tr')
      .replace(/ü/g, 'u')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/ş/g, 's')
      .replace(/ğ/g, 'g')
      .replace(/[^a-z0-9]/gi, '') // harf ve rakam dışındakileri at
      .replace(/\s+/g, ''); // tüm boşlukları kaldır
  }

  // Arama filtresi (normalize edilmiş)
  const filteredUsers = search.trim().length > 0
    ? users.filter(u => normalize(u.displayName).includes(normalize(search)))
    : users;

  return (
    // Genel Arka Plan ve Font (Varsayılan Tailwind Sans)
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-black px-4 py-8 md:py-16 flex flex-col items-center font-sans" style={{ paddingTop: 'calc(64px + 2rem)', marginTop: '-128px' }}>

      {/* Önce Destekçilerimiz Bölümü (SAYFA EN ÜSTÜ) */}
      <div className="w-full max-w-3xl mx-auto mt-0 mb-8">
        <div className="bg-white border border-green-200 rounded-xl shadow-sm p-4 flex flex-col items-center text-center">
          <div className="text-sm text-green-700 font-extrabold mt-3 mb-2">EKİBE KAHVELER BENDEN ☕        49,90₺</div>
          <a href="https://www.shopier.com/37829492" target="_blank" rel="noopener noreferrer" className="inline-block bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:from-green-600 hover:to-green-700 text-white font-extrabold py-3 px-6 rounded-full shadow-2xl transition text-lg mt-2 animate-bounce-slow animate-pulse-bright">
            <span className="mr-3 align-middle" style={{display:'inline-block', verticalAlign:'middle', width:'1.7em', height:'1.7em', position:'relative'}}>
              <svg fill="#fff" stroke="#fff" width="1.7em" height="1.7em" viewBox="144 144 512 512" xmlns="http://www.w3.org/2000/svg" style={{position:'relative', zIndex:1}}>
                <g><g>
                  <circle cx="456" cy="312" r="28" fill="#FFD700" stroke="#FFD700" strokeWidth="4" />
                  <path d="m456.32 424.81c-62.145 0-112.7-50.559-112.7-112.7s50.559-112.7 112.7-112.7 112.7 50.559 112.7 112.7-50.559 112.7-112.7 112.7zm0-201.38c-48.895 0-88.672 39.777-88.672 88.672s39.777 88.672 88.672 88.672 88.672-39.777 88.672-88.672-39.777-88.672-88.672-88.672z"></path>
                  <path d="m602.1 468.29c-7.3555-16.652-27.055-24.285-47.887-18.566l-0.32812 0.074219c-0.60547 0.125-1.5352 0.35156-2.5938 0.70703-12.293 4.2305-30.102 10.73-47.281 17.004-9.168 3.3516-18.539 6.7773-27.055 9.8477-2.3672-12.543-11.285-22.695-24.105-26.047-19.723-5.1875-38.113-13.227-57.586-21.766-10.277-4.5078-20.906-9.1445-31.664-13.301-26.375-10.176-51.891-9.2695-75.824 2.6953-10.957 5.4648-21.867 10.984-32.797 16.473-16.098 8.1133-32.746 16.5-49.172 24.609-2.3438 1.1602-9.5234 4.6836-11.992 12.621-2.4688 7.9336 1.3867 14.887 2.6719 17.18l3.3008 5.9453c8.8438 15.871 17.961 32.293 25.996 48.719 2.7461 5.6172 7.4297 13.402 16.172 15.844 9.5469 2.6719 17.938-2.7188 20.68-4.4844 12.043-7.7344 23.301-7.4062 37.633 1.0586 23.25 13.73 41.766 23.301 60.055 31.008 11.715 4.9375 23.199 7.4297 34.637 7.4297 9.8984 0 19.75-1.8633 29.676-5.543 22.598-8.4141 44.16-18.363 69.602-30.73l6.4219-3.125c26.324-12.797 53.531-25.996 80.105-39.5 21.16-10.719 29.523-29.637 21.336-48.152zm-32.219 26.754c-26.375 13.402-53.504 26.574-79.727 39.324l-6.4219 3.125c-24.812 12.066-45.797 21.738-67.484 29.824-15.617 5.8203-30.406 5.3398-46.578-1.4844-17.254-7.2812-34.891-16.398-57.184-29.574-11.184-6.6016-22.141-9.9258-32.797-9.9258-10.328 0-20.355 3.0977-30.027 9.2969-0.40234 0.25-0.73047 0.45312-1.0586 0.62891-0.35156-0.57812-0.75391-1.3359-1.2578-2.3438-8.3125-17.004-17.609-33.703-26.602-49.852l-2.0391-3.6523c15.742-7.7852 31.641-15.793 47.031-23.555 10.906-5.4922 21.816-10.984 32.723-16.449 17.887-8.9414 36.352-9.5234 56.453-1.7617 10.277 3.9531 20.656 8.4883 30.684 12.898 19.445 8.5156 39.574 17.332 61.113 22.973 6.0469 1.5859 7.332 7.3789 6.6016 11.863-0.90625 5.4922-6.8281 6.9258-11.664 7.1289-1.1836 0.050782-2.4922 0.023438-3.9062 0.023438-0.60547 0-1.1836 0-1.7891-0.023438-3.6523-0.42969-57.156-6.5742-84.793-10-0.78125-0.20312-1.7617-0.37891-2.9492-0.42969h-0.37891c-6.4727 0-11.812 5.1406-11.992 11.664-0.17578 5.9961 4.0547 11.082 9.75 12.168 0.48047 0.125 1.1094 0.27734 1.8633 0.35156 15.871 1.9648 38.34 4.6367 54.059 6.5 9.0195 1.0586 17.156 2.0156 23.023 2.6719 2.9727 0.32812 5.3672 0.60547 7.0273 0.78125 1.2852 0.15234 2.5703 0.27734 3.8281 0.27734h0.050781v0.050781c0.65625 0 1.3086 0 1.9648 0.023437 0.75391 0 1.5117 0.023438 2.2656 0.023438 0.95703 0 1.9648-0.023438 2.9961-0.050782 11.84-0.52734 21.461-5.0117 27.559-12.316 11.613-4.0547 26.98-9.6719 41.918-15.141 17.004-6.2227 34.562-12.621 46.629-16.777l0.25-0.050782c0.48047-0.10156 0.95703-0.22656 1.4375-0.35156 9.1172-2.4922 17.18-0.40234 19.598 5.0898 3.6055 8.0078-3.5508 13.699-10.176 17.051z"></path>
                  <path d="m496.33 285.16c-3.1758-3.4258-9.0938-5.4922-15.289-0.074219-1.6367 1.4375-3.0742 2.9219-4.4844 4.3828l-10.328 10.68c-4.5859 4.7344-4.5859 4.7344-9.6992 10l-11.109 11.461-1.8125-1.8125c-1.8633-1.8633-3.6289-3.7031-5.4141-5.5664l-0.42969-0.42969c-1.5859-1.6641-3.1992-3.3008-4.8125-4.9375-2.7969-2.8477-5.8203-4.3086-8.9414-4.3086-1.9414 0-4.8359 0.57812-7.5586 3.3516-1.7383 1.7617-6.8281 8.1875 1.082 16.449 4.7109 4.9375 9.4727 9.8242 14.207 14.711l4.3086 4.457c1.9141 1.9648 4.6367 4.2812 8.793 4.6094l0.27734 0.023438h0.27734c5.0898-0.050782 8.0625-3.2734 9.8242-5.2148 0.22656-0.25 0.45312-0.50391 0.67969-0.73047l16.879-17.434c4.6602-4.7852 7.5312-7.7578 20.73-21.41 0.75391-0.78125 1.5117-1.5859 2.2656-2.3945 4.6328-4.9805 4.8594-11.203 0.55469-15.812z"></path>
                </g></g>
              </svg>
            </span>
            DESTEK OL
          </a>
          <div className="flex items-center justify-center mt-2">
            <span className="text-black font-normal italic text-sm font-sans flex items-center">Shopier tarafından onaylanmıştır <img src="/assets/aaaaaaaadwü/shield_9623201.png" alt="onaylı" className="ml-1 w-4 h-4 inline-block align-middle" /></span>
          </div>
        </div>
      </div>

      {/* Masaüstü İçin Başlık Tasarımı */}
      <header className="w-full max-w-2xl mx-auto text-center mb-8 flex flex-col items-center gap-2">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg select-none uppercase" style={{letterSpacing:'0.04em', fontFamily:'Inter, Bebas Neue, Arial, sans-serif'}}>
          LİDERLER
        </h1>
        <p className="text-gray-300 text-base md:text-lg font-medium mt-2">En iyi oyuncular burada! Sıralamaya gir ve ödülleri kap!</p>
      </header>

      {/* Mobil Podium Tasarımı (Alt Alta, Daha Kompakt) */}
      <div className="w-full max-w-[360px] flex flex-col items-center gap-4 mb-8 md:hidden">
        {/* 1. Kullanıcı */}
        {users[0] && (
          <div className="w-full rounded-2xl shadow-2xl border-2 border-yellow-300 bg-gradient-to-br from-yellow-400 via-orange-300 to-orange-500 flex flex-row items-center gap-3 p-4 mb-2 relative overflow-hidden">
            {/* Sıra numarası solda */}
            <div className="flex flex-col items-center justify-center">
              <span className="w-14 h-14 rounded-full bg-white/80 shadow-lg flex items-center justify-center mx-auto mb-1">
                <span className="text-4xl font-extrabold text-yellow-500">1</span>
                    </span>
            </div>
            {/* Profil ve bilgiler sağda */}
            <div className="flex flex-col items-start flex-1">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-yellow-400 shadow-lg mb-2">
                {users[0].photoURL ? (
                  <img src={users[0].photoURL} alt={users[0].displayName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-yellow-500" />
                )}
              </div>
              <div className="text-xl font-extrabold text-yellow-900 mb-1 w-full break-words whitespace-normal">{users[0].displayName}</div>
              <div className="text-lg font-bold text-[#111] mb-1 w-full">{users[0].totalScore}</div>
            </div>
          </div>
        )}
        {/* 2. Kullanıcı */}
        {users[1] && (
          <div className="w-full rounded-2xl shadow-2xl border-2 border-purple-400 bg-gradient-to-br from-purple-400 via-indigo-400 to-blue-500 flex flex-row items-center gap-3 p-4 mb-2 relative overflow-hidden">
            <div className="flex flex-col items-center justify-center">
              <span className="w-14 h-14 rounded-full bg-white/80 shadow-lg flex items-center justify-center mx-auto mb-1">
                <span className="text-4xl font-extrabold text-purple-500">2</span>
                  </span>
            </div>
            <div className="flex flex-col items-start flex-1">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-purple-400 shadow-lg mb-2">
                {users[1].photoURL ? (
                  <img src={users[1].photoURL} alt={users[1].displayName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-purple-500" />
                  )}
                </div>
              <div className="text-xl font-extrabold text-purple-900 mb-1 w-full break-words whitespace-normal">{users[1].displayName}</div>
              <div className="text-lg font-bold text-[#111] mb-1 w-full">{users[1].totalScore}</div>
            </div>
          </div>
        )}
        {/* 3. Kullanıcı */}
        {users[2] && (
          <div className="w-full rounded-2xl shadow-2xl border-2 border-pink-400 bg-gradient-to-br from-pink-400 via-pink-300 to-red-400 flex flex-row items-center gap-3 p-4 mb-2 relative overflow-hidden">
            <div className="flex flex-col items-center justify-center">
              <span className="w-14 h-14 rounded-full bg-white/80 shadow-lg flex items-center justify-center mx-auto mb-1">
                <span className="text-4xl font-extrabold text-pink-500">3</span>
              </span>
            </div>
            <div className="flex flex-col items-start flex-1">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-pink-400 shadow-lg mb-2">
                {users[2].photoURL ? (
                  <img src={users[2].photoURL} alt={users[2].displayName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-pink-500" />
                )}
              </div>
              <div className="text-xl font-extrabold text-pink-900 mb-1 w-full break-words whitespace-normal">{users[2].displayName}</div>
              <div className="text-lg font-bold text-[#111] mb-1 w-full">{users[2].totalScore}</div>
            </div>
          </div>
        )}
      </div>

      {/* Masaüstü Podium Tasarımı (Yan Yana, Daha Geniş ve Animasyonlu) */}
      <div className="w-full max-w-5xl flex flex-row items-center justify-center gap-6 mb-20 hidden md:flex"> {/* Sadece masaüstünde görünür */}
        {/* 2. Kullanıcı */}
        {users[1] && (
          <div className="flex-1 min-w-[240px] max-w-[280px] flex flex-col items-center p-6 border-2 border-gray-700/50 rounded-xl backdrop-blur-lg shadow-xl bg-gradient-to-br from-gray-800 to-gray-900 transition-transform duration-300 ease-in-out hover:shadow-2xl hover:scale-105">
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center overflow-hidden border-4 border-purple-400">
                {users[1].photoURL ? (
                  <img src={users[1].photoURL} alt={users[1].displayName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-purple-200" />
                )}
              </div>
              <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-purple-600 text-white text-sm font-bold flex items-center justify-center shadow-md">2</span>
            </div>
            <div className="text-xl font-bold text-purple-300 w-full text-center break-words whitespace-normal">{users[1].displayName}
              {(users[1].userId === 'VtSQP9JxPSVmRrHUyeMX9aYBMDq1' || users[1].displayName === 'Defne') && (
                <div className="flex flex-wrap justify-center gap-1 mt-1">
                  <span className="inline-flex items-center px-2 py-1 bg-green-600 rounded-full text-xs font-semibold">
                    <svg className="w-4 h-4 mr-0" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </span>
                  {users[1].userId === 'VtSQP9JxPSVmRrHUyeMX9aYBMDq1' && (
                    <span className="inline-flex items-center px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-semibold ml-1">
                      <Crown className="w-4 h-4 mr-1 text-blue-500" /> İlk Destekçimiz
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="text-sm text-gray-300 mt-1">Sıra: <span className="font-bold text-purple-200">{users[1].totalScore}</span> Puan</div>
          </div>
        )}

        {/* 1. Kullanıcı (Ortada ve en belirgin) */}
        {users[0] && (
          <div className="flex-1 min-w-[260px] max-w-[320px] flex flex-col items-center p-8 border-2 border-yellow-400/60 rounded-xl backdrop-blur-lg shadow-2xl bg-gradient-to-br from-yellow-500 to-orange-500 relative z-10">
            <Crown className="absolute -top-5 -translate-x-1/2 left-1/2 w-14 h-14 text-yellow-400" />
            <div className="relative mb-5 mt-6">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-yellow-400 shadow-lg">
                {users[0].photoURL ? (
                  <img src={users[0].photoURL} alt={users[0].displayName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-yellow-500" />
                )}
              </div>
              <span className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-yellow-500 text-white text-xl font-bold flex items-center justify-center shadow-lg">1</span>
            </div>
            <div className="text-2xl font-extrabold text-yellow-900 w-full text-center break-words whitespace-normal">{users[0].displayName}
              {(['VtSQP9JxPSVmRrHUyeMX9aYBMDq1'].includes(users[0].userId) || users[0].displayName === 'Defne') && (
                <div className="flex flex-wrap justify-center gap-1 mt-1">
                  <span className="inline-flex items-center px-2 py-1 bg-green-600 rounded-full text-xs font-semibold">
                    <svg className="w-4 h-4 mr-0" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </span>
                  {users[0].userId === 'VtSQP9JxPSVmRrHUyeMX9aYBMDq1' && (
                    <span className="inline-flex items-center px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-semibold ml-1">
                      <Crown className="w-4 h-4 mr-1 text-blue-500" /> İlk Destekçimiz
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="text-xl font-bold text-yellow-800 mt-1">Sıra: <span className="text-yellow-900">{users[0].totalScore}</span> Puan</div>
          </div>
        )}

        {/* 3. Kullanıcı */}
        {users[2] && (
          <div className="flex-1 min-w-[240px] max-w-[280px] flex flex-col items-center p-6 border-2 border-pink-400/50 rounded-xl backdrop-blur-lg shadow-xl bg-gradient-to-br from-pink-600 to-red-500 transition-transform duration-300 ease-in-out hover:shadow-2xl hover:scale-105">
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-red-400 flex items-center justify-center overflow-hidden border-4 border-pink-300">
                {users[2].photoURL ? (
                  <img src={users[2].photoURL} alt={users[2].displayName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-pink-200" />
                )}
              </div>
              <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-pink-500 text-white text-sm font-bold flex items-center justify-center shadow-md">3</span>
            </div>
            <div className="text-xl font-bold text-pink-300 w-full text-center break-words whitespace-normal">{users[2].displayName}
              {(users[2].userId === 'VtSQP9JxPSVmRrHUyeMX9aYBMDq1' || users[2].displayName === 'Defne') && (
                <div className="flex flex-wrap justify-center gap-1 mt-1">
                  <span className="inline-flex items-center px-2 py-1 bg-green-600 rounded-full text-xs font-semibold">
                    <svg className="w-4 h-4 mr-0" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </span>
                  {users[2].userId === 'VtSQP9JxPSVmRrHUyeMX9aYBMDq1' && (
                    <span className="inline-flex items-center px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-semibold ml-1">
                      <Crown className="w-4 h-4 mr-1 text-blue-500" /> İlk Destekçimiz
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="text-sm text-gray-300 mt-1">Sıra: <span className="font-bold text-pink-200">{users[2].totalScore}</span> Puan</div>
          </div>
        )}
      </div>

      {/* Arama kutusu podiumdan sonra, tam listenin hemen üstünde */}
      <div className="w-full max-w-3xl mx-auto flex justify-center mb-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Kullanıcı adı ile ara..."
          className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 w-full max-w-md text-lg shadow"
        />
      </div>

      {/* Tam Liste */}
      <div className="w-full max-w-3xl bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-t border-gray-700/40 rounded-xl shadow-lg backdrop-blur-lg">
        <div className="p-3 md:p-4 border-b border-gray-700/40">
          <h2 className="text-xl md:text-2xl font-bold text-gray-200 text-center">Tüm Sıralama</h2>
        </div>
        <ul className="divide-y divide-gray-700/40">
          {loading ? (
            <li className="text-center py-10 text-gray-400 text-lg">Veriler yükleniyor...</li>
          ) : filteredUsers.length === 0 ? (
            <li className="text-center py-10 text-gray-400 text-lg">Aramanıza uygun kullanıcı bulunamadı.</li>
          ) : (
            filteredUsers.map((user, index) => (
              (user.userId === 'uckYnXidETgbgd8sI6ehlgZQnT43') ? (
                <li key={user.userId} className={`flex items-center gap-3 px-3 md:px-6 py-3 md:py-4 transition-all duration-200 ease-in-out ${index % 2 === 0 ? 'bg-gray-900/20' : 'bg-gray-800/30'} hover:bg-gray-800/50`}>
                  <div className={`w-8 h-8 flex items-center justify-center font-bold text-sm rounded-full
                    ${index === 0 ? 'bg-yellow-500 text-yellow-900' :
                      index === 1 ? 'bg-purple-500 text-purple-900' :
                      index === 2 ? 'bg-pink-500 text-pink-900' :
                      'bg-gray-600 text-gray-300'}`}>{index + 1}</div>
                  <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center overflow-hidden">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" onError={e => { e.currentTarget.onerror = null; e.currentTarget.style.display='none'; e.currentTarget.parentElement?.appendChild(document.createTextNode(user.displayName?.charAt(0)?.toUpperCase() || '?')); }} />
                    ) : (
                      <FallbackAvatar name={user.displayName} size={40} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate text-pink-500">{user.displayName}</div>
                    {/* Rozetler ve özel yıldız (Defne & Görkem) */}
                    <div className="flex flex-wrap items-center gap-1 mt-1">
                      {(['VtSQP9JxPSVmRrHUyeMX9aYBMDq1', 'uckYnXidETgbgd8sI6ehlgZQnT43'].includes(user.userId) || user.displayName === 'Defne') && (
                        <span className="inline-flex items-center px-2 py-1 bg-green-600 rounded-full text-xs font-semibold">
                          <svg className="w-4 h-4 mr-0" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        </span>
                      )}
                      {user.badges?.map((badge, index) => {
                        // Destekçi rozeti
                        if (badge === 'destekçi') {
                          return (
                            <span key={index} className="inline-flex items-center px-2 py-1 bg-green-600 rounded-full text-xs font-semibold">
                              <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                              Destekçi
                            </span>
                          );
                        }
                        // Ekstra rozet
                        if (badge === 'ekstra') {
                          return (
                            <span key={index} className="inline-flex items-center px-2 py-1 bg-purple-600 rounded-full text-xs font-semibold">
                              <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                              Ekstra
                            </span>
                          );
                        }
                        // Bağışçı rozeti
                        if (badge === 'bağışçı') {
                          return (
                            <span key={index} className="inline-flex items-center px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs font-semibold">
                              <Award className="w-4 h-4 mr-1 text-yellow-500" /> Bağışçı
                            </span>
                          );
                        }
                        // Diğer rozetler
                        return (
                          <span key={index} className="inline-flex items-center px-2 py-1 bg-blue-600 rounded-full text-xs font-semibold">
                            {badge}
                          </span>
                        );
                      })}
                      {/* İlk destekçi rozeti */}
                      {user.isFirstSupporter && (
                        <span className="inline-flex items-center px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-semibold">
                          <Crown className="w-4 h-4 mr-1 text-blue-500" /> İlk Destekçimiz
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex flex-col justify-center">
                    <div className="text-lg font-bold text-white">{user.totalScore}</div>
                    <div className="text-xs text-gray-400">puan</div>
                  </div>
                </li>
              ) : (
                <li key={user.userId} className={`flex items-center gap-3 px-3 md:px-6 py-3 md:py-4 transition-all duration-200 ease-in-out ${index % 2 === 0 ? 'bg-gray-900/20' : 'bg-gray-800/30'} hover:bg-gray-800/50`}>
                  {/* Sıra Numarası */}
                  <div className={`w-8 h-8 flex items-center justify-center font-bold text-sm rounded-full
                    ${index === 0 ? 'bg-yellow-500 text-yellow-900' :
                      index === 1 ? 'bg-purple-500 text-purple-900' :
                      index === 2 ? 'bg-pink-500 text-pink-900' :
                      'bg-gray-600 text-gray-300'}`}>{index + 1}</div>

                  {/* Kullanıcı Fotoğrafı */}
                  <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center overflow-hidden">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" onError={e => { e.currentTarget.onerror = null; e.currentTarget.style.display='none'; e.currentTarget.parentElement?.appendChild(document.createTextNode(user.displayName?.charAt(0)?.toUpperCase() || '?')); }} />
                    ) : (
                      <FallbackAvatar name={user.displayName} size={40} />
                    )}
                  </div>

                  {/* Kullanıcı Bilgileri (isim ve email) */}
                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <div className="font-semibold text-white truncate flex flex-col items-start gap-0">
                      <span>{user.displayName}</span>
                      {user.userId === 'yNLpF1DLshhr1JUAaMIaUDWD1QC2' && (
                        <span className="inline-flex items-center mt-1 px-2 py-0.5 bg-yellow-400 border border-yellow-500 shadow rounded-full text-xs font-bold text-yellow-900" style={{letterSpacing:'0.03em'}}>
                          <Crown className="w-4 h-4 text-white mr-1" /> Founder of WordPlay
                        </span>
                      )}
                      {(['VtSQP9JxPSVmRrHUyeMX9aYBMDq1'].includes(user.userId) || user.displayName === 'Defne') && (
                        <div className="flex flex-wrap justify-center gap-1 mt-1">
                          <span className="inline-flex items-center px-2 py-1 bg-green-600 rounded-full text-xs font-semibold">
                            <svg className="w-4 h-4 mr-0" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          </span>
                          {user.userId === 'VtSQP9JxPSVmRrHUyeMX9aYBMDq1' && (
                            <span className="inline-flex items-center px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-semibold ml-1">
                              <Crown className="w-4 h-4 mr-1 text-blue-500" /> İlk Destekçimiz
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {/* Dinamik rozet sistemi */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.badges?.map((badge, index) => {
                        // Destekçi rozeti
                        if (badge === 'destekçi') {
                          return (
                            <span key={index} className="inline-flex items-center px-2 py-1 bg-green-600 rounded-full text-xs font-semibold">
                              <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                              Destekçi
                            </span>
                          );
                        }
                        // Ekstra rozet
                        if (badge === 'ekstra') {
                          return (
                            <span key={index} className="inline-flex items-center px-2 py-1 bg-purple-600 rounded-full text-xs font-semibold">
                              <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                              Ekstra
                            </span>
                          );
                        }
                        // Bağışçı rozeti
                        if (badge === 'bağışçı') {
                          return (
                            <span key={index} className="inline-flex items-center px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs font-semibold">
                              <Award className="w-4 h-4 mr-1 text-yellow-500" /> Bağışçı
                            </span>
                          );
                        }
                        // Diğer rozetler
                        return (
                          <span key={index} className="inline-flex items-center px-2 py-1 bg-blue-600 rounded-full text-xs font-semibold">
                            {badge}
                          </span>
                        );
                      })}
                      {/* İlk destekçi rozeti */}
                      {user.isFirstSupporter && (
                        <span className="inline-flex items-center px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-semibold">
                          <Crown className="w-4 h-4 mr-1 text-blue-500" /> İlk Destekçimiz
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Puan */}
                  <div className="text-right flex flex-col justify-center">
                    <div className="text-lg font-bold text-white">{user.totalScore}</div>
                    <div className="text-xs text-gray-400">puan</div>
                  </div>
                </li>
              )
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default LeaderboardPage;