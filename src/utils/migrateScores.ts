// Puan migration script'i - Eski Firebase'den yeni Firebase'e puan aktarımı
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, query, orderBy } from "firebase/firestore";

// Eski Firebase konfigürasyonu (engllish-e9b66)
const oldFirebaseConfig = {
  apiKey: "AIzaSyBv5CmjWcqUD-IoUR6fRODD1QkD6rRd_dc",
  authDomain: "engllish-e9b66.firebaseapp.com",
  projectId: "engllish-e9b66",
  storageBucket: "engllish-e9b66.firebasestorage.app",
  messagingSenderId: "108757647621",
  appId: "1:108757647621:web:42842dc88178c7058bb76c",
  measurementId: "G-ND05BVBP39"
};

// Yeni Firebase konfigürasyonu (wordplay-99044)
const newFirebaseConfig = {
  apiKey: "AIzaSyBEVHXctBk-AZh2T5lhMwA3j2KoCg3589g",
  authDomain: "wordplay-99044.firebaseapp.com",
  projectId: "wordplay-99044",
  storageBucket: "wordplay-99044.firebasestorage.app",
  messagingSenderId: "458350131750",
  appId: "1:458350131750:web:d23ef859dd519ecc7d84e7",
  measurementId: "G-J0SS2K3GZT"
};

// Firebase uygulamalarını başlat
const oldApp = initializeApp(oldFirebaseConfig, 'old');
const newApp = initializeApp(newFirebaseConfig, 'new');

// Firestore instance'larını al
const oldDb = getFirestore(oldApp);
const newDb = getFirestore(newApp);

interface UserProfile {
  userId: string;
  displayName: string;
  email: string;
  totalScore: number;
  badges?: string[];
  isFirstSupporter?: boolean;
  createdAt?: string;
  lastSeen?: string;
}

interface GameScore {
  id: string;
  userId: string;
  gameType: string;
  score: number;
  timestamp: string;
}

export const migrateScores = async () => {
  console.log('🚀 Puan migration başlatılıyor...');
  
  try {
    // 1. Eski Firebase'den kullanıcı profillerini al
    console.log('📥 Eski Firebase\'den kullanıcı profilleri alınıyor...');
    const userProfilesSnapshot = await getDocs(collection(oldDb, 'userProfiles'));
    const userProfiles: UserProfile[] = [];
    
    userProfilesSnapshot.forEach((doc) => {
      const data = doc.data() as UserProfile;
      userProfiles.push({
        ...data,
        userId: doc.id
      });
    });
    
    console.log(`✅ ${userProfiles.length} kullanıcı profili bulundu`);
    
    // 2. Eski Firebase'den oyun skorlarını al
    console.log('📥 Eski Firebase\'den oyun skorları alınıyor...');
    const gameScoresSnapshot = await getDocs(collection(oldDb, 'gameScores'));
    const gameScores: GameScore[] = [];
    
    gameScoresSnapshot.forEach((doc) => {
      const data = doc.data() as GameScore;
      gameScores.push({
        ...data,
        id: doc.id
      });
    });
    
    console.log(`✅ ${gameScores.length} oyun skoru bulundu`);
    
    // 3. Yeni Firebase'e kullanıcı profillerini aktar
    console.log('📤 Yeni Firebase\'e kullanıcı profilleri aktarılıyor...');
    let migratedUsers = 0;
    
    for (const userProfile of userProfiles) {
      try {
        await setDoc(doc(newDb, 'userProfiles', userProfile.userId), {
          displayName: userProfile.displayName,
          email: userProfile.email,
          totalScore: userProfile.totalScore,
          badges: userProfile.badges || [],
          isFirstSupporter: userProfile.isFirstSupporter || false,
          createdAt: userProfile.createdAt || new Date().toISOString(),
          lastSeen: userProfile.lastSeen || new Date().toISOString(),
          migratedAt: new Date().toISOString()
        });
        migratedUsers++;
        console.log(`✅ Kullanıcı aktarıldı: ${userProfile.displayName} (${userProfile.totalScore} puan)`);
      } catch (error) {
        console.error(`❌ Kullanıcı aktarım hatası (${userProfile.displayName}):`, error);
      }
    }
    
    // 4. Yeni Firebase'e oyun skorlarını aktar
    console.log('📤 Yeni Firebase\'e oyun skorları aktarılıyor...');
    let migratedScores = 0;
    
    for (const gameScore of gameScores) {
      try {
        await setDoc(doc(newDb, 'gameScores', gameScore.id), {
          userId: gameScore.userId,
          gameType: gameScore.gameType,
          score: gameScore.score,
          timestamp: gameScore.timestamp,
          migratedAt: new Date().toISOString()
        });
        migratedScores++;
        console.log(`✅ Skor aktarıldı: ${gameScore.gameType} - ${gameScore.score} puan`);
      } catch (error) {
        console.error(`❌ Skor aktarım hatası (${gameScore.id}):`, error);
      }
    }
    
    console.log('🎉 Migration tamamlandı!');
    console.log(`📊 Sonuçlar:`);
    console.log(`   - ${migratedUsers}/${userProfiles.length} kullanıcı profili aktarıldı`);
    console.log(`   - ${migratedScores}/${gameScores.length} oyun skoru aktarıldı`);
    
    return {
      success: true,
      migratedUsers,
      totalUsers: userProfiles.length,
      migratedScores,
      totalScores: gameScores.length
    };
    
  } catch (error) {
    console.error('❌ Migration hatası:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    };
  }
};

// Migration durumunu kontrol et
export const checkMigrationStatus = async () => {
  try {
    const newUserProfilesSnapshot = await getDocs(collection(newDb, 'userProfiles'));
    const newGameScoresSnapshot = await getDocs(collection(newDb, 'gameScores'));
    
    console.log('📊 Yeni Firebase durumu:');
    console.log(`   - ${newUserProfilesSnapshot.size} kullanıcı profili`);
    console.log(`   - ${newGameScoresSnapshot.size} oyun skoru`);
    
    return {
      userProfiles: newUserProfilesSnapshot.size,
      gameScores: newGameScoresSnapshot.size
    };
  } catch (error) {
    console.error('❌ Migration durumu kontrol hatası:', error);
    return null;
  }
}; 