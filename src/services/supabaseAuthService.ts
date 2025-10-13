import { supabase, auth } from '../config/supabase';
import { User } from '@supabase/supabase-js';

export interface SupabaseUser {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  totalScore: number;
  gamesPlayed: number;
  lastPlayed: string;
  level: string;
  bio?: string;
  location?: string;
  isOnline: boolean;
  lastSeen: string;
  createdAt: string;
  updatedAt: string;
  isPremium?: boolean;
  premiumUntil?: string;
  badges?: string[];
  isFirstSupporter?: boolean;
}

class SupabaseAuthService {
  private currentUser: User | null = null;

  constructor() {
    // Auth state değişikliklerini dinle
    auth.onAuthStateChange((event, session) => {
      this.currentUser = session?.user || null;
      this.saveAuthStateToStorage(session?.user);
      
      if (session?.user) {
        this.ensureUserExists(session.user);
      }
    });
  }

  // Kullanıcı kaydı
  async register(email: string, password: string, displayName: string): Promise<User> {
    try {
      const { data, error } = await auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName
          },
          emailRedirectTo: undefined // Email confirmation'ı atla
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('Kullanıcı oluşturulamadı');
      }

      // Kullanıcıyı users tablosuna ekle
      await this.createUserProfile(data.user, displayName);

      return data.user;
    } catch (error) {
      console.error('Kullanıcı kaydı sırasında hata:', error);
      throw error;
    }
  }

  // Kullanıcı girişi
  async login(email: string, password: string): Promise<User> {
    try {
      const { data, error } = await auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('Giriş başarısız');
      }

      // Kullanıcının users tablosunda olup olmadığını kontrol et
      await this.ensureUserExists(data.user);

      return data.user;
    } catch (error) {
      console.error('Kullanıcı girişi sırasında hata:', error);
      throw error;
    }
  }


  // Kullanıcı çıkışı
  async logout(): Promise<void> {
    try {
      console.log('🚪 Çıkış yapılıyor...');
      
      // Önce localStorage'ı temizle
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('authUserId');
      localStorage.removeItem('lastAuthCheck');
      
      // Supabase'den çıkış yap
      const { error } = await auth.signOut();
      
      if (error) {
        console.error('Supabase logout error:', error);
        // Hata olsa bile localStorage temizlendiği için devam et
      }

      this.currentUser = null;
      console.log('✅ Çıkış başarıyla tamamlandı');
      
      // Sayfayı yenile (auth state'in güncellenmesi için)
      window.location.reload();
    } catch (error) {
      console.error('Kullanıcı çıkışı sırasında hata:', error);
      // Hata olsa bile sayfayı yenile
      window.location.reload();
    }
  }

  // Mevcut kullanıcıyı getir
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Kullanıcının oturum açıp açmadığını kontrol et
  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  // Kullanıcı ID'sini getir
  getCurrentUserId(): string | null {
    return this.currentUser?.id || null;
  }

  // Kullanıcı email'ini getir
  getCurrentUserEmail(): string | null {
    return this.currentUser?.email || null;
  }

  // Kullanıcı profili oluştur
  private async createUserProfile(user: User, displayName: string): Promise<void> {
    try {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('users')
        .insert({
          id: user.id,
          display_name: displayName,
          email: user.email,
          avatar_url: user.user_metadata?.avatar_url || null,
          total_score: 0,
          games_played: 0,
          last_played: now,
          level: 'intermediate',
          bio: '',
          location: '',
          is_online: true,
          last_seen: now,
          is_premium: false,
          premium_until: null,
          badges: [],
          is_first_supporter: false
        });

      if (error) {
        console.error('Kullanıcı profili oluşturulamadı:', error);
        throw error;
      } else {
        console.log('✅ Kullanıcı profili oluşturuldu:', user.id);
      }
    } catch (error) {
      console.error('Kullanıcı profili oluşturma hatası:', error);
      throw error;
    }
  }

  // Kullanıcının veritabanında olup olmadığını kontrol et
  private async ensureUserExists(user: User): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Kullanıcı yoksa oluştur
        await this.createUserProfile(user, user.user_metadata?.display_name || 'Kullanıcı');
      } else if (error) {
        console.error('Kullanıcı kontrolü hatası:', error);
      }
    } catch (error) {
      console.error('Kullanıcı kontrolü hatası:', error);
    }
  }

  // Oturum durumunu localStorage'a kaydet
  private saveAuthStateToStorage(user: User | null): void {
    if (user) {
      localStorage.setItem('supabase.auth.token', JSON.stringify({
        id: user.id,
        email: user.email,
        displayName: user.user_metadata?.display_name,
        photoURL: user.user_metadata?.avatar_url,
        lastLogin: new Date().toISOString()
      }));
      localStorage.setItem('authUserId', user.id);
      localStorage.setItem('lastAuthCheck', new Date().toISOString());
    } else {
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('authUserId');
      localStorage.removeItem('lastAuthCheck');
    }
  }

  // localStorage'dan kullanıcı bilgilerini al
  getStoredUser(): any {
    const stored = localStorage.getItem('supabase.auth.token');
    return stored ? JSON.parse(stored) : null;
  }

  // Session'ın hala geçerli olup olmadığını kontrol et
  async isSessionValid(): Promise<boolean> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Session check error:', error);
        return false;
      }
      
      if (session?.user) {
        // Session geçerli, localStorage'ı güncelle
        this.saveAuthStateToStorage(session.user);
        return true;
      } else {
        // Session geçersiz, localStorage'ı temizle
        this.saveAuthStateToStorage(null);
        return false;
      }
    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    }
  }

  // Oturum geçerliliğini kontrol et (localStorage'dan)
  isSessionValidLocal(): boolean {
    const stored = this.getStoredUser();
    if (!stored) return false;
    
    // Session süresini kontrol etme, sadece localStorage'da veri var mı kontrol et
    return true;
  }

  // Profil güncelleme
  async updateProfile(data: { displayName?: string; photoURL?: string }): Promise<void> {
    try {
      if (!this.currentUser) {
        throw new Error('Kullanıcı oturum açmamış');
      }

      const updateData: any = {
        updated_at: new Date().toISOString()
      };
      
      if (data.displayName) {
        updateData.display_name = data.displayName;
      }
      
      if (data.photoURL) {
        updateData.avatar_url = data.photoURL;
      }

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', this.currentUser.id);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Profil güncellenirken hata oluştu:', error);
      throw error;
    }
  }
}

export const supabaseAuthService = new SupabaseAuthService();

