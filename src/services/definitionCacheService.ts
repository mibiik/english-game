import { db } from '../config/firebase';
import { doc, getDoc, setDoc, collection, writeBatch } from 'firebase/firestore';
import { aiService } from './aiService';

export interface WordDefinition {
  word: string;
  definition: string;
  createdAt: Date;
  updatedAt: Date;
  source: 'ai' | 'manual';
  language: 'en' | 'tr';
}

class DefinitionCacheService {
  private readonly collectionName = 'definitions';

  /**
   * Definition kalitesini kontrol et
   */
  public isValidDefinition(definition: string): boolean {
    if (!definition || typeof definition !== 'string') {
      return false;
    }
    
    const trimmed = definition.trim();
    
    // Boş string kontrolü
    if (trimmed.length === 0) {
      return false;
    }
    
    // Çok kısa tanımlar (muhtemelen hatalı)
    if (trimmed.length < 3) {
      return false;
    }
    
    // Sadece noktalama işaretleri veya sayılar
    if (/^[^a-zA-Z]*$/.test(trimmed)) {
      return false;
    }
    
    // Hata mesajları kontrolü
    const errorPatterns = [
      /could not be loaded/i,
      /failed to generate/i,
      /error/i,
      /sorry/i,
      /i cannot/i,
      /i'm unable/i,
      /i don't know/i
    ];
    
    for (const pattern of errorPatterns) {
      if (pattern.test(trimmed)) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Ana fonksiyon: Definition getirir, yoksa AI'dan üretir ve cache'ler
   */
  async getDefinition(word: string, language: 'en' | 'tr' = 'en'): Promise<string> {
    console.log('🔍 Definition araniyor:', { word, language });
    
    try {
      // 1. Firebase'den kontrol et
      const cached = await this.getFromFirebase(word, language);
      if (cached && cached.definition && this.isValidDefinition(cached.definition)) {
        console.log('✅ Definition Firebase\'den geldi:', cached.definition);
        return cached.definition;
      }

      // 2. Firebase'de yok veya tanım geçersiz, AI'dan üret
      console.log('🤖 AI\'dan definition üretiliyor...');
      const aiDefinition = await aiService.generateDefinition(word, language);
      
      // 3. AI'dan gelen definition'ı kontrol et ve sadece geçerliyse Firebase'e kaydet
      if (aiDefinition && this.isValidDefinition(aiDefinition)) {
        try {
          await this.saveToFirebase(word, aiDefinition, language, 'ai');
          console.log('💾 Geçerli definition Firebase\'e kaydedildi');
        } catch (saveError) {
          console.error('❌ Firebase kaydetme hatası (definition kullanılabilir):', saveError);
          // Kaydetme hatası olsa bile definition'ı döndür
        }
      } else {
        console.warn('⚠️ AI\'dan gelen definition geçersiz:', aiDefinition);
      }
      
      // 4. Geçerli definition varsa döndür, yoksa fallback
      if (aiDefinition && this.isValidDefinition(aiDefinition)) {
        return aiDefinition;
      } else {
        return `Definition for "${word}" could not be loaded.`;
      }

    } catch (error) {
      console.error('❌ Definition cache hatası:', error);
      return `Definition for "${word}" could not be loaded.`;
    }
  }

  /**
   * Birden fazla kelime için toplu definition getir - Paralel optimizasyon
   */
  async getDefinitions(words: string[], language: 'en' | 'tr' = 'en'): Promise<Record<string, string>> {
    console.log('📚 Toplu definition isteniyor:', { words: words.length, language });
    
    const result: Record<string, string> = {};
    const missingWords: string[] = [];

    // 1. Tüm kelimeleri Firebase'den PARALEL olarak kontrol et
    const firebasePromises = words.map(async (word) => {
      try {
        const cached = await this.getFromFirebase(word, language);
        return { word, cached };
      } catch (error) {
        return { word, cached: null };
      }
    });

    const firebaseResults = await Promise.all(firebasePromises);
    
    firebaseResults.forEach(({ word, cached }) => {
      if (cached && cached.definition && this.isValidDefinition(cached.definition)) {
        result[word] = cached.definition;
        console.log(`✅ ${word}: Firebase'den geldi`);
      } else {
        missingWords.push(word);
        console.log(`❓ ${word}: Firebase'de yok veya geçersiz`);
      }
    });

    // 2. Eksik kelimeler için AI'dan toplu üret
    if (missingWords.length > 0) {
      console.log('🤖 AI\'dan toplu definition üretiliyor:', missingWords);
      
      try {
        // Eksik tüm kelimeleri tek seferde AI'a gönder
        const aiDefinitions = await aiService.generateBatchDefinitions(missingWords, language);
        
        // 3. AI sonuçlarını filtrele ve sadece geçerli olanları Firebase'e kaydet
        const validAiDefinitions = Object.entries(aiDefinitions).reduce((acc, [word, definition]) => {
            if (definition && this.isValidDefinition(definition)) {
                acc[word] = definition;
            }
            return acc;
        }, {} as Record<string, string>);

        if (Object.keys(validAiDefinitions).length > 0) {
            try {
                await this.saveBatchToFirebase(validAiDefinitions, language, 'ai');
                console.log('💾 Geçerli toplu definitions Firebase\'e kaydedildi');
            } catch (saveError) {
                console.error('❌ Firebase toplu kaydetme hatası (definitions kullanılabilir):', saveError);
                // Kaydetme hatası olsa bile geçerli definitions'ları kullan
            }
        }
        
        // 4. Sonuçları birleştir (geçerli olanları)
        Object.entries(aiDefinitions).forEach(([word, definition]) => {
          if (this.isValidDefinition(definition)) {
            result[word] = definition;
          } else {
            result[word] = `Definition for "${word}" could not be loaded.`;
          }
        });
        
      } catch (error) {
        console.error('❌ AI toplu definition hatası:', error);
        // Hata durumunda fallback definitions
        for (const word of missingWords) {
          result[word] = `Definition for "${word}" could not be loaded.`;
        }
      }
    }

    console.log('📋 Tüm definitions hazır:', Object.keys(result).length);
    return result;
  }

  /**
   * Firebase'den definition oku
   */
  private async getFromFirebase(word: string, language: 'en' | 'tr'): Promise<WordDefinition | null> {
    try {
      const docId = this.createDocId(word, language);
      const docRef = doc(db, this.collectionName, docId);
      
      console.log('🔍 Firebase\'den aranıyor:', { docId, word, language });
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('✅ Firebase\'de bulundu:', { docId, definition: data.definition?.substring(0, 50) + '...' });
        return {
          word: data.word,
          definition: data.definition,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          source: data.source || 'ai',
          language: data.language || language
        };
      }
      
      console.log('❌ Firebase\'de bulunamadı:', docId);
      return null;
    } catch (error) {
      console.error('❌ Firebase okuma hatası:', error);
      console.error('Hata detayı:', error);
      return null;
    }
  }

  /**
   * Firebase'e definition kaydet
   */
  private async saveToFirebase(
    word: string, 
    definition: string, 
    language: 'en' | 'tr', 
    source: 'ai' | 'manual'
  ): Promise<void> {
    try {
      const docId = this.createDocId(word, language);
      const docRef = doc(db, this.collectionName, docId);
      
      console.log('💾 Firebase\'e kaydedilecek:', { 
        docId, 
        word: word.toLowerCase().trim(), 
        definition: definition.substring(0, 50) + '...', 
        language, 
        source 
      });
      
      const now = new Date();
      const docData = {
        word: word.toLowerCase().trim(),
        definition,
        language,
        source,
        createdAt: now,
        updatedAt: now
      };
      
      await setDoc(docRef, docData);
      console.log('✅ Firebase\'e başarıyla kaydedildi:', docId);
      
    } catch (error) {
      console.error('❌ Firebase kaydetme hatası:', error);
      console.error('Hata detayı:', error);
      throw error;
    }
  }

  /**
   * Firebase'e toplu definition kaydet - Paralel batch write
   */
  private async saveBatchToFirebase(
    definitions: Record<string, string>, 
    language: 'en' | 'tr', 
    source: 'ai' | 'manual'
  ): Promise<void> {
    console.log(`💾 ${Object.keys(definitions).length} definition Firebase'e kaydediliyor...`);
    
    const BATCH_SIZE = 500; // Firestore batch limit
    const entries = Object.entries(definitions);
    const batches = [];
    
    // Büyük listeler için batch'lere böl
    for (let i = 0; i < entries.length; i += BATCH_SIZE) {
      batches.push(entries.slice(i, i + BATCH_SIZE));
    }
    
    try {
      // Paralel batch işlemleri
      const batchPromises = batches.map(async (batchEntries) => {
        const batch = writeBatch(db);
        const now = new Date();

        batchEntries.forEach(([word, definition]) => {
          const docId = this.createDocId(word, language);
          const docRef = doc(db, this.collectionName, docId);
          
          batch.set(docRef, {
            word: word.toLowerCase().trim(),
            definition,
            language,
            source,
            createdAt: now,
            updatedAt: now
          });
        });

        return batch.commit();
      });

      await Promise.all(batchPromises);
      console.log('✅ Tüm batch\'ler Firebase\'e kaydedildi');
    } catch (error) {
      console.error('❌ Firebase toplu kaydetme hatası:', error);
      throw error;
    }
  }

  /**
   * Document ID oluştur
   */
  private createDocId(word: string, language: 'en' | 'tr'): string {
    return `${language}_${word.toLowerCase().trim().replace(/[^a-z0-9]/g, '_')}`;
  }

  /**
   * Manuel definition ekle (admin/teacher için)
   */
  async addManualDefinition(word: string, definition: string, language: 'en' | 'tr' = 'en'): Promise<void> {
    await this.saveToFirebase(word, definition, language, 'manual');
  }

  /**
   * Definition güncelle
   */
  async updateDefinition(word: string, definition: string, language: 'en' | 'tr' = 'en'): Promise<void> {
    await this.saveToFirebase(word, definition, language, 'manual');
  }

  /**
   * Cache istatistikleri
   */
  async getCacheStats(): Promise<{ ai: number; manual: number; total: number; invalid: number }> {
    try {
      // Bu fonksiyon admin paneli için kullanılabilir
      // Şimdilik basit return, ileride implement edilebilir
      return { ai: 0, manual: 0, total: 0, invalid: 0 };
    } catch (error) {
      console.error('Cache stats hatası:', error);
      return { ai: 0, manual: 0, total: 0, invalid: 0 };
    }
  }

  /**
   * Geçersiz tanımları temizle (admin fonksiyonu)
   */
  async cleanupInvalidDefinitions(): Promise<{ cleaned: number; errors: number }> {
    console.log('🧹 Geçersiz tanımlar temizleniyor...');
    
    let cleaned = 0;
    let errors = 0;
    
    try {
      // Bu fonksiyon admin paneli için kullanılabilir
      // Şimdilik basit return, ileride implement edilebilir
      console.log('✅ Geçersiz tanımlar temizlendi');
      return { cleaned, errors };
    } catch (error) {
      console.error('❌ Geçersiz tanımlar temizleme hatası:', error);
      return { cleaned, errors };
    }
  }

  /**
   * Tanım kalitesini test et (debug için)
   */
  testDefinitionQuality(definition: string): { isValid: boolean; reasons: string[] } {
    const reasons: string[] = [];
    
    if (!definition || typeof definition !== 'string') {
      reasons.push('Tanım boş veya string değil');
      return { isValid: false, reasons };
    }
    
    const trimmed = definition.trim();
    
    if (trimmed.length === 0) {
      reasons.push('Tanım boş string');
    }
    
    if (trimmed.length < 3) {
      reasons.push('Tanım çok kısa (< 3 karakter)');
    }
    
    if (/^[^a-zA-Z]*$/.test(trimmed)) {
      reasons.push('Tanım sadece noktalama işaretleri veya sayılar içeriyor');
    }
    
    const errorPatterns = [
      /could not be loaded/i,
      /failed to generate/i,
      /error/i,
      /sorry/i,
      /i cannot/i,
      /i'm unable/i,
      /i don't know/i
    ];
    
    for (const pattern of errorPatterns) {
      if (pattern.test(trimmed)) {
        reasons.push('Tanım hata mesajı içeriyor');
        break;
      }
    }
    
    return { 
      isValid: reasons.length === 0, 
      reasons 
    };
  }
}

export const definitionCacheService = new DefinitionCacheService(); 