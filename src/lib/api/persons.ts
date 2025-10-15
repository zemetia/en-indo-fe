import apiClient from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface Person {
  id: string;
  nama: string;
  email: string;
  nomorTelepon: string;
  alamat?: string;
  tanggalLahir?: string;
  jenisKelamin?: 'male' | 'female';
  statusPernikahan?: string;
  pekerjaan?: string;
  churchId: string;
  lifeGroupId?: string;
  departmentIds?: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Get all persons
 */
export const getAllPersons = async (): Promise<Person[]> => {
  const response = await apiClient.get(`${API_URL}/api/person?all=true`);
  return response.data.data || response.data;
};

/**
 * Get person by ID
 */
export const getPersonById = async (id: string): Promise<Person> => {
  const response = await apiClient.get(`${API_URL}/person/${id}`);
  return response.data;
};
