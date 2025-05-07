import React, { useState, useEffect } from 'react';
import { Trophy, User, Star, Layout, Book, Shuffle, PenTool, AlertTriangle, Mic, Type, Zap, Brain, Volume2, X } from 'lucide-react';
import { gameScoreService } from '../services/gameScoreService';

type GameMode = 'matching' | 'speed' | 'memory' | 'speaking' | 'timedMatching';

interface UserScore {
  id: string;
  name: string;
  scores: {
    matching: number;
    speed: number;
    memory: number;
    speaking: number;
    timedMatching: number;
  };
  totalScore: number;
  avatar?: string;
}

interface LeaderboardProps {
  onClose: () => void;
}

export function Leaderboard({ onClose }: LeaderboardProps) {
  const [users, setUsers] = useState<UserScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<GameMode>('matching');

  const gameModes = [
    { id: 'matching', name: 'Eşleştirme', icon: Layout },
    { id: 'speed', name: 'Hız Testi', icon: Zap },
    { id: 'memory', name: 'Hafıza Oyunu', icon: Brain },
    { id: 'speaking', name: 'Konuşma Pratiği', icon: Mic },
    { id: 'timedMatching', name: 'Zamanlı Eşleştirme', icon: Volume2 }
  ] as const;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const leaderboard = await gameScoreService.getGameModeLeaderboard(activeTab);
        setUsers(leaderboard);
      } catch (error) {
        console.error('Liderlik tablosu yüklenirken hata:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, [activeTab]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-8 h-8 text-yellow-500" />
        <h2 className="text-2xl font-bold text-purple-800">Liderlik Tablosu</h2>
      </div>

      <div className="flex overflow-x-auto mb-6 pb-2 gap-2">
        {gameModes.map(({ id, name, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as GameMode)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap ${activeTab === id ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-800'}`}
          >
            <Icon className="w-4 h-4" />
            <span>{name}</span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user, index) => (
            <div 
              key={user.id} 
              className={`flex items-center justify-between p-4 rounded-lg ${index < 3 ? 'bg-gradient-to-r from-purple-50 to-indigo-50' : 'bg-gray-50'}`}
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  {index < 3 && (
                    <div className="absolute -top-2 -left-2 bg-yellow-400 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                  )}
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <User className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">ID: {user.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-bold">{user.scores[activeTab]}</span>
                <span className="text-sm text-gray-500">/ {user.totalScore}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}