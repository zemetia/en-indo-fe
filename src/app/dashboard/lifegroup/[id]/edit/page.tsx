'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FiUsers,
  FiMapPin,
  FiLink,
  FiSave,
  FiArrowLeft,
  FiAlertTriangle,
} from 'react-icons/fi';

import FeaturedCard from '@/components/dashboard/FeaturedCard';
import { lifeGroupApi, type LifeGroup, type CreateLifeGroupData } from '@/lib/lifegroup';
import { getCurrentUserId, getCurrentUserLifegroupPermissions } from '@/lib/helper';
import { useToast } from '@/context/ToastContext';
import apiClient from '@/lib/api';
import LifegroupPICGuard from '@/components/auth/LifegroupPICGuard';

interface User {
  id: string;
  email: string;
  person: {
    id: string;
    nama: string;
    email: string;
  };
}

export default function EditLifeGroupPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [lifeGroup, setLifeGroup] = useState<LifeGroup | null>(null);
  const [formData, setFormData] = useState<CreateLifeGroupData>({
    name: '',
    location: '',
    whatsapp_link: '',
    church_id: '',
  });
  const [users, setUsers] = useState<User[]>([]);
  const [availableChurches, setAvailableChurches] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeForm = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get user's lifegroup permissions
        const permissions = getCurrentUserLifegroupPermissions();
        if (!permissions || permissions.churches.length === 0) {
          setError('Anda tidak memiliki akses sebagai PIC Lifegroup. Silakan hubungi administrator untuk mendapatkan akses.');
          return;
        }

        // Set available churches
        setAvailableChurches(permissions.churches);

        // Fetch lifegroup data and users in parallel
        const [lifeGroupResponse, usersResponse] = await Promise.all([
          lifeGroupApi.getById(params.id),
          apiClient.get('/api/user')
        ]);

        setLifeGroup(lifeGroupResponse);
        setUsers(usersResponse.data);

        // Initialize form data with lifegroup data
        setFormData({
          name: lifeGroupResponse.name,
          location: lifeGroupResponse.location,
          whatsapp_link: lifeGroupResponse.whatsapp_link || '',
          church_id: lifeGroupResponse.church_id,
        });

      } catch (error: any) {
        console.error('Error initializing form:', error);
        
        if (error.response?.status === 401) {
          setError('Sesi Anda telah berakhir. Silakan login kembali.');
        } else if (error.response?.status === 403) {
          setError('Anda tidak memiliki akses untuk mengedit lifegroup ini.');
        } else if (error.response?.status === 404) {
          setError('Lifegroup tidak ditemukan.');
        } else {
          const errorMessage = error.response?.data?.message || 'Gagal memuat data lifegroup';
          setError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    initializeForm();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
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

      // Update the lifegroup
      const updateData = {
        name: formData.name.trim(),
        location: formData.location.trim(),
        whatsapp_link: formData.whatsapp_link?.trim() || undefined,
        church_id: formData.church_id,
      };

      console.log('Updating lifegroup with data:', updateData);
      const result = await lifeGroupApi.update(params.id, updateData);
      console.log('Lifegroup updated successfully:', result);
      
      // Show success message
      showToast('Life group berhasil diperbarui!', 'success');
      
      // Redirect to lifegroup detail or list
      router.push(`/dashboard/lifegroup/${params.id}`);
    } catch (error: any) {
      console.error('Error updating lifegroup:', error);
      
      if (error.response?.status === 401) {
        setError('Sesi Anda telah berakhir. Silakan login kembali.');
      } else if (error.response?.status === 403) {
        setError('Anda tidak memiliki akses untuk mengedit lifegroup ini.');
      } else if (error.response?.status === 422) {
        const validationErrors = error.response?.data?.errors;
        if (validationErrors && typeof validationErrors === 'object') {
          const errorMessages = Object.values(validationErrors).flat();
          setError(errorMessages.join(', '));
        } else {
          setError('Data yang dimasukkan tidak valid.');
        }
      } else {
        const errorMessage = error.response?.data?.message || 'Gagal memperbarui lifegroup. Silakan coba lagi.';
        setError(errorMessage);
      }
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <LifegroupPICGuard>
        <div className='space-y-6 pb-16'>
          <FeaturedCard
            title='Edit Life Group'
            description='Edit informasi life group Anda'
            actionLabel='Kembali ke Detail Life Group'
            gradientFrom='from-emerald-500'
            gradientTo='to-emerald-700'
          />
          <div className='flex justify-center items-center py-10'>
            <div className='w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin'></div>
            <span className='ml-3 text-gray-600'>Memuat data life group...</span>
          </div>
        </div>
      </LifegroupPICGuard>
    );
  }

  if (error && !lifeGroup) {
    return (
      <LifegroupPICGuard>
        <div className='space-y-6 pb-16'>
          <FeaturedCard
            title='Edit Life Group'
            description='Edit informasi life group Anda'
            actionLabel='Kembali ke Detail Life Group'
            gradientFrom='from-emerald-500'
            gradientTo='to-emerald-700'
          />
          <div className='bg-red-50 border border-red-200 rounded-lg p-6 text-center'>
            <FiAlertTriangle className='w-12 h-12 text-red-400 mx-auto mb-4' />
            <h3 className='text-lg font-semibold text-red-800 mb-2'>Terjadi Kesalahan</h3>
            <p className='text-red-600 mb-4'>{error}</p>
            <motion.button
              onClick={() => router.push('/dashboard/lifegroup/kelola')}
              className='px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center mx-auto'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiArrowLeft className='w-4 h-4 mr-2' />
              Kembali ke Kelola Life Group
            </motion.button>
          </div>
        </div>
      </LifegroupPICGuard>
    );
  }

  return (
    <LifegroupPICGuard>
      <div className='space-y-6 pb-16'>
        <FeaturedCard
          title={`Edit Life Group: ${lifeGroup?.name || 'Loading...'}`}
          description='Edit informasi life group Anda'
          actionLabel='Kembali ke Detail Life Group'
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

            {/* Leadership Management Note */}
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
              <h4 className='font-medium text-blue-900 mb-2 flex items-center'>
                <FiUsers className='w-4 h-4 mr-2' />
                Pengelolaan Kepemimpinan
              </h4>
              <p className='text-blue-700 text-sm mb-2'>
                Pemimpin dan Wakil Pemimpin dikelola melalui sistem anggota. Setelah menyimpan perubahan, Anda dapat:
              </p>
              <ul className='text-blue-600 text-sm space-y-1 ml-4'>
                <li>• Menambah anggota baru dengan posisi Leader atau Co-Leader</li>
                <li>• Mengubah posisi anggota yang sudah ada</li>
                <li>• Mengelola struktur kepemimpinan di halaman detail Life Group</li>
              </ul>
            </div>
          </div>

          <div className='mt-8 flex justify-end space-x-4'>
            <motion.button
              type='button'
              onClick={() => router.push(`/dashboard/lifegroup/${params.id}`)}
              className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={saving}
            >
              <FiArrowLeft className='w-4 h-4 mr-2' />
              Kembali
            </motion.button>
            <motion.button
              type='submit'
              className='px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed'
              whileHover={{ scale: saving ? 1 : 1.02 }}
              whileTap={{ scale: saving ? 1 : 0.98 }}
              disabled={saving}
            >
              {saving ? (
                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2'></div>
              ) : (
                <FiSave className='w-4 h-4 mr-2' />
              )}
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </LifegroupPICGuard>
  );
}
