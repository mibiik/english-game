import { API_KEYS } from '../config/apiKeys';

const API_URL = "https://openrouter.ai/api/v1/chat/completions";

export const generateSentences = async (words: string[], modelKey: keyof typeof API_KEYS = 'gpt4o_mini') => {
  const modelConfig = API_KEYS[modelKey];
  
  const prompt = `Aşağıdaki kelimeleri kullanarak İngilizce cümleler oluştur:
${words.map((word, i) => `${i+1}. ${word}`).join('\n')}

Her cümlede sadece bir kelime kullan ve o kelimenin yerine "_____" koy. Cümleler kısa ve A2-B1 seviyesinde olsun.`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${modelConfig.key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelConfig.model,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenRouter API error:', error);
    throw error;
  }
};

export const getRandomWords = (words: string[], count: number = 8) => {
  const shuffled = [...words].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};