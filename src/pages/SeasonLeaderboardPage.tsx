import React, { useEffect, useState, useRef } from 'react';
import { RefreshCw, Crown } from 'lucide-react';
import { seasonService, Season, SeasonLeaderboard } from '../services/seasonService';
import { db } from '../config/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { FIREBASE_SEASON_ID } from '../constants/seasons';

const FallbackAvatar = ({ name, size = 40 }: { name: string; size?: number }) => (
  <span style={{ width: size, height: size }} className="flex items-center justify-center bg-gray-700/60 rounded-full">
    <span className="text-lg font-bold text-white/80">{name?.charAt(0)?.toUpperCase() || '?'}</span>
  </span>
);

const SeasonLeaderboardPage: React.FC = () => {
  const [currentSeason, setCurrentSeason] = useState<Season | null>(null);
  const [allSeasons, setAllSeasons] = useState<Season[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [leaderboard, setLeaderboard] = useState<SeasonLeaderboard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [firebaseOldSeason, setFirebaseOldSeason] = useState<{ id: string; name: string } | null>(null);
  const [firebaseUsers, setFirebaseUsers] = useState<SeasonLeaderboard[]>([]);
  const initialFromHome = useRef<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // Read one-time handoff first so we can honor it early
        const fromHome = localStorage.getItem('selectedSeasonFromHome') || undefined;
        if (fromHome) {
          initialFromHome.current = fromHome;
          localStorage.removeItem('selectedSeasonFromHome');
        }

        // If the one-time selection is the Firebase legacy marker, load it immediately
        if (initialFromHome.current === FIREBASE_SEASON_ID) {
          const fb = await loadFirebaseOldSeason();
          setSelectedSeason(FIREBASE_SEASON_ID);
          setLeaderboard(fb || []);
          // Still continue to load current seasons in background so the selector is populated
          const [season, seasons] = await Promise.all([seasonService.getCurrentSeason(), seasonService.getAllSeasons()]);
          setCurrentSeason(season);
          setAllSeasons(seasons || []);
          setLoading(false);
          return;
        }

        // Normal path: load seasons, then pick initial/current
        const [season, seasons] = await Promise.all([seasonService.getCurrentSeason(), seasonService.getAllSeasons()]);
        setCurrentSeason(season);
        setAllSeasons(seasons || []);

        // Start loading firebase preview in background
        loadFirebaseOldSeason().catch(() => {});

        if (initialFromHome.current) {
          await applySelection(initialFromHome.current);
        } else if (season) {
          await applySelection(season.id);
        }
      } catch (err) {
        console.error('Initial load failed', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedSeason) return;
    (async () => {
      setLoading(true);
      try {
        await applySelection(selectedSeason);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedSeason]);

  async function applySelection(id: string) {
    if (id === FIREBASE_SEASON_ID) {
      const f = firebaseUsers.length ? firebaseUsers : (await loadFirebaseOldSeason()) || [];
      setSelectedSeason(FIREBASE_SEASON_ID);
      setLeaderboard(f);
      return;
    }

    const lb = await seasonService.getSeasonLeaderboard(id);
    setSelectedSeason(id);
    setLeaderboard(lb || []);
  }

  async function loadFirebaseOldSeason(): Promise<SeasonLeaderboard[] | null> {
    try {
      const q = query(collection(db, 'userProfiles'), orderBy('totalScore', 'desc'));
      const snap = await getDocs(q);
      if (snap.empty) return null;

      const id = FIREBASE_SEASON_ID;
      setFirebaseOldSeason({ id, name: '2024-25 Sezonu' });

      const users = snap.docs
        .map((d, i) => {
          const data = d.data() as any;
          return {
            userId: d.id,
            displayName: data.displayName || data.userName || 'Anonim',
            email: data.email || '',
            photoURL: data.photoURL || data.avatarUrl,
            totalScore: data.totalScore || 0,
            gamesPlayed: data.gamesPlayed || 0,
            rank: i + 1,
            seasonId: id,
            badges: data.badges || [],
            isFirstSupporter: data.isFirstSupporter || false,
          } as SeasonLeaderboard;
        })
        .filter(u => u.displayName && u.displayName !== 'Anonim' && u.totalScore > 0)
        .map((u, idx) => ({ ...u, rank: idx + 1 }));

      setFirebaseUsers(users);
      return users;
    } catch (err) {
      console.error('Firebase load error', err);
      return null;
    }
  }

  const filteredUsers = search.trim() ? leaderboard.filter(u => u.displayName.toLowerCase().includes(search.toLowerCase())) : leaderboard;

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const [season, seasons] = await Promise.all([seasonService.getCurrentSeason(), seasonService.getAllSeasons()]);
      setCurrentSeason(season);
      setAllSeasons(seasons || []);
      await loadFirebaseOldSeason();
      if (selectedSeason) await applySelection(selectedSeason);
      else if (season) await applySelection(season.id);
    } catch (err) {
      console.error('Refresh failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-black px-4 flex flex-col items-center font-sans -mt-[230px] pt-0">
      <div className="w-full max-w-5xl mx-auto flex items-center justify-end gap-2 mt-[240px]">
        <select 
          value={selectedSeason} 
          onChange={(e) => setSelectedSeason(e.target.value)} 
          className="px-2 py-1 bg-gray-800/50 text-gray-200 text-sm rounded-lg border border-gray-700/30"
        >
          {currentSeason && <option value={currentSeason.id}>{currentSeason.name}</option>}
          {allSeasons
            .filter(s => s.id !== currentSeason?.id)
            .filter(s => !(firebaseOldSeason && s.name === firebaseOldSeason.name))
            .map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          {firebaseOldSeason && <option value={FIREBASE_SEASON_ID}>{firebaseOldSeason.name}</option>}
        </select>

        <button 
          onClick={handleRefresh} 
          className="p-1.5 bg-gray-800/50 hover:bg-gray-700/60 text-gray-300 rounded-lg"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <header className="w-full max-w-2xl mx-auto text-center mb-2">
        <h1 className="text-2xl font-bold text-white">{selectedSeason === FIREBASE_SEASON_ID ? (firebaseOldSeason?.name || 'Eski Sezon') : (allSeasons.find(s => s.id === selectedSeason)?.name || currentSeason?.name || 'Liderler')}</h1>
      </header>

      <div className="w-full max-w-5xl px-2">
        <div className="mb-4 flex items-center justify-between gap-4">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Kullanıcı adı ara..." className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700" />
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Yükleniyor...</div>
        ) : (
          <>
            {/* Modern Top 3 Podium */}
            <div className="mb-8 w-full">
              <div className="flex justify-center items-end gap-2 px-2">
                {/* Second Place */}
                <div className="flex-1 max-w-[120px] relative order-first">
                  <div className="flex flex-col items-center">
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#c0c0c0] to-[#e0e0e0] rounded-full blur opacity-40 group-hover:opacity-60 transition duration-300"></div>
                      <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[#c0c0c0] shadow-lg bg-white relative z-10 transform group-hover:scale-105 transition duration-300">
                        {filteredUsers[1]?.photoURL ? (
                          <img src={filteredUsers[1].photoURL} alt={filteredUsers[1].displayName} className="w-full h-full object-cover" />
                        ) : (
                          <span className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-600">
                            {filteredUsers[1]?.displayName?.charAt(0) || '?'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-[#c0c0c0] to-[#a0a0a0] rounded-full flex items-center justify-center shadow-lg ring-4 ring-[#c0c0c0]/30">
                      <span className="text-gray-800 font-bold text-xl">2</span>
                    </div>
                    <div className="mt-2 text-center">
                      <div className="font-bold text-white text-sm truncate max-w-[100px]">{filteredUsers[1]?.displayName}</div>
                      <div className="mt-1">
                        <span className="font-bold text-xl text-[#c0c0c0]">{filteredUsers[1]?.totalScore}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* First Place - Larger & Centered */}
                <div className="relative flex-1 max-w-[140px] order-none -mb-4">
                  <div className="flex flex-col items-center">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 rounded-full blur opacity-50 group-hover:opacity-70 transition duration-300"></div>
                      <div className="w-28 h-28 rounded-full overflow-hidden border-6 border-yellow-400 shadow-xl bg-white relative z-10 transform group-hover:scale-105 transition duration-300">
                        {filteredUsers[0]?.photoURL ? (
                          <img src={filteredUsers[0].photoURL} alt={filteredUsers[0].displayName} className="w-full h-full object-cover" />
                        ) : (
                          <span className="w-full h-full flex items-center justify-center text-3xl font-bold text-yellow-600">
                            {filteredUsers[0]?.displayName?.charAt(0) || '?'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="absolute -top-4 -left-4 w-14 h-14 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-xl ring-4 ring-yellow-400/30">
                      <Crown className="w-8 h-8 text-yellow-900" />
                    </div>
                    <div className="mt-3 text-center">
                      <div className="font-bold text-white text-base truncate max-w-[120px]">{filteredUsers[0]?.displayName}</div>
                      <div className="mt-1">
                        <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500">
                          {filteredUsers[0]?.totalScore}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Third Place */}
                <div className="flex-1 max-w-[120px] relative order-last">
                  <div className="flex flex-col items-center">
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#cd7f32] to-[#b87333] rounded-full blur opacity-40 group-hover:opacity-60 transition duration-300"></div>
                      <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[#cd7f32] shadow-lg bg-white relative z-10 transform group-hover:scale-105 transition duration-300">
                        {filteredUsers[2]?.photoURL ? (
                          <img src={filteredUsers[2].photoURL} alt={filteredUsers[2].displayName} className="w-full h-full object-cover" />
                        ) : (
                          <span className="w-full h-full flex items-center justify-center text-2xl font-bold text-[#cd7f32]">
                            {filteredUsers[2]?.displayName?.charAt(0) || '?'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-[#cd7f32] to-[#b87333] rounded-full flex items-center justify-center shadow-lg ring-4 ring-[#cd7f32]/30">
                      <span className="text-[#3d2613] font-bold text-xl">3</span>
                    </div>
                    <div className="mt-2 text-center">
                      <div className="font-bold text-white text-sm truncate max-w-[100px]">{filteredUsers[2]?.displayName}</div>
                      <div className="mt-1">
                        <span className="font-bold text-xl text-[#cd7f32]">{filteredUsers[2]?.totalScore}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Full list */}
            <div className="bg-gray-800/60 rounded-xl p-3 border border-gray-700">
              <ul className="divide-y divide-gray-700">
                {filteredUsers.length === 0 ? (
                  <li className="py-8 text-center text-gray-400">Görüntülenecek kullanıcı yok</li>
                ) : (
                  filteredUsers.map((user, idx) => {
                    const rank = user.rank ?? (idx + 1);
                    return (
                      <li key={user.userId} className="flex items-center gap-4 py-3 px-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${rank === 1 ? 'bg-yellow-400 text-black' : 'bg-gray-700 text-white'}`}>{rank}</div>
                          <div className={`w-10 h-10 rounded-full overflow-hidden bg-white/10 flex items-center justify-center border ${idx===0?'border-yellow-400':'border-gray-600'}`}>
                            {user.photoURL ? <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" /> : <FallbackAvatar name={user.displayName} />}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white truncate">{user.displayName}</div>
                          <div className="text-xs text-gray-400">{user.badges?.join(', ')}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-white">{user.totalScore}</div>
                          <div className="text-xs text-gray-400">puan</div>
                        </div>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SeasonLeaderboardPage;
