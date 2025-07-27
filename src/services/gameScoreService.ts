import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, limit, Timestamp, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { authService } from './authService';

export type GameMode = 
  | 'matching'
  | 'sentence-completion'
  | 'multiple-choice'
  | 'flashcard'
  | 'speaking'
  | 'word-race'
  | 'wordTypes'
  | 'wordForms'
  | 'vocabulary'
  | 'timedMatching'
  | 'speedGame'
  | 'quizGame'
  | 'prepositionMastery'
  | 'paraphraseChallenge'
  | 'difficultWords'
  | 'definitionToWord';

export interface GameScore {
  userId: string;
  displayName: string;
  gameMode: GameMode;
  score: number;
  unit: string;
  timestamp: Date;
}

export interface UserScore {
  id: string;
  name: string;
  totalScore: number;
}

export interface UserProfile {
  userId: string;
  displayName: string;
  email: string;
  totalScore: number;
  gamesPlayed: number;
  lastPlayed: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface GameResult {
  userId: string;
  gameMode: GameMode;
  score: number;
  timestamp: number;
}

class GameScoreService {
  private readonly collectionName = 'gameScores';
  private readonly userProfilesCollection = 'userProfiles';
  private gameResults: GameResult[] = [];
  private static instance: GameScoreService;
  private scores: UserScore[] = [];

  private constructor() {
    // Başlangıç verileri
    this.scores = [
      {
        id: '1',
        name: 'Kullanıcı 1',
        totalScore: 1260
      }
    ];
  }

  public static getInstance(): GameScoreService {
    if (!GameScoreService.instance) {
      GameScoreService.instance = new GameScoreService();
    }
    return GameScoreService.instance;
  }

  // Kullanıcı profilini oluştur veya güncelle
  private async createOrUpdateUserProfile(userId: string, displayName: string, email: string): Promise<void> {
    const userProfileRef = doc(db, this.userProfilesCollection, userId);
    const userProfileDoc = await getDoc(userProfileRef);

    if (!userProfileDoc.exists()) {
      // Önce users koleksiyonundan mevcut puanı kontrol et
      const usersRef = doc(db, 'users', userId);
      const usersDoc = await getDoc(usersRef);
      let existingScore = 0;
      
      if (usersDoc.exists()) {
        const userData = usersDoc.data();
        existingScore = userData.totalScore || 0;
        console.log(`🔍 Mevcut puan bulundu: ${existingScore} (users koleksiyonundan)`);
      }

      // Yeni kullanıcı profili oluştur - mevcut puanı koru
      const newProfile: UserProfile = {
        userId,
        displayName,
        email,
        totalScore: existingScore, // Mevcut puanı koru, sıfırlama!
        gamesPlayed: 0,
        lastPlayed: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await setDoc(userProfileRef, newProfile);
      console.log(`✅ Yeni profil oluşturuldu, puan korundu: ${existingScore}`);
    } else {
      // Profil zaten varsa hiçbir şekilde sıfırlama veya güncelleme yapma
      console.log(`ℹ️ Profil zaten mevcut, değişiklik yapılmadı`);
      return;
    }
  }

  // Kullanıcı profilini getir
  public async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userProfileRef = doc(db, this.userProfilesCollection, userId);
      const userProfileDoc = await getDoc(userProfileRef);

      if (userProfileDoc.exists()) {
        const data = userProfileDoc.data();
        return {
          ...data,
          lastPlayed: data.lastPlayed?.toDate(),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        } as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Kullanıcı profili getirilirken hata:', error);
      return null;
    }
  }

  // Kullanıcı profilini güncelle
  private async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      const userProfileRef = doc(db, this.userProfilesCollection, userId);
      await updateDoc(userProfileRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Kullanıcı profili güncellenirken hata:', error);
    }
  }

  public async registerUser(displayName: string): Promise<void> {
    const userId = authService.getCurrentUserId();
    if (!userId) throw new Error('Kullanıcı oturum açmamış');

    const user = authService.getCurrentUser();
    if (!user) throw new Error('Kullanıcı bulunamadı');

    // Kullanıcı profilini oluştur
    await this.createOrUpdateUserProfile(userId, displayName, user.email || '');
  }

  public async saveScore(gameMode: GameMode, score: number, unit: string): Promise<void> {
    const userId = authService.getCurrentUserId();
    if (!userId) throw new Error('Kullanıcı oturum açmamış');

    const user = authService.getCurrentUser();
    if (!user) throw new Error('Kullanıcı bulunamadı');

    try {
      console.log(`🎮 saveScore çağrıldı: ${gameMode}, puan: ${score}, unit: ${unit}`);

      // Önce mevcut kullanıcı profilini getir
      let userProfile = await this.getUserProfile(userId);
      
      if (!userProfile) {
        console.log(`⚠️ Profil bulunamadı, oluşturuluyor...`);
        // Kullanıcı profilini oluştur veya güncelle
        await this.createOrUpdateUserProfile(userId, user.displayName || 'Anonim', user.email || '');
        userProfile = await this.getUserProfile(userId);
        
        if (!userProfile) {
          throw new Error('Kullanıcı profili oluşturulamadı');
        }
      }

      console.log(`📊 Mevcut puan: ${userProfile.totalScore}, yeni puan: ${score}`);

      // Yeni skoru kaydet
      await addDoc(collection(db, this.collectionName), {
        userId,
        displayName: user.displayName || 'Anonim',
        gameMode,
        score,
        unit,
        timestamp: Timestamp.now()
      });

      // Kullanıcı profilini güncelle - mevcut puanı sıfırlama, yeni puanı ekle
      const newTotalScore = (userProfile.totalScore || 0) + score;
      console.log(`💾 Yeni toplam puan: ${newTotalScore}`);
      
      await this.updateUserProfile(userId, {
        totalScore: newTotalScore,
        gamesPlayed: (userProfile.gamesPlayed || 0) + 1,
        lastPlayed: new Date()
      });

      // users koleksiyonunu da güncelle
      const usersRef = doc(db, 'users', userId);
      await updateDoc(usersRef, {
        totalScore: newTotalScore,
        gamesPlayed: (userProfile.gamesPlayed || 0) + 1,
        lastPlayed: new Date(),
        updatedAt: new Date()
      });

      console.log(`✅ Puan başarıyla kaydedildi: ${newTotalScore}`);

    } catch (error) {
      console.error('❌ Skor kaydedilirken hata:', error);
      throw error;
    }
  }

