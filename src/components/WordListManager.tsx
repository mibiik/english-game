import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../services/authService';
import { GameMode } from '../services/gameScoreService';

interface WordList {
  id?: string;
  name: string;
  words: string[];
  userId: string;
  isPublic: boolean;
  createdAt?: Date;
  gameModes?: GameMode[];
}

const WordListManager: React.FC = () => {
  const [wordLists, setWordLists] = useState<WordList[]>([]);
  const [newListName, setNewListName] = useState('');
  const [newWord, setNewWord] = useState('');
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [bulkWords, setBulkWords] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      fetchWordLists();
    }
  }, [currentUser]);

  const fetchWordLists = async () => {
    if (!currentUser) return;
    
    const q = query(
      collection(db, 'wordLists'),
      where('userId', '==', currentUser.uid)
    );
    
    const querySnapshot = await getDocs(q);
    const lists: WordList[] = [];
    querySnapshot.forEach((doc) => {
      lists.push({ id: doc.id, ...doc.data() } as WordList);
    });
    setWordLists(lists);
  };

  const createWordList = async () => {
    if (!currentUser || !newListName.trim()) return;
    
    const newList: WordList = {
      name: newListName,
      words: [],
      userId: currentUser.uid,
      isPublic: false,
      createdAt: new Date(),
      gameModes: ['matching', 'multipleChoice', 'flashcard', 'scramble', 'difficult', 'speaking', 'wordRace', 'sentenceCompletion', 'wordForms', 'wordTypes']
    };
    
    await addDoc(collection(db, 'wordLists'), newList);
    setNewListName('');
    fetchWordLists();
  };

  const addWordToList = async () => {
    if (!selectedListId || !newWord.trim()) return;
    
    const listRef = doc(db, 'wordLists', selectedListId);
    const list = wordLists.find(list => list.id === selectedListId);
    
    if (list) {
      await updateDoc(listRef, {
        words: [...list.words, newWord.trim()]
      });
      setNewWord('');
      fetchWordLists();
    }
  };

  const addBulkWords = async () => {
    if (!selectedListId || !bulkWords.trim()) return;
    
    const wordsArray = bulkWords
      .split(/[\n,;]+/)
      .map(word => word.trim())
      .filter(word => word.length > 0);
    
    if (wordsArray.length === 0) return;
    
    const listRef = doc(db, 'wordLists', selectedListId);
    const list = wordLists.find(list => list.id === selectedListId);
    
    if (list) {
      await updateDoc(listRef, {
        words: [...list.words, ...wordsArray]
      });
      setBulkWords('');
      fetchWordLists();
    }
  };

  const deleteWordList = async (listId: string) => {
    await deleteDoc(doc(db, 'wordLists', listId));
    fetchWordLists();
  };

  const toggleListVisibility = async (listId: string, isPublic: boolean) => {
    await updateDoc(doc(db, 'wordLists', listId), {
      isPublic: !isPublic
    });
    fetchWordLists();
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Kelime Listeleri Yöneticisi</h2>
      
      {/* Yeni Liste Oluşturma */}
      <div className="mb-6 p-4 border rounded">
        <h3 className="text-lg font-semibold mb-2">Yeni Liste Oluştur</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="Liste adı"
            className="flex-1 p-2 border rounded"
          />
          <button 
            onClick={createWordList}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Oluştur
          </button>
        </div>
      </div>

      {/* Kelime Ekleme */}
      {wordLists.length > 0 && (
        <div className="mb-6 p-4 border rounded">
          <h3 className="text-lg font-semibold mb-2">Listeye Kelime Ekle</h3>
          <div className="mb-4">
            <select
              value={selectedListId || ''}
              onChange={(e) => setSelectedListId(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            >
              <option value="">Liste seçin</option>
              {wordLists.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.name} ({list.words.length} kelime)
                </option>
              ))}
            </select>
          </div>

          {selectedListId && (
            <>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="Tek kelime ekle"
                  className="flex-1 p-2 border rounded"
                />
                <button 
                  onClick={addWordToList}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Ekle
                </button>
              </div>

              <div className="mb-4">
                <textarea
                  value={bulkWords}
                  onChange={(e) => setBulkWords(e.target.value)}
                  placeholder="Toplu kelime ekle (her satıra bir kelime veya virgülle ayırarak)"
                  rows={4}
                  className="w-full p-2 border rounded"
                />
                <button 
                  onClick={addBulkWords}
                  className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Toplu Ekle
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Liste Görüntüleme */}
      <div className="p-4 border rounded">
        <h3 className="text-lg font-semibold mb-2">Listelerim</h3>
        {wordLists.length === 0 ? (
          <p className="text-gray-500">Henüz liste oluşturmadınız.</p>
        ) : (
          <ul className="space-y-2">
            {wordLists.map((list) => (
              <li key={list.id} className="border p-3 rounded">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{list.name}</h4>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => toggleListVisibility(list.id!, list.isPublic)}
                      className={`px-3 py-1 rounded text-sm ${list.isPublic ? 'bg-purple-500' : 'bg-gray-500'} text-white`}
                    >
                      {list.isPublic ? 'Herkese Açık' : 'Gizli'}
                    </button>
                    <button 
                      onClick={() => deleteWordList(list.id!)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Sil
                    </button>
                  </div>
                </div>
                <ul className="list-disc pl-5">
                  {list.words.slice(0, 5).map((word, i) => (
                    <li key={i}>{word}</li>
                  ))}
                  {list.words.length > 5 && (
                    <li className="text-gray-500">+ {list.words.length - 5} kelime daha...</li>
                  )}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default WordListManager;