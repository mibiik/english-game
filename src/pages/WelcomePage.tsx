import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Brain, 
  Award, 
  Users, 
  Zap, 
  Star, 
  ArrowRight, 
  Play,
  GraduationCap,
  Target,
  Clock,
  Trophy
} from 'lucide-react';
import logo from './ico.png';
import { Auth } from '../components/Auth';
// import SubscribeButton from '../components/SubscribeButton';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const features = [
    {
      icon: <BookOpen className="w-12 h-12" />,
      title: "Koç ELC Kelime Listeleri",
      description: "Koç Üniversitesi ELC'nin güncel kelime listeleriyle tam uyumlu, seviyenize uygun kelimelerle çalışın."
    },
    {
      icon: <Brain className="w-12 h-12" />,
      title: "12 Farklı Oyun Modu",
      description: "Çoktan seçmeli, eşleştirme, boşluk doldurma ve daha fazlası. Her öğrenme stiline uygun oyunlar."
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Canlı Quiz Yarışmaları",
      description: "Arkadaşlarınızla canlı quiz yarışmalarına katılın, gerçek zamanlı skorları takip edin."
    },
    {
      icon: <Target className="w-12 h-12" />,
      title: "Kişiselleştirilmiş Öğrenme",
      description: "AI destekli sistem ile zorlandığınız kelimeleri tespit edin ve odaklanın."
    },
    {
      icon: <Trophy className="w-12 h-12" />,
      title: "Liderlik Tablosu",
      description: "Skorlarınızı kaydedin, arkadaşlarınızla yarışın ve başarılarınızı takip edin."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#111] to-black text-white overflow-hidden" style={{ paddingTop: '64px', marginTop: '-128px' }}>
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-6 pt-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="flex items-center justify-center gap-3">
              <motion.img
                src={logo}
                alt="Logo"
                className="w-24 h-24 drop-shadow-2xl"
                animate={{ 
                  y: ["-4px", "4px"],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{
                  y: {
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 3,
                    ease: "easeInOut",
                  },
                  rotate: {
                    repeat: Infinity,
                    duration: 4,
                    ease: "easeInOut",
                  }
                }}
              />
              <motion.h2
                className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                WORDPLAY
              </motion.h2>
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-black mb-6 tracking-tight"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent drop-shadow-lg">
              Hoş Geldin
            </span>
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto font-bold leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Koç Üniversitesi ELC'nin güncel kelime listeleriyle tam uyumlu, 
            <br />
            <span className="text-red-300 font-black drop-shadow-lg bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent">
              interaktif oyunlarla İngilizce'nizi geliştirin!
            </span>
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              onClick={() => {
                setShowAuth(true);
                setAuthMode('register');
              }}
              className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white px-8 py-4 rounded-xl font-black text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl hover:shadow-red-500/25"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <GraduationCap className="w-6 h-6" />
              Hemen Kayıt Ol ve Başla
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              onClick={() => {
                setShowAuth(true);
                setAuthMode('login');
              }}
              className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:from-green-700 hover:via-green-800 hover:to-green-900 text-white px-8 py-4 rounded-xl font-black text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl hover:shadow-green-500/25"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap className="w-6 h-6" />
              Giriş Yap
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Features Carousel */}
        <motion.div
          className="w-full max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="relative">
            <motion.div
              key={currentSlide}
              className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-8 border-2 border-gray-700 shadow-2xl"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="text-red-500 drop-shadow-lg">
                  {features[currentSlide].icon}
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-black mb-3 text-white drop-shadow-lg">
                    {features[currentSlide].title}
                  </h3>
                  <p className="text-gray-200 text-lg font-semibold leading-relaxed">
                    {features[currentSlide].description}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Dots */}
            <div className="flex justify-center mt-6 gap-2">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-red-500 w-8 shadow-lg shadow-red-500/50' : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 w-full max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="text-center">
            <div className="text-3xl font-black text-red-500 mb-2 drop-shadow-lg">12+</div>
            <div className="text-gray-300 font-bold text-base">Oyun Modu</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-red-500 mb-2 drop-shadow-lg">1000+</div>
            <div className="text-gray-300 font-bold text-base">Kelime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-red-500 mb-2 drop-shadow-lg">4</div>
            <div className="text-gray-300 font-bold text-base">Seviye</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-red-500 mb-2 drop-shadow-lg">∞</div>
            <div className="text-gray-300 font-bold text-base">Pratik</div>
          </div>
        </motion.div>
      </div>
      {showAuth && (
        <Auth
          onClose={() => setShowAuth(false)}
          isLogin={authMode === 'login'}
        />
      )}
      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-red-500/20 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default WelcomePage; 