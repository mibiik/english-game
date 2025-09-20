import React, { useEffect } from 'react';
import { Adsense } from '@ctrl/react-adsense';
import '../styles/AdSense.css';

interface AdSenseProps {
  className?: string;
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: boolean;
  style?: React.CSSProperties;
}

// Google AdSense yayıncı kimliği
const PUBLISHER_ID = 'ca-pub-8933238568700652';

const AdSense: React.FC<AdSenseProps> = ({
  className = 'ad-container',
  slot,
  format = 'auto',
  responsive = true,
  style,
}) => {
  useEffect(() => {
    // AdSense kodunun yüklenmesini sağla
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('AdSense yüklenirken hata oluştu:', error);
    }
  }, []);

  return (
    <div className={`ad-wrapper ${className}`}>
      <p className="ad-label">Reklam</p>
      <Adsense
        client={PUBLISHER_ID}
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