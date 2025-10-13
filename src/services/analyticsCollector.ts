import { supabase } from '../config/supabase';
import { supabaseAuthService } from './supabaseAuthService';
import { seasonService } from './seasonService';

// Analiz veri toplama servisi
class AnalyticsCollector {
  private isCollecting = false;
  private collectionInterval: NodeJS.Timeout | null = null;

  // Analiz toplamayı başlat
  async startCollection(): Promise<void> {
    if (this.isCollecting) return;

    this.isCollecting = true;
    console.log('📊 Analiz veri toplama başlatıldı');

    // Her 5 dakikada bir analiz verilerini topla
    this.collectionInterval = setInterval(async () => {
      await this.collectAnalytics();
    }, 5 * 60 * 1000); // 5 dakika

    // İlk toplama
    await this.collectAnalytics();
  }

  // Analiz toplamayı durdur
  stopCollection(): void {
    if (this.collectionInterval) {
      clearInterval(this.collectionInterval);
      this.collectionInterval = null;
    }
    this.isCollecting = false;
    console.log('📊 Analiz veri toplama durduruldu');
  }

  // Analiz verilerini topla
  private async collectAnalytics(): Promise<void> {
    try {
      const userId = supabaseAuthService.getCurrentUserId();
      if (!userId) return;

      const currentSeason = await seasonService.getCurrentSeason();
      if (!currentSeason) return;

      // Kullanıcı istatistiklerini hesapla ve önbelleğe al
      await this.cacheUserStats(userId, currentSeason.id);

      // Performans geçmişini güncelle
      await this.updatePerformanceHistory(userId, currentSeason.id);

      // Öğrenme kalıplarını analiz et
      await this.analyzeLearningPatterns(userId);

      // Başarımları kontrol et
      await this.checkAchievements(userId, currentSeason.id);

      console.log('✅ Analiz verileri toplandı');
    } catch (error) {
      console.error('❌ Analiz veri toplama hatası:', error);
    }
  }

