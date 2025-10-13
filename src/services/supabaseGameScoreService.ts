import { supabase } from '../config/supabase';
import { seasonService } from './seasonService';
import { supabaseAuthService } from './supabaseAuthService';

export type GameMode = 
  | 'matching'
  | 'sentence-completion'
  | 'multiple-choice'
  | 'flashcard'
  | 'speaking'
  | 'word-race'
  | 'wordTypes'
  | 'wordForms'
  | 'vocabulary'
  | 'timedMatching'
  | 'speedGame'
  | 'quizGame'
  | 'prepositionMastery'
  | 'paraphraseChallenge'
  | 'difficultWords'
  | 'definitionToWord';

export interface GameScore {
  id?: string;
  userId: string;
  gameMode: GameMode;
  score: number;
  unit: string;
  level: string;
  seasonId: string;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  displayName: string;
  display_name?: string; // Supabase'den gelen alan
  email: string;
  photoURL?: string;
  avatar_url?: string; // Supabase'den gelen alan
  totalScore: number;
  gamesPlayed: number;
  lastPlayed: string;
  level: string;
  bio?: string;
  location?: string;
  isOnline: boolean;
  lastSeen: string;
  createdAt: string;
  updatedAt: string;
  isPremium?: boolean;
  premiumUntil?: string;
  badges?: string[];
  isFirstSupporter?: boolean;
}

class SupabaseGameScoreService {
  // Anında puan ekleme (oyun sırasında)
  async addScore(userId: string, gameMode: GameMode, score: number): Promise<void> {
    try {
      const currentSeason = await seasonService.getCurrentSeason();
      if (!currentSeason) {
        console.error('Aktif sezon bulunamadı');
        return;
      }

      console.log(`🎮 Puan ekleniyor: ${score} (${gameMode}) - User: ${userId}`);
      console.log(`📅 Aktif sezon: ${currentSeason.name} (${currentSeason.id})`);

      // Oyun skorunu kaydet
      const { error: gameScoreError } = await supabase
        .from('game_scores')
        .insert({
          user_id: userId,
          game_mode: gameMode,
          score,
          unit: 'all',
          level: 'intermediate',
          season_id: currentSeason.id,
          timestamp: new Date().toISOString()
        });

      if (gameScoreError) {
        console.error('Anında puan kaydedilemedi (game_scores):', gameScoreError);
        // game_scores başarısız olsa da sezon skorunu güncellemeye devam et
      } else {
        console.log('✅ Game score kaydedildi');
      }

      // Sezon skorunu güncelle (başarısız olsa bile oyunu durdurma)
      try {
        await this.updateSeasonScore(userId, currentSeason.id, score);
      } catch (seasonError) {
        console.error('Sezon skoru güncellenemedi:', seasonError);
      }

      console.log(`✅ Anında puan eklendi: ${score} (${gameMode})`);

      // Custom event ile Navbar'ı güncelle
      window.dispatchEvent(new CustomEvent('scoreUpdated', { 
        detail: { userId, gameMode, score } 
      }));

    } catch (error) {
      console.error('Anında puan ekleme hatası:', error);
    }
  }

