import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { LiveQuizSession } from '../types';
import { liveQuizService } from '../services/liveQuizService';
import { Button } from '../components/ui/button';
import { ChevronRight, Loader2, Crown, Users, Timer, Trophy, Star } from 'lucide-react';

const MODERN_COLORS = [
  'from-pink-400 to-pink-600',
  'from-blue-400 to-blue-600', 
  'from-yellow-300 to-yellow-500',
  'from-green-400 to-green-600',
];
const MODERN_ICONS = ['▲', '◆', '●', '■'];

const QuizHostPlay = () => {
    const { roomCode } = useParams<{ roomCode: string }>();
    const navigate = useNavigate();
    const [session, setSession] = useState<LiveQuizSession | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [timer, setTimer] = useState(20);

    useEffect(() => {
        if (!roomCode) {
            navigate('/home');
            return;
        }
        const sessionDocRef = doc(db, 'liveQuizSessions', roomCode);
        const unsubscribe = onSnapshot(sessionDocRef, (docSnap) => {
            if (docSnap.exists()) {
                setSession(docSnap.data() as LiveQuizSession);
            } else {
                setError('Oda bulunamadı.');
                setTimeout(() => navigate('/home'), 3000);
            }
        });
        return () => unsubscribe();
    }, [roomCode, navigate]);

    // Zamanlayıcı
    useEffect(() => {
        if (!session || session.status !== 'in_progress') return;
        setTimer(20);
        const interval = setInterval(() => {
            setTimer((t) => {
                if (t <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [session?.currentQuestionIndex, session?.status]);

    const handleNext = async () => {
        if (!roomCode || !session) return;
        const nextIndex = session.currentQuestionIndex + 1;
        if (nextIndex < session.questions.length) {
            await liveQuizService.nextQuestion(roomCode, nextIndex);
        } else {
            await liveQuizService.endQuiz(roomCode);
        }
    };
    
    if (!session)   return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black" style={{ paddingTop: '64px', marginTop: '-128px' }}>
            <Loader2 className="w-16 h-16 animate-spin text-white" />
        </div>
    );
    
    if(session.status === 'finished') {
        const sortedPlayers = Object.values(session.players).sort((a, b) => b.score - a.score);
          return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 text-white p-8" style={{ paddingTop: 'calc(64px + 2rem)', marginTop: '-128px' }}>
                <div className="text-center mb-8">
                    <Crown className="w-24 h-24 mx-auto text-yellow-200 animate-bounce mb-4" />
                    <h1 className="text-6xl font-black mb-4">Oyun Bitti!</h1>
                    <p className="text-2xl opacity-90">Tebrikler, harika bir oyun oldu!</p>
                </div>
                
                <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
                    <h2 className="text-4xl font-bold text-center mb-8 flex items-center justify-center gap-3">
                        <Trophy className="w-10 h-10" />
                        Final Skor Tablosu
                    </h2>
                    
                    <div className="space-y-4">
                        {sortedPlayers.map((player, index) => (
                            <div key={player.id} className={`flex justify-between items-center p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                                index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-lg' :
                                index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-500 shadow-lg' :
                                index === 2 ? 'bg-gradient-to-r from-yellow-700 to-yellow-800 shadow-lg' :
                                'bg-white/20 backdrop-blur-sm'
                            }`}>
                                <div className="flex items-center gap-4">
                                    <div className={`text-3xl font-bold ${
                                        index === 0 ? 'text-yellow-900' :
                                        index === 1 ? 'text-gray-800' :
                                        index === 2 ? 'text-yellow-100' :
                                        'text-white'
                                    }`}>
                                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                                    </div>
                                    <span className="text-2xl font-bold">{player.nickname}</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold">{player.score}</div>
                                    <div className="text-sm opacity-80">puan</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <Button 
                    onClick={() => navigate('/home')} 
                    className="mt-8 bg-white text-black font-bold text-xl px-8 py-4 rounded-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                    Ana Menüye Dön
                </Button>
            </div>
        );
    }

    const currentQuestion = session.questions[session.currentQuestionIndex];
    if (!currentQuestion) return <div>Soru yükleniyor...</div>;

    const playerCount = Object.keys(session.players).length;

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-4 sm:p-8">
            {/* Üst Bilgi Çubuğu */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        <span className="font-bold">{playerCount} Oyuncu</span>
                    </div>
                    <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-xl px-4 py-2 flex items-center gap-2">
                        <Timer className="w-5 h-5" />
                        <span className="font-bold">{timer}s</span>
                    </div>
                </div>
                
                <div className="flex gap-2">
                    <Button 
                        onClick={handleNext} 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        Sonraki <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            </div>

            {/* Ana İçerik */}
            <div className="flex-1 flex flex-col lg:flex-row gap-8">
                {/* Sol Taraf - Soru ve Cevap Kutuları */}
                <div className="flex-1 flex flex-col">
                    {/* Soru */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-8 text-center shadow-2xl">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4">
                            {currentQuestion.questionText}
                        </h1>
                        <div className="text-xl opacity-80">
                            Soru {session.currentQuestionIndex + 1} / {session.questions.length}
                        </div>
                    </div>

                    {/* Cevap Kutuları */}
                    <div className="grid grid-cols-2 gap-6 flex-1">
                        {currentQuestion.options.map((option, index) => (
                            <div 
                                key={index} 
                                className={`bg-gradient-to-br ${MODERN_COLORS[index]} rounded-3xl p-6 flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-105`}
                            >
                                <div className="text-center">
                                    <div className="text-4xl sm:text-5xl mb-2">{MODERN_ICONS[index]}</div>
                                    <div className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">
                                        {option}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sağ Taraf - Oyuncu Listesi */}
                <div className="w-full lg:w-80">
                    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl">
                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Users className="w-6 h-6" />
                            Oyuncular
                        </h3>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {Object.values(session.players)
                                .sort((a, b) => b.score - a.score)
                                .map((player, index) => (
                                    <div key={player.id} className="flex justify-between items-center bg-white/20 rounded-xl p-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                                index === 0 ? 'bg-yellow-400 text-yellow-900' :
                                                index === 1 ? 'bg-gray-300 text-gray-800' :
                                                index === 2 ? 'bg-yellow-700 text-yellow-100' :
                                                'bg-white/30 text-white'
                                            }`}>
                                                {index + 1}
                                            </div>
                                            <span className="font-semibold truncate">{player.nickname}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold">{player.score}</div>
                                            <div className="text-xs opacity-70">puan</div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizHostPlay; 