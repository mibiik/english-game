import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit as firestoreLimit, 
  addDoc 
} from 'firebase/firestore';
import { authService } from './authService';

export interface UserActivity {
  id?: string;
  userId: string;
  activityType: 'login' | 'logout' | 'game_start' | 'game_complete' | 'game_score' | 'level_up' | 'word_learned' | 'profile_update' | 'page_visit';
  gameMode?: string;
  score?: number;
  level?: string;
  unit?: string;
  wordId?: string;
  word?: string;
  page?: string;
  details?: any;
  timestamp: Date;
  sessionId?: string;
}

export interface GameSession {
  id?: string;
  userId: string;
  sessionId: string;
  gameMode: string;
  startTime: Date;
  endTime?: Date;
  totalScore: number;
  wordsPlayed: number;
  correctAnswers: number;
  wrongAnswers: number;
  level: string;
  unit: string;
  duration?: number; // saniye cinsinden
  isCompleted: boolean;
}

export interface UserStats {
  userId: string;
  totalGamesPlayed: number;
  totalScore: number;
  averageScore: number;
  bestScore: number;
  totalPlayTime: number; // dakika cinsinden
  favoriteGameMode: string;
  totalWordsLearned: number;
  currentStreak: number; // günlük oyun serisi
  longestStreak: number;
  lastPlayed: Date;
  levelProgress: {
    [level: string]: {
      totalScore: number;
      gamesPlayed: number;
      wordsLearned: number;
      averageScore: number;
    }
  };
  unitProgress: {
    [unit: string]: {
      totalScore: number;
      gamesPlayed: number;
      wordsLearned: number;
      averageScore: number;
    }
  };
  gameModeStats: {
    [gameMode: string]: {
      totalScore: number;
      gamesPlayed: number;
      averageScore: number;
      bestScore: number;
    }
  };
  updatedAt: Date;
}

export interface UserLearningProgress {
  userId: string;
  wordId: string;
  word: string;
  level: string;
  unit: string;
  timesSeen: number;
  timesCorrect: number;
  timesWrong: number;
  lastSeen: Date;
  masteryLevel: number; // 0-100 arası
  isMastered: boolean;
  createdAt: Date;
  updatedAt: Date;
}

class UserAnalyticsService {
  private readonly activitiesCollection = 'userActivities';
  private readonly gameSessionsCollection = 'gameSessions';
  private readonly userStatsCollection = 'userStats';
  private readonly learningProgressCollection = 'userLearningProgress';

  // Kullanıcı aktivitesi kaydet
  public async logActivity(activity: Omit<UserActivity, 'id' | 'timestamp'>): Promise<void> {
    try {
      const userId = authService.getCurrentUserId();
      if (!userId) throw new Error('Kullanıcı oturum açmamış');

      const activityData: UserActivity = {
        ...activity,
        userId,
        timestamp: new Date()
      };

      await addDoc(collection(db, this.activitiesCollection), activityData);
    } catch (error) {
      console.error('Aktivite kaydedilirken hata:', error);
    }
  }

  // Giriş aktivitesi kaydet
  public async logLogin(): Promise<void> {
    await this.logActivity({
      userId: authService.getCurrentUserId() || '',
      activityType: 'login',
      sessionId: this.generateSessionId()
    });
  }

  // Çıkış aktivitesi kaydet
  public async logLogout(): Promise<void> {
    await this.logActivity({
      userId: authService.getCurrentUserId() || '',
      activityType: 'logout'
    });
  }

  // Oyun başlangıcı kaydet
  public async logGameStart(gameMode: string, level: string, unit: string): Promise<string> {
    const sessionId = this.generateSessionId();
    
    await this.logActivity({
      userId: authService.getCurrentUserId() || '',
      activityType: 'game_start',
      gameMode,
      level,
      unit,
      sessionId
    });

    // Oyun oturumu oluştur
    const sessionData: GameSession = {
      userId: authService.getCurrentUserId() || '',
      sessionId,
      gameMode,
      startTime: new Date(),
      totalScore: 0,
      wordsPlayed: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      level,
      unit,
      isCompleted: false
    };

    await setDoc(doc(db, this.gameSessionsCollection, sessionId), sessionData);

    return sessionId;
  }

  // Oyun tamamlama kaydet
  public async logGameComplete(
    sessionId: string, 
    totalScore: number, 
    wordsPlayed: number, 
    correctAnswers: number, 
    wrongAnswers: number
  ): Promise<void> {
    try {
      const userId = authService.getCurrentUserId();
      if (!userId) throw new Error('Kullanıcı oturum açmamış');

      const endTime = new Date();
      
      // Oyun oturumunu güncelle
      const sessionRef = doc(db, this.gameSessionsCollection, sessionId);
      const sessionDoc = await getDoc(sessionRef);
      
      if (sessionDoc.exists()) {
        const sessionData = sessionDoc.data() as GameSession;
        const duration = Math.round((endTime.getTime() - sessionData.startTime.getTime()) / 1000);
        
        await updateDoc(sessionRef, {
          endTime,
          totalScore,
          wordsPlayed,
          correctAnswers,
          wrongAnswers,
          duration,
          isCompleted: true
        });

        // Aktivite kaydet
        await this.logActivity({
          userId,
          activityType: 'game_complete',
          gameMode: sessionData.gameMode || '',
          score: totalScore,
          level: sessionData.level || '',
          unit: sessionData.unit || '',
          sessionId,
          details: {
            wordsPlayed,
            correctAnswers,
            wrongAnswers,
            duration
          }
        });

        // Kullanıcı istatistiklerini güncelle
        await this.updateUserStats(userId, totalScore, sessionData.gameMode || '', sessionData.level || '', sessionData.unit || '');
      }

    } catch (error) {
      console.error('Oyun tamamlama kaydedilirken hata:', error);
    }
  }

