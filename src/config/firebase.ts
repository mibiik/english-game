// Firebase yapılandırma dosyası
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase yapılandırma bilgileri
// Environment variables'dan al, yoksa fallback değerleri kullan
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDo4GTXcYZHfSBW_KaKWlxKUv8AYfAJpcI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "kutiy2025.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "kutiy2025",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "kutiy2025.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "851823899365",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:851823899365:web:f260e3b395c4626c7b1a0c",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-MGP1MJBK32"
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