import { supabase } from '../config/supabase';
import { seasonService } from './seasonService';

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

export interface SeasonScore {
  id?: string;
  userId: string;
  seasonId: string;
  totalScore: number;
  gamesPlayed: number;
  lastPlayed: string;
  createdAt: string;
  updatedAt: string;
}

class SupabaseScoreService {
  // Oyun skorunu kaydet
  async saveGameScore(
    userId: string,
    gameMode: GameMode,
    score: number,
    unit: string,
    level: string
  ): Promise<boolean> {
    try {
      const currentSeason = await seasonService.getCurrentSeason();
      if (!currentSeason) {
        console.error('Aktif sezon bulunamadı');
        return false;
      }

      // Oyun skorunu kaydet (snake_case kullan)
      const { error: gameScoreError } = await supabase
        .from('game_scores')
        .insert({
          user_id: userId,
          game_mode: gameMode,
          score,
          unit,
          level,
          season_id: currentSeason.id,
          timestamp: new Date().toISOString()
        });

      if (gameScoreError) {
        console.error('Oyun skoru kaydedilemedi:', gameScoreError);
        return false;
      }

      // Sezon skorunu güncelle
      await this.updateSeasonScore(userId, currentSeason.id, score);

      return true;
    } catch (error) {
      console.error('Skor kaydetme hatası:', error);
      return false;
    }
  }

  // Sezon skorunu güncelle
  private async updateSeasonScore(userId: string, seasonId: string, additionalScore: number): Promise<void> {
    try {
      // Mevcut sezon skorunu getir (snake_case kullan)
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
        // Mevcut skoru güncelle (snake_case kullan)
        const newTotalScore = (existingScore.total_score || 0) + additionalScore;
        const newGamesPlayed = (existingScore.games_played || 0) + 1;
        
        console.log(`🔄 Sezon skoru güncelleniyor: ${existingScore.total_score} -> ${newTotalScore}`);
        
        const { error: updateError } = await supabase
          .from('season_scores')
          .update({
            total_score: newTotalScore,
            games_played: newGamesPlayed,
            last_played: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .eq('season_id', seasonId);

        if (updateError) {
          console.error('❌ Sezon skoru güncellenemedi:', updateError);
        } else {
          console.log('✅ Sezon skoru güncellendi:', newTotalScore);
        }
      } else {
        // Yeni sezon skoru oluştur (snake_case kullan)
        console.log(`🆕 Yeni sezon skoru oluşturuluyor: ${additionalScore}`);
        
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
          console.error('❌ Yeni sezon skoru oluşturulamadı:', insertError);
        } else {
          console.log('✅ Yeni sezon skoru oluşturuldu:', additionalScore);
        }
      }
    } catch (error) {
      console.error('❌ Sezon skoru güncelleme hatası:', error);
    }
  }

  // Kullanıcının sezon skorunu getir (sadece sayı olarak)
  async getUserSeasonScore(userId: string, seasonId?: string): Promise<number | null> {
    try {
      const season = seasonId ? await seasonService.getSeasonById(seasonId) : await seasonService.getCurrentSeason();
      
      if (!season) {
        console.error('Sezon bulunamadı');
        return null;
      }

      const { data, error } = await supabase
        .from('season_scores')
        .select('total_score')
        .eq('user_id', userId)
        .eq('season_id', season.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Kullanıcının skoru yok, varsayılan skor oluştur
          await this.createDefaultSeasonScore(userId, season.id);
          return 0;
        }
        console.error('Kullanıcı sezon skoru getirilemedi:', error);
        return null;
      }

      return data?.total_score || 0;
    } catch (error) {
      console.error('Kullanıcı sezon skoru getirme hatası:', error);
      return null;
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

  // Sezon istatistiklerini getir
  async getSeasonStats(seasonId?: string): Promise<{
    totalPlayers: number;
    totalGames: number;
    totalScore: number;
    averageScore: number;
  }> {
    try {
      const season = seasonId ? await seasonService.getSeasonById(seasonId) : await seasonService.getCurrentSeason();
      
      if (!season) {
        console.error('Sezon bulunamadı');
        return { totalPlayers: 0, totalGames: 0, totalScore: 0, averageScore: 0 };
      }

      const { data, error } = await supabase
        .from('season_scores')
        .select('total_score, games_played')
        .eq('season_id', season.id);

      if (error) {
        console.error('Sezon istatistikleri getirilemedi:', error);
        return { totalPlayers: 0, totalGames: 0, totalScore: 0, averageScore: 0 };
      }

      const totalPlayers = data.length;
      const totalGames = data.reduce((sum, item) => sum + item.games_played, 0);
      const totalScore = data.reduce((sum, item) => sum + item.total_score, 0);
      const averageScore = totalPlayers > 0 ? totalScore / totalPlayers : 0;

      return {
        totalPlayers,
        totalGames,
        totalScore,
        averageScore
      };
    } catch (error) {
      console.error('Sezon istatistikleri getirme hatası:', error);
      return { totalPlayers: 0, totalGames: 0, totalScore: 0, averageScore: 0 };
    }
  }

  // Kullanıcının sıralamasını getir
  async getUserRank(userId: string, seasonId?: string): Promise<number | null> {
    try {
      const season = seasonId ? await seasonService.getSeasonById(seasonId) : await seasonService.getCurrentSeason();
      
      if (!season) {
        console.error('Sezon bulunamadı');
        return null;
      }

      const { data, error } = await supabase
        .from('season_scores')
        .select('user_id, total_score')
        .eq('season_id', season.id)
        .order('total_score', { ascending: false });

      if (error) {
        console.error('Sıralama getirilemedi:', error);
        return null;
      }

      const userIndex = data.findIndex(item => item.user_id === userId);
      return userIndex >= 0 ? userIndex + 1 : null;
    } catch (error) {
      console.error('Sıralama getirme hatası:', error);
      return null;
    }
  }

  // Kullanıcı profilini getir
  async getUserProfile(userId: string): Promise<any> {
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

      return data;
    } catch (error) {
      console.error('Kullanıcı profili getirme hatası:', error);
      return null;
    }
  }

