import { enhancedApiClient } from '@/lib/api-client';

export interface UpdateUserDataRequest {
  nama: string;
  email?: string;
  phone?: string;
}

export interface UpdateUserDataResponse {
  success: boolean;
  message: string;
  data?: {
    nama: string;
    email: string;
    phone: string;
  };
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export interface UserSettingsRequest {
  notifications?: {
    email: boolean;
    push: boolean;
    schedule: boolean;
  };
  privacy?: {
    publicProfile: boolean;
    activityHistory: boolean;
    analytics: boolean;
  };
  language?: string;
  timezone?: string;
}

export interface UserSettingsResponse {
  success: boolean;
  message: string;
  data?: UserSettingsRequest;
}

export const userSettingsApi = {
  // Update user personal data
  updateUserData: async (data: UpdateUserDataRequest): Promise<UpdateUserDataResponse> => {
    try {
      const response = await enhancedApiClient.put<UpdateUserDataResponse>(
        '/api/user/profile',
        data
      );
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update user data');
    }
  },

  // Change user password
  changePassword: async (data: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
    try {
      const response = await enhancedApiClient.put<ChangePasswordResponse>(
        '/api/user/password',
        data
      );
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to change password');
    }
  },

  // Update user settings
  updateSettings: async (data: UserSettingsRequest): Promise<UserSettingsResponse> => {
    try {
      const response = await enhancedApiClient.put<UserSettingsResponse>(
        '/api/user/settings',
        data
      );
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update settings');
    }
  },

  // Get user settings
  getSettings: async (): Promise<UserSettingsResponse> => {
    try {
      const response = await enhancedApiClient.get<UserSettingsResponse>(
        '/api/user/settings',
        { cache: true, cacheTTL: 5 * 60 * 1000 } // Cache for 5 minutes
      );
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get settings');
    }
  },

  // Export user data
  exportUserData: async (): Promise<Blob> => {
    try {
      const response = await enhancedApiClient.get('/api/user/export', {
        cache: false,
        responseType: 'blob' as any
      });
      return response as any;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to export user data');
    }
  },

  // Delete user account
  deleteAccount: async (password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await enhancedApiClient.delete('/api/user/account', {
        data: { password }
      });
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete account');
    }
  },
};