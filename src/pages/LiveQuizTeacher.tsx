import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Play, Settings, Trophy, Copy, Check, RefreshCw, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { liveQuizService, Room } from '../services/liveQuizService';

const LiveQuizTeacher: React.FC = () => {
  const [teacherName, setTeacherName] = useState('');
  const [selectedWordList, setSelectedWordList] = useState('all');
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const navigate = useNavigate();

  // Öğretmen adını localStorage'dan yükle
  useEffect(() => {
    const savedTeacherName = localStorage.getItem('teacher-name');
    if (savedTeacherName) {
      setTeacherName(savedTeacherName);
    }
  }, []);

  // Real-time room updates
  useEffect(() => {
    if (!currentRoom) return;

    const unsubscribe = liveQuizService.subscribeToRoom(currentRoom.id, (updatedRoom: Room | null) => {
      if (updatedRoom) {
        setCurrentRoom(updatedRoom);
      }
    });

    return () => unsubscribe();
  }, [currentRoom?.id]);

  // Oda kodunu kopyala
  const copyRoomCode = async () => {
    if (currentRoom?.code) {
      await navigator.clipboard.writeText(currentRoom.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Yeni oda oluştur
  const createRoom = async () => {
    if (!teacherName.trim()) {
      alert('Lütfen öğretmen adınızı girin');
      return;
    }

    setIsCreating(true);
    try {
      // Öğretmen adını kaydet
      localStorage.setItem('teacher-name', teacherName);

      const room = await liveQuizService.createRoom({
        teacherName: teacherName.trim(),
        wordListName: selectedWordList
      });

      setCurrentRoom(room);
    } catch (error) {
      console.error('Oda oluşturma hatası:', error);
      alert('Oda oluşturulurken bir hata oluştu');
    } finally {
      setIsCreating(false);
    }
  };

  // Quiz'i başlat
  const startQuiz = async () => {
    if (!currentRoom) return;

    try {
      await liveQuizService.startQuiz(currentRoom.id);
      navigate(`/live-quiz/teacher/${currentRoom.id}/play`);
    } catch (error) {
      console.error('Quiz başlatma hatası:', error);
      alert('Quiz başlatılırken bir hata oluştu');
    }
  };

  // Odayı kapat
  const closeRoom = async () => {
    if (!currentRoom) return;

    if (confirm('Odayı kapatmak istediğinizden emin misiniz?')) {
      try {
        await liveQuizService.closeRoom(currentRoom.id);
        setCurrentRoom(null);
      } catch (error) {
        console.error('Oda kapatma hatası:', error);
      }
    }
  };

  // Eğer oda oluşturulmuşsa, oda yönetim ekranını göster
  if (currentRoom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-2">Live Quiz Odası</h1>
            <p className="text-blue-200">Öğrenciler katılmayı bekliyor...</p>
          </motion.div>

          {/* Oda Bilgileri */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-6 border border-white/20"
          >
            <div className="grid md:grid-cols-3 gap-6">
              {/* Oda Kodu */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Oda Kodu</h3>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl font-bold text-yellow-300 bg-black/30 px-4 py-2 rounded-lg">
                    {currentRoom.code}
                  </span>
                  <button
                    onClick={copyRoomCode}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  >
                    {copiedCode ? (
                      <Check className="w-5 h-5 text-green-300" />
                    ) : (
                      <Copy className="w-5 h-5 text-white" />
                    )}
                  </button>
                </div>
              </div>

              {/* Katılımcı Sayısı */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Katılımcılar</h3>
                <div className="flex items-center justify-center gap-2">
                  <Users className="w-6 h-6 text-blue-300" />
                  <span className="text-2xl font-bold text-white">
                    {currentRoom.students.length}
                  </span>
                </div>
              </div>

              {/* Kelime Listesi */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Kelime Listesi</h3>
                <span className="text-lg text-blue-200 capitalize">
                  {currentRoom.wordListName === 'all' ? 'Tüm Kelimeler' : currentRoom.wordListName}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Katılımcı Listesi */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Katılımcılar
            </h3>
            
            {currentRoom.students.length === 0 ? (
              <div className="text-center py-8">
                <Eye className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-300">Henüz kimse katılmadı...</p>
                <p className="text-sm text-gray-400 mt-1">
                  Öğrenciler {currentRoom.code} kodunu kullanarak katılabilir
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {currentRoom.students.map((student, index) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/10 rounded-lg p-3 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white font-medium">{student.name}</span>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Kontrol Butonları */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 justify-center"
          >
            <button
              onClick={startQuiz}
              disabled={currentRoom.students.length === 0}
              className="px-8 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold rounded-lg flex items-center gap-2 transition-colors"
            >
              <Play className="w-5 h-5" />
              Quiz'i Başlat
            </button>
            
            <button
              onClick={closeRoom}
              className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors"
            >
              Odayı Kapat
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Oda oluşturma ekranı
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Live Quiz Oluştur</h1>
          <p className="text-blue-200">Öğrencilerinizle canlı kelime yarışması yapın</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
        >
          <div className="space-y-6">
            {/* Öğretmen Adı */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Öğretmen Adı
              </label>
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                placeholder="Adınızı girin..."
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Kelime Listesi Seçimi */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Kelime Listesi
              </label>
              <select
                value={selectedWordList}
                onChange={(e) => setSelectedWordList(e.target.value)}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="all" className="text-black">Tüm Kelimeler</option>
                <option value="unit1" className="text-black">Unit 1</option>
                <option value="unit2" className="text-black">Unit 2</option>
                <option value="unit3" className="text-black">Unit 3</option>
                <option value="unit4" className="text-black">Unit 4</option>
                <option value="difficult" className="text-black">Zor Kelimeler</option>
              </select>
            </div>

            {/* Oluştur Butonu */}
            <button
              onClick={createRoom}
              disabled={isCreating || !teacherName.trim()}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all"
            >
              {isCreating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Oda Oluşturuluyor...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Canlı Quiz Odası Oluştur
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Bilgilendirme */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-center"
        >
          <p className="text-blue-200 text-sm">
            Oda oluşturduktan sonra öğrencileriniz oda kodunu kullanarak katılabilir
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LiveQuizTeacher; 