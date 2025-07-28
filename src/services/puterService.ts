// This service now directly exports the puter instance.
// Other services can import this and use it directly.

// Puter.js yüklendiğinde kontrol et
let puterLoaded = false;

// Puter.js yüklendiğinde bu fonksiyon çağrılacak
window.addEventListener('load', () => {
  if (window.puter) {
    puterLoaded = true;
    console.log('✅ Puter.js başarıyla yüklendi');
  } else {
    console.error('❌ Puter.js yüklenemedi. API anahtarı veya hesap sorunu olabilir.');
  }
});

// Puter instance'ını export et
export const puter = window.puter;

// Puter'ın kullanılabilir olup olmadığını kontrol eden yardımcı fonksiyon
export const isPuterAvailable = () => {
  return puterLoaded && window.puter && window.puter.ai;
}; 