// Web Vitals izleme ve optimizasyon
export const measureWebVitals = () => {
  // LCP (Largest Contentful Paint) izleme
  const measureLCP = () => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      const lcp = lastEntry.startTime;
      
      console.log('LCP:', lcp);
      
      // LCP'yi localStorage'a kaydet
      localStorage.setItem('lcp', lcp.toString());
      
      // Eğer LCP çok yüksekse uyarı ver
      if (lcp > 2500) {
        console.warn('LCP çok yüksek:', lcp);
      }
    });
    
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  };

  // FID (First Input Delay) izleme
  const measureFID = () => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const firstInputEntry = entry as PerformanceEventTiming;
        const fid = firstInputEntry.processingStart - firstInputEntry.startTime;
        
        console.log('FID:', fid);
        localStorage.setItem('fid', fid.toString());
        
        if (fid > 100) {
          console.warn('FID çok yüksek:', fid);
        }
      });
    });
    
    observer.observe({ entryTypes: ['first-input'] });
  };

  // CLS (Cumulative Layout Shift) izleme - Optimized
  const measureCLS = () => {
    let clsValue = 0;
    let clsEntries: any[] = [];
    
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          clsEntries.push(entry);
        }
      });
      
      // CLS'yi sadece belirli aralıklarla logla
      if (clsEntries.length % 5 === 0) { // Her 5 entry'de bir
        console.log('CLS:', clsValue);
        localStorage.setItem('cls', clsValue.toString());
        
        if (clsValue > 0.1) {
          console.warn('CLS çok yüksek:', clsValue);
        }
      }
    });
    
    observer.observe({ entryTypes: ['layout-shift'] });
  };

  // FCP (First Contentful Paint) izleme
  const measureFCP = () => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcp = entries[0].startTime;
      
      console.log('FCP:', fcp);
      localStorage.setItem('fcp', fcp.toString());
      
      if (fcp > 1800) {
        console.warn('FCP çok yüksek:', fcp);
      }
    });
    
    observer.observe({ entryTypes: ['first-contentful-paint'] });
  };

  // TTFB (Time to First Byte) izleme
  const measureTTFB = () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const ttfb = navigation.responseStart - navigation.requestStart;
      
      console.log('TTFB:', ttfb);
      localStorage.setItem('ttfb', ttfb.toString());
      
      if (ttfb > 600) {
        console.warn('TTFB çok yüksek:', ttfb);
      }
    }
  };

  // Tüm metrikleri başlat
  if ('PerformanceObserver' in window) {
    measureLCP();
    measureFID();
    measureCLS();
    measureFCP();
    measureTTFB();
  }
};

// Performance mark'ları için yardımcı fonksiyonlar
export const markPerformance = (name: string) => {
  if ('performance' in window) {
    performance.mark(name);
  }
};

export const measurePerformance = (name: string, startMark: string, endMark: string) => {
  if ('performance' in window) {
    try {
      performance.measure(name, startMark, endMark);
      const measure = performance.getEntriesByName(name)[0];
      console.log(`${name}: ${Math.round(measure.duration)}ms`);
      
      // Metrikleri localStorage'a kaydet
      localStorage.setItem(`perf_${name}`, measure.duration.toString());
    } catch (error) {
      console.warn(`Performance measure failed for ${name}:`, error);
    }
  }
};

// Sayfa yükleme performansını izle
export const measurePageLoad = () => {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
        
        console.log('Page Load Time:', loadTime);
        console.log('DOM Content Loaded:', domContentLoaded);
        
        localStorage.setItem('pageLoadTime', loadTime.toString());
        localStorage.setItem('domContentLoaded', domContentLoaded.toString());
      }
    }, 0);
  });
};

// Memory kullanımını izle - Optimized
export const measureMemory = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    const used = Math.round(memory.usedJSHeapSize / 1048576);
    const total = Math.round(memory.totalJSHeapSize / 1048576);
    const percentage = Math.round((memory.usedJSHeapSize / memory.totalJSHeapSize) * 100);
    
    // Memory kullanımını sadece yüksekse logla
    if (percentage > 80) {
      console.log('Memory Usage:', `${used}MB / ${total}MB (${percentage}%)`);
      localStorage.setItem('memoryUsage', JSON.stringify({ used, total, percentage }));
      console.warn('Memory usage is high:', percentage + '%');
      
      // Memory cleanup önerisi
      if (percentage > 90) {
        console.warn('⚠️ Kritik memory kullanımı! Garbage collection önerilir.');
        if ('gc' in window) {
          console.log('🔄 Garbage collection tetikleniyor...');
          (window as any).gc();
        }
      }
    }
  }
};

// Network performansını izle
export const measureNetwork = () => {
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    console.log('Network Type:', connection.effectiveType);
    console.log('Downlink:', connection.downlink + ' Mbps');
    console.log('RTT:', connection.rtt + ' ms');
    
    localStorage.setItem('networkInfo', JSON.stringify({
      type: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt
    }));
  }
};

// CLS optimizasyonu için yardımcı fonksiyonlar
export const preventLayoutShift = () => {
  // Sayfa yüklenirken layout shift'i önle
  const style = document.createElement('style');
  style.textContent = `
    * {
      box-sizing: border-box;
    }
    
    img, video, canvas, audio, iframe, embed, object {
      max-width: 100%;
      height: auto;
      display: block;
    }
    
    .prevent-layout-shift {
      contain: layout style paint;
    }
  `;
  document.head.appendChild(style);
};

// Performance budget kontrolü
export const checkPerformanceBudget = () => {
  const budget = {
    lcp: 2500,
    fid: 100,
    cls: 0.1,
    fcp: 1800,
    ttfb: 600
  };
  
  const metrics = {
    lcp: parseFloat(localStorage.getItem('lcp') || '0'),
    fid: parseFloat(localStorage.getItem('fid') || '0'),
    cls: parseFloat(localStorage.getItem('cls') || '0'),
    fcp: parseFloat(localStorage.getItem('fcp') || '0'),
    ttfb: parseFloat(localStorage.getItem('ttfb') || '0')
  };
  
  const violations = Object.entries(metrics).filter(([key, value]) => {
    return value > budget[key as keyof typeof budget];
  });
  
  if (violations.length > 0) {
    console.warn('🚨 Performance budget ihlalleri:', violations);
  }
  
  return violations;
}; 