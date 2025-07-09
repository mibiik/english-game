import React from 'react';
import { Card } from '../components/ui/card';
import { Users, Target, BookOpen, Trophy, Heart, Lightbulb, Code, Zap, Coffee, Star } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Biz Kimiz</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Merhaba! Ben Mira, bu platformu tek başıma geliştiren bir yazılım geliştiricisiyim. 
            İngilizce öğrenmeyi herkes için daha eğlenceli ve erişilebilir hale getirmek için 
            bu projeyi hayata geçirdim.
          </p>
        </div>

        {/* Personal Story */}
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-12">
          <div className="flex items-center mb-6">
            <Heart className="w-8 h-8 text-red-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Projemin Hikayesi</h2>
          </div>
          <div className="text-gray-600 leading-relaxed space-y-4">
            <p>
              Bu proje, İngilizce öğrenmenin daha eğlenceli ve etkili olabileceği inancıyla 
              2024 yılında doğdu. Geleneksel öğrenme yöntemlerinin sınırlarını aşarak, 
              teknoloji destekli interaktif oyunlar geliştirmeye karar verdim.
            </p>
            <p>
              Tek kişilik bir ekip olarak, yazılım geliştirme, UI/UX tasarımı, eğitim içeriği 
              oluşturma ve yapay zeka entegrasyonu gibi tüm süreçleri kendim yönetiyorum. 
              Bu zorlu ama bir o kadar da keyifli yolculukta, her gün yeni şeyler öğreniyorum.
            </p>
            <p>
              Bugün 1000'den fazla öğrencinin İngilizce öğrenme yolculuğuna eşlik etmenin 
              gururunu yaşıyorum. Her geri bildirim beni daha da motive ediyor ve 
              platformu sürekli geliştirmeye devam ediyorum.
            </p>
          </div>
        </Card>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center mb-6">
              <Target className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Misyonum</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              İngilizce öğrenmeyi herkes için erişilebilir, eğlenceli ve etkili hale getirmek. 
              Tek kişilik bir ekip olarak, modern teknoloji ile geleneksel öğrenme yöntemlerini 
              birleştirerek, öğrencilerin motivasyonunu artıran oyunlaştırılmış bir deneyim sunmak.
            </p>
          </Card>

          <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center mb-6">
              <Lightbulb className="w-8 h-8 text-purple-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Vizyonum</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Dünya genelinde milyonlarca öğrencinin İngilizce öğrenmesine yardımcı olan, 
              bağımsız bir eğitim teknolojisi platformu yaratmak. Yapay zeka destekli 
              kişiselleştirilmiş öğrenme deneyimleri ile geleceğin eğitimini şekillendirmek.
            </p>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Değerlerim</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg text-center">
              <BookOpen className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Eğitim Odaklılık</h3>
              <p className="text-gray-600">
                Her özelliği pedagojik araştırmalara dayalı olarak geliştiriyorum.
              </p>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg text-center">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Topluluk</h3>
              <p className="text-gray-600">
                Öğrencilerin birlikte öğrenebileceği destekleyici bir ortam yaratıyorum.
              </p>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg text-center">
              <Trophy className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Başarı</h3>
              <p className="text-gray-600">
                Her öğrencinin kendi hızında başarıya ulaşmasını destekliyorum.
              </p>
            </Card>
          </div>
        </div>

        {/* Development Philosophy */}
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-12">
          <div className="flex items-center mb-6">
            <Code className="w-8 h-8 text-indigo-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Geliştirme Felsefem</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Kullanıcı Odaklı Tasarım</h3>
              <p className="text-gray-600 text-sm">
                Her özelliği kullanıcı deneyimini önceleyerek tasarlıyorum. 
                Basitlik ve işlevsellik arasında mükemmel dengeyi kuruyorum.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Sürekli İyileştirme</h3>
              <p className="text-gray-600 text-sm">
                Platformu sürekli geliştiriyor, kullanıcı geri bildirimlerini 
                değerlendirerek yeni özellikler ekliyorum.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Modern Teknolojiler</h3>
              <p className="text-gray-600 text-sm">
                React, TypeScript, AI entegrasyonu gibi güncel teknolojileri 
                kullanarak performanslı ve güvenilir çözümler üretiyorum.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Açık Kaynak Ruhu</h3>
              <p className="text-gray-600 text-sm">
                Öğrenmeyi ve paylaşımı destekleyerek, toplulukla birlikte 
                büyüyen bir platform yaratıyorum.
              </p>
            </div>
          </div>
        </Card>

        {/* Personal Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg text-center">
            <div className="text-3xl font-bold mb-2">1000+</div>
            <div className="text-blue-100">Aktif Öğrenci</div>
          </Card>
          <Card className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg text-center">
            <div className="text-3xl font-bold mb-2">15+</div>
            <div className="text-green-100">Oyun Modu</div>
          </Card>
          <Card className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg text-center">
            <div className="text-3xl font-bold mb-2">5000+</div>
            <div className="text-purple-100">Kelime Hazinesi</div>
          </Card>
          <Card className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg text-center">
            <div className="text-3xl font-bold mb-2">∞</div>
            <div className="text-orange-100">Kahve Tüketimi</div>
          </Card>
        </div>

        {/* Fun Facts */}
        <Card className="p-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 shadow-lg mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Eğlenceli Gerçekler</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <Code className="w-12 h-12 mx-auto mb-3 opacity-80" />
                <div className="text-2xl font-bold mb-1">50,000+</div>
                <div className="text-sm opacity-90">Satır Kod</div>
              </div>
              <div className="text-center">
                <Coffee className="w-12 h-12 mx-auto mb-3 opacity-80" />
                <div className="text-2xl font-bold mb-1">∞</div>
                <div className="text-sm opacity-90">Kahve Fincanı</div>
              </div>
              <div className="text-center">
                <Zap className="w-12 h-12 mx-auto mb-3 opacity-80" />
                <div className="text-2xl font-bold mb-1">24/7</div>
                <div className="text-sm opacity-90">Geliştirme Modu</div>
              </div>
              <div className="text-center">
                <Star className="w-12 h-12 mx-auto mb-3 opacity-80" />
                <div className="text-2xl font-bold mb-1">1</div>
                <div className="text-sm opacity-90">Kişilik Ekip</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Contact CTA */}
        <Card className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Benimle İletişime Geçin!</h2>
            <p className="text-xl mb-6 opacity-90">
              Proje hakkında sorularınız varsa, önerileriniz varsa veya sadece 
              merhaba demek istiyorsanız, benimle iletişime geçmekten çekinmeyin!
            </p>
            <div className="flex justify-center space-x-4">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Email Gönder
              </button>
              <button className="bg-white/20 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors">
                GitHub'da İncele
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage; 