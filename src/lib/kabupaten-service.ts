import apiClient from '@/lib/api';

// Types for API responses
export interface Kabupaten {
  id: number;
  name: string;
  provinsi_id: number;
  provinsi: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

// Kabupaten API service functions
export const kabupatenApi = {
  // Get all kabupatens
  getAll: async (): Promise<Kabupaten[]> => {
    const response = await apiClient.get<ApiResponse<Kabupaten[]>>('/api/kabupaten');
    return response.data.data;
  },

  // Get kabupaten by ID
  getById: async (id: number): Promise<Kabupaten> => {
    const response = await apiClient.get<ApiResponse<Kabupaten>>(`/api/kabupaten/${id}`);
    return response.data.data;
  },

  // Get kabupatens by province ID
  getByProvinsiId: async (provinsiId: number): Promise<Kabupaten[]> => {
    const response = await apiClient.get<ApiResponse<Kabupaten[]>>(`/api/kabupaten/provinsi/${provinsiId}`);
    return response.data.data;
  },
};