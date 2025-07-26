import { MessageType, UserType } from '../types';

export const mockUsers: UserType[] = [
  {
    id: '1',
    name: 'Ayşe Yılmaz',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    lastMessage: 'Yarın görüşürüz!',
    lastMessageTime: '14:32',
    isOnline: true,
    unreadCount: 2,
    lastSeen: '1 saat önce'
  },
  {
    id: '2',
    name: 'Mehmet Kaya',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    lastMessage: 'Proje ne durumda?',
    lastMessageTime: '12:05',
    isOnline: false,
    unreadCount: 0,
    lastSeen: '2 saat önce'
  },
  {
    id: '3',
    name: 'Zeynep Demir',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    lastMessage: 'Toplantı için hazır mısın?',
    lastMessageTime: 'Dün',
    isOnline: true,
    unreadCount: 0,
    lastSeen: 'Şimdi'
  },
  {
    id: '4',
    name: 'Ali Öztürk',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    lastMessage: 'İyi akşamlar!',
    lastMessageTime: 'Dün',
    isOnline: false,
    unreadCount: 0,
    lastSeen: '3 gün önce'
  },
  {
    id: '5',
    name: 'Elif Yıldız',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    lastMessage: 'Dosyaları aldım, teşekkürler.',
    lastMessageTime: 'Pazartesi',
    isOnline: false,
    unreadCount: 0,
    lastSeen: '5 gün önce'
  }
];

export const mockMessages: MessageType[] = [
  {
    id: 'msg-1',
    sender: 'user1',
    text: 'Merhaba, nasılsın?',
    timestamp: new Date('2023-09-15T10:30:00'),
    read: true
  },
  {
    id: 'msg-2',
    sender: 'currentUser',
    text: 'İyiyim, teşekkür ederim! Sen nasılsın?',
    timestamp: new Date('2023-09-15T10:32:00'),
    read: true
  },
  {
    id: 'msg-3',
    sender: 'user1',
    text: 'Ben de iyiyim. Bugün toplantımız var mı?',
    timestamp: new Date('2023-09-15T10:33:00'),
    read: true
  },
  {
    id: 'msg-4',
    sender: 'currentUser',
    text: 'Evet, saat 14:00\'de. Hazırladığın sunumu getirmeyi unutma!',
    timestamp: new Date('2023-09-15T10:35:00'),
    read: true
  },
  {
    id: 'msg-5',
    sender: 'user1',
    text: 'Tamam, not aldım. Görüşürüz!',
    timestamp: new Date('2023-09-15T10:36:00'),
    read: true
  },
  {
    id: 'msg-6',
    sender: 'currentUser',
    text: 'Görüşürüz!',
    timestamp: new Date('2023-09-15T10:37:00'),
    read: false
  }
];