  // Oyun bitiminde toplam puan kaydetme
  async saveScore(gameMode: GameMode, totalScore: number, unit: string): Promise<void> {
    try {
      const userId = supabaseAuthService.getCurrentUserId();
      if (!userId) {
        console.error('Kullanıcı oturum açmamış');
        return;
      }

      const currentSeason = await seasonService.getCurrentSeason();
      if (!currentSeason) {
        console.error('Aktif sezon bulunamadı');
        return;
      }

      // Kullanıcı profilini getir
      const userProfile = await this.getUserProfile(userId);
      if (!userProfile) {
        console.error('Kullanıcı profili bulunamadı');
        return;
      }

      console.log(`🎮 Oyun skoru kaydediliyor: ${gameMode}, puan: ${totalScore}, unit: ${unit}`);

      // Oyun skorunu kaydet
      const { error: gameScoreError } = await supabase
        .from('game_scores')
        .insert({
          user_id: userId,
          game_mode: gameMode,
          score: totalScore,
          unit,
          level: userProfile.level,
          season_id: currentSeason.id,
          timestamp: new Date().toISOString()
        });

      if (gameScoreError) {
        console.error('Oyun skoru kaydedilemedi (game_scores):', gameScoreError);
        // game_scores başarısız olsa da aşağıya devam et
      }

      // Sezon skorunu güncelle
      try {
        await this.updateSeasonScore(userId, currentSeason.id, totalScore);
      } catch (seasonError) {
        console.error('Sezon skoru güncellenemedi:', seasonError);
      }

      // Kullanıcı profilini güncelle
      try {
        await this.updateUserProfile(userId, {
          totalScore: userProfile.totalScore + totalScore,
          gamesPlayed: userProfile.gamesPlayed + 1,
          lastPlayed: new Date().toISOString()
        });
      } catch (profileError) {
        console.error('Kullanıcı profili güncellenemedi:', profileError);
      }

      console.log(`✅ Oyun skoru başarıyla işlendi: ${totalScore}`);

      // Navbar'ı tetikle
      window.dispatchEvent(new CustomEvent('scoreUpdated', { 
        detail: { userId, gameMode, score: totalScore }
      }));
    } catch (error) {
      console.error('Oyun skoru kaydetme hatası:', error);
    }
  }

