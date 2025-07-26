# Gemini AI Entegrasyonu

Academic Essay Writing Oyunu artık **Gemini AI** ile desteklenmektedir! 🤖

## ELC & Koç Üniversitesi Pre-Intermediate Writing Standartları

## Kurulum

1. Google AI Studio'dan API key alın: [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)

2. Proje kök dizininde `.env` dosyası oluşturun:
```
REACT_APP_GEMINI_API_KEY=your_api_key_here
```

3. API key'inizi `.env` dosyasına ekleyin

## Özellikler

### AI Değerlendirmesi (ELC Standard Rubric)
- **Task Achievement** (25 puan): Addresses topic, meets word count (min 150 words), includes all parts, stays on topic
- **Organization & Coherence** (25 puan): 5 paragraf yapısı, thesis statement, topic sentences, logical flow
- **Language Use & Vocabulary** (25 puan): Target vocabulary usage, transition words, grammar, sentence variety
- **Content Development** (25 puan): Supporting ideas, relevant examples, clear explanations, depth of analysis

### Essay Yapısı Gereksinimleri
- **Introduction**: Hook + Background + Thesis statement
- **Body Paragraphs (3 adet)**: Topic sentence + Supporting ideas + Details/Examples
- **Conclusion**: Restate thesis + Summary + Final thought
- **Transitions**: First, Second, Finally, In conclusion, As a result

### Puan Sistemi
- Kelime kullanımı: Her kelime için 15 puan
- AI değerlendirmesi: AI puanının %60'ı
- Uzunluk bonusu: 500+ karakter için 30 puan

### AI Geri Bildirimi & ELC Error Codes
- **ELC Standard Rubric** kriterlerine göre değerlendirme
- **Error Codes**: GR (Grammar), VOC (Vocabulary), WO (Word Order), etc.
- **Incomplete Text Warning**: Eksik bölümler için uyarı sistemi
- **Word Count Control**: Minimum 150 kelime kontrolü
- **Off-topic Detection**: Konudan sapma tespiti
- Office hours için öğretmen geri bildirimi önerisi
- Türkçe detaylı analiz ve gelişim önerileri

## ELC Assessment Rules

### 📋 Standard Grading Practices
- **Standard Rubrics**: Task Achievement, Organization, Language Use, Content Development
- **Error Codes**: Focused feedback ile birlikte ELC hata kodları
- **Detailed Feedback**: Office hours sırasında öğretmenlerden detaylı açıklama

### ⚠️ Common Ground Rules
1. **Incomplete Texts**:
   - Eksik bölümler (giriş, sonuç vb.) tüm rubrik alanlarını negatif etkiler
   - Kelime limiti altında metinler ciddi puan kaybına neden olur
   
2. **Irrelevant (Off-topic) Texts**:
   - Kısmen konudan sapma: Tüm rubrik alanları negatif etkilenir
   - Tamamen konudan sapma: 0 puan

### 📊 Minimum Requirements
- **Kelime Sayısı**: Minimum 150 kelime (Pre-Intermediate)
- **Yapı**: 5 paragraf (Giriş + 3 Body + Sonuç) 
- **İçerik**: Konuya uygun, tam geliştirilmiş fikirler

## Güvenlik
- API key asla kodda saklanmaz
- Çevre değişkeni (.env) kullanılır
- Hata durumunda fallback sistem devreye girer 