  public async getLeaderboard(gameMode: GameMode, unit: string, limitCount: number = 10): Promise<GameScore[]> {
    const q = query(
      collection(db, this.collectionName),
      where('gameMode', '==', gameMode),
      where('unit', '==', unit),
      orderBy('score', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate()
    })) as GameScore[];
  }

  public async getUserHighScore(gameMode: GameMode, unit: string): Promise<number> {
    const userId = authService.getCurrentUserId();
    if (!userId) return 0;

    try {
      const userProfile = await this.getUserProfile(userId);
      return userProfile?.totalScore || 0;
    } catch (error) {
      console.error('Kullanıcı yüksek skoru getirilirken hata:', error);
      return 0;
    }
  }

  public async getUserTotalScore(): Promise<number> {
    const userId = authService.getCurrentUserId();
    if (!userId) return 0;

    try {
      const userProfile = await this.getUserProfile(userId);
      return userProfile?.totalScore || 0;
    } catch (error) {
      console.error('Kullanıcı toplam skoru getirilirken hata:', error);
      return 0;
    }
  }

  // Kullanıcının tüm skorlarını getir
  public async getUserAllScores(): Promise<number> {
    const userId = authService.getCurrentUserId();
    if (!userId) {
      return 0;
    }

    try {
      const userProfile = await this.getUserProfile(userId);
      return userProfile?.totalScore || 0;
    } catch (error) {
      console.error('Kullanıcı skorları getirilirken hata:', error);
      return 0;
    }
  }

  // Kullanıcı istatistiklerini getir
  public async getUserStats(): Promise<{ gamesPlayed: number; lastPlayed: Date | null }> {
    const userId = authService.getCurrentUserId();
    if (!userId) return { gamesPlayed: 0, lastPlayed: null };

    try {
      const userProfile = await this.getUserProfile(userId);
      return {
        gamesPlayed: userProfile?.gamesPlayed || 0,
        lastPlayed: userProfile?.lastPlayed || null
      };
    } catch (error) {
      console.error('Kullanıcı istatistikleri getirilirken hata:', error);
      return { gamesPlayed: 0, lastPlayed: null };
    }
  }

  public async addScore(userId: string, gameMode: GameMode, score: number): Promise<void> {
    console.log('🔥 addScore çağrıldı:', { userId, gameMode, score });
    
    try {
      // Firebase'den mevcut kullanıcı profilini al
      const userProfileRef = doc(db, this.userProfilesCollection, userId);
      const userProfileDoc = await getDoc(userProfileRef);

      if (!userProfileDoc.exists()) {
        console.error('❌ Kullanıcı profili bulunamadı:', userId);
        return;
      }

      const userProfile = userProfileDoc.data() as UserProfile;
      const currentScore = userProfile.totalScore || 0;
      const newTotalScore = currentScore + score;

      console.log(`📊 Mevcut puan: ${currentScore}, yeni puan: ${score}, toplam: ${newTotalScore}`);

      // userProfiles koleksiyonunu güncelle
      await updateDoc(userProfileRef, {
        totalScore: newTotalScore,
        updatedAt: Timestamp.now(),
        lastPlayed: Timestamp.now(),
        gamesPlayed: (userProfile.gamesPlayed || 0) + 1
      });

      // users koleksiyonunu da güncelle
      const usersRef = doc(db, 'users', userId);
      await updateDoc(usersRef, {
        totalScore: newTotalScore,
        gamesPlayed: (userProfile.gamesPlayed || 0) + 1,
        lastPlayed: new Date(),
        updatedAt: new Date()
      });

      console.log('✅ Her iki koleksiyon da güncellendi:', newTotalScore);
    } catch (error) {
      console.error('❌ addScore hatası:', error);
      throw error;
    }
  }

  public async getGameModeLeaderboard(gameMode: GameMode, limit = 10): Promise<UserScore[]> {
    const modeResults = this.gameResults
      .filter(r => r.gameMode === gameMode)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return modeResults.map(result => {
      const user = this.scores.find(u => u.id === result.userId);
      return {
        ...user!,
        totalScore: result.score
      };
    });
  }

  public async getOverallLeaderboard(): Promise<UserScore[]> {
    // scores dizisinin kopyasını al
    const scoresCopy = [...this.scores];
    return scoresCopy.sort((a, b) => b.totalScore - a.totalScore);
  }

  public async getLeaderboardByGameMode(gameMode: GameMode): Promise<UserScore[]> {
    return [...this.scores].sort((a, b) => b.totalScore - a.totalScore);
  }
}

export const gameScoreService = GameScoreService.getInstance();
