import React, { useState } from 'react';
import { ArrowLeft, LifeBuoy, MessageCircle, Mail, Phone, Clock, BookOpen, Heart, Star, Users, Settings, HelpCircle, Gamepad2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Destek: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('support');

  const supportTopics = [
    {
      icon: <Gamepad2 className="w-5 h-5" />,
      title: "Oyun Sorunları",
      description: "Oyunlarda yaşanan teknik sorunlar ve çözümleri",
      solutions: [
        "Oyun yüklenmiyor mu? Tarayıcınızı yenileyin",
        "Ses çalışmıyor mu? Tarayıcı ses ayarlarını kontrol edin",
        "Oyun donuyor mu? Sayfayı yeniden yükleyin"
      ]
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Hesap Sorunları",
      description: "Giriş, kayıt ve hesap yönetimi ile ilgili sorunlar",
      solutions: [
        "Şifremi unuttum? E-posta ile sıfırlama yapın",
        "Hesap oluşturamıyorum? E-posta adresinizi kontrol edin",
        "Giriş yapamıyorum? Tarayıcı cache'ini temizleyin"
      ]
    },
    {
      icon: <Settings className="w-5 h-5" />,
      title: "Teknik Sorunlar",
      description: "Platform performansı ve teknik problemler",
      solutions: [
        "Sayfa yavaş mı? İnternet bağlantınızı kontrol edin",
        "Hata mesajı alıyorum? Tarayıcınızı güncelleyin",
        "Mobilde çalışmıyor mu? PWA olarak yükleyin"
      ]
    }
  ];

  const contactMethods = [
    {
      icon: <Mail className="w-5 h-5" />,
      title: "E-posta",
      description: "Detaylı sorunlarınız için",
      value: "destek@wordplay.com",
      action: "E-posta Gönder",
      link: "mailto:destek@wordplay.com"
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Telefon",
      description: "Acil durumlar için",
      value: "+90 (212) 338 10 00",
      action: "Ara",
      link: "tel:+902123381000"
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      title: "Canlı Destek",
      description: "Anlık yardım için",
      value: "7/24 aktif",
      action: "Başlat",
      link: "/iletisim"
    }
  ];

  const faqTopics = [
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "Nasıl Kullanılır?",
      description: "Platform kullanım rehberi",
      link: "/sss"
    },
    {
      icon: <Heart className="w-5 h-5" />,
      title: "Öneriler",
      description: "Geliştirme önerileriniz",
      link: "/iletisim"
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: "Geri Bildirim",
      description: "Deneyiminizi paylaşın",
      link: "/iletisim"
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
              <h1 className="text-2xl font-bold text-white">Destek</h1>
              <p className="text-neutral-400 text-sm">Size nasıl yardımcı olabiliriz?</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 rounded-2xl mb-6">
            <LifeBuoy className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Teknik Destek Merkezi
          </h2>
          <p className="text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            WordPlay'de yaşadığınız herhangi bir sorun için buradayız. 
            Hızlı çözümler ve profesyonel destek hizmeti sunuyoruz.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-12 justify-center">
          <button
            onClick={() => setActiveTab('support')}
            className={`px-6 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'support'
                ? 'bg-orange-600 text-white'
                : 'bg-neutral-800/50 text-neutral-300 hover:bg-neutral-700/50 border border-white/10'
            }`}
          >
            Destek Konuları
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-6 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'contact'
                ? 'bg-orange-600 text-white'
                : 'bg-neutral-800/50 text-neutral-300 hover:bg-neutral-700/50 border border-white/10'
            }`}
          >
            İletişim Yöntemleri
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-6 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'faq'
                ? 'bg-orange-600 text-white'
                : 'bg-neutral-800/50 text-neutral-300 hover:bg-neutral-700/50 border border-white/10'
            }`}
          >
            SSS & Kaynaklar
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {/* Support Topics Tab */}
          {activeTab === 'support' && (
            <div className="space-y-6">
              {supportTopics.map((topic, index) => (
                <div
                  key={index}
                  className="bg-neutral-800/50 rounded-2xl p-6 border border-white/10"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
                      {topic.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {topic.title}
                      </h3>
                      <p className="text-neutral-300">{topic.description}</p>
                    </div>
                  </div>
                  
                  <div className="bg-neutral-800/30 rounded-xl p-4">
                    <h4 className="text-white font-medium mb-3">Hızlı Çözümler:</h4>
                    <ul className="space-y-2">
                      {topic.solutions.map((solution, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-neutral-300">
                          <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm">{solution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Contact Methods Tab */}
          {activeTab === 'contact' && (
            <div className="grid md:grid-cols-3 gap-6">
              {contactMethods.map((method, index) => (
                <div
                  key={index}
                  className="bg-neutral-800/50 rounded-2xl p-6 border border-white/10 text-center"
                >
                  <div className="w-16 h-16 bg-orange-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    {method.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {method.title}
                  </h3>
                  <p className="text-neutral-300 text-sm mb-4">
                    {method.description}
                  </p>
                  <div className="text-white font-medium mb-4">
                    {method.value}
                  </div>
                  <a
                    href={method.link}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    {method.action}
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="grid md:grid-cols-3 gap-6">
              {faqTopics.map((topic, index) => (
                <div
                  key={index}
                  className="bg-neutral-800/50 rounded-2xl p-6 border border-white/10 text-center"
                >
                  <div className="w-16 h-16 bg-orange-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    {topic.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {topic.title}
                  </h3>
                  <p className="text-neutral-300 text-sm mb-4">
                    {topic.description}
                  </p>
                  <button
                    onClick={() => navigate(topic.link)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Görüntüle
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Response Time Info */}
        <div className="mt-16 text-center">
          <div className="bg-neutral-800/50 rounded-2xl p-8 border border-white/10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-orange-400" />
              <h3 className="text-xl font-semibold text-white">Hızlı Yanıt Garantisi</h3>
            </div>
            <p className="text-neutral-300 mb-6">
              Destek taleplerinize 24 saat içinde yanıt veriyoruz. 
              Acil durumlar için telefon ile arayabilirsiniz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/iletisim')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                İletişime Geç
              </button>
              <button
                onClick={() => navigate('/sss')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                SSS'yi Görüntüle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Destek; 