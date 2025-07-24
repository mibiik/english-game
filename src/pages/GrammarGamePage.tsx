import React, { useState } from 'react';
import { aiService } from '../services/aiService';

// Grammar konuları (örnek)
const grammarTopics = [
  { key: 'tense-aspect', label: 'Tense & Aspect' },
  { key: 'questions', label: 'Questions' },
  { key: 'nouns-determiners', label: 'Nouns & Determiners' },
  { key: 'adjectives-adverbs', label: 'Adjectives & Adverbs' },
  { key: 'comparisons', label: 'Comparisons' },
  { key: 'gerunds-infinitives', label: 'Gerunds & Infinitives' },
  { key: 'modals', label: 'Modals' },
  { key: 'passives-causatives', label: 'Passives & Causatives' },
  { key: 'adjective-clauses', label: 'Adjective Clauses' },
  { key: 'noun-clauses', label: 'Noun Clauses' },
  { key: 'conditionals', label: 'Conditionals' },
  { key: 'participle-clauses', label: 'Participle Clauses' },
  { key: 'discourse-markers', label: 'Discourse Markers' },
];

const gameTypes = [
  { key: 'multiple-choice', label: 'Çoktan Seçmeli Quiz' },
  { key: 'right-wrong', label: 'Doğru/Yanlış' },
  { key: 'sentence-builder', label: 'Cümle Kurma' },
  { key: 'proofreading', label: 'Proofreading (Hata Bulma)' },
  { key: 'chat', label: 'Mini Chat' },
];

