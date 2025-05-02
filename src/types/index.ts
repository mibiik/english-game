export interface UserType {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  isOnline: boolean;
  unreadCount: number;
  lastSeen?: string;
}

export interface MessageType {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
  read: boolean;
}