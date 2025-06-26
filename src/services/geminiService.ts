import { GeminiResponse } from '../types/gemini';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { API_KEYS } from "../config/apiKeys";
import { WordFormsQuestion, PrepositionExercise } from '../types';

export class GeminiService {
  private static instance: GeminiService;
  private readonly apiKey: string = 'AIzaSyAnkPExJz2hCU5USIPIpJLEHht3mOvao3I';
  private readonly apiEndpoint: string = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  private constructor() {}

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  public async generateAcademicSentence(): Promise<string> {
    try {
      const response = await fetch(`${this.apiEndpoint}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Generate an academic English sentence with a citation source (author, year, page). Example: "Climate change affects biodiversity (Smith, 2020, p.45)."'
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid API response structure');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API error:', error);
      return 'Rules are beneficial to set ethical standards (Rogers & Zemach, 2018, p.141)';
    }
  }

  async evaluateParaphrase(originalSentence: string, paraphrasedSentence: string, paraphraseType: string) {
    const prompt = `
      You will act as an English teacher evaluating a paraphrase attempt.
      Evaluate the student's paraphrase based on the following criteria and return a response ONLY in a valid JSON object format.

      EVALUATION CRITERIA:
      1.  Paraphrase Type Control: Is it appropriate for the "${paraphraseType}" type?
      2.  Meaning Preservation: Is the original meaning preserved?
      3.  Word Choice: Are different words used?
      4.  Citation Format: Is the source cited correctly for the type?
      5.  Grammar: Is it grammatically correct?

      SCORING (out of 100):
      -   Type Appropriateness: 40 points
      -   Meaning Preservation: 30 points
      -   Word Choice: 20 points
      -   Grammar: 10 points

      RULES FOR CITATION TYPES:
      -   "parenthetical": Source must be in parentheses: (Author, Year) or (Author, Year, p.X).
      -   "reporting": Author's name is part of the sentence with a verb: "Smith (2020) argues that..."
      -   "according": Must start with "According to": "According to Smith (2020), ..."

      A score of 70+ is considered correct.

      Original Sentence: "${originalSentence}"
      Student's Paraphrase: "${paraphrasedSentence}"
      Paraphrase Type: "${paraphraseType}"

      JSON OUTPUT FORMAT:
{
        "correct": boolean,
        "similarity": "score as a string from 0-100",
        "feedback": "Detailed feedback in Turkish, explaining the score and evaluation.",
        "suggestion": "A suggestion for improvement in Turkish."
      }
    `;

    try {
      const genAI = new GoogleGenerativeAI(API_KEYS.gemini.key);
      const model = genAI.getGenerativeModel({
        model: API_KEYS.gemini.model,
        generationConfig: {
          responseMimeType: "application/json",
        },
      });

      const result = await model.generateContent(prompt);
      const response = result.response;
      const content = response.text();

      if (!content) {
        throw new Error('Invalid API response: No content found.');
      }

      const parsedContent = JSON.parse(content);
      
      return this.parseEvaluationResponse(JSON.stringify(parsedContent));

    } catch (error) {
      console.error('Gemini API error (evaluateParaphrase):', error);
      return {
        correct: false,
        feedback: 'Değerlendirme sırasında bir API hatası oluştu. Lütfen tekrar deneyin.',
        suggestion: 'Sistem yanıt veremedi. Geliştirici konsolunu kontrol ediniz.',
        similarity: '0'
      };
    }
  }

  public async getWordMeaning(word: string): Promise<string> {
    try {
      const response = await fetch(`${this.apiEndpoint}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Lütfen aşağıdaki İngilizce kelime için kısa ve öz bir yanıt ver. Yanıtını şu formatta yapılandır:

(İpucu: Anlamını öğrenmek istediğiniz kelimelerin üzerine tıklayabilirsiniz)


**Anlam:** (Türkçe karşılığı, 1-2 kelime)
**Örnek:** (Kısa bir İngilizce örnek cümle)

Kelime: ${word}`
            }]
          }]
        })
      });

      const data = await response.json();
      const meaning = data.candidates[0].content.parts[0].text;
      
      // Yıldızlı ifadeleri kalın yazıya çevir
      const formattedMeaning = meaning.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      return formattedMeaning.trim();
    } catch (error) {
      console.error('Gemini API error:', error);
      return 'Üzgünüm, şu anda kelime anlamına ulaşılamıyor. Lütfen tekrar deneyin.';
    }
  }

  public async generateWordFormsExercise(words: string[]): Promise<WordFormsQuestion[]> {
    const prompt = `
      You are an English teacher creating an exercise.
      Generate 10 distinct English sentences at a B1-level. Each sentence must use a different form of one of the following 10 headwords: ${words.join(', ')}.

      RULES:
      1.  Create exactly 10 sentences. Each sentence should be a separate item.
      2.  In each sentence, use a form of one headword (e.g., for 'benefit', use 'beneficial').
      3.  In the sentence string, replace the used word form with a placeholder "[BLANK]".
      4.  Return the response ONLY in a valid JSON object format with a single key: "questions".
      5.  The value of "questions" should be an array of 10 objects.
      6.  Each object in the array must have three string keys:
          - "sentence": The sentence with the "[BLANK]" placeholder.
          - "headword": The original headword given.
          - "solution": The correct word form that fits the blank.

      EXAMPLE JSON OUTPUT:
      {
        "questions": [
          {
            "sentence": "The new policy was [BLANK] to all employees.",
            "headword": "benefit",
            "solution": "beneficial"
          },
          {
            "sentence": "He is a well-known [BLANK] in the art world.",
            "headword": "create",
            "solution": "creator"
        }
        ]
      }
    `;

    try {
      const genAI = new GoogleGenerativeAI(API_KEYS.gemini.key);
      const model = genAI.getGenerativeModel({ 
        model: API_KEYS.gemini.model,
        generationConfig: {
          responseMimeType: "application/json",
          }
      });

      const result = await model.generateContent(prompt);
      const response = result.response;
      const content = response.text();
      
      if (!content) {
          throw new Error('Invalid API response: No content found.');
      }
      
      const parsedContent = JSON.parse(content);

      if (!parsedContent.questions || !Array.isArray(parsedContent.questions) || parsedContent.questions.length === 0) {
        throw new Error('Invalid JSON structure from API. Expected a "questions" array.');
      }

      return parsedContent.questions as WordFormsQuestion[];

    } catch (error) {
      console.error('Gemini API error (generateWordFormsExercise):', error);
      throw new Error('Error: Could not generate the exercise. Please try again.');
    }
  }

  private parseEvaluationResponse(text: string) {
    try {
      // More precise JSON regex to avoid capturing invalid content
      const jsonRegex = /\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\}/;
      const match = text.match(jsonRegex);
      
      if (!match) {
        throw new Error('JSON format not found');
      }
      
      // Clean the JSON string before parsing
      let jsonStr = match[0].trim();
      
      // Remove any non-JSON content that might be present
      if (jsonStr.includes('```')) {
        jsonStr = jsonStr.replace(/```json\s*|```/g, '');
      }
  
      const result = JSON.parse(jsonStr);
  
      if (typeof result.correct !== 'boolean' || 
          typeof result.similarity !== 'string' || 
          typeof result.feedback !== 'string' || 
          typeof result.suggestion !== 'string') {
        throw new Error('Invalid JSON structure');
      }
  
      return result;
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return {
        correct: false,
        similarity: '0',
        feedback: 'Değerlendirme işlemi sırasında hata oluştu. Lütfen tekrar deneyin.',
        suggestion: 'Sistem yanıtını analiz ederken sorun oluştu. Yeni bir cümle ile tekrar deneyebilirsiniz.'
      };
    }
  }