  // Sezon skorunu güncelle
  private async updateSeasonScore(userId: string, seasonId: string, additionalScore: number): Promise<void> {
    try {
      console.log(`🔄 Sezon skoru güncelleniyor: User=${userId}, Season=${seasonId}, Score=${additionalScore}`);
      
      // Mevcut sezon skorunu getir
      const { data: existingScore, error: fetchError } = await supabase
        .from('season_scores')
        .select('*')
        .eq('user_id', userId)
        .eq('season_id', seasonId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Sezon skoru getirilemedi:', fetchError);
        return;
      }

      if (existingScore) {
        console.log(`📊 Mevcut skor bulundu: ${existingScore.total_score}, güncelleniyor...`);
        // Mevcut skoru güncelle
        const { error: updateError } = await supabase
          .from('season_scores')
          .update({
            total_score: existingScore.total_score + additionalScore,
            games_played: existingScore.games_played + 1,
            last_played: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .eq('season_id', seasonId);

        if (updateError) {
          console.error('Sezon skoru güncellenemedi:', updateError);
        } else {
          console.log('🔄 Sezon skoru güncellendi, real-time tetikleniyor...');
          console.log('📊 Güncellenen skor:', existingScore.total_score + additionalScore);
        }
      } else {
        console.log(`🆕 Yeni sezon skoru oluşturuluyor: ${additionalScore} puan`);
        // Yeni sezon skoru oluştur
        const { error: insertError } = await supabase
          .from('season_scores')
          .insert({
            user_id: userId,
            season_id: seasonId,
            total_score: additionalScore,
            games_played: 1,
            last_played: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (insertError) {
          console.error('Yeni sezon skoru oluşturulamadı:', insertError);
        } else {
          console.log('🔄 Yeni sezon skoru oluşturuldu, real-time tetikleniyor...');
        }
      }
    } catch (error) {
      console.error('Sezon skoru güncelleme hatası:', error);
    }
  }

  // Kullanıcı profilini getir
  public async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Kullanıcı profili getirilemedi:', error);
        return null;
      }

      // snake_case'den camelCase'e çevir
      if (data) {
        return {
          id: data.id,
          displayName: data.display_name || '',
          email: data.email || '',
          photoURL: data.avatar_url,
          totalScore: data.total_score || 0,
          gamesPlayed: data.games_played || 0,
          lastPlayed: data.last_played,
          level: data.level || 'intermediate',
          bio: data.bio,
          location: data.location,
          isOnline: data.is_online || false,
          lastSeen: data.last_seen,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          isPremium: data.is_premium,
          premiumUntil: data.premium_until,
          badges: data.badges,
          isFirstSupporter: data.is_first_supporter
        };
      }

      return null;
    } catch (error) {
      console.error('Kullanıcı profili getirme hatası:', error);
      return null;
    }
  }

  // Kullanıcı profilini güncelle
  private async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      // camelCase'i snake_case'e çevir
      const snakeCaseUpdates: any = {
        updated_at: new Date().toISOString()
      };

      if (updates.totalScore !== undefined) snakeCaseUpdates.total_score = updates.totalScore;
      if (updates.gamesPlayed !== undefined) snakeCaseUpdates.games_played = updates.gamesPlayed;
      if (updates.lastPlayed !== undefined) snakeCaseUpdates.last_played = updates.lastPlayed;
      if (updates.displayName !== undefined) snakeCaseUpdates.display_name = updates.displayName;
      if (updates.photoURL !== undefined) snakeCaseUpdates.avatar_url = updates.photoURL;
      if (updates.level !== undefined) snakeCaseUpdates.level = updates.level;
      if (updates.bio !== undefined) snakeCaseUpdates.bio = updates.bio;
      if (updates.location !== undefined) snakeCaseUpdates.location = updates.location;
      if (updates.isOnline !== undefined) snakeCaseUpdates.is_online = updates.isOnline;
      if (updates.lastSeen !== undefined) snakeCaseUpdates.last_seen = updates.lastSeen;
      if (updates.isPremium !== undefined) snakeCaseUpdates.is_premium = updates.isPremium;
      if (updates.premiumUntil !== undefined) snakeCaseUpdates.premium_until = updates.premiumUntil;
      if (updates.badges !== undefined) snakeCaseUpdates.badges = updates.badges;
      if (updates.isFirstSupporter !== undefined) snakeCaseUpdates.is_first_supporter = updates.isFirstSupporter;

      console.log('📝 Kullanıcı profili güncelleniyor:', userId, snakeCaseUpdates);

      const { error } = await supabase
        .from('users')
        .update(snakeCaseUpdates)
        .eq('id', userId);

      if (error) {
        console.error('❌ Kullanıcı profili güncellenemedi:', error);
      } else {
        console.log('✅ Kullanıcı profili güncellendi:', snakeCaseUpdates);
      }
    } catch (error) {
      console.error('❌ Kullanıcı profili güncelleme hatası:', error);
    }
  }

  // Kullanıcının oyun geçmişini getir
  async getUserGameHistory(userId: string, seasonId?: string, limit: number = 50): Promise<GameScore[]> {
    try {
      const season = seasonId ? await seasonService.getSeasonById(seasonId) : await seasonService.getCurrentSeason();
      
      if (!season) {
        console.error('Sezon bulunamadı');
        return [];
      }

      const { data, error } = await supabase
        .from('game_scores')
        .select('*')
        .eq('user_id', userId)
        .eq('season_id', season.id)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Oyun geçmişi getirilemedi:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Oyun geçmişi getirme hatası:', error);
      return [];
    }
  }

  // Kullanıcının toplam skorunu getir
  async getUserTotalScore(userId: string, seasonId?: string): Promise<number> {
    try {
      const season = seasonId ? await seasonService.getSeasonById(seasonId) : await seasonService.getCurrentSeason();
      
      if (!season) {
        console.error('Sezon bulunamadı');
        return 0;
      }

      const { data, error } = await supabase
        .from('season_scores')
        .select('total_score')
        .eq('user_id', userId)
        .eq('season_id', season.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return 0; // Skor bulunamadı
        }
        console.error('Kullanıcı toplam skoru getirilemedi:', error);
        return 0;
      }

      return data?.total_score || 0;
    } catch (error) {
      console.error('Kullanıcı toplam skoru getirme hatası:', error);
      return 0;
    }
  }

  // Kullanıcının oyun istatistiklerini getir
  async getUserGameStats(userId: string, seasonId?: string): Promise<{
    totalScore: number;
    gamesPlayed: number;
    averageScore: number;
    gameModeStats: { [key: string]: { count: number; totalScore: number } };
  }> {
    try {
      const season = seasonId ? await seasonService.getSeasonById(seasonId) : await seasonService.getCurrentSeason();
      
      if (!season) {
        console.error('Sezon bulunamadı');
        return { totalScore: 0, gamesPlayed: 0, averageScore: 0, gameModeStats: {} };
      }

      // Sezon skorunu getir
      const { data: seasonScore, error: seasonError } = await supabase
        .from('season_scores')
        .select('totalScore, gamesPlayed')
        .eq('user_id', userId)
        .eq('season_id', season.id)
        .single();

      if (seasonError && seasonError.code !== 'PGRST116') {
        console.error('Sezon skoru getirilemedi:', seasonError);
        return { totalScore: 0, gamesPlayed: 0, averageScore: 0, gameModeStats: {} };
      }

      // Oyun modu istatistiklerini getir
      const { data: gameScores, error: gameError } = await supabase
        .from('game_scores')
        .select('gameMode, score')
        .eq('user_id', userId)
        .eq('season_id', season.id);

      if (gameError) {
        console.error('Oyun skorları getirilemedi:', gameError);
        return { totalScore: 0, gamesPlayed: 0, averageScore: 0, gameModeStats: {} };
      }

      // Oyun modu istatistiklerini hesapla
      const gameModeStats: { [key: string]: { count: number; totalScore: number } } = {};
      gameScores?.forEach(score => {
        if (!gameModeStats[score.gameMode]) {
          gameModeStats[score.gameMode] = { count: 0, totalScore: 0 };
        }
        gameModeStats[score.gameMode].count++;
        gameModeStats[score.gameMode].totalScore += score.score;
      });

      const totalScore = seasonScore?.totalScore || 0;
      const gamesPlayed = seasonScore?.gamesPlayed || 0;
      const averageScore = gamesPlayed > 0 ? totalScore / gamesPlayed : 0;

      return {
        totalScore,
        gamesPlayed,
        averageScore,
        gameModeStats
      };
    } catch (error) {
      console.error('Kullanıcı oyun istatistikleri getirme hatası:', error);
      return { totalScore: 0, gamesPlayed: 0, averageScore: 0, gameModeStats: {} };
    }
  }

  // Kullanıcının tüm oyun modlarındaki skorlarını getir
  async getUserAllScores(): Promise<Record<GameMode, number>> {
    try {
      const userId = supabaseAuthService.getCurrentUserId();
      if (!userId) {
        return {
          'matching': 0,
          'speedGame': 0,
          'wordForms': 0,
          'definitionToWord': 0,
          'multiple-choice': 0,
          'paraphraseChallenge': 0,
          'memory-game': 0,
          'speaking': 0
        };
      }

      const currentSeason = await seasonService.getCurrentSeason();
      if (!currentSeason) {
        return {
          'matching': 0,
          'speedGame': 0,
          'wordForms': 0,
          'definitionToWord': 0,
          'multiple-choice': 0,
          'paraphraseChallenge': 0,
          'memory-game': 0,
          'speaking': 0
        };
      }

      const { data, error } = await supabase
        .from('game_scores')
        .select('game_mode, score')
        .eq('user_id', userId)
        .eq('season_id', currentSeason.id);

      if (error) {
        console.error('Oyun skorları getirilemedi:', error);
        return {
          'matching': 0,
          'speedGame': 0,
          'wordForms': 0,
          'definitionToWord': 0,
          'multiple-choice': 0,
          'paraphraseChallenge': 0,
          'memory-game': 0,
          'speaking': 0
        };
      }

      const scores: Record<GameMode, number> = {
        'matching': 0,
        'speedGame': 0,
        'wordForms': 0,
        'definitionToWord': 0,
        'multiple-choice': 0,
        'paraphraseChallenge': 0,
        'memory-game': 0,
        'speaking': 0
      };

      data?.forEach((row: any) => {
        if (scores.hasOwnProperty(row.game_mode)) {
          scores[row.game_mode as GameMode] += row.score;
        }
      });

      return scores;
    } catch (error) {
      console.error('Kullanıcı skorları getirme hatası:', error);
      return {
        'matching': 0,
        'speedGame': 0,
        'wordForms': 0,
        'definitionToWord': 0,
        'multiple-choice': 0,
        'paraphraseChallenge': 0,
        'memory-game': 0,
        'speaking': 0
      };
    }
  }

  // Kullanıcı istatistiklerini getir
  async getUserStats(): Promise<{
    totalScore: number;
    gamesPlayed: number;
    averageScore: number;
    gameModeStats: Record<GameMode, { score: number; gamesPlayed: number }>;
  }> {
    try {
      const userId = supabaseAuthService.getCurrentUserId();
      if (!userId) {
        return { totalScore: 0, gamesPlayed: 0, averageScore: 0, gameModeStats: {} };
      }

      const currentSeason = await seasonService.getCurrentSeason();
      if (!currentSeason) {
        return { totalScore: 0, gamesPlayed: 0, averageScore: 0, gameModeStats: {} };
      }

      // Sezon skorunu getir
      const { data: seasonScore, error: seasonError } = await supabase
        .from('season_scores')
        .select('total_score, games_played')
        .eq('user_id', userId)
        .eq('season_id', currentSeason.id)
        .single();

      if (seasonError) {
        console.error('Sezon skoru getirilemedi:', seasonError);
        return { totalScore: 0, gamesPlayed: 0, averageScore: 0, gameModeStats: {} };
      }

      // Oyun modu istatistiklerini getir
      const { data: gameScores, error: gameError } = await supabase
        .from('game_scores')
        .select('game_mode, score')
        .eq('user_id', userId)
        .eq('season_id', currentSeason.id);

      if (gameError) {
        console.error('Oyun skorları getirilemedi:', gameError);
        return { totalScore: 0, gamesPlayed: 0, averageScore: 0, gameModeStats: {} };
      }

      const gameModeStats: Record<GameMode, { score: number; gamesPlayed: number }> = {
        'matching': { score: 0, gamesPlayed: 0 },
        'speedGame': { score: 0, gamesPlayed: 0 },
        'wordForms': { score: 0, gamesPlayed: 0 },
        'definitionToWord': { score: 0, gamesPlayed: 0 },
        'multiple-choice': { score: 0, gamesPlayed: 0 },
        'paraphraseChallenge': { score: 0, gamesPlayed: 0 },
        'memory-game': { score: 0, gamesPlayed: 0 },
        'speaking': { score: 0, gamesPlayed: 0 }
      };

      gameScores?.forEach((row: any) => {
        if (gameModeStats.hasOwnProperty(row.game_mode)) {
          gameModeStats[row.game_mode as GameMode].score += row.score;
          gameModeStats[row.game_mode as GameMode].gamesPlayed += 1;
        }
      });

      const totalScore = seasonScore?.total_score || 0;
      const gamesPlayed = seasonScore?.games_played || 0;
      const averageScore = gamesPlayed > 0 ? totalScore / gamesPlayed : 0;

      return {
        totalScore,
        gamesPlayed,
        averageScore,
        gameModeStats
      };
    } catch (error) {
      console.error('Kullanıcı istatistikleri getirme hatası:', error);
      return { totalScore: 0, gamesPlayed: 0, averageScore: 0, gameModeStats: {} };
    }
  }
}

export const supabaseGameScoreService = new SupabaseGameScoreService();
