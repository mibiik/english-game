import React, { Suspense, lazy } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

// Auth bileşenini lazy loading ile yükle
const Auth = lazy(() => import('./Auth'));

interface LazyAuthProps {
  mode: 'login' | 'register';
  onClose: () => void;
  onSuccess: () => void;
}

const LazyAuth: React.FC<LazyAuthProps> = ({ mode, onClose, onSuccess }) => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Auth mode={mode} onClose={onClose} onSuccess={onSuccess} />
    </Suspense>
  );
};

LazyAuth.displayName = 'LazyAuth';

export default React.memo(LazyAuth);
