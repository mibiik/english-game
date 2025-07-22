import React, { useEffect, useState } from 'react';
import { Trophy, User, Crown, Medal, Award } from 'lucide-react';
import { collection, getDocs, getFirestore, orderBy, query } from 'firebase/firestore';
import app from '../config/firebase';

interface UserProfile {
  userId: string;
  displayName: string;
  email: string;
  photoURL?: string;
  totalScore: number;
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const db = getFirestore(app);
        const q = query(collection(db, 'userProfiles'), orderBy('totalScore', 'desc'));
        const querySnapshot = await getDocs(q);
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
        setUsers(fetchedUsers);
      } catch (error) {
        setUsers([]);
      }
      setLoading(false);
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
        <div className="flex flex-col items-center gap-4">
          <Trophy className="w-16 h-16 text-indigo-400 animate-bounce" />
          <div className="text-xl text-gray-700 font-semibold">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 flex flex-col items-center py-8 px-2">
      {/* Başlık */}
      <div className="w-full max-w-2xl mx-auto text-center mb-8">
        <div className="flex flex-col items-center gap-2">
          <Trophy className="w-10 h-10 text-indigo-500" />
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Liderlik Tablosu</h1>
          <p className="text-gray-500 text-sm">En yüksek puanlı oyuncular</p>
        </div>
      </div>

      {/* İlk 3 Kullanıcı */}
      {users.length >= 3 && (
        <div className="flex flex-col md:flex-row gap-6 justify-center items-end mb-10 w-full max-w-3xl">
          {/* 2. */}
          <div className="flex-1 flex flex-col items-center bg-white rounded-xl shadow p-4 border border-gray-100">
            <div className="relative mb-2">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {users[1].photoURL ? (
                  <img src={users[1].photoURL} alt={users[1].displayName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <span className="absolute -top-2 -right-2 bg-gray-400 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold">2</span>
            </div>
            <Medal className="w-5 h-5 text-gray-400 mb-1" />
            <div className="font-semibold text-gray-800">{users[1].displayName}</div>
            <div className="text-lg font-bold text-gray-600">{users[1].totalScore}</div>
          </div>
          {/* 1. */}
          <div className="flex-1 flex flex-col items-center bg-gradient-to-br from-yellow-300 to-orange-400 rounded-xl shadow-lg p-6 border-2 border-yellow-200 scale-110 z-10">
            <div className="relative mb-2">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-yellow-200">
                {users[0].photoURL ? (
                  <img src={users[0].photoURL} alt={users[0].displayName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-yellow-500" />
                )}
              </div>
              <span className="absolute -top-3 -right-3 bg-yellow-400 text-white w-9 h-9 rounded-full flex items-center justify-center text-base font-bold">1</span>
            </div>
            <Crown className="w-7 h-7 text-yellow-500 mb-1" />
            <div className="font-bold text-gray-900 text-lg">{users[0].displayName}</div>
            <div className="text-2xl font-bold text-yellow-700">{users[0].totalScore}</div>
          </div>
          {/* 3. */}
          <div className="flex-1 flex flex-col items-center bg-white rounded-xl shadow p-4 border border-gray-100">
            <div className="relative mb-2">
              <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
                {users[2].photoURL ? (
                  <img src={users[2].photoURL} alt={users[2].displayName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-orange-400" />
                )}
              </div>
              <span className="absolute -top-2 -right-2 bg-orange-400 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold">3</span>
            </div>
            <Award className="w-5 h-5 text-orange-400 mb-1" />
            <div className="font-semibold text-gray-800">{users[2].displayName}</div>
            <div className="text-lg font-bold text-orange-600">{users[2].totalScore}</div>
          </div>
        </div>
      )}

      {/* Tüm Sıralama */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3">
          <h2 className="text-lg font-semibold text-white text-center">Tüm Sıralama</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {users.length === 0 ? (
            <div className="text-center py-10">
              <Trophy className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">Henüz skor bulunmamaktadır.</p>
            </div>
          ) : (
            users.map((user, index) => (
              <div key={user.userId} className={`flex items-center gap-4 px-4 py-3 ${index < 3 ? 'bg-gray-50' : ''}`}>
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="font-semibold text-indigo-600 text-xs">#{index + 1}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{user.displayName}</div>
                  <div className="text-xs text-gray-500 truncate">{user.email}</div>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-indigo-600">{user.totalScore}</div>
                  <div className="text-xs text-gray-400">puan</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}