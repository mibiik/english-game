import { puter } from './puterService';

// Oyun sorusunun yapısını tanımlayan tip
export type SentenceQuestion = {
  sentence: string;      // '_____' içeren cümle
  options: string[];       // Cevap şıkları
  correctAnswer: string; // Doğru cevap
  targetWord: string;    // Hedef kelime
};

class SentenceCompletionServiceClass {
  private allWords: string[] = [];

  // Oyun için genel kelime havuzunu ayarlar
  public setWordPool(words: string[]): void {
    this.allWords = words;
  }

  /**
   * Verilen kelimeler için Puter.ai kullanarak cümle tamamlama soruları üretir.
   * @param words Soru üretilecek kelimelerin dizisi
   * @returns Promise<SentenceQuestion[]>
   */
  public async generateSentenceCompletions(words: string[]): Promise<SentenceQuestion[]> {
    if (words.length === 0) {
      return [];
    }

    // AI'dan soru istemek için bir prompt oluştur
    const prompt = `
      You are an API that generates sentence completion questions for English learners.
      For each word in this list: [${words.join(', ')}], create one unique B1-B2 level English sentence.
      The sentence must use the word, but replace the word with '_____'.

      RULES:
      - The sentence must be a clear and natural example of the word's usage.
      - DO NOT provide multiple choices or any extra text, explanations, or markdown.
      - ONLY return a valid JSON array of objects with the following structure:
      [
        {
          "sentence": "The sentence with the word replaced by _____.",
          "targetWord": "the_original_word"
        }
      ]

      EXAMPLE for ["expensive", "delicious"]:
      [
        {
          "sentence": "This restaurant is very _____ compared to others.",
          "targetWord": "expensive"
        },
        {
          "sentence": "The cake she baked was absolutely _____.",
          "targetWord": "delicious"
        }
      ]
    `;

    // Puter.ai API'sini güvenli bir şekilde çağır
    try {
      if (!puter || !puter.ai || typeof puter.ai.chat !== 'function') {
        throw new Error('Puter.js is not loaded or ai.chat API is unavailable. Check index.html and your Puter account.');
      }

      const completion = await puter.ai.chat(prompt, { 
        model: 'gpt-4o-mini' 
      });

      const aiResponse = completion.message.content ?? '';
      const aiQuestions = this.parseAIResponse(aiResponse);

      // AI'dan gelen her soru için şıkları oluştur
      return aiQuestions.map((q: { sentence: string; targetWord: string }) => {
        const wrongOptions = this.generateRandomOptions(q.targetWord, 3);
        const allOptions = [q.targetWord, ...wrongOptions];
        
        return {
          ...q,
          options: this.shuffleArray(allOptions),
          correctAnswer: q.targetWord,
        };
      });

    } catch (error) {
      console.error('Error generating sentence completions:', error instanceof Error ? error.message : JSON.stringify(error));
      // Hata durumunda boş dizi döndürerek uygulamanın çökmesini engelle
      return [];
    }
  }

  /**
   * AI'dan gelen string yanıtı temizler ve JSON'a çevirir.
   * @param response AI'dan gelen ham string
   * @returns array
   */
  private parseAIResponse(response: string): { sentence: string; targetWord: string }[] {
    const match = response.match(/(\[[\s\S]*?\])/);
    if (!match) return [];

    try {
      const questions = JSON.parse(match[0]);
      if (Array.isArray(questions)) {
        return questions.filter(q => q.sentence && q.targetWord && q.sentence.includes('_____'));
      }
    } catch (error) {
      console.error('Failed to parse AI JSON response:', error);
    }
    return [];
  }

  /**
   * Doğru cevap dışındaki kelimelerden rastgele yanlış şıklar üretir.
   * @param correctWord Doğru cevap olan kelime
   * @param count Üretilecek yanlış şık sayısı
   * @returns string[]
   */
  private generateRandomOptions(correctWord: string, count: number): string[] {
    const wrongOptions = this.allWords.filter(word => word !== correctWord);
    return this.shuffleArray(wrongOptions).slice(0, count);
  }

  /**
   * Bir dizinin elemanlarını rastgele karıştırır.
   * @param array Karıştırılacak dizi
   * @returns T[]
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

// Servisin tek bir örneğini (singleton) export et
export const SentenceCompletionService = new SentenceCompletionServiceClass();
