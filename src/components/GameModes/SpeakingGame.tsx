import React, { useState, useEffect, useCallback } from 'react';
import { Mic, Volume2, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { WordDetail } from '../../data/words';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeakingGameProps {
  words: WordDetail[];
}

export function SpeakingGame({ words }: SpeakingGameProps) {
  const [roundWords, setRoundWords] = useState<WordDetail[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const startNewRound = useCallback(() => {
    const shuffled = [...words].sort(() => 0.5 - Math.random());
    setRoundWords(shuffled.slice(0, 15));
    setCurrentWordIndex(0);
    setFeedback('');
    setShowResult(false);
    setScore(0);
    setStreak(0);
  }, [words]);

  useEffect(() => {
    if (words.length > 0) {
      startNewRound();
    }
  }, [words, startNewRound]);

  const nextWord = () => {
    setShowResult(false);
    setFeedback('');
    if (currentWordIndex < roundWords.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
    } else {
      // Tur bitti, yeni tur başlat
      startNewRound();
    }
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    const currentWord = roundWords[currentWordIndex];
    if (!currentWord) return;

    setIsListening(true);
    setFeedback('Dinliyorum...');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setFeedback('Tarayıcınız konuşma tanımayı desteklemiyor.');
      setIsListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      const correctWord = currentWord.headword.toLowerCase();
      
      setShowResult(true);
      setIsListening(false);

      if (transcript === correctWord) {
        setIsCorrect(true);
        setScore(score + 10);
        const newStreak = streak + 1;
        setStreak(newStreak);
        setBestStreak(Math.max(bestStreak, newStreak));
        setFeedback('Harika! Doğru telaffuz!');
        setTimeout(nextWord, 2000);
      } else {
        setIsCorrect(false);
        setStreak(0);
        setFeedback(`Tekrar deneyin. Söylediğiniz: "${transcript}"`);
      }
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      setFeedback(`Hata: ${event.error}. Tekrar deneyin.`);
    };

    recognition.start();
  };
  
  const currentWord = roundWords[currentWordIndex];

  if (!currentWord) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-gray-600">Oyun yükleniyor...</p>
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
           <div className="text-lg font-semibold text-gray-700">
            {currentWordIndex + 1} / {roundWords.length}
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
            {currentWord.headword}
          </div>
          <div className="text-lg text-gray-600 mb-2">
            {currentWord.turkish}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => speak(currentWord.headword)}
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
              onClick={nextWord}
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