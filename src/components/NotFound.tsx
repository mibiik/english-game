import React from 'react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#111] to-black flex items-center justify-center">
      <div className="text-center">
        <div className="text-9xl font-bold text-red-500 mb-4">404</div>
        <h1 className="text-3xl font-semibold text-white mb-4">Sayfa Bulunamadı</h1>
        <p className="text-gray-400 mb-8 text-lg">
          Aradığınız sayfa geçici olarak kullanılamıyor veya mevcut değil.
        </p>
      </div>
    </div>
  );
};

export default NotFound; 