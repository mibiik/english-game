import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { supabase } from '../config/supabase';
import { seasonService } from '../services/seasonService';
import { feedbackService } from '../services/feedbackService';
import { useDeviceStats } from '../hooks/useDeviceStats';
import { supabaseAuthService } from '../services/supabaseAuthService';

interface User {
  userId: string;
  displayName: string;
  email: string;
  totalScore: number;
  badges: string[];
  isFirstSupporter: boolean;
  createdAt: string;
  lastSeen: string;
}

interface Feedback {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  createdAt: Date;
  adminNotes?: string;
}

const AdminPanel: React.FC = () => {
  const [firebaseUsers, setFirebaseUsers] = useState<User[]>([]);
  const [supabaseUsers, setSupabaseUsers] = useState<User[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [newScore, setNewScore] = useState(0);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [newBadge, setNewBadge] = useState('');
  const [feedbackSearchTerm, setFeedbackSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'feedbacks' | 'devices'>('users');
  const [feedbackStats, setFeedbackStats] = useState<{
    total: number;
    new: number;
    inProgress: number;
    resolved: number;
    closed: number;
    urgent: number;
    high: number;
  }>({ total: 0, new: 0, inProgress: 0, resolved: 0, closed: 0, urgent: 0, high: 0 });
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  
  // Cihaz istatistikleri hook'u
  const { deviceStats, userDevices, loading: deviceStatsLoading, refreshStats } = useDeviceStats();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const checkAdminAccess = async () => {
    try {
      setIsCheckingAdmin(true);
      
      if (!supabaseAuthService.isAuthenticated()) {
        setIsAdmin(false);
        setIsCheckingAdmin(false);
        return;
      }

      const userId = supabaseAuthService.getCurrentUserId();
      if (!userId) {
        setIsAdmin(false);
        setIsCheckingAdmin(false);
        return;
      }

      // Admin kontrolü
      const adminUserIds = ['VtSQP9JxPSVmRrHUyeMX9aYBMDq1', 'D1QC2'];
      const adminEmails = ['mbirlik24@ku.edu.tr'];
      
      const userEmail = supabaseAuthService.getCurrentUserEmail();
      
      if (adminUserIds.includes(userId) || (userEmail && adminEmails.includes(userEmail))) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Admin erişim kontrolü hatası:', error);
      setIsAdmin(false);
    } finally {
      setIsCheckingAdmin(false);
    }
  };

  const loadData = async () => {
    if (loading) return;
    
    setLoading(true);
    
    try {
      const [firebaseUsersData, supabaseUsersData] = await Promise.all([
        loadFirebaseUsers(),
        loadSupabaseUsers()
      ]);
      
      setFirebaseUsers(firebaseUsersData);
      setSupabaseUsers(supabaseUsersData);
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFirebaseUsers = async (): Promise<User[]> => {
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
      console.error('Firebase kullanıcıları yüklenirken hata:', error);
      return [];
    }
  };

  const loadSupabaseUsers = async (): Promise<User[]> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('total_score', { ascending: false });

      if (error) {
        console.error('Supabase kullanıcıları yüklenirken hata:', error);
      return [];
    }

      const usersData: User[] = data.map(user => ({
        userId: user.id,
        displayName: user.display_name || 'İsimsiz Kullanıcı',
        email: user.email || '',
        totalScore: user.total_score || 0,
        badges: user.badges || [],
        isFirstSupporter: user.is_first_supporter || false,
        createdAt: user.created_at ? new Date(user.created_at).toLocaleString('tr-TR') : '',
        lastSeen: user.last_seen ? new Date(user.last_seen).toLocaleString('tr-TR') : ''
      }));

      return usersData;
    } catch (error) {
      console.error('Supabase kullanıcıları yüklenirken hata:', error);
      return [];
    }
  };

  const loadFeedbacks = async (): Promise<Feedback[]> => {
    try {
      return await feedbackService.getAllFeedbacks();
    } catch (error) {
      console.error('Feedback\'ler yüklenirken hata:', error);
      return [];
    }
  };

  const updateUserScore = async () => {
    if (!selectedUser) return;
    
    try {
      const userRef = doc(db, 'userProfiles', selectedUser.userId);
      await updateDoc(userRef, {
        totalScore: newScore,
      });
      
      alert('✅ Puan başarıyla güncellendi');
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
      });
      
      alert('✅ Rozet başarıyla eklendi');
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
      const user = [...firebaseUsers, ...supabaseUsers].find(u => u.userId === userId);
      if (!user) return;
      
      const userRef = doc(db, 'userProfiles', userId);
      const currentBadges = user.badges || [];
      const updatedBadges = currentBadges.filter(badge => badge !== badgeToRemove);
      
      await updateDoc(userRef, {
        badges: updatedBadges,
      });
      
      alert('✅ Rozet başarıyla kaldırıldı');
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
      });
      
      alert('✅ Destekçi rozeti başarıyla eklendi');
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
      });
      
      alert('✅ Ekstra rozet başarıyla eklendi');
      loadData();
    } catch (error) {
      console.error('Ekstra rozet eklenirken hata:', error);
      alert('❌ Ekstra rozet eklenirken hata oluştu');
    }
  };

  const markFeedbackAsRead = async (feedbackId: string) => {
    try {
      await feedbackService.updateFeedbackStatus(feedbackId, 'in_progress');
      alert('✅ Feedback işleme alındı');
      loadData();
    } catch (error) {
      console.error('Feedback işaretlenirken hata:', error);
      alert('❌ Feedback işaretlenirken hata oluştu');
    }
  };

  const deleteFeedback = async (feedbackId: string) => {
    if (!confirm('Bu feedback\'i silmek istediğinizden emin misiniz?')) return;
    
    try {
      await feedbackService.deleteFeedback(feedbackId);
      alert('✅ Feedback başarıyla silindi');
      loadData();
    } catch (error) {
      console.error('Feedback silinirken hata:', error);
      alert('❌ Feedback silinirken hata oluştu');
    }
  };

  const openFeedbackModal = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setAdminNotes(feedback.adminNotes || '');
    setShowFeedbackModal(true);
  };

  const handleUpdateFeedbackStatus = async (feedbackId: string, status: string) => {
    try {
      await feedbackService.updateFeedbackStatus(feedbackId, status);
      if (adminNotes.trim()) {
        await feedbackService.addAdminNote(feedbackId, adminNotes);
      }
      alert('✅ Feedback başarıyla güncellendi');
      setShowFeedbackModal(false);
      setSelectedFeedback(null);
      setAdminNotes('');
      loadData();
    } catch (error) {
      console.error('Feedback güncellenirken hata:', error);
      alert('❌ Feedback güncellenirken hata oluştu');
    }
  };

  const cleanupDeletedUsers = async () => {
    if (!confirm('Silinen kullanıcıların leaderboard kayıtlarını temizlemek istediğinizden emin misiniz?')) {
      return;
    }
    
    try {
      setLoading(true);
      const success = await seasonService.cleanupDeletedUsers();
      
      if (success) {
        alert('✅ Silinen kullanıcılar başarıyla temizlendi');
        loadData();
      } else {
        alert('❌ Temizlik işlemi başarısız oldu');
      }
    } catch (error) {
      console.error('Temizlik işlemi hatası:', error);
      alert('❌ Temizlik işlemi sırasında hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const cleanupAllDeletedUsers = async () => {
    if (!confirm('TÜM silinen kullanıcıları hem Supabase hem Firebase\'den temizlemek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz!')) {
      return;
    }
    
    try {
      setLoading(true);
      const results = await seasonService.cleanupAllDeletedUsers();
      
      if (results.supabase && results.firebase) {
        alert('✅ Tüm silinen kullanıcılar başarıyla temizlendi');
        loadData();
      } else {
        alert(`⚠️ Kısmi temizlik: Supabase: ${results.supabase ? '✅' : '❌'}, Firebase: ${results.firebase ? '✅' : '❌'}`);
      }
    } catch (error) {
      console.error('Genel temizlik hatası:', error);
      alert('❌ Temizlik işlemi sırasında hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const allUsers = [...firebaseUsers, ...supabaseUsers];
  const filteredUsers = allUsers.filter(user =>
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFeedbacks = feedbacks.filter(feedback =>
    feedback.name.toLowerCase().includes(feedbackSearchTerm.toLowerCase()) ||
    feedback.message.toLowerCase().includes(feedbackSearchTerm.toLowerCase()) ||
    feedback.subject.toLowerCase().includes(feedbackSearchTerm.toLowerCase())
  );

  // Admin kontrolü
  if (isCheckingAdmin) {
  return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Admin erişimi kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold mb-4">Erişim Reddedildi</h1>
          <p className="text-gray-300 mb-6">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

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
              onClick={() => setActiveTab('devices')}
              className={`px-2 sm:px-4 py-2 font-semibold transition-colors text-xs sm:text-sm whitespace-nowrap ${
                activeTab === 'devices' 
                  ? 'text-blue-400 border-b-2 border-blue-400' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
                📱 Cihazlar
            </button>
          </div>

            {/* Kullanıcı Arama */}
          {activeTab === 'users' && (
              <div className="mb-6">
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
              <div className="mb-6">
              <input
                type="text"
                placeholder="Feedback içeriği ile ara..."
                value={feedbackSearchTerm}
                onChange={(e) => setFeedbackSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Tab İçerikleri */}
          
          {/* Kullanıcılar Tab */}
          {activeTab === 'users' && (
              <div className="space-y-6">
                {/* Firebase Kullanıcıları */}
            <div>
                  <h3 className="text-lg font-semibold mb-4 text-orange-400">🔥 Firebase Kullanıcıları ({firebaseUsers.length})</h3>
                  {firebaseUsers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {firebaseUsers.map((user) => (
                        <div key={`firebase-${user.userId}`} className="bg-gray-700 rounded-lg p-4 border border-orange-500">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-white">{user.displayName}</h3>
                        <p className="text-gray-300 text-sm">{user.email}</p>
                              <p className="text-orange-400 font-semibold text-lg">{user.totalScore} puan</p>
                      </div>
                      <div className="text-right">
                              <span className="px-2 py-1 bg-orange-600 text-white text-xs rounded">Firebase</span>
                              <p className="text-gray-400 text-xs mt-1">{user.createdAt}</p>
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
                  ) : (
                    <p className="text-gray-400 text-center py-4">Firebase'de kullanıcı bulunamadı</p>
                  )}
              </div>
              
                {/* Temizlik Butonları */}
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                  <h3 className="text-lg font-semibold mb-4 text-red-400">🧹 Temizlik İşlemleri</h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={cleanupDeletedUsers}
                      className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                    >
                      🗑️ Silinen Kullanıcıları Temizle
                    </button>
                    <button
                      onClick={cleanupAllDeletedUsers}
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                    >
                      💥 TÜM Silinen Kullanıcıları Temizle
                    </button>
                  </div>
                </div>

                {/* Supabase Kullanıcıları */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-blue-400">📊 Supabase Kullanıcıları ({supabaseUsers.length})</h3>
                  {supabaseUsers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {supabaseUsers.map((user) => (
                        <div key={`supabase-${user.userId}`} className="bg-gray-700 rounded-lg p-4 border border-blue-500">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-white">{user.displayName}</h3>
                              <p className="text-gray-300 text-sm">{user.email}</p>
                              <p className="text-blue-400 font-semibold text-lg">{user.totalScore} puan</p>
                            </div>
                            <div className="text-right">
                              <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">Supabase</span>
                              <p className="text-gray-400 text-xs mt-1">{user.createdAt}</p>
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
                  ) : (
                    <p className="text-gray-400 text-center py-4">Supabase'de kullanıcı bulunamadı</p>
                  )}
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
                      feedback.status === 'new' ? 'border-blue-500' : 
                      feedback.status === 'in_progress' ? 'border-yellow-500' :
                      feedback.status === 'resolved' ? 'border-green-500' : 'border-gray-500'
                    }`}>
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <h3 className="font-semibold text-base sm:text-lg text-blue-300">{feedback.name}</h3>
                            <span className={`px-2 py-1 rounded text-xs w-fit ${
                              feedback.status === 'new' ? 'bg-blue-600 text-white' :
                              feedback.status === 'in_progress' ? 'bg-yellow-600 text-white' :
                              feedback.status === 'resolved' ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                            }`}>
                              {feedback.status === 'new' ? 'Yeni' :
                               feedback.status === 'in_progress' ? 'İşlemde' :
                               feedback.status === 'resolved' ? 'Çözüldü' : 'Kapatıldı'}
                            </span>
                          </div>
                          <p className="text-gray-300 mt-2 text-sm font-medium">{feedback.subject}</p>
                          <p className="text-gray-300 mt-2 whitespace-pre-wrap text-sm sm:text-base">{feedback.message}</p>
                          <p className="text-gray-400 text-xs sm:text-sm mt-3">
                            📅 {feedback.createdAt.toLocaleString('tr-TR')}
                          </p>
                          {feedback.adminNotes && (
                            <p className="text-gray-400 text-xs sm:text-sm mt-2 bg-gray-800 p-2 rounded">
                              <strong>Admin Notu:</strong> {feedback.adminNotes}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          <button
                            onClick={() => openFeedbackModal(feedback)}
                            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs transition-colors flex-1 sm:flex-none"
                          >
                            Düzenle
                          </button>
                          {feedback.status === 'new' && (
                            <button
                              onClick={() => markFeedbackAsRead(feedback.id!)}
                              className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-xs transition-colors flex-1 sm:flex-none"
                            >
                              İşleme Al
                            </button>
                          )}
                          <button
                            onClick={() => deleteFeedback(feedback.id!)}
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

          {/* Cihaz İstatistikleri Tab */}
          {activeTab === 'devices' && (
            <div>
              {deviceStatsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-400">Cihaz istatistikleri yükleniyor...</p>
                </div>
              ) : deviceStats ? (
                <>
                  {/* Genel İstatistikler */}
                  <div className="bg-gray-700 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">📊 Cihaz İstatistikleri</h3>
                      <button
                        onClick={refreshStats}
                        className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg font-semibold transition-colors text-sm"
                      >
                        🔄 Yenile
                      </button>
                    </div>
                    
                    {/* Cihaz Türü Dağılımı */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-gray-600 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-blue-400">{deviceStats.totalUsers}</div>
                        <div className="text-sm text-gray-300">Toplam Kullanıcı</div>
                      </div>
                      <div className="bg-gray-600 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-green-400">{deviceStats.mobileUsers}</div>
                        <div className="text-sm text-gray-300">📱 Mobil ({deviceStats.deviceTypePercentages.mobile}%)</div>
                      </div>
                      <div className="bg-gray-600 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-yellow-400">{deviceStats.tabletUsers}</div>
                        <div className="text-sm text-gray-300">📟 Tablet ({deviceStats.deviceTypePercentages.tablet}%)</div>
                      </div>
                      <div className="bg-gray-600 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-purple-400">{deviceStats.desktopUsers}</div>
                        <div className="text-sm text-gray-300">💻 Masaüstü ({deviceStats.deviceTypePercentages.desktop}%)</div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">Cihaz istatistikleri yüklenemedi</p>
                </div>
              )}
            </div>
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

        {/* Feedback Yönetim Modal */}
        {showFeedbackModal && selectedFeedback && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-4 sm:p-6 w-full max-w-2xl">
              <h3 className="text-lg sm:text-xl font-semibold mb-4">Feedback Yönetimi</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Gönderen:</label>
                  <p className="text-white font-medium">{selectedFeedback.name}</p>
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">E-posta:</label>
                  <p className="text-white">{selectedFeedback.email}</p>
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Konu:</label>
                  <p className="text-white font-medium">{selectedFeedback.subject}</p>
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Mesaj:</label>
                  <p className="text-white bg-gray-700 p-3 rounded-lg whitespace-pre-wrap">{selectedFeedback.message}</p>
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Durum:</label>
                  <select
                    value={selectedFeedback.status}
                    onChange={(e) => setSelectedFeedback({...selectedFeedback, status: e.target.value as Feedback['status']})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  >
                    <option value="new">Yeni</option>
                    <option value="in_progress">İşlemde</option>
                    <option value="resolved">Çözüldü</option>
                    <option value="closed">Kapatıldı</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Admin Notu:</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Admin notu ekleyin..."
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white resize-none"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdateFeedbackStatus(selectedFeedback.id!, selectedFeedback.status)}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold transition-colors flex-1"
                >
                  Güncelle
                </button>
                <button
                  onClick={() => {
                    setShowFeedbackModal(false);
                    setSelectedFeedback(null);
                    setAdminNotes('');
                  }}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-semibold transition-colors flex-1"
                >
                  Kapat
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