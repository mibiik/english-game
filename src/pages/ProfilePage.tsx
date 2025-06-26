import React, { useState, useEffect } from 'react';
import { User, Mail, LogOut, Trophy, Star, Medal, Crown, Target, Zap, Edit2, Plus, X, ArrowLeft, Type, Camera } from 'lucide-react';
import { authService } from '../services/authService';
import { gameScoreService, GameMode } from '../services/gameScoreService';
import { useNavigate } from 'react-router-dom';

const gameModeNames: Record<GameMode, string> = {
  'matching': 'Eşleştirme',
  'sentence-completion': 'Boşluk Doldurma',
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

const IMGBB_API_KEY = "e64118428b9b6ebad6c26d97dfd98cd2"; // Buraya kendi imgbb API anahtarını ekle

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
    console.log('Fotoğraf seçildi:', e.target.files);
    const file = e.target.files?.[0];
    if (!file) {
      console.log('Dosya seçilmedi');
      return;
    }
    
    console.log('Dosya bilgileri:', file.name, file.size, file.type);
    
    // Dosya boyutu kontrolü (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Dosya boyutu 5MB\'dan küçük olmalıdır.');
      return;
    }
    
    // Dosya tipi kontrolü
    if (!file.type.startsWith('image/')) {
      setUploadError('Lütfen geçerli bir resim dosyası seçin.');
      return;
    }
    
    setUploading(true);
    setUploadError(null);
    
    try {
      console.log('Fotoğraf yükleniyor...');
      const formData = new FormData();
      formData.append('image', file);
      
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });
      
      console.log('API yanıtı:', res.status);
      const data = await res.json();
      console.log('API verisi:', data);
      
      if (data.success) {
        console.log('Fotoğraf başarıyla yüklendi:', data.data.url);
        setProfilePhoto(data.data.url);
        localStorage.setItem('profilePhoto', data.data.url);
      } else {
        console.error('API hatası:', data);
        setUploadError('Fotoğraf yüklenemedi: ' + (data.error?.message || 'Bilinmeyen hata'));
      }
    } catch (err) {
      console.error('Yükleme hatası:', err);
      setUploadError('Fotoğraf yüklenirken hata oluştu: ' + (err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-all duration-500`} style={bgImage ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="relative flex flex-col items-center mb-8">
          {/* Back Button */}
          <button 
            onClick={() => navigate('/')} 
            className="absolute top-0 left-0 p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          {/* Profil Fotoğrafı */}
          <div className="relative w-32 h-32 mt-2 mb-4">
            <div className="w-full h-full bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center border-2 border-gray-300 dark:border-gray-700 overflow-hidden">
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profil" className="object-cover w-full h-full rounded-full" />
              ) : (
                <User className="w-16 h-16 text-gray-400" />
              )}
              <input type="file" accept="image/*" className="hidden" id="profile-photo-input" onChange={handlePhotoChange} />
              <label 
                htmlFor="profile-photo-input" 
                className="absolute bottom-2 right-2 bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 p-2 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer flex items-center justify-center" 
                title="Fotoğraf Yükle"
              >
                {uploading ? (
                  <span className="w-5 h-5 block animate-spin border-2 border-gray-400 border-t-transparent rounded-full"></span>
                ) : (
                  <Camera className="w-5 h-5" />
                )}
              </label>
            </div>
          </div>
          {uploadError && (
            <div className="text-center text-red-500 text-xs mt-1">{uploadError}</div>
          )}
          {/* Kullanıcı Bilgisi */}
          <div className="w-full flex flex-col items-center mt-2 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {user?.displayName || 'Kullanıcı'}
            </h1>
            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
              <Mail className="w-4 h-4 mr-1" />
              <span>{user?.email}</span>
            </div>
          </div>
        </div>
        {/* Skorlar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-7 h-7 text-yellow-400" />
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">Toplam Puan</span>
          </div>
          <div className="text-3xl font-extrabold text-gray-900 dark:text-yellow-400 mb-4">{totalScore}</div>
          <div className="grid grid-cols-2 gap-2 w-full">
            {Object.entries(scores).map(([mode, score]) => (
              <div key={mode} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 rounded-lg px-3 py-2 border border-gray-100 dark:border-gray-800">
                <span className="text-base">{gameModeIcons[mode as GameMode]}</span>
                <span className="text-gray-700 dark:text-gray-200 text-sm">{gameModeNames[mode as GameMode]}</span>
                <span className="font-bold text-gray-900 dark:text-yellow-400 ml-auto">{score}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Ek Bilgiler ve Arka Plan */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Ek Bilgiler</h2>
              <button
                onClick={() => setShowAddInfo(true)}
                className="flex items-center px-3 py-1.5 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 transition-colors"
              >
                <Plus className="w-4 h-4 mr-1" />
                <span>Ekle</span>
              </button>
            </div>
            {showAddInfo && (
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    type="text"
                    value={newInfo.title}
                    onChange={(e) => setNewInfo({ ...newInfo, title: e.target.value })}
                    className="px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                    placeholder="Başlık"
                  />
                  <input
                    type="text"
                    value={newInfo.value}
                    onChange={(e) => setNewInfo({ ...newInfo, value: e.target.value })}
                    className="px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                    placeholder="Değer"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowAddInfo(false)}
                    className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 border border-gray-300 dark:border-gray-600 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleAddInfo}
                    className="px-2 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm">{info.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">{info.value}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveInfo(index)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* Arka Plan Seçimi Alanı */}
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-2">Arka Plan</div>
            <div className="flex flex-wrap gap-2 justify-center">
              {[null, '/assets/bg1.jpg', '/assets/bg2.jpg', '/assets/bg3.jpg'].map((img, i) => (
                <button
                  key={i}
                  onClick={() => setBgImage(img)}
                  className={`w-12 h-12 rounded-lg border ${bgImage === img ? 'border-blue-500 ring-2 ring-blue-400' : 'border-gray-300 dark:border-gray-700'} overflow-hidden shadow-sm transition-all`}
                  style={img ? { backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: 'linear-gradient(135deg, #f3f4f6 0%, #e0e7ff 100%)' }}
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
            className="w-full flex items-center justify-center p-3 bg-gray-200 dark:bg-gray-800 text-red-600 dark:text-red-400 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-2" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 