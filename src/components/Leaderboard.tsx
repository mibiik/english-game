import React, { useState, useEffect } from 'react';
import { Trophy, User, Star, Layout, Book, Shuffle, PenTool, AlertTriangle, Mic, Type, Zap, Brain, Volume2, X } from 'lucide-react';
import { gameScoreService, GameMode, GameScore } from '../services/gameScoreService';
import { UnitSelector } from './UnitSelector';

interface LeaderboardProps {
  onClose: () => void;
}

const gameModeIcons: Record<GameMode, React.ReactNode> = {
  'matching': <Layout className="w-5 h-5" />,
  'sentence-completion': <PenTool className="w-5 h-5" />,
  'multiple-choice': <Book className="w-5 h-5" />,
  'flashcard': <Shuffle className="w-5 h-5" />,
  'speaking': <Mic className="w-5 h-5" />,
  'word-race': <Zap className="w-5 h-5" />,
  'memory': <Brain className="w-5 h-5" />
};

const gameModeNames: Record<GameMode, string> = {
  'matching': 'Eşleştirme',
  'sentence-completion': 'Cümle Tamamlama',
  'multiple-choice': 'Çoktan Seçmeli',
  'flashcard': 'Kelime Kartları',
  'speaking': 'Konuşma',
  'word-race': 'Kelime Yarışı',
  'memory': 'Hafıza Oyunu'
};

export function Leaderboard({ onClose }: LeaderboardProps) {
  const [selectedGameMode, setSelectedGameMode] = useState<GameMode>('matching');
  const [selectedUnit, setSelectedUnit] = useState('1');
  const [scores, setScores] = useState<GameScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadScores();
  }, [selectedGameMode, selectedUnit]);

  const loadScores = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const leaderboardData = await gameScoreService.getLeaderboard(selectedGameMode, selectedUnit);
      setScores(leaderboardData);
    } catch (err) {
      console.error('Liderlik tablosu yüklenirken hata oluştu:', err);
      setError('Liderlik tablosu yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100 relative max-w-2xl w-full">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-8 h-8 text-yellow-500" />
        <h2 className="text-2xl font-bold text-purple-800">Liderlik Tablosu</h2>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        {Object.entries(gameModeIcons).map(([mode, icon]) => (
          <button
            key={mode}
            onClick={() => setSelectedGameMode(mode as GameMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              selectedGameMode === mode
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {icon}
            <span>{gameModeNames[mode as GameMode]}</span>
          </button>
        ))}
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <span className="text-sm font-medium text-gray-700">Ünite Seçimi</span>
        </div>
        <UnitSelector currentUnit={selectedUnit} setCurrentUnit={setSelectedUnit} />
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg mb-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      ) : scores.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Henüz skor bulunmuyor.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {scores.map((score, index) => (
            <div
              key={`${score.userId}-${score.timestamp}`}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  {index === 0 ? (
                    <Trophy className="w-5 h-5 text-yellow-500" />
                  ) : index === 1 ? (
                    <Trophy className="w-5 h-5 text-gray-400" />
                  ) : index === 2 ? (
                    <Trophy className="w-5 h-5 text-yellow-700" />
                  ) : (
                    <span className="text-sm font-medium text-gray-600">{index + 1}</span>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{score.displayName}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(score.timestamp).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-bold text-gray-900">{score.score}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}