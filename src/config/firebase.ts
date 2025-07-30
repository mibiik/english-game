// Firebase yapılandırma dosyası
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase yapılandırma bilgileri
// Environment variables'dan al, yoksa fallback değerleri kullan
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBEVHXctBk-AZh2T5lhMwA3j2KoCg3589g",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "wordplay-99044.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "wordplay-99044",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "wordplay-99044.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "458350131750",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:458350131750:web:d23ef859dd519ecc7d84e7",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-J0SS2K3GZT"
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