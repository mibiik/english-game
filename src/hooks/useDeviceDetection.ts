import { useState, useEffect } from 'react';
import { deviceDetectionService, DeviceInfo } from '../services/deviceDetectionService';

export interface DeviceDetection {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  platform: string;
  browser: string;
  operatingSystem: string;
  isTouchDevice: boolean;
  screenWidth: number;
  screenHeight: number;
  deviceInfo: DeviceInfo | null;
}

export const useDeviceDetection = () => {
  const [deviceDetection, setDeviceDetection] = useState<DeviceDetection>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    platform: 'Unknown',
    browser: 'Unknown',
    operatingSystem: 'Unknown',
    isTouchDevice: false,
    screenWidth: 0,
    screenHeight: 0,
    deviceInfo: null
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const detectDevice = () => {
      try {
        const deviceInfo = deviceDetectionService.getDeviceInfo();
        
        setDeviceDetection({
          isMobile: deviceInfo.deviceType === 'mobile',
          isTablet: deviceInfo.deviceType === 'tablet',
          isDesktop: deviceInfo.deviceType === 'desktop',
          platform: deviceInfo.platform,
          browser: deviceInfo.browser,
          operatingSystem: deviceInfo.operatingSystem,
          isTouchDevice: deviceInfo.isTouchDevice,
          screenWidth: deviceInfo.screenWidth,
          screenHeight: deviceInfo.screenHeight,
          deviceInfo
        });
      } catch (error) {
        console.error('Cihaz tespit edilirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    // Sayfa yüklendiğinde tespit et
    detectDevice();

    // Ekran boyutu değiştiğinde tekrar tespit et
    const handleResize = () => {
      detectDevice();
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Manuel olarak cihaz bilgisini yenile
  const refreshDeviceInfo = () => {
    setLoading(true);
    const deviceInfo = deviceDetectionService.getDeviceInfo();
    
    setDeviceDetection({
      isMobile: deviceInfo.deviceType === 'mobile',
      isTablet: deviceInfo.deviceType === 'tablet',
      isDesktop: deviceInfo.deviceType === 'desktop',
      platform: deviceInfo.platform,
      browser: deviceInfo.browser,
      operatingSystem: deviceInfo.operatingSystem,
      isTouchDevice: deviceInfo.isTouchDevice,
      screenWidth: deviceInfo.screenWidth,
      screenHeight: deviceInfo.screenHeight,
      deviceInfo
    });
    setLoading(false);
  };

  return {
    ...deviceDetection,
    loading,
    refreshDeviceInfo
  };
};

// Sadece mobil kontrolü için basit hook
export const useIsMobile = () => {
  const { isMobile, loading } = useDeviceDetection();
  return { isMobile, loading };
};

// Sadece touch cihaz kontrolü için basit hook
export const useIsTouchDevice = () => {
  const { isTouchDevice, loading } = useDeviceDetection();
  return { isTouchDevice, loading };
};

// Platform kontrolü için basit hook
export const usePlatform = () => {
  const { platform, loading } = useDeviceDetection();
  return { platform, loading };
};
