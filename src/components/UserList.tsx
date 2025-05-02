import React, { useState, useEffect } from 'react';
import { Search, User } from 'lucide-react';
import { UserType } from '../types';
import { Avatar } from './Avatar';
import { auth, db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface UserListProps {
  users: UserType[];
  selectedUser: UserType | null;
  onSelectUser: (user: UserType) => void;
}

export const UserList: React.FC<UserListProps> = ({ 
  users, 
  selectedUser, 
  onSelectUser 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  useEffect(() => {
    if (!auth.currentUser) return;

    const unsubscribe = onSnapshot(
      doc(db, 'users', auth.currentUser.uid),
      (doc) => {
        setCurrentUser(doc.data());
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) &&
    user.id !== auth.currentUser?.uid
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-4 border-b">
        <Avatar 
          src={currentUser?.avatar || "https://via.placeholder.com/150"} 
          alt="Your profile" 
          size="md" 
        />
        <div className="ml-3">
          <h2 className="font-semibold">{currentUser?.name || 'Loading...'}</h2>
          <p className="text-sm text-gray-500">Online</p>
        </div>
      </div>
      
      <div className="p-4 border-b">
        <div className="relative">
          <input
            type="text"
            placeholder="Kullanıcı ara..."
            className="w-full py-2 pl-10 pr-4 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2 text-gray-400" size={18} />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.length > 0 ? (
          filteredUsers.map(user => (
            <div 
              key={user.id} 
              className={`flex items-center p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedUser?.id === user.id ? 'bg-blue-50' : ''
              }`}
              onClick={() => onSelectUser(user)}
            >
              <div className="relative">
                <Avatar src={user.avatar} alt={user.name} size="md" />
                {user.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                )}
              </div>
              
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex justify-between">
                  <h3 className="font-medium truncate">{user.name}</h3>
                  <span className="text-xs text-gray-500">
                    {user.lastMessageTime}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">{user.lastMessage}</p>
              </div>
              
              {user.unreadCount > 0 && (
                <span className="ml-2 flex items-center justify-center w-5 h-5 bg-blue-500 text-white text-xs rounded-full">
                  {user.unreadCount}
                </span>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-gray-500">
            <User size={48} className="mb-2 text-gray-400" />
            <p>Kullanıcı bulunamadı</p>
          </div>
        )}
      </div>
    </div>
  );
};