// Push Notification Service
export class NotificationService {
  private static instance: NotificationService;
  private registration: ServiceWorkerRegistration | null = null;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Bildirim izni iste
  public async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.log('Bu tarayıcı bildirimleri desteklemiyor');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      return 'denied';
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  // Service Worker'ı kaydet
  public async registerServiceWorker(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker desteklenmiyor');
      return false;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker kaydedildi:', this.registration);
      return true;
    } catch (error) {
      console.error('Service Worker kayıt hatası:', error);
      return false;
    }
  }

  // Yerel bildirim gönder
  public async sendLocalNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (Notification.permission !== 'granted') {
      console.log('Bildirim izni verilmemiş');
      return;
    }

    const notification = new Notification(title, {
      icon: '/a.png',
      badge: '/a.png',
      tag: 'wordplay-notification',
      requireInteraction: true,
      ...options
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }

  // Push bildirimi gönder
  public async sendPushNotification(title: string, body: string, data?: any): Promise<void> {
    if (!this.registration) {
      console.log('Service Worker kayıtlı değil');
      return;
    }

    const options = {
      body,
      icon: '/a.png',
      badge: '/a.png',
      tag: 'wordplay-push',
      data,
      requireInteraction: true,
      actions: [
        {
          action: 'open',
          title: 'Aç',
          icon: '/a.png'
        },
        {
          action: 'close',
          title: 'Kapat',
          icon: '/a.png'
        }
      ]
    };

    await this.registration.showNotification(title, options);
  }

  // Ana ekrana ekleme bildirimi gönder
  public async sendInstallNotification(): Promise<void> {
    const title = '📱 WordPlay\'i Ana Ekrana Ekle!';
    const body = 'Daha hızlı erişim için WordPlay\'i ana ekranınıza ekleyin. İnternetsiz çalışır!';
    
    await this.sendLocalNotification(title, {
      body,
      tag: 'install-prompt'
    });
  }

  // Günlük hatırlatma bildirimi
  public async sendDailyReminder(): Promise<void> {
    const title = '🎯 Günlük Kelime Hedefin!';
    const body = 'Bugün kaç kelime öğrendin? WordPlay ile İngilizce seviyeni yükselt!';
    
    await this.sendPushNotification(title, body, {
      type: 'daily_reminder',
      url: '/home'
    });
  }

  // Başarı bildirimi
  public async sendSuccessNotification(score: number): Promise<void> {
    const title = '🎉 Harika! Yeni Rekor!';
    const body = `${score} puan kazandın! Koç Üniversitesi Hazırlık kelimelerinde ustalaşıyorsun!`;
    
    await this.sendPushNotification(title, body, {
      type: 'success',
      score,
      url: '/leaderboard'
    });
  }

  // Seviye tamamlama bildirimi
  public async sendLevelCompleteNotification(level: string): Promise<void> {
    const title = `🏆 ${level} Seviyesi Tamamlandı!`;
    const body = `Tebrikler! ${level} seviyesindeki tüm kelimeleri öğrendin. Sıradaki seviyeye geç!`;
    
    await this.sendPushNotification(title, body, {
      type: 'level_complete',
      level,
      url: '/home'
    });
  }

  // Bildirimleri temizle
  public async clearNotifications(): Promise<void> {
    if (this.registration) {
      const notifications = await this.registration.getNotifications();
      notifications.forEach(notification => notification.close());
    }
  }
}

export const notificationService = NotificationService.getInstance();
