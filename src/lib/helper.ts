import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

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
  is_first_time_login?: boolean;
  requires_password_setup?: boolean;
  default_password_hint?: string;
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
    console.error('No userData cookie found');
    return null;
  }

  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedData) {
      // Decryption might result in an empty string if the key is wrong or data is corrupted
      console.error('Failed to decrypt user data - empty result');
      return null;
    }
    
    const userData = JSON.parse(decryptedData);
    return userData;
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
 * Retrieves the current user's person ID from the JWT token.
 * @returns The person ID string or null if not found.
 */
export function getCurrentUserPersonId(): string | null {
  const token = getToken();
  if (!token) return null;
  
  try {
    const decoded: any = jwtDecode(token);
    return decoded.person_id || null;
  } catch (error) {
    console.error('Failed to decode JWT token:', error);
    return null;
  }
}

/**
 * Retrieves the current user's ID from the JWT token.
 * @returns The user ID string or null if not found.
 */
export function getCurrentUserId(): string | null {
  const token = getToken();
  if (!token) {
    console.error('No token found in getCurrentUserId');
    return null;
  }
  
  try {
    const decoded: any = jwtDecode(token);
    return decoded.user_id || decoded.id || null;
  } catch (error) {
    console.error('Failed to decode JWT token:', error);
    return null;
  }
}

/**
 * Retrieves the current user's church ID from the JWT token.
 * @returns The church ID string or null if not found.
 */
export function getCurrentUserChurchId(): string | null {
  const token = getToken();
  if (!token) {
    console.error('No token found in getCurrentUserChurchId');
    return null;
  }
  
  try {
    const decoded: any = jwtDecode(token);
    return decoded.church_id || null;
  } catch (error) {
    console.error('Failed to decode JWT token:', error);
    return null;
  }
}

/**
 * Checks if the current user has PIC access to lifegroup features.
 * @returns True if user is PIC of lifegroup pelayanan, false otherwise.
 */
export function hasLifegroupPICAccess(): boolean {
  const userData = getUserData();
  if (!userData) {
    console.error('hasLifegroupPICAccess: No user data found - user may not be logged in');
    return false;
  }
  
  if (!userData.pelayanan) {
    console.error('hasLifegroupPICAccess: No pelayanan array found in user data');
    return false;
  }

  if (!Array.isArray(userData.pelayanan) || userData.pelayanan.length === 0) {
    console.warn('hasLifegroupPICAccess: Pelayanan is not an array or is empty:', userData.pelayanan);
    return false;
  }

  const lifegroupPIC = userData.pelayanan.find(
    (p) => (p.pelayanan.toLowerCase().includes('pic') && 
           p.pelayanan.toLowerCase().includes('lifegroup') && 
           p.is_pic) || 
           p.pelayanan.toLowerCase() === 'pic lifegroup'
  );

  return !!lifegroupPIC;
}

/**
 * Gets all church IDs where the user is PIC of lifegroup pelayanan.
 * @returns Array of church IDs or empty array if none found.
 */
export function getLifegroupChurchIds(): string[] {
  const userData = getUserData();
  if (!userData || !userData.pelayanan) {
    console.error('No user data or pelayanan found for church IDs');
    return [];
  }

  const churchIds = userData.pelayanan
    .filter((p) => ((p.pelayanan.toLowerCase().includes('pic') && 
                     p.pelayanan.toLowerCase().includes('lifegroup') && 
                     p.is_pic) || 
                     p.pelayanan.toLowerCase() === 'pic lifegroup'))
    .map((p) => p.church_id);

  return churchIds;
}

/**
 * Gets the user's lifegroup-related permissions and church assignments.
 * @returns Object with lifegroup permissions or null if no access.
 */
export function getCurrentUserLifegroupPermissions(): {
  churches: Array<{ id: string; name: string }>;
  isPIC: boolean;
} | null {
  const userData = getUserData();
  if (!userData) {
    console.error('getCurrentUserLifegroupPermissions: No user data found - user may not be logged in');
    return null;
  }
  
  if (!userData.pelayanan) {
    console.error('getCurrentUserLifegroupPermissions: No pelayanan array found in user data');
    return null;
  }

  if (!Array.isArray(userData.pelayanan) || userData.pelayanan.length === 0) {
    console.warn('getCurrentUserLifegroupPermissions: Pelayanan is not an array or is empty:', userData.pelayanan);
    return null;
  }

  const lifegroupPelayanan = userData.pelayanan.filter(
    (p) => ((p.pelayanan.toLowerCase().includes('pic') && 
             p.pelayanan.toLowerCase().includes('lifegroup') && 
             p.is_pic) || 
             p.pelayanan.toLowerCase() === 'pic lifegroup')
  );

  if (lifegroupPelayanan.length === 0) {
    console.error('getCurrentUserLifegroupPermissions: User is not PIC of any lifegroup pelayanan');
    return null;
  }

  const permissions = {
    churches: lifegroupPelayanan.map((p) => ({
      id: p.church_id,
      name: p.church_name,
    })),
    isPIC: true,
  };

  return permissions;
}

/**
 * Gets the default church ID for lifegroup operations (first lifegroup PIC assignment).
 * @returns Church ID string or null if user has no lifegroup PIC access.
 */
export function getDefaultLifegroupChurchId(): string | null {
  const churchIds = getLifegroupChurchIds();
  return churchIds.length > 0 ? churchIds[0] : null;
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
