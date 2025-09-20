import { supabase } from '../config/supabase';

export interface Season {
  id: string;
  name: string;
  year: string;
  start_date: string;
  end_date: string;
  isactive: boolean;
  created_at: string;
  updated_at: string;
}

export interface SeasonLeaderboard {
  userId: string;
  displayName: string;
  email: string;
  photoURL?: string;
  totalScore: number;
  gamesPlayed: number;
  rank: number;
  seasonId: string;
  badges?: string[];
  isFirstSupporter?: boolean;
}

class SeasonService {
  private currentSeason: Season | null = null;
  private seasonCache: { [key: string]: Season } = {};

  // Mevcut aktif sezonu getir
  async getCurrentSeason(): Promise<Season | null> {
    if (this.currentSeason) {
      return this.currentSeason;
    }

    try {
      const { data, error } = await supabase
        .from('seasons')
        .select('*')
        .eq('isactive', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Aktif sezon getirilemedi:', error);
        return null;
      }

      this.currentSeason = data;
      return data;
    } catch (error) {
      console.error('Sezon servisi hatası:', error);
      return null;
    }
  }

  // Yeni sezon oluştur
  async createSeason(name: string, year: string, startDate: string, endDate: string): Promise<Season | null> {
    try {
      // Önceki sezonu kapat
      await this.closeCurrentSeason();

      const { data, error } = await supabase
        .from('seasons')
        .insert({
          name,
          year,
          start_date: startDate,
          end_date: endDate,
          isactive: true
        })
        .select()
        .single();

      if (error) {
        console.error('Yeni sezon oluşturulamadı:', error);
        return null;
      }

      this.currentSeason = data;
      return data;
    } catch (error) {
      console.error('Sezon oluşturma hatası:', error);
      return null;
    }
  }

