export interface UserType {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  isOnline: boolean;
  unreadCount: number;
  lastSeen?: string;
}

export interface MessageType {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
  read: boolean;
}

export type Word = {
  id: number;
  en: string;
  tr: string;
  pronunciation: string;
  sentence: string;
  image?: string;
};

export interface WordDetail {
  headword: string;
  turkish: string;
  unit: string;
  section: string;
  forms: {
    verb: string[];
    noun: string[];
    adjective: string[];
    adverb: string[];
  };
  collocations: string[];
}

export interface WordForms {
  noun: {
    word: string;
    definition: string;
  };
  verb: {
    word: string;
    definition: string;
  };
  adjective: {
    word: string;
    definition: string;
  };
  adverb: {
    word: string;
    definition: string;
  };
}

export interface WordFormsQuestion {
  sentence: string;
  headword: string;
  solution: string;
}

export interface PrepositionExercise {
  sentence: string;
  correctAnswer: string;
  options: string[];
  sourcePrep: {
    prep: string;
  };
}

export interface QuizQuestion {
  questionText: string; // e.g., 'abandon'
  options: string[]; // e.g., ['terk etmek', 'devam etmek', 'başlamak', 'unutmak']
  correctAnswer: string; // e.g., 'terk etmek'
  wordDetail: WordDetail; // Sorunun türetildiği kelimenin tüm detayları
}

export interface QuizPlayer {
  id: string; // UID from Firebase Auth
  nickname: string;
  score: number;
  streak: number; // Doğru cevap serisi
  answeredCorrectly?: boolean | null; // Son soruya doğru cevap verdi mi?
}

export type QuizStatus = 'waiting' | 'in_progress' | 'leaderboard' | 'finished';

export interface LiveQuizSession {
  roomCode: string;
  hostId: string;
  status: QuizStatus;
  currentQuestionIndex: number;
  questions: QuizQuestion[];
  players: { [key: string]: QuizPlayer }; // Oyuncu ID'si ile eşleştirilmiş oyuncu nesneleri
  createdAt: number; // Timestamp
  unit: string;
  level: string;
}