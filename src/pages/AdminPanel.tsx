import React, { useState, useEffect } from 'react';
import { userAnalyticsService } from '../services/userAnalyticsService';
import { userService } from '../services/userService';
import { gameScoreService } from '../services/gameScoreService';
import { definitionCacheService } from '../services/definitionCacheService';
import { db } from '../config/firebase';
import { collection, getDocs, query, orderBy, limit, doc, updateDoc, deleteDoc } from 'firebase/firestore';

interface Anomaly {
  id: string;
  userId: string;
  userName: string;
  oldScore: number;
  newScore: number;
  change: number;
  timestamp: string;
  reason?: string;
  isAnomaly: boolean;
}

interface AdminNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  data: any;
  timestamp: string;
  isRead: boolean;
}

interface User {
  userId: string;
  displayName: string;
  email: string;
  totalScore: number;
  badges?: string[];
  isFirstSupporter?: boolean;
  createdAt?: string;
  lastSeen?: string;
}

interface Feedback {
  id: string;
  name: string;
  feedback: string;
  date: string;
  isRead?: boolean;
}





interface SupportAction {
  id: string;
  userId: string;
  userName: string;
  action: string;
  amount: number;
  currency: string;
  timestamp: string;
  userAgent: string;
  screenSize: string;
  source: string;
}

