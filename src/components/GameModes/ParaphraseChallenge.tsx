import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { aiService } from '../../services/aiService';
import { definitionCacheService } from '../../services/definitionCacheService';
import { WordDetail } from '../../data/words';
import { RefreshCw, CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { supabaseAuthService } from '../../services/supabaseAuthService';
import { supabaseGameScoreService } from '../../services/supabaseGameScoreService';

interface ParaphraseChallengeProps {
  words: WordDetail[];
  unit: string;
}

type ParaphraseType = 'parenthetical' | 'narrativeVerb' | 'narrativeAccording';

interface ParaphraseState {
  input: string;
  isCorrect: boolean;
  feedback: string;
  suggestion: string;
  isChecking: boolean;
  similarity: string;
}

export const ParaphraseChallenge: React.FC<ParaphraseChallengeProps> = ({ words, unit }) => {
  const [currentSentence, setCurrentSentence] = useState<string>('');
  const [currentType, setCurrentType] = useState<ParaphraseType>('parenthetical');
  const [paraphraseState, setParaphraseState] = useState<ParaphraseState>({
    input: '',
    isCorrect: false,
    feedback: '',
    suggestion: '',
    isChecking: false,
    similarity: '0'
  });
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string>('');
  const [wordMeaning, setWordMeaning] = useState<string>('');
  const [isLoadingMeaning, setIsLoadingMeaning] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [streak, setStreak] = useState(0);

  const generateRandomSentence = async () => {
    try {
      const sentence = await aiService.generateAcademicSentence();
      setCurrentSentence(sentence);
      setCurrentType('parenthetical');
      setParaphraseState({
        input: '',
        isCorrect: false,
        feedback: '',
        suggestion: '',
        isChecking: false,
        similarity: '0'
      });
      setStreak(0);
    } catch (error) {
      console.error('API error:', error);
      setCurrentSentence('Rules are beneficial to set ethical standards (Rogers & Zemach, 2018, p.141)');
    }
  };

  const handleWordClick = async (word: string) => {
    setSelectedWord(word);
    setIsLoadingMeaning(true);
    try {
      const meaning = await definitionCacheService.getDefinition(word, 'en');
      const sections = meaning.split('\n\n').map(section => {
        if (section.startsWith('**')) {
          const title = section.replace(/\*\*/g, '').split('\n')[0];
          const content = section.split('\n').slice(1);
          return `<strong>${title}</strong>\n${content.map(line => {
            if (line.startsWith('* **')) {
              return `<strong>${line.replace(/\* \*\*|\*\*/g, '').replace(/^\* /, '')}</strong>`;
            }
            return line.replace(/^\* /, '');
          }).join('\n')}`;
        }
        return section;
      }).join('\n\n');
      
      setWordMeaning(sections);
      
      // Timer for automatically closing after showing word meaning
      setTimeout(() => {
        setSelectedWord('');
      }, 3000); // Close after 3 seconds
      
    } catch (error) {
      setWordMeaning('An error occurred while loading the word meaning.');
      // Close shortly after in case of error
      setTimeout(() => {
        setSelectedWord('');
      }, 2000);
    } finally {
      setIsLoadingMeaning(false);
    }
  };

  const handleParaphraseSubmit = async () => {
    if (!currentSentence || paraphraseState.isChecking) return;

    setParaphraseState(prev => ({ ...prev, isChecking: true, feedback: '', suggestion: '' }));

    try {
      const result = await aiService.evaluateParaphrase(currentSentence, paraphraseState.input, currentType);
      
      if (!result) {
        throw new Error('Invalid response from API');
      }

      setParaphraseState(prev => ({
        ...prev,
        isCorrect: result.correct,
        feedback: result.feedback,
        suggestion: result.suggestion,
        similarity: result.similarity || '0',
        isChecking: false
      }));
      
      setTotalAttempts(prev => prev + 1);
      if (result.correct) {
        setScore(prev => prev + 10);
        // Anında puan ekle
        const userId = supabaseAuthService.getCurrentUserId();
        if (userId) {
          supabaseGameScoreService.addScore(userId, 'paraphraseChallenge', 10);
        }
        setStreak(prev => prev + 1);
      } else {
        setStreak(0);
      }
    } catch (error) {
      console.error('API error:', error);
      setParaphraseState(prev => ({
        ...prev,
        feedback: 'API error, please try again.',
        isChecking: false,
        similarity: '0'
      }));
    }
  };

  const handleNextType = () => {
    if (currentType === 'parenthetical') setCurrentType('narrativeVerb');
    else if (currentType === 'narrativeVerb') setCurrentType('narrativeAccording');
    else {
      // Tüm türler tamamlandığında skoru kaydet
      const saveScore = async () => {
        try {
          await supabaseGameScoreService.saveScore('paraphraseChallenge', score, unit);
          console.log('ParaphraseChallenge skoru kaydedildi:', score);
        } catch (error) {
          console.error('ParaphraseChallenge skoru kaydedilirken hata:', error);
        }
      };
      saveScore();
      generateRandomSentence();
    }

    setParaphraseState({
      input: '',
      isCorrect: false,
      feedback: '',
      suggestion: '',
      isChecking: false,
      similarity: '0'
    });
  };

  useEffect(() => {
    generateRandomSentence();
  }, [unit]);

  const renderSentenceWithClickableWords = () => {
    const words = currentSentence.split(' ');
    return words.map((word, index) => {
      const cleanWord = word.replace(/[^a-zA-Z]/g, '');
      const isClickable = cleanWord.length > 2;
      
      return (
        <React.Fragment key={index}>
          {isClickable ? (
            <span
              onClick={() => handleWordClick(cleanWord)}
              className={`cursor-pointer hover:text-blue-600 ${selectedWord === cleanWord ? 'text-blue-600 font-bold' : ''}`}
            >
              {word}
            </span>
          ) : (
            <span>{word}</span>
          )}
          {index < words.length - 1 && ' '}
        </React.Fragment>
      );
    });
  };

  const getTypeTitle = () => {
    switch (currentType) {
      case 'parenthetical':
        return 'Parenthetical Citation';
      case 'narrativeVerb':
        return 'Narrative Citation with Verb';
      case 'narrativeAccording':
        return "Narrative Citation with 'According to'";
    }
  };

  const getTypeExample = () => {
    switch (currentType) {
      case 'parenthetical':
        return 'Example:\n(1) Rules are beneficial to set ethical standards (Rogers & Zemach, 2018, p. 141)\n(2) The study shows that ethical standards are crucial for success (Rogers & Zemach, 2018, p. 141)';
      case 'narrativeVerb':
        return 'Example:\n(1) Rogers and Zemach (2018) mention that having a code of conduct is widely used (p. 141)\n(2) Rogers and Zemach (2018) argue that ethical guidelines improve workplace culture (p. 141)';
      case 'narrativeAccording':
        return 'Example:\n(1) According to Rogers and Zemach (2018), employees should be monitored every year (p. 141)\n(2) According to Rogers and Zemach (2018), regular monitoring enhances workplace efficiency (p. 141)';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-2 sm:p-6">
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 mb-4 sm:mb-8">
        <h2 className="text-2xl font-bold text-center mb-6">Paraphrase Challenge</h2>
        
        {/* Score Indicator */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-blue-50 p-4 rounded-lg">
          <div className="text-lg font-semibold text-blue-800">
            Score: {score}/{totalAttempts}
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={generateRandomSentence}
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg shadow-sm hover:bg-blue-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              New Sentence
            </button>
            <div className="text-sm text-blue-600">
              {currentType === 'parenthetical' ? '1/3' : currentType === 'narrativeVerb' ? '2/3' : '3/3'}
            </div>
          </div>
        </div>

        {/* Original Sentence and Word Meaning */}
        <div className="mb-8">
          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
            <p className="text-xl font-semibold">{renderSentenceWithClickableWords()}</p>
          </div>
          {selectedWord && (
            <div className="mt-4 p-4 sm:p-6 bg-white rounded-lg shadow-lg border border-blue-100 fixed inset-x-4 bottom-4 top-auto z-50 max-h-[60vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-blue-800">{selectedWord}</h3>
                <div className="flex items-center gap-2">
                  {isLoadingMeaning && <Loader2 className="w-5 h-5 animate-spin text-blue-600" />}
                  <button 
                    onClick={() => setSelectedWord('')}
                    className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="space-y-4 text-gray-700">
                <div dangerouslySetInnerHTML={{ __html: wordMeaning }} className="prose prose-blue max-w-none
                  [&_strong]:text-blue-700 [&_strong]:font-semibold [&_strong]:block [&_strong]:mb-2
                  [&>*+*]:mt-4 [&>*]:leading-relaxed text-base" />
              </div>
            </div>
          )}
        </div>

        {/* Paraphrase Type and Input Area */}
        <div className="space-y-4 sm:space-y-6 bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="space-y-4">
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                {currentType === 'parenthetical' ? '1' : currentType === 'narrativeVerb' ? '2' : '3'}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{getTypeTitle()}</h3>
                <button 
                  onClick={() => setShowExample(prev => !prev)} 
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  {showExample ? 'Hide Example' : 'Show Example'}
                </button>
                {showExample && (
                  <p className="text-xs text-gray-600 whitespace-pre-line mt-2">{getTypeExample()}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <textarea
                value={paraphraseState.input}
                onChange={(e) => setParaphraseState(prev => ({ ...prev, input: e.target.value }))}
                className="flex-1 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Write your sentence here..."
                disabled={paraphraseState.isChecking}
              />
              <button 
                onClick={handleParaphraseSubmit}
                disabled={paraphraseState.isChecking || !paraphraseState.input.trim()}
                className={`w-full sm:w-auto px-6 py-2 rounded-lg font-medium shadow-sm flex items-center justify-center gap-2
                  ${paraphraseState.isChecking
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600 transition-colors'}`}
              >
                {paraphraseState.isChecking ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Checking
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Check
                  </>
                )}
              </button>
            </div>

            {/* Geri Bildirim */}
            {paraphraseState.feedback && (
              <div className={`p-4 rounded-lg ${paraphraseState.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-start gap-3">
                  {paraphraseState.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                  )}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <p className={`font-medium ${paraphraseState.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                        {paraphraseState.feedback}
                      </p>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap
                        ${parseInt(paraphraseState.similarity) > 85 ? 'bg-red-100 text-red-700' :
                          parseInt(paraphraseState.similarity) < 45 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'}`}>
                        {paraphraseState.similarity}% Similarity
                      </span>
                    </div>
                    {!paraphraseState.isCorrect && paraphraseState.suggestion && (
                      <p className="text-sm text-gray-600">
                        {paraphraseState.suggestion}
                      </p>
                    )}
                  </div>
                </div>
                {paraphraseState.isCorrect && (
                  <button
                    onClick={handleNextType}
                    className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Next
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};