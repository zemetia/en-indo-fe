import apiClient from '@/lib/api';

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
  
  // Event organizers (penyelenggara)
  churches?: Array<{
    id: string;
    name: string;
    address: string;
    church_code: string;
    phone: string;
    email: string;
    website: string;
    latitude: number;
    longitude: number;
    kabupaten_id: number;
    kabupaten: string;
    provinsi_id: number;
    provinsi: string;
    created_at: string;
    updated_at: string;
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
  // Event organizers (penyelenggara)
  churchIds?: string[];
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
  // Event organizers (penyelenggara)
  churchIds?: string[];
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

class EventsAPI {
  async createEvent(data: CreateEventRequest): Promise<Event> {
    const response = await apiClient.post('/api/events', data);
    return response.data;
  }

  async getEvent(id: string): Promise<Event> {
    const response = await apiClient.get(`/api/events/${id}`);
    return response.data;
  }

  async updateEvent(id: string, data: UpdateEventRequest): Promise<Event> {
    const response = await apiClient.put(`/api/events/${id}`, data);
    return response.data;
  }

  async deleteEvent(id: string): Promise<void> {
    await apiClient.delete(`/api/events/${id}`);
  }

  async listEvents(filters: EventFilterRequest = {}): Promise<EventListResponse> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const query = params.toString();
    const endpoint = query ? `/api/events?${query}` : '/api/events';

    const response = await apiClient.get(endpoint);
    return response.data;
  }

  async updateRecurringEvent(id: string, data: UpdateRecurringEventRequest): Promise<void> {
    await apiClient.put(`/api/events/${id}/series`, data);
  }

  async deleteOccurrence(id: string, data: DeleteOccurrenceRequest): Promise<void> {
    await apiClient.delete(`/api/events/${id}/occurrence`, { data });
  }

  async getEventOccurrences(id: string, startDate: string, endDate: string, timezone?: string): Promise<EventOccurrence[]> {
    const params = new URLSearchParams({
      startDate,
      endDate,
      ...(timezone && { timezone }),
    });

    const response = await apiClient.get(`/api/events/${id}/occurrences?${params}`);
    return response.data;
  }

  async getOccurrencesInRange(startDate: string, endDate: string, timezone?: string, signal?: AbortSignal): Promise<EventOccurrence[]> {
    const params = new URLSearchParams({
      startDate,
      endDate,
      ...(timezone && { timezone }),
    });

    const response = await apiClient.get(`/api/events/occurrences?${params}`, {
      signal,
    });
    return response.data;
  }

  async updateSingleOccurrence(id: string, data: UpdateOccurrenceRequest): Promise<void> {
    await apiClient.put(`/api/events/${id}/occurrence`, data);
  }

  async updateFutureOccurrences(id: string, data: UpdateFutureOccurrencesRequest): Promise<void> {
    await apiClient.put(`/api/events/${id}/future`, data);
  }

  async validateRecurrenceRule(rule: CreateEventRequest['recurrenceRule']): Promise<{ message: string; rule: any }> {
    const response = await apiClient.post('/api/events/validate-recurrence', rule);
    return response.data;
  }

  async getNextOccurrence(id: string, after: string): Promise<{ nextOccurrence: string | null }> {
    const params = new URLSearchParams({ after });
    const response = await apiClient.get(`/api/events/${id}/next?${params}`);
    return response.data;
  }

  async healthCheck(): Promise<{ status: 'ok' | 'error'; message?: string }> {
    try {
      await apiClient.get('/api/events?limit=1');
      return { status: 'ok' };
    } catch (error: any) {
      return {
        status: 'error',
        message: error.response?.status === 0 || !navigator.onLine
          ? 'Backend server tidak dapat diakses'
          : 'Server mengalami masalah'
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

// Event Department types and functions
export interface EventDepartment {
  id: string;
  name: string;
  description: string;
}

export const getEventDepartments = async (eventId: string): Promise<EventDepartment[]> => {
  const response = await apiClient.get(`/api/events/${eventId}/departments`);
  return response.data.data;
};

export const updateEventDepartments = async (eventId: string, departmentIds: string[]): Promise<void> => {
  await apiClient.put(`/api/events/${eventId}/departments`, {
    department_ids: departmentIds,
  });
};