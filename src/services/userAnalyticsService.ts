import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  onSnapshot, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  orderBy, 
  limit as firestoreLimit, 
  where,
  getDoc
} from 'firebase/firestore';
import { authService } from './authService';

interface UserActivity {
  id: string;
  userId: string;
  activityType: 'login' | 'logout' | 'game_start' | 'game_complete' | 'score_change';
  details: any;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface GameSession {
  id: string;
  userId: string;
  gameType: string;
  startTime: Date;
  endTime?: Date;
  score: number;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
}

interface UserLearningProgress {
  id: string;
  userId: string;
  wordId: string;
  word: string;
  difficulty: 'easy' | 'medium' | 'hard';
  masteryLevel: number;
  lastReviewed: Date;
  nextReview: Date;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ScoreChange {
  userId: string;
  userName: string;
  oldScore: number;
  newScore: number;
  change: number;
  timestamp: Date;
  reason?: string;
  isAnomaly: boolean;
}

interface UserScoreHistory {
  userId: string;
  userName: string;
  scores: {
    score: number;
    timestamp: Date;
  }[];
  lastCheck: Date;
}

class UserAnalyticsService {
  private readonly activitiesCollection = 'userActivities';
  private readonly sessionsCollection = 'gameSessions';
  private readonly userStatsCollection = 'userStats';
  private readonly learningProgressCollection = 'userLearningProgress';
  private scoreHistory: Map<string, UserScoreHistory> = new Map();
  private anomalyThreshold = 100; // 100 puan üzeri düşüş anomali sayılır
  private isMonitoring = false;
  private unsubscribe: (() => void) | null = null;

  // Kullanıcı aktivitesi kaydet
  async logActivity(userId: string, activityType: UserActivity['activityType'], details: any = {}) {
    try {
      const activityData: UserActivity = {
        id: this.generateId(),
        userId,
        activityType,
        details,
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, this.activitiesCollection, activityData.id), activityData);
    } catch (error) {
      console.error('Aktivite kaydedilirken hata:', error);
    }
  }

  // Oyun oturumu başlat
  async startGameSession(userId: string, gameType: string): Promise<string> {
    try {
      const sessionId = this.generateId();
      const sessionData: GameSession = {
        id: sessionId,
        userId,
        gameType,
        startTime: new Date(),
        score: 0,
        duration: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, this.sessionsCollection, sessionId), sessionData);
      return sessionId;
    } catch (error) {
      console.error('Oyun oturumu başlatılırken hata:', error);
      throw error;
    }
  }

  // Oyun oturumu bitir
  async endGameSession(sessionId: string, finalScore: number) {
    try {
      const sessionRef = doc(db, this.sessionsCollection, sessionId);
      const sessionDoc = await getDoc(sessionRef);
      
      if (sessionDoc.exists()) {
        const sessionData = sessionDoc.data() as GameSession;
        const endTime = new Date();
        const duration = endTime.getTime() - sessionData.startTime.getTime();

        await updateDoc(sessionRef, {
          endTime,
          score: finalScore,
          duration,
          updatedAt: new Date()
        });
      }
    } catch (error) {
      console.error('Oyun oturumu bitirilirken hata:', error);
    }
  }

