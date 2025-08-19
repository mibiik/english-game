import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Lock, Eye, Database, Users, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Gizlilik: React.FC = () => {
  const navigate = useNavigate();

  const privacySections = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Veri Güvenliği",
      content: "Kullanıcı verileriniz end-to-end şifreleme ile korunur. Tüm veriler güvenli sunucularda saklanır ve üçüncü taraflarla paylaşılmaz."
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: "Veri Toplama",
      content: "Sadece uygulama performansını iyileştirmek için gerekli minimum veri toplanır. Kişisel bilgileriniz gizli tutulur."
    },
    {
      icon: <Database className="w-5 h-5" />,
      title: "Veri Saklama",
      content: "Verileriniz Türkiye'deki güvenli veri merkezlerinde saklanır. GDPR ve KVKK uyumlu veri işleme politikaları uygulanır."
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Üçüncü Taraf Paylaşımı",
      content: "Kullanıcı verileriniz hiçbir üçüncü taraf şirket veya hizmet ile paylaşılmaz. Tüm veri işlemleri şirket içinde yapılır."
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Veri Hakları",
      content: "Verilerinizi görüntüleme, düzenleme ve silme hakkına sahipsiniz. Bu haklarınızı kullanmak için destek ekibimizle iletişime geçebilirsiniz."
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Header */}
      <div className="bg-black/20 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Gizlilik Politikası</h1>
              <p className="text-neutral-400 text-sm">Veri güvenliğiniz bizim önceliğimiz</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Introduction */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Gizliliğiniz Bizim Sorumluluğumuz
          </h2>
          <p className="text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            WordPlay olarak, kullanıcı verilerinizin güvenliği ve gizliliği bizim için çok önemlidir. 
            Bu politika, verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu açıklar.
          </p>
        </div>

        {/* Privacy Sections */}
        <div className="space-y-6">
          {privacySections.map((section, index) => (
            <div
              key={index}
              className="bg-neutral-800/50 rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    {section.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {section.title}
                  </h3>
                  <p className="text-neutral-300 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <div className="bg-neutral-800/50 rounded-2xl p-8 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4">
              Gizlilik Hakkında Sorularınız mı Var?
            </h3>
            <p className="text-neutral-300 mb-6">
              Gizlilik politikamız hakkında herhangi bir sorunuz varsa, 
              destek ekibimizle iletişime geçmekten çekinmeyin.
            </p>
            <button
              onClick={() => navigate('/iletisim')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              <FileText className="w-4 h-4" />
              İletişime Geç
            </button>
          </div>
        </div>

        {/* Last Updated */}
        <div className="mt-12 text-center text-neutral-500 text-sm">
          <p>Son güncelleme: 15 Ocak 2024</p>
          <p className="mt-1">Bu politika gerektiğinde güncellenebilir</p>
        </div>
      </div>
    </div>
  );
};

export default Gizlilik;
