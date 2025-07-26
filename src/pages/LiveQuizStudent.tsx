import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';

interface Player {
  id: string;
  name: string;
  score: number;
  isReady: boolean;
  avatar?: string;
}

interface QuizData {
  id: string;
  title: string;
  status: 'lobby' | 'playing' | 'finished';
  players: Player[];
  hostId: string;
  currentQuestion: number;
  questionCount: number;
  timePerQuestion: number;
}

const LiveQuizStudent: React.FC = () => {
  const navigate = useNavigate();
  const [quizId, setQuizId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);

  const joinQuiz = async () => {
    if (!quizId.trim() || !playerName.trim()) {
      setError('Lütfen PIN ve isminizi girin');
      return;
    }

    setIsJoining(true);
    setProgress(0);
    setError('');

    try {
      // Progress simulation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 15;
        });
      }, 100);

      const quizRef = doc(db, 'liveQuizzes', quizId);
      const quizDoc = await getDoc(quizRef);
      
      if (!quizDoc.exists()) {
        setError('Sınav bulunamadı. PIN\'i kontrol edin.');
        setIsJoining(false);
        setProgress(0);
        return;
      }

      const data = quizDoc.data() as QuizData;
      if (data.status !== 'lobby') {
        setError('Bu sınav zaten başlamış veya bitmiş.');
        setIsJoining(false);
        setProgress(0);
        return;
      }

      const playerId = 'player-' + Date.now();
      const newPlayer: Player = {
        id: playerId,
        name: playerName,
        score: 0,
        isReady: false,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${playerName}`
      };

      await updateDoc(quizRef, {
        players: [...data.players, newPlayer]
      });

      setProgress(100);
      setTimeout(() => {
        navigate(`/live-quiz-student-play/${quizId}`, { 
          state: { playerId, playerName } 
        });
      }, 500);

    } catch (error) {
      console.error('Katılım hatası:', error);
      setError('Katılım sırasında bir hata oluştu.');
      setIsJoining(false);
      setProgress(0);
    }
  };

  const toggleReady = async () => {
    if (!quizData) return;

    setIsReady(!isReady);
    // Burada gerçek uygulamada oyuncunun hazır durumunu güncellemek gerekir
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Canlı Sınava Katıl
          </h1>
          <p className="text-gray-600 text-lg">
            PIN ile sınavınıza katılın ve arkadaşlarınızla yarışın
          </p>
        </div>

        <div className="grid gap-8">
          {/* Join Form */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-gray-800">
                Sınav Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* PIN Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Sınav PIN'i</label>
                <div className="relative">
                  <input
                    type="text"
                    value={quizId}
                    onChange={(e) => setQuizId(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-center text-2xl font-mono tracking-widest"
                    placeholder="PIN GİRİN"
                    maxLength={6}
                    disabled={isJoining}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                </div>
                </div>

              {/* Player Name Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">İsminiz</label>
                  <input
                    type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="İsminizi girin"
                  disabled={isJoining}
                  />
                </div>

              {/* Error Message */}
                {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                  </div>
                )}

              {/* Join Button */}
              <Button
                onClick={joinQuiz}
                disabled={isJoining || !quizId.trim() || !playerName.trim()}
                className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isJoining ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Katılım Sağlanıyor...</span>
                  </div>
                  ) : (
                  <div className="flex items-center space-x-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <span>Sınava Katıl</span>
                  </div>
                  )}
              </Button>

              {/* Progress Bar */}
              {isJoining && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Bağlanıyor</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-bold text-gray-800">
                      Nasıl Katılırım?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                    1
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">PIN Alın</h3>
                  <p className="text-sm text-gray-600">Öğretmeninizden sınav PIN'ini alın</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                    2
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Bilgileri Girin</h3>
                  <p className="text-sm text-gray-600">PIN ve isminizi girin</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                  <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                    3
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Oynamaya Başlayın</h3>
                  <p className="text-sm text-gray-600">Soruları cevaplayın ve puan kazanın</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-bold text-gray-800">
                Özellikler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                          </div>
                  <span className="text-sm font-medium text-gray-700">Hızlı Oyun</span>
                          </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Canlı Skor</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Çok Oyunculu</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Zamanlı</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Back Button */}
          <div className="text-center">
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
    </div>
  );
};

export default LiveQuizStudent; 