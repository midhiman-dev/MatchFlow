import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { getAuth, signInAnonymously } from 'firebase/auth';

// Valid Firebase config would go here in production.
// Falling back to mock values for the MVP container.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "mock-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "matchflow-mvp.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DB_URL || "https://matchflow-mvp-default-rtdb.firebaseio.com",
  projectId: "matchflow-mvp",
  storageBucket: "matchflow-mvp.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Google Firebase Services
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);

// Helper function to show usage of SDK for the Live Heatmap functionality
export const syncLiveStateToFirebase = (zoneId: string, payload: any) => {
  const stateRef = ref(database, `liveState/zones/${zoneId}`);
  return set(stateRef, {
    ...payload,
    lastUpdated: Date.now()
  });
};

// Helper for Anonymous Authentication in Stadium
export const authenticateFan = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    console.error("Firebase Auth Error:", error);
    return null;
  }
};
