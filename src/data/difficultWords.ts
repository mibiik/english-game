import { Word } from './words';

export interface WordDifficulty {
  word: Word;
  wrongAttempts: number;
  totalAttempts: number;
  lastAttemptDate: string;
}

export interface DifficultWordsState {
  words: WordDifficulty[];
  lastUpdated: string;
}

// Zorlu kelimeleri local storage'da saklamak için yardımcı fonksiyonlar
export const STORAGE_KEY = 'difficult_words';

export const getDifficultWords = (): DifficultWordsState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { words: [], lastUpdated: new Date().toISOString() };
  }
  return JSON.parse(stored);
};

export const updateWordDifficulty = (word: Word, isCorrect: boolean) => {
  const state = getDifficultWords();
  const existingWordIndex = state.words.findIndex(w => 
    w.word.english === word.english && w.word.unit === word.unit
  );

  if (existingWordIndex >= 0) {
    const wordDifficulty = state.words[existingWordIndex];
    wordDifficulty.totalAttempts++;
    if (!isCorrect) {
      wordDifficulty.wrongAttempts++;
    }
    wordDifficulty.lastAttemptDate = new Date().toISOString();
    state.words[existingWordIndex] = wordDifficulty;
  } else if (!isCorrect) {
    // Sadece yanlış cevaplanan kelimeleri ekle
    state.words.push({
      word,
      wrongAttempts: 1,
      totalAttempts: 1,
      lastAttemptDate: new Date().toISOString()
    });
  }

  state.lastUpdated = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const getMostDifficultWords = (limit: number = 10): WordDifficulty[] => {
  const state = getDifficultWords();
  return state.words
    .filter(w => w.totalAttempts > 0 && (w.wrongAttempts / w.totalAttempts) >= 0.5)
    .sort((a, b) => (b.wrongAttempts / b.totalAttempts) - (a.wrongAttempts / a.totalAttempts))
    .slice(0, limit);
};