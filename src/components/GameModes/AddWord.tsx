import React, { useState, useEffect } from 'react';
import { Word } from '../../data/words';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';

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
    } else {
      saveToLocalStorage([...customWords, newWord]);
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
    <div className="p-8 bg-dark-light rounded-xl shadow-neon-blue border border-neon-blue space-y-6">
      <h2 className="text-2xl font-bold text-neon-blue mb-4 animate-glow">Kendi Kelimelerini Ekle</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            value={english}
            onChange={(e) => setEnglish(e.target.value)}
            placeholder="İngilizce kelime"
            className="flex-1 p-3 bg-dark border border-neon-blue rounded-lg text-neon-blue placeholder-neon-blue-dark focus:outline-none focus:shadow-neon-blue"
          />
          <input
            type="text"
            value={turkish}
            onChange={(e) => setTurkish(e.target.value)}
            placeholder="Türkçe anlamı"
            className="flex-1 p-3 bg-dark border border-neon-blue rounded-lg text-neon-blue placeholder-neon-blue-dark focus:outline-none focus:shadow-neon-blue"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-6 py-3 bg-dark border border-neon-green text-neon-green rounded-lg hover:shadow-neon-green transition-all duration-300 flex items-center gap-2"
            >
              {editIndex !== null ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {editIndex !== null ? 'Güncelle' : 'Ekle'}
            </button>
            {editIndex !== null && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                İptal
              </button>
            )}
          </div>
        </div>
      </form>

      {filteredWords.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Ünite {unit} - Eklediğin Kelimeler</h3>
          <div className="space-y-3">
            {filteredWords.map((word, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <span className="font-medium text-gray-800">{word.english}</span>
                  <span className="mx-2 text-gray-400">-</span>
                  <span className="text-gray-600">{word.turkish}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(index)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}