import { db } from '../config/firebase';
import { doc, getDoc, setDoc, collection, writeBatch } from 'firebase/firestore';
import { geminiService } from './geminiService';
import { apiKeyManager } from './apiKeyManager';

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
      if (cached) {
        console.log('✅ Definition Firebase\'den geldi:', cached.definition);
        return cached.definition;
      }

      // 2. Firebase'de yok, AI'dan üret
      console.log('🤖 AI\'dan definition üretiliyor...');
      const aiDefinition = await this.generateWithAI(word, language);
      
      // 3. AI'dan gelen definition'ı Firebase'e kaydet
      await this.saveToFirebase(word, aiDefinition, language, 'ai');
      
      console.log('💾 Definition Firebase\'e kaydedildi');
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
      if (cached) {
        result[word] = cached.definition;
        console.log(`✅ ${word}: Firebase'den geldi`);
      } else {
        missingWords.push(word);
        console.log(`❓ ${word}: Firebase'de yok`);
      }
    });

    // 2. Eksik kelimeler için AI'dan toplu üret - Batch'lere bölerek
    if (missingWords.length > 0) {
      console.log('🤖 AI\'dan toplu definition üretiliyor:', missingWords);
      
      const BATCH_SIZE = 10; // Her batch'te max 10 kelime
      const batches = [];
      
      for (let i = 0; i < missingWords.length; i += BATCH_SIZE) {
        batches.push(missingWords.slice(i, i + BATCH_SIZE));
      }
      
      try {
        // Paralel batch işleme
        const batchPromises = batches.map(batch => 
          this.generateBatchWithAI(batch, language)
        );
        
        const batchResults = await Promise.all(batchPromises);
        
        // Tüm batch sonuçlarını birleştir
        const aiDefinitions = batchResults.reduce((acc, batchResult) => ({
          ...acc,
          ...batchResult
        }), {});
        
        // 3. AI sonuçlarını Firebase'e toplu kaydet
        await this.saveBatchToFirebase(aiDefinitions, language, 'ai');
        
        // 4. Sonuçları birleştir
        Object.assign(result, aiDefinitions);
        console.log('💾 Toplu definition Firebase\'e kaydedildi');
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
   * AI'dan tek definition üret
   */
  private async generateWithAI(word: string, language: 'en' | 'tr'): Promise<string> {
    const prompt = language === 'en' 
      ? `Define the English word "${word}" in one clear sentence. The definition MUST NOT contain the word itself. Return only the definition as plain text, no JSON.`
      : `İngilizce "${word}" kelimesinin Türkçe anlamını tek cümle halinde ver. Tanım kelimenin kendisini içermemeli. Sadece tanımı ver, JSON formatında değil.`;

    console.log('🤖 AI prompt hazırlandı:', prompt);
    
    try {
      // Gemini servisini text modu için kullan - JSON olmadan
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKeyManager.getKey()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });
      
      const data = await response.json();
      const definition = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      console.log('🤖 AI definition alındı:', definition.substring(0, 100) + '...');
      return definition.trim();
    } catch (error) {
      console.error('❌ AI definition üretme hatası:', error);
      throw error;
    }
  }

  /**
   * AI'dan toplu definition üret
   */
  private async generateBatchWithAI(words: string[], language: 'en' | 'tr'): Promise<Record<string, string>> {
    const prompt = language === 'en'
      ? `For each English word in this list, provide a simple one-sentence definition. Definitions MUST NOT contain the word being defined. Return as JSON object with words as keys and definitions as values. Words: ${words.join(', ')}`
      : `Bu İngilizce kelimeler için Türkçe tanımlar ver. Her tanım tek cümle olsun ve tanımlanan kelimeyi içermesin. JSON formatında döndür. Kelimeler: ${words.join(', ')}`;

    try {
      const definitions = await geminiService.makeRequest<Record<string, string>>(
        prompt, 
        { generationConfig: { responseMimeType: "application/json" } }
      );
      return definitions;
    } catch (error) {
      console.error('AI toplu definition üretme hatası:', error);
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