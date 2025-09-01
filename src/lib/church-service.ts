import apiClient from '@/lib/api';

// Types for API responses
export interface Church {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  kabupaten_id: number;
  kabupaten: string;
  provinsi_id: number;
  provinsi: string;
  created_at: string;
  updated_at: string;
}

export interface ChurchRequest {
  name: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  kabupaten_id: number;
}

export interface ChurchSearchParams {
  name?: string;
  kabupaten_id?: number;
  provinsi_id?: number;
  page?: number;
  per_page?: number;
}

export interface PaginationResponse<T> {
  data: T[];
  page: number;
  per_page: number;
  max_page: number;
  count: number;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

// Church API service functions
export const churchService = {
  // Get all churches with pagination and filters
  async getAll(params: ChurchSearchParams = {}): Promise<PaginationResponse<Church>> {
    const searchParams = new URLSearchParams();
    
    // Add search parameters
    if (params.name) searchParams.append('name', params.name);
    if (params.kabupaten_id) searchParams.append('kabupaten_id', params.kabupaten_id.toString());
    if (params.provinsi_id) searchParams.append('provinsi_id', params.provinsi_id.toString());
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.per_page) searchParams.append('per_page', params.per_page.toString());
    
    const response = await apiClient.get<ApiResponse<PaginationResponse<Church>>>(
      `/api/church?${searchParams.toString()}`
    );
    return response.data.data;
  },

  // Get church by ID
  async getById(id: string): Promise<Church> {
    const response = await apiClient.get<ApiResponse<Church>>(`/api/church/${id}`);
    return response.data.data;
  },

  // Get churches by kabupaten ID
  async getByKabupatenId(kabupatenId: number): Promise<Church[]> {
    const response = await apiClient.get<ApiResponse<Church[]>>(`/api/church/kabupaten/${kabupatenId}`);
    return response.data.data;
  },

  // Get churches by provinsi ID
  async getByProvinsiId(provinsiId: number): Promise<Church[]> {
    const response = await apiClient.get<ApiResponse<Church[]>>(`/api/church/provinsi/${provinsiId}`);
    return response.data.data;
  },

  // Create new church
  async create(data: ChurchRequest): Promise<void> {
    await apiClient.post('/api/church', data);
  },

  // Update church
  async update(id: string, data: ChurchRequest): Promise<void> {
    await apiClient.put(`/api/church/${id}`, data);
  },

  // Delete church
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/church/${id}`);
  },

  // Get simple list for dropdowns (without pagination)
  async getSimpleList(): Promise<Church[]> {
    const response = await this.getAll({ per_page: 1000 });
    return response.data;
  },
};