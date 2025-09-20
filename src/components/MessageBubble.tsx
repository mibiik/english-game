import React from 'react';
import { MessageType } from '../types';
import { motion } from 'framer-motion';

interface MessageBubbleProps {
  message: MessageType;
  isCurrentUser: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isCurrentUser }) => {
  const alignment = isCurrentUser ? 'items-end' : 'items-start';
  const bubbleColor = isCurrentUser 
    ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white' 
    : 'bg-gray-700 text-gray-200';
  const bubbleRounded = isCurrentUser 
    ? 'rounded-l-2xl rounded-tr-2xl rounded-br-md' 
    : 'rounded-r-2xl rounded-tl-2xl rounded-bl-md';
  const senderName = isCurrentUser ? 'Siz' : message.sender;

  return (
    <motion.div
      className={`flex flex-col w-full max-w-lg ${isCurrentUser ? 'ml-auto' : 'mr-auto'} ${alignment}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`flex items-center mb-1 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
        <span className="text-xs text-gray-400 font-semibold px-2">
          {senderName}
        </span>
        <span className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div 
        className={`px-4 py-3 ${bubbleColor} ${bubbleRounded} shadow-md transition-all duration-300 hover:shadow-lg`}
      >
        <p className="text-base">{message.text}</p>
      </div>
    </motion.div>
  );
};