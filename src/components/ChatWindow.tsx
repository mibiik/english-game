import React, { useEffect, useRef } from 'react';
import { MessageType, UserType } from '../types';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { ArrowLeft, Phone, Video } from 'lucide-react';
import { Avatar } from './Avatar';

interface ChatWindowProps {
  user: UserType;
  messages: MessageType[];
  onSendMessage: (message: string) => void;
  onBack?: () => void;
  isMobile?: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ 
  user, 
  messages, 
  onSendMessage,
  onBack,
  isMobile = false
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 text-white">
      {/* Header */}
      <div className="flex items-center p-3 border-b border-gray-700 bg-gray-800 shadow-md">
        {isMobile && onBack && (
          <button 
            onClick={onBack}
            className="mr-3 p-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft size={22} />
          </button>
        )}
        
        <Avatar src={user.avatar} alt={user.name} size="md" />
        
        <div className="ml-4 flex-1">
          <h2 className="font-bold text-lg">{user.name}</h2>
          <p className="text-xs text-green-400">
            {user.isOnline ? 'Çevrimiçi' : `Son görülme: ${user.lastSeen}`}
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button className="p-2 rounded-full hover:bg-gray-700 transition-colors">
            <Phone size={22} className="text-gray-400" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-700 transition-colors">
            <Video size={22} className="text-gray-400" />
          </button>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-900">
        <div className="flex flex-col space-y-4">
          {messages.map((message) => (
            <MessageBubble 
              key={message.id} 
              message={message} 
              isCurrentUser={message.sender === 'currentUser'} 
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Message input */}
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <MessageInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
};