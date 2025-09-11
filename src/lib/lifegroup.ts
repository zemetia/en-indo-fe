import apiClient from './api';

export interface LifeGroup {
  id: string;
  name: string;
  location: string;
  whatsapp_link: string;
  church_id: string;
  church: {
    id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  leader_id: string;
  leader: {
    id: string;
    email: string;
    person: {
      id: string;
      nama: string;
      nama_lain: string;
      email: string;
      nomor_telepon: string;
    };
  };
  co_leader_id?: string;
  co_leader?: {
    id: string;
    email: string;
    person: {
      id: string;
      nama: string;
      nama_lain: string;
      email: string;
      nomor_telepon: string;
    };
  };
  person_members: LifeGroupPersonMember[];
  visitor_members: LifeGroupVisitorMember[];
  // Legacy members for backward compatibility
  members?: LifeGroupMember[];
  created_at: string;
  updated_at: string;
}

// New interfaces matching backend DTOs
export interface LifeGroupPersonMember {
  id: string;
  life_group_id: string;
  person_id: string;
  person: {
    id: string;
    nama: string;
    nama_lain: string;
    email: string;
    nomor_telepon: string;
    alamat: string;
  };
  position: 'LEADER' | 'CO_LEADER' | 'MEMBER';
  is_active: boolean;
  joined_date: string;
}

export interface LifeGroupVisitorMember {
  id: string;
  life_group_id: string;
  visitor_id: string;
  visitor: {
    id: string;
    name: string;
    ig_username?: string;
    phone_number?: string;
    kabupaten_id?: number;
    kabupaten: {
      ID: number;
      Name: string;
      provinsi_id: number;
      Provinsi: any;
      created_at: string;
      updated_at: string;
      deleted_at?: string;
    };
  };
  is_active: boolean;
  joined_date: string;
}

// Legacy interfaces (keeping for backward compatibility)
export interface LifeGroupMember {
  id: string;
  life_group_id: string;
  user_id: string;
  user: {
    id: string;
    email: string;
    person: {
      id: string;
      nama: string;
      nama_lain: string;
      email: string;
      nomor_telepon: string;
    };
  };
  role: 'leader' | 'co_leader' | 'member';
  is_active: boolean;
}

export interface Person {
  id: string;
  nama: string;
  nama_lain: string;
  email: string;
  nomor_telepon: string;
  alamat: string;
}

export interface CreateLifeGroupData {
  name: string;
  location: string;
  whatsapp_link?: string;
  church_id: string;
}

// Request interfaces for member management
export interface AddPersonMemberRequest {
  person_id: string;
  position: 'LEADER' | 'CO_LEADER' | 'MEMBER';
}

export interface UpdatePersonMemberPositionRequest {
  person_id: string;
  position: 'LEADER' | 'CO_LEADER' | 'MEMBER';
}

export interface RemovePersonMemberRequest {
  person_id: string;
}

export interface AddVisitorMemberRequest {
  visitor_id: string;
}

export interface RemoveVisitorMemberRequest {
  visitor_id: string;
}

// Batch operation interfaces
export interface AddPersonMembersBatchRequest {
  person_ids: string[];
}

export interface AddVisitorMembersBatchRequest {
  visitor_ids: string[];
}

export interface BatchOperationResult {
  total_requested: number;
  successful: number;
  failed: number;
  errors?: BatchOperationError[];
}

export interface BatchOperationError {
  id: string;
  error: string;
}

// Legacy interfaces (keeping for backward compatibility)
export interface AddMemberData {
  user_id: string;
  role: 'leader' | 'co_leader' | 'member';
}

export interface RemoveMemberData {
  user_id: string;
}

export interface BatchChurchLifeGroupsResponse {
  church_id: string;
  church_name: string;
  lifegroups: LifeGroup[];
  error?: string;
}

export interface LifeGroupStatistics {
  total_lifegroups: number;
  total_members: number;
  total_person_members: number;
  total_visitor_members: number;
  active_lifegroups: number;
  pending_requests: number;
  this_week_meetings: number;
}

// Helper function to deduplicate lifegroups by ID
export const deduplicateLifeGroups = (lifeGroups: LifeGroup[]): LifeGroup[] => {
  const uniqueLifeGroups = new Map<string, LifeGroup>();
  
  lifeGroups.forEach(lifeGroup => {
    // Keep the first occurrence of each lifegroup ID
    if (!uniqueLifeGroups.has(lifeGroup.id)) {
      uniqueLifeGroups.set(lifeGroup.id, lifeGroup);
    }
  });
  
  return Array.from(uniqueLifeGroups.values());
};

// API functions
export const lifeGroupApi = {
  // Get all lifegroups
  getAll: async (): Promise<LifeGroup[]> => {
    const response = await apiClient.get('/api/lifegroup');
    return response.data;
  },

  // Get lifegroups by church ID (for Daftar - PIC view)
  getByChurch: async (churchId: string): Promise<LifeGroup[]> => {
    const response = await apiClient.get(`/api/lifegroup/church/${churchId}`);
    return response.data;
  },

  // Get lifegroups by user ID (for Kelola - user's lifegroups)
  getByUser: async (userId: string): Promise<LifeGroup[]> => {
    const response = await apiClient.get(`/api/lifegroup/user/${userId}`);
    return response.data;
  },

  // Get user's own lifegroups (only where user is a member, ignoring PIC privileges)
  getMyLifeGroup: async (): Promise<LifeGroup[]> => {
    const response = await apiClient.get('/api/lifegroup/my-lifegroup');
    return response.data;
  },

  // Get lifegroup by ID
  getById: async (id: string): Promise<LifeGroup> => {
    const response = await apiClient.get(`/api/lifegroup/${id}`);
    return response.data;
  },

  // Create new lifegroup
  create: async (data: CreateLifeGroupData): Promise<LifeGroup> => {
    const response = await apiClient.post('/api/lifegroup', data);
    return response.data;
  },

  // Update lifegroup
  update: async (id: string, data: Partial<CreateLifeGroupData>): Promise<LifeGroup> => {
    const response = await apiClient.put(`/api/lifegroup/${id}`, data);
    return response.data;
  },

  // Delete lifegroup
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/lifegroup/${id}`);
  },

  // Person Member Management
  getPersonMembers: async (lifeGroupId: string): Promise<LifeGroupPersonMember[]> => {
    const response = await apiClient.get(`/api/lifegroup/${lifeGroupId}/person-members`);
    return response.data.data;
  },

  addPersonMember: async (lifeGroupId: string, data: AddPersonMemberRequest): Promise<LifeGroupPersonMember> => {
    const response = await apiClient.post(`/api/lifegroup/${lifeGroupId}/person-members`, data);
    return response.data.data;
  },

  addPersonMembersBatch: async (lifeGroupId: string, data: AddPersonMembersBatchRequest): Promise<BatchOperationResult> => {
    const response = await apiClient.post(`/api/lifegroup/${lifeGroupId}/person-members/batch`, data);
    return response.data.data;
  },

  updatePersonMemberPosition: async (lifeGroupId: string, data: UpdatePersonMemberPositionRequest): Promise<LifeGroupPersonMember> => {
    const response = await apiClient.put(`/api/lifegroup/${lifeGroupId}/person-members/position`, data);
    return response.data.data;
  },

  removePersonMember: async (lifeGroupId: string, data: RemovePersonMemberRequest): Promise<void> => {
    await apiClient.delete(`/api/lifegroup/${lifeGroupId}/person-members`, { data });
  },

  getLeadershipStructure: async (lifeGroupId: string): Promise<{ leader?: LifeGroupPersonMember; co_leader?: LifeGroupPersonMember; members: LifeGroupPersonMember[] }> => {
    const response = await apiClient.get(`/api/lifegroup/${lifeGroupId}/leadership-structure`);
    return response.data.data;
  },

  // Visitor Member Management
  getVisitorMembers: async (lifeGroupId: string): Promise<LifeGroupVisitorMember[]> => {
    const response = await apiClient.get(`/api/lifegroup/${lifeGroupId}/visitor-members`);
    return response.data.data;
  },

  addVisitorMember: async (lifeGroupId: string, data: AddVisitorMemberRequest): Promise<LifeGroupVisitorMember> => {
    const response = await apiClient.post(`/api/lifegroup/${lifeGroupId}/visitor-members`, data);
    return response.data.data;
  },

  addVisitorMembersBatch: async (lifeGroupId: string, data: AddVisitorMembersBatchRequest): Promise<BatchOperationResult> => {
    const response = await apiClient.post(`/api/lifegroup/${lifeGroupId}/visitor-members/batch`, data);
    return response.data.data;
  },

  removeVisitorMember: async (lifeGroupId: string, data: RemoveVisitorMemberRequest): Promise<void> => {
    await apiClient.delete(`/api/lifegroup/${lifeGroupId}/visitor-members`, { data });
  },

  // Legacy member management (keeping for backward compatibility)
  addMember: async (lifeGroupId: string, data: AddMemberData): Promise<void> => {
    await apiClient.post(`/api/lifegroup/${lifeGroupId}/add-member`, data);
  },

  removeMember: async (lifeGroupId: string, data: RemoveMemberData): Promise<void> => {
    await apiClient.delete(`/api/lifegroup/${lifeGroupId}/remove-member`, { data });
  },

  getUserRole: async (lifeGroupId: string, userId: string): Promise<{ role: string }> => {
    const response = await apiClient.get(`/api/lifegroup/${lifeGroupId}/user/${userId}/role`);
    return response.data;
  },

  // Get lifegroups from multiple churches in one batch call
  getByMultipleChurches: async (churchIds: string[]): Promise<BatchChurchLifeGroupsResponse[]> => {
    const response = await apiClient.post('/api/lifegroup/batch/churches', {
      church_ids: churchIds
    });
    return response.data;
  },

  // Get statistics for user's accessible lifegroups
  getStatistics: async (): Promise<LifeGroupStatistics> => {
    const response = await apiClient.get('/api/lifegroup/statistics');
    return response.data;
  },

  // Get statistics for specific churches
  getStatisticsByChurches: async (churchIds: string[]): Promise<LifeGroupStatistics> => {
    const response = await apiClient.post('/api/lifegroup/statistics/churches', {
      church_ids: churchIds
    });
    return response.data;
  },
};