import React from 'react';

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
  title: string;
  description: string;
  icon?: string;
}

export function GameModal({ isOpen, onClose, onStart, title, description, icon }: GameModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
        <div className="text-center space-y-6">
          {icon && (
            <div className="text-4xl mb-4">
              {icon}
            </div>
          )}
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            {title}
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            {description}
          </p>
          <div className="flex gap-4 pt-4">
            <button
              onClick={onStart}
              className="flex-1 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg
                transform transition-all duration-300 hover:scale-105 hover:shadow-lg
                active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            >
              Oyunu Başlat
            </button>
            <button
              onClick={onClose}
              className="px-6 py-4 bg-gray-100 text-gray-700 rounded-lg
                transform transition-all duration-300 hover:bg-gray-200
                active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              Kapat
            </button>
          </div>
          <div className="text-center text-sm text-gray-400 mt-4">
            powered by mirac
          </div>
        </div>
      </div>
    </div>
  );
}