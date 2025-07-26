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
  scores: Record<GameMode, number>;
  totalScore: number;
}

export interface UserProfile {
  userId: string;
  displayName: string;
  email: string;
  scores: Record<GameMode, number>;
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
        scores: {
          'matching': 300,
          'multiple-choice': 250,
          'flashcard': 200,
          'speaking': 80,
          'word-race': 70,
          'sentence-completion': 60,
          'wordTypes': 50,
          'wordForms': 0,
          'vocabulary': 0,
          'timedMatching': 0,
          'speedGame': 0,
          'quizGame': 0,
          'prepositionMastery': 0,
          'paraphraseChallenge': 0,
          'difficultWords': 0,
          'definitionToWord': 0
        },
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
      // Yeni kullanıcı profili oluştur
      const newProfile: UserProfile = {
        userId,
        displayName,
        email,
        scores: {
          'matching': 0,
          'sentence-completion': 0,
          'multiple-choice': 0,
          'flashcard': 0,
          'speaking': 0,
          'word-race': 0,
          'wordTypes': 0,
          'wordForms': 0,
          'vocabulary': 0,
          'timedMatching': 0,
          'speedGame': 0,
          'quizGame': 0,
          'prepositionMastery': 0,
          'paraphraseChallenge': 0,
          'difficultWords': 0,
          'definitionToWord': 0
        },
        totalScore: 0,
        gamesPlayed: 0,
        lastPlayed: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await setDoc(userProfileRef, newProfile);
    } else {
      // Profil zaten varsa hiçbir şekilde sıfırlama veya güncelleme yapma
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

    // Kullanıcının ilk skorunu oluştur
    await addDoc(collection(db, this.collectionName), {
      userId,
      displayName,
      gameMode: 'matching',
      score: 0,
      unit: '1',
      timestamp: Timestamp.now()
    });
  }

  public async saveScore(gameMode: GameMode, score: number, unit: string): Promise<void> {
    const userId = authService.getCurrentUserId();
    if (!userId) throw new Error('Kullanıcı oturum açmamış');

    const user = authService.getCurrentUser();
    if (!user) throw new Error('Kullanıcı bulunamadı');

    try {
      // Kullanıcı profilini oluştur veya güncelle
      await this.createOrUpdateUserProfile(userId, user.displayName || 'Anonim', user.email || '');

      // Mevcut kullanıcı profilini getir
      const userProfile = await this.getUserProfile(userId);
      if (!userProfile) throw new Error('Kullanıcı profili bulunamadı');

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
      const newScores = { ...userProfile.scores };
      const currentScore = newScores[gameMode] || 0;
      newScores[gameMode] = currentScore + score; // Mevcut puan + yeni puan
      const newTotalScore = Object.values(newScores).reduce((sum, s) => sum + s, 0);
      await this.updateUserProfile(userId, {
        scores: newScores,
        totalScore: newTotalScore,
        gamesPlayed: userProfile.gamesPlayed + 1,
        lastPlayed: new Date()
      });

    } catch (error) {
      console.error('Skor kaydedilirken hata:', error);
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
      return userProfile?.scores[gameMode] || 0;
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
  public async getUserAllScores(): Promise<Record<GameMode, number>> {
    const userId = authService.getCurrentUserId();
    if (!userId) {
      return {
        'matching': 0,
        'sentence-completion': 0,
        'multiple-choice': 0,
        'flashcard': 0,
        'speaking': 0,
        'word-race': 0,
        'wordTypes': 0,
        'wordForms': 0,
        'vocabulary': 0,
        'timedMatching': 0,
        'speedGame': 0,
        'quizGame': 0,
        'prepositionMastery': 0,
        'paraphraseChallenge': 0,
        'difficultWords': 0,
        'definitionToWord': 0
      };
    }

    try {
      const userProfile = await this.getUserProfile(userId);
      return userProfile?.scores || {
        'matching': 0,
        'sentence-completion': 0,
        'multiple-choice': 0,
        'flashcard': 0,
        'speaking': 0,
        'word-race': 0,
        'wordTypes': 0,
        'wordForms': 0,
        'vocabulary': 0,
        'timedMatching': 0,
        'speedGame': 0,
        'quizGame': 0,
        'prepositionMastery': 0,
        'paraphraseChallenge': 0,
        'difficultWords': 0,
        'definitionToWord': 0
      };
    } catch (error) {
      console.error('Kullanıcı skorları getirilirken hata:', error);
      return {
        'matching': 0,
        'sentence-completion': 0,
        'multiple-choice': 0,
        'flashcard': 0,
        'speaking': 0,
        'word-race': 0,
        'wordTypes': 0,
        'wordForms': 0,
        'vocabulary': 0,
        'timedMatching': 0,
        'speedGame': 0,
        'quizGame': 0,
        'prepositionMastery': 0,
        'paraphraseChallenge': 0,
        'difficultWords': 0,
        'definitionToWord': 0
      };
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
    
    // Firebase'den mevcut kullanıcı profilini al
    const userProfileRef = doc(db, this.userProfilesCollection, userId);
    const userProfileDoc = await getDoc(userProfileRef);

    if (!userProfileDoc.exists()) {
      console.error('❌ Kullanıcı profili bulunamadı:', userId);
      return;
    }

    const userProfile = userProfileDoc.data() as UserProfile;
    console.log('📊 Mevcut profil:', { 
      currentScore: userProfile.scores[gameMode] || 0, 
      totalScore: userProfile.totalScore 
    });
    
    // Oyun moduna göre puanı güncelle
    const newScores = { ...userProfile.scores };
    const oldScore = newScores[gameMode] || 0;
    newScores[gameMode] = oldScore + score;
    const newTotalScore = Object.values(newScores).reduce((sum, s) => sum + s, 0);

    console.log('📈 Yeni skorlar:', { 
      gameMode, 
      oldScore, 
      addedScore: score, 
      newScore: newScores[gameMode],
      oldTotal: userProfile.totalScore,
      newTotal: newTotalScore
    });

    // Firebase'de güncelle
    await updateDoc(userProfileRef, {
      scores: newScores,
      totalScore: newTotalScore,
      updatedAt: Timestamp.now(),
      lastPlayed: Timestamp.now(),
      gamesPlayed: (userProfile.gamesPlayed || 0) + 1
    });
    
    console.log('✅ Firebase güncellendi');
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
        scores: {
          ...user!.scores,
          [gameMode]: result.score
        },
        totalScore: result.score
      };
    });
  }

