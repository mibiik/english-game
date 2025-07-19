import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { authService } from './authService';

export type GameMode = 
  | 'matching'
  | 'sentence-completion'
  | 'multiple-choice'
  | 'flashcard'
  | 'speaking'
  | 'word-race'
  | 'wordTypes';

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

interface GameResult {
  userId: string;
  gameMode: GameMode;
  score: number;
  timestamp: number;
}

class GameScoreService {
  private readonly collectionName = 'gameScores';
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
          'wordTypes': 50
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

  public async registerUser(displayName: string): Promise<void> {
    const userId = authService.getCurrentUserId();
    if (!userId) throw new Error('Kullanıcı oturum açmamış');

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

    await addDoc(collection(db, this.collectionName), {
      userId,
      displayName: user.displayName || 'Anonim',
      gameMode,
      score,
      unit,
      timestamp: Timestamp.now()
    });
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

    const q = query(
      collection(db, this.collectionName),
      where('userId', '==', userId),
      where('gameMode', '==', gameMode),
      where('unit', '==', unit),
      orderBy('score', 'desc'),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return 0;

    return querySnapshot.docs[0].data().score;
  }

  public async getUserTotalScore(): Promise<number> {
    const userId = authService.getCurrentUserId();
    if (!userId) return 0;

    const q = query(
      collection(db, this.collectionName),
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    let totalScore = 0;

    querySnapshot.docs.forEach(doc => {
      totalScore += doc.data().score;
    });

    return totalScore;
  }

  public async addScore(userId: string, gameMode: GameMode, score: number): Promise<void> {
    const user = this.scores.find(u => u.id === userId);
    if (user) {
      user.scores[gameMode] += score;
      user.totalScore += score;
      this.gameResults.push({
        userId,
        gameMode,
        score,
        timestamp: Date.now()
      });
    }
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
    return [...this.scores].sort((a, b) => b.totalScore - a.totalScore);
  }

  public async getLeaderboardByGameMode(gameMode: GameMode): Promise<UserScore[]> {
    return [...this.scores].sort((a, b) => b.scores[gameMode] - a.scores[gameMode]);
  }
}

export const gameScoreService = GameScoreService.getInstance();
