import React from 'react';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

interface DeviceInfoDisplayProps {
  showDetails?: boolean;
  className?: string;
}

export const DeviceInfoDisplay: React.FC<DeviceInfoDisplayProps> = ({ 
  showDetails = false, 
  className = '' 
}) => {
  const { 
    isMobile, 
    isTablet, 
    isDesktop, 
    platform, 
    browser, 
    operatingSystem, 
    isTouchDevice,
    screenWidth,
    screenHeight,
    loading 
  } = useDeviceDetection();

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-gray-300 rounded w-20"></div>
      </div>
    );
  }

  const getDeviceIcon = () => {
    if (isMobile) return '📱';
    if (isTablet) return '📟';
    if (isDesktop) return '💻';
    return '🖥️';
  };

  const getDeviceType = () => {
    if (isMobile) return 'Mobil';
    if (isTablet) return 'Tablet';
    if (isDesktop) return 'Masaüstü';
    return 'Bilinmeyen';
  };

  if (!showDetails) {
    return (
      <span className={`inline-flex items-center gap-1 ${className}`}>
        <span>{getDeviceIcon()}</span>
        <span className="text-sm">{getDeviceType()}</span>
      </span>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-2xl">{getDeviceIcon()}</span>
        <div>
          <div className="font-semibold">{getDeviceType()}</div>
          <div className="text-sm text-gray-500">{platform}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium">Tarayıcı:</span>
          <div className="text-gray-600">{browser}</div>
        </div>
        <div>
          <span className="font-medium">İşletim Sistemi:</span>
          <div className="text-gray-600">{operatingSystem}</div>
        </div>
        <div>
          <span className="font-medium">Ekran Boyutu:</span>
          <div className="text-gray-600">{screenWidth}x{screenHeight}</div>
        </div>
        <div>
          <span className="font-medium">Dokunmatik:</span>
          <div className="text-gray-600">{isTouchDevice ? '✅ Evet' : '❌ Hayır'}</div>
        </div>
      </div>
    </div>
  );
};

export default DeviceInfoDisplay;
