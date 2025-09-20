import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  LogOut,
  Trophy,
  Star,
  Medal,
  Crown,
  Target,
  Zap,
  Type,
  Camera,
  ArrowLeft,
  Edit2, // Eğer düzenleme özelliği eklerseniz kullanabilirsiniz
  BookOpen, // Yeni eklenen ikon
  Puzzle, // Yeni eklenen ikon
  Megaphone, // Yeni eklenen ikon
  Smartphone
} from 'lucide-react';
import { supabaseAuthService } from '../services/supabaseAuthService';
import { supabaseGameScoreService, GameMode } from '../services/supabaseGameScoreService';
import { supabase } from '../config/supabase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserAnalytics } from '../components/UserAnalytics';
import { userService } from '../services/userService'; // Yeni eklenen import
import DeviceInfoDisplay from '../components/DeviceInfoDisplay';
import AdvancedAnalytics from '../components/AdvancedAnalytics';

// Oyun modları için isim ve ikon haritaları
const gameModeNames: Record<GameMode, string> = {
  'matching': 'Eşleştirme',
  'sentence-completion': 'Boşluk Doldurma',
  'multiple-choice': 'Çoktan Seçmeli',
  'flashcard': 'Kelime Kartları',
  'speaking': 'Konuşma',
  'word-race': 'Kelime Yarışı',
  'wordTypes': 'Kelime Tipleri',
  'wordForms': 'Kelime Formları',
  'vocabulary': 'Kelime Hazinesi',
  'timedMatching': 'Zamanlı Eşleştirme',
  'speedGame': 'Hız Oyunu',
  'quizGame': 'Quiz Oyunu',
  'prepositionMastery': 'Preposition',
  'paraphraseChallenge': 'Paraphrase',
  'difficultWords': 'Zor Kelimeler',
  'definitionToWord': 'Tanımdan Kelime'
};

const gameModeIcons: Record<GameMode, React.ReactNode> = {
  'matching': <Target className="w-5 h-5 text-blue-500" />,
  'sentence-completion': <Zap className="w-5 h-5 text-purple-500" />,
  'multiple-choice': <Medal className="w-5 h-5 text-green-500" />,
  'flashcard': <Star className="w-5 h-5 text-yellow-500" />,
  'speaking': <Crown className="w-5 h-5 text-pink-500" />,
  'word-race': <Zap className="w-5 h-5 text-indigo-500" />, // Aynı ikon, farklı renk
  'wordTypes': <Type className="w-5 h-5 text-teal-500" />,
  'wordForms': <Type className="w-5 h-5 text-orange-500" />,
  'vocabulary': <BookOpen className="w-5 h-5 text-green-500" />,
  'timedMatching': <Zap className="w-5 h-5 text-red-500" />,
  'speedGame': <Zap className="w-5 h-5 text-yellow-600" />,
  'quizGame': <Trophy className="w-5 h-5 text-blue-400" />,
  'prepositionMastery': <Puzzle className="w-5 h-5 text-purple-700" />,
  'paraphraseChallenge': <Megaphone className="w-5 h-5 text-pink-700" />,
  'difficultWords': <Star className="w-5 h-5 text-red-700" />,
  'definitionToWord': <BookOpen className="w-5 h-5 text-blue-700" />
};

