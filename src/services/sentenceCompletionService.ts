import { API_KEYS } from '../config/apiKeys';
import { newDetailedWords_part1, WordDetail } from '../data/words';

const allWords = newDetailedWords_part1.map((word: WordDetail) => word.headword);

export interface SentenceQuestion {
  sentence: string;
  correctAnswer: string;
  options: string[];
}

export class SentenceCompletionService {
  private static instance: SentenceCompletionService;
  private retryCount: number = 0;
  private readonly MAX_RETRIES = 3;

  private constructor() {}

  public static getInstance(): SentenceCompletionService {
    if (!SentenceCompletionService.instance) {
      SentenceCompletionService.instance = new SentenceCompletionService();
    }
    return SentenceCompletionService.instance;
  }

  /**
   * API isteği yapar ve yanıtı döndürür
   * @param prompt Gönderilecek prompt
   * @returns API yanıtı
   */
  private async makeApiRequest(prompt: string): Promise<any> {
    const modelConfig = API_KEYS.gemini;
    this.retryCount = 0;

    if (modelConfig.key === 'YOUR_API_KEY' || !modelConfig.key) {
      throw new Error('API anahtarı bulunamadı. Lütfen `src/config/apiKeys.ts` dosyasını kontrol edin.');
    }
    
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${modelConfig.model}:generateContent`;

    while (this.retryCount < this.MAX_RETRIES) {
      try {
        const response = await fetch(`${API_URL}?key=${modelConfig.key}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1000
            }
          })
        });

        if (!response.ok) {
          const errorBody = await response.text();
          console.error("API Hata Detayı:", errorBody);
          
          if (response.status === 503) {
            throw new Error('Gemini API servisi şu anda kullanılamıyor. Lütfen birkaç dakika sonra tekrar deneyin.');
          }
          
          if (response.status === 429) {
            throw new Error('API istek limiti aşıldı. Lütfen birkaç dakika bekleyip tekrar deneyin.');
          }
          
          if (response.status >= 500) {
            this.retryCount++;
            const delay = Math.min(1000 * Math.pow(2, this.retryCount), 8000);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          
          throw new Error(`API yanıt hatası: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        console.error("Fetch sırasında hata:", error);
        if (this.retryCount >= this.MAX_RETRIES - 1) {
          throw error;
        }
        this.retryCount++;
        const delay = Math.min(1000 * Math.pow(2, this.retryCount), 8000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error('Maksimum yeniden deneme sayısına ulaşıldı');
  }

  /**
   * JSON formatındaki metni temizler ve ayrıştırır
   * @param jsonText Temizlenecek ve ayrıştırılacak JSON metni
   * @returns Ayrıştırılmış JSON nesnesi
   */
  private parseJsonSafely(jsonText: string): any {
    try {
      // Markdown kod bloklarını temizle
      let cleaned = jsonText.replace(/```(?:json)?\s*([\s\S]*?)\s*```/g, '$1').trim();
      
      // JSON başlangıç ve bitişini bul
      const startBracket = cleaned.indexOf('[');
      const endBracket = cleaned.lastIndexOf(']');
      
      if (startBracket !== -1 && endBracket !== -1 && startBracket < endBracket) {
        cleaned = cleaned.substring(startBracket, endBracket + 1);
      }
      
      // Temizlenmiş metni ayrıştırmayı deneyelim
      return JSON.parse(cleaned);
    } catch (error) {
      console.error('JSON ayrıştırma hatası:', error);
      
      // Hata durumunda manuel ayrıştırma deneyelim
      return this.extractQuestionsManually(jsonText);
    }
  }

  /**
   * JSON ayrıştırma başarısız olduğunda manuel olarak soru-cevapları çıkarır
   * @param text Ayrıştırılacak metin
   * @returns Çıkarılan soru-cevap dizisi
   */
  private extractQuestionsManually(text: string): any[] {
    const questions: any[] = [];
    
    // Markdown ve gereksiz karakterleri temizle
    let cleaned = text.replace(/```(?:json)?\s*([\s\S]*?)\s*```/g, '$1').trim();
    
    // Regex ile soru-cevap yapılarını bul
    const questionRegex = /"sentence"\s*:\s*"([^"]+)"\s*,\s*"correctAnswer"\s*:\s*"([^"]+)"/g;
    let match;
    
    while ((match = questionRegex.exec(cleaned)) !== null) {
      if (match[1] && match[2]) {
        questions.push({
          sentence: match[1],
          correctAnswer: match[2]
        });
      }
    }
    
    // Eğer regex ile bulunamadıysa, daha basit bir yaklaşım deneyelim
    if (questions.length === 0) {
      // Cümleleri bul (boşluk içeren cümleler)
      const sentenceRegex = /([^"]+___[^"]+)/g;
      const sentences: string[] = [];
      
      while ((match = sentenceRegex.exec(cleaned)) !== null) {
        if (match[1] && match[1].includes('___')) {
          sentences.push(match[1]);
        }
      }
      
      // Doğru cevapları bul
      const answerRegex = /"correctAnswer"\s*:\s*"([^"]+)"/g;
      const answers: string[] = [];
      
      while ((match = answerRegex.exec(cleaned)) !== null) {
        if (match[1]) {
          answers.push(match[1]);
        }
      }
      
      // Eşleşen sayıda cümle ve cevap varsa, bunları birleştir
      const minLength = Math.min(sentences.length, answers.length);
      for (let i = 0; i < minLength; i++) {
        questions.push({
          sentence: sentences[i],
          correctAnswer: answers[i]
        });
      }
    }
    
    return questions;
  }

  /**
   * Verilen kelimeler için cümle tamamlama soruları oluşturur
   * @param words Sorularda kullanılacak kelimeler
   * @returns Oluşturulan cümle tamamlama soruları
   */
  public async generateSentenceCompletions(words: string[]): Promise<SentenceQuestion[]> {
    try {
      const selectedWords = [...words];
      
      const prompt = `
      Task: Create sentence completion questions for the following English words:
      ${selectedWords.join(', ')}

      For each word:
      1. Create an English sentence using the word, but replace the word with "___".
      2. Provide the correct word as the answer.

      IMPORTANT: Your response MUST be ONLY a JSON array in the following format. Do not add any other text, comments or explanations.
      [
        {
          "sentence": "The students are ___ their homework for tomorrow's class.",
          "correctAnswer": "completing"
        },
        {
          "sentence": "She needs to ___ her passport before traveling abroad.",
          "correctAnswer": "renew"
        }
      ]
      `;

      const response = await this.makeApiRequest(prompt);
      const textContent = response.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!textContent) {
        throw new Error('API yanıtında beklenen içerik bulunamadı');
      }
      
      // JSON yanıtını ayrıştır
      let questions = this.parseJsonSafely(textContent);
      
      // Eğer sorular boş gelirse veya dizi değilse, hata fırlat
      if (!Array.isArray(questions) || questions.length === 0) {
        console.error('Geçersiz soru formatı, API yanıtı:', textContent);
        throw new Error('Geçersiz soru formatı alındı');
      }
      
      // Soruları doğrula ve gerekirse düzelt
      questions = questions.filter(q => q && q.sentence && q.correctAnswer);
      
      // Her soru için şıkları oluştur (1 doğru + 3 yanlış şık)
      return questions.map((q: any) => {
        // Doğru cevap dışındaki kelimelerden 3 tane rastgele seç
        const wrongOptions = this.getRandomWrongOptions(q.correctAnswer, 3);
        
        // Tüm şıkları birleştir ve karıştır
        const allOptions = [q.correctAnswer, ...wrongOptions];
        const shuffledOptions = this.shuffleArray(allOptions);
        
        return {
          sentence: q.sentence,
          correctAnswer: q.correctAnswer,
          options: shuffledOptions
        };
      });
    } catch (error) {
      console.error('Cümle tamamlama soruları oluşturulurken hata:', error);
      throw error;
    }
  }
  
  /**
   * Doğru cevap dışındaki kelimelerden rastgele yanlış şıklar seçer
   * @param correctAnswer Doğru cevap
   * @param count Kaç tane yanlış şık seçileceği
   * @returns Seçilen yanlış şıklar
   */
  private getRandomWrongOptions(correctAnswer: string, count: number): string[] {
    // Doğru cevap dışındaki kelimeleri filtrele
    const otherWords = allWords
      .filter((word: string) => word.toLowerCase() !== correctAnswer.toLowerCase());
    
    // Eğer yeterli kelime yoksa, mevcut kelimeleri döndür
    if (otherWords.length <= count) {
      return [...otherWords];
    }
    
    // Rastgele kelimeler seç
    const shuffled = this.shuffleArray([...otherWords]);
    return shuffled.slice(0, count);
  }

  /**
   * Diziyi karıştırır (Fisher-Yates algoritması)
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Özel metin oluşturma için genel amaçlı API çağrısı
   * @param prompt Gönderilecek prompt
   * @returns API yanıtından gelen metin
   */
  public async generateCustomText(prompt: string): Promise<string> {
    try {
      const response = await this.makeApiRequest(prompt);
      const textContent = response.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!textContent) {
        throw new Error('API yanıtında beklenen içerik bulunamadı');
      }
      
      return textContent.trim();
    } catch (error) {
      console.error('Özel metin oluşturulurken hata:', error);
      throw error;
    }
  }
}
