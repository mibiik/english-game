import { db } from '../config/firebase';
import { collection, doc, setDoc, getDoc, updateDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { authService } from './authService';

export interface User {
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
  createdAt: Date;
  updatedAt: Date;
  isPremium?: boolean;
  premiumUntil?: string;
  badges?: string[]; // Kullanıcıya atanmış rozetler
  isFirstSupporter?: boolean; // İlk destekçi mi?
}

class UserService {
  private readonly usersCollection = 'users';
  private readonly userProfilesCollection = 'userProfiles';

  // Yeni kullanıcı kaydı
  public async registerUser(displayName: string, email: string, photoURL?: string, userId?: string): Promise<void> {
    const currentUserId = userId || authService.getCurrentUserId();
    if (!currentUserId) throw new Error('Kullanıcı oturum açmamış');

    const userData: User = {
      userId: currentUserId,
      displayName,
      email,
      photoURL,
      totalScore: 0,
      gamesPlayed: 0,
      lastPlayed: new Date(),
      lastSeen: new Date(),
      level: 'intermediate',
      bio: '',
      location: '',
      isOnline: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      // users koleksiyonuna ekle
      await setDoc(doc(db, this.usersCollection, currentUserId), userData);
      
      // userProfiles koleksiyonuna da ekle (mevcut sistem için)
      await setDoc(doc(db, this.userProfilesCollection, currentUserId), userData);
      
      console.log('Kullanıcı başarıyla kaydedildi:', currentUserId);
    } catch (error) {
      console.error('Kullanıcı kaydedilirken hata:', error);
      throw error;
    }
  }

  // Kullanıcı bilgilerini güncelle
  public async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    try {
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };

      // Her iki koleksiyonu da güncelle
      await updateDoc(doc(db, this.usersCollection, userId), updateData);
      await updateDoc(doc(db, this.userProfilesCollection, userId), updateData);
    } catch (error) {
      console.error('Kullanıcı güncellenirken hata:', error);
    }
  }

  // Kullanıcı bilgilerini getir
  public async getUser(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, this.usersCollection, userId));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          ...data,
          lastPlayed: data.lastPlayed?.toDate(),
          lastSeen: data.lastSeen?.toDate(),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        } as User;
      }
      return null;
    } catch (error) {
      console.error('Kullanıcı getirilirken hata:', error);
      return null;
    }
  }

  // Tüm kullanıcıları getir
  public async getAllUsers(): Promise<User[]> {
    try {
      const usersQuery = query(
        collection(db, this.usersCollection),
        orderBy('totalScore', 'desc')
      );
      
      const querySnapshot = await getDocs(usersQuery);
      const users: User[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        users.push({
          ...data,
          lastPlayed: data.lastPlayed?.toDate(),
          lastSeen: data.lastSeen?.toDate(),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        } as User);
      });
      
      return users;
    } catch (error) {
      console.error('Kullanıcılar getirilirken hata:', error);
      return [];
    }
  }

  // Kullanıcı ara
  public async searchUsers(searchTerm: string): Promise<User[]> {
    try {
      const usersQuery = query(
        collection(db, this.usersCollection),
        orderBy('displayName')
      );
      
      const querySnapshot = await getDocs(usersQuery);
      const users: User[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const user: User = {
          ...data,
          lastPlayed: data.lastPlayed?.toDate(),
          lastSeen: data.lastSeen?.toDate(),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        } as User;
        
        // Arama filtresi
        if (user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.location?.toLowerCase().includes(searchTerm.toLowerCase())) {
          users.push(user);
        }
      });
      
      return users;
    } catch (error) {
      console.error('Kullanıcı arama hatası:', error);
      return [];
    }
  }

  // Online durumu güncelle
  public async updateOnlineStatus(userId: string, isOnline: boolean): Promise<void> {
    try {
      const updateData = {
        isOnline,
        lastSeen: new Date(),
        updatedAt: new Date()
      };

      await updateDoc(doc(db, this.usersCollection, userId), updateData);
      await updateDoc(doc(db, this.userProfilesCollection, userId), updateData);
    } catch (error) {
      console.error('Online durumu güncellenirken hata:', error);
    }
  }

  // Kullanıcı skorunu güncelle
  public async updateUserScore(userId: string, gameMode: string, score: number): Promise<void> {
    try {
      const userDoc = await getDoc(doc(db, this.usersCollection, userId));
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        const newTotalScore = userData.totalScore + score;
        const newGamesPlayed = userData.gamesPlayed + 1;
        
        const updateData = {
          totalScore: newTotalScore,
          gamesPlayed: newGamesPlayed,
          lastPlayed: new Date(),
          updatedAt: new Date()
        };

        await updateDoc(doc(db, this.usersCollection, userId), updateData);
        await updateDoc(doc(db, this.userProfilesCollection, userId), updateData);
      }
    } catch (error) {
      console.error('Kullanıcı skoru güncellenirken hata:', error);
    }
  }

  // En iyi kullanıcıları getir
  public async getTopUsers(limitCount: number = 10): Promise<User[]> {
    try {
      const usersQuery = query(
        collection(db, this.usersCollection),
        orderBy('totalScore', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(usersQuery);
      const users: User[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        users.push({
          ...data,
          lastPlayed: data.lastPlayed?.toDate(),
          lastSeen: data.lastSeen?.toDate(),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        } as User);
      });
      
      return users;
    } catch (error) {
      console.error('En iyi kullanıcılar getirilirken hata:', error);
      return [];
    }
  }

  // Kullanıcı sayısını getir
  public async getUserCount(): Promise<number> {
    try {
      const usersQuery = query(collection(db, this.usersCollection));
      const querySnapshot = await getDocs(usersQuery);
      return querySnapshot.size;
    } catch (error) {
      console.error('Kullanıcı sayısı getirilirken hata:', error);
      return 0;
    }
  }

  // Modal görüldü olarak işaretle
  public async markModalAsSeen(): Promise<void> {
    try {
      const userId = authService.getCurrentUserId();
      if (userId) {
        await updateDoc(doc(db, this.usersCollection, userId), {
          hasSeenWelcomePopup: true,
          updatedAt: new Date()
        });
      }
      localStorage.setItem('hasSeenWelcomePopupV2', 'true');
    } catch (error) {
      console.error('Modal görüldü işaretlenirken hata:', error);
    }
  }

  // Modal görülüp görülmediğini kontrol et
  public async checkIfModalSeen(): Promise<boolean> {
    try {
      const userId = authService.getCurrentUserId();
      if (!userId) return false;

      const userDoc = await getDoc(doc(db, this.usersCollection, userId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        return data.hasSeenWelcomePopup || false;
      }
      return false;
    } catch (error) {
      console.error('Modal durumu kontrol edilirken hata:', error);
      return false;
    }
  }

  // Kullanıcı adını kaydet
  public async saveUserName(name: string): Promise<void> {
    try {
      const userId = authService.getCurrentUserId();
      if (userId) {
        await updateDoc(doc(db, this.usersCollection, userId), {
          displayName: name,
          updatedAt: new Date()
        });
      }
    } catch (error) {
      console.error('Kullanıcı adı kaydedilirken hata:', error);
    }
  }

  // Emir'in puanını mevcut puan + 11.000 olarak güncelle
  public async setEmirScoreTo11000(): Promise<void> {
    const userId = 'dZFMjEqoTDTJCMyiNmQ3cMaCqx83';
    try {
      // Mevcut kullanıcıyı al
      const userDoc = await getDoc(doc(db, this.usersCollection, userId));
      let currentScore = 0;
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        currentScore = userData.totalScore || 0;
      }
      const newScore = currentScore + 11000;
      const updateData = {
        totalScore: newScore,
        updatedAt: new Date()
      };
      await updateDoc(doc(db, this.usersCollection, userId), updateData);
      await updateDoc(doc(db, this.userProfilesCollection, userId), updateData);
      console.log(`Emir'in puanı ${newScore} olarak güncellendi.`);
    } catch (error) {
      console.error("Emir'in puanı güncellenirken hata:", error);
    }
  }

  // mbirlik24@ku.edu.tr kullanıcısının puanını 8000 yap
  public async setMbirlikScoreTo8000(): Promise<void> {
    try {
      // Önce email ile kullanıcıyı bul
      const usersQuery = query(collection(db, this.usersCollection), where('email', '==', 'mbirlik24@ku.edu.tr'));
      const usersSnapshot = await getDocs(usersQuery);
      
      if (usersSnapshot.empty) {
        console.error('mbirlik24@ku.edu.tr email adresli kullanıcı bulunamadı');
        return;
      }

      const userDoc = usersSnapshot.docs[0];
      const userId = userDoc.id;
      const userData = userDoc.data() as User;
      
      const updateData = {
        totalScore: 8000,
        updatedAt: new Date()
      };
      
      await updateDoc(doc(db, this.usersCollection, userId), updateData);
      await updateDoc(doc(db, this.userProfilesCollection, userId), updateData);
      
      console.log(`mbirlik24@ku.edu.tr kullanıcısının puanı 8000 olarak güncellendi.`);
    } catch (error) {
      console.error("mbirlik24@ku.edu.tr kullanıcısının puanı güncellenirken hata:", error);
    }
  }

  // Kullanıcı profil fotoğrafını güncelle (Google ile girişte veya değişiklikte)
  public async updateUserPhoto(userId: string, photoURL: string): Promise<void> {
    try {
      const updateData = {
        photoURL,
        updatedAt: new Date()
      };
      await updateDoc(doc(db, this.usersCollection, userId), updateData);
      await updateDoc(doc(db, this.userProfilesCollection, userId), updateData);
    } catch (error) {
      console.error('Kullanıcı profil fotoğrafı güncellenirken hata:', error);
    }
  }

  // Görkem'e bağışçı rozeti ve ilk destekçi yıldızını ekle
  public async setGorkemSupporterBadge(): Promise<void> {
    const userId = 'VtSQP9JxPSVmRrHUyeMX9aYBMDq1';
    const updateData = {
      badges: ['bağışçı'],
      isFirstSupporter: true,
      updatedAt: new Date()
    };
    await updateDoc(doc(db, this.usersCollection, userId), updateData);
    await updateDoc(doc(db, this.userProfilesCollection, userId), updateData);
  }

  // Kullanıcının zorlandığı kelimeleri Firestore'a kaydet
  public async saveDifficultWordsToCloud(userId: string, words: string[]): Promise<void> {
    try {
      await updateDoc(doc(db, this.userProfilesCollection, userId), {
        difficultWords: words,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Zor kelimeler buluta kaydedilirken hata:', error);
    }
  }

  // Kullanıcının zorlandığı kelimeleri Firestore'dan al
  public async getDifficultWordsFromCloud(userId: string): Promise<string[]> {
    try {
      const userProfileDoc = await getDoc(doc(db, this.userProfilesCollection, userId));
      if (userProfileDoc.exists()) {
        const data = userProfileDoc.data();
        return data.difficultWords || [];
      }
      return [];
    } catch (error) {
      console.error('Zor kelimeler buluttan alınırken hata:', error);
      return [];
    }
  }

  // Belirtilen kullanıcıya 500 puan ekle
  public async add500PointsToUser(userId: string): Promise<void> {
    try {
      // Mevcut kullanıcıyı al
      const userDoc = await getDoc(doc(db, this.usersCollection, userId));
      let currentScore = 0;
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        currentScore = userData.totalScore || 0;
      }
      const newScore = currentScore + 500;
      const updateData = {
        totalScore: newScore,
        updatedAt: new Date()
      };
      await updateDoc(doc(db, this.usersCollection, userId), updateData);
      await updateDoc(doc(db, this.userProfilesCollection, userId), updateData);
      console.log(`${userId} kullanıcısına 500 puan eklendi. Yeni puan: ${newScore}`);
    } catch (error) {
      console.error(`${userId} kullanıcısına puan eklenirken hata:`, error);
    }
  }
}

export const userService = new UserService(); 