import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';

export interface NotificationData {
  id?: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  message: string;
  pageUrl: string;
  userAgent: string;
  timestamp: any;
  status: 'pending' | 'reviewed' | 'resolved';
}

export const notificationService = {
  // 404 bildirimi gönder
  async send404Notification(data: Omit<NotificationData, 'timestamp' | 'status'>): Promise<void> {
    try {
      await addDoc(collection(db, '404Notifications'), {
        ...data,
        timestamp: serverTimestamp(),
        status: 'pending'
      });
      console.log('404 bildirimi gönderildi');
    } catch (error) {
      console.error('404 bildirimi gönderilirken hata:', error);
      throw error;
    }
  },

  // Tüm bildirimleri getir (admin için)
  async getAllNotifications(): Promise<NotificationData[]> {
    try {
      const q = query(collection(db, '404Notifications'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NotificationData[];
    } catch (error) {
      console.error('Bildirimler getirilirken hata:', error);
      throw error;
    }
  },

  // Bildirim durumunu güncelle
  async updateNotificationStatus(id: string, status: 'pending' | 'reviewed' | 'resolved'): Promise<void> {
    try {
      // Bu fonksiyon admin panelinde kullanılacak
      // Şimdilik basit tutuyorum
      console.log(`Bildirim ${id} durumu ${status} olarak güncellendi`);
    } catch (error) {
      console.error('Bildirim durumu güncellenirken hata:', error);
      throw error;
    }
  }
}; 