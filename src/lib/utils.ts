import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Oyun state'i localStorage yönetimi
export const gameStateManager = {
  // State'i kaydet
  saveGameState: (gameKey: string, state: any) => {
    try {
      console.log(`[LocalStorage] Saving game state for ${gameKey}:`, state);
      localStorage.setItem(`game_${gameKey}`, JSON.stringify(state));
    } catch (error) {
      console.error('Oyun state kaydedilirken hata:', error);
    }
  },

  // State'i yükle
  loadGameState: (gameKey: string) => {
    try {
      const stored = localStorage.getItem(`game_${gameKey}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log(`[LocalStorage] Loading game state for ${gameKey}:`, parsed);
        return parsed;
      }
      console.log(`[LocalStorage] No saved state found for ${gameKey}`);
    } catch (error) {
      console.error('Oyun state yüklenirken hata:', error);
    }
    return null;
  },

  // State'i temizle
  clearGameState: (gameKey: string) => {
    try {
      console.log(`[LocalStorage] Clearing game state for ${gameKey}`);
      localStorage.removeItem(`game_${gameKey}`);
    } catch (error) {
      console.error('Oyun state temizlenirken hata:', error);
    }
  },

  // Tüm oyun state'lerini temizle
  clearAllGameStates: () => {
    try {
      console.log('[LocalStorage] Clearing all game states');
      const keys = Object.keys(localStorage);
      const gameKeys = keys.filter(key => key.startsWith('game_'));
      console.log('[LocalStorage] Found game keys:', gameKeys);
      gameKeys.forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Tüm oyun state\'leri temizlenirken hata:', error);
    }
  }
};
