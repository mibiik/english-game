import React, { useState, useEffect } from 'react';
import { ParaphraseChallenge } from '../components/GameModes/ParaphraseChallenge';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ParaphrasePage: React.FC = () => {
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    // Modal'ı otomatik olarak göster
    setShowModal(true);
  }, []);

  return (
    <div className="space-y-6">
      {/* Geri butonu */}
      <Link to="/" className="inline-flex items-center text-purple-700 hover:text-purple-900 transition-colors mb-4">
        <ArrowLeft className="w-5 h-5 mr-1" />
        <span>Ana Sayfaya Dön</span>
      </Link>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <ParaphraseChallenge />
      </div>

      {/* Hoşgeldin Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-purple-800 mb-4">Hoşgeldin Koç!</h2>
            <p className="text-gray-700 mb-4">
              Paraphrase Challenge oyununa hoş geldin! Bu oyunda, verilen akademik cümleleri farklı şekillerde yeniden ifade etmeyi öğreneceksin.
            </p>
            <p className="text-gray-700 mb-4">
              Üç farklı alıntı yapma tekniğini kullanarak cümleleri yeniden yazman gerekiyor: Parantez içi alıntı, fiil ile anlatımsal alıntı ve "According to" ile anlatımsal alıntı.
            </p>
            <p className="text-gray-700 mb-4">
              Kelimelere tıklayarak anlamlarını öğrenebilir, örnek cümleleri inceleyebilirsin. Hazır olduğunda "Check" butonuna tıklayarak cevabını kontrol edebilirsin.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Başla
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParaphrasePage;