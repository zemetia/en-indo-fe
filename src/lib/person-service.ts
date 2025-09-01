import apiClient from '@/lib/api';

// Types for API responses
export interface Person {
  id: string;
  nama: string;
  nama_lain: string;
  gender: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  fase_hidup: string;
  status_perkawinan: string;
  nama_pasangan: string;
  pasangan_id: string | null;
  tanggal_perkawinan: string;
  alamat: string;
  nomor_telepon: string;
  email: string;
  ayah: string;
  ibu: string;
  kerinduan: string;
  komitmen_berjemaat: string;
  status: string;
  kode_jemaat: string;
  church_id: string;
  church: string;
  user_id: string | null;
  kabupaten_id: number;
  kabupaten: string;
  life_groups: LifeGroupSimple[];
  pelayanan: PersonPelayanan[];
  created_at: string;
  updated_at: string;
}

export interface SimplePerson {
  id: string;
  nama: string;
  gender: string;
  alamat: string;
  church: string;
  tanggal_lahir: string;
  email: string;
  nomor_telepon: string;
  is_aktif: boolean;
}

export interface PersonRequest {
  nama: string;
  nama_lain?: string;
  gender?: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  fase_hidup?: string;
  status_perkawinan?: string;
  nama_pasangan?: string;
  pasangan_id?: string;
  tanggal_perkawinan?: string;
  alamat?: string;
  nomor_telepon?: string;
  email?: string;
  ayah?: string;
  ibu?: string;
  kerinduan?: string;
  komitmen_berjemaat?: string;
  status?: string;
  kode_jemaat?: string;
  church_id: string;
  user_id?: string;
  kabupaten_id: number;
  life_group_ids?: string[];
}

export interface PersonSearchParams {
  name?: string;
  church_id?: string;
  kabupaten_id?: number;
  user_id?: string;
  page?: number;
  per_page?: number;
}

export interface LifeGroupSimple {
  id: string;
  name: string;
}

export interface PersonPelayanan {
  pelayanan_id: string;
  pelayanan: string;
  church_id: string;
  church_name: string;
  is_pic: boolean;
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

// Person API service functions
export const personService = {
  // Get all persons with pagination and filters
  async getAll(params: PersonSearchParams = {}): Promise<PaginationResponse<SimplePerson>> {
    const searchParams = new URLSearchParams();
    
    // Add search parameters
    if (params.name) searchParams.append('name', params.name);
    if (params.church_id) searchParams.append('church_id', params.church_id);
    if (params.kabupaten_id) searchParams.append('kabupaten_id', params.kabupaten_id.toString());
    if (params.user_id) searchParams.append('user_id', params.user_id);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.per_page) searchParams.append('per_page', params.per_page.toString());
    
    const response = await apiClient.get<ApiResponse<PaginationResponse<SimplePerson>>>(
      `/api/person?${searchParams.toString()}`
    );
    return response.data.data;
  },

  // Get person by ID
  async getById(id: string): Promise<Person> {
    const response = await apiClient.get<ApiResponse<Person>>(`/api/person/${id}`);
    return response.data.data;
  },

  // Create new person
  async create(data: PersonRequest): Promise<void> {
    await apiClient.post('/api/person', data);
  },

  // Update person
  async update(id: string, data: PersonRequest): Promise<void> {
    await apiClient.put(`/api/person/${id}`, data);
  },

  // Delete person
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/person/${id}`);
  },

  // Get simple list for dropdowns (without pagination)
  async getSimpleList(): Promise<SimplePerson[]> {
    const response = await this.getAll({ per_page: 1000 });
    return response.data;
  },
};