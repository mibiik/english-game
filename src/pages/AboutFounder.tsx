import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Linkedin, Instagram, Star, Code, Brain, BookOpen, Target, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutFounder: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] text-white overflow-x-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating Code Symbols */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`code-${i}`}
            className="absolute text-blue-400/20 text-2xl font-mono"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              rotate: [0, 360],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 20 + 15,
              repeat: Infinity,
              delay: Math.random() * 10,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            {['<>', '</>', '{}', '()', '[]', '&&', '||', '=>', '++', '--'][i % 10]}
          </motion.div>
        ))}

        {/* Floating Stars */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute w-1 h-1 bg-yellow-400/40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
            }}
            animate={{
              rotate: [0, 360],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 8 + 6,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}

        {/* Neural Network Dots */}
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={`neural-${i}`}
            className="absolute w-2 h-2 bg-purple-500/30 rounded-full"
            animate={{
              x: [0, 50, 0],
              y: [0, -50, 0],
              opacity: [0.1, 0.6, 0.1],
            }}
            transition={{
              duration: Math.random() * 12 + 10,
              repeat: Infinity,
              delay: Math.random() * 8,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => navigate('/home')}
          className="absolute top-8 left-8 p-3 bg-white/10 backdrop-blur-md rounded-full shadow-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
        >
          <ArrowLeft className="w-6 h-6" />
        </motion.button>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
                      <div className="relative inline-block mb-8">
              {/* Profile Image */}
              <div className="w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 p-1 shadow-2xl">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img 
                    src="/1947753B-5231-4FD7-A82B-72179D29CBF9.jpg" 
                    alt="Miraç Birlik" 
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
            {/* Floating Elements Around Profile */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
            >
              <Star className="w-4 h-4 text-yellow-800" />
            </motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-4 -left-4 w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center"
            >
              <Code className="w-4 h-4 text-blue-800" />
            </motion.div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Miraç Birlik
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-6">
            WordPlay'in Kurucusu & Geliştiricisi
          </p>

          {/* Social Links */}
          <div className="flex justify-center gap-6 mb-8">
            <motion.a
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              href="https://www.linkedin.com/in/mira%C3%A7-birlik-2593b125b/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Linkedin className="w-5 h-5" />
              <span>LinkedIn</span>
            </motion.a>
                         <motion.a
               whileHover={{ scale: 1.1, y: -2 }}
               whileTap={{ scale: 0.95 }}
               href="https://www.instagram.com/miracbirlik"
               target="_blank"
               rel="noopener noreferrer"
               className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20"
             >
               <Instagram className="w-5 h-5 text-pink-400" />
               <span>Instagram</span>
             </motion.a>
          </div>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-12">
                     {/* Kısa Tanıtım */}
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.2 }}
             className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-2xl"
           >
             <div className="mb-6">
               <h2 className="text-4xl font-bold text-white">Kısa Tanıtım</h2>
             </div>
            <div className="text-lg leading-relaxed text-gray-300">
              <p className="mb-4">
                "Merhaba, ben Miraç. Wordplay'in kurucusuyum. Yapay zeka, dil öğrenimi ve oyun geliştirme üzerine çalışan bir yazılım geliştiricisiyim.
              </p>
              <p>
                Wordplay'i, eğlenceli ve etkileşimli şekilde İngilizce öğrenmeyi mümkün kılmak için kurdum."
              </p>
            </div>
          </motion.div>

                     {/* Vizyon ve Hikaye */}
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.4 }}
             className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-2xl"
           >
             <div className="mb-6">
               <h2 className="text-4xl font-bold text-white">Vizyon ve Hikaye</h2>
             </div>
            <div className="text-lg leading-relaxed text-gray-300">
              <p className="mb-4">
                "Wordplay, klasik eğitim yöntemlerinin sıkıcılığını kırmak için doğdu. Amacım; kelime dağarcığını geliştirirken oyunculara rekabet, ödüller ve motivasyon sağlayan bir platform oluşturmak.
              </p>
              <p>
                Yapay zeka destekli öğrenme sistemleri ve kişiselleştirilmiş içeriklerle, dil öğrenimini bir görev değil, keyifli bir deneyim haline getirmeyi hedefliyorum."
              </p>
            </div>
          </motion.div>

                     {/* Hakkında */}
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.6 }}
             className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-2xl"
           >
             <div className="mb-6">
               <h2 className="text-4xl font-bold text-white">Hakkında</h2>
             </div>
            <div className="text-lg leading-relaxed text-gray-300">
              <p className="mb-4">
                "Koç Üniversitesi Bilgisayar Mühendisliği öğrencisiyim. AI, oyun geliştirme ve dil teknolojileri üzerine yoğunlaşıyorum. Wordplay, bu alanlara olan tutkumun bir sonucu.
              </p>
              <p>
                Her gün oyunu daha eğlenceli, daha akıllı ve daha öğretici hale getirmek için çalışıyorum."
              </p>
            </div>
          </motion.div>

                     
        </div>

                 {/* Call to Action */}
         <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 1.2 }}
           className="text-center mt-16"
         >
           <motion.button
             whileHover={{ scale: 1.05, y: -3 }}
             whileTap={{ scale: 0.95 }}
             onClick={() => navigate('/home')}
             className="px-8 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 border border-white/20 relative overflow-hidden group"
           >
             <motion.div
               className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20"
               initial={{ x: '-100%' }}
               whileHover={{ x: '100%' }}
               transition={{ duration: 0.6 }}
             />
             <span className="relative z-10 flex items-center gap-2">
               <motion.span
                 animate={{ rotate: [0, 10, -10, 0] }}
                 transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
               >
                 🚀
               </motion.span>
               WordPlay'i Keşfet
             </span>
           </motion.button>
         </motion.div>
      </div>
    </div>
  );
};

export default AboutFounder; 