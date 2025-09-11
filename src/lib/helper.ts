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
 * Gets the user's role in a specific lifegroup, considering PIC hierarchy.
 * @param lifeGroup - The lifegroup object
 * @param userId - The user ID (optional, will use current user if not provided)
 * @returns The user's role: 'pic', 'leader', 'co_leader', 'member', or null
 */
export function getUserRoleInLifeGroup(lifeGroup: any, userId?: string): string | null {
  const currentUserId = userId || getCurrentUserId();
  if (!currentUserId) return null;

  // First check if user is PIC Lifegroup for this church
  const permissions = getCurrentUserLifegroupPermissions();
  if (permissions && lifeGroup.church_id) {
    const isPICForThisChurch = permissions.churches.some(church => church.id === lifeGroup.church_id);
    if (isPICForThisChurch) {
      return 'pic';
    }
  }

  // Then check person members (new structure)
  const personMember = lifeGroup.person_members?.find((m: any) => 
    m.person?.id === currentUserId || 
    (lifeGroup.leader_id === currentUserId && m.position === 'LEADER') ||
    (lifeGroup.co_leader_id === currentUserId && m.position === 'CO_LEADER')
  );
  if (personMember) {
    switch (personMember.position) {
      case 'LEADER': return 'leader';
      case 'CO_LEADER': return 'co_leader';
      case 'MEMBER': return 'member';
      default: return 'member';
    }
  }

  // Check if user is leader or co-leader directly (for cases where person_members isn't populated)
  if (lifeGroup.leader_id === currentUserId) return 'leader';
  if (lifeGroup.co_leader_id === currentUserId) return 'co_leader';

  // Fallback to legacy members structure if exists
  const member = lifeGroup.members?.find((m: any) => m.user_id === currentUserId && m.is_active);
  return member?.role || null;
}

/**
 * Checks if user can manage (edit/add members/change positions) a specific lifegroup.
 * @param lifeGroup - The lifegroup object
 * @param userId - The user ID (optional, will use current user if not provided)
 * @returns True if user can manage this lifegroup
 */
export function canManageLifeGroup(lifeGroup: any, userId?: string): boolean {
  const role = getUserRoleInLifeGroup(lifeGroup, userId);
  return role === 'pic' || role === 'leader' || role === 'co_leader';
}

/**
 * Checks if user can edit lifegroup details.
 * @param lifeGroup - The lifegroup object
 * @param userId - The user ID (optional, will use current user if not provided)
 * @returns True if user can edit this lifegroup
 */
export function canEditLifeGroup(lifeGroup: any, userId?: string): boolean {
  const role = getUserRoleInLifeGroup(lifeGroup, userId);
  return role === 'pic' || role === 'leader' || role === 'co_leader';
}

/**
 * Checks if user can delete lifegroup.
 * @param lifeGroup - The lifegroup object
 * @param userId - The user ID (optional, will use current user if not provided)
 * @returns True if user can delete this lifegroup
 */
export function canDeleteLifeGroup(lifeGroup: any, userId?: string): boolean {
  const role = getUserRoleInLifeGroup(lifeGroup, userId);
  return role === 'pic' || role === 'leader'; // NO co_leader access for delete
}

/**
 * Checks if user can add/edit members to a lifegroup.
 * @param lifeGroup - The lifegroup object
 * @param userId - The user ID (optional, will use current user if not provided)
 * @returns True if user can add/edit members
 */
export function canAddEditMembers(lifeGroup: any, userId?: string): boolean {
  const role = getUserRoleInLifeGroup(lifeGroup, userId);
  return role === 'pic' || role === 'leader' || role === 'co_leader';
}

/**
 * Checks if user can delete members from a lifegroup.
 * @param lifeGroup - The lifegroup object
 * @param userId - The user ID (optional, will use current user if not provided)
 * @returns True if user can delete members
 */
export function canDeleteMembers(lifeGroup: any, userId?: string): boolean {
  const role = getUserRoleInLifeGroup(lifeGroup, userId);
  return role === 'pic' || role === 'leader'; // NO co_leader access for member deletion
}

/**
 * Checks if user can view a specific lifegroup.
 * @param lifeGroup - The lifegroup object
 * @param userId - The user ID (optional, will use current user if not provided)
 * @returns True if user can view this lifegroup
 */
export function canViewLifeGroup(lifeGroup: any, userId?: string): boolean {
  const role = getUserRoleInLifeGroup(lifeGroup, userId);
  return role !== null; // Any role (pic, leader, co_leader, member) can view
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