  // Kullanıcı sıralamasını getir
  async getUserRanking(userId: string): Promise<number | null> {
    try {
      const currentSeason = await seasonService.getCurrentSeason();
      if (!currentSeason) {
        return null;
      }

      // Kullanıcının skorunu getir
      const { data: userScore, error: userError } = await supabase
        .from('season_scores')
        .select('total_score')
        .eq('user_id', userId)
        .eq('season_id', currentSeason.id)
        .single();

      if (userError) {
        if (userError.code === 'PGRST116') {
          // Kullanıcının skoru yok, varsayılan skor oluştur
          console.log('Kullanıcı skoru yok, varsayılan skor oluşturuluyor...');
          await this.createDefaultSeasonScore(userId, currentSeason.id);
          return 1; // İlk sıra
        }
        console.error('Kullanıcı skoru getirilemedi:', userError);
        return null;
      }
      
      if (!userScore) {
        return null;
      }

      // Bu skordan daha yüksek skora sahip kullanıcı sayısını say
      const { count, error: countError } = await supabase
        .from('season_scores')
        .select('*', { count: 'exact', head: true })
        .eq('season_id', currentSeason.id)
        .gt('total_score', userScore.total_score);

      if (countError) {
        console.error('Sıralama hesaplanamadı:', countError);
        return null;
      }

      return (count || 0) + 1;
    } catch (error) {
      console.error('Kullanıcı sıralaması getirme hatası:', error);
      return null;
    }
  }


  // Real-time skor dinleyicisi başlat
  async startScoreListener(userId: string, onScoreUpdate: (newScore: number) => void): Promise<() => void> {
    const currentSeason = await seasonService.getCurrentSeason();
    if (!currentSeason) {
      console.error('Aktif sezon bulunamadı');
      return () => {};
    }

    console.log('🔍 Real-time dinleyici başlatılıyor:', { userId, seasonId: currentSeason.id });

    const channel = supabase
      .channel('score_updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'season_scores',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('📊 Season score güncellendi:', payload);
          const newScore = payload.new.total_score || 0;
          onScoreUpdate(newScore);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'game_scores',
          filter: `user_id=eq.${userId}`
        },
        async (payload) => {
          console.log('🎮 Game score eklendi:', payload);
          // Yeni oyun skoru eklendiğinde güncel sezon skorunu al
          const currentScore = await this.getUserSeasonScore(userId);
          if (currentScore !== null) {
            onScoreUpdate(currentScore);
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Real-time subscription durumu:', status);
      });

    return () => {
      console.log('🛑 Real-time dinleyici kapatılıyor');
      supabase.removeChannel(channel);
    };
  }

  // Varsayılan sezon skoru oluştur
  private async createDefaultSeasonScore(userId: string, seasonId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('season_scores')
        .insert({
          user_id: userId,
          season_id: seasonId,
          total_score: 0,
          games_played: 0,
          last_played: new Date().toISOString()
        });

      if (error) {
        console.error('Varsayılan sezon skoru oluşturulamadı:', error);
      } else {
        console.log('✅ Varsayılan sezon skoru oluşturuldu');
      }
    } catch (error) {
      console.error('Varsayılan sezon skoru oluşturma hatası:', error);
    }
  }
}

export const supabaseScoreService = new SupabaseScoreService();

