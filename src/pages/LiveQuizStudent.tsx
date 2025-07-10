import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Users, Trophy, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { liveQuizService, Room } from '../services/liveQuizService';

const LiveQuizStudent: React.FC = () => {
  const [roomCode, setRoomCode] = useState('');
  const [studentName, setStudentName] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const navigate = useNavigate();

  // Öğrenci adını localStorage'dan yükle
  useEffect(() => {
    const savedStudentName = localStorage.getItem('student-name');
    if (savedStudentName) {
      setStudentName(savedStudentName);
    }
  }, []);

  // Odaya katıl
  const joinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!roomCode.trim() || !studentName.trim()) {
      setError('Lütfen oda kodunu ve adınızı girin');
      return;
    }

    setIsJoining(true);
    setError('');

    try {
      // Oda koduna göre oda bul
      const room = await liveQuizService.findRoomByCode(roomCode.trim());
      
      if (!room) {
        setError('Oda bulunamadı. Oda kodunu kontrol edin.');
        return;
      }

      // Öğrenci adını kaydet
      localStorage.setItem('student-name', studentName.trim());

      // Odaya katıl
      const student = await liveQuizService.joinRoom(room.id, studentName.trim());
      
      // Student ID'yi kaydet
      localStorage.setItem('current-student-id', student.id);
      
      setCurrentRoom(room);
      
      // Quiz'e yönlendir
      navigate(`/live-quiz/student/${room.id}/play`);
      
    } catch (error: any) {
      console.error('Katılım hatası:', error);
      setError(error.message || 'Odaya katılırken bir hata oluştu');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 p-4">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Live Quiz'e Katıl</h1>
          <p className="text-green-200">Öğretmeninizin verdiği kodu girin</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
        >
          <form onSubmit={joinRoom} className="space-y-6">
            {/* Oda Kodu */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Oda Kodu
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="6 haneli kod girin..."
                maxLength={6}
                className="w-full px-4 py-4 bg-white/20 border border-white/30 rounded-lg text-white text-center text-2xl font-bold placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 uppercase"
              />
            </div>

            {/* Öğrenci Adı */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Adınız
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Adınızı girin..."
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Hata Mesajı */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 flex items-center gap-2"
              >
                <AlertCircle className="w-5 h-5 text-red-300" />
                <span className="text-red-200 text-sm">{error}</span>
              </motion.div>
            )}

            {/* Katıl Butonu */}
            <button
              type="submit"
              disabled={isJoining || !roomCode.trim() || !studentName.trim()}
              className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all"
            >
              {isJoining ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Katılıyor...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Quiz'e Katıl
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Bilgilendirme Kartları */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 grid grid-cols-1 gap-4"
        >
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-green-300" />
              <div>
                <h3 className="text-white font-semibold">Canlı Yarışma</h3>
                <p className="text-green-200 text-sm">Sınıf arkadaşlarınızla yarışın</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-300" />
              <div>
                <h3 className="text-white font-semibold">Skor Tablosu</h3>
                <p className="text-green-200 text-sm">Gerçek zamanlı liderlik tablosu</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Nasıl Oynanır */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-center"
        >
          <h4 className="text-white font-semibold mb-2">Nasıl Oynanır?</h4>
          <div className="space-y-1 text-green-200 text-sm">
            <p>1. Öğretmeninizin verdiği 6 haneli kodu girin</p>
            <p>2. Adınızı yazın ve katıl butonuna basın</p>
            <p>3. Quiz başlayınca sorulara hızlı cevap verin</p>
            <p>4. En yüksek skoru alın ve kazanın! 🏆</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LiveQuizStudent; 