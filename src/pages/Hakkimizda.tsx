import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Target, Award, BookOpen, Heart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hakkimizda: React.FC = () => {
  const navigate = useNavigate();

  const teamMembers = [
    {
      name: "Ahmet Yılmaz",
      role: "Kurucu & CEO",
      description: "10+ yıl eğitim teknolojileri deneyimi",
      avatar: "AY"
    },
    {
      name: "Zeynep Kaya",
      role: "Eğitim Direktörü",
      description: "Koç Üniversitesi ELC uzmanı",
      avatar: "ZK"
    },
    {
      name: "Mehmet Demir",
      role: "Teknik Direktör",
      description: "Full-stack geliştirici & AI uzmanı",
      avatar: "MD"
    }
  ];

  const milestones = [
    {
      year: "2023",
      title: "Proje Başlangıcı",
      description: "Koç Üniversitesi ELC ile işbirliği"
    },
    {
      year: "2024",
      title: "Beta Sürüm",
      description: "1,000+ öğrenci ile test edildi"
    },
    {
      year: "2025",
      title: "Genel Yayın",
      description: "Tüm üniversiteler için açık"
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
              <h1 className="text-2xl font-bold text-white">Hakkımızda</h1>
              <p className="text-neutral-400 text-sm">WordPlay'in hikayesi ve misyonu</p>
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
          className="text-center mb-20"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl mb-8">
            <Heart className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-6">
            İngilizce Öğrenmeyi <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Eğlenceli</span> Hale Getiriyoruz
          </h2>
          <p className="text-xl text-neutral-300 max-w-3xl mx-auto leading-relaxed">
            WordPlay, Koç Üniversitesi ELC listeleriyle uyumlu, oyunlaştırılmış kelime öğrenme platformudur. 
            Amacımız, hazırlık sınıfı öğrencilerinin İngilizce öğrenme sürecini keyifli ve etkili hale getirmektir.
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Misyonumuz</h3>
            </div>
            <p className="text-neutral-300 leading-relaxed text-lg">
              Her öğrencinin kendi seviyesinde İngilizce kelime öğrenmesini sağlamak, 
              oyunlaştırılmış yöntemlerle öğrenmeyi eğlenceli hale getirmek ve 
              hazırlık sınıfı sürecini kolaylaştırmak.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Vizyonumuz</h3>
            </div>
            <p className="text-neutral-300 leading-relaxed text-lg">
              Türkiye'nin en güvenilir ve etkili İngilizce öğrenme platformu olmak, 
              tüm üniversitelerin hazırlık sınıflarında kullanılan standart bir araç haline gelmek.
            </p>
          </motion.div>
        </div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Ekibimiz</h3>
            <p className="text-neutral-400 text-lg">WordPlay'i mümkün kılan uzman ekip</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="bg-gradient-to-r from-neutral-800/50 to-neutral-700/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                  {member.avatar}
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">{member.name}</h4>
                <p className="text-purple-400 font-medium mb-2">{member.role}</p>
                <p className="text-neutral-400 text-sm">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Milestones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Yolculuğumuz</h3>
            <p className="text-neutral-400 text-lg">WordPlay'in gelişim süreci</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                className="bg-gradient-to-r from-neutral-800/50 to-neutral-700/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-green-400 mb-2">{milestone.year}</div>
                <h4 className="text-xl font-semibold text-white mb-2">{milestone.title}</h4>
                <p className="text-neutral-400">{milestone.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-neutral-800/50 to-neutral-700/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-8">Rakamlarla WordPlay</h3>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">1,000+</div>
                <div className="text-neutral-400">Aktif Öğrenci</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">5,000+</div>
                <div className="text-neutral-400">Kelime</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">15+</div>
                <div className="text-neutral-400">Oyun Modu</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-400 mb-2">98%</div>
                <div className="text-neutral-400">Memnuniyet</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hakkimizda; 