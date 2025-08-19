import { db } from '../config/firebase';
import { doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { authService } from './authService';

export interface DeviceInfo {
  deviceType: 'mobile' | 'tablet' | 'desktop';
  platform: string;
  browser: string;
  screenWidth: number;
  screenHeight: number;
  userAgent: string;
  isTouchDevice: boolean;
  operatingSystem: string;
  lastDetected: Date;
}

class DeviceDetectionService {
  private readonly userProfilesCollection = 'userProfiles';

  // Cihaz türünü tespit et
  public detectDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const userAgent = navigator.userAgent.toLowerCase();
    const screenWidth = window.screen.width;
    
    // Mobil cihaz kontrolü
    const isMobile = /android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent) ||
                     screenWidth <= 768;
    
    // Tablet kontrolü
    const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(userAgent) ||
                     (screenWidth > 768 && screenWidth <= 1024);
    
    if (isMobile && !isTablet) {
      return 'mobile';
    } else if (isTablet) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }

  // Platform tespit et
  public detectPlatform(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (/android/i.test(userAgent)) return 'Android';
    if (/iphone|ipad|ipod/i.test(userAgent)) return 'iOS';
    if (/windows/i.test(userAgent)) return 'Windows';
    if (/macintosh|mac os x/i.test(userAgent)) return 'macOS';
    if (/linux/i.test(userAgent)) return 'Linux';
    if (/cros/i.test(userAgent)) return 'Chrome OS';
    
    return 'Unknown';
  }

  // Tarayıcı tespit et
  public detectBrowser(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (/edg/i.test(userAgent)) return 'Edge';
    if (/chrome/i.test(userAgent) && !/edg/i.test(userAgent)) return 'Chrome';
    if (/firefox/i.test(userAgent)) return 'Firefox';
    if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) return 'Safari';
    if (/opera/i.test(userAgent)) return 'Opera';
    
    return 'Unknown';
  }

  // İşletim sistemi tespit et
  public detectOperatingSystem(): string {
    const userAgent = navigator.userAgent;
    
    if (/Android/i.test(userAgent)) {
      const match = userAgent.match(/Android ([0-9._]+)/);
      return match ? `Android ${match[1]}` : 'Android';
    }
    if (/iPhone|iPad|iPod/i.test(userAgent)) {
      const match = userAgent.match(/OS ([0-9_]+)/);
      return match ? `iOS ${match[1].replace(/_/g, '.')}` : 'iOS';
    }
    if (/Windows NT/i.test(userAgent)) {
      const match = userAgent.match(/Windows NT ([0-9.]+)/);
      const version = match ? match[1] : '';
      const windowsVersions: { [key: string]: string } = {
        '10.0': 'Windows 10/11',
        '6.3': 'Windows 8.1',
        '6.2': 'Windows 8',
        '6.1': 'Windows 7',
      };
      return windowsVersions[version] || 'Windows';
    }
    if (/Mac OS X/i.test(userAgent)) {
      const match = userAgent.match(/Mac OS X ([0-9_]+)/);
      return match ? `macOS ${match[1].replace(/_/g, '.')}` : 'macOS';
    }
    if (/Linux/i.test(userAgent)) return 'Linux';
    
    return 'Unknown';
  }

  // Dokunmatik cihaz kontrolü
  public isTouchDevice(): boolean {
    try {
      return 'ontouchstart' in window || 
             navigator.maxTouchPoints > 0 || 
             (window as any).DocumentTouch && document instanceof (window as any).DocumentTouch;
    } catch (error) {
      console.warn('Dokunmatik cihaz tespit edilirken hata:', error);
      return false; // Hata durumunda false döndür
    }
  }

  // Tam cihaz bilgisi topla
  public getDeviceInfo(): DeviceInfo {
    try {
      return {
        deviceType: this.detectDeviceType(),
        platform: this.detectPlatform(),
        browser: this.detectBrowser(),
        screenWidth: window.screen.width || 0,
        screenHeight: window.screen.height || 0,
        userAgent: navigator.userAgent || '',
        isTouchDevice: this.isTouchDevice(),
        operatingSystem: this.detectOperatingSystem(),
        lastDetected: new Date()
      };
    } catch (error) {
      console.error('Cihaz bilgisi toplanırken hata:', error);
      // Hata durumunda varsayılan değerler döndür
      return {
        deviceType: 'desktop',
        platform: 'Unknown',
        browser: 'Unknown',
        screenWidth: 0,
        screenHeight: 0,
        userAgent: '',
        isTouchDevice: false,
        operatingSystem: 'Unknown',
        lastDetected: new Date()
      };
    }
  }

  // Cihaz bilgisini Firebase'e kaydet
  public async saveDeviceInfo(userId?: string): Promise<void> {
    try {
      const currentUserId = userId || authService.getCurrentUserId();
      if (!currentUserId) {
        console.warn('Kullanıcı oturum açmamış, cihaz bilgisi kaydedilemiyor');
        return;
      }

      const deviceInfo = this.getDeviceInfo();
      const userProfileRef = doc(db, this.userProfilesCollection, currentUserId);

      // Mevcut profili kontrol et
      const userProfileDoc = await getDoc(userProfileRef);
      
      if (userProfileDoc.exists()) {
        // Profil varsa sadece cihaz bilgisini güncelle
        await updateDoc(userProfileRef, {
          deviceInfo,
          lastDeviceUpdate: new Date()
        });
      } else {
        // Profil yoksa temel bilgilerle birlikte oluştur
        await setDoc(userProfileRef, {
          userId: currentUserId,
          deviceInfo,
          lastDeviceUpdate: new Date(),
          createdAt: new Date()
        }, { merge: true });
      }

      console.log('✅ Cihaz bilgisi kaydedildi:', {
        userId: currentUserId,
        deviceType: deviceInfo.deviceType,
        platform: deviceInfo.platform,
        browser: deviceInfo.browser
      });

    } catch (error) {
      console.error('❌ Cihaz bilgisi kaydedilirken hata:', error);
    }
  }

  // Kullanıcının cihaz bilgisini getir
  public async getUserDeviceInfo(userId?: string): Promise<DeviceInfo | null> {
    try {
      const currentUserId = userId || authService.getCurrentUserId();
      if (!currentUserId) return null;

      const userProfileRef = doc(db, this.userProfilesCollection, currentUserId);
      const userProfileDoc = await getDoc(userProfileRef);

      if (userProfileDoc.exists()) {
        const data = userProfileDoc.data();
        return data.deviceInfo || null;
      }

      return null;
    } catch (error) {
      console.error('Cihaz bilgisi alınırken hata:', error);
      return null;
    }
  }

  // Cihaz değişikliği tespit et
  public async detectDeviceChange(userId?: string): Promise<boolean> {
    try {
      const currentDeviceInfo = this.getDeviceInfo();
      const savedDeviceInfo = await this.getUserDeviceInfo(userId);

      if (!savedDeviceInfo) {
        // İlk kez tespit ediliyor
        await this.saveDeviceInfo(userId);
        return false;
      }

      // Önemli değişiklikler kontrol et
      const hasChanged = 
        currentDeviceInfo.deviceType !== savedDeviceInfo.deviceType ||
        currentDeviceInfo.platform !== savedDeviceInfo.platform ||
        currentDeviceInfo.browser !== savedDeviceInfo.browser;

      if (hasChanged) {
        console.log('🔄 Cihaz değişikliği tespit edildi:', {
          eski: {
            deviceType: savedDeviceInfo.deviceType,
            platform: savedDeviceInfo.platform,
            browser: savedDeviceInfo.browser
          },
          yeni: {
            deviceType: currentDeviceInfo.deviceType,
            platform: currentDeviceInfo.platform,
            browser: currentDeviceInfo.browser
          }
        });
        
        // Yeni cihaz bilgisini kaydet
        await this.saveDeviceInfo(userId);
      }

      return hasChanged;
    } catch (error) {
      console.error('Cihaz değişikliği tespit edilirken hata:', error);
      return false;
    }
  }

  // Kullanım istatistikleri için cihaz dağılımı
  public async getDeviceStats(): Promise<{ [key: string]: number }> {
    try {
      // Bu fonksiyon admin paneli için kullanılabilir
      // Tüm kullanıcıların cihaz bilgilerini toplar
      console.log('Cihaz istatistikleri alınıyor...');
      return {
        mobile: 0,
        tablet: 0,
        desktop: 0
      };
    } catch (error) {
      console.error('Cihaz istatistikleri alınırken hata:', error);
      return {};
    }
  }
}

export const deviceDetectionService = new DeviceDetectionService();
export default deviceDetectionService;
