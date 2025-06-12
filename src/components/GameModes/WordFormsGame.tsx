import React, { useState, useCallback } from 'react';
import { WordDetail } from '../../data/word4';
import { SentenceCompletionService } from '../../services/sentenceCompletionService';

interface WordFormsGameProps {
  words: WordDetail[];
}

const FORM_NAMES = {
  verb: 'fiil',
  noun: 'isim',
  adjective: 'sıfat',
  adverb: 'zarf'
};

export const WordFormsGame: React.FC<WordFormsGameProps> = ({ words }) => {
  const [paragraph, setParagraph] = useState<string>('');
  const [selectedWords, setSelectedWords] = useState<Array<{word: WordDetail, form: keyof typeof FORM_NAMES}>>([]);
  const [currentBlank, setCurrentBlank] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const sentenceService = SentenceCompletionService.getInstance();

  const selectWordsAndForms = useCallback(() => {
    const shuffled = [...words].sort(() => 0.5 - Math.random()).slice(0, 10);
    return shuffled.map(word => {
      const forms = [];
      if (word.forms.verb.length > 0) forms.push('verb');
      if (word.forms.noun.length > 0) forms.push('noun');
      if (word.forms.adjective.length > 0) forms.push('adjective');
      if (word.forms.adverb.length > 0) forms.push('adverb');
      
      const randomForm = forms[Math.floor(Math.random() * forms.length)] as keyof typeof FORM_NAMES;
      return { word, form: randomForm };
    }).filter(item => item.form);
  }, [words]);

  const generateParagraph = useCallback(async () => {
    setLoading(true);
    try {
      const wordsWithForms = selectWordsAndForms();
      setSelectedWords(wordsWithForms);

      const wordList = wordsWithForms.map(item => 
        `${item.word.headword} (${FORM_NAMES[item.form]} olarak)`
      ).join(', ');

      const prompt = `Bu kelimeleri belirtilen formlarda kullanarak anlamlı çok önemli: 'ÇOK AĞIR OLMAYAN AMA B1-B2 ARASI İNGİLİZCE  bir paragraf' yaz: ${wordList}. Her kelimeyi ___ ile değiştir. Sadece paragrafı döndür.`;

      const text = await sentenceService.generateCustomText(prompt);
      
      setParagraph(text);
      setCurrentBlank(0);
      setUserAnswers(new Array(wordsWithForms.length).fill(''));
      setScore(0);
      setGameCompleted(false);
    } catch (error) {
      console.error('Hata:', error);
    } finally {
      setLoading(false);
    }
  }, [selectWordsAndForms, sentenceService]);

  const handleAnswerSubmit = (answer: string) => {
    const currentWord = selectedWords[currentBlank];
    const correct = currentWord.word.forms[currentWord.form].some(
      form => form.toLowerCase() === answer.toLowerCase()
    );

    const newAnswers = [...userAnswers];
    newAnswers[currentBlank] = answer;
    setUserAnswers(newAnswers);

    if (correct) {
      setScore(prev => prev + 1);
      setTimeout(() => {
        if (currentBlank < selectedWords.length - 1) {
          setCurrentBlank(prev => prev + 1);
        } else {
          setGameCompleted(true);
        }
      }, 500);
    }
  };

  const renderParagraph = () => {
    const parts = paragraph.split('___');
    const result = [];

    for (let i = 0; i < parts.length; i++) {
      result.push(<span key={`text-${i}`}>{parts[i]}</span>);
      
      if (i < selectedWords.length) {
        if (userAnswers[i]) {
          const correctForms = selectedWords[i].word.forms[selectedWords[i].form];
          const correct = correctForms.some(
            form => form.toLowerCase() === userAnswers[i].toLowerCase()
          );
          result.push(
            <span key={`answer-${i}`} className={`px-2 py-1 mx-1 rounded ${correct ? 'bg-green-200' : 'bg-red-200'}`}>
              {userAnswers[i]}
            </span>
          );
        } else if (i === currentBlank) {
          result.push(<BlankInput key={`input-${i}`} onSubmit={handleAnswerSubmit} />);
        } else {
          result.push(<span key={`blank-${i}`} className="inline-block w-16 h-6 mx-1 bg-gray-200 rounded"></span>);
        }
      }
    }

    return <div className="text-lg leading-relaxed">{result}</div>;
  };

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[400px]">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Paragraf Tamamlama</h2>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          AI ile oluşturulan paragrafta kelimelerin doğru formlarını yazın.
        </p>
        <button
          onClick={() => { setGameStarted(true); generateParagraph(); }}
          className="px-8 py-4 bg-emerald-600 text-white rounded-xl text-lg font-bold hover:bg-emerald-700"
        >
          Oyuna Başla
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[400px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-emerald-500 mb-4"></div>
        <p className="text-lg text-emerald-700">Paragraf oluşturuluyor...</p>
      </div>
    );
  }

  if (gameCompleted) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-bold mb-4">Oyun Tamamlandı!</h3>
          <p className="text-xl mb-4">Skor: {score}/{selectedWords.length}</p>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            {renderParagraph()}
          </div>
          <button
            onClick={() => { setGameStarted(false); }}
            className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Yeni Oyun
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span>Skor: {score}/{currentBlank + 1}</span>
          <span>{currentBlank + 1}/{selectedWords.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-emerald-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentBlank + 1) / selectedWords.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          {renderParagraph()}
        </div>
        
        {currentBlank < selectedWords.length && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-blue-800">
              <strong>İpucu:</strong> "{selectedWords[currentBlank].word.headword}" kelimesinin{' '}
              <strong>{FORM_NAMES[selectedWords[currentBlank].form]}</strong> halini yazın.
            </p>
            {userAnswers[currentBlank] && !selectedWords[currentBlank].word.forms[selectedWords[currentBlank].form].some(
              form => form.toLowerCase() === userAnswers[currentBlank].toLowerCase()
            ) && (
              <span className="block text-xs text-green-700 mt-2">Doğru: {selectedWords[currentBlank].word.forms[selectedWords[currentBlank].form].join(', ')}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const BlankInput: React.FC<{ onSubmit: (answer: string) => void }> = ({ onSubmit }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
      setValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="inline-block">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="inline-block w-32 px-2 py-1 mx-1 border-2 border-emerald-400 rounded focus:outline-none"
        autoFocus
      />
    </form>
  );
};

export default WordFormsGame; 