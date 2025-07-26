import React from 'react';

const Iletisim: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e0e7ef] to-[#f1f5f9] flex items-center justify-center py-10">
      <div className="w-full max-w-xl bg-white/90 rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-2 text-red-700 tracking-wide drop-shadow">İletişim</h1>
        <p className="mb-8 text-gray-600 text-center">Her türlü soru, öneri veya destek talebiniz için bize ulaşabilirsiniz.</p>
        <form className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1 font-semibold">İsim</label>
            <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 bg-gray-50" placeholder="Adınız" />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-semibold">E-posta</label>
            <input type="email" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 bg-gray-50" placeholder="E-posta adresiniz" />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-semibold">Mesaj</label>
            <textarea className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 bg-gray-50" rows={4} placeholder="Mesajınız" />
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-bold py-2.5 rounded-lg shadow-md transition-all text-lg">Gönder</button>
        </form>
        <div className="mt-10 text-center text-gray-500 text-sm space-y-2">
          <div>E-posta: <a href="mailto:destek@elcwordplay.com" className="text-red-600 hover:underline font-semibold">destek@elcwordplay.com</a></div>
          <div>Instagram: <a href="https://instagram.com/elcwordplay" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline font-semibold">@elcwordplay</a></div>
        </div>
      </div>
    </div>
  );
};

export default Iletisim; 