const AdminPanel: React.FC = () => {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [supportActions, setSupportActions] = useState<SupportAction[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [newScore, setNewScore] = useState(0);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [newBadge, setNewBadge] = useState('');
  const [feedbackSearchTerm, setFeedbackSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'feedbacks' | 'support' | 'definitions'>('users');
  const [cacheStats, setCacheStats] = useState<{ ai: number; manual: number; total: number; invalid: number }>({ ai: 0, manual: 0, total: 0, invalid: 0 });
  const [testDefinition, setTestDefinition] = useState('');
  const [testResult, setTestResult] = useState<{ isValid: boolean; reasons: string[] } | null>(null);

  useEffect(() => {
    loadData();
    setIsMonitoring(userAnalyticsService.isMonitoringActive());
  }, []);

  const loadData = async () => {
    if (loading) return; // Eğer zaten yükleniyorsa çık
    
    setLoading(true);
    try {
      const [anomaliesData, notificationsData, usersData, feedbacksData, supportActionsData, statsData] = await Promise.all([
        userAnalyticsService.getAnomalies(50),
        userAnalyticsService.getAdminNotifications(20),
        loadUsers(),
        loadFeedbacks(),
        loadSupportActions(),
        definitionCacheService.getCacheStats()
      ]);
      
      setAnomalies(anomaliesData as Anomaly[]);
      setNotifications(notificationsData as AdminNotification[]);
      setUsers(usersData);
      setFeedbacks(feedbacksData);
      setSupportActions(supportActionsData);
      setCacheStats(statsData);
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async (): Promise<User[]> => {
    try {
      const usersRef = collection(db, 'userProfiles');
      const q = query(usersRef, orderBy('totalScore', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const usersData: User[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        usersData.push({
          userId: doc.id,
          displayName: data.displayName || data.userName || 'İsimsiz Kullanıcı',
          email: data.email || '',
          totalScore: data.totalScore || 0,
          badges: data.badges || [],
          isFirstSupporter: data.isFirstSupporter || false,
          createdAt: data.createdAt?.toDate?.()?.toLocaleString('tr-TR') || '',
          lastSeen: data.lastSeen?.toDate?.()?.toLocaleString('tr-TR') || ''

        });
      });
      
      return usersData;
    } catch (error) {
      console.error('Kullanıcılar yüklenirken hata:', error);
      return [];
    }
  };

  const loadFeedbacks = async (): Promise<Feedback[]> => {
    try {
      const feedbacksRef = collection(db, 'feedbacks');
      const q = query(feedbacksRef, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const feedbacksData: Feedback[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        feedbacksData.push({
          id: doc.id,
          name: data.name || 'İsimsiz Kullanıcı',
          feedback: data.feedback || '',
          date: data.date?.toDate?.()?.toLocaleString('tr-TR') || '',
          isRead: data.isRead || false
        });
      });
      
      return feedbacksData;
    } catch (error) {
      console.error('Feedback\'ler yüklenirken hata:', error);
      return [];
    }
  };





  const loadSupportActions = async (): Promise<SupportAction[]> => {
    try {
      const supportRef = collection(db, 'supportActions');
      const q = query(supportRef, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const supportData: SupportAction[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        supportData.push({
          id: doc.id,
          userId: data.userId || '',
          userName: data.userName || '',
          action: data.action || '',
          amount: data.amount || 0,
          currency: data.currency || 'TRY',
          timestamp: data.timestamp?.toDate?.()?.toLocaleString('tr-TR') || '',
          userAgent: data.userAgent || '',
          screenSize: data.screenSize || '',
          source: data.source || ''
        });
      });
      
      return supportData;
    } catch (error) {
      console.error('Destek işlemleri yüklenirken hata:', error);
      return [];
    }
  };

  const toggleMonitoring = () => {
    if (isMonitoring) {
      userAnalyticsService.stopMonitoring();
      setIsMonitoring(false);
    } else {
      userAnalyticsService.startMonitoring();
      setIsMonitoring(true);
    }
  };

  const restoreScore = async (anomaly: Anomaly) => {
    try {
      const success = await userAnalyticsService.restoreScore(anomaly.userId, anomaly.oldScore);
      if (success) {
        alert(`✅ ${anomaly.userName} kullanıcısının puanı ${anomaly.oldScore} olarak geri yüklendi`);
        loadData();
      } else {
        alert('❌ Puan geri yüklenirken hata oluştu');
      }
    } catch (error) {
      console.error('Puan geri yüklenirken hata:', error);
      alert('❌ Puan geri yüklenirken hata oluştu');
    }
  };

  const updateUserScore = async () => {
    if (!selectedUser) return;
    
    try {
      const userRef = doc(db, 'userProfiles', selectedUser.userId);
      await updateDoc(userRef, {
        totalScore: newScore,
        updatedAt: new Date()
      });
      
      alert(`✅ ${selectedUser.displayName} kullanıcısının puanı ${newScore} olarak güncellendi`);
      setShowScoreModal(false);
      setSelectedUser(null);
      loadData();
    } catch (error) {
      console.error('Puan güncellenirken hata:', error);
      alert('❌ Puan güncellenirken hata oluştu');
    }
  };

  const addUserBadge = async () => {
    if (!selectedUser || !newBadge.trim()) return;
    
    try {
      const userRef = doc(db, 'userProfiles', selectedUser.userId);
      const currentBadges = selectedUser.badges || [];
      const updatedBadges = [...currentBadges, newBadge.trim()];
      
      await updateDoc(userRef, {
        badges: updatedBadges,
        updatedAt: new Date()
      });
      
      alert(`✅ ${selectedUser.displayName} kullanıcısına "${newBadge}" rozeti eklendi`);
      setShowBadgeModal(false);
      setSelectedUser(null);
      setNewBadge('');
      loadData();
    } catch (error) {
      console.error('Rozet eklenirken hata:', error);
      alert('❌ Rozet eklenirken hata oluştu');
    }
  };

  const removeUserBadge = async (userId: string, badgeToRemove: string) => {
    try {
      const user = users.find(u => u.userId === userId);
      if (!user) return;
      
      const userRef = doc(db, 'userProfiles', userId);
      const currentBadges = user.badges || [];
      const updatedBadges = currentBadges.filter(badge => badge !== badgeToRemove);
      
      await updateDoc(userRef, {
        badges: updatedBadges,
        updatedAt: new Date()
      });
      
      alert(`✅ "${badgeToRemove}" rozeti kaldırıldı`);
      loadData();
    } catch (error) {
      console.error('Rozet kaldırılırken hata:', error);
      alert('❌ Rozet kaldırılırken hata oluştu');
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) return;
    
    try {
      await deleteDoc(doc(db, 'userProfiles', userId));
      alert('✅ Kullanıcı başarıyla silindi');
      loadData();
    } catch (error) {
      console.error('Kullanıcı silinirken hata:', error);
      alert('❌ Kullanıcı silinirken hata oluştu');
    }
  };

  const addSupporterBadge = async () => {
    if (!selectedUser) return;
    
    try {
      const userRef = doc(db, 'userProfiles', selectedUser.userId);
      const currentBadges = selectedUser.badges || [];
      const updatedBadges = [...currentBadges, 'Destekçi'];
      
      await updateDoc(userRef, {
        badges: updatedBadges,
        isFirstSupporter: true,
        updatedAt: new Date()
      });
      
      alert(`✅ ${selectedUser.displayName} kullanıcısına "Destekçi" rozeti eklendi`);
      setSelectedUser(null);
      loadData();
    } catch (error) {
      console.error('Destekçi rozeti eklenirken hata:', error);
      alert('❌ Destekçi rozeti eklenirken hata oluştu');
    }
  };

  const addExtraBadge = async () => {
    if (!selectedUser) return;
    
    try {
      const userRef = doc(db, 'userProfiles', selectedUser.userId);
      const currentBadges = selectedUser.badges || [];
      const updatedBadges = [...currentBadges, 'Ekstra'];
      
      await updateDoc(userRef, {
        badges: updatedBadges,
        updatedAt: new Date()
      });
      
      alert(`✅ ${selectedUser.displayName} kullanıcısına "Ekstra" rozeti eklendi`);
      setSelectedUser(null);
      loadData();
    } catch (error) {
      console.error('Ekstra rozet eklenirken hata:', error);
      alert('❌ Ekstra rozet eklenirken hata oluştu');
    }
  };



  const markFeedbackAsRead = async (feedbackId: string) => {
    try {
      const feedbackRef = doc(db, 'feedbacks', feedbackId);
      await updateDoc(feedbackRef, {
        isRead: true,
        updatedAt: new Date()
      });
      
      alert('✅ Feedback okundu olarak işaretlendi');
      loadData();
    } catch (error) {
      console.error('Feedback işaretlenirken hata:', error);
      alert('❌ Feedback işaretlenirken hata oluştu');
    }
  };

  const deleteFeedback = async (feedbackId: string) => {
    if (!confirm('Bu feedback\'i silmek istediğinizden emin misiniz?')) return;
    
    try {
      await deleteDoc(doc(db, 'feedbacks', feedbackId));
      alert('✅ Feedback başarıyla silindi');
      loadData();
    } catch (error) {
      console.error('Feedback silinirken hata:', error);
      alert('❌ Feedback silinirken hata oluştu');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('tr-TR');
    } catch {
      return dateString;
    }
  };

  // Definition Cache Yönetimi Fonksiyonları
  const testDefinitionQuality = () => {
    if (!testDefinition.trim()) {
      alert('Lütfen test edilecek tanımı girin');
      return;
    }
    const result = definitionCacheService.testDefinitionQuality(testDefinition);
    setTestResult(result);
  };

  const cleanupInvalidDefinitions = async () => {
    if (!confirm('Geçersiz tanımları temizlemek istediğinizden emin misiniz?')) {
      return;
    }
    
    try {
      const result = await definitionCacheService.cleanupInvalidDefinitions();
      alert(`✅ ${result.cleaned} geçersiz tanım temizlendi. ${result.errors} hata oluştu.`);
      loadData(); // Cache istatistiklerini yenile
    } catch (error) {
      console.error('Temizleme hatası:', error);
      alert('❌ Temizleme sırasında hata oluştu');
    }
  };

  const refreshCacheStats = async () => {
    try {
      const stats = await definitionCacheService.getCacheStats();
      setCacheStats(stats);
    } catch (error) {
      console.error('Cache istatistikleri yenilenirken hata:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFeedbacks = feedbacks.filter(feedback =>
    feedback.name.toLowerCase().includes(feedbackSearchTerm.toLowerCase()) ||
    feedback.feedback.toLowerCase().includes(feedbackSearchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mb-8 text-center">🔧 Admin Panel</h1>
        
        {/* Ana Yönetim Paneli */}
        <div className="bg-gray-800 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold">🔧 Yönetim Paneli</h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={loadData}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base w-full sm:w-auto"
              >
                {loading ? 'Yükleniyor...' : '🔄 Yenile'}
              </button>
            </div>
          </div>

          {/* Tab'lar */}
          <div className="flex flex-wrap border-b border-gray-600 mb-4 sm:mb-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-2 sm:px-4 py-2 font-semibold transition-colors text-xs sm:text-sm whitespace-nowrap ${
                activeTab === 'users' 
                  ? 'text-blue-400 border-b-2 border-blue-400' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              👥 Kullanıcılar ({filteredUsers.length})
            </button>
            <button
              onClick={() => setActiveTab('feedbacks')}
              className={`px-2 sm:px-4 py-2 font-semibold transition-colors text-xs sm:text-sm whitespace-nowrap ${
                activeTab === 'feedbacks' 
                  ? 'text-blue-400 border-b-2 border-blue-400' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              💬 Feedback ({filteredFeedbacks.length})
            </button>

            <button
              onClick={() => setActiveTab('support')}
              className={`px-2 sm:px-4 py-2 font-semibold transition-colors text-xs sm:text-sm whitespace-nowrap ${
                activeTab === 'support' 
                  ? 'text-blue-400 border-b-2 border-blue-400' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              💰 Destek ({supportActions.length})
            </button>
            <button
              onClick={() => setActiveTab('definitions')}
              className={`px-2 sm:px-4 py-2 font-semibold transition-colors text-xs sm:text-sm whitespace-nowrap ${
                activeTab === 'definitions' 
                  ? 'text-blue-400 border-b-2 border-blue-400' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              📚 Tanımlar ({cacheStats.total})
            </button>
          </div>

          {/* Arama - Sadece kullanıcılar tab'ında göster */}
          {activeTab === 'users' && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="Kullanıcı adı veya email ile ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm sm:text-base"
              />
            </div>
          )}

          {/* Feedback Arama */}
          {activeTab === 'feedbacks' && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="Feedback içeriği ile ara..."
                value={feedbackSearchTerm}
                onChange={(e) => setFeedbackSearchTerm(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm sm:text-base"
              />
            </div>
          )}

          {/* Tab İçerikleri */}
          
          {/* Kullanıcılar Tab */}
          {activeTab === 'users' && (
            <div>
              {/* Mobile için kart görünümü */}
              <div className="block md:hidden space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.userId} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-white">{user.displayName}</h3>
                        <p className="text-gray-300 text-sm">{user.email}</p>
                        <p className="text-green-400 font-semibold text-lg">{user.totalScore} puan</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-xs">{user.createdAt}</p>
                      </div>
                    </div>
                    
                    {/* Rozetler */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {user.badges?.map((badge, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 bg-blue-600 text-white rounded-full text-xs">
                            {badge}
                            <button
                              onClick={() => removeUserBadge(user.userId, badge)}
                              className="ml-1 text-red-300 hover:text-red-100"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                        {user.isFirstSupporter && (
                          <span className="inline-flex items-center px-2 py-1 bg-purple-600 text-white rounded-full text-xs">
                            İlk Destekçi
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* İşlem butonları */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setNewScore(user.totalScore);
                          setShowScoreModal(true);
                        }}
                        className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs transition-colors"
                      >
                        Puan Düzenle
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowBadgeModal(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs transition-colors"
                      >
                        Rozet Ekle
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          addSupporterBadge();
                        }}
                        className="bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded text-xs transition-colors"
                      >
                        Destekçi Rozeti
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          addExtraBadge();
                        }}
                        className="bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded text-xs transition-colors"
                      >
                        Ekstra Rozet
                      </button>
                      <button
                        onClick={() => deleteUser(user.userId)}
                        className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs transition-colors col-span-2"
                      >
                        Kullanıcıyı Sil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Desktop için tablo görünümü */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="text-left py-3 px-4">Kullanıcı</th>
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Puan</th>
                      <th className="text-left py-3 px-4">Rozetler</th>

                      <th className="text-left py-3 px-4">Kayıt Tarihi</th>
                      <th className="text-left py-3 px-4">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.userId} className="border-b border-gray-700 hover:bg-gray-700">
                        <td className="py-3 px-4 font-medium">{user.displayName}</td>
                        <td className="py-3 px-4 text-gray-300">{user.email}</td>
                        <td className="py-3 px-4 text-green-400 font-semibold">{user.totalScore}</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {user.badges?.map((badge, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 bg-blue-600 text-white rounded-full text-xs">
                                {badge}
                                <button
                                  onClick={() => removeUserBadge(user.userId, badge)}
                                  className="ml-1 text-red-300 hover:text-red-100"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                            {user.isFirstSupporter && (
                              <span className="inline-flex items-center px-2 py-1 bg-purple-600 text-white rounded-full text-xs">
                                İlk Destekçi
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4 text-gray-400 text-xs">{user.createdAt}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setNewScore(user.totalScore);
                                setShowScoreModal(true);
                              }}
                              className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs transition-colors"
                            >
                              Puan Düzenle
                            </button>
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowBadgeModal(true);
                              }}
                              className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs transition-colors"
                            >
                              Rozet Ekle
                            </button>
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                addSupporterBadge();
                              }}
                              className="bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded text-xs transition-colors"
                            >
                              Destekçi Rozeti
                            </button>
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                addExtraBadge();
                              }}
                              className="bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded text-xs transition-colors"
                            >
                              Ekstra Rozet
                            </button>
                            <button
                              onClick={() => deleteUser(user.userId)}
                              className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs transition-colors"
                            >
                              Sil
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-gray-400 text-sm">
                Toplam {filteredUsers.length} kullanıcı bulundu
              </div>
            </div>
          )}
          
          {/* Feedback Tab */}
          {activeTab === 'feedbacks' && (
            <div>
              {loading ? (
                <div className="text-center py-8">Yükleniyor...</div>
              ) : filteredFeedbacks.length > 0 ? (
                <div className="space-y-4">
                  {filteredFeedbacks.map((feedback) => (
                    <div key={feedback.id} className={`bg-gray-700 rounded-lg p-3 sm:p-4 border-l-4 ${
                      feedback.isRead ? 'border-gray-500' : 'border-blue-500'
                    }`}>
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <h3 className="font-semibold text-base sm:text-lg text-blue-300">{feedback.name}</h3>
                            <span className={`px-2 py-1 rounded text-xs w-fit ${
                              feedback.isRead ? 'bg-gray-600 text-gray-300' : 'bg-blue-600 text-white'
                            }`}>
                              {feedback.isRead ? 'Okundu' : 'Yeni'}
                            </span>
                          </div>
                          <p className="text-gray-300 mt-2 whitespace-pre-wrap text-sm sm:text-base">{feedback.feedback}</p>
                          <p className="text-gray-400 text-xs sm:text-sm mt-3">
                            📅 {feedback.date}
                          </p>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          {!feedback.isRead && (
                            <button
                              onClick={() => markFeedbackAsRead(feedback.id)}
                              className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-xs transition-colors flex-1 sm:flex-none"
                            >
                              Okundu
                            </button>
                          )}
                          <button
                            onClick={() => deleteFeedback(feedback.id)}
                            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs transition-colors flex-1 sm:flex-none"
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">Henüz feedback yok</p>
              )}
              <div className="mt-4 text-gray-400 text-sm">
                Toplam {filteredFeedbacks.length} feedback bulundu
              </div>
            </div>
          )}
          

          
          {/* Destek İşlemleri Tab */}
          {activeTab === 'support' && (
            <div>
              {loading ? (
                <div className="text-center py-8">Yükleniyor...</div>
              ) : supportActions.length > 0 ? (
                <>
                  {/* Mobile için kart görünümü */}
                  <div className="block md:hidden space-y-4">
                    {supportActions.map((action) => (
                      <div key={action.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-white">{action.userName}</h3>
                            <p className="text-green-400 font-semibold text-lg">
                              {action.amount} {action.currency}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="px-2 py-1 rounded text-xs font-semibold bg-green-600 text-white">
                              {action.action}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <p className="text-gray-300">
                            <span className="text-gray-400">Kaynak:</span> {action.source}
                          </p>
                          <p className="text-gray-300">
                            <span className="text-gray-400">Tarih:</span> {action.timestamp}
                          </p>
                          <p className="text-gray-300">
                            <span className="text-gray-400">Ekran:</span> {action.screenSize}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Desktop için tablo görünümü */}
                  <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-600">
                        <th className="text-left py-3 px-4">Kullanıcı</th>
                        <th className="text-left py-3 px-4">İşlem</th>
                        <th className="text-left py-3 px-4">Tutar</th>
                        <th className="text-left py-3 px-4">Kaynak</th>
                        <th className="text-left py-3 px-4">Tarih</th>
                        <th className="text-left py-3 px-4">Ekran</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supportActions.map((action) => (
                        <tr key={action.id} className="border-b border-gray-700 hover:bg-gray-700">
                          <td className="py-3 px-4 font-medium">{action.userName}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 rounded text-xs font-semibold bg-green-600 text-white">
                              {action.action}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-green-400 font-semibold">
                            {action.amount} {action.currency}
                          </td>
                          <td className="py-3 px-4 text-gray-400 text-xs">
                            {action.source}
                          </td>
                          <td className="py-3 px-4 text-gray-400 text-xs">{action.timestamp}</td>
                          <td className="py-3 px-4 text-gray-400 text-xs">{action.screenSize}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                </>
              ) : (
                <p className="text-gray-400 text-center py-8">Henüz destek işlemi yok</p>
              )}
              <div className="mt-4 text-gray-400 text-sm">
                Toplam {supportActions.length} destek işlemi bulundu
              </div>
            </div>
          )}

          {/* Definition Cache Yönetimi Tab */}
          {activeTab === 'definitions' && (
            <div>
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold mb-4">📊 Cache İstatistikleri</h3>
                
                {/* AI Üretimi Geçici Devre Dışı Uyarısı */}
                <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-300 text-lg">⚠️</span>
                    <div>
                      <div className="font-semibold text-yellow-300">AI Üretimi Geçici Olarak Devre Dışı</div>
                      <div className="text-yellow-200 text-sm">
                        Definition üretme problemleri nedeniyle sadece Firebase'deki mevcut tanımlar gösteriliyor.
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-600 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-400">{cacheStats.total}</div>
                    <div className="text-sm text-gray-300">Toplam Tanım</div>
                  </div>
                  <div className="bg-gray-600 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-400">{cacheStats.ai}</div>
                    <div className="text-sm text-gray-300">AI Üretimi</div>
                  </div>
                  <div className="bg-gray-600 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-yellow-400">{cacheStats.manual}</div>
                    <div className="text-sm text-gray-300">Manuel</div>
                  </div>
                  <div className="bg-gray-600 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-red-400">{cacheStats.invalid}</div>
                    <div className="text-sm text-gray-300">Geçersiz</div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={refreshCacheStats}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                  >
                    🔄 İstatistikleri Yenile
                  </button>
                  <button
                    onClick={cleanupInvalidDefinitions}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                  >
                    🧹 Geçersiz Tanımları Temizle
                  </button>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">🔍 Tanım Kalite Testi</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Test Edilecek Tanım:
                    </label>
                    <textarea
                      value={testDefinition}
                      onChange={(e) => setTestDefinition(e.target.value)}
                      placeholder="Test edilecek tanımı buraya yazın..."
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                      rows={3}
                    />
                  </div>
                  <button
                    onClick={testDefinitionQuality}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                  >
                    🧪 Kalite Testi Yap
                  </button>
                  
                  {testResult && (
                    <div className={`p-4 rounded-lg border ${
                      testResult.isValid 
                        ? 'bg-green-900 border-green-600 text-green-300' 
                        : 'bg-red-900 border-red-600 text-red-300'
                    }`}>
                      <div className="font-semibold mb-2">
                        {testResult.isValid ? '✅ Geçerli Tanım' : '❌ Geçersiz Tanım'}
                      </div>
                      {testResult.reasons.length > 0 && (
                        <div>
                          <div className="font-medium mb-1">Sorunlar:</div>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {testResult.reasons.map((reason, index) => (
                              <li key={index}>{reason}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Monitoring Kontrolü */}
        <div className="bg-gray-800 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">📊 Puan Anomalisi Monitoring</h2>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-900 text-green-300">
              ✅ Sürekli Aktif
            </span>
          </div>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">
            Monitoring sürekli açık tutulmaktadır. Kullanıcı puanlarındaki ani düşüşler otomatik olarak algılanır ve kaydedilir.
          </p>
          <p className="text-green-400 mt-2 text-xs sm:text-sm">
            ✅ Arka plan monitoring aktif - Uygulama kapalıyken bile çalışır
          </p>
          <p className="text-yellow-400 mt-2 text-xs sm:text-sm">
            ⚠️ Not: Service Worker ile 30 saniyede bir kontrol edilir
          </p>
        </div>

        {/* Admin Bildirimleri */}
        <div className="bg-gray-800 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">📢 Admin Bildirimleri</h2>
          {loading ? (
            <div className="text-center py-8">Yükleniyor...</div>
          ) : notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="bg-gray-700 rounded-lg p-3 sm:p-4 border-l-4 border-red-500">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-base sm:text-lg">{notification.title}</h3>
                      <p className="text-gray-300 mt-1 text-sm sm:text-base">{notification.message}</p>
                      <p className="text-gray-400 text-xs sm:text-sm mt-2">
                        {formatDate(notification.timestamp)}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs w-fit ${
                      notification.isRead ? 'bg-gray-600 text-gray-300' : 'bg-red-600 text-white'
                    }`}>
                      {notification.isRead ? 'Okundu' : 'Yeni'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">Henüz bildirim yok</p>
          )}
        </div>

        {/* Puan Anomalileri */}
        <div className="bg-gray-800 rounded-lg p-3 sm:p-4 md:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">🚨 Puan Anomalileri</h2>
          {loading ? (
            <div className="text-center py-8">Yükleniyor...</div>
          ) : anomalies.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left py-3 px-4">Kullanıcı</th>
                    <th className="text-left py-3 px-4">Eski Puan</th>
                    <th className="text-left py-3 px-4">Yeni Puan</th>
                    <th className="text-left py-3 px-4">Değişim</th>
                    <th className="text-left py-3 px-4">Tarih</th>
                    <th className="text-left py-3 px-4">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {anomalies.map((anomaly) => (
                    <tr key={anomaly.id} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="py-3 px-4 font-medium">{anomaly.userName}</td>
                      <td className="py-3 px-4 text-green-400">{anomaly.oldScore}</td>
                      <td className="py-3 px-4 text-red-400">{anomaly.newScore}</td>
                      <td className="py-3 px-4 text-red-500 font-semibold">
                        {anomaly.change > 0 ? '+' : ''}{anomaly.change}
                      </td>
                      <td className="py-3 px-4 text-gray-400">
                        {formatDate(anomaly.timestamp)}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => restoreScore(anomaly)}
                          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs transition-colors"
                        >
                          Puanı Geri Yükle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">Henüz anomali kaydedilmemiş</p>
          )}
        </div>

        {/* Puan Düzenleme Modal */}
        {showScoreModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-md">
              <h3 className="text-lg sm:text-xl font-semibold mb-4">Puan Düzenle</h3>
              <p className="text-gray-300 mb-4 text-sm sm:text-base">{selectedUser.displayName} kullanıcısının puanını düzenleyin:</p>
              <input
                type="number"
                value={newScore}
                onChange={(e) => setNewScore(Number(e.target.value))}
                className="w-full px-3 sm:px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white mb-4 text-sm sm:text-base"
              />
              <div className="flex gap-2">
                <button
                  onClick={updateUserScore}
                  className="bg-green-600 hover:bg-green-700 px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base flex-1"
                >
                  Güncelle
                </button>
                <button
                  onClick={() => {
                    setShowScoreModal(false);
                    setSelectedUser(null);
                  }}
                  className="bg-gray-600 hover:bg-gray-700 px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base flex-1"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rozet Ekleme Modal */}
        {showBadgeModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-md">
              <h3 className="text-lg sm:text-xl font-semibold mb-4">Rozet Ekle</h3>
              <p className="text-gray-300 mb-4 text-sm sm:text-base">{selectedUser.displayName} kullanıcısına rozet ekleyin:</p>
              <input
                type="text"
                value={newBadge}
                onChange={(e) => setNewBadge(e.target.value)}
                placeholder="Rozet adı..."
                className="w-full px-3 sm:px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white mb-4 text-sm sm:text-base"
              />
              <div className="flex gap-2">
                <button
                  onClick={addUserBadge}
                  className="bg-blue-600 hover:bg-blue-700 px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base flex-1"
                >
                  Ekle
                </button>
                <button
                  onClick={() => {
                    setShowBadgeModal(false);
                    setSelectedUser(null);
                    setNewBadge('');
                  }}
                  className="bg-gray-600 hover:bg-gray-700 px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base flex-1"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel; 