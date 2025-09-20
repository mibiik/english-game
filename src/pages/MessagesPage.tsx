import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, ArrowLeft, User, Search, MoreVertical, Trash2, Check, CheckCheck } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { supabase } from '../config/supabase';

interface UserProfile {
  userId: string;
  displayName: string;
  email: string;
  photoURL?: string;
  isOnline?: boolean;
  lastSeen?: Date;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

interface Conversation {
  userId: string;
  user: UserProfile;
  lastMessage: Message;
  unreadCount: number;
}

const MessagesPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/home');
      return;
    }

    loadConversations();
  }, []);

  // Keşfet sayfasından gelen kullanıcıyla otomatik sohbet başlat
  useEffect(() => {
    if (location.state?.selectedUserId && conversations.length > 0) {
      const selectedUserId = location.state.selectedUserId;
      const selectedUserName = location.state.selectedUserName;
      
      // Bu kullanıcıyla konuşma var mı kontrol et
      const existingConversation = conversations.find(conv => conv.userId === selectedUserId);
      
      if (existingConversation) {
        // Mevcut konuşma varsa onu seç
        setSelectedConversation(existingConversation);
      } else {
        // Yeni konuşma oluştur
        const newConversation = {
          userId: selectedUserId,
          user: { 
            displayName: selectedUserName,
            email: '',
            photoURL: '',
            isOnline: false,
            lastSeen: new Date()
          },
          lastMessage: { content: 'Yeni konuşma', timestamp: new Date() },
          unreadCount: 0,
          isNew: true
        };
        
        setSelectedConversation(newConversation);
        setMessages([]);
      }
      
      // State'i temizle
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, conversations]);

  useEffect(() => {
    filterConversations();
  }, [conversations, searchTerm]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.userId);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      setLoading(true);
      const currentUserId = authService.getCurrentUserId();
      
      if (!currentUserId) {
        navigate('/home');
        return;
      }

      // Tüm mesajları al
      const messagesQuery = query(collection(db, 'messages'));
      const snapshot = await getDocs(messagesQuery);
      
      const conversations = new Map();
      
      // Mesajları işle
      snapshot.forEach((doc) => {
        const data = doc.data();
        const message = {
          ...data,
          timestamp: data.timestamp?.toDate() || new Date()
        };
        
        // Sadece bu kullanıcının mesajları
        if (message.senderId === currentUserId || message.receiverId === currentUserId) {
          const otherUserId = message.senderId === currentUserId ? message.receiverId : message.senderId;
          
          if (!conversations.has(otherUserId)) {
            conversations.set(otherUserId, {
              userId: otherUserId,
              user: { displayName: 'Yükleniyor...' },
              lastMessage: message,
              unreadCount: 0
            });
          } else {
            const conv = conversations.get(otherUserId);
            if (message.timestamp > conv.lastMessage.timestamp) {
              conv.lastMessage = message;
            }
          }
        }
      });
      
      // Kullanıcı bilgilerini yükle
      const conversationsArray = Array.from(conversations.values());
      const userPromises = conversationsArray.map(async (conv) => {
        try {
          const userDoc = await getDoc(doc(db, 'userProfiles', conv.userId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Bot kullanıcıları filtrele
            if (userData.displayName?.includes('Bot') || 
                userData.displayName?.includes('bot') ||
                userData.name?.includes('Bot') ||
                userData.name?.includes('bot') ||
                userData.email?.includes('bot') ||
                userData.email?.includes('system')) {
              return null; // Bot kullanıcısını filtrele
            }
            
            conv.user = {
              userId: conv.userId,
              displayName: userData.displayName || userData.name || `Kullanıcı ${conv.userId.slice(0, 8)}`,
              email: userData.email || '',
              photoURL: userData.photoURL || '',
              isOnline: userData.isOnline || false,
              lastSeen: userData.lastSeen?.toDate() || new Date()
            };
                      } else {
              // userProfiles'da yoksa admin_notifications'dan dene
              const notifDoc = await getDoc(doc(db, 'admin_notifications', conv.userId));
              if (notifDoc.exists()) {
                const notifData = notifDoc.data();
                // Bot kullanıcıları filtrele
                if (notifData.displayName?.includes('Bot') || 
                    notifData.displayName?.includes('bot') ||
                    notifData.name?.includes('Bot') ||
                    notifData.name?.includes('bot') ||
                    notifData.email?.includes('bot') ||
                    notifData.email?.includes('system')) {
                  return null; // Bot kullanıcısını filtrele
                }
                
                conv.user = {
                  userId: conv.userId,
                  displayName: notifData.displayName || notifData.name || `Kullanıcı ${conv.userId.slice(0, 8)}`,
                  email: notifData.email || '',
                  photoURL: notifData.photoURL || '',
                  isOnline: false,
                  lastSeen: new Date()
                };
                
                // Debug: Admin notifications'dan yüklenen kullanıcı bilgileri
                console.log('Admin notifications\'dan kullanıcı bilgileri yüklendi:', {
                  userId: conv.userId,
                  displayName: conv.user.displayName,
                  notifData: notifData
                });
              } else {
                // users koleksiyonundan da dene
                const usersDoc = await getDoc(doc(db, 'users', conv.userId));
                if (usersDoc.exists()) {
                  const usersData = usersDoc.data();
                  // Bot kullanıcıları filtrele
                  if (usersData.displayName?.includes('Bot') || 
                      usersData.displayName?.includes('bot') ||
                      usersData.name?.includes('Bot') ||
                      usersData.name?.includes('bot') ||
                      usersData.email?.includes('bot') ||
                      usersData.email?.includes('system')) {
                    return null; // Bot kullanıcısını filtrele
                  }
                  
                  conv.user = {
                    userId: conv.userId,
                    displayName: usersData.displayName || usersData.name || `Kullanıcı ${conv.userId.slice(0, 8)}`,
                    email: usersData.email || '',
                    photoURL: usersData.photoURL || '',
                    isOnline: false,
                    lastSeen: new Date()
                  };
                  
                  // Debug: Users koleksiyonundan yüklenen kullanıcı bilgileri
                  console.log('Users koleksiyonundan kullanıcı bilgileri yüklendi:', {
                    userId: conv.userId,
                    displayName: conv.user.displayName,
                    usersData: usersData
                  });
                } else {
                  // Bilinmeyen kullanıcıları da filtrele
                  return null;
                }
              }
            }
        } catch (error) {
          console.error('Kullanıcı bilgisi yüklenirken hata:', error);
          return null; // Hata durumunda da filtrele
        }
        return conv;
      });

      const conversationsWithUsers = (await Promise.all(userPromises)).filter(Boolean);
      setConversations(conversationsWithUsers);
      
    } catch (error) {
      console.error('Hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterConversations = () => {
    if (!searchTerm) {
      setFilteredConversations(conversations);
      return;
    }

    const filtered = conversations.filter(conv =>
      conv.user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.lastMessage.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredConversations(filtered);
  };

  // Yeni kullanıcı arama fonksiyonu
  const searchUsers = async () => {
    if (!searchTerm.trim()) return;
    
    try {
      const foundUsers = [];
      
      // userProfiles'dan ara
      const usersQuery = query(collection(db, 'userProfiles'));
      const usersSnapshot = await getDocs(usersQuery);
      
      usersSnapshot.forEach((doc) => {
        const data = doc.data();
        // Bot kullanıcıları filtrele
        if (data.displayName?.includes('Bot') || 
            data.displayName?.includes('bot') ||
            data.name?.includes('Bot') ||
            data.name?.includes('bot') ||
            data.email?.includes('bot') ||
            data.email?.includes('system')) {
          return; // Bot kullanıcısını atla
        }
        
        if (data.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            data.name?.toLowerCase().includes(searchTerm.toLowerCase())) {
          foundUsers.push({
            userId: doc.id,
            displayName: data.displayName || data.name || `Kullanıcı ${doc.id.slice(0, 8)}`,
            photoURL: data.photoURL || ''
          });
        }
      });
      
      // admin_notifications'dan da ara
      const notifQuery = query(collection(db, 'admin_notifications'));
      const notifSnapshot = await getDocs(notifQuery);
      
      notifSnapshot.forEach((doc) => {
        const data = doc.data();
        const userId = data.userId || data.user_id || doc.id;
        
        // Bot kullanıcıları filtrele
        if (data.displayName?.includes('Bot') || 
            data.displayName?.includes('bot') ||
            data.name?.includes('Bot') ||
            data.name?.includes('bot') ||
            data.email?.includes('bot') ||
            data.email?.includes('system')) {
          return; // Bot kullanıcısını atla
        }
        
        if ((data.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             data.name?.toLowerCase().includes(searchTerm.toLowerCase())) &&
            !foundUsers.find(u => u.userId === userId)) {
          foundUsers.push({
            userId: userId,
            displayName: data.displayName || data.name || `Kullanıcı ${userId.slice(0, 8)}`,
            photoURL: data.photoURL || ''
          });
        }
      });
      
      // Bulunan kullanıcıları konuşma listesine ekle
      const newConversations = foundUsers.map(user => ({
        userId: user.userId,
        user: { 
          userId: user.userId,
          displayName: user.displayName,
          email: '',
          photoURL: user.photoURL,
          isOnline: false,
          lastSeen: new Date()
        },
        lastMessage: { content: 'Yeni konuşma başlat', timestamp: new Date() },
        unreadCount: 0,
        isNew: true
      }));
      
      setFilteredConversations([...newConversations, ...conversations]);
    } catch (error) {
      console.error('Kullanıcı arama hatası:', error);
    }
  };

  const loadMessages = async (otherUserId: string) => {
    try {
      const currentUserId = authService.getCurrentUserId();
      if (!currentUserId) return;

      // Tüm mesajları al
      const messagesQuery = query(collection(db, 'messages'));
      
      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const messagesData = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          const message = {
            ...data,
            timestamp: data.timestamp?.toDate() || new Date()
          };
          
          // Bu iki kullanıcı arasındaki mesajlar
          if ((message.senderId === currentUserId && message.receiverId === otherUserId) ||
              (message.senderId === otherUserId && message.receiverId === currentUserId)) {
            messagesData.push(message);
          }
        });
        
        setMessages(messagesData);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Hata:', error);
    }
  };

  const sendMessage = async (receiverId?: string) => {
    // Eğer receiverId verilmişse, yeni kullanıcıyla sohbet başlat
    if (receiverId) {
      // Yeni kullanıcıyla boş sohbet başlat
      const newConversation = {
        userId: receiverId,
        user: { displayName: `Kullanıcı ${receiverId.slice(0, 8)}` },
        lastMessage: { content: 'Yeni konuşma', timestamp: new Date() },
        unreadCount: 0,
        isNew: true
      };
      
      setSelectedConversation(newConversation);
      setMessages([]); // Boş mesaj listesi
      return;
    }

    // Normal mesaj gönderme
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const currentUserId = authService.getCurrentUserId();
      if (!currentUserId) return;

      const messageId = `${currentUserId}_${selectedConversation.userId}_${Date.now()}`;
      
      const message = {
        id: messageId,
        senderId: currentUserId,
        receiverId: selectedConversation.userId,
        content: newMessage.trim(),
        timestamp: new Date(),
        isRead: false
      };

      await setDoc(doc(db, 'messages', messageId), message);
      setNewMessage('');
    } catch (error) {
      console.error('Hata:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const deleteConversation = async (userId: string) => {
    try {
      const currentUserId = authService.getCurrentUserId();
      
      // Tüm mesajları al ve client-side filtreleme yap
      const messagesQuery = query(collection(db, 'messages'));
      const snapshot = await getDocs(messagesQuery);
      
      // Bu kullanıcı ile olan mesajları filtrele ve sil
      const deletePromises = snapshot.docs
        .map(doc => {
          const data = doc.data();
          const message = { ...data, id: doc.id } as Message;
          
          // Bu iki kullanıcı arasındaki mesajları kontrol et
          if ((message.senderId === currentUserId && message.receiverId === userId) ||
              (message.senderId === userId && message.receiverId === currentUserId)) {
            return deleteDoc(doc.ref);
          }
          return null;
        })
        .filter(Boolean);

      await Promise.all(deletePromises);

      // Konuşma listesini güncelle
      setConversations(prev => prev.filter(conv => conv.userId !== userId));
      if (selectedConversation?.userId === userId) {
        setSelectedConversation(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Konuşma silinirken hata:', error);
    }
  };

  const formatTime = (date: Date | any) => {
    // Firestore Timestamp objesi ise Date'e çevir
    let dateObj: Date;
    if (date && typeof date.toDate === 'function') {
      dateObj = date.toDate();
    } else if (date instanceof Date) {
      dateObj = date;
    } else {
      return 'Bilinmiyor';
    }

    const now = new Date();
    const diff = now.getTime() - dateObj.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Dün';
    } else if (days < 7) {
      return dateObj.toLocaleDateString('tr-TR', { weekday: 'short' });
    } else {
      return dateObj.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' });
    }
  };

  if (!authService.isAuthenticated()) {
      return (
    <div className="min-h-screen bg-gradient-to-b from-[#111] to-black text-white flex items-center justify-center" style={{ paddingTop: '64px', marginTop: '-128px' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Giriş Yapın</h1>
          <p className="text-gray-400 mb-6">Mesajları görüntülemek için giriş yapın</p>
          <button
            onClick={() => navigate('/home')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#111] to-black text-white" style={{ paddingTop: '64px', marginTop: '-128px' }}>
      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-500/20 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 h-screen flex">
        {/* Conversations List */}
        <div className={`w-full md:w-80 bg-gray-900/50 backdrop-blur-sm border-r border-gray-800 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
          {/* Header */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigate('/home')}
                className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold">Mesajlar</h1>
              <div className="w-10"></div>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Kullanıcı veya mesaj ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
                className="w-full pl-10 pr-20 py-2 bg-gray-800/50 rounded-lg border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm"
              />
              <button
                onClick={searchUsers}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors"
              >
                Ara
              </button>
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-20">
                <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-400 mb-2">Henüz mesaj yok</h3>
                <p className="text-gray-500 text-sm">Yeni arkadaşlar bulmak için oyunlara katılın</p>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {filteredConversations.map((conversation) => (
                  <motion.div
                    key={conversation.userId}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedConversation?.userId === conversation.userId
                        ? 'bg-blue-600/20 border border-blue-500/30'
                        : 'hover:bg-gray-800/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {conversation.user.displayName?.charAt(0).toUpperCase()}
                        </div>
                        {conversation.user.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-sm truncate">
                            {conversation.user.displayName}
                          </h3>
                          <span className="text-xs text-gray-400">
                            {formatTime(conversation.lastMessage.timestamp)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-gray-400 truncate">
                            {conversation.isNew ? (
                              <span className="text-blue-400">Yeni konuşma başlat</span>
                            ) : (
                              <>
                                {conversation.lastMessage.senderId === authService.getCurrentUserId() ? 'Sen: ' : ''}
                                {conversation.lastMessage.content}
                              </>
                            )}
                          </p>
                          {conversation.isNew ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                sendMessage(conversation.userId);
                              }}
                              className="ml-2 bg-green-600 hover:bg-green-700 text-white text-xs rounded-full px-3 py-1 transition-colors"
                            >
                              Sohbet Başlat
                            </button>
                          ) : (
                            conversation.unreadCount > 0 && (
                              <span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                {conversation.unreadCount}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-800 bg-gray-900/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedConversation(null)}
                    className="md:hidden p-2 rounded-full bg-gray-800/50 hover:bg-gray-800 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {selectedConversation.user.displayName?.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white">{selectedConversation.user.displayName}</h2>
                    <div className="flex items-center gap-2">
                      {selectedConversation.user.isOnline ? (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-green-400">Çevrimiçi</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">
                          Son görülme: {selectedConversation.user.lastSeen ? formatTime(selectedConversation.user.lastSeen) : 'Bilinmiyor'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => deleteConversation(selectedConversation.userId)}
                  className="p-2 rounded-full text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Konuşmayı sil"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages - Instagram Style */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => {
                const isOwn = message.senderId === authService.getCurrentUserId();
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      isOwn 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                        : 'bg-gray-800 text-gray-100'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <div className={`flex items-center justify-end gap-1 mt-2 ${
                        isOwn ? 'text-blue-200' : 'text-gray-400'
                      }`}>
                        <span className="text-xs opacity-70">{formatTime(message.timestamp)}</span>
                        {isOwn && (
                          message.isRead ? (
                            <CheckCheck className="w-3 h-3 text-blue-200" />
                          ) : (
                            <Check className="w-3 h-3" />
                          )
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input - Instagram Style */}
            <div className="p-4 border-t border-gray-800 bg-gray-900/30">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Mesaj yazın..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-4 py-3 bg-gray-800/50 rounded-full border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className={`p-3 rounded-full transition-all duration-200 ${
                    newMessage.trim() 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">Mesaj Seçin</h3>
              <p className="text-gray-500">Sohbet etmek için bir konuşma seçin</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage; 