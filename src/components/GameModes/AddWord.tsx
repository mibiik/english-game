import React, { useState, useEffect } from 'react';
import { Word } from '../../data/words';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { updateWordDifficulty } from '../../data/difficultWords';

interface AddWordProps {
  unit: number;
}

export function AddWord({ unit }: AddWordProps) {
  const [customWords, setCustomWords] = useState<Word[]>([]);
  const [english, setEnglish] = useState('');
  const [turkish, setTurkish] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    const savedWords = localStorage.getItem(`customWords_unit_${unit}`);
    if (savedWords) {
      setCustomWords(JSON.parse(savedWords));
    }
  }, []);

  const saveToLocalStorage = (words: Word[]) => {
    localStorage.setItem(`customWords_unit_${unit}`, JSON.stringify(words));
    setCustomWords(words);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!english.trim() || !turkish.trim()) return;

    const newWord: Word = {
      english: english.trim(),
      turkish: turkish.trim(),
      unit,
      id: Date.now().toString()
    };

    if (editIndex !== null) {
      const updatedWords = [...customWords];
      updatedWords[editIndex] = newWord;
      saveToLocalStorage(updatedWords);
      setEditIndex(null);
      updateWordDifficulty(newWord, true);
    } else {
      saveToLocalStorage([...customWords, newWord]);
      updateWordDifficulty(newWord, true);
    }

    setEnglish('');
    setTurkish('');
  };

  const handleEdit = (index: number) => {
    const wordToEdit = customWords[index];
    setEnglish(wordToEdit.english);
    setTurkish(wordToEdit.turkish);
    setEditIndex(index);
  };

  const handleDelete = (index: number) => {
    const updatedWords = customWords.filter((_, i) => i !== index);
    saveToLocalStorage(updatedWords);
  };

  const handleCancel = () => {
    setEnglish('');
    setTurkish('');
    setEditIndex(null);
  };

  const filteredWords = customWords.filter(word => word.unit === unit);

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl shadow-2xl p-6 space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Kendi Kelimelerini Ekle</h2>
        <p className="text-indigo-200">Öğrenmek istediğin kelimeleri buraya ekleyebilirsin</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-indigo-200">İngilizce</label>
            <input
              type="text"
              value={english}
              onChange={(e) => setEnglish(e.target.value)}
              placeholder="İngilizce kelimeyi yazın"
              className="w-full px-4 py-3 bg-white/5 border border-indigo-300/20 rounded-lg text-white placeholder-indigo-200/70 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-indigo-200">Türkçe</label>
            <input
              type="text"
              value={turkish}
              onChange={(e) => setTurkish(e.target.value)}
              placeholder="Türkçe anlamını yazın"
              className="w-full px-4 py-3 bg-white/5 border border-indigo-300/20 rounded-lg text-white placeholder-indigo-200/70 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          {editIndex !== null && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 flex items-center gap-2 text-sm font-medium text-indigo-200 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
              İptal
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
          >
            {editIndex !== null ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {editIndex !== null ? 'Güncelle' : 'Ekle'}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Eklenen Kelimeler</h3>
        {filteredWords.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-indigo-200">Henüz kelime eklenmemiş</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredWords.map((word, index) => (
              <div
                key={word.id}
                className="group flex items-center justify-between bg-white/5 backdrop-blur-sm rounded-lg p-4 hover:bg-white/10 transition duration-200"
              >
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-white">{word.english}</h4>
                  <p className="text-indigo-200">{word.turkish}</p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(index)}
                    className="p-2 text-indigo-300 hover:text-indigo-100 hover:bg-white/5 rounded-lg transition-colors"
                    title="Düzenle"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}