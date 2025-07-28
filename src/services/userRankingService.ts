import { db } from '../config/firebase';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';

export interface UserRanking {
  userId: string;
  displayName: string;
  totalScore: number;
  rank: number;
}

export class UserRankingService {
  private cache: { [key: string]: { data: UserRanking[], timestamp: number } } = {};
  private CACHE_DURATION = 5 * 60 * 1000; // 5 dakika

  async getUserRanking(userId: string): Promise<number | null> {
    try {
      // Cache kontrolü
      const cacheKey = 'global_ranking';
      const cached = this.cache[cacheKey];
      
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        const userRank = cached.data.find(user => user.userId === userId);
        return userRank ? userRank.rank : null;
      }

      // Firestore'dan tüm kullanıcıları al
      const usersRef = collection(db, 'userProfiles');
      const q = query(usersRef, orderBy('totalScore', 'desc'));
      const querySnapshot = await getDocs(q);

      const rankings: UserRanking[] = [];
      let rank = 1;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.totalScore !== undefined) {
          rankings.push({
            userId: doc.id,
            displayName: data.displayName || 'Bilinmeyen Kullanıcı',
            totalScore: data.totalScore,
            rank: rank++
          });
        }
      });

      // Cache'e kaydet
      this.cache[cacheKey] = {
        data: rankings,
        timestamp: Date.now()
      };

      // Kullanıcının sıralamasını bul
      const userRank = rankings.find(user => user.userId === userId);
      return userRank ? userRank.rank : null;

    } catch (error) {
      console.error('Kullanıcı sıralaması alınırken hata:', error);
      return null;
    }
  }

  async getTopUsers(limit: number = 10): Promise<UserRanking[]> {
    try {
      const usersRef = collection(db, 'userProfiles');
      const q = query(usersRef, orderBy('totalScore', 'desc'));
      const querySnapshot = await getDocs(q);

      const rankings: UserRanking[] = [];
      let rank = 1;

      querySnapshot.forEach((doc) => {
        if (rankings.length < limit) {
          const data = doc.data();
          if (data.totalScore !== undefined) {
            rankings.push({
              userId: doc.id,
              displayName: data.displayName || 'Bilinmeyen Kullanıcı',
              totalScore: data.totalScore,
              rank: rank++
            });
          }
        }
      });

      return rankings;

    } catch (error) {
      console.error('Top kullanıcılar alınırken hata:', error);
      return [];
    }
  }

  clearCache() {
    this.cache = {};
  }
}

export const userRankingService = new UserRankingService(); 