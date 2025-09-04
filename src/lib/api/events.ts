// API service for event management
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888/api/v1';

export interface EventOccurrence {
  eventId: string;
  occurrenceDate: string;
  startDatetime: string;
  endDatetime: string;
  isException: boolean;
  isSkipped: boolean;
  exceptionNotes?: string;
  originalEvent: {
    id: string;
    title: string;
    description: string;
    type: 'event' | 'ibadah' | 'spiritual_journey';
    eventLocation: string;
    capacity: number;
    isPublic: boolean;
    recurrenceRule?: {
      id: string;
      frequency: string;
      interval: number;
      byWeekday: string[];
      byMonthDay: number[];
      byMonth: number[];
      bySetPos?: number[];
      weekStart?: string;
      byYearDay?: number[];
      count?: number;
      until?: string;
    };
  };
}

export interface Event {
  id: string;
  title: string;
  bannerImage?: string;
  description: string;
  capacity: number;
  type: 'event' | 'ibadah' | 'spiritual_journey';
  eventDate: string;
  eventLocation: string;
  startDatetime: string;
  endDatetime: string;
  allDay: boolean;
  timezone: string;
  isPublic: boolean;
  discipleshipJourneyId?: string;
  recurrenceRule?: {
    id: string;
    frequency: string;
    interval: number;
    byWeekday: string[];
    byMonthDay: number[];
    byMonth: number[];
    bySetPos?: number[];
    weekStart?: string;
    byYearDay?: number[];
    count?: number;
    until?: string;
  };
  lagu?: Array<{
    id: string;
    title: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventRequest {
  title: string;
  bannerImage?: string;
  description?: string;
  capacity?: number;
  type: 'event' | 'ibadah' | 'spiritual_journey';
  eventDate: string;
  eventLocation: string;
  startTime: string;
  endTime: string;
  allDay?: boolean;
  timezone: string;
  isPublic?: boolean;
  discipleshipJourneyId?: string;
  recurrenceRule?: {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
    interval?: number;
    byWeekday?: string[];
    byMonthDay?: number[];
    byMonth?: number[];
    bySetPos?: number[];
    weekStart?: string;
    byYearDay?: number[];
    count?: number;
    until?: string;
  };
  laguIds?: string[];
}

export interface UpdateEventRequest {
  title?: string;
  bannerImage?: string;
  description?: string;
  capacity?: number;
  type?: 'event' | 'ibadah' | 'spiritual_journey';
  eventDate?: string;
  eventLocation?: string;
  startTime?: string;
  endTime?: string;
  allDay?: boolean;
  timezone?: string;
  isPublic?: boolean;
  discipleshipJourneyId?: string;
  laguIds?: string[];
}

export type RecurrenceUpdateType = 'single' | 'all' | 'future';

export interface UpdateRecurringEventRequest {
  updateType: RecurrenceUpdateType;
  occurrenceDate?: string;
  startTime?: string;
  endTime?: string;
  event: UpdateEventRequest;
}

export interface UpdateOccurrenceRequest {
  occurrenceDate: string;
  startTime?: string;
  endTime?: string;
  event: UpdateEventRequest;
}

export interface UpdateFutureOccurrencesRequest {
  fromDate: string;
  startTime?: string;
  endTime?: string;
  event: UpdateEventRequest;
  recurrenceRule?: {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
    interval?: number;
    byWeekday?: string[];
    byMonthDay?: number[];
    byMonth?: number[];
    bySetPos?: number[];
    weekStart?: string;
    byYearDay?: number[];
    count?: number;
    until?: string;
  };
}

export interface DeleteOccurrenceRequest {
  occurrenceDate: string;
  deleteType: 'single' | 'future';
}

export interface EventListResponse {
  events: Event[];
  totalCount: number;
  page: number;
  limit: number;
}

export interface EventFilterRequest {
  type?: string;
  isPublic?: boolean;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
  timezone?: string;
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

class EventsAPI {
  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async request<T>(
    endpoint: string, 
    options?: RequestInit,
    maxRetries = 3,
    backoffMs = 1000,
    signal?: AbortSignal
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
          signal,
          ...options,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ 
            message: response.status === 0 ? 'Network connection failed' : 'Unknown error' 
          }));
          
          const apiError = new APIError(
            errorData.message || `HTTP ${response.status}: ${response.statusText}`,
            response.status,
            errorData.code,
            response.status === 0 || !navigator.onLine
          );
          
          // Don't retry for client errors (4xx) except for specific cases
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
        const apiError = error instanceof APIError ? error : new APIError(
          isNetworkError ? 'Backend server tidak dapat diakses. Pastikan server backend berjalan di http://localhost:8888' : 
          error instanceof Error ? error.message : 'Unknown error occurred',
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
        console.warn(`API request failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms:`, apiError.message);
        await this.sleep(delay);
      }
    }
    
