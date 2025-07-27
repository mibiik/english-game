import React from 'react';

const Destek: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e0e7ef] to-[#f1f5f9] flex items-center justify-center py-10" style={{ paddingTop: 'calc(64px + 2.5rem)', marginTop: '-128px' }}>
      <div className="w-full max-w-2xl bg-white/90 rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-2 text-green-700 tracking-wide drop-shadow">Destek</h1>
        <p className="mb-8 text-gray-600 text-center">Sorun mu yaşıyorsunuz? Yardıma mı ihtiyacınız var? Aşağıdaki bilgilerden faydalanabilir veya bize ulaşabilirsiniz.</p>
        <div className="mb-8">
          <h2 className="text-lg font-bold text-red-700 mb-2">Nasıl Destek Alabilirim?</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Uygulama içi sorunlar için <a href="/iletisim" className="text-red-600 hover:underline font-semibold">iletişim formunu</a> doldurabilirsiniz.</li>
            <li>Teknik destek ve hata bildirimi için e-posta gönderebilirsiniz: <a href="mailto:destek@elcwordplay.com" className="text-red-600 hover:underline font-semibold">destek@elcwordplay.com</a></li>
          </ul>
        </div>
        <div className="mb-8">
          <h2 className="text-lg font-bold text-green-700 mb-2">Uygulamaya Nasıl Destek Olabilirim?</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Shopier üzerinden katkıda bulunabilirsiniz: <a href="https://www.shopier.com/37829492" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline font-semibold">Destek Ol</a></li>
            <li>Uygulamayı arkadaşlarınıza önererek daha fazla kişiye ulaşmamıza yardımcı olabilirsiniz.</li>
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-bold text-blue-700 mb-2">Sık Karşılaşılan Destek Konuları</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Hesabınıza giriş yapamıyorsanız, şifrenizi sıfırlamayı deneyin veya bize ulaşın.</li>
            <li>Oyun modlarında hata alıyorsanız, sayfayı yenileyin veya farklı bir tarayıcı deneyin.</li>
            <li>Destek talepleriniz genellikle 24 saat içinde yanıtlanır.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Destek; 