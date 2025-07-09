import React from 'react';
import { Card } from '../components/ui/card';
import { Github, Linkedin, Mail, Code, Palette, Brain, Users, Heart, Star, Zap, Coffee, Gamepad2, Lightbulb, Target, BookOpen } from 'lucide-react';

const TeamPage: React.FC = () => {
  const founder = {
    name: "Mira",
    role: "Kurucu, Geliştirici & Yaratıcı",
    longBio: "Merhaba! Ben Mira, bu projenin tek kişilik ekibiyim. İngilizce öğrenmeyi herkes için daha eğlenceli ve erişilebilir hale getirmek amacıyla bu platformu tek başıma geliştirdim. Yazılım geliştirme, UI/UX tasarımı, eğitim teknolojileri ve yapay zeka entegrasyonu konularında kendimi sürekli geliştiriyorum.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    skills: ["React", "TypeScript", "UI/UX Design", "Firebase", "AI Integration", "Eğitim Teknolojileri"],
    achievements: [
      "15+ farklı oyun modu geliştirdi",
      "5000+ kelime veritabanı oluşturdu",
      "Puter.js AI entegrasyonu gerçekleştirdi",
      "Responsive ve modern arayüz tasarladı"
    ],
    workStyle: [
      "Kullanıcı deneyimini önceleyerek geliştirme",
      "Sürekli öğrenme ve kendini geliştirme",
      "Eğitim teknolojilerinde yenilikçi yaklaşımlar",
      "Topluluk geri bildirimlerini değerlendirme"
    ],
    tools: ["VS Code", "Figma", "Firebase", "Vercel", "GitHub", "Tailwind CSS"],
    passion: "Teknoloji ile eğitimi birleştirerek, öğrenmeyi keyifli bir deneyim haline getirmek",
    vision: "Dünya genelinde milyonlarca öğrencinin İngilizce öğrenmesine yardımcı olan bir platform yaratmak",
    social: {
      github: "https://github.com/mibiik",
      linkedin: "https://linkedin.com/in/mira",
      email: "mira@englishgame.com"
    }
  };

  const personalStats = [
    { icon: Code, label: "Kod Satırı", value: "50,000+", color: "from-blue-500 to-blue-600" },
    { icon: Gamepad2, label: "Oyun Modu", value: "15+", color: "from-green-500 to-green-600" },
    { icon: Users, label: "Aktif Kullanıcı", value: "1,000+", color: "from-purple-500 to-purple-600" },
    { icon: Coffee, label: "Kahve Tüketimi", value: "∞", color: "from-orange-500 to-orange-600" }
  ];

  const developmentJourney = [
    {
      phase: "Başlangıç",
      period: "2024 İlk Çeyrek",
      description: "Proje fikri doğdu ve ilk prototipler geliştirildi",
      icon: "💡"
    },
    {
      phase: "Geliştirme",
      period: "2024 İkinci Çeyrek",
      description: "Temel oyun modları ve kullanıcı arayüzü tasarlandı",
      icon: "🚀"
    },
    {
      phase: "AI Entegrasyonu",
      period: "2024 Üçüncü Çeyrek",
      description: "Gemini'den Puter.js'ye geçiş ve AI özellikleri eklendi",
      icon: "🤖"
    },
    {
      phase: "Büyüme",
      period: "2024 Son Çeyrek",
      description: "Kullanıcı tabanı genişledi ve yeni özellikler eklendi",
      icon: "📈"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Ekibimiz</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Bu platform, tek kişilik bir tutku projesi olarak hayata geçirildi. 
            Her satır kod, her tasarım elementi ve her özellik özenle geliştirildi.
          </p>
        </div>

        {/* Founder Spotlight */}
        <div className="mb-16">
          <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Sol: Profil Bilgileri */}
              <div className="lg:col-span-1">
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <img 
                      src={founder.avatar} 
                      alt={founder.name}
                      className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-lg"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded-full">
                      <Crown className="w-6 h-6" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">{founder.name}</h2>
                  <p className="text-xl text-blue-600 font-semibold mb-4">{founder.role}</p>
                  
                  {/* Sosyal Linkler */}
                  <div className="flex justify-center space-x-4 mb-6">
                    <a 
                      href={founder.social.github}
                      className="p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                    <a 
                      href={founder.social.linkedin}
                      className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a 
                      href={`mailto:${founder.social.email}`}
                      className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                  </div>

                  {/* Beceriler */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Uzmanlık Alanları</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {founder.skills.map((skill, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sağ: Detaylı Bilgiler */}
              <div className="lg:col-span-2 space-y-6">
                {/* Hakkında */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <Heart className="w-6 h-6 text-red-500 mr-2" />
                    Hakkımda
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {founder.longBio}
                  </p>
                </div>

                {/* Tutku */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <Star className="w-6 h-6 text-yellow-500 mr-2" />
                    Tutkum
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {founder.passion}
                  </p>
                </div>

                {/* Vizyon */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <Target className="w-6 h-6 text-blue-500 mr-2" />
                    Vizyonum
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {founder.vision}
                  </p>
                </div>

                {/* Başarılar */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <Zap className="w-6 h-6 text-green-500 mr-2" />
                    Başarılarım
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {founder.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-gray-700">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Çalışma Tarzı */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <Lightbulb className="w-6 h-6 text-purple-500 mr-2" />
                    Çalışma Tarzım
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {founder.workStyle.map((style, index) => (
                      <div key={index} className="flex items-center p-3 bg-purple-50 rounded-lg">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        <span className="text-gray-700">{style}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Kullandığım Araçlar */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <Code className="w-6 h-6 text-blue-500 mr-2" />
                    Kullandığım Araçlar
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {founder.tools.map((tool, index) => (
                      <span 
                        key={index}
                        className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Kişisel İstatistikler */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {personalStats.map((stat, index) => (
            <Card key={index} className={`p-6 bg-gradient-to-r ${stat.color} text-white border-0 shadow-lg text-center`}>
              <stat.icon className="w-12 h-12 mx-auto mb-4" />
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <div className="text-sm opacity-90">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Geliştirme Yolculuğu */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Geliştirme Yolculuğu</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {developmentJourney.map((phase, index) => (
              <Card key={index} className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg text-center hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">{phase.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{phase.phase}</h3>
                <p className="text-sm text-blue-600 font-medium mb-3">{phase.period}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{phase.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* İletişim CTA */}
        <Card className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Benimle İletişime Geç!</h2>
            <p className="text-xl mb-6 opacity-90">
              Projem hakkında sorularınız varsa veya işbirliği yapmak istiyorsanız, 
              benimle iletişime geçmekten çekinmeyin.
            </p>
            <div className="flex justify-center space-x-4">
              <a 
                href={founder.social.email}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Email Gönder
              </a>
              <a 
                href={founder.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors"
              >
                GitHub'da İncele
              </a>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Crown ikonu eksikse ekleyelim
const Crown: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M5 16L3 6l5.5 4L12 4l3.5 6L21 6l-2 10H5zm2.7-2h8.6l.9-4.4L14 12l-2-4-2 4-3.2-2.4L7.7 14z"/>
  </svg>
);

export default TeamPage; 