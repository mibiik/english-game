import { supabase } from '../config/supabase';
import { supabaseAuthService } from '../services/supabaseAuthService';
import { Word } from '../data/intermediate';

export interface WordList {
  id: string;
  userId: string;
  name: string;
  description: string;
  isPublic: boolean;
  words: Word[];
  createdAt: Date;
  updatedAt: Date;
}

class WordListService {
  private readonly collectionName = 'wordLists';

  async getUserWordLists(): Promise<WordList[]> {
    try {
      const userId = authService.getCurrentUserId();
      if (!userId) return [];

      const q = query(collection(db, this.collectionName), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as WordList[];
    } catch (error) {
      console.error('Error getting user word lists:', error);
      throw error;
    }
  }

  async getPublicWordLists(): Promise<WordList[]> {
    try {
      const q = query(collection(db, this.collectionName), where("isPublic", "==", true));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as WordList[];
    } catch (error) {
      console.error('Error getting public word lists:', error);
      throw error;
    }
  }

  async getWordList(id: string): Promise<WordList> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Word list not found');
      }
      
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate(),
        updatedAt: docSnap.data().updatedAt?.toDate()
      } as WordList;
    } catch (error) {
      console.error('Error getting word list:', error);
      throw error;
    }
  }

  async createWordList(list: Omit<WordList, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const userId = authService.getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');
      
      const now = new Date();
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...list,
        userId,
        createdAt: now,
        updatedAt: now
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating word list:', error);
      throw error;
    }
  }

  async updateWordList(id: string, updates: Partial<Omit<WordList, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Word list not found');
      }
      
      const userId = authService.getCurrentUserId();
      if (!userId || docSnap.data().userId !== userId) {
        throw new Error('Not authorized to update this list');
      }
      
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating word list:', error);
      throw error;
    }
  }

  async deleteWordList(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Word list not found');
      }
      
      const userId = authService.getCurrentUserId();
      if (!userId || docSnap.data().userId !== userId) {
        throw new Error('Not authorized to delete this list');
      }
      
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting word list:', error);
      throw error;
    }
  }

  async addWordToList(listId: string, word: Word): Promise<void> {
    try {
      const list = await this.getWordList(listId);
      
      const userId = authService.getCurrentUserId();
      if (!userId || list.userId !== userId) {
        throw new Error('Not authorized to modify this list');
      }
      
      const words = [...list.words, word];
      
      await this.updateWordList(listId, { words });
    } catch (error) {
      console.error('Error adding word to list:', error);
      throw error;
    }
  }

  async removeWordFromList(listId: string, wordIndex: number): Promise<void> {
    try {
      const list = await this.getWordList(listId);
      
      const userId = authService.getCurrentUserId();
      if (!userId || list.userId !== userId) {
        throw new Error('Not authorized to modify this list');
      }
      
      if (wordIndex < 0 || wordIndex >= list.words.length) {
        throw new Error('Invalid word index');
      }
      
      const words = [...list.words];
      words.splice(wordIndex, 1);
      
      await this.updateWordList(listId, { words });
    } catch (error) {
      console.error('Error removing word from list:', error);
      throw error;
    }
  }

  parseWordsFromText(text: string, unit: string): Word[] {
    if (!text.trim()) return [];
    
    const lines = text.split('\n').filter(line => line.trim());
    const words: Word[] = [];
    
    for (const line of lines) {
      const parts = line.split('-').map(part => part.trim());
      
      if (parts.length >= 2) {
        const english = parts[0].trim();
        const turkish = parts[1].trim();
        
        if (english && turkish) {
          words.push({
            english,
            turkish,
            unit
          });
        }
      }
    }
    
    return words;
  }
}

export const wordListService = new WordListService();