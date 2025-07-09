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
  noun: string;
  verb: string;
  adjective:string;
  adverb: string;
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