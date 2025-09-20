import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, HelpCircle, BookOpen, Shield, Users, Gamepad2, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  icon: React.ReactNode;
}

const Sss: React.FC = () => {
  const navigate = useNavigate();
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const faqData: FAQItem[] = [
    {
      id: 1,
      question: "WordPlay tamamen ücretsiz mi?",
      answer: "Evet, WordPlay'in tüm temel özellikleri tamamen ücretsizdir. Platformdaki kelime listeleri, oyun modları ve öğrenme araçlarına sınırsız erişim sağlayabilirsiniz. Premium özellikler için Shopier üzerinden katkıda bulunabilirsiniz.",
      category: "genel",
      icon: <BookOpen className="w-4 h-4" />
    },
    {
      id: 2,
      question: "Hesap oluşturmak zorunda mıyım?",
      answer: "Hayır, birçok oyun modunu ve özelliği üye olmadan da kullanabilirsiniz. Ancak ilerlemenizi kaydetmek, istatistiklerinizi görüntülemek ve kişiselleştirilmiş öğrenme deneyimi için hesap oluşturmanız önerilir.",
      category: "hesap",
      icon: <Users className="w-4 h-4" />
    },
    {
      id: 3,
      question: "Verilerim güvende mi?",
      answer: "Kullanıcı verileriniz end-to-end şifreleme ile korunur ve kesinlikle gizli tutulur. Verileriniz üçüncü şahıslarla paylaşılmaz. Güvenliğiniz bizim önceliğimizdir ve KVKK uyumlu veri işleme politikaları uygularız.",
      category: "güvenlik",
      icon: <Shield className="w-4 h-4" />
    },
    {
      id: 4,
      question: "Hangi oyun modları mevcut?",
      answer: "WordPlay'de çoktan seçmeli, eşleştirme, boşluk doldurma, kelime kartları, konuşma, kelime yarışı, hafıza oyunu, cümle tamamlama ve daha birçok oyun modu bulunmaktadır. Her mod farklı öğrenme stillerine uygun olarak tasarlanmıştır.",
      category: "oyunlar",
      icon: <Gamepad2 className="w-4 h-4" />
    },
    {
      id: 5,
      question: "Koç Üniversitesi ELC listeleriyle uyumlu mu?",
      answer: "Evet, WordPlay tamamen Koç Üniversitesi ELC (English Language Center) kelime listeleriyle uyumlu olarak geliştirilmiştir. Foundation, Pre-Intermediate, Intermediate ve Upper-Intermediate seviyelerindeki tüm kelimeleri içerir.",
      category: "içerik",
      icon: <BookOpen className="w-4 h-4" />
    },
    {
      id: 6,
      question: "Mobil cihazlarda kullanabilir miyim?",
      answer: "Evet, WordPlay tamamen responsive tasarıma sahiptir ve tüm mobil cihazlarda mükemmel çalışır. Ayrıca PWA (Progressive Web App) olarak da kullanılabilir, böylece ana ekranınıza ekleyebilirsiniz.",
      category: "teknik",
      icon: <Gamepad2 className="w-4 h-4" />
    },
    {
      id: 7,
      question: "İlerleme durumumu nasıl takip edebilirim?",
      answer: "Hesabınızla giriş yaptığınızda, öğrenme istatistiklerinizi, tamamlanan oyunları, öğrenilen kelime sayısını ve genel performansınızı detaylı olarak görüntüleyebilirsiniz. Bu bilgiler size öğrenme sürecinizde rehberlik eder.",
      category: "hesap",
      icon: <Users className="w-4 h-4" />
    },
    {
      id: 8,
      question: "Destek almak için ne yapmalıyım?",
      answer: "Herhangi bir sorun yaşarsanız veya yardıma ihtiyacınız olursa, iletişim sayfasından bize ulaşabilirsiniz. E-posta, telefon veya sosyal medya kanallarımız üzerinden 24 saat içinde yanıt alırsınız.",
      category: "destek",
      icon: <MessageCircle className="w-4 h-4" />
    }
  ];

  const categories = [
    { id: 'all', name: 'Tümü', count: faqData.length },
    { id: 'genel', name: 'Genel', count: faqData.filter(item => item.category === 'genel').length },
    { id: 'hesap', name: 'Hesap', count: faqData.filter(item => item.category === 'hesap').length },
    { id: 'güvenlik', name: 'Güvenlik', count: faqData.filter(item => item.category === 'güvenlik').length },
    { id: 'oyunlar', name: 'Oyunlar', count: faqData.filter(item => item.category === 'oyunlar').length },
    { id: 'içerik', name: 'İçerik', count: faqData.filter(item => item.category === 'içerik').length },
    { id: 'teknik', name: 'Teknik', count: faqData.filter(item => item.category === 'teknik').length },
    { id: 'destek', name: 'Destek', count: faqData.filter(item => item.category === 'destek').length }
  ];

  const filteredFAQs = activeCategory === 'all' 
    ? faqData 
    : faqData.filter(item => item.category === activeCategory);

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
              <h1 className="text-2xl font-bold text-white">Sık Sorulan Sorular</h1>
              <p className="text-neutral-400 text-sm">Yardıma mı ihtiyacınız var?</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-2xl mb-6">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Sık Sorulan Sorular
          </h2>
          <p className="text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            WordPlay hakkında merak ettiğiniz her şeyi burada bulabilirsiniz. 
            Eğer aradığınız cevabı bulamazsanız, bizimle iletişime geçmekten çekinmeyin.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-neutral-800/50 text-neutral-300 hover:bg-neutral-700/50 border border-white/10'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map((item, index) => (
            <div
              key={item.id}
              className="bg-neutral-800/50 rounded-2xl border border-white/10 overflow-hidden"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white">{item.question}</h3>
                </div>
                <div className="flex-shrink-0">
                  {openItems.includes(item.id) ? (
                    <ChevronUp className="w-5 h-5 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-neutral-400" />
                  )}
                </div>
              </button>
              
              {openItems.includes(item.id) && (
                <div className="px-6 pb-6">
                  <div className="border-t border-white/10 pt-4">
                    <p className="text-neutral-300 leading-relaxed">{item.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <div className="bg-neutral-800/50 rounded-2xl p-8 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4">
              Hala Sorunuz mu Var?
            </h3>
            <p className="text-neutral-300 mb-6">
              Aradığınız cevabı bulamadıysanız, destek ekibimizle iletişime geçmekten çekinmeyin. 
              Size en kısa sürede yardımcı olacağız.
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
                onClick={() => navigate('/destek')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                Destek Al
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sss; 