// Aktif sezon oluşturma scripti
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://djkxksiaaonnjoidrfnj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqa3hrc2lhYW9ubmpvaWRyZm5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMTE0MzYsImV4cCI6MjA3Mzg4NzQzNn0.Q-TUF_zBVi248t-xA-Fgx8ysN5DpzOA5zexA2dou4iY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createActiveSeason() {
  try {
    console.log('🔍 Aktif sezon kontrol ediliyor...');
    
    // Önce mevcut aktif sezonları kontrol et
    const { data: existingSeasons, error: checkError } = await supabase
      .from('seasons')
      .select('*')
      .eq('isactive', true);

    if (checkError) {
      console.error('❌ Sezon kontrol hatası:', checkError);
      return;
    }

    if (existingSeasons && existingSeasons.length > 0) {
      console.log('✅ Aktif sezon zaten mevcut:', existingSeasons[0].name);
      console.log('Sezon ID:', existingSeasons[0].id);
      return;
    }

    console.log('📝 Yeni aktif sezon oluşturuluyor...');

    // Önceki tüm sezonları kapat
    const { error: closeError } = await supabase
      .from('seasons')
      .update({ isactive: false })
      .eq('isactive', true);

    if (closeError) {
      console.error('❌ Önceki sezonları kapatma hatası:', closeError);
    }

    // Yeni sezon oluştur - 2025-26 Akademik Yılı
    const currentDate = new Date();
    const startDate = new Date(2025, 8, 1); // 1 Eylül 2025
    const endDate = new Date(2026, 5, 30); // 30 Haziran 2026

    const { data: newSeason, error: createError } = await supabase
      .from('seasons')
      .insert({
        name: '2025-26 Sezonu',
        year: '2025-26',
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        isactive: true,
        created_at: currentDate.toISOString(),
        updated_at: currentDate.toISOString()
      })
      .select()
      .single();

    if (createError) {
      console.error('❌ Sezon oluşturma hatası:', createError);
      return;
    }

    console.log('✅ Yeni sezon başarıyla oluşturuldu!');
    console.log('📋 Sezon detayları:');
    console.log('  - ID:', newSeason.id);
    console.log('  - İsim:', newSeason.name);
    console.log('  - Yıl:', newSeason.year);
    console.log('  - Başlangıç:', new Date(newSeason.start_date).toLocaleDateString('tr-TR'));
    console.log('  - Bitiş:', new Date(newSeason.end_date).toLocaleDateString('tr-TR'));

  } catch (error) {
    console.error('❌ Beklenmeyen hata:', error);
  }
}

createActiveSeason();


