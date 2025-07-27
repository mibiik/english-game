import React, { useState, useEffect } from 'react';
import { userAnalyticsService } from '../services/userAnalyticsService';
import { userService } from '../services/userService';
import { gameScoreService } from '../services/gameScoreService';
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

const AdminPanel: React.FC = () => {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
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

  useEffect(() => {
    loadData();
    // Monitoring durumunu kontrol et (uygulama başlangıcında otomatik başlar)
    setIsMonitoring(userAnalyticsService.isMonitoringActive());
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [anomaliesData, notificationsData, usersData, feedbacksData] = await Promise.all([
        userAnalyticsService.getAnomalies(50),
        userAnalyticsService.getAdminNotifications(20),
        loadUsers(),
        loadFeedbacks()
      ]);
      
      setAnomalies(anomaliesData as Anomaly[]);
      setNotifications(notificationsData as AdminNotification[]);
      setUsers(usersData);
      setFeedbacks(feedbacksData);
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
          displayName: data.displayName || 'İsimsiz Kullanıcı',
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
        loadData(); // Verileri yenile
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
      loadData(); // Verileri yenile
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
      loadData(); // Verileri yenile
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
      
      alert(`✅ ${user.displayName} kullanıcısından "${badgeToRemove}" rozeti kaldırıldı`);
      loadData(); // Verileri yenile
    } catch (error) {
      console.error('Rozet kaldırılırken hata:', error);
      alert('❌ Rozet kaldırılırken hata oluştu');
    }
  };

  const deleteUser = async (userId: string) => {
    const user = users.find(u => u.userId === userId);
    if (!user) return;
    
    if (!confirm(`⚠️ ${user.displayName} kullanıcısını tamamen silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!`)) {
      return;
    }
    
    try {
      const userRef = doc(db, 'userProfiles', userId);
      await deleteDoc(userRef);
      
      alert(`✅ ${user.displayName} kullanıcısı başarıyla silindi`);
      loadData(); // Verileri yenile
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
      const updatedBadges = [...currentBadges, 'destekçi'];
      
      await updateDoc(userRef, {
        badges: updatedBadges,
        updatedAt: new Date()
      });
      
      alert(`✅ ${selectedUser.displayName} kullanıcısına "Destekçi" rozeti eklendi`);
      loadData(); // Verileri yenile
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
      const updatedBadges = [...currentBadges, 'ekstra'];
      
      await updateDoc(userRef, {
        badges: updatedBadges,
        updatedAt: new Date()
      });
      
      alert(`✅ ${selectedUser.displayName} kullanıcısına "Ekstra" rozeti eklendi`);
      loadData(); // Verileri yenile
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
        readAt: new Date()
      });
      
      alert('✅ Feedback okundu olarak işaretlendi');
      loadData(); // Verileri yenile
    } catch (error) {
      console.error('Feedback işaretlenirken hata:', error);
      alert('❌ Feedback işaretlenirken hata oluştu');
    }
  };

  const deleteFeedback = async (feedbackId: string) => {
    const feedback = feedbacks.find(f => f.id === feedbackId);
    if (!feedback) return;
    
    if (!confirm(`⚠️ "${feedback.name}" kullanıcısının feedback'ini silmek istediğinizden emin misiniz?`)) {
      return;
    }
    
    try {
      const feedbackRef = doc(db, 'feedbacks', feedbackId);
      await deleteDoc(feedbackRef);
      
      alert(`✅ Feedback başarıyla silindi`);
      loadData(); // Verileri yenile
    } catch (error) {
      console.error('Feedback silinirken hata:', error);
      alert('❌ Feedback silinirken hata oluştu');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR');
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">🔧 Admin Panel</h1>
        
        {/* Kullanıcı Yönetimi */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">👥 Kullanıcı Yönetimi</h2>
                         <div className="flex gap-2">
               <button
                 onClick={loadData}
                 disabled={loading}
                 className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-semibold transition-colors"
               >
                 {loading ? 'Yükleniyor...' : '🔄 Yenile'}
               </button>
             </div>
          </div>

          {/* Arama */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Kullanıcı adı veya email ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Kullanıcı Listesi */}
          <div className="overflow-x-auto">
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

        {/* Monitoring Kontrolü */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">📊 Puan Anomalisi Monitoring</h2>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-900 text-green-300">
              ✅ Sürekli Aktif
            </span>
          </div>
          <p className="text-gray-400 mt-2">
            Monitoring sürekli açık tutulmaktadır. Kullanıcı puanlarındaki ani düşüşler otomatik olarak algılanır ve kaydedilir.
          </p>
          <p className="text-green-400 mt-2 text-sm">
            ✅ Arka plan monitoring aktif - Uygulama kapalıyken bile çalışır
          </p>
          <p className="text-yellow-400 mt-2 text-sm">
            ⚠️ Not: Service Worker ile 30 saniyede bir kontrol edilir
          </p>
        </div>

        {/* Admin Bildirimleri */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">📢 Admin Bildirimleri</h2>
          {loading ? (
            <div className="text-center py-8">Yükleniyor...</div>
          ) : notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="bg-gray-700 rounded-lg p-4 border-l-4 border-red-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{notification.title}</h3>
                      <p className="text-gray-300 mt-1">{notification.message}</p>
                      <p className="text-gray-400 text-sm mt-2">
                        {formatDate(notification.timestamp)}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
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

        {/* Kullanıcı Feedback'leri */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">💬 Kullanıcı Feedback'leri</h2>
          
          {/* Feedback Arama */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Kullanıcı adı veya feedback içeriği ile ara..."
              value={feedbackSearchTerm}
              onChange={(e) => setFeedbackSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {loading ? (
            <div className="text-center py-8">Yükleniyor...</div>
          ) : filteredFeedbacks.length > 0 ? (
            <div className="space-y-4">
              {filteredFeedbacks.map((feedback) => (
                <div key={feedback.id} className={`bg-gray-700 rounded-lg p-4 border-l-4 ${
                  feedback.isRead ? 'border-gray-500' : 'border-blue-500'
                }`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg text-blue-300">{feedback.name}</h3>
                        <span className={`px-2 py-1 rounded text-xs ${
                          feedback.isRead ? 'bg-gray-600 text-gray-300' : 'bg-blue-600 text-white'
                        }`}>
                          {feedback.isRead ? 'Okundu' : 'Yeni'}
                        </span>
                      </div>
                      <p className="text-gray-300 mt-2 whitespace-pre-wrap">{feedback.feedback}</p>
                      <p className="text-gray-400 text-sm mt-3">
                        📅 {feedback.date}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {!feedback.isRead && (
                        <button
                          onClick={() => markFeedbackAsRead(feedback.id)}
                          className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-xs transition-colors"
                        >
                          Okundu İşaretle
                        </button>
                      )}
                      <button
                        onClick={() => deleteFeedback(feedback.id)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs transition-colors"
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

        {/* Puan Anomalileri */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">🚨 Puan Anomalileri</h2>
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-96">
              <h3 className="text-xl font-semibold mb-4">Puan Düzenle</h3>
              <p className="text-gray-300 mb-4">{selectedUser.displayName} kullanıcısının puanını düzenleyin:</p>
              <input
                type="number"
                value={newScore}
                onChange={(e) => setNewScore(Number(e.target.value))}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white mb-4"
              />
              <div className="flex gap-2">
                <button
                  onClick={updateUserScore}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Güncelle
                </button>
                <button
                  onClick={() => {
                    setShowScoreModal(false);
                    setSelectedUser(null);
                  }}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rozet Ekleme Modal */}
        {showBadgeModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-96">
              <h3 className="text-xl font-semibold mb-4">Rozet Ekle</h3>
              <p className="text-gray-300 mb-4">{selectedUser.displayName} kullanıcısına rozet ekleyin:</p>
              <input
                type="text"
                value={newBadge}
                onChange={(e) => setNewBadge(e.target.value)}
                placeholder="Rozet adı..."
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white mb-4"
              />
              <div className="flex gap-2">
                <button
                  onClick={addUserBadge}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Ekle
                </button>
                <button
                  onClick={() => {
                    setShowBadgeModal(false);
                    setSelectedUser(null);
                    setNewBadge('');
                  }}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-semibold transition-colors"
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