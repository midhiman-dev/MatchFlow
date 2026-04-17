import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "mock-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "matchflow-mvp.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DB_URL || "https://matchflow-mvp-default-rtdb.firebaseio.com",
  projectId: "matchflow-mvp",
  storageBucket: "matchflow-mvp.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  measurementId: "G-1234567890"
};

// Initialize Google Firebase Services
export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Initialize Analytics conditionally to avoid test environment errors
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Helper function to track meaningful app usage events
export const trackEvent = (eventName: string, params: object = {}) => {
  if (analytics) {
    logEvent(analytics, eventName, params);
  }
};

export const syncLiveStateToFirebase = (zoneId: string, payload: any) => {
  const stateRef = ref(database, `liveState/zones/${zoneId}`);
  return set(stateRef, {
    ...payload,
    lastUpdated: Date.now()
  });
};

export const authenticateFan = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    trackEvent('login', { method: 'anonymous' });
    return userCredential.user;
  } catch (error) {
    console.error("Firebase Auth Error:", error);
    return null;
  }
};
