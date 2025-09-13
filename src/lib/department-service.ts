import apiClient from '@/lib/api';

// Types for API responses
export interface Department {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface DepartmentRequest {
  name: string;
  description: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

// Department API service functions
export const departmentService = {
  // Get all departments
  async getAll(): Promise<Department[]> {
    const response = await apiClient.get<ApiResponse<Department[]>>('/api/department');
    return response.data.data;
  },

  // Get department by ID
  async getById(id: string): Promise<Department> {
    const response = await apiClient.get<ApiResponse<Department>>(`/api/department/${id}`);
    return response.data.data;
  },

  // Create new department
  async create(data: DepartmentRequest): Promise<void> {
    await apiClient.post('/api/department', data);
  },

  // Update department
  async update(id: string, data: DepartmentRequest): Promise<void> {
    await apiClient.put(`/api/department/${id}`, data);
  },

  // Delete department
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/department/${id}`);
  },
};