  // Mevcut sezonu kapat
  async closeCurrentSeason(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('seasons')
        .update({ isactive: false })
        .eq('isactive', true);

      if (error) {
        console.error('Mevcut sezon kapatılamadı:', error);
        return false;
      }

      this.currentSeason = null;
      return true;
    } catch (error) {
      console.error('Sezon kapatma hatası:', error);
      return false;
    }
  }

  // Sezon leaderboard'unu getir
  async getSeasonLeaderboard(seasonId?: string): Promise<SeasonLeaderboard[]> {
    try {
      const season = seasonId ? await this.getSeasonById(seasonId) : await this.getCurrentSeason();
      
      if (!season) {
        console.error('Sezon bulunamadı');
        return [];
      }

      const { data, error } = await supabase
        .from('season_scores')
        .select(`
          user_id,
          total_score,
          games_played,
          users!inner(
            display_name,
            email,
            avatar_url,
            badges,
            is_first_supporter
          )
        `)
        .eq('season_id', season.id)
        .not('users.display_name', 'is', null)
        .not('users.display_name', 'eq', '')
        .order('total_score', { ascending: false });

      if (error) {
        console.error('Sezon leaderboard getirilemedi:', error);
        return [];
      }

      // Rank hesapla
      const leaderboard: SeasonLeaderboard[] = data.map((item, index) => ({
        userId: item.user_id,
        displayName: item.users.display_name,
        email: item.users.email,
        photoURL: item.users.avatar_url,
        totalScore: item.total_score,
        gamesPlayed: item.games_played,
        rank: index + 1,
        seasonId: season.id,
        badges: item.users.badges,
        isFirstSupporter: item.users.is_first_supporter
      }));

      return leaderboard;
    } catch (error) {
      console.error('Leaderboard getirme hatası:', error);
      return [];
    }
  }

  // Belirli bir sezonu getir
  async getSeasonById(seasonId: string): Promise<Season | null> {
    if (this.seasonCache[seasonId]) {
      return this.seasonCache[seasonId];
    }

    try {
      const { data, error } = await supabase
        .from('seasons')
        .select('*')
        .eq('id', seasonId)
        .single();

      if (error) {
        console.error('Sezon getirilemedi:', error);
        return null;
      }

      this.seasonCache[seasonId] = data;
      return data;
    } catch (error) {
      console.error('Sezon getirme hatası:', error);
      return null;
    }
  }

  // Sezonu name alanına göre getir
  async getSeasonByName(name: string): Promise<Season | null> {
    try {
      const { data, error } = await supabase
        .from('seasons')
        .select('*')
        .eq('name', name)
        .single();

      if (error) {
        console.error('Sezon getirilemedi:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Sezon getirme hatası:', error);
      return null;
    }
  }

  // Tüm sezonları getir
  async getAllSeasons(): Promise<Season[]> {
    try {
      const { data, error } = await supabase
        .from('seasons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Sezonlar getirilemedi:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Sezonlar getirme hatası:', error);
      return [];
    }
  }

  // 2025-26 sezonunu başlat
  async startNewSeason(): Promise<boolean> {
    try {
      const currentDate = new Date();
      const startDate = new Date(currentDate.getFullYear(), 8, 1); // Eylül 1
      const endDate = new Date(currentDate.getFullYear() + 1, 5, 30); // Haziran 30

      const season = await this.createSeason(
        '2025-26 Sezonu',
        '2025-26',
        startDate.toISOString(),
        endDate.toISOString()
      );

      return !!season;
    } catch (error) {
      console.error('Yeni sezon başlatma hatası:', error);
      return false;
    }
  }

  // Silinen kullanıcıların season_scores kayıtlarını temizle
  async cleanupDeletedUsers(): Promise<boolean> {
    try {
      console.log('🧹 Silinen kullanıcıların season_scores kayıtları temizleniyor...');
      
      // Önce mevcut olmayan kullanıcıları bul
      const { data: orphanedScores, error: orphanedError } = await supabase
        .from('season_scores')
        .select(`
          id,
          user_id,
          users!left(display_name)
        `)
        .is('users.display_name', null);

      if (orphanedError) {
        console.error('Orphaned scores bulunamadı:', orphanedError);
        return false;
      }

      if (orphanedScores && orphanedScores.length > 0) {
        console.log(`🗑️ ${orphanedScores.length} adet silinen kullanıcı skoru bulundu, siliniyor...`);
        
        const scoreIds = orphanedScores.map(score => score.id);
        
        const { error: deleteError } = await supabase
          .from('season_scores')
          .delete()
          .in('id', scoreIds);

        if (deleteError) {
          console.error('Silinen kullanıcı skorları silinemedi:', deleteError);
          return false;
        }

        console.log('✅ Silinen kullanıcı skorları başarıyla temizlendi');
        return true;
      } else {
        console.log('✅ Temizlenecek silinen kullanıcı skoru bulunamadı');
        return true;
      }
    } catch (error) {
      console.error('Silinen kullanıcı temizleme hatası:', error);
      return false;
    }
  }

  // Tüm silinen kullanıcıları temizle (hem Supabase hem Firebase)
  async cleanupAllDeletedUsers(): Promise<{ supabase: boolean; firebase: boolean }> {
    const results = { supabase: false, firebase: false };
    
    try {
      console.log('🧹 Tüm silinen kullanıcılar temizleniyor...');
      
      // 1. Supabase temizliği
      console.log('📊 Supabase season_scores temizleniyor...');
      results.supabase = await this.cleanupDeletedUsers();
      
      // 2. Firebase temizliği
      console.log('🔥 Firebase userProfiles temizleniyor...');
      results.firebase = await this.cleanupFirebaseDeletedUsers();
      
      console.log('✅ Temizlik tamamlandı:', results);
      return results;
    } catch (error) {
      console.error('Genel temizlik hatası:', error);
      return results;
    }
  }

  // Firebase'deki silinen kullanıcıları temizle
  private async cleanupFirebaseDeletedUsers(): Promise<boolean> {
    try {
      const { db } = await import('../config/firebase');
      const { collection, query, getDocs, deleteDoc, doc } = await import('firebase/firestore');
      
      const usersRef = collection(db, 'userProfiles');
      const usersSnapshot = await getDocs(usersRef);
      
      let deletedCount = 0;
      const deletePromises: Promise<void>[] = [];
      
      usersSnapshot.forEach((userDoc) => {
        const userData = userDoc.data();
        const displayName = userData.displayName || userData.userName || '';
        
        // Silinen kullanıcıları tespit et
        if (!displayName || 
            displayName.trim() === '' || 
            displayName === 'Anonim' ||
            displayName === 'Silinmiş Kullanıcı' ||
            displayName === 'Deleted User' ||
            displayName === 'İsimsiz Kullanıcı') {
          
          console.log(`🗑️ Firebase'den silinecek kullanıcı: ${userDoc.id} - ${displayName}`);
          deletePromises.push(deleteDoc(doc(db, 'userProfiles', userDoc.id)));
          deletedCount++;
        }
      });
      
      if (deletePromises.length > 0) {
        await Promise.all(deletePromises);
        console.log(`✅ Firebase'den ${deletedCount} kullanıcı silindi`);
        return true;
      } else {
        console.log('✅ Firebase\'de temizlenecek kullanıcı bulunamadı');
        return true;
      }
    } catch (error) {
      console.error('Firebase temizlik hatası:', error);
      return false;
    }
  }
}

export const seasonService = new SeasonService();

