import { supabase } from '../config/supabase';
import { WordDetail } from '../data/words';
import { detailedWords_part1 as upperIntermediateWords } from '../data/word4';
import { newDetailedWords_part1 as intermediateWords } from '../data/words';
// Diğer kelime seviyelerini de buraya ekleyebilirsiniz.
// import { foundationWords } from '../data/word1';
// import { preIntermediateWords } from '../data/word2';

import { LiveQuizSession, QuizQuestion, QuizPlayer, QuizStatus } from '../types';

const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const getWordsByLevel = (level: string): WordDetail[] => {
    switch (level) {
        case 'intermediate':
            return intermediateWords;
        case 'upper-intermediate':
            return upperIntermediateWords;
        // Diğer seviyeler için case'ler eklenebilir
        default:
            return intermediateWords;
    }
}

class LiveQuizService {
    private sessionsCollection = collection(db, 'liveQuizSessions');

    private generateRoomCode(): string {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    private createQuizQuestions(wordsForUnit: WordDetail[], allWords: WordDetail[]): QuizQuestion[] {
    const questions: QuizQuestion[] = [];
        const shuffledWords = shuffleArray(wordsForUnit);

        for (const word of shuffledWords) {
            const correctAnswer = word.turkish;
            
            // Yanlış şıkları oluştur
            const wrongOptions = shuffleArray(allWords.filter(w => w.headword !== word.headword))
                .slice(0, 3)
                .map(w => w.turkish);

            const options = shuffleArray([correctAnswer, ...wrongOptions]);

            questions.push({
                questionText: word.headword,
                options,
                correctAnswer,
                wordDetail: word,
            });
        }
        return questions;
    }

    async createQuiz(hostId: string, unit: string, level: string): Promise<LiveQuizSession> {
    const roomCode = this.generateRoomCode();
        const wordsForLevel = getWordsByLevel(level);
        const wordsForUnit = wordsForLevel.filter(w => w.unit === unit || unit === 'all');
    
        if (wordsForUnit.length < 4) {
            throw new Error('Bu ünite için yeterli kelime bulunamadı (en az 4 kelime gerekir).');
        }
    
        const questions = this.createQuizQuestions(wordsForUnit, wordsForLevel);

        const newSession: LiveQuizSession = {
      roomCode,
            hostId,
      status: 'waiting',
            currentQuestionIndex: -1, // Oyun henüz başlamadı
      questions,
            players: {},
      createdAt: Date.now(),
            unit,
            level,
        };

        const sessionDocRef = doc(this.sessionsCollection, roomCode);
        await setDoc(sessionDocRef, newSession);

        return newSession;
    }

    async joinQuiz(roomCode: string, playerId: string, nickname: string): Promise<LiveQuizSession | null> {
        const sessionDocRef = doc(this.sessionsCollection, roomCode);
        const sessionSnap = await getDoc(sessionDocRef);

        if (!sessionSnap.exists() || sessionSnap.data().status !== 'waiting') {
            console.error('Oturum bulunamadı veya katılım için kapalı.');
            return null;
        }

        const newPlayer: QuizPlayer = {
            id: playerId,
            nickname,
            score: 0,
            streak: 0,
        };

        await updateDoc(sessionDocRef, {
            [`players.${playerId}`]: newPlayer
        });

        const updatedSessionSnap = await getDoc(sessionDocRef);
        return updatedSessionSnap.data() as LiveQuizSession;
    }

    async startGame(roomCode: string): Promise<void> {
        const sessionDocRef = doc(this.sessionsCollection, roomCode);
        await updateDoc(sessionDocRef, {
            status: 'in_progress',
            currentQuestionIndex: 0
        });
    }

    async nextQuestion(roomCode: string, newIndex: number): Promise<void> {
        const sessionDocRef = doc(this.sessionsCollection, roomCode);
        await updateDoc(sessionDocRef, {
            status: 'in_progress',
            currentQuestionIndex: newIndex
        });
    }

    async submitAnswer(roomCode: string, playerId: string, answer: string): Promise<void> {
        const sessionDocRef = doc(this.sessionsCollection, roomCode);
        const sessionSnap = await getDoc(sessionDocRef);
        if (!sessionSnap.exists()) return;

        const session = sessionSnap.data() as LiveQuizSession;
        const question = session.questions[session.currentQuestionIndex];
        const player = session.players[playerId];

        if (!question || !player) return;

        const isCorrect = question.correctAnswer === answer;
        const scoreToAdd = isCorrect ? 100 + (player.streak * 10) : 0;
        const newStreak = isCorrect ? player.streak + 1 : 0;

        await updateDoc(sessionDocRef, {
            [`players.${playerId}.score`]: player.score + scoreToAdd,
            [`players.${playerId}.streak`]: newStreak,
            [`players.${playerId}.answeredCorrectly`]: isCorrect,
        });
    }

    async endQuiz(roomCode: string): Promise<void> {
        const sessionDocRef = doc(this.sessionsCollection, roomCode);
        await updateDoc(sessionDocRef, {
            status: 'finished'
        });
  }
}

export const liveQuizService = new LiveQuizService(); 