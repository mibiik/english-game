import { puter, isPuterAvailable } from './puterService';
import { PrepositionExercise, WordForms } from '../types';

export async function generateAIResponse(prompt: string): Promise<string> {
  try {
    // Puter'ın kullanılabilir olup olmadığını kontrol et
    if (!isPuterAvailable()) {
      console.warn('⚠️ Puter.com API kullanılamıyor. Alternatif yanıt döndürülüyor.');
      return 'Üzgünüm, şu anda AI servisi kullanılamıyor. Lütfen daha sonra tekrar deneyin.';
    }

    console.log('🤖 Puter.js ile istek yapılıyor (model: gpt-4o-mini)');
    const result = await puter.ai.chat(prompt, {
      model: 'gpt-4o-mini'
    });
    
    console.log('🤖 Puter.js yanıtı alındı:', result.message.content);
    return result.message.content;
  } catch (error) {
    console.error('Puter.js AI isteği başarısız:', error);
    return 'Üzgünüm, AI servisi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.';
  }
}

class AiService {
  public async generateText(prompt: string): Promise<string> {
    if (!puter) {
        throw new Error('Puter is not available.');
    }
    try {
      console.log('🤖 Puter.js ile istek yapılıyor (model: gpt-4o-mini)');
      const result = await puter.ai.chat(prompt, {
        model: 'gpt-4o-mini'
      });
      console.log('🤖 Puter.js yanıtı alındı:', result.message.content);
      return result.message.content;
    } catch (error) {
      console.error('Puter.js AI isteği başarısız:', error);
      throw new Error('AI service failed');
    }
  }

  public async generateDefinition(word: string, language: 'en' | 'tr' = 'en'): Promise<string> {
    const prompt = `Provide a short, clear definition for the English word "${word}". Keep it under 15 words. Give only the definition, no additional explanation.`;
    
    try {
      const response = await this.generateText(prompt);
      return response.trim();
    } catch (error) {
      console.error('Definition generation failed:', error);
      throw new Error(`Failed to generate definition for "${word}".`);
    }
  }

  public async generateBatchDefinitions(words: string[], language: 'en' | 'tr' = 'en'): Promise<Record<string, string>> {
    const prompt = `Provide short, clear definitions for these English words. Keep each definition under 15 words. Return in JSON format:

Words: ${words.join(', ')}

JSON format:
{
  "${words[0]}": "short definition",
  "${words[1]}": "short definition"
}

Only return the JSON object, no additional text.`;

    try {
      const response = await this.generateText(prompt);
      const cleanedJson = this.cleanJson(response);
      return JSON.parse(cleanedJson);
    } catch (error) {
      console.error('Batch definitions generation failed:', error);
      // Fallback: return empty definitions for each word
      const fallback: Record<string, string> = {};
      words.forEach(word => {
        fallback[word] = `Definition for "${word}" could not be loaded.`;
      });
      return fallback;
    }
  }

  public cleanJson(text: string): string {
    const match = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
        return match[1].trim();
    }
    const jsonStartIndex = text.indexOf('{');
    const jsonEndIndex = text.lastIndexOf('}');
    if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
        return text.substring(jsonStartIndex, jsonEndIndex + 1);
    }
    const arrayStartIndex = text.indexOf('[');
    const arrayEndIndex = text.lastIndexOf(']');
    if (arrayStartIndex !== -1 && arrayEndIndex !== -1) {
        return text.substring(arrayStartIndex, arrayEndIndex + 1);
    }
    return text.trim();
  }
  
  public async generatePrepositionExercise(): Promise<PrepositionExercise[]> {
    const prompt = `Create 5 English sentences for a preposition exercise...`; // prompt
    try {
      const response = await this.generateText(prompt);
      const cleanedJson = this.cleanJson(response);
      return JSON.parse(cleanedJson);
    } catch (error) {
      console.error('Preposition exercise generation failed:', error);
      throw new Error('Failed to generate preposition exercise.');
    }
  }

  public async generateWordFormsQuestion(prompt: string): Promise<any[]> {
    try {
      const response = await this.generateText(prompt);
      const cleanedJson = this.cleanJson(response);
      return JSON.parse(cleanedJson);
    } catch (error) {
      console.error('generateWordFormsQuestion failed:', error);
      throw error;
    }
  }

  public async generateWordForms(word: string): Promise<WordForms> {
    const prompt = `Provide different forms (noun, verb, adjective, adverb) for the English word "${word}" with their specific definitions. When a word can be both verb and adjective (like "clean"), provide distinct definitions for each usage. Return in this exact JSON format:

{
  "noun": {
    "word": "the noun form of ${word}",
    "definition": "definition when used as noun"
  },
  "verb": {
    "word": "the verb form of ${word}", 
    "definition": "definition when used as verb"
  },
  "adjective": {
    "word": "the adjective form of ${word}",
    "definition": "definition when used as adjective"
  },
  "adverb": {
    "word": "the adverb form of ${word}",
    "definition": "definition when used as adverb"
  }
}

If a form doesn't exist, use "N/A" for the word and "This form is not applicable" for the definition.
Keep definitions under 12 words each.
Only return the JSON object, no additional text.`;

    try {
      const response = await this.generateText(prompt);
      const cleanedJson = this.cleanJson(response);
      return JSON.parse(cleanedJson);
    } catch (error)
    {
      console.error('Word forms generation failed:', error);
      throw new Error('Failed to generate word forms.');
    }
  }

  public async generateSentenceCompletion(prompt: string): Promise<string> {
    return this.generateText(prompt);
  }
}

export const aiService = new AiService(); 