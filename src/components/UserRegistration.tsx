import React, { useState, useEffect } from 'react';
import { User, ArrowRight, Mail, Lock, LogIn, UserPlus, X } from 'lucide-react';
import { authService } from '../services/authService';
import { gameScoreService } from '../services/gameScoreService';

interface UserRegistrationProps {
  onClose: () => void;
}

type AuthMode = 'login' | 'register';

export function UserRegistration({ onClose }: UserRegistrationProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Kullanıcının oturum durumunu kontrol et
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
      
      if (isAuth) {
        const user = authService.getCurrentUser();
        const userDisplayName = user?.user_metadata?.display_name || user?.displayName;
        if (userDisplayName) {
          setDisplayName(userDisplayName);
          // Display name'i isim ve soyisim olarak ayır
          const nameParts = userDisplayName.split(' ');
          if (nameParts.length >= 2) {
            setFirstName(nameParts[0]);
            setLastName(nameParts.slice(1).join(' '));
          } else {
            setFirstName(userDisplayName);
            setLastName('');
          }
        }
      }
    };
    
    checkAuth();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      if (mode === 'register') {
        // İsim ve soyisimi birleştir
        const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
        if (!fullName) {
          setError('İsim ve soyisim alanları boş olamaz.');
          return;
        }
        
        // Kayıt işlemi
        await authService.register(email, password, fullName);
        // Oyun skorları için kullanıcı kaydı
        await gameScoreService.registerUser(fullName);
        setSuccess('Kayıt işlemi başarılı! Giriş yapabilirsiniz.');
        setMode('login');
      } else {
        // Giriş işlemi
        await authService.login(email, password);
        setSuccess('Giriş başarılı!');
        setIsAuthenticated(true);
        
        // Kısa bir süre sonra modal'ı kapat
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err: any) {
      console.error('Kimlik doğrulama hatası:', err);
      
      // Firebase hata mesajlarını Türkçe'ye çevir
      if (err.code === 'auth/email-already-in-use') {
        setError('Bu e-posta adresi zaten kullanımda.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Geçersiz e-posta adresi.');
      } else if (err.code === 'auth/weak-password') {
        setError('Şifre en az 6 karakter olmalıdır.');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('E-posta veya şifre hatalı.');
      } else {
        setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setSuccess('Çıkış yapıldı!');
      
      // Kısa bir süre sonra başarı mesajını temizle
      setTimeout(() => {
        setSuccess(null);
      }, 2000);
    } catch (err) {
      console.error('Çıkış yapılırken hata oluştu:', err);
      setError('Çıkış yapılırken bir hata oluştu.');
    }
  };

  if (isAuthenticated) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <User className="w-8 h-8 text-purple-600" />
            <h2 className="text-2xl font-bold text-purple-800">Hesabım</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center py-6">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-purple-800 mb-2">{displayName}</h3>
          
          {success && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">
              {success}
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <button
            onClick={handleLogout}
            className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <User className="w-8 h-8 text-purple-600" />
          <h2 className="text-2xl font-bold text-purple-800">
            {mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
          </h2>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">İsim</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="İsminiz"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Soyisim</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Soyisminiz"
                  required
                />
              </div>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="E-posta Adresi"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Şifre"
              required
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-100 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:shadow-md transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            'İşleniyor...'
          ) : mode === 'login' ? (
            <>
              <LogIn className="w-5 h-5" /> Giriş Yap
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5" /> Kayıt Ol
            </>
          )}
        </button>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError(null);
              setSuccess(null);
            }}
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            {mode === 'login' ? 'Hesabınız yok mu? Kayıt olun' : 'Zaten hesabınız var mı? Giriş yapın'}
          </button>
        </div>
      </form>
    </div>
  );
}