  // Kullanıcı istatistiklerini önbelleğe al
  private async cacheUserStats(userId: string, seasonId: string): Promise<void> {
    try {
      // Mevcut sezon skorunu al
      const { data: seasonScore } = await supabase
        .from('season_scores')
        .select('*')
        .eq('user_id', userId)
        .eq('season_id', seasonId)
        .single();

      if (!seasonScore) return;

      // Oyun oturumlarını al
      const { data: gameSessions } = await supabase
        .from('game_scores')
        .select('*')
        .eq('user_id', userId)
        .eq('season_id', seasonId);

      if (!gameSessions) return;

      // İstatistikleri hesapla
      const stats = this.calculateUserStats(seasonScore, gameSessions);

      // Önbelleğe kaydet
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1); // 1 saat geçerli

      await supabase
        .from('user_analytics_cache')
        .upsert({
          user_id: userId,
          season_id: seasonId,
          cache_type: 'stats',
          data: stats,
          expires_at: expiresAt.toISOString()
        });

    } catch (error) {
      console.error('Kullanıcı istatistikleri önbellekleme hatası:', error);
    }
  }

  // Performans geçmişini güncelle
  private async updatePerformanceHistory(userId: string, seasonId: string): Promise<void> {
    try {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

      // Bugünkü oyun oturumlarını al
      const { data: todaySessions } = await supabase
        .from('game_scores')
        .select('*')
        .eq('user_id', userId)
        .eq('season_id', seasonId)
        .gte('timestamp', startOfDay.toISOString())
        .lt('timestamp', endOfDay.toISOString());

      if (!todaySessions || todaySessions.length === 0) return;

      // Günlük performansı hesapla
      const dailyStats = this.calculateDailyPerformance(todaySessions);

      // Performans geçmişine kaydet (tablo mevcut değilse hata vermez)
      try {
        await supabase
          .from('user_performance_history')
          .upsert({
            user_id: userId,
            season_id: seasonId,
            period_type: 'daily',
            period_start: startOfDay.toISOString().split('T')[0],
            period_end: startOfDay.toISOString().split('T')[0],
            ...dailyStats
          });
      } catch (error) {
        console.log('user_performance_history tablosu mevcut değil, atlanıyor:', error);
      }

    } catch (error) {
      console.error('Performans geçmişi güncelleme hatası:', error);
    }
  }

  // Öğrenme kalıplarını analiz et
  private async analyzeLearningPatterns(userId: string): Promise<void> {
    try {
      const currentSeason = await seasonService.getCurrentSeason();
      if (!currentSeason) return;

      // Son 30 günün oyun oturumlarını al
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: recentSessions } = await supabase
        .from('game_scores')
        .select('*')
        .eq('user_id', userId)
        .eq('season_id', currentSeason.id)
        .gte('timestamp', thirtyDaysAgo.toISOString())
        .order('timestamp', { ascending: true });

      if (!recentSessions || recentSessions.length < 5) return;

      // Zaman tercihlerini analiz et
      const timePreferences = this.analyzeTimePreferences(recentSessions);
      
      // Oyun modu tercihlerini analiz et
      const gameModePreferences = this.analyzeGameModePreferences(recentSessions);

      // Zorluk tercihlerini analiz et
      const difficultyPreferences = this.analyzeDifficultyPreferences(recentSessions);

      // Kalıpları kaydet
      await Promise.all([
        this.saveLearningPattern(userId, 'time_preference', timePreferences),
        this.saveLearningPattern(userId, 'game_mode_preference', gameModePreferences),
        this.saveLearningPattern(userId, 'difficulty_preference', difficultyPreferences)
      ]);

    } catch (error) {
      console.error('Öğrenme kalıpları analiz hatası:', error);
    }
  }

  // Başarımları kontrol et
  private async checkAchievements(userId: string, seasonId: string): Promise<void> {
    try {
      // Mevcut başarımları al
      const { data: existingAchievements } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId);

      const unlockedAchievements = existingAchievements?.filter(a => a.is_unlocked) || [];

      // Sezon skorunu al
      const { data: seasonScore } = await supabase
        .from('season_scores')
        .select('*')
        .eq('user_id', userId)
        .eq('season_id', seasonId)
        .single();

      if (!seasonScore) return;

      // Oyun sayısını al
      const { data: gameSessions } = await supabase
        .from('game_scores')
        .select('*')
        .eq('user_id', userId)
        .eq('season_id', seasonId);

      const gamesPlayed = gameSessions?.length || 0;

      // Başarım şablonlarını al
      const { data: achievementTemplates } = await supabase
        .from('achievement_templates')
        .select('*');

      if (!achievementTemplates) return;

      // Başarım kontrolleri
      const newAchievements = [];

      // Her şablon için kontrol et
      for (const template of achievementTemplates) {
        let shouldUnlock = false;

        // Skor başarımları
        if (template.category === 'score') {
          if (template.name === 'İlk 100 Puan' && seasonScore.total_score >= 100) {
            shouldUnlock = true;
          } else if (template.name === 'İlk 1000 Puan' && seasonScore.total_score >= 1000) {
            shouldUnlock = true;
          }
        }

        // Oyun sayısı başarımları
        if (template.category === 'learning') {
          if (template.name === 'İlk Oyun' && gamesPlayed >= 1) {
            shouldUnlock = true;
          } else if (template.name === '10 Oyun' && gamesPlayed >= 10) {
            shouldUnlock = true;
          } else if (template.name === '50 Oyun' && gamesPlayed >= 50) {
            shouldUnlock = true;
          } else if (template.name === '100 Oyun' && gamesPlayed >= 100) {
            shouldUnlock = true;
          }
        }

        // Eğer başarım kazanılmalıysa ve henüz kazanılmamışsa
        if (shouldUnlock && !this.hasAchievement(unlockedAchievements, template.name)) {
          newAchievements.push({
            user_id: userId,
            name: template.name,
            description: template.description,
            icon: template.icon,
            category: template.category,
            rarity: template.rarity,
            max_progress: template.max_progress,
            progress: template.max_progress,
            is_unlocked: true,
            unlocked_at: new Date().toISOString()
          });
        }
      }

      // Yeni başarımları kaydet
      if (newAchievements.length > 0) {
        await supabase
          .from('user_achievements')
          .insert(newAchievements);

        console.log(`🎉 ${newAchievements.length} yeni başarım kazanıldı!`);
      }

    } catch (error) {
      console.error('Başarım kontrol hatası:', error);
    }
  }

  // Yardımcı fonksiyonlar
  private calculateUserStats(seasonScore: any, gameSessions: any[]): any {
    const totalScore = seasonScore.total_score || 0;
    const totalGamesPlayed = seasonScore.games_played || 0;
    const averageScore = totalGamesPlayed > 0 ? totalScore / totalGamesPlayed : 0;

    // Oyun modu dağılımı
    const gameModeStats: Record<string, number> = {};
    gameSessions.forEach(session => {
      gameModeStats[session.game_mode] = (gameModeStats[session.game_mode] || 0) + 1;
    });

    // En sevilen oyun modu
    const favoriteGameMode = Object.entries(gameModeStats).reduce((a, b) => 
      gameModeStats[a[0]] > gameModeStats[b[0]] ? a : b, ['none', 0]
    )[0];

    // Doğruluk oranı (varsayılan hesaplama)
    const accuracyRate = gameSessions.length > 0 ? 
      gameSessions.reduce((sum, session) => sum + (session.accuracy || 85), 0) / gameSessions.length : 0;

    return {
      totalScore,
      totalGamesPlayed,
      averageScore,
      favoriteGameMode,
      accuracyRate,
      gameModeStats,
      lastUpdated: new Date().toISOString()
    };
  }

  private calculateDailyPerformance(sessions: any[]): any {
    const totalScore = sessions.reduce((sum, session) => sum + session.score, 0);
    const gamesPlayed = sessions.length;
    const averageScore = gamesPlayed > 0 ? totalScore / gamesPlayed : 0;
    const accuracy = sessions.reduce((sum, session) => sum + (session.accuracy || 85), 0) / gamesPlayed;
    const timeSpent = sessions.reduce((sum, session) => sum + (session.duration || 5), 0);
    const wordsLearned = sessions.reduce((sum, session) => sum + (session.words_learned || 0), 0);

    return {
      total_score: totalScore,
      games_played: gamesPlayed,
      average_score: averageScore,
      accuracy,
      time_spent: timeSpent,
      words_learned: wordsLearned
    };
  }

  private analyzeTimePreferences(sessions: any[]): any {
    const timeSlots = {
      morning: 0,
      afternoon: 0,
      evening: 0,
      night: 0
    };

    sessions.forEach(session => {
      const hour = new Date(session.timestamp).getHours();
      if (hour >= 6 && hour < 12) timeSlots.morning++;
      else if (hour >= 12 && hour < 18) timeSlots.afternoon++;
      else if (hour >= 18 && hour < 22) timeSlots.evening++;
      else timeSlots.night++;
    });

    const total = Object.values(timeSlots).reduce((sum, count) => sum + count, 0);
    const percentages = Object.fromEntries(
      Object.entries(timeSlots).map(([slot, count]) => [slot, total > 0 ? (count / total) * 100 : 0])
    );

    return {
      timeSlots,
      percentages,
      preferredTime: Object.entries(percentages).reduce((a, b) => percentages[a[0]] > percentages[b[0]] ? a : b)[0],
      confidence: Math.max(...Object.values(percentages)) / 100
    };
  }

  private analyzeGameModePreferences(sessions: any[]): any {
    const modeCounts: Record<string, number> = {};
    sessions.forEach(session => {
      modeCounts[session.game_mode] = (modeCounts[session.game_mode] || 0) + 1;
    });

    const total = Object.values(modeCounts).reduce((sum, count) => sum + count, 0);
    const percentages = Object.fromEntries(
      Object.entries(modeCounts).map(([mode, count]) => [mode, total > 0 ? (count / total) * 100 : 0])
    );

    return {
      modeCounts,
      percentages,
      preferredMode: Object.entries(percentages).reduce((a, b) => percentages[a[0]] > percentages[b[0]] ? a : b)[0],
      confidence: Math.max(...Object.values(percentages)) / 100
    };
  }

  private analyzeDifficultyPreferences(sessions: any[]): any {
    const difficultyCounts = {
      easy: 0,
      medium: 0,
      hard: 0
    };

    sessions.forEach(session => {
      const score = session.score;
      if (score < 50) difficultyCounts.easy++;
      else if (score < 100) difficultyCounts.medium++;
      else difficultyCounts.hard++;
    });

    const total = Object.values(difficultyCounts).reduce((sum, count) => sum + count, 0);
    const percentages = Object.fromEntries(
      Object.entries(difficultyCounts).map(([diff, count]) => [diff, total > 0 ? (count / total) * 100 : 0])
    );

    return {
      difficultyCounts,
      percentages,
      preferredDifficulty: Object.entries(percentages).reduce((a, b) => percentages[a[0]] > percentages[b[0]] ? a : b)[0],
      confidence: Math.max(...Object.values(percentages)) / 100
    };
  }

  private async saveLearningPattern(userId: string, patternType: string, patternData: any): Promise<void> {
    try {
      await supabase
        .from('user_learning_patterns')
        .upsert({
          user_id: userId,
          pattern_type: patternType,
          pattern_data: patternData,
          confidence: patternData.confidence || 0,
          last_updated: new Date().toISOString()
        });
    } catch (error) {
      console.error('Öğrenme kalıbı kaydetme hatası:', error);
    }
  }

  private hasAchievement(achievements: any[], name: string): boolean {
    return achievements.some(a => a.name === name);
  }

  // Aktivite kaydetme
  async logActivity(type: string, description: string, metadata: Record<string, any> = {}): Promise<void> {
    try {
      const userId = supabaseAuthService.getCurrentUserId();
      if (!userId) return;

      await supabase
        .from('user_activities')
        .insert({
          user_id: userId,
          type,
          description,
          metadata,
          timestamp: new Date().toISOString()
        });
    } catch (error) {
      console.error('Aktivite kaydetme hatası:', error);
    }
  }

  // Oyun başlatma aktivitesi
  async logGameStart(gameMode: string, level: string, unit: string): Promise<void> {
    await this.logActivity('game_started', `${gameMode} oyunu başlatıldı`, {
      gameMode,
      level,
      unit,
      timestamp: new Date().toISOString()
    });
  }

  // Oyun tamamlama aktivitesi
  async logGameComplete(gameMode: string, score: number, level: string, unit: string): Promise<void> {
    await this.logActivity('game_completed', `${gameMode} oyunu tamamlandı`, {
      gameMode,
      score,
      level,
      unit,
      timestamp: new Date().toISOString()
    });
  }

  // Seviye atlama aktivitesi
  async logLevelUp(oldLevel: string, newLevel: string): Promise<void> {
    await this.logActivity('level_up', `${oldLevel} seviyesinden ${newLevel} seviyesine çıktınız`, {
      oldLevel,
      newLevel,
      timestamp: new Date().toISOString()
    });
  }

  // Başarım kazanma aktivitesi
  async logAchievementUnlocked(achievementName: string, category: string): Promise<void> {
    await this.logActivity('achievement_unlocked', `${achievementName} başarımını kazandınız!`, {
      achievementName,
      category,
      timestamp: new Date().toISOString()
    });
  }
}

export const analyticsCollector = new AnalyticsCollector();
