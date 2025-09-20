import React, { useEffect, useState } from 'react';
import { getMemoryUsage, markPerformance, measurePerformance } from '../lib/performance';

interface PerformanceData {
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  fps: number;
  loadTime: number;
}

export const PerformanceMonitor: React.FC = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    memory: { used: 0, total: 0, percentage: 0 },
    fps: 0,
    loadTime: 0,
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Sayfa yükleme süresini ölç
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        setPerformanceData(prev => ({
          ...prev,
          loadTime: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
        }));
      }
    }

    // FPS ölçümü
    let frameCount = 0;
    let lastTime = performance.now();
    
    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        setPerformanceData(prev => ({ ...prev, fps }));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);

    // Memory kullanımını periyodik olarak kontrol et
    const memoryInterval = setInterval(() => {
      const memory = getMemoryUsage();
      setPerformanceData(prev => ({ ...prev, memory }));
    }, 2000);

    return () => {
      clearInterval(memoryInterval);
    };
  }, []);

  // Ctrl+Shift+P ile göster/gizle
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono z-50">
      <div className="mb-2 font-bold">Performance Monitor</div>
      <div>Memory: {performanceData.memory.used}MB / {performanceData.memory.total}MB ({performanceData.memory.percentage}%)</div>
      <div>FPS: {performanceData.fps}</div>
      <div>Load Time: {performanceData.loadTime}ms</div>
      <div className="mt-2 text-gray-400">Ctrl+Shift+P to toggle</div>
    </div>
  );
};

// Performance mark helper
export const usePerformanceMark = (name: string) => {
  useEffect(() => {
    markPerformance(name);
  }, [name]);
};

// Performance measure helper
export const usePerformanceMeasure = (name: string, startMark: string, endMark: string) => {
  useEffect(() => {
    return () => {
      measurePerformance(name, startMark, endMark);
    };
  }, [name, startMark, endMark]);
}; 