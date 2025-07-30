import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { authService } from '../services/authService';

const FirebaseTestPage: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testFirebaseConnection = async () => {
    setLoading(true);
    setTestResults([]);
    
    try {
      // Test 1: Firebase bağlantısı
      addResult('🔍 Firebase bağlantısı test ediliyor...');
      
      // Test 2: Auth durumu
      const currentUser = authService.getCurrentUser();
      addResult(`👤 Auth durumu: ${currentUser ? 'Giriş yapılmış' : 'Giriş yapılmamış'}`);
      
      if (currentUser) {
        addResult(`👤 Kullanıcı ID: ${currentUser.uid}`);
        addResult(`👤 Email: ${currentUser.email}`);
      }

      // Test 3: Firestore bağlantısı
      addResult('📊 Firestore bağlantısı test ediliyor...');
      
      // users koleksiyonunu test et
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        addResult(`✅ Users koleksiyonu: ${usersSnapshot.size} doküman bulundu`);
      } catch (error) {
        addResult(`❌ Users koleksiyonu hatası: ${error}`);
      }

      // userProfiles koleksiyonunu test et
      try {
        const profilesSnapshot = await getDocs(collection(db, 'userProfiles'));
        addResult(`✅ UserProfiles koleksiyonu: ${profilesSnapshot.size} doküman bulundu`);
      } catch (error) {
        addResult(`❌ UserProfiles koleksiyonu hatası: ${error}`);
      }

      // Test 4: Mevcut kullanıcının profili
      if (currentUser) {
        try {
          const userProfile = await getDoc(doc(db, 'userProfiles', currentUser.uid));
          if (userProfile.exists()) {
            addResult(`✅ Kullanıcı profili bulundu`);
            const data = userProfile.data();
            addResult(`📊 Kullanıcı puanı: ${data.totalScore || 0}`);
          } else {
            addResult(`⚠️ Kullanıcı profili bulunamadı`);
          }
        } catch (error) {
          addResult(`❌ Kullanıcı profili hatası: ${error}`);
        }
      }

      // Test 5: Diğer koleksiyonlar
      const collections = ['feedbacks', 'supportActions', 'anomalies'];
      for (const collectionName of collections) {
        try {
          const snapshot = await getDocs(collection(db, collectionName));
          addResult(`✅ ${collectionName}: ${snapshot.size} doküman`);
        } catch (error) {
          addResult(`❌ ${collectionName} hatası: ${error}`);
        }
      }

    } catch (error) {
      addResult(`❌ Genel hata: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Firebase Bağlantı Testi</h1>
        
        <button
          onClick={testFirebaseConnection}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-semibold mb-6"
        >
          {loading ? 'Test Ediliyor...' : 'Firebase Bağlantısını Test Et'}
        </button>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Sonuçları:</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-gray-400">Henüz test yapılmadı</p>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="text-sm font-mono bg-gray-700 p-2 rounded">
                  {result}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirebaseTestPage; 