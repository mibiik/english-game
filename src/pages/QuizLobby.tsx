import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { LiveQuizSession } from '../types';
import { Button } from '../components/ui/button';
import { Users, LogOut, Copy, Check } from 'lucide-react';
import { liveQuizService } from '../services/liveQuizService';

const QuizLobby = () => {
    const { roomCode } = useParams<{ roomCode: string }>();
    const navigate = useNavigate();
    const [session, setSession] = useState<LiveQuizSession | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

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
                setError('Bu oda artık mevcut değil.');
                setTimeout(() => navigate('/home'), 3000);
            }
        });

        return () => unsubscribe();
    }, [roomCode, navigate]);

    const handleStartGame = async () => {
        if (roomCode) {
            await liveQuizService.startGame(roomCode);
            navigate(`/live-quiz/play/host/${roomCode}`);
        }
    };

    const copyToClipboard = () => {
        if (roomCode) {
            navigator.clipboard.writeText(roomCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const players = session ? Object.values(session.players) : [];

    if (error) {
        return <div className="flex items-center justify-center min-h-screen bg-red-900 text-white text-2xl">{error}</div>;
    }

    if (!session) {
        return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Yükleniyor...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-800 to-indigo-900 text-white p-4">
            <div className="w-full max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <p className="text-lg text-purple-300">Oyuna Katılım Kodu</p>
                    <div 
                        className="text-6xl font-bold tracking-widest my-4 p-4 bg-black/30 rounded-lg inline-flex items-center gap-4 cursor-pointer"
                        onClick={copyToClipboard}
                    >
                        {roomCode}
                        <Button variant="ghost" size="icon" className="w-10 h-10">
                            {copied ? <Check className="text-green-400" /> : <Copy />}
                        </Button>
                    </div>
                    <p className="text-lg">Öğrenciler <span className="font-bold text-yellow-300">kahoot.it</span> adresine gitsin</p>
                </div>

                <div className="bg-black/20 p-6 rounded-xl shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold flex items-center"><Users className="mr-2" /> Oyuncular ({players.length})</h2>
                        <Button onClick={handleStartGame} disabled={players.length === 0} className="bg-green-500 hover:bg-green-600 font-bold text-lg px-8 py-3 rounded-lg">
                            Oyunu Başlat
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 min-h-[100px]">
                        {players.length > 0 ? (
                            players.map(player => (
                                <div key={player.id} className="bg-indigo-600 p-3 rounded-lg text-center font-semibold shadow-md">
                                    {player.nickname}
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full flex items-center justify-center text-gray-400">
                                Oyuncular bekleniyor...
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Button variant="ghost" onClick={() => navigate('/home')} className="absolute top-4 left-4">
                <LogOut className="mr-2"/> Çıkış
            </Button>
        </div>
    );
};

export default QuizLobby; 