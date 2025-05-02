import React from 'react';
import { User, Mail, Edit, LogOut } from 'lucide-react';
import { authService } from '../services/authService';

interface UserProfileProps {
  onClose: () => void;
}

export function UserProfile({ onClose }: UserProfileProps) {
  const user = authService.getCurrentUser();

  const handleLogout = async () => {
    try {
      await authService.logout();
      onClose();
    } catch (err) {
      console.error('Çıkış yapılırken hata oluştu:', err);
    }
  };

  return (
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
        <h3 className="text-2xl font-bold text-purple-800 mb-1">{user?.displayName || 'Kullanıcı'}</h3>
        <p className="text-gray-500">{user?.email}</p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
          <Mail className="w-5 h-5 text-gray-500 mr-3" />
          <span className="text-gray-700">{user?.email}</span>
        </div>
        
        <button className="w-full flex items-center p-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors">
          <Edit className="w-5 h-5 mr-3" />
          <span>Profil Düzenle</span>
        </button>
      </div>

      <button 
        onClick={handleLogout}
        className="w-full flex items-center justify-center p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
      >
        <LogOut className="w-5 h-5 mr-2" />
        <span>Çıkış Yap</span>
      </button>
    </div>
  );
}