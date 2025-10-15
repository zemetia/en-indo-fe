import apiClient from '@/lib/api';

// API service for availability management
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888') + '/api';

export interface KetersediaanStatus {
  status: 'available' | 'unavailable' | 'tentative';
}

export interface CreateKetersediaanRequest {
  personId: string;
  eventId: string;
  occurrenceDate: string; // YYYY-MM-DD format
  status: 'available' | 'unavailable' | 'tentative';
  notes?: string;
}

export interface UpdateKetersediaanRequest {
  status?: 'available' | 'unavailable' | 'tentative';
  notes?: string;
}

export interface BulkCreateKetersediaanRequest {
  availabilities: CreateKetersediaanRequest[];
}

export interface KetersediaanResponse {
  id: string;
  personId: string;
  personName: string;
  eventId: string;
  eventTitle: string;
  occurrenceDate: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  event?: any;
  person?: {
    id: string;
    nama: string;
    email: string;
  };
}

export interface GetKetersediaanRequest {
  personId?: string;
  eventId?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface KetersediaanListResponse {
  availabilities: KetersediaanResponse[];
  totalCount: number;
  page: number;
  limit: number;
}

export interface EventAvailabilitySummaryResponse {
  eventId: string;
  eventTitle: string;
  occurrenceDate: string;
  totalResponses: number;
  available: number;
  unavailable: number;
  tentative: number;
  responses?: KetersediaanResponse[];
}

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public isNetworkError: boolean = false
  ) {
    super(message);
    this.name = 'APIError';
  }
}

class AvailabilityAPI {
  private async request<T>(
    endpoint: string,
    options?: RequestInit,
    maxRetries = 3,
    backoffMs = 1000
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    let lastError: APIError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
          },
          ...options,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({
            message: response.status === 0 ? 'Network connection failed' : 'Unknown error',
          }));

          const apiError = new APIError(
            errorData.message || `HTTP ${response.status}: ${response.statusText}`,
            response.status,
            errorData.code,
            response.status === 0 || !navigator.onLine
          );

          // Don't retry for client errors (4xx)
          if (response.status >= 400 && response.status < 500 && response.status !== 408) {
            throw apiError;
          }

          throw apiError;
        }

        // Handle 204 No Content responses
        if (response.status === 204) {
          return null as T;
        }

        return response.json();
      } catch (error) {
        const isNetworkError = error instanceof TypeError && error.message.includes('fetch');
        const apiError =
          error instanceof APIError
            ? error
            : new APIError(
                isNetworkError
                  ? 'Backend server tidak dapat diakses. Pastikan server backend berjalan di http://localhost:8888'
                  : error instanceof Error
                  ? error.message
                  : 'Unknown error occurred',
                undefined,
                undefined,
                isNetworkError
              );

        lastError = apiError;

        // Don't retry for client errors
        if (apiError.status && apiError.status >= 400 && apiError.status < 500 && apiError.status !== 408) {
          throw apiError;
        }

        // If this is the last attempt, throw the error
        if (attempt === maxRetries) {
          throw apiError;
        }

        // Wait before retrying with exponential backoff
        const delay = backoffMs * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  async createKetersediaan(data: CreateKetersediaanRequest): Promise<KetersediaanResponse> {
    return this.request<KetersediaanResponse>('/ketersediaan', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async upsertKetersediaan(data: CreateKetersediaanRequest): Promise<KetersediaanResponse> {
    return this.request<KetersediaanResponse>('/ketersediaan/upsert', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getKetersediaan(id: string): Promise<KetersediaanResponse> {
    return this.request<KetersediaanResponse>(`/ketersediaan/${id}`);
  }

  async updateKetersediaan(id: string, data: UpdateKetersediaanRequest): Promise<KetersediaanResponse> {
    return this.request<KetersediaanResponse>(`/ketersediaan/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteKetersediaan(id: string): Promise<void> {
    return this.request<void>(`/ketersediaan/${id}`, {
      method: 'DELETE',
    });
  }

  async getPersonAvailability(params: GetKetersediaanRequest): Promise<KetersediaanListResponse> {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const query = searchParams.toString();
    const endpoint = query ? `/ketersediaan?${query}` : '/ketersediaan';

    return this.request<KetersediaanListResponse>(endpoint);
  }

  async getEventAvailability(eventId: string, occurrenceDate?: string): Promise<KetersediaanResponse[]> {
    const params = new URLSearchParams();
    if (occurrenceDate) {
      params.append('occurrenceDate', occurrenceDate);
    }

    const query = params.toString();
    const endpoint = query ? `/events/${eventId}/availability?${query}` : `/events/${eventId}/availability`;

    return this.request<KetersediaanResponse[]>(endpoint);
  }

  async bulkCreateKetersediaan(data: BulkCreateKetersediaanRequest): Promise<KetersediaanResponse[]> {
    return this.request<KetersediaanResponse[]>('/ketersediaan/bulk', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getEventAvailabilitySummary(eventId: string, occurrenceDate: string): Promise<EventAvailabilitySummaryResponse> {
    const params = new URLSearchParams({
      eventId,
      occurrenceDate,
    });

    return this.request<EventAvailabilitySummaryResponse>(`/ketersediaan/summary?${params}`);
  }
}

// Export singleton instance
export const availabilityAPI = new AvailabilityAPI();

// Export individual functions for convenience
export const createKetersediaan = (data: CreateKetersediaanRequest) => availabilityAPI.createKetersediaan(data);
export const upsertKetersediaan = (data: CreateKetersediaanRequest) => availabilityAPI.upsertKetersediaan(data);
export const getKetersediaan = (id: string) => availabilityAPI.getKetersediaan(id);
export const updateKetersediaan = (id: string, data: UpdateKetersediaanRequest) => availabilityAPI.updateKetersediaan(id, data);
export const deleteKetersediaan = (id: string) => availabilityAPI.deleteKetersediaan(id);
export const getPersonAvailability = (params: GetKetersediaanRequest) => availabilityAPI.getPersonAvailability(params);
export const getEventAvailability = (eventId: string, occurrenceDate?: string) => availabilityAPI.getEventAvailability(eventId, occurrenceDate);
export const bulkCreateKetersediaan = (data: BulkCreateKetersediaanRequest) => availabilityAPI.bulkCreateKetersediaan(data);
export const getEventAvailabilitySummary = (eventId: string, occurrenceDate: string) => availabilityAPI.getEventAvailabilitySummary(eventId, occurrenceDate);
