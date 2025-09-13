import apiClient from '@/lib/api';

// Types for API responses
export interface Provinsi {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

// Provinsi API service functions
export const provinsiService = {
  // Get all provinces
  async getAll(): Promise<Provinsi[]> {
    const response = await apiClient.get<ApiResponse<Provinsi[]>>('/api/provinsi');
    return response.data.data;
  },

  // Get province by ID
  async getById(id: number): Promise<Provinsi> {
    const response = await apiClient.get<ApiResponse<Provinsi>>(`/api/provinsi/${id}`);
    return response.data.data;
  },
};