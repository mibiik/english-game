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

        {/* Şaka Mesajları */}
        <div className="mb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Smile className="w-5 h-5 text-yellow-600" />
              <span className="font-semibold text-yellow-800">Şaka Yapıyoruz! 😄</span>
            </div>
            <p className="text-sm text-yellow-700">
              Endişelenmeyin, sadece bir şaka! 
              <br />
              {countdown > 0 ? (
                <span className="font-bold">{countdown} saniye sonra gerçek siteye gidebilirsiniz...</span>
              ) : (
                <span className="font-bold text-green-600">Artık gidebilirsiniz! 🎉</span>
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
              Gerçek Siteye Git
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

        {/* Ekstra Şaka */}
        <div className="mt-6 text-xs text-gray-500">
          <p>Bu sayfa gerçekten var mıydı? 🤔</p>
          <p>Belki de sadece hayal gücümüzde vardı... ✨</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 