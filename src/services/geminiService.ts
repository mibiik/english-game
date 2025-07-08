import { GoogleGenerativeAI } from "@google/generative-ai";
import { WordFormsQuestion, PrepositionExercise } from '../types';
import { apiKeyManager } from "./apiKeyManager";

const CACHE_PREFIX = 'gemini_cache_';
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 saat

// --- Cache Functions ---
function getFromCache<T>(key: string): T | null {
    const item = localStorage.getItem(CACHE_PREFIX + key);
    if (!item) return null;
    const entry: { timestamp: number; data: T } = JSON.parse(item);
    if (Date.now() - entry.timestamp > CACHE_DURATION) {
        localStorage.removeItem(CACHE_PREFIX + key);
        return null;
    }
    return entry.data;
}

function setInCache<T>(key: string, data: T) {
    const entry = { timestamp: Date.now(), data };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
}

// --- Central API Service Class ---
class GeminiService {
    private static instance: GeminiService;
    private genAI: GoogleGenerativeAI;

    private constructor() {
        this.genAI = new GoogleGenerativeAI(apiKeyManager.getKey());
    }

    public static getInstance(): GeminiService {
        if (!GeminiService.instance) {
            GeminiService.instance = new GeminiService();
        }
        return GeminiService.instance;
    }
    
    private updateApiKey() {
        this.genAI = new GoogleGenerativeAI(apiKeyManager.rotateKey());
    }

    public async makeRequest<T>(prompt: string, config?: any): Promise<T> {
        let retries = 0;
        const maxRetries = 7; // Toplam anahtar sayısı kadar dene

        while (retries < maxRetries) {
            try {
                const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash", ...config });
                const result = await model.generateContent(prompt);
                const response = result.response;
                const text = response.text();
                
                if (!text) throw new Error('No content in response');
                
                const firstBracket = text.indexOf('[');
                const firstBrace = text.indexOf('{');
                let startIndex = -1;

                if (firstBracket === -1) {
                    startIndex = firstBrace;
                } else if (firstBrace === -1) {
                    startIndex = firstBracket;
                } else {
                    startIndex = Math.min(firstBracket, firstBrace);
                }

                if (startIndex === -1) {
                    throw new Error("No JSON object or array found in the AI response.");
                }

                const lastBracket = text.lastIndexOf(']');
                const lastBrace = text.lastIndexOf('}');
                let endIndex = -1;

                if (lastBracket === -1) {
                    endIndex = lastBrace;
                } else if (lastBrace === -1) {
                    endIndex = lastBracket;
                } else {
                    endIndex = Math.max(lastBracket, lastBrace);
                }

                if (endIndex === -1) {
                    throw new Error("Could not find the end of the JSON object or array.");
                }

                const jsonString = text.substring(startIndex, endIndex + 1);

                try {
                    return JSON.parse(jsonString) as T;
                } catch (parseError: any) {
                    console.error("Failed to parse cleaned JSON string:", parseError);
                    console.error("Original text from AI:", text);
                    console.error("Cleaned JSON string attempt:", jsonString);
                    throw new Error(`AI response could not be parsed as JSON. Error: ${parseError.message}`);
                }

            } catch (error: any) {
                if (error.message?.includes('429') || error.message?.includes('rate limit') || error.message?.includes('API key not valid')) {
                    console.warn(`Attempt ${retries + 1} failed with an API error. Rotating key.`);
                    retries++;
                    this.updateApiKey();
                    if (retries >= maxRetries) {
                         throw new Error(`All API keys have been rate-limited. Please try again later.`);
                    }
                } else {
                    console.error("Gemini request error:", error);
                    throw error;
                }
            }
        }
        throw new Error('API request failed after multiple retries.');
    }
    
    public async generateAcademicSentence(): Promise<string> {
        const prompt = 'Generate one academic English sentence with a citation source (e.g., author, year, page). Example: "Climate change affects biodiversity (Smith, 2020, p.45)." Return ONLY the sentence as a raw string, without any additional formatting or JSON.';
        try {
            const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(prompt);
            const response = result.response;
            return response.text();
        } catch (error) {
            console.error('Gemini API error (generateAcademicSentence):', error);
            return 'Rules are beneficial to set ethical standards (Rogers & Zemach, 2018, p.141)'; // Fallback
        }
    }

