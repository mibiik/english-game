import React from 'react';
import { Link } from 'react-router-dom';

interface GameCardProps {
  title: string;
  description: string;
  link: string;
}

export const GameCard: React.FC<GameCardProps> = ({ title, description, link }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="text-xl font-semibold text-gray-800 mb-2">{title}</div>
        <p className="text-gray-600 mb-4">{description}</p>
        <Link 
          to={link}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-300"
        >
          Oyna
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
};