const MultipleChoiceGrammar: React.FC<{ topic: string }> = ({ topic }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [correct, setCorrect] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuestion = async () => {
    setLoading(true);
    setError(null);
    setSelected(null);
    setFeedback('');
    try {
      // AI prompt: 1 soru, 4 şık, doğru cevabı işaretle
      const prompt = `Generate a single upper-intermediate grammar multiple choice question about the topic '${grammarTopics.find(t=>t.key===topic)?.label}'.
Return ONLY a valid JSON object with this format:
{
  "question": "...",
  "options": ["A", "B", "C", "D"],
  "correct": "A"
}
Do not add any explanation or extra text.`;
      const aiResult = await aiService.generateText(prompt);
      const match = aiResult.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('AI yanıtı JSON formatında değil');
      const obj = JSON.parse(match[0]);
      setQuestion(obj.question);
      setOptions(obj.options);
      setCorrect(obj.correct);
    } catch (err: any) {
      setError('AI ile soru üretilirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { generateQuestion(); }, [topic]);

  const handleSelect = (opt: string) => {
    if (selected) return;
    setSelected(opt);
    if (opt === correct) {
      setFeedback('Doğru!');
      setScore(s => s + 1);
    } else {
      setFeedback(`Yanlış! Doğru cevap: ${correct}`);
    }
  };

  return (
    <div className="w-full bg-indigo-50 border border-indigo-200 rounded-lg p-8 text-indigo-900 text-lg font-semibold text-center shadow mt-8 animate-fade-in">
      <div className="mb-2">Konu: <span className="font-bold">{grammarTopics.find(t => t.key === topic)?.label}</span></div>
      <div className="mb-4">Oyun Tipi: <span className="font-bold">Çoktan Seçmeli Quiz</span></div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? (
        <div className="text-indigo-700">Soru yükleniyor...</div>
      ) : question && options.length > 0 ? (
        <>
          <div className="mb-6 text-xl font-bold">{question}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {options.map((opt, i) => (
              <button
                key={i}
                className={`py-3 px-4 rounded-lg font-bold shadow border-2 transition-all text-base ${selected === null ? 'bg-white text-indigo-800 border-indigo-200 hover:bg-indigo-100' : opt === correct ? 'bg-green-500 text-white border-green-600' : opt === selected ? 'bg-red-500 text-white border-red-600' : 'bg-white text-indigo-300 border-indigo-100 opacity-60'}`}
                onClick={() => handleSelect(opt)}
                disabled={!!selected}
              >
                {opt}
              </button>
            ))}
          </div>
          {feedback && <div className={`mt-2 text-lg font-bold ${feedback.startsWith('Doğru') ? 'text-green-700' : 'text-red-700'}`}>{feedback}</div>}
          <button className="mt-6 py-2 px-6 bg-indigo-500 text-white rounded-lg font-bold shadow hover:bg-indigo-600 transition" onClick={generateQuestion} disabled={loading}>Yeni Soru</button>
          <div className="mt-4 text-indigo-800 font-bold">Skor: {score}</div>
        </>
      ) : null}
    </div>
  );
};

const RightWrongGrammar: React.FC<{ topic: string }> = ({ topic }) => {
  const [sentence, setSentence] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSentence = async () => {
    setLoading(true);
    setError(null);
    setUserAnswer(null);
    setFeedback('');
    try {
      // AI prompt: 1 cümle, doğru mu yanlış mı, JSON formatında
      const prompt = `Generate a single upper-intermediate grammar sentence about the topic '${grammarTopics.find(t=>t.key===topic)?.label}'. Randomly make it correct or incorrect. Return ONLY a valid JSON object with this format:\n{\n  "sentence": "...",\n  "isCorrect": true/false\n}\nDo not add any explanation or extra text.`;
      const aiResult = await aiService.generateText(prompt);
      const match = aiResult.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('AI yanıtı JSON formatında değil');
      const obj = JSON.parse(match[0]);
      setSentence(obj.sentence);
      setIsCorrect(obj.isCorrect);
    } catch (err: any) {
      setError('AI ile cümle üretilirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { generateSentence(); }, [topic]);

  const handleUserAnswer = (answer: string) => {
    if (userAnswer) return;
    setUserAnswer(answer);
    if ((answer === 'doğru' && isCorrect) || (answer === 'yanlış' && !isCorrect)) {
      setFeedback('Doğru!');
      setScore(s => s + 1);
    } else {
      setFeedback(`Yanlış! Cümle aslında ${isCorrect ? 'doğru' : 'yanlış'}.`);
    }
  };

  return (
    <div className="w-full bg-indigo-50 border border-indigo-200 rounded-lg p-8 text-indigo-900 text-lg font-semibold text-center shadow mt-8 animate-fade-in">
      <div className="mb-2">Konu: <span className="font-bold">{grammarTopics.find(t => t.key === topic)?.label}</span></div>
      <div className="mb-4">Oyun Tipi: <span className="font-bold">Doğru/Yanlış</span></div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? (
        <div className="text-indigo-700">Cümle yükleniyor...</div>
      ) : sentence ? (
        <>
          <div className="mb-6 text-xl font-bold">{sentence}</div>
          <div className="flex justify-center gap-6 mb-4">
            <button
              className={`py-3 px-6 rounded-lg font-bold shadow border-2 transition-all text-base ${userAnswer === null ? 'bg-white text-indigo-800 border-indigo-200 hover:bg-indigo-100' : userAnswer === 'doğru' && isCorrect ? 'bg-green-500 text-white border-green-600' : userAnswer === 'doğru' && !isCorrect ? 'bg-red-500 text-white border-red-600' : 'bg-white text-indigo-300 border-indigo-100 opacity-60'}`}
              onClick={() => handleUserAnswer('doğru')}
              disabled={!!userAnswer}
            >
              Doğru
            </button>
            <button
              className={`py-3 px-6 rounded-lg font-bold shadow border-2 transition-all text-base ${userAnswer === null ? 'bg-white text-indigo-800 border-indigo-200 hover:bg-indigo-100' : userAnswer === 'yanlış' && !isCorrect ? 'bg-green-500 text-white border-green-600' : userAnswer === 'yanlış' && isCorrect ? 'bg-red-500 text-white border-red-600' : 'bg-white text-indigo-300 border-indigo-100 opacity-60'}`}
              onClick={() => handleUserAnswer('yanlış')}
              disabled={!!userAnswer}
            >
              Yanlış
            </button>
          </div>
          {feedback && <div className={`mt-2 text-lg font-bold ${feedback.startsWith('Doğru') ? 'text-green-700' : 'text-red-700'}`}>{feedback}</div>}
          <button className="mt-6 py-2 px-6 bg-indigo-500 text-white rounded-lg font-bold shadow hover:bg-indigo-600 transition" onClick={generateSentence} disabled={loading}>Yeni Cümle</button>
          <div className="mt-4 text-indigo-800 font-bold">Skor: {score}</div>
        </>
      ) : null}
    </div>
  );
};

const SentenceBuilderGrammar: React.FC<{ topic: string }> = ({ topic }) => {
  const [sentence, setSentence] = useState('');
  const [words, setWords] = useState<string[]>([]);
  const [correctOrder, setCorrectOrder] = useState<string[]>([]);
  const [userOrder, setUserOrder] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSentence = async () => {
    setLoading(true);
    setError(null);
    setWords([]);
    setCorrectOrder([]);
    setUserOrder([]);
    setFeedback('');
    try {
      // AI prompt: 1 cümle, doğru mu yanlış mı, JSON formatında
      const prompt = `Generate a single upper-intermediate grammar sentence about the topic '${grammarTopics.find(t=>t.key===topic)?.label}'.
Return ONLY a valid JSON object with this format:
{
  "sentence": "...",
  "words": ["word1", "word2", "word3", "word4"],
  "correctOrder": ["word1", "word2", "word3", "word4"]
}
Do not add any explanation or extra text.`;
      const aiResult = await aiService.generateText(prompt);
      const match = aiResult.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('AI yanıtı JSON formatında değil');
      const obj = JSON.parse(match[0]);
      setSentence(obj.sentence);
      setWords(obj.words);
      setCorrectOrder(obj.correctOrder);
    } catch (err: any) {
      setError('AI ile cümle üretilirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { generateSentence(); }, [topic]);

  const handleUserOrder = (order: string[]) => {
    if (userOrder.length > 0) return;
    setUserOrder(order);
    if (JSON.stringify(order) === JSON.stringify(correctOrder)) {
      setFeedback('Doğru!');
      setScore(s => s + 1);
    } else {
      setFeedback(`Yanlış! Doğru sıralama: ${correctOrder.join(', ')}`);
    }
  };

  return (
    <div className="w-full bg-indigo-50 border border-indigo-200 rounded-lg p-8 text-indigo-900 text-lg font-semibold text-center shadow mt-8 animate-fade-in">
      <div className="mb-2">Konu: <span className="font-bold">{grammarTopics.find(t => t.key === topic)?.label}</span></div>
      <div className="mb-4">Oyun Tipi: <span className="font-bold">Cümle Kurma</span></div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? (
        <div className="text-indigo-700">Cümle yükleniyor...</div>
      ) : sentence && words.length > 0 ? (
        <>
          <div className="mb-6 text-xl font-bold">{sentence}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {words.map((word, i) => (
              <button
                key={i}
                className={`py-3 px-4 rounded-lg font-bold shadow border-2 transition-all text-base ${userOrder.length === 0 ? 'bg-white text-indigo-800 border-indigo-200 hover:bg-indigo-100' : userOrder.includes(word) ? 'bg-green-500 text-white border-green-600' : 'bg-white text-indigo-300 border-indigo-100 opacity-60'}`}
                onClick={() => handleUserOrder([...userOrder, word])}
                disabled={userOrder.length > 0}
              >
                {word}
              </button>
            ))}
          </div>
          {feedback && <div className={`mt-2 text-lg font-bold ${feedback.startsWith('Doğru') ? 'text-green-700' : 'text-red-700'}`}>{feedback}</div>}
          <button className="mt-6 py-2 px-6 bg-indigo-500 text-white rounded-lg font-bold shadow hover:bg-indigo-600 transition" onClick={generateSentence} disabled={loading}>Yeni Cümle</button>
          <div className="mt-4 text-indigo-800 font-bold">Skor: {score}</div>
        </>
      ) : null}
    </div>
  );
};

const ProofreadingGrammar: React.FC<{ topic: string }> = ({ topic }) => {
  const [text, setText] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [userSelections, setUserSelections] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateText = async () => {
    setLoading(true);
    setError(null);
    setErrors([]);
    setUserSelections([]);
    setFeedback('');
    try {
      // AI prompt: 1 paragraf, 1-3 hata, JSON formatında
      const prompt = `Generate a single upper-intermediate grammar paragraph about the topic '${grammarTopics.find(t=>t.key===topic)?.label}'.
Return ONLY a valid JSON object with this format:
{
  "text": "...",
  "errors": ["error1", "error2", "error3"]
}
Do not add any explanation or extra text.`;
      const aiResult = await aiService.generateText(prompt);
      const match = aiResult.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('AI yanıtı JSON formatında değil');
      const obj = JSON.parse(match[0]);
      setText(obj.text);
      setErrors(obj.errors);
    } catch (err: any) {
      setError('AI ile metin üretilirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { generateText(); }, [topic]);

  const handleUserSelection = (selectedError: string) => {
    if (userSelections.length > 0) return;
    setUserSelections([...userSelections, selectedError]);
    if (errors.includes(selectedError)) {
      setFeedback('Doğru!');
      setScore(s => s + 1);
    } else {
      setFeedback(`Yanlış! Doğru hatalar: ${errors.join(', ')}`);
    }
  };

  return (
    <div className="w-full bg-indigo-50 border border-indigo-200 rounded-lg p-8 text-indigo-900 text-lg font-semibold text-center shadow mt-8 animate-fade-in">
      <div className="mb-2">Konu: <span className="font-bold">{grammarTopics.find(t => t.key === topic)?.label}</span></div>
      <div className="mb-4">Oyun Tipi: <span className="font-bold">Proofreading (Hata Bulma)</span></div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? (
        <div className="text-indigo-700">Metin yükleniyor...</div>
      ) : text ? (
        <>
          <div className="mb-6 text-xl font-bold">{text}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {errors.map((error, i) => (
              <button
                key={i}
                className={`py-3 px-4 rounded-lg font-bold shadow border-2 transition-all text-base ${userSelections.length === 0 ? 'bg-white text-indigo-800 border-indigo-200 hover:bg-indigo-100' : userSelections.includes(error) ? 'bg-green-500 text-white border-green-600' : 'bg-white text-indigo-300 border-indigo-100 opacity-60'}`}
                onClick={() => handleUserSelection(error)}
                disabled={userSelections.length > 0}
              >
                {error}
              </button>
            ))}
          </div>
          {feedback && <div className={`mt-2 text-lg font-bold ${feedback.startsWith('Doğru') ? 'text-green-700' : 'text-red-700'}`}>{feedback}</div>}
          <button className="mt-6 py-2 px-6 bg-indigo-500 text-white rounded-lg font-bold shadow hover:bg-indigo-600 transition" onClick={generateText} disabled={loading}>Yeni Metin</button>
          <div className="mt-4 text-indigo-800 font-bold">Skor: {score}</div>
        </>
      ) : null}
    </div>
  );
};

const MiniChatGrammar: React.FC<{ topic: string }> = ({ topic }) => {
  const [scenario, setScenario] = useState('');
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateScenario = async () => {
    setLoading(true);
    setError(null);
    setUserAnswer(null);
    setFeedback('');
    try {
      // AI prompt: 1 senaryo, 1 soru, JSON formatında
      const prompt = `Generate a single upper-intermediate grammar scenario about the topic '${grammarTopics.find(t=>t.key===topic)?.label}'.
Return ONLY a valid JSON object with this format:
{
  "scenario": "...",
  "question": "...",
  "options": ["A", "B", "C", "D"],
  "correct": "A"
}
Do not add any explanation or extra text.`;
      const aiResult = await aiService.generateText(prompt);
      const match = aiResult.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('AI yanıtı JSON formatında değil');
      const obj = JSON.parse(match[0]);
      setScenario(obj.scenario);
      setUserAnswer(null); // Reset user answer for new scenario
    } catch (err: any) {
      setError('AI ile senaryo üretilirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { generateScenario(); }, [topic]);

  const handleUserAnswer = (answer: string) => {
    if (userAnswer) return;
    setUserAnswer(answer);
    if (answer === 'A' || answer === 'B' || answer === 'C' || answer === 'D') {
      setFeedback('Doğru!');
      setScore(s => s + 1);
    } else {
      setFeedback(`Yanlış! Doğru cevap: ${userAnswer}`);
    }
  };

  return (
    <div className="w-full bg-indigo-50 border border-indigo-200 rounded-lg p-8 text-indigo-900 text-lg font-semibold text-center shadow mt-8 animate-fade-in">
      <div className="mb-2">Konu: <span className="font-bold">{grammarTopics.find(t => t.key === topic)?.label}</span></div>
      <div className="mb-4">Oyun Tipi: <span className="font-bold">Mini Chat</span></div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? (
        <div className="text-indigo-700">Senaryo yükleniyor...</div>
      ) : scenario ? (
        <>
          <div className="mb-6 text-xl font-bold">{scenario}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <button
              className={`py-3 px-4 rounded-lg font-bold shadow border-2 transition-all text-base ${userAnswer === null ? 'bg-white text-indigo-800 border-indigo-200 hover:bg-indigo-100' : userAnswer === 'A' ? 'bg-green-500 text-white border-green-600' : 'bg-white text-indigo-300 border-indigo-100 opacity-60'}`}
              onClick={() => handleUserAnswer('A')}
              disabled={!!userAnswer}
            >
              A
            </button>
            <button
              className={`py-3 px-4 rounded-lg font-bold shadow border-2 transition-all text-base ${userAnswer === null ? 'bg-white text-indigo-800 border-indigo-200 hover:bg-indigo-100' : userAnswer === 'B' ? 'bg-green-500 text-white border-green-600' : 'bg-white text-indigo-300 border-indigo-100 opacity-60'}`}
              onClick={() => handleUserAnswer('B')}
              disabled={!!userAnswer}
            >
              B
            </button>
            <button
              className={`py-3 px-4 rounded-lg font-bold shadow border-2 transition-all text-base ${userAnswer === null ? 'bg-white text-indigo-800 border-indigo-200 hover:bg-indigo-100' : userAnswer === 'C' ? 'bg-green-500 text-white border-green-600' : 'bg-white text-indigo-300 border-indigo-100 opacity-60'}`}
              onClick={() => handleUserAnswer('C')}
              disabled={!!userAnswer}
            >
              C
            </button>
            <button
              className={`py-3 px-4 rounded-lg font-bold shadow border-2 transition-all text-base ${userAnswer === null ? 'bg-white text-indigo-800 border-indigo-200 hover:bg-indigo-100' : userAnswer === 'D' ? 'bg-green-500 text-white border-green-600' : 'bg-white text-indigo-300 border-indigo-100 opacity-60'}`}
              onClick={() => handleUserAnswer('D')}
              disabled={!!userAnswer}
            >
              D
            </button>
          </div>
          {feedback && <div className={`mt-2 text-lg font-bold ${feedback.startsWith('Doğru') ? 'text-green-700' : 'text-red-700'}`}>{feedback}</div>}
          <button className="mt-6 py-2 px-6 bg-indigo-500 text-white rounded-lg font-bold shadow hover:bg-indigo-600 transition" onClick={generateScenario} disabled={loading}>Yeni Senaryo</button>
          <div className="mt-4 text-indigo-800 font-bold">Skor: {score}</div>
        </>
      ) : null}
    </div>
  );
};

const PlaceholderGame: React.FC<{ topic: string; gameType: string }> = ({ topic, gameType }) => (
  <div className="w-full bg-indigo-50 border border-indigo-200 rounded-lg p-8 text-indigo-900 text-lg font-semibold text-center shadow mt-8 animate-fade-in">
    <div className="mb-2">Seçilen Konu: <span className="font-bold">{grammarTopics.find(t => t.key === topic)?.label}</span></div>
    <div className="mb-4">Oyun Tipi: <span className="font-bold">{gameTypes.find(g => g.key === gameType)?.label}</span></div>
    <div className="text-indigo-700">Bu oyun tipi için özel component ve AI entegrasyonu burada olacak.</div>
  </div>
);

const GrammarGamePage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-2xl font-bold text-gray-500">Bu mod şu an kapalı.</div>
    </div>
  );
};

export default GrammarGamePage; 
