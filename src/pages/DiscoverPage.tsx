import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Users, MessageCircle, User, Star, MapPin, BookOpen, Trophy, Filter, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { db } from '../config/firebase';
import { collection, query, where, getDocs, orderBy, limit, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

interface UserProfile {
  userId: string;
  displayName: string;
  email: string;
  photoURL?: string;
  bio?: string;
  level?: string;
  totalScore: number;
  gamesPlayed: number;
  lastPlayed: Date;
  location?: string;
  interests?: string[];
  isOnline?: boolean;
  lastSeen?: Date;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

const DiscoverPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const levels = [
    { id: 'all', name: 'Tüm Seviyeler' },
    { id: 'foundation', name: 'Foundation' },
    { id: 'pre-intermediate', name: 'Pre-Intermediate' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'upper-intermediate', name: 'Upper-Intermediate' }
  ];

  useEffect(() => {
    loadUsers();
    loadCurrentUser();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, selectedLevel]);

  // Gerçek zamanlı arama için debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      filterUsers();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const loadCurrentUser = async () => {
    const user = authService.getCurrentUser();
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, 'userProfiles', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as UserProfile;
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error('Kullanıcı yüklenirken hata:', error);
      }
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData: UserProfile[] = [];
      const uniqueUserIds = new Set<string>();

      // 1. userProfiles koleksiyonundan kullanıcıları al
      try {
        const userProfilesQuery = query(
          collection(db, 'userProfiles'),
          orderBy('totalScore', 'desc'),
          limit(50)
        );
        
        const userProfilesSnapshot = await getDocs(userProfilesQuery);
        userProfilesSnapshot.forEach((doc) => {
          const data = doc.data();
          const userProfile: UserProfile = {
            ...data,
            lastPlayed: data.lastPlayed?.toDate(),
            lastSeen: data.lastSeen?.toDate()
          } as UserProfile;
          
          usersData.push(userProfile);
          uniqueUserIds.add(userProfile.userId);
        });
      } catch (error) {
        console.error('userProfiles yüklenirken hata:', error);
      }

      // 2. admin_notifications koleksiyonundan unique kullanıcıları al
      try {
        const notificationsQuery = query(collection(db, 'admin_notifications'));
        const notificationsSnapshot = await getDocs(notificationsQuery);
        
        notificationsSnapshot.forEach((doc) => {
          const data = doc.data();
          const userId = data.userId || data.user_id;
          
          if (userId && !uniqueUserIds.has(userId)) {
            // Bu kullanıcı henüz eklenmemiş, ekle
            const userProfile: UserProfile = {
              userId: userId,
              displayName: data.displayName || data.name || `Kullanıcı ${userId.slice(0, 8)}`,
              email: data.email || '',
              totalScore: data.totalScore || 0,
              gamesPlayed: data.gamesPlayed || 0,
              lastPlayed: data.lastPlayed?.toDate() || new Date(),
              lastSeen: data.lastSeen?.toDate() || new Date(),
              level: data.level || 'intermediate',
              bio: data.bio || '',
              location: data.location || '',
              isOnline: false
            };
            
            usersData.push(userProfile);
            uniqueUserIds.add(userId);
          }
        });
      } catch (error) {
        console.error('admin_notifications yüklenirken hata:', error);
      }

      // 3. users koleksiyonundan da kullanıcıları al (eğer varsa)
      try {
        const usersQuery = query(collection(db, 'users'));
        const usersSnapshot = await getDocs(usersQuery);
        
        usersSnapshot.forEach((doc) => {
          const data = doc.data();
          const userId = data.userId || data.uid || doc.id;
          
          if (userId && !uniqueUserIds.has(userId)) {
            const userProfile: UserProfile = {
              userId: userId,
              displayName: data.displayName || data.name || `Kullanıcı ${userId.slice(0, 8)}`,
              email: data.email || '',
              totalScore: data.totalScore || 0,
              gamesPlayed: data.gamesPlayed || 0,
              lastPlayed: data.lastPlayed?.toDate() || new Date(),
              lastSeen: data.lastSeen?.toDate() || new Date(),
              level: data.level || 'intermediate',
              bio: data.bio || '',
              location: data.location || '',
              isOnline: false
            };
            
            usersData.push(userProfile);
            uniqueUserIds.add(userId);
          }
        });
      } catch (error) {
        console.error('users koleksiyonu yüklenirken hata:', error);
      }

      // Mevcut kullanıcıyı listeden çıkar
      const currentUserId = authService.getCurrentUserId();
      const filteredUsers = usersData.filter(user => user.userId !== currentUserId);
      
      // Skora göre sırala
      filteredUsers.sort((a, b) => b.totalScore - a.totalScore);
      
      setUsers(filteredUsers);
      console.log(`Toplam ${filteredUsers.length} kullanıcı yüklendi`);
    } catch (error) {
      console.error('Kullanıcılar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Arama filtresi - daha gelişmiş arama
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(user => {
        // İsim araması
        const nameMatch = user.displayName?.toLowerCase().includes(searchLower);
        
        // Bio araması
        const bioMatch = user.bio?.toLowerCase().includes(searchLower);
        
        // Lokasyon araması
        const locationMatch = user.location?.toLowerCase().includes(searchLower);
        
        // Email araması (kısmi)
        const emailMatch = user.email?.toLowerCase().includes(searchLower);
        
        // Kelime başlangıcı araması
        const startsWithMatch = user.displayName?.toLowerCase().startsWith(searchLower);
        
        return nameMatch || bioMatch || locationMatch || emailMatch || startsWithMatch;
      });
    }

    // Seviye filtresi
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(user => user.level === selectedLevel);
    }

    // Skora göre sırala
    filtered.sort((a, b) => b.totalScore - a.totalScore);

    setFilteredUsers(filtered);
  };

  const sendMessage = async (receiverId: string) => {
    try {
      const senderId = authService.getCurrentUserId();
      if (!senderId) {
        alert('Giriş yapmanız gerekiyor');
        return;
      }

      // Mesajlar sayfasına yönlendir ve kullanıcı ID'sini state olarak geçir
      navigate('/messages', { 
        state: { 
          selectedUserId: receiverId,
          selectedUserName: users.find(u => u.userId === receiverId)?.displayName || `Kullanıcı ${receiverId.slice(0, 8)}`
        } 
      });
      
    } catch (error) {
      console.error('Hata:', error);
      alert('Bir hata oluştu');
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'foundation': return 'bg-green-500';
      case 'pre-intermediate': return 'bg-blue-500';
      case 'intermediate': return 'bg-purple-500';
      case 'upper-intermediate': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getLevelName = (level: string) => {
    switch (level) {
      case 'foundation': return 'Foundation';
      case 'pre-intermediate': return 'Pre-Int';
      case 'intermediate': return 'Int';
      case 'upper-intermediate': return 'Up-Int';
      default: return 'Unknown';
    }
  };

  if (!authService.isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#111] to-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Giriş Yapın</h1>
          <p className="text-gray-400 mb-6">Keşfet özelliğini kullanmak için giriş yapın</p>
          <button
            onClick={() => navigate('/home')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#111] to-black text-white" style={{ paddingTop: '64px', marginTop: '-128px' }}>
      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-500/20 rounded-full"
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
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/home')}
              className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold">Keşfet</h1>
              <p className="text-gray-400">Diğer öğrencilerle tanışın</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span>Filtreler</span>
            </button>
            <button
              onClick={() => {
                console.log('Toplam kullanıcı:', users.length);
                console.log('Filtrelenmiş kullanıcı:', filteredUsers.length);
                console.log('Arama terimi:', searchTerm);
                console.log('Seçili seviye:', selectedLevel);
              }}
              className="px-3 py-2 bg-blue-600/50 rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              Debug
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Kullanıcı ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gray-800/50 rounded-xl p-4 border border-gray-700"
              >
                <div className="flex flex-wrap gap-2">
                  {levels.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => setSelectedLevel(level.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedLevel === level.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {level.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search Results Info */}
        {!loading && (
          <div className="mb-6 text-center">
            <p className="text-gray-400">
              {searchTerm ? (
                <>
                  <span className="text-blue-400">{filteredUsers.length}</span> kullanıcı bulundu
                  {users.length > 0 && (
                    <span className="text-gray-500"> (toplam {users.length} kullanıcıdan)</span>
                  )}
                </>
              ) : (
                <>
                  Toplam <span className="text-blue-400">{users.length}</span> kullanıcı
                </>
              )}
            </p>
          </div>
        )}

        {/* Users Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredUsers.map((user, index) => (
                <motion.div
                  key={user.userId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all hover:shadow-xl"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {user.displayName?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{user.displayName}</h3>
                        {user.level && (
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium text-white ${getLevelColor(user.level)}`}>
                            {getLevelName(user.level)}
                          </span>
                        )}
                      </div>
                    </div>
                    {user.isOnline && (
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    )}
                  </div>

                  {user.bio && (
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{user.bio}</p>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span>{user.totalScore} puan</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      <span>{user.gamesPlayed} oyun</span>
                    </div>
                    {user.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <MapPin className="w-4 h-4 text-red-500" />
                        <span>{user.location}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => sendMessage(user.userId)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Mesaj Gönder</span>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredUsers.length === 0 && (
          <div className="text-center py-20">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Kullanıcı Bulunamadı</h3>
            <p className="text-gray-500">Arama kriterlerinizi değiştirmeyi deneyin</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverPage; 