  // Kullanıcı aktivitelerini getir
  async getUserActivities(userId: string, limitCount: number = 50): Promise<UserActivity[]> {
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
        activities.push(doc.data() as UserActivity);
      });
      
      return activities;
    } catch (error) {
      console.error('Kullanıcı aktiviteleri getirilirken hata:', error);
      return [];
    }
  }

  // Oyun oturumlarını getir
  async getGameSessions(userId: string, limitCount: number = 20): Promise<GameSession[]> {
    try {
      const sessionsQuery = query(
        collection(db, this.sessionsCollection),
        where('userId', '==', userId),
        orderBy('startTime', 'desc'),
        firestoreLimit(limitCount)
      );
      
      const querySnapshot = await getDocs(sessionsQuery);
      const sessions: GameSession[] = [];
      
      querySnapshot.forEach((doc) => {
        sessions.push(doc.data() as GameSession);
      });
      
      return sessions;
    } catch (error) {
      console.error('Oyun oturumları getirilirken hata:', error);
      return [];
    }
  }

  // Öğrenme ilerlemesini kaydet
  async saveLearningProgress(progress: Omit<UserLearningProgress, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const progressData: UserLearningProgress = {
        ...progress,
        id: this.generateId(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, this.learningProgressCollection, progressData.id), progressData);
    } catch (error) {
      console.error('Öğrenme ilerlemesi kaydedilirken hata:', error);
    }
  }

  // Öğrenme ilerlemesini getir
  async getLearningProgress(userId: string, limitCount: number = 100): Promise<UserLearningProgress[]> {
    try {
      const progressQuery = query(
        collection(db, this.learningProgressCollection),
        where('userId', '==', userId),
        orderBy('lastReviewed', 'desc'),
        firestoreLimit(limitCount)
      );
      
      const querySnapshot = await getDocs(progressQuery);
      const progress: UserLearningProgress[] = [];
      
      querySnapshot.forEach((doc) => {
        progress.push(doc.data() as UserLearningProgress);
      });
      
      return progress;
    } catch (error) {
      console.error('Öğrenme ilerlemesi getirilirken hata:', error);
      return [];
    }
  }

  // Benzersiz ID oluştur
  private generateId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Monitoring'i başlat
  startMonitoring() {
    if (this.isMonitoring) return;
    
    console.log('🔍 User Analytics Monitoring başlatılıyor...');
    this.isMonitoring = true;
    
    // Tüm kullanıcıları dinle
    const usersRef = collection(db, 'userProfiles');
    const q = query(usersRef, orderBy('totalScore', 'desc'));
    
    this.unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'modified') {
          this.handleScoreChange(change.doc);
        }
      });
    }, (error) => {
      console.error('❌ User Analytics Monitoring hatası:', error);
    });
  }

  // Monitoring'i durdur
  stopMonitoring() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.isMonitoring = false;
    console.log('🛑 User Analytics Monitoring durduruldu');
  }

  // Puan değişikliğini işle
  private async handleScoreChange(docSnapshot: any) {
    const userData = docSnapshot.data();
    const userId = docSnapshot.id;
    const newScore = userData.totalScore || 0;
    const userName = userData.displayName || 'Bilinmeyen Kullanıcı';

    // Kullanıcının geçmiş puanını al
    const history = this.scoreHistory.get(userId);
    const oldScore = history?.scores[history.scores.length - 1]?.score || 0;

    // Puan değişikliğini hesapla
    const change = newScore - oldScore;

    // Eğer puan düştüyse ve anomali eşiğini geçtiyse
    if (change < -this.anomalyThreshold) {
      const scoreChange: ScoreChange = {
        userId,
        userName,
        oldScore,
        newScore,
        change,
        timestamp: new Date(),
        reason: 'Ani puan düşüşü',
        isAnomaly: true
      };

      console.warn('🚨 ANOMALİ ALGILANDI:', scoreChange);
      
      // Anomaliyi kaydet
      await this.saveAnomaly(scoreChange);
      
      // Admin'e bildir
      await this.notifyAdmin(scoreChange);
      
      // Son puanı yedekle
      await this.backupLastScore(userId, userName, oldScore);
    }

    // Puan geçmişini güncelle
    this.updateScoreHistory(userId, userName, newScore);
  }

  // Anomaliyi kaydet
  private async saveAnomaly(scoreChange: ScoreChange) {
    try {
      const anomaliesRef = collection(db, 'scoreAnomalies');
      await setDoc(doc(anomaliesRef), {
        ...scoreChange,
        timestamp: scoreChange.timestamp.toISOString()
      });
      console.log('✅ Anomali kaydedildi:', scoreChange.userName);
    } catch (error) {
      console.error('❌ Anomali kaydedilirken hata:', error);
    }
  }

  // Admin'e bildir
  private async notifyAdmin(scoreChange: ScoreChange) {
    try {
      const notificationsRef = collection(db, 'adminNotifications');
      await setDoc(doc(notificationsRef), {
        type: 'score_anomaly',
        title: '🚨 Puan Anomalisi Algılandı',
        message: `${scoreChange.userName} kullanıcısının puanı ${scoreChange.oldScore}'den ${scoreChange.newScore}'e düştü (${scoreChange.change} puan kayıp)`,
        data: scoreChange,
        timestamp: new Date().toISOString(),
        isRead: false
      });
      console.log('📢 Admin bildirimi gönderildi');
    } catch (error) {
      console.error('❌ Admin bildirimi gönderilirken hata:', error);
    }
  }

  // Son puanı yedekle
  private async backupLastScore(userId: string, userName: string, score: number) {
    try {
      const backupsRef = collection(db, 'scoreBackups');
      await setDoc(doc(backupsRef), {
        userId,
        userName,
        score,
        timestamp: new Date().toISOString(),
        reason: 'Anomali algılandı - otomatik yedekleme'
      });
      console.log('💾 Son puan yedeklendi:', userName, score);
    } catch (error) {
      console.error('❌ Puan yedeklenirken hata:', error);
    }
  }

  // Puan geçmişini güncelle
  private updateScoreHistory(userId: string, userName: string, score: number) {
    const history = this.scoreHistory.get(userId) || {
      userId,
      userName,
      scores: [],
      lastCheck: new Date()
    };

    history.scores.push({
      score,
      timestamp: new Date()
    });

    // Son 10 puanı tut
    if (history.scores.length > 10) {
      history.scores = history.scores.slice(-10);
    }

    history.lastCheck = new Date();
    this.scoreHistory.set(userId, history);
  }

  // Anomalileri getir
  async getAnomalies(limitCount: number = 50) {
    try {
      const anomaliesRef = collection(db, 'scoreAnomalies');
      const q = query(anomaliesRef, orderBy('timestamp', 'desc'), firestoreLimit(limitCount));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('❌ Anomaliler getirilirken hata:', error);
      return [];
    }
  }

  // Admin bildirimlerini getir
  async getAdminNotifications(limitCount: number = 20) {
    try {
      const notificationsRef = collection(db, 'adminNotifications');
      const q = query(notificationsRef, orderBy('timestamp', 'desc'), firestoreLimit(limitCount));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('❌ Admin bildirimleri getirilirken hata:', error);
      return [];
    }
  }

  // Puanı geri yükle
  async restoreScore(userId: string, score: number) {
    try {
      const userRef = doc(db, 'userProfiles', userId);
      await updateDoc(userRef, {
        totalScore: score
      });
      console.log('✅ Puan geri yüklendi:', userId, score);
      return true;
    } catch (error) {
      console.error('❌ Puan geri yüklenirken hata:', error);
      return false;
    }
  }

  // Monitoring durumunu kontrol et
  isMonitoringActive() {
    return this.isMonitoring;
  }

  // Anomali eşiğini ayarla
  setAnomalyThreshold(threshold: number) {
    this.anomalyThreshold = threshold;
    console.log('📊 Anomali eşiği güncellendi:', threshold);
  }
}

export const userAnalyticsService = new UserAnalyticsService(); 