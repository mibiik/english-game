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