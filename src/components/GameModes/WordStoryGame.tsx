import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, PenTool, Trophy, Brain, CheckCircle, Star, FileText, Sparkles, Zap, Globe, TrendingUp } from 'lucide-react';
import { WordDetail } from '../../data/words';

interface WordStoryGameProps {
  words: WordDetail[];
  onGameComplete?: () => void;
}

interface EssayChallenge {
  id: number;
  targetWords: WordDetail[];
  aiGeneratedPrompt: string;
  topic: string;
  minWords: number;
  difficulty: 'current' | 'general' | 'academic';
  category: string;
  vocabulary: string[];
}

const WordStoryGame: React.FC<WordStoryGameProps> = ({ words, onGameComplete }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState<EssayChallenge | null>(null);
  const [userEssay, setUserEssay] = useState('');
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showWordBank, setShowWordBank] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [aiScore, setAiScore] = useState<number | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [errorCodes, setErrorCodes] = useState<string[]>([]);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);

  // Basit AI Prompt Üretimi
  type AIPromptResult = { prompt: string, topic: string, category: string, vocabulary: string[] };
  const generateAIPrompt = async (words: string[]): Promise<AIPromptResult> => {
    console.log('🎯 AI Prompt Üretiliyor...', words);
    
    try {
      const GEMINI_API_KEY = 'AIzaSyBrXS7wQ57HAxrV0XhsWm39zixq8B2au0Q';
      
      const requestBody = {
        contents: [{
          parts: [{
            text: `Rastgele, güncel ve çeşitli bir essay konusu üret.

Şu formatta dön:
PROMPT: [İngilizce essay sorusu]
TOPIC: [Kısa konu başlığı]
CATEGORY: [daily-life/lifestyle/health/education/technology]
VOCABULARY: [prompt ile ilgili 5 anahtar kelime, virgülle]
`
          }]
        }],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 300
        }
      };

             const response = await fetch(
         `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
         {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(requestBody)
         }
       );

      if (response.ok) {
        const data = await response.json();
        const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        console.log('AI yanıtı:', aiText);
        const promptMatch = aiText.match(/PROMPT:\s*(.*?)(?=TOPIC:|$)/s);
        const topicMatch = aiText.match(/TOPIC:\s*(.*?)(?=CATEGORY:|$)/s);
        const categoryMatch = aiText.match(/CATEGORY:\s*(.*?)(?=VOCABULARY:|$)/s);
        const vocabMatch = aiText.match(/VOCABULARY:\s*\[([^\]]+)\]/i);
        const vocabulary = vocabMatch ? vocabMatch[1].split(',').map((v: string) => v.trim()).filter(Boolean) : [];
        
        if (promptMatch && topicMatch) {
          console.log('✅ AI Prompt Üretildi');
          return {
            prompt: promptMatch[1].trim(),
            topic: topicMatch[1].trim(),
            category: categoryMatch ? categoryMatch[1].trim() : 'general',
            vocabulary
          };
        }
      }
    } catch (error) {
      console.log('⚠️ AI Prompt Hatası, Fallback Kullanılıyor');
    }

    // Günlük hayat odaklı basit fallback prompts
    const fallbacks: AIPromptResult[] = [
      {
        prompt: 'What are the advantages and disadvantages of living in a big city? Give examples from daily life.',
        topic: 'City Life',
        category: 'daily-life',
        vocabulary: ['city', 'transport', 'crowded', 'opportunity', 'pollution']
      },
      {
        prompt: 'Should students have part-time jobs while studying? Discuss the benefits and problems.',
        topic: 'Student Jobs',
        category: 'education',
        vocabulary: ['student', 'job', 'salary', 'experience', 'time']
      },
      {
        prompt: 'What are the positive and negative effects of using smartphones every day?',
        topic: 'Smartphone Usage',
        category: 'technology',
        vocabulary: ['smartphone', 'screen', 'communication', 'addiction', 'information']
      },
      {
        prompt: 'Is it better to eat at home or eat at restaurants? Compare the advantages and disadvantages.',
        topic: 'Eating Habits',
        category: 'lifestyle',
        vocabulary: ['restaurant', 'home', 'meal', 'cost', 'health']
      },
      {
        prompt: 'Should people exercise every day? Discuss the advantages and possible problems.',
        topic: 'Daily Exercise',
        category: 'health',
        vocabulary: ['exercise', 'health', 'routine', 'energy', 'injury']
      }
    ];
    
    const selected = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    console.log('📝 Fallback Prompt Seçildi:', selected.topic);
    return selected;
  };

  const generateChallenges = async (): Promise<EssayChallenge[]> => {
    const shuffledWords = [...words].sort(() => 0.5 - Math.random());
    const challenges: EssayChallenge[] = [];

    for (let i = 0; i < 3; i++) { // 3 challenge'a düşürdüm
      const challengeWords = shuffledWords.slice(i * 5, (i + 1) * 5);
      const vocabularyList = challengeWords.map(w => w.headword);
      
      setIsGeneratingPrompt(true);
      const aiPrompt = await generateAIPrompt(vocabularyList);
      setIsGeneratingPrompt(false);
      
      challenges.push({
        id: i + 1,
        targetWords: challengeWords,
        aiGeneratedPrompt: aiPrompt.prompt,
        topic: aiPrompt.topic,
        minWords: 5,
        difficulty: i === 0 ? 'current' : i === 1 ? 'general' : 'academic',
        category: aiPrompt.category,
        vocabulary: aiPrompt.vocabulary
      });
    }

    return challenges;
  };

  const [challenges, setChallenges] = useState<EssayChallenge[]>([]);

  // Sıfırdan AI Değerlendirme Sistemi
  const evaluateEssayWithAI = async (essay: string, targetWords: string[], topic: string): Promise<{score: number, analysis: string, errorCodes: string[]}> => {
    console.log('🤖 AI Değerlendirme Başlatılıyor...');
    
    try {
      // API anahtarı - sizin verdiğiniz
      const GEMINI_API_KEY = 'AIzaSyBrXS7wQ57HAxrV0XhsWm39zixq8B2au0Q';
      
      // Basit kelime sayısı analizi
      const wordCount = essay.trim().split(/\s+/).length;
      console.log('📝 Kelime Sayısı:', wordCount);
      
      // Detaylı rubric tabanlı değerlendirme
      const requestBody = {
        contents: [{
          parts: [{
            text: `Bu essay'i ELC ve Koç Üniversitesi standartlarına göre çok detaylı değerlendir:

ESSAY: "${essay}"
KONU: "${topic}"
KELIME SAYISI: ${wordCount}
HEDEF KELİMELER: ${targetWords.join(', ')}

RUBRIC (Her alan 25 puan, toplam 100 puan):

1. TASK ACHIEVEMENT (25 puan):
- Konuya uygunluk (0-10)
- Soruyu tam yanıtlama (0-10) 
- Örnekler ve detaylar (0-5)

2. ORGANIZATION & COHERENCE (25 puan):
- Giriş-gelişme-sonuç yapısı (0-10)
- Paragraf düzeni (0-8)
- Geçiş ifadeleri (0-7)

3. LANGUAGE USE & VOCABULARY (25 puan):
- Gramer doğruluğu (0-10)
- Kelime seçimi (0-8)
- Hedef kelimeleri kullanım (0-7)

4. CONTENT DEVELOPMENT (25 puan):
- Fikir geliştirme (0-10)
- Sebep-sonuç ilişkileri (0-8)
- Karşılaştırma ve örnekler (0-7)

YANIT FORMATI:
PUAN: [0-100 toplam puan]
YÜZ_PUAN: [Yüz üzerinden puan - örnek: 85/100]

DETAYLI ANALİZ:
📋 TASK ACHIEVEMENT ([X]/25):
- Konu uyumu: [detaylı açıklama]
- Soru yanıtlama: [detaylı açıklama]
- Örnekler: [detaylı açıklama]

📝 ORGANIZATION ([X]/25):
- Yapı: [giriş/gelişme/sonuç analizi]
- Paragraflar: [her paragraf analizi]
- Geçişler: [transition words analizi]

🔤 LANGUAGE ([X]/25):
- Gramer: [hata analizi ve örnekler]
- Kelime: [vocabulary analizi]
- Hedef kelimeler: [kullanım analizi]

💡 CONTENT ([X]/25):
- Fikir kalitesi: [detaylı değerlendirme]
- Mantık: [sebep-sonuç analizi]
- Örnekler: [örnek kalitesi]

HATA KODLARI: [GR, VOC, WO, STRUCT, CONTENT]

ÖNERİLER:
[Gelişim için 3-5 spesifik öneri]`
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2000
        }
      };

      console.log('📡 API İsteği Gönderiliyor...');
      
             const response = await fetch(
         `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
         {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json'
           },
           body: JSON.stringify(requestBody)
         }
       );

      console.log('📡 API Yanıt Durumu:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Hatası:', errorText);
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ API Yanıtı Alındı:', data);

      // AI yanıtını parse et
      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      console.log('🧠 AI Metni:', aiText);

      // Basit puan çıkarma
      const scoreMatch = aiText.match(/PUAN:\s*(\d+)/i) || aiText.match(/(\d+)\/100/) || aiText.match(/(\d+)\s*puan/i);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : Math.floor(50 + (wordCount / 10));

      // Analiz çıkarma
      const analysisMatch = aiText.match(/ANALİZ:\s*(.*?)(?=HATALAR:|$)/s) || aiText.match(/analiz[:\s]+(.*)/si);
      let analysis = analysisMatch ? analysisMatch[1].trim() : aiText;

      // Eğer AI yanıtı çok kısa ise manuel analiz ekle
      if (analysis.length < 50) {
        analysis = `Essay'iniz değerlendirildi. Kelime sayısı: ${wordCount}. `;
        
        if (wordCount < 100) {
          analysis += 'Essay çok kısa, daha uzun yazmanız gerekiyor. ';
        } else if (wordCount > 300) {
          analysis += 'İyi uzunlukta bir essay yazdınız. ';
        }
        
        const usedTargetWords = targetWords.filter(word => 
          essay.toLowerCase().includes(word.toLowerCase())
        ).length;
        
        analysis += `Hedef kelimelerden ${usedTargetWords} tanesini kullandınız. `;
        
        if (essay.includes('.') && essay.includes(',')) {
          analysis += 'Noktalama işaretlerini doğru kullanmışsınız. ';
        }
        
        analysis += '\n\nGenel değerlendirme: Akademik yazım standartlarına uygun essay yazma pratiği yapın.';
      }

             // Hata kodları çıkarma
       const errorMatch = aiText.match(/HATALAR:\s*\[(.*?)\]/i) || aiText.match(/hata[:\s]+([A-Z,\s]+)/i);
       const errorCodes = errorMatch ? 
         errorMatch[1].split(',').map((code: string) => code.trim()).filter((code: string) => code) : 
         [];

      console.log('✅ Değerlendirme Tamamlandı:', { score, analysisLength: analysis.length, errorCodes });

      // Yüz üzerinden puanı analiz sonuna ekle
      const finalScore = Math.max(0, Math.min(100, score));
      const analysisWithScore = analysis + `\n\n**📊 Final Score: ${finalScore}/100**`;
      
      return {
        score: finalScore,
        analysis: analysisWithScore,
        errorCodes
      };

    } catch (error) {
      console.error('❌ AI Hata:', error);
      
      // Fallback manuel değerlendirme
      const wordCount = essay.trim().split(/\s+/).length;
      const usedWords = targetWords.filter(word => 
        essay.toLowerCase().includes(word.toLowerCase())
      ).length;
      
      const baseScore = Math.min(80, wordCount / 2 + usedWords * 5 + 30);
      
      const finalScore = Math.floor(baseScore);
      return {
        score: finalScore,
        analysis: `Manual değerlendirme: Essay'iniz ${wordCount} kelime. ${usedWords} hedef kelime kullandınız. AI sistem şu anda çevrimdışı, manuel puanlama yapıldı. Essay'iniz gözden geçirildi ve temel kriterlere göre değerlendirildi.\n\n**📊 Final Score: ${finalScore}/100**`,
        errorCodes: ['MANUAL_EVAL']
      };
    }
  };

  const startGame = async () => {
    setGameStarted(true);
    setIsGeneratingPrompt(true);
    setCurrentChallenge(null); // Prompt yüklenene kadar null
    setUserEssay('');
    setAiScore(null);
    setAiAnalysis(null);
    setFeedback(null);
    setErrorCodes([]);
    setIsEvaluating(false);
    // Prompt ve kelimeleri AI'dan çek
    const aiPrompt = await generateAIPrompt([]);
    setCurrentChallenge({
      id: 1,
      targetWords: [],
      aiGeneratedPrompt: aiPrompt.prompt,
      topic: aiPrompt.topic,
      minWords: 0,
      difficulty: 'current',
      category: aiPrompt.category,
      vocabulary: aiPrompt.vocabulary
    });
    setIsGeneratingPrompt(false);
  };

  const checkUsedWords = (essay: string): string[] => {
    if (!currentChallenge) return [];
    
    const essayLower = essay.toLowerCase();
    const foundWords: string[] = [];
    
    currentChallenge.targetWords.forEach(word => {
      const headword = word.headword.toLowerCase();
      const turkish = word.turkish.toLowerCase();
      
      // Ana kelimeyi veya Türkçe karşılığını kontrol et
      if (essayLower.includes(headword) || essayLower.includes(turkish)) {
        foundWords.push(word.headword);
      }
      
      // Kelime formlarını kontrol et
      Object.values(word.forms).flat().forEach(form => {
        if (form && typeof form === 'string' && essayLower.includes(form.toLowerCase())) {
          if (!foundWords.includes(word.headword)) {
            foundWords.push(word.headword);
          }
        }
      });
    });
    
    return foundWords;
  };

  const handleEssaySubmit = async () => {
    if (!currentChallenge || userEssay.trim().length < 100) {
      setFeedback('Lütfen daha uzun bir essay yazın (en az 100 karakter).');
      return;
    }

    // ELC kelime sayısı kontrolü
    const wordCount = userEssay.trim().split(/\s+/).length;
    const minWordLimit = 150;
    
    if (wordCount < minWordLimit) {
      setFeedback(`⚠️ ELC Kuralları: Essay minimum ${minWordLimit} kelime olmalıdır. Şu anki kelime sayınız: ${wordCount}. Puanınız ciddi şekilde etkilenecektir.`);
      // Yine de devam etmesine izin ver ama uyar
    }

    const foundWords = checkUsedWords(userEssay);
    setUsedWords(foundWords);

    // 5 kelime zorunluluğu kaldırıldı - direkt değerlendirme yap
    setIsEvaluating(true);
    setFeedback('🤖 AI essay\'inizi Koç Üniversitesi standartlarına göre değerlendiriyor...');
    
    // AI ile değerlendirme
    const targetWords = currentChallenge.targetWords.map(w => w.headword);
    const aiResult = await evaluateEssayWithAI(userEssay, targetWords, currentChallenge.topic);
    
    setAiScore(aiResult.score);
    // **xxx** formatını <strong>xxx</strong> formatına çevir
    const formattedAnalysis = aiResult.analysis.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    setAiAnalysis(formattedAnalysis);
    setErrorCodes(aiResult.errorCodes);
    setIsEvaluating(false);
    
    // Puan hesaplama: Kelime kullanımı + AI değerlendirmesi
    const wordPoints = foundWords.length * 10; // Kelime bonusu azaltıldı
    const aiPoints = Math.round(aiResult.score * 0.8); // AI puanının %80'i
    const lengthBonus = userEssay.length > 500 ? 20 : 0;
    const totalPoints = wordPoints + aiPoints + lengthBonus;
    
    setScore(prev => prev + totalPoints);
    setFeedback(`🎓 Essay Değerlendirmesi Tamamlandı! ${foundWords.length} vocabulary kelime kullandınız. Toplam: +${totalPoints} puan!`);
    
    // Otomatik geçiş kaldırıldı - kullanıcı "Yeni Essay" butonuna basacak
  };

  const nextChallenge = () => {
    if (challengeIndex < challenges.length - 1) {
      setChallengeIndex(prev => prev + 1);
      setCurrentChallenge(challenges[challengeIndex + 1]);
      setUserEssay('');
      setUsedWords([]);
      setFeedback(null);
      setAiScore(null);
      setAiAnalysis(null);
    } else {
      setGameCompleted(true);
      if (onGameComplete) onGameComplete();
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameCompleted(false);
    setChallengeIndex(0);
    setScore(0);
    setUserEssay('');
    setUsedWords([]);
    setFeedback(null);
    setIsEvaluating(false);
    setAiScore(null);
    setAiAnalysis(null);
    setErrorCodes([]);
  };

  // Analizi bölümlerine ayıran yardımcı fonksiyon
  function parseAnalysis(analysis: string) {
    // Bölümleri ayır
    const sections = {} as Record<string, string>;
    const titles = [
      'Task Achievement',
      'Organization',
      'Language',
      'Content',
      'Final Score',
    ];
    let current = '';
    analysis.split(/\n/).forEach(line => {
      const found = titles.find(t => line.toLowerCase().includes(t.toLowerCase()));
      if (found) {
        current = found;
        sections[current] = '';
      }
      if (current && line.trim()) {
        sections[current] += (sections[current] ? '\n' : '') + line.trim();
      }
    });
    return sections;
  }

  // Essay başlatıldığında otomatik yeni konu üret (ilk açılışta)
  useEffect(() => {
    if (gameStarted && !currentChallenge && !isGeneratingPrompt) {
      startGame();
    }
    // eslint-disable-next-line
  }, [gameStarted]);

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-xl mx-auto bg-white rounded-3xl shadow-xl p-10 flex flex-col items-center gap-8 border border-gray-100">
          <div className="flex flex-col items-center gap-2">
            <PenTool className="w-12 h-12 text-blue-500 mb-2" />
            <h1 className="text-3xl font-bold text-gray-900">Essay Writing Practice</h1>
            <p className="text-gray-500 text-lg text-center">Write an academic essay on a real-life topic. Get instant AI feedback and a score out of 100.</p>
          </div>
          <button
            onClick={startGame}
            disabled={isGeneratingPrompt}
            className="w-full py-4 px-8 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold shadow transition-all disabled:opacity-50"
          >
            {isGeneratingPrompt ? 'Loading...' : 'Start Essay'}
          </button>
        </div>
      </div>
    );
  }

  if (gameCompleted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-900 rounded-lg p-8 max-w-2xl w-full text-center border border-gray-800"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Trophy className="w-10 h-10 text-white" />
          </motion.div>

          <h2 className="text-3xl font-bold text-white mb-4">Tebrikler!</h2>
          <p className="text-gray-400 text-lg mb-8">
            AI Essay Challenge tamamlandı!
          </p>

          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <div className="text-5xl font-bold text-white mb-2">
              {score}
            </div>
            <div className="text-gray-400 text-lg">Toplam Puan</div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-white font-bold">AI Prompts</div>
              <div className="text-gray-400 text-sm">Güncel konular</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-white font-bold">Topic Control</div>
              <div className="text-gray-400 text-sm">AI kontrolü</div>
            </div>
          </div>

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetGame}
              className="flex-1 bg-white text-black py-3 px-6 rounded-lg font-bold hover:bg-gray-100 transition-all"
            >
              Tekrar Oyna
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.href = '/'}
              className="flex-1 bg-gray-800 text-white py-3 px-6 rounded-lg font-bold border border-gray-700 hover:bg-gray-700 transition-all"
            >
              Ana Sayfa
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 flex flex-col items-center">
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sol: Suggested Vocabulary + Prompt ve Essay Alanı */}
        <div className="md:col-span-2 flex flex-col gap-8">
          {/* Yeni Konu Butonu */}
          <div className="flex justify-end mb-2">
            <button
              onClick={startGame}
              disabled={isGeneratingPrompt}
              className="px-5 py-2 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold shadow disabled:opacity-50 transition-all"
            >
              {isGeneratingPrompt ? 'Loading...' : 'Yeni Konu'}
            </button>
          </div>
          {/* Suggested Vocabulary Kutusu */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 flex flex-col gap-3 min-h-[90px]">
            <div className="flex items-center gap-2 mb-1">
              <PenTool className="w-6 h-6 text-emerald-500" />
              <div className="text-lg font-bold text-gray-900">Suggested Vocabulary</div>
            </div>
            <div className="flex flex-wrap gap-2 mt-1 min-h-[32px]">
              {isGeneratingPrompt || !currentChallenge ? (
                <>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="bg-emerald-100 animate-pulse w-20 h-8 rounded-xl" />
                  ))}
                </>
              ) : (
                (currentChallenge.vocabulary && currentChallenge.vocabulary.length > 0) ? (
                  currentChallenge.vocabulary.map((word, i) => (
                    <span key={i} className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-base font-semibold border border-emerald-100 shadow-sm">
                      {word}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">No suggested words</span>
                )
              )}
            </div>
          </div>

          {/* Prompt Kutusu */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 flex flex-col gap-4 min-h-[120px]">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-8 h-8 text-blue-400" />
              <div>
                <div className="text-xs uppercase tracking-wider text-blue-400 font-semibold">Essay Topic</div>
                <div className="text-xl font-bold text-gray-900">
                  {isGeneratingPrompt || !currentChallenge ? (
                    <span className="bg-blue-100 animate-pulse w-40 h-6 rounded" />
                  ) : (
                    currentChallenge.topic
                  )}
                </div>
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 text-gray-700 text-base font-medium min-h-[40px]">
              {isGeneratingPrompt || !currentChallenge ? (
                <span className="bg-gray-200 animate-pulse w-full h-6 block rounded" />
              ) : (
                currentChallenge.aiGeneratedPrompt
              )}
            </div>
          </div>

          {/* Essay Alanı */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <PenTool className="w-5 h-5 text-blue-400" />
                Your Essay
              </label>
              <div className="text-gray-400 text-sm">
                {userEssay.trim().split(/\s+/).filter(word => word).length} words
              </div>
            </div>
            <textarea
              value={userEssay}
              onChange={e => setUserEssay(e.target.value)}
              className="w-full min-h-[220px] bg-gray-50 border border-gray-200 rounded-xl p-5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 text-base transition-all"
              placeholder="Start writing your essay here..."
              disabled={!!aiScore || isGeneratingPrompt || !currentChallenge}
            />
            {!aiScore && (
              <button
                onClick={handleEssaySubmit}
                disabled={isEvaluating || userEssay.trim().length < 50}
                className="w-full py-4 px-8 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold shadow transition-all disabled:opacity-50"
              >
                {isEvaluating ? 'Evaluating...' : 'Submit for AI Feedback'}
              </button>
            )}
            {feedback && <div className="text-red-500 text-sm font-medium mt-2">{feedback}</div>}
          </div>

          {/* AI Feedback Alanı */}
          {aiScore !== null && (
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 flex flex-col gap-6">
              <div className="flex items-center gap-3 mb-2">
                <Brain className="w-7 h-7 text-green-500" />
                <div className="text-lg font-bold text-gray-900">AI Feedback & Score</div>
              </div>
              {/* Büyük, renkli puan kutusu */}
              <div className="flex items-center gap-4 mb-2">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg border-4 border-white">
                  <span className="text-3xl font-extrabold text-white">{aiScore}</span>
                </div>
                <div className="text-lg text-gray-700 font-semibold">out of 100</div>
              </div>
              {/* Analiz bölümleri */}
              {aiAnalysis && (() => {
                const sections = parseAnalysis(aiAnalysis);
                return (
                  <div className="flex flex-col gap-4">
                    {['Task Achievement', 'Organization', 'Language', 'Content'].map((key) => (
                      sections[key] && (
                        <div key={key} className="bg-gray-50 rounded-xl border border-gray-100 p-5">
                          <div className="text-base font-bold text-emerald-700 mb-2">{key}</div>
                          <div className="text-gray-800 whitespace-pre-line text-base" dangerouslySetInnerHTML={{ __html: sections[key].replace(key, '').trim() }} />
                        </div>
                      )
                    ))}
                    {/* Final Score */}
                    {sections['Final Score'] && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl font-bold text-base shadow-sm">{sections['Final Score'].replace('Final Score:', '').replace('**', '').trim()}</span>
                      </div>
                    )}
                  </div>
                );
              })()}
              {/* Hata kodları ve öneriler (örnek, burada errorCodes badge olarak) */}
              {errorCodes.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {errorCodes.map((code, i) => (
                    <span key={i} className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs font-bold tracking-wide border border-red-200">{code}</span>
                  ))}
                </div>
              )}
              <button
                onClick={startGame}
                className="w-full py-4 px-8 rounded-2xl bg-green-500 hover:bg-green-600 text-white text-lg font-semibold shadow transition-all mt-2"
              >
                Write Another Essay
              </button>
            </div>
          )}
        </div>

        {/* Sağ: AI Writing Tips */}
        <aside className="md:col-span-1 flex flex-col gap-8">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 flex flex-col gap-4 sticky top-8">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <div className="text-lg font-bold text-gray-900">AI Writing Tips</div>
            </div>
            <ul className="list-disc pl-5 text-gray-700 text-base space-y-2">
              <li>Start with a clear introduction and thesis statement.</li>
              <li>Use one main idea per paragraph.</li>
              <li>Support your ideas with examples or reasons.</li>
              <li>Use linking words (Firstly, However, In conclusion...)</li>
              <li>Check your grammar and spelling before submitting.</li>
              <li>Write at least 5 paragraphs (Intro, 3 Body, Conclusion).</li>
              <li>Stay on topic and answer the prompt directly.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default WordStoryGame; 