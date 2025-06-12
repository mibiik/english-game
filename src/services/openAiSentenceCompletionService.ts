import { API_KEYS } from '../config/apiKeys';

const API_URL = "https://api.openai.com/v1/chat/completions";

export interface SentenceQuestion {
  sentence: string;
  correctAnswer: string;
  options: string[];
}

export class OpenAiSentenceCompletionService {
  private static instance: OpenAiSentenceCompletionService;

  private constructor() {}

  public static getInstance(): OpenAiSentenceCompletionService {
    if (!OpenAiSentenceCompletionService.instance) {
      OpenAiSentenceCompletionService.instance = new OpenAiSentenceCompletionService();
    }
    return OpenAiSentenceCompletionService.instance;
  }

  private async makeApiRequest(prompt: string): Promise<any> {
    const modelConfig = API_KEYS.openai;

    if (!modelConfig.key || modelConfig.key === 'YOUR_OPENAI_API_KEY') {
      throw new Error('OpenAI API anahtarı bulunamadı. Lütfen `src/config/apiKeys.ts` dosyasını kontrol edin.');
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${modelConfig.key}`
      },
      body: JSON.stringify({
        model: modelConfig.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
        const errorBody = await response.json();
        console.error("OpenAI API Hata Detayı:", errorBody);
        throw new Error(`OpenAI API yanıt hatası: ${errorBody.error?.message || response.statusText}`);
    }

    return await response.json();
  }
  
  private parseJsonResponse(jsonText: string): any {
    try {
      return JSON.parse(jsonText);
    } catch (error) {
      console.error('JSON ayrıştırma hatası:', error, 'Gelen metin:', jsonText);
      throw new Error('API yanıtı beklenen JSON formatında değil.');
    }
  }

  public async generateSentenceCompletions(words: string[]): Promise<SentenceQuestion[]> {
    const selectedWords = [...words];
    
    const prompt = `
    Task: Create sentence completion questions for the following English words:
    ${selectedWords.join(', ')}

    For each word:
    1. Create an English sentence using the word, but replace the word with "___".
    2. Provide the correct word as the answer.

    IMPORTANT: Your response MUST be ONLY a valid JSON array of objects in the following format. Do not add any other text, comments or explanations.
    [
      {
        "sentence": "The students are ___ their homework for tomorrow's class.",
        "correctAnswer": "completing"
      }
    ]
    `;

    const response = await this.makeApiRequest(prompt);
    const content = response.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('API yanıtında beklenen içerik bulunamadı');
    }

    const questions = this.parseJsonResponse(content);
    
    if (!Array.isArray(questions) || questions.length === 0) {
      console.error('Geçersiz soru formatı, API yanıtı:', content);
      throw new Error('Geçersiz soru formatı alındı');
    }

    return questions.filter(q => q && q.sentence && q.correctAnswer);
  }
}

export const openAiSentenceService = OpenAiSentenceCompletionService.getInstance(); 