  public async generatePrepositionExercise(
    prepositions: { prep: string; difficulty: 'easy' | 'medium' | 'hard' }[]
  ): Promise<PrepositionExercise[]> {
    const examples = prepositions.map(p => `
      {
        "sentence": "Sentence using ${p.prep} at ${p.difficulty} level with [BLANK].",
        "correctAnswer": "${p.prep}",
        "options": ["${p.prep}", "distractor1", "distractor2", "distractor3"]
      }`).join(',\n');

    const prompt = `
      You are an English teacher creating a preposition exercise.
      For each of the following ${prepositions.length} prepositions, generate one distinct English sentence for the specified learning level.

      RULES:
      1.  Create a unique sentence for each preposition.
      2.  Keep the sentence structure and vocabulary simple and appropriate for the specified level.
      3.  Replace the preposition in the sentence with a placeholder "[BLANK]".
      4.  Provide three plausible but incorrect preposition options (distractors).
      5.  Return the response ONLY in a valid JSON object format with a single key: "exercises".
      6.  The value of "exercises" should be an array of objects, each corresponding to one of the requested prepositions.
      7.  Each object must have these keys: "sentence", "correctAnswer", "options".

      PREPOSITIONS TO USE:
      ${prepositions.map((p, i) => `${i + 1}. Preposition: "${p.prep}", Level: "${p.difficulty}"`).join('\n')}

      EXAMPLE JSON OUTPUT:
      {
        "exercises": [
          ${examples}
        ]
    }
    `;
    try {
      const genAI = new GoogleGenerativeAI(API_KEYS.gemini.key);
      const model = genAI.getGenerativeModel({
        model: API_KEYS.gemini.model,
        generationConfig: { "responseMimeType": "application/json" }
      });

      const result = await model.generateContent(prompt);
      const response = result.response;
      const content = response.text();
      
      if (!content) throw new Error('Invalid API response: No content found.');
      
      const parsedContent = JSON.parse(content);

      if (!parsedContent.exercises || !Array.isArray(parsedContent.exercises)) {
        throw new Error('Invalid JSON structure from API. Expected "exercises" array.');
      }

      const exercises: PrepositionExercise[] = parsedContent.exercises.map((ex: any, index: number) => {
      // Ensure the correct answer is always in the options
        if (!ex.options.includes(ex.correctAnswer)) {
          ex.options.pop();
          ex.options.push(ex.correctAnswer);
      }
        return { 
          sentence: ex.sentence,
          correctAnswer: ex.correctAnswer,
          options: ex.options,
          sourcePrep: { prep: prepositions[index].prep } 
        };
      });

      return exercises;

    } catch (error) {
      console.error("Error calling Gemini for preposition exercise:", error);
      throw new Error("Failed to generate preposition exercises.");
    }
  }
}

