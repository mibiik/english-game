import React, { useState, useEffect } from 'react';
import { User, Mail, LogOut, Trophy, Star, Medal, Crown, Target, Zap, Edit2, Plus, X, ArrowLeft, Type, Camera } from 'lucide-react';
import { authService } from '../services/authService';
import { gameScoreService, GameMode } from '../services/gameScoreService';
import { useNavigate } from 'react-router-dom';

const gameModeNames: Record<GameMode, string> = {
  'matching': 'Eşleştirme',
  'sentence-completion': 'Cümle Tamamlama',
  'multiple-choice': 'Çoktan Seçmeli',
  'flashcard': 'Kelime Kartları',
  'speaking': 'Konuşma',
  'word-race': 'Kelime Yarışı',
  'wordTypes': 'Kelime Tipleri'
};

const gameModeIcons: Record<GameMode, React.ReactNode> = {
  'matching': <Target className="w-5 h-5" />,
  'sentence-completion': <Zap className="w-5 h-5" />,
  'multiple-choice': <Medal className="w-5 h-5" />,
  'flashcard': <Star className="w-5 h-5" />,
  'speaking': <Crown className="w-5 h-5" />,
  'word-race': <Zap className="w-5 h-5" />,
  'wordTypes': <Type className="w-5 h-5" />
};

