import { newDetailedWords_part1 as foundationWords } from './word1';
import { newDetailedWords_part1 as preIntermediateWords } from './word2';
import { detailedWords_part1 as upperIntermediateWords } from './word4';
import { newDetailedWords_part1 as intermediateWords } from './words';
import { kuepeWords } from './kuepe';

export interface WordData {
  english: string;
  turkish: string;
}

const extractWordData = (wordDetail: any): WordData[] => {
  const words: WordData[] = [];
  if (wordDetail.headword && wordDetail.turkish) {
    words.push({ english: wordDetail.headword, turkish: wordDetail.turkish });
  }
  // Diğer formları da ekleyebilirsiniz (opsiyonel)
  // wordDetail.forms.verb.forEach(v => words.push({ english: v, turkish: `fiil: ${wordDetail.turkish}` }));
  return words;
};

const allDetailedWords = [
  ...foundationWords,
  ...preIntermediateWords,
  ...upperIntermediateWords,
  ...intermediateWords,
  ...kuepeWords
];

export const allWordsWithTranslations: WordData[] = allDetailedWords.flatMap(extractWordData);

// Geriye dönük uyumluluk için sadece İngilizce kelimeleri içeren dizi
export const allWords: string[] = allDetailedWords.map(w => w.headword); 