  // Kelime öğrenme kaydet
  public async logWordLearned(wordId: string, word: string, level: string, unit: string, isCorrect: boolean): Promise<void> {
    try {
      const userId = authService.getCurrentUserId();
      if (!userId) throw new Error('Kullanıcı oturum açmamış');

      // Aktivite kaydet
      await this.logActivity({
        userId,
        activityType: 'word_learned',
        wordId,
        word,
        level,
        unit,
        details: { isCorrect }
      });

      // Öğrenme ilerlemesini güncelle
      await this.updateLearningProgress(userId, wordId, word, level, unit, isCorrect);

    } catch (error) {
      console.error('Kelime öğrenme kaydedilirken hata:', error);
    }
  }

  // Sayfa ziyareti kaydet
  public async logPageVisit(page: string): Promise<void> {
    await this.logActivity({
      userId: authService.getCurrentUserId() || '',
      activityType: 'page_visit',
      page
    });
  }

  // Kullanıcı istatistiklerini güncelle
  private async updateUserStats(
    userId: string, 
    score: number, 
    gameMode: string, 
    level: string, 
    unit: string
  ): Promise<void> {
    try {
      const statsRef = doc(db, this.userStatsCollection, userId);
      const statsDoc = await getDoc(statsRef);
      
      let stats: UserStats;
      
      if (statsDoc.exists()) {
        stats = statsDoc.data() as UserStats;
        
        // Mevcut istatistikleri güncelle
        stats.totalGamesPlayed += 1;
        stats.totalScore += score;
        stats.averageScore = Math.round(stats.totalScore / stats.totalGamesPlayed);
        stats.bestScore = Math.max(stats.bestScore, score);
        stats.lastPlayed = new Date();
        
        // Level istatistiklerini güncelle
        if (!stats.levelProgress[level]) {
          stats.levelProgress[level] = {
            totalScore: 0,
            gamesPlayed: 0,
            wordsLearned: 0,
            averageScore: 0
          };
        }
        stats.levelProgress[level].totalScore += score;
        stats.levelProgress[level].gamesPlayed += 1;
        stats.levelProgress[level].averageScore = Math.round(stats.levelProgress[level].totalScore / stats.levelProgress[level].gamesPlayed);
        
        // Unit istatistiklerini güncelle
        if (!stats.unitProgress[unit]) {
          stats.unitProgress[unit] = {
            totalScore: 0,
            gamesPlayed: 0,
            wordsLearned: 0,
            averageScore: 0
          };
        }
        stats.unitProgress[unit].totalScore += score;
        stats.unitProgress[unit].gamesPlayed += 1;
        stats.unitProgress[unit].averageScore = Math.round(stats.unitProgress[unit].totalScore / stats.unitProgress[unit].gamesPlayed);
        
        // Oyun modu istatistiklerini güncelle
        if (!stats.gameModeStats[gameMode]) {
          stats.gameModeStats[gameMode] = {
            totalScore: 0,
            gamesPlayed: 0,
            averageScore: 0,
            bestScore: 0
          };
        }
        stats.gameModeStats[gameMode].totalScore += score;
        stats.gameModeStats[gameMode].gamesPlayed += 1;
        stats.gameModeStats[gameMode].averageScore = Math.round(stats.gameModeStats[gameMode].totalScore / stats.gameModeStats[gameMode].gamesPlayed);
        stats.gameModeStats[gameMode].bestScore = Math.max(stats.gameModeStats[gameMode].bestScore, score);
        
        // En favori oyun modunu güncelle
        let maxGames = 0;
        for (const [mode, modeStats] of Object.entries(stats.gameModeStats)) {
          if (modeStats.gamesPlayed > maxGames) {
            maxGames = modeStats.gamesPlayed;
            stats.favoriteGameMode = mode;
          }
        }
        
      } else {
        // Yeni kullanıcı istatistikleri oluştur
        stats = {
          userId,
          totalGamesPlayed: 1,
          totalScore: score,
          averageScore: score,
          bestScore: score,
          totalPlayTime: 0,
          favoriteGameMode: gameMode,
          totalWordsLearned: 0,
          currentStreak: 1,
          longestStreak: 1,
          lastPlayed: new Date(),
          levelProgress: {
            [level]: {
              totalScore: score,
              gamesPlayed: 1,
              wordsLearned: 0,
              averageScore: score
            }
          },
          unitProgress: {
            [unit]: {
              totalScore: score,
              gamesPlayed: 1,
              wordsLearned: 0,
              averageScore: score
            }
          },
          gameModeStats: {
            [gameMode]: {
              totalScore: score,
              gamesPlayed: 1,
              averageScore: score,
              bestScore: score
            }
          },
          updatedAt: new Date()
        };
      }
      
      stats.updatedAt = new Date();
      await setDoc(statsRef, stats);
      
    } catch (error) {
      console.error('Kullanıcı istatistikleri güncellenirken hata:', error);
    }
  }

