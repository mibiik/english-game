import React, { useEffect } from 'react';

const AdSense: React.FC = () => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }, []);

  return (
    <ins className="adsbygoogle"
      style={{ display: 'block', width: '100%', minHeight: 90 }}
      data-ad-client="ca-pub-XXXXXXXXXXXXXXX"  // <-- kendi kodunuzu girin
      data-ad-slot="YYYYYYYYYYYYYY"           // <-- kendi slot kodunuzu girin
      data-ad-format="auto"
      data-full-width-responsive="true"></ins>
  );
};

export default AdSense;