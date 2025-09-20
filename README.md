# Koç Üniversitesi Kelime Öğrenme Uygulaması

Bu uygulama, İngilizce kelime öğrenmeyi eğlenceli ve etkileşimli hale getiren çeşitli oyun modları sunar. Firebase entegrasyonu sayesinde kullanıcılar kendi kelime listelerini oluşturabilir, düzenleyebilir ve paylaşabilirler.

## Özellikler

- **Kullanıcı Kimlik Doğrulama**: Firebase Authentication ile güvenli giriş ve kayıt sistemi
- **Kişiselleştirilmiş Kelime Listeleri**: Kullanıcılar kendi kelime listelerini oluşturabilir ve yönetebilir
- **Kelime Listesi İçe Aktarma**: Metin veya dosya yükleme yoluyla toplu kelime ekleme
- **Kelime Listesi Paylaşımı**: Kullanıcılar kelime listelerini başkalarıyla paylaşabilir
- **Çeşitli Oyun Modları**: Eşleştirme, çoktan seçmeli, kelime kartları ve daha fazlası
- **Ünite Bazlı Öğrenme**: Farklı ünitelerdeki kelimeleri ayrı ayrı öğrenme imkanı
- **İlerleme Takibi**: Öğrenilen kelimelerin ve oyun skorlarının kaydedilmesi
- **Mobil Uyumlu Tasarım**: Her cihazda sorunsuz çalışan responsive arayüz

## Kurulum

1. Projeyi klonlayın veya indirin
2. Bağımlılıkları yükleyin: `npm install`
3. Firebase projenizi oluşturun ve yapılandırın (aşağıdaki adımlara bakın)
4. Uygulamayı başlatın: `npm run dev`

## Firebase Yapılandırması

Uygulamayı kullanabilmek için bir Firebase projesi oluşturmanız ve yapılandırmanız gerekmektedir:

1. [Firebase Console](https://console.firebase.google.com/)'a gidin ve yeni bir proje oluşturun
2. Authentication hizmetini etkinleştirin ve E-posta/Şifre sağlayıcısını açın
3. Firestore Database'i oluşturun ve kuralları aşağıdaki gibi ayarlayın:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /wordLists/{document} {
      allow read: if request.auth != null && (resource.data.userId == request.auth.uid || resource.data.isPublic == true);
      allow write: if request.auth != null && (resource.data.userId == request.auth.uid || resource.id == request.auth.uid);
    }
    match /gameScores/{document} {
      allow read: if true;
      allow write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

4. Web uygulaması ekleyin ve Firebase yapılandırma bilgilerini alın
5. Proje kök dizininde `.env` dosyası oluşturun ve Firebase yapılandırma bilgilerinizi ekleyin:

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## Kullanım

### Kullanıcı Kaydı ve Girişi

1. Uygulamanın sağ menüsündeki "Kayıt Ol / Giriş Yap" butonuna tıklayın
2. Yeni bir hesap oluşturmak için "Hesabınız yok mu? Kayıt olun" bağlantısına tıklayın
3. E-posta, şifre ve kullanıcı adı bilgilerinizi girin
4. Kayıt olduktan sonra aynı bilgilerle giriş yapabilirsiniz

### Kelime Listesi Oluşturma

1. Sağ menüdeki "Kelime Listelerim" butonuna tıklayın
2. "Yeni Liste Oluştur" butonuna tıklayın
3. Liste adı ve açıklaması girin
4. "Oluştur" butonuna tıklayın

### Kelime Ekleme

1. "Özel Kelimeler" oyun moduna tıklayın
2. Kelime eklemek istediğiniz listeyi seçin veya yeni bir liste oluşturun
3. İngilizce kelime, Türkçe karşılığı ve ünite bilgilerini girin
4. "Kelimeyi Ekle" butonuna tıklayın

### Kelime Listesi İçe Aktarma

1. Sağ menüdeki "Kelime Listelerim" butonuna tıklayın
2. "İçe Aktar" butonuna tıklayın
3. Kelimeleri metin kutusuna girin veya bir metin dosyası yükleyin
4. "Devam Et" butonuna tıklayın
5. Liste adı ve açıklaması girin
6. "Kelimeleri İçe Aktar" butonuna tıklayın

### Oyun Oynama

1. Sağ menüden bir oyun modu seçin
2. Oyun başladığında, kendi kelime listenizi veya varsayılan listeyi kullanabilirsiniz
3. Oyun talimatlarını takip ederek kelime öğrenmeye başlayın

## Üniteler

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
