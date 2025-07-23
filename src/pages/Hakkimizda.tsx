import React from 'react';

const Hakkimizda: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e0e7ef] to-[#f1f5f9] flex items-center justify-center py-10">
      <div className="w-full max-w-2xl bg-white/90 rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-2 text-blue-700 tracking-wide drop-shadow">Hakkımızda</h1>
        <p className="mb-8 text-gray-600 text-center">ELC WordPlay, Koç Üniversitesi öğrencilerinin İngilizce kelime bilgisini geliştirmek için hazırlanmış bağımsız bir platformdur.</p>
        <div className="mb-8">
          <h2 className="text-lg font-bold text-red-700 mb-2">Amacımız</h2>
          <p className="text-gray-700">Öğrencilerin kelime öğrenme sürecini eğlenceli, etkileşimli ve sürdürülebilir hale getirmek. Güncel ELC kelime listeleriyle tam uyumlu oyunlar ve alıştırmalar sunuyoruz.</p>
        </div>
        <div className="mb-8">
          <h2 className="text-lg font-bold text-green-700 mb-2">Vizyonumuz</h2>
          <p className="text-gray-700">Dijital eğitimde yenilikçi çözümlerle, öğrencilerin dil öğrenimini desteklemek ve daha geniş kitlelere ulaşmak.</p>
        </div>
        <div className="mb-8">
          <h2 className="text-lg font-bold text-yellow-700 mb-2">Ekibimiz</h2>
          <p className="text-gray-700">Uygulama, Koç Üniversitesi öğrencisi Miraç Birlik tarafından geliştirilmiştir. Geliştirme sürecinde birçok öğrenci ve eğitmenin geri bildirimleri alınmıştır.</p>
        </div>
        <div>
          <h2 className="text-lg font-bold text-purple-700 mb-2">Bağımsızlık</h2>
          <p className="text-gray-700">Bu platform Koç Üniversitesi'nin resmi sitesi değildir ve üniversiteyle doğrudan bir bağı yoktur. Tamamen bağımsız bir girişimdir.</p>
        </div>
      </div>
    </div>
  );
};

export default Hakkimizda; 