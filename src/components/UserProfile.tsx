<<<<<<< HEAD
import React from 'react';
import { User, Mail, Edit, LogOut, X } from 'lucide-react';
import { authService } from '../services/authService';

interface UserProfileProps {
  onClose: () => void;
}

export function UserProfile({ onClose }: UserProfileProps) {
  const user = authService.getCurrentUser();
=======
import React, { useState } from 'react';
import { User, LogOut, Settings } from 'lucide-react';
import { authService } from '../services/authService';

interface UserProfileProps {
  user: any;
}

export function UserProfile({ user }: UserProfileProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
>>>>>>> d1fe0b1 (İlk yükleme)

  const handleLogout = async () => {
    try {
      await authService.logout();
<<<<<<< HEAD
      onClose();
    } catch (err) {
      console.error('Error occurred while logging out:', err);
=======
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
>>>>>>> d1fe0b1 (İlk yükleme)
    }
  };

  return (
<<<<<<< HEAD
    <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100 relative">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <X className="w-5 h-5" />
      </button>
      
      <div className="text-center mb-6">
        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-10 h-10 text-purple-600" />
        </div>
        <h3 className="text-2xl font-bold text-purple-800 mb-1">{user?.displayName || 'User'}</h3>
        <p className="text-gray-500">{user?.email}</p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
          <Mail className="w-5 h-5 text-gray-500 mr-3" />
          <span className="text-gray-700">{user?.email}</span>
        </div>
        
        <button className="w-full flex items-center p-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors">
          <Edit className="w-5 h-5 mr-3" />
          <span>Edit Profile</span>
        </button>
      </div>

      <button 
        onClick={handleLogout}
        className="w-full flex items-center justify-center p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
      >
        <LogOut className="w-5 h-5 mr-2" />
        <span>Log Out</span>
      </button>
=======
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
>>>>>>> d1fe0b1 (İlk yükleme)
    </div>
  );
}