import React, { useState } from 'react';
import { SendHorizonal } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Bir mesaj yazın..."
        className="flex-1 bg-gray-700 border-2 border-gray-600 rounded-full py-3 px-5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300"
      />
      <motion.button
        type="submit"
        className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        disabled={!message.trim()}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <SendHorizonal size={24} />
      </motion.button>
    </form>
  );
};