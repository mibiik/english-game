import React, { useState, useEffect } from 'react';

const CONSENT_KEY = 'ads_consent';

const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (!stored) setVisible(true);
    } catch (e) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, 'personalized');
      setVisible(false);
      // Notify any listeners (e.g., AdSense component) that consent changed
      window.dispatchEvent(new Event('adsConsentChanged'));
    } catch (e) {
      console.error('Consent save error', e);
    }
  };

  const decline = () => {
    try {
      localStorage.setItem(CONSENT_KEY, 'non_personalized');
      setVisible(false);
      window.dispatchEvent(new Event('adsConsentChanged'));
    } catch (e) {
      console.error('Consent save error', e);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-60 w-[min(980px,calc(100%-32px))]">
      <div className="bg-white/95 text-gray-900 rounded-lg shadow-xl p-4 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6 border border-gray-200">
        <div className="flex-1 text-sm">
          <div className="font-semibold mb-1">Reklam ve çerez tercihleri</div>
          <div className="text-xs text-gray-700">Kişiselleştirilmiş reklamlar gösterilmesi için çerez kullanmamıza izin veriyor musunuz? Kabul ederseniz size daha alakalı reklamlar gösteririz. Redderseniz genel (kişiselleştirilmemiş) reklamlar gösterilecektir.</div>
        </div>
        <div className="flex gap-2">
          <button onClick={decline} className="px-3 py-2 rounded-md bg-gray-100 text-sm text-gray-800 border border-gray-200">Reddet</button>
          <button onClick={accept} className="px-3 py-2 rounded-md bg-emerald-600 text-sm text-white hover:bg-emerald-700">Kabul Et</button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
