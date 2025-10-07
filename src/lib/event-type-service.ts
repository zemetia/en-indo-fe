import apiClient from '@/lib/api';

// Types for API responses
export interface EventType {
  id: string;
  name: string;
  display_name: string;
  description: string;
  color: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface EventTypeRequest {
  display_name: string;
  description?: string;
  color?: string;
  is_active?: boolean;
  sort_order?: number;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
  count?: number;
}

// Event Type API service functions
export const eventTypeService = {
  // Get all event types
  async getAll(): Promise<EventType[]> {
    const response = await apiClient.get<ApiResponse<EventType[]>>('/api/event-types');
    return response.data.data;
  },

  // Get active event types only
  async getActive(): Promise<EventType[]> {
    const response = await apiClient.get<ApiResponse<EventType[]>>('/api/event-types/active');
    return response.data.data;
  },

  // Get event type by ID
  async getById(id: string): Promise<EventType> {
    const response = await apiClient.get<ApiResponse<EventType>>(`/api/event-types/${id}`);
    return response.data.data;
  },

  // Create new event type
  async create(data: EventTypeRequest): Promise<EventType> {
    const response = await apiClient.post<ApiResponse<EventType>>('/api/event-types', data);
    return response.data.data;
  },

  // Update event type
  async update(id: string, data: EventTypeRequest): Promise<EventType> {
    const response = await apiClient.put<ApiResponse<EventType>>(`/api/event-types/${id}`, data);
    return response.data.data;
  },

  // Delete event type
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/event-types/${id}`);
  },
};
