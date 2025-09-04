import apiClient from '@/lib/api';
import { UserData, setUserData } from '@/lib/helper';

// Types for authentication
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  pelayanan: Array<{
    pelayanan_id: string;
    pelayanan: string;
    church_id: string;
    church_name: string;
    is_pic: boolean;
  }>;
  nama: string;
  image_url: string;
  is_verified: boolean;
  is_first_time_login: boolean;
  requires_password_setup: boolean;
  default_password_hint?: string;
  expired_at: string;
}

export interface PasswordSetupRequest {
  action: 'change' | 'keep';
  new_password?: string;
}

export interface PasswordSetupResponse {
  success: boolean;
  message: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

// Error message mapping for better user experience
const mapErrorMessage = (errorMessage: string): string => {
  const errorMap: { [key: string]: string } = {
    'email not found': 'Email tidak ditemukan. Pastikan email yang Anda masukkan benar.',
    'account not verified': 'Akun Anda belum diverifikasi. Silakan periksa email untuk verifikasi.',
    'user account is inactive': 'Akun Anda tidak aktif. Silakan hubungi administrator.',
    'user has no pelayanan assignments': 'Anda belum memiliki penugasan pelayanan. Silakan hubungi administrator.',
    'password not match': 'Email atau kata sandi yang Anda masukkan salah.',
    'failed login': 'Login gagal. Silakan periksa email dan kata sandi Anda.',
    'wrong email or password': 'Email atau kata sandi yang Anda masukkan salah.',
  };

  // Check if error message contains any of our mapped errors (case insensitive)
  for (const [key, value] of Object.entries(errorMap)) {
    if (errorMessage.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }
  
  return 'Login gagal. Silakan coba lagi atau hubungi administrator jika masalah berlanjut.';
};

// Authentication service functions
export const authService = {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<ApiResponse<LoginResponse>>(
        'api/user/login',
        credentials
      );
      
      const loginData = response.data.data;
      
      // Store user data (convert snake_case to camelCase for internal use)
      const userData: UserData = {
        token: loginData.token,
        pelayanan: loginData.pelayanan,
        nama: loginData.nama,
        image_url: loginData.image_url,
        is_verified: loginData.is_verified,
        is_first_time_login: loginData.is_first_time_login,
        requires_password_setup: loginData.requires_password_setup,
        default_password_hint: loginData.default_password_hint,
      };
      
      // Always store user data to ensure token is available for password setup API calls
      setUserData(userData);
      
      return loginData;
    } catch (error: any) {
      const originalError = error.response?.data?.error || error.response?.data?.message || 'Login failed';
      const friendlyMessage = mapErrorMessage(originalError);
      
      throw new Error(friendlyMessage);
    }
  },

  /**
   * Setup password for first-time users
   */
  async setupPassword(request: PasswordSetupRequest): Promise<PasswordSetupResponse> {
    try {
      const response = await apiClient.post<ApiResponse<PasswordSetupResponse>>(
        'api/user/auth/setup-password',
        request
      );
      
      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Password setup failed'
      );
    }
  },

  /**
   * Complete the first-time setup flow and store user data
   */
  async completeFirstTimeSetup(userData: UserData): Promise<void> {
    try {
      // Remove first-time flags and store final user data
      const finalUserData: UserData = {
        ...userData,
        is_first_time_login: false,
        requires_password_setup: false,
        default_password_hint: undefined,
      };
      
      setUserData(finalUserData);
    } catch (error) {
      throw new Error('Gagal menyelesaikan pengaturan');
    }
  },

  /**
   * Validate password strength - Simplified version (letters only, no special chars/numbers required)
   */
  validatePassword(password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
    requirements: Array<{ id: string; text: string; met: boolean }>;
  } {
    const requirements = [
      { id: 'length', text: 'Minimal 8 karakter', met: password.length >= 8 },
      { id: 'letter', text: 'Mengandung huruf', met: /[a-zA-Z]/.test(password) },
    ];

    const metCount = requirements.filter(req => req.met).length;
    const score = Math.min(4, metCount * 2); // Scale score to 0-4 for 2 requirements
    const isValid = metCount >= 2; // Both requirements must be met
    
    const feedback: string[] = [];
    if (password.length < 8) feedback.push('Kata sandi harus minimal 8 karakter');
    if (!/[a-zA-Z]/.test(password)) feedback.push('Tambahkan huruf untuk memperkuat kata sandi Anda');
    
    return {
      isValid,
      score,
      feedback,
      requirements,
    };
  },
};