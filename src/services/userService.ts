import { supabase } from '../config/supabase';
import { supabaseAuthService } from './supabaseAuthService';
import { db } from '../config/firebase';
import { collection, query, orderBy, limit, getDocs, getDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

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
    const currentUserId = userId || supabaseAuthService.getCurrentUserId();
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
      // Supabase users tablosuna ekle
      const { error } = await supabase
        .from('users')
        .insert({
          id: currentUserId,
          displayName: userData.displayName,
          email: userData.email,
          photoURL: userData.photoURL,
          totalScore: userData.totalScore,
          gamesPlayed: userData.gamesPlayed,
          lastPlayed: userData.lastPlayed.toISOString(),
          level: userData.level || 'intermediate',
          bio: userData.bio || '',
          location: userData.location || '',
          isOnline: userData.isOnline || false,
          lastSeen: userData.lastSeen?.toISOString() || new Date().toISOString(),
          isPremium: userData.isPremium || false,
          premiumUntil: userData.premiumUntil,
          badges: userData.badges || [],
          isFirstSupporter: userData.isFirstSupporter || false,
          createdAt: userData.createdAt.toISOString(),
          updatedAt: userData.updatedAt.toISOString()
        });
      
      if (error) {
        throw error;
      }
      
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
        updatedAt: new Date().toISOString()
      };

      // Supabase users tablosunu güncelle
      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Kullanıcı güncellenirken hata:', error);
    }
  }

  // Kullanıcı bilgilerini getir
  public async getUser(userId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Kullanıcı getirilirken hata:', error);
        return null;
      }
      
      if (data) {
        return {
          userId: data.id,
          displayName: data.displayName,
          email: data.email,
          photoURL: data.photoURL,
          totalScore: data.totalScore,
          gamesPlayed: data.gamesPlayed,
          lastPlayed: new Date(data.lastPlayed),
          level: data.level,
          bio: data.bio,
          location: data.location,
          isOnline: data.isOnline,
          lastSeen: data.lastSeen ? new Date(data.lastSeen) : undefined,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt),
          isPremium: data.isPremium,
          premiumUntil: data.premiumUntil,
          badges: data.badges,
          isFirstSupporter: data.isFirstSupporter
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
      // Hem users hem userProfiles koleksiyonlarından al
      const usersQuery = query(collection(db, this.usersCollection));
      const profilesQuery = query(collection(db, this.userProfilesCollection));
      
      const [usersSnapshot, profilesSnapshot] = await Promise.all([
        getDocs(usersQuery),
        getDocs(profilesQuery)
      ]);
      
      const users: User[] = [];
      const processedIds = new Set<string>();
      
      // Önce users koleksiyonundan al
      usersSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data && data.userId) {
          processedIds.add(data.userId);
          users.push({
            ...data,
            lastPlayed: data.lastPlayed?.toDate(),
            lastSeen: data.lastSeen?.toDate(),
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate()
          } as User);
        }
      });
      
      // Sonra userProfiles'den eksik olanları ekle
      profilesSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data && data.userId && !processedIds.has(data.userId)) {
          users.push({
            ...data,
            lastPlayed: data.lastPlayed?.toDate(),
            lastSeen: data.lastSeen?.toDate(),
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate()
          } as User);
        }
      });
      
      // Puanına göre sırala (totalScore olmayanlar 0 puan sayılır)
      users.sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
      
      console.log(`Toplam ${users.length} kullanıcı yüklendi`);
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
      const userId = supabaseAuthService.getCurrentUserId();
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
      const userId = supabaseAuthService.getCurrentUserId();
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
      const userId = supabaseAuthService.getCurrentUserId();
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

  // Kullanıcıyı leaderboard'dan sil (puanını sıfırla)
  public async removeUserFromLeaderboard(userId: string): Promise<void> {
    try {
      const updateData = {
        totalScore: 0,
        gamesPlayed: 0,
        updatedAt: new Date()
      };
      
      // Her iki koleksiyonu da güncelle
      await updateDoc(doc(db, this.usersCollection, userId), updateData);
      await updateDoc(doc(db, this.userProfilesCollection, userId), updateData);
      
      console.log(`${userId} kullanıcısı leaderboard'dan silindi (puan sıfırlandı)`);
    } catch (error) {
      console.error(`${userId} kullanıcısı leaderboard'dan silinirken hata:`, error);
    }
  }

  // Kullanıcıyı tamamen sil (tüm verilerini sil)
  public async deleteUserCompletely(userId: string): Promise<void> {
    try {
      // Her iki koleksiyondan da kullanıcıyı sil
      await deleteDoc(doc(db, this.usersCollection, userId));
      await deleteDoc(doc(db, this.userProfilesCollection, userId));
      
      console.log(`${userId} kullanıcısı tamamen silindi`);
    } catch (error) {
      console.error(`${userId} kullanıcısı silinirken hata:`, error);
    }
  }
}

export const userService = new UserService(); 