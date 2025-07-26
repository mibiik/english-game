import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { liveQuizService } from '../services/liveQuizService';
import { auth } from '../config/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Button } from '../components/ui/button';
import { Loader2, Hash, User as UserIcon } from 'lucide-react';

const JoinQuiz = () => {
    const [roomCode, setRoomCode] = useState('');
    const [nickname, setNickname] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleJoinQuiz = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            setError('Oyuna katılmak için giriş yapmalısınız.');
            return;
        }
        if (!roomCode || !nickname) {
            setError('Lütfen tüm alanları doldurun.');
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const session = await liveQuizService.joinQuiz(roomCode.toUpperCase(), user.uid, nickname);
            if (session) {
                // Oyuncu oyun lobisine veya doğrudan oyun ekranına yönlendirilebilir.
                // Şimdilik lobiye yönlendirelim.
                navigate(`/live-quiz/player-lobby/${session.roomCode}`);
            } else {
                setError('Geçersiz oda kodu veya oda katılıma kapalı.');
            }
        } catch (err) {
            console.error(err);
            setError('Odaya katılırken bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4">
            <div className="w-full max-w-sm bg-gray-800/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-gray-700 text-center">
                <h1 className="text-4xl font-bold text-white mb-2">Kahoot!</h1>
                <p className="text-gray-400 mb-8">Canlı Quize Katıl</p>

                <form onSubmit={handleJoinQuiz} className="space-y-6">
                    <div className="relative">
                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Oda Kodu"
                            value={roomCode}
                            onChange={(e) => setRoomCode(e.target.value)}
                            className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-3 pl-10 focus:ring-2 focus:ring-purple-500 uppercase"
                            maxLength={6}
                        />
                    </div>
                    <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Takma Ad"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-3 pl-10 focus:ring-2 focus:ring-purple-500"
                            maxLength={15}
                        />
                    </div>
                    
                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 text-lg rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
                    >
                        {isLoading ? <Loader2 className="animate-spin w-6 h-6 mx-auto" /> : 'Katıl'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default JoinQuiz; 