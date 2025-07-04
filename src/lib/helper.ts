import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';

// The secret key should be stored securely and not exposed on the client-side.
// For this example, we're using an environment variable that should be set in your .env.local file.
const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || 'default-secret-key-for-dev';

export interface Pelayanan {
  pelayanan_id: string;
  pelayanan: string;
  church_id: string;
  church_name: string;
  is_pic: boolean;
}

export interface UserData {
  token: string;
  pelayanan: Pelayanan[];
  nama: string;
  image_url: string;
  is_verified: boolean;
}

/**
 * Encrypts and stores user data in a cookie.
 * @param userData - The user data object to store.
 */
export function setUserData(userData: UserData) {
  if (typeof window === 'undefined') return;

  try {
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(userData),
      SECRET_KEY
    ).toString();
    
    // Set cookie to expire in 3 days
    Cookies.set('userData', encryptedData, { expires: 3, secure: process.env.NODE_ENV === 'production' });
  } catch (error) {
    console.error("Failed to set user data:", error);
  }
}

/**
 * Retrieves and decrypts user data from a cookie.
 * @returns The user data object or null if not found or on error.
 */
export function getUserData(): UserData | null {
  if (typeof window === 'undefined') return null;

  const encryptedData = Cookies.get('userData');
  if (!encryptedData) {
    return null;
  }

  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedData) {
      // Decryption might result in an empty string if the key is wrong or data is corrupted
      return null;
    }
    
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error("Failed to decrypt or parse user data:", error);
    // Clear corrupted cookie
    Cookies.remove('userData');
    return null;
  }
}

/**
 * Retrieves the authentication token from the stored user data.
 * @returns The token string or null if not found.
 */
export function getToken(): string | null {
  const userData = getUserData();
  return userData?.token ?? null;
}

/**
 * Logs the user out by removing the user data cookie and redirecting to the login page.
 */
export function Logout() {
    if (typeof window === 'undefined') return;
    Cookies.remove('userData');
    // Redirect to login page to clear any session state
    window.location.href = '/login';
}
