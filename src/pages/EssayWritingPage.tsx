import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, PenTool, CheckCircle, Loader2, FileText } from 'lucide-react';

const MIN_WORD_COUNT = parseInt(import.meta.env.VITE_ESSAY_MIN_WORD_COUNT || '200', 10);

const promptInstruction = `Generate ONE single, short essay question in ENGLISH for a B1-level university student on any topic. CRITICAL: Your entire response must be ONLY the English question itself. Do NOT add any extra text, explanations, or quotation marks.`;

const API_KEYS = [
  'AIzaSyDiVeORIE-f1NIasO4FZFb2OqOMQaAr7MY',  // 1. API Key
  'AIzaSyDjMxAzVQ3slraF0cmvHA-v_Rw80r3mZ70',  // 2. API Key
  'AIzaSyCXpPzPMMfUj60yMZyPvL3_rsoOftP7e58',  // 3. API Key
  'AIzaSyACHekasMC_i6B3iWqSsR_0r3dUKGtrf_4'   // 4. API Key
];

let currentKeyIndex = 0;

const getNextAPIKey = () => {
  const key = API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return key;
};

const makeAPIRequest = async (prompt: string, retryCount = 0): Promise<any> => {
  if (retryCount >= API_KEYS.length) {
    throw new Error('All API keys failed');
  }

  const apiKey = getNextAPIKey();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format');
    }

    return data;
  } catch (error) {
    console.warn(`API Key ${retryCount + 1} failed:`, error);
    return makeAPIRequest(prompt, retryCount + 1);
  }
};

const EssayWritingPage: React.FC = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState<string>('');
  const [loadingPrompt, setLoadingPrompt] = useState(false);
  const [essay, setEssay] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<'prompt' | 'writing' | 'feedback'>('prompt');
  const [feedbackLanguage, setFeedbackLanguage] = useState<'english' | 'turkish'>('english');

  // Prompt oluştur
  const generatePrompt = async () => {
    setLoadingPrompt(true);
    setError(null);
    try {
      const data = await makeAPIRequest(promptInstruction);
      const text = data.candidates[0].content.parts[0].text.trim();
      
      if (text && text.includes('?')) {
        // AI'dan gelen cevabın doğrudan prompt olduğunu varsayıyoruz.
        // Başındaki ve sonundaki fazlalıkları temizliyoruz.
        let cleanPrompt = text.replace(/^["'*\s]+|["'*\s]+$/g, '');

        // Soru işareti ile bittiğinden emin ol
        if (!cleanPrompt.endsWith('?')) {
            cleanPrompt += '?';
        }
        
        // Çok kısa veya anlamsızsa hata ver
        if (cleanPrompt.length < 20 || !cleanPrompt.includes(' ')) {
           throw new Error('Generated prompt is not a valid question.');
        }

        setPrompt(cleanPrompt);
        setPhase('writing');
      } else {
        throw new Error('API did not return a valid question.');
      }
    } catch (e: any) {
      console.error(e);
      setError(`Prompt oluşturulamadı: ${e.message || 'Bilinmeyen bir hata oluştu.'} Lütfen tekrar deneyin.`);
      setPhase('prompt'); // Prompt sayfasında kal
    } finally {
      setLoadingPrompt(false);
    }
  };

  // Essay değerlendirme
  const evaluateEssay = async () => {
    setEvaluating(true);
    setError(null);
    setFeedback(null);
    try {
      const language = feedbackLanguage === 'turkish' ? 'Turkish' : 'English';
      const evaluationPrompt = `Evaluate this essay using Koç University ELC academic writing standards. Be detailed but constructive.

EVALUATION CRITERIA (100 points total):
1. TASK ACHIEVEMENT (25 pts): Does it answer the prompt directly? Clear position?
2. ORGANIZATION (25 pts): Introduction-Body-Conclusion structure? Logical flow? Transitions?
3. CONTENT & IDEAS (25 pts): Relevant examples? Depth of analysis? Supporting details?
4. LANGUAGE USE (25 pts): Grammar accuracy? Vocabulary range? Sentence variety?

REQUIRED FORMAT:
- Score each criterion /25 and give total /100
- Provide specific feedback for Introduction, Body paragraphs, and Conclusion
- Note strengths and areas for improvement
- Academic tone suggestions
- If below 200 words or off-topic, deduct points
- NO bold text, NO asterisks, NO markdown formatting
- Use plain text only
- For positive feedback, start lines with [POSITIVE]
- For negative feedback, start lines with [NEGATIVE]
- For neutral feedback, start lines with [NEUTRAL]

Essay Prompt: "${prompt}"
Student Essay: "${essay}"

Provide feedback in ${language} using this format:
OVERALL SCORE: X/100
DETAILED FEEDBACK:
[your evaluation]`;
      
      const data = await makeAPIRequest(evaluationPrompt);
      const text = data.candidates[0].content.parts[0].text.trim();
      
      if (text) {
        setFeedback(text);
        setPhase('feedback');
      } else {
        setError('Could not evaluate essay. Please try again.');
      }
    } catch (e) {
      setError('Error during evaluation. All API keys failed.');
    } finally {
      setEvaluating(false);
    }
  };

  // Prompt aşaması
  if (phase === 'prompt') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <PenTool className="w-8 h-8 text-slate-600" />
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">Essay Yazma</h1>
            <p className="text-slate-600 leading-relaxed">Koç Üniversitesi standartlarında essay promptu oluşturun ve akademik yazma becerilerinizi AI feedback ile geliştirin.</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={generatePrompt}
            disabled={loadingPrompt}
            className="w-full h-12 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loadingPrompt ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Prompt Oluşturuluyor...</span>
              </>
            ) : (
              'Prompt Oluştur'
            )}
          </motion.button>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

                      <button 
            onClick={() => navigate('/')} 
            className="mt-6 flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Ana Sayfaya Dön
          </button>
        </motion.div>
      </div>
    );
  }

  // Yazma aşaması
  if (phase === 'writing') {
    const wordCount = essay.trim().split(/\s+/).filter(word => word.length > 0).length;
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => setPhase('prompt')} 
              className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Geri
            </button>
            <div className="text-sm text-slate-500">
              Kelime: <span className={wordCount < MIN_WORD_COUNT ? 'text-red-500' : 'text-green-600'}>{wordCount}</span> / {MIN_WORD_COUNT}
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
              <h3 className="text-sm font-medium text-slate-700 mb-2">Essay Sorusu</h3>
              <p className="text-slate-900 leading-relaxed text-lg font-medium mb-4">{prompt}</p>
              <div className="text-xs text-slate-600 bg-white p-3 rounded-lg border">
                <p className="font-medium mb-2">📝 Writing Tips:</p>
                <ul className="space-y-1">
                  <li>• Take a clear position (agree/disagree/balanced view)</li>
                  <li>• Use academic vocabulary and formal tone</li>
                  <li>• Include relevant examples from your experience or knowledge</li>
                  <li>• Minimum {MIN_WORD_COUNT} words for academic standard</li>
                </ul>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-slate-700">
                  Essay'inizi yazın
                </label>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-600">Feedback Dili:</span>
                  <select 
                    value={feedbackLanguage}
                    onChange={(e) => setFeedbackLanguage(e.target.value as 'english' | 'turkish')}
                    className="border border-slate-300 rounded px-2 py-1 text-slate-700"
                  >
                    <option value="english">English</option>
                    <option value="turkish">Türkçe</option>
                  </select>
                </div>
              </div>
              <textarea
                value={essay}
                onChange={e => setEssay(e.target.value)}
                className="w-full h-80 p-4 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-transparent resize-none"
                placeholder="Structure your essay: 
