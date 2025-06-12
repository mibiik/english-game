import React, { useState, useEffect } from 'react';
import { Trophy, User, Star, Layout, Book, Shuffle, PenTool, AlertTriangle, Mic, Type, Zap, Brain, Volume2, X } from 'lucide-react';
import { GameMode, GameScore, gameScoreService } from '../services/gameScoreService';
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
  'wordTypes': <Type className="w-5 h-5" />
};

const gameModeNames: Record<GameMode, string> = {
  'matching': 'Eşleştirme',
  'sentence-completion': 'Cümle Tamamlama',
  'multiple-choice': 'Çoktan Seçmeli',
  'flashcard': 'Kelime Kartları',
  'speaking': 'Konuşma',
  'word-race': 'Kelime Yarışı',
  'wordTypes': 'Kelime Tipleri'
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

      <div className="flex flex-wrap gap-2 mb-6">
        {Array.from({ length: 8 }, (_, i) => (i + 1).toString()).map((unit) => (
          <button
            key={unit}
            onClick={() => setSelectedUnit(unit)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedUnit === unit
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Ünite {unit}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
          {error}
        </div>
      ) : scores.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          Bu oyun modu için henüz skor bulunmamaktadır.
        </div>
      ) : (
        <div className="space-y-4">
          {scores.map((score, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex-shrink-0 w-8 text-center font-bold text-purple-700">
                #{index + 1}
              </div>
              <div className="flex-grow">
                <div className="font-medium">{score.displayName}</div>
                <div className="text-sm text-gray-500">
                  {new Date(score.timestamp).toLocaleDateString()}
                </div>
              </div>
              <div className="flex-shrink-0 font-bold text-purple-700">
                {score.score} puan
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}