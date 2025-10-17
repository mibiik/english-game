import { Word } from './intermediate';

interface WordTrackingState {
  seenWords: Set<string>;
  masteredWords: Set<string>;
  totalWords: number;
  currentUnit: string;
}

class WordTracker {
  private static instance: WordTracker;
  private trackingState: Map<string, WordTrackingState>;

  private constructor() {
    this.trackingState = new Map();
  }

  public static getInstance(): WordTracker {
    if (!WordTracker.instance) {
      WordTracker.instance = new WordTracker();
    }
    return WordTracker.instance;
  }

  public initializeUnit(words: Word[], unit: string): void {
    const unitWords = words.filter(word => word.unit === unit);
    if (!this.trackingState.has(unit)) {
      this.trackingState.set(unit, {
        seenWords: new Set<string>(),
        masteredWords: new Set<string>(),
        totalWords: unitWords.length,
        currentUnit: unit
      });
    }
  }

  public markWordAsSeen(word: Word): void {
    const state = this.trackingState.get(word.unit);
    if (state) {
      state.seenWords.add(word.english);
    }
  }

  public markWordAsMastered(word: Word): void {
    const state = this.trackingState.get(word.unit);
    if (state) {
      state.masteredWords.add(word.english);
    }
  }

  public isWordSeen(word: Word): boolean {
    const state = this.trackingState.get(word.unit);
    return state ? state.seenWords.has(word.english) : false;
  }

  public isWordMastered(word: Word): boolean {
    const state = this.trackingState.get(word.unit);
    return state ? state.masteredWords.has(word.english) : false;
  }

  public getUnseenWords(words: Word[], unit: string): Word[] {
    const state = this.trackingState.get(unit);
    if (!state) return words.filter(word => word.unit === unit);

    return words.filter(word => 
      word.unit === unit && !state.seenWords.has(word.english)
    );
  }

  public getUnmasteredWords(words: Word[], unit: string): Word[] {
    const state = this.trackingState.get(unit);
    if (!state) return words.filter(word => word.unit === unit);

    return words.filter(word => 
      word.unit === unit && !state.masteredWords.has(word.english)
    );
  }

  public getProgress(unit: string): {
    seenCount: number;
    masteredCount: number;
    totalCount: number;
    percentage: number;
    masteryPercentage: number;
  } {
    const state = this.trackingState.get(unit);
    if (!state) return { 
      seenCount: 0, 
      masteredCount: 0,
      totalCount: 0, 
      percentage: 0,
      masteryPercentage: 0
    };

    const seenCount = state.seenWords.size;
    const masteredCount = state.masteredWords.size;
    const totalCount = state.totalWords;
    const percentage = (seenCount / totalCount) * 100;
    const masteryPercentage = (masteredCount / totalCount) * 100;

    return {
      seenCount,
      masteredCount,
      totalCount,
      percentage: Math.round(percentage),
      masteryPercentage: Math.round(masteryPercentage)
    };
  }

  public resetUnit(unit: string): void {
    const state = this.trackingState.get(unit);
    if (state) {
      state.seenWords.clear();
      state.masteredWords.clear();
    }
  }

  public getNextWord(words: Word[], unit: string): Word | null {
    const unseenWords = this.getUnseenWords(words, unit);
    if (unseenWords.length === 0) {
      const unmasteredWords = this.getUnmasteredWords(words, unit);
      if (unmasteredWords.length === 0) {
        this.resetUnit(unit);
        return words.find(word => word.unit === unit) || null;
      }
      return unmasteredWords[Math.floor(Math.random() * unmasteredWords.length)];
    }
    return unseenWords[Math.floor(Math.random() * unseenWords.length)];
  }

  public getNextWords(words: Word[], unit: string, count: number): Word[] {
    const unseenWords = this.getUnseenWords(words, unit);
    const unitWords = words.filter(word => word.unit === unit);
    
    if (unseenWords.length < count) {
      const unmasteredWords = this.getUnmasteredWords(words, unit);
      if (unmasteredWords.length < count) {
        this.resetUnit(unit);
        return this.getRandomWords(unitWords, count);
      }
      return this.getRandomWords(unmasteredWords, count);
    }
    
    return this.getRandomWords(unseenWords, count);
  }

  private getRandomWords(words: Word[], count: number): Word[] {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }
}

export const wordTracker = WordTracker.getInstance();