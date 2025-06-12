import { newDetailedWords_part1, WordDetail } from './words';
import { wordDetails } from './wordDetails';
import { detailedWords_part1 as words4 } from './word4';

// Tüm kelime kaynaklarını birleştirip sadece 'headword' alanını alarak tek bir dizi oluşturuyoruz.
const wordsFromNewDetailed = newDetailedWords_part1.map((word: WordDetail) => word.headword);
const wordsFromDetailed = wordDetails.map((word: any) => word.headword); // Bu dosya kendi tipini export etmiyor, any kullanmak zorundayız.
const wordsFromWord4 = words4.map((word: WordDetail) => word.headword);

// Tekrarları önlemek için Set kullanıyoruz ve ardından tekrar diziye çeviriyoruz.
export const allWords: string[] = [...new Set([...wordsFromNewDetailed, ...wordsFromDetailed, ...wordsFromWord4])]; 