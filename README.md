# EF Vocabulary Game

Bu proje, EF English First müfredatına dayalı bir kelime öğrenme oyunudur. Oyun, farklı ünitelerdeki kelimeleri öğrenmenize ve pratik yapmanıza yardımcı olur.

## Özellikler

### 1. Ünite Seçimi
- EF müfredatından seçilmiş üniteler
- Her ünitede özel kelime grupları
- Detaylı ünite açıklamaları ve kelime sayıları

### 2. Kelime Oyunu
- Her oyunda 8 kelime seçilir
- OpenRouter API ile otomatik cümle oluşturma
- A2-B1 seviyesinde basit ve anlaşılır cümleler
- Boşluk doldurma formatında alıştırmalar

### 3. Puan Sistemi
- Doğru cevaplar için puan kazanma
- İlerleme takibi
- Anlık geri bildirim

### 4. Üniteler

#### Unit 1
- Reading & Writing: Temel okuma ve yazma kelimeleri (22 kelime)
- Listening & Speaking: Temel iletişim kelimeleri (25 kelime)
- Extra Words: Ek pratik kelimeleri (8 kelime)

#### Unit 2
- Reading & Writing: Orta seviye okuma ve yazma kelimeleri (27 kelime)
- Listening & Speaking: İleri seviye iletişim kelimeleri (30 kelime)
- Extra Words: Tamamlayıcı kelimeler (8 kelime)

## Nasıl Oynanır

1. Ana ekrandan bir ünite seçin
2. Seçilen üniteden rastgele 8 kelime ile oyun başlar
3. Her cümlede boş bırakılan yere uygun kelimeyi yazın
4. Cevabınızı kontrol edin ve puanınızı görün
5. Tüm kelimeleri tamamladığınızda oyun biter

## Teknik Detaylar

- React ve TypeScript ile geliştirilmiştir
- OpenRouter API entegrasyonu ile dinamik cümle üretimi
- Tailwind CSS ile modern ve responsive tasarım
- Singleton pattern ile oyun durumu yönetimi

# OpenRouter API Entegrasyonu Dokümantasyonu

Bu dokümantasyon, English Game projesine OpenRouter API entegrasyonunun nasıl yapıldığını ve yeni eklenen özellikleri açıklamaktadır.

## Genel Bakış

English Game projesine iki yeni OpenRouter API modeli entegre edilmiştir:
1. **OpenRouter Quasar Alpha** (`openrouter/quasar-alpha`)
2. **Google Gemini 2.5 Pro** (`google/gemini-2.5-pro-exp-03-25`)

Bu modeller, oyun içerisinde kelimeler için cümle oluşturma, tanım getirme ve boşluk doldurma egzersizleri oluşturma amacıyla kullanılmaktadır.

## Yapılan Değişiklikler

### 1. API Anahtarları Eklenmesi

`src/config/apiKeys.ts` dosyasına iki yeni API anahtarı eklenmiştir:

```typescript
quasar_alpha: {
  key: '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',
  model: 'openrouter/quasar-alpha',
  description: 'OpenRouter Quasar Alpha'
},
gemini_pro_25: {
  key: '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',
  model: 'google/gemini-2.5-pro-exp-03-25',
  description: 'Google Gemini 2.5 Pro'
}
