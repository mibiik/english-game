import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, RefreshCw, Smile, Frown, AlertTriangle } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const [showRealButton, setShowRealButton] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setShowRealButton(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleGoHome = () => {
    navigate('/home');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-red-100 to-red-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center border-2 border-red-200">
        {/* 404 Icon */}
        <div className="mb-6">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-6xl font-black text-red-600 mb-2">404</h1>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Sayfa Bulunamadı!</h2>
          <p className="text-gray-600 mb-6">
            Aradığınız sayfa artık burada değil... 
            <br />
            <span className="text-sm">(Belki hiç burada olmamıştı 😅)</span>
          </p>
        </div>

        {/* Teknik Bilgiler */}
        <div className="mb-6">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-800">Teknik Sorun</span>
            </div>
            <p className="text-sm text-gray-700">
              Sunucu bakımı nedeniyle geçici olarak erişim sağlanamıyor.
              <br />
              {countdown > 0 ? (
                <span className="font-bold">{countdown} saniye sonra tekrar deneyin...</span>
              ) : (
                <span className="font-bold text-green-600">Şimdi tekrar deneyin!</span>
              )}
            </p>
          </div>
        </div>

        {/* Butonlar */}
        <div className="space-y-3">
          {showRealButton ? (
            <button
              onClick={handleGoHome}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Home className="w-5 h-5" />
              Siteye Git
            </button>
          ) : (
            <button
              disabled
              className="w-full bg-gray-300 text-gray-500 font-bold py-3 px-6 rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Frown className="w-5 h-5" />
              {countdown} saniye bekleyin...
            </button>
          )}
          
          <button
            onClick={handleRefresh}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            <RefreshCw className="w-5 h-5" />
            Sayfayı Yenile
          </button>
        </div>

        {/* Teknik Detaylar */}
        <div className="mt-6 text-xs text-gray-500">
          <p>Hata Kodu: 404 - Sayfa Bulunamadı</p>
          <p>Sunucu Yanıt Süresi: {Math.floor(Math.random() * 500) + 100}ms</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 