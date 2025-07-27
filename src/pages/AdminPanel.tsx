import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { User } from '../services/userService';

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newScore, setNewScore] = useState('');
  const [scoreModalOpen, setScoreModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setMessage('Kullanıcılar yükleniyor...');
    try {
      const allUsers = await userService.getAllUsers();
      setUsers(allUsers);
      setMessage(`✅ ${allUsers.length} kullanıcı başarıyla yüklendi!`);
      setTimeout(() => setMessage(''), 3000); // 3 saniye sonra mesajı temizle
    } catch (error) {
      console.error('Kullanıcılar yüklenirken hata:', error);
      setMessage('❌ Kullanıcılar yüklenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const setUserScore = async (userId: string, score: number) => {
    setLoading(true);
    try {
      await userService.updateUser(userId, { totalScore: score });
      setMessage(`${userId} kullanıcısının puanı ${score} olarak ayarlandı!`);
      setScoreModalOpen(false);
      setSelectedUser(null);
      setNewScore('');
      await loadUsers();
    } catch (error) {
      setMessage('Puan ayarlanırken hata oluştu!');
      console.error('Puan ayarlama hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const openScoreModal = (user: User) => {
    setSelectedUser(user);
    setNewScore(user.totalScore.toString());
    setScoreModalOpen(true);
  };

  const setGorkemSupporterBadge = async () => {
    setLoading(true);
    try {
      await userService.setGorkemSupporterBadge();
      setMessage('Görkem\'e bağışçı rozeti ve ilk destekçi yıldızı eklendi!');
      await loadUsers();
    } catch (error) {
      setMessage('Görkem\'e rozet eklenirken hata oluştu!');
      console.error('Görkem rozet hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserCount = async () => {
    setLoading(true);
    try {
      const count = await userService.getUserCount();
      setMessage(`📊 Toplam ${count} kullanıcı bulundu!`);
      setTimeout(() => setMessage(''), 3000);
      } catch (error) {
      setMessage('❌ Kullanıcı sayısı alınırken hata oluştu!');
      console.error('Kullanıcı sayısı hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeUserFromLeaderboard = async (userId: string, userName: string) => {
    if (!window.confirm(`${userName} kullanıcısını leaderboard'dan silmek istediğinizden emin misiniz? Puanı sıfırlanacak.`)) {
      return;
    }

    setLoading(true);
    try {
      await userService.removeUserFromLeaderboard(userId);
      setMessage(`✅ ${userName} leaderboard'dan silindi!`);
      await loadUsers();
    } catch (error) {
      setMessage('❌ Kullanıcı silinirken hata oluştu!');
      console.error('Silme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUserCompletely = async (userId: string, userName: string) => {
    if (!window.confirm(`${userName} kullanıcısını TAMAMEN silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!`)) {
      return;
    }

    setLoading(true);
    try {
      await userService.deleteUserCompletely(userId);
      setMessage(`✅ ${userName} tamamen silindi!`);
      await loadUsers();
    } catch (error) {
      setMessage('❌ Kullanıcı silinirken hata oluştu!');
      console.error('Silme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.userId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Admin Panel</h1>
        
        {message && (
          <div className="bg-green-600 text-white p-4 rounded-lg mb-6 text-center">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <button
            onClick={setGorkemSupporterBadge}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors text-sm"
          >
            Görkem'e Bağışçı Rozeti
          </button>

          <button 
            onClick={loadUsers}
            disabled={loading}
            className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-colors text-sm"
          >
            🔄 Yenile
          </button>
        
          <button 
            onClick={getUserCount}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors text-sm"
          >
            📊 Kullanıcı Sayısı
          </button>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h2 className="text-2xl font-bold mb-4 md:mb-0">Kullanıcı Listesi</h2>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="text-sm text-gray-400">
                Toplam: {filteredUsers.length} kullanıcı
              </div>
              <div className="w-full md:w-64">
                <input
                  type="text"
                  placeholder="Kullanıcı ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
              <p className="mt-4">Yükleniyor...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4">Kullanıcı</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Mevcut Puan</th>
                    <th className="text-left py-3 px-4">Oyun Sayısı</th>
                    <th className="text-left py-3 px-4">Son Oyun</th>
                    <th className="text-left py-3 px-4">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.userId} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {user.photoURL ? (
                            <img 
                              src={user.photoURL} 
                              alt={user.displayName}
                              className="w-8 h-8 rounded-full mr-3"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full mr-3 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                              {user.displayName ? user.displayName.charAt(0).toUpperCase() : '?'}
          </div>
        )}
                          <div>
                            <div className="font-semibold">{user.displayName}</div>
                            <div className="text-xs text-gray-400">{user.userId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-yellow-400 text-lg">{user.totalScore}</span>
                      </td>
                      <td className="py-3 px-4">{user.gamesPlayed}</td>
                      <td className="py-3 px-4 text-xs text-gray-400">
                        {user.lastPlayed ? new Date(user.lastPlayed).toLocaleDateString('tr-TR') : 'Hiç oynamamış'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => openScoreModal(user)}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white text-xs py-1 px-2 rounded transition-colors"
                          >
                            Puanı Ayarla
                          </button>
                          <button
                            onClick={() => removeUserFromLeaderboard(user.userId, user.displayName)}
                            disabled={loading}
                            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white text-xs py-1 px-2 rounded transition-colors"
                          >
                            Leaderboard'dan Sil
                          </button>
                          <button
                            onClick={() => deleteUserCompletely(user.userId, user.displayName)}
                            disabled={loading}
                            className="bg-black hover:bg-gray-800 disabled:bg-gray-600 text-white text-xs py-1 px-2 rounded transition-colors border border-red-500"
                          >
                            Tamamen Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
                </div>
              )}
        </div>

        {/* Puan Ayarlama Modal */}
        {scoreModalOpen && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-bold mb-4">Puan Ayarla</h3>
              <div className="mb-4">
                <p className="text-gray-300 mb-2">Kullanıcı: <span className="font-semibold text-white">{selectedUser.displayName}</span></p>
                <p className="text-gray-300 mb-2">Mevcut Puan: <span className="font-bold text-yellow-400">{selectedUser.totalScore}</span></p>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Yeni Puan:
                </label>
                <input
                  type="number"
                  value={newScore}
                  onChange={(e) => setNewScore(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Yeni puanı girin"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setUserScore(selectedUser.userId, parseInt(newScore) || 0)}
                  disabled={loading || !newScore}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  {loading ? 'Ayarlanıyor...' : 'Puanı Ayarla'}
                </button>
                <button
                  onClick={() => {
                    setScoreModalOpen(false);
                    setSelectedUser(null);
                    setNewScore('');
                  }}
                  disabled={loading}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded transition-colors"
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