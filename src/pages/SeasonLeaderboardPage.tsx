import React, { useEffect, useState } from 'react';
import { Crown, User, Calendar, RefreshCw } from 'lucide-react';
import { seasonService, Season, SeasonLeaderboard } from '../services/seasonService';
import { db } from '../config/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

// Profil fotoğrafı yüklenemezse fallback için yardımcı fonksiyon
function FallbackAvatar({ name, size = 40 }: { name: string, size?: number }) {
  return (
    <span style={{width:size, height:size}} className="flex items-center justify-center bg-gray-700/60 rounded-full">
      <span className="text-lg font-bold text-white/80">{name?.charAt(0)?.toUpperCase() || '?'}</span>
    </span>
  );
}

const SeasonLeaderboardPage: React.FC = () => {
  const [currentSeason, setCurrentSeason] = useState<Season | null>(null);
  const [leaderboard, setLeaderboard] = useState<SeasonLeaderboard[]>([]);
  const [allSeasons, setAllSeasons] = useState<Season[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Firebase eski sezon için
  const [firebaseOldSeason, setFirebaseOldSeason] = useState<{id: string, name: string} | null>(null);
  const [firebaseUsers, setFirebaseUsers] = useState<SeasonLeaderboard[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadData();
    
    // localStorage'dan sezon seçimi (anasayfadan gelen)
    const selectedSeasonFromHome = localStorage.getItem('selectedSeasonFromHome');
    if (selectedSeasonFromHome) {
      setSelectedSeason(selectedSeasonFromHome);
      localStorage.removeItem('selectedSeasonFromHome'); // Tek kullanımlık
    }
  }, []);

  useEffect(() => {
    if (selectedSeason) {
      loadLeaderboard(selectedSeason);
    } else if (currentSeason) {
      setSelectedSeason(currentSeason.id); // Mevcut sezonu selectedSeason olarak ayarla
      loadLeaderboard(currentSeason.id);
    }
  }, [selectedSeason, currentSeason]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Mevcut sezonu getir
      const season = await seasonService.getCurrentSeason();
      setCurrentSeason(season);

      // Tüm sezonları getir
      const seasons = await seasonService.getAllSeasons();
      setAllSeasons(seasons);

      // Eğer selectedSeason yoksa mevcut sezonu ayarla
      if (!selectedSeason && season) {
        setSelectedSeason(season.id);
        const leaderboardData = await seasonService.getSeasonLeaderboard(season.id);
        setLeaderboard(leaderboardData);
      }

      // Firebase verilerini sadece hazırla, yükleme
      await loadFirebaseOldSeason();
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFirebaseOldSeason = async () => {
    try {
      console.log('🔥 Firebase\'den eski sezon verileri yükleniyor...');
      console.log('🔥 Firebase db objesi:', db);
      
      // Firebase'den kullanıcıları çek
      const usersQuery = query(collection(db, 'userProfiles'), orderBy('totalScore', 'desc'));
      console.log('🔥 Firebase sorgusu oluşturuldu:', usersQuery);
      
      const usersSnapshot = await getDocs(usersQuery);
      console.log('🔥 Firebase sorgu sonucu:', usersSnapshot.size, 'doküman bulundu');
      
      if (!usersSnapshot.empty) {
        // Firebase eski sezonu için özel bir ID oluştur
        const firebaseSeasonId = 'firebase-old-season-2024-25';
        setFirebaseOldSeason({ id: firebaseSeasonId, name: '2024-25 Sezonu' });
        
        // Firebase kullanıcılarını SeasonLeaderboard formatına çevir (anonim kullanıcıları filtrele)
        const firebaseUsers = usersSnapshot.docs
          .map((doc, index) => {
            const data = doc.data();
            console.log('🔥 Firebase doküman verisi:', doc.id, data);
            return {
              userId: doc.id,
              displayName: data.displayName || 'Anonim',
              email: data.email || '',
              photoURL: data.photoURL || data.avatarUrl,
              totalScore: data.totalScore || 0,
              gamesPlayed: data.gamesPlayed || 0,
              rank: index + 1,
              seasonId: firebaseSeasonId,
              badges: data.badges || [],
              isFirstSupporter: data.isFirstSupporter || false
            };
          })
          .filter(user => 
            user.displayName && 
            user.displayName !== 'Anonim' && 
            user.displayName.trim() !== '' &&
            user.totalScore > 0 &&
            user.displayName !== 'Silinmiş Kullanıcı' &&
            user.displayName !== 'Deleted User'
          )
          .map((user, index) => ({
            ...user,
            rank: index + 1 // Rank'i yeniden hesapla
          }));
        
        setFirebaseUsers(firebaseUsers);
        // setLeaderboard(firebaseUsers); // Bu satırı kaldırdık - sadece hazırla
        console.log('✅ Firebase eski sezon verileri hazırlandı:', firebaseUsers);
      } else {
        console.log('⚠️ Firebase\'de kullanıcı verisi bulunamadı');
      }
    } catch (error) {
      console.error('❌ Firebase eski sezon verileri yüklenirken hata:', error);
    }
  };

  const loadLeaderboard = async (seasonId: string) => {
    try {
      setLoading(true);
      
      // Firebase sezonu seçildiyse Firebase verilerini göster
      if (seasonId === 'firebase-old-season-2024-25') {
        // Firebase verileri henüz yüklenmemişse yükle
        if (firebaseUsers.length === 0) {
          await loadFirebaseOldSeason();
        } else {
          setLeaderboard(firebaseUsers);
        }
        setLoading(false);
        return;
      }
      
      const leaderboardData = await seasonService.getSeasonLeaderboard(seasonId);
      setLeaderboard(leaderboardData);
      setLoading(false);
    } catch (error) {
      console.error('Leaderboard yükleme hatası:', error);
      setLoading(false);
    }
  };

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
      .replace(/[^a-z0-9]/gi, '')
      .replace(/\s+/g, '');
  }

  // Arama filtresi
  const filteredUsers = search.trim().length > 0
    ? leaderboard.filter(u => normalize(u.displayName).includes(normalize(search)))
    : leaderboard;

  const handleSeasonChange = (seasonId: string) => {
    setSelectedSeason(seasonId);
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Mevcut sezonu yenile
      const season = await seasonService.getCurrentSeason();
      setCurrentSeason(season);

      // Tüm sezonları yenile
      const seasons = await seasonService.getAllSeasons();
      setAllSeasons(seasons);

      // Firebase verilerini yenile
      await loadFirebaseOldSeason();

      // Seçili sezonun leaderboard'unu yenile
      if (selectedSeason) {
        await loadLeaderboard(selectedSeason);
      } else if (season) {
        setSelectedSeason(season.id);
        await loadLeaderboard(season.id);
      }
    } catch (error) {
      console.error('Yenileme hatası:', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-black px-4 py-8 md:py-16 flex flex-col items-center font-sans" style={{ paddingTop: 'calc(64px + 2rem)', marginTop: '-128px' }}>
      
      {/* Sezon Seçici */}
      <div className="w-full max-w-3xl mx-auto mb-8">
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-300">Sezon</span>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={selectedSeason}
                onChange={(e) => handleSeasonChange(e.target.value)}
                className="px-3 py-2 bg-gray-900/50 text-gray-200 text-sm rounded-xl border border-gray-600/50 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 min-w-[200px]"
              >
                {currentSeason && (
                  <option value={currentSeason.id}>
                    {currentSeason.name} (Aktif)
                  </option>
                )}
                {allSeasons
                  .filter(season => 
                    !season.name.includes('2024-25') && 
                    season.id !== currentSeason?.id // Mevcut sezonu tekrar gösterme
                  )
                  .map((season) => (
                    <option key={season.id} value={season.id}>
                      {season.name}
                    </option>
                  ))}
                {firebaseOldSeason && (
                  <option value="firebase-old-season-2024-25">
                    {firebaseOldSeason.name}
                  </option>
                )}
              </select>
              
              <button
                onClick={handleRefresh}
                className="px-3 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded-xl transition-all duration-200 flex items-center gap-2 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Yenile
              </button>
            </div>
          </div>
          
        </div>
      </div>

      {/* Başlık */}
      <header className="w-full max-w-2xl mx-auto text-center mb-8 flex flex-col items-center gap-2">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg select-none uppercase" style={{letterSpacing:'0.04em', fontFamily:'Inter, Bebas Neue, Arial, sans-serif'}}>
          {selectedSeason === 'firebase-old-season-2024-25' 
            ? firebaseOldSeason?.name || 'Eski Sezon'
            : selectedSeason 
              ? allSeasons.find(s => s.id === selectedSeason)?.name || currentSeason?.name || 'Sezon'
              : currentSeason?.name || 'LİDERLER'}
        </h1>
        <p className="text-gray-300 text-base md:text-lg font-medium mt-2">
          {selectedSeason ? 'Seçilen sezonun liderleri' : 'En iyi oyuncular burada! Sıralamaya gir ve ödülleri kap!'}
        </p>
      </header>

      {/* Mobil Podium */}
      <div className="w-full max-w-[360px] flex flex-col items-center gap-4 mb-8 md:hidden">
        {filteredUsers.slice(0, 3).map((user, index) => (
          <div key={user.userId} className={`w-full rounded-2xl shadow-2xl border-2 flex flex-row items-center gap-3 p-4 mb-2 relative overflow-hidden ${
            index === 0 ? 'border-yellow-300 bg-gradient-to-br from-yellow-400 via-orange-300 to-orange-500' :
            index === 1 ? 'border-purple-400 bg-gradient-to-br from-purple-400 via-indigo-400 to-blue-500' :
            'border-pink-400 bg-gradient-to-br from-pink-400 via-pink-300 to-red-400'
          }`}>
            <div className="flex flex-col items-center justify-center">
              <span className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center mx-auto mb-1 ${
                index === 0 ? 'bg-white/80' : 'bg-white/80'
              }`}>
                <span className={`text-4xl font-extrabold ${
                  index === 0 ? 'text-yellow-500' :
                  index === 1 ? 'text-purple-500' :
                  'text-pink-500'
                }`}>{index + 1}</span>
              </span>
            </div>
            <div className="flex flex-col items-start flex-1">
              <div className={`w-20 h-20 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 shadow-lg mb-2 ${
                index === 0 ? 'border-yellow-400' :
                index === 1 ? 'border-purple-400' :
                'border-pink-400'
              }`}>
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                ) : (
                  <User className={`w-12 h-12 ${
                    index === 0 ? 'text-yellow-500' :
                    index === 1 ? 'text-purple-500' :
                    'text-pink-500'
                  }`} />
                )}
              </div>
              <div className={`text-xl font-extrabold mb-1 w-full break-words whitespace-normal ${
                index === 0 ? 'text-yellow-900' :
                index === 1 ? 'text-purple-900' :
                'text-pink-900'
              }`}>{user.displayName}</div>
              <div className={`text-lg font-bold mb-1 w-full ${
                index === 0 ? 'text-[#111]' :
                index === 1 ? 'text-[#111]' :
                'text-[#111]'
              }`}>{user.totalScore}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Masaüstü Podium */}
      <div className="w-full max-w-5xl flex flex-row items-end justify-center gap-6 mb-20 hidden md:flex">
        {/* 2. Kullanıcı */}
        <div className="flex-1 max-w-[200px] flex flex-col items-center">
          <div className="w-full bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 shadow-2xl border-2 border-purple-400 relative">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-purple-300 mb-3">
                {filteredUsers[1]?.photoURL ? (
                  <img src={filteredUsers[1].photoURL} alt={filteredUsers[1].displayName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-purple-600">
                    {filteredUsers[1]?.displayName?.charAt(0).toUpperCase() || 'M'}
                  </span>
                )}
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white mb-1">{filteredUsers[1]?.displayName || 'Mehmet'}</div>
                <div className="text-sm text-purple-200">Sıra: {filteredUsers[1]?.totalScore || 0} Puan</div>
              </div>
            </div>
            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-purple-600 text-white text-sm font-bold flex items-center justify-center shadow-lg">
              2
            </div>
          </div>
        </div>

        {/* 1. Kullanıcı */}
        <div className="flex-1 max-w-[250px] flex flex-col items-center relative z-10">
          <Crown className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-12 h-12 text-yellow-400" />
          <div className="w-full bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-8 shadow-2xl border-2 border-yellow-300 relative">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-yellow-300 mb-4">
                {filteredUsers[0]?.photoURL ? (
                  <img src={filteredUsers[0].photoURL} alt={filteredUsers[0].displayName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-yellow-600">
                    {filteredUsers[0]?.displayName?.charAt(0).toUpperCase() || 'A'}
                  </span>
                )}
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-yellow-900 mb-1">{filteredUsers[0]?.displayName || 'Arda'}</div>
                <div className="text-sm text-yellow-800">Sıra: {filteredUsers[0]?.totalScore || 0} Puan</div>
              </div>
            </div>
            <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-yellow-500 text-yellow-900 text-lg font-bold flex items-center justify-center shadow-lg">
              1
            </div>
          </div>
        </div>

        {/* 3. Kullanıcı */}
        <div className="flex-1 max-w-[200px] flex flex-col items-center">
          <div className="w-full bg-gradient-to-br from-pink-500 to-red-500 rounded-2xl p-6 shadow-2xl border-2 border-pink-400 relative">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-pink-300 mb-3">
                {filteredUsers[2]?.photoURL ? (
                  <img src={filteredUsers[2].photoURL} alt={filteredUsers[2].displayName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-pink-600">
                    {filteredUsers[2]?.displayName?.charAt(0).toUpperCase() || 'M'}
                  </span>
                )}
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white mb-1">{filteredUsers[2]?.displayName || 'Murat'}</div>
                <div className="text-sm text-pink-200">Sıra: {filteredUsers[2]?.totalScore || 0} Puan</div>
              </div>
            </div>
            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-pink-600 text-white text-sm font-bold flex items-center justify-center shadow-lg">
              3
            </div>
          </div>
        </div>
      </div>

      {/* Arama kutusu */}
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
          <h2 className="text-xl md:text-2xl font-bold text-gray-200 text-center">
            {selectedSeason ? 'Seçilen Sezon Sıralaması' : 'Tüm Sıralama'}
          </h2>
        </div>
        
        <ul className="divide-y divide-gray-700/40">
          {loading ? (
            <li className="text-center py-10 text-gray-400 text-lg">Veriler yükleniyor...</li>
          ) : filteredUsers.length === 0 ? (
            <li className="text-center py-10 text-gray-400 text-lg">Aramanıza uygun kullanıcı bulunamadı.</li>
          ) : (
            filteredUsers.map((user, index) => (
              <li key={user.userId} className={`flex items-center gap-3 px-3 md:px-6 py-3 md:py-4 transition-all duration-200 ease-in-out ${
                index % 2 === 0 ? 'bg-gray-900/20' : 'bg-gray-800/30'
              } hover:bg-gray-800/50`}>
                {/* Sıra Numarası */}
                <div className={`w-8 h-8 flex items-center justify-center font-bold text-sm rounded-full ${
                  index === 0 ? 'bg-yellow-500 text-yellow-900' :
                  index === 1 ? 'bg-purple-500 text-purple-900' :
                  index === 2 ? 'bg-pink-500 text-pink-900' :
                  'bg-gray-600 text-gray-300'
                }`}>{index + 1}</div>

                {/* Kullanıcı Fotoğrafı */}
                <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center overflow-hidden">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                  ) : (
                    <FallbackAvatar name={user.displayName} size={40} />
                  )}
                </div>

                {/* Kullanıcı Bilgileri */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white truncate">{user.displayName}</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {user.badges?.map((badge, badgeIndex) => (
                      <span key={badgeIndex} className="inline-flex items-center px-2 py-1 bg-blue-600 rounded-full text-xs font-semibold">
                        {badge}
                      </span>
                    ))}
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
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default SeasonLeaderboardPage;
