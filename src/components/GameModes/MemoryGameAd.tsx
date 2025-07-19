import React from 'react';
import AdSense from '../../components/AdSense';

// Bu bileşen, oyun sayfalarına reklam eklemek için kullanılabilir
const MemoryGameAd: React.FC = () => {
  return (
    <div className="game-ad-container my-4">
      {/* Oyun içi reklam alanı */}
      <AdSense 
        slot="2468013579" 
        format="rectangle" 
        className="ad-rectangle" 
      />
    </div>
  );
};

export default MemoryGameAd;