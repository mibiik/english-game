import React, { useState, useEffect } from 'react';
import { User, ArrowRight, Mail, Lock, LogIn, UserPlus, X, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { authService } from '../services/authService';
import { gameScoreService } from '../services/gameScoreService';
import icoLogo from '../ico.png';

interface AuthProps {
  onClose: () => void;
  userName?: string;
  isLogin?: boolean;
}

export const Auth: React.FC<AuthProps> = ({ onClose, userName, isLogin: initialIsLogin = false }) => {
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState(userName || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Kullanıcının oturum durumunu kontrol et
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
      
      if (isAuth) {
        const user = authService.getCurrentUser();
        if (user?.displayName) {
          setDisplayName(user.displayName);
        }
      }
    };
    
    checkAuth();
  }, []);

  // userName prop'u değiştiğinde displayName'i güncelle
  useEffect(() => {
    if (userName) {
      setDisplayName(userName);
    }
  }, [userName]);

  // initialIsLogin prop'u değiştiğinde isLogin'i güncelle
  useEffect(() => {
    setIsLogin(initialIsLogin);
  }, [initialIsLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        await authService.login(email, password);
      } else {
        await authService.register(email, password, displayName);
        // Oyun skorları için kullanıcı kaydı
        await gameScoreService.registerUser(displayName);
        setSuccess('Kayıt işlemi başarılı! Giriş yapabilirsiniz.');
        setIsLogin(true);
      }
      onClose();
    } catch (err: any) {
      let errorMessage = 'Bir hata oluştu. Lütfen tekrar deneyin.';
      
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Bu e-posta adresi zaten kullanımda.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Geçersiz e-posta adresi.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Şifre en az 6 karakter olmalıdır.';
      } else if (err.code === 'auth/user-not-found') {
        errorMessage = 'Kullanıcı bulunamadı.';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Hatalı şifre.';
      }
      
      setError(errorMessage);
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
    const user = authService.getCurrentUser();
    
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <img src={icoLogo} alt="WordPlay Logo" className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-purple-800 mb-2">Hoş Geldiniz!</h3>
          <p className="text-gray-600 mb-6">{user?.displayName || user?.email}</p>
          
          <button 
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Çıkış Yap
          </button>
          
          {success && (
            <div className="mt-4 p-3 bg-green-50 text-green-600 rounded-lg">
              {success}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-900 dark:bg-gray-950 rounded-3xl p-10 w-full max-w-lg relative shadow-2xl border border-gray-800"
      >
        {/* Kapat Butonu */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-200 text-2xl"
        >
          <X className="w-7 h-7" />
        </button>

        {/* Başlık */}
        <div className="text-center mb-10">
          <div className="inline-block p-4 rounded-full bg-gray-800 mb-5">
            <img src={icoLogo} alt="WordPlay Logo" className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-100 mb-2">
            {isLogin ? 'Hoş Geldiniz!' : 'Hesap Oluşturun'}
          </h2>
          <p className="text-gray-400 mt-2 text-lg">
            {isLogin
              ? 'Hesabınıza giriş yapın'
              : 'Yeni bir hesap oluşturun'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-base font-medium text-gray-300 mb-1">
                Ad Soyad
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-6 w-6 text-gray-500" />
                </div>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="block w-full pl-12 pr-3 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-gray-100 placeholder-gray-500"
                  placeholder="Adınız Soyadınız"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-base font-medium text-gray-300 mb-1">
              E-posta
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-6 w-6 text-gray-500" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-12 pr-3 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-gray-100 placeholder-gray-500"
                placeholder="ornek@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-base font-medium text-gray-300 mb-1">
              Şifre
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-6 w-6 text-gray-500" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-12 pr-10 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-gray-100 placeholder-gray-500"
                placeholder="Şifreniz"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-base bg-gray-800 border border-red-400/30 p-3 rounded-xl">
              {error}
            </div>
          )}
          {success && (
            <div className="text-green-400 text-base bg-gray-800 border border-green-400/30 p-3 rounded-xl">
              {success}
            </div>
          )}

          <motion.button
            type="submit"
            className="w-full py-4 px-4 bg-gray-800 text-gray-100 rounded-2xl hover:bg-gray-700 transition-all font-bold text-xl shadow-lg"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-gray-100 border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>İşleniyor...</span>
              </div>
            ) : (
              <span>{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</span>
            )}
          </motion.button>

          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-gray-400 hover:text-gray-200 font-medium text-base"
            >
              {isLogin
                ? 'Hesabınız yok mu? Kayıt olun'
                : 'Zaten hesabınız var mı? Giriş yapın'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};