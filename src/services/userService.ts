import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
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
}; 