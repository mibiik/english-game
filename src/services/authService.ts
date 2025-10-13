import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile as firebaseUpdateProfile,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  inMemoryPersistence,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth, db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { userService } from './userService';
import { userAnalyticsService } from './userAnalyticsService';

class AuthService {
  private static instance: AuthService;
  private currentUser: FirebaseUser | null = null;
  private authStateChangeListeners: ((user: FirebaseUser | null) => void)[] = [];

  private constructor() {
    // Kullanıcı oturum durumunu dinle
    onAuthStateChanged(auth, async (user) => {
      this.currentUser = user;
      this.saveAuthStateToStorage(user); // Oturum durumunu localStorage'a kaydet
      
      // Auth state change listener'ları çağır
      this.authStateChangeListeners.forEach(listener => {
        try {
          listener(user);
        } catch (error) {
          console.error('Auth state change listener hatası:', error);
        }
      });
      
              // Kullanıcı oturum açtığında users koleksiyonuna kaydet
        if (user) {
          try {
            const existingUser = await userService.getUser(user.uid);
            if (!existingUser) {
              // Kullanıcı users koleksiyonunda yoksa ekle
              await userService.registerUser(
                user.displayName || 'Kullanıcı',
                user.email || '',
                user.photoURL || undefined,
                user.uid
              );
            } else {
              // Kullanıcı varsa online durumunu güncelle
              await userService.updateOnlineStatus(user.uid, true);
            }
            
            // Giriş aktivitesi tamamlandı
            console.log('✅ Giriş aktivitesi tamamlandı');
          } catch (userError) {
            console.error('Auth state değişikliği sırasında kullanıcı kontrolü hatası:', userError);
          }
        }
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
      // Önce oturum kalıcılığını ayarla (fallback'lerle)
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch (eLocal) {
        try {
          await setPersistence(auth, browserSessionPersistence);
        } catch (eSession) {
          await setPersistence(auth, inMemoryPersistence);
        }
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Kullanıcı adını güncelle
      if (userCredential.user) {
        await firebaseUpdateProfile(userCredential.user, { displayName });
        
        // Kullanıcıyı users koleksiyonuna da ekle
        try {
          await userService.registerUser(displayName, email, undefined, userCredential.user.uid);
        } catch (userError) {
          console.error('Kullanıcı users koleksiyonuna eklenirken hata:', userError);
          // Bu hata ana kayıt işlemini engellememeli
        }
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
      // Önce oturum kalıcılığını ayarla (fallback'lerle)
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch (eLocal) {
        try {
          await setPersistence(auth, browserSessionPersistence);
        } catch (eSession) {
          await setPersistence(auth, inMemoryPersistence);
        }
      }
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Giriş olayını kaydet
      if (userCredential.user) {
        await this.logLoginEvent(userCredential.user.uid, userCredential.user.email, userCredential.user.displayName);
        
        // Kullanıcının users koleksiyonunda olup olmadığını kontrol et
        try {
          const existingUser = await userService.getUser(userCredential.user.uid);
          if (!existingUser) {
            // Kullanıcı users koleksiyonunda yoksa ekle
            await userService.registerUser(
              userCredential.user.displayName || 'Kullanıcı',
              userCredential.user.email || '',
              userCredential.user.photoURL || undefined,
              userCredential.user.uid
            );
          } else {
            // Kullanıcı varsa online durumunu güncelle
            await userService.updateOnlineStatus(userCredential.user.uid, true);
          }
        } catch (userError) {
          console.error('Kullanıcı users koleksiyonu kontrolü sırasında hata:', userError);
          // Bu hata ana giriş işlemini engellememeli
        }
      }
      return userCredential.user;
    } catch (error) {
      console.error('Kullanıcı girişi sırasında hata oluştu:', error);
      throw error;
    }
  }

    // Google ile giriş
  public async signInWithGoogle(): Promise<FirebaseUser> {
    try {
      console.log('🔐 Google girişi başlatılıyor...');
      
      // Önce oturum kalıcılığını ayarla (fallback'lerle)
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch (eLocal) {
        try {
          await setPersistence(auth, browserSessionPersistence);
        } catch (eSession) {
          await setPersistence(auth, inMemoryPersistence);
        }
      }
      console.log('✅ Oturum kalıcılığı ayarlandı');
      
      const provider = new GoogleAuthProvider();
      console.log('🔧 Google provider oluşturuldu');
      
      const result = await signInWithPopup(auth, provider);
      console.log('✅ Google popup başarılı:', result.user.email);
      
      // Kullanıcının users koleksiyonunda olup olmadığını kontrol et
      try {
        const existingUser = await userService.getUser(result.user.uid);
        if (!existingUser) {
          console.log('📝 Yeni kullanıcı users koleksiyonuna ekleniyor...');
          // Kullanıcı users koleksiyonunda yoksa ekle
          await userService.registerUser(
            result.user.displayName || 'Kullanıcı',
            result.user.email || '',
            result.user.photoURL || undefined,
            result.user.uid
          );
          console.log('✅ Yeni kullanıcı kaydedildi');
        } else {
          console.log('🔄 Mevcut kullanıcı online durumu güncelleniyor...');
          // Kullanıcı varsa online durumunu güncelle
          await userService.updateOnlineStatus(result.user.uid, true);
          console.log('✅ Online durum güncellendi');
        }
        
        // Giriş aktivitesi tamamlandı
        console.log('✅ Giriş aktivitesi tamamlandı');
      } catch (userError) {
        console.error('❌ Google girişi sırasında kullanıcı kontrolü hatası:', userError);
      }
      
      return result.user;
    } catch (error) {
      console.error('❌ Google ile giriş sırasında hata oluştu:', error);
      
      // Hata türüne göre özel mesajlar
      let errorMessage = 'Bilinmeyen hata';
      if (error instanceof Error) {
        if (error.message.includes('popup-closed-by-user')) {
          errorMessage = 'Giriş işlemi iptal edildi';
        } else if (error.message.includes('popup-blocked')) {
          errorMessage = 'Popup engellendi - Lütfen popup engelleyiciyi kapatın';
        } else if (error.message.includes('auth/popup-closed-by-user')) {
          errorMessage = 'Giriş penceresi kapatıldı';
        } else if (error.message.includes('auth/cancelled-popup-request')) {
          errorMessage = 'Giriş işlemi iptal edildi';
        } else if (error.message.includes('auth/operation-not-allowed')) {
          errorMessage = 'Google girişi etkin değil - Firebase ayarlarını kontrol edin';
        } else {
          errorMessage = error.message;
        }
      }
      
      console.error('🔍 Hata detayları:', {
        errorType: error instanceof Error ? error.constructor.name : 'Unknown',
        errorMessage: errorMessage,
        errorStack: error instanceof Error ? error.stack : 'No stack'
      });
      
      throw new Error(errorMessage);
    }
  }

  // Şifre sıfırlama
  public async resetPassword(email: string): Promise<void> {
    try {
      // Action code settings ile e-posta gönder
      const actionCodeSettings = {
        url: window.location.origin + '/home',
        handleCodeInApp: false,
        iOS: {
          bundleId: 'com.wordplay.app'
        },
        android: {
          packageName: 'com.wordplay.app',
          installApp: true,
          minimumVersion: '12'
        },
        dynamicLinkDomain: 'engllish-e9b66.page.link'
      };
      
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
    } catch (error) {
      console.error('Şifre sıfırlama sırasında hata oluştu:', error);
      throw error;
    }
  }

  // Kullanıcı çıkışı
  public async logout(): Promise<void> {
    try {
      const currentUserId = this.getCurrentUserId();
      await signOut(auth);
      
      // localStorage'ı temizle
      localStorage.removeItem('authUser');
      localStorage.removeItem('authUserId');
      localStorage.removeItem('lastAuthCheck');
      
      // Kullanıcının online durumunu false yap
      if (currentUserId) {
        try {
          await userService.updateOnlineStatus(currentUserId, false);
          // Çıkış aktivitesi tamamlandı
          console.log('✅ Çıkış aktivitesi tamamlandı');
        } catch (userError) {
          console.error('Kullanıcı online durumu güncellenirken hata:', userError);
          // Bu hata ana çıkış işlemini engellememeli
        }
      }
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

  public onAuthStateChange(callback: (user: FirebaseUser | null) => void): () => void {
    this.authStateChangeListeners.push(callback);
    
    // Unsubscribe function döndür
    return () => {
      const index = this.authStateChangeListeners.indexOf(callback);
      if (index > -1) {
        this.authStateChangeListeners.splice(index, 1);
      }
    };
  }

  // Kullanıcı ID'sini getir
  public getCurrentUserId(): string | null {
    return this.currentUser?.uid || null;
  }

  // Auth state değişikliklerini dinle
  public onAuthStateChanged(callback: (user: FirebaseUser | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  // Kullanıcı oturum durumunu localStorage'da sakla
  private saveAuthStateToStorage(user: FirebaseUser | null): void {
    if (user) {
      localStorage.setItem('authUser', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastLogin: new Date().toISOString()
      }));
      // App.tsx ile senkronizasyon için
      localStorage.setItem('authUserId', user.uid);
      localStorage.setItem('lastAuthCheck', new Date().toISOString());
    } else {
      localStorage.removeItem('authUser');
      localStorage.removeItem('authUserId');
      localStorage.removeItem('lastAuthCheck');
    }
  }

  // localStorage'dan kullanıcı bilgilerini al
  public getStoredUser(): any {
    const stored = localStorage.getItem('authUser');
    return stored ? JSON.parse(stored) : null;
  }

  // Kullanıcının son giriş zamanını kontrol et
  public isSessionValid(): boolean {
    const stored = this.getStoredUser();
    if (!stored) return false;
    
    const lastLogin = new Date(stored.lastLogin);
    const now = new Date();
    const diffInHours = (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60);
    
    // 30 gün geçerli (720 saat)
    return diffInHours < 720;
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