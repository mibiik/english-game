import React, { useEffect } from 'react';
import { Adsense } from '@ctrl/react-adsense';
import '../styles/AdSense.css';
import { ADSENSE_CLIENT_ID } from '../config/apiKeys';

interface AdSenseProps {
  className?: string;
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: boolean;
  style?: React.CSSProperties;
}

const AdSense: React.FC<AdSenseProps> = ({
  className = 'ad-container',
  slot,
  format = 'auto',
  responsive = true,
  style,
}) => {
  useEffect(() => {
    // Eğer script yoksa AdSense script'ini dinamik olarak ekle
    try {
      const existing = document.querySelector("script[data-adsbygoogle-client]") as HTMLScriptElement | null;
      if (!existing) {
        const script = document.createElement('script');
        script.async = true;
        // data-adsbygoogle-client attribute is a common approach to mark client
        script.setAttribute('data-adsbygoogle-client', ADSENSE_CLIENT_ID);
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);

        script.onload = () => {
          try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          } catch (error) {
            console.error('AdSense push hatası:', error);
          }
        };
      } else {
        try {
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (error) {
          console.error('AdSense push hatası:', error);
        }
      }
    } catch (error) {
      console.error('AdSense yüklenirken hata oluştu:', error);
    }
  }, []);

  return (
    <div className={`ad-wrapper ${className}`}>
      <p className="ad-label">Reklam</p>
      <Adsense
        client={ADSENSE_CLIENT_ID}
        slot={slot}
        style={style || { display: 'block' }}
        format={format}
        responsive={responsive ? 'true' : undefined}
        className="adsense-container"
      />
    </div>
  );
};

export default AdSense;