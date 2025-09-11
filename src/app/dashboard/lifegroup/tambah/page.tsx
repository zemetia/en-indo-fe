'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Select from 'react-select';
import {
  FiUsers,
  FiMapPin,
  FiSave,
  FiArrowLeft,
  FiLink,
} from 'react-icons/fi';

import FeaturedCard from '@/components/dashboard/FeaturedCard';
import { lifeGroupApi, type CreateLifeGroupData } from '@/lib/lifegroup';
import { getCurrentUserId, getCurrentUserLifegroupPermissions, getToken } from '@/lib/helper';
import { useToast } from '@/context/ToastContext';
import { personService, type SimplePerson } from '@/lib/person-service';
import apiClient from '@/lib/api';
import LifegroupPICGuard from '@/components/auth/LifegroupPICGuard';


export default function TambahLifeGroupPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [formData, setFormData] = useState<CreateLifeGroupData>({
    name: '',
    location: '',
    whatsapp_link: '',
    church_id: '',
  });
  const [availableChurches, setAvailableChurches] = useState<Array<{ id: string; name: string }>>([]);
  const [availablePersons, setAvailablePersons] = useState<SimplePerson[]>([]);
  const [selectedLeaderId, setSelectedLeaderId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeForm = async () => {
      try {
        // Check if user has valid token first
        const token = getToken();
        console.log('Token check in tambah lifegroup:', token ? 'Token found' : 'No token found'); // Debug log
        
        if (!token) {
          setError('Sesi Anda telah berakhir. Silakan login kembali.');
          console.error('No authentication token found');
          return;
        }

        // Get user's lifegroup permissions
        const permissions = getCurrentUserLifegroupPermissions();
        console.log('User lifegroup permissions for form:', permissions); // Debug log
        
        if (!permissions || permissions.churches.length === 0) {
          setError('Anda tidak memiliki akses sebagai PIC Lifegroup. Silakan hubungi administrator untuk mendapatkan akses.');
          console.error('User is not PIC of any lifegroup pelayanan');
          return;
        }

        // Set available churches
        setAvailableChurches(permissions.churches);
        
        // Set default church if only one available
        if (permissions.churches.length === 1) {
          setFormData(prev => ({ ...prev, church_id: permissions.churches[0].id }));
        }
        
        // Load available persons for leader selection
        const persons = await personService.getPersonsByPICLifegroupChurches();
        setAvailablePersons(persons);
      } catch (error: any) {
        console.error('Error initializing form:', error);
        console.error('Error response:', error.response); // Additional debug log
        
        if (error.response?.status === 401) {
          setError('Sesi Anda telah berakhir. Silakan login kembali.');
        } else if (error.response?.status === 500 && error.response?.data?.message?.includes('token')) {
          setError('Token tidak valid. Silakan login kembali.');
        } else {
          const errorMessage = error.response?.data?.message || 'Gagal memuat data';
          showToast(errorMessage, 'error');
          setError(errorMessage);
        }
      }
    };

    initializeForm();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Check if user has valid token first
      const token = getToken();
      console.log('Token check in submit:', token ? 'Token found' : 'No token found'); // Debug log
      
      if (!token) {
        setError('Sesi Anda telah berakhir. Silakan login kembali.');
        console.error('No authentication token found during submit');
        return;
      }

      // Validate required fields
      if (!formData.name.trim()) {
        setError('Nama life group wajib diisi.');
        return;
      }
      if (!formData.location.trim()) {
        setError('Lokasi wajib diisi.');
        return;
      }
      if (!formData.church_id) {
        setError('Gereja wajib dipilih.');
        return;
      }
      if (!selectedLeaderId) {
        setError('Leader wajib dipilih.');
        return;
      }

      // Create the lifegroup
      const lifeGroupData = {
        name: formData.name.trim(),
        location: formData.location.trim(),
        whatsapp_link: formData.whatsapp_link?.trim() || undefined,
        church_id: formData.church_id,
      };

      console.log('Creating lifegroup with data:', lifeGroupData); // Debug log
      const result = await lifeGroupApi.create(lifeGroupData);
      console.log('Lifegroup created successfully:', result); // Debug log
      
      // Add the selected leader as a member with LEADER position
      if (selectedLeaderId) {
        try {
          await lifeGroupApi.addPersonMember(result.id, {
            person_id: selectedLeaderId,
            position: 'LEADER'
          });
          console.log('Leader added successfully to lifegroup'); // Debug log
        } catch (leaderError: any) {
          console.error('Error adding leader to lifegroup:', leaderError);
          // Don't fail the whole process if leader addition fails
          showToast('Life group berhasil dibuat, tetapi gagal menambahkan leader. Silakan tambahkan leader secara manual.', 'warning');
          router.push('/dashboard/lifegroup/daftar');
          return;
        }
      }
      
      // Show success message
      showToast('Life group berhasil dibuat!', 'success');
      
      // Success - redirect to daftar lifegroup
      router.push('/dashboard/lifegroup/daftar');
    } catch (error: any) {
      console.error('Error creating lifegroup:', error);
      console.error('Error response in submit:', error.response); // Additional debug log
      
      if (error.response?.status === 401) {
        setError('Sesi Anda telah berakhir. Silakan login kembali.');
      } else if (error.response?.status === 403) {
        setError('Anda tidak memiliki akses untuk membuat lifegroup.');
      } else if (error.response?.status === 500 && error.response?.data?.message?.includes('token')) {
        setError('Token tidak valid. Silakan login kembali.');
      } else if (error.response?.status === 422) {
        const validationErrors = error.response?.data?.errors;
        if (validationErrors && typeof validationErrors === 'object') {
          const errorMessages = Object.values(validationErrors).flat();
          setError(errorMessages.join(', '));
        } else {
          setError('Data yang dimasukkan tidak valid.');
        }
      } else {
        const errorMessage = error.response?.data?.message || 'Gagal membuat lifegroup. Silakan coba lagi.';
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? '' : value,
    }));
  };

  return (
    <LifegroupPICGuard>
      <div className='space-y-6 pb-16'>
        <FeaturedCard
          title='Buat Life Group Baru'
          description='Buat life group baru dan kemudian tambahkan anggota serta atur pemimpin'
          actionLabel='Kembali ke Daftar Life Group'
          gradientFrom='from-emerald-500'
          gradientTo='to-emerald-700'
        />

      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
          {error}
        </div>
      )}

      <motion.form
        onSubmit={handleSubmit}
        className='bg-white rounded-xl shadow-md p-6 border border-emerald-50'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className='space-y-6'>
          {/* Church Selection */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Gereja *
            </label>
            {availableChurches.length > 1 ? (
              <select
                name='church_id'
                value={formData.church_id}
                onChange={handleChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                required
              >
                <option value=''>Pilih gereja</option>
                {availableChurches.map((church) => (
                  <option key={church.id} value={church.id}>
                    {church.name}
                  </option>
                ))}
              </select>
            ) : availableChurches.length === 1 ? (
              <div className='w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700'>
                {availableChurches[0].name}
              </div>
            ) : (
              <div className='w-full px-3 py-2 bg-red-50 border border-red-300 rounded-lg text-red-600'>
                Tidak ada gereja yang tersedia
              </div>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Nama Life Group *
            </label>
            <input
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
              required
              placeholder='Masukkan nama life group'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Lokasi *
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <FiMapPin className='h-5 w-5 text-gray-400' />
              </div>
              <input
                type='text'
                name='location'
                value={formData.location}
                onChange={handleChange}
                className='w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                required
                placeholder='Contoh: Jl. Sudirman No. 10, Jakarta'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Leader *
            </label>
            <Select
              options={availablePersons.map(person => ({
                value: person.id,
                label: `${person.nama} - ${person.church}`,
              }))}
              value={selectedLeaderId ? {
                value: selectedLeaderId,
                label: availablePersons.find(p => p.id === selectedLeaderId)?.nama + ' - ' + availablePersons.find(p => p.id === selectedLeaderId)?.church || '',
              } : null}
              onChange={(selected) => {
                setSelectedLeaderId(selected?.value || '');
              }}
              placeholder="Pilih leader..."
              isSearchable
              isClearable
              className="react-select-container"
              classNamePrefix="react-select"
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  borderColor: state.isFocused ? '#10b981' : '#d1d5db',
                  boxShadow: state.isFocused ? '0 0 0 2px rgba(16, 185, 129, 0.2)' : 'none',
                  '&:hover': {
                    borderColor: '#10b981',
                  },
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isFocused ? '#ecfdf5' : 'white',
                  color: state.isFocused ? '#065f46' : '#1f2937',
                }),
              }}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              WhatsApp Link
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <FiLink className='h-5 w-5 text-gray-400' />
              </div>
              <input
                type='url'
                name='whatsapp_link'
                value={formData.whatsapp_link}
                onChange={handleChange}
                placeholder='https://chat.whatsapp.com/...'
                className='w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
              />
            </div>
          </div>

        </div>

        <div className='mt-8 flex justify-end space-x-4'>
          <motion.button
            type='button'
            onClick={() => router.push('/dashboard/lifegroup/kelola')}
            className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            <FiArrowLeft className='w-4 h-4 mr-2' />
            Kembali
          </motion.button>
          <motion.button
            type='submit'
            className='px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed'
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            disabled={loading}
          >
            {loading ? (
              <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2'></div>
            ) : (
              <FiSave className='w-4 h-4 mr-2' />
            )}
            {loading ? 'Menyimpan...' : 'Simpan'}
          </motion.button>
        </div>
      </motion.form>
      </div>
    </LifegroupPICGuard>
  );
}
