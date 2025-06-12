/**
 * API Module for handling communication with the Gemini API
 */
const API = (() => {
  // Gemini API key
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  // Cache for generated messages to reduce API calls
  const messageCache = new Map();

  // Language translations for UI elements
  const translations = {
    en: {
      analyzing: "Analyzing profile...",
      error: "Error generating messages. Please try again.",
      copied: "Copied!",
      generating: "Generating...",
      newSuggestions: "New Suggestions"
    },
    tr: {
      analyzing: "Profil analiz ediliyor...",
      error: "Mesaj oluşturulurken hata oluştu. Lütfen tekrar deneyin.",
      copied: "Kopyalandı!",
      generating: "Oluşturuluyor...",
      newSuggestions: "Yeni Öneriler"
    },
    es: {
      analyzing: "Analizando perfil...",
      error: "Error al generar mensajes. Por favor, inténtalo de nuevo.",
      copied: "¡Copiado!",
      generating: "Generando...",
      newSuggestions: "Nuevas Sugerencias"
    },
    fr: {
      analyzing: "Analyse du profil...",
      error: "Erreur lors de la génération des messages. Veuillez réessayer.",
      copied: "Copié !",
      generating: "Génération...",
      newSuggestions: "Nouvelles Suggestions"
    },
    de: {
      analyzing: "Profil wird analysiert...",
      error: "Fehler beim Generieren von Nachrichten. Bitte versuchen Sie es erneut.",
      copied: "Kopiert!",
      generating: "Generierung...",
      newSuggestions: "Neue Vorschläge"
    }
  };

  /**
   * Generate a cache key based on profile data, tone, and language
   */
  const getCacheKey = (profileData, tone, language) => {
    return `${profileData.username}_${profileData.platform}_${tone}_${language}`;
  };

  /**
   * Format the profile info for the prompt
   */
  const formatProfileInfo = (profileData) => {
    let info = '';
    
    if (profileData.name) {
      info += `Name: ${profileData.name}\n`;
    }
    
    if (profileData.username) {
      info += `Username: @${profileData.username}\n`;
    }
    
    if (profileData.bio) {
      info += `Bio: ${profileData.bio}\n`;
    }
    
    if (profileData.recentContent && profileData.recentContent.length > 0) {
      info += `Recent content:\n`;
      profileData.recentContent.forEach((content, index) => {
        info += `- ${content}\n`;
      });
    }
    
    if (profileData.platform) {
      info += `Platform: ${profileData.platform}\n`;
    }
    
    return info;
  };

  /**
   * Get tone description based on language
   */
  const getToneDescription = (tone, language) => {
    const descriptions = {
      en: {
        flirty: 'Playful, suggestive, and charming without being inappropriate',
        friendly: 'Warm, casual, and approachable',
        professional: 'Polite, respectful, and business-oriented',
        funny: 'Humorous and light-hearted',
        creative: 'Unique and imaginative'
      },
      tr: {
        flirty: 'Eğlenceli, çekici ve uygunsuz olmadan çekici',
        friendly: 'Sıcak, rahat ve yaklaşılabilir',
        professional: 'Kibar, saygılı ve iş odaklı',
        funny: 'Esprili ve neşeli',
        creative: 'Benzersiz ve yaratıcı'
      },
      es: {
        flirty: 'Juguetón, sugerente y encantador sin ser inapropiado',
        friendly: 'Cálido, casual y accesible',
        professional: 'Educado, respetuoso y orientado a los negocios',
        funny: 'Humorístico y alegre',
        creative: 'Único e imaginativo'
      },
      fr: {
        flirty: 'Joueur, suggestif et charmant sans être inapproprié',
        friendly: 'Chaleureux, décontracté et accessible',
        professional: 'Poli, respectueux et orienté business',
        funny: 'Humoristique et léger',
        creative: 'Unique et imaginatif'
      },
      de: {
        flirty: 'Verspielt, suggestiv und charmant ohne unangemessen zu sein',
        friendly: 'Warm, leger und zugänglich',
        professional: 'Höflich, respektvoll und geschäftsorientiert',
        funny: 'Humorvoll und unbeschwert',
        creative: 'Einzigartig und einfallsreich'
      }
    };

    return descriptions[language]?.[tone] || descriptions.en[tone];
  };

  /**
   * Generate personalized message suggestions
   */
  const generateMessages = async (profileData, tone, language = 'en') => {
    try {
      const cacheKey = getCacheKey(profileData, tone, language);
      if (messageCache.has(cacheKey)) {
        return messageCache.get(cacheKey);
      }
      
      const profileInfo = formatProfileInfo(profileData);
      const toneDescription = getToneDescription(tone, language);
      
      const prompt = `
You are an expert at crafting personalized first messages for social media platforms.
Language: ${language}
Profile Information:
${profileInfo}

Please generate three personalized, engaging first messages in a ${tone} tone (${toneDescription}) that someone could send to this person.
Each message should:
- Be 2-3 sentences
- Reference something specific from their profile
- Feel natural and conversational
- Be respectful and appropriate
- End with a question
- Be in the specified language (${language})

Please provide exactly 3 message suggestions.`;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const data = await response.json();
      let messages = [];
      
      if (data.candidates && data.candidates.length > 0) {
        const content = data.candidates[0].content;
        
        if (content && content.parts && content.parts.length > 0) {
          messages = extractMessagesFromText(content.parts[0].text);
        }
      }
      
      if (messages.length === 0) {
        messages = generateFallbackMessages(profileData, language);
      }
      
      messageCache.set(cacheKey, messages);
      return messages;
    } catch (error) {
      console.error('Error generating messages:', error);
      return generateFallbackMessages(profileData, language);
    }
  };

  /**
   * Generate fallback messages if API fails
   */
  const generateFallbackMessages = (profileData, language) => {
    const fallbacks = {
      en: [
        `Hey ${profileData.name || 'there'}, your profile caught my eye! What's been keeping you busy lately?`,
        `Hi ${profileData.name || 'there'}! I found your profile interesting. How's your week going?`,
        `Hello ${profileData.name || 'there'}! I stumbled upon your profile. What kind of things are you into?`
      ],
      tr: [
        `Merhaba ${profileData.name || ''}, profilin dikkatimi çekti! Bugünlerde nelerle meşgulsün?`,
        `Selam ${profileData.name || ''}, profilini ilginç buldum. Haftan nasıl geçiyor?`,
        `Hey ${profileData.name || ''}, profiline denk geldim. Nelerden hoşlanırsın?`
      ],
      es: [
        `¡Hola ${profileData.name || ''}, tu perfil me llamó la atención! ¿Qué te mantiene ocupado últimamente?`,
        `¡Hola ${profileData.name || ''}, encontré interesante tu perfil! ¿Qué tal va tu semana?`,
        `¡Hola ${profileData.name || ''}, me encontré con tu perfil. ¿Qué tipo de cosas te gustan?`
      ],
      fr: [
        `Salut ${profileData.name || ''}, ton profil a attiré mon attention ! Qu'est-ce qui t'occupe ces temps-ci ?`,
        `Bonjour ${profileData.name || ''}, j'ai trouvé ton profil intéressant. Comment se passe ta semaine ?`,
        `Hey ${profileData.name || ''}, je suis tombé sur ton profil. Qu'est-ce qui te passionne ?`
      ],
      de: [
        `Hey ${profileData.name || ''}, dein Profil ist mir aufgefallen! Was beschäftigt dich zurzeit?`,
        `Hallo ${profileData.name || ''}, ich fand dein Profil interessant. Wie läuft deine Woche?`,
        `Hi ${profileData.name || ''}, ich bin auf dein Profil gestoßen. Was machst du gerne?`
      ]
    };

    return fallbacks[language] || fallbacks.en;
  };

  /**
   * Extract individual messages from the AI response
   */
  const extractMessagesFromText = (text) => {
    const cleanText = text.replace(/^(.*?)(1[\.\:\)]\s|message 1[\.\:\)]\s|first message[\.\:\)]\s)/is, '$2');
    let messages = cleanText.split(/\n\s*\d+[\.\:\)]\s+/);
    
    if (messages.length < 2) {
      messages = cleanText.split(/\n\s*\n/);
    }
    
    messages = messages
      .map(msg => msg.trim())
      .filter(msg => msg && msg.length > 10)
      .map(msg => {
        return msg.replace(/^(message\s*\d+[\.\:\)]\s*|suggestion\s*\d+[\.\:\)]\s*|\d+[\.\:\)]\s*)/i, '');
      });
    
    if (messages.length < 2 && messages[0] && messages[0].includes('\n')) {
      messages = messages[0].split('\n')
        .map(msg => msg.trim())
        .filter(msg => msg && msg.length > 10);
    }
    
    return messages.slice(0, 3);
  };

  return {
    generateMessages,
    translations
  };
})();