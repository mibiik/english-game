import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from "firebase/auth";
import { auth } from '../config/firebase';

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
        await updateProfile(userCredential.user, { displayName });
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