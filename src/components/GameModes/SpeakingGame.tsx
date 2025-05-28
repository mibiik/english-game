import React, { useState, useEffect } from 'react';
import { Mic, Volume2, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { Word } from '../../data/words';
import { wordTracker } from '../../data/wordTracker';

interface SpeakingGameProps {
  words: Word[];
  unit: string;
}

export function SpeakingGame({ words, unit }: SpeakingGameProps) {
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    generateNewWord();
  }, [unit]);

  const generateNewWord = () => {
    wordTracker.initializeUnit(words, unit);
    const newWord = wordTracker.getNextWord(words, unit);
    if (newWord) {
      setCurrentWord(newWord);
      setFeedback('');
      setShowResult(false);
    }
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (!currentWord) return;

    setIsListening(true);
    setFeedback('Dinliyorum...');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      const correctWord = currentWord.english.toLowerCase();
      const similarity = calculateSimilarity(transcript, correctWord);

      setIsListening(false);
      setShowResult(true);

      if (similarity >= 0.8) {
        setIsCorrect(true);
        setScore(score + 10);
        setStreak(streak + 1);
        setBestStreak(Math.max(bestStreak, streak + 1));
        setFeedback('Harika! Doğru telaffuz!');
        setTimeout(generateNewWord, 2000);
      } else {
        setIsCorrect(false);
        setStreak(0);
        setFeedback(`Tekrar deneyin. Söylediğiniz: "${transcript}"`);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      setFeedback('Bir hata oluştu. Tekrar deneyin.');
    };

    recognition.start();
  };

  const calculateSimilarity = (str1: string, str2: string): number => {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));

    for (let i = 0; i <= len1; i++) matrix[i][0] = i;
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }

    return 1 - matrix[len1][len2] / Math.max(len1, len2);
  };

  if (!currentWord) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-gray-600">Bu ünitede henüz kelime bulunmamaktadır.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-8 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-purple-600">
              Skor: {score}
            </div>
            <div className="text-sm text-purple-400">
              Seri: {streak} | En İyi: {bestStreak}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
            {currentWord.english}
          </div>
          <div className="text-lg text-gray-600 mb-2">
            {currentWord.turkish}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => speak(currentWord.english)}
              className="p-4 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              title="Kelimeyi dinle"
            >
              <Volume2 className="w-6 h-6" />
            </button>

            <button
              onClick={startListening}
              disabled={isListening}
              className={`p-4 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-green-500 hover:bg-green-600'} text-white transition-colors`}
              title="Telaffuz et"
            >
              <Mic className="w-6 h-6" />
            </button>

            <button
              onClick={generateNewWord}
              className="p-4 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition-colors"
              title="Yeni kelime"
            >
              <RefreshCw className="w-6 h-6" />
            </button>
          </div>

          {feedback && (
            <div className={`mt-4 p-4 rounded-lg flex items-center gap-2 ${showResult ? (isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700') : 'bg-blue-100 text-blue-700'}`}>
              {showResult && (isCorrect ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />)}
              <span>{feedback}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}