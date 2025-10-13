# Veritabanı Yönetim Scriptleri

Bu klasör, Supabase veritabanını yönetmek için gerekli scriptleri içerir.

## Puanlama Sistemi Sorununu Çözme

### 1. Adım: Veritabanı Kontrolü

Önce veritabanı yapısını ve aktif sezon durumunu kontrol edin:

```bash
node scripts/checkDatabase.js
```

### 2. Adım: Aktif Sezon Oluşturma

Eğer aktif sezon yoksa (ki muhtemelen bu puanlama sisteminin çalışmamasının nedeni), yeni bir sezon oluşturun:

```bash
node scripts/createSeason.js
```

Bu script:
- Mevcut aktif sezonu kontrol eder
- Yoksa 2025-26 akademik yılı için yeni bir sezon oluşturur
- Önceki sezonları otomatik olarak kapatır

### 3. Adım: Test Etme

Scriptleri çalıştırdıktan sonra:
1. Uygulamayı yeniden başlatın
2. Bir oyun oynayın
3. Puanların leaderboard'a yansıdığını kontrol edin

## Sorun Giderme

### "Module not found" hatası alırsanız:

Script dosyalarına `.mjs` uzantısı ekleyin:
```bash
mv scripts/checkDatabase.js scripts/checkDatabase.mjs
mv scripts/createSeason.js scripts/createSeason.mjs
```

Ve çalıştırın:
```bash
node scripts/checkDatabase.mjs
node scripts/createSeason.mjs
```

### Supabase bağlantı hatası alırsanız:

1. Supabase URL ve API anahtarının doğru olduğundan emin olun
2. İnternet bağlantınızı kontrol edin
3. Supabase projenizin aktif olduğundan emin olun

## Manuel Çözüm

Script çalışmıyorsa, Supabase Dashboard'dan manuel olarak:

1. `seasons` tablosuna gidin
2. "Insert row" butonuna tıklayın
3. Şu değerleri girin:
   - `name`: "2025-26 Sezonu"
   - `year`: "2025-26"
   - `start_date`: "2025-09-01"
   - `end_date`: "2026-06-30"
   - `isactive`: `true`
4. Diğer aktif sezonların `isactive` değerini `false` yapın

## Gerekli Tablo Yapısı

### seasons
```sql
CREATE TABLE seasons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  year TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  isactive BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### season_scores
```sql
CREATE TABLE season_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  season_id UUID REFERENCES seasons(id) ON DELETE CASCADE,
  total_score INTEGER DEFAULT 0,
  games_played INTEGER DEFAULT 0,
  last_played TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, season_id)
);
```

### game_scores
```sql
CREATE TABLE game_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  game_mode TEXT NOT NULL,
  score INTEGER NOT NULL,
  unit TEXT,
  level TEXT,
  season_id UUID REFERENCES seasons(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```


