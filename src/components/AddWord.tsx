import React, { useState, useEffect } from 'react';
import { Word } from '../data/words';
import { wordListService, WordList } from '../services/wordListService';
import { authService } from '../services/authService';
import { Plus, List, Save, X } from 'lucide-react';

interface AddWordProps {
  onWordAdded: () => void;
}

export const AddWord: React.FC<AddWordProps> = ({ onWordAdded }) => {
  const [newWord, setNewWord] = useState<Omit<Word, 'id'>>({ english: '', turkish: '', unit: '1' });
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [wordLists, setWordLists] = useState<WordList[]>([]);
  const [selectedListId, setSelectedListId] = useState<string>('');
  const [listName, setListName] = useState('');
  const [showCreateList, setShowCreateList] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Kullanıcının oturum durumunu kontrol et
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
      
      if (isAuth) {
        loadWordLists();
      }
    };
    
    checkAuth();
  }, []);

  const loadWordLists = async () => {
    try {
      const lists = await wordListService.getUserWordLists();
      setWordLists(lists);
      if (lists.length > 0) {
        setSelectedListId(lists[0].id || '');
      }
    } catch (err) {
      console.error('Kelime listeleri yüklenirken hata oluştu:', err);
      setMessage({ text: 'Kelime listeleri yüklenirken bir hata oluştu.', type: 'error' });
    }
  };

  const handleCreateList = async () => {
    if (!listName.trim()) {
      setMessage({ text: 'Liste adı boş olamaz.', type: 'error' });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const newList: Omit<WordList, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
        name: listName.trim(),
        description: 'Manuel olarak oluşturulan kelime listesi',
        isPublic: false,
        words: []
      };
      
      const listId = await wordListService.createWordList(newList);
      setMessage({ text: 'Kelime listesi başarıyla oluşturuldu!', type: 'success' });
      
      // Listeleri yeniden yükle ve yeni listeyi seç
      await loadWordLists();
      setSelectedListId(listId);
      setShowCreateList(false);
      setListName('');
    } catch (err) {
      console.error('Kelime listesi oluşturulurken hata oluştu:', err);
      setMessage({ text: 'Kelime listesi oluşturulurken bir hata oluştu.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEnglish = newWord.english.trim();
    const trimmedTurkish = newWord.turkish.trim();

    if (!trimmedEnglish || !trimmedTurkish) {
      setMessage({ text: 'Lütfen tüm alanları doldurun.', type: 'error' });
      return;
    }

    if (!isAuthenticated) {
      setMessage({ text: 'Kelime eklemek için giriş yapmalısınız.', type: 'error' });
      return;
    }

    if (!selectedListId && !showCreateList) {
      setMessage({ text: 'Lütfen bir kelime listesi seçin veya yeni liste oluşturun.', type: 'error' });
      return;
    }

    setIsLoading(true);

    try {
      // Yeni kelimeyi ekle
      const newWordToAdd: Word = {
        english: trimmedEnglish,
        turkish: trimmedTurkish,
        unit: newWord.unit
      };

      if (showCreateList) {
        // Yeni liste oluştur ve kelimeyi ekle
        await handleCreateList();
      } else {
        // Mevcut listeye kelimeyi ekle
        const selectedList = wordLists.find(list => list.id === selectedListId);
        
        if (!selectedList) {
          setMessage({ text: 'Seçilen liste bulunamadı.', type: 'error' });
          setIsLoading(false);
          return;
        }

        // Aynı kelime var mı kontrol et
        const isDuplicate = selectedList.words.some(
          word => word.english.toLowerCase() === trimmedEnglish.toLowerCase() ||
                word.turkish.toLowerCase() === trimmedTurkish.toLowerCase()
        );

        if (isDuplicate) {
          setMessage({ text: 'Bu kelime zaten eklenmiş!', type: 'error' });
          setIsLoading(false);
          return;
        }

        const updatedWords = [...selectedList.words, newWordToAdd];
        await wordListService.updateWordList(selectedListId, { words: updatedWords });
      }

      // Formu temizle ve başarı mesajı göster
      setNewWord({ english: '', turkish: '', unit: '1' });
      setMessage({ text: 'Kelime başarıyla eklendi!', type: 'success' });
      onWordAdded(); // Parent bileşeni bilgilendir

      // Mesajı 3 saniye sonra temizle
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Kelime eklenirken hata oluştu:', error);
      setMessage({ text: 'Kelime eklenirken bir hata oluştu.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Kullanıcı giriş yapmamışsa
  if (!isAuthenticated) {
    return (
      <div className="max-w-lg mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Kelime Ekle</h2>
          <p className="text-gray-600 mb-6">Kelime eklemek için lütfen giriş yapın.</p>
          <button
            onClick={onWordAdded}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Giriş Sayfasına Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Yeni Kelime Ekle</h2>
        
        {/* Kelime Listesi Seçimi */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kelime Listesi
          </label>
          
          {showCreateList ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Yeni liste adı"
                />
                <button
                  type="button"
                  onClick={() => setShowCreateList(false)}
                  className="p-3 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <button
                type="button"
                onClick={handleCreateList}
                disabled={isLoading}
                className="w-full py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> Listeyi Oluştur
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-2">
                <select
                  value={selectedListId}
                  onChange={(e) => setSelectedListId(e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  disabled={wordLists.length === 0}
                >
                  {wordLists.length === 0 ? (
                    <option value="">Henüz liste yok</option>
                  ) : (
                    wordLists.map(list => (
                      <option key={list.id} value={list.id}>
                        {list.name} ({list.words.length} kelime)
                      </option>
                    ))
                  )}
                </select>
                <button
                  type="button"
                  onClick={() => setShowCreateList(true)}
                  className="p-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="english" className="block text-sm font-medium text-gray-700 mb-2">
              İngilizce Kelime
            </label>
            <input
              type="text"
              id="english"
              value={newWord.english}
              onChange={(e) => setNewWord({ ...newWord, english: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="İngilizce kelimeyi girin"
            />
          </div>
          <div>
            <label htmlFor="turkish" className="block text-sm font-medium text-gray-700 mb-2">
              Türkçe Anlamı
            </label>
            <input
              type="text"
              id="turkish"
              value={newWord.turkish}
              onChange={(e) => setNewWord({ ...newWord, turkish: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Türkçe anlamını girin"
            />
          </div>
          <div>
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-2">
              Ünite
            </label>
            <select
              id="unit"
              value={newWord.unit}
              onChange={(e) => setNewWord({ ...newWord, unit: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((unit) => (
                <option key={unit} value={unit.toString()}>
                  Ünite {unit}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            {isLoading ? 'Ekleniyor...' : 'Kelimeyi Ekle'}
          </button>
        </form>
        {message && (
          <div
            className={`mt-6 p-4 rounded-lg text-center ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
};