  public async getOverallLeaderboard(): Promise<UserScore[]> {
    // Emir'in userId'si
    const emirId = 'dZFMjEqoTDTJCMyiNmQ3cMaCqx83';
    // Emir'in güncel profilini al
    const emirProfile = await this.getUserProfile(emirId);
    // scores dizisinin kopyasını al
    const scoresCopy = [...this.scores];
    if (emirProfile) {
      const emirIndex = scoresCopy.findIndex(u => u.id === emirId);
      const emirLeaderboardScore = emirProfile.totalScore + 11000;
      if (emirIndex !== -1) {
        scoresCopy[emirIndex].totalScore = emirLeaderboardScore;
      } else {
        scoresCopy.push({
          id: emirProfile.userId,
          name: emirProfile.displayName,
          scores: emirProfile.scores,
          totalScore: emirLeaderboardScore
        });
      }
    }
    return scoresCopy.sort((a, b) => b.totalScore - a.totalScore);
  }

  public async getLeaderboardByGameMode(gameMode: GameMode): Promise<UserScore[]> {
    return [...this.scores].sort((a, b) => b.scores[gameMode] - a.scores[gameMode]);
  }

  // Emir'in leaderboard puanını güncelle (manuel düzeltme için)
  public async updateEmirLeaderboardScore(): Promise<void> {
    const userId = 'dZFMjEqoTDTJCMyiNmQ3cMaCqx83';
    // Emir'in güncel profilini al
    const userProfile = await this.getUserProfile(userId);
    if (!userProfile) return;
    // scores dizisinde Emir'i bul
    const emirIndex = this.scores.findIndex(u => u.id === userId);
    if (emirIndex !== -1) {
      this.scores[emirIndex].totalScore = userProfile.totalScore;
    } else {
      // Eğer yoksa ekle
      this.scores.push({
        id: userProfile.userId,
        name: userProfile.displayName,
        scores: userProfile.scores,
        totalScore: userProfile.totalScore
      });
    }
  }
}

export const gameScoreService = GameScoreService.getInstance();
