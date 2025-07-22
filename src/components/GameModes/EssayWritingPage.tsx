import { awardPoints } from '../../services/scoreService';
import { useState } from 'react';

// Essay gönderiminden sonra:
const [streak, setStreak] = useState(0);
// Doğru essay gönderildiğinde:
setStreak(prev => prev + 1);
const bonus = Math.min(streak, 50);
awardPoints('essay', 100 + bonus, unit);