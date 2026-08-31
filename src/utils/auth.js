// SHA-256 Salted Cryptographic Hashes of authorized organizer credentials
const ALLOWED_CREDENTIAL_HASHES = [
  'a61f47a4d6e05ec3e65a37d5b54c2e606db17c831388ae2b4555db09095dd4bd', // keerthi : eggpuff
  'f6fffcceb893d69f10adc4b324e7531180658ad6e78736666f98026377ed61d8'  // admin : coldcoffee
];
const SALT = 'hackatronics_2026_salt';
const SESSION_KEY = 'hackatronics_admin_session_v1';

/**
 * Computes SHA-256 hash using browser-native Web Crypto API
 */
export async function computeHash(username, password) {
  const normalizedUser = (username || '').trim().toLowerCase();
  const inputStr = `${normalizedUser}:${password}:${SALT}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(inputStr);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Validates login credentials asynchronously
 */
export async function authenticateUser(username, password, rememberMe = true) {
  try {
    const hash = await computeHash(username, password);
    if (ALLOWED_CREDENTIAL_HASHES.includes(hash)) {
      const sessionData = {
        username: (username || '').trim().toLowerCase(),
        token: 'auth_' + Math.random().toString(36).substring(2) + '_' + Date.now(),
        authenticatedAt: Date.now()
      };
      
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(SESSION_KEY, JSON.stringify(sessionData));
      // Always store in sessionStorage for current tab session
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
      
      return { success: true };
    }
    return { success: false, error: 'Invalid username or password' };
  } catch (err) {
    console.error('Authentication error:', err);
    return { success: false, error: 'Authentication processing failed' };
  }
}

/**
 * Checks if current user holds a valid session
 */
export function checkAuthStatus() {
  try {
    const sessionRaw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
    if (!sessionRaw) return false;
    const session = JSON.parse(sessionRaw);
    return Boolean(session && session.token);
  } catch {
    return false;
  }
}

/**
 * Logs out the user by clearing saved auth sessions
 */
export function logoutUser() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
  } catch {
    console.warn('Error clearing session');
  }
}
