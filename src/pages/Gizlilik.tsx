import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Lock, Eye, Database, Users, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Gizlilik: React.FC = () => {
  const navigate = useNavigate();

  const privacySections = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Veri Güvenliği",
      content: "Kullanıcı verileriniz end-to-end şifreleme ile korunur. Tüm veriler güvenli sunucularda saklanır ve üçüncü taraflarla paylaşılmaz."
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Veri Toplama",
      content: "Sadece uygulama performansını iyileştirmek için gerekli minimum veri toplanır. Kişisel bilgileriniz gizli tutulur."
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Veri Saklama",
      content: "Verileriniz Türkiye'deki güvenli veri merkezlerinde saklanır. GDPR ve KVKK uyumlu veri işleme politikaları uygulanır."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Üçüncü Taraf Paylaşımı",
      content: "Kullanıcı verileriniz hiçbir üçüncü taraf şirket veya hizmet ile paylaşılmaz. Tüm veri işlemleri şirket içinde yapılır."
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Veri Hakları",
      content: "Verilerinizi görüntüleme, düzenleme ve silme hakkına sahipsiniz. Bu haklarınızı kullanmak için destek ekibimizle iletişime geçebilirsiniz."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      {/* Header */}
      <div className="relative bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Gizliliğiniz Bizim Sorumluluğumuz
          </h2>
          <p className="text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            WordPlay olarak, kullanıcı verilerinizin güvenliği ve gizliliği bizim için çok önemlidir. 
            Bu politika, verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu açıklar.
          </p>
        </motion.div>

        {/* Privacy Sections */}
        <div className="space-y-8">
          {privacySections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gradient-to-r from-neutral-800/50 to-neutral-700/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
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
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20">
            <h3 className="text-xl font-semibold text-white mb-4">
              Gizlilik Hakkında Sorularınız mı Var?
            </h3>
            <p className="text-neutral-300 mb-6">
              Gizlilik politikamız hakkında herhangi bir sorunuz varsa, 
              destek ekibimizle iletişime geçmekten çekinmeyin.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/iletisim')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <FileText className="w-4 h-4" />
              İletişime Geç
            </motion.button>
          </div>
        </motion.div>

        {/* Last Updated */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center text-neutral-500 text-sm"
        >
          <p>Son güncelleme: 15 Ocak 2024</p>
          <p className="mt-1">Bu politika gerektiğinde güncellenebilir</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Gizlilik;
