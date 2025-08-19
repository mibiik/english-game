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
  Trophy,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import logo from './ico.png';
import { Auth } from '../components/Auth';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Koç ELC Kelime Listeleri",
      description: "Güncel kelime listeleriyle tam uyumlu, seviyenize uygun kelimelerle çalışın.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "12 Farklı Oyun Modu", 
      description: "Çoktan seçmeli, eşleştirme, boşluk doldurma ve daha fazlası.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Canlı Quiz Yarışmaları",
      description: "Arkadaşlarınızla canlı quiz yarışmalarına katılın.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Kişiselleştirilmiş Öğrenme",
      description: "AI destekli sistem ile zorlandığınız kelimeleri tespit edin.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Liderlik Tablosu",
      description: "Skorlarınızı kaydedin, arkadaşlarınızla yarışın.",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const stats = [
    { number: "12+", label: "Oyun Modu", icon: <Play className="w-5 h-5" /> },
    { number: "1000+", label: "Kelime", icon: <BookOpen className="w-5 h-5" /> },
    { number: "4", label: "Seviye", icon: <GraduationCap className="w-5 h-5" /> },
    { number: "∞", label: "Pratik", icon: <Sparkles className="w-5 h-5" /> }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [features.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-slate-800/20 to-transparent rounded-full"></div>
      </div>

      {/* Main Content */}
      <motion.div 
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <div className="text-center mb-16 max-w-4xl">
          {/* Logo */}
          <motion.div
            variants={itemVariants}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <motion.img
                src={logo}
                alt="WordPlay Logo"
                className="w-16 h-16 drop-shadow-lg"
                whileHover={{ scale: 1.05 }}
                animate={{ 
                  y: [0, -8, 0],
                }}
                transition={{
                  y: {
                    repeat: Infinity,
                    duration: 3,
                    ease: "easeInOut",
                  }
                }}
              />
              <motion.h1
                className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent"
                variants={itemVariants}
              >
                WORDPLAY
              </motion.h1>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            Hoş Geldin
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-slate-300 mb-12 leading-relaxed max-w-2xl mx-auto"
          >
            Koç Üniversitesi ELC'nin güncel kelime listeleriyle tam uyumlu,{' '}
            <span className="text-blue-400 font-medium">interaktif oyunlarla İngilizce'nizi geliştirin!</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <motion.button
              onClick={() => {
                setAuthMode('register');
                setShowAuth(true);
              }}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Hemen Kayıt Ol ve Başla
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
            </motion.button>

            <motion.button
              onClick={() => {
                setAuthMode('login');
                setShowAuth(true);
              }}
              className="group px-8 py-4 border-2 border-slate-600 rounded-2xl font-semibold text-slate-300 hover:border-slate-500 hover:text-white hover:bg-slate-800/50 transition-all duration-300"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Giriş Yap
              </span>
            </motion.button>
          </motion.div>
        </div>

        {/* Feature Carousel */}
        <motion.div
          variants={itemVariants}
          className="w-full max-w-4xl mb-16"
        >
          <div className="relative bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${features[currentSlide].color} mb-6`}>
                <div className="text-white">
                  {features[currentSlide].icon}
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-4 text-white">
                {features[currentSlide].title}
              </h3>
              
              <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto">
                {features[currentSlide].description}
              </p>
            </motion.div>

            {/* Slide Indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'bg-blue-500 w-8'
                      : 'bg-slate-600 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center group"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-slate-800/50 rounded-xl group-hover:bg-slate-700/50 transition-colors">
                  <div className="text-blue-400">
                    {stat.icon}
                  </div>
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stat.number}
              </div>
              <div className="text-slate-400 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 rounded-3xl p-8 max-w-md w-full border border-slate-700 shadow-2xl"
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

export default WelcomePage;