import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabaseAuthService } from '../services/supabaseAuthService';

interface AuthProps {
  mode: 'login' | 'register';
  onClose: () => void;
  onSuccess: () => void;
}

export const Auth: React.FC<AuthProps> = ({ mode, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'register') {
        await supabaseAuthService.register(email, password, displayName);
      } else {
        await supabaseAuthService.login(email, password);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Field - Only for Register */}
        {mode === 'register' && (
          <div>
            <label className="block text-sm font-medium text-white/80 mb-3">
              Ad Soyad
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white w-5 h-5 filter-none backdrop-blur-none z-10 isolation-auto" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl focus:ring-2 focus:ring-white/20 focus:border-white/20 outline-none transition-all duration-200 text-white placeholder-white/60 focus:bg-white/8"
                placeholder="Adınız Soyadınız"
                required
              />
            </div>
          </div>
        )}

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-3">
            E-posta
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white w-5 h-5 filter-none backdrop-blur-none z-10 isolation-auto" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl focus:ring-2 focus:ring-white/20 focus:border-white/20 outline-none transition-all duration-200 text-white placeholder-white/60 focus:bg-white/8"
              placeholder="ornek@email.com"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-3">
            Şifre
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white w-5 h-5 filter-none backdrop-blur-none z-10 isolation-auto" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-14 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl focus:ring-2 focus:ring-white/20 focus:border-white/20 outline-none transition-all duration-200 text-white placeholder-white/60 focus:bg-white/8"
              placeholder="Şifreniz"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-white/80 transition-colors duration-200"
            >
              {showPassword ? <EyeOff className="w-5 h-5 filter-none backdrop-blur-none" /> : <Eye className="w-5 h-5 filter-none backdrop-blur-none" />}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-2xl text-red-200 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading}
          className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white py-4 rounded-2xl font-medium hover:bg-white/15 hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? 'Yükleniyor...' : (mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol')}
        </motion.button>
      </form>

    </div>
  );
};

export default Auth;