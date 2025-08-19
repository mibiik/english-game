import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Brain, 
  Users, 
  Target,
  Trophy,
  Play,
  GraduationCap,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import logo from './ico.png';
import { Auth } from '../components/Auth';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const features = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Koç ELC Kelime Listeleri",
      description: "Güncel kelime listeleriyle tam uyumlu, seviyenize uygun kelimelerle çalışın."
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "12 Farklı Oyun Modu", 
      description: "Çoktan seçmeli, eşleştirme, boşluk doldurma ve daha fazlası."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Canlı Quiz Yarışmaları",
      description: "Arkadaşlarınızla canlı quiz yarışmalarına katılın."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Kişiselleştirilmiş Öğrenme",
      description: "AI destekli sistem ile zorlandığınız kelimeleri tespit edin."
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Liderlik Tablosu",
      description: "Skorlarınızı kaydedin, arkadaşlarınızla yarışın."
    }
  ];

  const stats = [
    { number: "12+", label: "Oyun Modu" },
    { number: "1000+", label: "Kelime" },
    { number: "4", label: "Seviye" },
    { number: "∞", label: "Pratik" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="WordPlay" className="w-10 h-10" />
              <h1 className="text-xl font-semibold text-gray-900">WordPlay</h1>
            </div>
            <button
              onClick={() => {
                setAuthMode('login');
                setShowAuth(true);
              }}
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Giriş Yap
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            İngilizce Öğrenmenin
            <br />
            <span className="text-blue-600">En Etkili Yolu</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Koç Üniversitesi ELC'nin güncel kelime listeleriyle tam uyumlu, 
            interaktif oyunlarla İngilizce'nizi geliştirin.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => {
                setAuthMode('register');
                setShowAuth(true);
              }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ücretsiz Başla
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => {
                setAuthMode('login');
                setShowAuth(true);
              }}
              className="inline-flex items-center gap-2 px-8 py-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Play className="w-5 h-5" />
              Demo İzle
            </button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Neden WordPlay?
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Modern öğrenme metodları ve teknoloji ile İngilizce öğrenme deneyiminizi optimize edin.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            Hemen Başlayın
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Binlerce öğrenci WordPlay ile İngilizce seviyelerini geliştirdi. 
            Siz de bu başarı hikayesinin parçası olun.
          </p>
          <button
            onClick={() => {
              setAuthMode('register');
              setShowAuth(true);
            }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            <CheckCircle className="w-5 h-5" />
            Ücretsiz Hesap Oluştur
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <img src={logo} alt="WordPlay" className="w-8 h-8" />
              <span className="text-lg font-semibold">WordPlay</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 WordPlay. Tüm hakları saklıdır.
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <Auth 
              mode={authMode} 
              onClose={() => setShowAuth(false)}
              onSuccess={() => {
                setShowAuth(false);
                navigate('/home');
              }}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export { WelcomePage };
export default WelcomePage;