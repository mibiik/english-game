import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, ArrowRight, FileText, Check, AlertCircle, Lock, Globe } from 'lucide-react';
import { wordListService } from '../services/wordListService';
import { Word } from '../data/words';
import { authService } from '../services/authService';

interface WordListImportProps {
  onClose: () => void;
  onImportSuccess: () => void;
}

export function WordListImport({ onClose, onImportSuccess }: WordListImportProps) {
  const [importText, setImportText] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [parsedWords, setParsedWords] = useState<Word[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [listName, setListName] = useState(`İçe Aktarılan Liste (${new Date().toLocaleDateString()})`);
  const [listDescription, setListDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Kullanıcının oturum durumunu kontrol et
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
    };
    
    checkAuth();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportText(content);
    };
    reader.onerror = () => {
      setError('Dosya okuma hatası.');
    };
    reader.readAsText(file);
  };

  const handleParseText = () => {
    if (!importText.trim()) {
      setError('İçe aktarılacak metin boş olamaz.');
      return;
    }

    try {
      // Metinden kelimeleri ayrıştır
      const words = wordListService.parseWordsFromText(importText, selectedUnit);
      
      if (words.length === 0) {
        setError('Geçerli kelime bulunamadı. Metin formatını kontrol edin.');
        return;
      }

      setParsedWords(words);
      setPreviewMode(true);
      setError(null);
      setListDescription(`${words.length} kelime içeren içe aktarılmış liste`);
    } catch (err) {
      console.error('Metin ayrıştırılırken hata oluştu:', err);
      setError('Metin ayrıştırılırken bir hata oluştu.');
    }
  };

  const handleImportWords = async () => {
    if (parsedWords.length === 0) {
      setError('İçe aktarılacak kelime bulunamadı.');
      return;
    }

    if (!listName.trim()) {
      setError('Liste adı boş olamaz.');
      return;
    }
    
    if (!isAuthenticated) {
      setError('Kelime listesi oluşturmak için giriş yapmalısınız.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Yeni bir liste oluştur
      const newList = {
        name: listName.trim(),
        description: listDescription || `${parsedWords.length} kelime içeren içe aktarılmış liste`,
        isPublic,
        words: parsedWords
      };
      
      const listId = await wordListService.createWordList(newList);
      setSuccess(`${parsedWords.length} kelime içeren liste başarıyla oluşturuldu!`);
      
      // Başarı durumunda callback'i çağır
      setTimeout(() => {
        onImportSuccess();
      }, 1500);
    } catch (err) {
      console.error('Kelimeler içe aktarılırken hata oluştu:', err);
      setError('Kelimeler içe aktarılırken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100 relative">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <X className="w-5 h-5" />
      </button>
      
      <div className="flex items-center gap-3 mb-6">
        <Upload className="w-6 h-6 text-green-600" />
        <h2 className="text-xl font-bold text-gray-800">Kelime Listesi İçe Aktar</h2>
      </div>
      
      {!isAuthenticated ? (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Giriş Yapmanız Gerekiyor</h3>
          <p className="text-gray-600 mb-6">Kelime listesi oluşturmak için lütfen giriş yapın.</p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Tamam
          </button>
        </div>
      ) : !previewMode ? (
        <>
          <div className="mb-6 p-4 bg-blue-50 rounded-lg text-blue-700 text-sm">
            <h3 className="font-semibold mb-2">Nasıl Kullanılır?</h3>
            <p>Kelimeleri aşağıdaki formatta girin:</p>
            <pre className="mt-2 p-2 bg-white rounded border border-blue-200 text-gray-700">
              {`english1:turkish1
english2:turkish2
english3:turkish3`}
            </pre>
            <p className="mt-2">Her satırda bir kelime olacak şekilde, İngilizce ve Türkçe karşılıklarını iki nokta (:) ile ayırın veya bir metin dosyası yükleyin.</p>
          </div>
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ünite Seçin</label>
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((unit) => (
                  <option key={unit} value={unit.toString()}>
                    Ünite {unit}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kelimeler</label>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="english1:turkish1
english2:turkish2
english3:turkish3"
                rows={10}
              />
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <FileText className="w-4 h-4" /> Dosya Yükle
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".txt,.csv"
                className="hidden"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleParseText}
                disabled={isLoading || !importText.trim()}
                className="flex-1 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:shadow-md transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'İşleniyor...' : 'Kelimeleri Kontrol Et'}
              </button>
              
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
            </div>
          </form>
        </>
      ) : (
        <>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Liste Bilgileri</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Liste Adı</label>
                  <input
                    type="text"
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Liste adı"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                  <textarea
                    value={listDescription}
                    onChange={(e) => setListDescription(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Liste açıklaması"
                    rows={2}
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700 flex items-center gap-1">
                    <Globe className="w-4 h-4" /> Herkese açık liste
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">İçe Aktarılacak Kelimeler</h3>
              <p className="text-gray-600 mb-4">Toplam {parsedWords.length} kelime bulundu. Listeyi kontrol edip onaylayın.</p>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden max-h-[300px] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İngilizce</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Türkçe</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ünite</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {parsedWords.map((word, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{word.english}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{word.turkish}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">Ünite {word.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={handleImportWords}
              disabled={isLoading || !listName.trim()}
              className="flex-1 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:shadow-md transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'İçe Aktarılıyor...' : 'Kelimeleri İçe Aktar'} <ArrowRight className="w-5 h-5" />
            </button>
            
            <button
              type="button"
              onClick={() => setPreviewMode(false)}
              className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Geri Dön
            </button>
          </div>
        </>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mt-4 p-3 bg-green-50 text-green-600 rounded-lg">
          {success}
        </div>
      )}
    </div>
  );
}