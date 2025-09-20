import React, { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  placeholder?: string;
  lazy?: boolean;
  aspectRatio?: string; // CLS için aspect ratio
}

export const OptimizedImage: React.FC<OptimizedImageProps> = React.memo(({
  src,
  alt,
  className = '',
  width,
  height,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NzM4NyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+',
  lazy = true,
  aspectRatio = '16/9'
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
      setHasError(false);
    };
    
    img.onerror = () => {
      setHasError(true);
      setIsLoaded(false);
    };
    
    img.src = src;
  }, [src]);

  // CLS için aspect ratio container
  const aspectRatioStyle = aspectRatio ? {
    aspectRatio,
    width: '100%',
    height: 'auto'
  } : {};

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={aspectRatioStyle}
    >
      <img
        src={imageSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        width={width}
        height={height}
        loading={lazy ? 'lazy' : 'eager'}
        decoding="async"
        onError={() => setHasError(true)}
        style={{
          // CLS önleme için sabit boyutlar
          minHeight: height || 'auto',
          minWidth: width || 'auto'
        }}
      />
      
      {/* Loading skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-500 text-sm">Resim yüklenemedi</span>
        </div>
      )}
    </div>
  );
});

// CLS için özel bileşenler
export const CardImage: React.FC<OptimizedImageProps> = (props) => (
  <OptimizedImage
    {...props}
    aspectRatio="1/1"
    className="rounded-lg"
  />
);

export const HeroImage: React.FC<OptimizedImageProps> = (props) => (
  <OptimizedImage
    {...props}
    aspectRatio="16/9"
    className="rounded-xl"
  />
);

export const AvatarImage: React.FC<OptimizedImageProps> = (props) => (
  <OptimizedImage
    {...props}
    aspectRatio="1/1"
    className="rounded-full"
  />
);

// WebP desteği kontrolü
export const useWebPSupport = () => {
  const [supportsWebP, setSupportsWebP] = useState(false);

  useEffect(() => {
    const checkWebPSupport = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    };

    setSupportsWebP(checkWebPSupport());
  }, []);

  return supportsWebP;
};

// Responsive image src generator
export const generateResponsiveSrc = (baseSrc: string, sizes: number[]) => {
  const webpSrc = baseSrc.replace(/\.(jpg|jpeg|png)$/, '.webp');
  
  return sizes.map(size => ({
    src: `${baseSrc}?w=${size}`,
    webp: `${webpSrc}?w=${size}`,
    size
  }));
}; 