import { Word } from './words';
import { difficultWordsManager } from './difficultWords';
import { wordTracker } from './wordTracker';
import { learningStatsTracker } from './learningStats';

interface WordStats {
  correctAttempts: number;
  incorrectAttempts: number;
  lastAttemptDate: string;
  isLearned: boolean;
  isDifficult: boolean;
}

class WordStatsManager {
  private static instance: WordStatsManager;
  private wordStats: Map<string, WordStats>;
  private readonly STORAGE_KEY = 'word_stats';

  private constructor() {
    this.wordStats = new Map();
    this.loadFromLocalStorage();
  }

  public static getInstance(): WordStatsManager {
    if (!WordStatsManager.instance) {
      WordStatsManager.instance = new WordStatsManager();
    }
    return WordStatsManager.instance;
  }

  private loadFromLocalStorage(): void {
    try {
      const savedStats = localStorage.getItem(this.STORAGE_KEY);
      if (savedStats) {
        const parsedStats = JSON.parse(savedStats);
        this.wordStats = new Map(Object.entries(parsedStats));
      }
    } catch (error) {
      console.error('Kelime istatistikleri yüklenirken hata:', error);
    }
  }

  private saveToLocalStorage(): void {
    try {
      const statsObject = Object.fromEntries(this.wordStats);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(statsObject));
    } catch (error) {
      console.error('Kelime istatistikleri kaydedilirken hata:', error);
    }
  }

  public recordAttempt(word: Word, isCorrect: boolean): void {
    const stats = this.wordStats.get(word.english) || {
      correctAttempts: 0,
      incorrectAttempts: 0,
      lastAttemptDate: new Date().toISOString(),
      isLearned: false,
      isDifficult: false
    };

    if (isCorrect) {
      stats.correctAttempts++;
    } else {
      stats.incorrectAttempts++;
    }

    stats.lastAttemptDate = new Date().toISOString();

    // Zorlu kelime durumunu güncelle
    difficultWordsManager.trackWordAttempt(word, isCorrect);
    stats.isDifficult = difficultWordsManager.isDifficult(word);

    // Öğrenilme durumunu kontrol et
    if (!stats.isLearned && stats.correctAttempts >= 3 && 
        (stats.correctAttempts / (stats.correctAttempts + stats.incorrectAttempts)) >= 0.7) {
      stats.isLearned = true;
      learningStatsTracker.recordWordLearned(word);
      wordTracker.markWordAsSeen(word);
    }

    this.wordStats.set(word.english, stats);
    this.saveToLocalStorage();
  }

  public getWordStats(word: Word): WordStats | null {
    return this.wordStats.get(word.english) || null;
  }

  public getDifficultWords(words: Word[]): Word[] {
    return words.filter(word => {
      const stats = this.wordStats.get(word.english);
      return stats?.isDifficult || false;
    });
  }

  public getLearnedWords(words: Word[]): Word[] {
    return words.filter(word => {
      const stats = this.wordStats.get(word.english);
      return stats?.isLearned || false;
    });
  }

  public resetWordStats(word: Word): void {
    this.wordStats.delete(word.english);
    difficultWordsManager.resetWordStats(word);
    this.saveToLocalStorage();
  }
}

const wordStatsManager = WordStatsManager.getInstance();

export function updateWordStats(word: string, isCorrect: boolean): void {
  const wordObj: Word = { english: word, turkish: '' };
  wordStatsManager.recordAttempt(wordObj, isCorrect);
}

export { wordStatsManager };