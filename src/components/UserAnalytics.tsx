import React, { useState, useEffect } from 'react';
import { userAnalyticsService, UserStats, UserActivity, GameSession, UserLearningProgress } from '../services/userAnalyticsService';
import { authService } from '../services/authService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface UserAnalyticsProps {
  userId?: string;
}

export const UserAnalytics: React.FC<UserAnalyticsProps> = ({ userId }) => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [gameSessions, setGameSessions] = useState<GameSession[]>([]);
  const [learningProgress, setLearningProgress] = useState<UserLearningProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'activities' | 'games' | 'learning'>('overview');

  const currentUserId = userId || authService.getCurrentUserId();

  useEffect(() => {
    if (currentUserId) {
      loadAnalyticsData();
    }
  }, [currentUserId]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const [statsData, activitiesData, sessionsData, progressData] = await Promise.all([
        userAnalyticsService.getUserStats(currentUserId!),
        userAnalyticsService.getUserActivities(currentUserId!, 20),
        userAnalyticsService.getUserGameSessions(currentUserId!, 10),
        userAnalyticsService.getUserLearningProgress(currentUserId!)
      ]);

      setStats(statsData);
      setActivities(activitiesData);
      setGameSessions(sessionsData);
      setLearningProgress(progressData);
    } catch (error) {
      console.error('Analytics verileri yüklenirken hata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
        <span className="ml-2 text-gray-600">Analytics yükleniyor...</span>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-8 text-center text-gray-600">
        Henüz oyun verisi bulunmuyor. Oyun oynamaya başlayın!
      </div>
    );
  }

  // Grafik verilerini hazırla
  const gameModeData = Object.entries(stats.gameModeStats).map(([mode, data]) => ({
    name: mode,
    games: data.gamesPlayed,
    score: data.totalScore,
    average: data.averageScore
  }));

  const levelData = Object.entries(stats.levelProgress).map(([level, data]) => ({
    name: level,
    games: data.gamesPlayed,
    score: data.totalScore,
    average: data.averageScore
  }));

  const recentSessionsData = gameSessions.slice(0, 5).map(session => ({
    name: session.gameMode,
    score: session.totalScore,
    date: new Date(session.startTime).toLocaleDateString('tr-TR')
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Kullanıcı Analitikleri</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'overview' ? 'bg-cyan-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Genel Bakış
          </button>
          <button
            onClick={() => setActiveTab('activities')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'activities' ? 'bg-cyan-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Aktiviteler
          </button>
          <button
            onClick={() => setActiveTab('games')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'games' ? 'bg-cyan-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Oyunlar
          </button>
          <button
            onClick={() => setActiveTab('learning')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'learning' ? 'bg-cyan-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Öğrenme
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Genel İstatistikler */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-4 rounded-xl">
              <div className="text-2xl font-bold">{stats.totalGamesPlayed}</div>
              <div className="text-sm opacity-90">Toplam Oyun</div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-xl">
              <div className="text-2xl font-bold">{stats.totalScore}</div>
              <div className="text-sm opacity-90">Toplam Puan</div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl">
              <div className="text-2xl font-bold">{stats.averageScore}</div>
              <div className="text-sm opacity-90">Ortalama Puan</div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-xl">
              <div className="text-2xl font-bold">{stats.bestScore}</div>
              <div className="text-sm opacity-90">En İyi Puan</div>
            </div>
          </div>

          {/* Grafikler */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="text-lg font-semibold mb-4">Oyun Modu Dağılımı</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={gameModeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, games }: any) => `${name}: ${games}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="games"
                  >
                    {gameModeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="text-lg font-semibold mb-4">Son Oyunlar</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={recentSessionsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'activities' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Son Aktiviteler</h3>
          <div className="max-h-96 overflow-y-auto">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.activityType === 'login' ? 'bg-green-500' :
                    activity.activityType === 'game_complete' ? 'bg-blue-500' :
                    activity.activityType === 'word_learned' ? 'bg-purple-500' : 'bg-gray-500'
                  }`}></div>
                  <div>
                    <div className="font-medium">
                      {activity.activityType === 'login' ? 'Giriş Yapıldı' :
                       activity.activityType === 'game_complete' ? 'Oyun Tamamlandı' :
                       activity.activityType === 'word_learned' ? 'Kelime Öğrenildi' :
                       activity.activityType}
                    </div>
                    {activity.gameMode && <div className="text-sm text-gray-600">{activity.gameMode}</div>}
                    {activity.score && <div className="text-sm text-gray-600">Puan: {activity.score}</div>}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(activity.timestamp).toLocaleString('tr-TR')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'games' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Oyun Oturumları</h3>
          <div className="max-h-96 overflow-y-auto">
            {gameSessions.map((session, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg mb-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold">{session.gameMode}</div>
                    <div className="text-sm text-gray-600">
                      {session.level} - Ünite {session.unit}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{session.totalScore} puan</div>
                    <div className="text-sm text-gray-600">
                      {session.correctAnswers}/{session.wordsPlayed} doğru
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{new Date(session.startTime).toLocaleString('tr-TR')}</span>
                  {session.duration && <span>{Math.round(session.duration / 60)} dakika</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'learning' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Öğrenme İlerlemesi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl">
              <h4 className="font-semibold mb-2">Kelime Ustalık Seviyeleri</h4>
              <div className="space-y-2">
                {learningProgress.slice(0, 10).map((progress, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm truncate">{progress.word}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${progress.masteryLevel}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">{progress.masteryLevel}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <h4 className="font-semibold mb-2">İstatistikler</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Toplam Kelime:</span>
                  <span className="font-semibold">{learningProgress.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ustalık Seviyesi:</span>
                  <span className="font-semibold">
                    {learningProgress.filter(p => p.isMastered).length} / {learningProgress.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Ortalama Ustalık:</span>
                  <span className="font-semibold">
                    {Math.round(learningProgress.reduce((sum, p) => sum + p.masteryLevel, 0) / learningProgress.length)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 