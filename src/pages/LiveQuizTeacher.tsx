import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { newDetailedWords_part1 as words } from '../data/words';
import { detailedWords_part1 as word4 } from '../data/word4';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';

interface QuizSettings {
  title: string;
  questionCount: number;
  timePerQuestion: number;
  wordList: 'basic' | 'intermediate';
  isPublic: boolean;
}

const LiveQuizTeacher: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<QuizSettings>({
    title: 'Yeni Sınav',
    questionCount: 10,
    timePerQuestion: 30,
    wordList: 'basic',
    isPublic: true
  });
  const [isCreating, setIsCreating] = useState(false);
  const [progress, setProgress] = useState(0);

  const wordLists = {
    basic: words,
    intermediate: word4
  };

  const createQuiz = async () => {
    setIsCreating(true);
    setProgress(0);

    try {
      // Progress simulation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);
      
      const selectedWords = wordLists[settings.wordList];
      const shuffledWords = [...selectedWords].sort(() => Math.random() - 0.5);
      const quizWords = shuffledWords.slice(0, settings.questionCount);

      const quizData = {
        title: settings.title,
        questionCount: settings.questionCount,
        timePerQuestion: settings.timePerQuestion,
        wordList: settings.wordList,
        isPublic: settings.isPublic,
        status: 'lobby',
        createdAt: serverTimestamp(),
        hostId: 'teacher-' + Date.now(),
        players: [],
        currentQuestion: 0,
        questions: quizWords.map(word => ({
          word: word.headword,
          definition: word.turkish,
          options: generateOptions(word, selectedWords)
        }))
      };

      const docRef = await addDoc(collection(db, 'liveQuizzes'), quizData);
      
      setProgress(100);
      setTimeout(() => {
        navigate(`/live-quiz-teacher-play/${docRef.id}`);
      }, 500);

    } catch (error) {
      console.error('Quiz oluşturma hatası:', error);
      setIsCreating(false);
      setProgress(0);
    }
  };

  const generateOptions = (correctWord: any, allWords: any[]) => {
    const options = [correctWord.turkish];
    const otherWords = allWords.filter(w => w.headword !== correctWord.headword);
    
    while (options.length < 4) {
      const randomWord = otherWords[Math.floor(Math.random() * otherWords.length)];
      if (!options.includes(randomWord.turkish)) {
        options.push(randomWord.turkish);
      }
    }

    return options.sort(() => Math.random() - 0.5);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4" style={{ paddingTop: 'calc(64px + 1rem)', marginTop: '-128px' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Canlı Sınav Oluştur
          </h1>
          <p className="text-gray-600 text-lg">
            Kahoot! tarzı interaktif sınavınızı hazırlayın
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Settings Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-gray-800">
                Sınav Ayarları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quiz Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Sınav Başlığı</label>
                  <input
                    type="text"
                  value={settings.title}
                  onChange={(e) => setSettings({...settings, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Sınavınızın adını girin"
                />
              </div>

              {/* Question Count */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Soru Sayısı</label>
                <div className="grid grid-cols-3 gap-2">
                  {[5, 10, 15, 20, 25, 30].map(count => (
                    <button
                      key={count}
                      onClick={() => setSettings({...settings, questionCount: count})}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        settings.questionCount === count
                          ? 'bg-blue-500 text-white border-blue-500 shadow-lg scale-105'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:shadow-md'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
              </div>
            </div>

              {/* Time Per Question */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Soru Başına Süre (saniye)</label>
                <div className="grid grid-cols-4 gap-2">
                  {[15, 20, 30, 45, 60, 90, 120].map(time => (
                    <button
                      key={time}
                      onClick={() => setSettings({...settings, timePerQuestion: time})}
                      className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                        settings.timePerQuestion === time
                          ? 'bg-green-500 text-white border-green-500 shadow-lg scale-105'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-green-300 hover:shadow-md'
                      }`}
                    >
                      {time}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Word List Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Kelime Listesi</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSettings({...settings, wordList: 'basic'})}
                    className={`p-4 rounded-lg border transition-all ${
                      settings.wordList === 'basic'
                        ? 'bg-purple-500 text-white border-purple-500 shadow-lg scale-105'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:shadow-md'
                    }`}
                  >
                    <div className="font-semibold">Temel Seviye</div>
                    <div className="text-xs opacity-80">{words.length} kelime</div>
                  </button>
                  <button
                    onClick={() => setSettings({...settings, wordList: 'intermediate'})}
                    className={`p-4 rounded-lg border transition-all ${
                      settings.wordList === 'intermediate'
                        ? 'bg-purple-500 text-white border-purple-500 shadow-lg scale-105'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:shadow-md'
                        }`}
                  >
                    <div className="font-semibold">Orta Seviye</div>
                    <div className="text-xs opacity-80">{word4.length} kelime</div>
                  </button>
                </div>
              </div>

              {/* Public/Private Toggle */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Görünürlük</label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setSettings({...settings, isPublic: true})}
                    className={`flex-1 p-3 rounded-lg border transition-all ${
                      settings.isPublic
                        ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                        }`}
                  >
                    <div className="font-semibold">Herkese Açık</div>
                    <div className="text-xs opacity-80">PIN ile katılım</div>
                  </button>
                  <button
                    onClick={() => setSettings({...settings, isPublic: false})}
                    className={`flex-1 p-3 rounded-lg border transition-all ${
                      !settings.isPublic
                        ? 'bg-orange-500 text-white border-orange-500 shadow-lg'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="font-semibold">Özel</div>
                    <div className="text-xs opacity-80">Sadece davetli</div>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-gray-800">
                Sınav Önizlemesi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quiz Info */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{settings.title}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Soru Sayısı:</span>
                    <span className="font-semibold">{settings.questionCount}</span>
                    </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Süre:</span>
                    <span className="font-semibold">{settings.timePerQuestion}s</span>
                    </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-600">Seviye:</span>
                    <span className="font-semibold">
                      {settings.wordList === 'basic' ? 'Temel' : 'Orta'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-600">Durum:</span>
                    <span className="font-semibold">
                      {settings.isPublic ? 'Herkese Açık' : 'Özel'}
                    </span>
                        </div>
                      </div>
                    </div>
                    
              {/* Sample Questions */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-700">Örnek Sorular</h4>
                <div className="space-y-2">
                  {wordLists[settings.wordList].slice(0, 3).map((word, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg border-l-4 border-blue-400">
                      <div className="font-medium text-gray-800">{word.headword}</div>
                      <div className="text-sm text-gray-600">{word.turkish}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Create Button */}
              <Button
                onClick={createQuiz}
                disabled={isCreating}
                className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sınav Oluşturuluyor...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Sınavı Başlat</span>
                  </div>
                )}
              </Button>

              {/* Progress Bar */}
              {isCreating && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>İlerleme</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
              </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="px-8 py-3 text-gray-600 border-gray-300 hover:bg-gray-50 transition-all"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Ana Sayfaya Dön
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LiveQuizTeacher; 