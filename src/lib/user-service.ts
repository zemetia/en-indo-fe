import apiClient from '@/lib/api';

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface ToggleStatusRequest {
  is_active: boolean;
}

export interface ToggleStatusResponse {
  person_id: string;
  is_active: boolean;
}

export interface CreateAccountRequest {
  person_id: string;
  email: string;
  nama: string;
}

export interface CreateAccountResponse {
  id: string;
  email: string;
  person_id: string;
  is_active: boolean;
}

export const userService = {
  // Toggle user activation status by person ID
  async toggleActivationStatus(personId: string, isActive: boolean): Promise<ToggleStatusResponse> {
    try {
      console.log('[DEBUG] toggleActivationStatus called with:', { personId, isActive });
      
      const requestBody = { is_active: isActive };
      console.log('[DEBUG] Request body:', JSON.stringify(requestBody));
      
      const response = await apiClient.put<ApiResponse<ToggleStatusResponse>>(
        `/api/user/person/${personId}/toggle-status`,
        requestBody
      );
      
      console.log('[DEBUG] Response received:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('[ERROR] toggleActivationStatus failed:', {
        personId,
        isActive,
        error: error.response?.data || error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data
        }
      });
      throw error;
    }
  },

  // Create user account for a person
  async createUserAccount(personId: string, email: string, nama: string): Promise<CreateAccountResponse> {
    try {
      console.log('[DEBUG] createUserAccount called with:', { personId, email, nama });
      
      const requestBody = { 
        person_id: personId,
        email: email,
        nama: nama
      };
      console.log('[DEBUG] Request body:', JSON.stringify(requestBody));
      
      const response = await apiClient.post<ApiResponse<CreateAccountResponse>>(
        '/api/user/register',
        requestBody
      );
      
      console.log('[DEBUG] Response received:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('[ERROR] createUserAccount failed:', {
        personId,
        email,
        nama,
        error: error.response?.data || error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
      });
      throw error;
    }
  },
};