import React, { useState, useEffect } from 'react';

interface TimeDisplayProps {
  className?: string;
}

const TimeDisplay: React.FC<TimeDisplayProps> = React.memo(({ className = "" }) => {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      // Sadece dakika değiştiğinde güncelle
      if (now.getMinutes() !== time.getMinutes()) {
        setTime(now);
      }
    }, 30000); // 30 saniyede bir kontrol et

    return () => clearInterval(timer);
  }, [time.getMinutes()]);

  return (
    <time className={className} dateTime={time.toISOString()}>
      {time.toLocaleTimeString('tr-TR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      })}
    </time>
  );
});

TimeDisplay.displayName = 'TimeDisplay';

export default TimeDisplay;
