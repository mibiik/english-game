import React, { useState, useEffect, useCallback } from 'react';
import { Mic, Volume2, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { WordDetail } from '../../data/words';
import { supabaseAuthService } from '../../services/supabaseAuthService';
import { supabaseGameScoreService } from '../../services/supabaseGameScoreService';

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
    setRoundWords(shuffled);
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
      // Tur bitti, skoru kaydet
      const unit = roundWords[0]?.unit || '1';
      try {
        const userId = supabaseAuthService.getCurrentUserId();
        if (userId) {
          supabaseGameScoreService.addScore(userId, 'speaking', score);
        }
      } catch (error) {
        console.error('Skor kaydedilirken hata:', error);
      }
      // Yeni tur başlat
      startNewRound();
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      
      // İngilizce bir voice seç
      const voices = synth.getVoices();
      const enVoice = voices.find(v => v.lang.startsWith('en'));
      if (enVoice) utterance.voice = enVoice;
      
      // Sesler yüklenmeden konuşma başlatılmasın
      if (voices.length === 0) {
        synth.onvoiceschanged = () => {
          const voices2 = synth.getVoices();
          const enVoice2 = voices2.find(v => v.lang.startsWith('en'));
          if (enVoice2) utterance.voice = enVoice2;
          synth.speak(utterance);
        };
      } else {
        synth.speak(utterance);
      }
    }
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
        setStreak(prev => prev + 1);
        const bonus = Math.min(streak, 5);
        awardPoints('speaking', 1 + bonus, currentWord.unit);
        setBestStreak(Math.max(bestStreak, streak));
        setFeedback('Harika! Doğru telaffuz!');
        // Anında puan ekle
        const userId = authService.getCurrentUserId();
        if (userId) {
          gameScoreService.addScore(userId, 'speaking', 10);
        }
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
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-4 bg-gray-900 text-white">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-8 relative overflow-hidden">
        {/* Arka plan desenleri */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <svg width="100%" height="100%"><defs><pattern id="p" width="50" height="50" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 25h50M25 0v50" stroke="rgba(120, 120, 255, 0.2)" strokeWidth="1"></path></pattern></defs><rect width="100%" height="100%" fill="url(#p)"></rect></svg>
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-cyan-400">
                Skor: {score}
              </div>
              <div className="text-sm text-cyan-200/70">
                Seri: {streak} | En İyi: {bestStreak}
              </div>
            </div>
            <div className="text-lg font-semibold bg-gray-700/50 text-gray-300 px-3 py-1 rounded-lg">
              {currentWordIndex + 1} / {roundWords.length}
            </div>
          </div>

          <div className="text-center my-8">
            <div className="text-5xl font-extrabold tracking-wider text-white mb-3" style={{ textShadow: '0 0 15px rgba(255, 255, 255, 0.4)' }}>
              {currentWord.headword}
            </div>
            <div className="text-xl text-gray-400 font-light">
              {currentWord.turkish}
            </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center space-y-6">
          <div className="flex gap-4">
            <button
              onClick={() => speak(currentWord.headword)}
              className="group p-4 rounded-full bg-blue-600/30 text-blue-300 border-2 border-blue-500/50 hover:bg-blue-600/50 hover:scale-105 transition-all duration-300 shadow-lg"
              title="Kelimeyi dinle"
            >
              <Volume2 className="w-7 h-7 transform group-hover:animate-pulse" />
            </button>

            <button
              onClick={startListening}
              disabled={isListening}
              className={`p-5 rounded-full text-white transition-all duration-300 shadow-xl border-2 ${isListening ? 'bg-red-500/80 border-red-400 animate-pulse scale-110' : 'bg-green-600/50 border-green-500/60 hover:bg-green-600/80 hover:scale-105'}`}
              title="Telaffuz et"
            >
              <Mic className="w-8 h-8" />
            </button>

            <button
              onClick={nextWord}
              className="group p-4 rounded-full bg-purple-600/30 text-purple-300 border-2 border-purple-500/50 hover:bg-purple-600/50 hover:scale-105 transition-all duration-300 shadow-lg"
              title="Yeni kelime"
            >
              <RefreshCw className="w-7 h-7 transform group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          <div className="h-20 w-full">
            {feedback && (
              <div className={`mt-4 p-4 rounded-lg flex items-center justify-center gap-3 text-base font-semibold ${showResult ? (isCorrect ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30') : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'}`}>
                {showResult && (isCorrect ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />)}
                <span>{feedback}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}