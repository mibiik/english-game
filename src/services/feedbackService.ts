import { supabase } from '../config/supabase';
import { db } from '../config/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';

export interface Feedback {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'general' | 'technical' | 'bug' | 'feature_request' | 'complaint' | 'other';
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  adminNotes?: string;
  assignedTo?: string;
}

class FeedbackService {
  private readonly collectionName = 'feedbacks';

  // Yeni feedback oluştur
  async createFeedback(feedback: Omit<Feedback, 'id' | 'status' | 'priority' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const feedbackData: Omit<Feedback, 'id'> = {
        ...feedback,
        status: 'new',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await addDoc(collection(db, this.collectionName), feedbackData);
      return docRef.id;
    } catch (error) {
      console.error('Feedback oluşturulurken hata:', error);
      throw new Error('Feedback gönderilemedi');
    }
  }

  // Tüm feedback'leri getir (admin için)
  async getAllFeedbacks(): Promise<Feedback[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const feedbacks: Feedback[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        feedbacks.push({
          id: doc.id,
          ...data,
          createdAt: (data.createdAt as Timestamp).toDate(),
          updatedAt: (data.updatedAt as Timestamp).toDate(),
          resolvedAt: data.resolvedAt ? (data.resolvedAt as Timestamp).toDate() : undefined
        } as Feedback);
      });
      
      return feedbacks;
    } catch (error) {
      console.error('Feedback\'ler getirilirken hata:', error);
      throw new Error('Feedback\'ler yüklenemedi');
    }
  }

  // Status'a göre feedback'leri getir
  async getFeedbacksByStatus(status: Feedback['status']): Promise<Feedback[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const feedbacks: Feedback[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        feedbacks.push({
          id: doc.id,
          ...data,
          createdAt: (data.createdAt as Timestamp).toDate(),
          updatedAt: (data.updatedAt as Timestamp).toDate(),
          resolvedAt: data.resolvedAt ? (data.resolvedAt as Timestamp).toDate() : undefined
        } as Feedback);
      });
      
      return feedbacks;
    } catch (error) {
      console.error('Status\'a göre feedback\'ler getirilirken hata:', error);
      throw new Error('Feedback\'ler yüklenemedi');
    }
  }

  // Feedback durumunu güncelle
  async updateFeedbackStatus(feedbackId: string, status: Feedback['status'], adminNotes?: string): Promise<void> {
    try {
      const feedbackRef = doc(db, this.collectionName, feedbackId);
      const updateData: Partial<Feedback> = {
        status,
        updatedAt: new Date()
      };

      if (status === 'resolved' || status === 'closed') {
        updateData.resolvedAt = new Date();
      }

      if (adminNotes) {
        updateData.adminNotes = adminNotes;
      }

      await updateDoc(feedbackRef, updateData);
    } catch (error) {
      console.error('Feedback durumu güncellenirken hata:', error);
      throw new Error('Feedback güncellenemedi');
    }
  }

  // Feedback'i sil
  async deleteFeedback(feedbackId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.collectionName, feedbackId));
    } catch (error) {
      console.error('Feedback silinirken hata:', error);
      throw new Error('Feedback silinemedi');
    }
  }

  // Feedback istatistiklerini getir
  async getFeedbackStats(): Promise<{
    total: number;
    new: number;
    inProgress: number;
    resolved: number;
    closed: number;
    urgent: number;
    high: number;
  }> {
    try {
      const allFeedbacks = await this.getAllFeedbacks();
      
      return {
        total: allFeedbacks.length,
        new: allFeedbacks.filter(f => f.status === 'new').length,
        inProgress: allFeedbacks.filter(f => f.status === 'in_progress').length,
        resolved: allFeedbacks.filter(f => f.status === 'resolved').length,
        closed: allFeedbacks.filter(f => f.status === 'closed').length,
        urgent: allFeedbacks.filter(f => f.priority === 'urgent').length,
        high: allFeedbacks.filter(f => f.priority === 'high').length
      };
    } catch (error) {
      console.error('Feedback istatistikleri getirilirken hata:', error);
      return {
        total: 0,
        new: 0,
        inProgress: 0,
        resolved: 0,
        closed: 0,
        urgent: 0,
        high: 0
      };
    }
  }
}

export const feedbackService = new FeedbackService();
