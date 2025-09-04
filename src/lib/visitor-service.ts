import apiClient from '@/lib/api';

// Types for API responses
export interface Visitor {
  id: string;
  name: string;
  ig_username?: string;
  phone_number?: string;
  kabupaten_id?: number;
  kabupaten: string;
  provinsi_id?: number;
  provinsi: string;
  information: VisitorInformation[];
  created_at: string;
  updated_at: string;
}

export interface VisitorInformation {
  id: string;
  visitor_id: string;
  visitor?: VisitorSimple;
  label: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface VisitorSimple {
  id: string;
  name: string;
  ig_username?: string;
  phone_number?: string;
  kabupaten_id?: number;
  kabupaten: string;
}

export interface VisitorRequest {
  name: string;
  ig_username?: string;
  phone_number?: string;
  kabupaten_id?: number;
}

export interface VisitorFormData {
  name: string;
  ig_username?: string;
  phone_number?: string;
  kabupaten_id?: number;
  provinsi_id?: number;
}

export interface VisitorInformationRequest {
  visitor_id: string;
  label: string;
  value: string;
}

export interface VisitorSearchParams {
  name?: string;
  ig_username?: string;
  phone_number?: string;
  kabupaten_id?: number;
}

// API Response wrapper
interface ApiResponse<T> {
  message: string;
  data: T;
}

// Visitor API functions
export const visitorApi = {
  // Get all visitors
  getAll: async (): Promise<Visitor[]> => {
    const response = await apiClient.get<ApiResponse<Visitor[]>>('/api/visitor');
    return response.data.data;
  },

  // Get visitor by ID
  getById: async (id: string): Promise<Visitor> => {
    const response = await apiClient.get<ApiResponse<Visitor>>(`/api/visitor/${id}`);
    return response.data.data;
  },

  // Search visitors
  search: async (params: VisitorSearchParams): Promise<Visitor[]> => {
    const searchParams = new URLSearchParams();
    if (params.name) searchParams.append('name', params.name);
    if (params.ig_username) searchParams.append('ig_username', params.ig_username);
    if (params.phone_number) searchParams.append('phone_number', params.phone_number);
    if (params.kabupaten_id) searchParams.append('kabupaten_id', params.kabupaten_id.toString());

    const response = await apiClient.get<ApiResponse<Visitor[]>>(
      `/api/visitor/search?${searchParams.toString()}`
    );
    return response.data.data;
  },

  // Create visitor
  create: async (visitor: VisitorRequest): Promise<Visitor> => {
    const response = await apiClient.post<ApiResponse<Visitor>>('/api/visitor', visitor);
    return response.data.data;
  },

  // Update visitor
  update: async (id: string, visitor: VisitorRequest): Promise<Visitor> => {
    const response = await apiClient.put<ApiResponse<Visitor>>(`/api/visitor/${id}`, visitor);
    return response.data.data;
  },

  // Delete visitor
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/visitor/${id}`);
  },
};

// Visitor Information API functions
export const visitorInformationApi = {
  // Get all visitor information
  getAll: async (): Promise<VisitorInformation[]> => {
    const response = await apiClient.get<ApiResponse<VisitorInformation[]>>('/api/visitor-information');
    return response.data.data;
  },

  // Get visitor information by ID
  getById: async (id: string): Promise<VisitorInformation> => {
    const response = await apiClient.get<ApiResponse<VisitorInformation>>(`/api/visitor-information/${id}`);
    return response.data.data;
  },

  // Get visitor information by visitor ID
  getByVisitorId: async (visitorId: string): Promise<VisitorInformation[]> => {
    const response = await apiClient.get<ApiResponse<VisitorInformation[]>>(
      `/api/visitor-information/visitor/${visitorId}`
    );
    return response.data.data;
  },

  // Create visitor information
  create: async (visitorId: string, information: Omit<VisitorInformationRequest, 'visitor_id'>): Promise<VisitorInformation> => {
    const response = await apiClient.post<ApiResponse<VisitorInformation>>(
      `/api/visitor-information/visitor/${visitorId}`,
      { ...information, visitor_id: visitorId }
    );
    return response.data.data;
  },

  // Update visitor information
  update: async (id: string, information: VisitorInformationRequest): Promise<VisitorInformation> => {
    const response = await apiClient.put<ApiResponse<VisitorInformation>>(
      `/api/visitor-information/${id}`,
      information
    );
    return response.data.data;
  },

  // Delete visitor information
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/visitor-information/${id}`);
  },
};

// Helper functions
export const formatVisitorForDisplay = (visitor: Visitor): VisitorSimple => ({
  id: visitor.id,
  name: visitor.name,
  ig_username: visitor.ig_username,
  phone_number: visitor.phone_number,
  kabupaten_id: visitor.kabupaten_id,
  kabupaten: visitor.kabupaten,
});

export const getDisplayInfo = (visitor: Visitor) => ({
  whatsapp: visitor.phone_number || '-',
  instagram: visitor.ig_username || '-',
  city: visitor.kabupaten || '-',
});