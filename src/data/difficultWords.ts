import { Word } from './words';

interface WordDifficultyData {
  incorrectAttempts: number;
  totalAttempts: number;
  lastAttemptDate: string;
}

class DifficultWordsManager {
  private static instance: DifficultWordsManager;
  private difficultyData: Map<string, WordDifficultyData>;
  private difficultWords: Set<string>;
  private readonly DIFFICULTY_THRESHOLD = 0.3; // 30% yanlış oranı

  private constructor() {
    this.difficultyData = new Map();
    this.difficultWords = new Set();
    this.loadFromLocalStorage();
  }

  public static getInstance(): DifficultWordsManager {
    if (!DifficultWordsManager.instance) {
      DifficultWordsManager.instance = new DifficultWordsManager();
    }
    return DifficultWordsManager.instance;
  }

  private loadFromLocalStorage(): void {
    try {
      const savedData = localStorage.getItem('wordDifficultyData');
      const savedDifficultWords = localStorage.getItem('difficultWords');

      if (savedData) {
        const parsedData = JSON.parse(savedData);
        this.difficultyData = new Map(Object.entries(parsedData));
      }

      if (savedDifficultWords) {
        this.difficultWords = new Set(JSON.parse(savedDifficultWords));
      }
    } catch (error) {
      console.error('Zorlu kelime verisi yüklenirken hata:', error);
    }
  }

  private saveToLocalStorage(): void {
    try {
      const dataObject = Object.fromEntries(this.difficultyData);
      localStorage.setItem('wordDifficultyData', JSON.stringify(dataObject));
      localStorage.setItem('difficultWords', JSON.stringify(Array.from(this.difficultWords)));
    } catch (error) {
      console.error('Zorlu kelime verisi kaydedilirken hata:', error);
    }
  }

  public trackWordAttempt(word: Word, isCorrect: boolean): void {
    const data = this.difficultyData.get(word.english) || {
      incorrectAttempts: 0,
      totalAttempts: 0,
      lastAttemptDate: new Date().toISOString()
    };

    data.totalAttempts++;
    if (!isCorrect) {
      data.incorrectAttempts++;
    }
    data.lastAttemptDate = new Date().toISOString();

    this.difficultyData.set(word.english, data);
    this.updateDifficultStatus(word);
    this.saveToLocalStorage();
  }

  private updateDifficultStatus(word: Word): void {
    const data = this.difficultyData.get(word.english);
    if (!data || data.totalAttempts < 5) return; // En az 5 deneme olmalı

    const incorrectRatio = data.incorrectAttempts / data.totalAttempts;
    if (incorrectRatio >= this.DIFFICULTY_THRESHOLD) {
      this.difficultWords.add(word.english);
    } else {
      this.difficultWords.delete(word.english);
    }
  }

  public isDifficult(word: Word): boolean {
    return this.difficultWords.has(word.english);
  }

  public getDifficultWords(words: Word[]): Word[] {
    return words.filter(word => this.isDifficult(word));
  }

  public getWordStats(word: Word): WordDifficultyData | null {
    return this.difficultyData.get(word.english) || null;
  }

  public resetWordStats(word: Word): void {
    this.difficultyData.delete(word.english);
    this.difficultWords.delete(word.english);
    this.saveToLocalStorage();
  }

  public getMostDifficultWords(words: Word[]): Word[] {
    const wordsWithDifficulty = words
      .map(word => {
        const data = this.difficultyData.get(word.english);
        if (!data || data.totalAttempts < 5) return null;
        
        const incorrectRatio = data.incorrectAttempts / data.totalAttempts;
        return {
          word,
          incorrectRatio
        };
      })
      .filter((item): item is { word: Word; incorrectRatio: number } => item !== null)
      .sort((a, b) => b.incorrectRatio - a.incorrectRatio);

    return wordsWithDifficulty.map(item => item.word);
  }
}

export const difficultWordsManager = DifficultWordsManager.getInstance();

// Add the missing updateWordDifficulty function
export const updateWordDifficulty = (word: Word, isCorrect: boolean): void => {
  difficultWordsManager.trackWordAttempt(word, isCorrect);
};

export const getMostDifficultWords = (words: Word[]): Word[] => {
  return difficultWordsManager.getMostDifficultWords(words);
};