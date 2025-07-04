import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile as firebaseUpdateProfile
} from "firebase/auth";
import { auth, db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

class AuthService {
  private static instance: AuthService;
  private currentUser: FirebaseUser | null = null;

  private constructor() {
    // Kullanıcı oturum durumunu dinle
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
    });
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Kullanıcı kaydı
  public async register(email: string, password: string, displayName: string): Promise<FirebaseUser> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Kullanıcı adını güncelle
      if (userCredential.user) {
        await firebaseUpdateProfile(userCredential.user, { displayName });
      }
      return userCredential.user;
    } catch (error) {
      console.error('Kullanıcı kaydı sırasında hata oluştu:', error);
      throw error;
    }
  }

  // Kullanıcı girişi
  public async login(email: string, password: string): Promise<FirebaseUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Giriş olayını kaydet
      if (userCredential.user) {
        await this.logLoginEvent(userCredential.user.uid, userCredential.user.email, userCredential.user.displayName);
      }
      return userCredential.user;
    } catch (error) {
      console.error('Kullanıcı girişi sırasında hata oluştu:', error);
      throw error;
    }
  }

  // Kullanıcı çıkışı
  public async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Kullanıcı çıkışı sırasında hata oluştu:', error);
      throw error;
    }
  }

  // Mevcut kullanıcıyı getir
  public getCurrentUser(): FirebaseUser | null {
    return this.currentUser;
  }

  // Kullanıcının oturum açıp açmadığını kontrol et
  public isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  // Kullanıcı ID'sini getir
  public getCurrentUserId(): string | null {
    return this.currentUser?.uid || null;
  }

  // Auth state değişikliklerini dinle
  public onAuthStateChanged(callback: (user: FirebaseUser | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  // Profil güncelleme
  public async updateProfile(data: { displayName?: string; photoURL?: string }): Promise<void> {
    try {
      if (!this.currentUser) {
        throw new Error('Kullanıcı oturum açmamış');
      }
      await firebaseUpdateProfile(this.currentUser, data);
    } catch (error) {
      console.error('Profil güncellenirken hata oluştu:', error);
      throw error;
    }
  }

  // Giriş olayını kaydetmek için yeni özel fonksiyon
  private async logLoginEvent(userId: string, email: string | null, displayName: string | null): Promise<void> {
    try {
      // Giriş log'larını yönetici bildirimleri için ayrı bir koleksiyona kaydediyoruz.
      await addDoc(collection(db, "admin_notifications"), {
        userId: userId,
        email: email,
        displayName: displayName,
        timestamp: serverTimestamp(),
        read: false // Bildirimin okunup okunmadığını takip etmek için bir alan
      });
    } catch (error) {
      console.error("Giriş log'u kaydedilirken hata:", error);
      // Loglama hatası ana giriş akışını engellememeli, bu yüzden hatayı sadece konsola yazdırıyoruz.
    }
  }
}

export const authService = AuthService.getInstance();

import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  return { currentUser };
};