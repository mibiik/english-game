import React from 'react';
import { Check, CheckCheck } from 'lucide-react';
import { MessageType } from '../types';

interface MessageBubbleProps {
  message: MessageType;
  isCurrentUser: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isCurrentUser 
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[75%] p-3 rounded-lg ${
          isCurrentUser 
            ? 'bg-blue-500 text-white rounded-br-none' 
            : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
        }`}
      >
        <p className="mb-1">{message.text}</p>
        <div className={`flex items-center justify-end text-xs ${
          isCurrentUser ? 'text-blue-100' : 'text-gray-500'
        }`}>
          <span>{formatTime(new Date(message.timestamp))}</span>
          
          {isCurrentUser && (
            <span className="ml-1">
              {message.read ? (
                <CheckCheck size={14} className="inline" />
              ) : (
                <Check size={14} className="inline" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};