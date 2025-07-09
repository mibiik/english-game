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
   * Ana fonksiyon: Definition getirir, yoksa AI'dan üretir ve cache'ler
   */
  async getDefinition(word: string, language: 'en' | 'tr' = 'en'): Promise<string> {
    console.log('🔍 Definition araniyor:', { word, language });
    
    try {
      // 1. Firebase'den kontrol et
      const cached = await this.getFromFirebase(word, language);
      if (cached && cached.definition) {
        console.log('✅ Definition Firebase\'den geldi:', cached.definition);
        return cached.definition;
      }

      // 2. Firebase'de yok veya tanım boş, AI'dan üret
      console.log('🤖 AI\'dan definition üretiliyor...');
      const aiDefinition = await aiService.generateDefinition(word, language);
      
      // 3. AI'dan gelen definition'ı Firebase'e kaydet (sadece doluysa)
      if (aiDefinition) {
        await this.saveToFirebase(word, aiDefinition, language, 'ai');
        console.log('💾 Definition Firebase\'e kaydedildi');
      }
      
      return aiDefinition;

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
      if (cached && cached.definition) {
        result[word] = cached.definition;
        console.log(`✅ ${word}: Firebase'den geldi`);
      } else {
        missingWords.push(word);
        console.log(`❓ ${word}: Firebase'de yok`);
      }
    });

    // 2. Eksik kelimeler için AI'dan toplu üret
    if (missingWords.length > 0) {
      console.log('🤖 AI\'dan toplu definition üretiliyor:', missingWords);
      
      try {
        // Eksik tüm kelimeleri tek seferde AI'a gönder
        const aiDefinitions = await aiService.generateBatchDefinitions(missingWords, language);
        
        // 3. AI sonuçlarını Firebase'e toplu kaydet (sadece geçerli olanları)
        const validAiDefinitions = Object.entries(aiDefinitions).reduce((acc, [word, definition]) => {
            if (definition && definition.trim() !== '') {
                acc[word] = definition;
            }
            return acc;
        }, {} as Record<string, string>);

        if (Object.keys(validAiDefinitions).length > 0) {
            await this.saveBatchToFirebase(validAiDefinitions, language, 'ai');
            console.log('💾 Toplu definition Firebase\'e kaydedildi');
        }
        
        // 4. Sonuçları birleştir
        Object.assign(result, aiDefinitions);
        
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
  async getCacheStats(): Promise<{ ai: number; manual: number; total: number }> {
    // Bu fonksiyon admin paneli için kullanılabilir
    // Şimdilik basit return, ileride implement edilebilir
    return { ai: 0, manual: 0, total: 0 };
  }
}

export const definitionCacheService = new DefinitionCacheService(); 