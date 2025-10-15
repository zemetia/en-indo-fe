import apiClient from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface Visitor {
  id: string;
  name: string;
  ig_username?: string;
  phone_number?: string;
  kabupaten_id?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateVisitorRequest {
  name: string;
  ig_username?: string;
  phone_number?: string;
  kabupaten_id?: number;
}

export interface UpdateVisitorRequest {
  name?: string;
  ig_username?: string;
  phone_number?: string;
  kabupaten_id?: number;
}

export interface VisitorSearchParams {
  name?: string;
  ig_username?: string;
  phone_number?: string;
}

export interface VisitorApiResponse {
  message: string;
  data: Visitor;
}

export interface VisitorsApiResponse {
  message: string;
  data: Visitor[];
}

/**
 * Create a new visitor
 */
export const createVisitor = async (
  data: CreateVisitorRequest
): Promise<Visitor> => {
  const response = await apiClient.post<VisitorApiResponse>(
    `${API_URL}/api/visitor`,
    data
  );
  return response.data.data;
};

/**
 * Get all visitors
 */
export const getAllVisitors = async (): Promise<Visitor[]> => {
  const response = await apiClient.get<VisitorsApiResponse>(
    `${API_URL}/api/visitor`
  );
  return response.data.data;
};

/**
 * Search visitors
 */
export const searchVisitors = async (
  params: VisitorSearchParams
): Promise<Visitor[]> => {
  const queryParams = new URLSearchParams();

  if (params.name) {
    queryParams.append('name', params.name);
  }
  if (params.ig_username) {
    queryParams.append('ig_username', params.ig_username);
  }
  if (params.phone_number) {
    queryParams.append('phone_number', params.phone_number);
  }

  const response = await apiClient.get<VisitorsApiResponse>(
    `${API_URL}/api/visitor/search?${queryParams.toString()}`
  );
  return response.data.data;
};

/**
 * Get a single visitor by ID
 */
export const getVisitor = async (visitorId: string): Promise<Visitor> => {
  const response = await apiClient.get<VisitorApiResponse>(
    `${API_URL}/api/visitor/${visitorId}`
  );
  return response.data.data;
};

/**
 * Update a visitor
 */
export const updateVisitor = async (
  visitorId: string,
  data: UpdateVisitorRequest
): Promise<Visitor> => {
  const response = await apiClient.put<VisitorApiResponse>(
    `${API_URL}/api/visitor/${visitorId}`,
    data
  );
  return response.data.data;
};

/**
 * Delete a visitor
 */
export const deleteVisitor = async (visitorId: string): Promise<void> => {
  await apiClient.delete(`${API_URL}/api/visitor/${visitorId}`);
};
