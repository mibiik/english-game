import { aiService } from './aiService';

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
        You are an API that generates sentence completion questions.
        For each word in this list: [${uncachedWords.join(', ')}], create one B1-B2 level English sentence.
        The sentence must use the word, but replace the word with '_____'.

        RULES:
        - The sentence must be a clear and natural example of the word's usage.
        - DO NOT provide multiple choices.
        - DO NOT add any extra text, explanations, or markdown.
        - ONLY return a valid JSON array of objects.

        JSON structure:
        [
          {
            "sentence": "The sentence with the word replaced by _____.",
            "targetWord": "the_original_word"
          }
        ]

        EXAMPLE for ["expensive"]:
        [
          {
            "sentence": "This restaurant is very _____ compared to others.",
            "targetWord": "expensive"
          }
        ]
        `;

        const response = await aiService.generateSentenceCompletion(prompt);
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
      // Hata durumunda daha genel bir yedek soru üret
      return words.map(word => ({
        sentence: `Learning new vocabulary is an _____ step to mastering a language.`,
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
      
      // Daha genel bir yedek soru kullan
      return {
        sentence: `It is _____ to study regularly to improve your skills.`,
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