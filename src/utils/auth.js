// SHA-256 Salted Cryptographic Hash of 'keerthi:eggpuff@123:hackatronics_2026_salt'
const EXPECTED_CREDENTIAL_HASH = 'd9a91f44cbd792b724b27ec326ae4337619e338ba67bb71fe4ba7b72fb897bd9';
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
    if (hash === EXPECTED_CREDENTIAL_HASH) {
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
