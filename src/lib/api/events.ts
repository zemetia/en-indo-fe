import apiClient from '@/lib/api';

// API service for event management
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888') + '/api';

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
  
  // Expected participant counts for planning
  expectedParticipants: number;
  expectedAdults: number;
  expectedYouth: number;
  expectedKids: number;
  
  // Event PIC information
  eventPics?: EventPIC[];
  primaryPic?: EventPIC;
  
  createdAt: string;
  updatedAt: string;
}

export interface EventPIC {
  id: string;
  eventId: string;
  personId: string;
  role: string;
  description?: string;
  isPrimary: boolean;
  startDate: string;
  endDate?: string;
  canEdit: boolean;
  canDelete: boolean;
  canAssignPIC: boolean;
  notifyOnChanges: boolean;
  notifyOnReminders: boolean;
  isActive: boolean;
  assignedBy: string;
  createdAt: string;
  updatedAt: string;
  person?: {
    id: string;
    nama: string;
    email: string;
  };
}

export interface EventPICRole {
  id: string;
  name: string;
  description: string;
  defaultCanEdit: boolean;
  defaultCanDelete: boolean;
  defaultCanAssignPIC: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventPICRequest {
  personId: string;
  role: string;
  description?: string;
  isPrimary?: boolean;
  startDate: string;
  endDate?: string;
  canEdit?: boolean;
  canDelete?: boolean;
  canAssignPIC?: boolean;
  notifyOnChanges?: boolean;
  notifyOnReminders?: boolean;
}

export interface BulkEventPICRequest {
  pics: EventPICRequest[];
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
  eventPics?: EventPICRequest[];
  // Expected participant counts for planning
  expectedParticipants?: number;
  expectedAdults?: number;
  expectedYouth?: number;
  expectedKids?: number;
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
  // Expected participant counts for planning
  expectedParticipants?: number;
  expectedAdults?: number;
  expectedYouth?: number;
  expectedKids?: number;
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

  // EventPIC API Methods
  async getEventPICs(eventId: string): Promise<EventPIC[]> {
    const response = await apiClient.get(`/api/events/${eventId}/pics`);
    return response.data;
  }

  async assignEventPIC(eventId: string, data: EventPICRequest): Promise<EventPIC> {
    const response = await apiClient.post(`/api/events/${eventId}/pics`, data);
    return response.data;
  }

  async bulkAssignEventPICs(eventId: string, data: BulkEventPICRequest): Promise<EventPIC[]> {
    const response = await apiClient.post(`/api/events/${eventId}/pics/bulk`, data);
    return response.data;
  }

  async updateEventPIC(eventId: string, picId: string, data: Partial<EventPICRequest>): Promise<EventPIC> {
    const response = await apiClient.put(`/api/events/${eventId}/pics/${picId}`, data);
    return response.data;
  }

  async removeEventPIC(eventId: string, picId: string): Promise<void> {
    await apiClient.delete(`/api/events/${eventId}/pics/${picId}`);
  }

  async getAvailablePICRoles(): Promise<EventPICRole[]> {
    const response = await apiClient.get('/api/event-pic-roles');
    // Handle both response.data and response.data.data patterns
    const data = response.data?.data || response.data;
    // Ensure we always return an array
    return Array.isArray(data) ? data : [];
  }

  async transferEventPIC(eventId: string, data: {
    fromPersonId: string;
    toPersonId: string;
    transferType: 'replace' | 'add_as_secondary';
    reason?: string;
    effectiveDate?: string;
  }): Promise<void> {
    await apiClient.post(`/api/events/${eventId}/pics/transfer`, data);
  }

  async getEventPICHistory(eventId: string): Promise<any[]> {
    const response = await apiClient.get(`/api/events/${eventId}/pics/history`);
    return response.data;
  }

  async validatePICAssignment(eventId: string, data: EventPICRequest): Promise<{ valid: boolean; message?: string }> {
    const response = await apiClient.post(`/api/events/${eventId}/pics/validate`, data);
    return response.data;
  }
}

// Export singleton instance
export const eventsAPI = new EventsAPI();

// Export individual functions for convenience (with proper this binding)
export const createEvent = (data: CreateEventRequest) => eventsAPI.createEvent(data);
export const getEvent = (id: string) => eventsAPI.getEvent(id);
export const updateEvent = (id: string, data: UpdateEventRequest) => eventsAPI.updateEvent(id, data);
export const deleteEvent = (id: string) => eventsAPI.deleteEvent(id);
export const listEvents = (filters?: EventFilterRequest) => eventsAPI.listEvents(filters);
export const updateRecurringEvent = (id: string, data: UpdateRecurringEventRequest) => eventsAPI.updateRecurringEvent(id, data);
export const deleteOccurrence = (id: string, data: DeleteOccurrenceRequest) => eventsAPI.deleteOccurrence(id, data);
export const getEventOccurrences = (id: string, startDate: string, endDate: string, timezone?: string) => eventsAPI.getEventOccurrences(id, startDate, endDate, timezone);
export const getOccurrencesInRange = (startDate: string, endDate: string, timezone?: string, signal?: AbortSignal) => eventsAPI.getOccurrencesInRange(startDate, endDate, timezone, signal);
export const updateSingleOccurrence = (id: string, data: UpdateOccurrenceRequest) => eventsAPI.updateSingleOccurrence(id, data);
export const updateFutureOccurrences = (id: string, data: UpdateFutureOccurrencesRequest) => eventsAPI.updateFutureOccurrences(id, data);
export const validateRecurrenceRule = (rule: CreateEventRequest['recurrenceRule']) => eventsAPI.validateRecurrenceRule(rule);
export const getNextOccurrence = (id: string, after: string) => eventsAPI.getNextOccurrence(id, after);
export const healthCheck = () => eventsAPI.healthCheck();

// EventPIC methods
export const getEventPICs = (eventId: string) => eventsAPI.getEventPICs(eventId);
export const assignEventPIC = (eventId: string, data: EventPICRequest) => eventsAPI.assignEventPIC(eventId, data);
export const bulkAssignEventPICs = (eventId: string, data: BulkEventPICRequest) => eventsAPI.bulkAssignEventPICs(eventId, data);
export const updateEventPIC = (eventId: string, picId: string, data: Partial<EventPICRequest>) => eventsAPI.updateEventPIC(eventId, picId, data);
export const removeEventPIC = (eventId: string, picId: string) => eventsAPI.removeEventPIC(eventId, picId);
export const getAvailablePICRoles = () => eventsAPI.getAvailablePICRoles();
export const transferEventPIC = (eventId: string, data: { fromPersonId: string; toPersonId: string; transferType: 'replace' | 'add_as_secondary'; reason?: string; effectiveDate?: string; }) => eventsAPI.transferEventPIC(eventId, data);
export const getEventPICHistory = (eventId: string) => eventsAPI.getEventPICHistory(eventId);
export const validatePICAssignment = (eventId: string, data: EventPICRequest) => eventsAPI.validatePICAssignment(eventId, data);