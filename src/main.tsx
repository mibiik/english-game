import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { measureWebVitals, measurePageLoad, measureMemory, measureNetwork, preventLayoutShift, checkPerformanceBudget } from './utils/webVitals'

// CLS önleme başlat
preventLayoutShift();

// Service Worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Web Vitals izleme başlat
measureWebVitals();
measurePageLoad();
measureMemory();
measureNetwork();

// Memory kullanımını periyodik olarak izle - daha uzun interval
const memoryInterval = setInterval(() => {
  measureMemory();
}, 60000); // 60 saniyede bir (daha az sıklıkta)

// Performance budget kontrolü - sayfa yüklendikten sonra
window.addEventListener('load', () => {
  setTimeout(() => {
    checkPerformanceBudget();
  }, 2000);
});

// Memory cleanup
window.addEventListener('beforeunload', () => {
  clearInterval(memoryInterval);
});

// Memory pressure event listener
if ('memory' in performance) {
  window.addEventListener('memorypressure', () => {
    console.warn('⚠️ Memory pressure detected, cleaning up...');
    // Garbage collection'ı tetikle
    if ('gc' in window) {
      (window as any).gc();
    }
  });
}

// CLS için viewport meta tag kontrolü
const viewportMeta = document.querySelector('meta[name="viewport"]');
if (!viewportMeta) {
  const meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
  document.head.appendChild(meta);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
