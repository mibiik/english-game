import { UserScore } from '../components/Leaderboard';

type GameMode = 'matching' | 'multipleChoice' | 'flashcard' | 'scramble' | 'difficult' | 'speaking' | 'wordRace' | 'sentenceCompletion' | 'wordForms';

interface GameResult {
  userId: string;
  gameMode: GameMode;
  score: number;
  timestamp: number;
}

class GameScoreService {
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
          matching: 300,
          multipleChoice: 250,
          flashcard: 200,
          scramble: 150,
          difficult: 100,
          speaking: 80,
          wordRace: 70,
          sentenceCompletion: 60,
          wordForms: 50
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

  public async registerUser(name: string): Promise<void> {
    const newUser: UserScore = {
      id: Date.now().toString(),
      name,
      scores: {
        matching: 0,
        multipleChoice: 0,
        flashcard: 0,
        scramble: 0,
        difficult: 0,
        speaking: 0,
        wordRace: 0,
        sentenceCompletion: 0,
        wordForms: 0
      },
      totalScore: 0
    };
    this.scores.push(newUser);
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

  public async getLeaderboard(): Promise<UserScore[]> {
    return [...this.scores].sort((a, b) => b.totalScore - a.totalScore);
  }

  public async getLeaderboardByGameMode(gameMode: GameMode): Promise<UserScore[]> {
    return [...this.scores].sort((a, b) => b.scores[gameMode] - a.scores[gameMode]);
  }
}

export const gameScoreService = GameScoreService.getInstance();