    public async evaluateParaphrase(originalSentence: string, paraphrasedSentence: string, paraphraseType: string) {
        const prompt = `You will act as an English teacher evaluating a paraphrase attempt. Evaluate the student's paraphrase based on the following criteria and return a response ONLY in a valid JSON object format.
        RULES: Type: "${paraphraseType}", Original: "${originalSentence}", Paraphrase: "${paraphrasedSentence}".
        JSON OUTPUT FORMAT: { "correct": boolean, "similarity": "score as a string from 0-100", "feedback": "Detailed feedback in Turkish.", "suggestion": "Suggestion for improvement in Turkish." }`;
        
        try {
            return await this.makeRequest<any>(prompt, { generationConfig: { responseMimeType: "application/json" } });
        } catch (error) {
            console.error('Gemini API error (evaluateParaphrase):', error);
            return { correct: false, feedback: 'Değerlendirme sırasında bir API hatası oluştu.', suggestion: 'Lütfen tekrar deneyin.', similarity: '0' };
        }
    }

    public async getDefinitionForWord(word: string): Promise<string> {
        const cacheKey = `definition_${word.toLowerCase()}`;
        const cached = getFromCache<string>(cacheKey);
        if (cached) return cached;

        const prompt = `Provide a simple, one-sentence definition in English for the word: "${word}". The definition MUST NOT contain the word itself. Return ONLY the definition as a raw string.`;

        try {
            const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(prompt);
            const definition = result.response.text();

            if (!definition) {
                throw new Error("No definition returned from AI.");
            }

            setInCache(cacheKey, definition);
            return definition;
        } catch (error) {
            console.error(`Error fetching definition for ${word}:`, error);
            return 'Definition could not be loaded at this time.';
        }
    }
}

export const geminiService = GeminiService.getInstance();


// --- Standalone Service Functions ---
export const getDefinitionsForWords = async (words: string[]): Promise<Record<string, string>> => {
    const cacheKey = `definitions_${words.join('_').toLowerCase()}`;
    const cached = getFromCache<Record<string, string>>(cacheKey);
    if (cached) return cached;

    if (words.length === 0) return {};
    
    const prompt = `For the following list of English words, provide a simple, one-sentence definition for each in English. The definition MUST NOT contain the word itself. Return the response as a valid JSON object where keys are the words and values are their definitions. Words: ${words.join(', ')}`;
    
    try {
        const definitions = await geminiService.makeRequest<Record<string, string>>(prompt, { generationConfig: { responseMimeType: "application/json" } });
        setInCache(cacheKey, definitions);
        return definitions;
    } catch (error) {
        console.error("Error fetching definitions from Gemini:", error);
        return words.reduce((acc, word) => ({...acc, [word]: 'Definition could not be loaded.'}), {});
    }
};

export const generateWordFormsExercise = async (words: string[]): Promise<WordFormsQuestion[]> => {
    if (words.length === 0) return [];
    
    const prompt = `Generate ${words.length} distinct B1-level English sentences, each using a different form of one of these headwords: ${words.join(', ')}. Replace the used form with "[BLANK]". Return ONLY a valid JSON object like this: { "questions": [{ "sentence": "...", "headword": "...", "solution": "..." }] }`;
    
    try {
        const result = await geminiService.makeRequest<{ questions: WordFormsQuestion[] }>(prompt, { generationConfig: { responseMimeType: "application/json" } });
        return result.questions;
    } catch (error) {
        console.error("Error fetching word forms exercise:", error);
        throw new Error("Failed to generate word forms exercise.");
    }
};

export const generatePrepositionExercise = async (preps: { prep: string; difficulty: 'easy' | 'medium' | 'hard' }[]): Promise<PrepositionExercise[]> => {
    if (preps.length === 0) return [];
    
    const prompt = `For each of the ${preps.length} prepositions provided, generate a distinct English sentence for the specified level, replacing the preposition with "[BLANK]". Return ONLY a valid JSON object with an "exercises" key, containing an array of objects. Each object must have "sentence", "correctAnswer", and "options" keys. Prepositions: ${JSON.stringify(preps)}`;

    try {
      const result = await geminiService.makeRequest<{ exercises: PrepositionExercise[] }> (prompt, { generationConfig: { responseMimeType: "application/json" }});
      return result.exercises.map((ex: any, index: number) => ({
        ...ex,
        sourcePrep: { prep: preps[index].prep },
        options: ex.options.includes(ex.correctAnswer) ? ex.options : [...ex.options.slice(0,3), ex.correctAnswer]
      }));
    } catch (error) {
      console.error("Error fetching preposition exercises:", error);
      throw new Error("Failed to generate preposition exercises.");
    }
};