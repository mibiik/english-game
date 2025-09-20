import { supabaseGameScoreService } from './supabaseGameScoreService';
import { supabaseAuthService } from './supabaseAuthService';

export async function awardPoints(gameMode: string, points: number, unit?: string) {
  const userId = supabaseAuthService.getCurrentUserId();
  if (!userId) return;

  try {
    await supabaseGameScoreService.addScore(userId, gameMode as any, points);
  } catch (error) {
    console.error('Puan ekleme hatası:', error);
  }
} 