'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BsPersonPlus } from 'react-icons/bs';
import { FiSave, FiArrowLeft } from 'react-icons/fi';

import FeaturedCard from '@/components/dashboard/FeaturedCard';
import { visitorApi, type VisitorRequest, type VisitorFormData } from '@/lib/visitor-service';
import { getToken } from '@/lib/helper';
import { ProvinceDistrictSelect } from '@/components/ui/province-district-select';

export default function TambahTamuPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState<VisitorFormData>({
    name: '',
    ig_username: '',
    phone_number: '',
    kabupaten_id: undefined,
    provinsi_id: undefined,
  });

  const handleInputChange = (field: keyof VisitorFormData, value: string | number | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Nama tamu harus diisi.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) {
        setError('Token autentikasi tidak ditemukan. Silakan login kembali.');
        return;
      }

      // Clean up empty strings to undefined for nullable fields
      const cleanedData: VisitorRequest = {
        name: formData.name.trim(),
        ig_username: formData.ig_username?.trim() || undefined,
        phone_number: formData.phone_number?.trim() || undefined,
        kabupaten_id: formData.kabupaten_id || undefined,
      };

      const newVisitor = await visitorApi.create(cleanedData);
      router.push(`/dashboard/tamu/${newVisitor.id}`);
    } catch (error) {
      console.error('Failed to create visitor:', error);
      setError('Gagal membuat data tamu. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-6'>
      <FeaturedCard
        title='Tambah Tamu Baru'
        description='Tambahkan data tamu dan pengunjung gereja'
        actionLabel='Kembali ke Daftar Tamu'
        gradientFrom='from-green-500'
        gradientTo='to-green-700'
        onAction={() => router.push('/dashboard/tamu')}
      />

      <div className='max-w-2xl mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-white rounded-xl shadow-sm p-6 border border-gray-200'
        >
          <div className='flex items-center space-x-3 mb-6'>
            <div className='w-10 h-10 rounded-full bg-green-100 flex items-center justify-center'>
              <BsPersonPlus className='w-5 h-5 text-green-600' />
            </div>
            <div>
              <h2 className='text-xl font-semibold text-gray-900'>Form Data Tamu</h2>
              <p className='text-sm text-gray-500'>Isi formulir di bawah untuk menambah data tamu baru</p>
            </div>
          </div>

          {error && (
            <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg'>
              <p className='text-red-700 text-sm'>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Nama Lengkap *
              </label>
              <input
                type='text'
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder='Masukkan nama lengkap tamu'
                className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Username Instagram
              </label>
              <input
                type='text'
                value={formData.ig_username || ''}
                onChange={(e) => handleInputChange('ig_username', e.target.value)}
                placeholder='Contoh: john_doe (tanpa @)'
                className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                disabled={loading}
              />
              <p className='text-xs text-gray-500 mt-1'>Opsional - Username Instagram tanpa simbol @</p>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Nomor WhatsApp
              </label>
              <input
                type='text'
                value={formData.phone_number || ''}
                onChange={(e) => handleInputChange('phone_number', e.target.value)}
                placeholder='Contoh: 081234567890'
                className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                disabled={loading}
              />
              <p className='text-xs text-gray-500 mt-1'>Opsional - Nomor WhatsApp aktif</p>
            </div>

            <div>
              <ProvinceDistrictSelect
                selectedProvinceId={formData.provinsi_id}
                selectedDistrictId={formData.kabupaten_id}
                onProvinceChange={(provinceId) => handleInputChange('provinsi_id', provinceId)}
                onDistrictChange={(districtId) => handleInputChange('kabupaten_id', districtId)}
                disabled={loading}
              />
              <p className='text-xs text-gray-500 mt-2'>Opsional - Pilih provinsi dan kabupaten/kota asal tamu</p>
            </div>

            <div className='flex space-x-4 pt-4'>
              <button
                type='button'
                onClick={() => router.push('/dashboard/tamu')}
                className='flex-1 px-4 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2'
                disabled={loading}
              >
                <FiArrowLeft className='w-4 h-4' />
                <span>Kembali</span>
              </button>
              <button
                type='submit'
                className='flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed'
                disabled={loading || !formData.name.trim()}
              >
                {loading ? (
                  <>
                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <FiSave className='w-4 h-4' />
                    <span>Simpan Tamu</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}