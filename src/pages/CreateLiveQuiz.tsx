import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { liveQuizService } from '../services/liveQuizService';
import { auth } from '../config/firebase'; // Firebase auth importu
import { onAuthStateChanged, User } from 'firebase/auth'; // Gerekli auth tipleri
import { Button } from '../components/ui/button';
import { Loader2, Zap } from 'lucide-react';

const CreateLiveQuiz = () => {
    const [level, setLevel] = useState('intermediate');
    const [unit, setUnit] = useState('1');
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

    const handleCreateQuiz = async () => {
        if (!user) {
            setError('Quiz oluşturmak için giriş yapmalısınız.');
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const session = await liveQuizService.createQuiz(user.uid, unit, level);
            navigate(`/live-quiz/lobby/${session.roomCode}`);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    // Bu ünite listeleri projenizin yapısına göre dinamik olarak oluşturulmalıdır.
    const units = Array.from({ length: 8 }, (_, i) => (i + 1).toString());

      return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4" style={{ paddingTop: 'calc(64px + 1rem)', marginTop: '-128px' }}>
            <div className="w-full max-w-md bg-gray-800/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-gray-700">
                <div className="text-center mb-8">
                    <Zap className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
                    <h1 className="text-4xl font-bold text-white">Canlı Quiz Oluştur</h1>
                    <p className="text-gray-400 mt-2">Öğrencileriniz için bir kelime yarışması başlatın.</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label htmlFor="level" className="block text-sm font-medium text-gray-300 mb-2">Seviye Seçin</label>
                        <select
                            id="level"
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-yellow-500"
                        >
                            <option value="intermediate">Intermediate</option>
                            <option value="upper-intermediate">Upper-Intermediate</option>
                            {/* Diğer seviyeler buraya eklenebilir */}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="unit" className="block text-sm font-medium text-gray-300 mb-2">Ünite Seçin</label>
                        <select
                            id="unit"
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-yellow-500"
                        >
                            <option value="all">Tüm Üniteler</option>
                            {units.map(u => (
                                <option key={u} value={u}>Ünite {u}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {error && <p className="text-red-400 text-center mt-4">{error}</p>}

                <div className="mt-8">
                    <Button
                        onClick={handleCreateQuiz}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold py-3 text-lg rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105"
                    >
                        {isLoading ? <Loader2 className="animate-spin w-6 h-6" /> : 'Quizi Başlat'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateLiveQuiz; 