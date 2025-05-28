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

  async evaluateParaphrase(originalSentence: string, paraphrasedSentence: string) {
    try {
      const response = await fetch(`${this.apiEndpoint}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Please evaluate the following sentences and provide feedback in Turkish. Keep the sentences in their original language (English) but provide all feedback and suggestions in Turkish. Respond in JSON format only.
Önemli Kurallar:
1. Benzerlik oranı %45 ile %85 arasında olduğunda cümle doğru kabul edilmelidir
2. %85'den fazla benzerlik oranına sahip cümleler çok benzer kabul edilip reddedilmelidir
3. %45'ten az benzerlik oranına sahip cümleler anlam bütünlüğünü kaybetmiş kabul edilip reddedilmelidir
4. Her türlü hata detaylı açıklanmalıdır
5. İyileştirme önerileri somut ve uygulanabilir olmalıdır
6. Benzerlik oranı yüzde olarak belirtilmelidir
7. Cümlelerin dili değiştirilmemeli, sadece yönlendirmeler Türkçe olmalıdır

Example: You can rephrase 'Coastal infrastructure resilience is at serious risk due to the increasing frequency of extreme weather events (Jones, 2023, p. 112).' as 'The rising occurrence of severe weather phenomena puts coastal infrastructure durability under significant threat (Jones, 2023, p. 112).'

Orijinal: ${originalSentence}
Parafraz: ${paraphrasedSentence}

Yanıt formatı:
{
  "correct": true/false,
  "similarity": "0-100",
  "feedback": "Değerlendirme sonucu",
  "suggestion": "İyileştirme önerisi"
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
        feedback: 'Sorry, an error occurred while processing the response. Please try again.',
        suggestion: 'There was a problem analyzing the system response. You can try again with a new sentence.'
      };
    }
  }
}