import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { authService } from './authService';

export type GameMode = 
  | 'matching'
  | 'sentence-completion'
  | 'multiple-choice'
  | 'flashcard'
  | 'speaking'
  | 'word-race';

export interface GameScore {
  userId: string;
  displayName: string;
  gameMode: GameMode;
  score: number;
  unit: string;
  timestamp: Date;
}

class GameScoreService {
  private readonly collectionName = 'gameScores';

  // Kullanıcı kaydı
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

  // Skor kaydet
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

  // Liderlik tablosunu getir
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

  // Kullanıcının en yüksek skorunu getir
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

  // Kullanıcının toplam puanını getir
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
}

export const gameScoreService = new GameScoreService();