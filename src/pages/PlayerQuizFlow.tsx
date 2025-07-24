import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../config/firebase'; // auth import eklendi
import { LiveQuizSession } from '../types';
import { Loader2 } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { liveQuizService } from '../services/liveQuizService';

const PlayerLobby = () => {
    return (
        <div className="text-center">
            <h2 className="text-4xl font-bold">Lobiye Katıldın!</h2>
            <p className="text-xl mt-4 text-gray-300">Harika! Sunucunun oyunu başlatmasını bekle.</p>
            <Loader2 className="w-12 h-12 mx-auto mt-8 animate-spin text-purple-400" />
        </div>
    );
};

const MODERN_COLORS = [
  'from-pink-400 to-pink-600',
  'from-blue-400 to-blue-600',
  'from-yellow-300 to-yellow-500',
  'from-green-400 to-green-600',
];
const MODERN_ICONS = ['▲', '◆', '●', '■'];

const PlayerPlayScreen = ({ session }: { session: LiveQuizSession }) => {
    const { roomCode } = useParams<{ roomCode: string }>();
    const [user] = useAuthState(auth);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [timer, setTimer] = useState(20);

    const me = user ? session.players[user.uid] : null;
    const question = session.questions[session.currentQuestionIndex];

    // Zamanlayıcı
    useEffect(() => {
        setTimer(20);
        if (selectedAnswer) return;
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
    }, [session.currentQuestionIndex, selectedAnswer]);

    // Cevap sonrası animasyon
    useEffect(() => {
        if (me?.answeredCorrectly !== undefined && selectedAnswer) {
            setShowFeedback(true);
            const timeout = setTimeout(() => {
                setShowFeedback(false);
                setSelectedAnswer(null);
            }, 1200);
            return () => clearTimeout(timeout);
        }
    }, [me?.answeredCorrectly, selectedAnswer]);

    const handleAnswerClick = (answer: string) => {
        if (!user || !roomCode || selectedAnswer) return;
        setSelectedAnswer(answer);
        liveQuizService.submitAnswer(roomCode, user.uid, answer);
    };

    // Sıralama ve skor
    const sortedPlayers = Object.values(session.players).sort((a, b) => b.score - a.score);
    const myRank = user ? sortedPlayers.findIndex(p => p.id === user.uid) + 1 : 0;
    const myScore = me?.score || 0;

    // Geri bildirim animasyonu
    if (showFeedback && me?.answeredCorrectly !== undefined && selectedAnswer) {
        return (
            <div className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-500 ${me.answeredCorrectly ? 'bg-gradient-to-br from-green-300 to-green-600' : 'bg-gradient-to-br from-red-300 to-red-600'}`}>
                <div className="text-7xl font-black mb-4 animate-bounce">{me.answeredCorrectly ? '✔️' : '❌'}</div>
                <h1 className="text-5xl font-bold mb-2">{me.answeredCorrectly ? 'Doğru!' : 'Yanlış!'}</h1>
                <p className="text-2xl">Puan: {myScore}</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-2 sm:p-6">
            {/* Üstte skor ve sıra */}
            <div className="flex justify-between items-center w-full max-w-lg mb-4">
                <div className="bg-white/80 rounded-xl px-4 py-2 text-lg font-bold text-gray-800 shadow">
                    Skor: {myScore}
                </div>
                <div className="bg-white/80 rounded-xl px-4 py-2 text-lg font-bold text-gray-800 shadow">
                    Sıra: {myRank}
                </div>
                <div className="bg-gradient-to-r from-indigo-400 to-indigo-600 text-white rounded-xl px-4 py-2 text-lg font-bold shadow flex items-center gap-2">
                    <span className="material-icons">timer</span> {timer}s
                </div>
            </div>
            {/* Soru başlığı */}
            <div className="w-full max-w-2xl text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 bg-white/80 rounded-2xl py-4 px-2 shadow-lg mb-2">
                    {question.questionText}
                </h2>
            </div>
            {/* Cevap butonları */}
            <div className="grid grid-cols-2 grid-rows-2 gap-6 w-full max-w-2xl">
                {question.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleAnswerClick(option)}
                        disabled={!!selectedAnswer}
                        className={`relative flex flex-col items-center justify-center h-32 sm:h-40 rounded-2xl text-3xl sm:text-4xl font-bold shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-300 bg-gradient-to-br ${MODERN_COLORS[index]} ${selectedAnswer ? 'opacity-60' : ''}`}
                    >
                        <span className="absolute top-2 left-2 text-2xl opacity-60">{MODERN_ICONS[index]}</span>
                        <span className="z-10 text-white drop-shadow-lg text-center px-2">{option}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

const PlayerQuizFlow = () => {
    const { roomCode } = useParams<{ roomCode: string }>();
    const navigate = useNavigate();
    const [session, setSession] = useState<LiveQuizSession | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [user] = useAuthState(auth);


    useEffect(() => {
        if (!roomCode) {
            navigate('/home');
            return;
        }

        const sessionDocRef = doc(db, 'liveQuizSessions', roomCode);
        const unsubscribe = onSnapshot(sessionDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const sessionData = docSnap.data() as LiveQuizSession;
                setSession(sessionData);
            } else {
                setError('Oda bulunamadı.');
                setTimeout(() => navigate('/join-quiz'), 3000);
            }
        });

        return () => unsubscribe();
    }, [roomCode, navigate]);

    const renderContent = () => {
        if (!session) {
            return <Loader2 className="w-16 h-16 animate-spin text-white" />;
        }
        if (error) {
            return <p className="text-red-500 text-2xl">{error}</p>
        }

        switch (session.status) {
            case 'waiting':
                return <PlayerLobby />;
            case 'in_progress':
                return <PlayerPlayScreen session={session} />;
            case 'finished':
                const sortedPlayers = Object.values(session.players).sort((a, b) => b.score - a.score);
                const myRank = user ? sortedPlayers.findIndex(p => p.id === user.uid) + 1 : 0;
                const myFinalScore = user ? session.players[user.uid]?.score : 0;
                return (
                    <div className="text-center">
                        <h2 className="text-5xl font-bold">Oyun Bitti!</h2>
                        <p className="text-3xl mt-4">Skorun: {myFinalScore}</p>
                        <p className="text-3xl mt-2">Sıralaman: {myRank > 0 ? myRank : 'N/A'}</p>
                    </div>
                )
            default:
                return <PlayerLobby />;
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-800 to-purple-900 text-white">
            {renderContent()}
        </div>
    );
};

export default PlayerQuizFlow; 