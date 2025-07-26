import React, { useEffect, useState } from 'react';
import { User, LogOut, Settings, Trophy, Loader2 } from 'lucide-react';
import { authService } from '../services/authService';
import { gameScoreService, GameMode } from '../services/gameScoreService';

const gameModeNames: Record<GameMode, string> = {
  'matching': 'Eşleştirme',
  'sentence-completion': 'Boşluk Doldurma',
  'multiple-choice': 'Çoktan Seçmeli',
  'flashcard': 'Kelime Kartları',
  'speaking': 'Konuşma',
  'word-race': 'Kelime Yarışı',
  'wordTypes': 'Kelime Tipleri',
  'wordForms': 'Kelime Formları',
  'vocabulary': 'Kelime Bilgisi',
  'timedMatching': 'Zamanlı Eşleştirme',
  'speedGame': 'Hız Oyunu',
  'quizGame': 'Quiz',
  'prepositionMastery': 'Preposition',
  'paraphraseChallenge': 'Paraphrase',
  'difficultWords': 'Zor Kelimeler',
  'definitionToWord': 'Tanımdan Kelime'
};

export function UserProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const userId = authService.getCurrentUserId();
      if (!userId) return;
      const userProfile = await gameScoreService.getUserProfile(userId);
      setProfile(userProfile);
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      window.location.reload();
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
    }
  };

  if (loading || !profile) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="w-10 h-10 animate-spin text-purple-500 mb-4" />
        <p>Profil yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100 max-w-lg mx-auto">
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4">
          <User className="w-10 h-10 text-purple-600" />
        </div>
        <h3 className="text-2xl font-bold text-purple-800 mb-1">{profile.displayName || 'Kullanıcı'}</h3>
        <p className="text-gray-500">{profile.email}</p>
      </div>
      <div className="mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy className="w-7 h-7 text-yellow-500" />
          <span className="text-3xl font-extrabold text-purple-700">{profile.totalScore}</span>
        </div>
        <div className="text-center text-gray-500 text-sm mb-2">Genel Toplam Puan</div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          {Object.entries(profile.scores).map(([mode, score]) => (
            <div key={mode} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
              <span className="font-medium text-gray-700">{gameModeNames[mode as GameMode] || mode}</span>
              <span className="ml-auto font-bold text-purple-700">{score}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-500 mt-4">
          <span>Oynanan Oyun: <b>{profile.gamesPlayed}</b></span>
          <span>Son Oynama: <b>{profile.lastPlayed ? new Date(profile.lastPlayed).toLocaleDateString() : '-'}</b></span>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors mt-4"
      >
        <LogOut className="w-5 h-5 mr-2" />
        <span>Çıkış Yap</span>
      </button>
    </div>
  );
}