const IMGBB_API_KEY = "YOUR_API_KEY"; // Buraya kendi imgbb API anahtarını ekle

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [totalScore, setTotalScore] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [showAddInfo, setShowAddInfo] = useState(false);
  const [newInfo, setNewInfo] = useState({ title: '', value: '' });
  const [additionalInfo, setAdditionalInfo] = useState<Array<{ title: string; value: string }>>([]);
  const [scores, setScores] = useState<Record<GameMode, number>>({
    'matching': 0,
    'sentence-completion': 0,
    'multiple-choice': 0,
    'flashcard': 0,
    'speaking': 0,
    'word-race': 0,
    'wordTypes': 0
  });
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

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
        'word-race': 0,
        'wordTypes': 0
      };

      // Her oyun modu için en yüksek skoru al
      for (const mode of Object.keys(scores) as GameMode[]) {
        const score = await gameScoreService.getUserHighScore(mode, '1');
        scores[mode] = score;
        total += score;
      }

      setScores(scores);
      setTotalScore(total);
    };

    loadUserScores();
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      setEditedName(user.displayName || '');
    }
  }, [user]);

  useEffect(() => {
    const savedPhoto = localStorage.getItem('profilePhoto');
    if (savedPhoto) setProfilePhoto(savedPhoto);
  }, []);

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

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setProfilePhoto(data.data.url);
        localStorage.setItem('profilePhoto', data.data.url);
      } else {
        setUploadError('Fotoğraf yüklenemedi.');
      }
    } catch (err) {
      setUploadError('Fotoğraf yüklenirken hata oluştu.');
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className={`min-h-screen ${bgImage ? '' : 'bg-gradient-to-br from-gray-100 via-blue-100 to-gray-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800'} py-12 px-4 sm:px-6 lg:px-8 transition-all duration-500`} style={bgImage ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="relative h-56 bg-gradient-to-r from-blue-600 via-fuchsia-600 to-purple-700 rounded-3xl shadow-xl overflow-hidden">
          <div className="absolute inset-0 bg-[url('/assets/pattern-bg.svg')] opacity-10"></div>
          {/* Back Button */}
          <button 
            onClick={() => navigate('/')} 
            className="absolute top-4 left-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors shadow-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          {/* Edit Button */}
          <button 
            onClick={() => setIsEditing(true)}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors shadow-lg"
          >
            <Edit2 className="w-6 h-6" />
          </button>
          {/* Profil Fotoğrafı */}
          <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2">
            <div className="relative w-40 h-40">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-fuchsia-400 to-purple-500 rounded-full opacity-30 animate-pulse"></div>
              <div className="relative w-full h-full bg-white dark:bg-gray-800 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-xl overflow-hidden">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profil" className="object-cover w-full h-full rounded-full" />
                ) : (
                  <User className="w-20 h-20 text-gray-300" />
                )}
                <input type="file" accept="image/*" className="hidden" id="profile-photo-input" onChange={handlePhotoChange} />
                <label htmlFor="profile-photo-input">
                  <button type="button" className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg border-2 border-white dark:border-gray-800 transition-colors" title="Fotoğraf Yükle">
                    {uploading ? (
                      <span className="w-6 h-6 block animate-spin border-2 border-white border-t-transparent rounded-full"></span>
                    ) : (
                      <Camera className="w-6 h-6" />
                    )}
                  </button>
                </label>
              </div>
            </div>
          </div>
          {uploadError && (
            <div className="text-center text-red-500 text-sm mt-2">{uploadError}</div>
          )}
        </div>
        {/* Profile Content */}
        <div className="bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-2xl p-10 pt-28 mt-24 backdrop-blur-md">
          <div className="text-center mb-8">
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full max-w-xs px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Adınız"
                />
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={handleSaveProfile}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
                  {user?.displayName || 'Kullanıcı'}
                </h1>
                <div className="flex items-center justify-center text-gray-600 dark:text-gray-400">
                  <Mail className="w-5 h-5 mr-2" />
                  <span>{user?.email}</span>
                </div>
              </>
            )}
          </div>
          {/* Skorlar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-gradient-to-br from-blue-100 via-fuchsia-100 to-purple-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-2xl p-8 flex flex-col items-center shadow-lg">
              <Trophy className="w-10 h-10 text-yellow-400 mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">Toplam Puan</div>
              <div className="text-4xl font-extrabold text-blue-700 dark:text-yellow-400 mt-2">{totalScore}</div>
            </div>
            <div className="bg-gradient-to-br from-fuchsia-100 via-blue-100 to-purple-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-2xl p-8 flex flex-col items-center shadow-lg">
              <Star className="w-10 h-10 text-fuchsia-400 mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">Oyun Skorları</div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {Object.entries(scores).map(([mode, score]) => (
                  <div key={mode} className="flex items-center gap-2 bg-white/70 dark:bg-gray-900/70 rounded-lg px-3 py-2">
                    <span className="text-lg">{gameModeIcons[mode as GameMode]}</span>
                    <span className="text-gray-700 dark:text-gray-200 text-base">{gameModeNames[mode as GameMode]}</span>
                    <span className="font-bold text-blue-700 dark:text-yellow-400 ml-auto">{score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Ek Bilgiler ve Arka Plan */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Ek Bilgiler</h2>
                <button
                  onClick={() => setShowAddInfo(true)}
                  className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                      className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Başlık"
                    />
                    <input
                      type="text"
                      value={newInfo.value}
                      onChange={(e) => setNewInfo({ ...newInfo, value: e.target.value })}
                      className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Değer"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowAddInfo(false)}
                      className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                    >
                      İptal
                    </button>
                    <button
                      onClick={handleAddInfo}
                      className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Ekle
                    </button>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 gap-2">
                {additionalInfo.map((info, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">{info.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{info.value}</p>
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
            {/* Arka Plan Seçimi Alanı */}
            <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-fuchsia-100 to-purple-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="text-lg font-bold text-gray-900 dark:text-white mb-2">Arka Plan</div>
              <div className="flex flex-wrap gap-3 justify-center">
                {/* Örnek arka planlar */}
                {[null, '/assets/bg1.jpg', '/assets/bg2.jpg', '/assets/bg3.jpg'].map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setBgImage(img)}
                    className={`w-16 h-16 rounded-xl border-2 ${bgImage === img ? 'border-blue-500 ring-2 ring-blue-400' : 'border-gray-300 dark:border-gray-700'} overflow-hidden shadow transition-all`}
                    style={img ? { backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: 'linear-gradient(135deg, #e0e7ff 0%, #fbc2eb 100%)' }}
                    title={img ? 'Arka Plan' : 'Varsayılan'}
                  >
                    {!img && <span className="block w-full h-full flex items-center justify-center text-gray-400 text-xs">Varsayılan</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Logout Button */}
          <div className="mt-8">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-2" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 