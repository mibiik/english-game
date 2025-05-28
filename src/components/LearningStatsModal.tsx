import React from 'react';
import { learningStatsTracker } from '../data/learningStats';
import { X } from 'lucide-react';

interface LearningStatsModalProps {
  onClose: () => void;
}

export const LearningStatsModal: React.FC<LearningStatsModalProps> = ({ onClose }) => {
  const todayStats = learningStatsTracker.getTodayStats();
  const weeklyStats = learningStatsTracker.getWeeklyStats();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-purple-800">Öğrenme İstatistikleri</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-purple-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-purple-600" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-purple-800 mb-2">Bugünkü İlerleme</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold text-purple-600">{todayStats.wordsLearned}</p>
                <p className="text-sm text-purple-600">Kelime Öğrenildi</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-indigo-600">{todayStats.totalWordsLearned}</p>
                <p className="text-sm text-indigo-600">Toplam Kelime</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-purple-800 mb-4">Haftalık İlerleme</h3>
            <div className="space-y-3">
              {weeklyStats.map((stat, index) => (
                <div key={stat.date} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-20">
                      <p className="text-sm font-medium text-purple-600">
                        {new Date(stat.date).toLocaleDateString('tr-TR', { weekday: 'short' })}
                      </p>
                    </div>
                    <div className="flex-1 h-2 bg-purple-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                        style={{
                          width: `${(stat.wordsLearned / Math.max(...weeklyStats.map(s => s.wordsLearned), 1)) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-sm font-medium text-purple-600 ml-3">
                    {stat.wordsLearned} kelime
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};