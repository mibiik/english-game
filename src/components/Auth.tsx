import React, { useState, useEffect } from 'react';
import { User, ArrowRight, Mail, Lock, LogIn, UserPlus, X, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { authService } from '../services/authService';
import { gameScoreService } from '../services/gameScoreService';

interface AuthProps {
  onClose: () => void;
}

type AuthMode = 'login' | 'register';

export function Auth({ onClose }: AuthProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      if (mode === 'register') {
        // Kayıt işlemi
        await authService.register(email, password, displayName);
        // Oyun skorları için kullanıcı kaydı
        await gameScoreService.registerUser(displayName);
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
            <User className="w-8 h-8 text-purple-600" />
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
    <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100 relative">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <X className="w-5 h-5" />
      </button>
      
      <div className="flex items-center gap-3 mb-6">
        {mode === 'login' ? (
          <LogIn className="w-8 h-8 text-purple-600" />
        ) : (
          <UserPlus className="w-8 h-8 text-purple-600" />
        )}
        <h2 className="text-2xl font-bold text-purple-800">
          {mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adınız</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Adınız"
                required
              />
            </div>
          </div>
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
              placeholder="E-posta adresiniz"
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
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Şifreniz"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <motion.button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? 'Yükleniyor...' : (mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol')}
          </motion.button>
        
        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-center">
            {error}
          </div>
        )}
        
        {success && (
          <div className="p-3 bg-green-50 text-green-600 rounded-lg text-center">
            {success}
          </div>
        )}
      </form>
      
      <div className="mt-6 text-center">
        {mode === 'login' ? (
          <p className="text-gray-600">
            Hesabınız yok mu?{' '}
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError(null);
                setSuccess(null);
              }}
              className="text-purple-600 font-medium hover:underline"
            >
              Kayıt Ol
            </button>
          </p>
        ) : (
          <p className="text-gray-600">
            Zaten hesabınız var mı?{' '}
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
                setSuccess(null);
              }}
              className="text-purple-600 font-medium hover:underline"
            >
              Giriş Yap
            </button>
          </p>
        )}
      </div>
    </div>
  );
}