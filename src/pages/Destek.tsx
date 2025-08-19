import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, LifeBuoy, MessageCircle, Mail, Phone, Clock, BookOpen, Heart, Star, Users, Settings, HelpCircle, Gamepad2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Destek: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('support');

  const supportTopics = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Hesap Sorunları",
      description: "Giriş yapamama, şifre sıfırlama, profil güncelleme",
      solutions: [
        "Tarayıcı önbelleğini temizleyin",
        "Şifrenizi sıfırlayın",
        "Farklı tarayıcı deneyin"
      ]
    },
    {
      icon: <Gamepad2 className="w-6 h-6" />,
      title: "Oyun Sorunları",
      description: "Oyun yüklenmeme, hata mesajları, performans",
      solutions: [
        "Sayfayı yenileyin",
        "İnternet bağlantınızı kontrol edin",
        "Tarayıcı güncelleyin"
      ]
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Teknik Sorunlar",
      description: "Yavaş yükleme, ses sorunları, görüntü problemleri",
      solutions: [
        "Tarayıcı önbelleğini temizleyin",
        "JavaScript'i etkinleştirin",
        "Güncel tarayıcı kullanın"
      ]
    }
  ];

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "E-posta",
      value: "destek@wordplay.com",
      description: "24 saat içinde yanıt",
      action: "Mail Gönder",
      href: "mailto:destek@wordplay.com"
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "İletişim Formu",
      value: "Detaylı destek talebi",
      description: "Hızlı yanıt garantisi",
      action: "Form Doldur",
      href: "/iletisim"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Telefon",
      value: "+90 (212) 338 10 00",
      description: "Acil durumlar için",
      action: "Ara",
      href: "tel:+902123381000"
    }
  ];

  const faqTopics = [
    {
      question: "Uygulamaya nasıl giriş yapabilirim?",
      answer: "Ana sayfada sağ üst köşedeki 'Giriş Yap' butonuna tıklayarak e-posta ve şifrenizle giriş yapabilirsiniz. Hesabınız yoksa 'Kayıt Ol' seçeneğini kullanabilirsiniz."
    },
    {
      question: "Şifremi unuttum, ne yapmalıyım?",
      answer: "Giriş sayfasında 'Şifremi Unuttum' linkine tıklayarak e-posta adresinize şifre sıfırlama bağlantısı gönderebiliriz."
    },
    {
      question: "Oyun modlarında hata alıyorum, nasıl çözebilirim?",
      answer: "Önce sayfayı yenilemeyi deneyin. Sorun devam ederse, tarayıcı önbelleğini temizleyin veya farklı bir tarayıcı kullanın."
    },
    {
      question: "İlerleme durumumu nasıl takip edebilirim?",
      answer: "Profil sayfanızda 'Analytics Bölümü' altında tüm öğrenme istatistiklerinizi, tamamlanan oyunları ve performansınızı görebilirsiniz."
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
              <h1 className="text-2xl font-bold text-white">Destek</h1>
              <p className="text-neutral-400 text-sm">Size nasıl yardımcı olabiliriz?</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-6">
            <LifeBuoy className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Teknik Destek ve Yardım
          </h2>
          <p className="text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            WordPlay kullanımında herhangi bir sorun yaşıyorsanız, 
            size yardımcı olmak için buradayız. Hızlı ve etkili çözümler sunuyoruz.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-neutral-800/50 backdrop-blur-sm rounded-2xl p-2 border border-white/10">
            <button
              onClick={() => setActiveTab('support')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === 'support'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              Destek Konuları
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === 'contact'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              İletişim Yöntemleri
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === 'faq'
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              Sık Sorulan Sorular
            </button>
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'support' && (
            <motion.div
              key="support"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h3 className="text-2xl font-bold text-white mb-4">Yaygın Destek Konuları</h3>
                <p className="text-neutral-400">En sık karşılaşılan sorunlar ve çözümleri</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {supportTopics.map((topic, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    className="bg-gradient-to-r from-neutral-800/50 to-neutral-700/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      {topic.icon}
                    </div>
                    <h4 className="text-xl font-semibold text-white mb-2 text-center">{topic.title}</h4>
                    <p className="text-neutral-400 text-sm text-center mb-4">{topic.description}</p>
                    <ul className="space-y-2">
                      {topic.solutions.map((solution, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-neutral-300">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          {solution}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h3 className="text-2xl font-bold text-white mb-4">Bizimle İletişime Geçin</h3>
                <p className="text-neutral-400">Size en uygun yöntemi seçin</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {contactMethods.map((method, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    className="bg-gradient-to-r from-neutral-800/50 to-neutral-700/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 text-center"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      {method.icon}
                    </div>
                    <h4 className="text-xl font-semibold text-white mb-2">{method.title}</h4>
                    <p className="text-neutral-300 mb-2">{method.value}</p>
                    <p className="text-neutral-400 text-sm mb-4">{method.description}</p>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={method.href}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                    >
                      {method.action}
                    </motion.a>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'faq' && (
            <motion.div
              key="faq"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h3 className="text-2xl font-bold text-white mb-4">Sık Sorulan Sorular</h3>
                <p className="text-neutral-400">Hızlı cevaplar için SSS sayfamızı ziyaret edin</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {faqTopics.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    className="bg-gradient-to-r from-neutral-800/50 to-neutral-700/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    <h4 className="text-lg font-semibold text-white mb-3">{faq.question}</h4>
                    <p className="text-neutral-300 text-sm leading-relaxed">{faq.answer}</p>
                  </motion.div>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/sss')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <HelpCircle className="w-4 h-4" />
                  Tüm SSS'yi Görüntüle
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Response Time Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 backdrop-blur-sm rounded-2xl p-8 border border-green-500/20">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-semibold text-white">Hızlı Yanıt Garantisi</h3>
            </div>
            <p className="text-neutral-300 mb-6">
              Tüm destek taleplerinize 24 saat içinde yanıt veriyoruz. 
              Acil durumlar için telefon ile arayabilirsiniz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/iletisim')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <MessageCircle className="w-4 h-4" />
                Destek Talebi Gönder
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Destek; 