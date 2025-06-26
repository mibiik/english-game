import { WordDetail } from '../data/words';
import { geminiService } from './geminiService'; // Merkezi servisi import et

export interface SentenceQuestion {
  sentence: string;
  correctAnswer: string;
  options: string[];
}

// Diğer kelime listesi importları (allWords, shuffleArray vb.) burada kalabilir
import { allWords as allWordStrings } from '../data/allWords';

function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function getRandomWrongOptions(correctAnswer: string, count: number): string[] {
    const otherWords: string[] = allWordStrings
      .filter((word: string) => word.toLowerCase() !== correctAnswer.toLowerCase());
    return shuffleArray(otherWords).slice(0, count);
}

export class SentenceCompletionService {
    private static instance: SentenceCompletionService;

    private constructor() {}

    public static getInstance(): SentenceCompletionService {
        if (!SentenceCompletionService.instance) {
            SentenceCompletionService.instance = new SentenceCompletionService();
        }
        return SentenceCompletionService.instance;
    }

    public async generateSentenceCompletions(words: string[]): Promise<SentenceQuestion[]> {
        const prompt = `
        Task: Create sentence completion questions for the following English words: ${words.join(', ')}
        For each word:
        1. Create an English sentence using the word, but replace the word with "___".
        2. Provide the correct word as the answer.
        IMPORTANT: Your response MUST be ONLY a JSON array in the following format. Do not add any other text, comments or explanations.
        [
          {
            "sentence": "The students are ___ their homework for tomorrow's class.",
            "correctAnswer": "completing"
          }
        ]
        `;
        
        try {
            const result = await geminiService.makeRequest<any[]>(prompt, { generationConfig: { responseMimeType: "application/json" }});
            
            const questions = result.filter(q => q && q.sentence && q.correctAnswer);

            return questions.map((q: any) => {
                const wrongOptions = getRandomWrongOptions(q.correctAnswer, 3);
                const allOptions = [q.correctAnswer, ...wrongOptions];
                const shuffledOptions = shuffleArray(allOptions);
                return {
                    sentence: q.sentence,
                    correctAnswer: q.correctAnswer,
                    options: shuffledOptions,
                };
            });
        } catch (error) {
            console.error('Sentence completion generation error:', error);
            throw new Error('Failed to generate sentence completion questions.');
        }
    }
}
