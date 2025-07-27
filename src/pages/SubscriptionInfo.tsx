import React from "react";
import ShopierSubscribeButton from '../components/ShopierSubscribeButton';

const SubscriptionInfo: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white px-4 py-12" style={{ paddingTop: 'calc(64px + 3rem)', marginTop: '-128px' }}>
      <div className="bg-gray-800/80 rounded-2xl shadow-2xl p-8 max-w-lg w-full flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-black mb-4 text-red-400 drop-shadow">Premium Üyelik Gerekli</h1>
        <p className="text-lg text-gray-200 mb-6 text-center">
          Oyunlara ve tüm premium içeriklere erişmek için aylık <span className="font-bold text-red-300">78,99 TL</span> karşılığında abone olmalısın.<br/>
          <span className="text-sm text-gray-400">Abonelik ile tüm oyun modlarına, istatistiklere ve özel içeriklere sınırsız erişim sağlarsın.</span>
        </p>
        <ul className="mb-6 text-left text-gray-300 list-disc pl-6">
          <li>Tüm oyun modlarına erişim</li>
          <li>Gelişmiş istatistikler ve takip</li>
          <li>Yeni eklenen kelime ve oyunlara anında erişim</li>
          <li>Reklamsız ve kesintisiz deneyim</li>
        </ul>
        <ShopierSubscribeButton />
        <p className="mt-6 text-xs text-gray-500 text-center">Abonelik satın aldıktan sonra Shopier ödeme bildiriminiz kontrol edilip hesabınız manuel olarak premiuma yükseltilecektir.<br/>Herhangi bir sorun yaşarsan destek ile iletişime geçebilirsin.</p>
      </div>
    </div>
  );
};

export default SubscriptionInfo; 