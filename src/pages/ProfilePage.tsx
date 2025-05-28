import React, { useState, useEffect } from 'react';
import { User, Mail, LogOut, Trophy, Star, Medal, Crown, Target, Zap, Edit2, Plus, X, ArrowLeft } from 'lucide-react';
import { authService } from '../services/authService';
import { gameScoreService, GameMode } from '../services/gameScoreService';
import { useNavigate } from 'react-router-dom';

const gameModeNames: Record<GameMode, string> = {
  'matching': 'Eşleştirme',
  'sentence-completion': 'Cümle Tamamlama',
  'multiple-choice': 'Çoktan Seçmeli',
  'flashcard': 'Kelime Kartları',
  'speaking': 'Konuşma',
  'word-race': 'Kelime Yarışı'
};

const gameModeIcons: Record<GameMode, React.ReactNode> = {
  'matching': <Target className="w-5 h-5" />,
  'sentence-completion': <Zap className="w-5 h-5" />,
  'multiple-choice': <Medal className="w-5 h-5" />,
  'flashcard': <Star className="w-5 h-5" />,
  'speaking': <Crown className="w-5 h-5" />,
  'word-race': <Zap className="w-5 h-5" />
};

export function ProfilePage() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [totalScore, setTotalScore] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [showAddInfo, setShowAddInfo] = useState(false);
  const [newInfo, setNewInfo] = useState({ title: '', value: '' });
  const [additionalInfo, setAdditionalInfo] = useState<Array<{ title: string; value: string }>>([]);
  const [highScores, setHighScores] = useState<Record<GameMode, number>>({
    'matching': 0,
    'sentence-completion': 0,
    'multiple-choice': 0,
    'flashcard': 0,
    'speaking': 0,
    'word-race': 0
  });

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const loadUserScores = async () => {
      let total = 0;
      const scores: Record<GameMode, number> = {
        'matching': 0,
        'sentence-completion': 0,
        'multiple-choice': 0,
        'flashcard': 0,
        'speaking': 0,
        'word-race': 0
      };

      // Her oyun modu için en yüksek skoru al
      for (const mode of Object.keys(scores) as GameMode[]) {
        const score = await gameScoreService.getUserHighScore(mode, '1');
        scores[mode] = score;
        total += score;
      }

      setHighScores(scores);
      setTotalScore(total);
    };

    loadUserScores();
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      setEditedName(user.displayName || '');
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/');
    } catch (err) {
      console.error('Çıkış yapılırken hata oluştu:', err);
    }
  };

  const handleSaveProfile = async () => {
    try {
      if (user) {
        await authService.updateProfile({ displayName: editedName });
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Profil güncellenirken hata oluştu:', err);
    }
  };

  const handleAddInfo = () => {
    if (newInfo.title && newInfo.value) {
      setAdditionalInfo([...additionalInfo, newInfo]);
      setNewInfo({ title: '', value: '' });
      setShowAddInfo(false);
    }
  };

  const handleRemoveInfo = (index: number) => {
    setAdditionalInfo(additionalInfo.filter((_, i) => i !== index));
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="relative h-48 bg-gradient-to-r from-purple-500 to-indigo-500">
            <div className="absolute inset-0 bg-[url('/assets/pattern-bg.svg')] opacity-10"></div>
            
            {/* Back Button */}
            <button 
              onClick={() => navigate('/')}
              className="absolute top-4 left-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            {/* Edit Button */}
            <button 
              onClick={() => setIsEditing(true)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            >
              <Edit2 className="w-6 h-6" />
            </button>
            
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full opacity-20 animate-pulse"></div>
                <div className="relative w-full h-full bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800">
                  <User className="w-16 h-16 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 pb-8 px-8">
            <div className="text-center mb-8">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full max-w-xs px-4 py-2 rounded-lg border border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Adınız"
                  />
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      Kaydet
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {user?.displayName || 'Kullanıcı'}
                  </h1>
                  <div className="flex items-center justify-center text-gray-500 dark:text-gray-400">
                    <Mail className="w-5 h-5 mr-2" />
                    <span>{user?.email}</span>
                  </div>
                </>
              )}
            </div>

            {/* Additional Info Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Ek Bilgiler</h2>
                <button
                  onClick={() => setShowAddInfo(true)}
                  className="flex items-center px-3 py-1.5 text-sm bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  <span>Bilgi Ekle</span>
                </button>
              </div>

              {showAddInfo && (
                <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <input
                      type="text"
                      value={newInfo.title}
                      onChange={(e) => setNewInfo({ ...newInfo, title: e.target.value })}
                      className="px-3 py-2 rounded-lg border border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Başlık"
                    />
                    <input
                      type="text"
                      value={newInfo.value}
                      onChange={(e) => setNewInfo({ ...newInfo, value: e.target.value })}
                      className="px-3 py-2 rounded-lg border border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Değer"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setShowAddInfo(false)}
                      className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                    >
                      İptal
                    </button>
                    <button
                      onClick={handleAddInfo}
                      className="px-3 py-1.5 text-sm bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      Ekle
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {additionalInfo.map((info, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{info.title}</h3>
                      <p className="text-gray-500 dark:text-gray-400">{info.value}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveInfo(index)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Score Card */}
            <div className="relative p-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl text-white overflow-hidden mb-8">
              <div className="absolute inset-0 bg-[url('/assets/pattern-bg.svg')] opacity-10"></div>
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full filter blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Trophy className="w-8 h-8 mr-3" />
                    <span className="font-medium text-xl">Toplam Puan</span>
                  </div>
                  <span className="text-4xl font-bold">{totalScore}</span>
                </div>
                <p className="text-purple-100 text-sm mt-2">Tüm oyunlardaki toplam başarınız</p>
              </div>
            </div>

            {/* Game Scores */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Oyun Skorları</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(highScores).map(([mode, score]) => (
                  <div 
                    key={mode} 
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-4">
                        {gameModeIcons[mode as GameMode]}
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{gameModeNames[mode as GameMode]}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-6 h-6 text-yellow-500 mr-2" />
                      <span className="font-bold text-gray-900 dark:text-white text-lg">{score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Logout Button */}
            <div className="mt-8">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-2" />
                <span>Çıkış Yap</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 