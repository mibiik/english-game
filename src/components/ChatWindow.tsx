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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center p-4 border-b bg-white shadow-sm">
        {isMobile && onBack && (
          <button 
            onClick={onBack}
            className="mr-2 p-1 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        
        <Avatar src={user.avatar} alt={user.name} size="md" />
        
        <div className="ml-3 flex-1">
          <h2 className="font-semibold">{user.name}</h2>
          <p className="text-xs text-gray-500">
            {user.isOnline ? 'Çevrimiçi' : 'Son görülme: ' + user.lastSeen}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Phone size={20} className="text-gray-600" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Video size={20} className="text-gray-600" />
          </button>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="flex flex-col space-y-3">
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
      <div className="p-4 bg-white border-t">
        <MessageInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
};