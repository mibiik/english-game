import React from 'react';
import { learningStats } from '../../data/learningStats';

export function LearningProgress() {
  const todayStats = learningStatsTracker.getTodayStats();
  const weeklyStats = learningStatsTracker.getWeeklyStats();
  const totalLearned = learningStatsTracker.getTotalWordsLearned();

  const maxWordsInWeek = Math.max(...weeklyStats.map(stat => stat.wordsLearned));

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl"
        <h2 className="text-3xl font-bold mb-6">Bugün Kaç Kelime Öğrendim?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 rounded-xl p-6 backdrop-blur-lg">
            <h3 className="text-lg font-semibold mb-2">Bugün</h3>
            <p className="text-4xl font-bold">{todayStats.wordsLearned}</p>
            <p className="text-sm opacity-75">kelime öğrenildi</p>
          </div>
          <div className="bg-white/10 rounded-xl p-6 backdrop-blur-lg">
            <h3 className="text-lg font-semibold mb-2">Toplam</h3>
            <p className="text-4xl font-bold">{totalLearned}</p>
            <p className="text-sm opacity-75">kelime öğrenildi</p>
          </div>
          <div className="bg-white/10 rounded-xl p-6 backdrop-blur-lg">
            <h3 className="text-lg font-semibold mb-2">Haftalık Ortalama</h3>
            <p className="text-4xl font-bold">
              {Math.round(weeklyStats.reduce((acc, stat) => acc + stat.wordsLearned, 0) / 7)}
            </p>
            <p className="text-sm opacity-75">kelime/gün</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">Haftalık İlerleme</h3>
        <div className="h-64 flex items-end justify-between gap-2">
          {weeklyStats.map((stat) => {
            const height = maxWordsInWeek ? (stat.wordsLearned / maxWordsInWeek) * 100 : 0;
            const date = new Date(stat.date);
            const dayName = new Intl.DateTimeFormat('tr-TR', { weekday: 'short' }).format(date);

            return (
              <div key={stat.date} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full relative group">
                  <div
                    className="w-full bg-purple-500 rounded-t-lg transition-all duration-300 hover:bg-purple-600"
                    style={{ height: `${Math.max(height, 5)}%` }}
                  />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
                    {stat.wordsLearned} kelime
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-600">{dayName}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">Öğrenme İstatistikleri</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">En Yüksek Günlük Başarı</span>
              <span className="text-xl font-bold text-purple-600">
                {Math.max(...weeklyStats.map(stat => stat.wordsLearned))} kelime
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Haftalık Toplam</span>
              <span className="text-xl font-bold text-purple-600">
                {weeklyStats.reduce((acc, stat) => acc + stat.wordsLearned, 0)} kelime
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Günlük Hedef</span>
              <span className="text-xl font-bold text-purple-600">10 kelime</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Başarı Oranı</span>
              <span className="text-xl font-bold text-purple-600">
                {Math.round((weeklyStats.filter(stat => stat.wordsLearned >= 10).length / 7) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}