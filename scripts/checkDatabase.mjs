// Supabase veritabanı yapısını kontrol etme scripti
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://djkxksiaaonnjoidrfnj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqa3hrc2lhYW9ubmpvaWRyZm5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMTE0MzYsImV4cCI6MjA3Mzg4NzQzNn0.Q-TUF_zBVi248t-xA-Fgx8ysN5DpzOA5zexA2dou4iY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabase() {
  console.log('🔍 Veritabanı yapısı kontrol ediliyor...\n');

  try {
    // 1. Seasons tablosunu kontrol et
    console.log('📋 Seasons tablosu:');
    const { data: seasons, error: seasonsError } = await supabase
      .from('seasons')
      .select('*')
      .limit(5);

    if (seasonsError) {
      console.error('❌ Seasons tablosu okunamadı:', seasonsError.message);
    } else {
      console.log(`✅ ${seasons?.length || 0} sezon bulundu`);
      seasons?.forEach(season => {
        console.log(`  - ${season.name} (${season.isactive ? 'AKTİF' : 'Pasif'})`);
      });
    }

    // 2. Season_scores tablosunu kontrol et
    console.log('\n📋 Season_scores tablosu:');
    const { data: scores, error: scoresError } = await supabase
      .from('season_scores')
      .select('*')
      .limit(5);

    if (scoresError) {
      console.error('❌ Season_scores tablosu okunamadı:', scoresError.message);
    } else {
      console.log(`✅ ${scores?.length || 0} skor kaydı bulundu`);
    }

    // 3. Game_scores tablosunu kontrol et
    console.log('\n📋 Game_scores tablosu:');
    const { data: gameScores, error: gameScoresError } = await supabase
      .from('game_scores')
      .select('*')
      .limit(5);

    if (gameScoresError) {
      console.error('❌ Game_scores tablosu okunamadı:', gameScoresError.message);
    } else {
      console.log(`✅ ${gameScores?.length || 0} oyun skoru bulundu`);
    }

    // 4. Users tablosunu kontrol et
    console.log('\n📋 Users tablosu:');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, display_name, total_score')
      .limit(5);

    if (usersError) {
      console.error('❌ Users tablosu okunamadı:', usersError.message);
    } else {
      console.log(`✅ ${users?.length || 0} kullanıcı bulundu`);
      users?.forEach(user => {
        console.log(`  - ${user.display_name}: ${user.total_score} puan`);
      });
    }

    // 5. Aktif sezon kontrol et
    console.log('\n🎯 Aktif sezon kontrolü:');
    const { data: activeSeason, error: activeError } = await supabase
      .from('seasons')
      .select('*')
      .eq('isactive', true)
      .single();

    if (activeError) {
      if (activeError.code === 'PGRST116') {
        console.error('❌ AKTİF SEZON BULUNAMADI! Bu puanlama sisteminin çalışmamasının ana nedenidir.');
        console.log('💡 Çözüm: scripts/createSeason.js dosyasını çalıştırın.');
      } else {
        console.error('❌ Aktif sezon kontrolü hatası:', activeError.message);
      }
    } else {
      console.log('✅ Aktif sezon bulundu:', activeSeason.name);
      console.log(`   ID: ${activeSeason.id}`);
    }

  } catch (error) {
    console.error('❌ Beklenmeyen hata:', error);
  }

  console.log('\n✨ Kontrol tamamlandı!');
}

checkDatabase();