    throw lastError!;
  }

  async createEvent(data: CreateEventRequest): Promise<Event> {
    return this.request<Event>('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getEvent(id: string): Promise<Event> {
    return this.request<Event>(`/events/${id}`);
  }

  async updateEvent(id: string, data: UpdateEventRequest): Promise<Event> {
    return this.request<Event>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEvent(id: string): Promise<void> {
    return this.request<void>(`/events/${id}`, {
      method: 'DELETE',
    });
  }

  async listEvents(filters: EventFilterRequest = {}): Promise<EventListResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const query = params.toString();
    const endpoint = query ? `/events?${query}` : '/events';
    
    return this.request<EventListResponse>(endpoint);
  }

  async updateRecurringEvent(id: string, data: UpdateRecurringEventRequest): Promise<void> {
    return this.request<void>(`/events/${id}/series`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteOccurrence(id: string, data: DeleteOccurrenceRequest): Promise<void> {
    return this.request<void>(`/events/${id}/occurrence`, {
      method: 'DELETE',
      body: JSON.stringify(data),
    });
  }

  async getEventOccurrences(id: string, startDate: string, endDate: string, timezone?: string): Promise<EventOccurrence[]> {
    const params = new URLSearchParams({
      startDate,
      endDate,
      ...(timezone && { timezone }),
    });

    return this.request<EventOccurrence[]>(`/events/${id}/occurrences?${params}`);
  }

  async getOccurrencesInRange(startDate: string, endDate: string, timezone?: string, signal?: AbortSignal): Promise<EventOccurrence[]> {
    const params = new URLSearchParams({
      startDate,
      endDate,
      ...(timezone && { timezone }),
    });

    return this.request<EventOccurrence[]>(`/events/occurrences?${params}`, {}, 3, 1000, signal);
  }

  async updateSingleOccurrence(id: string, data: UpdateOccurrenceRequest): Promise<void> {
    return this.request<void>(`/events/${id}/occurrence`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateFutureOccurrences(id: string, data: UpdateFutureOccurrencesRequest): Promise<void> {
    return this.request<void>(`/events/${id}/future`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async validateRecurrenceRule(rule: CreateEventRequest['recurrenceRule']): Promise<{ message: string; rule: any }> {
    return this.request<{ message: string; rule: any }>('/events/validate-recurrence', {
      method: 'POST',
      body: JSON.stringify(rule),
    });
  }

  async getNextOccurrence(id: string, after: string): Promise<{ nextOccurrence: string | null }> {
    const params = new URLSearchParams({ after });
    return this.request<{ nextOccurrence: string | null }>(`/events/${id}/next?${params}`);
  }

  async healthCheck(): Promise<{ status: 'ok' | 'error'; message?: string }> {
    try {
      // Simple ping to the backend - you might want to create a dedicated health endpoint
      await this.request<any>('/events?limit=1', { method: 'GET' }, 1, 500); // Only 1 retry, faster timeout
      return { status: 'ok' };
    } catch (error) {
      const apiError = error as APIError;
      return { 
        status: 'error', 
        message: apiError.isNetworkError ? 
          'Backend server tidak dapat diakses' : 
          'Server mengalami masalah' 
      };
    }
  }
}

// Export singleton instance
export const eventsAPI = new EventsAPI();

// Export individual functions for convenience
export const {
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent,
  listEvents,
  updateRecurringEvent,
  deleteOccurrence,
  getEventOccurrences,
  getOccurrencesInRange,
  updateSingleOccurrence,
  updateFutureOccurrences,
  validateRecurrenceRule,
  getNextOccurrence,
  healthCheck,
} = eventsAPI;