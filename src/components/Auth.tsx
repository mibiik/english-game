import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, X, Eye, EyeOff, Chrome, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { authService } from '../services/authService';
import { gameScoreService } from '../services/gameScoreService';
import icoLogo from '../pages/ico.png';

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
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
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

  useEffect(() => {
    if (userName) {
      setDisplayName(userName);
    }
  }, [userName]);

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
        onClose();
        return;
      } else {
        await authService.register(email, password, displayName);
        await gameScoreService.registerUser(displayName);
        onClose();
      }
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

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsGoogleLoading(true);

    try {
      await authService.signInWithGoogle();
      onClose();
    } catch (err: any) {
      let errorMessage = 'Google ile giriş sırasında bir hata oluştu.';
      
      if (err.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Giriş işlemi iptal edildi.';
      } else if (err.code === 'auth/popup-blocked') {
        errorMessage = 'Popup engellendi. Lütfen popup engelleyiciyi kapatın.';
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'Bu e-posta adresi farklı bir yöntemle kayıtlı.';
      }
      
      setError(errorMessage);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await authService.resetPassword(email);
      setSuccess('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Spam klasörünüzü kontrol etmeyi unutmayın!');
      setShowForgotPassword(false);
    } catch (err: any) {
      let errorMessage = 'Şifre sıfırlama sırasında bir hata oluştu.';
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Geçersiz e-posta adresi.';
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
        className="bg-gray-900 rounded-3xl w-full max-w-2xl relative shadow-2xl border border-gray-800 flex flex-col"
      >
        {/* Kapat Butonu */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-200 z-20"
        >
          <X className="w-8 h-8" />
        </button>

        {/* Başlık - Kompakt */}
        <div className="flex-shrink-0 p-6 border-b border-gray-800">
          <div className="text-center">
            <div className="inline-block p-3 rounded-full bg-gray-800 mb-4">
              <img src={icoLogo} alt="WordPlay Logo" className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-100 mb-2">
              {isLogin ? 'Hoş Geldiniz!' : 'Hesap Oluşturun'}
            </h2>
            <p className="text-gray-400 text-lg">
              {isLogin
                ? 'Hesabınıza giriş yapın'
                : 'Yeni bir hesap oluşturun'}
            </p>
          </div>
        </div>

        {/* İçerik - Kompakt */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0">
          {showForgotPassword ? (
            <form onSubmit={handleForgotPassword} className="max-w-md mx-auto space-y-5">
              <div className="text-center mb-6">
                                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="flex items-center gap-2 text-gray-400 hover:text-gray-200 mb-4"
                  >
                  <ArrowLeft className="w-6 h-6" />
                  Geri Dön
                </button>
                                 <h3 className="text-xl font-bold text-gray-100">Şifremi Unuttum</h3>
                <p className="text-gray-400 mt-3">
                  E-posta adresinizi girin, şifre sıfırlama bağlantısı göndereceğiz.
                </p>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-300 mb-2">
                  E-posta
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-6 w-6 text-gray-500" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-gray-100 placeholder-gray-500 text-lg"
                    placeholder="ornek@email.com"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-400 text-lg bg-gray-800 border border-red-400/30 p-4 rounded-xl">
                  {error}
                </div>
              )}
              {success && (
                <div className="text-green-400 text-lg bg-gray-800 border border-green-400/30 p-4 rounded-xl">
                  {success}
                </div>
              )}

              <motion.button
                type="submit"
                className="w-full py-4 px-6 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-bold text-xl shadow-lg"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    <span>Gönderiliyor...</span>
                  </div>
                ) : (
                  <span>Şifre Sıfırlama Bağlantısı Gönder</span>
                )}
              </motion.button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-lg font-medium text-gray-300 mb-2">
                    Ad Soyad
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-6 w-6 text-gray-500" />
                    </div>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="block w-full pl-12 pr-4 py-4 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-gray-100 placeholder-gray-500 text-lg"
                      placeholder="Adınız Soyadınız"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-lg font-medium text-gray-300 mb-2">
                  E-posta
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-6 w-6 text-gray-500" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-gray-100 placeholder-gray-500 text-lg"
                    placeholder="ornek@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-300 mb-2">
                  Şifre
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-6 w-6 text-gray-500" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-12 pr-12 py-4 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-gray-100 placeholder-gray-500 text-lg"
                    placeholder="Şifreniz"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-blue-400 hover:text-blue-300 text-base font-medium"
                  >
                    Şifremi Unuttum
                  </button>
                </div>
              )}

              {error && (
                <div className="text-red-400 text-lg bg-gray-800 border border-red-400/30 p-4 rounded-xl">
                  {error}
                </div>
              )}
              {success && (
                <div className="text-green-400 text-lg bg-gray-800 border border-green-400/30 p-4 rounded-xl">
                  {success}
                </div>
              )}

              <motion.button
                type="submit"
                className="w-full py-4 px-6 bg-gray-800 text-gray-100 rounded-2xl hover:bg-gray-700 transition-all font-bold text-xl shadow-lg"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-gray-100 border-t-transparent rounded-full animate-spin mr-3"></div>
                    <span>İşleniyor...</span>
                  </div>
                ) : (
                  <span>{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</span>
                )}
              </motion.button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-base">
                  <span className="px-4 bg-gray-900 text-gray-400">veya</span>
                </div>
              </div>

              <motion.button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white text-gray-900 rounded-2xl hover:bg-gray-50 transition-all font-bold text-lg shadow-lg border border-gray-200"
                disabled={isGoogleLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isGoogleLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mr-3"></div>
                    <span>Giriş yapılıyor...</span>
                  </div>
                ) : (
                  <>
                    <Chrome className="w-6 h-6" />
                    <span>Google ile {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</span>
                  </>
                )}
              </motion.button>

              <div className="text-center mt-8">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-gray-400 hover:text-gray-200 font-medium text-lg"
                >
                  {isLogin
                    ? 'Hesabınız yok mu? Kayıt olun'
                    : 'Zaten hesabınız var mı? Giriş yapın'}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};