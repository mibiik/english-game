import { supabase } from '../config/supabase';
import { supabaseAuthService } from './supabaseAuthService';
import { seasonService } from './seasonService';

// Analiz veri tipleri
export interface UserStats {
  totalScore: number;
  totalGamesPlayed: number;
  averageScore: number;
  totalPlayTime: number; // dakika
  currentStreak: number; // gün
  longestStreak: number; // gün
  level: string;
  rank: number;
  lastPlayed: string;
  favoriteGameMode: string;
  improvementRate: number; // yüzde
  consistencyScore: number; // 0-100
  learningVelocity: number; // puan/gün
  accuracyRate: number; // yüzde
  totalWordsLearned: number;
  totalUnitsCompleted: number;
  weeklyProgress: number; // yüzde
  monthlyProgress: number; // yüzde
}

export interface GameSession {
  id: string;
  gameMode: string;
  score: number;
  duration: number; // dakika
  accuracy: number; // yüzde
  wordsLearned: number;
  level: string;
  unit: string;
  timestamp: string;
  isCompleted: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  dayOfWeek: string;
}

export interface UserActivity {
  id: string;
  type: 'game_started' | 'game_completed' | 'level_up' | 'achievement_unlocked' | 'login' | 'logout';
  description: string;
  timestamp: string;
  metadata: Record<string, any>;
  gameMode?: string;
  score?: number;
  level?: string;
}

export interface LearningProgress {
  id: string;
  unit: string;
  level: string;
  wordsLearned: number;
  totalWords: number;
  progressPercentage: number;
  lastStudied: string;
  masteryLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  timeSpent: number; // dakika
  accuracy: number; // yüzde
  gamesPlayed: number;
  averageScore: number;
}

export interface PerformanceMetrics {
  dailyScores: Array<{ date: string; score: number }>;
  weeklyScores: Array<{ week: string; score: number }>;
  monthlyScores: Array<{ month: string; score: number }>;
  gameModePerformance: Array<{ gameMode: string; averageScore: number; gamesPlayed: number; accuracy: number }>;
  timeBasedPerformance: Array<{ timeSlot: string; averageScore: number; gamesPlayed: number }>;
  difficultyProgression: Array<{ level: string; averageScore: number; gamesPlayed: number; accuracy: number }>;
  unitProgress: Array<{ unit: string; progress: number; wordsLearned: number; timeSpent: number }>;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: 'score' | 'streak' | 'learning' | 'social' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
}

export interface UserInsights {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  goals: Array<{ id: string; title: string; progress: number; target: number; deadline: string }>;
  patterns: Array<{ type: string; description: string; frequency: number }>;
  predictions: Array<{ metric: string; predictedValue: number; confidence: number; timeframe: string }>;
}

class UserAnalyticsService {
  private unsubscribe: any = null;

