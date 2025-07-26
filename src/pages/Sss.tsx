import React from 'react';

const Sss: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e0e7ef] to-[#f1f5f9] flex items-center justify-center py-10">
      <div className="w-full max-w-2xl bg-white/90 rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-2 text-purple-700 tracking-wide drop-shadow">Sıkça Sorulan Sorular</h1>
        <div className="mb-8">
          <h2 className="text-lg font-bold text-red-700 mb-2">Uygulama ücretsiz mi?</h2>
          <p className="text-gray-700">Evet, uygulamanın tüm temel özellikleri tamamen ücretsizdir. Destek olmak isterseniz Shopier üzerinden katkıda bulunabilirsiniz.</p>
        </div>
        <div className="mb-8">
          <h2 className="text-lg font-bold text-green-700 mb-2">Hesap oluşturmak zorunda mıyım?</h2>
          <p className="text-gray-700">Hayır, birçok oyun modunu ve özelliği üye olmadan da kullanabilirsiniz. Ancak ilerlemenizi kaydetmek için hesap oluşturmanız önerilir.</p>
        </div>
        <div className="mb-8">
          <h2 className="text-lg font-bold text-blue-700 mb-2">Verilerim güvende mi?</h2>
          <p className="text-gray-700">Kullanıcı verileriniz gizli tutulur ve üçüncü şahıslarla paylaşılmaz. Güvenliğiniz önceliğimizdir.</p>
        </div>
        <div className="mb-8">
          <h2 className="text-lg font-bold text-yellow-700 mb-2">Hangi oyun modları var?</h2>
          <p className="text-gray-700">Çoktan seçmeli, eşleştirme, boşluk doldurma, kelime kartları, konuşma ve daha birçok oyun modu bulunmaktadır.</p>
        </div>
        <div>
          <h2 className="text-lg font-bold text-purple-700 mb-2">Destek almak için ne yapmalıyım?</h2>
          <p className="text-gray-700">Sorun yaşarsanız <a href="/iletisim" className="text-red-600 hover:underline font-semibold">iletişim</a> sayfasından bize ulaşabilirsiniz.</p>
        </div>
      </div>
    </div>
  );
};

export default Sss; 