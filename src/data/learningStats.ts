import { Word } from './words';

interface DailyStats {
  date: string;
  wordsLearned: number;
  totalWordsLearned: number;
}

interface LearningStats {
  dailyStats: DailyStats[];
  totalWordsLearned: number;
  lastUpdated: string;
}

class LearningStatsTracker {
  private static instance: LearningStatsTracker;
  private stats: LearningStats;
  private readonly STORAGE_KEY = 'learning_stats';

  private constructor() {
    const savedStats = localStorage.getItem(this.STORAGE_KEY);
    this.stats = savedStats
      ? JSON.parse(savedStats)
      : {
          dailyStats: [],
          totalWordsLearned: 0,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
  }

  public static getInstance(): LearningStatsTracker {
    if (!LearningStatsTracker.instance) {
      LearningStatsTracker.instance = new LearningStatsTracker();
    }
    return LearningStatsTracker.instance;
  }

  private saveStats(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.stats));
  }

  public recordWordLearned(word: Word): void {
    const today = new Date().toISOString().split('T')[0];
    let todayStats = this.stats.dailyStats.find(stat => stat.date === today);

    if (!todayStats) {
      todayStats = {
        date: today,
        wordsLearned: 0,
        totalWordsLearned: this.stats.totalWordsLearned
      };
      this.stats.dailyStats.push(todayStats);
    }

    todayStats.wordsLearned++;
    this.stats.totalWordsLearned++;
    todayStats.totalWordsLearned = this.stats.totalWordsLearned;
    this.stats.lastUpdated = today;

    this.saveStats();
  }

  public getTodayStats(): DailyStats {
    const today = new Date().toISOString().split('T')[0];
    const todayStats = this.stats.dailyStats.find(stat => stat.date === today);
    return todayStats || {
      date: today,
      wordsLearned: 0,
      totalWordsLearned: this.stats.totalWordsLearned
    };
  }

  public getWeeklyStats(): DailyStats[] {
    const today = new Date();
    const lastWeek = new Array(7).fill(null).map((_, index) => {
      const date = new Date(today);
      date.setDate(date.getDate() - index);
      return date.toISOString().split('T')[0];
    }).reverse();

    return lastWeek.map(date => {
      const stats = this.stats.dailyStats.find(stat => stat.date === date);
      return stats || {
        date,
        wordsLearned: 0,
        totalWordsLearned: this.getPreviousTotalWordsLearned(date)
      };
    });
  }

  private getPreviousTotalWordsLearned(date: string): number {
    const previousStats = this.stats.dailyStats
      .filter(stat => stat.date < date)
      .sort((a, b) => b.date.localeCompare(a.date))[0];
    return previousStats ? previousStats.totalWordsLearned : 0;
  }

  public getTotalWordsLearned(): number {
    return this.stats.totalWordsLearned;
  }

  public getStats(): { currentStreak: number; lastPlayedDate: string } {
    // Günlük seriyi hesapla
    const today = new Date().toISOString().split('T')[0];
    const sortedStats = [...this.stats.dailyStats].sort((a, b) => b.date.localeCompare(a.date));
    
    let currentStreak = 0;
    let lastDate = today;
    
    // Eğer bugün için kayıt varsa seriyi başlat
    if (sortedStats.length > 0 && sortedStats[0].date === today) {
      currentStreak = 1;
      
      // Önceki günleri kontrol et
      for (let i = 1; i < sortedStats.length; i++) {
        const prevDate = new Date(lastDate);
        prevDate.setDate(prevDate.getDate() - 1);
        const expectedPrevDate = prevDate.toISOString().split('T')[0];
        
        if (sortedStats[i].date === expectedPrevDate) {
          currentStreak++;
          lastDate = expectedPrevDate;
        } else {
          break;
        }
      }
    }
    
    // Son oynama tarihini bul
    const lastPlayedDate = sortedStats.length > 0 ? 
      sortedStats[0].date : 
      today;
    
    return {
      currentStreak,
      lastPlayedDate
    };
  }
}

export default LearningStatsTracker;
export const learningStatsTracker = LearningStatsTracker.getInstance();