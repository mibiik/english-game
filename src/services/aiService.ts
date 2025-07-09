import { puter } from './puterService';
import { PrepositionExercise, WordForms } from '../types';

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

  private cleanJson(text: string): string {
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
    const prompt = `Provide different forms (noun, verb, adjective, adverb) for the English word "${word}"...`; // prompt
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
}

export const aiService = new AiService(); 