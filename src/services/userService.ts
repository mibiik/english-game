import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp, doc, setDoc, getDoc, query, where, getDocs } from 'firebase/firestore';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Helper function to get current user, returns a promise
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

// Browser fingerprint oluştur
const generateBrowserFingerprint = (): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Browser fingerprint', 2, 2);
  }
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL()
  ].join('|');
  
  // Simple hash
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString();
};

export const userService = {
  saveUserName: async (name: string): Promise<void> => {
    try {
      const user: any = await getCurrentUser();
      if (user) {
        // Authenticated user, use their UID
        await setDoc(doc(db, "users", user.uid), {
          name: name,
          email: user.email,
          lastSeen: serverTimestamp()
        }, { merge: true }); // Merge to not overwrite other user data
      } else {
        // Anonymous guest user
        await addDoc(collection(db, 'guests'), {
          name: name,
          createdAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Error saving user/guest name: ", error);
    }
  },
  saveUserFeedback: async (name: string, feedback: string): Promise<void> => {
    try {
      await addDoc(collection(db, 'feedbacks'), {
        name: name,
        feedback: feedback,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error saving feedback: ", error);
    }
  },
  checkIfModalSeen: async (): Promise<boolean> => {
    try {
      const browserId = generateBrowserFingerprint();
      const q = query(collection(db, 'modalViews'), where('browserId', '==', browserId));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error checking modal view: ", error);
      return false;
    }
  },
  markModalAsSeen: async (): Promise<void> => {
    try {
      const browserId = generateBrowserFingerprint();
      await addDoc(collection(db, 'modalViews'), {
        browserId: browserId,
        viewedAt: serverTimestamp(),
        userAgent: navigator.userAgent,
      });
    } catch (error) {
      console.error("Error marking modal as seen: ", error);
    }
  },
}; 