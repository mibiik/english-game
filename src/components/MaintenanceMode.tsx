import React from 'react';
import { AlertTriangle, Clock, Wrench } from 'lucide-react';

const MaintenanceMode: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <Wrench className="w-10 h-10 text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Bakım Modu
          </h1>
          <p className="text-gray-600 mb-6">
            Sitemiz şu anda bakım çalışmaları nedeniyle geçici olarak kapalıdır.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Tahmini süre: 1-2 saat</span>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm text-blue-800 font-medium mb-1">
                  Neler yapıyoruz?
                </p>
                <p className="text-xs text-blue-700">
                  • Performans iyileştirmeleri<br/>
                  • Yeni özellikler ekliyoruz<br/>
                  • Güvenlik güncellemeleri
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <p className="text-xs text-gray-500 mb-4">
            Daha iyi bir deneyim için çalışıyoruz. Kısa süre sonra geri döneceğiz!
          </p>
          
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Sayfayı Yenile
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            © 2024 WordPlay. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceMode; 