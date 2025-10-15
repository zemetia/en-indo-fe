import apiClient from '@/lib/api';

export interface EventParticipant {
  id: string;
  eventId: string;
  eventTitle?: string;
  occurrenceDate: string;
  participantType: 'person' | 'visitor';
  participantId: string;
  participantDetails: ParticipantDetails;
  registrationStatus: 'registered' | 'attended' | 'cancelled' | 'no_show';
  attendanceStatus: 'present' | 'absent' | 'excused';
  checkInTime?: string;
  checkOutTime?: string;
  checkInMethod?: 'qr_scan' | 'manual' | 'nfc' | 'self_checkin';
  qrScanTimestamp?: string;
  notes?: string;
  recordedBy?: string;
  recordedByDetails?: PersonSummary;
  createdAt: string;
  updatedAt: string;
}

export interface ParticipantDetails {
  type: 'person' | 'visitor';
  person?: PersonSummary;
  visitor?: VisitorSummary;
}

export interface PersonSummary {
  id: string;
  nama: string;
  email: string;
  nomorTelepon: string;
  churchId: string;
}

export interface VisitorSummary {
  id: string;
  name: string;
  phoneNumber?: string;
  igUsername?: string;
}

export interface AttendanceStats {
  totalRegistered: number;
  totalPresent: number;
  totalAbsent: number;
  totalExcused: number;
  totalCancelled: number;
  totalNoShow: number;
  attendanceRate: number;
}

export interface EventParticipantListResponse {
  participants: EventParticipant[];
  totalCount: number;
  page: number;
  limit: number;
  stats: AttendanceStats;
}

export interface AttendanceReportResponse {
  eventId: string;
  eventTitle: string;
  occurrenceDate: string;
  stats: AttendanceStats;
  participants: EventParticipant[];
  generatedAt: string;
}

export interface CreateEventParticipantRequest {
  eventId: string;
  occurrenceDate: string;
  participantType: 'person' | 'visitor';
  participantId: string;
  notes?: string;
}

export interface BulkRegisterParticipantsRequest {
  eventId: string;
  occurrenceDate: string;
  personIds?: string[];
  visitorIds?: string[];
}

export interface UpdateEventParticipantRequest {
  registrationStatus?: 'registered' | 'attended' | 'cancelled' | 'no_show';
  attendanceStatus?: 'present' | 'absent' | 'excused';
  notes?: string;
}

export interface CheckInParticipantRequest {
  checkInMethod: 'qr_scan' | 'manual' | 'nfc' | 'self_checkin';
  recordedBy?: string;
  notes?: string;
  qrScanTimestamp?: string; // ISO timestamp from QR code
}

export interface BulkCheckInRequest {
  eventId: string;
  occurrenceDate: string;
  participantIds: string[];
  checkInMethod: 'qr_scan' | 'manual' | 'nfc' | 'self_checkin';
  recordedBy?: string;
}

/**
 * Register a single participant for an event
 */
export const registerParticipant = async (
  data: CreateEventParticipantRequest
): Promise<EventParticipant> => {
  const response = await apiClient.post(
    `/api/event-participants`,
    data
  );
  return response.data;
};

/**
 * Bulk register multiple participants for an event
 */
export const bulkRegisterParticipants = async (
  data: BulkRegisterParticipantsRequest
): Promise<EventParticipant[]> => {
  const response = await apiClient.post(
    `/api/event-participants/bulk`,
    data
  );
  return response.data;
};

/**
 * Update a participant's information
 */
export const updateParticipant = async (
  participantId: string,
  data: UpdateEventParticipantRequest
): Promise<EventParticipant> => {
  const response = await apiClient.put(
    `/api/event-participants/${participantId}`,
    data
  );
  return response.data;
};

/**
 * Delete a participant from an event
 */
export const deleteParticipant = async (
  participantId: string
): Promise<void> => {
  await apiClient.delete(`/api/event-participants/${participantId}`);
};

/**
 * Get a single participant by ID
 */
export const getParticipant = async (
  participantId: string
): Promise<EventParticipant> => {
  const response = await apiClient.get(
    `/api/event-participants/${participantId}`
  );
  return response.data;
};

/**
 * Get all participants for a specific event occurrence
 */
export const getEventParticipants = async (
  eventId: string,
  occurrenceDate: string,
  filters?: {
    participantType?: 'person' | 'visitor';
    registrationStatus?: string;
    attendanceStatus?: string;
    page?: number;
    limit?: number;
  }
): Promise<EventParticipantListResponse> => {
  const params = new URLSearchParams({ date: occurrenceDate });

  if (filters?.participantType) {
    params.append('participantType', filters.participantType);
  }
  if (filters?.registrationStatus) {
    params.append('registrationStatus', filters.registrationStatus);
  }
  if (filters?.attendanceStatus) {
    params.append('attendanceStatus', filters.attendanceStatus);
  }
  if (filters?.page) {
    params.append('page', filters.page.toString());
  }
  if (filters?.limit) {
    params.append('limit', filters.limit.toString());
  }

  const response = await apiClient.get(
    `/api/events/${eventId}/participants?${params.toString()}`
  );
  return response.data;
};

/**
 * Check in a single participant
 */
export const checkInParticipant = async (
  participantId: string,
  data: CheckInParticipantRequest
): Promise<EventParticipant> => {
  const response = await apiClient.post(
    `/api/event-participants/${participantId}/checkin`,
    data
  );
  return response.data;
};

/**
 * Bulk check in multiple participants
 */
export const bulkCheckIn = async (
  data: BulkCheckInRequest
): Promise<EventParticipant[]> => {
  const response = await apiClient.post(
    `/api/event-participants/checkin/bulk`,
    data
  );
  return response.data;
};

/**
 * Get attendance report for an event occurrence
 */
export const getAttendanceReport = async (
  eventId: string,
  occurrenceDate: string
): Promise<AttendanceReportResponse> => {
  const params = new URLSearchParams({ date: occurrenceDate });
  const response = await apiClient.get(
    `/api/events/${eventId}/attendance/report?${params.toString()}`
  );
  return response.data;
};

/**
 * List all participants with filters
 */
export const listParticipants = async (filters?: {
  eventId?: string;
  date?: string;
  participantType?: 'person' | 'visitor';
  page?: number;
  limit?: number;
}): Promise<EventParticipantListResponse> => {
  const params = new URLSearchParams();

  if (filters?.eventId) {
    params.append('eventId', filters.eventId);
  }
  if (filters?.date) {
    params.append('date', filters.date);
  }
  if (filters?.participantType) {
    params.append('participantType', filters.participantType);
  }
  if (filters?.page) {
    params.append('page', filters.page.toString());
  }
  if (filters?.limit) {
    params.append('limit', filters.limit.toString());
  }

  const response = await apiClient.get(
    `/api/participants?${params.toString()}`
  );
  return response.data;
};

export interface QRScanCheckInRequest {
  eventId: string;
  occurrenceDate: string; // Format: YYYY-MM-DD
}

export interface QRScanCheckInResponse {
  status: 'not_participant' | 'success' | 'already_checked_in';
  message: string;
  eventTitle?: string;
  checkInTime?: string;
  participant?: EventParticipant;
}

/**
 * Check in via QR scan (uses person_id from JWT token)
 */
export const scanQRCheckIn = async (
  eventId: string,
  occurrenceDate: string
): Promise<QRScanCheckInResponse> => {
  const response = await apiClient.post(
    `/api/event-participants/scan-qr`,
    {
      eventId,
      occurrenceDate,
    }
  );
  return response.data;
};
