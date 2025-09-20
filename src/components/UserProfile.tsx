import { useEffect, useState } from 'react';
import { User, LogOut, Trophy, Loader2, Edit3, Save, X } from 'lucide-react';
import { authService } from '../services/authService';
import { supabaseAuthService } from '../services/supabaseAuthService';
import { GameMode } from '../services/gameScoreService';
import { supabaseGameScoreService } from '../services/supabaseGameScoreService';

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
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const userId = authService.getCurrentUserId();
      if (!userId) return;
      const userProfile = await supabaseGameScoreService.getUserProfile(userId);
      setProfile(userProfile);
      
      // Profil fotoğrafını ayarla
      if (userProfile?.avatar_url) {
        setProfilePhoto(userProfile.avatar_url);
      }
      
      // Display name'i isim ve soyisim olarak ayır
      const displayName = userProfile?.display_name || userProfile?.displayName;
      if (displayName) {
        const nameParts = displayName.split(' ');
        if (nameParts.length >= 2) {
          setFirstName(nameParts[0]);
          setLastName(nameParts.slice(1).join(' '));
        } else {
          setFirstName(displayName);
          setLastName('');
        }
      }
      
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

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Orijinal değerlere geri dön
    if (profile?.displayName) {
      const nameParts = profile.displayName.split(' ');
      if (nameParts.length >= 2) {
        setFirstName(nameParts[0]);
        setLastName(nameParts.slice(1).join(' '));
      } else {
        setFirstName(profile.displayName);
        setLastName('');
      }
    }
  };

  const handleSaveProfile = async () => {
    if (!firstName.trim()) {
      alert('İsim alanı boş olamaz.');
      return;
    }

    setIsUpdating(true);
    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      
      // Supabase'de profil güncelle
      await supabaseAuthService.updateProfile({ displayName: fullName });
      
      // Profil verisini güncelle
      setProfile({ ...profile, displayName: fullName });
      setIsEditing(false);
      
      // Sayfayı yenile (leaderboard'da güncellenmiş adı görmek için)
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('Profil güncellenirken hata oluştu:', error);
      alert('Profil güncellenirken bir hata oluştu.');
    } finally {
      setIsUpdating(false);
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
        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4 overflow-hidden">
          {profilePhoto ? (
            <img 
              src={profilePhoto} 
              alt="Profil Fotoğrafı" 
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-10 h-10 text-purple-600" />
          )}
        </div>
        
        {isEditing ? (
          <div className="w-full space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">İsim</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="İsminiz"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Soyisim</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Soyisminiz"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveProfile}
                disabled={isUpdating}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {isUpdating ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={isUpdating}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-4 h-4" />
                İptal
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-bold text-purple-800 mb-1">{profile.displayName || 'Kullanıcı'}</h3>
            <p className="text-gray-500">{profile.email}</p>
            <button
              onClick={handleEditProfile}
              className="mt-2 flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
            >
              <Edit3 className="w-4 h-4" />
              Profili Düzenle
            </button>
          </>
        )}
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
              <span className="ml-auto font-bold text-purple-700">{String(score)}</span>
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