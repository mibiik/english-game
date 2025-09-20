import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ScatterChart, Scatter, ComposedChart
} from 'recharts';
import {
  TrendingUp, TrendingDown, Target, Clock, BookOpen, Trophy, Star, Zap,
  BarChart3, PieChart as PieChartIcon, Activity, Calendar, Award, Brain,
  ChevronRight, ChevronLeft, RefreshCw, Download, Share2, Filter
} from 'lucide-react';
import { userAnalyticsService, UserStats, PerformanceMetrics, UserInsights, Achievement } from '../services/userAnalyticsService';
import { supabaseAuthService } from '../services/supabaseAuthService';

interface AdvancedAnalyticsProps {
  userId?: string;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff', '#00ffff'];

export const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'learning' | 'achievements' | 'insights'>('overview');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [insights, setInsights] = useState<UserInsights | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const currentUserId = userId || supabaseAuthService.getCurrentUserId();

  useEffect(() => {
    if (currentUserId) {
      loadAnalyticsData();
    }
  }, [currentUserId, timeRange, refreshKey]);

  const loadAnalyticsData = async () => {
    if (!currentUserId) return;
    
    setIsLoading(true);
    try {
      const [statsData, metricsData, insightsData, achievementsData] = await Promise.all([
        userAnalyticsService.getUserStats(currentUserId),
        userAnalyticsService.getPerformanceMetrics(currentUserId),
        userAnalyticsService.getUserInsights(currentUserId),
        userAnalyticsService.getAchievements(currentUserId)
      ]);

      setStats(statsData);
      setMetrics(metricsData);
      setInsights(insightsData);
      setAchievements(achievementsData);
    } catch (error) {
      console.error('Analiz verileri yüklenirken hata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const exportData = () => {
    const data = {
      stats,
      metrics,
      insights,
      achievements,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${currentUserId}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Analiz verileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-300 mb-2">Analiz Verisi Bulunamadı</h2>
          <p className="text-gray-500">Henüz yeterli veri toplanmamış.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <BarChart3 className="w-8 h-8 text-blue-500" />
              <h1 className="text-xl font-bold">Gelişmiş Analizler</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Time Range Selector */}
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"
              >
                <option value="7d">Son 7 Gün</option>
                <option value="30d">Son 30 Gün</option>
                <option value="90d">Son 90 Gün</option>
                <option value="1y">Son 1 Yıl</option>
              </select>
              
              <button
                onClick={handleRefresh}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                title="Yenile"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              
              <button
                onClick={exportData}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                title="Verileri İndir"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex space-x-1 pb-4">
            {[
              { id: 'overview', label: 'Genel Bakış', icon: BarChart3 },
              { id: 'performance', label: 'Performans', icon: Activity },
              { id: 'learning', label: 'Öğrenme', icon: BookOpen },
              { id: 'achievements', label: 'Başarımlar', icon: Trophy },
              { id: 'insights', label: 'İçgörüler', icon: Brain }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && <OverviewTab stats={stats} />}
          {activeTab === 'performance' && <PerformanceTab metrics={metrics} />}
          {activeTab === 'learning' && <LearningTab stats={stats} />}
          {activeTab === 'achievements' && <AchievementsTab achievements={achievements} />}
          {activeTab === 'insights' && <InsightsTab insights={insights} />}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Genel Bakış Sekmesi
const OverviewTab: React.FC<{ stats: UserStats }> = ({ stats }) => {
  const statCards = [
    {
      title: 'Toplam Puan',
      value: stats.totalScore.toLocaleString(),
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      change: stats.improvementRate > 0 ? `+${stats.improvementRate.toFixed(1)}%` : `${stats.improvementRate.toFixed(1)}%`,
      changeType: stats.improvementRate > 0 ? 'positive' : 'negative'
    },
    {
      title: 'Oyun Sayısı',
      value: stats.totalGamesPlayed.toLocaleString(),
      icon: Target,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      change: `${stats.averageScore.toFixed(1)} ortalama`,
      changeType: 'neutral'
    },
    {
      title: 'Günlük Seri',
      value: `${stats.currentStreak} gün`,
      icon: Calendar,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      change: `En uzun: ${stats.longestStreak} gün`,
      changeType: 'neutral'
    },
    {
      title: 'Doğruluk Oranı',
      value: `${stats.accuracyRate.toFixed(1)}%`,
      icon: Zap,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      change: stats.accuracyRate > 80 ? 'Mükemmel!' : stats.accuracyRate > 60 ? 'İyi' : 'Geliştirilebilir',
      changeType: stats.accuracyRate > 60 ? 'positive' : 'negative'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${card.bgColor} rounded-xl p-6 border border-gray-700`}
          >
            <div className="flex items-center justify-between mb-4">
              <card.icon className={`w-8 h-8 ${card.color}`} />
              <span className={`text-sm px-2 py-1 rounded-full ${
                card.changeType === 'positive' ? 'bg-green-500/20 text-green-400' :
                card.changeType === 'negative' ? 'bg-red-500/20 text-red-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {card.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{card.value}</h3>
            <p className="text-gray-400 text-sm">{card.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Grafikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Günlük Skor Trendi */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
            Günlük Skor Trendi
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Oyun Modu Dağılımı */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <PieChartIcon className="w-5 h-5 mr-2 text-green-500" />
            Oyun Modu Dağılımı
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {[].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Performans Sekmesi
const PerformanceTab: React.FC<{ metrics: PerformanceMetrics | null }> = ({ metrics }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center py-12">
        <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-300 mb-2">Performans Verileri</h3>
        <p className="text-gray-500">Detaylı performans analizleri yakında...</p>
      </div>
    </motion.div>
  );
};

// Öğrenme Sekmesi
const LearningTab: React.FC<{ stats: UserStats }> = ({ stats }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-300 mb-2">Öğrenme Analizleri</h3>
        <p className="text-gray-500">Öğrenme süreçleri ve ilerleme analizleri yakında...</p>
      </div>
    </motion.div>
  );
};

// Başarımlar Sekmesi
const AchievementsTab: React.FC<{ achievements: Achievement[] }> = ({ achievements }) => {
  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  const lockedAchievements = achievements.filter(a => !a.isUnlocked);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Başarım İstatistikleri */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
          <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-white">{unlockedAchievements.length}</h3>
          <p className="text-gray-400">Açılan Başarım</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
          <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-white">{achievements.length}</h3>
          <p className="text-gray-400">Toplam Başarım</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
          <Star className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-white">
            {achievements.length > 0 ? Math.round((unlockedAchievements.length / achievements.length) * 100) : 0}%
          </h3>
          <p className="text-gray-400">Tamamlanma Oranı</p>
        </div>
      </div>

      {/* Açılan Başarımlar */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
          Açılan Başarımlar ({unlockedAchievements.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {unlockedAchievements.map((achievement) => (
            <div key={achievement.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">{achievement.name}</h4>
                  <p className="text-sm text-gray-400">{achievement.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="capitalize">{achievement.rarity}</span>
                <span>{new Date(achievement.unlockedAt).toLocaleDateString('tr-TR')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kilitli Başarımlar */}
      {lockedAchievements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-gray-500" />
            Kilitli Başarımlar ({lockedAchievements.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedAchievements.map((achievement) => (
              <div key={achievement.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 opacity-60">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-gray-600/20 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-400">{achievement.name}</h4>
                    <p className="text-sm text-gray-500">{achievement.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span className="capitalize">{achievement.rarity}</span>
                  <span>{achievement.progress}/{achievement.maxProgress}</span>
                </div>
                {achievement.maxProgress > 1 && (
                  <div className="mt-2 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gray-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

// İçgörüler Sekmesi
const InsightsTab: React.FC<{ insights: UserInsights | null }> = ({ insights }) => {
  if (!insights) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="text-center py-12"
      >
        <Brain className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-300 mb-2">İçgörüler</h3>
        <p className="text-gray-500">Kişiselleştirilmiş öneriler ve analizler yakında...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Güçlü Yönler */}
      {insights.strengths.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-green-400">
            <TrendingUp className="w-5 h-5 mr-2" />
            Güçlü Yönleriniz
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {insights.strengths.map((strength, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-green-500/10 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-gray-300">{strength}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Geliştirilmesi Gereken Alanlar */}
      {insights.weaknesses.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-orange-400">
            <TrendingDown className="w-5 h-5 mr-2" />
            Geliştirilmesi Gereken Alanlar
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {insights.weaknesses.map((weakness, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-orange-500/10 rounded-lg">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <span className="text-gray-300">{weakness}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Öneriler */}
      {insights.recommendations.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-blue-400">
            <Brain className="w-5 h-5 mr-2" />
            Kişiselleştirilmiş Öneriler
          </h3>
          <div className="space-y-3">
            {insights.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-blue-500/10 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-gray-300">{recommendation}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AdvancedAnalytics;
