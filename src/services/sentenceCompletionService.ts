import { API_KEYS } from '../config/apiKeys';

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export interface SentenceQuestion {
  sentence: string;
  correctAnswer: string;
  options: string[];
  translations: {
    correctAnswer: string;
    options: string[];
  };
}

export class SentenceCompletionService {
  private static instance: SentenceCompletionService;
  private retryCount: number = 0;
  private readonly MAX_RETRIES = 3;

  private constructor() {}

  public static getInstance(): SentenceCompletionService {
    if (!SentenceCompletionService.instance) {
      SentenceCompletionService.instance = new SentenceCompletionService();
    }
    return SentenceCompletionService.instance;
  }

  private async makeApiRequest(prompt: string): Promise<any> {
    const modelConfig = API_KEYS.gemini;

    while (this.retryCount < this.MAX_RETRIES) {
      try {
        const response = await fetch(`${API_URL}?key=${modelConfig.key}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1000
            }
          })
        });

        if (!response.ok) {
          if (response.status === 429 || response.status >= 500) {
            this.retryCount++;
            const delay = Math.min(1000 * Math.pow(2, this.retryCount), 8000);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          throw new Error(`API yanıt hatası: ${response.status}`);
        }

        this.retryCount = 0;
        return await response.json();
      } catch (error) {
        if (this.retryCount >= this.MAX_RETRIES - 1) {
          throw error;
        }
        this.retryCount++;
        const delay = Math.min(1000 * Math.pow(2, this.retryCount), 8000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error('Maksimum yeniden deneme sayısına ulaşıldı');
  }

  /**
   * JSON formatındaki metni temizler ve ayrıştırır
   * @param jsonText Temizlenecek ve ayrıştırılacak JSON metni
   * @returns Ayrıştırılmış JSON nesnesi
   */
  private parseJsonSafely(jsonText: string): any {
    // İlk olarak JSON metnini temizleyelim
    let cleanedJson = this.cleanJsonText(jsonText);
    
    try {
      // Temizlenmiş metni ayrıştırmayı deneyelim
      return JSON.parse(cleanedJson);
    } catch (error) {
      // İlk deneme başarısız olursa, daha kapsamlı temizleme yapalım
      console.log('İlk JSON ayrıştırma denemesi başarısız, daha kapsamlı temizleme deneniyor...');
      cleanedJson = this.deepCleanJson(cleanedJson);
      
      try {
        return JSON.parse(cleanedJson);
      } catch (error) {
        // İkinci deneme de başarısız olursa, yapısal düzeltme deneyelim
        console.log('İkinci JSON ayrıştırma denemesi başarısız, yapısal düzeltme deneniyor...');
        const structurallyFixedJson = this.fixJsonStructure(cleanedJson);
        
        try {
          return JSON.parse(structurallyFixedJson);
        } catch (error) {
          // Son çare olarak, JSON yapısını yeniden oluşturmayı deneyelim
          console.log('Yapısal düzeltme başarısız, JSON yeniden oluşturuluyor...');
          return this.reconstructJson(cleanedJson);
        }
      }
    }
  }

  /**
   * JSON metnini temel düzeyde temizler
   */
  private cleanJsonText(jsonText: string): string {
    return jsonText
      .trim()
      // Kontrol karakterlerini temizle
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
      // Kaçış karakterlerini düzelt
      .replace(/\\n/g, '\n')

      .replace(/\\'/g, "'")
      .replace(/\\"/g, '"')
      // Boşlukları düzenle
      .replace(/\s+/g, ' ')
      // Kapanış parantezinden önce virgül varsa kaldır
      .replace(/,(?=\s*?[}\]])/g, '');
  }

  /**
   * JSON metnini daha kapsamlı bir şekilde temizler
   */
  private deepCleanJson(jsonText: string): string {
    return jsonText
      // Dizi içindeki son elemandan sonra virgül varsa kaldır
      .replace(/,\s*([\]}])/g, '$1')
      // Eksik kapanış parantezlerini düzelt
      .replace(/("[^"]*")\s*:\s*\[([^\]]*)(?!\])\s*([,}])/g, '$1: [$2]$3')
      // Eksik açılış parantezlerini düzelt
      .replace(/:\s*(?![\[{"\d-])(\w+)/g, ': "$1"')
      // Property name sonrası ':' eksikliğini düzelt
      .replace(/("[^"]*")\s+(?!:)("[^"]*")/g, '$1: $2')
      .replace(/("[^"]*")\s+(?!:)(\{)/g, '$1: $2')
      .replace(/("[^"]*")\s+(?!:)(\[)/g, '$1: $2')
      // Tırnak içinde olmayan property name'leri tırnak içine al
      .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
  }

  /**
   * JSON yapısını düzeltir
   */
  private fixJsonStructure(jsonText: string): string {
    return jsonText
      // Eksik virgülleri ekle
      .replace(/("[^"]*"|\d+|true|false|null)\s+("[^"]*")/g, '$1, $2')
      // Eksik virgülleri düzelt (property'ler arası)
      .replace(/("[^"]*"\s*:\s*"[^"]*")\s+("[^"]*")/g, '$1, $2')
      // Eksik virgülleri düzelt (dizi elemanları arası)
      .replace(/("[^"]*")\s+("[^"]*")/g, '$1, $2')
      // Eksik virgülleri düzelt (sayılar arası)
      .replace(/(\d+)\s+(\d+)/g, '$1, $2')
      // Eksik virgülleri düzelt (boolean/null değerler arası)
      .replace(/(true|false|null)\s+(true|false|null)/g, '$1, $2')
      // Eksik virgülleri düzelt (sayı ve string arası)
      .replace(/(\d+)\s+("[^"]*")/g, '$1, $2')
      .replace(/("[^"]*")\s+(\d+)/g, '$1, $2')
      // Tüm property name'leri düzelt
      .replace(/([{,]\s*)([^"\s][^:\s]*)\s*:/g, '$1"$2":')
      // Eksik tırnak işaretlerini ekle
      .replace(/:\s*([^\s"\[\{\d\-][^,\]\}]*?)([,\]\}])/g, ': "$1"$2')
      // Hatalı boolean ve null değerlerini düzelt
      .replace(/:\s*(true|false|null)([^,\]\}])/g, ': $1,$2')
      // Eksik kapanış parantezlerini düzelt
      .replace(/("[^"]*")\s*:\s*\{([^\}]*)(?!\})\s*([,\]])/g, '$1: {$2}$3')
      // Eksik kapanış köşeli parantezlerini düzelt
      .replace(/("[^"]*")\s*:\s*\[([^\]]*)(?!\])\s*([,\}])/g, '$1: [$2]$3');
  }

  /**
   * JSON yapısını yeniden oluşturur
   */
  private reconstructJson(jsonText: string): any {
    try {
      // Önce JSON formatını düzeltmeye çalışalım
      jsonText = this.preProcessJsonText(jsonText);
      
      // "questions" alanını bul - daha esnek bir regex kullanarak
      const questionsMatch = jsonText.match(/["']questions["']\s*:\s*\[(.*?)\](?=\s*\}|$)/s) || 
                             jsonText.match(/questions\s*:\s*\[(.*?)\](?=\s*\}|$)/s);
      
      if (!questionsMatch || !questionsMatch[1]) {
        // Alternatif olarak, tüm JSON'ı bir soru dizisi olarak ele almayı deneyelim
        if (jsonText.trim().startsWith('[') && jsonText.trim().endsWith(']')) {
          return { questions: this.extractQuestionsFromArray(jsonText) };
        }
        // Başka bir alternatif: JSON içinde doğrudan soru nesneleri aramak
        const extractedQuestions = this.extractQuestionsDirectly(jsonText);
        if (extractedQuestions.length > 0) {
          return { questions: extractedQuestions };
        }
        throw new Error('questions alanı bulunamadı');
      }

      // Her bir soru öğesini ayır - daha güçlü bir ayırma mekanizması
      const questionsContent = questionsMatch[1].trim();
      const questionItems = this.splitQuestionItems(questionsContent);
      
      const fixedQuestions = [];
      
      // Her bir soru öğesini düzelt
      for (const questionItem of questionItems) {
        try {
          // Temel JSON düzeltmeleri
          let fixedItem = this.fixBasicJsonIssues(questionItem);
          
          // Özel alanları düzelt
          fixedItem = this.fixSpecialFields(fixedItem);
          
          // Doğruluğunu kontrol et ve düzelt
          try {
            JSON.parse(fixedItem);
          } catch (parseError) {
            // Hala ayrıştırılamıyorsa, daha agresif düzeltmeler uygula
            fixedItem = this.applyAggressiveJsonFixes(fixedItem);
            // Son bir kontrol daha yap
            JSON.parse(fixedItem);
          }
          
          fixedQuestions.push(fixedItem);
        } catch (e) {
          console.log('Soru öğesi düzeltilemedi:', e);
          // Düzeltilemeyen öğeyi atla, ama hata detaylarını kaydet
          console.log('Düzeltilemeyen öğe:', questionItem);
        }
      }
      
      if (fixedQuestions.length > 0) {
        const reconstructedJSON = `{"questions": [${fixedQuestions.join(', ')}]}`;
        return JSON.parse(reconstructedJSON);
      }
      
      // Son çare: Yapay bir soru dizisi oluştur
      const artificialQuestions = this.createArtificialQuestions(jsonText);
      if (artificialQuestions.length > 0) {
        return { questions: artificialQuestions };
      }
      
      throw new Error('Hiçbir soru öğesi düzeltilemedi');
    } catch (error) {
      console.error('JSON yeniden oluşturma hatası:', error);
      throw new Error('JSON formatı düzeltilemedi');
    }
  }
  
  /**
   * JSON metnini ön işleme tabi tutar
   */
  private preProcessJsonText(jsonText: string): string {
    // Markdown kod bloklarını temizle
    jsonText = jsonText.replace(/```(?:json)?([\s\S]*?)```/g, '$1');
    
    // Açıklama satırlarını temizle
    jsonText = jsonText.replace(/\/\/.*$/gm, '');
    jsonText = jsonText.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Başlangıç ve bitişteki gereksiz metinleri temizle
    const firstBrace = jsonText.indexOf('{');
    const lastBrace = jsonText.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      jsonText = jsonText.substring(firstBrace, lastBrace + 1);
    }
    
    return jsonText;
  }
  
  /**
   * Soru öğelerini daha güçlü bir şekilde ayırır
   */
  private splitQuestionItems(questionsContent: string): string[] {
    // Önce standart ayırma yöntemini deneyelim
    const items = questionsContent.split(/\}\s*,\s*\{/);
    
    // Her öğeyi düzgün bir JSON nesnesine dönüştür
    return items.map(item => {
      item = item.trim();
      if (!item.startsWith('{')) item = '{' + item;
      if (!item.endsWith('}')) item = item + '}';
      
      // Eksik kapanış parantezlerini düzelt
      const openBraces = (item.match(/\{/g) || []).length;
      const closeBraces = (item.match(/\}/g) || []).length;
      
      if (openBraces > closeBraces) {
        item = item + '}'.repeat(openBraces - closeBraces);
      } else if (closeBraces > openBraces) {
        item = '{'.repeat(closeBraces - openBraces) + item;
      }
      
      return item;
    });
  }
  
  /**
   * Temel JSON sorunlarını düzeltir
   */
  private fixBasicJsonIssues(jsonItem: string): string {
    return jsonItem
      // Tüm property name'leri düzelt
      .replace(/([{,]\s*)([^"\s][^:\s]*)\s*:/g, '$1"$2":')
      // Eksik tırnak işaretlerini ekle
      .replace(/:\s*([^\s"\[\{\d\-true|false|null][^,\]\}]*?)([,\]\}])/g, ': "$1"$2')
      // Virgül eksikliklerini düzelt
      .replace(/("[^"]*"|\d+|true|false|null)\s+("[^"]*")/g, '$1, $2')
      // Eksik kapanış parantezlerini düzelt
      .replace(/("[^"]*")\s*:\s*\{([^\}]*)(?!\})\s*([,\]])/g, '$1: {$2}$3')
      // Eksik kapanış köşeli parantezlerini düzelt
      .replace(/("[^"]*")\s*:\s*\[([^\]]*)(?!\])\s*([,\}])/g, '$1: [$2]$3');
  }
  
  /**
   * Özel alanları düzeltir (translations, options vb.)
   */
  private fixSpecialFields(jsonItem: string): string {
    let fixedItem = jsonItem;
    
    // Translations kısmını düzelt
    const translationsMatch = fixedItem.match(/(["']translations["']\s*:\s*\{)(.*?)(\})/s);
    if (translationsMatch && translationsMatch[2]) {
      const fixedTranslations = translationsMatch[2]
        .replace(/([{,]\s*)([^"\s][^:\s]*)\s*:/g, '$1"$2":')
        .replace(/:\s*([^\s"\[\{\d\-true|false|null][^,\]\}]*?)([,\]\}])/g, ': "$1"$2');
      
      fixedItem = fixedItem.replace(translationsMatch[0], `${translationsMatch[1]}${fixedTranslations}${translationsMatch[3]}`);
    }
    
    // Options dizilerini düzelt
    const optionsMatches = fixedItem.match(/(["']options["']\s*:\s*\[)(.*?)(\])/g);
    if (optionsMatches) {
      for (const optionsMatch of optionsMatches) {
        const optionsContent = optionsMatch.match(/(["']options["']\s*:\s*\[)(.*?)(\])/);
        if (optionsContent && optionsContent[2]) {
          const fixedOptions = optionsContent[2]
            .split(/\s*,\s*/)
            .map(opt => opt.trim())
            .filter(opt => opt)
            .map(opt => {
              if (!opt.startsWith('"') && !opt.startsWith("'")) opt = '"' + opt;
              if (!opt.endsWith('"') && !opt.endsWith("'")) opt = opt + '"';
              // Tek tırnak yerine çift tırnak kullan
              if (opt.startsWith("'") && opt.endsWith("'")) {
                opt = '"' + opt.slice(1, -1) + '"';
              }
              return opt;
            })
            .join(', ');
          
          fixedItem = fixedItem.replace(optionsMatch, `${optionsContent[1]}${fixedOptions}${optionsContent[3]}`);
        }
      }
    }
    
    // correctAnswer alanını düzelt
    const correctAnswerMatch = fixedItem.match(/(["']correctAnswer["']\s*:)\s*([^,\}\]]+)/);
    if (correctAnswerMatch && correctAnswerMatch[2]) {
      let value = correctAnswerMatch[2].trim();
      if (!value.startsWith('"') && !value.startsWith("'")) {
        value = '"' + value + '"';
      }
      // Tek tırnak yerine çift tırnak kullan
      if (value.startsWith("'") && value.endsWith("'")) {
        value = '"' + value.slice(1, -1) + '"';
      }
      fixedItem = fixedItem.replace(correctAnswerMatch[0], `${correctAnswerMatch[1]} ${value}`);
    }
    
    // sentence alanını düzelt
    const sentenceMatch = fixedItem.match(/(["']sentence["']\s*:)\s*([^,\}\]]+)/);
    if (sentenceMatch && sentenceMatch[2]) {
      let value = sentenceMatch[2].trim();
      if (!value.startsWith('"') && !value.startsWith("'")) {
        value = '"' + value + '"';
      }
      // Tek tırnak yerine çift tırnak kullan
      if (value.startsWith("'") && value.endsWith("'")) {
        value = '"' + value.slice(1, -1) + '"';
      }
      fixedItem = fixedItem.replace(sentenceMatch[0], `${sentenceMatch[1]} ${value}`);
    }
    
    return fixedItem;
  }
  
  /**
   * Daha agresif JSON düzeltmeleri uygular
   */
  private applyAggressiveJsonFixes(jsonItem: string): string {
    // Tüm tek tırnakları çift tırnağa çevir
    jsonItem = jsonItem.replace(/'/g, '"');
    
    // Tüm property name'leri düzelt (daha agresif)
    jsonItem = jsonItem.replace(/([{,]\s*)([^"\s][^:\s,]*?)\s*:/g, '$1"$2":');
    
    // Tüm string değerleri düzelt
    jsonItem = jsonItem.replace(/:\s*([^\s"\[\{\d\-true|false|null][^,\]\}]*?)([,\]\}])/g, ': "$1"$2');
    
    // Eksik virgülleri ekle
    jsonItem = jsonItem.replace(/("[^"]*"|\d+|true|false|null)\s+("[^"]*")/g, '$1, $2');
    jsonItem = jsonItem.replace(/(\})\s*(\{)/g, '$1, $2');
    
    // Fazla virgülleri temizle
    jsonItem = jsonItem.replace(/,\s*([\]\}])/g, '$1');
    
    // Eksik parantezleri düzelt
    const openBraces = (jsonItem.match(/\{/g) || []).length;
    const closeBraces = (jsonItem.match(/\}/g) || []).length;
    
    if (openBraces > closeBraces) {
      jsonItem = jsonItem + '}'.repeat(openBraces - closeBraces);
    } else if (closeBraces > openBraces) {
      jsonItem = '{'.repeat(closeBraces - openBraces) + jsonItem;
    }
    
    const openBrackets = (jsonItem.match(/\[/g) || []).length;
    const closeBrackets = (jsonItem.match(/\]/g) || []).length;
    
    if (openBrackets > closeBrackets) {
      jsonItem = jsonItem + ']'.repeat(openBrackets - closeBrackets);
    } else if (closeBrackets > openBrackets) {
      jsonItem = '['.repeat(closeBrackets - openBrackets) + jsonItem;
    }
    
    return jsonItem;
  }
  
  /**
   * JSON dizisinden soru nesnelerini çıkarır
   */
  private extractQuestionsFromArray(jsonArray: string): any[] {
    try {
      // Köşeli parantezleri temizle
      const arrayContent = jsonArray.trim().replace(/^\[|\]$/g, '');
      
      // Öğeleri ayır
      const items = this.splitArrayItems(arrayContent);
      
      // Her öğeyi düzelt ve ayrıştır
      const questions = [];
      for (const item of items) {
        try {
          const fixedItem = this.fixBasicJsonIssues(item);
          const parsedItem = JSON.parse(fixedItem);
          questions.push(parsedItem);
        } catch (e) {
          console.log('Dizi öğesi düzeltilemedi:', e);
        }
      }
      
      return questions;
    } catch (e) {
      console.log('Dizi ayrıştırma hatası:', e);
      return [];
    }
  }
  
  /**
   * Dizi öğelerini ayırır
   */
  private splitArrayItems(arrayContent: string): string[] {
    // Nesneleri ayır
    const items = [];
    let depth = 0;
    let currentItem = '';
    
    for (let i = 0; i < arrayContent.length; i++) {
      const char = arrayContent[i];
      
      if (char === '{') depth++;
      else if (char === '}') depth--;
      
      currentItem += char;
      
      if (depth === 0 && char === '}') {
        items.push(currentItem.trim());
        currentItem = '';
        
        // Sonraki virgülü atla
        while (i + 1 < arrayContent.length && arrayContent[i + 1] === ',') {
          i++;
        }
      }
    }
    
    // Boş olmayan öğeleri döndür
    return items.filter(item => item.trim() !== '');
  }
  
  /**
   * JSON içinden doğrudan soru nesnelerini çıkarır
   */
  private extractQuestionsDirectly(jsonText: string): any[] {
    const questions = [];
    
    // Soru alanlarını ara
    const sentenceMatches = jsonText.match(/["']sentence["']\s*:\s*["']([^"']+)["']/g) || [];
    const correctAnswerMatches = jsonText.match(/["']correctAnswer["']\s*:\s*["']([^"']+)["']/g) || [];
    const optionsMatches = jsonText.match(/["']options["']\s*:\s*\[([^\]]+)\]/g) || [];
    
    // En az bir soru alanı varsa
    if (sentenceMatches.length > 0 || correctAnswerMatches.length > 0 || optionsMatches.length > 0) {
      try {
        // Tüm JSON'ı bir nesne olarak ayrıştırmayı dene
        const parsedJson = JSON.parse(this.fixBasicJsonIssues(`{${jsonText}}`.replace(/^\{\{/, '{').replace(/\}\}$/, '}')));
        
        // Soru nesnelerini bul
        for (const key in parsedJson) {
          const value = parsedJson[key];
          if (typeof value === 'object' && value !== null) {
            if (this.looksLikeQuestion(value)) {
              questions.push(value);
            } else if (Array.isArray(value)) {
              // Dizi içindeki soru nesnelerini kontrol et
              for (const item of value) {
                if (this.looksLikeQuestion(item)) {
                  questions.push(item);
                }
              }
            }
          }
        }
      } catch (e) {
        console.log('Doğrudan çıkarma hatası:', e);
      }
    }
    
    return questions;
  }
  
  /**
   * Bir nesnenin soru nesnesine benzeyip benzemediğini kontrol eder
   */
  private looksLikeQuestion(obj: any): boolean {
    return (
      obj && 
      typeof obj === 'object' && 
      (typeof obj.sentence === 'string' || 
       typeof obj.correctAnswer === 'string' || 
       Array.isArray(obj.options))
    );
  }
  
  /**
   * Yapay soru nesneleri oluşturur (son çare)
   */
  private createArtificialQuestions(jsonText: string): any[] {
    try {
      // Cümleleri bul
      const sentenceMatches = jsonText.match(/["']?sentence["']?\s*:\s*["']([^"']+)["']/g) || [];
      const sentences = sentenceMatches.map(match => {
        const parts = match.split(':');
        if (parts.length > 1) {
          let sentence = parts.slice(1).join(':').trim();
          sentence = sentence.replace(/^["']+|["',]+$/g, '');
          return sentence;
        }
        return '';
      }).filter(s => s);
      
      // Doğru cevapları bul
      const correctAnswerMatches = jsonText.match(/["']?correctAnswer["']?\s*:\s*["']([^"']+)["']/g) || [];
      const correctAnswers = correctAnswerMatches.map(match => {
        const parts = match.split(':');
        if (parts.length > 1) {
          let answer = parts.slice(1).join(':').trim();
          answer = answer.replace(/^["']+|["',]+$/g, '');
          return answer;
        }
        return '';
      }).filter(a => a);
      
      // Seçenekleri bul
      const optionsMatches = jsonText.match(/["']?options["']?\s*:\s*\[([^\]]+)\]/g) || [];
      const allOptions = optionsMatches.map(match => {
        const parts = match.split(':');
        if (parts.length > 1) {
          let optionsStr = parts.slice(1).join(':').trim();
          optionsStr = optionsStr.replace(/^\s*\[|\]\s*$/g, '');
          return optionsStr.split(',').map(opt => opt.trim().replace(/^["']+|["',]+$/g, ''));
        }
        return [];
      }).filter(opts => opts.length > 0);
      
      // Yapay sorular oluştur
      const questions = [];
      const maxLength = Math.max(sentences.length, correctAnswers.length, allOptions.length);
      
      for (let i = 0; i < maxLength; i++) {
        const sentence = i < sentences.length ? sentences[i] : `Sentence ${i + 1}`;
        const correctAnswer = i < correctAnswers.length ? correctAnswers[i] : `Answer ${i + 1}`;
        const options = i < allOptions.length ? allOptions[i] : [correctAnswer, 'Option 2', 'Option 3', 'Option 4'];
        
        // Seçeneklerde doğru cevap yoksa ekle
        if (!options.includes(correctAnswer)) {
          options[0] = correctAnswer;
        }
        
        // Seçenek sayısını 4'e tamamla
        while (options.length < 4) {
          options.push(`Option ${options.length + 1}`);
        }
        
        questions.push({
          sentence,
          correctAnswer,
          options,
          translations: {
            correctAnswer: correctAnswer,
            options: options.map(opt => opt)
          }
        });
      }
      
      return questions;
    } catch (e) {
      console.log('Yapay soru oluşturma hatası:', e);
      return [];
    }
  }

  /**
   * API yanıtından JSON içeriğini çıkarır
   */
  private extractJsonFromApiResponse(content: string): string {
    // JSON string'i ayıkla
    const jsonStart = content.indexOf('{');
    const jsonEnd = content.lastIndexOf('}') + 1;

    if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
      throw new Error('JSON formatında veri bulunamadı');
    }

    return content.slice(jsonStart, jsonEnd);
  }

  /**
   * Yanıt formatının geçerli olup olmadığını kontrol eder
   */
  private validateResponseFormat(parsedContent: any): boolean {
    if (!Array.isArray(parsedContent?.questions)) {
      return false;
    }

    return parsedContent.questions.every(q =>
      q &&
      typeof q.sentence === 'string' &&
      typeof q.correctAnswer === 'string' &&
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      q.translations &&
      typeof q.translations.correctAnswer === 'string' &&
      Array.isArray(q.translations.options) &&
      q.translations.options.length === 4
    );
  }

  public async generateSentenceCompletions(words: string[]): Promise<SentenceQuestion[]> {
    const prompt = `Aşağıdaki İngilizce kelimeler için cümle tamamlama soruları oluştur:
${words.map((word, i) => `${i + 1}. ${word}`).join('\n')}

Her kelime için:
1. Kelimenin anlamını açıkça gösteren bir cümle yaz
2. Cümlede hedef kelimeyi "_____" ile değiştir
3. Cümle A2-B1 seviyesinde ve anlaşılır olmalı
4. Her cümle için 4 seçenek oluştur:
   - Doğru kelime
   - Doğru kelimeye benzer anlamlı ama farklı bir kelime (örn: "happy" için "joyful")
   - Farklı bir kelime
   - Tamamen alakasız bir kelime
5. Her kelime için Türkçe çevirisini ekle

Yanıtını aşağıdaki JSON formatında ver:
{
  "questions": [
    {
      "sentence": "cümle",
      "correctAnswer": "doğru kelime",
      "options": ["doğru kelime", "benzer anlamlı kelime", "farklı kelime", "alakasız kelime"],
      "translations": {
        "correctAnswer": "doğru kelimenin türkçesi",
        "options": ["doğru kelimenin türkçesi", "benzer anlamlı kelimenin türkçesi", "farklı kelimenin türkçesi", "alakasız kelimenin türkçesi"]
      }
    }
  ]
}`;

    try {
      const data = await this.makeApiRequest(prompt);

      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Beklenmeyen API yanıt formatı');
      }

      let content = data.candidates[0].content.parts[0].text;

      // Temel temizleme işlemleri
      content = this.cleanJsonText(content);

      // JSON string'i ayıkla
      const jsonString = this.extractJsonFromApiResponse(content);

      // JSON'ı güvenli bir şekilde ayrıştır
      const parsedContent = this.parseJsonSafely(jsonString);

      // Yanıt formatını doğrula
      if (!this.validateResponseFormat(parsedContent)) {
        throw new Error('Yanıt formatı geçersiz: Eksik veya hatalı alanlar var');
      }

      return parsedContent.questions;

    } catch (error) {
      console.error('Cümle oluşturma hatası:', error);
      this.retryCount = 0;
      throw new Error('Cümle oluşturma başarısız oldu');
    }
  }
}
