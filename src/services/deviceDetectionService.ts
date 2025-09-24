import { supabase } from '../config/supabase';
import { supabaseAuthService } from './supabaseAuthService';

interface DeviceInfo {
  deviceType: 'mobile' | 'tablet' | 'desktop';
  platform: string;
  browser: string;
  screenWidth: number;
  screenHeight: number;
  userAgent: string;
  isTouchDevice: boolean;
  orientation: 'portrait' | 'landscape';
  connectionType?: string;
  language: string;
  timezone: string;
  timestamp: Date;
}

class DeviceDetectionService {
  private currentDeviceInfo: DeviceInfo | null = null;
  private lastDeviceInfo: DeviceInfo | null = null;
  private changeCallbacks: ((deviceInfo: DeviceInfo) => void)[] = [];

  constructor() {
    this.initializeDeviceDetection();
  }

  // Cihaz algılamayı başlat
  private initializeDeviceDetection(): void {
    this.currentDeviceInfo = this.getDeviceInfo();
    this.lastDeviceInfo = { ...this.currentDeviceInfo };

    // Pencere boyutu değişikliklerini dinle
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // Yön değişikliklerini dinle
    window.addEventListener('orientationchange', this.handleOrientationChange.bind(this));
    
    // Ağ durumu değişikliklerini dinle
    if ('connection' in navigator) {
      (navigator as any).connection.addEventListener('change', this.handleConnectionChange.bind(this));
    }
  }

  // Cihaz bilgilerini al
  private getDeviceInfo(): DeviceInfo {
    const userAgent = navigator.userAgent;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Cihaz tipini belirle
    let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
    if (isTouchDevice) {
      if (screenWidth < 768) {
        deviceType = 'mobile';
      } else if (screenWidth < 1024) {
        deviceType = 'tablet';
      }
    }

    // Platform belirleme
    let platform = 'Unknown';
    if (userAgent.includes('Windows')) platform = 'Windows';
    else if (userAgent.includes('Mac')) platform = 'macOS';
    else if (userAgent.includes('Linux')) platform = 'Linux';
    else if (userAgent.includes('Android')) platform = 'Android';
    else if (userAgent.includes('iOS')) platform = 'iOS';

    // Tarayıcı belirleme
    let browser = 'Unknown';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';

    // Yön belirleme
    const orientation = screenWidth > screenHeight ? 'landscape' : 'portrait';

    // Bağlantı tipi
    const connectionType = (navigator as any).connection?.effectiveType || 'unknown';

    return {
      deviceType,
      platform,
      browser,
      screenWidth,
      screenHeight,
      userAgent,
      isTouchDevice,
      orientation,
      connectionType,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timestamp: new Date()
    };
  }

  // Pencere boyutu değişikliği
  private handleResize(): void {
    this.detectDeviceChange().catch(error => {
      console.error('Resize cihaz değişikliği hatası:', error);
    });
  }

  // Yön değişikliği
  private handleOrientationChange(): void {
    setTimeout(() => {
      this.detectDeviceChange().catch(error => {
        console.error('Orientation cihaz değişikliği hatası:', error);
      });
    }, 100);
  }

  // Bağlantı değişikliği
  private handleConnectionChange(): void {
    this.detectDeviceChange().catch(error => {
      console.error('Connection cihaz değişikliği hatası:', error);
    });
  }

  // Cihaz değişikliğini algıla
  public async detectDeviceChange(): Promise<boolean> {
    const newDeviceInfo = this.getDeviceInfo();
    
    if (this.hasDeviceChanged(newDeviceInfo)) {
      this.lastDeviceInfo = { ...this.currentDeviceInfo };
      this.currentDeviceInfo = newDeviceInfo;
      
      console.log('🔄 Cihaz değişikliği tespit edildi:', newDeviceInfo);
      
      // Callback'leri çağır
      this.changeCallbacks.forEach(callback => {
        try {
          callback(newDeviceInfo);
        } catch (error) {
          console.error('Cihaz değişikliği callback hatası:', error);
        }
      });

      // Cihaz bilgisini kaydet
      await this.saveDeviceInfo();
      return true;
    }
    
    return false;
  }

  // Cihaz değişikliği var mı kontrol et
  private hasDeviceChanged(newInfo: DeviceInfo): boolean {
    if (!this.currentDeviceInfo) return true;

    const current = this.currentDeviceInfo;
    
    return (
      current.deviceType !== newInfo.deviceType ||
      current.platform !== newInfo.platform ||
      current.browser !== newInfo.browser ||
      current.screenWidth !== newInfo.screenWidth ||
      current.screenHeight !== newInfo.screenHeight ||
      current.orientation !== newInfo.orientation ||
      current.connectionType !== newInfo.connectionType
    );
  }

  // Cihaz bilgisini Supabase'e kaydet
  public async saveDeviceInfo(userId?: string): Promise<void> {
    try {
      const currentUserId = userId || supabaseAuthService.getCurrentUserId();
      if (!currentUserId) {
        console.warn('Kullanıcı oturum açmamış, cihaz bilgisi kaydedilemiyor');
        return;
      }

      const deviceInfo = this.getDeviceInfo();
      
      // Supabase'de users tablosunu güncelle
      const { error } = await supabase
        .from('users')
        .update({
          device_info: deviceInfo,
          last_device_update: new Date().toISOString()
        })
        .eq('id', currentUserId);

      if (error) {
        console.error('❌ Cihaz bilgisi kaydedilirken hata:', error);
      } else {
        console.log('✅ Cihaz bilgisi kaydedildi:', {
          userId: currentUserId,
          deviceType: deviceInfo.deviceType,
          platform: deviceInfo.platform,
          browser: deviceInfo.browser
        });
      }
    } catch (error) {
      console.error('❌ Cihaz bilgisi kaydedilirken hata:', error);
    }
  }

  // Kullanıcının cihaz bilgisini al
  public async getUserDeviceInfo(userId?: string): Promise<DeviceInfo | null> {
    try {
      const currentUserId = userId || supabaseAuthService.getCurrentUserId();
      if (!currentUserId) return null;

      const { data, error } = await supabase
        .from('users')
        .select('device_info')
        .eq('id', currentUserId)
        .single();

      if (error) {
        console.error('Cihaz bilgisi alınırken hata:', error);
        return null;
      }

      return data?.device_info || null;
    } catch (error) {
      console.error('Cihaz bilgisi alınırken hata:', error);
      return null;
    }
  }

  // Mevcut cihaz bilgisini al
  public getCurrentDeviceInfo(): DeviceInfo | null {
    return this.currentDeviceInfo;
  }

  // Önceki cihaz bilgisini al
  public getLastDeviceInfo(): DeviceInfo | null {
    return this.lastDeviceInfo;
  }

  // Cihaz değişikliği callback'i ekle
  public onDeviceChange(callback: (deviceInfo: DeviceInfo) => void): void {
    this.changeCallbacks.push(callback);
  }

  // Cihaz değişikliği callback'ini kaldır
  public offDeviceChange(callback: (deviceInfo: DeviceInfo) => void): void {
    const index = this.changeCallbacks.indexOf(callback);
    if (index > -1) {
      this.changeCallbacks.splice(index, 1);
    }
  }

  // Servisi temizle
  public cleanup(): void {
    window.removeEventListener('resize', this.handleResize.bind(this));
    window.removeEventListener('orientationchange', this.handleOrientationChange.bind(this));
    
    if ('connection' in navigator) {
      (navigator as any).connection.removeEventListener('change', this.handleConnectionChange.bind(this));
    }
    
    this.changeCallbacks = [];
  }
}

export const deviceDetectionService = new DeviceDetectionService();