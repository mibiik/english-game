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
    // Ads consent logic: respect user's choice for personalized vs non-personalized ads.
    // Default behavior: if user hasn't given consent, serve non-personalized ads.
    const loadOrPushAds = () => {
      try {
        const consent = localStorage.getItem('ads_consent');
        const nonPersonalized = consent !== 'personalized';

        // If non-personalized is required, set requestNonPersonalizedAds flag before push
        // Note: Google suggests using the appropriate CMP integration. This is a conservative approach.
        // @ts-ignore
        window.adsbygoogle = window.adsbygoogle || [];
        if (nonPersonalized) {
          try {
            // Some publishers set this property to request non-personalized ads
            // @ts-ignore
            window.adsbygoogle.requestNonPersonalizedAds = 1;
          } catch (e) {
            console.debug('Could not set requestNonPersonalizedAds flag', e);
          }
        }

        const existing = document.querySelector("script[data-adsbygoogle-client]") as HTMLScriptElement | null;
        if (!existing) {
          const script = document.createElement('script');
          script.async = true;
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
    };

    loadOrPushAds();

    // Listen for consent changes (component CookieConsent will dispatch this event after updating localStorage)
    const listener = () => {
      try {
        loadOrPushAds();
      } catch (e) {
        console.error('Error reloading ads after consent change', e);
      }
    };
    window.addEventListener('adsConsentChanged', listener);

    return () => {
      window.removeEventListener('adsConsentChanged', listener);
    };
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