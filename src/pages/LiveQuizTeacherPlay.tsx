import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipForward, 
  Users, 
  Trophy, 
  Clock, 
  CheckCircle, 
  XCircle,
  BarChart3,
  Home,
  Crown
} from 'lucide-react';
import { liveQuizService, Room, QuizQuestion } from '../services/liveQuizService';

const LiveQuizTeacherPlay: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isActive, setIsActive] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Firebase'den room dinle
  useEffect(() => {
    if (!roomId) return;

    const unsubscribe = liveQuizService.subscribeToRoom(roomId, (updatedRoom) => {
      if (updatedRoom) {
        setRoom(updatedRoom);
        
        // Mevcut soruyu güncelle
        if (updatedRoom.currentQuestionIndex >= 0 && updatedRoom.questions[updatedRoom.currentQuestionIndex]) {
          setCurrentQuestion(updatedRoom.questions[updatedRoom.currentQuestionIndex]);
        }

        // Quiz durumuna göre timer'ı kontrol et
        if (updatedRoom.status === 'playing' && updatedRoom.currentQuestionIndex >= 0) {
          setIsActive(true);
          setTimeLeft(15);
        }
      } else {
        navigate('/live-quiz-teacher');
      }
    });

    return () => unsubscribe();
  }, [roomId, navigate]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setShowResults(true);
      // Liderlik tablosunu güncelle
      if (roomId) {
        liveQuizService.updateLeaderboard(roomId);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, roomId]);

  // Sonraki soruya geç
  const handleNextQuestion = async () => {
    if (!roomId || !room) return;

    try {
      setShowResults(false);
      await liveQuizService.nextQuestion(roomId);
      
      // Eğer quiz bittiyse
      if (room.currentQuestionIndex + 1 >= room.questions.length) {
        setIsActive(false);
        await liveQuizService.updateLeaderboard(roomId);
      } else {
        setTimeLeft(15);
        setIsActive(true);
      }
    } catch (error) {
      console.error('Sonraki soru hatası:', error);
    }
  };

  // Timer'ı duraklat/başlat
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  // Quiz'i bitir
  const finishQuiz = async () => {
    if (!roomId) return;
    
    try {
      await liveQuizService.closeRoom(roomId);
      navigate('/live-quiz-teacher');
    } catch (error) {
      console.error('Quiz bitiş hatası:', error);
    }
  };

  if (!room || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white mx-auto mb-4"></div>
          <p>Quiz yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Quiz bitti mi?
  const isQuizFinished = room.status === 'finished';

  // Öğrenci cevap istatistikleri
  const getAnswerStats = () => {
    if (!currentQuestion) return { total: 0, answered: 0, correct: 0 };
    
    const answered = room.students.filter(s => s.currentAnswer).length;
    const correct = room.students.filter(s => s.currentAnswer === currentQuestion.correctAnswer).length;
    
    return {
      total: room.students.length,
      answered,
      correct
    };
  };

  const stats = getAnswerStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-white">
            <h1 className="text-3xl font-bold">Canlı Quiz Kontrolü</h1>
            <p className="text-blue-200">Oda: {room.code}</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/live-quiz-teacher')}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Ana Sayfa
            </button>
            
            <button
              onClick={finishQuiz}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              Quiz'i Bitir
            </button>
          </div>
        </div>

        {!isQuizFinished ? (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Sol: Soru ve Kontroller */}
            <div className="lg:col-span-2 space-y-6">
              {/* Soru Kartı */}
              <motion.div
                key={room.currentQuestionIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">
                      Soru {room.currentQuestionIndex + 1} / {room.questions.length}
                    </h2>
                    <p className="text-3xl font-bold text-blue-200 mb-4">
                      {currentQuestion.definition}
                    </p>
                  </div>
                  
                  {/* Timer */}
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${timeLeft <= 5 ? 'text-red-400' : 'text-white'}`}>
                      {timeLeft}
                    </div>
                    <div className="text-sm text-gray-300">saniye</div>
                  </div>
                </div>

                {/* Seçenekler */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {currentQuestion.options.map((option, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 text-center font-semibold ${
                        option === currentQuestion.correctAnswer
                          ? 'bg-green-500/20 border-green-400 text-green-200'
                          : 'bg-white/5 border-white/20 text-white'
                      }`}
                    >
                      {String.fromCharCode(65 + index)}) {option}
                    </div>
                  ))}
                </div>

                {/* Kontroller */}
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={toggleTimer}
                    className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 ${
                      isActive 
                        ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    {isActive ? 'Duraklat' : 'Başlat'}
                  </button>

                  <button
                    onClick={handleNextQuestion}
                    disabled={room.currentQuestionIndex + 1 >= room.questions.length}
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white rounded-lg font-bold flex items-center gap-2"
                  >
                    <SkipForward className="w-5 h-5" />
                    {room.currentQuestionIndex + 1 >= room.questions.length ? 'Son Soru' : 'Sonraki'}
                  </button>
                </div>
              </motion.div>

              {/* İstatistikler */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Cevap İstatistikleri
                </h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-300">{stats.total}</div>
                    <div className="text-sm text-gray-300">Toplam</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-300">{stats.answered}</div>
                    <div className="text-sm text-gray-300">Cevaplanan</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-300">{stats.correct}</div>
                    <div className="text-sm text-gray-300">Doğru</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-300 mb-1">
                    <span>Cevaplama Oranı</span>
                    <span>{Math.round((stats.answered / stats.total) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(stats.answered / stats.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sağ: Liderlik Tablosu */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Liderlik Tablosu
              </h3>
              
              <div className="space-y-3">
                {room.students
                  .sort((a, b) => b.score - a.score)
                  .map((student, index) => (
                    <motion.div
                      key={student.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-3 rounded-lg flex items-center gap-3 ${
                        index === 0 ? 'bg-yellow-500/20 border border-yellow-400/30' :
                        index === 1 ? 'bg-gray-400/20 border border-gray-400/30' :
                        index === 2 ? 'bg-orange-500/20 border border-orange-400/30' :
                        'bg-white/5'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0 ? 'bg-yellow-500 text-black' :
                        index === 1 ? 'bg-gray-400 text-black' :
                        index === 2 ? 'bg-orange-500 text-black' :
                        'bg-blue-500 text-white'
                      }`}>
                        {index === 0 ? <Crown className="w-4 h-4" /> : index + 1}
                      </div>
                      
                      <div className="flex-1">
                        <div className="font-semibold text-white">{student.name}</div>
                        <div className="text-sm text-gray-300">{student.score} puan</div>
                      </div>
                      
                      {student.currentAnswer === currentQuestion.correctAnswer ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : student.currentAnswer ? (
                        <XCircle className="w-5 h-5 text-red-400" />
                      ) : (
                        <Clock className="w-5 h-5 text-gray-400" />
                      )}
                    </motion.div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          /* Quiz Bitti Ekranı */
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 max-w-2xl mx-auto"
            >
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
              <h2 className="text-4xl font-bold text-white mb-4">Quiz Tamamlandı!</h2>
              <p className="text-xl text-blue-200 mb-8">Tüm sorular cevaplanDı</p>
              
              {/* Final Sıralaması */}
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-white">Final Sıralaması</h3>
                {room.students
                  .sort((a, b) => b.score - a.score)
                  .slice(0, 3)
                  .map((student, index) => (
                    <div key={student.id} className={`p-4 rounded-lg ${
                      index === 0 ? 'bg-yellow-500/20' :
                      index === 1 ? 'bg-gray-400/20' :
                      'bg-orange-500/20'
                    }`}>
                      <span className="text-2xl">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </span>
                      <span className="text-white font-bold ml-3">{student.name}</span>
                      <span className="text-blue-200 ml-3">- {student.score} puan</span>
                    </div>
                  ))}
              </div>
              
              <button
                onClick={() => navigate('/live-quiz-teacher')}
                className="mt-8 px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold"
              >
                Yeni Quiz Oluştur
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveQuizTeacherPlay; 