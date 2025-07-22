import React, { useEffect, useState } from 'react';
import { Trophy, User, Crown, Medal, Award } from 'lucide-react';
import { collection, getFirestore, orderBy, query, onSnapshot } from 'firebase/firestore';
import app from '../config/firebase';

interface UserProfile {
  userId: string;
  displayName: string;
  email: string;
  photoURL?: string;
  totalScore: number;
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

  useEffect(() => {
    setLoading(true);
    const db = getFirestore(app);
    const q = query(collection(db, 'userProfiles'), orderBy('totalScore', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedUsers: UserProfile[] = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          userId: doc.id,
          displayName: data.displayName || '',
          email: data.email || '',
          photoURL: data.photoURL || undefined,
          totalScore: data.totalScore || 0,
        };
      });
      setUsers(fetchedUsers.filter(u => u.displayName && u.displayName.trim() !== ''));
      setLoading(false);
    }, () => setLoading(false));
    return () => unsubscribe();
  }, []);

  return (
    // Genel Arka Plan ve Font (Varsayılan Tailwind Sans)
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-black px-4 py-8 md:py-16 flex flex-col items-center font-sans">

      {/* Masaüstü İçin Başlık Tasarımı */}
      <header className="w-full max-w-2xl mx-auto text-center mb-8 flex flex-col items-center gap-2">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg select-none uppercase" style={{letterSpacing:'0.04em', fontFamily:'Inter, Bebas Neue, Arial, sans-serif'}}>
          LİDERLER
        </h1>
        <p className="text-gray-300 text-base md:text-lg font-medium mt-2">En iyi oyuncular burada! Sıralamaya gir ve ödülleri kap!</p>
      </header>

      {/* Mobil Podium Tasarımı (Alt Alta, Daha Kompakt) */}
      <div className="w-full max-w-[360px] flex flex-col items-center gap-4 mb-8 md:hidden"> {/* Sadece mobilde görünür */}
        {/* 2. Kullanıcı */}
        {users[1] && (
          <div className="w-full flex flex-col items-center p-4 border-2 border-gray-700/50 rounded-xl backdrop-blur-lg shadow-lg bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="relative mb-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center overflow-hidden border-4 border-purple-400">
                {users[1].photoURL ? (
                  <img src={users[1].photoURL} alt={users[1].displayName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-purple-200" />
                )}
              </div>
              <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-purple-600 text-white text-base font-bold flex items-center justify-center shadow-md">2</span>
            </div>
            <div className="text-lg font-bold text-purple-300 truncate w-full text-center">{users[1].displayName}</div>
            <div className="text-sm text-gray-300 mt-1">Sıra: <span className="font-bold text-purple-200">{users[1].totalScore}</span> Puan</div>
          </div>
        )}

        {/* 1. Kullanıcı (En Belirgin) */}
        {users[0] && (
          <div className="w-full max-w-[380px] flex flex-col items-center p-5 border-2 border-yellow-400/60 rounded-xl backdrop-blur-lg shadow-xl bg-gradient-to-br from-yellow-500 to-orange-500 relative -mb-3 z-10">
            <Crown className="absolute -top-3 -left-3 w-8 h-8 text-yellow-400" />
            <div className="relative mb-4 mt-5">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-yellow-400 shadow-lg">
                {users[0].photoURL ? (
                  <img src={users[0].photoURL} alt={users[0].displayName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-yellow-500" />
                )}
              </div>
              <span className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-yellow-500 text-white text-lg font-bold flex items-center justify-center shadow-lg">1</span>
            </div>
            <div className="text-xl font-extrabold text-yellow-900 truncate w-full text-center">{users[0].displayName}</div>
            <div className="text-lg font-bold text-yellow-800 mt-1">Sıra: <span className="text-yellow-900">{users[0].totalScore}</span> Puan</div>
          </div>
        )}

        {/* 3. Kullanıcı */}
        {users[2] && (
          <div className="w-full flex flex-col items-center p-4 border-2 border-pink-400/50 rounded-xl backdrop-blur-lg shadow-lg bg-gradient-to-br from-pink-600 to-red-500">
            <div className="relative mb-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-red-400 flex items-center justify-center overflow-hidden border-4 border-pink-300">
                {users[2].photoURL ? (
                  <img src={users[2].photoURL} alt={users[2].displayName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-pink-200" />
                )}
              </div>
              <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-pink-500 text-white text-base font-bold flex items-center justify-center shadow-md">3</span>
            </div>
            <div className="text-lg font-bold text-pink-300 truncate w-full text-center">{users[2].displayName}</div>
            <div className="text-sm text-gray-300 mt-1">Sıra: <span className="font-bold text-pink-200">{users[2].totalScore}</span> Puan</div>
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
            <div className="text-xl font-bold text-purple-300 truncate w-full text-center">{users[1].displayName}</div>
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
            <div className="text-2xl font-extrabold text-yellow-900 truncate w-full text-center">{users[0].displayName}</div>
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
            <div className="text-xl font-bold text-pink-300 truncate w-full text-center">{users[2].displayName}</div>
            <div className="text-sm text-gray-300 mt-1">Sıra: <span className="font-bold text-pink-200">{users[2].totalScore}</span> Puan</div>
          </div>
        )}
      </div>

      {/* Tam Liste */}
      <div className="w-full max-w-3xl bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-t border-gray-700/40 rounded-xl shadow-lg backdrop-blur-lg">
        <div className="p-3 md:p-4 border-b border-gray-700/40">
          <h2 className="text-xl md:text-2xl font-bold text-gray-200 text-center">Tüm Sıralama</h2>
        </div>
        <ul className="divide-y divide-gray-700/40">
          {loading ? (
            <li className="text-center py-10 text-gray-400 text-lg">Veriler yükleniyor...</li>
          ) : users.length === 0 ? (
            <li className="text-center py-10 text-gray-400 text-lg">Liderlik tablosunda henüz kimse yok.</li>
          ) : (
            users.map((user, index) => (
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
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white truncate">{user.displayName}</div>
                </div>

                {/* Puan */}
                <div className="text-right flex flex-col justify-center">
                  <div className="text-lg font-bold text-white">{user.totalScore}</div>
                  <div className="text-xs text-gray-400">puan</div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default LeaderboardPage;