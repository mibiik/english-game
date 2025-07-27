import React, { useState, useEffect } from 'react';
import { BrowserRouter, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { AppRoutes } from './Routes';
import { Auth } from './components/Auth';
import { Analytics } from '@vercel/analytics/react';
import { authService } from './services/authService';
import ProfilePage from './pages/ProfilePage';
import { newDetailedWords_part1 } from './data/words';
import { detailedWords_part1 as upperIntermediateWordsRaw, WordDetail } from './data/word4';
import { newDetailedWords_part1 as preIntermediateWordsRaw } from './data/word2';
import { newDetailedWords_part1 as foundationWordsRaw } from './data/word1';
import { auth, db } from './config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { X, Sparkles } from 'lucide-react';
import { userService } from './services/userService';
import MehmetModal from './components/MehmetModal';
import { PerformanceMonitor } from './components/PerformanceMonitor';

const intermediateWords: WordDetail[] = newDetailedWords_part1;
const upperIntermediateWords: WordDetail[] = upperIntermediateWordsRaw;
const preIntermediateWords: WordDetail[] = preIntermediateWordsRaw;
const foundationWords: WordDetail[] = foundationWordsRaw;

function AppContent() {
  const [showAuth, setShowAuth] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Kullanıcı ismini localStorage'dan al
  const [userName, setUserName] = useState<string | null>(() => {
    return localStorage.getItem('userName');
  });

  // Auth modal'ının giriş mi kayıt mı olduğunu belirle
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');

  // Firebase Authentication durumu
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const [currentLevel, setCurrentLevel] = useState<'intermediate' | 'upper-intermediate' | 'pre-intermediate' | 'foundation'>(() => {
    const urlLevel = searchParams.get('level') as 'intermediate' | 'upper-intermediate' | 'pre-intermediate' | 'foundation';
    if (urlLevel) {
      localStorage.setItem('currentLevel', urlLevel);
      return urlLevel;
    }
    const savedLevel = localStorage.getItem('currentLevel') as 'intermediate' | 'upper-intermediate' | 'pre-intermediate' | 'foundation';
    return savedLevel || 'foundation';
  });

  const [currentUnit, setCurrentUnit] = useState(() => {
    const urlUnit = searchParams.get('unit');
    if (urlUnit) {
      localStorage.setItem('currentUnit', urlUnit);
      return urlUnit;
    }
    const savedUnit = localStorage.getItem('currentUnit');
    return savedUnit || "1";
  });

  const [filteredWords, setFilteredWords] = useState<WordDetail[]>([]);
  const [showMehmetModal, setShowMehmetModal] = useState(false);

  // Firebase Authentication durumunu dinle
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
      setIsAuthenticated(!!user);
      
      if (user) {
        // Kullanıcı giriş yapmış
        console.log('User is authenticated:', user.email);
        
        // Oturum bilgilerini localStorage'a kaydet
        localStorage.setItem('lastAuthCheck', new Date().toISOString());
        localStorage.setItem('authUserId', user.uid);
        
        // Eğer karşılama sayfasındaysa ana sayfaya yönlendir
        if (location.pathname === '/') {
          navigate('/home', { replace: true });
        }
      } else {
        // Kullanıcı çıkış yapmış
        console.log('User is not authenticated');
        
        // localStorage'dan oturum bilgilerini temizle
        localStorage.removeItem('lastAuthCheck');
        localStorage.removeItem('authUserId');
        
        // Eğer korumalı bir sayfadaysa karşılama sayfasına yönlendir
        if (location.pathname !== '/') {
          navigate('/', { replace: true });
        }
      }
    });

    return () => unsubscribe();
  }, [navigate, location.pathname]);

  // Sayfa yüklendiğinde ve sekme değişikliklerinde oturum durumunu kontrol et
  useEffect(() => {
    const checkAuthState = () => {
      const currentUser = auth.currentUser;
      const storedUserId = localStorage.getItem('authUserId');
      
      // Firebase auth state ile localStorage senkronizasyonu
      if (currentUser && storedUserId && currentUser.uid === storedUserId) {
        // Tutarlı durum - kullanıcı giriş yapmış
        setIsAuthenticated(true);
        console.log('Auth state synchronized - user is authenticated');
      } else if (!currentUser && !storedUserId) {
        // Tutarlı durum - kullanıcı giriş yapmamış
        setIsAuthenticated(false);
        console.log('Auth state synchronized - user is not authenticated');
      } else {
        // Tutarsız durum - localStorage'ı temizle ve Firebase state'ini kullan
        console.log('Auth state inconsistency detected, clearing localStorage');
        localStorage.removeItem('lastAuthCheck');
        localStorage.removeItem('authUserId');
        setIsAuthenticated(!!currentUser);
      }
    };

    // İlk yükleme
    checkAuthState();

    // Sekme değişikliklerini dinle
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Tab became visible, checking auth state');
        checkAuthState();
      }
    };

    // Focus event'ini dinle (sekme değişikliği)
    const handleFocus = () => {
      console.log('Window focused, checking auth state');
      checkAuthState();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Mehmet Bahçeçi için modal kontrolü
  useEffect(() => {
    const checkMehmetModal = async () => {
      if (isAuthenticated) {
        const userId = authService.getCurrentUserId();
        if (userId === 'hBXgKnZcj5g0SlyiwcRADWm3q6v1') {
          try {
            const { doc, getDoc } = await import('firebase/firestore');
            const userProfileRef = doc(db, 'userProfiles', userId);
            const userProfileDoc = await getDoc(userProfileRef);
            
            if (userProfileDoc.exists()) {
              const userData = userProfileDoc.data();
              if (!userData.mehmetModalShown) {
                // Modal henüz gösterilmemiş, göster
                setShowMehmetModal(true);
              }
            }
          } catch (error) {
            console.error('Mehmet modal kontrolü sırasında hata:', error);
          }
        }
      }
    };

    checkMehmetModal();
  }, [isAuthenticated]);





  // URL parametrelerini güncelle
  const updateURLParams = (unit: string, level: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('unit', unit);
    newParams.set('level', level);
    setSearchParams(newParams, { replace: true });
  };

  // Unit değiştiğinde URL'yi ve localStorage'ı güncelle
  const handleSetCurrentUnit = (unit: string) => {
    console.log('App: Setting current unit to:', unit);
    setCurrentUnit(unit);
    localStorage.setItem('currentUnit', unit);
    updateURLParams(unit, currentLevel);
  };

  // Level değiştiğinde URL'yi ve localStorage'ı güncelle
  const handleSetCurrentLevel = (level: 'intermediate' | 'upper-intermediate' | 'pre-intermediate' | 'foundation') => {
    console.log('App: Setting current level to:', level);
    setCurrentLevel(level);
    localStorage.setItem('currentLevel', level);
    updateURLParams(currentUnit, level);
  };

  // URL parametreleri değiştiğinde state'i ve localStorage'ı güncelle
  useEffect(() => {
    const urlUnit = searchParams.get('unit');
    const urlLevel = searchParams.get('level') as 'intermediate' | 'upper-intermediate' | 'pre-intermediate' | 'foundation';
    
    // Sadece parametre varsa güncelle
    if (urlUnit && urlUnit !== currentUnit) {
      setCurrentUnit(urlUnit);
      localStorage.setItem('currentUnit', urlUnit);
    }
    if (urlLevel && urlLevel !== currentLevel) {
      setCurrentLevel(urlLevel);
      localStorage.setItem('currentLevel', urlLevel);
    }
    // Parametre yoksa hiçbir şey yapma
  }, [searchParams, currentUnit, currentLevel]);

  // Filtrelenmiş kelimeleri güncelle
  useEffect(() => {
    let sourceData: WordDetail[];
    
    if (currentLevel === 'upper-intermediate') {
      sourceData = upperIntermediateWords;
    } else if (currentLevel === 'pre-intermediate') {
      sourceData = preIntermediateWords;
    } else if (currentLevel === 'foundation') {
      sourceData = foundationWords;
    } else {
      sourceData = intermediateWords;
    }

    if (currentUnit === 'all') {
      setFilteredWords(sourceData);
    } else {
      const unitFilter = (word: WordDetail) => word.unit === currentUnit;
      setFilteredWords(sourceData.filter(unitFilter));
    }
  }, [currentLevel, currentUnit]);

  useEffect(() => {
    const handleShowAuth = (event: any) => {
      setAuthMode(event.detail?.mode || 'register');
      // Sadece isAuthenticated kesin olarak false ise modal aç
      if (isAuthenticated === false) {
      setShowAuth(true);
      } else {
        setShowAuth(false);
      }
    };

    window.addEventListener('show-auth', handleShowAuth);

    return () => {
      window.removeEventListener('show-auth', handleShowAuth);
    };
  }, [isAuthenticated]);

  // Auth modal kapandığında event dinle
  useEffect(() => {
    const handleAuthClosed = () => {
      console.log('Auth modal closed');
    };

    window.addEventListener('auth-closed', handleAuthClosed);
    return () => window.removeEventListener('auth-closed', handleAuthClosed);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#111] to-black">
      <AppRoutes 
        currentUnit={currentUnit}
        setCurrentUnit={handleSetCurrentUnit}
        currentLevel={currentLevel}
        setCurrentLevel={handleSetCurrentLevel}
        filteredWords={filteredWords}
        isAuthenticated={isAuthenticated}
      />
      {showAuth && isAuthenticated === false && <Auth onClose={() => {
        setShowAuth(false);
        // Auth modal kapandığında event gönder
        window.dispatchEvent(new CustomEvent('auth-closed'));
      }} userName={userName || undefined} isLogin={authMode === 'login'} />}
      <MehmetModal 
        isOpen={showMehmetModal} 
        onClose={() => setShowMehmetModal(false)} 
      />
      <PerformanceMonitor />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
      <Analytics />
    </BrowserRouter>
  );
}

export default App;