export const getDefinitionsForWords = async (words: string[]): Promise<Record<string, string>> => {
    if (!API_KEYS.gemini.key) {
        console.error("Gemini API key is not configured in .env file (VITE_GEMINI_API_KEY).");
        return words.reduce((acc, word) => {
            acc[word] = 'API key is not configured.';
            return acc;
        }, {} as Record<string, string>);
    }

    if (words.length === 0) {
        return {};
    }

    try {
        const genAI = new GoogleGenerativeAI(API_KEYS.gemini.key);
        const model = genAI.getGenerativeModel({ model: API_KEYS.gemini.model });

        const prompt = `For the following list of English words, provide a simple, one-sentence definition for each in English. Return the response as a valid JSON object where keys are the words and values are their definitions. The words are: ${words.join(', ')}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // More robust JSON cleaning: find the JSON block within the response.
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error("No valid JSON object found in the AI response. Response text:", text);
            throw new Error("No valid JSON object found in the AI response.");
        }
        text = jsonMatch[0];
        
        const definitions = JSON.parse(text);
        return definitions;

    } catch (error) {
        console.error("Error fetching definitions from Gemini:", error);
        // Return an error message for each word in the batch
        return words.reduce((acc, word) => {
            acc[word] = 'Definition could not be loaded.';
            return acc;
        }, {} as Record<string, string>);
  }
};