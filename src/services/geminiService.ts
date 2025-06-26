import { GeminiResponse } from '../types/gemini';

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
    try {
      const response = await fetch(`${this.apiEndpoint}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Paraphrase değerlendirmesi yapacaksın. Aşağıdaki kurallara göre değerlendir ve JSON formatında yanıt ver:

DEĞERLENDIRME KRİTERLERİ:
1. Parafraz türü kontrolü: "${paraphraseType}" türüne uygun mu?
2. Anlam korunması: Orijinal anlam korunmuş mu?
3. Kelime değişimi: Farklı kelimeler kullanılmış mı?
4. Kaynak belirtimi: Doğru şekilde kaynak gösterilmiş mi?
5. Dil bilgisi: Gramatikal olarak doğru mu?

PARAFRAZ TÜRÜ KURALLARI:
- "parenthetical": Kaynak parantez içinde olmalı: (Author, Year) veya (Author, Year, p.X)
- "reporting": Yazar cümle içinde + fiil: "Smith (2020) argues/states/claims that..."
- "according": "According to" ile başlamalı: "According to Smith (2020), ..."

PUANLAMA:
- Tür uygunluğu: 40 puan
- Anlam korunması: 30 puan  
- Kelime değişimi: 20 puan
- Dil bilgisi: 10 puan

70+ puan = doğru (correct: true)
70 altı = yanlış (correct: false)

Orijinal: ${originalSentence}
Parafraz: ${paraphrasedSentence}
Tür: ${paraphraseType}

JSON formatında yanıt ver:
{
  "correct": true/false,
  "similarity": "puanı 0-100 arasında",
  "feedback": "Türkçe detaylı açıklama",
  "suggestion": "Türkçe iyileştirme önerisi"
}`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid API response structure');
      }

      return this.parseEvaluationResponse(data.candidates[0].content.parts[0].text);
    } catch (error) {
      console.error('Gemini API error:', error);
      return {
        correct: false,
        feedback: 'API hatası, lütfen tekrar deneyin.',
        suggestion: '',
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

  public async generateWordFormsParagraph(words: string[]): Promise<{ paragraph: string; solutions: Record<string, string> }> {
    const prompt = `
      Create a B1-level English paragraph that includes 10 blanks.
      Use different forms of the following 10 headwords: ${words.join(', ')}.

      RULES:
      1.  The paragraph must be coherent and on a single topic.
      2.  For each of the 10 words, use a form of it (e.g., for 'benefit', use 'beneficial' or 'benefited').
      3.  Replace the word you used with a blank '_______'.
      4.  Immediately after each blank, add the original headword in parentheses. Example: "The new park was _______ (benefit) for the whole community."
      5.  Return the response ONLY in JSON format, with two keys: "paragraph" and "solutions".
      6.  The "paragraph" key should contain the full paragraph string with blanks and hints.
      7.  The "solutions" key should be an object where keys are the headwords and values are the correct word forms used in the paragraph.

      EXAMPLE JSON OUTPUT:
      {
        "paragraph": "The new policy was _______ (benefit) to all employees. It _______ (create) a better work environment...",
        "solutions": {
          "benefit": "beneficial",
          "create": "created"
        }
      }
    `;

    try {
      const response = await fetch(`${this.apiEndpoint}?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          "generationConfig": {
            "responseMimeType": "application/json",
          }
        })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      const content = data.candidates[0].content.parts[0].text;
      
      if (!content) {
          throw new Error('Invalid API response: No text part found.');
      }
      
      const parsedContent = JSON.parse(content);

      if (!parsedContent.paragraph || !parsedContent.solutions) {
        throw new Error('Invalid JSON structure from API');
      }

      return parsedContent;

    } catch (error) {
      console.error('Gemini API error (generateWordFormsParagraph):', error);
      // Return a fallback/error structure
      return {
        paragraph: 'Error: Could not generate the paragraph. Please try again.',
        solutions: {},
      };
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
    preposition: string, 
    difficulty: 'easy' | 'medium' | 'hard'
  ): Promise<{ sentence: string; correctAnswer: string; options: string[] }> {
    const levelDescription = {
      easy: 'A1-A2 level',
      medium: 'B1-B2 level',
      hard: 'C1 level'
    };

    const prompt = `
    Generate an English sentence for a ${levelDescription[difficulty]} learner that correctly uses the preposition "${preposition}".
    The sentence should be a clear example of the preposition's use. Crucially, keep the sentence structure and vocabulary simple and appropriate for the specified learning level. Avoid complex clauses or overly formal language.
    Provide the sentence with a "[BLANK]" placeholder instead of the preposition.
    Also provide the correct preposition ("${preposition}") and three plausible but incorrect preposition options. The distractors should be common prepositions and make some sense in the context but be clearly wrong.

    Format the output as a single, clean JSON object with the following keys:
    - "sentence": The sentence with the placeholder.
    - "correctAnswer": The correct preposition, which must be "${preposition}".
    - "options": An array of four strings, containing the correct answer and three distractors, shuffled.

    Example for "interested in" at medium difficulty:
    {
      "sentence": "She is [BLANK] learning a new language.",
      "correctAnswer": "interested in",
      "options": ["interesting", "interested on", "interested in", "interest for"]
    }
    `;
    try {
      const response = await fetch(`${this.apiEndpoint}?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          "generationConfig": {
            "responseMimeType": "application/json",
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid API response structure for preposition exercise.');
      }

      const content = data.candidates[0].content.parts[0].text;
      const parsedContent = JSON.parse(content);

      if (!parsedContent.sentence || !parsedContent.correctAnswer || !parsedContent.options) {
        throw new Error('Invalid JSON structure from preposition exercise API');
      }

      // Ensure the correct answer is always in the options
      if (!parsedContent.options.includes(parsedContent.correctAnswer)) {
        parsedContent.options.pop();
        parsedContent.options.push(parsedContent.correctAnswer);
      }

      return parsedContent;

    } catch (error) {
      console.error("Error calling Gemini for preposition exercise:", error);
      // Fallback in case of error
      return {
        sentence: "This is a fallback [BLANK] an error.",
        correctAnswer: "due to",
        options: ["due to", "because", "on", "in"]
      };
    }
  }
}