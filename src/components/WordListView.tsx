import React, { useState, useEffect } from 'react';
import { Eye, X, Play, Download, Share2, Copy, Search, Filter } from 'lucide-react';
import { wordListService, WordList } from '../services/wordListService';
import { authService } from '../services/authService';

interface WordListViewProps {
  listId?: string;
  list?: WordList;
  onClose: () => void;
  onSelectForGame?: (list: WordList) => void;
}

export function WordListView({ listId, list: initialList, onClose, onSelectForGame }: WordListViewProps) {
  const [wordList, setWordList] = useState<WordList | null>(initialList || null);
  const [isLoading, setIsLoading] = useState(!initialList);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState('all');
  const [isOwner, setIsOwner] = useState(false);
  
  useEffect(() => {
    if (initialList) {
      setWordList(initialList);
      checkOwnership(initialList);
    } else if (listId) {
      loadWordList(listId);
    }
  }, [initialList, listId]);
  
  const checkOwnership = (list: WordList) => {
    const currentUser = authService.getCurrentUser();
    setIsOwner(currentUser?.uid === list.userId);
  };

  const loadWordList = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const list = await wordListService.getWordList(id);
      setWordList(list);
      checkOwnership(list);
    } catch (err) {
      console.error('Kelime listesi yüklenirken hata oluştu:', err);
      setError('Kelime listesi yüklenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleCopyToClipboard = () => {
    if (!wordList) return;

    const formattedText = wordList.words
      .map(word => `${word.english}:${word.turkish}`)
      .join('\n');

    navigator.clipboard.writeText(formattedText)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(err => {
        console.error('Panoya kopyalama hatası:', err);
        setError('Kelimeler panoya kopyalanırken bir hata oluştu.');
      });
  };

  const handleShareList = async () => {
    if (!wordList || !wordList.id) return;

    try {
      // Liste paylaşım durumunu güncelle
      await wordListService.updateWordList(wordList.id, { isPublic: true });
      setSuccess('Liste herkese açık olarak ayarlandı ve paylaşıma hazır!');
      
      // Listeyi yeniden yükle
      if (listId) {
        await loadWordList(listId);
      }
    } catch (err) {
      console.error('Liste paylaşılırken hata oluştu:', err);
      setError('Liste paylaşılırken bir hata oluştu.');
    }
  };

  const filteredWords = wordList?.words.filter(word => {
    const matchesSearch = searchTerm === '' || 
      word.english.toLowerCase().includes(searchTerm.toLowerCase()) || 
      word.turkish.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUnit = selectedUnit === 'all' || word.unit === selectedUnit;
    
    return matchesSearch && matchesUnit;
  }) || [];

  // Mevcut üniteler
  const units = wordList?.words
    .map(word => word.unit)
    .filter((unit, index, self) => self.indexOf(unit) === index)
    .sort((a, b) => parseInt(a) - parseInt(b)) || [];

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!wordList) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100 text-center py-12">
        <p className="text-gray-600">Kelime listesi bulunamadı.</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          Geri Dön
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-rounded-xl shadow-lg border border-purple-100 relative">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <X className="w-5 h-5" />
      </button>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Eye className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-bold text-gray-800">{wordList.name}</h2>
        </div>
      </div>
      
      {wordList.description && (
        <p className="text-gray-600 mb-6">{wordList.description}</p>
      )}
      
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="text-sm text-gray-500">{wordList.words.length} kelime</span>
        {wordList.isPublic && (
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Herkese Açık</span>
        )}
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          {onSelectForGame && (
            <button
              onClick={() => onSelectForGame(wordList)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <Play className="w-4 h-4" /> Bu Listeyle Oyna
            </button>
          )}
          
          <button
            onClick={handleCopyToClipboard}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Copy className="w-4 h-4" /> {copySuccess ? 'Kopyalandı!' : 'Kopyala'}
          </button>
          
          {isOwner && !wordList.isPublic && (
            <button
              onClick={handleShareList}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" /> Paylaş
            </button>
          )}
        </div>

        {success && (
          <div className="p-3 bg-green-100 text-green-700 rounded-lg">
            {success}
          </div>
        )}
        
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
      </div>
      
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Kelime ara..."
          />
        </div>
        
        <div className="w-full sm:w-auto">
          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="all">Tüm Üniteler</option>
            {units.map(unit => (
              <option key={unit} value={unit}>Ünite {unit}</option>
            ))}
          </select>
        </div>
      </div>
      
      {filteredWords.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            {wordList.words.length === 0 
              ? 'Bu listede henüz kelime bulunmuyor.' 
              : 'Aramanızla eşleşen kelime bulunamadı.'}
          </p>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg overflow-hidden max-h-[400px] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İngilizce</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Türkçe</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ünite</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWords.map((word, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{word.english}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{word.turkish}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">Ünite {word.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Kapat
        </button>
      </div>
    </div>
  );
}