import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { User } from '../services/userService';

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const allUsers = await userService.getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Kullanıcılar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const add500PointsToUser = async (userId: string) => {
    setLoading(true);
    try {
      await userService.add500PointsToUser(userId);
      setMessage(`${userId} kullanıcısına 500 puan eklendi!`);
      // Kullanıcı listesini yenile
      await loadUsers();
    } catch (error) {
      setMessage('Puan eklenirken hata oluştu!');
      console.error('Puan ekleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const setEmirScoreTo11000 = async () => {
    setLoading(true);
    try {
      await userService.setEmirScoreTo11000();
      setMessage('Emir\'in puanı 11.000 olarak ayarlandı!');
      await loadUsers();
    } catch (error) {
      setMessage('Emir\'in puanı ayarlanırken hata oluştu!');
      console.error('Emir puan hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const setMbirlikScoreTo8000 = async () => {
    setLoading(true);
    try {
      await userService.setMbirlikScoreTo8000();
      setMessage('mbirlik24@ku.edu.tr kullanıcısının puanı 8.000 olarak ayarlandı!');
      await loadUsers();
    } catch (error) {
      setMessage('mbirlik24@ku.edu.tr puanı ayarlanırken hata oluştu!');
      console.error('mbirlik24@ku.edu.tr puan hatası:', error);
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Admin Panel</h1>
        
        {message && (
          <div className="bg-green-600 text-white p-4 rounded-lg mb-6 text-center">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <button
            onClick={setEmirScoreTo11000}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Emir'e 11.000 Puan Ver
          </button>

          <button
            onClick={setMbirlikScoreTo8000}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            mbirlik24@ku.edu.tr'ye 8.000 Puan Ver
          </button>

          <button
            onClick={setGorkemSupporterBadge}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Görkem'e Bağışçı Rozeti Ver
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Kullanıcı Listesi</h2>
          
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
                    <th className="text-left py-3 px-4">Puan</th>
                    <th className="text-left py-3 px-4">Oyun Sayısı</th>
                    <th className="text-left py-3 px-4">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.userId} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {user.photoURL && (
                            <img 
                              src={user.photoURL} 
                              alt={user.displayName}
                              className="w-8 h-8 rounded-full mr-3"
                            />
                          )}
                          <div>
                            <div className="font-semibold">{user.displayName}</div>
                            <div className="text-xs text-gray-400">{user.userId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4 font-bold text-yellow-400">{user.totalScore}</td>
                      <td className="py-3 px-4">{user.gamesPlayed}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => add500PointsToUser(user.userId)}
                          disabled={loading}
                          className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white text-xs py-2 px-3 rounded transition-colors"
                        >
                          +500 Puan
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 