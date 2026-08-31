import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, get } from 'firebase/database';

// Dedicated Firebase Realtime Database Configuration for Hacktronics Display
const firebaseConfig = {
  apiKey: "AIzaSyD-HacktronicsDisplay2026KeyRealtimeSync",
  authDomain: "hacktronics-live-2026.firebaseapp.com",
  databaseURL: "https://hacktronics-live-2026-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hacktronics-live-2026",
  storageBucket: "hacktronics-live-2026.firebasestorage.app",
  messagingSenderId: "987654321098",
  appId: "1:987654321098:web:a1b2c3d4e5f6g7h8i9j0"
};

let db = null;
let isInitialized = false;

try {
  const app = initializeApp(firebaseConfig);
  db = getDatabase(app);
  isInitialized = true;
  console.log('⚡ Firebase Realtime Cloud Sync Initialized Successfully');
} catch (err) {
  console.warn('⚠️ Firebase Initialization Notice:', err.message);
}

const STATE_REF_PATH = 'hacktronics_live_state_v1';

/**
 * Pushes updated state to Firebase Cloud Database in real-time
 */
export async function pushStateToCloud(state) {
  if (!db || !isInitialized) return;
  try {
    const stateRef = ref(db, STATE_REF_PATH);
    const payload = {
      ...state,
      _lastUpdated: Date.now(),
      _senderId: window.name || 'device_' + Math.random().toString(36).substring(7)
    };
    await set(stateRef, payload);
  } catch (err) {
    console.warn('Cloud state sync dispatch notice:', err.message);
  }
}

/**
 * Subscribes to real-time cloud state updates across all devices globally
 */
export function subscribeToCloudState(onStateChange) {
  if (!db || !isInitialized) return () => {};

  try {
    const stateRef = ref(db, STATE_REF_PATH);
    const unsubscribe = onValue(
      stateRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          if (val) {
            onStateChange(val);
          }
        }
      },
      (error) => {
        console.warn('Cloud listener notice:', error.message);
      }
    );
    return unsubscribe;
  } catch (e) {
    console.warn('Failed to subscribe to cloud updates:', e);
    return () => {};
  }
}

/**
 * Fetches the current cloud state on initial page load
 */
export async function fetchInitialCloudState() {
  if (!db || !isInitialized) return null;
  try {
    const stateRef = ref(db, STATE_REF_PATH);
    const snapshot = await get(stateRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
  } catch (err) {
    console.warn('Could not fetch initial cloud state:', err.message);
  }
  return null;
}
