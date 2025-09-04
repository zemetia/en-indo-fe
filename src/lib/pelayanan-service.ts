import { Pelayanan } from '@/lib/helper';
import apiClient from '@/lib/api';

// Types for API responses
export interface PelayananAssignment {
  id: string;
  person_id: string;
  person_name: string;
  pelayanan_id: string;
  pelayanan: string;
  pelayanan_is_pic: boolean;
  church_id: string;
  church_name: string;
  department_id: string;
  department_name: string;
  has_user_account: boolean;
  is_user_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PelayananInfo {
  id: string;
  pelayanan: string;
  description: string;
  department: {
    id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
  };
  created_at: string;
  updated_at: string;
}

export interface AssignPelayananRequest {
  person_id: string;
  pelayanan_id: string;
  church_id: string;
  is_pic?: boolean;
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

// Pelayanan API service functions
export const pelayananService = {
  // Get current user's pelayanan assignments
  async getMyPelayanan(): Promise<Pelayanan[]> {
    const response = await apiClient.get<ApiResponse<Pelayanan[]>>('/api/pelayanan/my');
    return response.data.data;
  },

  // Get all pelayanan assignments (admin only)
  async getAllAssignments(page = 1, perPage = 10, search = ''): Promise<PaginationResponse<PelayananAssignment>> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      ...(search && { search })
    });
    
    const response = await apiClient.get<ApiResponse<PaginationResponse<PelayananAssignment>>>(
      `/api/pelayanan/assignments?${params.toString()}`
    );
    return response.data.data;
  },

  // Get all available pelayanan for dropdowns  
  async getAllPelayanan(departmentId?: string): Promise<PelayananInfo[]> {
    const params = new URLSearchParams();
    if (departmentId) {
      params.append('department_id', departmentId);
    }
    
    const url = params.toString() ? `/api/pelayanan/list?${params.toString()}` : '/api/pelayanan/list';
    const response = await apiClient.get<ApiResponse<PelayananInfo[]>>(url);
    return response.data.data;
  },

  // Assign pelayanan to a person
  async assignPelayanan(request: AssignPelayananRequest): Promise<void> {
    await apiClient.post('/api/pelayanan/assign', request);
  },

  // Unassign pelayanan
  async unassignPelayanan(assignmentId: string): Promise<void> {
    await apiClient.delete(`/api/pelayanan/assignments/${assignmentId}`);
  },

  // Update pelayanan assignment (mainly for PIC status)
  async updatePelayananAssignment(assignmentId: string, isPic: boolean): Promise<void> {
    await apiClient.put(`/api/pelayanan/assignments/${assignmentId}`, { is_pic: isPic });
  },

  // Get specific assignment by ID
  async getAssignmentById(assignmentId: string): Promise<PelayananAssignment> {
    const response = await apiClient.get<ApiResponse<PelayananAssignment>>(
      `/api/pelayanan/assignments/${assignmentId}`
    );
    return response.data.data;
  },
};