  // Öğrenme ilerlemesini güncelle
  private async updateLearningProgress(
    userId: string, 
    wordId: string, 
    word: string, 
    level: string, 
    unit: string, 
    isCorrect: boolean
  ): Promise<void> {
    try {
      const progressRef = doc(db, this.learningProgressCollection, `${userId}_${wordId}`);
      const progressDoc = await getDoc(progressRef);
      
      let progress: UserLearningProgress;
      
      if (progressDoc.exists()) {
        progress = progressDoc.data() as UserLearningProgress;
        progress.timesSeen += 1;
        if (isCorrect) {
          progress.timesCorrect += 1;
        } else {
          progress.timesWrong += 1;
        }
        progress.lastSeen = new Date();
        progress.masteryLevel = Math.round((progress.timesCorrect / progress.timesSeen) * 100);
        progress.isMastered = progress.masteryLevel >= 80;
        progress.updatedAt = new Date();
      } else {
        progress = {
          userId,
          wordId,
          word,
          level,
          unit,
          timesSeen: 1,
          timesCorrect: isCorrect ? 1 : 0,
          timesWrong: isCorrect ? 0 : 1,
          lastSeen: new Date(),
          masteryLevel: isCorrect ? 100 : 0,
          isMastered: isCorrect,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      }
      
      await setDoc(progressRef, progress);
      
    } catch (error) {
      console.error('Öğrenme ilerlemesi güncellenirken hata:', error);
    }
  }

  // Kullanıcı istatistiklerini getir
  public async getUserStats(userId: string): Promise<UserStats | null> {
    try {
      const statsDoc = await getDoc(doc(db, this.userStatsCollection, userId));
      
      if (statsDoc.exists()) {
        const data = statsDoc.data();
        return {
          ...data,
          lastPlayed: data.lastPlayed?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        } as UserStats;
      }
      return null;
    } catch (error) {
      console.error('Kullanıcı istatistikleri getirilirken hata:', error);
      return null;
    }
  }

  // Kullanıcı aktivitelerini getir
  public async getUserActivities(userId: string, limitCount: number = 50): Promise<UserActivity[]> {
    try {
      const activitiesQuery = query(
        collection(db, this.activitiesCollection),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        firestoreLimit(limitCount)
      );
      
      const querySnapshot = await getDocs(activitiesQuery);
      const activities: UserActivity[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        activities.push({
          ...data,
          timestamp: data.timestamp?.toDate(),
          id: doc.id
        } as UserActivity);
      });
      
      return activities;
    } catch (error) {
      console.error('Kullanıcı aktiviteleri getirilirken hata:', error);
      return [];
    }
  }

  // Oyun oturumlarını getir
  public async getUserGameSessions(userId: string, limitCount: number = 20): Promise<GameSession[]> {
    try {
      const sessionsQuery = query(
        collection(db, this.gameSessionsCollection),
        where('userId', '==', userId),
        orderBy('startTime', 'desc'),
        firestoreLimit(limitCount)
      );
      
      const querySnapshot = await getDocs(sessionsQuery);
      const sessions: GameSession[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        sessions.push({
          ...data,
          startTime: data.startTime?.toDate(),
          endTime: data.endTime?.toDate(),
          id: doc.id
        } as GameSession);
      });
      
      return sessions;
    } catch (error) {
      console.error('Oyun oturumları getirilirken hata:', error);
      return [];
    }
  }

  // Öğrenme ilerlemesini getir
  public async getUserLearningProgress(userId: string, level?: string, unit?: string): Promise<UserLearningProgress[]> {
    try {
      let progressQuery = query(
        collection(db, this.learningProgressCollection),
        where('userId', '==', userId)
      );
      
      if (level) {
        progressQuery = query(progressQuery, where('level', '==', level));
      }
      if (unit) {
        progressQuery = query(progressQuery, where('unit', '==', unit));
      }
      
      const querySnapshot = await getDocs(progressQuery);
      const progress: UserLearningProgress[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        progress.push({
          ...data,
          lastSeen: data.lastSeen?.toDate(),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          id: doc.id
        } as unknown as UserLearningProgress);
      });
      
      return progress;
    } catch (error) {
      console.error('Öğrenme ilerlemesi getirilirken hata:', error);
      return [];
    }
  }

  // Session ID oluştur
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const userAnalyticsService = new UserAnalyticsService(); 