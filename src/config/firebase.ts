// Firebase yapılandırma dosyası
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase yapılandırma bilgileri
// Kullanıcı kendi Firebase projesinin bilgilerini buraya eklemelidir
// Firebase konsolundan (https://console.firebase.google.com/) yeni bir proje oluşturup
// Web uygulaması ekleyerek bu bilgileri alabilirsiniz
const firebaseConfig = {
  apiKey: "AIzaSyBv5CmjWcqUD-IoUR6fRODD1QkD6rRd_dc",
  authDomain: "engllish-e9b66.firebaseapp.com",
  projectId: "engllish-e9b66",
  storageBucket: "engllish-e9b66.firebasestorage.app",
  messagingSenderId: "108757647621",
  appId: "1:108757647621:web:42842dc88178c7058bb76c",
  measurementId: "G-ND05BVBP39"
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
export default app;