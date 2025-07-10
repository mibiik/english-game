import { db } from '../config/firebase';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { newDetailedWords_part1 as foundationWords } from '../data/word1';
import { newDetailedWords_part1 as preIntermediateWords } from '../data/word2';
import { detailedWords_part1 as upperIntermediateWords } from '../data/word4';
import { newDetailedWords_part1 as intermediateWords } from '../data/words';
import { WordDetail } from '../data/word1';

export interface Student {
  id: string;
  name: string;
  score: number;
  currentAnswer?: string;
  answeredAt?: Date;
  joinedAt: Date;
}

export interface QuizQuestion {
  id: string;
  word: string;
  definition: string;
  options: string[];
  correctAnswer: string;
  timeLimit: number; // seconds
}

export interface Room {
  id: string;
  code: string;
  teacherName: string;
  status: 'waiting' | 'playing' | 'finished';
  wordListName: string;
  students: Student[];
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  currentQuestionStartTime?: Date;
  leaderboard: Array<{
    studentId: string;
    name: string;
    totalScore: number;
    correctAnswers: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRoomData {
  teacherName: string;
  wordListName: string;
}

class LiveQuizService {
  private readonly roomsCollection = 'live-quiz-rooms';

  // 6 haneli benzersiz oda kodu üret
  private generateRoomCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  // Tüm kelimeleri birleştir
  private getAllWords(): WordDetail[] {
    return [
      ...foundationWords,
      ...preIntermediateWords,
      ...upperIntermediateWords,
      ...intermediateWords
    ];
  }

  // Kelime listesinden sorular oluştur
  private async generateQuestions(wordListName: string, count: number = 20): Promise<QuizQuestion[]> {
    const allWords = this.getAllWords();
    let words = [];
    
    // Kelime listesini seç
    switch (wordListName) {
      case 'unit1':
        words = allWords.filter(w => w.unit === '1');
        break;
      case 'unit2':
        words = allWords.filter(w => w.unit === '2');
        break;
      case 'unit3':
        words = allWords.filter(w => w.unit === '3');
        break;
      case 'unit4':
        words = allWords.filter(w => w.unit === '4');
        break;
      case 'difficult':
        // En uzun Türkçe açıklamaya sahip kelimeleri zor kabul edelim
        words = allWords.filter(w => w.turkish.length > 15);
        break;
      default:
        words = allWords;
    }

    // Rastgele kelime seç
    const shuffled = words.sort(() => Math.random() - 0.5).slice(0, Math.min(count, words.length));
    
    return shuffled.map((word, index) => {
      // Yanlış seçenekler oluştur
      const otherWords = words.filter(w => w.headword !== word.headword);
      const wrongOptions = otherWords
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(w => w.headword);
      
      const allOptions = [word.headword, ...wrongOptions].sort(() => Math.random() - 0.5);

      return {
        id: `q_${index + 1}`,
        word: word.headword,
        definition: word.turkish, // Türkçe anlamı soru olarak kullan
        options: allOptions,
        correctAnswer: word.headword,
        timeLimit: 15 // 15 saniye
      };
    });
  }

  // Yeni oda oluştur
  async createRoom(data: CreateRoomData): Promise<Room> {
    try {
      const code = this.generateRoomCode();
      const questions = await this.generateQuestions(data.wordListName);
      
      const roomData = {
        code,
        teacherName: data.teacherName,
        status: 'waiting' as const,
        wordListName: data.wordListName,
        students: [],
        questions,
        currentQuestionIndex: -1,
        leaderboard: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, this.roomsCollection), roomData);
      
      return {
        id: docRef.id,
        ...roomData,
        createdAt: new Date(),
        updatedAt: new Date()
      } as Room;
      
    } catch (error) {
      console.error('Room creation error:', error);
      throw new Error('Oda oluşturulamadı');
    }
  }

  // Oda koduna göre oda bul
  async findRoomByCode(code: string): Promise<Room | null> {
    try {
      const q = query(
        collection(db, this.roomsCollection),
        where('code', '==', code.toUpperCase()),
        where('status', 'in', ['waiting', 'playing'])
      );
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as Room;
      
    } catch (error) {
      console.error('Room search error:', error);
      return null;
    }
  }

  // Öğrenci odaya katıl
  async joinRoom(roomId: string, studentName: string): Promise<Student> {
    try {
      const roomRef = doc(db, this.roomsCollection, roomId);
      const roomDoc = await getDoc(roomRef);
      
      if (!roomDoc.exists()) {
        throw new Error('Oda bulunamadı');
      }

      const room = roomDoc.data() as Room;
      
      if (room.status !== 'waiting') {
        throw new Error('Bu odaya artık katılamazsınız');
      }

      // Aynı isimde öğrenci var mı kontrol et
      if (room.students.some(s => s.name.toLowerCase() === studentName.toLowerCase())) {
        throw new Error('Bu isim zaten kullanılıyor');
      }

      const student: Student = {
        id: Date.now().toString(),
        name: studentName,
        score: 0,
        joinedAt: new Date()
      };

      await updateDoc(roomRef, {
        students: arrayUnion(student),
        updatedAt: serverTimestamp()
      });

      return student;
      
    } catch (error) {
      console.error('Join room error:', error);
      throw error;
    }
  }

  // Quiz'i başlat
  async startQuiz(roomId: string): Promise<void> {
    try {
      const roomRef = doc(db, this.roomsCollection, roomId);
      
      await updateDoc(roomRef, {
        status: 'playing',
        currentQuestionIndex: 0,
        currentQuestionStartTime: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
    } catch (error) {
      console.error('Start quiz error:', error);
      throw new Error('Quiz başlatılamadı');
    }
  }

  // Sonraki soruya geç
  async nextQuestion(roomId: string): Promise<void> {
    try {
      const roomRef = doc(db, this.roomsCollection, roomId);
      const roomDoc = await getDoc(roomRef);
      
      if (!roomDoc.exists()) {
        throw new Error('Oda bulunamadı');
      }

      const room = roomDoc.data() as Room;
      const nextIndex = room.currentQuestionIndex + 1;
      
      if (nextIndex >= room.questions.length) {
        // Quiz bitti
        await updateDoc(roomRef, {
          status: 'finished',
          updatedAt: serverTimestamp()
        });
      } else {
        // Sonraki soru
        await updateDoc(roomRef, {
          currentQuestionIndex: nextIndex,
          currentQuestionStartTime: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      
    } catch (error) {
      console.error('Next question error:', error);
      throw new Error('Sonraki soruya geçilemedi');
    }
  }

  // Öğrenci cevap ver
  async submitAnswer(roomId: string, studentId: string, answer: string): Promise<void> {
    try {
      const roomRef = doc(db, this.roomsCollection, roomId);
      const roomDoc = await getDoc(roomRef);
      
      if (!roomDoc.exists()) {
        throw new Error('Oda bulunamadı');
      }

      const room = roomDoc.data() as Room;
      const currentQuestion = room.questions[room.currentQuestionIndex];
      
      if (!currentQuestion) {
        throw new Error('Geçerli soru bulunamadı');
      }

      // Doğru cevap mı kontrol et
      const isCorrect = answer === currentQuestion.correctAnswer;
      const points = isCorrect ? 100 : 0;

      // Öğrenci skorunu güncelle
      const updatedStudents = room.students.map(student => {
        if (student.id === studentId) {
          return {
            ...student,
            score: student.score + points,
            currentAnswer: answer,
            answeredAt: new Date()
          };
        }
        return student;
      });

      await updateDoc(roomRef, {
        students: updatedStudents,
        updatedAt: serverTimestamp()
      });
      
    } catch (error) {
      console.error('Submit answer error:', error);
      throw new Error('Cevap gönderilemedi');
    }
  }

  // Oda durumunu dinle (gerçek zamanlı)
  subscribeToRoom(roomId: string, callback: (room: Room | null) => void) {
    const roomRef = doc(db, this.roomsCollection, roomId);
    
    return onSnapshot(roomRef, (doc) => {
      if (doc.exists()) {
        const room = {
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        } as Room;
        callback(room);
      } else {
        callback(null);
      }
    });
  }

  // Odayı kapat
  async closeRoom(roomId: string): Promise<void> {
    try {
      const roomRef = doc(db, this.roomsCollection, roomId);
      await deleteDoc(roomRef);
    } catch (error) {
      console.error('Close room error:', error);
      throw new Error('Oda kapatılamadı');
    }
  }

  // Liderlik tablosunu güncelle
  async updateLeaderboard(roomId: string): Promise<void> {
    try {
      const roomRef = doc(db, this.roomsCollection, roomId);
      const roomDoc = await getDoc(roomRef);
      
      if (!roomDoc.exists()) return;

      const room = roomDoc.data() as Room;
      
      const leaderboard = room.students
        .map(student => ({
          studentId: student.id,
          name: student.name,
          totalScore: student.score,
          correctAnswers: Math.floor(student.score / 100)
        }))
        .sort((a, b) => b.totalScore - a.totalScore);

      await updateDoc(roomRef, {
        leaderboard,
        updatedAt: serverTimestamp()
      });
      
    } catch (error) {
      console.error('Update leaderboard error:', error);
    }
  }
}

export const liveQuizService = new LiveQuizService(); 