// IMGBB API anahtarınızı buraya ekleyin. Güvenlik için ortam değişkeni kullanmak daha iyidir.
const IMGBB_API_KEY = "e64118428b9b6ebad6c26d97dfd98cd2"; 

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const user = supabaseAuthService.getCurrentUser(); // Kullanıcı bilgilerini al

  // State'ler
  const [totalScore, setTotalScore] = useState(0);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null); // Profil fotoğrafı URL'si
  const [uploading, setUploading] = useState(false); // Fotoğraf yükleme durumu
  const [uploadError, setUploadError] = useState<string | null>(null); // Fotoğraf yükleme hatası
  const [isEditingName, setIsEditingName] = useState(false); // Kullanıcı adını düzenleme durumu
  const [editedName, setEditedName] = useState(''); // Düzenlenen kullanıcı adı
  const [loading, setLoading] = useState(true); // Yükleme durumu
  const [badges, setBadges] = useState<string[]>([]); // Rozetler
  const [isFirstSupporter, setIsFirstSupporter] = useState(false); // İlk destekçi mi?
  const [pendingPhoto, setPendingPhoto] = useState<string | null>(null);
  const [photoHistory, setPhotoHistory] = useState<string[]>([]); // Fotoğraf geçmişi

  // Kullanıcı oturum açmamışsa yönlendirme
  useEffect(() => {
    console.log('🔍 ProfilePage: User kontrolü', { user: !!user, userId: user?.id });
    if (!user) {
      console.log('❌ ProfilePage: Kullanıcı yok, yönlendiriliyor...');
      navigate('/home');
    } else {
      console.log('✅ ProfilePage: Kullanıcı var, profil yükleniyor...');
      setEditedName(user.user_metadata?.display_name || user.displayName || ''); // Başlangıçta mevcut adı ayarla
      setLoading(false); // Loading'i kapat
    }
  }, [user, navigate]);


  // Kullanıcı Firestore'dan geldiğinde rozet ve destekçi kontrolü
  useEffect(() => {
    if (!user) return;
    console.log('🔍 ProfilePage: Rozetler yükleniyor...', user.id);
    const fetchBadges = async () => {
      try {
        const userData = await userService.getUser(user.id);
        console.log('📊 ProfilePage: Kullanıcı verisi alındı:', userData);
        if (userData) {
          setBadges(userData.badges || []);
          setIsFirstSupporter(!!userData.isFirstSupporter);
          console.log('✅ ProfilePage: Rozetler yüklendi:', { badges: userData.badges, isFirstSupporter: userData.isFirstSupporter });
        }
      } catch (error) {
        console.error('❌ ProfilePage: Rozet yükleme hatası:', error);
      }
    };
    fetchBadges();
  }, [user]);

  // Profil fotoğrafını Supabase'den yükleme
  useEffect(() => {
    const loadProfilePhoto = async () => {
      if (!user?.id) return;
      
      try {
        // Önce Supabase'den yükle
        const { data: userData, error } = await supabase
          .from('users')
          .select('avatar_url')
          .eq('id', user.id)
          .single();
          
        if (!error && userData?.avatar_url) {
          setProfilePhoto(userData.avatar_url);
          // localStorage'a da kaydet
          localStorage.setItem(`profilePhoto_${user.id}`, userData.avatar_url);
        } else {
          // Supabase'de yoksa localStorage'dan yükle
          const savedPhoto = localStorage.getItem(`profilePhoto_${user.id}`);
          if (savedPhoto) setProfilePhoto(savedPhoto);
        }
        
        // Geçmiş fotoğrafları yükle
        const savedHistory = localStorage.getItem(`profilePhotoHistory_${user.id}`);
        if (savedHistory) setPhotoHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Profil fotoğrafı yüklenirken hata:', error);
        // Hata durumunda localStorage'dan yükle
        const savedPhoto = localStorage.getItem(`profilePhoto_${user.id}`);
        if (savedPhoto) setProfilePhoto(savedPhoto);
      }
    };
    
    loadProfilePhoto();
  }, [user?.id]);

  // Çıkış yapma fonksiyonu
  const handleLogout = async () => {
    try {
      await supabaseAuthService.logout();
      navigate('/home');
    } catch (err) {
      console.error('Çıkış yapılırken hata oluştu:', err);
      // Kullanıcıya bir hata mesajı gösterebilirsiniz.
    }
  };

  // Profil adını kaydetme
  const handleSaveProfileName = async () => {
    if (!user) return;
    try {
        await supabaseAuthService.updateProfile({ displayName: editedName });
        // Firestore'da da güncelle
        await userService.updateUser(user.id, { displayName: editedName });
      setIsEditingName(false);
      // Başarı mesajı gösterilebilir.
    } catch (err) {
      console.error('Profil adı güncellenirken hata oluştu:', err);
      // Kullanıcıya hata mesajı gösterilebilir.
    }
  };


  // Profil fotoğrafı yükleme fonksiyonu
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Dosya boyutu 5MB\'dan küçük olmalıdır.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setUploadError('Lütfen geçerli bir resim dosyası seçin.');
      return;
    }

    setUploading(true);
    setUploadError(null);

    // Hızlı önizleme için optimistic update
    const tempUrl = URL.createObjectURL(file);
    setPendingPhoto(tempUrl);

    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        const uploadedUrl = data.data.url;
        setProfilePhoto(uploadedUrl);
        setPendingPhoto(null);
        localStorage.setItem(`profilePhoto_${user?.id}`, uploadedUrl);
        setPhotoHistory((prev) => {
          const updated = [uploadedUrl, ...prev.filter(p => p !== uploadedUrl)].slice(0, 10);
          localStorage.setItem(`profilePhotoHistory_${user?.id}`, JSON.stringify(updated));
          return updated;
        });
        if (user?.id) {
          // Supabase'e kaydet
          await supabaseAuthService.updateProfile({ photoURL: uploadedUrl });
          // Firebase'e de kaydet (eski sistem için)
          await userService.updateUserPhoto(user.id, uploadedUrl);
        }
      } else {
        throw new Error(data.error?.message || 'Bilinmeyen bir API hatası oluştu.');
      }
    } catch (err: any) {
      setUploadError(`Fotoğraf yüklenemedi: ${err.message}`);
      setPendingPhoto(null);
    } finally {
      setUploading(false);
      if (pendingPhoto) URL.revokeObjectURL(pendingPhoto);
    }
  };

  // Kullanıcı yoksa componenti render etme
  if (!user) {
    return null;
  }

  // Yükleme durumu
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#111] to-black text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Profil yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#111] to-black text-gray-100 overflow-x-hidden relative" style={{ paddingTop: '64px', marginTop: '-128px' }}>
      {/* Floating Elements - Optimized */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Ana uçuşan elementler - Sabit pozisyonlar */}
          <motion.div
          className="absolute w-2 h-2 bg-red-500/20 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
            duration: 15,
              repeat: Infinity,
            delay: 2,
            }}
          style={{ left: '20%', top: '30%' }}
          />
          <motion.div
          className="absolute w-2 h-2 bg-red-500/20 rounded-full"
            animate={{
            x: [0, 80, 0],
            y: [0, -80, 0],
            opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
            duration: 12,
              repeat: Infinity,
            delay: 5,
            }}
          style={{ left: '60%', top: '20%' }}
          />
        
        {/* Yıldız şeklinde elementler - Sabit pozisyonlar */}
          <motion.div
            className="absolute w-1 h-1 bg-yellow-500/40"
            style={{
            left: '25%',
            top: '35%',
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
            }}
            animate={{
              rotate: [0, 360],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
            duration: 10,
            repeat: Infinity,
            delay: 1,
          }}
        />
        <motion.div
          className="absolute w-1 h-1 bg-yellow-500/40"
          style={{
            left: '55%',
            top: '45%',
            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
          }}
          animate={{
            rotate: [0, 360],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
              repeat: Infinity,
            delay: 4,
            }}
          />

        {/* Ek küçük elementler - Sabit pozisyonlar */}
          <motion.div
            className="absolute w-1 h-1 bg-purple-500/25 rounded-full"
            animate={{
              x: [0, 150, 0],
              y: [0, -150, 0],
              opacity: [0.1, 0.5, 0.1],
            }}
            transition={{
            duration: 16,
              repeat: Infinity,
            delay: 3,
            }}
          style={{ left: '15%', top: '50%' }}
        />
        <motion.div
          className="absolute w-1 h-1 bg-purple-500/25 rounded-full"
          animate={{
            x: [0, 120, 0],
            y: [0, -120, 0],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            delay: 6,
            }}
          style={{ left: '75%', top: '35%' }}
          />
      </div>

      {/* Ana içerik container'ı */}
      <div className="max-w-4xl mx-auto relative z-10 py-12 px-4 sm:px-6 lg:px-8">

        {/* Geri dön butonu */}
          <button 
          onClick={() => navigate('/home')}
          className="absolute top-0 left-0 p-2 bg-gray-900/60 backdrop-blur-md rounded-full shadow-2xl hover:shadow-xl transition-all flex items-center justify-center border border-gray-700/50 text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Geri dön"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>


        {/* Profil Bilgileri */}
        <div className="relative bg-gray-900/60 backdrop-blur-md rounded-xl shadow-2xl border border-gray-700/50 p-6 sm:p-8 mb-8">
          {/* Profil Fotoğrafı ve Düzenleme */}
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-blue-500 shadow-lg">
              {pendingPhoto ? (
                <img src={pendingPhoto} alt="Profil Fotoğrafı" className="w-full h-full object-cover opacity-70 blur-sm" />
              ) : profilePhoto ? (
                <img src={profilePhoto} alt="Profil Fotoğrafı" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <User className="w-16 h-16 text-blue-400" />
                </div>
              )}
              </div>
              <input
                type="file"
                accept="image/*"
                id="profile-photo-input"
                className="hidden"
                onChange={handlePhotoChange}
              />
              <label 
                htmlFor="profile-photo-input" 
                className="absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors shadow-md flex items-center justify-center"
                title="Profil Fotoğrafı Değiştir"
              >
                {uploading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Camera className="w-5 h-5" />
                )}
              </label>
            </div>
          </div>

          {/* Yükleme Hatası Mesajı */}
          {uploadError && (
            <div className="text-center text-red-400 text-sm mt-48 sm:mt-44 -mb-4">
              {uploadError}
            </div>
          )}

          {/* Kullanıcı Bilgileri */}
          <div className="mt-16 sm:mt-20 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              {/* Rozet ve yıldız gösterimi */}
              {badges.includes('bağışçı') && (
                <span className="inline-flex items-center px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs font-semibold mr-2">
                  <Star className="w-4 h-4 mr-1 text-yellow-500" /> Bağışçı
                </span>
              )}
              {isFirstSupporter && (
                <span className="inline-flex items-center px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-semibold mr-2">
                  <Star className="w-4 h-4 mr-1 text-blue-500" /> İlk Destekçimiz
                </span>
              )}
              {isEditingName ? (
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onBlur={handleSaveProfileName}
                  onKeyPress={(e) => e.key === 'Enter' && handleSaveProfileName()}
                  className="text-2xl sm:text-3xl font-bold text-white text-center px-2 py-1 rounded-lg bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              ) : (
                <h1 className="text-2xl sm:text-3xl font-bold text-pink-400">
                  {user?.user_metadata?.display_name || user?.displayName || 'Kullanıcı Adı Girilmedi'}
                </h1>
              )}
              {!isEditingName && (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                  title="Kullanıcı adını düzenle"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="flex items-center justify-center text-gray-400 text-sm sm:text-base gap-1">
              <Mail className="w-4 h-4" />
              <span>{user?.email}</span>
            </div>
          </div>
        </div>

        {/* Analiz Dashboard'u */}
        <div className="bg-gray-900/60 backdrop-blur-md rounded-xl shadow-2xl border border-gray-700/50 p-6 mb-8">
          <AdvancedAnalytics userId={user?.id} />
        </div>

        {/* Çıkış Yap Butonu */}
        <div className="mt-10 mb-5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-3 bg-red-500/80 backdrop-blur-sm hover:bg-red-600/80 text-white rounded-lg shadow-2xl border border-red-400/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 hover:shadow-red-500/25"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-semibold">Çıkış Yap</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage; 