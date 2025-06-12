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
    if (!words || words.length === 0) {
      console.log("GameWrapper: No words provided, redirecting to home.");
      navigate('/');
    }
  }, [words, navigate]);

  if (!words || words.length === 0) {
    return null; // or a loading spinner
  }

  return <Component words={words} />;
}; 