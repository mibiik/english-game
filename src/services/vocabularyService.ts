import { Word } from '../data/intermediate';

export interface Unit {
  id: string;
  name: string;
  description: string;
  wordCount: number;
}

export interface VocabularyGame {
  unit: Unit;
  words: Word[];
  sentences: string[];
  correctAnswers: string[];
  options: string[][];
  currentQuestionIndex: number;
  score: number;
}

export class VocabularyService {
  private static instance: VocabularyService;
  private currentGame: VocabularyGame | null = null;

  private constructor() {}

  public static getInstance(): VocabularyService {
    if (!VocabularyService.instance) {
      VocabularyService.instance = new VocabularyService();
    }
    return VocabularyService.instance;
  }

  public getUnits(): Unit[] {
    return [
      { id: '1', name: 'Reading & Writing 1', description: 'Basic vocabulary for reading and writing', wordCount: 22 },
      { id: '2', name: 'Listening & Speaking 1', description: 'Essential words for communication', wordCount: 25 },
      { id: '3', name: 'Extra Words 1', description: 'Additional vocabulary for practice', wordCount: 8 },
      { id: '4', name: 'Reading & Writing 2', description: 'Intermediate reading and writing vocabulary', wordCount: 27 },
      { id: '5', name: 'Listening & Speaking 2', description: 'Advanced communication words', wordCount: 30 },
      { id: '6', name: 'Extra Words 2', description: 'Supplementary vocabulary', wordCount: 8 }
    ];
  }

  public getUnitWords(words: Word[], unitId: string): Word[] {
    return words.filter(word => word.unit === unitId);
  }

  public getRandomWords(words: Word[], count: number): Word[] {
    const shuffled = [...words].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  private generateOptions(correctAnswer: string, unitWords: Word[]): string[] {
    const otherWords = unitWords
      .filter(word => word.english.toLowerCase() !== correctAnswer.toLowerCase())
      .map(word => word.english);
    const shuffledWords = [...otherWords].sort(() => 0.5 - Math.random()).slice(0, Math.min(3, otherWords.length));
    const options = [...shuffledWords, correctAnswer];
    return options.sort(() => 0.5 - Math.random());
  }

  public async initializeGame(words: Word[], unit: Unit): Promise<VocabularyGame> {
    const unitWords = this.getUnitWords(words, unit.id);
    const selectedWords = [...unitWords]; // Tüm kelimeleri kullan
    const correctAnswers = selectedWords.map(word => word.english);
    
    this.currentGame = {
      unit,
      words: selectedWords,
      sentences: [],
      correctAnswers,
      options: correctAnswers.map(answer => this.generateOptions(answer, unitWords)),
      currentQuestionIndex: 0,
      score: 0
    };

    return this.currentGame;
  }



  public getCurrentGame(): VocabularyGame | null {
    return this.currentGame;
  }

  public clearCurrentGame(): void {
    this.currentGame = null;
  }

  public shuffleArray<T extends unknown>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }
}