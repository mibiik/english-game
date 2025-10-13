// Puter.js v2 Service - Güncellenmiş ve optimize edilmiş
import { authService } from './authService';

class PuterService {
  private puter: any = null;
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;
  private retryCount = 0;
  private maxRetries = 3;

  constructor() {
    this.waitForPuter();
  }

  private async waitForPuter(): Promise<void> {
    return new Promise((resolve, reject) => {
      const checkPuter = () => {
        if (window.puter) {
          this.puter = window.puter;
          console.log('✅ Puter.js yüklendi ve hazır');
          resolve();
        } else {
          console.log('⏳ Puter.js yükleniyor...');
          setTimeout(checkPuter, 100);
        }
      };
      
      // 10 saniye timeout
      setTimeout(() => {
        reject(new Error('Puter.js yüklenemedi - timeout'));
      }, 10000);
      
      checkPuter();
    });
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.performInitialization();
    return this.initPromise;
  }

  private async performInitialization(): Promise<void> {
    try {
      await this.waitForPuter();
      
      // Kullanıcı giriş yapmışsa Puter'ı başlat
      const isAuthenticated = authService.isAuthenticated();
      if (isAuthenticated) {
        console.log('🚀 Kullanıcı giriş yapmış, Puter başlatılıyor...');
        await this.startPuter();
      } else {
        console.log('⏳ Kullanıcı giriş yapmamış, Puter bekliyor...');
      }

      this.isInitialized = true;
      console.log('✅ Puter servisi başarıyla başlatıldı');
    } catch (error) {
      console.error('❌ Puter servisi başlatılamadı:', error);
      this.retryCount++;
      
      if (this.retryCount < this.maxRetries) {
        console.log(`🔄 Puter servisi yeniden deneniyor (${this.retryCount}/${this.maxRetries})`);
        setTimeout(() => {
          this.initPromise = null;
          this.performInitialization();
        }, 2000 * this.retryCount);
      } else {
        throw new Error('Puter servisi başlatılamadı - maksimum deneme sayısı aşıldı');
      }
    }
  }

  private async startPuter(): Promise<void> {
    try {
      if (!this.puter) {
        throw new Error('Puter instance bulunamadı');
      }

      // Puter'ı başlat (kullanıcı giriş yapmışsa otomatik başlar)
      console.log('🔄 Puter başlatılıyor...');
      
      // Eklenen bölüm: Firebase access token ile Puter auth
      const user = authService.getCurrentUser && authService.getCurrentUser();
      if (
        user &&
        typeof user.getIdToken === 'function' &&
        this.puter.auth &&
        typeof this.puter.auth.signIn === 'function'
      ) {
        const token = await user.getIdToken();
        await this.puter.auth.signIn({ token }); // Token ile backend'e oturum açtır!
        console.log('🔐 Puter ile token bazlı oturum açıldı.');
      }

      if (typeof this.puter.auth?.signIn === 'function') {
        // Kullanıcı zaten giriş yapmışsa Puter otomatik başlar
        console.log('✅ Puter kullanıcı kimlik doğrulaması ile başlatıldı');
      }

    } catch (error) {
      console.error('❌ Puter başlatılamadı:', error);
      throw error;
    }
  }

  public async getPuter(): Promise<any> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    if (!this.puter) {
      throw new Error('Puter instance mevcut değil');
    }
    
    return this.puter;
  }

  public isReady(): boolean {
    return this.isInitialized && !!this.puter;
  }

  // AI chat için optimize edilmiş method
  public async chat(prompt: string, options: { model?: string } = {}): Promise<any> {
    const puter = await this.getPuter();
    
    if (!puter.ai || !puter.ai.chat) {
      throw new Error('Puter AI servisi mevcut değil');
    }

    const defaultOptions = {
      model: 'gpt-4o-mini',
      max_tokens: 1000,
      temperature: 0.7,
      ...options
    };

    try {
      console.log('🤖 Puter AI isteği gönderiliyor:', { prompt: prompt.substring(0, 100) + '...', model: defaultOptions.model });
      
      const result = await puter.ai.chat(prompt, defaultOptions);
      
      console.log('✅ Puter AI yanıtı alındı');
      return result;
    } catch (error) {
      console.error('❌ Puter AI isteği başarısız:', error);
      throw error;
    }
  }

  // File system için optimize edilmiş method
  public async writeFile(filename: string, content: string): Promise<void> {
    const puter = await this.getPuter();
    
    if (!puter.fs || !puter.fs.write) {
      throw new Error('Puter File System servisi mevcut değil');
    }

    try {
      await puter.fs.write(filename, content);
      console.log('✅ Dosya yazıldı:', filename);
    } catch (error) {
      console.error('❌ Dosya yazılamadı:', error);
      throw error;
    }
  }

  public async readFile(filename: string): Promise<string> {
    const puter = await this.getPuter();
    
    if (!puter.fs || !puter.fs.read) {
      throw new Error('Puter File System servisi mevcut değil');
    }

    try {
      const content = await puter.fs.read(filename);
      console.log('✅ Dosya okundu:', filename);
      return content;
    } catch (error) {
      console.error('❌ Dosya okunamadı:', error);
      throw error;
    }
  }

  // Key-Value store için optimize edilmiş method
  public async setKV(key: string, value: any): Promise<void> {
    const puter = await this.getPuter();
    
    if (!puter.kv || !puter.kv.set) {
      throw new Error('Puter KV servisi mevcut değil');
    }

    try {
      await puter.kv.set(key, value);
      console.log('✅ KV değeri kaydedildi:', key);
    } catch (error) {
      console.error('❌ KV değeri kaydedilemedi:', error);
      throw error;
    }
  }

  public async getKV(key: string): Promise<any> {
    const puter = await this.getPuter();
    
    if (!puter.kv || !puter.kv.get) {
      throw new Error('Puter KV servisi mevcut değil');
    }

    try {
      const value = await puter.kv.get(key);
      console.log('✅ KV değeri okundu:', key);
      return value;
    } catch (error) {
      console.error('❌ KV değeri okunamadı:', error);
      throw error;
    }
  }

  // Kullanıcı giriş yaptığında çağrılacak method
  public async onUserLogin(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    if (!this.isInitialized) {
      await this.startPuter();
    }
  }
}

// Singleton instance
export const puterService = new PuterService();

// Backward compatibility için
export const puter = new Proxy({} as any, {
  get(_target, prop) {
    if (prop === 'then') return undefined; // Promise değil
    return (...args: any[]) => puterService.getPuter().then((p: any) => p[prop](...args));
  }
});

// Auth state değişikliklerini dinle
authService.onAuthStateChange((user: any) => {
  if (user) {
    console.log('👤 Kullanıcı giriş yaptı, Puter başlatılıyor...');
    puterService.onUserLogin().catch(console.error);
  } else {
    console.log('👤 Kullanıcı çıkış yaptı');
  }
}); 