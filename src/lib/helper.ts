import CryptoJS from 'crypto-js';

export function getFromLocalStorage(key: string): string | null {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(key);
  }
  return null;
}

export function getFromSessionStorage(key: string): string | null {
  if (typeof sessionStorage !== 'undefined') {
    return sessionStorage.getItem(key);
  }
  return null;
}

// User Data Local Storage

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY ?? ''; // Gantilah dengan kunci rahasia yang kuat

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

import Cookies from 'js-cookie';

export function getUserData(): UserData | null {
  const encryptedData = Cookies.get('userData');
  if (encryptedData) {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
      const userData = bytes.toString(CryptoJS.enc.Utf8);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Failed to decrypt or parse user data:", error);
      return null;
    }
  }
  return null;
}

export function getToken(): string | null {
  const userData = getUserData();
  return userData?.token ?? null;
}

export function setUserData(userData: UserData) {
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(userData),
    SECRET_KEY
  ).toString();
  Cookies.set('userData', encryptedData, { expires: 3 }); // Set cookie to expire in 3 days
}

export function Logout() {
  Cookies.remove('userData');
  window.location.href = '/login';
}
