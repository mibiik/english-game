import { db } from '../config/firebase';
import { doc, updateDoc, increment, setDoc, getDoc } from 'firebase/firestore';
import { authService } from './authService';

export async function awardPoints(gameMode: string, points: number, unit?: string) {
  const userId = authService.getCurrentUserId();
  if (!userId) return;

  const userProfileRef = doc(db, 'userProfiles', userId);
  const userProfileSnap = await getDoc(userProfileRef);

  if (!userProfileSnap.exists()) {
    // Yeni kullanıcı profili oluştur
    await setDoc(userProfileRef, {
      userId,
      displayName: authService.getCurrentUser()?.displayName || 'Anonim',
      totalScore: points,
      scores: { [gameMode]: points },
      lastPlayed: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } else {
    // Mevcut kullanıcıya puan ekle
    await updateDoc(userProfileRef, {
      [`scores.${gameMode}`]: increment(points),
      totalScore: increment(points),
      lastPlayed: new Date(),
      updatedAt: new Date(),
    });
  }
} 