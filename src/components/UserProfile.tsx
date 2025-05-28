import React, { useState } from 'react';
import { User, LogOut, Settings } from 'lucide-react';
import { authService } from '../services/authService';

interface UserProfileProps {
  user: any;
}

export function UserProfile({ user }: UserProfileProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full" />
          ) : (
            <User className="w-4 h-4" />
          )}
        </div>
        <span className="font-medium">{user?.displayName || 'Kullanıcı'}</span>
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-purple-100 dark:border-purple-800">
          <div className="px-4 py-2 border-b border-purple-100 dark:border-purple-800">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Giriş yapıldı</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 truncate">{user?.email}</p>
          </div>
          
          <div className="py-1">
            <button
              onClick={() => {
                // TODO: Profil ayarları
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/30"
            >
              <Settings className="w-4 h-4" />
              <span>Ayarlar</span>
            </button>
            
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
            >
              <LogOut className="w-4 h-4" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}