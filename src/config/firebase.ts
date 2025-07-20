// Firebase yapılandırma dosyası
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase yapılandırma bilgileri
// Environment variables'dan al, yoksa fallback değerleri kullan
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBv5CmjWcqUD-IoUR6fRODD1QkD6rRd_dc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "engllish-e9b66.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "engllish-e9b66",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "engllish-e9b66.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "108757647621",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:108757647621:web:42842dc88178c7058bb76c",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-ND05BVBP39"
};

// Geliştirme ortamında Firebase yapılandırmasını kontrol et
if (import.meta.env.MODE === 'development' && firebaseConfig.apiKey === "YOUR_API_KEY") {
  console.warn('Firebase yapılandırması eksik! Lütfen .env dosyasına Firebase bilgilerinizi ekleyin.');
}

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);

// Firebase servislerini dışa aktar
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

// Auth kalıcılığını ayarla - kullanıcı oturumu tarayıcıda kalıcı olsun
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Auth kalıcılığı ayarlandı - oturum tarayıcıda kalıcı olacak');
  })
  .catch((error) => {
    console.error('Auth kalıcılığı ayarlanırken hata:', error);
  });

export default app;