1. Introduction: Hook + Background + Thesis statement
2. Body Paragraph 1: Main argument + Supporting evidence + Example
3. Body Paragraph 2: Counter-argument or second point + Evidence + Example  
4. Conclusion: Restate thesis + Summarize key points + Final thought

Start writing here..."
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={evaluateEssay}
              disabled={wordCount < MIN_WORD_COUNT || evaluating}
              className="w-full h-12 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {evaluating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Değerlendiriliyor...</span>
                </>
              ) : (
                'Essay\'i Değerlendir'
              )}
            </motion.button>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // Geri bildirim aşaması
  if (phase === 'feedback') {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-2xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">Değerlendirme Tamamlandı</h2>
              <p className="text-slate-600">Detaylı geri bildiriminiz aşağıda</p>
              
              <div className="flex items-center justify-center gap-2 mt-4 text-sm">
                <span className="text-slate-600">Feedback Dili:</span>
                <select 
                  value={feedbackLanguage}
                  onChange={(e) => {
                    setFeedbackLanguage(e.target.value as 'english' | 'turkish');
                    // Re-evaluate with new language
                    evaluateEssay();
                  }}
                  className="border border-slate-300 rounded px-3 py-1 text-slate-700 bg-white"
                >
                  <option value="english">English</option>
                  <option value="turkish">Türkçe</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-slate-600" />
                <h3 className="font-medium text-slate-900">Geri Bildirim</h3>
              </div>
              <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-2">
                {feedback?.split('\n').map((line: string, index: number) => {
                  if (!line.trim()) return <div key={index} className="h-2" />;
                  
                  // Clean line from markdown formatting
                  let cleanLine = line.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1');
                  
                  // Determine background color based on prefix
                  let bgColor = '';
                  let textColor = 'text-slate-900';
                  
                  if (cleanLine.includes('[POSITIVE]')) {
                    bgColor = 'bg-green-50 border-l-4 border-green-200 pl-3 py-1';
                    cleanLine = cleanLine.replace('[POSITIVE]', '').trim();
                  } else if (cleanLine.includes('[NEGATIVE]')) {
                    bgColor = 'bg-red-50 border-l-4 border-red-200 pl-3 py-1';
                    cleanLine = cleanLine.replace('[NEGATIVE]', '').trim();
                  } else if (cleanLine.includes('[NEUTRAL]')) {
                    bgColor = 'bg-slate-50 border-l-4 border-slate-200 pl-3 py-1';
                    cleanLine = cleanLine.replace('[NEUTRAL]', '').trim();
                  }
                  
                  return (
                    <div key={index} className={`${bgColor} rounded-r-lg`}>
                      <span className={textColor}>{cleanLine}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPhase('writing')}
                className="flex-1 h-12 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
              >
                Write Again
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/')}
                className="flex-1 h-12 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
              >
                Home
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return null;
};

export default EssayWritingPage; 