import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Trophy, 
  Users, 
  CheckCircle, 
  XCircle, 
  Timer,
  Crown,
  Home,
  Zap
} from 'lucide-react';
import { liveQuizService, Room, QuizQuestion } from '../services/liveQuizService';

const LiveQuizStudentPlay: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [hasAnswered, setHasAnswered] = useState(false);
  const [studentId, setStudentId] = useState<string>('');
  const [myScore, setMyScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);

  // Student ID'yi localStorage'dan al
  useEffect(() => {
    const saved = localStorage.getItem('current-student-id');
    if (saved) {
      setStudentId(saved);
    }
  }, []);

  // Firebase'den room dinle
  useEffect(() => {
    if (!roomId) return;

    const unsubscribe = liveQuizService.subscribeToRoom(roomId, (updatedRoom) => {
      if (updatedRoom) {
        setRoom(updatedRoom);
        
        // Mevcut soruyu güncelle
        if (updatedRoom.currentQuestionIndex >= 0 && updatedRoom.questions[updatedRoom.currentQuestionIndex]) {
          const newQuestion = updatedRoom.questions[updatedRoom.currentQuestionIndex];
          
          // Eğer yeni soru geldi ise cevap durumunu sıfırla
          if (currentQuestion?.id !== newQuestion.id) {
            setCurrentQuestion(newQuestion);
            setSelectedAnswer('');
            setHasAnswered(false);
            setTimeLeft(15);
          }
        }

        // Öğrenci skorunu güncelle
        const myData = updatedRoom.students.find(s => s.id === studentId);
        if (myData) {
          setMyScore(myData.score);
        }
      } else {
        navigate('/live-quiz-student');
      }
    });

    return () => unsubscribe();
  }, [roomId, navigate, studentId, currentQuestion?.id]);

  // Timer (sadece görsel, gerçek kontrol server'da)
  useEffect(() => {
    if (hasAnswered) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [hasAnswered, currentQuestion?.id]);

  // Cevap gönder
  const handleAnswerSubmit = async (answer: string) => {
    if (!roomId || !studentId || hasAnswered) return;

    try {
      setSelectedAnswer(answer);
      setHasAnswered(true);
      
      await liveQuizService.submitAnswer(roomId, studentId, answer);
    } catch (error) {
      console.error('Cevap gönderme hatası:', error);
      setHasAnswered(false);
      setSelectedAnswer('');
    }
  };

  if (!room || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white mx-auto mb-4"></div>
          <p>Quiz bekleniyor...</p>
        </div>
      </div>
    );
  }

  // Quiz bitti mi?
  const isQuizFinished = room.status === 'finished';
  
  // Benim sıram
  const myRank = room.students
    .sort((a, b) => b.score - a.score)
    .findIndex(s => s.id === studentId) + 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-white">
            <h1 className="text-2xl font-bold">Canlı Quiz</h1>
            <p className="text-green-200">Oda: {room.code}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right text-white">
              <div className="text-sm text-gray-300">Skorun</div>
              <div className="text-2xl font-bold text-yellow-300">{myScore}</div>
            </div>
            
            <div className="text-right text-white">
              <div className="text-sm text-gray-300">Sıran</div>
              <div className="text-2xl font-bold text-blue-300">#{myRank}</div>
            </div>
          </div>
        </div>

        {!isQuizFinished ? (
          <div className="space-y-6">
            {/* Soru Kartı */}
            <motion.div
              key={room.currentQuestionIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center"
            >
              {/* Üst Bilgiler */}
              <div className="flex justify-between items-center mb-6">
                <div className="text-white">
                  <span className="text-lg font-semibold">
                    Soru {room.currentQuestionIndex + 1} / {room.questions.length}
                  </span>
                </div>
                
                {/* Timer */}
                <div className={`flex items-center gap-2 ${timeLeft <= 5 ? 'text-red-400' : 'text-white'}`}>
                  <Timer className="w-5 h-5" />
                  <span className="text-2xl font-bold">{timeLeft}</span>
                </div>
              </div>

              {/* Soru */}
              <h2 className="text-3xl font-bold text-white mb-8">
                "{currentQuestion.definition}" anlamına gelen kelime hangisidir?
              </h2>

              {/* Seçenekler */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = option === currentQuestion.correctAnswer;
                  const showResult = hasAnswered;
                  
                  let buttonClass = 'p-6 rounded-xl font-bold text-xl transition-all duration-300 border-2 ';
                  
                  if (showResult) {
                    if (isCorrect) {
                      buttonClass += 'bg-green-500/30 border-green-400 text-green-100';
                    } else if (isSelected && !isCorrect) {
                      buttonClass += 'bg-red-500/30 border-red-400 text-red-100';
                    } else {
                      buttonClass += 'bg-gray-500/20 border-gray-500 text-gray-300';
                    }
                  } else {
                    buttonClass += 'bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 cursor-pointer';
                  }

                  return (
                    <motion.button
                      key={index}
                      whileHover={!hasAnswered ? { scale: 1.02 } : {}}
                      whileTap={!hasAnswered ? { scale: 0.98 } : {}}
                      onClick={() => !hasAnswered && handleAnswerSubmit(option)}
                      disabled={hasAnswered}
                      className={buttonClass}
                    >
                      <div className="flex items-center justify-center gap-3">
                        <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span>{option}</span>
                        
                        {showResult && isCorrect && <CheckCircle className="w-6 h-6 text-green-400" />}
                        {showResult && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-400" />}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Durum Mesajı */}
              {hasAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-lg bg-white/10"
                >
                  {selectedAnswer === currentQuestion.correctAnswer ? (
                    <div className="text-green-300 font-bold flex items-center justify-center gap-2">
                      <CheckCircle className="w-6 h-6" />
                      Doğru! +100 puan
                    </div>
                  ) : (
                    <div className="text-red-300 font-bold flex items-center justify-center gap-2">
                      <XCircle className="w-6 h-6" />
                      Yanlış! Doğru cevap: {currentQuestion.correctAnswer}
                    </div>
                  )}
                </motion.div>
              )}

              {!hasAnswered && (
                <div className="mt-6 text-blue-200">
                  Bir seçenek seçin
                </div>
              )}
            </motion.div>

            {/* Mini Liderlik Tablosu */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Liderlik Tablosu (İlk 5)
              </h3>
              
              <div className="space-y-2">
                {room.students
                  .sort((a, b) => b.score - a.score)
                  .slice(0, 5)
                  .map((student, index) => (
                    <div 
                      key={student.id}
                      className={`p-3 rounded-lg flex items-center gap-3 ${
                        student.id === studentId ? 'bg-blue-500/20 border border-blue-400' : 'bg-white/5'
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
                      
                      <div className="flex-1 flex justify-between items-center">
                        <span className={`font-semibold ${student.id === studentId ? 'text-blue-200' : 'text-white'}`}>
                          {student.name} {student.id === studentId && '(Sen)'}
                        </span>
                        <span className="text-gray-300">{student.score} puan</span>
                      </div>
                    </div>
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
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20"
            >
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
              <h2 className="text-4xl font-bold text-white mb-4">Quiz Tamamlandı!</h2>
              
              {/* Kişisel Sonuç */}
              <div className="mb-8 p-6 bg-white/10 rounded-xl">
                <h3 className="text-2xl font-semibold text-white mb-4">Senin Sonucun</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-3xl font-bold text-yellow-300">{myScore}</div>
                    <div className="text-gray-300">Toplam Puan</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-300">#{myRank}</div>
                    <div className="text-gray-300">Sıralaman</div>
                  </div>
                </div>
              </div>

              {/* Top 3 */}
              <div className="space-y-4 mb-8">
                <h3 className="text-2xl font-semibold text-white">İlk 3</h3>
                {room.students
                  .sort((a, b) => b.score - a.score)
                  .slice(0, 3)
                  .map((student, index) => (
                    <motion.div 
                      key={student.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className={`p-4 rounded-lg ${
                        index === 0 ? 'bg-yellow-500/20' :
                        index === 1 ? 'bg-gray-400/20' :
                        'bg-orange-500/20'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </span>
                        <div className="flex-1 text-left">
                          <div className="text-white font-bold">
                            {student.name} {student.id === studentId && '(Sen)'}
                          </div>
                          <div className="text-blue-200">{student.score} puan</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
              
              <button
                onClick={() => navigate('/live-quiz-student')}
                className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold flex items-center gap-2 mx-auto"
              >
                <Home className="w-5 h-5" />
                Ana Sayfa
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveQuizStudentPlay; 