import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { DeviceInfo } from '../services/deviceDetectionService';
import { db } from '../config/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

export interface DeviceStats {
  totalUsers: number;
  mobileUsers: number;
  tabletUsers: number;
  desktopUsers: number;
  topPlatforms: { platform: string; count: number }[];
  topBrowsers: { browser: string; count: number }[];
  topOperatingSystems: { os: string; count: number }[];
  deviceTypePercentages: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

export interface UserDeviceInfo {
  userId: string;
  displayName: string;
  email: string;
  deviceInfo: DeviceInfo;
  lastDeviceUpdate: Date;
}

export const useDeviceStats = () => {
  const [deviceStats, setDeviceStats] = useState<DeviceStats | null>(null);
  const [userDevices, setUserDevices] = useState<UserDeviceInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeviceStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const userProfilesRef = collection(db, 'userProfiles');
      const q = query(userProfilesRef, orderBy('lastDeviceUpdate', 'desc'));
      const querySnapshot = await getDocs(q);

      const users: UserDeviceInfo[] = [];
      const platformCounts: { [key: string]: number } = {};
      const browserCounts: { [key: string]: number } = {};
      const osCounts: { [key: string]: number } = {};
      let mobileCount = 0;
      let tabletCount = 0;
      let desktopCount = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        if (data.deviceInfo) {
          const userDeviceInfo: UserDeviceInfo = {
            userId: doc.id,
            displayName: data.displayName || 'İsimsiz Kullanıcı',
            email: data.email || '',
            deviceInfo: data.deviceInfo,
            lastDeviceUpdate: data.lastDeviceUpdate?.toDate() || new Date()
          };
          
          users.push(userDeviceInfo);

          // İstatistikleri topla
          const { deviceType, platform, browser, operatingSystem } = data.deviceInfo;

          // Cihaz türü sayımı
          if (deviceType === 'mobile') mobileCount++;
          else if (deviceType === 'tablet') tabletCount++;
          else if (deviceType === 'desktop') desktopCount++;

          // Platform sayımı
          platformCounts[platform] = (platformCounts[platform] || 0) + 1;

          // Tarayıcı sayımı
          browserCounts[browser] = (browserCounts[browser] || 0) + 1;

          // İşletim sistemi sayımı
          osCounts[operatingSystem] = (osCounts[operatingSystem] || 0) + 1;
        }
      });

      const totalUsers = users.length;

      // En çok kullanılan platform, tarayıcı ve işletim sistemlerini sırala
      const topPlatforms = Object.entries(platformCounts)
        .map(([platform, count]) => ({ platform, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const topBrowsers = Object.entries(browserCounts)
        .map(([browser, count]) => ({ browser, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const topOperatingSystems = Object.entries(osCounts)
        .map(([os, count]) => ({ os, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Yüzde hesapla
      const deviceTypePercentages = {
        mobile: totalUsers > 0 ? Math.round((mobileCount / totalUsers) * 100) : 0,
        tablet: totalUsers > 0 ? Math.round((tabletCount / totalUsers) * 100) : 0,
        desktop: totalUsers > 0 ? Math.round((desktopCount / totalUsers) * 100) : 0,
      };

      const stats: DeviceStats = {
        totalUsers,
        mobileUsers: mobileCount,
        tabletUsers: tabletCount,
        desktopUsers: desktopCount,
        topPlatforms,
        topBrowsers,
        topOperatingSystems,
        deviceTypePercentages
      };

      setDeviceStats(stats);
      setUserDevices(users);

    } catch (err) {
      console.error('Cihaz istatistikleri alınırken hata:', err);
      setError('Cihaz istatistikleri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeviceStats();
  }, []);

  const refreshStats = () => {
    fetchDeviceStats();
  };

  return {
    deviceStats,
    userDevices,
    loading,
    error,
    refreshStats
  };
};
