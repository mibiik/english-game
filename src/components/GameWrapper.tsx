import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { WordDetail } from '../data/words';

interface GameWrapperProps {
  component: React.ComponentType<any>;
  words: WordDetail[];
}

export const GameWrapper: React.FC<GameWrapperProps> = ({ component: Component, words }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (words && words.length === 0) {
      console.log("GameWrapper: No words found for this unit/level, redirecting to home.");
      navigate('/');
    }
  }, [words, navigate]);

  if (!words) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Kelimeler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (words.length === 0) {
    return null;
  }

  return <Component words={words} />;
}; 