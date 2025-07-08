import { geminiService } from './geminiService';

export interface SentenceQuestion {
  sentence: string;
  options: string[];
  correctAnswer: string;
  targetWord: string;
}

class SentenceCompletionServiceClass {
  private cache = new Map<string, SentenceQuestion>();
  private allWords: string[] = []; // Sistemdeki tüm kelimeleri tutacak

  // Sistemdeki tüm kelimeleri sakla
  setWordPool(words: string[]): void {
    this.allWords = words;
  }

  async generateSentenceCompletions(words: string[]): Promise<SentenceQuestion[]> {
    if (words.length === 0) return [];

    // Kelime havuzunu güncelle
    this.setWordPool(words);

    // Check cache first
    const cachedQuestions: SentenceQuestion[] = [];
    const uncachedWords: string[] = [];

    words.forEach(word => {
      const cached = this.cache.get(word);
      if (cached) {
        cachedQuestions.push(cached);
      } else {
        uncachedWords.push(word);
      }
    });

    let newQuestions: SentenceQuestion[] = [];

    if (uncachedWords.length > 0) {
      try {
        const prompt = `
        Bu kelimeler için cümle tamamlama soruları oluştur: ${uncachedWords.join(', ')}

        ÖNEMLİ KURALLAR:
        1. Her kelime için doğal bir İngilizce cümle oluştur ve kelimenin yerini _____ ile boş bırak
        2. Sadece cümleyi oluştur, şıkları OLUŞTURMA (şıkları sistem otomatik ekleyecek)
        3. Cümleler B1-B2 seviyesinde olsun
        4. Cümle kelimeyi tam olarak temsil etmeli

        ÖRNEK:
        Kelime: "expensive" 
        Cümle: "This restaurant is very _____ compared to others."

        JSON formatında yanıt ver:
        [
          {
            "sentence": "cümle _____ ile",
            "targetWord": "hedef_kelime"
          }
        ]
        
        Sadece JSON array döndür, başka açıklama ekleme.
        `;

        const response = await geminiService.makeRequest<any[]>(prompt);
        const aiQuestions = Array.isArray(response) ? response : this.parseAIResponse(JSON.stringify(response), uncachedWords);

        // AI'dan gelen cümlelere sistem şıklarını ekle
        newQuestions = aiQuestions.map(aiQ => {
          const wrongOptions = this.generateRandomOptions(aiQ.targetWord, 3);
          const allOptions = [aiQ.targetWord, ...wrongOptions];
          // Şıkları karıştır
          const shuffledOptions = this.shuffleArray(allOptions);
          
          return {
            sentence: aiQ.sentence,
            options: shuffledOptions,
            correctAnswer: aiQ.targetWord,
            targetWord: aiQ.targetWord
          };
        });

        // Cache the new questions
        newQuestions.forEach(question => {
          this.cache.set(question.targetWord, question);
        });

      } catch (error) {
        console.error('Error generating sentence completions:', error);
        // Generate fallback questions
        newQuestions = this.generateFallbackQuestions(uncachedWords);
      }
    }

    return [...cachedQuestions, ...newQuestions];
  }

  private parseAIResponse(response: string, words: string[]): any[] {
    try {
      // Clean the response
      let cleanResponse = response.trim();
      
      // Remove markdown code blocks if present
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/```json\s*/, '').replace(/```\s*$/, '');
      } else if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/```\s*/, '').replace(/```\s*$/, '');
      }

      const questions = JSON.parse(cleanResponse);
      
      if (!Array.isArray(questions)) {
        throw new Error('Response is not an array');
      }

      // Validate and filter questions
      return questions.filter((q: any) => {
        return q.sentence && 
               q.targetWord &&
               q.sentence.includes('_____');
      });

    } catch (error) {
      console.error('Error parsing AI response:', error);
      return words.map(word => ({
        sentence: `The context in this example clearly requires the word _____ to complete the meaning.`,
        targetWord: word
      }));
    }
  }

  // Sistemdeki diğer kelimelerden rastgele yanlış şıklar üret
  private generateRandomOptions(correctWord: string, count: number): string[] {
    if (this.allWords.length === 0) {
      // Fallback: Yaygın kelimeler
      return this.getFallbackWords().filter(w => w !== correctWord).slice(0, count);
    }

    // Sistemdeki diğer kelimelerden rastgele seç
    const availableWords = this.allWords.filter(word => word !== correctWord);
    
    if (availableWords.length < count) {
      // Yeterli kelime yoksa fallback kelimelerle tamamla
      const fallbackWords = this.getFallbackWords().filter(w => w !== correctWord && !availableWords.includes(w));
      return [...availableWords, ...fallbackWords].slice(0, count);
    }

    // Rastgele seç
    return this.shuffleArray(availableWords).slice(0, count);
  }

  private getFallbackWords(): string[] {
    return [
      'important', 'different', 'possible', 'available', 'necessary',
      'beautiful', 'difficult', 'interesting', 'comfortable', 'expensive',
      'wonderful', 'successful', 'powerful', 'peaceful', 'careful',
      'helpful', 'useful', 'grateful', 'meaningful', 'thoughtful',
      'amazing', 'brilliant', 'creative', 'dangerous', 'exciting',
      'fantastic', 'generous', 'honest', 'incredible', 'joyful',
      'kind', 'lucky', 'modern', 'natural', 'obvious', 'perfect',
      'quiet', 'responsible', 'simple', 'terrible', 'unique',
      'valuable', 'wise', 'excellent', 'friendly', 'healthy'
    ];
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private generateFallbackQuestions(words: string[]): SentenceQuestion[] {
    return words.slice(0, 5).map(word => {
      const wrongOptions = this.generateRandomOptions(word, 3);
      const allOptions = [word, ...wrongOptions];
      const shuffledOptions = this.shuffleArray(allOptions);
      
      return {
        sentence: `The context in this example clearly requires the word _____ to complete the meaning.`,
        options: shuffledOptions,
        correctAnswer: word,
        targetWord: word
      };
    });
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}

// Export a singleton instance
export const SentenceCompletionService = new SentenceCompletionServiceClass(); 