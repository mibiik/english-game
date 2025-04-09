import React, { useState } from 'react';
import { Word } from '../data/words';

interface AddWordProps {
  onWordAdded: () => void;
}

export const AddWord: React.FC<AddWordProps> = ({ onWordAdded }) => {
  const [newWord, setNewWord] = useState<Omit<Word, 'id'>>({ english: '', turkish: '', unit: '1' });
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEnglish = newWord.english.trim();
    const trimmedTurkish = newWord.turkish.trim();

    if (!trimmedEnglish || !trimmedTurkish) {
      setMessage({ text: 'Lütfen tüm alanları doldurun.', type: 'error' });
      return;
    }

    try {
      // Mevcut özel kelimeleri al
      const savedWords = localStorage.getItem('customWords');
      const customWords: Word[] = savedWords ? JSON.parse(savedWords) : [];

      // Aynı kelime var mı kontrol et
      const isDuplicate = customWords.some(
        word => word.english.toLowerCase() === trimmedEnglish.toLowerCase() ||
               word.turkish.toLowerCase() === trimmedTurkish.toLowerCase()
      );

      if (isDuplicate) {
        setMessage({ text: 'Bu kelime zaten eklenmiş!', type: 'error' });
        return;
      }

      // Yeni kelimeyi ekle
      const newWordToAdd = {
        english: trimmedEnglish,
        turkish: trimmedTurkish,
        unit: newWord.unit
      };

      const updatedWords = [...customWords, newWordToAdd];
      localStorage.setItem('customWords', JSON.stringify(updatedWords));

      // Formu temizle ve başarı mesajı göster
      setNewWord({ english: '', turkish: '', unit: '1' });
      setMessage({ text: 'Kelime başarıyla eklendi!', type: 'success' });
      onWordAdded(); // Parent bileşeni bilgilendir

      // Mesajı 3 saniye sonra temizle
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Kelime eklenirken hata oluştu:', error);
      setMessage({ text: 'Kelime eklenirken bir hata oluştu.', type: 'error' });
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Yeni Kelime Ekle</h2>
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
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            Kelimeyi Ekle
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