import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, Users, Shield, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const KullanimSartlari: React.FC = () => {
  const navigate = useNavigate();

  const termsSections = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Hesap Kullanımı",
      content: "WordPlay hesabınızı kişisel kullanım için oluşturabilirsiniz. Hesap bilgilerinizi güvenli tutmak sizin sorumluluğunuzdadır. Başkalarıyla hesap bilgilerinizi paylaşmayın."
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "İçerik Kullanımı",
      content: "Platformdaki tüm eğitim içerikleri telif hakkı ile korunmaktadır. İçerikleri sadece kişisel öğrenme amacıyla kullanabilirsiniz. Ticari kullanım yasaktır."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Güvenlik Kuralları",
      content: "Platformu kötüye kullanmak, spam göndermek veya diğer kullanıcıları rahatsız etmek yasaktır. Güvenlik ihlali tespit edildiğinde hesabınız kapatılabilir."
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Kullanıcı Sorumlulukları",
      content: "Platformu kullanırken yasalara uygun davranmak, diğer kullanıcılara saygı göstermek ve topluluk kurallarına uymak zorunludur."
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "Kısıtlamalar",
      content: "Platformu hack etmeye çalışmak, otomatik botlar kullanmak veya sistem güvenliğini tehdit eden eylemlerde bulunmak kesinlikle yasaktır."
    }
  ];

  const userRights = [
    "7/24 platform erişimi",
    "Kişiselleştirilmiş öğrenme deneyimi",
    "Teknik destek hizmeti",
    "Güvenli veri saklama",
    "Gizlilik koruması"
  ];

  const userObligations = [
    "Hesap bilgilerini güvenli tutmak",
    "Platform kurallarına uymak",
    "Telif haklarına saygı göstermek",
    "Diğer kullanıcılara saygılı davranmak",
    "Yasalara uygun kullanım"
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
              <h1 className="text-2xl font-bold text-white">Kullanım Şartları</h1>
              <p className="text-neutral-400 text-sm">Platform kullanım koşulları ve kuralları</p>
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
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-6">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Kullanım Şartları ve Koşulları
          </h2>
          <p className="text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            WordPlay platformunu kullanarak aşağıdaki şartları ve koşulları kabul etmiş olursunuz. 
            Bu belge, platform kullanımınızı düzenleyen yasal bir anlaşmadır.
          </p>
        </motion.div>

        {/* Terms Sections */}
        <div className="space-y-8 mb-16">
          {termsSections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gradient-to-r from-neutral-800/50 to-neutral-700/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
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

        {/* User Rights and Obligations */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* User Rights */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20"
          >
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-blue-400" />
              Kullanıcı Hakları
            </h3>
            <ul className="space-y-3">
              {userRights.map((right, index) => (
                <li key={index} className="flex items-center gap-3 text-neutral-300">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  {right}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* User Obligations */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/20"
          >
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-orange-400" />
              Kullanıcı Sorumlulukları
            </h3>
            <ul className="space-y-3">
              {userObligations.map((obligation, index) => (
                <li key={index} className="flex items-center gap-3 text-neutral-300">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  {obligation}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Agreement Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-neutral-800/50 to-neutral-700/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4">
              Şartları Kabul Ediyor musunuz?
            </h3>
            <p className="text-neutral-300 mb-6">
              Platformu kullanmaya devam ederek bu kullanım şartlarını kabul etmiş olursunuz. 
              Herhangi bir sorunuz varsa destek ekibimizle iletişime geçebilirsiniz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/destek')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FileText className="w-4 h-4" />
                Destek Al
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/gizlilik')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Shield className="w-4 h-4" />
                Gizlilik Politikası
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Last Updated */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mt-12 text-center text-neutral-500 text-sm"
        >
          <p>Son güncelleme: 15 Ocak 2024</p>
          <p className="mt-1">Bu şartlar gerektiğinde güncellenebilir</p>
        </motion.div>
      </div>
    </div>
  );
};

export default KullanimSartlari;
