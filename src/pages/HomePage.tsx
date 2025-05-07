import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GameCard } from '../components/GameModes/GameCard';
import { UnitSelector } from '../components/UnitSelector';
import { Trophy, Zap, Brain, Mic, Volume2, Layout, BookOpen, Clock, Award, Star } from 'lucide-react';
import AdSense from '../components/AdSense';

interface HomePageProps {
  currentUnit: string;
  setCurrentUnit: (unit: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ currentUnit, setCurrentUnit }) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    setShowAnimation(true);
    const timer = setTimeout(() => setShowAnimation(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const gameModes = [
    {
      id: 'matching',
      title: 'Eşleştirme Oyunu',
      description: 'İngilizce ve Türkçe kelimeleri eşleştirerek kelime haznenizi geliştirin.',
      icon: <Layout className="w-10 h-10 text-purple-500" />,
      link: '/matching-game',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      id: 'speed',
      title: 'Hız Testi',
      description: 'Ne kadar hızlı olduğunuzu test edin ve kelime bilginizi geliştirin.',
      icon: <Zap className="w-10 h-10 text-yellow-500" />,
      link: '/word-race',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      id: 'memory',
      title: 'Hafıza Oyunu',
      description: 'Kelimeleri hatırlayarak hafızanızı güçlendirin.',
      icon: <Brain className="w-10 h-10 text-blue-500" />,
      link: '/memory-game',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      id: 'speaking',
      title: 'Konuşma Pratiği',
      description: 'Telaffuzunuzu geliştirin ve konuşma becerilerinizi artırın.',
      icon: <Mic className="w-10 h-10 text-green-500" />,
      link: '/speaking',
      color: 'from-green-400 to-emerald-500'
    },
    {
      id: 'timedMatching',
      title: 'Zamanlı Eşleştirme',
      description: 'Zaman baskısı altında kelimeleri eşleştirin.',
      icon: <Clock className="w-10 h-10 text-red-500" />,
      link: '/timed-matching-game',
      color: 'from-red-400 to-pink-500'
    },
    {
      id: 'flashcard',
      title: 'Kelime Kartları',
      description: 'Kelime kartları ile kelime haznenizi genişletin.',
      icon: <BookOpen className="w-10 h-10 text-indigo-500" />,
      link: '/flashcard',
      color: 'from-indigo-400 to-violet-500'
    },
    {
      id: 'multipleChoice',
      title: 'Çoktan Seçmeli',
      description: 'Çoktan seçmeli sorularla bilginizi test edin.',
      icon: <Award className="w-10 h-10 text-amber-500" />,
      link: '/multiple-choice',
      color: 'from-amber-400 to-yellow-500'
    },
    {
      id: 'sentenceCompletion',
      title: 'Cümle Tamamlama',
      description: 'Eksik kelimeleri tamamlayarak cümle kurma becerinizi geliştirin.',
      icon: <Volume2 className="w-10 h-10 text-teal-500" />,
      link: '/sentence-completion',
      color: 'from-teal-400 to-green-500'
    },
    {
      id: 'paraphrase',
      title: 'Paraphrase Challenge',
      description: 'Cümleleri farklı şekillerde ifade etmeyi öğrenin.',
      icon: <Star className="w-10 h-10 text-purple-500" />,
      link: '/paraphrase',
      color: 'from-purple-400 to-fuchsia-500'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 rounded-3xl shadow-2xl overflow-hidden mb-12">
        <div className="absolute inset-0 bg-[url('/assets/pattern-bg.svg')] opacity-10"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-20"></div>
        
        <div className="relative z-10 px-8 py-16 md:px-16 md:py-20 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
              <span className="block">KoçWordPlay ile</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-300">
                İngilizce Öğrenmeyi Keşfet
              </span>
            </h1>
            <p className="text-lg text-purple-100 mb-8">
              Eğlenceli oyunlarla kelime haznenizi geliştirin, telaffuzunuzu iyileştirin ve İngilizce öğrenme yolculuğunuzda ilerleyin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-48">
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <span className="text-xs font-medium text-white">Ünite Seçimi</span>
                  </div>
                  <UnitSelector currentUnit={currentUnit} setCurrentUnit={setCurrentUnit} />
                </div>
              </div>
              <Link to="/memory-game" className="px-6 py-3 bg-white text-purple-700 rounded-lg font-semibold hover:bg-purple-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300 inline-block text-center">
                Hemen Başla
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div className={`absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full ${showAnimation ? 'animate-ping' : ''} opacity-30`}></div>
              <img 
                src="/assets/aaaaaaaadwü/1.png" 
                alt="KoçGames Logo" 
                className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Top Ad Banner */}
      <AdSense 
        slot="1234567890" 
        format="horizontal" 
        className="ad-banner" 
      />
      
      {/* Game Modes Section */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Oyun Modları</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gameModes.map((game) => (
            <div key={game.id} className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-90 group-hover:opacity-100 transition-opacity`}></div>
              <div className="relative z-10 p-6 h-full flex flex-col">
                <div className="mb-4">
                  {game.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
                <p className="text-white/80 mb-4 flex-grow">{game.description}</p>
                <Link 
                  to={game.link}
                  className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors duration-300 backdrop-blur-sm"
                >
                  Oyna
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom Ad Banner */}
      <AdSense 
        slot="0987654321" 
        format="rectangle" 
        className="ad-rectangle" 
      />
      
      {/* Features Section */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
            <Star className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Neden KoçGames?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Eğlenceli Öğrenme</h3>
            <p className="text-gray-600 dark:text-gray-300">Oyunlarla öğrenerek İngilizce'yi daha hızlı ve kalıcı şekilde öğrenin.</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Bilimsel Yaklaşım</h3>
            <p className="text-gray-600 dark:text-gray-300">Spaced repetition ve aktif öğrenme teknikleriyle bilimsel olarak kanıtlanmış metodlar.</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">İlerleme Takibi</h3>
            <p className="text-gray-600 dark:text-gray-300">Kişisel ilerlemenizi takip edin ve arkadaşlarınızla rekabet edin.</p>
          </div>
        </div>
      </div>
      
      {/* Side Ad Banner */}
      <AdSense 
        slot="5678901234" 
        format="vertical" 
        className="ad-sidebar" 
      />
      
      {/* Call to Action */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center shadow-xl">
        <h2 className="text-3xl font-bold text-white mb-4">Hemen Başlayın!</h2>
        <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">İngilizce öğrenme yolculuğunuzda bir sonraki seviyeye geçmeye hazır mısınız? KoçGames ile eğlenceli ve etkili bir şekilde İngilizce öğrenin.</p>
        <button className="px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300">
          Ücretsiz Kaydol
        </button>
      </div>
    </div>
  );
};

export default HomePage;