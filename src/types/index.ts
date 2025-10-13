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


export interface SentenceQuestion {
  sentence: string;
  targetWord: string;
  options: string[];
  correctAnswer: string;
}