  // Kullanıcı istatistiklerini getir
  async getUserStats(userId: string): Promise<UserStats> {
    try {
      const currentSeason = await seasonService.getCurrentSeason();
      if (!currentSeason) {
        throw new Error('Aktif sezon bulunamadı');
      }

      // Temel istatistikleri al
      const { data: seasonScore, error: seasonError } = await supabase
        .from('season_scores')
        .select('*')
        .eq('user_id', userId)
        .eq('season_id', currentSeason.id)
        .single();

      if (seasonError && seasonError.code !== 'PGRST116') {
        throw seasonError;
      }

      // Oyun oturumlarını al
      const { data: gameSessions, error: sessionsError } = await supabase
        .from('game_scores')
        .select('*')
        .eq('user_id', userId)
        .eq('season_id', currentSeason.id)
        .order('timestamp', { ascending: false });

      if (sessionsError) {
        throw sessionsError;
      }

      // Kullanıcı profilini al
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        throw profileError;
      }

      // İstatistikleri hesapla
      const totalScore = seasonScore?.total_score || 0;
      const totalGamesPlayed = seasonScore?.games_played || 0;
      const averageScore = totalGamesPlayed > 0 ? totalScore / totalGamesPlayed : 0;
      
      // Streak hesaplama
      const { currentStreak, longestStreak } = await this.calculateStreaks(userId);
      
      // En sevilen oyun modu
      const favoriteGameMode = this.calculateFavoriteGameMode(gameSessions || []);
      
      // Gelişim oranı
      const improvementRate = await this.calculateImprovementRate(userId, gameSessions || []);
      
      // Tutarlılık skoru
      const consistencyScore = this.calculateConsistencyScore(gameSessions || []);
      
      // Öğrenme hızı
      const learningVelocity = this.calculateLearningVelocity(gameSessions || []);
      
      // Doğruluk oranı
      const accuracyRate = this.calculateAccuracyRate(gameSessions || []);
      
      // Öğrenilen kelime sayısı
      const totalWordsLearned = this.calculateWordsLearned(gameSessions || []);
      
      // Tamamlanan ünite sayısı
      const totalUnitsCompleted = this.calculateUnitsCompleted(gameSessions || []);
      
      // Haftalık ve aylık ilerleme
      const { weeklyProgress, monthlyProgress } = await this.calculateProgress(userId, gameSessions || []);

      return {
        totalScore,
        totalGamesPlayed,
        averageScore,
        totalPlayTime: this.calculateTotalPlayTime(gameSessions || []),
        currentStreak,
        longestStreak,
        level: userProfile?.level || 'intermediate',
        rank: await this.calculateRank(userId),
        lastPlayed: seasonScore?.last_played || new Date().toISOString(),
        favoriteGameMode,
        improvementRate,
        consistencyScore,
        learningVelocity,
        accuracyRate,
        totalWordsLearned,
        totalUnitsCompleted,
        weeklyProgress,
        monthlyProgress
      };
    } catch (error) {
      console.error('Kullanıcı istatistikleri getirme hatası:', error);
      return this.getDefaultStats();
    }
  }

  // Oyun oturumlarını getir
  async getGameSessions(userId: string, limit: number = 50): Promise<GameSession[]> {
    try {
      const currentSeason = await seasonService.getCurrentSeason();
      if (!currentSeason) {
        return [];
      }

      const { data, error } = await supabase
        .from('game_scores')
        .select('*')
        .eq('user_id', userId)
        .eq('season_id', currentSeason.id)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return (data || []).map(session => ({
        id: session.id,
        gameMode: session.game_mode,
        score: session.score,
        duration: this.calculateSessionDuration(session),
        accuracy: this.calculateSessionAccuracy(session),
        wordsLearned: this.calculateWordsLearnedInSession(session),
        level: session.level || 'intermediate',
        unit: session.unit || 'all',
        timestamp: session.timestamp,
        isCompleted: true,
        difficulty: this.determineDifficulty(session),
        timeOfDay: this.getTimeOfDay(session.timestamp),
        dayOfWeek: this.getDayOfWeek(session.timestamp)
      }));
    } catch (error) {
      console.error('Oyun oturumları getirme hatası:', error);
      return [];
    }
  }

  // Kullanıcı aktivitelerini getir
  async getUserActivities(userId: string, limit: number = 100): Promise<UserActivity[]> {
    try {
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return (data || []).map(activity => ({
        id: activity.id,
        type: activity.type,
        description: activity.description,
        timestamp: activity.timestamp,
        metadata: activity.metadata || {},
        gameMode: activity.game_mode,
        score: activity.score,
        level: activity.level
      }));
    } catch (error) {
      console.error('Kullanıcı aktiviteleri getirme hatası:', error);
      return [];
    }
  }

  // Öğrenme ilerlemesini getir
  async getLearningProgress(userId: string): Promise<LearningProgress[]> {
    try {
      const currentSeason = await seasonService.getCurrentSeason();
      if (!currentSeason) {
        console.warn('Aktif sezon bulunamadı, öğrenme ilerlemesi getirilemiyor');
        return [];
      }

      // Önce learning_progress tablosunun var olup olmadığını kontrol et
      const { data, error } = await supabase
        .from('learning_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('season_id', currentSeason.id)
        .order('last_studied', { ascending: false })
        .limit(10); // Limit ekle

      if (error) {
        console.error('Öğrenme ilerlemesi sorgu hatası:', error);
        // Tablo yoksa veya hata varsa boş array döndür
        return [];
      }

      if (!data || data.length === 0) {
        console.log('Kullanıcı için öğrenme ilerlemesi bulunamadı');
        return [];
      }

      return data.map(progress => ({
        id: progress.id,
        unit: progress.unit || '',
        level: progress.level || '',
        wordsLearned: progress.words_learned || 0,
        totalWords: progress.total_words || 0,
        progressPercentage: progress.progress_percentage || 0,
        lastStudied: progress.last_studied || new Date().toISOString(),
        masteryLevel: progress.mastery_level || 'beginner',
        timeSpent: progress.time_spent || 0,
        accuracy: progress.accuracy || 0,
        gamesPlayed: progress.games_played || 0,
        averageScore: progress.average_score || 0
      }));
    } catch (error) {
      console.error('Öğrenme ilerlemesi getirme hatası:', error);
      return [];
    }
  }

  // Performans metriklerini getir
  async getPerformanceMetrics(userId: string): Promise<PerformanceMetrics> {
    try {
      const currentSeason = await seasonService.getCurrentSeason();
      if (!currentSeason) {
        return this.getDefaultPerformanceMetrics();
      }

      const { data: gameSessions, error } = await supabase
        .from('game_scores')
        .select('*')
        .eq('user_id', userId)
        .eq('season_id', currentSeason.id)
        .order('timestamp', { ascending: true });

      if (error) {
        throw error;
      }

      const sessions = gameSessions || [];

      return {
        dailyScores: this.calculateDailyScores(sessions),
        weeklyScores: this.calculateWeeklyScores(sessions),
        monthlyScores: this.calculateMonthlyScores(sessions),
        gameModePerformance: this.calculateGameModePerformance(sessions),
        timeBasedPerformance: this.calculateTimeBasedPerformance(sessions),
        difficultyProgression: this.calculateDifficultyProgression(sessions),
        unitProgress: this.calculateUnitProgress(sessions)
      };
    } catch (error) {
      console.error('Performans metrikleri getirme hatası:', error);
      return this.getDefaultPerformanceMetrics();
    }
  }

  // Başarımları getir
  async getAchievements(userId: string): Promise<Achievement[]> {
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId)
        .order('unlocked_at', { ascending: false });

      if (error) {
        throw error;
      }

      return (data || []).map(achievement => ({
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        unlockedAt: achievement.unlocked_at,
        category: achievement.category,
        rarity: achievement.rarity,
        progress: achievement.progress,
        maxProgress: achievement.max_progress,
        isUnlocked: achievement.is_unlocked
      }));
    } catch (error) {
      console.error('Başarımlar getirme hatası:', error);
      return [];
    }
  }

  // Kullanıcı içgörülerini getir
  async getUserInsights(userId: string): Promise<UserInsights> {
    try {
      const [stats, gameSessions, learningProgress] = await Promise.all([
        this.getUserStats(userId),
        this.getGameSessions(userId, 100),
        this.getLearningProgress(userId)
      ]);

      return {
        strengths: this.identifyStrengths(stats, gameSessions),
        weaknesses: this.identifyWeaknesses(stats, gameSessions),
        recommendations: this.generateRecommendations(stats, gameSessions, learningProgress),
        goals: await this.getUserGoals(userId),
        patterns: this.identifyPatterns(gameSessions),
        predictions: this.generatePredictions(stats, gameSessions)
      };
    } catch (error) {
      console.error('Kullanıcı içgörüleri getirme hatası:', error);
      return this.getDefaultInsights();
    }
  }

  // Aktivite kaydet
  async logActivity(userId: string, type: string, description: string, metadata: Record<string, any> = {}): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_activities')
        .insert({
          user_id: userId,
          type,
          description,
          metadata,
          timestamp: new Date().toISOString()
        });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Aktivite kaydetme hatası:', error);
    }
  }

  // Real-time monitoring başlat
  async startMonitoring(userId: string, onUpdate: (data: any) => void): Promise<void> {
    try {
      const channel = supabase
        .channel('user_analytics')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'game_scores',
            filter: `user_id=eq.${userId}`
          },
          (payload) => {
            console.log('📊 Game score değişikliği:', payload);
            onUpdate(payload);
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'season_scores',
            filter: `user_id=eq.${userId}`
          },
          (payload) => {
            console.log('📈 Season score değişikliği:', payload);
            onUpdate(payload);
          }
        )
        .subscribe((status) => {
          console.log('📡 Analytics monitoring durumu:', status);
        });

      this.unsubscribe = channel;
    } catch (error) {
      console.error('Monitoring başlatma hatası:', error);
    }
  }

  // Monitoring durdur
  stopMonitoring(): void {
    if (this.unsubscribe) {
      supabase.removeChannel(this.unsubscribe);
      this.unsubscribe = null;
    }
  }

  // Yardımcı fonksiyonlar
  private async calculateStreaks(userId: string): Promise<{ currentStreak: number; longestStreak: number }> {
    // Streak hesaplama mantığı
    return { currentStreak: 0, longestStreak: 0 };
  }

  private calculateFavoriteGameMode(sessions: any[]): string {
    if (sessions.length === 0) return 'none';
    
    const modeCounts: Record<string, number> = {};
    sessions.forEach(session => {
      modeCounts[session.game_mode] = (modeCounts[session.game_mode] || 0) + 1;
    });
    
    return Object.entries(modeCounts).reduce((a, b) => modeCounts[a[0]] > modeCounts[b[0]] ? a : b)[0];
  }

  private async calculateImprovementRate(userId: string, sessions: any[]): Promise<number> {
    if (sessions.length < 2) return 0;
    
    const sortedSessions = sessions.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const firstHalf = sortedSessions.slice(0, Math.floor(sessions.length / 2));
    const secondHalf = sortedSessions.slice(Math.floor(sessions.length / 2));
    
    const firstHalfAvg = firstHalf.reduce((sum, s) => sum + s.score, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, s) => sum + s.score, 0) / secondHalf.length;
    
    return firstHalfAvg > 0 ? ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100 : 0;
  }

  private calculateConsistencyScore(sessions: any[]): number {
    if (sessions.length < 2) return 0;
    
    const scores = sessions.map(s => s.score);
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Düşük standart sapma = yüksek tutarlılık
    return Math.max(0, 100 - (standardDeviation / mean) * 100);
  }

  private calculateLearningVelocity(sessions: any[]): number {
    if (sessions.length === 0) return 0;
    
    const sortedSessions = sessions.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const firstSession = sortedSessions[0];
    const lastSession = sortedSessions[sortedSessions.length - 1];
    
    const timeDiff = (new Date(lastSession.timestamp).getTime() - new Date(firstSession.timestamp).getTime()) / (1000 * 60 * 60 * 24); // gün
    const scoreDiff = lastSession.score - firstSession.score;
    
    return timeDiff > 0 ? scoreDiff / timeDiff : 0;
  }

  private calculateAccuracyRate(sessions: any[]): number {
    if (sessions.length === 0) return 0;
    
    const totalAccuracy = sessions.reduce((sum, session) => sum + (session.accuracy || 0), 0);
    return totalAccuracy / sessions.length;
  }

  private calculateWordsLearned(sessions: any[]): number {
    return sessions.reduce((sum, session) => sum + (session.words_learned || 0), 0);
  }

  private calculateUnitsCompleted(sessions: any[]): number {
    const uniqueUnits = new Set(sessions.map(s => s.unit).filter(Boolean));
    return uniqueUnits.size;
  }

  private async calculateProgress(userId: string, sessions: any[]): Promise<{ weeklyProgress: number; monthlyProgress: number }> {
    // Haftalık ve aylık ilerleme hesaplama
    return { weeklyProgress: 0, monthlyProgress: 0 };
  }

  private calculateTotalPlayTime(sessions: any[]): number {
    return sessions.reduce((sum, session) => sum + (session.duration || 0), 0);
  }

  private async calculateRank(userId: string): Promise<number> {
    // Sıralama hesaplama
    return 1;
  }

  private calculateSessionDuration(session: any): number {
    // Oturum süresi hesaplama
    return 5; // varsayılan 5 dakika
  }

  private calculateSessionAccuracy(session: any): number {
    // Oturum doğruluğu hesaplama
    return 85; // varsayılan %85
  }

  private calculateWordsLearnedInSession(session: any): number {
    // Oturumda öğrenilen kelime sayısı
    return Math.floor(session.score / 10); // her 10 puan = 1 kelime
  }

  private determineDifficulty(session: any): 'easy' | 'medium' | 'hard' {
    if (session.score < 50) return 'easy';
    if (session.score < 100) return 'medium';
    return 'hard';
  }

  private getTimeOfDay(timestamp: string): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date(timestamp).getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  }

  private getDayOfWeek(timestamp: string): string {
    return new Date(timestamp).toLocaleDateString('tr-TR', { weekday: 'long' });
  }

  private calculateDailyScores(sessions: any[]): Array<{ date: string; score: number }> {
    const dailyScores: Record<string, number> = {};
    
    sessions.forEach(session => {
      const date = new Date(session.timestamp).toISOString().split('T')[0];
      dailyScores[date] = (dailyScores[date] || 0) + session.score;
    });
    
    return Object.entries(dailyScores).map(([date, score]) => ({ date, score }));
  }

  private calculateWeeklyScores(sessions: any[]): Array<{ week: string; score: number }> {
    // Haftalık skor hesaplama
    return [];
  }

  private calculateMonthlyScores(sessions: any[]): Array<{ month: string; score: number }> {
    // Aylık skor hesaplama
    return [];
  }

  private calculateGameModePerformance(sessions: any[]): Array<{ gameMode: string; averageScore: number; gamesPlayed: number; accuracy: number }> {
    const modeStats: Record<string, { totalScore: number; count: number; totalAccuracy: number }> = {};
    
    sessions.forEach(session => {
      const mode = session.game_mode;
      if (!modeStats[mode]) {
        modeStats[mode] = { totalScore: 0, count: 0, totalAccuracy: 0 };
      }
      modeStats[mode].totalScore += session.score;
      modeStats[mode].count += 1;
      modeStats[mode].totalAccuracy += session.accuracy || 0;
    });
    
    return Object.entries(modeStats).map(([gameMode, stats]) => ({
      gameMode,
      averageScore: stats.totalScore / stats.count,
      gamesPlayed: stats.count,
      accuracy: stats.totalAccuracy / stats.count
    }));
  }

  private calculateTimeBasedPerformance(sessions: any[]): Array<{ timeSlot: string; averageScore: number; gamesPlayed: number }> {
    // Zaman bazlı performans hesaplama
    return [];
  }

  private calculateDifficultyProgression(sessions: any[]): Array<{ level: string; averageScore: number; gamesPlayed: number; accuracy: number }> {
    // Zorluk ilerlemesi hesaplama
    return [];
  }

  private calculateUnitProgress(sessions: any[]): Array<{ unit: string; progress: number; wordsLearned: number; timeSpent: number }> {
    // Ünite ilerlemesi hesaplama
    return [];
  }

  private identifyStrengths(stats: UserStats, sessions: any[]): string[] {
    const strengths: string[] = [];
    
    if (stats.accuracyRate > 80) strengths.push('Yüksek doğruluk oranı');
    if (stats.consistencyScore > 70) strengths.push('Tutarlı performans');
    if (stats.currentStreak > 7) strengths.push('Güçlü öğrenme alışkanlığı');
    if (stats.improvementRate > 10) strengths.push('Hızlı gelişim');
    
    return strengths;
  }

  private identifyWeaknesses(stats: UserStats, sessions: any[]): string[] {
    const weaknesses: string[] = [];
    
    if (stats.accuracyRate < 60) weaknesses.push('Düşük doğruluk oranı');
    if (stats.consistencyScore < 50) weaknesses.push('Tutarsız performans');
    if (stats.currentStreak < 3) weaknesses.push('Düzensiz çalışma');
    if (stats.improvementRate < 0) weaknesses.push('Performans düşüşü');
    
    return weaknesses;
  }

  private generateRecommendations(stats: UserStats, sessions: any[], learningProgress: LearningProgress[]): string[] {
    const recommendations: string[] = [];
    
    if (stats.accuracyRate < 70) {
      recommendations.push('Daha dikkatli oynayarak doğruluk oranınızı artırın');
    }
    if (stats.consistencyScore < 60) {
      recommendations.push('Düzenli çalışma rutini oluşturun');
    }
    if (stats.currentStreak < 5) {
      recommendations.push('Her gün en az 10 dakika çalışın');
    }
    
    return recommendations;
  }

  private async getUserGoals(userId: string): Promise<Array<{ id: string; title: string; progress: number; target: number; deadline: string }>> {
    // Kullanıcı hedeflerini getir
    return [];
  }

  private identifyPatterns(sessions: any[]): Array<{ type: string; description: string; frequency: number }> {
    // Öğrenme kalıplarını tespit et
    return [];
  }

  private generatePredictions(stats: UserStats, sessions: any[]): Array<{ metric: string; predictedValue: number; confidence: number; timeframe: string }> {
    // Gelecek tahminleri oluştur
    return [];
  }

  private getDefaultStats(): UserStats {
    return {
      totalScore: 0,
      totalGamesPlayed: 0,
      averageScore: 0,
      totalPlayTime: 0,
      currentStreak: 0,
      longestStreak: 0,
      level: 'intermediate',
      rank: 1,
      lastPlayed: new Date().toISOString(),
      favoriteGameMode: 'none',
      improvementRate: 0,
      consistencyScore: 0,
      learningVelocity: 0,
      accuracyRate: 0,
      totalWordsLearned: 0,
      totalUnitsCompleted: 0,
      weeklyProgress: 0,
      monthlyProgress: 0
    };
  }

  private getDefaultPerformanceMetrics(): PerformanceMetrics {
    return {
      dailyScores: [],
      weeklyScores: [],
      monthlyScores: [],
      gameModePerformance: [],
      timeBasedPerformance: [],
      difficultyProgression: [],
      unitProgress: []
    };
  }

  private getDefaultInsights(): UserInsights {
    return {
      strengths: [],
      weaknesses: [],
      recommendations: [],
      goals: [],
      patterns: [],
      predictions: []
    };
  }
}

export const userAnalyticsService = new UserAnalyticsService();