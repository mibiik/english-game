import React, { useState } from 'react';
import { Smile, Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <button 
        type="button"
        className="p-2 mr-2 text-gray-500 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Smile size={24} />
      </button>
      
      <input
        type="text"
        placeholder="Mesaj yazın..."
        className="flex-1 py-3 px-4 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      
      <button 
        type="submit"
        className={`p-2 ml-2 rounded-full ${
          message.trim() 
            ? 'bg-blue-500 text-white hover:bg-blue-600' 
            : 'bg-gray-200 text-gray-500'
        } transition-colors`}
        disabled={!message.trim()}
      >
        <Send size={24} />
      </button>
    </form>
  );
};